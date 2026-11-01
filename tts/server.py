"""Narration server for React Tutor. Started by the app (src-tauri/src/sys.rs) inside a uv venv.

POST /tts {"text": "...", "voice": "Bruno"} -> {"path": "<wav>", "duration": seconds}
POST /stt <wav bytes>                       -> {"text": "..."}  (faster-whisper, warmed up after start)
GET  /audio?path=<wav>                      -> the wav bytes (only files inside the cache dir)
GET  /health                                -> {"model", "device", "voices"}
Generated audio is cached on disk by hash(model, voice, text), so each sentence is synthesized once.
"""
import argparse
import hashlib
import json
import os
import sys
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

import soundfile as sf

p = argparse.ArgumentParser()
p.add_argument("--model", required=True)
p.add_argument("--device", default="cpu")  # "cuda" or "cpu"
p.add_argument("--port", type=int, default=0)
p.add_argument("--cache", required=True)
p.add_argument("--parent", type=int, default=0)  # the app's PID; we exit when it does
args = p.parse_args()
os.makedirs(args.cache, exist_ok=True)

from kittenml import KittenTTS  # noqa: E402  (slow import; after arg parsing so --help is fast)

model = KittenTTS(args.model)
device = args.device
legacy = hasattr(model, "model") and hasattr(model.model, "session")  # 0.8 ONNX models
if legacy:
    # ONNX (0.8) models: the constructor builds a CPU session; rebuild it with CUDA first when asked
    import onnxruntime as ort

    if device == "cuda" and "CUDAExecutionProvider" in ort.get_available_providers():
        if hasattr(ort, "preload_dlls"):
            ort.preload_dlls()
        model.model.session = ort.InferenceSession(model.model.model_path, providers=["CUDAExecutionProvider", "CPUExecutionProvider"])
    device = "cuda" if "CUDAExecutionProvider" in model.model.session.get_providers() else "cpu"
else:
    try:
        import torch

        device = "cuda" if torch.cuda.is_available() else "cpu"
    except ImportError:
        device = "cpu"

rate = getattr(model, "sample_rate", 24000)
voices = list(getattr(model, "available_voices", []) or ["Bella", "Jasper", "Luna", "Bruno", "Rosie", "Hugo", "Kiki", "Leo"])
lock = threading.Lock()  # one synthesis at a time; the GPU model isn't re-entrant


# The 0.8 voices talk at very different paces (Bella takes ~1.7x as long as Hugo), so each one is measured once and
# sped up to about 160 words a minute, close to Kitten 2. Kitten 2 has no speed control and needs none.
PACE_TEXT = "A variable is like a labelled box. You put a value inside, and later you can look at it or change it."
PACE_SECONDS = 21 * 60 / 160
speeds: dict = {}


def synth(text: str, voice: str) -> dict:
    if legacy and voice not in speeds:
        with lock:
            if voice not in speeds:
                took = len(model.generate(PACE_TEXT, voice=voice, clean_text=True)) / rate
                speeds[voice] = round(max(1.0, took / PACE_SECONDS), 2)
    speed = speeds.get(voice, 1.0)
    tag = f"|{speed}" if speed != 1.0 else ""  # unchanged keys for voices that need no speed-up
    key = hashlib.sha256(f"{args.model}|{voice}{tag}|{text}".encode()).hexdigest()[:32]
    path = os.path.join(args.cache, f"{key}.wav")
    if not os.path.exists(path):
        with lock:
            if not os.path.exists(path):
                if legacy:
                    audio = model.generate(text, voice=voice, speed=speed, clean_text=True)
                else:  # Kitten 2 has no clean_text flag (it normalizes by default)
                    audio = model.generate(text, voice=voice)
                tmp = path + ".tmp.wav"
                sf.write(tmp, audio, rate)
                os.replace(tmp, path)
    info = sf.info(path)
    return {"path": path, "duration": info.frames / info.samplerate}


stt = None
stt_lock = threading.Lock()


def transcribe(wav: bytes) -> str:
    """Whisper via faster-whisper (CTranslate2): several times faster than the transformers pipeline, no torch needed."""
    global stt
    import io

    import numpy as np
    from faster_whisper import WhisperModel

    with stt_lock:
        if stt is None:
            if device == "cuda":
                try:
                    stt = WhisperModel("small.en", device="cuda", compute_type="float16")
                except Exception as e:  # CUDA libraries missing: CPU still works
                    print(f"speech-to-text on GPU failed, using CPU: {e}", flush=True)
            if stt is None:
                stt = WhisperModel("base.en", device="cpu", compute_type="int8")
        audio, sr = sf.read(io.BytesIO(wav), dtype="float32")
        if audio.ndim > 1:
            audio = audio.mean(axis=1)
        if sr != 16000:
            import librosa

            audio = librosa.resample(audio, orig_sr=sr, target_sr=16000)
        if len(audio) < 1600 or float(np.abs(audio).max()) < 1e-3:
            return ""
        segments, _ = stt.transcribe(audio, language="en", beam_size=1, vad_filter=True)
        return " ".join(t for t in (s.text.strip() for s in segments) if t.strip(" .")).strip()  # drop "." filler segments


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def send(self, code, body: bytes, ctype="application/json"):
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "content-type")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send(204, b"")

    def do_GET(self):
        u = urlparse(self.path)
        if u.path == "/health":
            return self.send(200, json.dumps({"model": args.model, "device": device, "voices": voices}).encode())
        if u.path == "/audio":
            f = os.path.realpath(parse_qs(u.query).get("path", [""])[0])
            if not f.startswith(os.path.realpath(args.cache) + os.sep) or not os.path.isfile(f):
                return self.send(404, b"{}")
            with open(f, "rb") as fh:
                return self.send(200, fh.read(), "audio/wav")
        self.send(404, b"{}")

    def do_POST(self):
        route = urlparse(self.path).path
        if route == "/stt":
            try:
                body = self.rfile.read(int(self.headers.get("Content-Length", 0)))
                return self.send(200, json.dumps({"text": transcribe(body)}).encode())
            except Exception as e:
                return self.send(500, json.dumps({"error": str(e)}).encode())
        if route != "/tts":
            return self.send(404, b"{}")
        try:
            req = json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))))
            text = str(req.get("text", "")).strip()[:4000]
            voice = req.get("voice") or voices[0]
            if voice not in voices:
                voice = voices[0]
            if not text:
                return self.send(400, b'{"error":"empty text"}')
            self.send(200, json.dumps(synth(text, voice)).encode())
        except Exception as e:  # report to the app instead of dropping the connection
            self.send(500, json.dumps({"error": str(e)}).encode())


def warm_stt():
    import io

    buf = io.BytesIO()
    sf.write(buf, [0.0] * 1600, 16000, format="WAV")
    try:
        transcribe(buf.getvalue())  # loads Whisper now so the first mic use is quick
    except Exception as e:
        print(f"speech-to-text warmup failed: {e}", flush=True)


srv = ThreadingHTTPServer(("127.0.0.1", args.port), Handler)  # loopback only
print(f"READY {srv.server_address[1]}", flush=True)
threading.Thread(target=warm_stt, daemon=True).start()


def exit_with_app():
    if os.name == "nt" and args.parent:
        # Windows: wait on the app's process handle. A thread blocked reading stdin makes every DLL loaded later
        # (scipy's BLAS during the Whisper warmup) hang in its runtime startup, which froze the whole server.
        import ctypes

        k32 = ctypes.windll.kernel32
        h = k32.OpenProcess(0x00100000, False, args.parent)  # SYNCHRONIZE
        if not h:
            return
        k32.WaitForSingleObject(h, 0xFFFFFFFF)
    else:
        sys.stdin.read()  # the app holds our stdin open; EOF means it closed or crashed
    os._exit(0)


threading.Thread(target=exit_with_app, daemon=True).start()
srv.serve_forever()
