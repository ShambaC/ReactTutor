// Runs inside the preview iframe (public/sandbox/index.html). The parent posts the student's files; we compile
// each .js/.jsx with Sucrase into a CommonJS function, wire `require` to the bundled packages and to the other
// files, and forward console output, errors and the current URL back to the parent.
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactDOMClient from "react-dom/client";
import * as JSXRuntime from "react/jsx-runtime";
import * as JSXDevRuntime from "react/jsx-dev-runtime";
import * as Router from "react-router";
import { transform } from "sucrase";
import { MOCK_API } from "./mockApi.js";

const PACKAGES = {
  react: React,
  "react-dom": ReactDOM,
  "react-dom/client": ReactDOMClient,
  "react/jsx-runtime": JSXRuntime,
  "react/jsx-dev-runtime": JSXDevRuntime,
  "react-router": Router,
  "react-router-dom": Router, // older tutorials import from here; same API in v7
};

const post = (msg) => parent.postMessage({ source: "sandbox", ...msg }, "*");

// ---------- console ----------
function show(v, depth = 0, seen = new Set()) {
  if (typeof v === "string") return depth ? JSON.stringify(v) : v;
  if (v === undefined) return "undefined";
  if (v === null || typeof v === "number" || typeof v === "boolean") return String(v);
  if (typeof v === "bigint") return v + "n";
  if (typeof v === "symbol") return v.toString();
  if (typeof v === "function") return `ƒ ${v.name || "anonymous"}()`;
  if (v instanceof Error) return `${v.name}: ${v.message}`;
  if (v instanceof Element) return `<${v.tagName.toLowerCase()}>`;
  if (seen.has(v)) return "[circular]";
  if (depth > 3) return Array.isArray(v) ? "[…]" : "{…}";
  seen.add(v);
  if (v && v.$$typeof) return `<${typeof v.type === "string" ? v.type : v.type?.name || "Component"} />`; // a JSX element
  if (Array.isArray(v)) return `[${v.map((x) => show(x, depth + 1, seen)).join(", ")}]`;
  const body = Object.keys(v).map((k) => `${k}: ${show(v[k], depth + 1, seen)}`).join(", ");
  return body ? `{ ${body} }` : "{}";
}
for (const level of ["log", "info", "warn", "error", "debug"]) {
  const orig = console[level].bind(console);
  console[level] = (...args) => {
    orig(...args);
    let text = args.map((a) => show(a)).join(" ");
    // React dev warnings use %s placeholders
    if (typeof args[0] === "string" && args[0].includes("%s")) {
      let i = 1;
      text = args[0].replace(/%s/g, () => show(args[i++])) + (args.length > i ? " " + args.slice(i).map((a) => show(a)).join(" ") : "");
    }
    post({ type: "console", level, text });
  };
}
console.clear = () => post({ type: "console-clear" });

function reportError(err) {
  const e = err instanceof Error ? err : new Error(String(err));
  const m = /\((\w[\w.-]*\.(?:jsx?|css)):(\d+)/.exec(e.stack || "") || /at (\w[\w.-]*\.jsx?):(\d+)/.exec(e.stack || "");
  post({ type: "error", name: e.name, message: e.message, file: m?.[1], line: m ? Number(m[2]) : undefined });
}
window.addEventListener("error", (ev) => { ev.preventDefault(); reportError(ev.error || ev.message); });
window.addEventListener("unhandledrejection", (ev) => { ev.preventDefault(); reportError(ev.reason); });

// ---------- URL bar ----------
const sendUrl = () => post({ type: "url", path: location.pathname + location.search + location.hash });
for (const fn of ["pushState", "replaceState"]) {
  const orig = history[fn].bind(history);
  history[fn] = (...a) => { orig(...a); sendUrl(); };
}
window.addEventListener("popstate", sendUrl);
window.addEventListener("hashchange", sendUrl);
// links without a router would load a real page and lose the sandbox; keep them in-page
document.addEventListener("click", (ev) => {
  const a = ev.target.closest?.("a[href]");
  if (!a || ev.defaultPrevented || a.target === "_blank") return;
  const href = a.getAttribute("href");
  if (/^(https?:)?\/\//.test(href)) { ev.preventDefault(); console.warn(`This practice browser stays offline, so the link to ${href} was not opened.`); return; }
  if (href.startsWith("#")) return;
  ev.preventDefault();
  history.pushState(null, "", href);
  dispatchEvent(new PopStateEvent("popstate"));
});

// ---------- fake API so fetch lessons work offline ----------
const realFetch = window.fetch.bind(window);
window.fetch = async (input, init) => {
  const url = new URL(typeof input === "string" ? input : input.url, location.origin);
  const key = url.pathname.replace(/\/$/, "");
  if (url.origin === location.origin && key.startsWith("/api/")) {
    await new Promise((r) => setTimeout(r, 400)); // a little delay so "Loading..." states are visible
    const parts = key.split("/"); // ["", "api", "users", "3"]
    let data = MOCK_API[parts[2]];
    if (data && parts[3]) data = data.find((x) => String(x.id) === parts[3]);
    if (data && (init?.method || "GET").toUpperCase() !== "GET") data = { ok: true, ...JSON.parse(init?.body || "{}") };
    const body = data === undefined ? { error: "Not found" } : data;
    return new Response(JSON.stringify(body), { status: data === undefined ? 404 : 200, headers: { "content-type": "application/json" } });
  }
  if (url.origin !== location.origin) throw new TypeError(`Failed to fetch ${url.href}: the practice browser is offline. Try a /api/... address instead, like /api/users.`);
  return realFetch(input, init);
};

// ---------- module loader ----------
let files = {};
const cache = {};

function resolve(from, spec) {
  if (!spec.startsWith(".") && !spec.startsWith("/")) return spec;
  const base = from.split("/").slice(0, -1);
  for (const part of spec.split("/")) {
    if (part === "..") base.pop();
    else if (part !== "." && part !== "") base.push(part);
  }
  const p = base.join("/");
  return [p, p + ".jsx", p + ".js", p + "/index.jsx", p + "/index.js"].find((c) => c in files) ?? p;
}

function load(name) {
  if (PACKAGES[name]) return PACKAGES[name];
  if (cache[name]) return cache[name].exports;
  if (!(name in files)) {
    if (!name.includes(".") && !name.startsWith("/")) throw new Error(`The package "${name}" isn't available here. This practice browser includes react, react-dom and react-router.`);
    throw new Error(`Couldn't find the file "${name}". Check the file name and the path in your import.`);
  }
  if (name.endsWith(".css")) {
    const s = document.createElement("style");
    s.textContent = files[name];
    s.dataset.file = name;
    document.head.appendChild(s);
    return (cache[name] = { exports: {} }).exports;
  }
  if (name.endsWith(".json")) return (cache[name] = { exports: JSON.parse(files[name]) }).exports;
  const mod = (cache[name] = { exports: {} });
  let code;
  try {
    code = transform(files[name], { transforms: ["jsx", "imports"], jsxRuntime: "automatic", production: true, filePath: name }).code;
  } catch (e) {
    const loc = e.loc ? { line: e.loc.line } : {};
    const err = new SyntaxError(e.message.replace(/\s*\(\d+:\d+\)$/, ""));
    post({ type: "error", name: "SyntaxError", message: err.message, file: name, ...loc });
    throw Object.assign(err, { reported: true });
  }
  const fn = new Function("require", "module", "exports", `${code}\n//# sourceURL=${name}`);
  fn((spec) => load(resolve(name, spec)), mod, mod.exports);
  return mod.exports;
}

// ---------- test helpers for practice checks ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const helpers = {
  $: (s) => document.querySelector(s),
  $$: (s) => [...document.querySelectorAll(s)],
  text: (s) => (s ? document.querySelector(s)?.textContent ?? "" : document.body.textContent).replace(/\s+/g, " ").trim(),
  wait: sleep,
  path: () => location.pathname,
  logs: [],
  files: () => files,
  click(el) { (typeof el === "string" ? document.querySelector(el) : el)?.click(); return sleep(50); },
  type(el, value) {
    const input = typeof el === "string" ? document.querySelector(el) : el;
    if (!input) return sleep(0);
    // React tracks the value property; set it through the native setter so onChange fires
    const proto = input.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, "value").set.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    return sleep(50);
  },
  async goto(p) { history.pushState(null, "", p); dispatchEvent(new PopStateEvent("popstate")); await sleep(50); },
};
const origLog = console.log;
console.log = (...a) => { helpers.logs.push(a.map((x) => show(x)).join(" ")); origLog(...a); };

async function runTests(tests) {
  const results = [];
  for (const t of tests) {
    try {
      const fn = new Function(...Object.keys(helpers), `return (async () => { ${t.code} })()`);
      const ok = await fn(...Object.values(helpers));
      results.push({ name: t.name, ok: ok !== false });
    } catch (e) {
      results.push({ name: t.name, ok: false, error: e.message });
    }
  }
  post({ type: "test-results", results });
}

// ---------- run ----------
function run(msg) {
  files = msg.files;
  history.replaceState(null, "", msg.path || "/");
  const html = files["index.html"] ?? '<div id="root"></div><script type="module" src="index.js"></script>';
  const doc = new DOMParser().parseFromString(html, "text/html");
  document.title = doc.title || "Preview";
  const scripts = [...doc.querySelectorAll("script")];
  const links = [...doc.querySelectorAll('link[rel="stylesheet"]')];
  scripts.forEach((s) => s.remove());
  links.forEach((l) => l.remove());
  document.body.innerHTML = doc.body.innerHTML;
  for (const l of links) load(resolve("", l.getAttribute("href").replace(/^\//, "./")));
  for (const s of doc.head.querySelectorAll("style")) document.head.appendChild(s);
  for (const s of scripts) {
    try {
      if (s.getAttribute("src")) load(resolve("", s.getAttribute("src").replace(/^\//, "./")));
      else new Function(s.textContent)();
    } catch (e) {
      if (!e.reported) reportError(e);
    }
  }
  post({ type: "ran" });
}

window.addEventListener("message", (ev) => {
  const m = ev.data;
  if (!m || m.target !== "sandbox") return;
  if (m.type === "run") run(m);
  else if (m.type === "navigate") { history.pushState(null, "", m.path); dispatchEvent(new PopStateEvent("popstate")); }
  else if (m.type === "back") history.back();
  else if (m.type === "forward") history.forward();
  else if (m.type === "test") runTests(m.tests);
});
post({ type: "ready" });
