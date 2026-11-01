// Practice session: task + hints on the left, editor in the middle, preview on the right. Checks run real tests in the preview;
// "Ask Kit to review" uses the AI check (judges against the task, never reveals the answer on a miss).
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Eye, Lightbulb, Loader2, MessageCircleQuestion, Play, RotateCcw, Sparkles } from "lucide-react";
import { selectedModel } from "../ai";
import { aiCheck, type CheckResult } from "../ai/tutor";
import type { PracticeLesson } from "../course/types";
import Markdown from "../Markdown";
import Editor from "../player/Editor";
import Preview, { type PreviewHandle, type TestResult } from "../player/Preview";
import { MoreButton, type LessonApi } from "../player/Scrim";
import { errText, markDone, prefs, progress } from "../store";
import { Badge, Button, Confirm, Split, cn } from "../ui";

const KIND = { fill: "Fill in the blanks", fix: "Fix the bug", build: "Build it" };

export default function Practice({ lesson, api }: { lesson: PracticeLesson; api: LessonApi }) {
  const p = prefs.use();
  const pr = progress.use();
  const files = pr.code[lesson.id] ?? lesson.files;
  const names = Object.keys({ ...lesson.files, ...lesson.solution });
  const [open, setOpen] = useState(names.find((n) => lesson.solution[n] !== undefined && n !== "index.html") ?? names[0]);
  const [hints, setHints] = useState(0);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [review, setReview] = useState<CheckResult | null>(null);
  const [busy, setBusy] = useState<"" | "check" | "ai">("");
  const [peek, setPeek] = useState(false);
  const preview = useRef<PreviewHandle>(null);
  const done = !!pr.done[lesson.id];

  const save = (f: Record<string, string>) => progress.set((x) => ({ ...x, code: { ...x.code, [lesson.id]: f } }));
  const run = () => preview.current!.run(files);
  useEffect(() => { run(); }, [lesson.id]);
  useEffect(() => { const h = setTimeout(run, 900); return () => clearTimeout(h); }, [files]);
  useEffect(() => { api.setContext({ task: lesson.task, files, errors: preview.current?.entries().filter((e) => e.level !== "log").map((e) => e.text) }); });

  const check = async () => {
    if (!lesson.tests.length) return askAi(); // AI-made exercises are checked by Kit
    setBusy("check");
    await run();
    await new Promise((r) => setTimeout(r, 300));
    const r = await preview.current!.test(lesson.tests);
    setResults(r);
    if (r.every((x) => x.ok)) markDone(lesson.id);
    setBusy("");
  };
  const askAi = async () => {
    setBusy("ai");
    try {
      const r = await aiCheck(lesson.task, lesson.files, lesson.solution, files);
      setReview(r);
      if (r.correct && !lesson.tests.length) markDone(lesson.id);
    }
    catch (e) { setReview({ correct: false, explanation: errText(e) }); }
    setBusy("");
  };
  const allOk = results && results.every((r) => r.ok);

  return <Split id="practice-task" size={26} min={220} className="h-full">
    <aside className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
      <div className="mb-2 flex items-center gap-2"><Badge tone="accent">{KIND[lesson.type]}</Badge>{done && <Badge tone="success"><CheckCircle2 size={11} />done</Badge>}</div>
      <Markdown text={lesson.task} className="text-sm" />
      <div className="mt-3 space-y-1.5">{lesson.hints.slice(0, hints).map((h, i) => <div key={i} className="flex gap-1.5 rounded-lg bg-warning/10 p-2 text-xs"><Lightbulb size={13} className="mt-0.5 shrink-0 text-warning" /><Markdown text={h} /></div>)}</div>
      {results && <div className="mt-3 rounded-lg border border-border p-2 text-xs">
        {results.map((r, i) => <div key={i} className={cn("py-0.5", r.ok ? "text-success" : "text-warning")}>{r.ok ? "✓" : "○"} {r.name}</div>)}
        <div className="mt-1.5 text-sm">{allOk ? "Wonderful, every check passes! 🎉 You should be proud." : "Almost there! The items with a circle still need a little work. You've got this."}</div>
      </div>}
      {review && <div className={cn("mt-3 rounded-lg p-2 text-sm", review.correct ? "bg-success/10" : "bg-accent/10")}>
        <div className="mb-1 flex items-center gap-1 text-xs font-medium"><Sparkles size={12} />Kit's review</div>
        <Markdown untrusted text={review.explanation || (review.correct ? "Looks great!" : "")} /></div>}
      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        <Button variant="primary" size="sm" onClick={check} disabled={!!busy}>{busy === "check" ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}{lesson.tests.length ? "Check my code" : "Ask Kit to check"}</Button>
        {hints < lesson.hints.length && <Button size="sm" onClick={() => setHints(hints + 1)}><Lightbulb size={12} />Hint {hints + 1}/{lesson.hints.length}</Button>}
        <Button size="sm" onClick={askAi} disabled={!!busy || !selectedModel()} title={selectedModel() ? "An AI review of your code" : "Pick an AI model in Settings to use this"}>{busy === "ai" ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}Ask Kit to review</Button>
        <Button size="sm" onClick={() => api.ask(`I'm working on this practice exercise and I'd like some help:\n\n${lesson.task}`)}><MessageCircleQuestion size={12} />Ask Kit</Button>
        <Button size="sm" variant="ghost" onClick={() => setPeek(true)}><Eye size={12} />Solution</Button>
        <Button size="sm" variant="ghost" onClick={() => { save(lesson.files); setResults(null); setReview(null); }}><RotateCcw size={12} />Start over</Button>
        <MoreButton api={api} label="More practice like this" />
        {(allOk || (review?.correct && !lesson.tests.length)) && api.next && <Button size="sm" variant="primary" onClick={api.next}>Next lesson</Button>}
      </div>
      <Confirm open={peek} onClose={() => setPeek(false)} title="Peek at the solution?" confirmLabel="Show me" onConfirm={() => save({ ...files, ...lesson.solution })}>
        <p>Totally fine to peek. Reading a solution is a great way to learn! Your current code will be replaced by the solution, so you can study it and run it.</p>
        <p>Tip: afterwards, press <b>Start over</b> and try writing it again from memory.</p>
      </Confirm>
    </aside>
    <Split id="code" dir="auto" className="h-full flex-1"><div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-0.5 overflow-x-auto border-b border-border bg-surface px-1">
        {names.map((n) => <button key={n} onClick={() => setOpen(n)} className={cn("whitespace-nowrap border-b-2 px-3 py-2 font-mono text-xs cursor-pointer", n === open ? "border-accent text-fg" : "border-transparent text-muted hover:text-fg")}>{n}</button>)}
        <Button size="sm" className="ml-auto mr-1" onClick={run}><Play size={12} />Run</Button>
      </div>
      <div className="min-h-0 flex-1"><Editor file={open} files={Object.keys(files)} value={files[open] ?? ""} readOnly={false} onChange={(v) => save({ ...files, [open]: v })} onRun={run} fontSize={p.fontSize} dark={p.theme === "dark"} /></div>
    </div>
    <div className="min-h-0 flex-1"><Preview ref={preview} onAsk={api.ask} /></div></Split>
  </Split>;
}
