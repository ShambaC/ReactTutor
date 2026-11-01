// Module 7: the DOM, events, and why keeping a page in sync by hand is painful (motivates React).
const page = (body) => `<!doctype html>
<html>
  <head>
    <title>My page</title>
  </head>
  <body>
${body}
    <script type="module" src="index.js"></script>
  </body>
</html>
`;

// ---- scrim 1: render a list ----
const petsHtml = page('    <h1>My pets</h1>\n    <ul id="pet-list"></ul>');
const petsHtml2 = page('    <h1>My pets</h1>\n    <ul id="pet-list"></ul>\n\n    <h2>Fruit</h2>\n    <ul id="fruit-list"></ul>');
const listLine = 'const list = document.querySelector("#pet-list");\n';
const loopBody = "  const item = document.createElement(\"li\");\n  item.textContent = pet;\n  list.appendChild(item);\n";
const a1 = 'const pets = ["Biscuit", "Mochi", "Pixel"];\n';
const a2 = a1 + "\n" + listLine;
const a3 = a2 + '\nconst item = document.createElement("li");\nitem.textContent = pets[0];\nlist.appendChild(item);\n';
const a4 = a2 + "\nfor (const pet of pets) {\n" + loopBody + "}\n";
const a5 = a4.replace('"Pixel"]', '"Pixel", "Nibbles"]');
const a6 = 'const pets = [\n  { name: "Biscuit", species: "dog" },\n  { name: "Mochi", species: "cat" },\n  { name: "Pixel", species: "parrot" },\n  { name: "Nibbles", species: "hamster" },\n];\n\n' + listLine + "\nfor (const pet of pets) {\n  const item = document.createElement(\"li\");\n  item.textContent = `${pet.name} (${pet.species})`;\n  list.appendChild(item);\n}\n";
const a7 = a6 + '\n// Your turn: show every fruit in the fruit list.\nconst fruits = ["apple", "banana", "cherry"];\n';
const a8 = a6 + '\nconst fruits = ["apple", "banana", "cherry"];\nconst fruitList = document.querySelector("#fruit-list");\n\nfor (const fruit of fruits) {\n  const item = document.createElement("li");\n  item.textContent = fruit;\n  fruitList.appendChild(item);\n}\n';

// ---- scrim 2: click counter ----
const counterHtml = page('    <h1>Counter</h1>\n    <p>Count: <span id="count">0</span></p>\n    <button id="plus">Add one</button>');
const counterHtml2 = page('    <h1>Counter</h1>\n    <p>Count: <span id="count">0</span></p>\n    <button id="plus">Add one</button>\n    <button id="minus">Minus one</button>');
const c1 = 'const display = document.querySelector("#count");\nconst plusButton = document.querySelector("#plus");\n';
const c2 = c1 + "\nlet count = 0;\n";
const c3 = c2 + '\nplusButton.addEventListener("click", () => {\n  console.log("clicked!");\n});\n';
const c4 = c2 + '\nplusButton.addEventListener("click", () => {\n  count = count + 1;\n  display.textContent = count;\n});\n';
const c5 = 'const display = document.querySelector("#count");\nconst plusButton = document.querySelector("#plus");\nconst minusButton = document.querySelector("#minus");\n\nlet count = 0;\n\nplusButton.addEventListener("click", () => {\n  count = count + 1;\n  display.textContent = count;\n});\n\nminusButton.addEventListener("click", () => {\n  count = count - 1;\n  display.textContent = count;\n});\n';

// ---- scrim 3: input + sync ----
const shopHtml = page('    <h1>Shopping list</h1>\n    <input id="item-input" placeholder="Add an item">\n    <button id="add">Add</button>\n    <ul id="list"></ul>\n    <p id="summary">0 items</p>');
const shopHtml2 = page('    <h1>Shopping list</h1>\n    <input id="item-input" placeholder="Add an item">\n    <button id="add">Add</button>\n    <button id="undo">Remove last</button>\n    <ul id="list"></ul>\n    <p id="summary">0 items</p>');
const k1 = 'const input = document.querySelector("#item-input");\nconst addButton = document.querySelector("#add");\nconst list = document.querySelector("#list");\nconst summary = document.querySelector("#summary");\n\nconst items = [];\n';
const k2 = k1 + '\naddButton.addEventListener("click", () => {\n  console.log(input.value);\n});\n';
const k3 = k1 + '\naddButton.addEventListener("click", () => {\n  items.push(input.value);\n  console.log(items);\n});\n';
const k4 = k1 + '\naddButton.addEventListener("click", () => {\n  items.push(input.value);\n\n  const li = document.createElement("li");\n  li.textContent = input.value;\n  list.appendChild(li);\n});\n';
const k5 = k1 + "\naddButton.addEventListener(\"click\", () => {\n  items.push(input.value);\n\n  const li = document.createElement(\"li\");\n  li.textContent = input.value;\n  list.appendChild(li);\n\n  summary.textContent = `${items.length} items`;\n});\n";
const renderFn = 'function render() {\n  list.innerHTML = "";\n  for (const item of items) {\n    const li = document.createElement("li");\n    li.textContent = item;\n    list.appendChild(li);\n  }\n  summary.textContent = `${items.length} items`;\n}\n';
const k6 = k1 + "\n" + renderFn + '\naddButton.addEventListener("click", () => {\n  items.push(input.value);\n  render();\n});\n';
const k7 = k1 + "\n" + renderFn + '\naddButton.addEventListener("click", () => {\n  if (input.value === "") {\n    return;\n  }\n  items.push(input.value);\n  input.value = "";\n  render();\n});\n';
const k8 = k7.replace('const summary = document.querySelector("#summary");\n', 'const summary = document.querySelector("#summary");\nconst undoButton = document.querySelector("#undo");\n') + '\nundoButton.addEventListener("click", () => {\n  items.pop();\n});\n';
const k9 = k8.replace("  items.pop();\n", "  items.pop();\n  render();\n");

export default {
  id: "m07",
  title: "Pages that respond",
  summary: "Build page elements from data, react to clicks and typing, and discover why keeping a page in sync by hand gets messy. That is the problem React was made to solve.",
  lessons: [
    {
      kind: "scrim",
      id: "m07-render-list",
      title: "Drawing a list from data",
      notes: `## Build the page from your data

Recap: \`document.querySelector("#some-id")\` finds an element, and \`.textContent = "..."\` changes its text. The \`#\` means "the element with this id".

To **create** new elements:

\`\`\`js
const item = document.createElement("li");  // a new li, floating in memory
item.textContent = "Biscuit";               // give it some text
list.appendChild(item);                     // put it inside the list
\`\`\`

\`appendChild\` is the step that makes it appear on the page.

## One element per array item

\`\`\`js
for (const pet of pets) {
  const item = document.createElement("li");
  item.textContent = pet;
  list.appendChild(item);
}
\`\`\`

Add an item to the array and the page gets one more \`<li>\`, with no change to the HTML. **The data drives the page.**

**Common mistake:** forgetting \`appendChild\`. The element is created but never shown.`,
      files: { "index.html": petsHtml, "index.js": "" },
      steps: [
        { say: "Welcome back! In the first module we used query selector and text content to change a page. Today we make pages that build themselves from data, and then respond to clicks." },
        {
          say: "Here's some data: an array of three pet names. Our page has an empty list, an unordered list with the id pet list. Let's fill it from the array.",
          files: { "index.js": a1 },
          open: "index.js",
          highlight: 'const pets = ["Biscuit", "Mochi", "Pixel"];',
        },
        {
          say: "First, find the list. The hash sign in the quotes means: the element whose id is pet list.",
          files: { "index.js": a2 },
          highlight: 'document.querySelector("#pet-list")',
        },
        {
          say: "Now let's make one new list item. Create element makes a brand new li, but it only exists in memory. We give it text, then append child puts it inside the list. Look at the preview!",
          files: { "index.js": a3 },
          highlight: "list.appendChild(item);",
        },
        {
          say: "We want one item per pet, and you know a tool for that: a for of loop. We wrap the same three lines in a loop, and use the pet in place of index zero.",
          files: { "index.js": a4 },
          highlight: "for (const pet of pets) {",
        },
        {
          say: "Here's the magic. I'll add a fourth name to the array and run again. We didn't touch the H T M L at all, and a fourth list item appears. The data drives the page.",
          files: { "index.js": a5 },
          highlight: '"Nibbles"',
        },
        {
          say: "Real data is usually objects, like you saw last module. Each pet gets a name and species, and a template literal builds the text. The loop is almost the same.",
          files: { "index.js": a6 },
          highlight: "`${pet.name} (${pet.species})`",
        },
        {
          say: "Your turn! I've added a second list to the page, and an array of fruit. Can you fill the fruit list the same way?",
          files: { "index.html": petsHtml2, "index.js": a7 },
          open: "index.js",
          challenge: {
            task: `**Challenge:** show every fruit from the \`fruits\` array as an \`<li>\` inside the list with the id \`fruit-list\`.

1. Find the list with \`document.querySelector("#fruit-list")\`.
2. Loop over \`fruits\`. For each one, create an \`li\`, set its \`textContent\`, and \`appendChild\` it.`,
            hints: [
              "Copy the pets loop and change the names: fruit instead of pet, and fruitList instead of list.",
              'You need: const fruitList = document.querySelector("#fruit-list");',
              "Inside the loop: create the li with document.createElement, set item.textContent = fruit, then fruitList.appendChild(item).",
            ],
            tests: [
              { name: "The fruit list has three items", code: 'return $$("#fruit-list li").length === 3;' },
              { name: "The fruit list shows banana", code: 'return text("#fruit-list").includes("banana");' },
              { name: "The pets list still works", code: 'return $$("#pet-list li").length === 4;' },
            ],
          },
        },
        {
          say: "Here's how I did it. The same loop, with a different list and different data. Whatever names you chose are fine, as long as the fruit shows up.",
          files: { "index.js": a8 },
          highlight: "fruitList.appendChild(item);",
        },
        { say: "Notice something, though. This code runs once, when the page loads. If the array changed later, the page wouldn't notice. Next, we'll make the page respond to clicks." },
      ],
    },
    {
      kind: "practice",
      id: "m07-practice-colors",
      title: "Practice: draw a list from data",
      type: "fill",
      task: `Fill in the blanks (\`___\`) so that the page shows one list item for each color in the array.

You need: the id of the list, the array to loop over, the method that creates an element, and the method that puts it on the page.`,
      files: {
        "index.html": page('    <h1>Colors</h1>\n    <ul id="colors"></ul>'),
        "index.js": 'const colors = ["red", "green", "blue"];\n\nconst list = document.querySelector("___");\n\nfor (const color of ___) {\n  const item = document.___("li");\n  item.textContent = color;\n  list.___(item);\n}\n',
      },
      solution: {
        "index.js": 'const colors = ["red", "green", "blue"];\n\nconst list = document.querySelector("#colors");\n\nfor (const color of colors) {\n  const item = document.createElement("li");\n  item.textContent = color;\n  list.appendChild(item);\n}\n',
      },
      hints: [
        "The list in the HTML has the id colors, and a hash sign goes before an id in query selector.",
        "Loop over the array called colors. The two methods are the ones from the lesson: one makes an element, one puts it inside another.",
        'The answers in order are: "#colors", colors, createElement, appendChild.',
      ],
      tests: [
        { name: "The list shows three items", code: 'return $$("#colors li").length === 3;' },
        { name: "The items are the colors", code: 'return text("#colors").includes("green") && text("#colors").includes("blue");' },
      ],
    },
    {
      kind: "scrim",
      id: "m07-click-counter",
      title: "Clicks and a counter",
      notes: `## Events: when something happens, run this

An **event** is something the user does: click, type, hover. You tell the browser what to do with \`addEventListener\`:

\`\`\`js
button.addEventListener("click", () => {
  // this runs every time the button is clicked
});
\`\`\`

- The first item is the **event name**, as text.
- The second is a **function** to run later, not now. It is called a **callback**.

## A counter

\`\`\`js
let count = 0;

plusButton.addEventListener("click", () => {
  count = count + 1;               // 1. change the data
  display.textContent = count;     // 2. update the page
});
\`\`\`

Two jobs on every click: **change the data**, then **update the page**. Forget the second and the page shows old information.

We use \`let\` for \`count\` because it changes.`,
      files: { "index.html": counterHtml, "index.js": "" },
      steps: [
        { say: "Pages get exciting when they respond to people. Something a person does, like clicking a button, is called an event. Today we'll build a counter that goes up when you click." },
        {
          say: "Our page has a number inside a span, with the id count, and a button with the id plus. Let's grab both with query selector.",
          files: { "index.js": c1 },
          open: "index.js",
          highlight: 'document.querySelector("#plus")',
        },
        {
          say: "We need somewhere to remember the number. That's a variable, and since it will change, we use let instead of const.",
          files: { "index.js": c2 },
          highlight: "let count = 0;",
        },
        {
          say: "Now we listen for clicks. Add event listener takes two things: the name of the event, click, and a function to run each time it happens. For now, the function just logs a message. Click the button and watch the console.",
          files: { "index.js": c3 },
          highlight: 'plusButton.addEventListener("click", () => {',
        },
        {
          say: "Let's do real work. On every click, count becomes count plus one, and then we put the new number in the page with text content.",
          files: { "index.js": c4 },
          highlight: "count = count + 1;",
        },
        { say: "Two jobs on every click: change the data, then update the page. Remember that, because it matters a lot in a few lessons. If we forgot the second job, the number would change inside the code, but the page would stay stuck." },
        {
          say: "Your turn! Add a second button that subtracts one.",
          challenge: {
            task: `**Challenge:** add a **Minus one** button.

1. In \`index.html\`, add \`<button id="minus">Minus one</button>\` under the plus button.
2. In \`index.js\`, find it, and add a click listener that does \`count = count - 1\` and updates the page.`,
            hints: [
              'Find the button with document.querySelector("#minus"), like the plus button.',
              "Copy the plus listener, change the name of the button and change plus to minus.",
              "Inside: count = count - 1; then display.textContent = count;",
            ],
            tests: [
              { name: "There is a button with the id minus", code: 'return !!$("#minus");' },
              { name: "Plus adds one", code: 'const n = Number(text("#count")); await click("#plus"); return Number(text("#count")) === n + 1;' },
              { name: "Minus subtracts one", code: 'const n = Number(text("#count")); await click("#minus"); return Number(text("#count")) === n - 1;' },
            ],
          },
        },
        {
          say: "Here's mine. A new button in the H T M L, and a second listener that does the same two jobs, but subtracts. Yours may be written differently, and that's fine.",
          files: { "index.html": counterHtml2, "index.js": c5 },
          open: "index.js",
          highlight: "count = count - 1;",
        },
        { say: "You can now make a page respond to clicks. Next, we'll read what someone types, and discover why keeping everything in sync gets tricky." },
      ],
    },
    {
      kind: "practice",
      id: "m07-practice-score",
      title: "Practice: fix the score counter",
      type: "fix",
      task: `The score counter has two bugs. Run it and click the buttons to see what goes wrong, then fix them.

- After clicking **+1 point** twice, the page should say **2**, but it is always one step behind.
- **Reset** should put the score back to **0** on the page.`,
      files: {
        "index.html": page('    <h1>Score</h1>\n    <p>Points: <span id="points">0</span></p>\n    <button id="add">+1 point</button>\n    <button id="reset">Reset</button>'),
        "index.js": 'let score = 0;\n\nconst display = document.querySelector("#points");\nconst addButton = document.querySelector("#add");\nconst resetButton = document.querySelector("#reset");\n\naddButton.addEventListener("click", () => {\n  display.textContent = score;\n  score = score + 1;\n});\n\nresetButton.addEventListener("click", () => {\n  score = 0;\n});\n',
      },
      solution: {
        "index.js": 'let score = 0;\n\nconst display = document.querySelector("#points");\nconst addButton = document.querySelector("#add");\nconst resetButton = document.querySelector("#reset");\n\naddButton.addEventListener("click", () => {\n  score = score + 1;\n  display.textContent = score;\n});\n\nresetButton.addEventListener("click", () => {\n  score = 0;\n  display.textContent = score;\n});\n',
      },
      hints: [
        "Remember the two jobs on every click: change the data, then update the page. The order matters.",
        "In the plus listener, the page is updated before the score changes. Swap those two lines.",
        "In the reset listener, set score to 0 and then also set display.textContent = score;",
      ],
      tests: [
        { name: "Two clicks on +1 point show 2", code: 'await click("#add"); await click("#add"); return text("#points") === "2";' },
        { name: "Reset shows 0 on the page", code: 'await click("#reset"); return Number(text("#points")) === 0;' },
        { name: "Counting works again after a reset", code: 'await click("#add"); return text("#points") === "1";' },
      ],
    },
    {
      kind: "scrim",
      id: "m07-keeping-in-sync",
      title: "Reading inputs and keeping in sync",
      notes: `## Reading an input

\`\`\`js
const input = document.querySelector("#item-input");
console.log(input.value);   // whatever is typed right now
input.value = "";           // empty the box
\`\`\`

## Data and page are separate

Our shopping list has **data** (the \`items\` array) and a **page** (the \`<li>\` elements, the summary text). When data changes, you must update the page yourself, everywhere it shows that data.

One tidy trick: a \`render()\` function that **redraws everything from the data**.

\`\`\`js
function render() {
  list.innerHTML = "";                 // clear the list
  for (const item of items) { ... }    // rebuild it
  summary.textContent = \`\${items.length} items\`;
}
\`\`\`

Then every change does the same two steps: change the data, call \`render()\`.

## The big problem

Bigger pages have many places that show the same data. Miss one and the page **tells a lie**. We keep writing code to *keep the page in sync*.

**What if the page just updated itself from the data?** That is React.`,
      files: { "index.html": shopHtml, "index.js": "" },
      steps: [
        { say: "Let's build a shopping list: a text box, an Add button, a list, and a line that counts the items. It'll teach us how to read what someone types, and show us a real problem." },
        {
          say: "We find the four elements we'll need, and make an empty array called items to hold the data. Keep that array in mind. It's our single source of truth.",
          files: { "index.js": k1 },
          open: "index.js",
          highlight: "const items = [];",
        },
        {
          say: "To read what's typed, we use the input's value property. On each click, we log it. Try typing something and clicking Add, then check the console.",
          files: { "index.js": k2 },
          highlight: "console.log(input.value);",
        },
        {
          say: "Now we store it. Push adds the text to the items array. Try it: the console shows the data growing, but the page doesn't change at all. The data and the page are two separate things.",
          files: { "index.js": k3 },
          highlight: "items.push(input.value);",
        },
        {
          say: "So we update the page by hand: create a list item, set its text, and append it. Now the list grows when you click.",
          files: { "index.js": k4 },
          highlight: "list.appendChild(li);",
        },
        {
          say: "We also want the summary line to say how many items there are. That's one more place to update. Every place that shows the data needs its own update code.",
          files: { "index.js": k5 },
          highlight: "summary.textContent = `${items.length} items`;",
        },
        {
          say: "Here's a tidier way. One function, render, clears the list and rebuilds everything from the items array. After any change, we call render. Data changes first, then the page is redrawn to match.",
          files: { "index.js": k6 },
          highlight: "function render() {",
        },
        {
          say: "Your turn! Right now an empty box adds a blank item, and the text stays in the box after adding. Fix both.",
          challenge: {
            task: `**Challenge:** improve the click handler.

1. If the input is empty (\`input.value === ""\`), do nothing: use \`return\`.
2. After adding, **clear the input** with \`input.value = ""\`.`,
            hints: [
              'An if statement can check: if (input.value === "") { return; } The return stops the function early.',
              'Put the if statement at the top of the click handler, before items.push.',
              'After items.push(input.value); add the line input.value = ""; and keep render(); at the end.',
            ],
            tests: [
              { name: "Adding Milk shows a new list item", code: 'const n = $$("#list li").length; await type("#item-input", "Milk"); await click("#add"); return $$("#list li").length === n + 1 && text("#list").includes("Milk");' },
              { name: "The input box is cleared after adding", code: 'await type("#item-input", "Eggs"); await click("#add"); return $("#item-input").value === "";' },
              { name: "An empty box does not add an item", code: 'const n = $$("#list li").length; await click("#add"); return $$("#list li").length === n;' },
            ],
          },
        },
        {
          say: "Here's how I did it. An early return for the empty box, and clearing the input after pushing. Everything else stays the same.",
          files: { "index.js": k7 },
          highlight: 'input.value = "";',
        },
        {
          say: "Let's add one more feature: a Remove last button. I've written it quickly, and removed the last item from the array with pop. But try it. The page still shows the item, and the summary still says the old number.",
          files: { "index.html": shopHtml2, "index.js": k8 },
          open: "index.js",
          highlight: "items.pop();",
        },
        {
          say: "I forgot to update the page. The data changed, but nothing redrew it. The fix is one line: call render after the change.",
          files: { "index.js": k9 },
          highlight: "render();\n});",
        },
        { say: "This is the real problem. Imagine a page with dozens of buttons and many places that show the same data. Every change must remember to update every place. Forget one, and the page tells a lie." },
        { say: "So here's a big question. What if the page just updated itself whenever our data changed? We'd only describe how it looks for the data. That's exactly what React does, and it's what we start soon. Well done today!" },
      ],
    },
    {
      kind: "practice",
      id: "m07-practice-greeter",
      title: "Practice: build a greeter",
      type: "build",
      task: `The page has a text box, a button and an empty paragraph. Write the JavaScript so that:

1. When the **Greet me** button is clicked, the paragraph (\`#greeting\`) says \`Hello, \` followed by the name typed in the box and an exclamation mark. For example: **Hello, Sam!**

Read the text box with its \`.value\`.`,
      files: {
        "index.html": page('    <h1>Greeter</h1>\n    <input id="name-input" placeholder="Your name">\n    <button id="greet-btn">Greet me</button>\n    <p id="greeting"></p>'),
        "index.js": '// 1. Find the input, the button and the greeting paragraph.\n\n// 2. When the button is clicked, show the greeting.\n',
      },
      solution: {
        "index.js": 'const input = document.querySelector("#name-input");\nconst button = document.querySelector("#greet-btn");\nconst greeting = document.querySelector("#greeting");\n\nbutton.addEventListener("click", () => {\n  greeting.textContent = `Hello, ${input.value}!`;\n});\n',
      },
      hints: [
        "Use document.querySelector with #name-input, #greet-btn and #greeting to find the three elements.",
        'Listen with button.addEventListener("click", () => { ... }); and put the greeting code inside the curly braces.',
        "Inside the listener: greeting.textContent = `Hello, ${input.value}!`;",
      ],
      tests: [
        { name: "Clicking with Sam typed says Hello, Sam!", code: 'await type("#name-input", "Sam"); await click("#greet-btn"); return text("#greeting") === "Hello, Sam!";' },
        { name: "It works for another name too", code: 'await type("#name-input", "Priya"); await click("#greet-btn"); return text("#greeting").includes("Priya") && text("#greeting").includes("Hello");' },
        { name: "The paragraph is empty before any click", code: 'return true;' },
      ],
    },
    {
      kind: "quiz",
      id: "m07-quiz",
      title: "Quick check: pages that respond",
      questions: [
        {
          q: 'After this code runs, what is on the page?',
          code: 'const item = document.createElement("li");\nitem.textContent = "Milk";',
          options: ["A list item that says Milk", "Nothing yet, the item was never added to the page", "An error", "The word Milk in the console"],
          answer: 1,
          explain: "`createElement` makes the element in memory. It only appears once you put it inside something on the page with `appendChild`.",
        },
        {
          q: "The page shows 0. What does it show after one click on the button?",
          code: 'let count = 0;\nbutton.addEventListener("click", () => {\n  count = count + 1;\n});',
          options: ["1", "0, because the page was never updated", "undefined", "An error"],
          answer: 1,
          explain: "The variable changes to 1, but nothing writes it into the page. You need a second job: `display.textContent = count;`.",
        },
        {
          q: "Spot the bug. When does sayHi run?",
          code: 'button.addEventListener("click", sayHi());',
          options: ["Every time the button is clicked", "Right away when the page loads, not on click", "Never", "Only when the button is double clicked"],
          answer: 1,
          explain: "The round brackets after `sayHi` call the function immediately. To run it on click, pass the function itself: `sayHi` with no brackets.",
        },
        {
          q: "How do you read what someone has typed in an input box?",
          options: ["input.text", "input.value", "input.textContent", "input.typed"],
          answer: 1,
          explain: "An input's current text is in its `value` property. `textContent` is for things like paragraphs and headings.",
        },
        {
          q: "In our shopping list, items changed but part of the page still showed old information. What problem does React aim to solve?",
          options: ["Making JavaScript run faster", "Keeping the page in sync with our data automatically", "Replacing HTML with CSS", "Storing data on a server"],
          answer: 1,
          explain: "When you update the page by hand, it's easy to forget a spot. React lets you describe the page from your data, and it redraws whenever the data changes.",
        },
      ],
    },
  ],
};
