// Tiny persisted stores (localStorage in the app's webview). Secrets never go here: API keys and ChatGPT tokens live in the OS keychain.
import { useSyncExternalStore } from "react";
import type { Lesson } from "./course/types";

/** `key` null = in-memory only. */
export function persisted<T extends object>(key: string | null, initial: T) {
  let value: T = initial;
  if (key) try { value = { ...initial, ...JSON.parse(localStorage.getItem(key) ?? "{}") }; } catch { /* first run or cleared storage */ }
  const subs = new Set<() => void>();
  const get = () => value;
  const set = (f: (v: T) => T) => {
    value = f(value);
    if (key) try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage full: keep in memory */ }
    subs.forEach((s) => s());
  };
  const subscribe = (s: () => void) => { subs.add(s); return () => { subs.delete(s); }; };
  const use = () => useSyncExternalStore(subscribe, get);
  return { get, set, use };
}

/** Per-lesson progress and the student's own code. */
export interface Progress {
  done: Record<string, true>;
  /** Student's edited files per lesson (kept separate from the instructor's code, like Scrimba). */
  code: Record<string, Record<string, string>>;
  /** Wrong quiz answers to revisit in Review. key = lessonId#questionIndex */
  review: Record<string, number>;
  last?: string;
  notes: Record<string, string>;
  /** Where the student left each narrated lesson (step index), so Home can resume it. */
  pos: Record<string, number>;
  /** Lessons the AI made on topics the student chose. */
  custom: Lesson[];
}
export const progress = persisted<Progress>("rt.progress", { done: {}, code: {}, review: {}, notes: {}, pos: {}, custom: [] });

export const markDone = (id: string) => progress.set((p) => {
  const pos = { ...p.pos };
  delete pos[id]; // finished: next visit starts from the top
  return { ...p, done: { ...p.done, [id]: true }, pos };
});

export interface Prefs {
  theme: "dark" | "light";
  voice: string;
  /** "auto" picks from hardware; "browser" = system speech voices. */
  engine: "auto" | "gpu" | "cpu-mini" | "cpu-nano" | "browser" | "off";
  rate: number;
  captions: boolean;
  fontSize: number;
  speakReplies: boolean;
  /** Narration and read-aloud volume, 0 to 1. */
  volume: number;
}
export const prefs = persisted<Prefs>("rt.prefs", { theme: "dark", voice: "Bella", engine: "auto", rate: 1, captions: true, fontSize: 14, speakReplies: false, volume: 1 });

export const errText = (e: unknown) => (e instanceof Error ? e.message : String(e));
