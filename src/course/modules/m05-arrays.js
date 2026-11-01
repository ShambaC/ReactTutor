// Module 5: arrays and lists (plain JavaScript, console + a little DOM).
const page = (body = "") => `<!doctype html>
<html>
  <head>
    <title>Practice page</title>
  </head>
  <body>${body}
    <script type="module" src="index.js"></script>
  </body>
</html>
`;
// Builds a code file from lines.
const L = (...lines) => lines.join("\n") + "\n";

// ---- scrim 1: array basics ----
const a1 = L('const groceries = ["milk", "eggs", "bread"];', "console.log(groceries);");
const a2 = a1 + L("console.log(groceries[0]);", "console.log(groceries[2]);");
const a3 = a2 + L("console.log(groceries[3]);");
const a4 = a2 + L("console.log(groceries.length);", "console.log(groceries[groceries.length - 1]);");
const a5 = L('const groceries = ["milk", "eggs", "bread"];', "", 'groceries[1] = "juice";', "console.log(groceries);");
const a6 = a5 + L("", 'groceries = ["tea"];');
const a7 = L('const groceries = ["milk", "eggs", "bread"];', "", 'groceries.push("apples");', "console.log(groceries);", "console.log(groceries.length);");
const a8 = L("const scores = [90, 72, 85];", "console.log(scores[0] + scores[1]);", "console.log(scores.length);");
const a9 = L('const groceries = ["milk", "eggs"];', "const sameList = groceries;", "", 'sameList.push("tea");', "console.log(groceries);");
const a10 = L("// Your turn below");
const a11 = a10 + L(
  'const colors = ["red", "green", "blue"];',
  "console.log(colors[0]);",
  "",
  'colors.push("purple");',
  "console.log(colors.length);",
  "console.log(colors[colors.length - 1]);"
);

// ---- scrim 2: loops and includes ----
const l1 = L('const pets = ["Biscuit", "Pepper", "Mochi"];', "", "for (const pet of pets) {", "  console.log(pet);", "}");
const l2 = L('const pets = ["Biscuit", "Pepper", "Mochi"];', "", "for (const pet of pets) {", "  console.log(pets);", "}");
const l3 = L('const pets = ["Biscuit", "Pepper", "Mochi"];', "", "for (const pet of pets) {", '  console.log("Hello, " + pet + "!");', "}");
const l4 = L("const scores = [90, 72, 85];", "let total = 0;", "", "for (const score of scores) {", "  total = total + score;", "}", "", "console.log(total);");
const l5 = L('const pets = ["Biscuit", "Pepper", "Mochi"];', "", 'console.log(pets.includes("Mochi"));', 'console.log(pets.includes("Rex"));');
const l6 = l5 + L("", 'if (pets.includes("Mochi")) {', '  console.log("Mochi is here!");', "}");
const l7 = L("const prices = [4, 10, 7];", "", "// Your turn below");
const l8 = L("const prices = [4, 10, 7];", "let total = 0;", "", "for (const price of prices) {", "  total = total + price;", "}", "", 'console.log("Total: " + total);');

// ---- scrim 3: map, filter, find ----
const m1 = L("const numbers = [1, 2, 3];", "const doubled = [];", "", "for (const n of numbers) {", "  doubled.push(n * 2);", "}", "", "console.log(doubled);");
const m2 = L("const numbers = [1, 2, 3];", "const doubled = numbers.map((n) => n * 2);", "", "console.log(doubled);");
const m3 = m2 + L("console.log(numbers);");
const m4 = L('const names = ["Ada", "Alan", "Grace"];', 'const greetings = names.map((name) => "Hello, " + name + "!");', "", "console.log(greetings);");
const m5 = L("const numbers = [1, 2, 3];", "const doubled = numbers.map((n) => {", "  n * 2;", "});", "", "console.log(doubled);");
const m6 = L("const numbers = [1, 2, 3];", "const doubled = numbers.map((n) => {", "  return n * 2;", "});", "", "console.log(doubled);");
const m7 = L('const fruits = ["Apple", "Banana", "Cherry"];', 'const items = fruits.map((fruit) => "<li>" + fruit + "</li>");', "", "console.log(items);");
const m8 = m7 + L('document.querySelector("#list").innerHTML = items.join("");');
const m9 = L("const numbers = [5, 12, 8, 20];", "const big = numbers.filter((n) => n > 10);", "", "console.log(big);");
const m10 = m9 + L("", "const firstBig = numbers.find((n) => n > 10);", "console.log(firstBig);", "console.log(numbers.find((n) => n > 100));");
const m11 = L("const prices = [10, 20, 30];", "", "// Your turn below");
const m12 = m11 + L(
  "const discounted = prices.map((price) => price - 5);",
  "const expensive = prices.filter((price) => price > 10);",
  "",
  "console.log(discounted);",
  "console.log(expensive);"
);

export default {
  id: "m05",
  title: "Arrays and lists",
  summary: "Store many values in one list, walk through it with a loop, and learn map, filter and find: the array tools that power every list you will build in React.",
  lessons: [
    {
      kind: "scrim",
      id: "m05-array-basics",
      title: "Arrays: numbered shelves",
      notes: `## An array is a list

An **array** holds many values in order. Think of a row of numbered shelves.

\`\`\`js
const groceries = ["milk", "eggs", "bread"];
\`\`\`

Square brackets make the array, and commas separate the **items**.

## Index: the shelf number

Counting starts at **zero**:

\`\`\`js
groceries[0]  // "milk"
groceries[1]  // "eggs"
groceries[2]  // "bread"
groceries[3]  // undefined (no such shelf)
\`\`\`

- \`groceries.length\` is how many items there are: \`3\`.
- The last item is \`groceries[groceries.length - 1]\`.

## Changing an array

\`\`\`js
groceries[1] = "juice";      // replace an item
groceries.push("apples");    // add to the end
\`\`\`

A \`const\` array can still change its **contents**. \`const\` only means you can't swap the whole box for a different array: \`groceries = ["tea"]\` gives "Assignment to constant variable".

## A gentle aside: two labels, one list

\`\`\`js
const sameList = groceries;
sameList.push("tea");  // groceries has "tea" too!
\`\`\`

\`sameList\` is not a copy. It is a second label on the same shelves.

## Common mistake

Expecting the first item at \`[1]\`. It is at \`[0]\`.`,
      files: { "index.html": page(), "index.js": "" },
      steps: [
        { say: "Welcome! So far each variable held one value. But a shopping list has many things. For that we have arrays. Think of an array as a row of numbered shelves, each holding one item." },
        {
          say: "Square brackets make an array, and commas separate the items. Our grocery list holds milk, eggs and bread. Printing the whole array shows the list in the console.",
          files: { "index.js": a1 },
          open: "index.js",
          highlight: '["milk", "eggs", "bread"]',
        },
        {
          say: "To get one item, write the array's name and the shelf number in square brackets. Here's the surprise: counting starts at zero. So shelf zero holds milk, and shelf two holds bread.",
          files: { "index.js": a2 },
          highlight: "console.log(groceries[0]);",
        },
        {
          say: "What about shelf three? There's no such shelf, only shelves zero, one and two. The console shows undefined, meaning nothing is there. It's a clue that your number is too big.",
          files: { "index.js": a3 },
          highlight: "console.log(groceries[3]);",
        },
        {
          say: "To ask how many items there are, use dot length. Three items. Because counting starts at zero, the last item is at length minus one. We use that to grab bread without counting by hand.",
          files: { "index.js": a4 },
          highlight: "groceries[groceries.length - 1]",
        },
        {
          say: "We can replace an item by putting a value on a shelf. Shelf one gets juice instead of eggs. Notice the array is a const, yet it changed! That's allowed.",
          files: { "index.js": a5 },
          highlight: 'groceries[1] = "juice";',
        },
        {
          say: "Const protects the box, not what's on the shelves. We can't swap in a whole new array. Look: Assignment to constant variable. But changing the items inside is fine.",
          files: { "index.js": a6 },
          highlight: 'groceries = ["tea"];',
        },
        {
          say: "To add to the end, we use push. Push apples, and the list grows to four items. Push is a built in tool for arrays, written with a dot after the name.",
          files: { "index.js": a7 },
          highlight: 'groceries.push("apples");',
        },
        {
          say: "Arrays can hold numbers too. Scores at shelf zero and shelf one add up to one sixty two. Each shelf is a normal value.",
          files: { "index.js": a8 },
          highlight: "scores[0] + scores[1]",
        },
        {
          say: "A gentle aside. If we write same list equals groceries, we don't get a copy. We get a second label on the same shelves. Pushing tea through one label shows up under the other. Good to know for later.",
          files: { "index.js": a9 },
          highlight: "const sameList = groceries;",
        },
        {
          say: "Your turn! Make your own array.",
          files: { "index.js": a10 },
          challenge: {
            task: `**Challenge:** under the comment:

1. Make an array called \`colors\` with three colour names (text in quotes).
2. Print the **first** colour.
3. \`push\` a new colour, \`"purple"\`, onto the end.
4. Print how many colours there are now (\`4\`), then print the **last** colour.

Remember: the first item is at index \`0\`.`,
            hints: [
              'Start with: const colors = ["red", "green", "blue"];',
              "console.log(colors[0]); prints the first one. Then colors.push(\"purple\");",
              "Use colors.length for the count, and colors[colors.length - 1] for the last item.",
            ],
            tests: [
              { name: "The array has been pushed to", code: 'return /\\.push\\(/.test(files()["index.js"]);' },
              { name: "The console shows 4 (the length)", code: 'return logs.includes("4");' },
              { name: "The last colour, purple, is printed", code: 'return logs.includes("purple");' },
            ],
          },
        },
        {
          say: "Here's how I did it. First item, then push, then the length, and the last item using length minus one. Your colours may differ, and that's perfect.",
          files: { "index.js": a11 },
          highlight: 'colors.push("purple");',
        },
        { say: "Great job! Arrays are lists, counting starts at zero, length counts, and push adds. Next, we'll visit every item in a list." },
      ],
    },
    {
      kind: "practice",
      id: "m05-practice-fill",
      title: "Practice: shelves and push",
      type: "fill",
      task: `Fill in the blanks (\`___\`) so that the console prints, in order:

\`\`\`
apple
4
mango
\`\`\`

1. Print the **first** item. Remember, counting starts at zero.
2. \`push\` \`"mango"\` onto the end of the list.
3. Print the **length** of the list.
4. Print the **last** item using \`length - 1\`.

Press **Run**, then **Check my code**.`,
      files: {
        "index.html": page(),
        "index.js": L(
          'const fruits = ["apple", "banana", "cherry"];',
          "",
          "console.log(fruits[___]);",
          "",
          'fruits.___("mango");',
          "",
          "console.log(fruits.___);",
          "console.log(fruits[fruits.length - ___]);"
        ),
      },
      solution: {
        "index.js": L(
          'const fruits = ["apple", "banana", "cherry"];',
          "",
          "console.log(fruits[0]);",
          "",
          'fruits.push("mango");',
          "",
          "console.log(fruits.length);",
          "console.log(fruits[fruits.length - 1]);"
        ),
      },
      hints: [
        "The first item is at index 0.",
        "The tool that adds to the end is push, and the property that counts items is length.",
        "The answers, in order: 0, push, length, 1.",
      ],
      tests: [
        { name: "The first line prints apple", code: 'return logs[0] === "apple";' },
        { name: "The second line prints 4", code: 'return logs[1] === "4";' },
        { name: "The third line prints mango", code: 'return logs[2] === "mango";' },
      ],
    },
    {
      kind: "scrim",
      id: "m05-loops-includes",
      title: "Visiting every item",
      notes: `## for...of: do something for each item

\`\`\`js
const pets = ["Biscuit", "Pepper", "Mochi"];

for (const pet of pets) {
  console.log("Hello, " + pet + "!");
}
\`\`\`

Read it aloud: *for each \`pet\` of \`pets\`, do this.* The code in the curly braces runs once per item, and \`pet\` holds the current item each time round.

- The first name is a **new** name you choose. Make it the singular of the list: \`pet\` of \`pets\`.
- Use \`pet\` (one item) inside, not \`pets\` (the whole list).

## Adding things up

\`\`\`js
let total = 0;
for (const score of scores) {
  total = total + score;
}
\`\`\`

\`total\` is a \`let\` because it changes on every lap.

## includes: is it in the list?

\`\`\`js
pets.includes("Mochi")  // true
pets.includes("Rex")    // false
\`\`\`

It answers with a boolean, so it fits right into an \`if\`. Spelling and capital letters must match exactly.

## Common mistake

Printing \`pets\` instead of \`pet\` inside the loop. No error, but you see the whole list every lap.`,
      files: { "index.html": page(), "index.js": "" },
      steps: [
        { say: "We have a list of pets and we want to greet each one. We could write one line per pet, but what if the list has a hundred? Loops do this for us." },
        {
          say: "Here's a loop. For, round brackets, const pet of pets. Read it out loud: for each pet of pets, do the curly braces. The code runs once for each item, and pet holds the current one.",
          files: { "index.js": l1 },
          open: "index.js",
          highlight: "for (const pet of pets) {",
        },
        {
          say: "The console shows each name on its own line. The name pet is one we chose. A good habit is to use the singular of the list's name: pet of pets.",
        },
        {
          say: "Here's a common slip. Inside the loop, I print pets, the whole list, instead of pet, one item. No error, but the console shows the whole list three times. The clue: the same thing repeating.",
          files: { "index.js": l2 },
          highlight: "console.log(pets);",
        },
        {
          say: "Fixed. Now we can do more with each pet, like building a greeting. The loop body can hold any code.",
          files: { "index.js": l3 },
          highlight: 'console.log("Hello, " + pet + "!");',
        },
        {
          say: "Loops can add things up. Total starts at zero, and it's a let because it changes. On each lap we add the current score. After three laps, total is two forty seven.",
          files: { "index.js": l4 },
          highlight: "total = total + score;",
        },
        {
          say: "Another tool: includes. It asks whether an item is in the list. Does pets include Mochi? True. Does it include Rex? False. Spelling and capital letters must match exactly.",
          files: { "index.js": l5 },
          highlight: 'pets.includes("Mochi")',
        },
        {
          say: "Since includes gives true or false, it fits right into an if statement. If the pets include Mochi, print a message.",
          files: { "index.js": l6 },
          highlight: 'if (pets.includes("Mochi")) {',
        },
        {
          say: "Your turn. Here are the prices of three items. Use a loop to add them up, and print the total.",
          files: { "index.js": l7 },
          challenge: {
            task: `**Challenge:** under the comment, use a \`for...of\` loop to add up every number in \`prices\`.

1. Make a \`let\` variable called \`total\`, starting at \`0\`.
2. Loop over \`prices\`, adding each price to \`total\`.
3. Print \`Total: \` followed by the total. The console should show \`Total: 21\`.`,
            hints: [
              "Start with: let total = 0;",
              "for (const price of prices) { ... } and inside it add price to total.",
              'total = total + price; and at the end console.log("Total: " + total);',
            ],
            tests: [
              { name: "The console shows Total: 21", code: 'return logs.some((l) => l === "Total: 21");' },
              { name: "It uses a for...of loop", code: 'return /for\\s*\\(\\s*(const|let)\\s+\\w+\\s+of\\s+prices/.test(files()["index.js"]);' },
            ],
          },
        },
        {
          say: "Here's how I did it. A let for the total, a loop that adds each price, and a labelled print. Four plus ten plus seven is twenty one.",
          files: { "index.js": l8 },
          highlight: "total = total + price;",
        },
        { say: "Nicely done! A loop visits every item. Next, the most important array tool of the course: map." },
      ],
    },
    {
      kind: "practice",
      id: "m05-practice-loop",
      title: "Practice: loop and check a list",
      type: "build",
      task: `Use \`for...of\` loops and \`includes\` to fill in the page.

1. Loop over \`scores\`, adding each one to a \`let\` variable \`total\`. Put \`Total: \` followed by the total into the paragraph with the id \`total\`. It should say **Total: 307**.
2. Use \`players.includes("Grace")\` in an \`if\`. If she is in the list, put **Grace is playing** into the paragraph with the id \`result\`. Otherwise put **Grace is missing**.

Press **Run**, then **Check my code**.`,
      files: {
        "index.html": page('\n    <h1>Game night</h1>\n    <p id="total"></p>\n    <p id="result"></p>'),
        "index.js": L(
          "const scores = [90, 72, 85, 60];",
          'const players = ["Ada", "Alan", "Grace"];',
          "",
          "// 1. Add up the scores with a for...of loop and show the total",
          "",
          "// 2. Check whether Grace is playing and show the result"
        ),
      },
      solution: {
        "index.js": L(
          "const scores = [90, 72, 85, 60];",
          'const players = ["Ada", "Alan", "Grace"];',
          "",
          "let total = 0;",
          "for (const score of scores) {",
          "  total = total + score;",
          "}",
          'document.querySelector("#total").textContent = "Total: " + total;',
          "",
          'const result = document.querySelector("#result");',
          'if (players.includes("Grace")) {',
          '  result.textContent = "Grace is playing";',
          "} else {",
          '  result.textContent = "Grace is missing";',
          "}"
        ),
      },
      hints: [
        "Start with let total = 0; then for (const score of scores) { total = total + score; }",
        'Show it with document.querySelector("#total").textContent = "Total: " + total;',
        'For the second part, write if (players.includes("Grace")) { ... } else { ... } and set the textContent of #result in each branch.',
      ],
      tests: [
        { name: "The page shows Total: 307", code: 'return text("#total") === "Total: 307";' },
        { name: "The page shows Grace is playing", code: 'return text("#result") === "Grace is playing";' },
        { name: "It uses a for...of loop and includes", code: 'const src = files()["index.js"]; return /for\\s*\\(\\s*(const|let)\\s+\\w+\\s+of\\s/.test(src) && /\\.includes\\(/.test(src);' },
      ],
    },
    {
      kind: "scrim",
      id: "m05-map-filter-find",
      title: "map, filter and find",
      notes: `## map: change every item

\`\`\`js
const numbers = [1, 2, 3];
const doubled = numbers.map((n) => n * 2); // [2, 4, 6]
\`\`\`

- \`map\` takes a **function**. It calls it once for each item.
- Whatever the function **returns** becomes the new item.
- You get a **new array** of the same length. The original is unchanged.

Remember arrow functions: with curly braces you must write \`return\`.

\`\`\`js
numbers.map((n) => { n * 2 });         // [undefined, undefined, undefined]
numbers.map((n) => { return n * 2 });  // [2, 4, 6]
\`\`\`

## map builds lists for the page

\`\`\`js
const items = fruits.map((fruit) => "<li>" + fruit + "</li>");
list.innerHTML = items.join("");
\`\`\`

\`join("")\` glues an array of strings into one string. In React you will use \`map\` to turn a list of data into a list of elements, in exactly this shape.

## filter: keep some items

\`\`\`js
[5, 12, 8, 20].filter((n) => n > 10); // [12, 20]
\`\`\`

The function answers true or false. Items with \`true\` stay. You get a new, possibly shorter, array.

## find: get the first match

\`\`\`js
[5, 12, 8, 20].find((n) => n > 10); // 12
\`\`\`

Gives one item (not an array), or \`undefined\` if nothing matches.`,
      files: { "index.html": page('\n    <h1>Shopping list</h1>\n    <ul id="list"></ul>'), "index.js": "" },
      steps: [
        { say: "Welcome to the most important lesson of this module. Very often we have a list and want a new list made from it. Prices turned into prices with tax. Names turned into greetings. In React, data turned into things on the page." },
        {
          say: "With what we know, we do it by hand. Make an empty array. Loop over the numbers. Push each number doubled into the new array. It works, but it's a lot of steps for such a common job.",
          files: { "index.js": m1 },
          open: "index.js",
          highlight: "doubled.push(n * 2);",
        },
        {
          say: "JavaScript has a shortcut called map. Numbers dot map, then round brackets, and inside them a function. Here it's an arrow function: take n, return n times two. One line, same result.",
          files: { "index.js": m2 },
          highlight: "numbers.map((n) => n * 2)",
        },
        {
          say: "Here's how map thinks. It takes each item of the list, hands it to our function as n, and collects whatever the function returns into a brand new array. Like a machine on a conveyor belt that changes every item that passes.",
          highlight: "(n) => n * 2",
        },
        {
          say: "Map never changes the original. Look at the console. Numbers is still one, two, three. We get a new array alongside it.",
          files: { "index.js": m3 },
          highlight: "console.log(numbers);",
        },
        {
          say: "Map works on any kind of item. With names, our function returns a greeting for each one. Three names go in, three greetings come out.",
          files: { "index.js": m4 },
          highlight: 'names.map((name) => "Hello, " + name + "!")',
        },
        {
          say: "Now remember the arrow function trap from module three. If we use curly braces but forget return, each item turns into undefined. The console shows three undefined values. A very common slip.",
          files: { "index.js": m5 },
          highlight: "n * 2;",
        },
        {
          say: "With curly braces, we must write return. Or we could drop the braces and the word return, like before. Either way works. Now the console shows two, four, six.",
          files: { "index.js": m6 },
          highlight: "return n * 2;",
        },
        {
          say: "Here's where this is heading. We map each fruit into a bit of H T M L text: an li tag around the fruit. The console shows an array of three strings.",
          files: { "index.js": m7 },
          highlight: '"<li>" + fruit + "</li>"',
        },
        {
          say: "Join with empty quotes glues those pieces into one long string. Setting inner H T M L puts it on the page. Look at the preview: a real list! In React, you'll map data into elements in this same way.",
          files: { "index.js": m8 },
          highlight: 'document.querySelector("#list").innerHTML = items.join("");',
        },
        {
          say: "A sibling of map is filter. It keeps only the items that pass a test. Our function answers true or false: is n greater than ten? Twelve and twenty stay. The result is a new, shorter array.",
          files: { "index.js": m9 },
          highlight: "numbers.filter((n) => n > 10)",
        },
        {
          say: "And find returns only the first item that passes the test. That's twelve, a single value, not an array. If nothing passes, find gives undefined.",
          files: { "index.js": m10 },
          highlight: "numbers.find((n) => n > 10)",
        },
        {
          say: "Your turn! Here's a list of prices. Use map to make a new list with five taken off each price. Then use filter to keep only the prices over ten.",
          files: { "index.js": m11 },
          challenge: {
            task: `**Challenge:** under the comment, using the \`prices\` array:

1. Use **map** to make \`discounted\`: every price minus \`5\`. Print it. You should see \`[5, 15, 25]\`.
2. Use **filter** to make \`expensive\`: only prices **greater than 10**. Print it. You should see \`[20, 30]\`.

Remember: an arrow function with no curly braces returns automatically.`,
            hints: [
              "const discounted = prices.map((price) => price - 5);",
              "const expensive = prices.filter((price) => price > 10);",
              "Then console.log(discounted); and console.log(expensive);",
            ],
            tests: [
              { name: "map made [5, 15, 25]", code: 'return logs.some((l) => l.replace(/\\s/g, "") === "[5,15,25]");' },
              { name: "filter made [20, 30]", code: 'return logs.some((l) => l.replace(/\\s/g, "") === "[20,30]");' },
              { name: "It uses map and filter", code: 'const src = files()["index.js"]; return /\\.map\\(/.test(src) && /\\.filter\\(/.test(src);' },
            ],
          },
        },
        {
          say: "Here's how I did it. Map subtracts five from every price, and filter keeps the ones above ten. The original prices array is untouched.",
          files: { "index.js": m12 },
          highlight: "prices.map((price) => price - 5)",
        },
        { say: "Fantastic work! Map changes every item, filter keeps some, find gets the first match. Map especially will be your best friend in React. Time to practice!" },
      ],
    },
    {
      kind: "practice",
      id: "m05-practice-fix",
      title: "Practice: fix the list code",
      type: "fix",
      task: `The console should print:

\`\`\`
Grace
Ada! Alan! Grace!
\`\`\`

But right now it prints something else. There are **two** bugs:

1. The first line should print the **last** name in the list.
2. The second line should shout every name by adding \`!\`.

Press **Run**, read what the console says, then fix the code and **Check my code**.`,
      files: {
        "index.html": page(),
        "index.js": L(
          'const names = ["Ada", "Alan", "Grace"];',
          "",
          "console.log(names[names.length]);",
          "",
          "const shouted = names.map((name) => {",
          '  name + "!";',
          "});",
          'console.log(shouted.join(" "));'
        ),
      },
      solution: {
        "index.js": L(
          'const names = ["Ada", "Alan", "Grace"];',
          "",
          "console.log(names[names.length - 1]);",
          "",
          "const shouted = names.map((name) => {",
          '  return name + "!";',
          "});",
          'console.log(shouted.join(" "));'
        ),
      },
      hints: [
        "The first line prints undefined. Remember that counting starts at zero, so the last shelf is not at names.length.",
        "The last item is at names.length - 1.",
        "In the map, the function uses curly braces, so it needs the word return before name + \"!\". (Removing the braces and return also works.)",
      ],
      tests: [
        { name: "The first line prints Grace", code: 'return logs[0] === "Grace";' },
        { name: "The second line prints Ada! Alan! Grace!", code: 'return logs[1] === "Ada! Alan! Grace!";' },
      ],
    },
    {
      kind: "practice",
      id: "m05-practice-build",
      title: "Practice: build a to-do list page",
      type: "build",
      task: `Turn an array into a list on the page.

1. \`push\` a new to-do, \`"Celebrate"\`, onto the end of \`todos\`.
2. Use **map** to turn each to-do into an \`<li>\` string (like \`"<li>" + todo + "</li>"\`), then \`join("")\` them and set the \`innerHTML\` of the list with the id \`todo-list\`.
3. Put the number of tasks into the paragraph with the id \`count\`, like \`4 tasks\`. Use \`todos.length\`.

The page should show **four** list items and the text **4 tasks**.

Press **Run**, then **Check my code**.`,
      files: {
        "index.html": page('\n    <h1>My to-dos</h1>\n    <ul id="todo-list"></ul>\n    <p id="count"></p>'),
        "index.js": L(
          'const todos = ["Learn arrays", "Write a function", "Build an app"];',
          "",
          '// 1. Add "Celebrate" to the end of todos with push',
          "",
          "// 2. Use map and join to fill the list with <li> items",
          "",
          "// 3. Show how many tasks there are in the paragraph"
        ),
      },
      solution: {
        "index.js": L(
          'const todos = ["Learn arrays", "Write a function", "Build an app"];',
          "",
          'todos.push("Celebrate");',
          "",
          'const items = todos.map((todo) => "<li>" + todo + "</li>");',
          'document.querySelector("#todo-list").innerHTML = items.join("");',
          "",
          'document.querySelector("#count").textContent = todos.length + " tasks";'
        ),
      },
      hints: [
        'Start with todos.push("Celebrate"); It adds to the end of the array.',
        'const items = todos.map((todo) => "<li>" + todo + "</li>"); then set the list\'s innerHTML to items.join("").',
        'For the count: document.querySelector("#count").textContent = todos.length + " tasks";',
      ],
      tests: [
        { name: "The list shows four items", code: 'return $$("#todo-list li").length === 4;' },
        { name: "The last item is Celebrate", code: 'const items = $$("#todo-list li"); return items.length > 0 && items[items.length - 1].textContent.trim() === "Celebrate";' },
        { name: 'The paragraph says "4 tasks"', code: 'return text("#count") === "4 tasks";' },
        { name: "It uses map and push", code: 'const src = files()["index.js"]; return /\\.map\\(/.test(src) && /\\.push\\(/.test(src);' },
      ],
    },
    {
      kind: "quiz",
      id: "m05-quiz",
      title: "Quick check: arrays",
      questions: [
        {
          q: "What does this print?",
          code: 'const letters = ["a", "b", "c"];\nconsole.log(letters[1], letters.length);',
          options: ["a 3", "b 3", "b 2", "c 3"],
          answer: 1,
          explain: "Counting starts at zero, so index 1 is the second item, b. And length counts all the items: 3.",
        },
        {
          q: "What happens here?",
          code: "const nums = [1, 2];\nnums.push(3);\nconsole.log(nums.length);",
          options: [
            "It prints 3",
            "It prints 2",
            "Error: Assignment to constant variable",
            "It prints undefined",
          ],
          answer: 0,
          explain: "A const array can still change its contents. push adds 3 to the end, so the length is 3. Only replacing the whole array (nums = []) would be an error.",
        },
        {
          q: "What does this print?",
          code: "const result = [1, 2, 3].map((n) => n * 10);\nconsole.log(result);",
          options: ["[1, 2, 3]", "[10, 20, 30]", "60", "[10]"],
          answer: 1,
          explain: "map calls the function on every item and collects the returned values into a new array: 10, 20 and 30.",
        },
        {
          q: "What does this print?",
          code: "const big = [1, 2, 3, 4].filter((n) => n > 2);\nconsole.log(big);",
          options: ["[1, 2]", "[3, 4]", "[true, true]", "3"],
          answer: 1,
          explain: "filter keeps only the items where the function returns true. 3 and 4 are greater than 2, so the new array is [3, 4].",
        },
        {
          q: "What goes wrong here?",
          code: "const result = [1, 2, 3].map((n) => {\n  n + 1;\n});\nconsole.log(result);",
          options: [
            "It prints [2, 3, 4]",
            "It prints [undefined, undefined, undefined]",
            "Error: n is not defined",
            "It prints [1, 2, 3]",
          ],
          answer: 1,
          explain: "The arrow function has curly braces but no return, so it hands back nothing for every item. Write return n + 1; or drop the braces: (n) => n + 1.",
        },
        {
          q: "What does this print?",
          code: 'const a = ["x"];\nconst b = a;\nb.push("y");\nconsole.log(a.length);',
          options: ["1", "2", "0", "An error"],
          answer: 1,
          explain: "b is not a copy, it is a second label on the same list. Pushing through b changes the list that a also points to, so the length is 2.",
        },
      ],
    },
  ],
};
