// Manual: exercises the lesson generators against a real OpenAI-compatible model.
// LLM_URL=... LLM_KEY=... LLM_MODEL=... npx vitest run src/ai/llm.manual.test.ts
import { expect, test, vi } from "vitest";

vi.mock("./index", async () => ({
  chat: async (messages: unknown, onDelta: (t: string) => void, max_tokens: number, json?: object) => {
    const { stripThink } = await vi.importActual<typeof import("./index")>("./index");
    const r = await fetch(`${process.env.LLM_URL}/chat/completions`, {
      method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${process.env.LLM_KEY}` },
      body: JSON.stringify({ model: process.env.LLM_MODEL, messages, max_tokens, ...(json && { response_format: { type: "json_object" } }) }),
    });
    const j = await r.json();
    const t = stripThink(j.choices[0].message.content as string);
    onDelta(t);
    return t;
  },
}));

const run = process.env.LLM_URL ? test : test.skip;

run("generateLesson + adaptLesson + generatePractice + aiCheck", async () => {
  const { generateLesson, adaptLesson, generatePractice } = await import("./generate");
  const { aiCheck } = await import("./tutor");
  const l = await generateLesson("How do I make a button that counts clicks?", ["Welcome to React Tutor"]);
  console.log("LESSON", l.title, l.steps.length, "steps,", l.steps.filter((s) => s.files).length, "with code,", l.steps.filter((s) => s.challenge).length, "challenges");
  expect(l.steps.length).toBeGreaterThan(2);
  const steps = await adaptLesson(l, 2, { ...l.files, ...l.steps.slice(0, 3).reduce((a, s) => ({ ...a, ...s.files }), {}) }, "explain that again with a cat example");
  console.log("ADAPT", steps.length, steps.map((s) => s.say.slice(0, 60)));
  const ex = await generatePractice(l);
  console.log("PRACTICE", ex.type, ex.title, Object.keys(ex.files), ex.hints.length);
  const ok = await aiCheck(ex.task, ex.files, ex.solution, { ...ex.files, ...ex.solution });
  const bad = await aiCheck(ex.task, ex.files, ex.solution, ex.files);
  console.log("CHECK solution:", ok, "\nCHECK starter:", bad);
}, 600_000);
