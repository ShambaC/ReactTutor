// The mini browser: runs the student's files in /sandbox/index.html (same origin, so React Router's history works),
// with an address bar, back/forward/reload and a console panel.
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, MessageCircleQuestion, RotateCw, Trash2 } from "lucide-react";
import type { Files, Test } from "../course/types";
import { Button, cn } from "../ui";
import { explainError } from "./friendlyErrors";

export interface ConsoleEntry { level: string; text: string; file?: string; line?: number }
export interface TestResult { name: string; ok: boolean; error?: string }
export interface PreviewHandle {
  /** Resolves once the page's scripts have run. */
  run(files: Files, path?: string): Promise<void>;
  test(tests: Test[]): Promise<TestResult[]>;
  entries(): ConsoleEntry[];
}

const Preview = forwardRef<PreviewHandle, { onAsk?: (q: string) => void; showConsole?: boolean }>(function Preview({ onAsk, showConsole = true }, ref) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [runId, setRunId] = useState(0);
  const [url, setUrl] = useState("/");
  const [typed, setTyped] = useState<string | null>(null);
  const [log, setLog] = useState<ConsoleEntry[]>([]);
  const pending = useRef<{ files: Files; path: string } | null>(null);
  const testWaiter = useRef<((r: TestResult[]) => void) | null>(null);
  const ranWaiter = useRef<(() => void) | null>(null);
  const logRef = useRef<ConsoleEntry[]>([]);
  const add = (e: ConsoleEntry) => { logRef.current = [...logRef.current.slice(-300), e]; setLog(logRef.current); };

  useImperativeHandle(ref, () => ({
    run(files, path) {
      pending.current = { files, path: path ?? "/" };
      logRef.current = [];
      setLog([]);
      setRunId((n) => n + 1); // new iframe = fresh page, no leftovers from the last run
      ranWaiter.current?.();
      return new Promise((resolve) => {
        ranWaiter.current = resolve;
        setTimeout(resolve, 4000);
      });
    },
    test(tests) {
      return new Promise((resolve) => {
        testWaiter.current = resolve;
        frame.current?.contentWindow?.postMessage({ target: "sandbox", type: "test", tests }, "*");
        setTimeout(() => { if (testWaiter.current === resolve) { testWaiter.current = null; resolve(tests.map((t) => ({ name: t.name, ok: false, error: "The check took too long. Is the page stuck in a loop?" }))); } }, 8000);
      });
    },
    entries: () => logRef.current,
  }), []);

  useEffect(() => {
    const onMsg = (ev: MessageEvent) => {
      const m = ev.data;
      if (!m || m.source !== "sandbox" || ev.source !== frame.current?.contentWindow) return;
      if (m.type === "ready" && pending.current) frame.current!.contentWindow!.postMessage({ target: "sandbox", type: "run", ...pending.current }, "*");
      else if (m.type === "console") add({ level: m.level, text: m.text });
      else if (m.type === "console-clear") { logRef.current = []; setLog([]); }
      else if (m.type === "error") add({ level: "error", text: `${m.name}: ${m.message}`, file: m.file, line: m.line });
      else if (m.type === "url") setUrl(m.path);
      else if (m.type === "ran") { ranWaiter.current?.(); ranWaiter.current = null; }
      else if (m.type === "test-results") { testWaiter.current?.(m.results); testWaiter.current = null; }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const send = (msg: object) => frame.current?.contentWindow?.postMessage({ target: "sandbox", ...msg }, "*");
  const go = (p: string) => send({ type: "navigate", path: p.startsWith("/") ? p : "/" + p });
  const firstError = log.find((e) => e.level === "error");
  const hint = firstError && explainError(firstError.text);

  return <div className="flex h-full flex-col bg-surface">
    <div className="flex items-center gap-1 border-b border-border px-2 py-1.5">
      <Button size="icon" variant="ghost" aria-label="Back" onClick={() => send({ type: "back" })}><ArrowLeft size={14} /></Button>
      <Button size="icon" variant="ghost" aria-label="Forward" onClick={() => send({ type: "forward" })}><ArrowRight size={14} /></Button>
      <Button size="icon" variant="ghost" aria-label="Reload" onClick={() => { if (pending.current) { pending.current.path = url; setRunId((n) => n + 1); logRef.current = []; setLog([]); } }}><RotateCw size={14} /></Button>
      <form className="flex-1" onSubmit={(e) => { e.preventDefault(); if (typed != null) go(typed); setTyped(null); }}>
        <input aria-label="Address" className="h-7 w-full rounded-md border border-border bg-bg px-2 font-mono text-xs"
          value={typed ?? `localhost${url}`} onFocus={() => setTyped(url)} onBlur={() => setTyped(null)} onChange={(e) => setTyped(e.target.value)} />
      </form>
    </div>
    <div className="relative min-h-0 flex-1 bg-white">
      {runId > 0 && <iframe key={runId} ref={frame} title="Preview" src="/sandbox/index.html" className="h-full w-full border-0" />}
      {runId === 0 && <div className="flex h-full items-center justify-center text-sm text-neutral-500">Press Run (Ctrl+S) to see your page here.</div>}
      {firstError && <div className="absolute inset-x-2 bottom-2 rounded-lg border border-warning/40 bg-surface p-3 text-sm shadow-lg">
        <div className="font-medium">Something needs a small fix. That's completely normal!</div>
        <div className="mt-1 font-mono text-xs text-danger">{firstError.text}{firstError.file && ` (${firstError.file}${firstError.line ? `, line ${firstError.line}` : ""})`}</div>
        {hint && <div className="mt-1 text-xs text-muted">{hint}</div>}
        {onAsk && <Button size="sm" className="mt-2" onClick={() => onAsk(`I got this error and I'm not sure what it means:\n\n${firstError.text}${firstError.file ? ` (${firstError.file}${firstError.line ? ` line ${firstError.line}` : ""})` : ""}`)}><MessageCircleQuestion size={12} />Ask Kit about this</Button>}
      </div>}
    </div>
    {showConsole && <div className="flex h-36 shrink-0 flex-col border-t border-border">
      <div className="flex items-center justify-between px-2 py-1 text-[11px] font-medium text-muted">Console
        <Button size="icon" variant="ghost" aria-label="Clear console" className="h-6 w-6" onClick={() => { logRef.current = []; setLog([]); }}><Trash2 size={12} /></Button></div>
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-1 font-mono text-xs select-text">
        {log.length === 0 && <div className="text-muted/60">console.log output shows up here</div>}
        {log.map((e, i) => <div key={i} className={cn("whitespace-pre-wrap border-b border-border/40 py-0.5", e.level === "error" ? "text-danger" : e.level === "warn" ? "text-warning" : "text-fg")}>{e.text}</div>)}
      </div>
    </div>}
  </div>;
});
export default Preview;
