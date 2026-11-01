// Turns a scrim lesson (steps with full file snapshots) plus per-step narration durations into a seekable timeline.
// The editor state at any time t is derived, never accumulated, so seeking anywhere is exact.
import type { Files, ScrimLesson, Step } from "../course/types";

const CPS = 24; // instructor typing speed, characters per second
const TAIL = 0.15; // fraction of a step left after typing ends

export interface Edit { file: string; at: number; removedEnd: number; inserted: string }
export interface Segment { start: number; dur: number; typeDur: number; edits: Edit[]; before: Files; after: Files; open: string; step: Step }
export interface Timeline { segments: Segment[]; total: number }
export interface Frame {
  index: number;
  files: Files;
  open: string;
  /** Caret position in the open file while typing (or after it). */
  caret?: number;
  typing: boolean;
  highlight?: string;
}

export function diff(before: string, after: string): { at: number; removedEnd: number; inserted: string } {
  let p = 0;
  const max = Math.min(before.length, after.length);
  while (p < max && before[p] === after[p]) p++;
  let s = 0;
  while (s < max - p && before[before.length - 1 - s] === after[after.length - 1 - s]) s++;
  return { at: p, removedEnd: before.length - s, inserted: after.slice(p, after.length - s) };
}

export function buildTimeline(lesson: ScrimLesson, durations: number[]): Timeline {
  let files = { ...lesson.files };
  let open = Object.keys(files).find((f) => /\.jsx?$/.test(f) && f !== "index.js") ?? Object.keys(files)[0] ?? "index.js";
  let start = 0;
  const segments = lesson.steps.map((step, i) => {
    const before = files;
    const after = { ...before, ...step.files };
    const edits = Object.keys(step.files ?? {})
      .filter((f) => (before[f] ?? "") !== after[f])
      .map((f) => ({ file: f, ...diff(before[f] ?? "", after[f]) }));
    const chars = edits.reduce((n, e) => n + e.inserted.length, 0);
    const dur = Math.max(durations[i] ?? 0, 1);
    const typeDur = chars ? Math.min(dur * (1 - TAIL), Math.max(0.3, chars / CPS)) : 0;
    open = step.open ?? edits[0]?.file ?? open;
    const seg: Segment = { start, dur, typeDur, edits, before, after, open, step };
    start += dur;
    files = after;
    return seg;
  });
  return { segments, total: start };
}

export function segmentAt(tl: Timeline, t: number): number {
  const i = tl.segments.findIndex((s) => t < s.start + s.dur);
  return i < 0 ? tl.segments.length - 1 : i;
}

export function frameAt(tl: Timeline, t: number, initial: Files): Frame {
  if (!tl.segments.length) return { index: 0, files: initial, open: Object.keys(initial)[0], typing: false };
  const index = segmentAt(tl, t);
  const seg = tl.segments[index];
  const e = Math.max(0, t - seg.start);
  const total = seg.edits.reduce((n, x) => n + x.inserted.length, 0);
  if (!seg.edits.length || e >= seg.typeDur) {
    const last = seg.edits.find((x) => x.file === seg.open) ?? seg.edits.at(-1);
    return { index, files: seg.after, open: seg.open, typing: false, highlight: seg.step.highlight, caret: last && last.file === seg.open ? last.at + last.inserted.length : undefined };
  }
  let k = Math.floor((total * e) / seg.typeDur);
  const files = { ...seg.before };
  for (const x of seg.edits) {
    const before = seg.before[x.file] ?? "";
    const n = Math.min(k, x.inserted.length);
    files[x.file] = before.slice(0, x.at) + x.inserted.slice(0, n) + before.slice(x.removedEnd);
    if (n < x.inserted.length) {
      return { index, files, open: x.file, caret: x.at + n, typing: true };
    }
    files[x.file] = seg.after[x.file];
    k -= n;
  }
  return { index, files: seg.after, open: seg.open, typing: false };
}

/** Narration length guess (seconds) when no audio exists yet. */
export const estimateSeconds = (text: string) => Math.max(1.5, text.split(/\s+/).length / 2.6 + 0.5);
