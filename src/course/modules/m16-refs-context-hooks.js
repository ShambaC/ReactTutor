// Module 16: useRef, Context, custom hooks and the rules of hooks.
// The installed React is 18, so context is provided with <ThemeContext.Provider value=...>.
// In notes/task strings a tilde (~) stands for a backtick, so we do not have to escape every code sample.
const md = (s) => s.replace(/~/g, "`");

const indexHtml = `<!doctype html>
<html>
  <head>
    <title>Refs, context, hooks</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="index.js"></script>
  </body>
</html>
`;

const indexJs = `import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(<App />);
`;

const css = `body { font-family: system-ui, sans-serif; background: #fdf4ff; margin: 0; }
.app { max-width: 380px; margin: 24px auto; background: white; padding: 20px; border-radius: 12px; }
h1 { margin-top: 0; font-size: 22px; }
.card { background: #f1f5f9; border-radius: 8px; padding: 8px 12px; margin: 12px 0; }
.card.light { background: #fef9c3; }
.card.dark { background: #1e293b; color: white; }
.badge { display: inline-block; background: #ede9fe; padding: 2px 8px; border-radius: 99px; }
.error { color: #b91c1c; }
input { padding: 6px; }
button { cursor: pointer; margin-right: 6px; }
`;

const base = { "index.html": indexHtml, "index.js": indexJs, "styles.css": css };

// =============== lesson 1: refs ===============
const refApp = (withStopwatch) => `import FocusBox from "./FocusBox.jsx";
${withStopwatch ? 'import Stopwatch from "./Stopwatch.jsx";\n' : ""}
export default function App() {
  return (
    <div className="app">
      <h1>Refs</h1>
      <FocusBox />
${withStopwatch ? "      <hr />\n      <Stopwatch />\n" : ""}    </div>
  );
}
`;

const focusBox = (o) => `${o.useRef ? 'import { useRef } from "react";\n\n' : ""}export default function FocusBox() {
${o.useRef ? "  const inputRef = useRef(null);\n" : ""}${o.handler || ""}
  return (
    <div>
      <input ${o.useRef && o.attach ? "ref={inputRef} " : ""}placeholder="Type here" />
      <button${o.handler ? " onClick={handleFocus}" : ""}>Focus the box</button>${o.extra || ""}
    </div>
  );
}
`;
const fb0 = focusBox({});
const fb1 = focusBox({ useRef: true });
const fb2 = focusBox({
  useRef: true,
  attach: true,
  handler: `
  function handleFocus() {
    console.log(inputRef.current.placeholder);
  }
`,
});
const focusHandler = `
  function handleFocus() {
    inputRef.current.focus();
  }
`;
const fb3 = focusBox({ useRef: true, attach: true, handler: focusHandler });
const fb4 = focusBox({
  useRef: true,
  attach: true,
  handler:
    focusHandler +
    `
  function handleClear() {
    inputRef.current.value = "";
    inputRef.current.focus();
  }
`,
  extra: "\n      <button onClick={handleClear}>Clear</button>",
});

const stopwatch = (o) => `import { useState${o.ref ? ", useRef" : ""} } from "react";

export default function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  ${o.ref ? "const timerRef = useRef(null);" : "let timerId = null;"}

  function start() {
    ${o.ref ? "timerRef.current" : "timerId"} = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
  }

  function stop() {
    clearInterval(${o.ref ? "timerRef.current" : "timerId"});
  }
${o.reset ? `
  function reset() {
    clearInterval(timerRef.current);
    setSeconds(0);
  }
` : ""}
  return (
    <div>
      <p>Seconds: {seconds}</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>${o.reset ? "\n      <button onClick={reset}>Reset</button>" : ""}
    </div>
  );
}
`;
const sw0 = stopwatch({});
const sw1 = stopwatch({ ref: true });
const sw2 = stopwatch({ ref: true, reset: true });

// =============== lesson 2: context ===============
const themeContext = `import { createContext } from "react";

export const ThemeContext = createContext("light");
`;

const ctxApp = (o) => `import { useState } from "react";
${o.provider ? 'import { ThemeContext } from "./ThemeContext.js";\n' : ""}import Page from "./Page.jsx";

export default function App() {
  const [theme, setTheme] = useState("light");

  return (
    <div className="app">
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle theme
      </button>
${
  o.provider
    ? `      <ThemeContext.Provider value={theme}>
        <Page${o.drill ? " theme={theme}" : ""} />
      </ThemeContext.Provider>`
    : "      <Page theme={theme} />"
}
    </div>
  );
}
`;
const ca0 = ctxApp({});
const ca1 = ctxApp({ provider: true, drill: true });
const ca2 = ctxApp({ provider: true, drill: false });

const page = (drill) => `import Toolbar from "./Toolbar.jsx";

export default function Page(${drill ? "{ theme }" : ""}) {
  return (
    <main>
      <h2>My page</h2>
      <Toolbar${drill ? " theme={theme}" : ""} />
    </main>
  );
}
`;
const toolbar = (o) => `${o.badge ? 'import Badge from "./Badge.jsx";\n' : ""}import Card from "./Card.jsx";

export default function Toolbar(${o.drill ? "{ theme }" : ""}) {
  return (
    <div>
${o.badge ? "      <Badge />\n" : ""}      <Card${o.drill ? " theme={theme}" : ""} />
    </div>
  );
}
`;
const cardDrill = `export default function Card({ theme }) {
  return (
    <div className={"card " + theme}>
      <p>I am a {theme} card.</p>
    </div>
  );
}
`;
const cardCtx = `import { useContext } from "react";
import { ThemeContext } from "./ThemeContext.js";

export default function Card() {
  const theme = useContext(ThemeContext);

  return (
    <div className={"card " + theme}>
      <p>I am a {theme} card.</p>
    </div>
  );
}
`;
const badge = `import { useContext } from "react";
import { ThemeContext } from "./ThemeContext.js";

export default function Badge() {
  const theme = useContext(ThemeContext);

  return <span className="badge">Theme: {theme}</span>;
}
`;

// =============== lesson 3: custom hooks ===============
const hookApp = (o) => `import Tips from "./Tips.jsx";
import Faq from "./Faq.jsx";
${o.users ? 'import UserList from "./UserList.jsx";\n' : ""}${o.quotes ? 'import Quotes from "./Quotes.jsx";\n' : ""}
export default function App() {
  return (
    <div className="app">
      <h1>Help centre</h1>
      <Tips />
      <Faq />
${o.users ? "      <h2>Users</h2>\n      <UserList />\n" : ""}${o.quotes ? "      <h2>Quotes</h2>\n      <Quotes />\n" : ""}    </div>
  );
}
`;

const section = (name, o) => `${o.hook ? 'import useToggle from "./useToggle.js";' : 'import { useState } from "react";'}

export default function ${name}() {
${
  o.hook
    ? `  const [open, toggle] = useToggle(${o.initial});\n${o.bad ? "\n  if (open) {\n    useToggle(false);\n  }\n" : ""}`
    : `  const [open, setOpen] = useState(${o.initial});

  function toggle() {
    setOpen(!open);
  }
`
}
  return (
    <section className="card">
      <button onClick={toggle}>{open ? "Hide ${o.word}" : "Show ${o.word}"}</button>
      {open && <p>${o.text}</p>}
    </section>
  );
}
`;
const tipsOld = section("Tips", { initial: "false", word: "tips", text: "Take a short break every hour." });
const faqOld = section("Faq", { initial: "true", word: "answer", text: "Press the Add button, then type your item." });
const tipsNew = section("Tips", { hook: true, initial: "false", word: "tips", text: "Take a short break every hour." });
const tipsBad = section("Tips", { hook: true, bad: true, initial: "false", word: "tips", text: "Take a short break every hour." });
const faqNew = section("Faq", { hook: true, initial: "true", word: "answer", text: "Press the Add button, then type your item." });

const useToggle = `import { useState } from "react";

export default function useToggle(initial) {
  const [on, setOn] = useState(initial);

  function toggle() {
    setOn(!on);
  }

  return [on, toggle];
}
`;

const useFetch = `import { useState, useEffect } from "react";

export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Request failed with status " + res.status);
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
}
`;

const listComponent = (name, url, itemJsx) => `import useFetch from "./useFetch.js";

export default function ${name}() {
  const { data, loading, error } = useFetch("${url}");

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error">Something went wrong: {error}</p>;
  }

  return (
    <ul>
      {data.map((item) => (
        <li key={item.id}>${itemJsx}</li>
      ))}
    </ul>
  );
}
`;
const userList = listComponent("UserList", "/api/users", "{item.name}");
const quotes = listComponent("Quotes", "/api/quotes", "{item.text} - {item.author}");

// =====================================================================
export default {
  id: "m16",
  title: "Refs, context and custom hooks",
  summary: "Reach real elements and remember values with useRef, share data without passing props through every level using context, and package your own logic into custom hooks.",
  lessons: [
    // ---------------------------------------------------------------- 1
    {
      kind: "scrim",
      id: "m16-use-ref",
      title: "useRef: a box React doesn't watch",
      notes: md(`## What is a ref?

A **ref** is a box with one drawer, called ~.current~. You create it with ~useRef~.

~~~jsx
const inputRef = useRef(null);
~~~

Unlike state, **changing ~.current~ does not redraw the screen**. React doesn't watch it.

## Job 1: reach a real element

Attach the ref to an element with the ~ref~ prop. After rendering, React puts the real element in ~.current~.

~~~jsx
const inputRef = useRef(null);
<input ref={inputRef} />
<button onClick={() => inputRef.current.focus()}>Focus</button>
~~~

## Job 2: remember a value between renders

A plain variable inside a component is created again on every render, so it forgets. A ref keeps its value.

~~~jsx
const timerRef = useRef(null);
timerRef.current = setInterval(tick, 1000);
clearInterval(timerRef.current);
~~~

## State or ref?

- If the **screen should change** when the value changes, use **state**.
- If you only need to **remember** it, use a **ref**.

## Common mistakes

- Using a plain ~let~ variable to remember something. It resets on every render.
- Using a ref to show something on screen. The page won't update.
- Reading ~inputRef.current~ before the page has rendered. It is ~null~ at first.`),
      files: { ...base, "App.jsx": refApp(false), "FocusBox.jsx": fb0 },
      steps: [
        { say: "Welcome! Today we meet three new tools. First, use ref. It does two jobs: it lets us reach a real element on the page, and it lets us remember a value without redrawing anything." },
        { say: "Here's a text box and a button. We want the button to put the cursor into the text box. That's called focusing. Right now the button does nothing.", open: "FocusBox.jsx", highlight: "<button>Focus the box</button>" },
        {
          say: "A ref is like a small box with one drawer, called current. We make one with use ref. We start with null, which means empty.",
          files: { "FocusBox.jsx": fb1 },
          highlight: "const inputRef = useRef(null);",
        },
        {
          say: "Next, we attach the box to the text field with the ref prop. After React draws the page, it puts the real text field into the drawer. Our button handler will read the placeholder from it, to prove it's there.",
          files: { "FocusBox.jsx": fb2 },
          highlight: "ref={inputRef}",
        },
        { say: "Click the button and look at the console. It says Type here. Input ref dot current really is the text field on the page. Now we can ask it to do things." },
        {
          say: "Every text field has a method called focus. We call it through the ref. Click the button now, and the cursor jumps into the box.",
          files: { "FocusBox.jsx": fb3 },
          highlight: "inputRef.current.focus();",
        },
        { say: "Use refs for things like focusing, scrolling, or measuring. For anything that appears on screen, prefer state. Refs are the back door, and state is the front door." },
        {
          say: "Your turn. Add a second button called Clear. It should empty the text box and also put the cursor back in it.",
          challenge: {
            task: md(`**Challenge:** add a **Clear** button next to the Focus button.

When clicked it should:

1. Set the text box's value to an empty string. With a ref: ~inputRef.current.value = ""~
2. Focus the text box again.

Try it: type something, then click **Clear**.`),
            hints: [
              "Write a new function, like handleClear, next to handleFocus.",
              "Inside it you can use inputRef.current twice: once to empty the value, once to call focus.",
              '`function handleClear() { inputRef.current.value = ""; inputRef.current.focus(); }` then `<button onClick={handleClear}>Clear</button>`',
            ],
            tests: [
              {
                name: "The Focus button puts the cursor in the text box",
                code: 'const b = $$("button").find((x) => /focus/i.test(x.textContent)); await click(b); return document.activeElement === $("input");',
              },
              { name: "There is a Clear button", code: 'return $$("button").some((x) => /clear/i.test(x.textContent));' },
              {
                name: "Clear empties the box",
                code: 'await type("input", "hello"); await click($$("button").find((x) => /clear/i.test(x.textContent))); return $("input").value === "";',
              },
              {
                name: "Clear puts the cursor back in the box",
                code: 'document.activeElement && document.activeElement.blur && document.activeElement.blur(); await click($$("button").find((x) => /clear/i.test(x.textContent))); return document.activeElement === $("input");',
              },
            ],
          },
        },
        {
          say: "Here's how I did it. Two lines with the ref inside one function. If you wrote it a different way, as long as it works, that's great.",
          files: { "FocusBox.jsx": fb4 },
          highlight: 'inputRef.current.value = "";',
        },
        { say: "Now the second job: remembering. Imagine a stopwatch. When you press Start, we begin a timer. When you press Stop, we have to cancel that same timer. So we need to remember its id." },
        {
          say: "I'll try the first way that comes to mind, with a plain variable called timer id. Start saves the timer in it. Stop clears it. Seems reasonable, doesn't it?",
          files: { "Stopwatch.jsx": sw0, "App.jsx": refApp(true) },
          open: "Stopwatch.jsx",
          highlight: "let timerId = null;",
        },
        { say: "Press Start. The seconds count up. Now press Stop. It keeps counting! Why? Each tick changes the state, so the component runs again from the top. Every time, timer id is created fresh, as null. Stop is clearing nothing." },
        {
          say: "A ref is the right tool. Its drawer survives re-renders, and changing it doesn't redraw the page. We store the timer id in timer ref dot current, and clear that.",
          files: { "Stopwatch.jsx": sw1 },
          highlight: "timerRef.current = setInterval(() => {",
        },
        { say: "Press Start, then Stop. It stops. The rule of thumb: if the screen should change when the value changes, use state. If you only need to remember it, use a ref." },
        {
          say: "One more try, yours this time. Add a Reset button that stops the stopwatch and puts the seconds back to zero.",
          challenge: {
            task: md(`**Challenge:** add a **Reset** button to the stopwatch.

It should **stop** the timer (use the ref) and set ~seconds~ back to ~0~.`),
            hints: [
              "Write a function called reset, and add a third button that calls it.",
              "Stopping uses `clearInterval(timerRef.current)`. Setting back to zero uses `setSeconds(0)`.",
              "`function reset() { clearInterval(timerRef.current); setSeconds(0); }`",
            ],
            tests: [
              {
                name: "Start makes the seconds count up",
                code: 'await click($$("button").find((b) => b.textContent === "Start")); await wait(1300); return /Seconds: [1-9]/.test(text());',
              },
              {
                name: "Reset sets the seconds to zero",
                code: 'await click($$("button").find((b) => /reset/i.test(b.textContent))); return text().includes("Seconds: 0");',
              },
              {
                name: "After Reset the timer stays stopped",
                code: 'await wait(1400); return text().includes("Seconds: 0");',
              },
            ],
          },
        },
        {
          say: "Here's how I did it. Reset clears the timer using the ref, then sets the state back to zero. Notice we use both tools: a ref to remember the timer, and state for what's on screen.",
          files: { "Stopwatch.jsx": sw2 },
          highlight: "function reset() {",
        },
        { say: "Recap. A ref is a box with a drawer called current. Attach it to an element to reach it. Use it to remember values without redrawing. Next: sharing data without passing props through everyone." },
      ],
    },

    // ---------------------------------------------------------------- practice fix (refs)
    {
      kind: "practice",
      id: "m16-practice-ref",
      title: "Practice: the auto clicker that won't stop",
      type: "fix",
      task: md(`This auto clicker adds one to the count every fraction of a second after you press **Start**. But **Stop** doesn't stop it!

Find out why and fix it. Hint: what happens to a normal variable every time the component renders?`),
      files: {
        ...base,
        "App.jsx": `import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  let timerId = null;

  function start() {
    timerId = setInterval(() => {
      setCount((c) => c + 1);
    }, 300);
  }

  function stop() {
    clearInterval(timerId);
  }

  return (
    <div className="app">
      <h1>Auto clicker</h1>
      <p>Clicks: {count}</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
`,
      },
      solution: {
        "App.jsx": `import { useState, useRef } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  const timerRef = useRef(null);

  function start() {
    timerRef.current = setInterval(() => {
      setCount((c) => c + 1);
    }, 300);
  }

  function stop() {
    clearInterval(timerRef.current);
  }

  return (
    <div className="app">
      <h1>Auto clicker</h1>
      <p>Clicks: {count}</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
`,
      },
      hints: [
        "Each tick changes the state, so the component runs again from the top. What happens to `let timerId = null` each time?",
        "A plain variable is created again on every render, so it forgets the timer. We need something that survives renders without redrawing.",
        "Use `const timerRef = useRef(null);`, save the timer in `timerRef.current`, and clear `timerRef.current`.",
      ],
      tests: [
        { name: "Start makes the count go up", code: 'await click($$("button").find((b) => b.textContent === "Start")); await wait(800); return !text("p").includes("Clicks: 0");' },
        {
          name: "Stop really stops the count",
          code: 'await click($$("button").find((b) => b.textContent === "Stop")); await wait(100); const frozen = text("p"); await wait(900); return text("p") === frozen;',
        },
      ],
    },

    // ---------------------------------------------------------------- 2
    {
      kind: "scrim",
      id: "m16-context",
      title: "Context: skip the prop drilling",
      notes: md(`## The problem: prop drilling

Sometimes a value is needed deep in the tree, and every component in between has to pass it along even though it doesn't use it. That is called **prop drilling**.

## Context in three steps

**1. Create** the context (in its own file):

~~~jsx
import { createContext } from "react";
export const ThemeContext = createContext("light");
~~~

**2. Provide** a value to everything inside:

~~~jsx
<ThemeContext.Provider value={theme}>
  <Page />
</ThemeContext.Provider>
~~~

**3. Consume** it in any component below:

~~~jsx
const theme = useContext(ThemeContext);
~~~

When the provided value changes, every component that reads it renders again.

## The default value

The value given to ~createContext("light")~ is used only when there is **no Provider** above the component.

## When to use it

Use context for things many components need: the theme, the current user, the language. For everything else, normal props are clearer. Don't reach for context too early.

## Common mistakes

- Forgetting to wrap the components in the Provider. They get the default value.
- Putting the Provider too low, so some components sit outside it.
- Forgetting ~value=~ on the Provider.`),
      files: {
        ...base,
        "App.jsx": ca0,
        "Page.jsx": page(true),
        "Toolbar.jsx": toolbar({ drill: true }),
        "Card.jsx": cardDrill,
      },
      steps: [
        { say: "Welcome back! Let's meet a problem called prop drilling, and a tool that solves it, called context. Imagine passing a note to someone across a room by handing it to every person in between." },
        { say: "Our app has a theme, light or dark, and a button that switches it. The theme lives in App, because the button changes it.", open: "App.jsx", highlight: "<Page theme={theme} />" },
        {
          say: "But the theme is only used way down in Card. Page receives it, and hands it to Toolbar. Toolbar receives it, and hands it to Card. Page and Toolbar never use it themselves. They only pass the note along.",
          open: "Toolbar.jsx",
          highlight: "<Card theme={theme} />",
        },
        { say: "With two levels that's fine. With ten levels it's painful. Context is like a radio station. A component up high broadcasts a value, and any component below can tune in directly, without the ones in between." },
        {
          say: "Step one: create the context. It goes in its own file. We call create context, and give it a default value, light. We export it so other files can use it.",
          files: { "ThemeContext.js": themeContext },
          open: "ThemeContext.js",
          highlight: 'createContext("light")',
        },
        {
          say: "Step two: provide a value. In App, we wrap the page in theme context dot provider, with a value prop. Everything inside can now tune in to the current theme. We still pass the prop for now.",
          files: { "App.jsx": ca1 },
          highlight: "<ThemeContext.Provider value={theme}>",
        },
        {
          say: "Step three: consume it. In Card, we call use context with our theme context. It hands back the current value. No props needed. Notice Card no longer receives anything.",
          files: { "Card.jsx": cardCtx },
          open: "Card.jsx",
          highlight: "const theme = useContext(ThemeContext);",
        },
        {
          say: "Now we can clean up. Page and Toolbar don't need the theme prop any more, so we delete it from both. And App stops passing it.",
          files: { "Page.jsx": page(false), "Toolbar.jsx": toolbar({}), "App.jsx": ca2 },
          open: "Page.jsx",
          highlight: "<Toolbar />",
        },
        { say: "Click Toggle theme. The card changes colour, and the middle components know nothing about it. When the provided value changes, every component reading it redraws." },
        {
          say: "Your turn. Make a new component called Badge. It reads the theme from context and shows the words Theme, a colon, and the theme name. Put it in the Toolbar, next to the card.",
          challenge: {
            task: md(`**Challenge:** create ~Badge.jsx~.

1. Read the theme with ~useContext(ThemeContext)~.
2. Return something like ~<span className="badge">Theme: {theme}</span>~.
3. Show ~<Badge />~ inside ~Toolbar.jsx~.

Click **Toggle theme** and check that the badge changes too. You should not need to pass any props.`),
            hints: [
              "Copy how Card reads the theme. You need the same two imports.",
              "Don't forget to import Badge in Toolbar.jsx and put `<Badge />` inside the div.",
              '`import { useContext } from "react"; import { ThemeContext } from "./ThemeContext.js";` then `const theme = useContext(ThemeContext);`',
            ],
            tests: [
              { name: "The badge shows Theme: light at first", code: 'return text().includes("Theme: light");' },
              { name: "Toggling the theme updates the badge", code: 'await click("button"); return text().includes("Theme: dark");' },
              { name: "The card changes too", code: 'return text().includes("dark card");' },
              { name: "The badge reads the context instead of props", code: 'return /useContext\\(\\s*ThemeContext\\s*\\)/.test(Object.values(files()).filter((c) => c.includes("Badge")).join("\\n"));' },
            ],
          },
        },
        {
          say: "Here's how I did it. Badge tunes in to the context, exactly like Card. And in Toolbar we place it. Because it reads context itself, we didn't have to change Page or App at all.",
          files: { "Badge.jsx": badge, "Toolbar.jsx": toolbar({ badge: true }) },
          open: "Badge.jsx",
          highlight: "Theme: {theme}",
        },
        { say: "What about the default value, light? It's used only when a component has no Provider above it. So a Card shown outside any Provider still works, with light." },
        { say: "A word of caution. Context is great for things many components need, like a theme or the current user. But for most data, plain props are clearer. Reach for context when you notice you're drilling." },
        { say: "Recap. Create the context, provide a value, and use context to read it. You can broadcast data to any depth. Next: packaging your own logic into custom hooks." },
      ],
    },

    // ---------------------------------------------------------------- practice fill (context)
    {
      kind: "practice",
      id: "m16-practice-context",
      title: "Practice: tune in to the theme",
      type: "fill",
      task: md(`Fill in the blanks (~___~) to share the theme through context:

1. In ~ThemeContext.js~, the default value should be ~"light"~.
2. In ~App.jsx~, wrap the page in the context's **Provider**.
3. In ~Card.jsx~, read the theme with ~useContext~. Give it the context object.

Press **Run**, click **Toggle theme**, then **Check my code**.`),
      files: {
        ...base,
        "ThemeContext.js": `import { createContext } from "react";

export const ThemeContext = createContext(___);
`,
        "App.jsx": `import { useState } from "react";
import { ThemeContext } from "./ThemeContext.js";
import Card from "./Card.jsx";

export default function App() {
  const [theme, setTheme] = useState("light");

  return (
    <div className="app">
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle theme
      </button>
      <ThemeContext.___ value={theme}>
        <Card />
      </ThemeContext.___>
    </div>
  );
}
`,
        "Card.jsx": `import { useContext } from "react";
import { ThemeContext } from "./ThemeContext.js";

export default function Card() {
  const theme = useContext(___);

  return (
    <div className={"card " + theme}>
      <p>I am a {theme} card.</p>
    </div>
  );
}
`,
      },
      solution: {
        "ThemeContext.js": `import { createContext } from "react";

export const ThemeContext = createContext("light");
`,
        "App.jsx": `import { useState } from "react";
import { ThemeContext } from "./ThemeContext.js";
import Card from "./Card.jsx";

export default function App() {
  const [theme, setTheme] = useState("light");

  return (
    <div className="app">
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle theme
      </button>
      <ThemeContext.Provider value={theme}>
        <Card />
      </ThemeContext.Provider>
    </div>
  );
}
`,
        "Card.jsx": `import { useContext } from "react";
import { ThemeContext } from "./ThemeContext.js";

export default function Card() {
  const theme = useContext(ThemeContext);

  return (
    <div className={"card " + theme}>
      <p>I am a {theme} card.</p>
    </div>
  );
}
`,
      },
      hints: [
        "The default value is the word `light`, written in quotes.",
        "The component that provides a value is called `Provider`. It appears in the opening and the closing tag.",
        "The blanks are `\"light\"`, `Provider`, `Provider`, and `ThemeContext`.",
      ],
      tests: [
        { name: "The card says light at first", code: 'return text().includes("light card");' },
        { name: "Clicking the button switches to dark", code: 'await click("button"); return text().includes("dark card");' },
        { name: "Clicking again switches back", code: 'await click("button"); return text().includes("light card");' },
        { name: "Card reads the context with useContext", code: 'return /useContext\\(\\s*ThemeContext\\s*\\)/.test(files()["Card.jsx"]);' },
      ],
    },

    // ---------------------------------------------------------------- 3
    {
      kind: "scrim",
      id: "m16-custom-hooks",
      title: "Custom hooks: reusable logic",
      notes: md(`## Components reuse UI. Hooks reuse logic.

When two components repeat the same state-and-function code, move it into a **custom hook**: a function that uses other hooks.

~~~js
import { useState } from "react";

export default function useToggle(initial) {
  const [on, setOn] = useState(initial);
  function toggle() {
    setOn(!on);
  }
  return [on, toggle];
}
~~~

~~~jsx
const [open, toggle] = useToggle(false);
~~~

- **The name must start with ~use~.** That's how React and your tools know it's a hook.
- Every component that calls the hook gets **its own separate state**.

## useFetch

The fetch pattern from the last module becomes one line:

~~~jsx
const { data, loading, error } = useFetch("/api/users");
~~~

## The rules of hooks

1. Call hooks only at the **top level** of a component or another custom hook.
2. **Never** inside an ~if~, a loop, or a nested function.

React remembers hooks by the **order** they are called, so the order must be the same every render.

## Common mistakes

- Naming a hook ~toggleHook~ instead of ~useToggle~.
- Calling a hook inside a condition. React complains: "Rendered more hooks than during the previous render".`),
      files: { ...base, "App.jsx": hookApp({}), "Tips.jsx": tipsOld, "Faq.jsx": faqOld },
      steps: [
        { say: "Welcome back! We've reused UI by making components. Today we reuse logic by making our own hooks. Let's start with a problem.", open: "Tips.jsx" },
        { say: "Here are two sections: Tips and Faq. Each one has a show and hide button. Look at the code of Tips, and then Faq. Notice the same open state and the same toggle function, written twice.", highlight: "const [open, setOpen] = useState(false);" },
        { say: "Copy and paste works, but mistakes can creep in, and every fix has to be made twice. In React, we can move shared logic into a function of our own, called a custom hook." },
        {
          say: "Let's write one, in a new file. It's a normal function. Inside, it uses use state, and it defines toggle. It returns both, in an array, like use state does.",
          files: { "useToggle.js": useToggle },
          open: "useToggle.js",
          highlight: "return [on, toggle];",
        },
        { say: "Notice the name. It starts with use. That's the rule for custom hooks. It tells React, and the tools that check your code, that this function is a hook." },
        {
          say: "Now Tips can use it. One line replaces the state and the function. We pass false as the starting value.",
          files: { "Tips.jsx": tipsNew },
          open: "Tips.jsx",
          highlight: "const [open, toggle] = useToggle(false);",
        },
        {
          say: "Faq does the same, and starts open, so we pass true. The two sections now share one piece of logic.",
          files: { "Faq.jsx": faqNew },
          open: "Faq.jsx",
          highlight: "const [open, toggle] = useToggle(true);",
        },
        { say: "Click the buttons. Each section toggles on its own. Sharing the hook means sharing the code, not the data. Every component that calls the hook gets its own separate state." },
        {
          say: "Now let's break a rule on purpose. Hooks must be called at the top level, never inside an if. I'll add a hook call inside an if, and then click the button.",
          files: { "Tips.jsx": tipsBad },
          open: "Tips.jsx",
          highlight: "useToggle(false);\n  }",
        },
        {
          say: "Click Show tips. Error: rendered more hooks than during the previous render. That's a clue! React remembers hooks by their order. The first time there were fewer hooks than the second time, so React got lost. I'll remove it.",
          files: { "Tips.jsx": tipsNew },
          highlight: "const [open, toggle] = useToggle(false);",
        },
        { say: "The rules of hooks: call them only at the top level of a component or of another hook. Never inside an if, a loop, or a nested function. Always in the same order." },
        {
          say: "Custom hooks can hold much more than a toggle. Remember last time's fetch code? Let's package it as use fetch. It takes a web address and gives back an object with data, loading and error.",
          files: { "useFetch.js": useFetch },
          open: "useFetch.js",
          highlight: "return { data, loading, error };",
        },
        { say: "It's the same code as before, in one place. And the URL is in the dependency array, so if the address changes, it fetches again, like the user picker did.", highlight: "}, [url]);" },
        {
          say: "Now any component can load data in one line. We take data, loading and error out of the object. Then we handle the three screens as before.",
          files: { "UserList.jsx": userList, "App.jsx": hookApp({ users: true }) },
          open: "UserList.jsx",
          highlight: 'useFetch("/api/users")',
        },
        {
          say: "Your turn. Build a Quotes component using use fetch for slash A P I slash quotes. Show each quote's text, a dash, and the author. Then show it in App.",
          challenge: {
            task: md(`**Challenge:** build a ~Quotes~ component in ~Quotes.jsx~ with the ~useFetch~ hook.

1. Call ~useFetch("/api/quotes")~.
2. Show **Loading...** while loading, and a message if there's an error.
3. Show each quote as ~text - author~ in a list.
4. Render ~<Quotes />~ in ~App.jsx~, under the users.

Wait a moment after pressing **Run**: the data takes about half a second.`),
            hints: [
              "Copy UserList.jsx and change the name, the address and what each list item shows.",
              "A quote has `text` and `author` fields.",
              'In Quotes: `const { data, loading, error } = useFetch("/api/quotes");` then show `{item.text} - {item.author}`.',
            ],
            tests: [
              { name: "The quotes appear", code: 'await wait(700); return text().includes("Everyone was a beginner once.") && text().includes("Small steps every day add up.");' },
              { name: "The users still appear", code: 'return text().includes("Ada Lovelace");' },
              {
                name: "The new component uses the useFetch hook for quotes",
                code: 'return Object.entries(files()).some(([name, code]) => name !== "useFetch.js" && /useFetch\\(\\s*["\']\\/api\\/quotes["\']/.test(code));',
              },
            ],
          },
        },
        {
          say: "Here's how I did it. The same few lines as UserList, with a different address and a different list item. A whole data-loading component in a handful of lines. That's the power of a custom hook.",
          files: { "Quotes.jsx": quotes, "App.jsx": hookApp({ users: true, quotes: true }) },
          open: "Quotes.jsx",
          highlight: 'useFetch("/api/quotes")',
        },
        { say: "Recap. A custom hook is a function whose name starts with use, and that calls other hooks. Each caller gets its own state. Keep hooks at the top level. You now have many of React's best tools. Well done!" },
      ],
    },

    // ---------------------------------------------------------------- practice build (hook)
    {
      kind: "practice",
      id: "m16-practice-hook",
      title: "Practice: write the useCounter hook",
      type: "build",
      task: md(`The page in ~App.jsx~ already uses a custom hook called ~useCounter~. But the hook in ~useCounter.js~ is only a placeholder. Write the real one.

- ~useCounter(start)~ keeps a ~count~ in state, beginning at ~start~.
- It has an ~increment~ function that adds 1, and a ~decrement~ function that subtracts 1.
- It returns an object: ~{ count, increment, decrement }~.

Press **Run**, try the buttons, then **Check my code**.`),
      files: {
        ...base,
        "App.jsx": `import useCounter from "./useCounter.js";

export default function App() {
  const { count, increment, decrement } = useCounter(10);

  return (
    <div className="app">
      <h1>Count: {count}</h1>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </div>
  );
}
`,
        "useCounter.js": `// Write the hook here. It needs useState.
export default function useCounter(start) {
  return { count: start, increment: () => {}, decrement: () => {} };
}
`,
      },
      solution: {
        "useCounter.js": `import { useState } from "react";

export default function useCounter(start) {
  const [count, setCount] = useState(start);

  function increment() {
    setCount(count + 1);
  }

  function decrement() {
    setCount(count - 1);
  }

  return { count, increment, decrement };
}
`,
      },
      hints: [
        "A custom hook can call other hooks. Start by importing useState and creating the count state with `start` as its first value.",
        "Write two small functions, increment and decrement, that call setCount.",
        "End with `return { count, increment, decrement };`",
      ],
      tests: [
        { name: "The count starts at 10", code: 'return text("h1").includes("Count: 10");' },
        { name: "The plus button adds one", code: 'await click($$("button").find((b) => b.textContent.trim() === "+")); return text("h1").includes("Count: 11");' },
        {
          name: "The minus button subtracts one",
          code: 'const minus = $$("button").find((b) => b.textContent.trim() === "-"); await click(minus); await click(minus); return text("h1").includes("Count: 9");',
        },
        { name: "The hook uses useState", code: 'return /useState\\(/.test(files()["useCounter.js"]);' },
      ],
    },

    // ---------------------------------------------------------------- quiz
    {
      kind: "quiz",
      id: "m16-quiz",
      title: "Quick check: refs, context and hooks",
      questions: [
        {
          q: "What happens on screen when you change `ref.current`?",
          options: ["The component renders again", "Nothing is redrawn", "The page reloads", "React shows an error"],
          answer: 1,
          explain: "React doesn't watch refs. Changing `.current` doesn't redraw the page. That makes refs good for remembering things, and bad for things the screen must show.",
        },
        {
          q: "You need to remember a timer id so you can stop the timer later. Where should it live?",
          code: "const ??? = setInterval(tick, 1000);",
          options: ["A normal variable inside the component", "A ref", "A new state variable, shown on the page", "A comment"],
          answer: 1,
          explain: "A normal variable is created again every render, so it forgets. A ref keeps its value and doesn't cause a redraw.",
        },
        {
          q: "What does the Card show?",
          code: 'const ThemeContext = createContext("light");\n\n// somewhere above Card:\n<ThemeContext.Provider value="dark">\n  <Card />\n</ThemeContext.Provider>\n\n// inside Card:\nconst theme = useContext(ThemeContext);\n// <p>{theme}</p>',
          options: ["light", "dark", "undefined", "ThemeContext"],
          answer: 1,
          explain: "The nearest Provider above wins. The default value, light, only applies when there is no Provider.",
        },
        {
          q: "What does the card show here, when there's no Provider above it at all?",
          code: 'const ThemeContext = createContext("light");\n\nfunction Card() {\n  const theme = useContext(ThemeContext);\n  return <p>{theme}</p>;\n}',
          options: ["Nothing", "dark", "light", "An error"],
          answer: 2,
          explain: "With no Provider, useContext gives back the default value passed to createContext.",
        },
        {
          q: "Spot the bug. Why does React complain about this component?",
          code: "function Panel({ open }) {\n  if (open) {\n    const [text, setText] = useState('');\n  }\n  return <p>Hi</p>;\n}",
          options: [
            "useState needs two arguments",
            "A hook is called inside an if, so hooks may run in a different order each time",
            "Panel must be written in lowercase",
            "setText is never called",
          ],
          answer: 1,
          explain: "Hooks must be called at the top level, in the same order on every render. Never inside an if, a loop, or a nested function.",
        },
        {
          q: "Which name is right for a custom hook that toggles something on and off?",
          options: ["toggleHook", "UseToggle_", "useToggle", "hookToggle"],
          answer: 2,
          explain: "Custom hooks must start with `use`, followed by a capital letter. That's how React and its tools recognise them as hooks.",
        },
      ],
    },
  ],
};
