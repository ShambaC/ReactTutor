// @vitest-environment happy-dom
// @vitest-environment-options {"url": "http://localhost/"}
// Checks every lesson: code compiles at every step, highlights exist, challenge/practice tests pass on the solution
// (and practice starters fail at least one). Run one module: MODULES=05 npx vitest run src/course/validate.test.ts
import { describe, expect, test } from "vitest";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Client from "react-dom/client";
import * as JSXRuntime from "react/jsx-runtime";
import * as JSXDev from "react/jsx-dev-runtime";
import * as Router from "react-router";
import { transform } from "sucrase";
import { MOCK_API } from "../../scripts/sandbox/mockApi.js";
import { MODULES } from "./index";
import type { Files, Lesson, Test } from "./types";

const only = (process.env.MODULES ?? "").split(",").filter(Boolean);
const mods = MODULES.filter((m) => !only.length || only.some((o) => m.id.startsWith(o)));
const roots: Client.Root[] = [];
const PACKAGES: Record<string, unknown> = {
  react: React, "react-dom": ReactDOM, "react/jsx-runtime": JSXRuntime, "react/jsx-dev-runtime": JSXDev, "react-router": Router, "react-router-dom": Router,
  "react-dom/client": { ...Client, createRoot: (el: Element, o?: Client.RootOptions) => { const r = Client.createRoot(el, o); roots.push(r); return r; } },
};
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const realFetch = globalThis.fetch;
globalThis.fetch = (async (input: any, init?: any) => {
  const url = new URL(typeof input === "string" ? input : input.url, "http://localhost");
  const parts = url.pathname.replace(/\/$/, "").split("/");
  if (parts[1] !== "api") return realFetch(input, init);
  let data: any = (MOCK_API as any)[parts[2]];
  if (data && parts[3]) data = data.find((x: any) => String(x.id) === parts[3]);
  return new Response(JSON.stringify(data ?? { error: "Not found" }), { status: data ? 200 : 404, headers: { "content-type": "application/json" } });
}) as typeof fetch;

export function compile(name: string, src: string) {
  return transform(src, { transforms: ["jsx", "imports"], jsxRuntime: "automatic", production: true, filePath: name }).code;
}

function resolve(files: Files, from: string, spec: string) {
  if (!spec.startsWith(".") && !spec.startsWith("/")) return spec;
  const base = from.split("/").slice(0, -1);
  for (const part of spec.split("/")) { if (part === "..") base.pop(); else if (part !== "." && part !== "") base.push(part); }
  const p = base.join("/");
  return [p, p + ".jsx", p + ".js"].find((c) => c in files) ?? p;
}

/** Same behavior as scripts/sandbox/runtime.js, in happy-dom. Returns runtime errors and logs. */
async function run(files: Files, path = "/") {
  for (const r of roots.splice(0)) r.unmount();
  const errors: string[] = [], logs: string[] = [];
  const cache: Record<string, { exports: any }> = {};
  const load = (name: string): any => {
    if (PACKAGES[name]) return PACKAGES[name];
    if (cache[name]) return cache[name].exports;
    if (!(name in files)) throw new Error(`missing file ${name}`);
    if (name.endsWith(".css")) return {};
    const mod = (cache[name] = { exports: {} as any });
    new Function("require", "module", "exports", "console", compile(name, files[name]))((s: string) => load(resolve(files, name, s)), mod, mod.exports, con);
    return mod.exports;
  };
  const con = { ...console, log: (...a: any[]) => logs.push(a.map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join(" ")), error: (...a: any[]) => { const s = a.map(String).join(" "); if (!/unique "key"|act\(/.test(s)) errors.push(s); }, warn: () => {}, info: () => {}, clear: () => {} };
  const origErr = console.error;
  console.error = con.error;
  history.replaceState(null, "", path);
  const html = files["index.html"] ?? '<div id="root"></div><script type="module" src="index.js"></script>';
  const doc = new DOMParser().parseFromString(html, "text/html");
  const scripts = [...doc.querySelectorAll("script")];
  scripts.forEach((s) => s.remove());
  document.body.innerHTML = doc.body.innerHTML;
  for (const s of scripts) {
    try { const src = s.getAttribute("src"); if (src) load(resolve(files, "", src.replace(/^\//, "./"))); }
    catch (e) { errors.push(String(e)); }
  }
  await sleep(150);
  console.error = origErr;
  return { errors, logs };
}

async function runTests(files: Files, tests: Test[], path?: string) {
  const { logs } = await run(files, path);
  const helpers = {
    $: (s: string) => document.querySelector(s), $$: (s: string) => [...document.querySelectorAll(s)],
    text: (s?: string) => (s ? document.querySelector(s)?.textContent ?? "" : document.body.textContent ?? "").replace(/\s+/g, " ").trim(),
    wait: sleep, path: () => location.pathname, logs, files: () => files,
    click: async (el: any) => { (typeof el === "string" ? document.querySelector<HTMLElement>(el) : el)?.click(); await sleep(60); },
    type: async (el: any, v: string) => {
      const i = typeof el === "string" ? document.querySelector<HTMLInputElement>(el) : el;
      if (!i) return;
      const proto = i.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, "value")!.set!.call(i, v);
      i.dispatchEvent(new Event("input", { bubbles: true }));
      await sleep(60);
    },
    goto: async (p: string) => { history.pushState(null, "", p); dispatchEvent(new PopStateEvent("popstate")); await sleep(60); },
  };
  const out: { name: string; ok: boolean; error?: string }[] = [];
  for (const t of tests) {
    try {
      const ok = await new Function(...Object.keys(helpers), `return (async () => { ${t.code} })()`)(...Object.values(helpers));
      out.push({ name: t.name, ok: ok !== false });
    } catch (e) { out.push({ name: t.name, ok: false, error: String(e) }); }
  }
  return out;
}

const compiles = (files: Files, where: string) => {
  for (const [n, s] of Object.entries(files)) if (/\.jsx?$/.test(n)) {
    try { compile(n, s); } catch (e) { throw new Error(`${where}: ${n} does not compile: ${(e as Error).message}`); }
  }
};

test("lesson ids are unique", () => {
  const ids = MODULES.flatMap((m) => m.lessons.map((l) => l.id));
  expect(ids.filter((x, i) => ids.indexOf(x) !== i)).toEqual([]);
});

for (const m of mods) describe(`${m.id} ${m.title}`, () => {
  test("every lesson has exercises", () => {
    const count = (k: string) => m.lessons.filter((l) => l.kind === k).length;
    for (const l of m.lessons) if (l.kind === "scrim") expect(l.steps.some((s) => s.challenge?.tests?.length), `${l.id} needs a challenge with tests`).toBe(true);
    if (m.lessons.length) {
      expect(count("practice"), "one practice exercise per scrim lesson").toBeGreaterThanOrEqual(count("scrim"));
      expect(count("quiz"), "a quiz").toBeGreaterThan(0);
    }
  });
  for (const l of m.lessons as Lesson[]) test(`${l.id} (${l.kind})`, async () => {
    if (l.kind === "quiz") {
      expect(l.questions.length).toBeGreaterThan(0);
      for (const q of l.questions) { expect(q.options.length, q.q).toBeGreaterThan(1); expect(q.answer, q.q).toBeLessThan(q.options.length); expect(q.explain, q.q).toBeTruthy(); }
      return;
    }
    if (l.kind === "practice") {
      compiles(l.files, "starter");
      compiles(l.solution, "solution");
      expect(l.tests.length, "practice needs tests").toBeGreaterThan(0);
      const sol = await runTests({ ...l.files, ...l.solution }, l.tests);
      expect(sol.filter((r) => !r.ok), "solution must pass every test").toEqual([]);
      const start = await runTests(l.files, l.tests);
      expect(start.some((r) => !r.ok), "starter should fail at least one test").toBe(true);
      return;
    }
    let files = { ...l.files };
    compiles(files, "initial files");
    for (const [i, s] of l.steps.entries()) {
      expect(s.say.trim(), `step ${i} narration`).toBeTruthy();
      files = { ...files, ...s.files };
      compiles(files, `step ${i}`);
      if (s.highlight) {
        const open = s.open ?? Object.keys(s.files ?? {})[0];
        const inAny = Object.values(files).some((c) => c.includes(s.highlight!));
        expect(open ? files[open]?.includes(s.highlight) || inAny : inAny, `step ${i} highlight "${s.highlight}" not found`).toBe(true);
      }
      if (s.challenge?.tests?.length) {
        // the instructor's next step is the solution
        const solved = { ...files, ...l.steps[i + 1]?.files };
        const r = await runTests(solved, s.challenge.tests, s.path);
        expect(r.filter((x) => !x.ok), `step ${i} challenge tests must pass on step ${i + 1}'s code`).toEqual([]);
      }
    }
    const { errors } = await run(files);
    expect(errors, "final code should run without errors").toEqual([]);
  }, 20000);
});
