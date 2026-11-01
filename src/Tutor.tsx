// Kit, the AI tutor. Always there in the side panel; reads the current lesson, code and errors with every question.
import { useEffect, useRef, useState } from "react";
import { Loader2, SendHorizontal, Sparkles, Trash2 } from "lucide-react";
import { ai, chat } from "./ai";
import { TUTOR_SYSTEM, contextBlock, type TutorContext } from "./ai/tutor";
import type { ChatMessage } from "./ai/types";
import Markdown from "./Markdown";
import Mic from "./Mic";
import { browserSpeak, playClip, synth } from "./narration";
import { errText, persisted, prefs } from "./store";
import { Button, Select, Textarea, cn } from "./ui";

export const tutorChat = persisted<{ messages: ChatMessage[] }>("rt.chat", { messages: [] });

/** Model picker: every model the student's providers offer (Settings fetches the lists). */
export function ModelPicker({ className }: { className?: string }) {
  const s = ai.use();
  const opts = s.providers.filter((p) => p.enabled).flatMap((p) => (s.models[p.id] ?? []).map((m) => ({ v: `${p.id}::${m}`, label: `${p.label} · ${m}` })));
  const cur = s.selected ? `${s.selected.provider_id}::${s.selected.model}` : "";
  return <Select aria-label="AI model" className={cn("h-8 text-xs", className)} value={cur} onChange={(e) => {
    const [provider_id, ...m] = e.target.value.split("::");
    ai.set((x) => ({ ...x, selected: provider_id ? { provider_id, model: m.join("::") } : null }));
  }}>
    <option value="">{opts.length ? "Choose a model…" : "No models yet (Settings → AI tutor)"}</option>
    {opts.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
  </Select>;
}

/** Reads a reply aloud without its code blocks. */
function speak(text: string) {
  const plain = text.replace(/```[\s\S]*?```/g, " (see the code in the chat) ").replace(/[*_#>`]/g, "").slice(0, 1500);
  const c = synth(plain);
  if (c) c.then((x) => playClip(x.url)).catch(() => {});
  else browserSpeak(plain, prefs.get().rate);
}

export default function Tutor({ getContext, draft, onDraftUsed, openSettings }: { getContext: () => TutorContext; draft?: string; onDraftUsed?: () => void; openSettings: () => void }) {
  const { messages } = tutorChat.use();
  const s = ai.use();
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [partial, setPartial] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [messages.length, partial]);
  useEffect(() => { if (draft) { setInput(draft); onDraftUsed?.(); } }, [draft]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    setInput("");
    const history = [...tutorChat.get().messages, { role: "user" as const, content: q }];
    tutorChat.set(() => ({ messages: history }));
    if (!s.selected) {
      tutorChat.set(() => ({ messages: [...history, { role: "assistant", content: "I'd love to help with that! To talk with me, pick an AI model first: open **Settings → AI tutor**, add a provider (or sign in with ChatGPT), then choose a model at the top of this panel. In the meantime, the **Notes** tab and the **Hint** buttons can help too. Your question is saved here, so you won't lose it." }] }));
      return;
    }
    setBusy(true);
    setPartial("");
    try {
      const ctx = contextBlock(getContext());
      const msgs: ChatMessage[] = [{ role: "system", content: TUTOR_SYSTEM + (ctx ? `\n\n# What the student is looking at right now\n${ctx}` : "") }, ...history.slice(-16)];
      const answer = await chat(msgs, setPartial);
      tutorChat.set(() => ({ messages: [...history, { role: "assistant", content: answer }] }));
      if (prefs.get().speakReplies) speak(answer);
    } catch (e) {
      tutorChat.set(() => ({ messages: [...history, { role: "assistant", content: `I couldn't reach the AI model just now (${errText(e)}). That's a connection problem, not something you did. Check Settings → AI tutor, or try again in a moment.` }] }));
    }
    setPartial("");
    setBusy(false);
  };

  return <div className="flex h-full min-h-0 flex-col">
    <div className="flex items-center gap-2 border-b border-border p-2">
      <ModelPicker className="min-w-0 flex-1" />
      <Button size="icon" variant="ghost" aria-label="Clear chat" title="Start a fresh conversation" onClick={() => tutorChat.set(() => ({ messages: [] }))}><Trash2 size={14} /></Button>
    </div>
    <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 select-text">
      {messages.length === 0 && <div className="rounded-lg bg-accent/10 p-3 text-sm">
        <div className="mb-1 flex items-center gap-1.5 font-medium"><Sparkles size={14} />Hi, I'm Kit!</div>
        Ask me anything: what a word means, why your code isn't working, or how to build something you're dreaming about. You can type or press the microphone and talk. No question is too small.
        {!s.selected && <div className="mt-2"><Button size="sm" onClick={openSettings}>Set up an AI model</Button></div>}
      </div>}
      {messages.map((m, i) => <div key={i} className={cn("rounded-lg p-2.5 text-sm", m.role === "user" ? "ml-6 bg-surface-2" : "mr-2 bg-accent/5")}>
        {m.role === "user" ? <div className="whitespace-pre-wrap">{m.content}</div> : <Markdown untrusted text={m.content} />}</div>)}
      {busy && <div className="mr-2 rounded-lg bg-accent/5 p-2.5 text-sm">{partial ? <Markdown untrusted text={partial} /> : <Loader2 size={14} className="animate-spin text-muted" />}</div>}
      <div ref={end} />
    </div>
    <form className="flex items-end gap-1 border-t border-border p-2" onSubmit={(e) => { e.preventDefault(); send(input); }}>
      <Textarea rows={2} className="min-h-0 flex-1 text-sm" placeholder="Ask Kit anything…" value={input} onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }} />
      <div className="flex flex-col gap-1">
        <Mic onText={(t) => setInput((x) => (x.trim() ? `${x.trimEnd()} ${t}` : t))} />
        <Button type="submit" size="icon" variant="primary" aria-label="Send" disabled={busy || !input.trim()}><SendHorizontal size={14} /></Button>
      </div>
    </form>
  </div>;
}
