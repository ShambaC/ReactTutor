// Course data shapes. Lesson content lives in src/course/modules/*.js (plain JavaScript objects).
export type Files = Record<string, string>;

/** A check that runs inside the preview. `code` is an async function body; return false or throw to fail.
 * Helpers in scope: $, $$, text(sel?), click(sel), type(sel, value), wait(ms), goto(path), path(), logs, files(). */
export interface Test { name: string; code: string }

export interface Challenge {
  /** What to do, in markdown. Shown when playback pauses here. */
  task: string;
  hints?: string[];
  tests?: Test[];
}

export interface Step {
  /** Narration (spoken and shown as captions). */
  say: string;
  /** Full new content of every file this step changes; the player types the difference out. */
  files?: Files;
  /** File to show while this step plays (defaults to the first changed file). */
  open?: string;
  /** Text in the open file to highlight once typing is done. */
  highlight?: string;
  /** Path to show in the preview browser after this step (React Router lessons). */
  path?: string;
  /** Playback pauses at the end of this step and the student takes over. */
  challenge?: Challenge;
}

export interface ScrimLesson {
  kind: "scrim";
  id: string;
  title: string;
  /** Files at time 0. */
  files: Files;
  steps: Step[];
  /** Markdown summary the student can reread any time. */
  notes: string;
}

export interface PracticeLesson {
  kind: "practice";
  id: string;
  title: string;
  /** "fill" = fill in blanks, "fix" = fix the bug, "build" = build from a description. */
  type: "fill" | "fix" | "build";
  /** Markdown instructions. */
  task: string;
  files: Files;
  solution: Files;
  hints: string[];
  tests: Test[];
}

export interface QuizQuestion {
  q: string;
  code?: string;
  options: string[];
  answer: number;
  /** Why the answer is right, in friendly words. */
  explain: string;
}

export interface QuizLesson { kind: "quiz"; id: string; title: string; questions: QuizQuestion[] }

export type Lesson = ScrimLesson | PracticeLesson | QuizLesson;

export interface Module { id: string; title: string; summary: string; lessons: Lesson[] }
