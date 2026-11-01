import { expect, test } from "vitest";
import type { ScrimLesson } from "../course/types";
import { buildTimeline, diff, frameAt } from "./timeline";

const lesson: ScrimLesson = {
  kind: "scrim", id: "t", title: "t", notes: "",
  files: { "App.jsx": "hello world" },
  steps: [
    { say: "intro" },
    { say: "type", files: { "App.jsx": "hello big world" } },
    { say: "new file", files: { "b.js": "abc" }, open: "b.js" },
  ],
};

test("diff finds the changed middle", () => {
  expect(diff("hello world", "hello big world")).toEqual({ at: 6, removedEnd: 6, inserted: "big " });
  expect(diff("aXc", "aYYc")).toEqual({ at: 1, removedEnd: 2, inserted: "YY" });
  expect(diff("", "abc")).toEqual({ at: 0, removedEnd: 0, inserted: "abc" });
});

test("frames type the diff and seeking is exact", () => {
  const tl = buildTimeline(lesson, [2, 2, 2]);
  expect(tl.total).toBe(6);
  expect(frameAt(tl, 0, lesson.files).files["App.jsx"]).toBe("hello world");
  const mid = frameAt(tl, 2 + tl.segments[1].typeDur * 0.6, lesson.files);
  expect(mid.typing).toBe(true);
  expect(mid.files["App.jsx"]).toBe("hello biworld");
  expect(frameAt(tl, 3.9, lesson.files).files["App.jsx"]).toBe("hello big world");
  const end = frameAt(tl, 6, lesson.files);
  expect(end.files).toEqual({ "App.jsx": "hello big world", "b.js": "abc" });
  expect(end.open).toBe("b.js");
});
