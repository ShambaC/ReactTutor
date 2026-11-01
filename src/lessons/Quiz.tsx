// Quiz: one question at a time with an explanation after every answer. Missed questions go to Review for later.
import { useState } from "react";
import { CheckCircle2, ChevronRight, MessageCircleQuestion, RotateCcw } from "lucide-react";
import type { QuizLesson, QuizQuestion } from "../course/types";
import Markdown from "../Markdown";
import type { LessonApi } from "../player/Scrim";
import { markDone, progress } from "../store";
import { Button, Card, cn } from "../ui";

export function Question({ q, onAnswer, onAsk }: { q: QuizQuestion; onAnswer: (right: boolean) => void; onAsk?: (s: string) => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const right = picked === q.answer;
  return <div className="space-y-3">
    <Markdown text={q.q} className="text-base font-medium" />
    {q.code && <pre className="overflow-x-auto rounded-lg bg-surface-2 p-3 font-mono text-sm">{q.code}</pre>}
    <div className="space-y-2">{q.options.map((o, i) => <button key={i} disabled={picked !== null}
      onClick={() => { setPicked(i); onAnswer(i === q.answer); }}
      className={cn("w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors",
        picked === null ? "cursor-pointer border-border hover:border-accent hover:bg-accent/5" : i === q.answer ? "border-success bg-success/10" : i === picked ? "border-warning bg-warning/10" : "border-border opacity-60")}>
      <Markdown text={o} /></button>)}</div>
    {picked !== null && <div className={cn("rounded-lg p-3 text-sm", right ? "bg-success/10" : "bg-accent/10")}>
      <div className="mb-1 font-medium">{right ? "Yes! Exactly right. 🎉" : "Not this time, and that's how learning works! Here's the idea:"}</div>
      <Markdown text={q.explain} />
      {!right && onAsk && <Button size="sm" className="mt-2" onClick={() => onAsk(`In a quiz I was asked:\n\n${q.q}\n${q.code ? "\n```js\n" + q.code + "\n```\n" : ""}\nI picked "${q.options[picked]}" but the answer is "${q.options[q.answer]}". Can you explain it another way?`)}><MessageCircleQuestion size={12} />Explain it differently</Button>}
    </div>}
  </div>;
}

export default function Quiz({ lesson, api }: { lesson: QuizLesson; api: LessonApi }) {
  const [i, setI] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const finished = i >= lesson.questions.length;
  const answer = (right: boolean) => {
    setAnswered(true);
    if (right) setScore((s) => s + 1);
    const key = `${lesson.id}#${i}`;
    progress.set((p) => {
      const review = { ...p.review };
      if (right) delete review[key]; else review[key] = Date.now();
      return { ...p, review };
    });
  };
  const next = () => { setAnswered(false); setI(i + 1); if (i + 1 >= lesson.questions.length) markDone(lesson.id); };
  return <div className="h-full overflow-y-auto p-8">
    <Card className="mx-auto max-w-2xl p-6">
      {!finished ? <>
        <div className="mb-4 flex items-center justify-between text-xs text-muted"><span>Question {i + 1} of {lesson.questions.length}</span>
          <div className="flex gap-1">{lesson.questions.map((_, j) => <span key={j} className={cn("h-1.5 w-6 rounded-full", j < i ? "bg-accent" : j === i ? "bg-accent/50" : "bg-border")} />)}</div></div>
        <Question key={`${round}-${i}`} q={lesson.questions[i]} onAnswer={answer} onAsk={api.ask} />
        {answered && <div className="mt-4 flex justify-end"><Button variant="primary" onClick={next}>{i + 1 < lesson.questions.length ? "Next question" : "See results"}<ChevronRight size={14} /></Button></div>}
      </> : <div className="space-y-4 text-center">
        <CheckCircle2 size={40} className="mx-auto text-success" />
        <div className="text-lg font-semibold">You finished the quiz!</div>
        <div className="text-muted">{score} of {lesson.questions.length} on the first try. {score === lesson.questions.length ? "Perfect score! Amazing work." : "Every question you missed is saved in Review, so you can come back to it later. That's how memory gets strong."}</div>
        <div className="flex justify-center gap-2">
          <Button onClick={() => { setI(0); setScore(0); setRound(round + 1); }}><RotateCcw size={14} />Try again</Button>
          {api.next && <Button variant="primary" onClick={api.next}>Next lesson<ChevronRight size={14} /></Button>}
        </div>
      </div>}
    </Card>
  </div>;
}
