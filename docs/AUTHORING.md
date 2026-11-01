# Writing lessons for React Tutor

The course lives in `src/course/modules/mNN-name.js`. Each file is plain JavaScript that `export default`s one module object.
Shapes are documented in `src/course/types.ts`. `src/course/modules/m01-welcome.js` is the reference example: copy its style.

## Audience and tone (most important)

- Students know **nothing** about programming. Many are nervous. Assume zero knowledge; define every new word the first time.
- JavaScript only. Never TypeScript. Modern React (function components + hooks), React Router v7 imported from `"react-router"`.
- Warm, encouraging, never condescending. Never say "simply", "just", "obviously", "easy". Normalise mistakes ("errors are clues, not failures").
- One idea at a time. Show, then explain, then let them try. Use everyday analogies (labelled boxes, recipes, LEGO bricks, restaurant orders).
- Narration (`say`) is spoken by a text-to-speech voice. Write it like you talk: short sentences, 1-3 sentences per step, no markdown, no emoji, no code symbols read aloud (say "curly braces", "the arrow", "angle brackets" in words, or describe them). Keep each `say` under ~45 words.
- No external resources: never tell the student to visit a website. Everything they need is in the lesson, its notes, or the AI tutor "Kit".

## Lesson kinds

### `scrim` (the interactive screencast)
```js
{ kind: "scrim", id: "m05-map", title: "Transforming arrays with map", notes: `markdown`, files: { ... }, steps: [ ... ] }
```
- `files`: the project at time 0. Typical React project:
  - `index.html`: `<div id="root"></div>` + `<script type="module" src="index.js"></script>` (+ optional `<link rel="stylesheet" href="styles.css">`)
  - `index.js`: `import { createRoot } from "react-dom/client"; import App from "./App.jsx"; createRoot(document.getElementById("root")).render(<App />);`
  - `App.jsx`, other components, `styles.css`.
  - Plain-JS lessons: `index.html` + `index.js` only, output through `console.log` (shown in the console panel) or the DOM.
- Each step: `{ say, files?, open?, highlight?, path?, challenge? }`
  - `files` holds the **full new content** of each file the step changes. The player computes the difference and "types" it live, so make small, focused changes between steps (a few lines). Never restate unchanged files.
  - `highlight`: an exact substring of the open file to highlight after typing (to point at what you are talking about).
  - `path`: preview URL after the step (router lessons).
  - `challenge`: `{ task: "markdown", hints: ["...", "..."], tests: [...] }`. Playback pauses; the student edits; then the **next step's `files` must be the solution** (the instructor shows how they did it, warmly: "Here's how I did it. Yours might look different, and that's fine!").
- 8-18 steps per scrim. At least one challenge per scrim (two in longer ones). Recap at the end.
- `notes`: markdown summary (key ideas, code examples, common mistakes) the student can reread. 100-300 words.

### `practice`
```js
{ kind: "practice", id, title, type: "fill" | "fix" | "build", task: `markdown`, files: {...starter}, solution: {...changed files}, hints: [3 hints, gentle to specific], tests: [...] }
```
- `fill`: starter has blanks written as `___` (three underscores) to replace.
- `fix`: starter has 1-2 realistic beginner bugs (wrong name, missing return, missing key, mutating state, onClick={fn()}). The bug must be logical/runtime, **not** a syntax error, so the page still runs.
- `build`: a description + small starter; student writes most of it.
- The solution must pass every test and the starter must fail at least one.

### `quiz`
```js
{ kind: "quiz", id, title, questions: [{ q, code?, options: [...], answer: index, explain }] }
```
4-6 questions mixing "predict the output", "what does this do", "spot the bug". `explain` teaches, kindly, why.

## Tests (for challenges and practice)

`code` is the body of an async function run in the preview after the page loads. Return `false` or throw to fail. Helpers:
`$(sel)`, `$$(sel)` (array), `text(sel?)` (trimmed text, whole page if no selector), `click(sel|el)` (awaits), `type(sel|el, value)` (awaits, triggers React onChange), `wait(ms)`, `goto(path)` (awaits), `path()`, `logs` (array of console.log lines as strings), `files()` (the student's files).

- Test **behaviour**, not exact formatting: prefer `text().includes("Hello")`, `$$("li").length === 3`, `logs.some(l => l.includes("42"))`.
- For "use X" requirements check source: `/\.map\(/.test(files()["App.jsx"])`.
- Name tests as friendly checklist items: "The page shows a heading", "Clicking the button adds 1".
- After `click`/`type` that triggers fetches, `await wait(600)` (fake API delay is ~400ms).

## Sandbox facts

- Packages: `react`, `react-dom`, `react-dom/client`, `react-router`. Nothing else.
- Offline fake API via `fetch("/api/users")`, `/api/posts`, `/api/todos`, `/api/products`, `/api/recipes`, `/api/quotes`, and `/api/<name>/<id>`. See `scripts/sandbox/mockApi.js` for fields.
- Use `BrowserRouter` (declarative mode) for router basics; `createBrowserRouter` + `RouterProvider` only in the data-router lesson.

## JS string escaping inside module files

Lesson code lives inside JS template literals. Inside them, write `\${` for a literal `${` and `` \` `` for a literal backtick. Prefer single/double quotes in lesson code unless the lesson is about template literals.

## Every lesson has exercises

- Order lessons scrim → its practice → scrim → its practice …, quiz last. The validator requires at least as many
  practice lessons as scrims, a quiz, and at least one challenge **with tests** in every scrim.
- Starters must not throw while rendering (a `___` inside a JSX expression crashes the validator run); put blanks in
  text, strings or property names.
- Students can also ask Kit for unlimited extra practice on any lesson ("Practice this" / "More practice like this").

## Validate

```
MODULES=m05 npx vitest run src/course/validate.test.ts
```
Fix everything it reports. It checks compiling at every step, highlights, solutions passing tests, starters failing, quiz shapes.
