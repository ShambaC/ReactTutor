// Lesson narration with Kitten TTS (a local Python server the Rust core starts), falling back to the system's speech voices.
// GPU (NVIDIA, 6 GB+): Kitten TTS 2. CPU: Kitten mini 0.8, or nano 0.8 int8 on small machines.
import { hwInfo, inTauri, tts, type HwInfo } from "./ai/rust";
import { errText, persisted, prefs } from "./store";

export interface EngineChoice { id: "gpu" | "cpu-mini" | "cpu-nano"; mode: "gpu" | "cpu"; model: string; device: "cuda" | "cpu"; label: string; size: string }
export const ENGINES: Record<EngineChoice["id"], EngineChoice> = {
  gpu: { id: "gpu", mode: "gpu", model: "KittenML/kitten-tts-2", device: "cuda", label: "Kitten TTS 2 on your NVIDIA GPU", size: "about 5 GB download (PyTorch with CUDA + model)" },
  "cpu-mini": { id: "cpu-mini", mode: "cpu", model: "KittenML/kitten-tts-mini-0.8", device: "cpu", label: "Kitten TTS mini 0.8 on your CPU", size: "about 1 GB download" },
  "cpu-nano": { id: "cpu-nano", mode: "cpu", model: "KittenML/kitten-tts-nano-0.8-int8", device: "cpu", label: "Kitten TTS nano 0.8 (int8) on your CPU", size: "about 1 GB download" },
};

export function recommend(hw: HwInfo | null): EngineChoice {
  if (!hw) return ENGINES["cpu-mini"];
  const nvidia = hw.gpus.filter((g) => g.vendor === "nvidia").sort((a, b) => b.vram_bytes - a.vram_bytes)[0];
  if (nvidia && nvidia.vram_bytes >= 6 * 2 ** 30) return ENGINES.gpu;
  if (hw.ram_bytes >= 8 * 2 ** 30 && hw.cpus >= 4) return ENGINES["cpu-mini"];
  return ENGINES["cpu-nano"];
}

export interface NarrationState {
  status: "checking" | "needs-setup" | "installing" | "starting" | "ready" | "browser" | "off" | "error";
  engine?: EngineChoice;
  hw?: HwInfo;
  port?: number;
  voices: string[];
  device?: string;
  log: string[];
  error?: string;
  uv?: boolean;
}
export const narration = persisted<NarrationState>(null, { status: "checking", voices: [], log: [] });
const set = (p: Partial<NarrationState>) => narration.set((s) => ({ ...s, ...p }));

export function currentChoice(hw?: HwInfo): EngineChoice | null {
  const e = prefs.get().engine;
  if (e === "browser" || e === "off") return null;
  return e === "auto" ? recommend(hw ?? null) : ENGINES[e];
}

/** Called at startup and when settings change: starts an installed engine, otherwise reports what is needed. */
export async function initNarration(): Promise<void> {
  cache.clear();
  if (!inTauri()) return set({ status: "browser" });
  const e = prefs.get().engine;
  if (e === "off") return set({ status: "off" });
  if (e === "browser") return set({ status: "browser" });
  set({ status: "checking", error: undefined });
  try {
    const hw = await hwInfo();
    const choice = currentChoice(hw)!;
    const st = await tts.status();
    set({ hw, engine: choice, uv: st.uv });
    if (!st.installed.includes(choice.mode)) return set({ status: "needs-setup" });
    await start(choice);
  } catch (x) {
    set({ status: "error", error: errText(x) });
  }
}

async function start(choice: EngineChoice) {
  set({ status: "starting", error: undefined });
  await tts.stop().catch(() => {});
  const port = await tts.start(choice.mode, choice.model, choice.device);
  const h = await fetch(`http://127.0.0.1:${port}/health`).then((r) => r.json());
  set({ status: "ready", port, voices: h.voices, device: h.device });
}

/** Installs the Python engine with uv (streams the log), then starts it. */
export async function setupNarration(): Promise<void> {
  const choice = narration.get().engine ?? currentChoice()!;
  set({ status: "installing", log: [], error: undefined });
  try {
    if (!(await tts.status()).uv) {
      set({ log: ["Installing uv (a small Python manager)..."] });
      await tts.installUv();
    }
    await tts.setup(choice.mode, (l) => narration.set((s) => ({ ...s, log: [...s.log.slice(-200), l] })));
    await start(choice);
  } catch (x) {
    set({ status: "error", error: errText(x) });
  }
}

// ---------- synthesis ----------
export interface Clip { url: string; duration: number }
const cache = new Map<string, Promise<Clip>>();

/** Kitten audio for `text` (cached on disk by the server and in memory here). Null when Kitten isn't running. */
export function synth(text: string): Promise<Clip> | null {
  const { status, port } = narration.get();
  if (status !== "ready" || !port) return null;
  const voice = prefs.get().voice;
  const key = `${port}|${voice}|${text}`;
  let p = cache.get(key);
  if (!p) {
    p = fetch(`http://127.0.0.1:${port}/tts`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: speakable(text), voice }) })
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error ?? `narration failed (${r.status})`);
        return { url: `http://127.0.0.1:${port}/audio?path=${encodeURIComponent(j.path)}`, duration: j.duration };
      });
    p.catch(() => cache.delete(key));
    cache.set(key, p);
  }
  return p;
}

/** Code-ish text reads badly aloud; turn the common symbols into words. */
export function speakable(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/=>/g, " arrow ")
    .replace(/===/g, " triple equals ")
    .replace(/!==/g, " not equal ")
    .replace(/\{\}/g, " curly braces ")
    .replace(/</g, " ")
    .replace(/>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ---------- browser speech fallback ----------
export function browserSpeak(text: string, rate: number): void {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(speakable(text));
  u.rate = rate;
  const v = speechSynthesis.getVoices().find((x) => /en[-_]/i.test(x.lang) && /natural|online|aria|jenny|zira/i.test(x.name)) ?? speechSynthesis.getVoices().find((x) => /en[-_]/i.test(x.lang));
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}
export const browserStop = () => { if ("speechSynthesis" in window) speechSynthesis.cancel(); };
