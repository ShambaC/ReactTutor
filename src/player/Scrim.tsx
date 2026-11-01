// Scrimba-style lesson: narration + the instructor's code typing itself into a real editor + a live preview.
// Pause any time and the editor is yours; your version is kept separately and pressing play returns to the lesson.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Captions, CheckCircle2, ChevronRight, Lightbulb, Loader2, MessageCircleQuestion, Pause, Play, Play as RunIcon, RotateCcw, Sparkles, Undo2, UserPen, Wand2 } from "lucide-react";
import { selectedModel } from "../ai";
import { adaptLesson } from "../ai/generate";
import { aiCheck } from "../ai/tutor";
import Mic from "../Mic";
import type { Files, ScrimLesson } from "../course/types";
import Markdown from "../Markdown";
import { browserSpeak, browserStop, narration, synth } from "../narration";
import { errText, markDone, prefs, progress } from "../store";
import { Badge, Button, Input, Select, cn } from "../ui";
import Editor from "./Editor";
import Preview, { type PreviewHandle, type TestResult } from "./Preview";
import { buildTimeline, estimateSeconds, frameAt, segmentAt } from "./timeline";

const PAD = 0.35; // breath between narration clips
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export interface LessonApi {
  ask(q: string): void;
  setContext(c: { step?: string; task?: string; files?: Files; errors?: string[] }): void;
  next?: () => void;
  /** Kit writes a new practice exercise on this lesson and opens it. */
  morePractice?: () => Promise<void>;
}

export function MoreButton({ api, label = "Practice this" }: { api: LessonApi; label?: string }) {
  const [busy, setBusy] = useState(false), [err, setErr] = useState("");
  if (!api.morePractice) return null;
  return <span className="inline-flex items-center gap-2">
    <Button size="sm" disabled={busy || !selectedModel()} title={selectedModel() ? "Kit writes a new exercise on this lesson for you" : "Pick an AI model in Settings to get extra practice"}
      onClick={async () => { setBusy(true); setErr(""); try { await api.morePractice!(); } catch (e) { setErr(errText(e)); } setBusy(false); }}>
      {busy ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}{busy ? "Writing an exercise…" : label}</Button>
    {err && <span className="text-[11px] text-warning" title={err}>Couldn't make it this time. Try again?</span>}
  </span>;
}

export default function Scrim({ lesson: original, api, onChange }: { lesson: ScrimLesson; api: LessonApi; onChange?: (l: ScrimLesson) => void }) {
  const p = prefs.use();
  const nar = narration.use();
  const kitten = nar.status === "ready";
  const [lesson, setLesson] = useState(original); // grows when the student asks the AI to adapt it
  const [known, setKnown] = useState<Record<string, number>>({}); // narration length by sentence
  const durations = useMemo(() => lesson.steps.map((s) => known[s.say] ?? estimateSeconds(s.say)), [lesson, known]);
  const tl = useMemo(() => buildTimeline(lesson, durations), [lesson, durations]);
  const [adaptOpen, setAdaptOpen] = useState(false);
  const [adaptText, setAdaptText] = useState("");
  const [adapting, setAdapting] = useState("");
  const [aiNote, setAiNote] = useState<{ ok: boolean; text: string } | null>(null);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [mine, setMine] = useState<Files | null>(null); // student's take-over copy while paused
  const [tab, setTab] = useState<string | null>(null);
  const [challengeAt, setChallengeAt] = useState<number | null>(null);
  const [hints, setHints] = useState(0);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [checking, setChecking] = useState(false);
  const [finished, setFinished] = useState(false);
  const preview = useRef<PreviewHandle>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const live = useRef({ t: 0, tl, playing: false, step: -1, durations, lastRunKey: "", buffering: false });
  live.current.tl = tl;
  live.current.durations = durations;

  const frame = frameAt(tl, t, lesson.files);
  const seg = tl.segments[frame.index];
  const editing = !playing && mine != null;
  const files = editing ? mine! : frame.files;
  const open = (editing ? tab : null) ?? (playing ? frame.open : tab ?? frame.open);
  const challenge = challengeAt != null ? tl.segments[challengeAt]?.step.challenge : undefined;

  // ---- narration clips ----
  const want = useCallback((i: number) => {
    const s = lesson.steps[i];
    const clip = s && synth(s.say);
    clip?.then((c) => {
      const d = c.duration + PAD;
      const L = live.current, j = L.tl.segments.findIndex((x) => x.step.say === s.say);
      // keep the playhead on the same spot when an earlier step's length changes
      if (j >= 0 && j < segmentAt(L.tl, L.t)) { L.t += d - L.tl.segments[j].dur; setT(L.t); }
      setKnown((k) => (k[s.say] === d ? k : { ...k, [s.say]: d }));
    }).catch(() => {});
    return clip;
  }, [lesson, kitten, p.voice]);

  useEffect(() => {
    // narrate the whole lesson in the background, one clip at a time, so later steps never wait (GPU Kitten 2 runs ~1x realtime)
    let stop = false;
    (async () => { for (let i = 0; i < lesson.steps.length && !stop; i++) await want(i)?.catch(() => {}); })();
    return () => { stop = true; };
  }, [want]);

  // ---- preview runs when the instructor finishes typing a step ----
  const runPreview = useCallback((f: Files, path?: string) => preview.current?.run(f, path), []);
  useEffect(() => {
    if (editing) return;
    const key = `${frame.index}|${frame.typing}`;
    if (frame.typing || live.current.lastRunKey === key) return;
    const changed = seg?.edits.length || frame.index === 0 || !live.current.lastRunKey;
    live.current.lastRunKey = key;
    if (changed) runPreview(frame.files, seg?.step.path ?? lastPath(frame.index));
  }, [frame.index, frame.typing, editing]);
  const lastPath = (i: number) => { for (let j = i; j >= 0; j--) if (tl.segments[j].step.path) return tl.segments[j].step.path; return "/"; };

  // ---- playback loop ----
  const startStep = useCallback(async (i: number) => {
    const L = live.current;
    L.step = i;
    for (let j = i + 1; j <= i + 3; j++) want(j);
    const s = L.tl.segments[i];
    const into = L.t - s.start;
    const el = audio.current!;
    el.pause();
    browserStop();
    const clip = want(i);
    if (clip) {
      L.buffering = true;
      setBuffering(true);
      const c = await clip.catch(() => null);
      L.buffering = false;
      setBuffering(false);
      if (!L.playing || L.step !== i) return;
      if (c) {
        el.src = c.url;
        el.playbackRate = prefs.get().rate;
        el.currentTime = Math.max(0, into);
        await el.play().catch(() => {});
      }
    } else if (prefs.get().engine !== "off" && into < 0.5) {
      browserSpeak(s.step.say, prefs.get().rate);
    }
  }, [want]);

  useEffect(() => {
    if (!playing) return;
    const L = live.current;
    L.playing = true;
    let raf = 0, last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const i = segmentAt(L.tl, L.t);
      if (i !== L.step) startStep(i);
      const s = L.tl.segments[i];
      const el = audio.current!;
      if (!L.buffering) {
        if (el.src && !el.paused && !el.ended && L.step === i) L.t = Math.max(L.t, s.start + el.currentTime);
        else L.t += dt * prefs.get().rate;
      }
      const end = s.start + s.dur;
      if (L.t >= end && (s.step.challenge || i === L.tl.segments.length - 1)) {
        L.t = end - 0.001;
        setT(L.t);
        setPlaying(false);
        if (s.step.challenge) { setChallengeAt(i); setHints(0); setResults(null); }
        else { setFinished(true); markDone(lesson.id); }
        return;
      }
      setT(L.t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); L.playing = false; L.step = -1; audio.current?.pause(); browserStop(); };
  }, [playing, startStep]);

  const play = () => {
    if (mine) { progress.set((pr) => ({ ...pr, code: { ...pr.code, [lesson.id]: mine } })); setMine(null); }
    const L = live.current, s = tl.segments[segmentAt(tl, L.t)];
    if (finished || L.t >= tl.total - 0.01) { L.t = 0; setT(0); setFinished(false); }
    else if (s?.step.challenge && L.t >= s.start + s.dur - 0.01) L.t = s.start + s.dur + 0.0001; // continue past the challenge
    live.current.lastRunKey = "";
    setChallengeAt(null);
    setTab(null);
    setPlaying(true);
  };
  const pause = () => setPlaying(false);
  const seek = (to: number) => {
    live.current.t = Math.max(0, Math.min(tl.total - 0.001, to));
    live.current.step = -1;
    live.current.lastRunKey = "";
    setT(live.current.t);
    setChallengeAt(null);
    if (mine && !playing) { progress.set((pr) => ({ ...pr, code: { ...pr.code, [lesson.id]: mine } })); setMine(null); }
  };

  // keyboard: space toggles play when focus isn't in the editor or a field
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.code !== "Space" || el.closest(".cm-editor") || /INPUT|TEXTAREA|SELECT|BUTTON/.test(el.tagName)) return;
      e.preventDefault();
      playing ? pause() : play();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  // ---- student edits ----
  const edit = (v: string) => {
    if (playing) return;
    const base = mine ?? frame.files;
    setMine({ ...base, [open]: v });
    if (!tab) setTab(open);
  };
  const runMine = () => runPreview(files, lastPath(frame.index));
  useEffect(() => { // auto-run the student's code shortly after they stop typing
    if (!editing) return;
    const h = setTimeout(runMine, 900);
    return () => clearTimeout(h);
  }, [mine]);
  const saved = progress.use().code[lesson.id];

  // tutor context
  useEffect(() => {
    api.setContext({ step: seg?.step.say, task: challenge?.task, files, errors: preview.current?.entries().filter((e) => e.level !== "log").map((e) => e.text) });
  });

  const check = async () => {
    if (!challenge?.tests?.length) return;
    setChecking(true);
    await preview.current!.run(files, lastPath(frame.index));
    await new Promise((r) => setTimeout(r, 300));
    setResults(await preview.current!.test(challenge.tests));
    setChecking(false);
  };
  const allOk = results?.length && results.every((r) => r.ok);
  const checkAi = async () => {
    if (!challenge || challengeAt == null) return;
    setChecking(true);
    const start = tl.segments[challengeAt].after;
    try { const r = await aiCheck(challenge.task, start, { ...start, ...tl.segments[challengeAt + 1]?.step.files }, files); setAiNote({ ok: r.correct, text: r.explanation }); }
    catch (e) { setAiNote({ ok: false, text: errText(e) }); }
    setChecking(false);
  };

  // ---- the student reshapes the lesson ("explain again", "use cats", "let me build a game") ----
  const adapt = async (request: string) => {
    if (!request.trim()) return;
    setPlaying(false);
    setAdapting(request);
    try {
      const i = frame.index, base = tl.segments[i].after;
      const added = await adaptLesson(lesson, i, base, request);
      if (i < lesson.steps.length - 1) added.push({ say: "Okay! Let's pick up the lesson right where we left off.", files: base });
      const next = { ...lesson, steps: [...lesson.steps.slice(0, i + 1), ...added, ...lesson.steps.slice(i + 1)] };
      setLesson(next);
      onChange?.(next);
      const resume = tl.segments[i].start + tl.segments[i].dur + 0.0001;
      live.current.t = resume; live.current.step = -1; live.current.lastRunKey = "";
      setT(resume); setChallengeAt(null); setMine(null); setAdaptOpen(false); setAdaptText(""); setFinished(false);
      setPlaying(true);
    } catch (e) {
      setAiNote({ ok: false, text: `I couldn't change the lesson just now (${errText(e)}). You can keep going, or ask Kit in the chat.` });
    }
    setAdapting("");
  };

  const names = Object.keys(files);
  return <div className="flex h-full min-h-0 flex-col">
    <audio ref={audio} preload="auto" />
    <div className="grid min-h-0 flex-1 grid-cols-2">
      {/* editor */}
      <div className="flex min-h-0 flex-col border-r border-border">
        <div className="flex items-center gap-0.5 overflow-x-auto border-b border-border bg-surface px-1">
          {names.map((n) => <button key={n} onClick={() => setTab(n)} className={cn("whitespace-nowrap border-b-2 px-3 py-2 font-mono text-xs cursor-pointer", n === open ? "border-accent text-fg" : "border-transparent text-muted hover:text-fg")}>{n}</button>)}
          <div className="ml-auto flex items-center gap-1 pr-1">
            {editing && <Badge tone="accent"><UserPen size={11} />Your code</Badge>}
            {!playing && !mine && saved && <Button size="sm" variant="ghost" onClick={() => { setMine(saved); }} title="Load the code you wrote earlier in this lesson"><UserPen size={12} />My code</Button>}
            {editing && <Button size="sm" variant="ghost" onClick={() => { setMine(null); setTab(null); live.current.lastRunKey = ""; }} title="Show the lesson's code at this point again"><Undo2 size={12} />Lesson code</Button>}
            <Button size="sm" onClick={editing ? runMine : () => runPreview(files, lastPath(frame.index))}><RunIcon size={12} />Run</Button>
          </div>
        </div>
        <div className="relative min-h-0 flex-1">
          <Editor file={open} value={files[open] ?? ""} readOnly={playing} onChange={edit} onRun={runMine}
            highlight={editing ? undefined : frame.highlight} caret={playing && open === frame.open ? frame.caret : undefined} fontSize={p.fontSize} dark={p.theme === "dark"} />
          {!playing && !editing && !challenge && t > 0 && !finished && <div className="pointer-events-none absolute right-3 top-3 rounded-md bg-surface/90 px-2 py-1 text-[11px] text-muted shadow">Paused. Try typing: the editor is yours!</div>}
          {p.captions && seg && (playing || buffering) && <div className="pointer-events-none absolute inset-x-6 bottom-4 flex justify-center">
            <div className="max-w-2xl rounded-lg bg-black/80 px-3 py-1.5 text-center text-sm text-white">{seg.step.say}</div></div>}
        </div>
      </div>
      {/* preview / challenge */}
      <div className="flex min-h-0 flex-col">
        {challenge && <div className="max-h-[55%] shrink-0 overflow-y-auto border-b border-border bg-accent/5 p-3">
          <div className="mb-1 flex items-center gap-2 text-sm font-semibold"><span className="rounded bg-violet-500/20 px-1.5 py-0.5 text-xs text-violet-400">Your turn</span>Challenge</div>
          <Markdown text={challenge.task} className="text-sm" />
          <div className="mt-2 space-y-1">{challenge.hints?.slice(0, hints).map((h, i) => <div key={i} className="flex gap-1.5 text-xs text-muted"><Lightbulb size={12} className="mt-0.5 shrink-0 text-warning" /><Markdown text={h} /></div>)}</div>
          {results && <div className="mt-2 space-y-0.5 text-xs">{results.map((r, i) => <div key={i} className={r.ok ? "text-success" : "text-warning"}>{r.ok ? "✓" : "○"} {r.name}{!r.ok && r.error ? ` (${r.error})` : ""}</div>)}
            <div className="mt-1 text-sm">{allOk ? "Brilliant! You did it. 🎉 Press play to see how I did it too." : "Not quite yet, and that's okay. You're close! Look at the items with a circle."}</div></div>}
          <div className="mt-2 flex flex-wrap gap-2">
            {challenge.tests?.length ? <Button size="sm" variant="primary" onClick={check} disabled={checking}>{checking ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}Check my code</Button>
              : <Button size="sm" variant="primary" onClick={checkAi} disabled={checking || !selectedModel()}>{checking ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}Ask Kit to check</Button>}
            {hints < (challenge.hints?.length ?? 0) && <Button size="sm" onClick={() => setHints(hints + 1)}><Lightbulb size={12} />Hint</Button>}
            <Button size="sm" onClick={() => api.ask(`I'm working on this challenge and could use a little help:\n\n${challenge.task}`)}><MessageCircleQuestion size={12} />Ask Kit</Button>
            <Button size="sm" variant="ghost" onClick={play}>Watch the solution <ChevronRight size={12} /></Button>
          </div>
        </div>}
        {aiNote && <div className={cn("shrink-0 border-b border-border p-3 text-sm", aiNote.ok ? "bg-success/10" : "bg-accent/5")}>
          <div className="mb-1 flex items-center justify-between text-xs font-medium"><span className="flex items-center gap-1"><Sparkles size={12} />Kit</span><button className="text-muted" onClick={() => setAiNote(null)}>close</button></div>
          <Markdown untrusted text={aiNote.text} /></div>}
        <div className="min-h-0 flex-1"><Preview ref={preview} onAsk={api.ask} /></div>
      </div>
    </div>
    {(adaptOpen || adapting) && <form className="flex items-center gap-2 border-t border-border bg-accent/5 px-3 py-2" onSubmit={(e) => { e.preventDefault(); adapt(adaptText); }}>
      <Wand2 size={15} className="shrink-0 text-accent" />
      {adapting ? <span className="flex items-center gap-2 text-sm text-muted"><Loader2 size={14} className="animate-spin" />Changing the lesson for you: “{adapting}”</span> : <>
        <Input autoFocus className="h-8 flex-1" placeholder="What would help? e.g. “explain that again more slowly”, “show it with a pet shop”, “let me build a quiz game”" value={adaptText} onChange={(e) => setAdaptText(e.target.value)} />
        <Mic onText={(t) => { setAdaptText(t); adapt(t); }} />
        <Button size="sm" type="submit" variant="primary" disabled={!adaptText.trim()}>Go</Button>
        <div className="hidden gap-1 xl:flex">{["Explain that again, slower", "Show me another example", "Go deeper", "Let me practice this"].map((q) => <Button key={q} size="sm" variant="ghost" onClick={() => adapt(q)}>{q}</Button>)}</div>
        <Button size="sm" variant="ghost" onClick={() => setAdaptOpen(false)}>Cancel</Button></>}
    </form>}
    {/* player bar */}
    <div className="flex items-center gap-3 border-t border-border bg-surface px-3 py-2">
      <Button variant="primary" size="icon" aria-label={playing ? "Pause" : "Play"} onClick={playing ? pause : play}>
        {buffering ? <Loader2 size={16} className="animate-spin" /> : playing ? <Pause size={16} /> : <Play size={16} />}</Button>
      <span className="w-24 font-mono text-xs text-muted">{fmt(t)} / {fmt(tl.total)}</span>
      <div className="relative h-6 flex-1 cursor-pointer" role="slider" aria-label="Lesson timeline" aria-valuemin={0} aria-valuemax={Math.round(tl.total)} aria-valuenow={Math.round(t)} tabIndex={0}
        onKeyDown={(e) => { if (e.key === "ArrowRight") seek(t + 5); if (e.key === "ArrowLeft") seek(t - 5); }}
        onMouseDown={(e) => { const r = e.currentTarget.getBoundingClientRect(); seek(((e.clientX - r.left) / r.width) * tl.total); }}>
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-border" />
        <div className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-accent" style={{ width: `${(t / tl.total) * 100}%` }} />
        {tl.segments.map((s, i) => s.step.challenge && <div key={i} title="Challenge" className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-violet-500" style={{ left: `${((s.start + s.dur) / tl.total) * 100}%` }} />)}
        {saved && <div title="You edited code in this lesson" className="absolute top-0 h-1.5 w-1.5 rounded-full bg-yellow-400" style={{ left: 0 }} />}
      </div>
      <Select aria-label="Speed" className="h-8 w-20! text-xs" value={p.rate} onChange={(e) => { prefs.set((x) => ({ ...x, rate: Number(e.target.value) })); if (audio.current) audio.current.playbackRate = Number(e.target.value); }}>
        {[0.75, 1, 1.25, 1.5, 2].map((r) => <option key={r} value={r}>{r}x</option>)}</Select>
      <Button size="icon" variant={p.captions ? "outline" : "ghost"} aria-label="Captions" onClick={() => prefs.set((x) => ({ ...x, captions: !x.captions }))}><Captions size={15} /></Button>
      <Button size="icon" variant="ghost" aria-label="Restart" onClick={() => seek(0)}><RotateCcw size={15} /></Button>
      <Button size="sm" variant={adaptOpen ? "outline" : "ghost"} disabled={!selectedModel()} title={selectedModel() ? "Ask the AI to change what comes next in this lesson" : "Pick an AI model in Settings to change lessons"} onClick={() => { setPlaying(false); setAdaptOpen(!adaptOpen); }}><Wand2 size={14} />Change this lesson</Button>
      {!kitten && nar.status !== "off" && <span className="text-[11px] text-muted" title="Set up Kitten TTS in Settings for natural narration">system voice</span>}
      {finished && api.morePractice && <MoreButton api={api} />}
      {finished && api.next && <Button variant="primary" size="sm" onClick={api.next}>Next lesson <ChevronRight size={12} /></Button>}
    </div>
  </div>;
}
