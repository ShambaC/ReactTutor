// AI-made lesson content: whole lessons on any topic the student picks, and new steps spliced into a running lesson
// when the student asks for something different ("explain again", "show it with cats", "let me build X").
import { transform } from "sucrase";
import type { Files, Lesson, PracticeLesson, ScrimLesson, Step } from "../course/types";
import { chat } from "./index";
import { TUTOR_SYSTEM } from "./tutor";

const FORMAT = `Reply with ONLY one JSON object, no prose before or after, no markdown fences.
Each step is: {"say": "...", "files": {"<file name>": "<the FULL new content of that file>"}, "highlight": "<exact text from that file to point at>", "challenge": {"task": "...", "hints": ["..."]}}
- "say" is spoken aloud by a text-to-speech voice: 1-3 short friendly sentences (under 45 words), no markdown, no emoji, describe symbols in words.
- "files" is optional; include it only when the step changes code, and then give the complete content of each changed file. Change only a few lines per step so the student can follow the typing.
- "highlight" and "challenge" are optional. A challenge pauses the lesson so the student tries it; the step right after a challenge must show the solution in "files" and say kindly that other answers are fine too.
- Project files: index.html (with <div id="root"></div> and <script type="module" src="index.js"></script>), index.js, App.jsx, optional styles.css. Plain-JavaScript topics can use just index.html + index.js and console.log.
- React apps: index.js does createRoot(document.getElementById("root")).render(<App />) and imports App from "./App.jsx". Only react, react-dom and react-router are available. fetch works offline only for /api/users, /api/posts, /api/todos, /api/products, /api/recipes, /api/quotes.
- JavaScript only, never TypeScript.`;

function extractJson(text: string): any {
  const t = text.replace(/^```(?:json)?\s*/m, "").replace(/```\s*$/m, "");
  const i = t.indexOf("{"), j = t.lastIndexOf("}");
  if (i < 0 || j < i) throw new Error("the AI didn't send a lesson back");
  return JSON.parse(t.slice(i, j + 1));
}

function compileError(files: Files): string | null {
  for (const [n, s] of Object.entries(files)) {
    if (!/\.jsx?$/.test(n)) continue;
    try { transform(s, { transforms: ["jsx", "imports"], jsxRuntime: "automatic", production: true, filePath: n }); }
    catch (e) { return `${n}: ${(e as Error).message}`; }
  }
  return null;
}

const asFiles = (v: unknown): Files => (v && typeof v === "object" ? Object.fromEntries(Object.entries(v).filter(([, c]) => typeof c === "string")) as Files : {});

/** Small models wrap the list differently ({steps}, {lesson: {steps}}, a bare array, one step); find it. */
function stepsOf(j: any): unknown[] {
  if (Array.isArray(j)) return j;
  if (!j || typeof j !== "object") return [];
  if (Array.isArray(j.steps)) return j.steps;
  if (typeof j.say === "string") return [j];
  for (const v of Object.values(j)) { const s = stepsOf(v); if (s.length) return s; }
  return [];
}

/** Keeps only well-formed steps; drops code changes that wouldn't compile so the lesson never shows broken instructor code. */
function cleanSteps(raw: unknown, start: Files): Step[] {
  let files = { ...start };
  const out: Step[] = [];
  for (const r of stepsOf(raw) as any[]) {
    if (r && typeof r.say !== "string") r.say = r.text ?? r.narration ?? r.explanation;
    if (!r || typeof r.say !== "string" || !r.say.trim()) continue;
    const step: Step = { say: r.say.trim() };
    const f = asFiles(r.files);
    if (Object.keys(f).length && !compileError({ ...files, ...f })) { step.files = f; files = { ...files, ...f }; }
    if (typeof r.highlight === "string" && Object.values(files).some((c) => c.includes(r.highlight))) step.highlight = r.highlight;
    if (r.challenge && typeof r.challenge.task === "string") step.challenge = { task: r.challenge.task, hints: Array.isArray(r.challenge.hints) ? r.challenge.hints.filter((h: unknown) => typeof h === "string") : [] };
    out.push(step);
  }
  // a challenge pauses for the student, so it only makes sense when the next step shows a solution
  out.forEach((s, i) => { if (s.challenge && !out[i + 1]?.files) delete s.challenge; });
  return out;
}

const HTML = '<!doctype html>\n<html>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="index.js"></script>\n  </body>\n</html>\n';

/** Models often send only a component file; add the page and entry file the preview needs to show it. */
function runnable(files: Files): Files {
  const f = { ...files };
  if (!f["index.html"]) f["index.html"] = HTML;
  if (!f["index.js"]) {
    const comp = Object.keys(f).find((n) => /\.jsx$/.test(n) && /export\s+default/.test(f[n]));
    const js = Object.keys(f).find((n) => /\.js$/.test(n));
    if (comp) f["index.js"] = `import { createRoot } from "react-dom/client";\nimport App from "./${comp}";\n\ncreateRoot(document.getElementById("root")).render(<App />);\n`;
    else if (js) f["index.html"] = f["index.html"].replace('src="index.js"', `src="${js}"`);
    else f["index.js"] = "";
  }
  return f;
}

async function ask(prompt: string, retryNote?: string): Promise<any> {
  const text = await chat([
    { role: "system", content: `${TUTOR_SYSTEM}\n\nRight now you are writing interactive lesson content for the app's lesson player.\n${FORMAT}` },
    { role: "user", content: retryNote ? `${prompt}\n\nYour previous reply couldn't be used (${retryNote}). Please reply with valid JSON only.` : prompt },
  ], () => {}, 8000, { type: "object" });
  return extractJson(text);
}

async function withRetry<T>(f: (note?: string) => Promise<T>): Promise<T> {
  try { return await f(); } catch (e) { return f((e as Error).message.slice(0, 200)); }
}

/** A whole new lesson on whatever the student wants to learn. */
export async function generateLesson(topic: string, known: string[]): Promise<ScrimLesson> {
  return withRetry(async (note) => {
    const j = await ask(`The student wants to learn: "${topic}".
Topics they have already finished: ${known.length ? known.join("; ") : "none yet (complete beginner)"}.
Write one interactive lesson (8-14 steps, at least one challenge) as:
{"title": "...", "notes": "<markdown summary with key ideas and small code examples, 100-250 words>", "files": {<starting files>}, "steps": [ ... ]}`, note);
    const files = runnable(asFiles(j.files));
    if (compileError(files)) throw new Error(`starting code doesn't compile: ${compileError(files)}`);
    const steps = cleanSteps(j.steps ?? j, files);
    if (steps.length < 3) throw new Error("too few usable steps");
    return { kind: "scrim", id: `custom-${Date.now().toString(36)}`, title: String(j.title || topic).slice(0, 80), notes: String(j.notes ?? ""), files, steps };
  });
}

/** New steps to play next, adapting the running lesson to what the student just asked for. */
export async function adaptLesson(lesson: ScrimLesson, at: number, files: Files, request: string): Promise<Step[]> {
  return withRetry(async (note) => {
    const done = lesson.steps.slice(0, at + 1).map((s) => s.say).join(" ");
    const show = Object.entries(files).map(([n, s]) => `--- ${n} ---\n${s}`).join("\n");
    const j = await ask(`We are in the middle of the lesson "${lesson.title}". So far the narrator said: "${done.slice(-1500)}"
The code right now is:
${show}

The student just said: "${request}"
Respond to exactly what they asked (explain differently, slow down, give another example, go deeper, try their own idea, etc.). Write 3-8 new steps that continue from the current code, as:
{"steps": [ ... ]}`, note);
    const steps = cleanSteps(j, files);
    if (!steps.length) throw new Error(`no usable steps in: ${JSON.stringify(j).slice(0, 300)}`);
    return steps;
  });
}

/** A fresh practice exercise on the same ideas as `lesson` (checked by Kit, since AI-written tests aren't trustworthy). */
export async function generatePractice(lesson: Lesson, request = ""): Promise<PracticeLesson> {
  const about = lesson.kind === "scrim" ? `${lesson.title}\n${lesson.notes}` : lesson.kind === "practice" ? `${lesson.title}\n${lesson.task}` : lesson.title;
  return withRetry(async (note) => {
    const j = await ask(`Make one new practice exercise for a beginner who just studied:
${about.slice(0, 2500)}
${request ? `The student asked for: "${request}"` : "Make it a little different from the lesson's own examples."}
Choose the type that fits: "fill" (starter code with ___ blanks), "fix" (starter with one realistic beginner bug that still runs), or "build" (small description + minimal starter).
Reply as: {"title": "Practice: ...", "type": "fill"|"fix"|"build", "task": "<markdown instructions with a numbered checklist>", "files": {<complete starter files>}, "solution": {<complete solved versions of the files that change>}, "hints": ["gentle", "more specific", "nearly the answer"]}`, note);
    const solution = asFiles(j.solution);
    if (!Object.keys(solution).length) throw new Error("missing solution files");
    const files = runnable({ ...Object.fromEntries(Object.keys(solution).map((n) => [n, ""])), ...asFiles(j.files) });
    const bad = compileError({ ...files, ...solution });
    if (bad) throw new Error(`solution doesn't compile: ${bad}`);
    return {
      kind: "practice", id: `custom-${Date.now().toString(36)}`, title: String(j.title || `Practice: ${lesson.title}`).slice(0, 80),
      type: ["fill", "fix", "build"].includes(j.type) ? j.type : "build", task: String(j.task ?? ""), files, solution,
      hints: Array.isArray(j.hints) ? j.hints.filter((h: unknown) => typeof h === "string") : [], tests: [],
    };
  });
}
