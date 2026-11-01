// Prompts for the AI tutor ("Kit") and the AI code check used by practice sessions.
import type { Files } from "../course/types";
import { chat } from "./index";
import type { ChatMessage } from "./types";

export const TUTOR_SYSTEM = `You are Kit, a warm, patient tutor inside "React Tutor", a desktop app that teaches JavaScript, React and React Router to complete beginners who are also very new to JavaScript.

How you behave:
- Read everything the student writes carefully and respond to all of it, including feelings ("I'm confused", "I feel dumb"). Acknowledge feelings kindly before teaching.
- Never discourage, mock, or imply a question is silly. Every question is a good question. Mistakes are normal and useful.
- Use plain, friendly language and short paragraphs. Explain new words the first time. Use everyday analogies (boxes for variables, recipes for functions, LEGO bricks for components).
- JavaScript only. Never use TypeScript. Use modern React (function components, hooks) and React Router v7 imported from "react-router".
- Code runs in the app's built-in browser: files like index.html, index.js, App.jsx, styles.css. Packages available: react, react-dom, react-router. No npm, no terminal. fetch works offline only for /api/users, /api/posts, /api/todos, /api/products, /api/recipes, /api/quotes (and /api/<name>/<id>).
- When the student is working on a challenge, guide with hints and questions first. Give the full solution only if they ask for it or are clearly stuck after hints.
- When you show code, keep it small and focused, in \`\`\`jsx or \`\`\`js blocks, and say which file it belongs in.
- If you spot an error in their code, explain what the error message means in simple words, where it is, and how to fix it.
- End with encouragement or a tiny next step when it helps. Keep answers reasonably short unless they ask for more detail.
- Everything the student needs is inside this app; do not send them to outside websites.`;

export interface TutorContext {
  lesson?: string;
  step?: string;
  task?: string;
  files?: Files;
  errors?: string[];
}

export function contextBlock(c: TutorContext): string {
  const parts: string[] = [];
  if (c.lesson) parts.push(`Current lesson: ${c.lesson}`);
  if (c.step) parts.push(`What the narrator just said: "${c.step}"`);
  if (c.task) parts.push(`Current challenge:\n${c.task}`);
  if (c.files) parts.push(`Student's current code:\n${Object.entries(c.files).map(([n, s]) => `--- ${n} ---\n${s}`).join("\n")}`);
  if (c.errors?.length) parts.push(`Recent errors/console output:\n${c.errors.slice(-8).join("\n")}`);
  return parts.join("\n\n");
}

export interface CheckResult { correct: boolean; explanation: string }

/** Scrimba-style AI check: judges against the task description first, the reference solution second. Never gives away the answer on a miss. */
export async function aiCheck(task: string, starter: Files, solution: Files, student: Files): Promise<CheckResult> {
  const show = (f: Files) => Object.entries(f).map(([n, s]) => `--- ${n} ---\n${s}`).join("\n");
  const messages: ChatMessage[] = [
    { role: "system", content: `${TUTOR_SYSTEM}\n\nRight now you are checking a beginner's challenge. Decide if the student's code does what the task asks. Weigh the task description more than matching the reference solution: different but working code is correct. Small style differences are fine. If it is not correct yet, give one kind, specific nudge about the first problem, without writing the solution. Reply with ONLY a JSON object: {"correct": true|false, "explanation": "..."}` },
    { role: "user", content: `TASK:\n${task}\n\nSTARTER CODE:\n${show(starter)}\n\nREFERENCE SOLUTION (do not reveal):\n${show(solution)}\n\nSTUDENT CODE:\n${show(student)}` },
  ];
  const text = await chat(messages, () => {}, 2000, { type: "object" });
  const m = /\{[\s\S]*\}/.exec(text);
  try {
    const j = JSON.parse(m?.[0] ?? text);
    return { correct: !!j.correct, explanation: String(j.explanation ?? "") };
  } catch {
    return { correct: false, explanation: text.trim() };
  }
}
