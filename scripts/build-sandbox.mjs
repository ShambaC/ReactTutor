// Bundles the preview iframe runtime (React, ReactDOM, React Router, Sucrase + the module loader) into public/sandbox/runtime.js.
import { build } from "esbuild";

await build({
  entryPoints: ["scripts/sandbox/runtime.js"],
  outfile: "public/sandbox/runtime.js",
  bundle: true,
  format: "iife",
  target: "es2020",
  // development React: its warnings (missing key, bad hook call) are part of the lesson
  define: { "process.env.NODE_ENV": '"development"' },
  logLevel: "warning",
});
