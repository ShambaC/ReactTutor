import { useEffect, useState } from "react";
import { Brain, Home as HomeIcon, Settings as SettingsIcon } from "lucide-react";
import { ALL_LESSONS, findLesson, nextLesson } from "./course";
import type { QuizLesson } from "./course/types";
import Home from "./Home";
import LessonPage from "./LessonPage";
import { Question } from "./lessons/Quiz";
import { initNarration } from "./narration";
import Settings from "./Settings";
import { prefs, progress } from "./store";
import { Button, Card, Empty, cn } from "./ui";

type View = { page: "home" } | { page: "lesson"; id: string } | { page: "settings" } | { page: "review" };

function Review() {
  const pr = progress.use();
  const items = Object.keys(pr.review).map((k) => { const [id, i] = k.split("#"); const l = findLesson(id)?.lesson as QuizLesson | undefined; return l && { k, q: l.questions[Number(i)], title: l.title }; }).filter(Boolean) as { k: string; q: QuizLesson["questions"][number]; title: string }[];
  return <div className="h-full overflow-y-auto p-6"><div className="mx-auto max-w-2xl space-y-4">
    <h1 className="text-xl font-semibold">Review</h1>
    <p className="text-sm text-muted">Questions you missed before. Answer one correctly and it leaves the list. There's no score here, just practice.</p>
    {items.length === 0 && <Empty>Nothing to review right now. Great job! 🎉</Empty>}
    {items.map((it) => <Card key={it.k} className="p-5"><div className="mb-2 text-xs text-muted">{it.title}</div>
      <Question q={it.q} onAnswer={(right) => right && setTimeout(() => progress.set((p) => { const review = { ...p.review }; delete review[it.k]; return { ...p, review }; }), 2500)} /></Card>)}
  </div></div>;
}

export default function App() {
  const p = prefs.use();
  const pr = progress.use();
  const [view, setView] = useState<View>({ page: "home" });
  useEffect(() => { document.documentElement.dataset.theme = p.theme; }, [p.theme]);
  useEffect(() => { initNarration(); }, []);

  const open = (id: string) => setView({ page: "lesson", id });
  const openSettings = () => setView({ page: "settings" });
  let body;
  if (view.page === "lesson") {
    const found = findLesson(view.id);
    const custom = pr.custom.find((l) => l.id === view.id);
    const lesson = found?.lesson ?? custom;
    const ci = pr.custom.findIndex((l) => l.id === view.id);
    const nxt = found ? nextLesson(view.id) : pr.custom[ci + 1];
    body = lesson ? <LessonPage key={lesson.id} lesson={lesson} module={found?.module} open={open} next={nxt ? () => open(nxt.id) : undefined} openSettings={openSettings} /> : <Empty>That lesson isn't here anymore.</Empty>;
  } else if (view.page === "settings") body = <Settings />;
  else if (view.page === "review") body = <Review />;
  else body = <Home open={open} openReview={() => setView({ page: "review" })} openSettings={openSettings} />;

  const nav = (v: View, icon: React.ReactNode, label: string) => <Button size="icon" variant="ghost" aria-label={label} title={label}
    className={cn(view.page === v.page && "bg-surface-2 text-fg")} onClick={() => setView(v)}>{icon}</Button>;
  return <div className="flex h-full">
    <nav className="flex w-12 shrink-0 flex-col items-center gap-1 border-r border-border bg-surface py-2">
      <img src="/logo.png" alt="React Tutor" className="mb-2 h-8 w-8 rounded-lg" />
      {nav({ page: "home" }, <HomeIcon size={18} />, "Home")}
      {nav({ page: "review" }, <Brain size={18} />, `Review (${Object.keys(pr.review).length})`)}
      <div className="flex-1" />
      <span className="mb-1 text-[10px] text-muted" title="Lessons done">{Object.keys(pr.done).filter((id) => ALL_LESSONS.some((x) => x.lesson.id === id)).length}</span>
      {nav({ page: "settings" }, <SettingsIcon size={18} />, "Settings")}
    </nav>
    <main className="min-w-0 flex-1">{body}</main>
  </div>;
}
