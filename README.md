# React Tutor

A Scrimba-style desktop app (Tauri 2 + React) that teaches JavaScript, React and React Router to complete beginners.
Lessons are "scrims": the teacher's code types itself into a real editor next to a live mini-browser, narrated by a local
voice. Pause any time and the editor is yours.

## What's inside

- **Course** (`src/course/modules/*.js`): 20 modules, ~140 lessons. JS foundations, React, React Router, a capstone.
  Every module alternates narrated lesson → practice exercise, with a quiz at the end. Nothing is locked.
- **Scrim player** (`src/player/`): timeline of narration + code snapshots (`timeline.ts`), CodeMirror editor, challenges that
  pause playback, purple challenge markers, captions, speed, "My code" vs "Lesson code".
- **Preview sandbox** (`scripts/sandbox/`, built to `public/sandbox/runtime.js`): runs student files with Sucrase + bundled
  React, ReactDOM and React Router; console capture, friendly error explanations, address bar, offline fake `/api/*`.
- **Kit, the AI tutor** (`src/ai/`, `src/Tutor.tsx`): providers ported from Scout: any OpenAI-compatible API (60+ presets),
  Anthropic, **Sign in with ChatGPT** (your ChatGPT plan, tokens in the OS keychain), and the Claude Code / Codex CLIs.
  Students load each provider's model list and pick the model they study with.
- **Learn anything**: Kit writes a whole interactive lesson (plus a practice exercise) on any topic the student asks for.
- **Change this lesson**: mid-lesson, the student says or types what they need ("explain again slower", "use a pet shop
  example") and Kit splices new narrated steps into the running lesson.
- **Narration** (`tts/server.py`, `src/narration.ts`): Kitten TTS in a private uv-managed Python venv.
  NVIDIA GPU with 6 GB+ → Kitten TTS 2 on CUDA; otherwise Kitten mini 0.8 (or nano 0.8 int8) on CPU.
  Falls back to the system voice until set up (Settings → Voice & microphone).
- **Microphone**: the same local engine runs Whisper for speech-to-text, so students can talk to Kit.

## Develop

```bash
npm install
npm run tauri dev
```

Tests (timeline, providers, and a validator that runs every lesson's code and tests in happy-dom):

```bash
npm test
MODULES=m05 npx vitest run src/course/validate.test.ts
```

Manual AI check against a real model (skipped unless the env vars are set):

```bash
LLM_URL=http://host:port/v1 LLM_KEY=... LLM_MODEL=... npx vitest run src/ai/llm.manual.test.ts
```

Writing lessons: see `docs/AUTHORING.md`.

## Build

```bash
npm run tauri build
```

The narration engine needs [uv](https://docs.astral.sh/uv/); the app offers to install it on first setup.
Kitten TTS 2 weights use the Stellon Labs Community License; the 0.8 ONNX models are Apache-2.0.
