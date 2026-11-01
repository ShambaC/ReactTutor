import { useState } from "react";
import { BookOpen, Brain, CheckCircle2, Circle, Code2, Loader2, Play, Sparkles, Trash2, Volume2, Wand2 } from "lucide-react";
import { selectedModel } from "./ai";
import { generateLesson, generatePractice } from "./ai/generate";
import { ALL_LESSONS, MODULES } from "./course";
import type { Lesson } from "./course/types";
import Mic from "./Mic";
import { narration } from "./narration";
import { errText, progress } from "./store";
import { Badge, Button, Card, Input, cn } from "./ui";

const PARTS = [
  { title: "Part 1 · JavaScript foundations", ids: ["m01", "m02", "m03", "m04", "m05", "m06", "m07", "m08"] },
  { title: "Part 2 · React", ids: ["m09", "m10", "m11", "m12", "m13", "m14", "m15", "m16"] },
  { title: "Part 3 · React Router", ids: ["m17", "m18", "m19"] },
  { title: "Part 4 · Your capstone project", ids: ["m20"] },
];
const IDEAS = ["How do websites remember things?", "Build a tiny quiz game", "What is an API?", "Make a dark mode button", "Explain arrays with pizza"];

export const KindIcon = ({ l, size = 13 }: { l: Lesson; size?: number }) =>
  l.kind === "scrim" ? <Play size={size} /> : l.kind === "practice" ? <Code2 size={size} /> : <Brain size={size} />;

export default function Home({ open, openReview, openSettings }: { open: (id: string) => void; openReview: () => void; openSettings: () => void }) {
  const pr = progress.use();
  const nar = narration.use();
  const [topic, setTopic] = useState("");
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const total = ALL_LESSONS.length, done = ALL_LESSONS.filter((x) => pr.done[x.lesson.id]).length;
  const cont = (pr.last && !pr.done[pr.last] ? pr.last : undefined) ?? ALL_LESSONS.find((x) => !pr.done[x.lesson.id])?.lesson.id ?? ALL_LESSONS[0]?.lesson.id;
  const reviewCount = Object.keys(pr.review).length;

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

  return <div className="h-full overflow-y-auto">
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex items-center gap-5">
        <img src="/logo.png" alt="" className="h-20 w-20 rounded-2xl" />
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">Welcome! Let's learn React together.</h1>
          <p className="text-muted">From your very first line of JavaScript to multi-page React apps. Go at your own pace: every lesson is open, and you can learn anything you're curious about.</p>
        </div>
        {cont && <Button variant="primary" className="h-11 px-5 text-base" onClick={() => open(cont)}><Play size={16} />{done ? "Continue" : "Start learning"}</Button>}
      </div>
      <div className="flex items-center gap-3 text-sm text-muted"><div className="h-2 flex-1 rounded-full bg-border"><div className="h-2 rounded-full bg-accent" style={{ width: `${total ? (done / total) * 100 : 0}%` }} /></div>{done} of {total} lessons done</div>

      {(nar.status === "needs-setup" || !selectedModel()) && <div className="grid gap-3 md:grid-cols-2">
        {nar.status === "needs-setup" && <Card className="flex items-center gap-3 p-4"><Volume2 className="shrink-0 text-accent" /><div className="flex-1 text-sm"><div className="font-medium">Turn on natural narration</div><div className="text-muted">A one-time setup of Kitten TTS{nar.engine ? ` (${nar.engine.label})` : ""}. Until then lessons use your system's voice.</div></div><Button size="sm" onClick={openSettings}>Set up</Button></Card>}
        {!selectedModel() && <Card className="flex items-center gap-3 p-4"><Sparkles className="shrink-0 text-accent" /><div className="flex-1 text-sm"><div className="font-medium">Meet Kit, your AI tutor</div><div className="text-muted">Connect an AI model (or your ChatGPT plan) to chat, get code reviews and make your own lessons.</div></div><Button size="sm" onClick={openSettings}>Connect</Button></Card>}
      </div>}

      <Card className="space-y-3 p-5">
        <div className="flex items-center gap-2 font-semibold"><Wand2 size={18} className="text-accent" />Learn anything you want</div>
        <p className="text-sm text-muted">Curious about something, or want to build your own idea? Tell Kit and it will make an interactive lesson just for you, with narration, live code and a challenge.</p>
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); make(topic); }}>
          <Input className="h-10" placeholder="e.g. “How do I make a button change color?”" value={topic} onChange={(e) => setTopic(e.target.value)} disabled={!!busy} />
          <Mic onText={(t) => { setTopic(t); make(t); }} />
          <Button type="submit" variant="primary" className="h-10" disabled={!topic.trim() || !!busy || !selectedModel()}>{busy ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}Make my lesson</Button>
        </form>
        {busy ? <div className="text-sm text-muted">Writing a lesson about “{busy}”. This can take a minute…</div>
          : <div className="flex flex-wrap gap-1.5">{IDEAS.map((i) => <button key={i} disabled={!selectedModel()} onClick={() => make(i)} className="rounded-full border border-border px-3 py-1 text-xs text-muted hover:border-accent hover:text-fg cursor-pointer disabled:opacity-50">{i}</button>)}</div>}
        {err && <div className="text-sm text-warning">{err}</div>}
        {pr.custom.length > 0 && <div className="space-y-1 pt-2"><div className="text-xs font-medium text-muted">My lessons</div>
          {pr.custom.map((l) => <div key={l.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-surface-2">
            {pr.done[l.id] ? <CheckCircle2 size={14} className="text-success" /> : l.kind === "practice" ? <Code2 size={14} className="text-accent" /> : <Sparkles size={14} className="text-accent" />}
            <button className="flex-1 text-left text-sm cursor-pointer" onClick={() => open(l.id)}>{l.title}</button>
            <Button size="icon" variant="ghost" aria-label={`Delete ${l.title}`} onClick={() => progress.set((p) => ({ ...p, custom: p.custom.filter((x) => x.id !== l.id) }))}><Trash2 size={13} /></Button></div>)}</div>}
      </Card>

      {reviewCount > 0 && <Card className="flex items-center gap-3 p-4"><Brain className="text-accent" /><div className="flex-1 text-sm"><div className="font-medium">Review time</div><div className="text-muted">{reviewCount} quiz question{reviewCount > 1 ? "s" : ""} to revisit. Coming back to things is how memory gets strong.</div></div><Button size="sm" onClick={openReview}>Review</Button></Card>}

      {PARTS.map((part) => <section key={part.title} className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted"><BookOpen size={14} />{part.title}</h2>
        <div className="grid gap-3 md:grid-cols-2">{MODULES.filter((m) => part.ids.includes(m.id)).map((m) => {
          const d = m.lessons.filter((l) => pr.done[l.id]).length;
          return <Card key={m.id} className="p-4">
            <div className="flex items-start justify-between gap-2"><div><div className="font-medium">{m.title}</div><div className="text-xs text-muted">{m.summary}</div></div>
              {m.lessons.length > 0 && <Badge tone={d === m.lessons.length ? "success" : "muted"}>{d}/{m.lessons.length}</Badge>}</div>
            <div className="mt-3 space-y-0.5">{m.lessons.length === 0 && <div className="text-xs text-muted">Lessons coming soon. Meanwhile, ask Kit to make one on this topic!</div>}
              {m.lessons.map((l) => <button key={l.id} onClick={() => open(l.id)} className={cn("flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-sm hover:bg-surface-2 cursor-pointer", pr.last === l.id && "bg-accent/10")}>
                {pr.done[l.id] ? <CheckCircle2 size={13} className="shrink-0 text-success" /> : <Circle size={13} className="shrink-0 text-muted" />}
                <span className="flex-1 truncate">{l.title}</span><span className="text-muted"><KindIcon l={l} /></span></button>)}</div>
          </Card>;
        })}</div>
      </section>)}
    </div>
  </div>;
}
