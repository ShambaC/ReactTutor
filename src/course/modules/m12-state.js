// Module 12: state and events.
// In notes/tasks/hints/explanations, ~ stands for a backtick (see md below) so we do not have to escape them.
const md = (s) => s.replace(/~/g, "`");

const indexHtml = `<!doctype html>
<html>
  <head>
    <title>My React app</title>
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

const css = `body { font-family: system-ui, sans-serif; margin: 0; background: #f4f6fb; color: #1f2937; }
.app { max-width: 480px; margin: 24px auto; padding: 16px 20px; background: white; border-radius: 12px; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12); }
.app.dark { background: #1f2937; color: #f9fafb; }
.row { display: flex; gap: 8px; margin: 8px 0; }
button { font-size: 0.95rem; padding: 6px 14px; border-radius: 8px; border: none; background: #4f46e5; color: white; cursor: pointer; margin: 4px 4px 4px 0; }
.tip { background: #fef3c7; color: #78350f; padding: 8px 12px; border-radius: 8px; }
.count, .score { font-weight: 600; }
li { margin: 6px 0; }
li button { margin-left: 8px; font-size: 0.8rem; padding: 2px 10px; }
li.done { text-decoration: line-through; color: #6b7280; }
.status { font-size: 1.1rem; }
.on { color: #b45309; font-weight: 700; }
`;

const base = { "index.html": indexHtml, "index.js": indexJs, "styles.css": css };

// ---------- Lesson 1: onClick ----------
const dog = (fns, buttons) => `export default function App() {
${fns}  return (
    <div className="app">
      <h1>Biscuit the dog</h1>
      <p>Biscuit is waiting for a pat.</p>
${buttons}
    </div>
  );
}
`;
const patFn = `  function handlePat() {
    console.log("Biscuit wags his tail!");
  }

`;
const treatFn = `  function handleTreat(treat) {
    console.log("Biscuit loves the " + treat);
  }

`;
const treatButtons = (extra = "") => `      <div className="row">
        <button onClick={() => handleTreat("bone")}>Bone</button>
        <button onClick={() => handleTreat("fish")}>Fish</button>${extra}
      </div>`;
const patButton = `      <button onClick={handlePat}>Pat Biscuit</button>`;

const lessonClicks = {
  kind: "scrim",
  id: "m12-onclick",
  title: "Responding to clicks",
  notes: md(`## Events in React

An **event** is something the user does: a click, typing, moving the mouse. In React, you attach a function to an event with a special prop.

~~~jsx
function handlePat() {
  console.log("Biscuit wags his tail!");
}

<button onClick={handlePat}>Pat Biscuit</button>
~~~

- The prop is **camelCase**: ~onClick~ (capital C).
- The value goes in **curly braces**.
- **Pass the function itself.** Do **not** call it.

## Pass it, don't call it

~~~jsx
<button onClick={handlePat}>   // right: React calls it on click
<button onClick={handlePat()}> // wrong: runs while the page is drawn!
~~~

Round brackets mean "run it now". We want it to run *later*, when the click happens.

## Giving the function an argument

Wrap the call in an arrow function:

~~~jsx
<button onClick={() => handleTreat("bone")}>Bone</button>
~~~

The arrow function is the thing we pass. React runs it on click, and it calls ~handleTreat~ for us.

## Other events

~onChange~, ~onSubmit~, ~onMouseEnter~, ~onKeyDown~ all work the same way.`),
  files: { ...base, "App.jsx": dog("", "") },
  steps: [
    { say: "Welcome back! Until now our pages have only sat there. Today they come alive. We'll make a button that reacts when someone clicks it." },
    { say: "Here's a page about Biscuit the dog. There's a heading and a paragraph. Let's add a button that pats him.", open: "App.jsx", highlight: "<p>Biscuit is waiting for a pat.</p>" },
    {
      say: "A button, with the words Pat Biscuit. In the preview you can click it as much as you like, but nothing happens. We haven't told it what to do.",
      files: { "App.jsx": dog("", "      <button>Pat Biscuit</button>") },
      highlight: "<button>Pat Biscuit</button>",
    },
    {
      say: "First we write the thing we want to happen: a function. Handle pat prints Biscuit wags his tail to the console. It lives inside App, above the return.",
      files: { "App.jsx": dog(patFn, patButton) },
      highlight: "function handlePat() {",
    },
    {
      say: "Now we connect it. On the button we write on Click, with a capital C, then equals, then curly braces and the name of our function. No round brackets! Try clicking the button in the preview and look at the console.",
      files: { "App.jsx": dog(patFn, `      <button onClick={handlePat}>Pat Biscuit</button>`) },
      highlight: "onClick={handlePat}",
    },
    { say: "Every click prints a message. We handed React our function, and React calls it every time the button is clicked. That's an event handler." },
    {
      say: "Now the most common mistake of all. What if we add round brackets after handle pat? It looks natural, doesn't it?",
      files: { "App.jsx": dog(patFn, `      <button onClick={handlePat()}>Pat Biscuit</button>`) },
      highlight: "onClick={handlePat()}",
    },
    {
      say: "Look at the console. The message printed straight away, before anyone clicked! Round brackets mean run this now. React ran our function while drawing the page, and then gave the button nothing, because the function returns nothing. Clicking does nothing now.",
    },
    {
      say: "So the rule is: pass the function, don't call it. Handle pat without brackets. We're handing React the recipe, and React cooks it when the click happens.",
      files: { "App.jsx": dog(patFn, patButton) },
      highlight: "onClick={handlePat}",
    },
    {
      say: "What if the function needs information, like which treat to give? Here's handleTreat, which takes a treat. We need a bone button and a fish button, but we can't write handle treat with brackets, because that would run it straight away.",
      files: { "App.jsx": dog(patFn + treatFn, patButton + "\n" + treatButtons()) },
      highlight: "function handleTreat(treat) {",
    },
    {
      say: "The trick is an arrow function. We pass an arrow function that, when clicked, calls handle treat with the word bone. The arrow function is the thing we hand to React. It runs later, on the click.",
      highlight: '() => handleTreat("bone")',
    },
    {
      say: "Your turn. Add a third treat button for a ball. When it's clicked, the console should say Biscuit loves the ball.",
      challenge: {
        task: md(`**Challenge:** add a **Ball** button next to Bone and Fish.

When you click it, the console should print **Biscuit loves the ball**.

Reuse the ~handleTreat~ function, and remember to pass an **arrow function** to ~onClick~.`),
        hints: [
          "Copy the Fish button line and change the word and the label.",
          "Keep the arrow function: onClick={() => handleTreat(...)}",
          '<button onClick={() => handleTreat("ball")}>Ball</button>',
        ],
        tests: [
          { name: "Nothing is printed before anyone clicks", code: 'return logs.length === 0;' },
          { name: "There is a Ball button", code: 'return $$("button").some((b) => /ball/i.test(b.textContent));' },
          { name: 'Clicking Ball prints "Biscuit loves the ball"', code: 'const b = $$("button").find((x) => /ball/i.test(x.textContent)); if (!b) return false; await click(b); return logs.some((l) => l.includes("Biscuit loves the ball"));' },
        ],
      },
    },
    {
      say: "Here's mine. One more button, same pattern. The function does the work, and the arrow function passes the word.",
      files: { "App.jsx": dog(patFn + treatFn, patButton + "\n" + treatButtons('\n        <button onClick={() => handleTreat("ball")}>Ball</button>')) },
      highlight: '<button onClick={() => handleTreat("ball")}>Ball</button>',
    },
    {
      say: "Great job! You've learned to run code on a click. But did you notice? The console changes, and the page doesn't. To change what you see, a component needs memory. That's called state, and it's coming up next.",
    },
  ],
};

// ---------- Lesson 2: useState ----------
const likeApp = ({ hooks = "", fns = "", wrapper = '<div className="app">', buttons, extra = "", head = "" }) => `${head}export default function App() {
${hooks}${fns}  return (
    ${wrapper}
      <h1>Likes: {count}</h1>
${buttons}${extra}
    </div>
  );
}
`;
const likeStatic = `export default function App() {
  return (
    <div className="app">
      <h1>Likes: 0</h1>
      <button>Like</button>
    </div>
  );
}
`;
const imp = `import { useState } from "react";

`;
const likeBtn = `      <button onClick={handleLike}>Like</button>`;
const likeLetFns = `  function handleLike() {
    count = count + 1;
    console.log("count is", count);
  }

`;
const likeStateFns = `  function handleLike() {
    setCount(count + 1);
  }

`;
const countState = `  const [count, setCount] = useState(0);

`;
const resetFns = likeStateFns + `  function handleReset() {
    setCount(0);
  }

`;
const rowButtons = `      <div className="row">
        <button onClick={handleLike}>Like</button>
        <button onClick={handleReset}>Reset</button>
      </div>`;
const tipState = `  const [count, setCount] = useState(0);
  const [showTip, setShowTip] = useState(false);

`;
const tipExtra = `
      <button onClick={() => setShowTip(!showTip)}>
        {showTip ? "Hide tip" : "Show tip"}
      </button>
      {showTip && <p className="tip">Tip: Biscuit likes belly rubs.</p>}`;
const darkState = `  const [count, setCount] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [dark, setDark] = useState(false);

`;
const darkExtra = tipExtra + `
      <button onClick={() => setDark(!dark)}>Dark mode</button>`;
const arrowLike = `      <div className="row">
        <button onClick={() => setCount(count + 1)}>Like</button>
        <button onClick={handleReset}>Reset</button>
      </div>`;
const resetOnly = `  function handleReset() {
    setCount(0);
  }

`;

const lessonState = {
  kind: "scrim",
  id: "m12-use-state",
  title: "State: your component's memory",
  notes: md(`## Why a normal variable doesn't work

~~~jsx
let count = 0;
function handleLike() { count = count + 1; }
~~~

The variable changes, but the page does not. React doesn't know it changed, and every time the component re-runs, ~count~ starts at 0 again.

## useState: memory that React watches

~~~jsx
import { useState } from "react";

const [count, setCount] = useState(0);
~~~

- ~useState(0)~ starts the memory at ~0~.
- It gives back **two things** in an array: the **current value** (~count~) and a **setter function** (~setCount~). We pick names with array destructuring.
- To change it, call the setter: ~setCount(count + 1)~.

## The loop

1. The user clicks.
2. Your handler calls ~setCount~.
3. React **runs your component again** with the new value.
4. The page updates.

**State changes, React re-runs the component, the page updates.**

## Toggles

State can be a boolean, perfect for show or hide:

~~~jsx
const [show, setShow] = useState(false);
<button onClick={() => setShow(!show)}>Toggle</button>
{show && <p>Now you see me</p>}
~~~

## Common mistakes

- ~onClick={setCount(count + 1)}~ runs during the render and makes an endless loop: **Too many re-renders**. Wrap it: ~onClick={() => setCount(count + 1)}~.
- Changing ~count~ directly instead of using ~setCount~.
- Using state hooks outside a component function, or inside an ~if~.`),
  files: { ...base, "App.jsx": likeStatic },
  steps: [
    { say: "Last time, our clicks printed to the console but the page stayed the same. Now we'll fix that. This is the big idea of React, so we'll take it slowly. Our goal: a Like button that counts." },
    { say: "Here's the page. The heading says Likes zero, and the button does nothing yet. The zero is typed straight into the heading.", open: "App.jsx", highlight: "<h1>Likes: 0</h1>" },
    {
      say: "Let's try the way we already know. A variable! Let count equals zero. And we show it in the heading with curly braces.",
      files: { "App.jsx": likeApp({ hooks: "  let count = 0;\n\n", buttons: `      <button>Like</button>` }) },
      highlight: "let count = 0;",
    },
    {
      say: "Now a function that adds one to count and prints it, connected to the button. Click Like a few times in the preview and watch both the console and the heading.",
      files: { "App.jsx": likeApp({ hooks: "  let count = 0;\n\n", fns: likeLetFns, buttons: likeBtn }) },
      highlight: "count = count + 1;",
    },
    {
      say: "Interesting! The console says one, two, three. The variable really is changing. But the heading stays at zero. Why? React doesn't know our variable changed, so it never redraws the page. And even if it did, the component runs again from the top, and let count equals zero would reset it.",
    },
    {
      say: "What we need is memory that React looks after. It must survive when the component runs again, and it must tell React to redraw when it changes. That memory is called state, and we get it from a tool called useState.",
    },
    {
      say: "First we import use state from React, at the top of the file. Then we replace our variable with this line: const, square brackets, count, comma, set count, equals use state, round brackets, zero.",
      files: { "App.jsx": likeApp({ head: imp, hooks: countState, fns: likeLetFns, buttons: likeBtn }) },
      highlight: "const [count, setCount] = useState(0);",
    },
    {
      say: "Let's unpack that. Use state of zero means: start the memory at zero. It hands back an array with two things. First, the current value, which we call count. Second, a function for changing it, which we call set count. We pick the names with array destructuring.",
      highlight: "[count, setCount]",
    },
    {
      say: "Now our function doesn't change count directly. It asks React to do it: set count, round brackets, count plus one.",
      files: { "App.jsx": likeApp({ head: imp, hooks: countState, fns: likeStateFns, buttons: likeBtn }) },
      highlight: "setCount(count + 1);",
    },
    {
      say: "Click Like in the preview. The heading changes! Here's what's happening. You click. Set count tells React the new value. React runs the App function again, this time with count equal to one. And the page updates. State changes, React runs the component again, the page updates.",
    },
    {
      say: "Your turn. Add a Reset button next to Like. When it's clicked, the count should go back to zero.",
      challenge: {
        task: md(`**Challenge:** add a **Reset** button.

When clicked, the heading should go back to ~Likes: 0~.

Hint: you'll want a new function that calls ~setCount~ with a number.`),
        hints: [
          "Write a function called handleReset above the return, like handleLike.",
          "Inside it, call setCount with the number you want the count to become.",
          "function handleReset() { setCount(0); } and <button onClick={handleReset}>Reset</button>",
        ],
        tests: [
          { name: "There is a Like button and a Reset button", code: 'return $$("button").some((b) => /like/i.test(b.textContent)) && $$("button").some((b) => /reset/i.test(b.textContent));' },
          { name: "Clicking Like twice shows 2", code: 'const like = $$("button").find((b) => /like/i.test(b.textContent)); await click(like); await click(like); return text("h1").includes("2");' },
          { name: "Clicking Reset goes back to 0", code: 'const like = $$("button").find((b) => /like/i.test(b.textContent)); const reset = $$("button").find((b) => /reset/i.test(b.textContent)); await click(like); await click(like); await click(reset); return text("h1").includes("0") && !text("h1").includes("2");' },
        ],
      },
    },
    {
      say: "Here's my version. Handle reset calls set count with zero. Any value you give to set count becomes the new state. Two buttons, one piece of memory.",
      files: { "App.jsx": likeApp({ head: imp, hooks: countState, fns: resetFns, buttons: rowButtons }) },
      highlight: "setCount(0);",
    },
    {
      say: "State doesn't have to be a number. A boolean, true or false, is perfect for show and hide. We add show tip, starting as false. The button flips it with not show tip. And the tip paragraph appears only when show tip is true, using the and operator you learned.",
      files: { "App.jsx": likeApp({ head: imp, hooks: tipState, fns: resetFns, buttons: rowButtons, extra: tipExtra }) },
      highlight: "{showTip && <p",
    },
    {
      say: "Notice the button label also changes with a ternary. Show tip, or Hide tip. Click it a few times. This same recipe powers menus, popups, and dropdowns all over the web.",
      highlight: '{showTip ? "Hide tip" : "Show tip"}',
    },
    {
      say: "Challenge time again. Add a Dark mode button. When dark mode is on, the outer div should have the class names app and dark. Turn it off, and the dark class goes away.",
      challenge: {
        task: md(`**Challenge:** add a **Dark mode** button that toggles a dark look.

1. Add a new piece of state: ~const [dark, setDark] = useState(false);~
2. Add a button with the text **Dark mode** that flips ~dark~.
3. Change the outer ~<div>~ so its class is ~"app dark"~ when ~dark~ is true, and ~"app"~ on its own otherwise.

Use a ternary: ~className={dark ? "app dark" : "app"}~`),
        hints: [
          "You can copy the show tip toggle and adapt it: the new state is called dark.",
          'The button: <button onClick={() => setDark(!dark)}>Dark mode</button>',
          'On the outer div: <div className={dark ? "app dark" : "app"}>',
        ],
        tests: [
          { name: "There is a Dark mode button", code: 'return $$("button").some((b) => /dark/i.test(b.textContent));' },
          { name: "The page starts without the dark class", code: 'return !!$(".app") && !$(".app").classList.contains("dark");' },
          { name: "Clicking Dark mode turns the dark class on", code: 'const b = $$("button").find((x) => /dark/i.test(x.textContent)); await click(b); return $(".app").classList.contains("dark");' },
          { name: "Clicking again turns it off", code: 'const b = $$("button").find((x) => /dark/i.test(x.textContent)); await click(b); return !$(".app").classList.contains("dark");' },
        ],
      },
    },
    {
      say: "Here's mine. A new piece of state, a button to flip it, and a ternary for the class name. Each piece of state is separate, so you can have as many as you need.",
      files: { "App.jsx": likeApp({ head: imp, hooks: darkState, fns: resetFns, wrapper: '<div className={dark ? "app dark" : "app"}>', buttons: rowButtons, extra: darkExtra }) },
      highlight: '<div className={dark ? "app dark" : "app"}>',
    },
    {
      say: "One last mistake to meet on purpose. What if we write set count, count plus one, directly in the onClick, like this?",
      files: { "App.jsx": likeApp({ head: imp, hooks: darkState, fns: resetOnly, wrapper: '<div className={dark ? "app dark" : "app"}>', buttons: `      <div className="row">
        <button onClick={setCount(count + 1)}>Like</button>
        <button onClick={handleReset}>Reset</button>
      </div>`, extra: darkExtra }) },
      highlight: "onClick={setCount(count + 1)}",
    },
    {
      say: "Red error: Too many re-renders. Read it as a clue. Set count has round brackets, so it runs while the page is being drawn. That changes the state, which draws the page again, which runs it again, forever. React stops the loop to protect us. It's the same pass don't call rule as before.",
    },
    {
      say: "The fix is an arrow function. Now set count runs only when the click happens. Great work! You've learned the most important idea in React.",
      files: { "App.jsx": likeApp({ head: imp, hooks: darkState, fns: resetOnly, wrapper: '<div className={dark ? "app dark" : "app"}>', buttons: arrowLike, extra: darkExtra }) },
      highlight: "onClick={() => setCount(count + 1)}",
    },
  ],
};

// ---------- Lesson 3: update rules ----------
const counter = (fn, buttons, extra = "") => `import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

${fn}  return (
    <div className="app">
      <h1 className="count">Count: {count}</h1>
${buttons}${extra}
    </div>
  );
}
`;
const cFn0 = `  function handleClick() {
    setCount(count + 1);
  }

`;
const cFnLog = `  function handleClick() {
    setCount(count + 1);
    console.log("count is", count);
  }

`;
const cFnTwice = `  function handleClick() {
    setCount(count + 1);
    setCount(count + 1);
  }

`;
const cFnUpdater = `  function handleClick() {
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  }

`;
const cFnThree = cFnUpdater + `  function handleAddThree() {
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  }

`;
const addBtn = (label) => `      <button onClick={handleClick}>${label}</button>`;

const choresApp = (fns, li, extra = "") => `import { useState } from "react";

export default function App() {
  const [chores, setChores] = useState([
    { id: 1, title: "Wash dishes", done: false },
    { id: 2, title: "Water plants", done: false },
  ]);

${fns}  return (
    <div className="app">
      <h1>Chores</h1>
      <ul>
        {chores.map((chore) => (
${li}
        ))}
      </ul>${extra}
    </div>
  );
}
`;
const liPlain = `          <li key={chore.id}>{chore.title}</li>`;
const addMutate = `  function addChore() {
    chores.push({ id: Date.now(), title: "New chore", done: false });
    setChores(chores);
  }

`;
const addCopy = `  function addChore() {
    setChores([...chores, { id: Date.now(), title: "New chore", done: false }]);
  }

`;
const removeFn = `  function removeChore(id) {
    setChores(chores.filter((chore) => chore.id !== id));
  }

`;
const toggleFn = `  function toggleChore(id) {
    setChores(
      chores.map((chore) =>
        chore.id === id ? { ...chore, done: !chore.done } : chore
      )
    );
  }

`;
const addButton = `
      <button onClick={addChore}>Add chore</button>`;
const liRemove = `          <li key={chore.id}>
            {chore.title}
            <button onClick={() => removeChore(chore.id)}>Remove</button>
          </li>`;
const liToggle = `          <li key={chore.id} className={chore.done ? "done" : ""}>
            {chore.title}
            <button className="toggle" onClick={() => toggleChore(chore.id)}>
              Done
            </button>
            <button onClick={() => removeChore(chore.id)}>Remove</button>
          </li>`;

const lessonRules = {
  kind: "scrim",
  id: "m12-update-rules",
  title: "Updating state the right way",
  notes: md(`## Rule 1: state is a snapshot

Inside one run of your component, ~count~ has **one fixed value**, like a photo. ~setCount(5)~ does not change that photo. It asks React for a *new* run with a new photo.

~~~jsx
setCount(count + 1);
console.log(count); // still the OLD value
~~~

## Rule 2: use the updater form when the new value depends on the old one

~~~jsx
setCount(count + 1);
setCount(count + 1);   // adds only 1! both calls see the same old count

setCount((c) => c + 1);
setCount((c) => c + 1); // adds 2: each call gets the latest value
~~~

## Rule 3: never change arrays or objects in place. Replace them.

~~~jsx
chores.push(x); setChores(chores);          // wrong: same array, React sees no change
setChores([...chores, x]);                  // add: copy + new item
setChores(chores.filter((c) => c.id !== id)); // remove
setChores(chores.map((c) =>                  // change one item
  c.id === id ? { ...c, done: !c.done } : c
));
~~~

- **Spread** (~...~) makes a copy.
- **filter** and **map** give back **new** arrays.
- For an object: ~setUser({ ...user, age: 10 })~ copies everything and replaces only ~age~.

## Why?

React decides whether to redraw by asking "is this a *different* value?". A changed-in-place array is still the same array, so nothing happens.`),
  files: { ...base, "App.jsx": counter(cFn0, addBtn("Add 1")) },
  steps: [
    { say: "You can now make state. Today we learn the rules for changing it. Break them and you get the most common bugs in beginner React. We'll meet each bug on purpose, so you'll recognise it." },
    { say: "Here's a counter you know well. The button calls set count with count plus one.", open: "App.jsx", highlight: "setCount(count + 1);" },
    {
      say: "First rule. Let's print count right after set count. What do you expect to see on the first click? One?",
      files: { "App.jsx": counter(cFnLog, addBtn("Add 1")) },
      highlight: 'console.log("count is", count);',
    },
    {
      say: "Click the button and look. The console says zero, but the page says one! Count is a snapshot, like a photo taken at the start of this run. Set count doesn't change the photo. It asks React for a new run with a new photo.",
    },
    {
      say: "That explains a famous puzzle. What if we call set count, count plus one, twice in a row? We might expect two.",
      files: { "App.jsx": counter(cFnTwice, addBtn("Add 1")) },
      highlight: "setCount(count + 1);\n    setCount(count + 1);",
    },
    {
      say: "Click it. It only adds one! Both lines use the same photo, where count is zero. So both say set count to one. The second call didn't know about the first.",
    },
    {
      say: "When the new value depends on the old one, give set count a function instead. React passes in the latest value, and we return the new one. It's usually written c, arrow, c plus one.",
      files: { "App.jsx": counter(cFnUpdater, addBtn("Add 2")) },
      highlight: "setCount((c) => c + 1);",
    },
    {
      say: "Now each call gets the latest value, so one click adds two. This is called the updater function. Whenever your new state is based on the old state, it's the safest choice.",
    },
    {
      say: "Your turn. Add a second button called Add 3. One click should add three to the count. Use the updater form, three times.",
      challenge: {
        task: md(`**Challenge:** add an **Add 3** button.

1. Write a function ~handleAddThree~ that calls ~setCount((c) => c + 1)~ **three times**.
2. Add a button with the text **Add 3** that runs it.

One click on **Add 3** should take the count from 0 to 3.`),
        hints: [
          "Copy handleClick and add another line, so you have three set count lines.",
          "The button needs an onClick that points at your new function, without round brackets.",
          "<button onClick={handleAddThree}>Add 3</button>",
        ],
        tests: [
          { name: "There is an Add 3 button", code: 'return $$("button").some((b) => /3/.test(b.textContent));' },
          { name: "One click on Add 3 makes the count 3", code: 'const b = $$("button").find((x) => /3/.test(x.textContent)); await click(b); return text(".count").includes("3");' },
          { name: "A second click makes the count 6", code: 'const b = $$("button").find((x) => /3/.test(x.textContent)); await click(b); return text(".count").includes("6");' },
        ],
      },
    },
    {
      say: "Here's mine. Three updater calls in one function. Each one builds on the one before.",
      files: { "App.jsx": counter(cFnThree, addBtn("Add 2") + `\n      <button onClick={handleAddThree}>Add 3</button>`) },
      highlight: "function handleAddThree() {",
    },
    {
      say: "Now the third rule, and the number one beginner bug. Let's switch to a list in state: two chores. Each chore is an object with an id, a title, and whether it's done. Mapping it to list items works like last module.",
      files: { "App.jsx": choresApp("", liPlain) },
      highlight: "const [chores, setChores] = useState([",
    },
    {
      say: "Let's add a button that adds a chore. A natural way: push a new chore onto the array, then call set chores. It looks right. Try clicking it.",
      files: { "App.jsx": choresApp(addMutate, liPlain, addButton) },
      highlight: "chores.push(",
    },
    {
      say: "Nothing happens! No error, no new chore. That's why this bug is sneaky. Push changed the array in place, and then we gave React the same array. React asks, is this a different value? Same array, so it says no change, and skips redrawing.",
    },
    {
      say: "The rule is: never change state in place. Make a new copy and give that to React. Square brackets, three dots chores, then the new chore. The three dots are spread. They copy every old chore into a brand new array, and we add the new one at the end.",
      files: { "App.jsx": choresApp(addCopy, liPlain, addButton) },
      highlight: "setChores([...chores, ",
    },
    {
      say: "Now click Add chore. It works! To remove a chore we use filter. Filter gives back a new array without the chore we don't want. Keep every chore whose id is not the one we clicked.",
      files: { "App.jsx": choresApp(addCopy + removeFn, liRemove, addButton) },
      highlight: "chores.filter((chore) => chore.id !== id)",
    },
    {
      say: "The remove button uses an arrow function, because it needs to pass the chore's id. Filter made a new array, so React notices and redraws. The same idea works for every change: copy, change the copy, set it.",
      highlight: "onClick={() => removeChore(chore.id)}",
    },
    {
      say: "One more change: marking a chore as done. That means changing one object inside the array. Your turn. Use map to go through the chores. For the matching id, return a copy of the chore with done flipped. Other chores stay as they are.",
      challenge: {
        task: md(`**Challenge:** let people mark chores as done.

1. Write ~toggleChore(id)~. Use ~chores.map(...)~. For the chore whose ~id~ matches, return a **copy** with ~done~ flipped: ~{ ...chore, done: !chore.done }~. Every other chore is returned unchanged.
2. In each list item add a button with ~className="toggle"~ and the text **Done** that calls it.
3. Give the ~<li>~ the class ~"done"~ when ~chore.done~ is true.

Don't use ~chore.done = true~! That changes state in place.`),
        hints: [
          "map returns a new array. For each chore ask: is chore.id the same as the id we were given?",
          "If yes return { ...chore, done: !chore.done }. If no, return chore.",
          'setChores(chores.map((chore) => chore.id === id ? { ...chore, done: !chore.done } : chore));',
        ],
        tests: [
          { name: "Each chore has a Done button", code: 'return $$(".toggle").length === $$("li").length && $$("li").length >= 2;' },
          { name: "Clicking Done marks that chore as done", code: 'await click($$(".toggle")[0]); return $$("li")[0].classList.contains("done") && !$$("li")[1].classList.contains("done");' },
          { name: "Clicking Done again undoes it", code: 'await click($$(".toggle")[0]); return !$$("li")[0].classList.contains("done");' },
          { name: "The list does not lose chores", code: 'await click($$(".toggle")[1]); return $$("li").length === 2;' },
        ],
      },
    },
    {
      say: "Here's mine. Map goes through every chore. The matching one becomes a copy with done flipped, and everyone else is returned as is. Spread copies the object, then done overrides one property.",
      files: { "App.jsx": choresApp(addCopy + removeFn + toggleFn, liToggle, addButton) },
      highlight: "{ ...chore, done: !chore.done }",
    },
    {
      say: "Wonderful. Remember: state is a snapshot, use the updater form when the new value depends on the old, and replace arrays and objects, don't change them. Add with spread, remove with filter, change with map. That's the whole toolkit!",
    },
  ],
};

// ---------- Practice ----------
const practiceFixEvents = {
  kind: "practice",
  id: "m12-practice-events",
  title: "Practice: fix the clicks",
  type: "fix",
  task: md(`Two buttons should print messages **only when clicked**:

- **Say thanks** should print ~Thanks for clicking!~
- **Say hi to Sam** should print ~Hi, Sam~

Right now both messages print as soon as the page loads, and clicking does nothing. Find the **two bugs** (they're about calling a function versus passing it) and fix them.`),
  files: {
    ...base,
    "App.jsx": `export default function App() {
  function handleThanks() {
    console.log("Thanks for clicking!");
  }

  function handleHi(name) {
    console.log("Hi, " + name);
  }

  return (
    <div className="app">
      <h1>Click me</h1>
      <button onClick={handleThanks()}>Say thanks</button>
      <button onClick={handleHi("Sam")}>Say hi to Sam</button>
    </div>
  );
}
`,
  },
  solution: {
    "App.jsx": `export default function App() {
  function handleThanks() {
    console.log("Thanks for clicking!");
  }

  function handleHi(name) {
    console.log("Hi, " + name);
  }

  return (
    <div className="app">
      <h1>Click me</h1>
      <button onClick={handleThanks}>Say thanks</button>
      <button onClick={() => handleHi("Sam")}>Say hi to Sam</button>
    </div>
  );
}
`,
  },
  hints: [
    "Round brackets after a function name mean run it right now. onClick needs the function itself, to run later.",
    "Bug 1: remove the round brackets: onClick={handleThanks}. Bug 2: handleHi needs an argument, so wrap it in an arrow function.",
    'onClick={() => handleHi("Sam")}',
  ],
  tests: [
    { name: "Nothing is printed before a click", code: 'return logs.length === 0;' },
    { name: 'Clicking "Say thanks" prints the message', code: 'const b = $$("button").find((x) => /thanks/i.test(x.textContent)); await click(b); return logs.some((l) => l.includes("Thanks for clicking!"));' },
    { name: 'Clicking "Say hi to Sam" prints "Hi, Sam"', code: 'const b = $$("button").find((x) => /hi to sam/i.test(x.textContent)); await click(b); return logs.some((l) => l.includes("Hi, Sam"));' },
  ],
};

const practiceBuildSwitch = {
  kind: "practice",
  id: "m12-practice-switch",
  title: "Practice: build a light switch",
  type: "build",
  task: md(`Build a **light switch** using state.

- A paragraph ~<p className="status">~ says **The light is off** or **The light is on**.
- A button ~<button className="switch">~ says **Turn on** when the light is off, and **Turn off** when it is on. Clicking it flips the light.
- A paragraph ~<p className="times">~ counts the clicks: **Switched 0 times**, then **Switched 1 times**, and so on.

You'll need **two** pieces of state. The markup is already there. Make it work!`),
  files: {
    ...base,
    "App.jsx": `import { useState } from "react";

export default function App() {
  // Make two pieces of state: is the light on, and how many times was it switched?

  return (
    <div className="app">
      <h1>Light switch</h1>
      <p className="status">The light is off</p>
      <button className="switch">Turn on</button>
      <p className="times">Switched 0 times</p>
    </div>
  );
}
`,
  },
  solution: {
    "App.jsx": `import { useState } from "react";

export default function App() {
  const [isOn, setIsOn] = useState(false);
  const [times, setTimes] = useState(0);

  function handleSwitch() {
    setIsOn(!isOn);
    setTimes(times + 1);
  }

  return (
    <div className="app">
      <h1>Light switch</h1>
      <p className="status">The light is {isOn ? "on" : "off"}</p>
      <button className="switch" onClick={handleSwitch}>
        {isOn ? "Turn off" : "Turn on"}
      </button>
      <p className="times">Switched {times} times</p>
    </div>
  );
}
`,
  },
  hints: [
    "Make a boolean state starting at false (for on or off) and a number state starting at 0 (for the clicks).",
    "One click handler can call both setters: one flips the boolean with !, and one adds 1 to the number.",
    'Use a ternary in the text: {isOn ? "on" : "off"}, and {isOn ? "Turn off" : "Turn on"} for the button.',
  ],
  tests: [
    { name: "The light starts off", code: 'return text(".status").includes("off") && text(".switch") === "Turn on" && text(".times") === "Switched 0 times";' },
    { name: "Clicking turns the light on and counts once", code: 'await click(".switch"); return text(".status").includes("on") && !text(".status").includes("off") && text(".switch") === "Turn off" && text(".times") === "Switched 1 times";' },
    { name: "Clicking again turns it off and counts twice", code: 'await click(".switch"); return text(".status").includes("off") && text(".switch") === "Turn on" && text(".times") === "Switched 2 times";' },
    { name: "The code uses useState", code: 'return files()["App.jsx"].includes("useState(");' },
  ],
};

const practiceFixRules = {
  kind: "practice",
  id: "m12-practice-rules",
  title: "Practice: fix the stuck page",
  type: "fix",
  task: md(`Two buttons are misbehaving.

1. **Add 2** should add **2** to the score, but it only adds 1.
2. **Add player** should add a new line to the list, but nothing happens when you click it.

Both bugs break a rule about updating state. Fix them, then **Check my code**.`),
  files: {
    ...base,
    "App.jsx": `import { useState } from "react";

export default function App() {
  const [score, setScore] = useState(0);
  const [players, setPlayers] = useState(["Ada", "Alan"]);

  function addTwo() {
    setScore(score + 1);
    setScore(score + 1);
  }

  function addPlayer() {
    players.push("New player");
    setPlayers(players);
  }

  return (
    <div className="app">
      <h1 className="score">Score: {score}</h1>
      <button className="two" onClick={addTwo}>Add 2</button>
      <ul>
        {players.map((player) => (
          <li key={player}>{player}</li>
        ))}
      </ul>
      <button className="add" onClick={addPlayer}>Add player</button>
    </div>
  );
}
`,
  },
  solution: {
    "App.jsx": `import { useState } from "react";

export default function App() {
  const [score, setScore] = useState(0);
  const [players, setPlayers] = useState(["Ada", "Alan"]);

  function addTwo() {
    setScore((s) => s + 1);
    setScore((s) => s + 1);
  }

  function addPlayer() {
    setPlayers([...players, "New player"]);
  }

  return (
    <div className="app">
      <h1 className="score">Score: {score}</h1>
      <button className="two" onClick={addTwo}>Add 2</button>
      <ul>
        {players.map((player) => (
          <li key={player}>{player}</li>
        ))}
      </ul>
      <button className="add" onClick={addPlayer}>Add player</button>
    </div>
  );
}
`,
  },
  hints: [
    "Bug 1: both set score calls use the same snapshot of score. Use the updater form so each call gets the latest value.",
    "Bug 2: push changes the array in place, so React sees the same array and skips the redraw. Make a copy instead.",
    'setScore((s) => s + 1) twice, and setPlayers([...players, "New player"])',
  ],
  tests: [
    { name: "Add 2 adds two to the score", code: 'await click(".two"); return text(".score") === "Score: 2";' },
    { name: "Add 2 keeps adding two", code: 'await click(".two"); return text(".score") === "Score: 4";' },
    { name: "Add player adds a line to the list", code: 'const before = $$("li").length; await click(".add"); return $$("li").length === before + 1 && text().includes("New player");' },
    { name: "The code does not use push on state", code: 'return !files()["App.jsx"].includes(".push(");' },
  ],
};

const quiz = {
  kind: "quiz",
  id: "m12-quiz",
  title: "Quick check: state and events",
  questions: [
    {
      q: "What happens when this page loads?",
      code: 'function sayHi() {\n  console.log("Hi!");\n}\n\n<button onClick={sayHi()}>Hello</button>',
      options: [
        "Nothing, until the button is clicked",
        "Hi! prints immediately, because sayHi() runs while the page is drawn",
        "Hi! prints every time the button is clicked",
        "An error about onClick",
      ],
      answer: 1,
      explain: "Round brackets mean run it now. The function runs while React draws the button, and the button gets nothing to run on click. We want onClick={sayHi}.",
    },
    {
      q: "Why doesn't the page update when this button is clicked?",
      code: "export default function App() {\n  let count = 0;\n  return (\n    <button onClick={() => { count = count + 1; }}>\n      Clicked {count} times\n    </button>\n  );\n}",
      options: [
        "count should be a string",
        "React doesn't know a normal variable changed, so it doesn't redraw. We need state.",
        "Arrow functions don't work in onClick",
        "There is a missing key",
      ],
      answer: 1,
      explain: "Changing a plain variable doesn't tell React to redraw. useState gives a value React watches, plus a setter that asks for a redraw.",
    },
    {
      q: "What does useState(0) give back?",
      options: [
        "Only the number 0",
        "An array with the current value and a function to change it",
        "A function that adds 1",
        "An object with a count property",
      ],
      answer: 1,
      explain: "useState returns an array with two items: the current value, and a setter function. That's why we write const [count, setCount] = useState(0).",
    },
    {
      q: "The count starts at 0. After one click, what is printed to the console?",
      code: "function handleClick() {\n  setCount(count + 1);\n  console.log(count);\n}",
      options: ["0", "1", "undefined", "Nothing"],
      answer: 0,
      explain: "State is a snapshot. In this run of the component, count is still 0. The new value arrives in the next run, after the page redraws.",
    },
    {
      q: "The count starts at 0. How much does one click add?",
      code: "function handleClick() {\n  setCount(count + 1);\n  setCount(count + 1);\n}",
      options: ["0", "1", "2", "It crashes"],
      answer: 1,
      explain: "Both calls use the same snapshot, where count is 0. So both say set it to 1. To add 2, use setCount((c) => c + 1) twice.",
    },
    {
      q: "Spot the bug. Clicking Add does nothing, even though the code runs. Why?",
      code: "const [items, setItems] = useState([\"a\", \"b\"]);\n\nfunction addItem() {\n  items.push(\"c\");\n  setItems(items);\n}",
      options: [
        "push is not a real array method",
        "It changes the array in place, so React sees the same array and skips the redraw",
        "setItems must be called twice",
        "items must be a string",
      ],
      answer: 1,
      explain: "Never change state in place. Make a new copy with spread, like setItems([...items, \"c\"]), and React will notice and redraw.",
    },
  ],
};

export default {
  id: "m12",
  title: "State and events",
  summary: "Make pages react to clicks, give components memory with useState, and learn the rules for updating state safely.",
  lessons: [lessonClicks, practiceFixEvents, lessonState, practiceBuildSwitch, lessonRules, practiceFixRules, quiz],
};
