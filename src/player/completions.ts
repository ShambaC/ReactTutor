// Web-dev autocomplete for the editor on top of CodeMirror's own (local names, JS keywords, HTML and CSS):
// JSX tags and attributes, React / React Router APIs, browser globals and their members, common array/string
// methods, and import paths. No type checker; plain lists keep it fast and beginner-sized.
import { type Completion, type CompletionContext, type CompletionSource, snippetCompletion as snip } from "@codemirror/autocomplete";
import { syntaxTree } from "@codemirror/language";
import { scopeCompletionSource } from "@codemirror/lang-javascript";

const TAGS = "div span p h1 h2 h3 h4 h5 h6 a img button input textarea select option label form ul ol li nav header footer main section article aside table thead tbody tr th td strong em br hr pre code small blockquote figure figcaption video audio iframe".split(" ");

const ATTRS: [string, string][] = [
  ["className", "CSS class name(s)"], ["id", "unique id"], ["style", "inline styles: style={{ color: \"red\" }}"], ["key", "unique key for items in a list"],
  ["onClick", "runs when clicked"], ["onChange", "runs when an input changes"], ["onSubmit", "runs when a form is submitted"], ["onInput", ""],
  ["onKeyDown", ""], ["onMouseEnter", ""], ["onMouseLeave", ""], ["onFocus", ""], ["onBlur", ""],
  ["value", "the input's current value"], ["defaultValue", ""], ["checked", "for checkboxes"], ["placeholder", ""], ["type", "button, text, number, checkbox..."],
  ["disabled", ""], ["name", ""], ["htmlFor", "label's target input id"], ["href", "link address"], ["src", "image or media address"], ["alt", "image description"],
  ["target", ""], ["ref", "a useRef box"], ["title", ""], ["role", ""], ["aria-label", ""], ["autoFocus", ""], ["to", "React Router Link/NavLink path"],
  ["path", "React Router Route path"], ["element", "React Router Route element"], ["index", "React Router index route"], ["end", "NavLink exact match"],
];
const attrOptions: Completion[] = ATTRS.map(([label, info]) =>
  /^on|^(style|ref|element)$/.test(label) ? snip(`${label}={\${}}`, { label, type: "property", info: info || undefined })
  : snip(`${label}="\${}"`, { label, type: "property", info: info || undefined }));

const REACT: Completion[] = [
  snip("const [${value}, ${setValue}] = useState(${initial});", { label: "useState", type: "function", detail: "react", info: "A value that remembers between renders; calling the setter re-renders." }),
  snip("useEffect(() => {\n\t${}\n}, [${}]);", { label: "useEffect", type: "function", detail: "react", info: "Run code after rendering (fetching, timers). The array lists what it depends on." }),
  snip("const ${ref} = useRef(${null});", { label: "useRef", type: "function", detail: "react", info: "A box (ref.current) that survives renders without causing one." }),
  snip("const ${value} = useMemo(() => ${}, [${}]);", { label: "useMemo", type: "function", detail: "react" }),
  snip("const ${fn} = useCallback(() => {\n\t${}\n}, [${}]);", { label: "useCallback", type: "function", detail: "react" }),
  snip("const ${value} = useContext(${Context});", { label: "useContext", type: "function", detail: "react" }),
  snip("const [${state}, ${dispatch}] = useReducer(${reducer}, ${initial});", { label: "useReducer", type: "function", detail: "react" }),
  { label: "createContext", type: "function", detail: "react" }, { label: "Fragment", type: "class", detail: "react" },
  { label: "createRoot", type: "function", detail: "react-dom/client" },
  ...["BrowserRouter", "Routes", "Route", "Link", "NavLink", "Outlet", "Navigate", "RouterProvider"].map((label): Completion => ({ label, type: "class", detail: "react-router" })),
  ...["useNavigate", "useParams", "useLocation", "useSearchParams", "useLoaderData", "createBrowserRouter"].map((label): Completion => ({ label, type: "function", detail: "react-router" })),
  snip("function ${App}() {\n\treturn (\n\t\t<div>${}</div>\n\t);\n}", { label: "component", type: "keyword", detail: "snippet", info: "A new React component" }),
  snip("import { ${useState} } from \"react\";", { label: "import react", type: "keyword", detail: "snippet" }),
  snip("${items}.map((${item}) => (\n\t<li key={${item}.id}>${}</li>\n))", { label: "map list", type: "keyword", detail: "snippet", info: "Render one element per array item" }),
];

// browser globals the sandbox has; members come from the real objects (document., console., Math., JSON.)
const SCOPE: Record<string, unknown> = {
  console, document, window, Math, JSON, Array, Object, Number, String, Boolean, Date, Promise, Set, Map,
  fetch, setTimeout, setInterval, clearTimeout, clearInterval, localStorage, alert, prompt, confirm, parseInt, parseFloat, isNaN,
};
const globals = scopeCompletionSource(SCOPE);

const METHODS: Completion[] = [
  ..."map filter find findIndex forEach reduce some every includes indexOf push pop shift unshift slice splice concat join sort reverse flat at".split(" ").map((label): Completion => ({ label, type: "method", detail: "array" })),
  ..."toUpperCase toLowerCase trim split startsWith endsWith replace replaceAll padStart repeat charAt".split(" ").map((label): Completion => ({ label, type: "method", detail: "string" })),
  { label: "length", type: "property" }, { label: "toFixed", type: "method", detail: "number" },
  ..."preventDefault target value checked current then catch json".split(" ").map((label): Completion => ({ label, type: "property" })),
];

const MODULES = ["react", "react-dom/client", "react-router"];

/** Completion sources for a JS/JSX file; `files` lists the project's files for import paths. */
export function jsCompletions(files: () => string[]): CompletionSource[] {
  return [
    (cx: CompletionContext) => {
      const node = syntaxTree(cx.state).resolveInner(cx.pos, -1);
      const parent = node.parent?.name;
      // <di|  or  <|
      if (node.name === "JSXStartTag" || (node.name === "JSXIdentifier" && /JSX(Builtin|OpenTag|SelfClosingTag)/.test(parent ?? "") && parent !== "JSXAttribute")) {
        // component names come from CodeMirror's own local-name completion
        return { from: node.name === "JSXStartTag" ? cx.pos : node.from, options: TAGS.map((label): Completion => ({ label, type: "type" })), validFor: /^\w*$/ };
      }
      // <div onCl|
      if (node.name === "JSXIdentifier" && parent === "JSXAttribute") return { from: node.from, options: attrOptions, validFor: /^[\w-]*$/ };
      if ((node.name === "JSXOpenTag" || node.name === "JSXSelfClosingTag") && cx.explicit) return { from: cx.pos, options: attrOptions };
      // import x from "|"
      if (node.name === "String" && parent === "ImportDeclaration") {
        const paths = [...MODULES, ...files().filter((f) => /\.(jsx?|css)$/.test(f) && f !== "index.js").map((f) => `./${f}`)];
        return { from: node.from + 1, to: node.to - 1, options: paths.map((label): Completion => ({ label, type: "text" })), validFor: /^[\w./-]*$/ };
      }
      return null;
    },
    (cx) => {
      // React APIs and snippets wherever a plain name is being typed
      const w = cx.matchBefore(/[\w$]+$/);
      if (!w && !cx.explicit) return null;
      const n = syntaxTree(cx.state).resolveInner(cx.pos, -1).name;
      if (!["VariableName", "Script", "Block", "ExpressionStatement", "ArrowFunction", "ParenthesizedExpression"].includes(n)) return null;
      return { from: w?.from ?? cx.pos, options: REACT, validFor: /^[\w$]*$/ };
    },
    globals,
    (cx) => {
      // anything.  ->  common array / string / event members (we don't know the type, so offer the usual ones)
      const m = cx.matchBefore(/([\w$]+)(?:\.[\w$]+|\([^()]*\)|\[[^\]]*\])*\.[\w$]*$/);
      if (!m) return null;
      const root = /^[\w$]+/.exec(m.text)![0];
      if (root in SCOPE) return null;
      const n = syntaxTree(cx.state).resolveInner(cx.pos, -1).name;
      if (n === "String" || n.includes("Comment")) return null;
      return { from: m.from + m.text.lastIndexOf(".") + 1, options: METHODS, validFor: /^[\w$]*$/ };
    },
  ];
}
