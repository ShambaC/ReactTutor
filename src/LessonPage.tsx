// One lesson: optional course outline on the left, the lesson in the middle, Kit (AI tutor) and Notes on the right.
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Circle, MessageCircle, NotebookPen, PanelLeft, PanelRight } from "lucide-react";
import { generatePractice } from "./ai/generate";
import type { TutorContext } from "./ai/tutor";
import { MODULES } from "./course";
import type { Lesson, Module, ScrimLesson } from "./course/types";
import { KindIcon } from "./Home";
import Practice from "./lessons/Practice";
import Quiz from "./lessons/Quiz";
import Markdown from "./Markdown";
import Scrim, { type LessonApi } from "./player/Scrim";
import { progress } from "./store";
import Tutor from "./Tutor";
import { Button, Tabs, Textarea, cn } from "./ui";

function Outline({ current, open }: { current: string; open: (id: string) => void }) {
  const pr = progress.use();
  return <div className="h-full overflow-y-auto p-2 text-sm">
    {pr.custom.length > 0 && <div className="mb-3"><div className="px-2 py-1 text-xs font-semibold text-muted">My lessons</div>
      {pr.custom.map((l) => <Row key={l.id} l={l} />)}</div>}
    {MODULES.filter((m) => m.lessons.length).map((m) => <div key={m.id} className="mb-3">
      <div className="px-2 py-1 text-xs font-semibold text-muted">{m.title}</div>
      {m.lessons.map((l) => <Row key={l.id} l={l} />)}
    </div>)}
  </div>;
  function Row({ l }: { l: Lesson }) {
    return <button onClick={() => open(l.id)} className={cn("flex w-full items-center gap-2 rounded-md px-2 py-1 text-left hover:bg-surface-2 cursor-pointer", l.id === current && "bg-accent/15 text-fg")}>
      {pr.done[l.id] ? <CheckCircle2 size={12} className="shrink-0 text-success" /> : <Circle size={12} className="shrink-0 text-muted" />}
      <span className="flex-1 truncate text-xs">{l.title}</span><span className="text-muted"><KindIcon l={l} size={11} /></span></button>;
  }
}

function Notes({ lesson }: { lesson: Lesson }) {
  const pr = progress.use();
  return <div className="h-full space-y-4 overflow-y-auto p-3 select-text">
    {lesson.kind === "scrim" && lesson.notes && <Markdown text={lesson.notes} className="text-sm" />}
    {lesson.kind === "practice" && <Markdown text={lesson.task} className="text-sm" />}
    <div><div className="mb-1 text-xs font-medium text-muted">My notes</div>
      <Textarea rows={6} placeholder="Write anything you want to remember. Notes are saved automatically." value={pr.notes[lesson.id] ?? ""} onChange={(e) => progress.set((p) => ({ ...p, notes: { ...p.notes, [lesson.id]: e.target.value } }))} /></div>
    {lesson.kind === "scrim" && <details><summary className="cursor-pointer text-xs font-medium text-muted">Transcript</summary>
      <div className="mt-2 space-y-1.5 text-xs text-muted">{lesson.steps.map((s, i) => <p key={i}>{s.say}</p>)}</div></details>}
  </div>;
}

export default function LessonPage({ lesson, module, open, next, openSettings }: { lesson: Lesson; module?: Module; open: (id: string) => void; next?: () => void; openSettings: () => void }) {
  const [outline, setOutline] = useState(false);
  const [side, setSide] = useState(true);
  const [tab, setTab] = useState<"kit" | "notes">("kit");
  const [draft, setDraft] = useState<string>();
  const ctx = useRef<TutorContext>({});
  useEffect(() => { progress.set((p) => ({ ...p, last: lesson.id })); ctx.current = {}; }, [lesson.id]);

  const api: LessonApi = {
    ask(q) { setSide(true); setTab("kit"); setDraft(q); },
    setContext(c) { ctx.current = { lesson: `${module ? module.title + " › " : ""}${lesson.title}`, ...c }; },
    next,
    async morePractice() {
      const ex = await generatePractice(lesson);
      progress.set((p) => {
        const at = p.custom.findIndex((x) => x.id === lesson.id);
        const custom = [...p.custom];
        custom.splice(at + 1, 0, ex); // right after its lesson (or first, for course lessons)
        return { ...p, custom };
      });
      open(ex.id);
    },
  };
  const saveCustom = (l: ScrimLesson) => progress.set((p) => ({ ...p, custom: p.custom.map((x) => (x.id === l.id ? l : x)) }));
  const custom = !module;

  return <div className="flex h-full min-h-0 flex-col">
    <div className="flex items-center gap-2 border-b border-border px-2 py-1.5">
      <Button size="icon" variant="ghost" aria-label="Course outline" onClick={() => setOutline(!outline)}><PanelLeft size={16} /></Button>
      <div className="min-w-0 flex-1 truncate text-sm"><span className="text-muted">{module ? module.title : "My lessons"} › </span><span className="font-medium">{lesson.title}</span></div>
      <Button size="sm" variant={side && tab === "notes" ? "outline" : "ghost"} onClick={() => { setSide(true); setTab("notes"); }}><NotebookPen size={14} />Notes</Button>
      <Button size="sm" variant={side && tab === "kit" ? "outline" : "ghost"} onClick={() => { setSide(true); setTab("kit"); }}><MessageCircle size={14} />Ask Kit</Button>
      <Button size="icon" variant="ghost" aria-label="Toggle side panel" onClick={() => setSide(!side)}><PanelRight size={16} /></Button>
    </div>
    <div className="flex min-h-0 flex-1">
      {outline && <div className="w-64 shrink-0 border-r border-border"><Outline current={lesson.id} open={open} /></div>}
      <div className="min-w-0 flex-1">
        {lesson.kind === "scrim" && <Scrim key={lesson.id} lesson={lesson} api={api} onChange={custom ? saveCustom : undefined} />}
        {lesson.kind === "practice" && <Practice key={lesson.id} lesson={lesson} api={api} />}
        {lesson.kind === "quiz" && <Quiz key={lesson.id} lesson={lesson} api={api} />}
      </div>
      {side && <div className="flex w-[340px] shrink-0 flex-col border-l border-border">
        <Tabs tabs={[{ id: "kit", label: "Kit (AI tutor)" }, { id: "notes", label: "Notes" }]} value={tab} onChange={setTab} />
        <div className="min-h-0 flex-1">{tab === "kit" ? <Tutor getContext={() => ctx.current} draft={draft} onDraftUsed={() => setDraft(undefined)} openSettings={openSettings} /> : <Notes lesson={lesson} />}</div>
      </div>}
    </div>
  </div>;
}
