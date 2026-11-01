import { useState } from "react";
import { Brain, CheckCircle2, ChevronDown, Circle, CircleDot, Code2, Loader2, Play, Sparkles, Trash2, Volume2 } from "lucide-react";
import { selectedModel } from "./ai";
import { generateLesson, generatePractice } from "./ai/generate";
import { ALL_LESSONS, MODULES, findLesson } from "./course";
import type { Lesson, Module } from "./course/types";
import Mic from "./Mic";
import { narration } from "./narration";
import { errText, progress, type Progress } from "./store";
import { Button, Input, cn } from "./ui";

const PARTS = [
  { title: "JavaScript foundations", blurb: "Variables, functions, arrays and the page itself.", ids: ["m01", "m02", "m03", "m04", "m05", "m06", "m07", "m08"] },
  { title: "React", blurb: "Components, props, state, effects and hooks.", ids: ["m09", "m10", "m11", "m12", "m13", "m14", "m15", "m16"] },
  { title: "React Router", blurb: "Pages, links, URL parameters and data loading.", ids: ["m17", "m18", "m19"] },
  { title: "Your capstone project", blurb: "Put it all together in a real app.", ids: ["m20"] },
];
const IDEAS = ["How do websites remember things?", "Build a tiny quiz game", "What is an API?", "Make a dark mode button", "Explain arrays with pizza"];
const KIND = { scrim: "Lesson", practice: "Practice", quiz: "Quiz" } as const;

export const KindIcon = ({ l, size = 13 }: { l: Lesson; size?: number }) =>
  l.kind === "scrim" ? <Play size={size} /> : l.kind === "practice" ? <Code2 size={size} /> : <Brain size={size} />;

/** How far into a lesson the student is, 0-100 (narrated lessons resume from the saved step). */
export function lessonPct(l: Lesson, pr: Progress): number {
  if (pr.done[l.id]) return 100;
  const at = pr.pos[l.id];
  return l.kind === "scrim" && at ? Math.min(99, Math.round((at / l.steps.length) * 100)) : 0;
}

const Bar = ({ value, className }: { value: number; className?: string }) =>
  <div className={cn("h-1.5 overflow-hidden rounded-full bg-surface-2", className)}><div className="h-full rounded-full bg-accent/80 transition-[width]" style={{ width: `${value}%` }} /></div>;

function Ring({ value }: { value: number }) {
  const r = 34, c = 2 * Math.PI * r;
  return <svg viewBox="0 0 80 80" className="h-20 w-20 shrink-0 -rotate-90" aria-hidden>
    <circle cx="40" cy="40" r={r} fill="none" strokeWidth="7" className="stroke-surface-2" />
    <circle cx="40" cy="40" r={r} fill="none" strokeWidth="7" strokeLinecap="round" className="stroke-accent" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
  </svg>;
}

function LessonRow({ l, pr, open, current }: { l: Lesson; pr: Progress; open: (id: string) => void; current: boolean }) {
  const pct = lessonPct(l, pr);
  return <button onClick={() => open(l.id)} className={cn("group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-surface-2 cursor-pointer", current && "bg-accent/10")}>
    {pct === 100 ? <CheckCircle2 size={15} className="shrink-0 text-success" /> : pct > 0 ? <CircleDot size={15} className="shrink-0 text-accent" /> : <Circle size={15} className="shrink-0 text-muted/60" />}
    <span className="min-w-0 flex-1 truncate">{l.title}</span>
    {pct > 0 && pct < 100 && <span className="text-[11px] tabular-nums text-accent">{pct}%</span>}
    <span className="flex items-center gap-1 text-[11px] text-muted"><KindIcon l={l} size={11} /><span className="hidden sm:inline">{KIND[l.kind]}</span></span>
  </button>;
}

function ModuleCard({ m, n, pr, open, cont }: { m: Module; n: number; pr: Progress; open: (id: string) => void; cont?: string }) {
  const [show, setShow] = useState(m.lessons.some((l) => l.id === cont));
  const d = m.lessons.filter((l) => pr.done[l.id]).length;
  return <div className={cn("rounded-2xl bg-surface p-5 ring-1 ring-border/70 transition-shadow hover:shadow-md hover:shadow-black/5", show && "sm:col-span-full")}>
    <button className="flex w-full items-start gap-4 text-left cursor-pointer" aria-expanded={show} onClick={() => setShow(!show)}>
      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-semibold tabular-nums", d === m.lessons.length && d ? "bg-success/15 text-success" : "bg-surface-2 text-muted")}>{n}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium leading-snug">{m.title}</span>
        <span className="mt-0.5 line-clamp-2 block text-sm leading-relaxed text-muted">{m.summary}</span>
      </span>
      <ChevronDown size={16} className={cn("mt-1 shrink-0 text-muted transition-transform", show && "rotate-180")} />
    </button>
    <div className="mt-4 flex items-center gap-3 text-xs text-muted"><Bar value={m.lessons.length ? (d / m.lessons.length) * 100 : 0} className="flex-1" /><span className="tabular-nums">{d} / {m.lessons.length}</span></div>
    {show && <div className="mt-3 grid gap-x-4 border-t border-border/70 pt-3 md:grid-cols-2">{m.lessons.map((l) => <LessonRow key={l.id} l={l} pr={pr} open={open} current={l.id === cont} />)}</div>}
  </div>;
}

export default function Home({ open, openReview, openSettings }: { open: (id: string) => void; openReview: () => void; openSettings: () => void }) {
  const pr = progress.use();
  const nar = narration.use();
  const [topic, setTopic] = useState("");
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const total = ALL_LESSONS.length, done = ALL_LESSONS.filter((x) => pr.done[x.lesson.id]).length;
  const contId = (pr.last && !pr.done[pr.last] ? pr.last : undefined) ?? ALL_LESSONS.find((x) => !pr.done[x.lesson.id])?.lesson.id ?? ALL_LESSONS[0]?.lesson.id;
  const found = contId ? findLesson(contId) : undefined;
  const cont = found?.lesson ?? pr.custom.find((l) => l.id === contId);
  const contPct = cont ? lessonPct(cont, pr) : 0;
  const reviewCount = Object.keys(pr.review).length;
  const needsVoice = nar.status === "needs-setup", needsAi = !selectedModel();

  const make = async (t: string) => {
    if (!t.trim()) return;
    setBusy(t); setErr("");
    try {
      const known = MODULES.filter((m) => m.lessons.some((l) => pr.done[l.id])).map((m) => m.title);
      const l = await generateLesson(t, known);
      progress.set((p) => ({ ...p, custom: [l, ...p.custom] }));
      setTopic("");
      open(l.id);
      // every lesson gets an exercise: write its practice in the background while the student watches
      generatePractice(l).then((ex) => progress.set((p) => {
        const custom = [...p.custom];
        custom.splice(custom.findIndex((x) => x.id === l.id) + 1, 0, ex);
        return { ...p, custom };
      })).catch(() => {});
    } catch (e) { setErr(`I couldn't make that lesson just now (${errText(e)}). Try again, or try a different model in Settings. It isn't your fault!`); }
    setBusy("");
  };

  let n = 0;
  return <div className="h-full overflow-y-auto">
    <div className="mx-auto w-full max-w-[1360px] px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
      <header className="max-w-2xl">
        <h1 className="text-[1.7rem] font-semibold leading-tight tracking-tight">{done ? "Welcome back." : "Welcome. Let's learn React together."}</h1>
        <p className="mt-2 leading-relaxed text-muted">From your very first line of JavaScript to multi-page React apps. Every lesson is open, so go in order or jump to whatever you're curious about.</p>
      </header>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-10">
        <div className="min-w-0 space-y-10">
          {cont && <section className="flex flex-col gap-5 rounded-2xl bg-surface p-6 ring-1 ring-border/70 sm:flex-row sm:items-center sm:p-7">
            <img src="/logo.png" alt="" className="hidden h-16 w-16 shrink-0 rounded-2xl sm:block" />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium uppercase tracking-wider text-muted">{contPct > 0 ? "Pick up where you left off" : done ? "Up next" : "Start here"}</div>
              <h2 className="mt-1 truncate text-xl font-semibold">{cont.title}</h2>
              <div className="mt-0.5 text-sm text-muted">{found ? found.module.title : "My lessons"} · {KIND[cont.kind]}</div>
              {contPct > 0 && <div className="mt-3 flex items-center gap-3 text-xs text-muted"><Bar value={contPct} className="max-w-xs flex-1" />{contPct}% through</div>}
            </div>
            <Button variant="primary" className="h-11 px-6 text-[15px]" onClick={() => open(cont.id)}><Play size={16} />{contPct > 0 ? `Resume at ${contPct}%` : done ? "Continue" : "Start learning"}</Button>
          </section>}

          <section>
            <h2 className="text-lg font-semibold">Learn anything you're curious about</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">Describe a topic or an idea you want to build. Kit writes a narrated lesson with live code and a practice exercise, just for you.</p>
            <form className="mt-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); make(topic); }}>
              <Input className="h-11 flex-1 rounded-xl bg-surface" placeholder="e.g. “How do I make a button change color?”" value={topic} onChange={(e) => setTopic(e.target.value)} disabled={!!busy} />
              <Mic className="self-center" value={topic} onChange={setTopic} />
              <Button type="submit" variant="primary" className="h-11 rounded-xl px-4" disabled={!topic.trim() || !!busy || needsAi}>{busy ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}<span className="hidden sm:inline">Make my lesson</span></Button>
            </form>
            {busy ? <div className="mt-3 flex items-center gap-2 text-sm text-muted"><Loader2 size={14} className="animate-spin" />Writing a lesson about “{busy}”. This can take a minute.</div>
              : <div className="mt-3 flex flex-wrap gap-2">{IDEAS.map((i) => <button key={i} disabled={needsAi} onClick={() => setTopic(i)} className="rounded-full bg-surface-2/70 px-3 py-1 text-xs text-muted transition-colors hover:bg-surface-2 hover:text-fg cursor-pointer disabled:cursor-default disabled:opacity-50">{i}</button>)}</div>}
            {needsAi && <div className="mt-3 text-sm text-muted">This needs an AI model. <button className="text-accent underline-offset-2 hover:underline cursor-pointer" onClick={openSettings}>Connect one in Settings</button>.</div>}
            {err && <div className="mt-3 text-sm text-warning">{err}</div>}
          </section>

          {PARTS.map((part, pi) => {
            const mods = MODULES.filter((m) => part.ids.includes(m.id) && m.lessons.length);
            return <section key={part.title}>
              <div className="mb-4 flex items-baseline gap-3">
                <span className="text-xs font-medium uppercase tracking-wider text-accent">Part {pi + 1}</span>
                <h2 className="text-lg font-semibold">{part.title}</h2>
                <span className="hidden text-sm text-muted md:inline">{part.blurb}</span>
              </div>
              <div className="grid items-start gap-4 sm:grid-cols-2 2xl:grid-cols-3">{mods.map((m) => <ModuleCard key={m.id} m={m} n={++n} pr={pr} open={open} cont={contId} />)}</div>
            </section>;
          })}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-0">
          <div className="rounded-2xl bg-surface p-5 ring-1 ring-border/70">
            <div className="flex items-center gap-4">
              <div className="relative"><Ring value={total ? (done / total) * 100 : 0} /><span className="absolute inset-0 flex items-center justify-center text-sm font-semibold tabular-nums">{total ? Math.round((done / total) * 100) : 0}%</span></div>
              <div><div className="font-medium">Your progress</div><div className="text-sm text-muted">{done} of {total} lessons done</div></div>
            </div>
            <div className="mt-5 space-y-3">{PARTS.map((part, i) => {
              const ls = MODULES.filter((m) => part.ids.includes(m.id)).flatMap((m) => m.lessons);
              const d = ls.filter((l) => pr.done[l.id]).length;
              return <div key={part.title} className="text-xs"><div className="mb-1 flex justify-between text-muted"><span>{i + 1}. {part.title}</span><span className="tabular-nums">{d}/{ls.length}</span></div><Bar value={ls.length ? (d / ls.length) * 100 : 0} /></div>;
            })}</div>
          </div>

          {(needsVoice || needsAi) && <div className="space-y-3 rounded-2xl bg-surface p-5 ring-1 ring-border/70">
            <div className="text-sm font-medium">Finish setting up</div>
            {needsVoice && <SetupItem icon={<Volume2 size={16} />} title="Natural narration" text={`A one-time setup of Kitten TTS${nar.engine ? ` (${nar.engine.label})` : ""}. Until then lessons use your system's voice.`} onClick={openSettings} />}
            {needsAi && <SetupItem icon={<Sparkles size={16} />} title="Kit, your AI tutor" text="Connect an AI model or your ChatGPT plan to chat, get code reviews and make your own lessons." onClick={openSettings} />}
          </div>}

          {reviewCount > 0 && <button onClick={openReview} className="flex w-full items-center gap-3 rounded-2xl bg-surface p-5 text-left ring-1 ring-border/70 transition-colors hover:bg-surface-2/50 cursor-pointer">
            <Brain size={18} className="shrink-0 text-accent-2" />
            <span className="flex-1 text-sm"><span className="block font-medium">Review time</span><span className="text-muted">{reviewCount} quiz question{reviewCount > 1 ? "s" : ""} to revisit.</span></span>
          </button>}

          <div className="rounded-2xl bg-surface p-5 ring-1 ring-border/70">
            <div className="text-sm font-medium">My lessons</div>
            {pr.custom.length === 0 ? <p className="mt-1 text-sm leading-relaxed text-muted">Lessons Kit makes for you will appear here.</p>
              : <div className="mt-2 space-y-0.5">{pr.custom.map((l) => <div key={l.id} className="group flex items-center gap-1">
                <LessonRow l={l} pr={pr} open={open} current={l.id === contId} />
                <Button size="icon" variant="ghost" className="h-7 w-7 opacity-0 group-hover:opacity-100 focus-visible:opacity-100" aria-label={`Delete ${l.title}`} onClick={() => progress.set((p) => ({ ...p, custom: p.custom.filter((x) => x.id !== l.id) }))}><Trash2 size={13} /></Button>
              </div>)}</div>}
          </div>
        </aside>
      </div>
    </div>
  </div>;
}

function SetupItem({ icon, title, text, onClick }: { icon: React.ReactNode; title: string; text: string; onClick: () => void }) {
  return <button onClick={onClick} className="flex w-full gap-3 rounded-xl p-2 -m-2 text-left transition-colors hover:bg-surface-2/60 cursor-pointer">
    <span className="mt-0.5 shrink-0 text-accent">{icon}</span>
    <span className="text-sm"><span className="block font-medium">{title}</span><span className="leading-relaxed text-muted">{text}</span></span>
  </button>;
}
