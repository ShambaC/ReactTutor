// Hand-built shadcn-style primitives. Colors come from tokens in index.css only.
import { useEffect, useRef, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { X } from "lucide-react";

export const cn = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(" ");

const variants = {
  primary: "bg-accent text-bg hover:bg-accent-hover font-medium",
  outline: "border border-border bg-surface hover:bg-surface-2",
  ghost: "hover:bg-surface-2 text-muted hover:text-fg",
  danger: "bg-danger text-bg hover:opacity-90 font-medium",
};
export function Button({ variant = "outline", size = "md", className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants; size?: "sm" | "md" | "icon" }) {
  return <button type="button" {...p} className={cn("inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-sm transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer",
    size === "sm" ? "h-7 px-2.5 text-xs" : size === "icon" ? "h-8 w-8" : "h-9 px-3.5", variants[variant], className)} />;
}

export const Card = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) =>
  <div {...p} className={cn("rounded-xl border border-border bg-surface", className)} />;

const tones = { muted: "text-muted bg-surface-2", accent: "text-accent bg-accent/15", success: "text-success bg-success/15", warning: "text-warning bg-warning/15", danger: "text-danger bg-danger/15" };
export const Badge = ({ tone = "muted", className, ...p }: React.HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }) =>
  <span {...p} className={cn("inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] leading-none", tones[tone], className)} />;

const field = "w-full rounded-lg border border-border bg-bg px-3 text-sm placeholder:text-muted/70 focus-visible:outline-accent disabled:opacity-50";
export const Input = ({ className, ...p }: InputHTMLAttributes<HTMLInputElement>) => <input {...p} className={cn(field, "h-9", className)} />;
export const Textarea = ({ className, ...p }: TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...p} className={cn(field, "py-2 resize-y", className)} />;
export const Select = ({ className, ...p }: SelectHTMLAttributes<HTMLSelectElement>) => <select {...p} className={cn(field, "h-9", className)} />;

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}
    className={cn("relative h-5 w-9 shrink-0 rounded-full transition-colors cursor-pointer", checked ? "bg-accent" : "bg-border")}>
    <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-fg transition-all", checked ? "left-[18px]" : "left-0.5")} />
  </button>;
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="block space-y-1">
    <span className="text-xs font-medium text-muted">{label}</span>
    {children}
    {hint && <span className="block text-[11px] text-muted">{hint}</span>}
  </label>;
}

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { id: T; label: string; icon?: ReactNode }[]; value: T; onChange: (v: T) => void }) {
  return <div role="tablist" className="flex gap-0.5 overflow-x-auto border-b border-border px-2">
    {tabs.map((t) => <button key={t.id} role="tab" aria-selected={value === t.id} onClick={() => onChange(t.id)}
      className={cn("flex items-center gap-1.5 whitespace-nowrap border-b-2 px-2.5 py-2 text-xs cursor-pointer", value === t.id ? "border-accent text-fg" : "border-transparent text-muted hover:text-fg")}>
      {t.icon}{t.label}</button>)}
  </div>;
}

const stack: object[] = []; // topmost modal owns Esc
export function Modal({ open, onClose, title, children, wide, footer }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean; footer?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const me = {};
    stack.push(me);
    ref.current?.querySelector<HTMLElement>("[data-autofocus],input,textarea,button")?.focus();
    const k = (e: KeyboardEvent) => { if (e.key === "Escape" && stack[stack.length - 1] === me) onClose(); };
    window.addEventListener("keydown", k);
    return () => { stack.splice(stack.indexOf(me), 1); window.removeEventListener("keydown", k); prev?.focus(); };
  }, [open]);
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[8vh]" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <div ref={ref} role="dialog" aria-modal="true" aria-label={title} className={cn("flex max-h-[84vh] w-full flex-col rounded-xl border border-border bg-surface shadow-2xl", wide ? "max-w-4xl" : "max-w-lg")}>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        <Button variant="ghost" size="icon" aria-label="Close" onClick={onClose}><X size={16} /></Button>
      </div>
      <div className="overflow-y-auto p-4">{children}</div>
      {footer && <div className="flex justify-end gap-2 border-t border-border px-4 py-3">{footer}</div>}
    </div>
  </div>;
}

/** Small confirm/prompt-less confirmation dialog. */
export function Confirm({ open, title, children, confirmLabel = "Confirm", danger, onConfirm, onClose }: { open: boolean; title: string; children: ReactNode; confirmLabel?: string; danger?: boolean; onConfirm: () => void; onClose: () => void }) {
  return <Modal open={open} onClose={onClose} title={title} footer={<>
    <Button onClick={onClose}>Cancel</Button>
    <Button variant={danger ? "danger" : "primary"} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button>
  </>}><div className="space-y-2 text-sm text-muted">{children}</div></Modal>;
}

export const Empty = ({ children }: { children: ReactNode }) => <p className="py-8 text-center text-sm text-muted">{children}</p>;
export const Mono = ({ children }: { children: ReactNode }) => <span className="font-mono text-[11px] text-muted">{children}</span>;

/**
 * Two panes with a draggable divider. `size` is the share (%) of the pane on `side`; the student's size is remembered under `id`.
 * `dir="auto"` lays the panes side by side, or stacks them when the space is narrower than `stackBelow` px.
 * A missing pane (null/false) gives the other one all the space.
 */
export function Split({ id, dir = "row", size = 50, side = "start", min = 140, stackBelow = 720, className, children: [a, b] }: {
  id: string; dir?: "row" | "col" | "auto"; size?: number; side?: "start" | "end"; min?: number; stackBelow?: number; className?: string; children: [ReactNode, ReactNode];
}) {
  const box = useRef<HTMLDivElement>(null);
  const key = `rt.split.${id}`;
  const [pct, setPct] = useState(() => { const v = Number(localStorage.getItem(key)); return v > 0 && v < 100 ? v : size; });
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    if (dir !== "auto" || !box.current) return;
    const ro = new ResizeObserver(([e]) => setNarrow(e.contentRect.width < stackBelow));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, [dir, stackBelow]);
  const row = dir === "row" || (dir === "auto" && !narrow);
  if (!a || !b) return <div className={cn("flex min-h-0 min-w-0", className)}><div className="flex min-h-0 min-w-0 flex-1 flex-col">{a || b}</div></div>;

  const drag = (e: React.PointerEvent) => {
    const r = box.current!.getBoundingClientRect(), total = row ? r.width : r.height, from = row ? r.left : r.top;
    const move = (ev: PointerEvent) => {
      const at = (row ? ev.clientX : ev.clientY) - from;
      const px = Math.min(total - min, Math.max(min, side === "start" ? at : total - at));
      setPct((px / total) * 100);
    };
    const up = () => {
      document.body.classList.remove("resizing");
      window.removeEventListener("pointermove", move);
      setPct((v) => { try { localStorage.setItem(key, String(v)); } catch { /* keep in memory */ } return v; });
    };
    e.preventDefault();
    document.body.classList.add("resizing"); // iframes and the editor would swallow the drag otherwise
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up, { once: true });
  };
  const sized = { flex: `0 0 ${pct}%` };
  const pane = "flex min-h-0 min-w-0 flex-col overflow-hidden";
  return <div ref={box} className={cn("flex min-h-0 min-w-0", row ? "flex-row" : "flex-col", className)}>
    <div className={cn(pane, side === "end" && "flex-1")} style={side === "start" ? sized : undefined}>{a}</div>
    <div role="separator" aria-orientation={row ? "vertical" : "horizontal"} tabIndex={0} title="Drag to resize (double-click to reset)"
      onPointerDown={drag} onDoubleClick={() => { setPct(size); try { localStorage.removeItem(key); } catch { /* ignore */ } }}
      onKeyDown={(e) => { const d = (e.key === "ArrowRight" || e.key === "ArrowDown" ? 2 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -2 : 0) * (side === "start" ? 1 : -1); if (d) setPct((v) => Math.min(90, Math.max(10, v + d))); }}
      className={cn("group relative z-10 shrink-0 bg-border transition-colors hover:bg-accent focus-visible:bg-accent", row ? "w-px cursor-col-resize" : "h-px cursor-row-resize")}>
      <span className={cn("absolute", row ? "inset-y-0 -left-1.5 -right-1.5" : "inset-x-0 -top-1.5 -bottom-1.5")} />
    </div>
    <div className={cn(pane, side === "start" && "flex-1")} style={side === "end" ? sized : undefined}>{b}</div>
  </div>;
}
