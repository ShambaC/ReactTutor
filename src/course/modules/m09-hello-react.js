// Module 9: first React lessons (see docs/AUTHORING.md).
// Note: the validator compiles every step, so syntax errors (two sibling elements, unclosed tags) are shown
// inside comments and read aloud, while mistakes that still compile (class, lowercase tags, style strings) are typed live.
const indexHtml = `<!doctype html>
<html>
  <head>
    <title>My React app</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="index.js"></script>
  </body>
</html>
`;

const indexJs = 'import { createRoot } from "react-dom/client";\nimport App from "./App.jsx";\n\ncreateRoot(document.getElementById("root")).render(<App />);\n';
const indexJsCss = 'import { createRoot } from "react-dom/client";\nimport App from "./App.jsx";\nimport "./styles.css";\n\ncreateRoot(document.getElementById("root")).render(<App />);\n';

// ---- scrim A: first component ----
const idx1 = 'import { createRoot } from "react-dom/client";\nimport App from "./App.jsx";\n';
const appA1 = 'export default function App() {\n  return <h1>Hello, React!</h1>;\n}\n';
const appA2 = 'export default function App() {\n  return <h1>Hello, I am Sam!</h1>;\n}\n';
const greetingFile = "export default function Greeting() {\n  return <p>Nice to meet you!</p>;\n}\n";
const appA3 = 'import Greeting from "./Greeting.jsx";\n\nexport default function App() {\n  return (\n    <div>\n      <h1>Hello, I am Sam!</h1>\n      <Greeting />\n      <Greeting />\n      <Greeting />\n    </div>\n  );\n}\n';
const appA4 = appA3.replace("      <Greeting />\n      <Greeting />\n", "      <Greeting />\n      <greeting />\n");
const appA5 = appA3.replace("      <Greeting />\n    </div>", "      <Greeting />\n      <Footer />\n    </div>") + "\nfunction Footer() {\n  return <footer>Made with React</footer>;\n}\n";

// ---- scrim B: JSX rules ----
const b1 = 'export default function App() {\n  return <h1>JSX rules</h1>;\n}\n';
const b2 = 'export default function App() {\n  // Not allowed: two elements side by side.\n  // return <h1>JSX rules</h1><p>One parent only.</p>;\n  return <h1>JSX rules</h1>;\n}\n';
const b3 = 'export default function App() {\n  return (\n    <div>\n      <h1>JSX rules</h1>\n      <p>Rule one: one parent element.</p>\n    </div>\n  );\n}\n';
const b4 = 'export default function App() {\n  return (\n    <>\n      <h1>JSX rules</h1>\n      <p>Rule one: one parent element.</p>\n    </>\n  );\n}\n';
const b5 = b4.replace("    </>", '      <input placeholder="Type here" />\n    </>');
const b6 = b5.replace("    </>", '      <p class="note">Rule three: class becomes className.</p>\n    </>');
const b7 = b6.replace('class="note"', 'className="note"');
const b8 = b7.replace('      <input placeholder="Type here" />\n', '      <label htmlFor="nickname">Nickname</label>\n      <input id="nickname" placeholder="Type here" />\n');
const b9 = b8.replace("    </>", '      <p style="color: teal">Rule five: style takes an object.</p>\n    </>');
const b10 = b9.replace('style="color: teal"', 'style={{ color: "teal", fontSize: "24px" }}');
const b11 = b10.replace("    </>", '      <button style={{ backgroundColor: "tomato" }}>Click me</button>\n    </>');

// ---- scrim C: curly braces ----
const cStatic = 'export default function App() {\n  return (\n    <div>\n      <h1>Pet card</h1>\n      <p>Name: Biscuit</p>\n      <p>Age: 3</p>\n    </div>\n  );\n}\n';
const c1 = 'export default function App() {\n  const petName = "Biscuit";\n\n  return (\n    <div>\n      <h1>Pet card</h1>\n      <p>Name: {petName}</p>\n      <p>Age: 3</p>\n    </div>\n  );\n}\n';
const c2 = 'export default function App() {\n  const petName = "Biscuit";\n  const age = 3;\n\n  return (\n    <div>\n      <h1>Pet card</h1>\n      <p>Name: {petName}</p>\n      <p>Age: {age}</p>\n      <p>Next year: {age + 1}</p>\n    </div>\n  );\n}\n';
const c3 = 'export default function App() {\n  const pet = { name: "Biscuit", age: 3 };\n\n  return (\n    <div>\n      <h1>Pet card</h1>\n      <p>Name: {pet.name}</p>\n      <p>Age: {pet.age}</p>\n      <p>Next year: {pet.age + 1}</p>\n    </div>\n  );\n}\n';
const c4 = 'export default function App() {\n  const pet = { name: "Biscuit", age: 3 };\n\n  return (\n    <div>\n      <h1 title={pet.name}>Pet card</h1>\n      <p>Name: {pet.name}</p>\n      <p>Shouting: {pet.name.toUpperCase()}</p>\n      <p>Age: {pet.age}</p>\n      <p>Next year: {pet.age + 1}</p>\n    </div>\n  );\n}\n';
const c5 = c4.replace('age: 3 }', 'age: 3, food: "fish" }').replace("    </div>", "      <p>Favourite food: {pet.food}</p>\n    </div>");
const css1 = ".card {\n  max-width: 260px;\n  padding: 16px;\n  border: 2px solid teal;\n  border-radius: 12px;\n  font-family: sans-serif;\n}\n";
const c6 = c5.replace("    <div>", '    <div className="card">');
const css2 = css1 + "\n.highlight {\n  color: tomato;\n  font-weight: bold;\n}\n";
const c7 = c6.replace("<p>Name: {pet.name}</p>", '<p className="highlight">Name: {pet.name}</p>');

export default {
  id: "m09",
  title: "Hello, React",
  summary: "Meet React: a tool that builds the page from your data. Set up the standard project, write your first components, and learn the rules of JSX.",
  lessons: [
    {
      kind: "scrim",
      id: "m09-first-component",
      title: "Your first React component",
      notes: `## What is React?

React is a JavaScript tool for building pages out of **components**: small, reusable bricks, like LEGO. You describe what each brick looks like, and React keeps the page up to date from your data.

## The standard project

\`\`\`
index.html   <div id="root"></div> and a script tag for index.js
index.js     connects React to that div
App.jsx      your first component
\`\`\`

\`\`\`js
// index.js
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(<App />);
\`\`\`

\`createRoot(...)\` says "React, take charge of this div." \`.render(<App />)\` says "draw the App component inside it."

## A component is a function that returns JSX

\`\`\`jsx
export default function App() {
  return <h1>Hello, React!</h1>;
}
\`\`\`

**JSX** looks like HTML but lives inside JavaScript. Files that contain JSX end in \`.jsx\`.

## Rules to remember

- A component's name **starts with a capital letter**: \`Greeting\`, not \`greeting\`. Lowercase names are treated as plain HTML tags, and nothing shows up.
- Use a component like a tag: \`<Greeting />\`. Use it as often as you like.
- Wrap everything in one outer element for now (we'll learn why in the next lesson).`,
      files: { "index.html": indexHtml, "index.js": "", "App.jsx": "" },
      steps: [
        { say: "Welcome to React! React is a tool for building web pages out of bricks, a bit like LEGO. Each brick is a piece of the page, like a button or a card, and you snap them together to make a whole app." },
        { say: "Here's the big idea. Instead of finding things on the page and changing them by hand, like we did last module, we describe what the page should look like for our data. And React keeps it up to date." },
        {
          say: "Every React project starts the same way. In index dot H T M L, there's an empty div with the id root. That's the spot where React will build our page. And a script tag loads index dot J S.",
          open: "index.html",
          highlight: '<div id="root"></div>',
        },
        {
          say: "Now our first brick, called a component. It's a plain function in a file called App dot J S X. It returns what should appear on the page. For now, a heading. That odd H T M L looking part is called J S X.",
          files: { "App.jsx": appA1 },
          open: "App.jsx",
          highlight: "return <h1>Hello, React!</h1>;",
        },
        {
          say: "Next, we connect React to the page. In index dot J S, we import create root from React, and we import our App component. Remember, App is a default export, so no curly braces.",
          files: { "index.js": idx1 },
          open: "index.js",
          highlight: 'import App from "./App.jsx";',
        },
        {
          say: "Last line. Create root, with the root div, dot render, and our App used like an H T M L tag. Look at the preview! Our heading appears.",
          files: { "index.js": indexJs },
          highlight: 'createRoot(document.getElementById("root")).render(<App />);',
        },
        {
          say: "Let's read that line. Get element by id finds the root div. Create root says: React, you're in charge of this div. And render says: draw App in there. You'll write this file once, and then almost never touch it.",
          highlight: ".render(<App />)",
        },
        {
          say: "Your turn! Change the heading so it greets you. Edit the text between the h1 tags in App dot J S X, and press Run.",
          open: "App.jsx",
          challenge: {
            task: `**Challenge:** in \`App.jsx\`, change the text inside the \`<h1>\` so it greets you by name, for example:

\`\`\`jsx
return <h1>Hello, I am Sam!</h1>;
\`\`\`

Keep the \`<h1>\` and \`</h1>\` tags around your words. Press **Run** and look at the preview.`,
            hints: [
              "Only change the words between the two h1 tags.",
              "Keep the return, the h1 tags and the semicolon.",
              "return <h1>Hello, I am Sam!</h1>; Use your own name.",
            ],
            tests: [
              { name: "The page shows a heading", code: 'return !!$("h1");' },
              { name: "The heading has your own words", code: 'return text("h1").length > 0 && text("h1") !== "Hello, React!";' },
            ],
          },
        },
        {
          say: "Here's mine. Same component, new words. The preview updated as soon as I changed the text. Yours can say anything.",
          files: { "App.jsx": appA2 },
          highlight: "Hello, I am Sam!",
        },
        {
          say: "The real power of components is reuse. Let's make a second one, in its own file: Greeting dot J S X. It returns a paragraph. And it's a default export, just like App.",
          files: { "Greeting.jsx": greetingFile },
          open: "Greeting.jsx",
          highlight: "export default function Greeting() {",
        },
        {
          say: "Now App imports Greeting and uses it like a tag, three times. Three greetings, but we wrote the brick only once. I wrapped everything in one div. We'll see why in the next lesson.",
          files: { "App.jsx": appA3 },
          open: "App.jsx",
          highlight: "<Greeting />",
        },
        {
          say: "Now a deliberate mistake. I'll write the middle one with a small g. Look: only two greetings appear, and the console has a warning about the tag greeting.",
          files: { "App.jsx": appA4 },
          highlight: "<greeting />",
        },
        {
          say: "Here's the clue. React treats lowercase tags as plain H T M L, like div or p. It has never heard of an H T M L tag called greeting. So component names must start with a capital letter. I'll fix it.",
          files: { "App.jsx": appA3 },
          highlight: "<Greeting />",
        },
        {
          say: "Your turn again! Make a second component, this time inside App dot J S X, below App. Call it Footer.",
          challenge: {
            task: `**Challenge:** add a new component called \`Footer\` in the same file, below \`App\`:

\`\`\`jsx
function Footer() {
  return <footer>Made with React</footer>;
}
\`\`\`

Then use it inside the \`<div>\` in \`App\`, after the greetings, by writing \`<Footer />\`. Remember the capital F!`,
            hints: [
              "A component is a function that returns JSX. Write it below the App function.",
              "It doesn't need export, because it's only used inside this file.",
              "Inside App's div, add the line <Footer /> after the last Greeting.",
            ],
            tests: [
              { name: "There is a footer on the page", code: 'return !!$("footer");' },
              { name: "The footer has some text", code: 'return text("footer").length > 0;' },
              { name: "Footer is its own component", code: 'return /function\\s+Footer/.test(files()["App.jsx"]) && /<Footer\\s*\\/>/.test(files()["App.jsx"]);' },
            ],
          },
        },
        {
          say: "Here's how I did it. A function called Footer, and a Footer tag in the div. Notice we didn't need to export or import it, because it lives in the same file.",
          files: { "App.jsx": appA5 },
          highlight: "<Footer />",
        },
        { say: "You've built your first React app! A project has an H T M L file, an index file that connects React, and components. Components are functions that return J S X, with names that start with a capital letter. Next, the rules of J S X." },
      ],
    },
    {
      kind: "practice",
      id: "m09-practice-wiring",
      title: "Practice: connect React to the page",
      type: "fill",
      task: `The \`App\` component already exists. Fill in the blanks (\`___\`) in \`index.js\` to connect it to the page:

- import \`createRoot\` from \`"react-dom/client"\`
- import \`App\` from the file \`App.jsx\`
- find the element with the id \`root\`, and render \`<App />\` into it`,
      files: {
        "index.html": indexHtml,
        "index.js": 'import { ___ } from "react-dom/client";\nimport App from "./___.jsx";\n\n___(document.getElementById("___")).render(<App />);\n',
        "App.jsx": "export default function App() {\n  return <h1>Hello from App</h1>;\n}\n",
      },
      solution: {
        "index.js": indexJs,
      },
      hints: [
        "The function that React gives us to take charge of a div is called createRoot. It's used twice.",
        "The component is in App.jsx, so the import path is ./App.jsx. The div in index.html has the id root.",
        "The answers in order are: createRoot, App, createRoot, root.",
      ],
      tests: [
        { name: "The page shows the App heading", code: 'return text("h1") === "Hello from App";' },
        { name: "It is rendered inside the root div", code: 'return !!$("#root h1");' },
      ],
    },
    {
      kind: "scrim",
      id: "m09-jsx-rules",
      title: "The rules of JSX",
      notes: `## JSX looks like HTML, but it is JavaScript

It has a few rules. Break one and you'll get an error. That's a clue, not a failure!

1. **One parent.** A component can return only **one** outer element. Wrap siblings in a \`<div>\`, or in a **fragment**, empty angle brackets that add nothing to the page:

\`\`\`jsx
return (
  <>
    <h1>Title</h1>
    <p>Text</p>
  </>
);
\`\`\`

   The error you'd see is: *Adjacent JSX elements must be wrapped in an enclosing tag*.

2. **Close every tag.** \`<input />\` and \`<br />\`, with the slash.
3. **\`className\`, not \`class\`.** \`class\` is a reserved word in JavaScript.
4. **camelCase attributes.** \`for\` becomes \`htmlFor\`, \`onclick\` becomes \`onClick\`, \`tabindex\` becomes \`tabIndex\`.
5. **\`style\` takes an object**, not text, so you write two sets of curly braces:

\`\`\`jsx
<p style={{ color: "teal", fontSize: "24px" }}>Hi</p>
\`\`\`

   Outer braces: "JavaScript is coming." Inner braces: the object. Property names are camelCase too.

Use parentheses after \`return\` when the JSX covers several lines.`,
      files: { "index.html": indexHtml, "index.js": indexJs, "App.jsx": b1 },
      steps: [
        { say: "J S X looks a lot like H T M L, but it's really JavaScript wearing a costume. It has a handful of rules. We'll meet them one at a time, and break some on purpose, because error messages are clues, not failures." },
        {
          say: "Rule one: a component returns only one outer element. If I tried to return a heading and a paragraph side by side, like in this comment, React would complain: adjacent J S X elements must be wrapped in an enclosing tag. I've kept it in a comment.",
          files: { "App.jsx": b2 },
          open: "App.jsx",
          highlight: "// return <h1>JSX rules</h1><p>One parent only.</p>;",
        },
        {
          say: "The fix: wrap them in one parent, like a div. We also add round brackets after return, so the J S X can span several lines. Both elements now sit safely inside one div.",
          files: { "App.jsx": b3 },
          highlight: "<div>",
        },
        {
          say: "A div adds an extra box to the page. If you don't want one, use a fragment: empty angle brackets, with nothing between the angle brackets. Same rule, no extra element.",
          files: { "App.jsx": b4 },
          highlight: "<>",
        },
        {
          say: "Rule two: close every tag. In H T M L, an input doesn't need closing. In J S X it does, so we write a slash before the last angle bracket. Without it, you'd see an error about an unterminated tag.",
          files: { "App.jsx": b5 },
          highlight: '<input placeholder="Type here" />',
        },
        {
          say: "Rule three. In H T M L, we style with the class attribute. But look: I'll type class, and the preview works, but the console warns: invalid D O M property class, did you mean class name?",
          files: { "App.jsx": b6 },
          highlight: '<p class="note">',
        },
        {
          say: "Class is a special word in JavaScript, so J S X uses class name, with a capital N. It's the first example of rule four: attributes are written in camel case.",
          files: { "App.jsx": b7 },
          highlight: 'className="note"',
        },
        {
          say: "More camel case. The H T M L attribute for becomes html for. Label, html for nickname, points at the input with the id nickname. And on click becomes on click with capital letters, which you'll use soon.",
          files: { "App.jsx": b8 },
          highlight: 'htmlFor="nickname"',
        },
        {
          say: "Rule five: style. I'll write it the H T M L way, as text, and the page breaks. The error says the style prop expects an object, not a string.",
          files: { "App.jsx": b9 },
          highlight: 'style="color: teal"',
        },
        {
          say: "Here's the fix: double curly braces. The outer pair says: J S code is coming. The inner pair is a normal JavaScript object with keys and values. And keys are camel case: font size, not font dash size.",
          files: { "App.jsx": b10 },
          highlight: 'style={{ color: "teal", fontSize: "24px" }}',
        },
        {
          say: "Your turn! Add a button, and give it a tomato colored background using a style object.",
          challenge: {
            task: `**Challenge:** add a \`<button>\` to the page (before the closing \`</>\`). Give it:

- any text you like
- a \`style\` object that sets \`backgroundColor\` to \`"tomato"\`

Remember the **double curly braces** and the **camelCase** property name.`,
            hints: [
              "Start with <button>Click me</button> inside the fragment.",
              "Add a style attribute to the button. It takes curly braces, with an object inside.",
              'style={{ backgroundColor: "tomato" }}',
            ],
            tests: [
              { name: "There is a button on the page", code: 'return !!$("button");' },
              { name: "The button background is tomato", code: 'return $("button").style.backgroundColor === "tomato";' },
            ],
          },
        },
        {
          say: "Here's how I did it. A button, and a style object with two sets of curly braces. Notice backgroundColor in camel case, and a text value in quotes.",
          files: { "App.jsx": b11 },
          highlight: '<button style={{ backgroundColor: "tomato" }}>Click me</button>',
        },
        { say: "Let's recap the rules. One parent element, or a fragment. Close every tag. Class name, not class. Camel case attributes. And style takes an object. If J S X ever gives you an error, one of these rules is the first thing to check." },
      ],
    },
    {
      kind: "practice",
      id: "m09-practice-jsx",
      title: "Practice: fix the JSX",
      type: "fix",
      task: `This component has two small bugs. Run it and look at the page and the console, then fix it so that:

- the **New!** badge appears on the page (it comes from the \`Badge\` component)
- the paragraph uses the right attribute for its CSS class (\`note\`)`,
      files: {
        "index.html": indexHtml,
        "index.js": indexJs,
        "Badge.jsx": "export default function Badge() {\n  return <span>New!</span>;\n}\n",
        "App.jsx": 'import Badge from "./Badge.jsx";\n\nexport default function App() {\n  return (\n    <div>\n      <h1>Rules check</h1>\n      <p class="note">Two small bugs hide in this file.</p>\n      <badge />\n    </div>\n  );\n}\n',
      },
      solution: {
        "App.jsx": 'import Badge from "./Badge.jsx";\n\nexport default function App() {\n  return (\n    <div>\n      <h1>Rules check</h1>\n      <p className="note">Two small bugs hide in this file.</p>\n      <Badge />\n    </div>\n  );\n}\n',
      },
      hints: [
        "One bug is a tag that React treats as plain HTML, so nothing appears. The console warning names the tag.",
        "Component names start with a capital letter. The other bug is the word class, which has a special JSX spelling.",
        '<Badge /> and className="note"',
      ],
      tests: [
        { name: "The New! badge appears", code: 'return text().includes("New!");' },
        { name: "The paragraph uses className", code: 'return /className\\s*=\\s*"note"/.test(files()["App.jsx"]) && !/\\bclass\\s*=/.test(files()["App.jsx"]);' },
        { name: "The page still shows the heading", code: 'return text("h1") === "Rules check";' },
      ],
    },
    {
      kind: "scrim",
      id: "m09-curly-braces",
      title: "Curly braces: JavaScript inside JSX",
      notes: `## Putting values into JSX

Curly braces in JSX mean: **"JavaScript goes here."**

\`\`\`jsx
export default function App() {
  const pet = { name: "Biscuit", age: 3 };

  return (
    <div>
      <h1 title={pet.name}>Pet card</h1>
      <p>Name: {pet.name}</p>
      <p>Next year: {pet.age + 1}</p>
    </div>
  );
}
\`\`\`

- Declare variables **above** the \`return\`.
- Inside \`{ }\` you can put anything that produces a **value**: a variable, \`pet.name\`, \`age + 1\`, \`name.toUpperCase()\`.
- In **attributes**, use curly braces instead of quotes: \`title={pet.name}\`.
- Quotes mean "this exact text". Curly braces mean "work this out".

## Adding CSS

Create \`styles.css\`, then import it once in \`index.js\`:

\`\`\`js
import "./styles.css";
\`\`\`

Use the classes with \`className\`:

\`\`\`jsx
<div className="card">
\`\`\`

**Common mistake:** writing \`"{pet.name}"\` in quotes shows the braces as text. Write \`{pet.name}\` without quotes in attributes.`,
      files: { "index.html": indexHtml, "index.js": indexJs, "App.jsx": cStatic },
      steps: [
        { say: "Our component works, but everything is written out as fixed text. Real apps show data that changes. In J S X, we use curly braces to bring JavaScript into the page." },
        {
          say: "First, a variable. We declare it above the return, inside the function. Then in the paragraph, curly braces mean: here comes JavaScript, work it out. The page now shows the value of pet name.",
          files: { "App.jsx": c1 },
          open: "App.jsx",
          highlight: "{petName}",
        },
        {
          say: "Anything that produces a value works inside the curly braces. Here's an age, and age plus one. The braces do the maths for us.",
          files: { "App.jsx": c2 },
          highlight: "{age + 1}",
        },
        {
          say: "Remember objects from earlier? One pet object holds all the details, and we reach into it with dots. This is how React components usually receive their data.",
          files: { "App.jsx": c3 },
          highlight: "const pet = { name: \"Biscuit\", age: 3 };",
        },
        {
          say: "Curly braces work in attributes too. Title is the text that appears when you hover. We write curly braces instead of quotes. You can also call functions, like to upper case, inside the braces.",
          files: { "App.jsx": c4 },
          highlight: "title={pet.name}",
        },
        {
          say: "Your turn! Give the pet a favourite food, and show it on the card.",
          challenge: {
            task: `**Challenge:** add a new drawer to the \`pet\` object: \`food: "fish"\`. Then add a new paragraph to the card that shows it, like:

\`\`\`jsx
<p>Favourite food: {pet.food}</p>
\`\`\`

Don't type "fish" into the paragraph. Let the curly braces fetch it from the object!`,
            hints: [
              "Add a comma after age: 3, then write food: \"fish\" before the closing curly brace of the object.",
              "Add a new p line inside the div, after the other paragraphs.",
              "Inside the p: Favourite food: {pet.food}",
            ],
            tests: [
              { name: "The page shows the favourite food, fish", code: 'return text().includes("fish");' },
              { name: "The food comes from the pet object", code: 'return /\\{\\s*pet\\.food\\s*\\}/.test(files()["App.jsx"]);' },
            ],
          },
        },
        {
          say: "Here's mine. A new key and value in the object, and one paragraph that reads it with curly braces. If we change the food in the object, the page changes too.",
          files: { "App.jsx": c5 },
          highlight: "Favourite food: {pet.food}",
        },
        {
          say: "Now let's make it pretty. We create a file called styles dot C S S, with a card class. It's ordinary C S S, nothing new.",
          files: { "styles.css": css1 },
          open: "styles.css",
          highlight: ".card {",
        },
        {
          say: "To use it, we import the C S S file in index dot J S. There are no names or curly braces here. We just write import, and the path. That loads the styles for the whole app.",
          files: { "index.js": indexJsCss },
          open: "index.js",
          highlight: 'import "./styles.css";',
        },
        {
          say: "Last step: use the class. And remember, in J S X it's class name, not class. Look at the preview. Our card has a border.",
          files: { "App.jsx": c6 },
          open: "App.jsx",
          highlight: '<div className="card">',
        },
        {
          say: "One more challenge. Add a new class called highlight to the C S S file. Then give it to the name paragraph.",
          challenge: {
            task: `**Challenge:** add some style and use it.

1. In \`styles.css\`, add a \`.highlight\` rule, for example with \`color: tomato;\`.
2. In \`App.jsx\`, give the **Name** paragraph \`className="highlight"\`.`,
            hints: [
              "In styles.css, write .highlight { color: tomato; } on new lines at the bottom.",
              'In App.jsx, change <p>Name: {pet.name}</p> so it has className="highlight" inside the opening tag.',
              '<p className="highlight">Name: {pet.name}</p>',
            ],
            tests: [
              { name: "styles.css has a .highlight rule", code: 'return /\\.highlight\\s*\\{/.test(files()["styles.css"]);' },
              { name: "An element on the page uses the highlight class", code: 'return !!$(".highlight");' },
            ],
          },
        },
        {
          say: "Here's how I did it. A highlight rule in the C S S, and the class name attribute on the paragraph. The class is just text, so quotes are right here.",
          files: { "styles.css": css2, "App.jsx": c7 },
          open: "App.jsx",
          highlight: '<p className="highlight">',
        },
        { say: "Great work! Curly braces bring JavaScript into J S X, and an import brings in your styles. You can now build a page from an object. In the next module, we'll feed components their data from outside, using props." },
      ],
    },
    {
      kind: "practice",
      id: "m09-practice-card",
      title: "Practice: build a profile card",
      type: "build",
      task: `Build a profile card for the \`person\` object in \`App.jsx\`. The \`styles.css\` file is already imported. Your component should return:

- a \`<div>\` with the class \`card\`
- an \`<h1>\` that shows the person's name
- a \`<p>\` with the class \`job\` that shows their job
- a \`<p>\` that says \`Lives in\` followed by their city

Take every value from \`person\` using curly braces. Don't type the values by hand.`,
      files: {
        "index.html": indexHtml,
        "index.js": indexJsCss,
        "styles.css": ".card {\n  max-width: 260px;\n  padding: 16px;\n  border: 2px solid teal;\n  border-radius: 12px;\n  font-family: sans-serif;\n}\n\n.job {\n  color: teal;\n}\n",
        "App.jsx": 'export default function App() {\n  const person = { name: "Ada Lovelace", job: "Mathematician", city: "London" };\n\n  return <div></div>;\n}\n',
      },
      solution: {
        "App.jsx": 'export default function App() {\n  const person = { name: "Ada Lovelace", job: "Mathematician", city: "London" };\n\n  return (\n    <div className="card">\n      <h1>{person.name}</h1>\n      <p className="job">{person.job}</p>\n      <p>Lives in {person.city}</p>\n    </div>\n  );\n}\n',
      },
      hints: [
        "Put the div, h1 and two p tags inside the return. Use round brackets so the JSX can span several lines.",
        'The div needs className="card", and the job paragraph needs className="job".',
        "For the values use {person.name}, {person.job} and {person.city}.",
      ],
      tests: [
        { name: "There is a card", code: 'return !!$(".card");' },
        { name: "The heading shows the name", code: 'return text("h1") === "Ada Lovelace";' },
        { name: "The job paragraph shows the job", code: 'return text(".job") === "Mathematician";' },
        { name: "The page says where they live", code: 'return text().includes("Lives in London");' },
        { name: "The values come from person", code: 'return /\\{\\s*person\\.name\\s*\\}/.test(files()["App.jsx"]) && /\\{\\s*person\\.city\\s*\\}/.test(files()["App.jsx"]);' },
      ],
    },
    {
      kind: "quiz",
      id: "m09-quiz",
      title: "Quick check: Hello, React",
      questions: [
        {
          q: "What does this line do?",
          code: 'createRoot(document.getElementById("root")).render(<App />);',
          options: ["Deletes the root div", "Tells React to take charge of the root div and draw the App component in it", "Prints App in the console", "Imports App from a file"],
          answer: 1,
          explain: "`createRoot` hands the div to React, and `render` tells React which component to draw inside it.",
        },
        {
          q: "What appears on the page?",
          code: "export default function App() {\n  return <h1>{2 + 3}</h1>;\n}",
          options: ["{2 + 3}", "2 + 3", "5", "An error"],
          answer: 2,
          explain: "Curly braces mean JavaScript goes here. React works out 2 + 3 and shows the answer, 5.",
        },
        {
          q: "Spot the bug. Nothing shows up for the profile card, and the console complains about the tag. Why?",
          code: 'import ProfileCard from "./ProfileCard.jsx";\n\nexport default function App() {\n  return <profileCard />;\n}',
          options: ["ProfileCard needs curly braces in the import", "A component's tag must start with a capital letter", "You can't use a component inside App", "return needs round brackets"],
          answer: 1,
          explain: "Lowercase tags are treated as plain HTML elements. Write `<ProfileCard />` with a capital P so React knows it's a component.",
        },
        {
          q: "Which component is valid JSX?",
          options: [
            "return <h1>One</h1><p>Two</p>;",
            "return (<><h1>One</h1><p>Two</p></>);",
            "return <h1>One</h1>, <p>Two</p>;",
            "return h1(One) p(Two);",
          ],
          answer: 1,
          explain: "A component returns one outer element. A fragment, written as empty angle brackets, groups siblings without adding an extra element to the page.",
        },
        {
          q: "Which line sets a red background correctly?",
          options: [
            '<p style="background-color: red">Hi</p>',
            '<p style={{ backgroundColor: "red" }}>Hi</p>',
            '<p style={background-color: red}>Hi</p>',
            '<p class="red">Hi</p>',
          ],
          answer: 1,
          explain: "style takes a JavaScript object, so it needs double curly braces and a camelCase property name. Option 4 would need className, not class, and a CSS rule.",
        },
        {
          q: "How do you load a file called styles.css for your whole app?",
          options: ['<link> inside App.jsx', 'import "./styles.css"; in index.js', 'import styles from "styles";', 'You can\'t. CSS must go in index.html'],
          answer: 1,
          explain: "An import with no names loads the file. Putting it in index.js applies the styles to the whole app. Then use the classes with `className`.",
        },
      ],
    },
  ],
};
