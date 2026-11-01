// CodeMirror 6 editor. Controlled by `value`; while the lesson plays it is read-only and shows the instructor's caret and highlights.
import { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { Compartment, EditorState, StateEffect, StateField } from "@codemirror/state";
import { Decoration, type DecorationSet, WidgetType, keymap } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";
import { indentWithTab } from "@codemirror/commands";

class Caret extends WidgetType {
  toDOM() { const s = document.createElement("span"); s.className = "cm-ghost-caret"; return s; }
}

const setMarks = StateEffect.define<{ from: number; to: number; cls: string }[]>();
const marks = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(d, tr) {
    d = d.map(tr.changes);
    for (const e of tr.effects) if (e.is(setMarks)) d = Decoration.set(e.value.filter((m) => m.to > m.from || m.cls === "cm-ghost-caret").map((m) => (m.to > m.from ? Decoration.mark({ class: m.cls }) : Decoration.widget({ widget: new Caret(), side: 1 })).range(m.from, m.to)), true);
    return d;
  },
  provide: (f) => EditorView.decorations.from(f),
});

const lang = (file: string) => (file.endsWith(".html") ? html() : file.endsWith(".css") ? css() : javascript({ jsx: true }));

export interface EditorProps {
  file: string;
  value: string;
  readOnly: boolean;
  onChange?: (v: string) => void;
  onRun?: () => void;
  highlight?: string;
  caret?: number;
  fontSize: number;
  dark: boolean;
}

export default function Editor({ file, value, readOnly, onChange, onRun, highlight, caret, fontSize, dark }: EditorProps) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const comp = useRef({ lang: new Compartment(), ro: new Compartment(), theme: new Compartment(), size: new Compartment() });
  const cb = useRef({ onChange, onRun });
  cb.current = { onChange, onRun };

  useEffect(() => {
    const c = comp.current;
    const v = new EditorView({
      parent: host.current!,
      state: EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          keymap.of([indentWithTab, { key: "Mod-s", preventDefault: true, run: () => { cb.current.onRun?.(); return true; } }]),
          c.lang.of(lang(file)),
          c.ro.of([EditorState.readOnly.of(readOnly), EditorView.editable.of(!readOnly)]),
          c.theme.of(dark ? oneDark : []),
          c.size.of(EditorView.theme({ "&": { fontSize: `${fontSize}px` } })),
          marks,
          EditorView.updateListener.of((u) => { if (u.docChanged && u.transactions.some((t) => t.isUserEvent("input") || t.isUserEvent("delete") || t.isUserEvent("undo") || t.isUserEvent("redo") || t.isUserEvent("move"))) cb.current.onChange?.(u.state.doc.toString()); }),
          EditorView.theme({ "&": { height: "100%" }, ".cm-scroller": { fontFamily: "var(--font-mono)" } }),
        ],
      }),
    });
    view.current = v;
    return () => v.destroy();
  }, []);

  useEffect(() => {
    const v = view.current!, c = comp.current;
    v.dispatch({ effects: [c.lang.reconfigure(lang(file)), c.ro.reconfigure([EditorState.readOnly.of(readOnly), EditorView.editable.of(!readOnly)]), c.theme.reconfigure(dark ? oneDark : []), c.size.reconfigure(EditorView.theme({ "&": { fontSize: `${fontSize}px` } }))] });
  }, [file, readOnly, dark, fontSize]);

  useEffect(() => {
    const v = view.current!;
    const cur = v.state.doc.toString();
    const m: { from: number; to: number; cls: string }[] = [];
    if (highlight) {
      const i = value.indexOf(highlight);
      if (i >= 0) m.push({ from: i, to: i + highlight.length, cls: "cm-teach-highlight" });
    }
    if (readOnly && caret != null && caret <= value.length) m.push({ from: caret, to: caret, cls: "cm-ghost-caret" });
    const changes = cur === value ? undefined : { from: 0, to: cur.length, insert: value };
    v.dispatch({ changes, effects: setMarks.of(m) });
    const target = m[0]?.from ?? caret;
    if (target != null && target <= value.length) v.dispatch({ effects: EditorView.scrollIntoView(target, { y: "nearest", yMargin: 40 }) });
  }, [value, highlight, caret, readOnly, file]);

  return <div ref={host} className="h-full overflow-hidden" />;
}
