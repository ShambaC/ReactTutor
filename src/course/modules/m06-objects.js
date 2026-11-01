// Module 6: objects, template literals, destructuring, spread (see docs/AUTHORING.md).
// Code in single-quoted strings below needs no escaping for backticks or dollar-brace.
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

// ---- scrim 1 code, built up step by step ----
const petCode = 'const pet = {\n  name: "Biscuit",\n  age: 3,\n  isGood: true,\n};\n';
const s1a = petCode + "\nconsole.log(pet);\n";
const s1b = s1a + "console.log(pet.name);\n";
const s1c = s1b + 'console.log(pet["age"]);\n';
const s1d = s1c + '\nconst whatToShow = "isGood";\nconsole.log(pet[whatToShow]);\n';
const s1e = s1d + '\npet.age = 4;\npet.color = "brown";\nconsole.log(pet);\n';
const s1f = s1e + '\nconst book = {\n  title: "Dune",\n  pages: 412,\n};\nconsole.log(book.title);\nconsole.log(book.pages);\n';
const s1g = s1f + '\nconst owner = {\n  name: "Sam",\n  address: { city: "Leeds", street: "Elm Road" },\n};\nconsole.log(owner.address.city);\n';

// ---- scrim 2 code ----
const petsArray = 'const pets = [\n  { name: "Biscuit", species: "dog", age: 3 },\n  { name: "Mochi", species: "cat", age: 5 },\n  { name: "Pixel", species: "parrot", age: 2 },\n];\n';
const s2a = petsArray + "\nconsole.log(pets[0].name);\nconsole.log(pets.length);\n";
const s2b = s2a + "\nfor (const pet of pets) {\n  console.log(pet.name);\n}\n";
const s2c = s2b + '\nconst names = pets.map((pet) => pet.name);\nconst olderPets = pets.filter((pet) => pet.age > 2);\nconst mochi = pets.find((pet) => pet.name === "Mochi");\nconsole.log(names);\nconsole.log(olderPets.length);\nconsole.log(mochi.species);\n';
const loopPlus = petsArray + '\nfor (const pet of pets) {\n  console.log(pet.name + " is a " + pet.species + ", age " + pet.age);\n}\n';
const loopTemplate = petsArray + "\nfor (const pet of pets) {\n  console.log(`${pet.name} is a ${pet.species}, age ${pet.age}`);\n}\n";
const loopNext = petsArray + "\nfor (const pet of pets) {\n  console.log(`${pet.name} is a ${pet.species}, age ${pet.age}`);\n  console.log(`${pet.name} will be ${pet.age + 1} next year`);\n}\n";
const loopDone = loopNext + "\nfor (const pet of pets) {\n  console.log(`${pet.name} the ${pet.species} is ${pet.age} years old`);\n}\n";

// ---- scrim 3 code ----
const d1 = 'const pet = { name: "Biscuit", species: "dog", age: 3 };\n\nconst { name, age } = pet;\nconsole.log(name, age);\n';
const d2 = d1 + '\nconst user = { name: "Ada", city: "London", job: "Engineer" };\n';
const d3 = d2 + "const { city, job } = user;\nconsole.log(city);\nconsole.log(job);\n";
const d4 = d3 + '\nconst colors = ["red", "green", "blue"];\nconst [first, second] = colors;\nconsole.log(first, second);\n';
const sp1 = 'const cart = ["apple", "bread"];\nconst biggerCart = [...cart, "milk"];\n\nconsole.log(cart);\nconsole.log(biggerCart);\n';
const sp2 = sp1 + '\nconst pet = { name: "Biscuit", species: "dog", age: 3 };\nconst olderPet = { ...pet, age: 4 };\n\nconsole.log(pet.age);\nconsole.log(olderPet.age);\n';
const sp3 = sp2 + "\nfunction describe({ name, species }) {\n  return `${name} is a ${species}`;\n}\nconsole.log(describe(pet));\n";
const sp4 = sp3 + '\nconst todo = { text: "Buy milk", done: false };\n';
const sp5 = sp4 + "const finished = { ...todo, done: true };\nconsole.log(todo.done);\nconsole.log(finished.done);\n";
const sp6 = sp5 + '\nconst cat = "Mochi";\nconst years = 5;\nconst mochi = { cat, years };\nconsole.log(mochi);\n';

export default {
  id: "m06",
  title: "Objects and modern syntax",
  summary: "Group related facts into objects, build lists of objects, and learn the modern shortcuts React code uses everywhere: template literals, destructuring and spread.",
  lessons: [
    {
      kind: "scrim",
      id: "m06-objects",
      title: "Objects: labelled drawers",
      notes: `## Objects group related values

An **object** is a chest of labelled drawers. Each drawer has a **key** (the label) and a **value** (what is inside).

\`\`\`js
const pet = {
  name: "Biscuit",
  age: 3,
  isGood: true,
};
\`\`\`

- Curly braces wrap the whole object.
- Each line is \`key: value\`, followed by a comma.
- Values can be anything: text, numbers, booleans, arrays, even other objects.

## Reading values

\`\`\`js
pet.name;        // dot access: "Biscuit"
pet["age"];      // bracket access: 3
const key = "isGood";
pet[key];        // bracket access with a variable: true
\`\`\`

Use the **dot** when you know the key. Use **brackets** when the key is stored in a variable.

## Changing and adding

\`\`\`js
pet.age = 4;          // change a drawer
pet.color = "brown";  // add a new drawer
\`\`\`

\`const\` stops you pointing \`pet\` at a different object, but you can still change what is inside it.

## Nested objects

\`\`\`js
owner.address.city;
\`\`\`

Chain the dots, one per drawer you open.

**Common mistake:** keys are case sensitive. \`pet.Name\` is \`undefined\`, because the key is \`name\`.`,
      files: { "index.html": html, "index.js": "" },
      steps: [
        { say: "Welcome back! So far we've stored single values, and lists of values. But what about one thing with lots of details, like a pet? A pet has a name, an age, and more. For that, we use an object." },
        {
          say: "Think of an object as a chest of labelled drawers. Each drawer has a label, called a key, and something inside it, called a value. Watch me build one.",
          files: { "index.js": petCode },
          open: "index.js",
        },
        { say: "Curly braces wrap the whole object. Each line is a key, a colon, then the value, and a comma at the end. Name is the key, and Biscuit is the value.", highlight: 'name: "Biscuit",' },
        {
          say: "Let's print it. Console dot log, and the pet. The console shows all the drawers at once.",
          files: { "index.js": s1a },
          highlight: "console.log(pet);",
        },
        {
          say: "To open one drawer, write the object's name, a dot, and the key. Pet dot name gives us Biscuit. This is called dot access.",
          files: { "index.js": s1b },
          highlight: "console.log(pet.name);",
        },
        {
          say: "There's a second way: square brackets, with the key written as text in quotes. Same result, different style.",
          files: { "index.js": s1c },
          highlight: 'pet["age"]',
        },
        {
          say: "Brackets shine when the key is stored in a variable. Which drawer to open is decided by what's in the variable. Dot access can't do that.",
          files: { "index.js": s1d },
          highlight: "console.log(pet[whatToShow]);",
        },
        {
          say: "You can change a drawer, or add a new one, with an equals sign. Even though pet is a const, we can still change what's inside it. Const only stops us swapping in a different object.",
          files: { "index.js": s1e },
          highlight: 'pet.color = "brown";',
        },
        {
          say: "Your turn! Make a small object of your own, then open two of its drawers.",
          challenge: {
            task: `**Challenge:** at the bottom of your code, create an object called \`book\` with:

- a \`title\` of \`"Dune"\`
- \`pages\` of \`412\`

Then print the title and the pages with two \`console.log\` lines, using dot access.`,
            hints: [
              "Start with: const book = { ... }; Put one key and value on each line, with commas.",
              'Inside the braces: title: "Dune", then pages: 412, each followed by a comma.',
              "After the object, write console.log(book.title); and console.log(book.pages);",
            ],
            tests: [
              { name: "There is an object called book", code: 'return /book\\s*=\\s*\\{/.test(files()["index.js"]);' },
              { name: "The title Dune is printed", code: 'return logs.some((l) => l.trim() === "Dune");' },
              { name: "The page count 412 is printed", code: 'return logs.some((l) => l.trim() === "412");' },
            ],
          },
        },
        {
          say: "Here's how I did it. An object, two drawers, and two log lines. Yours might use different spacing, and that's fine!",
          files: { "index.js": s1f },
          highlight: "console.log(book.pages);",
        },
        {
          say: "A drawer can hold another object. Here an owner has an address, and the address has a city. To reach the city we chain dots: owner, address, city. One dot for each drawer we open.",
          files: { "index.js": s1g },
          highlight: "console.log(owner.address.city);",
        },
        { say: "That's objects! Keys are labels, values are contents, and dot or brackets read them. Next, we'll put many objects into an array. That's exactly how React shows lists of things." },
      ],
    },
    {
      kind: "practice",
      id: "m06-practice-objects",
      title: "Practice: open the drawers",
      type: "fill",
      task: `Fill in each blank (\`___\`) so the console prints:

1. \`Zara\`
2. \`7\`
3. \`shield\`
4. \`Zara is level 7\`

Use dot access, bracket access, and an array index. Then press **Run** and **Check my code**.`,
      files: {
        "index.html": html,
        "index.js": 'const player = {\n  name: "Zara",\n  level: 7,\n  items: ["sword", "shield"],\n};\n\nconsole.log(player.___);\nconsole.log(player["___"]);\nconsole.log(player.items[___]);\n\nconsole.log(player.name + " is level " + player.___);\n',
      },
      solution: {
        "index.js": 'const player = {\n  name: "Zara",\n  level: 7,\n  items: ["sword", "shield"],\n};\n\nconsole.log(player.name);\nconsole.log(player["level"]);\nconsole.log(player.items[1]);\n\nconsole.log(player.name + " is level " + player.level);\n',
      },
      hints: [
        "The first two blanks are keys: the labels on the drawers. Look at the object at the top.",
        "Arrays count from zero, and the shield is the second item. The last line joins pieces of text with a plus sign, and the blank is the key for the level.",
        "The answers in order are: name, level, 1, level.",
      ],
      tests: [
        { name: "Zara is printed", code: 'return logs.some((l) => l.trim() === "Zara");' },
        { name: "The level 7 is printed", code: 'return logs.some((l) => l.trim() === "7");' },
        { name: "shield is printed", code: 'return logs.some((l) => l.trim() === "shield");' },
        { name: "Zara is level 7 is printed", code: 'return logs.includes("Zara is level 7");' },
      ],
    },
    {
      kind: "scrim",
      id: "m06-lists-templates",
      title: "Lists of objects and template literals",
      notes: `## An array of objects

Real data is usually a **list of objects**: users, products, pets. React shows lists like this all the time.

\`\`\`js
const pets = [
  { name: "Biscuit", species: "dog", age: 3 },
  { name: "Mochi", species: "cat", age: 5 },
];

pets[0].name;   // pick an item, then a drawer: "Biscuit"
\`\`\`

All the array tools still work: \`for...of\`, \`map\`, \`filter\`, \`find\`.

\`\`\`js
const names = pets.map((pet) => pet.name);
const older = pets.filter((pet) => pet.age > 3);
\`\`\`

## Template literals

Backticks let you mix text and values. Put a value inside \`\${ }\`:

\`\`\`js
\`\${pet.name} is \${pet.age} years old\`
\`\`\`

- Use the **backtick** key (usually above Tab), not a quote mark.
- Anything inside \`\${ }\` is JavaScript, so \`\${pet.age + 1}\` works too.

**Common mistake:** writing \`\${...}\` inside normal quotes. It prints the symbols as plain text instead of the value.`,
      files: { "index.html": html, "index.js": "" },
      steps: [
        { say: "In React you'll constantly show lists: a list of users, a list of products. Every item is an object, and the list is an array. So today we mix the two: an array of objects." },
        {
          say: "Here are three pets. Square brackets on the outside, curly braces around each pet, and commas between them.",
          files: { "index.js": petsArray },
          open: "index.js",
          highlight: '{ name: "Mochi", species: "cat", age: 5 },',
        },
        {
          say: "To reach one detail, first pick the item with its index, then open the drawer. Pets, index zero, dot name, gives us Biscuit. And dot length still counts the pets.",
          files: { "index.js": s2a },
          highlight: "console.log(pets[0].name);",
        },
        {
          say: "Every array tool you know still works. Here's a for of loop that prints each pet's name.",
          files: { "index.js": s2b },
          highlight: "console.log(pet.name);",
        },
        {
          say: "Map turns each object into something else. Here, each pet becomes just its name. Filter keeps only the pets older than two. Find returns the first pet that matches.",
          files: { "index.js": s2c },
          highlight: 'pets.find((pet) => pet.name === "Mochi")',
        },
        {
          say: "Now let's print a sentence about each pet. We could glue pieces together with plus signs. It works, but it's fiddly. All those quotes and spaces are easy to get wrong.",
          files: { "index.js": loopPlus },
          highlight: 'pet.name + " is a " + pet.species + ", age " + pet.age',
        },
        {
          say: "Here's a nicer way: a template literal. Instead of quotes, we use backticks. The backtick key is usually above Tab. Inside, a dollar sign and curly braces make a hole where a value goes.",
          files: { "index.js": loopTemplate },
          highlight: "`${pet.name} is a ${pet.species}, age ${pet.age}`",
        },
        {
          say: "Anything inside the holes is JavaScript, so you can even do a little maths. Here we say how old each pet will be next year.",
          files: { "index.js": loopNext },
          highlight: "${pet.age + 1}",
        },
        {
          say: "Your turn! Write a new loop that prints a different sentence for each pet.",
          challenge: {
            task: `**Challenge:** add a new \`for...of\` loop that uses a **template literal** (backticks) to print one line per pet, like this:

\`\`\`
Mochi the cat is 5 years old
\`\`\`

Use the pet's \`name\`, \`species\` and \`age\`.`,
            hints: [
              "Copy the existing for...of loop, then change what is inside console.log.",
              "Use backticks, and put each value in a hole, like this: dollar sign, curly braces, pet.name.",
              "console.log(`${pet.name} the ${pet.species} is ${pet.age} years old`);",
            ],
            tests: [
              { name: "Biscuit's line is printed", code: 'return logs.includes("Biscuit the dog is 3 years old");' },
              { name: "Mochi's line is printed", code: 'return logs.includes("Mochi the cat is 5 years old");' },
              { name: "Pixel's line is printed", code: 'return logs.includes("Pixel the parrot is 2 years old");' },
            ],
          },
        },
        {
          say: "Here's mine. One loop, one template literal, and every pet gets a sentence. If your wording is a little different, that's fine.",
          files: { "index.js": loopDone },
          highlight: "${pet.name} the ${pet.species} is ${pet.age} years old",
        },
        { say: "One gotcha to remember. The dollar sign and curly braces only work inside backticks. In normal quotes they print as plain text. If you ever see dollar signs in your output, check your quotes." },
        { say: "So an array of objects holds a list, and template literals build sentences from it. In React you'll use exactly these two ideas to show lists on screen. Next: two shortcuts called destructuring and spread." },
      ],
    },
    {
      kind: "practice",
      id: "m06-practice-shop",
      title: "Practice: pet shop list",
      type: "build",
      task: `Here is a list of pets for sale. Write the code for these three jobs:

1. For every pet, print a line like \`Biscuit the dog costs 120 coins\` (use a template literal).
2. Make an array called \`cheapPets\` that only holds pets with a \`price\` under 150 (use \`filter\`). Print its \`length\`.
3. Find the pet called Pixel with \`find\` and print its \`species\`.`,
      files: {
        "index.html": html,
        "index.js": 'const pets = [\n  { name: "Biscuit", species: "dog", price: 120 },\n  { name: "Mochi", species: "cat", price: 90 },\n  { name: "Pixel", species: "parrot", price: 200 },\n];\n\n// 1. Print a line for every pet.\n\n// 2. Make cheapPets and print how many there are.\n\n// 3. Find Pixel and print the species.\n',
      },
      solution: {
        "index.js": 'const pets = [\n  { name: "Biscuit", species: "dog", price: 120 },\n  { name: "Mochi", species: "cat", price: 90 },\n  { name: "Pixel", species: "parrot", price: 200 },\n];\n\nfor (const pet of pets) {\n  console.log(`${pet.name} the ${pet.species} costs ${pet.price} coins`);\n}\n\nconst cheapPets = pets.filter((pet) => pet.price < 150);\nconsole.log(cheapPets.length);\n\nconst pixel = pets.find((pet) => pet.name === "Pixel");\nconsole.log(pixel.species);\n',
      },
      hints: [
        "Use a for...of loop for job 1, and backticks with holes inside console.log.",
        "Job 2: const cheapPets = pets.filter((pet) => pet.price < 150); then print cheapPets.length.",
        'Job 3: const pixel = pets.find((pet) => pet.name === "Pixel"); then console.log(pixel.species);',
      ],
      tests: [
        { name: "Each pet gets a line", code: 'return logs.includes("Biscuit the dog costs 120 coins") && logs.includes("Mochi the cat costs 90 coins") && logs.includes("Pixel the parrot costs 200 coins");' },
        { name: "cheapPets is made and has 2 pets", code: 'return /cheapPets/.test(files()["index.js"]) && logs.some((l) => l.trim() === "2");' },
        { name: "Pixel's species, parrot, is printed", code: 'return logs.some((l) => l.trim() === "parrot");' },
      ],
    },
    {
      kind: "scrim",
      id: "m06-destructure-spread",
      title: "Destructuring and spread",
      notes: `## Destructuring: unpack in one line

**Objects** (curly braces, names must match the keys):

\`\`\`js
const { name, age } = pet;   // same as name = pet.name, age = pet.age
\`\`\`

**Arrays** (square brackets, position matters, any names):

\`\`\`js
const [first, second] = colors;
\`\`\`

You can destructure in a function's parentheses too. React components receive their inputs this way:

\`\`\`js
function describe({ name, species }) { ... }
\`\`\`

## Spread: copy and extend

Three dots **spread** a collection's contents into a new one.

\`\`\`js
const bigger = [...cart, "milk"];     // new array
const older = { ...pet, age: 4 };     // new object; later keys win
\`\`\`

The originals are **not changed**. React expects you to make a fresh copy when data changes, never to edit it in place. You'll use spread for that constantly.

## Shorthand properties

\`\`\`js
const name = "Mochi";
const cat = { name };   // same as { name: name }
\`\`\``,
      files: { "index.html": html, "index.js": "" },
      steps: [
        { say: "Today: two small shortcuts you'll see in almost every React file. They look odd at first, but each one saves typing, and we'll go slowly." },
        {
          say: "Here's a pet, and the long way to pull two details into their own variables: name equals pet dot name, age equals pet dot age.",
          files: { "index.js": 'const pet = { name: "Biscuit", species: "dog", age: 3 };\n\nconst name = pet.name;\nconst age = pet.age;\nconsole.log(name, age);\n' },
          open: "index.js",
          highlight: "const name = pet.name;",
        },
        {
          say: "Destructuring does that in one line. Curly braces on the left of the equals sign, listing the drawers we want. JavaScript makes variables with the same names.",
          files: { "index.js": d1 },
          highlight: "const { name, age } = pet;",
        },
        {
          say: "Your turn! Use destructuring to pull out details from a user object.",
          files: { "index.js": d2 },
          challenge: {
            task: `**Challenge:** below the \`user\` object, use **destructuring** to pull out \`city\` and \`job\` in a single line. Then print each one with \`console.log\`.`,
            hints: [
              "The curly braces go on the left side of the equals sign.",
              "const { city, job } = user;",
              "After that, write console.log(city); and console.log(job);",
            ],
            tests: [
              { name: "city is destructured from user", code: 'return /const\\s*\\{[^}]*\\bcity\\b[^}]*\\}\\s*=\\s*user/.test(files()["index.js"]);' },
              { name: "job is destructured from user", code: 'return /const\\s*\\{[^}]*\\bjob\\b[^}]*\\}\\s*=\\s*user/.test(files()["index.js"]);' },
              { name: "London and Engineer are printed", code: 'return logs.some((l) => l.includes("London")) && logs.some((l) => l.includes("Engineer"));' },
            ],
          },
        },
        {
          say: "Here's mine. One line pulls out both, and then I print them. Notice I never wrote user dot after that.",
          files: { "index.js": d3 },
          highlight: "const { city, job } = user;",
        },
        {
          say: "Arrays can be destructured too, with square brackets. This time position matters, not names. The first item goes into the first variable, the second into the second. Pick any names you like.",
          files: { "index.js": d4 },
          highlight: "const [first, second] = colors;",
        },
        {
          say: "You'll meet this exact shape soon, when React's use state hands you a pair of things. Now the second shortcut: spread. It's three dots in a row.",
          files: { "index.js": sp1 },
          highlight: 'const biggerCart = [...cart, "milk"];',
        },
        { say: "The three dots spread the items out into a brand new array, then we add milk at the end. The original cart is untouched. React wants us to make a fresh copy when data changes, instead of editing the old one." },
        {
          say: "Spread works on objects too. Copy every drawer from pet, then write age again after it. Later keys win, so the copy has age four, and the original still says three.",
          files: { "index.js": sp2 },
          highlight: "const olderPet = { ...pet, age: 4 };",
        },
        {
          say: "One more place for destructuring: inside a function's round brackets. The function receives an object and picks out the drawers it needs. React components work like this, with an object called props.",
          files: { "index.js": sp3 },
          highlight: "function describe({ name, species }) {",
        },
        {
          say: "Your turn again. Make a changed copy of a to-do, without touching the original.",
          files: { "index.js": sp4 },
          challenge: {
            task: `**Challenge:** below the \`todo\`, make a new object called \`finished\` that is a **copy** of \`todo\` but with \`done\` set to \`true\`. Use the spread operator (\`...\`).

Print \`todo.done\` and \`finished.done\`. The original should still say \`false\`.`,
            hints: [
              "Start with: const finished = { ...todo };",
              "After the spread, write the key you want to change: done: true",
              "const finished = { ...todo, done: true }; then console.log(todo.done); and console.log(finished.done);",
            ],
            tests: [
              { name: "finished is made with the spread operator", code: 'return /\\.\\.\\.todo/.test(files()["index.js"]);' },
              { name: "finished.done is true", code: 'return logs.some((l) => l.trim() === "true");' },
              { name: "The original todo.done is still false", code: 'return logs.some((l) => l.trim() === "false");' },
            ],
          },
        },
        {
          say: "Here's how I did it. Spread copies everything, then done true overrides one drawer. Original safe, copy changed. This is the heart of how React updates data.",
          files: { "index.js": sp5 },
          highlight: "const finished = { ...todo, done: true };",
        },
        {
          say: "A tiny bonus: if a variable has the same name as the key, you can write the name just once. Cat, comma, years. That's called shorthand, and you'll see it often.",
          files: { "index.js": sp6 },
          highlight: "const mochi = { cat, years };",
        },
        { say: "Great work! Destructuring unpacks, spread copies and extends. They look strange at first, but after a few React lessons they'll feel like old friends." },
      ],
    },
    {
      kind: "practice",
      id: "m06-practice-copies",
      title: "Practice: make real copies",
      type: "fix",
      task: `The code below tries to make a changed **copy** of an object and of an array, but it changes the originals too! Run it and read the console.

It should print, in this order: \`light\`, \`2\`, \`dark\`, \`3\`.

Fix the two lines that make the copies. Hint: the answer uses three dots.`,
      files: {
        "index.html": html,
        "index.js": 'const settings = { theme: "light", fontSize: 14 };\nconst cart = ["apple", "bread"];\n\nconst darkSettings = settings;\ndarkSettings.theme = "dark";\n\nconst biggerCart = cart;\nbiggerCart.push("milk");\n\nconsole.log(settings.theme);\nconsole.log(cart.length);\nconsole.log(darkSettings.theme);\nconsole.log(biggerCart.length);\n',
      },
      solution: {
        "index.js": 'const settings = { theme: "light", fontSize: 14 };\nconst cart = ["apple", "bread"];\n\nconst darkSettings = { ...settings, theme: "dark" };\n\nconst biggerCart = [...cart, "milk"];\n\nconsole.log(settings.theme);\nconsole.log(cart.length);\nconsole.log(darkSettings.theme);\nconsole.log(biggerCart.length);\n',
      },
      hints: [
        "Writing const copy = original does not make a copy. Both names point at the very same object or array.",
        'For the object, copy the drawers with spread and then override one: { ...settings, theme: "dark" }.',
        'For the array: const biggerCart = [...cart, "milk"]; and remove the push line.',
      ],
      tests: [
        { name: "The original settings still say light", code: 'return logs[0] === "light";' },
        { name: "The original cart still has 2 items", code: 'return logs[1] === "2";' },
        { name: "The copies are changed: dark and 3", code: 'return logs[2] === "dark" && logs[3] === "3";' },
        { name: "The copies are made with spread", code: 'return /\\.\\.\\.settings/.test(files()["index.js"]) && /\\.\\.\\.cart/.test(files()["index.js"]);' },
      ],
    },
    {
      kind: "quiz",
      id: "m06-quiz",
      title: "Quick check: objects and modern syntax",
      questions: [
        {
          q: "What does this print?",
          code: 'const pet = { name: "Mochi", age: 5 };\nconsole.log(pet["age"]);',
          options: ["5", "age", "undefined", "Mochi"],
          answer: 0,
          explain: "Brackets with the key in quotes open the drawer labelled age, which holds 5. It is the same as `pet.age`.",
        },
        {
          q: "Spot the bug. Why does this print undefined?",
          code: 'const user = { name: "Ada" };\nconsole.log(user.Name);',
          options: ["Objects cannot be printed", "Keys are case sensitive, and the key is name, not Name", "user needs to be declared with let", "You must use brackets, never a dot"],
          answer: 1,
          explain: "Capital letters matter. There is no drawer labelled Name, so JavaScript gives you undefined. Use `user.name`.",
        },
        {
          q: "What does this print?",
          code: 'const n = "Sam";\nconsole.log("Hi ${n}");',
          options: ["Hi Sam", "Hi ${n}", "Hi n", "An error"],
          answer: 1,
          explain: "The holes only work inside backticks. In normal quotes, the dollar sign and braces are plain text. Use backticks to get `Hi Sam`.",
        },
        {
          q: "What does this print?",
          code: 'const [a, b] = ["x", "y", "z"];\nconsole.log(b);',
          options: ["x", "y", "z", "b"],
          answer: 1,
          explain: "Array destructuring goes by position. `a` gets the first item, `b` gets the second, which is y.",
        },
        {
          q: "What does this print?",
          code: "const a = { x: 1 };\nconst b = { ...a, x: 2 };\nconsole.log(a.x, b.x);",
          options: ["2 2", "1 1", "1 2", "2 1"],
          answer: 2,
          explain: "Spread copies a into a new object, then x: 2 replaces the copied x. The original object a is never changed, so it still has 1.",
        },
        {
          q: 'Which line makes a new array with "kiwi" added, and leaves fruits unchanged?',
          options: ['fruits.push("kiwi")', 'const more = [...fruits, "kiwi"];', "const more = fruits.kiwi;", 'fruits = "kiwi";'],
          answer: 1,
          explain: "Spread copies every item into a brand new array and then adds kiwi. `push` would change the original array.",
        },
      ],
    },
  ],
};
