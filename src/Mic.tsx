// Speech to text: records the microphone as 16 kHz WAV and sends it to the local Whisper endpoint of the narration engine.
// Falls back to the webview's own SpeechRecognition when the engine isn't running.
import { useRef, useState } from "react";
import { Loader2, Mic as MicIcon, Square } from "lucide-react";
import { narration } from "./narration";
import { errText } from "./store";
import { Button, cn } from "./ui";

function wav(chunks: Float32Array[], rate: number): Blob {
  const n = chunks.reduce((a, c) => a + c.length, 0);
  const buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
  const str = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, "RIFF"); v.setUint32(4, 36 + n * 2, true); str(8, "WAVE"); str(12, "fmt ");
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, rate, true);
  v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); str(36, "data"); v.setUint32(40, n * 2, true);
  let o = 44;
  for (const c of chunks) for (const x of c) { v.setInt16(o, Math.max(-1, Math.min(1, x)) * 0x7fff, true); o += 2; }
  return new Blob([buf], { type: "audio/wav" });
}

const nativeSR = () => (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;

export default function Mic({ onText, className }: { onText: (t: string) => void; className?: string }) {
  const nar = narration.use();
  const [state, setState] = useState<"idle" | "rec" | "busy">("idle");
  const [err, setErr] = useState("");
  const stop = useRef<() => void>(() => {});
  const whisper = nar.status === "ready" && !!nar.port;
  const available = whisper || !!nativeSR();

  const start = async () => {
    setErr("");
    if (!whisper) {
      const r = new (nativeSR())();
      r.lang = "en-US";
      r.interimResults = false;
      r.onresult = (e: any) => onText([...e.results].map((x: any) => x[0].transcript).join(" "));
      r.onerror = (e: any) => setErr(`Microphone: ${e.error}`);
      r.onend = () => setState("idle");
      r.start();
      stop.current = () => r.stop();
      setState("rec");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } });
      const ctx = new AudioContext({ sampleRate: 16000 });
      const src = ctx.createMediaStreamSource(stream);
      // shortcut: ScriptProcessorNode is deprecated but needs no worklet file; switch to an AudioWorklet if it is removed
      const proc = ctx.createScriptProcessor(4096, 1, 1);
      const chunks: Float32Array[] = [];
      proc.onaudioprocess = (e) => chunks.push(new Float32Array(e.inputBuffer.getChannelData(0)));
      src.connect(proc);
      proc.connect(ctx.destination);
      setState("rec");
      stop.current = async () => {
        proc.disconnect(); src.disconnect(); stream.getTracks().forEach((t) => t.stop());
        const rate = ctx.sampleRate;
        await ctx.close();
        setState("busy");
        try {
          const r = await fetch(`http://127.0.0.1:${narration.get().port}/stt`, { method: "POST", headers: { "content-type": "audio/wav" }, body: wav(chunks, rate) });
          const j = await r.json();
          if (!r.ok) throw new Error(j.error ?? "speech recognition failed");
          if (j.text) onText(j.text);
          else setErr("I didn't catch that. Try again a little closer to the mic?");
        } catch (e) { setErr(errText(e)); }
        setState("idle");
      };
    } catch (e) {
      setErr(`Couldn't open the microphone: ${errText(e)}`);
      setState("idle");
    }
  };

  return <span className={cn("relative inline-flex", className)}>
    <Button size="icon" variant={state === "rec" ? "danger" : "ghost"} disabled={!available || state === "busy"}
      aria-label={state === "rec" ? "Stop recording" : "Speak instead of typing"}
      title={available ? (state === "rec" ? "Click to stop. Your words go into the box so you can check them before sending" : "Talk instead of typing") : "Set up the voice engine in Settings → Voice to use the microphone"}
      onClick={() => (state === "rec" ? stop.current() : start())}>
      {state === "busy" ? <Loader2 size={15} className="animate-spin" /> : state === "rec" ? <Square size={13} /> : <MicIcon size={15} />}
    </Button>
    {err && <span role="status" className="absolute bottom-full right-0 mb-1 w-56 rounded-md bg-surface-2 p-1.5 text-[11px] text-muted shadow">{err}</span>}
  </span>;
}
