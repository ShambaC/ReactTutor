// Module 15: effects, the dependency array, fetching data, loading and error states, refetching, cleanup.
// In notes/task strings a tilde (~) stands for a backtick, so we do not have to escape every code sample.
const md = (s) => s.replace(/~/g, "`");

const indexHtml = `<!doctype html>
<html>
  <head>
    <title>Effects</title>
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

const css = `body { font-family: system-ui, sans-serif; background: #f0f9ff; margin: 0; }
.app { max-width: 380px; margin: 24px auto; background: white; padding: 20px; border-radius: 12px; }
.app.dark { background: #1e293b; color: white; }
h1 { margin-top: 0; font-size: 22px; }
ul { padding-left: 20px; }
.card { background: #f1f5f9; border-radius: 8px; padding: 8px 12px; margin-top: 12px; }
.error { color: #b91c1c; }
button { cursor: pointer; margin-right: 6px; }
`;

const base = { "index.html": indexHtml, "index.js": indexJs, "styles.css": css };

// ---------------- lesson 1: the counter ----------------
const counter = (o) => `import { useState${o.useEffect ? ", useEffect" : ""} } from "react";

export default function App() {
  const [count, setCount] = useState(0);
${o.dark ? "  const [dark, setDark] = useState(false);\n" : ""}${o.runs ? "  const [runs, setRuns] = useState(0);\n" : ""}${o.renderLog ? '\n  console.log("Render: count is " + count);\n' : ""}${o.effects || ""}
  return (
    <div className=${o.dark ? '{dark ? "app dark" : "app"}' : '"app"'}>
      <h1>Clicked {count} times</h1>
      <button onClick={() => setCount(count + 1)}>Click me</button>
${o.dark ? "      <button onClick={() => setDark(!dark)}>Toggle dark</button>\n" : ""}${o.runs ? "      <p>Effect runs: {runs}</p>\n" : ""}    </div>
  );
}
`;

const titleEffect = (deps) => `
  useEffect(() => {
    document.title = "Clicked " + count + " times";
  }${deps});
`;
const titleLogEffect = (deps) => `
  useEffect(() => {
    console.log("Effect ran");
    document.title = "Clicked " + count + " times";
  }${deps});
`;
const darkEffect = `
  useEffect(() => {
    console.log(dark ? "Dark mode is on" : "Dark mode is off");
  }, [dark]);
`;

const a0 = counter({});
const a1 = counter({ useEffect: true, effects: titleEffect("") });
const a2 = counter({ useEffect: true, renderLog: true, effects: titleLogEffect("") });
const a3 = counter({ useEffect: true, renderLog: true, effects: titleLogEffect(", []") });
const a4 = counter({ useEffect: true, renderLog: true, dark: true, effects: titleLogEffect(", [count]") });
const a5 = counter({ useEffect: true, renderLog: true, dark: true, effects: titleLogEffect(", [count]") + darkEffect });
const loopEffect = `
  useEffect(() => {
    setRuns(runs + 1);
  });
`;
const a6 = counter({ useEffect: true, renderLog: true, dark: true, runs: true, effects: titleLogEffect(", [count]") + darkEffect + loopEffect });
const a7 = counter({
  useEffect: true,
  renderLog: true,
  dark: true,
  runs: true,
  effects: titleLogEffect(", [count]") + darkEffect + loopEffect.replace("  });", "  }, []);"),
});

// ---------------- lesson 2: fetching users ----------------
const listJsx = `  return (
    <div className="app">
      <h1>Our users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.city})
          </li>
        ))}
      </ul>
    </div>
  );
}
`;

const b0 = `import { useState } from "react";

export default function App() {
  const [users, setUsers] = useState([]);

${listJsx}`;

const b1 = `import { useState, useEffect } from "react";

export default function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);

${listJsx}`;

const b2 = b1.replace("console.log(data)", "setUsers(data)");

const b3 = `import { useState, useEffect } from "react";

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

${listJsx}`;

const b4 = b3.replace('"/api/users"', '"/api/nope"');

const b5 = `import { useState, useEffect } from "react";

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/nope")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Request failed with status " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error">Something went wrong: {error}</p>;
  }

${listJsx}`;

const b6 = b5.replace('"/api/nope"', '"/api/users"');

const asyncApp = (o) => `import { useState, useEffect } from "react";

export default function App() {
  const [${o.name}, set${o.Name}] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("${o.url}");
        if (!res.ok) {
          throw new Error("Request failed with status " + res.status);
        }
        const data = await res.json();
        set${o.Name}(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error">Something went wrong: {error}</p>;
  }

  return (
    <div className="app">
      <h1>${o.heading}</h1>
      <ul>
        {${o.name}.map((${o.item}) => (
          <li key={${o.item}.id}>${o.line}</li>
        ))}
      </ul>
    </div>
  );
}
`;
const b7 = asyncApp({ name: "users", Name: "Users", url: "/api/users", heading: "Our users", item: "user", line: "{user.name} ({user.city})" });
const b8 = asyncApp({ name: "todos", Name: "Todos", url: "/api/todos", heading: "Our todos", item: "todo", line: "{todo.title}" });

// ---------------- lesson 3: refetch and cleanup ----------------
const selectJsx = `      <select value={id} onChange={(event) => setId(Number(event.target.value))}>
        <option value={1}>User 1</option>
        <option value={2}>User 2</option>
        <option value={3}>User 3</option>
        <option value={4}>User 4</option>
        <option value={5}>User 5</option>
      </select>
`;
const c0 = `import { useState } from "react";
import UserCard from "./UserCard.jsx";

export default function App() {
  const [id, setId] = useState(1);

  return (
    <div className="app">
      <h1>User viewer</h1>
${selectJsx}      <UserCard id={id} />
    </div>
  );
}
`;
const timerBlock = `      <hr />
      <button onClick={() => setShowTimer(!showTimer)}>
        {showTimer ? "Hide timer" : "Show timer"}
      </button>
      {showTimer && <Timer />}
`;
const c1 = `import { useState } from "react";
import UserCard from "./UserCard.jsx";
import Timer from "./Timer.jsx";

export default function App() {
  const [id, setId] = useState(1);
  const [showTimer, setShowTimer] = useState(true);

  return (
    <div className="app">
      <h1>User viewer</h1>
${selectJsx}      <UserCard id={id} />
${timerBlock}    </div>
  );
}
`;

const userCard = (deps, extra) => `import { useState, useEffect } from "react";

export default function UserCard({ id }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/users/" + id)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      });
  }${deps});

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="card">
      <h2>{user.name}</h2>
      <p>{user.city}</p>
${extra}    </div>
  );
}
`;
const u0 = `export default function UserCard({ id }) {
  return <p>Showing user number {id}</p>;
}
`;
const u1 = userCard(", [id]", "");
const u2 = userCard(", []", "");
const u4 = userCard(", [id]", "      <p>{user.email}</p>\n");

const timer = (cleanup) => `import { useState, useEffect } from "react";

export default function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log("tick");
      setSeconds((s) => s + 1);
    }, 1000);
${cleanup}  }, []);

  return <p>Timer: {seconds} seconds</p>;
}
`;
const timer0 = timer("");
const timer1 = timer(`
    return () => {
      console.log("timer stopped");
      clearInterval(timer);
    };
`);

// =====================================================================
export default {
  id: "m15",
  title: "Effects and loading data",
  summary: "Run code after render with useEffect, understand the dependency array, load data with fetch, handle loading and errors, refetch when something changes, and clean up after yourself.",
  lessons: [
    // ---------------------------------------------------------------- 1
    {
      kind: "scrim",
      id: "m15-use-effect",
      title: "useEffect: code that runs after render",
      notes: md(`## Side effects

A **side effect** is anything your component does that reaches outside of "describe the screen": changing the browser tab title, starting a timer, loading data from a server.

Rendering should only *calculate* what to show. Side effects go in **~useEffect~**, which runs **after** React has put the screen on the page.

~~~jsx
useEffect(() => {
  document.title = "Clicked " + count + " times";
}, [count]);
~~~

## The dependency array

The second argument decides **when** the effect runs:

- **No array**: after every render.
- **~[]~**: once, after the first render.
- **~[count]~**: after the first render, and again whenever ~count~ changes.

List every value from your component that the effect uses.

## The endless loop

~~~jsx
useEffect(() => {
  setRuns(runs + 1); // no array!
});
~~~

Effect sets state, state causes a render, the render runs the effect, which sets state again... forever. Add a dependency array, or ask whether you need an effect at all.

## Common mistakes

- Forgetting the array and running the effect on every render.
- Using ~[]~ when the effect reads a value that changes. The effect keeps seeing the old value.`),
      files: { ...base, "App.jsx": a0 },
      steps: [
        { say: "Welcome! So far, our components only describe what the screen looks like. But real apps also do other things: change the tab title, start timers, load data. Those are called side effects." },
        { say: "A side effect is anything a component does that reaches outside of the screen it describes. React gives us a tool for them, called use effect. Let's meet it with a click counter.", open: "App.jsx" },
        {
          say: "We import use effect, and call it with a function. React runs that function after the page is drawn. Here we change the browser tab title to show the count.",
          files: { "App.jsx": a1 },
          highlight: 'document.title = "Clicked " + count + " times";',
        },
        {
          say: "To see exactly when things happen, I'll add two messages. One in the component body that says render, and one inside the effect. Click the button and watch the console.",
          files: { "App.jsx": a2 },
          highlight: 'console.log("Effect ran");',
        },
        { say: "Each click prints Render, and then Effect ran. Always in that order. First React works out the screen. Then, after it's drawn, it runs the effect. That's why we call it after render." },
        { say: "Why does it run on every click? Because we gave use effect no second argument. With nothing there, the effect runs after every single render." },
        {
          say: "The second argument is a list called the dependency array. If it's empty, square brackets with nothing inside, the effect runs only once, after the first render. Try clicking now.",
          files: { "App.jsx": a3 },
          highlight: "}, []);",
        },
        { say: "Effect ran printed once. But look at the tab title. It's stuck at zero, even though the count goes up! The effect only ran once, so it never noticed the new count." },
        {
          say: "The fix: put count in the array. Read it as, run this effect when count changes. I've also added a second piece of state, dark, with a button that toggles it.",
          files: { "App.jsx": a4 },
          highlight: "}, [count]);",
        },
        { say: "Click Click me: Effect ran appears. Now click Toggle dark. The page redraws, so Render appears, but Effect ran does not. Dark isn't in the array, so this effect ignores it." },
        {
          say: "Your turn. Add a second effect that prints Dark mode is on, or Dark mode is off. It should run only when dark changes, not when count changes.",
          challenge: {
            task: md(`**Challenge:** add a second ~useEffect~ below the first one.

1. It should print ~Dark mode is on~ or ~Dark mode is off~ with ~console.log~, depending on ~dark~.
2. Give it a dependency array so it runs **only** when ~dark~ changes.

Click both buttons and watch the console.`),
            hints: [
              "A component can have as many effects as it likes. Each one does one job.",
              "Put `dark` inside the square brackets of the new effect.",
              '`useEffect(() => { console.log(dark ? "Dark mode is on" : "Dark mode is off"); }, [dark]);`',
            ],
            tests: [
              {
                name: "Toggling dark prints Dark mode is on",
                code: 'await click($$("button")[1]); return logs.some((l) => l.includes("Dark mode is on"));',
              },
              {
                name: "Toggling again prints Dark mode is off",
                code: 'await click($$("button")[1]); return logs.filter((l) => l.includes("Dark mode is off")).length >= 2;',
              },
              {
                name: "Clicking the count button does not print dark messages",
                code: 'const n = logs.filter((l) => l.includes("Dark mode")).length; await click($$("button")[0]); await click($$("button")[0]); return logs.filter((l) => l.includes("Dark mode")).length === n;',
              },
            ],
          },
        },
        {
          say: "Here's how I did it. A second effect with its own array containing dark. React keeps track of each effect separately. If yours looks a bit different, that's great.",
          files: { "App.jsx": a5 },
          highlight: "}, [dark]);",
        },
        {
          say: "Now a mistake that catches everyone once. I'll add an effect that sets state, and I'll leave out the array. Watch the number carefully.",
          files: { "App.jsx": a6 },
          highlight: "setRuns(runs + 1);",
        },
        {
          say: "Whoa, the number is racing! The effect sets state, so React renders again. The render runs the effect again, which sets state again, and so on, forever. An effect with no array that sets state always loops. I'll add the empty array to stop it.",
          files: { "App.jsx": a7 },
          highlight: "}, []);",
        },
        { say: "Now it runs once, and the number stops at one. If your page ever freezes or counts wildly, check your effects. Ask: does this have a dependency array? Errors are clues, not failures." },
        { say: "Recap. Use effect runs after render. No array means every render. Empty array means once. A list of values means when any of them changes. Next lesson: loading real data!" },
      ],
    },

    // ---------------------------------------------------------------- practice fill
    {
      kind: "practice",
      id: "m15-practice-title",
      title: "Practice: update the tab title",
      type: "fill",
      task: md(`Fill in the blanks (~___~) so that an effect updates the browser tab title **and** prints a message every time ~count~ changes:

- Set ~document.___~ (the property that holds the tab title).
- The title should read ~Clicked N times~, so fill in the first word.
- Print the message ~Title updated~ to the console.

Notice the dependency array at the end of the effect: that is why it only runs when ~count~ changes.

Press **Run**, click the button, then **Check my code**.`),
      files: {
        ...base,
        "App.jsx": `import { useState, useEffect } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.___ = "___ " + count + " times";
    console.log("___");
  }, [count]);

  return (
    <div className="app">
      <h1>Clicked {count} times</h1>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
`,
      },
      solution: {
        "App.jsx": `import { useState, useEffect } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = "Clicked " + count + " times";
    console.log("Title updated");
  }, [count]);

  return (
    <div className="app">
      <h1>Clicked {count} times</h1>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
`,
      },
      hints: [
        "The title of the browser tab is stored in `document.title`.",
        "The second blank is the first word of the title: the same word as in the heading.",
        "The blanks are `title`, `Clicked`, and `Title updated`.",
      ],
      tests: [
        { name: "The title starts as Clicked 0 times", code: 'return document.title === "Clicked 0 times";' },
        { name: "Clicking updates the title", code: 'await click("button"); await click("button"); return document.title === "Clicked 2 times";' },
        { name: "The console says Title updated", code: 'return logs.some((l) => l.includes("Title updated"));' },
        { name: "The effect lists count in its dependency array", code: 'return /\\[\\s*count\\s*\\]/.test(files()["App.jsx"]);' },
      ],
    },

    // ---------------------------------------------------------------- 2
    {
      kind: "scrim",
      id: "m15-fetch-data",
      title: "Fetching data with fetch",
      notes: md(`## Loading data

Apps get their data from a **server** through an **API**. We ask with ~fetch~. The answer takes a moment, so ~fetch~ gives back a **promise**: "I'll have an answer later".

~~~jsx
useEffect(() => {
  fetch("/api/users")
    .then((res) => res.json())
    .then((data) => setUsers(data));
}, []);
~~~

Use an empty array so it fetches once. Without it, ~setUsers~ would cause a render, which would fetch again, forever.

## Three states of loading data

~~~jsx
if (loading) return <p>Loading...</p>;
if (error) return <p>Something went wrong: {error}</p>;
~~~

## fetch does not throw on 404

A missing page is still a successful *conversation*. Always check ~res.ok~:

~~~jsx
if (!res.ok) throw new Error("Request failed with status " + res.status);
~~~

## async and await

~~~jsx
useEffect(() => {
  async function load() {
    try {
      const res = await fetch("/api/users");
      setUsers(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  load();
}, []);
~~~

The effect function itself must not be ~async~, so define one inside and call it.`),
      files: { ...base, "App.jsx": b0 },
      steps: [
        { say: "Welcome back! Most apps show data that lives on a server. Today we load a list of users from a pretend server. First, an idea: an A P I is like a waiter. You ask for something, and the kitchen sends it back." },
        { say: "Our app has a list ready, but the users array is empty, so the page shows nothing. Let's fill it with real data.", open: "App.jsx" },
        {
          say: "Inside use effect, we call fetch with a web address. Fetch takes time, so it returns a promise, which means, I'll answer later. Dot then says what to do when the answer arrives.",
          files: { "App.jsx": b1 },
          highlight: 'fetch("/api/users")',
        },
        { say: "The first then gets the response, which we call res. Calling res dot json turns the raw reply into real JavaScript data. The second then receives that data. For now we only print it. Look in the console!" },
        {
          say: "There are our five users. Instead of printing, we store the data in state with set users. React renders again, and the list appears.",
          files: { "App.jsx": b2 },
          highlight: "setUsers(data)",
        },
        { say: "Why the empty array? Setting state causes a render. Without the array, each render would fetch again, then set state again, forever. The empty array says, fetch once, when the page first appears." },
        {
          say: "The data takes a moment to arrive, and users see an empty page. Let's add a loading state. It starts as true. When the data arrives we set it to false. While loading, we show Loading dots.",
          files: { "App.jsx": b3 },
          highlight: "return <p>Loading...</p>;",
        },
        {
          say: "Now let's break it on purpose. I'll ask for an address that doesn't exist, slash A P I slash nope. Watch what happens.",
          files: { "App.jsx": b4 },
          highlight: '"/api/nope"',
        },
        { say: "The page crashes with: users dot map is not a function. That's a clue! The server answered with a not found message, but fetch did not treat that as a failure. So we stored a message where a list should be." },
        {
          say: "Fetch only fails when the network itself breaks. A four oh four is a normal answer. So we check res dot ok. If it's not ok, we throw an error. Dot catch receives it, and we store the message in an error state.",
          files: { "App.jsx": b5 },
          highlight: "if (!res.ok) {",
        },
        { say: "Now the page says: Something went wrong. Request failed with status 404. That's a kind message instead of a crash. Let me change the address back to the real one." },
        {
          say: "Back to slash A P I slash users, and the list is back. You now have three possible screens: loading, error, or the data. Every data component needs all three.",
          files: { "App.jsx": b6 },
          highlight: '"/api/users"',
        },
        {
          say: "There's a second style, called async and await. Await means wait here for the answer. We can't make the effect function itself async, so we write an inner function and call it. Try and catch handles errors, and finally runs either way.",
          files: { "App.jsx": b7 },
          highlight: "async function load() {",
        },
        {
          say: "Same behaviour, but it reads from top to bottom like normal code. Both styles are fine. Use whichever feels clearer to you. Your turn!",
          challenge: {
            task: md(`**Challenge:** load a different list.

1. Change the address to ~"/api/todos"~.
2. Show each todo's ~title~ in the list instead of the user's name and city.
3. Change the heading to something that matches.

Keep the loading and error handling. Wait a moment after pressing **Run**: the data takes about half a second.`),
            hints: [
              "Every todo has an id and a title. Print `todo.title` inside the list item.",
              "You can keep the variable names, but renaming `users` to `todos` makes the code easier to read.",
              "Change the address to `/api/todos` and render `{todo.title}` in each `<li>`.",
            ],
            tests: [
              {
                name: "The todos appear after loading",
                code: 'await wait(600); return $$("li").length === 4 && text().includes("Learn what a variable is");',
              },
              { name: "The Loading message is gone", code: 'await wait(600); return !text().includes("Loading");' },
              { name: "The code still handles errors", code: 'return /\\.ok\\b/.test(files()["App.jsx"]);' },
            ],
          },
        },
        {
          say: "Here's how I did it. Only the address and the list item changed. Everything else, loading and error handling, stayed the same. That's the beauty of this pattern.",
          files: { "App.jsx": b8 },
          highlight: 'fetch("/api/todos")',
        },
        { say: "Recap. Fetch inside an effect with an empty array. Keep three states: loading, error, and data. Check res dot ok, because fetch doesn't fail on a four oh four. Next: data that changes with a choice." },
      ],
    },

    // ---------------------------------------------------------------- practice build
    {
      kind: "practice",
      id: "m15-practice-quotes",
      title: "Practice: load the quotes",
      type: "build",
      task: md(`Build a quotes page that loads data.

1. Fetch ~"/api/quotes"~ once, inside ~useEffect~.
2. While waiting, show **Loading...**
3. When the data arrives, show each quote as a list item like ~Everyone was a beginner once. - Unknown~ (the ~text~, a dash, then the ~author~).
4. If the response is not ok, show **Something went wrong** instead.

Wait about half a second after pressing **Run**.`),
      files: {
        ...base,
        "App.jsx": `import { useState, useEffect } from "react";

export default function App() {
  // Your state and effect go here.

  return (
    <div className="app">
      <h1>Quotes</h1>
      <p>Quotes will appear here.</p>
    </div>
  );
}
`,
      },
      solution: {
        "App.jsx": `import { useState, useEffect } from "react";

export default function App() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadQuotes() {
      try {
        const res = await fetch("/api/quotes");
        if (!res.ok) {
          throw new Error("Request failed with status " + res.status);
        }
        setQuotes(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadQuotes();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error">Something went wrong: {error}</p>;
  }

  return (
    <div className="app">
      <h1>Quotes</h1>
      <ul>
        {quotes.map((quote) => (
          <li key={quote.id}>
            {quote.text} - {quote.author}
          </li>
        ))}
      </ul>
    </div>
  );
}
`,
      },
      hints: [
        "You need three pieces of state: the quotes, a loading flag, and an error message.",
        "Fetch inside `useEffect` with an empty array. After `res.json()`, store the data and set loading to false.",
        "Before the main return, add `if (loading) return <p>Loading...</p>;` and a similar line for the error.",
      ],
      tests: [
        { name: "The quotes appear after loading", code: 'await wait(700); return $$("li").length === 3 && text().includes("Everyone was a beginner once.");' },
        { name: "Each quote shows its author", code: 'await wait(100); return text("li").includes("Unknown");' },
        { name: "Loading... is gone once the data arrives", code: 'return !text().includes("Loading");' },
        { name: "The code uses useEffect and fetches /api/quotes", code: 'const src = files()["App.jsx"]; return /useEffect\\(/.test(src) && /fetch\\(\\s*["\']\\/api\\/quotes["\']/.test(src);' },
        { name: "The code checks whether the response is ok", code: 'return /\\.ok\\b/.test(files()["App.jsx"]);' },
      ],
    },

    // ---------------------------------------------------------------- 3
    {
      kind: "scrim",
      id: "m15-refetch-cleanup",
      title: "Refetching and cleaning up",
      notes: md(`## Refetch when something changes

Put the changing value in the dependency array. The effect runs again whenever it changes.

~~~jsx
useEffect(() => {
  setLoading(true);
  fetch("/api/users/" + id)
    .then((res) => res.json())
    .then((data) => { setUser(data); setLoading(false); });
}, [id]);
~~~

With ~[]~ instead, the effect would only run for the first ~id~, and the card would be stuck on the first user.

## Cleanup functions

Some effects start something that keeps running: timers, listeners. **Return a function** from the effect to stop it. React calls it when the component disappears, and before the effect runs again.

~~~jsx
useEffect(() => {
  const timer = setInterval(() => {
    setSeconds((s) => s + 1);
  }, 1000);

  return () => clearInterval(timer);
}, []);
~~~

## Common mistakes

- Leaving the ~id~ out of the array, so nothing refetches.
- Starting a timer and never stopping it. It keeps running after the component is gone.
- Making the effect function ~async~ itself. Define an inner function instead.`),
      files: { ...base, "App.jsx": c0, "UserCard.jsx": u0 },
      steps: [
        { say: "Welcome back! Sometimes the data we need depends on a choice the user makes. Here we have a drop-down to pick a user number. Right now the card only shows the number.", open: "App.jsx" },
        { say: "The id is state in App, and the card gets it as a prop. When the drop-down changes, the id changes, and the card renders again with a new prop. Now let's fetch the right user.", open: "UserCard.jsx" },
        {
          say: "Same pattern as before. We fetch slash A P I slash users slash, then the id. Notice the array at the end contains id. Read it as: run this effect when id changes. We also set loading back to true each time.",
          files: { "UserCard.jsx": u1 },
          highlight: "}, [id]);",
        },
        { say: "Pick a different user. The card flashes Loading, then shows the new person. The effect ran again because the id changed. It's the same rule we learned: a value in the array triggers the effect." },
        {
          say: "What if we forget? I'll change the array back to empty, on purpose. Then pick a different user.",
          files: { "UserCard.jsx": u2 },
          highlight: "}, []);",
        },
        {
          say: "The drop-down changes, but the card is stuck on the first user! The effect ran once, with the first id, and never again. React didn't know the effect cared about id. Telling it with the array fixes that.",
          files: { "UserCard.jsx": u1 },
          highlight: "}, [id]);",
        },
        {
          say: "Your turn. The card shows a name and a city. Add the user's email address underneath. Each user has an email field.",
          challenge: {
            task: md(`**Challenge:** show the user's **email** in the card, under the city.

Each user has an ~email~ property. Pick different users in the drop-down and check that the email changes too.`),
            hints: [
              "Look at how the city is shown. The email works the same way.",
              "Inside the card, add another paragraph tag.",
              "`<p>{user.email}</p>`",
            ],
            tests: [
              { name: "The first user's email is shown", code: 'await wait(600); return text().includes("ada@example.com");' },
              {
                name: "Choosing user 3 shows Grace's email",
                code: 'const s = $("select"); s.value = "3"; s.dispatchEvent(new Event("change", { bubbles: true })); await wait(700); return text().includes("grace@example.com") && !text().includes("ada@example.com");',
              },
            ],
          },
        },
        {
          say: "Here's how I did it. One more paragraph with user dot email. And because the effect depends on id, it works for every user automatically.",
          files: { "UserCard.jsx": u4 },
          highlight: "<p>{user.email}</p>",
        },
        { say: "Now a different idea: cleaning up. Some effects start something that keeps going by itself, like a timer. If we don't stop it, it keeps running even after the component is gone." },
        {
          say: "I'll add a timer under the card, with a button to hide and show it. The timer is its own component. Every second, it adds one to seconds, and prints tick in the console.",
          files: { "Timer.jsx": timer0, "App.jsx": c1 },
          open: "Timer.jsx",
          highlight: "const timer = setInterval(() => {",
        },
        { say: "Set interval means: run this function every thousand milliseconds. It gives back an id for the timer, which we keep. Watch the seconds count up, and the ticks in the console." },
        { say: "Now click Hide timer. The timer vanishes from the page. But look at the console: tick keeps appearing! The component is gone, but the timer was never stopped. That's wasted work, and it can cause bugs." },
        {
          say: "The fix is a cleanup function. Your effect can return a function. React calls it when the component disappears. Inside, we call clear interval with the timer id. Can you write it?",
          challenge: {
            task: md(`**Challenge:** stop the timer when the ~Timer~ component disappears.

At the end of the effect in ~Timer.jsx~, **return a function** that calls ~clearInterval(timer)~.

Press **Run**, click **Hide timer**, and check that ~tick~ stops appearing in the console.`),
            hints: [
              "The returned function goes inside the effect, after setInterval, before the closing of the effect.",
              "It looks like: `return () => { ... };`",
              "`return () => { clearInterval(timer); };`",
            ],
            tests: [
              { name: "The timer counts while it is shown", code: 'await wait(1300); return /Timer: [1-9]/.test(text());' },
              {
                name: "After hiding the timer, ticks stop",
                code: 'await click("button"); await wait(100); const n = logs.filter((l) => l === "tick").length; await wait(1400); return logs.filter((l) => l === "tick").length === n && !text().includes("Timer:");',
              },
              { name: "The effect returns a cleanup function", code: 'return /return\\s*\\(\\)\\s*=>/.test(files()["Timer.jsx"]) && /clearInterval/.test(files()["Timer.jsx"]);' },
            ],
          },
        },
        {
          say: "Here's how I did it. The function we return clears the timer. I also print timer stopped so we can see it run. Hide the timer now, and the ticks stop.",
          files: { "Timer.jsx": timer1 },
          highlight: "clearInterval(timer);",
        },
        { say: "Cleanup runs when the component disappears, and also before the effect runs again if its values changed. Think of it as: whatever the effect started, the cleanup stops." },
        { say: "Recap. Put changing values in the array to refetch. Return a function to clean up timers and similar things. You can now load and manage data in React. Great work!" },
      ],
    },

    // ---------------------------------------------------------------- practice fix
    {
      kind: "practice",
      id: "m15-practice-stale",
      title: "Practice: the stuck product",
      type: "fix",
      task: md(`This page shows a product, and a drop-down to choose a different one. But choosing a different product changes nothing: the page stays on the first product.

Find out why and fix it. Wait a moment after each choice, as the data takes about half a second.`),
      files: {
        ...base,
        "App.jsx": `import { useState, useEffect } from "react";

export default function App() {
  const [id, setId] = useState(1);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch("/api/products/" + id)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, []);

  return (
    <div className="app">
      <h1>Shop</h1>
      <select value={id} onChange={(event) => setId(Number(event.target.value))}>
        <option value={1}>Product 1</option>
        <option value={2}>Product 2</option>
        <option value={3}>Product 3</option>
        <option value={4}>Product 4</option>
      </select>
      {product ? (
        <p>
          {product.name} costs {product.price} dollars
        </p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
`,
      },
      solution: {
        "App.jsx": `import { useState, useEffect } from "react";

export default function App() {
  const [id, setId] = useState(1);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch("/api/products/" + id)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  return (
    <div className="app">
      <h1>Shop</h1>
      <select value={id} onChange={(event) => setId(Number(event.target.value))}>
        <option value={1}>Product 1</option>
        <option value={2}>Product 2</option>
        <option value={3}>Product 3</option>
        <option value={4}>Product 4</option>
      </select>
      {product ? (
        <p>
          {product.name} costs {product.price} dollars
        </p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
`,
      },
      hints: [
        "The id state changes when you choose, but does the effect know it should run again?",
        "Look at the dependency array at the end of the effect. What is inside it?",
        "The effect uses id, so put id inside the square brackets: `[id]`.",
      ],
      tests: [
        { name: "The first product loads", code: 'await wait(700); return text().includes("Cozy Mug");' },
        {
          name: "Choosing product 3 shows the Notebook",
          code: 'const s = $("select"); s.value = "3"; s.dispatchEvent(new Event("change", { bubbles: true })); await wait(700); return text().includes("Notebook") && !text().includes("Cozy Mug");',
        },
        {
          name: "Choosing product 4 shows the Headphones",
          code: 'const s = $("select"); s.value = "4"; s.dispatchEvent(new Event("change", { bubbles: true })); await wait(700); return text().includes("Headphones");',
        },
      ],
    },

    // ---------------------------------------------------------------- quiz
    {
      kind: "quiz",
      id: "m15-quiz",
      title: "Quick check: effects and fetching",
      questions: [
        {
          q: "When does this effect run?",
          code: 'useEffect(() => {\n  console.log("hello");\n}, []);',
          options: ["After every render", "Only once, after the first render", "Only when you click something", "Never"],
          answer: 1,
          explain: "An empty dependency array means: nothing to watch, so run once after the first render.",
        },
        {
          q: "The effect below uses count and dark. What happens when only dark changes?",
          code: "useEffect(() => {\n  document.title = 'Count: ' + count;\n}, [count]);",
          options: ["The effect runs again", "The effect does not run", "The page crashes", "count resets to zero"],
          answer: 1,
          explain: "The effect only reruns when something in its array changes. dark is not in the array, so it is ignored.",
        },
        {
          q: "Spot the bug. Why does this component keep fetching, over and over?",
          code: 'useEffect(() => {\n  fetch("/api/users")\n    .then((res) => res.json())\n    .then((data) => setUsers(data));\n});',
          options: [
            "fetch cannot be used in effects",
            "There is no dependency array, so each render fetches again and sets state again",
            "setUsers must be called twice",
            "The address is wrong",
          ],
          answer: 1,
          explain: "With no array, the effect runs after every render. Setting state causes a render, so it loops. Add `[]` to fetch once.",
        },
        {
          q: "The server answers a fetch with a 404 (not found). What does fetch do?",
          options: [
            "It throws an error automatically",
            "It gives back a normal response, and res.ok is false",
            "It retries three times",
            "It returns an empty list",
          ],
          answer: 1,
          explain: "Fetch only fails when the network itself breaks. For a 404, check `res.ok` and throw your own error.",
        },
        {
          q: "What is the function you return from an effect for?",
          code: "useEffect(() => {\n  const timer = setInterval(tick, 1000);\n  return () => clearInterval(timer);\n}, []);",
          options: [
            "To give the effect a result",
            "To clean up, such as stopping the timer when the component disappears",
            "To make the effect run faster",
            "To run the effect twice",
          ],
          answer: 1,
          explain: "React calls the returned function when the component goes away, and before the effect runs again. It undoes what the effect started.",
        },
        {
          q: "A user picker should load a new user whenever `id` changes. Which array is right?",
          code: 'useEffect(() => {\n  fetch("/api/users/" + id)...\n}, ???);',
          options: ["[]", "[id]", "No array", "[user]"],
          answer: 1,
          explain: "The effect reads id, so id goes in the array. Then it runs again each time id changes. With [] it would only ever load the first user.",
        },
      ],
    },
  ],
};
