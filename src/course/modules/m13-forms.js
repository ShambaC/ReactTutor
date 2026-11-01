// Module 13: forms and inputs.
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
label { display: block; margin: 10px 0; }
input, select, textarea { padding: 6px 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 1rem; margin-left: 8px; }
input[type="checkbox"] { margin-right: 8px; margin-left: 0; }
form input { margin-left: 0; margin-right: 8px; }
button { font-size: 0.95rem; padding: 6px 14px; border-radius: 8px; border: none; background: #4f46e5; color: white; cursor: pointer; }
.summary, .extra, .preview, .count { margin: 10px 0; }
.summary { font-weight: 600; }
.error { color: #b91c1c; }
li { margin: 4px 0; }
`;

const base = { "index.html": indexHtml, "index.js": indexJs, "styles.css": css };
const imp = `import { useState } from "react";

`;

// ---------- Lesson 1: controlled inputs ----------
const greet = ({ state = "", inputJsx = "", h1 = '<h1>Hello, stranger!</h1>', extra = "" }) => `${state ? imp : ""}export default function App() {
${state}  return (
    <div className="app">
      ${h1}${inputJsx}${extra}
    </div>
  );
}
`;
const nameState = `  const [name, setName] = useState("");

`;
const inputPlain = `
      <input type="text" placeholder="Your name" />`;
const inputValue = `
      <input type="text" placeholder="Your name" value={name} />`;
const inputFull = `
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />`;
const h1Live = '<h1>Hello, {name === "" ? "stranger" : name}!</h1>';
const countP = `
      <p className="count">{name.length} characters</p>`;
const clearBtn = `
      <button onClick={() => setName("")}>Clear</button>`;

const lessonControlled = {
  kind: "scrim",
  id: "m13-controlled",
  title: "Controlled inputs",
  notes: md(`## A controlled input

In React, we usually keep what the user types in **state**. Then React is in charge of the box. It's called a **controlled input**.

~~~jsx
const [name, setName] = useState("");

<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
~~~

- ~value={name}~ means: the box **always shows** whatever ~name~ is.
- ~onChange~ runs on every keystroke.
- ~e~ is the **event**. ~e.target~ is the input box. ~e.target.value~ is the text inside it right now.
- ~setName(...)~ stores the new text, React re-runs the component, and the box shows it.

**Type, onChange, setState, re-run, show.**

## Using what was typed

Because the text is in state, you can show it anywhere, instantly:

~~~jsx
<h1>Hello, {name}!</h1>
<p>{name.length} characters</p>
~~~

You can also change it yourself: ~setName("")~ clears the box.

## Common mistakes

- ~value={name}~ **without** ~onChange~: the box is stuck and you can't type!
- Forgetting ~e.target.value~ and writing ~setName(e)~: you store the whole event.
- Starting state as ~undefined~ instead of ~""~.

~<textarea>~ works exactly the same way.`),
  files: { ...base, "App.jsx": greet({}) },
  steps: [
    { say: "Welcome to forms! Almost every app has them: sign up, search, comments. In this lesson we'll make a box where you type your name, and the greeting changes as you type." },
    { say: "Here's our page. The greeting says Hello, stranger. Let's make it say Hello, and then whatever you type.", open: "App.jsx", highlight: "<h1>Hello, stranger!</h1>" },
    {
      say: "First, an input. A text box with a placeholder. You can type in it, but React has no idea what you typed. The box keeps its own secret memory.",
      files: { "App.jsx": greet({ inputJsx: inputPlain }) },
      highlight: '<input type="text" placeholder="Your name" />',
    },
    {
      say: "In React, we don't keep secrets. We store the text in state, so React always knows it. We import use state and make a state called name, starting with empty text, two quote marks with nothing between.",
      files: { "App.jsx": greet({ state: nameState, inputJsx: inputPlain }) },
      highlight: 'const [name, setName] = useState("");',
    },
    {
      say: "Now we tell the box to show our state: value equals curly braces name. Go ahead, try typing in the preview.",
      files: { "App.jsx": greet({ state: nameState, inputJsx: inputValue }) },
      highlight: "value={name}",
    },
    {
      say: "You can't type! Nothing appears. Don't worry, this is a classic. We told the box: always show name. And name is empty text forever, because nothing ever changes it. React also prints a warning in the console about a value without an on change.",
    },
    {
      say: "The fix is an on change handler. It runs on every key press. We write: on Change, arrow function with e, then set name of e dot target dot value.",
      files: { "App.jsx": greet({ state: nameState, inputJsx: inputFull }) },
      highlight: "onChange={(e) => setName(e.target.value)}",
    },
    {
      say: "What's e? It's the event, an object that describes what happened a moment ago. E dot target is the input box itself. And dot value is the text currently inside. So each key press stores the new text in state, React runs the component again, and the box shows it.",
      highlight: "e.target.value",
    },
    {
      say: "Now the payoff. Because the text lives in state, we can use it anywhere. In the heading, we show name. If it's still empty, we show the word stranger, using a ternary. Type in the box and watch the heading follow you.",
      files: { "App.jsx": greet({ state: nameState, inputJsx: inputFull, h1: h1Live }) },
      highlight: '{name === "" ? "stranger" : name}',
    },
    {
      say: "Your turn. Add a paragraph that shows how many characters have been typed. Give it the class count. A string's length tells you how many characters it has, and it works on state too.",
      challenge: {
        task: md(`**Challenge:** add a character counter.

Under the input, add a paragraph with the class ~count~ that says, for example, **3 characters** when the box contains ~Sam~.

Hint: ~name.length~ is the number of characters in ~name~.`),
        hints: [
          'Add <p className="count"></p> under the input.',
          "Inside the paragraph, use curly braces to show name.length, then the word characters.",
          '<p className="count">{name.length} characters</p>',
        ],
        tests: [
          { name: "The counter starts at 0", code: 'return text(".count").includes("0");' },
          { name: 'Typing "Sam" shows 3', code: 'await type("input", "Sam"); return text(".count").includes("3");' },
          { name: 'Typing "Sam Smith" shows 9', code: 'await type("input", "Sam Smith"); return text(".count").includes("9") && text("h1").includes("Sam Smith");' },
        ],
      },
    },
    {
      say: "Here's mine. A paragraph showing name dot length. It updates on every key press, for free, because it reads from state.",
      files: { "App.jsx": greet({ state: nameState, inputJsx: inputFull, h1: h1Live, extra: countP }) },
      highlight: "{name.length} characters",
    },
    {
      say: "Why do all this work, instead of letting the browser handle the box? Because now React is in charge. We can change the box ourselves. Let's add a Clear button that sets name back to empty text.",
      files: { "App.jsx": greet({ state: nameState, inputJsx: inputFull, h1: h1Live, extra: countP + clearBtn }) },
      highlight: '<button onClick={() => setName("")}>Clear</button>',
    },
    {
      say: "Click Clear and the box empties, the heading goes back to stranger, and the counter resets. One piece of state, three places updated. Text areas work exactly the same way. Next, we'll handle forms with many fields.",
    },
  ],
};

// ---------- Lesson 2: multiple fields ----------
const labelInline = (label, key) => `      <label>
        ${label}
        <input
          value={form.${key}}
          onChange={(e) => setForm({ ...form, ${key}: e.target.value })}
        />
      </label>`;
const labelGeneric = (label, key) => `      <label>
        ${label}
        <input name="${key}" value={form.${key}} onChange={handleChange} />
      </label>`;
const club = ({ stateObj, handler = "", fields, extra = "" }) => `import { useState } from "react";

export default function App() {
  const [form, setForm] = useState(${stateObj});

${handler}  return (
    <div className="app">
      <h1>Join the club</h1>
${fields}${extra}
    </div>
  );
}
`;
const stateNE = '{ name: "", email: "" }';
const stateNEC = '{ name: "", email: "", city: "" }';
const stateAll = '{ name: "", email: "", city: "", newsletter: false, pet: "dog" }';
const nameField = labelInline("Name", "name");
const emailField = labelInline("Email", "email");
const cityInlineNamed = `      <label>
        City
        <input
          name="city"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />
      </label>`;
const sum1 = `
      <p className="summary">{form.name} ({form.email})</p>`;
const sum2 = `
      <p className="summary">{form.name} from {form.city} ({form.email})</p>`;
const handler = `  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

`;
const genFields = ["Name:name", "Email:email", "City:city"].map((x) => labelGeneric(...x.split(":"))).join("\n");
const checkbox = `
      <label>
        <input
          type="checkbox"
          checked={form.newsletter}
          onChange={(e) => setForm({ ...form, newsletter: e.target.checked })}
        />
        Send me news
      </label>`;
const select = `
      <label>
        Favourite pet
        <select name="pet" value={form.pet} onChange={handleChange}>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="hamster">Hamster</option>
        </select>
      </label>`;
const extra1 = `
      <p className="extra">News: {form.newsletter ? "yes" : "no"}</p>`;
const extra2 = `
      <p className="extra">
        Favourite pet: {form.pet}. News: {form.newsletter ? "yes" : "no"}
      </p>`;

const lessonMulti = {
  kind: "scrim",
  id: "m13-multiple-fields",
  title: "Many fields, one object",
  notes: md(`## One object for the whole form

Instead of one state per field, keep all the fields in **one object**:

~~~jsx
const [form, setForm] = useState({ name: "", email: "" });
~~~

To change one field, **copy** the object with spread and replace only that key:

~~~jsx
onChange={(e) => setForm({ ...form, name: e.target.value })}
~~~

Never write ~form.name = ...~ (that changes state in place). Always give ~setForm~ a **new** object.

## One handler for every text field

Give each input a ~name~ matching its key, then share a handler:

~~~jsx
function handleChange(e) {
  setForm({ ...form, [e.target.name]: e.target.value });
}

<input name="city" value={form.city} onChange={handleChange} />
~~~

The square brackets around ~e.target.name~ mean "use the *value* of this as the key".

## Other kinds of fields

- **Checkbox:** use ~checked~ (true or false) and ~e.target.checked~.
- **Select (dropdown):** put ~value~ and ~onChange~ on the ~<select>~, like a text input.

~~~jsx
<input type="checkbox" checked={form.newsletter}
  onChange={(e) => setForm({ ...form, newsletter: e.target.checked })} />

<select name="pet" value={form.pet} onChange={handleChange}>
  <option value="dog">Dog</option>
</select>
~~~`),
  files: { ...base, "App.jsx": club({ stateObj: stateNE, fields: nameField }) },
  steps: [
    { say: "Real forms have lots of fields: name, email, city, and more. Making a separate piece of state for each one gets messy. So in this lesson we'll keep the whole form in one object." },
    { say: "Here's the start of a sign up form. Look at the state. It's one object with a name and an email, both empty for now.", open: "App.jsx", highlight: '{ name: "", email: "" }' },
    {
      say: "Look at the on change handler. When you type, we call set form with a new object. Three dots form copies every field we already have. Then name, colon, the new text, replaces only the name. Copy, then replace one field. This is the rule from the last module in action.",
      highlight: "setForm({ ...form, name: e.target.value })",
    },
    {
      say: "Adding the email field is the same pattern. We copy the name field, and change name to email, everywhere.",
      files: { "App.jsx": club({ stateObj: stateNE, fields: nameField + "\n" + emailField }) },
      highlight: "setForm({ ...form, email: e.target.value })",
    },
    {
      say: "Both fields share one state. Typing in email keeps the name, thanks to the spread. Let's show a live summary underneath, reading straight from the form object.",
      files: { "App.jsx": club({ stateObj: stateNE, fields: nameField + "\n" + emailField, extra: sum1 }) },
      highlight: '<p className="summary">{form.name} ({form.email})</p>',
    },
    {
      say: "Your turn. Add a city field. It needs three changes: a city in the state object, an input that updates it, and the summary showing it. Give your input the name attribute city.",
      challenge: {
        task: md(`**Challenge:** add a **City** field.

1. Add ~city: ""~ to the object inside ~useState~.
2. Add a third ~<label>~ with an ~<input>~ for it. Give the input the attribute ~name="city"~. It uses the same pattern: ~value={form.city}~ and an ~onChange~ with ~{ ...form, city: e.target.value }~.
3. Change the summary so it shows the city, for example: ~Sam from Leeds (sam@example.com)~.

Typing in city must not erase the name or email!`),
        hints: [
          "Copy the email label and change email to city everywhere, then add name=\"city\" to the input.",
          'The state becomes { name: "", email: "", city: "" }.',
          '<p className="summary">{form.name} from {form.city} ({form.email})</p>',
        ],
        tests: [
          { name: "There is a city input", code: 'return !!$(\'input[name="city"]\');' },
          { name: "Typing a city shows it in the summary", code: 'await type(\'input[name="city"]\', "Leeds"); return text(".summary").includes("Leeds");' },
          { name: "Typing a name keeps the city", code: 'await type($$("input")[0], "Sam"); return text(".summary").includes("Sam") && text(".summary").includes("Leeds");' },
          { name: "Typing an email keeps the name and city", code: 'await type($$("input")[1], "sam@example.com"); const t = text(".summary"); return t.includes("sam@example.com") && t.includes("Sam") && t.includes("Leeds");' },
        ],
      },
    },
    {
      say: "Here's my version. City in the state, a third field, and a longer summary. Every field copies the old object first, so none of them erase the others.",
      files: { "App.jsx": club({ stateObj: stateNEC, fields: nameField + "\n" + emailField + "\n" + cityInlineNamed, extra: sum2 }) },
      highlight: 'name="city"',
    },
    {
      say: "Now we have three nearly identical handlers. Here's a shortcut. Give each input a name matching its key in the object. Then write one shared handler. Inside it, e dot target dot name tells us which field changed.",
      files: { "App.jsx": club({ stateObj: stateNEC, handler, fields: genFields, extra: sum2 }) },
      highlight: "[e.target.name]: e.target.value",
    },
    {
      say: "See the square brackets around e dot target dot name? They mean: use the value of this as the key. If the input is named city, it sets city. One handler for every text field. Try typing in all three.",
      highlight: "function handleChange(e) {",
    },
    {
      say: "Checkboxes work a little differently. They don't have a text value, they're on or off. So we use checked, which is true or false, and e dot target dot checked. We add newsletter to the state, starting as false.",
      files: { "App.jsx": club({ stateObj: stateAll, handler, fields: genFields + checkbox, extra: sum2 + extra1 }) },
      highlight: "checked={form.newsletter}",
    },
    {
      say: "Click the checkbox in the preview. The paragraph below switches between yes and no. We could use the shared handler here too, but checkboxes read checked instead of value, so we gave this one its own handler.",
      highlight: 'onChange={(e) => setForm({ ...form, newsletter: e.target.checked })}',
    },
    {
      say: "Last field type: a dropdown. In React, you put value and on change on the select tag itself, not on the options. It works like a text input, so the shared handler is perfect for it.",
      files: { "App.jsx": club({ stateObj: stateAll, handler, fields: genFields + checkbox + select, extra: sum2 + extra2 }) },
      highlight: '<select name="pet" value={form.pet} onChange={handleChange}>',
    },
    {
      say: "Pick a pet and watch the summary change. You now know text boxes, checkboxes and dropdowns. Next we'll make the form submit, and collect the answers in a list.",
    },
  ],
};

// ---------- Lesson 3: submit ----------
const shop = ({ state = "", fns = "", form, extra = "" }) => `import { useState } from "react";

export default function App() {
  const [items, setItems] = useState(["Apples", "Bread"]);
  const [text, setText] = useState("");
${state}
${fns}  return (
    <div className="app">
      <h1>Shopping list</h1>
${form}${extra}
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
`;
const plainInput = `      <input
        placeholder="Add an item"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />`;
const formJsx = `      <form onSubmit={handleSubmit}>
        <input
          placeholder="Add an item"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>`;
const fnLog = `  function handleSubmit(e) {
    console.log("Submitted:", text);
  }

`;
const fnPrevent = `  function handleSubmit(e) {
    e.preventDefault();
    console.log("Submitted:", text);
  }

`;
const fnAdd = `  function handleSubmit(e) {
    e.preventDefault();
    setItems([...items, text]);
  }

`;
const fnClear = `  function handleSubmit(e) {
    e.preventDefault();
    setItems([...items, text]);
    setText("");
  }

`;
const fnEmpty = `  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed === "") {
      return;
    }
    setItems([...items, trimmed]);
    setText("");
  }

`;
const errState = `  const [error, setError] = useState("");
`;
const fnError = `  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed === "") {
      setError("Please type something first.");
      return;
    }
    setItems([...items, trimmed]);
    setText("");
    setError("");
  }

`;
const fnDupes = `  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed === "") {
      setError("Please type something first.");
      return;
    }
    if (items.includes(trimmed)) {
      setError("That is already on your list.");
      return;
    }
    setItems([...items, trimmed]);
    setText("");
    setError("");
  }

`;
const errJsx = `
      {error && <p className="error">{error}</p>}`;

const lessonSubmit = {
  kind: "scrim",
  id: "m13-submit",
  title: "Submitting a form and building a list",
  notes: md(`## The form element

Wrap your fields in ~<form>~ and handle ~onSubmit~. This makes the **Enter** key work, and the button with ~type="submit"~ too.

~~~jsx
function handleSubmit(e) {
  e.preventDefault();   // stop the page from reloading!
  setItems([...items, text]);
  setText("");          // clear the box
}

<form onSubmit={handleSubmit}>
  <input value={text} onChange={(e) => setText(e.target.value)} />
  <button type="submit">Add</button>
</form>
~~~

## Why preventDefault?

By default, a browser **reloads the page** when a form is submitted, and everything in state is lost. ~e.preventDefault()~ says "no thanks, I'll handle it myself".

## Adding to a list in state

Remember: **replace**, don't change. ~setItems([...items, text])~ makes a new array with the new item at the end.

## Clearing the input

Because the input is controlled, ~setText("")~ empties it.

## Friendly validation

Check before you add. Keep a message in state and show it only when it has something to say:

~~~jsx
const [error, setError] = useState("");
if (text.trim() === "") {
  setError("Please type something first.");
  return;               // stop here
}
{error && <p className="error">{error}</p>}
~~~

~.trim()~ removes spaces from both ends, so a box with only spaces counts as empty.`),
  files: { ...base, "App.jsx": shop({ form: plainInput }) },
  steps: [
    { say: "In this lesson we put everything together: a shopping list where you type an item, press Enter, and it joins the list. Let's see what we've got." },
    { say: "Here's the start. A list in state with two items, and a controlled input, like you wrote last time. The text lives in a state called text.", open: "App.jsx", highlight: 'const [text, setText] = useState("");' },
    {
      say: "Real forms use the form tag, so that pressing Enter works, and there's a proper submit button. We wrap the input in a form, add a button, and give the form an on Submit handler.",
      files: { "App.jsx": shop({ fns: fnLog, form: formJsx }) },
      highlight: "<form onSubmit={handleSubmit}>",
    },
    {
      say: "The handler receives the event, e. If we click Add right now, we'd see a flash in the console, and then the whole page reloads, and our text vanishes! Browsers reload on form submit by default. That's from long before React existed.",
      highlight: "function handleSubmit(e) {",
    },
    {
      say: "We stop that with e dot prevent default, as the first line. It means: browser, please don't do your usual thing, I'll handle this myself. Every React form handler starts this way.",
      files: { "App.jsx": shop({ fns: fnPrevent, form: formJsx }) },
      highlight: "e.preventDefault();",
    },
    {
      say: "Now the real work. Instead of logging, we add the text to the list. We copy the old items with spread, and add the new text at the end. Never push! We make a new array, as we learned.",
      files: { "App.jsx": shop({ fns: fnAdd, form: formJsx }) },
      highlight: "setItems([...items, text]);",
    },
    {
      say: "Type something and press Enter. It works! But the text stays in the box. Since the input is controlled, clearing it takes one line: set text to empty.",
      files: { "App.jsx": shop({ fns: fnClear, form: formJsx }) },
      highlight: 'setText("");',
    },
    {
      say: "Now, what if someone presses Add with an empty box? We'd add a blank item. Let's check first. Trim removes spaces from both ends. If what's left is empty, we return early, and nothing is added.",
      files: { "App.jsx": shop({ fns: fnEmpty, form: formJsx }) },
      highlight: 'if (trimmed === "") {',
    },
    {
      say: "Doing nothing is a bit rude, though. The user won't know why. Let's tell them nicely. We add a piece of state called error, and show a message when it has one. The and operator shows the paragraph only when error isn't empty.",
      files: { "App.jsx": shop({ state: errState, fns: fnError, form: formJsx, extra: errJsx }) },
      highlight: '{error && <p className="error">{error}</p>}',
    },
    {
      say: "An empty string is falsy, so when there's no error, nothing shows. And after a successful add, we clear the error. Friendly messages like this make forms feel kind.",
      highlight: 'setError("");',
    },
    {
      say: "Your turn. What if someone adds Apples again? Let's stop duplicates. If the list already includes the item, set the error to That is already on your list, and return early.",
      challenge: {
        task: md(`**Challenge:** stop duplicate items.

In ~handleSubmit~, after the empty check, add a second check:

- If ~items.includes(trimmed)~, call ~setError("That is already on your list.")~ and ~return~.

Adding **Apples** again should show the message and leave the list at two items. Adding **Milk** should still work.`),
        hints: [
          "Copy the empty check if block and change the condition and the message.",
          "items.includes(trimmed) is true when the array already has that exact text.",
          'if (items.includes(trimmed)) { setError("That is already on your list."); return; }',
        ],
        tests: [
          { name: "Adding a duplicate shows an error and no new item", code: 'await type("input", "Apples"); $("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); await wait(80); return $$("li").length === 2 && text(".error").toLowerCase().includes("already");' },
          { name: "Adding a new item works, clears the box and the error", code: 'await type("input", "Milk"); $("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); await wait(80); return $$("li").length === 3 && text().includes("Milk") && $("input").value === "" && !$(".error");' },
          { name: "An empty box still shows a message", code: 'await type("input", "   "); $("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); await wait(80); return $$("li").length === 3 && !!$(".error");' },
        ],
      },
    },
    {
      say: "Here's mine. A second check using includes. We return early in both checks, so the add code only runs for good input. Your wording can be different.",
      files: { "App.jsx": shop({ state: errState, fns: fnDupes, form: formJsx, extra: errJsx }) },
      highlight: "if (items.includes(trimmed)) {",
    },
    {
      say: "That's a complete form: controlled inputs, a submit handler with prevent default, adding to a list with spread, clearing the box, and friendly checks. You can build almost any form with these pieces. Time to practice!",
    },
  ],
};

// ---------- Practice ----------
const practiceFill = {
  kind: "practice",
  id: "m13-practice-echo",
  title: "Practice: a controlled input",
  type: "fill",
  task: md(`Finish this **echo box**. Whatever is typed in the box should appear in the paragraph below it.

Fill in the three blanks (~___~):

1. The input's attribute that sets what the box shows (hint: it's the same word as the thing we read in the next blank).
2. The attribute that runs when the text changes.
3. The part of ~e.target~ that holds the text.

Press **Run**, type something, then **Check my code**.`),
  files: {
    ...base,
    "App.jsx": `import { useState } from "react";

export default function App() {
  const [message, setMessage] = useState("");

  return (
    <div className="app">
      <h1>Echo box</h1>
      <input
        placeholder="Type here"
        ___={message}
        ___={(e) => setMessage(e.target.___)}
      />
      <p className="preview">You typed: {message}</p>
    </div>
  );
}
`,
  },
  solution: {
    "App.jsx": `import { useState } from "react";

export default function App() {
  const [message, setMessage] = useState("");

  return (
    <div className="app">
      <h1>Echo box</h1>
      <input
        placeholder="Type here"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <p className="preview">You typed: {message}</p>
    </div>
  );
}
`,
  },
  hints: [
    "A controlled input has two attributes: one that tells it what to show, and one that runs when the user types.",
    "The attributes are value and onChange (with a capital C). The text inside the box is e.target.value.",
    "The answers are: value, onChange, value.",
  ],
  tests: [
    { name: "Typing in the box shows the text below", code: 'await type("input", "Hello"); return text(".preview").includes("Hello");' },
    { name: "The box keeps what you typed", code: 'return $("input").value === "Hello";' },
    { name: "Typing again updates the preview", code: 'await type("input", "Hi there"); return text(".preview") === "You typed: Hi there";' },
  ],
};

const practiceBuild = {
  kind: "practice",
  id: "m13-practice-signup",
  title: "Practice: build a sign-up form",
  type: "build",
  task: md(`Make this form **work**, using **one** state object called ~form~.

- Keep ~name~, ~email~ and ~subscribe~ (a boolean) in the object. Start with empty text, empty text, and ~false~.
- Each field should update only its own part of the object. Remember to **copy** with ~{ ...form, ... }~.
- The checkbox uses ~checked~ and ~e.target.checked~.
- The summary paragraph should read like **Sam (sam@example.com) - subscribed**, or **- not subscribed** when the box is unticked.

The inputs and the summary are already on the page. Connect them to state.`),
  files: {
    ...base,
    "App.jsx": `import { useState } from "react";

export default function App() {
  // Make one state object for the whole form here.

  return (
    <div className="app">
      <h1>Join the club</h1>
      <label>
        Name
        <input name="name" />
      </label>
      <label>
        Email
        <input name="email" />
      </label>
      <label>
        <input type="checkbox" name="subscribe" />
        Send me news
      </label>
      <p className="summary">Nothing typed yet</p>
    </div>
  );
}
`,
  },
  solution: {
    "App.jsx": `import { useState } from "react";

export default function App() {
  const [form, setForm] = useState({ name: "", email: "", subscribe: false });

  return (
    <div className="app">
      <h1>Join the club</h1>
      <label>
        Name
        <input
          name="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </label>
      <label>
        Email
        <input
          name="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </label>
      <label>
        <input
          type="checkbox"
          name="subscribe"
          checked={form.subscribe}
          onChange={(e) => setForm({ ...form, subscribe: e.target.checked })}
        />
        Send me news
      </label>
      <p className="summary">
        {form.name} ({form.email}) - {form.subscribe ? "subscribed" : "not subscribed"}
      </p>
    </div>
  );
}
`,
  },
  hints: [
    "Start with const [form, setForm] = useState({ name: \"\", email: \"\", subscribe: false });",
    "For each text input: value={form.name} and onChange={(e) => setForm({ ...form, name: e.target.value })}. The checkbox uses checked and e.target.checked.",
    'The summary: {form.name} ({form.email}) - {form.subscribe ? "subscribed" : "not subscribed"}',
  ],
  tests: [
    { name: "Typing a name and email shows them in the summary", code: 'await type(\'input[name="name"]\', "Sam"); await type(\'input[name="email"]\', "sam@example.com"); const t = text(".summary"); return t.includes("Sam") && t.includes("sam@example.com");' },
    { name: "Before ticking the box it says not subscribed", code: 'return text(".summary").includes("not subscribed");' },
    { name: "Ticking the box says subscribed", code: 'await click(\'input[type="checkbox"]\'); const t = text(".summary"); return $(\'input[type="checkbox"]\').checked === true && t.includes("subscribed") && !t.includes("not subscribed");' },
    { name: "Ticking the box did not erase the name or email", code: 'const t = text(".summary"); return t.includes("Sam") && t.includes("sam@example.com");' },
    { name: "The code uses useState", code: 'return files()["App.jsx"].includes("useState(");' },
  ],
};

const practiceFix = {
  kind: "practice",
  id: "m13-practice-tags",
  title: "Practice: fix the name tags",
  type: "fix",
  task: md(`This page should let you type a name, press **Add** (or Enter), and see it appear as a name tag in the list. It's broken in **two** ways.

1. You **can't type** in the box. Nothing appears.
2. Submitting the form would **reload the page**, because something is missing from the submit handler.

Find both clues and fix them.`),
  files: {
    ...base,
    "App.jsx": `import { useState } from "react";

export default function App() {
  const [name, setName] = useState("");
  const [tags, setTags] = useState([]);

  function handleSubmit(e) {
    setTags([...tags, name]);
    setName("");
  }

  return (
    <div className="app">
      <h1>Name tags</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Your name" value={name} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </div>
  );
}
`,
  },
  solution: {
    "App.jsx": `import { useState } from "react";

export default function App() {
  const [name, setName] = useState("");
  const [tags, setTags] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    setTags([...tags, name]);
    setName("");
  }

  return (
    <div className="app">
      <h1>Name tags</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </div>
  );
}
`,
  },
  hints: [
    "Bug 1: the input has a value, but nothing updates the state when you type. It needs an onChange.",
    "Bug 2: the handler must stop the browser's reload with a call on the event, e.",
    "Add onChange={(e) => setName(e.target.value)} to the input, and e.preventDefault(); as the first line of handleSubmit.",
  ],
  tests: [
    { name: "You can type in the box", code: 'await type("input", "Sam"); return $("input").value === "Sam";' },
    { name: "The submit handler stops the page from reloading", code: 'const ev = new Event("submit", { bubbles: true, cancelable: true }); $("form").dispatchEvent(ev); await wait(80); return ev.defaultPrevented === true;' },
    { name: "The name appears in the list and the box is cleared", code: 'return $$("li").length === 1 && text("li") === "Sam" && $("input").value === "";' },
  ],
};

const quiz = {
  kind: "quiz",
  id: "m13-quiz",
  title: "Quick check: forms and inputs",
  questions: [
    {
      q: "Spot the bug. Why can't the user type in this box?",
      code: 'const [name, setName] = useState("");\n\n<input value={name} />',
      options: [
        "value must be a number",
        "The box always shows name, and nothing ever changes it because there is no onChange",
        "useState can't hold text",
        "Inputs need a key",
      ],
      answer: 1,
      explain: "A controlled input shows exactly what is in state. Without an onChange that updates the state, the text never changes, so the box looks frozen.",
    },
    {
      q: "In an onChange handler, what is e.target.value?",
      code: "<input onChange={(e) => setName(e.target.value)} />",
      options: [
        "The id of the input",
        "The text currently inside the input box",
        "The previous state",
        "The name of the component",
      ],
      answer: 1,
      explain: "e is the event. e.target is the input that changed. And its value is the text inside it right now.",
    },
    {
      q: "Which prop does a checkbox use to know whether it is ticked?",
      options: ["value", "text", "checked", "selected"],
      answer: 2,
      explain: "Checkboxes use checked (true or false) and read e.target.checked in onChange. Text boxes and selects use value.",
    },
    {
      q: "Why do we call e.preventDefault() in a submit handler?",
      options: [
        "To clear the input box",
        "To stop the browser from reloading the page when the form is submitted",
        "To make the form submit faster",
        "To check that the input is not empty",
      ],
      answer: 1,
      explain: "By default, browsers reload the page on submit, which would throw away all of our state. preventDefault stops that, so React stays in charge.",
    },
    {
      q: "The form state is { name: \"Sam\", city: \"York\" }. What is it after this runs?",
      code: 'setForm({ ...form, city: "Leeds" });',
      options: [
        '{ city: "Leeds" }',
        '{ name: "Sam", city: "York" }',
        '{ name: "Sam", city: "Leeds" }',
        "An error",
      ],
      answer: 2,
      explain: "Spread copies every field (name and city), then city: Leeds replaces the old city. The name is kept.",
    },
    {
      q: "Which line correctly adds the typed text to a list in state?",
      options: [
        "items.push(text)",
        "setItems(items.push(text))",
        "setItems([...items, text])",
        "items = [...items, text]",
      ],
      answer: 2,
      explain: "We make a new array with spread and give it to setItems. Push changes the old array in place, and assigning to items bypasses React completely.",
    },
  ],
};

export default {
  id: "m13",
  title: "Forms and inputs",
  summary: "Build controlled inputs, handle many fields with one object, and submit forms that add to a list, with friendly checks.",
  lessons: [lessonControlled, practiceFill, lessonMulti, practiceBuild, lessonSubmit, practiceFix, quiz],
};
