// Module 8: splitting code into files with export and import (see docs/AUTHORING.md).
const html = `<!doctype html>
<html>
  <head>
    <title>Playground</title>
  </head>
  <body>
    <script type="module" src="index.js"></script>
  </body>
</html>
`;

// ---- scrim 1: named exports ----
const greetFn = "function greet(name) {\n  return `Hello, ${name}!`;\n}\n";
const n1 = greetFn + '\nconsole.log(greet("Sam"));\n';
const greetFile1 = "export function greet(name) {\n  return `Hello, ${name}!`;\n}\n";
const n2 = 'import { greet } from "./greet.js";\n\nconsole.log(greet("Sam"));\n';
const greetFile2 = greetFile1 + '\nexport function shout(name) {\n  return name.toUpperCase() + "!";\n}\n\nexport const appName = "Hello Lab";\n';
const n3 = 'import { greet, shout, appName } from "./greet.js";\n\nconsole.log(appName);\nconsole.log(greet("Sam"));\nconsole.log(shout("Sam"));\n';
const n4 = 'import { greet, shout, appName, whisper } from "./greet.js";\n\nconsole.log(appName);\nconsole.log(greet("Sam"));\nconsole.log(shout("Sam"));\nconsole.log(whisper("Sam"));\n';
const greetFile3 = greetFile2 + '\nexport function whisper(name) {\n  return name.toLowerCase() + "...";\n}\n';
const n5 = n4 + '\n// Import add from "./math.js" and print add(2, 3).\n';
const n6 = 'import { greet, shout, appName, whisper } from "./greet.js";\nimport { add } from "./math.js";\n\nconsole.log(appName);\nconsole.log(greet("Sam"));\nconsole.log(shout("Sam"));\nconsole.log(whisper("Sam"));\nconsole.log(add(2, 3));\n';

// ---- scrim 2: default exports ----
const petsFile1 = 'const pets = ["Biscuit", "Mochi", "Pixel"];\n\nexport default pets;\n';
const d1 = 'import pets from "./pets.js";\n\nconsole.log(pets);\n';
const d2 = 'import myAnimals from "./pets.js";\n\nconsole.log(myAnimals);\n';
const d3 = 'import { pets } from "./pets.js";\n\nconsole.log(pets);\n';
const formatFile = 'export function shout(text) {\n  return text.toUpperCase() + "!";\n}\n';
const d4 = 'import pets from "./pets.js";\nimport shout from "./format.js";\n\nconsole.log(pets);\nconsole.log(shout("hi"));\n';
const d5 = 'import pets from "./pets.js";\nimport { shout } from "./format.js";\n\nconsole.log(pets);\nconsole.log(shout("hi"));\n';
const petsFile2 = 'const pets = ["Biscuit", "Mochi", "Pixel"];\n\nexport const total = pets.length;\n\nexport default pets;\n';
const d6 = 'import pets, { total } from "./pets.js";\nimport { shout } from "./format.js";\n\nconsole.log(pets);\nconsole.log(total);\nconsole.log(shout("hi"));\n';
const d7 = d6 + '\n// Import animal from "./animal.js" and print its sound.\n';
const animalFile1 = 'const animal = { name: "Mochi", sound: "meow" };\n';
const animalFile2 = animalFile1 + "\nexport default animal;\n";
const d8 = 'import pets, { total } from "./pets.js";\nimport { shout } from "./format.js";\nimport animal from "./animal.js";\n\nconsole.log(pets);\nconsole.log(total);\nconsole.log(shout("hi"));\nconsole.log(animal.sound);\n';

// ---- scrim 3: folders ----
const p1 = 'const pets = [\n  { name: "Biscuit", species: "dog" },\n  { name: "Mochi", species: "cat" },\n];\n\nfunction describe(pet) {\n  return `${pet.name} the ${pet.species}`;\n}\n\nfor (const pet of pets) {\n  console.log(describe(pet));\n}\n';
const dataFile1 = 'const pets = [\n  { name: "Biscuit", species: "dog" },\n  { name: "Mochi", species: "cat" },\n];\n\nexport default pets;\n';
const dataFile2 = 'const pets = [\n  { name: "Biscuit", species: "dog" },\n  { name: "Mochi", species: "cat" },\n  { name: "Pixel", species: "parrot" },\n];\n\nexport default pets;\n';
const describeFile = "export function describe(pet) {\n  return `${pet.name} the ${pet.species}`;\n}\n";
const p2 = 'import pets from "./data/pets.js";\nimport { describe } from "./utils/format.js";\n\nfor (const pet of pets) {\n  console.log(describe(pet));\n}\n';
const summaryFile = 'import pets from "../data/pets.js";\nimport { describe } from "./format.js";\n\nexport default function summary() {\n  return pets.map((pet) => describe(pet)).join(", ");\n}\n';
const p3 = 'import pets from "./data/pets.js";\nimport { describe } from "./utils/format.js";\nimport summary from "./utils/summary.js";\n\nfor (const pet of pets) {\n  console.log(describe(pet));\n}\n\nconsole.log(summary());\n';

export default {
  id: "m08",
  title: "Splitting code into files",
  summary: "Learn to split a program into several files, share code with export and import, and avoid the classic default-versus-named mix-up.",
  lessons: [
    {
      kind: "scrim",
      id: "m08-export-import",
      title: "Sharing code: export and import",
      notes: `## Why split code into files?

One giant file gets hard to read and hard to change. Small files, each with one job, are easier to find, fix and reuse. React projects usually have one file per component.

## Sharing with export and import

In \`greet.js\`, **export** what other files may use:

\`\`\`js
export function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

In \`index.js\`, **import** it:

\`\`\`js
import { greet } from "./greet.js";
\`\`\`

- Curly braces hold the exact names you want. This is a **named export**.
- A file can have many named exports. Separate the names with commas.
- \`"./greet.js"\` is a **relative path**: \`./\` means "in this same folder".

## Errors are clues

If you import a name that was never exported, you'll get an error like *whisper is not a function*. Check the spelling, and check that the other file really says \`export\` before it.

You can create a new file with the file list in the editor. Every file that uses \`import\` or \`export\` is called a **module**.`,
      files: { "index.html": html, "index.js": "" },
      steps: [
        { say: "Welcome to a new topic. So far all our code has lived in one file. Real projects have dozens of files, each with one job. That way, code is easier to find, easier to fix, and easier to reuse." },
        {
          say: "Let's start with everything in one file: a greet function, and a line that uses it.",
          files: { "index.js": n1 },
          open: "index.js",
          highlight: "function greet(name) {",
        },
        {
          say: "Now let's move the function into its own file called greet dot J S. The only new thing is the word export at the start. Export means: other files are allowed to use this.",
          files: { "greet.js": greetFile1 },
          open: "greet.js",
          highlight: "export function greet(name) {",
        },
        {
          say: "Back in index dot J S, we remove the function and import it instead. Import, curly braces with the name inside, from, and the path to the file in quotes. The dot slash means: in this same folder.",
          files: { "index.js": n2 },
          open: "index.js",
          highlight: 'import { greet } from "./greet.js";',
        },
        {
          say: "Check the console. Hello, Sam! The code works exactly as before, but the function now lives in its own file. This kind of export is called a named export, because we use its name in the curly braces.",
        },
        {
          say: "A file can export as many things as it likes. Let's add another function, and a constant. Each one gets its own export word.",
          files: { "greet.js": greetFile2 },
          open: "greet.js",
          highlight: 'export const appName = "Hello Lab";',
        },
        {
          say: "To use several, list the names in the curly braces, separated by commas.",
          files: { "index.js": n3 },
          open: "index.js",
          highlight: 'import { greet, shout, appName } from "./greet.js";',
        },
        {
          say: "Now a deliberate mistake. I'll import a function called whisper, which greet dot J S doesn't have. Look at the console. An error says whisper is not a function.",
          files: { "index.js": n4 },
          highlight: "whisper",
        },
        {
          say: "Errors are clues, not failures. This one says: you asked for whisper, but there's no whisper to give. We fix it by writing the function in greet dot J S, with export in front.",
          files: { "greet.js": greetFile3 },
          open: "greet.js",
          highlight: "export function whisper(name) {",
        },
        {
          say: "Your turn! I've made an empty file called math dot J S. Write a function there and share it.",
          files: { "math.js": "// Write and export a function called add here.\n", "index.js": n5 },
          open: "math.js",
          challenge: {
            task: `**Challenge:** use \`math.js\` to share a function.

1. In \`math.js\`, write a function \`add(a, b)\` that **returns** \`a + b\`. Put \`export\` in front of it.
2. In \`index.js\`, **import** it with \`import { add } from "./math.js";\`
3. Print \`add(2, 3)\` with \`console.log\`. The console should show \`5\`.`,
            hints: [
              "In math.js: export function add(a, b) { ... } and use return inside.",
              'At the top of index.js: import { add } from "./math.js";',
              "At the bottom of index.js: console.log(add(2, 3));",
            ],
            tests: [
              { name: "math.js exports something", code: 'return /export/.test(files()["math.js"] || "");' },
              { name: "index.js imports add from math.js", code: 'return /import\\s*\\{[^}]*\\badd\\b[^}]*\\}\\s*from\\s*["\']\\.\\/math(\\.js)?["\']/.test(files()["index.js"]);' },
              { name: "The console shows 5", code: 'return logs.some((l) => l.trim() === "5");' },
            ],
          },
        },
        {
          say: "Here's how I did it. Export in front of the function in math dot J S, an import line at the top of index dot J S, and a log that uses it. Your version may look a little different, and that's fine!",
          files: { "math.js": "export function add(a, b) {\n  return a + b;\n}\n", "index.js": n6 },
          open: "math.js",
          highlight: "export function add(a, b) {",
        },
        { say: "So: export in the file that shares, import in the file that uses. Next time we'll meet the second kind of export, the default export, and the classic mix-up that trips up everyone at first." },
      ],
    },
    {
      kind: "practice",
      id: "m08-practice-named",
      title: "Practice: fill in the imports",
      type: "fill",
      task: `Two files share code with \`index.js\`. Fill in the blanks (\`___\`):

- In \`index.js\`, import the missing function from \`shapes.js\`, and fix the path of the second import.
- In \`greet.js\`, give the exported function its proper name.

The console should print \`16\`, \`8\`, \`cm\` and \`Hello, Sam!\`.`,
      files: {
        "index.html": html,
        "index.js": 'import { ___, double, unit } from "./shapes.js";\nimport { greet } from "./___.js";\n\nconsole.log(square(4));\nconsole.log(double(4));\nconsole.log(unit);\nconsole.log(greet("Sam"));\n',
        "shapes.js": "export function square(n) {\n  return n * n;\n}\n\nexport function double(n) {\n  return n * 2;\n}\n\nexport const unit = \"cm\";\n",
        "greet.js": "export function ___(name) {\n  return `Hello, ${name}!`;\n}\n",
      },
      solution: {
        "index.js": 'import { square, double, unit } from "./shapes.js";\nimport { greet } from "./greet.js";\n\nconsole.log(square(4));\nconsole.log(double(4));\nconsole.log(unit);\nconsole.log(greet("Sam"));\n',
        "greet.js": "export function greet(name) {\n  return `Hello, ${name}!`;\n}\n",
      },
      hints: [
        "Look at what index.js uses below the imports. Which function from shapes.js is missing from the curly braces?",
        "The second import points to the file that holds greet. The function in that file needs the name that index.js imports.",
        "The answers are: square, greet (for the path), and greet (for the function name).",
      ],
      tests: [
        { name: "square(4) prints 16", code: 'return logs.some((l) => l.trim() === "16");' },
        { name: "double(4) prints 8", code: 'return logs.some((l) => l.trim() === "8");' },
        { name: "The unit cm is printed", code: 'return logs.some((l) => l.trim() === "cm");' },
        { name: "greet prints Hello, Sam!", code: 'return logs.includes("Hello, Sam!");' },
      ],
    },
    {
      kind: "scrim",
      id: "m08-default-export",
      title: "Default exports and the classic mix-up",
      notes: `## Default exports

Besides named exports, a file can have **one** default export, its "headline" item.

\`\`\`js
// pets.js
const pets = ["Biscuit", "Mochi"];
export default pets;
\`\`\`

\`\`\`js
// index.js
import pets from "./pets.js";   // no curly braces; any name works
\`\`\`

## The rule

| Export | Import |
|---|---|
| \`export function shout\` (named) | \`import { shout } from ...\` with curly braces, name must match |
| \`export default pets\` | \`import pets from ...\` no curly braces, you choose the name |

A file can have one default plus any number of named exports:

\`\`\`js
import pets, { total } from "./pets.js";
\`\`\`

## The classic mix-up

- Curly braces around a default export gives \`undefined\`, or an error saying there is no such export.
- No curly braces around a named export gives *is not a function*.

If you see either, check how the other file exports. In React, components are almost always default exports, so you'll write \`import App from "./App.jsx"\` a lot.`,
      files: { "index.html": html, "index.js": "" },
      steps: [
        { say: "Last time we used named exports, with curly braces. There's a second kind: the default export. Think of it as the file's headline item. A file can have only one." },
        {
          say: "Here's pets dot J S. It makes an array, and at the bottom says export default pets.",
          files: { "pets.js": petsFile1 },
          open: "pets.js",
          highlight: "export default pets;",
        },
        {
          say: "To import a default, write the name with no curly braces. Check the console. The list is there.",
          files: { "index.js": d1 },
          open: "index.js",
          highlight: 'import pets from "./pets.js";',
        },
        {
          say: "Here's something special. Because there's only one default, the importing file picks the name. I'll call it my animals, and it still works. Most people reuse the original name, to keep things clear.",
          files: { "index.js": d2 },
          highlight: "import myAnimals",
        },
        {
          say: "So, the rule. Named exports use curly braces, and the name must match exactly. Default exports have no curly braces, and you choose the name. Now, the classic mix-up. What happens if I add curly braces to a default import?",
          files: { "index.js": d3 },
          highlight: 'import { pets } from "./pets.js";',
        },
        {
          say: "The console shows undefined. We asked for a named export called pets, but there isn't one. In some tools you'd see an error saying: no export named pets. Either way, the clue is the same: check how the file exports.",
        },
        {
          say: "Now the reverse. Here's a file with a named export, shout. If we import it with no curly braces, we get an error that says shout is not a function.",
          files: { "format.js": formatFile, "index.js": d4 },
          open: "index.js",
          highlight: 'import shout from "./format.js";',
        },
        {
          say: "Without curly braces, we asked for the default, and format dot J S doesn't have one. The fix is to add the curly braces, because shout is a named export.",
          files: { "index.js": d5 },
          highlight: 'import { shout } from "./format.js";',
        },
        {
          say: "One file can have both: a default plus named exports. In the import, the default comes first with no braces, then a comma, then the named ones in braces. Here pets dot J S also exports its total.",
          files: { "pets.js": petsFile2, "index.js": d6 },
          open: "index.js",
          highlight: 'import pets, { total } from "./pets.js";',
        },
        {
          say: "Your turn! I've made animal dot J S, with an object inside, but nothing is exported yet. Share it as a default export.",
          files: { "animal.js": animalFile1, "index.js": d7 },
          open: "animal.js",
          challenge: {
            task: `**Challenge:** in \`animal.js\`, add a **default export** for \`animal\`. Then in \`index.js\`, import it (no curly braces!) and print its \`sound\`.

The console should show \`meow\`.`,
            hints: [
              "At the bottom of animal.js, write export default animal;",
              'In index.js: import animal from "./animal.js"; with no curly braces.',
              "Then console.log(animal.sound);",
            ],
            tests: [
              { name: "animal.js has a default export", code: 'return /export\\s+default/.test(files()["animal.js"]);' },
              { name: "index.js imports animal without curly braces", code: 'return /import\\s+\\w+\\s*(,\\s*\\{[^}]*\\})?\\s*from\\s*["\']\\.\\/animal(\\.js)?["\']/.test(files()["index.js"]);' },
              { name: "The console shows meow", code: 'return logs.some((l) => l.trim() === "meow");' },
            ],
          },
        },
        {
          say: "Here's mine. Export default animal at the bottom of animal dot J S, and a plain import at the top of index dot J S. If you chose a different name for the import, that works too.",
          files: { "animal.js": animalFile2, "index.js": d8 },
          open: "animal.js",
          highlight: "export default animal;",
        },
        { say: "Remember: braces for named, no braces for default. If something is undefined, or is not a function, check the import first. In React, you'll write default imports all the time. Well done!" },
      ],
    },
    {
      kind: "practice",
      id: "m08-practice-mixup",
      title: "Practice: fix the import mix-up",
      type: "fix",
      task: `This program should print \`Total: 60\`, but the console shows an error. Read it as a clue.

Look at how \`data.js\` and \`helpers.js\` **export**, then fix the two import lines in \`index.js\`. Don't change the other files.`,
      files: {
        "index.html": html,
        "index.js": 'import { prices } from "./data.js";\nimport total from "./helpers.js";\n\nconsole.log("Total: " + total(prices));\n',
        "data.js": "const prices = [10, 20, 30];\n\nexport default prices;\n",
        "helpers.js": "export function total(numbers) {\n  let sum = 0;\n  for (const n of numbers) {\n    sum = sum + n;\n  }\n  return sum;\n}\n",
      },
      solution: {
        "index.js": 'import prices from "./data.js";\nimport { total } from "./helpers.js";\n\nconsole.log("Total: " + total(prices));\n',
      },
      hints: [
        "One file uses export default and the other uses a named export. The imports have the braces the wrong way round.",
        "data.js has a default export, so prices should be imported with no curly braces.",
        "helpers.js has a named export, so total needs curly braces: import { total } from ...",
      ],
      tests: [
        { name: "The console shows Total: 60", code: 'return logs.includes("Total: 60");' },
        { name: "The code does not need any change in data.js or helpers.js", code: 'return /export default/.test(files()["data.js"]) && /export function total/.test(files()["helpers.js"]);' },
      ],
    },
    {
      kind: "scrim",
      id: "m08-project-folders",
      title: "Folders and relative paths",
      notes: `## Organising a project

Real projects use folders. A common shape:

\`\`\`
index.js          <- the entry point: the page loads this file
data/pets.js
utils/format.js
utils/summary.js
\`\`\`

Only the **entry point** is loaded by \`index.html\`. Every other file is pulled in through \`import\`.

## Relative paths

The text after \`from\` says where the file is, **starting from the file you are writing in**:

| Path | Meaning |
|---|---|
| \`"./format.js"\` | same folder as this file |
| \`"./utils/format.js"\` | go into the \`utils\` folder |
| \`"../data/pets.js"\` | go **up** one folder, then into \`data\` |

## Good habits

- Each file imports **only what it needs**.
- Write the exact file name, including \`.js\`.
- A path with no \`./\` at the start, like \`"react"\`, means a **package** installed in the project, not a file of yours.

## A sneak peek

Styles can be imported too, with no names at all:

\`\`\`js
import "./styles.css";
\`\`\`

You'll use this in the next module.`,
      files: { "index.html": html, "index.js": "" },
      steps: [
        { say: "Real projects don't keep every file in one big pile. They use folders. Let's grow a small project, step by step, and learn how files find each other." },
        {
          say: "We start with everything in index dot J S: some data, a describe function, and a loop that prints each pet.",
          files: { "index.js": p1 },
          open: "index.js",
          highlight: "function describe(pet) {",
        },
        {
          say: "First, the data moves into a folder called data. The file is data slash pets dot J S, and it default exports the array.",
          files: { "data/pets.js": dataFile1 },
          open: "data/pets.js",
          highlight: "export default pets;",
        },
        {
          say: "Next, the describe function goes into a folder called utils, in a file called format dot J S. It's a named export.",
          files: { "utils/format.js": describeFile },
          open: "utils/format.js",
          highlight: "export function describe(pet) {",
        },
        {
          say: "Now index dot J S just imports what it needs. Check the console. The output is the same as before.",
          files: { "index.js": p2 },
          open: "index.js",
          highlight: 'import pets from "./data/pets.js";',
        },
        {
          say: "Read the first path like directions. Start in this folder, that's the dot slash. Go into data. Open pets dot J S. Paths always start from the file you're writing in.",
          highlight: '"./data/pets.js"',
        },
        {
          say: "Files in folders can import each other too. Here's summary dot J S inside utils. It needs the pets, which live in the data folder next door. Two dots mean: go up one folder first. So up out of utils, then into data.",
          files: { "utils/summary.js": summaryFile },
          open: "utils/summary.js",
          highlight: '"../data/pets.js"',
        },
        {
          say: "Same folder? One dot. It's how summary finds format dot J S. Now index dot J S can use summary too.",
          files: { "index.js": p3 },
          open: "index.js",
          highlight: "console.log(summary());",
        },
        {
          say: "Notice that index dot H T M L only loads index dot J S. Everything else arrives through imports. That first file is called the entry point. And styles will work the same way: you'll write import, then a path to a C S S file.",
        },
        {
          say: "Your turn! Add a third pet to the data file, and see it appear in both outputs.",
          files: {},
          challenge: {
            task: `**Challenge:** open \`data/pets.js\` and add a third pet to the array:

\`\`\`js
{ name: "Pixel", species: "parrot" },
\`\`\`

Run it. \`Pixel the parrot\` should appear in the console twice: once on its own line, and once in the summary. You only change **one** file, and everything else updates. That's the beauty of splitting code!`,
            hints: [
              "Open data/pets.js from the file list in the editor.",
              "Add a new object after the Mochi line, and don't forget the comma at the end of each line.",
              'The line is: { name: "Pixel", species: "parrot" },',
            ],
            tests: [
              { name: "data/pets.js contains Pixel", code: 'return /Pixel/.test(files()["data/pets.js"]);' },
              { name: "Pixel the parrot is printed", code: 'return logs.filter((l) => l.includes("Pixel the parrot")).length >= 2;' },
            ],
          },
        },
        {
          say: "Here's how I did it. One new line in the data file, and no other changes. Every file that uses the data gets the new pet for free.",
          files: { "data/pets.js": dataFile2 },
          open: "data/pets.js",
          highlight: '{ name: "Pixel", species: "parrot" },',
        },
        { say: "You can now split a project into files and folders, and connect them with import. That's exactly how React projects are built. Next, you'll meet React itself." },
      ],
    },
    {
      kind: "practice",
      id: "m08-practice-organise",
      title: "Practice: organise a small project",
      type: "build",
      task: `Build a tiny project from three files.

1. \`data/colors.js\`: make an array \`colors\` with \`"red"\`, \`"green"\`, \`"blue"\`, and **default export** it.
2. \`utils/format.js\`: write a function \`label(color)\` that returns \`Color: \` followed by the color, and **export** it by name.
3. \`index.js\`: import both (check the paths!) and, for every color, print its label.

The console should show \`Color: red\`, \`Color: green\` and \`Color: blue\`.`,
      files: {
        "index.html": html,
        "index.js": "// Import colors and label, then print a label for every color.\n",
        "data/colors.js": "// Make the colors array here and default export it.\n",
        "utils/format.js": "// Write and export the label function here.\n",
      },
      solution: {
        "index.js": 'import colors from "./data/colors.js";\nimport { label } from "./utils/format.js";\n\nfor (const color of colors) {\n  console.log(label(color));\n}\n',
        "data/colors.js": 'const colors = ["red", "green", "blue"];\n\nexport default colors;\n',
        "utils/format.js": "export function label(color) {\n  return `Color: ${color}`;\n}\n",
      },
      hints: [
        "Start with the two small files. In data/colors.js: const colors = [...]; then export default colors;",
        "In utils/format.js: export function label(color) { return ... } with a template literal.",
        'In index.js: import colors from "./data/colors.js"; and import { label } from "./utils/format.js"; then a for...of loop with console.log(label(color)).',
      ],
      tests: [
        { name: "data/colors.js has a default export", code: 'return /export\\s+default/.test(files()["data/colors.js"]);' },
        { name: "utils/format.js exports label by name", code: 'return /export\\s+(function\\s+label|const\\s+label)/.test(files()["utils/format.js"]);' },
        { name: "The console shows a label for every color", code: 'return ["red", "green", "blue"].every((c) => logs.includes("Color: " + c));' },
      ],
    },
    {
      kind: "quiz",
      id: "m08-quiz",
      title: "Quick check: modules",
      questions: [
        {
          q: "A file contains this line. How do you import it?",
          code: "export function add(a, b) {\n  return a + b;\n}",
          options: ['import add from "./math.js";', 'import { add } from "./math.js";', 'import "./math.js" as add;', 'import add = "./math.js";'],
          answer: 1,
          explain: "It is a named export, so you use curly braces with the exact name: `import { add } from \"./math.js\";`.",
        },
        {
          q: "What does this print?",
          code: '// pets.js\nexport default ["a", "b"];\n\n// index.js\nimport list from "./pets.js";\nconsole.log(list.length);',
          options: ["undefined", "2", "An error, because the name list doesn't match", "pets"],
          answer: 1,
          explain: "A default export has no fixed name, so the importing file picks one. `list` is the array, and its length is 2.",
        },
        {
          q: "Spot the bug. The console says add is not a function. What is wrong?",
          code: '// math.js\nexport function add(a, b) {\n  return a + b;\n}\n\n// index.js\nimport add from "./math.js";\nconsole.log(add(2, 3));',
          options: ["add needs to be declared with const", "add is a named export, so it needs curly braces when imported", "The path should be ../math.js", "console.log can't print numbers"],
          answer: 1,
          explain: "Without curly braces, JavaScript looks for a default export, and there isn't one. Write `import { add } from \"./math.js\";`.",
        },
        {
          q: 'You are in utils/summary.js and want data/pets.js, which is in the folder next to utils. Which path is right?',
          options: ['"./data/pets.js"', '"../data/pets.js"', '"data/pets.js"', '"../../pets.js"'],
          answer: 1,
          explain: "Two dots go up one folder, out of utils. Then `data/pets.js` goes into the data folder. A single dot would look inside utils itself.",
        },
        {
          q: "How many default exports can one file have?",
          options: ["As many as you like", "Exactly one at most", "Two", "None, you can only use named exports"],
          answer: 1,
          explain: "A file has at most one default export, its headline item. It can also have as many named exports as it likes.",
        },
        {
          q: 'What does the line import "./styles.css"; do?',
          options: ["Prints the file in the console", "Loads the file so its styles apply, without importing any names", "Creates a new file called styles", "Nothing, CSS can't be imported"],
          answer: 1,
          explain: "An import with no names just loads the file. For CSS, that applies its styles to the page. You'll use this in React projects.",
        },
      ],
    },
  ],
};
