// Module 2: values and variables (plain JavaScript, console + a little DOM).
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

// ---- scrim 1: values ----
const v1 = L('console.log("Hello, Sam!");');
const v2 = v1 + L("console.log(42);");
const v3 = v2 + L("console.log(3.5);");
const v4 = v3 + L("console.log(true);", "console.log(false);");
const v5 = v4 + L("console.log(Hello);");
const v6 = v4 + L('console.log("Hello");');
const v7 = L('console.log(typeof "Hello");', "console.log(typeof 42);", "console.log(typeof true);");
const v8 = L("// Your turn below");
const v9 = v8 + L('console.log("Sam");', "console.log(28);", "console.log(true);");

// ---- scrim 2: variables ----
const b1 = L('const petName = "Biscuit";');
const b2 = b1 + L("console.log(petName);");
const b3 = b2 + L('console.log("petName");');
const b4 = L('const petName = "Biscuit";', "const petAge = 3;", "console.log(petName, petAge);");
const b5 = L(
  'const heading = document.querySelector("h1");',
  "",
  'const petName = "Biscuit";',
  "const petAge = 3;",
  "console.log(petName, petAge);",
  "heading.textContent = petName;"
);
const b6 = b5.replace('"Biscuit"', '"Pepper"');
const b7 = b6 + L("", "petAge = 4;", "console.log(petAge);");
const b8 = b7.replace("const petAge", "let petAge");
const b9 = L("// Your turn below");
const b10 = b9 + L('const playerName = "Mia";', "let score = 0;", "score = 10;", "console.log(playerName, score);");

// ---- scrim 3: math, joining, naming ----
const m1 = L("console.log(2 + 3);", "console.log(10 - 4);");
const m2 = m1 + L("console.log(6 * 7);", "console.log(20 / 4);");
const m3 = L("const price = 4;", "const quantity = 3;", "const total = price * quantity;", "console.log(total);");
const m4 = m3 + L("console.log(2 + 3 * 4);", "console.log((2 + 3) * 4);");
const m5 = L('const firstName = "Ada";', 'const lastName = "Lovelace";', 'console.log(firstName + " " + lastName);');
const m6 = m5 + L("const total = 12;", 'console.log("Total: " + total);');
const m7 = m6 + L('console.log("2" + 2);');
const m8 = L('const favoriteColor = "blue";', "console.log(favoritecolor);");
const m9 = L('const favoriteColor = "blue";', "console.log(favoriteColor);", "console.log(typeof favoriteColor);");
const m10 = L("// Your turn below");
const m11 = m10 + L("const coffeePrice = 3;", "const muffinPrice = 2;", "const total = coffeePrice + muffinPrice;", 'console.log("Total: " + total);');

export default {
  id: "m02",
  title: "Values and variables",
  summary: "Meet strings, numbers and booleans, give values names with const and let, do some math, and learn to read your first error messages.",
  lessons: [
    {
      kind: "scrim",
      id: "m02-values",
      title: "Values: text, numbers and true or false",
      notes: `## A value is a piece of information

Every program works with **values**. The three kinds you meet first:

- **String**: text, always inside quotes. \`"Hello, Sam!"\`
- **Number**: no quotes. \`42\` or \`3.5\` (a dot for decimals, never a comma).
- **Boolean**: only two possibilities, \`true\` or \`false\`. No quotes.

\`\`\`js
console.log("Hello, Sam!");
console.log(42);
console.log(true);
console.log(typeof "Hello"); // string
\`\`\`

- \`console.log(...)\` prints a value in the console.
- \`typeof\` tells you what kind a value is: \`string\`, \`number\` or \`boolean\`.
- A line starting with two slashes (\`//\`) is a **comment**. JavaScript ignores it. It is a note for humans.

## Common mistake

\`\`\`js
console.log(Hello);
\`\`\`

Without quotes, JavaScript thinks \`Hello\` is a *name*, not text. You get **"Hello is not defined"**. The fix: put quotes around text.

Errors are clues, not failures. Read the message, it usually tells you what to look for.`,
      files: { "index.html": page(), "index.js": "" },
      steps: [
        { say: "Welcome back! Today we meet values. A value is a piece of information that your program can use, like a name, a price, or a yes or no answer." },
        {
          say: "The first kind of value is text. Programmers call it a string, because it's a string of letters in a row. Strings always go inside quotes. Watch the console.",
          files: { "index.js": v1 },
          open: "index.js",
          highlight: '"Hello, Sam!"',
        },
        {
          say: "The second kind is a number. Numbers have no quotes at all. Forty two, typed as digits.",
          files: { "index.js": v2 },
          highlight: "console.log(42);",
        },
        {
          say: "Numbers can have a decimal part too. We write a dot, like three point five. Never a comma, because commas mean something else in code.",
          files: { "index.js": v3 },
          highlight: "console.log(3.5);",
        },
        {
          say: "The third kind is a boolean. It has only two possible values, true and false, like a light switch that is on or off. No quotes here either.",
          files: { "index.js": v4 },
          highlight: "console.log(true);",
        },
        {
          say: "Now let's make a mistake on purpose. I'll print the word Hello but forget the quotes. Look at the console.",
          files: { "index.js": v5 },
          highlight: "console.log(Hello);",
        },
        {
          say: "The console says: Hello is not defined. Without quotes, JavaScript thinks Hello is the name of something, and it can't find anything with that name. This is a clue, not a failure. Quotes fix it.",
          files: { "index.js": v6 },
          highlight: 'console.log("Hello");',
        },
        {
          say: "Here's a handy word: typeof. It asks a value what kind it is. Typeof of Hello says string. Typeof forty two says number. And true says boolean.",
          files: { "index.js": v7 },
          highlight: 'console.log(typeof "Hello");',
        },
        {
          say: "I cleared the editor. The line starting with two slashes is a comment. JavaScript ignores it. It's a note for people. Now it's your turn to print one of each kind of value.",
          files: { "index.js": v8 },
          challenge: {
            task: `**Challenge:** under the comment, print three things, each with its own \`console.log\`:

1. Your first name, as a **string** (in quotes).
2. Your age, as a **number** (no quotes).
3. \`true\` or \`false\`, as a **boolean** (no quotes), for whether you like pizza.

Press **Run** and look at the console.`,
            hints: [
              "Each line looks like console.log( something );",
              'The string needs quotes, like console.log("Sam");',
              "The number and the boolean must not have quotes. Try console.log(28); and console.log(true);",
            ],
            tests: [
              { name: "Three things are printed", code: "return logs.length >= 3;" },
              { name: "One of them is a number", code: "return logs.some((l) => /^-?\\d+(\\.\\d+)?$/.test(l));" },
              { name: "One of them is true or false", code: 'return logs.some((l) => l === "true" || l === "false");' },
              { name: "One of them is text in quotes in the code", code: 'return /console\\.log\\(\\s*["\'][^"\']+["\']\\s*\\)/.test(files()["index.js"]);' },
            ],
          },
        },
        {
          say: "Here's how I did it. A name in quotes, an age with no quotes, and true with no quotes. Yours will have your own name and age, and that's perfect.",
          files: { "index.js": v9 },
          highlight: "console.log(28);",
        },
        { say: "That's values! Strings are text in quotes, numbers have no quotes, and booleans are true or false. Next, we'll learn how to give values names so we can reuse them." },
      ],
    },
    {
      kind: "practice",
      id: "m02-practice-types",
      title: "Practice: strings, numbers and booleans",
      type: "fill",
      task: `Fill in each blank (\`___\`) so that the console prints, in order:

\`\`\`
Sam
12
true
number
\`\`\`

- \`userName\` holds the **text** Sam.
- \`age\` holds the **number** 12.
- \`isStudent\` holds the **boolean** true.
- The last blank is the name of the variable whose type we ask about.

Press **Run**, then **Check my code**.`,
      files: {
        "index.html": page(),
        "index.js": L(
          "const userName = ___;",
          "const age = ___;",
          "const isStudent = ___;",
          "",
          "console.log(userName);",
          "console.log(age);",
          "console.log(isStudent);",
          "console.log(typeof ___);"
        ),
      },
      solution: {
        "index.js": L(
          'const userName = "Sam";',
          "const age = 12;",
          "const isStudent = true;",
          "",
          "console.log(userName);",
          "console.log(age);",
          "console.log(isStudent);",
          "console.log(typeof age);"
        ),
      },
      hints: [
        "Text needs quotes. Numbers and booleans do not.",
        'The first three blanks are values: "Sam", 12 and true.',
        "The last blank is a variable name. Ask for the type of age, which should print number.",
      ],
      tests: [
        { name: "The console prints Sam, 12 and true", code: 'return logs[0] === "Sam" && logs[1] === "12" && logs[2] === "true";' },
        { name: "The last line prints number", code: 'return logs[3] === "number";' },
        { name: "Sam is text, so it has quotes", code: 'return /userName\\s*=\\s*["\'][^"\']*["\']/.test(files()["index.js"]);' },
      ],
    },
    {
      kind: "scrim",
      id: "m02-variables",
      title: "Variables: labelled boxes",
      notes: `## A variable is a labelled box

A **variable** is a name that holds a value, like a box with a label on it.

\`\`\`js
const petName = "Biscuit";
console.log(petName); // Biscuit
\`\`\`

- \`const\` says "make a new box". The name comes next, then \`=\`, then the value.
- Here \`=\` means **put this value into the box**. It is not a math "equals".
- Use the name **without quotes** to get the value back. \`console.log("petName")\` prints the word petName.
- Change the value in one place and every use of the name follows.

## const and let

- \`const\`: a box you fill once and never replace. Trying to change it gives **"Assignment to constant variable"**.
- \`let\`: a box whose value can be replaced later.

\`\`\`js
let score = 0;
score = 10; // no "let" the second time
\`\`\`

A good habit: start with \`const\`. Switch to \`let\` only when the value really has to change.

## Common mistakes

- Putting quotes around a variable name when you wanted its value.
- Writing \`let\` again when replacing a value. You only write \`let\` when you create the box.
- Changing a \`const\`.`,
      files: { "index.html": page('\n    <h1>Pet profile</h1>'), "index.js": "" },
      steps: [
        { say: "Last time we printed values straight away. But what if you need the same value in ten places? Typing it ten times is tiring. Enter variables." },
        { say: "Think of a variable as a labelled box. You put a value inside, and the label is the name you use to find it again. Let's make one." },
        {
          say: "Const means: make a new box. Then comes the label, pet name. Then an equals sign, which here means put this into the box. And then the value, Biscuit in quotes. The semicolon ends the line.",
          files: { "index.js": b1 },
          open: "index.js",
          highlight: 'const petName = "Biscuit";',
        },
        {
          say: "Now we can use the label to get the value back. Console dot log, then pet name, with no quotes. The console shows Biscuit.",
          files: { "index.js": b2 },
          highlight: "console.log(petName);",
        },
        {
          say: "Watch out for quotes. If I put quotes around pet name, JavaScript prints the actual word pet name, not what's in the box. No quotes means the box. Quotes mean plain text.",
          files: { "index.js": b3 },
          highlight: 'console.log("petName");',
        },
        {
          say: "Let me tidy up and add a second box, pet age, holding the number three. Console dot log can print several values at once, separated by commas. They appear with a space between.",
          files: { "index.js": b4 },
          highlight: "console.log(petName, petAge);",
        },
        {
          say: "Variables work with the page too. I'll find the heading, like in module one, and set its text to the pet's name. Look at the preview.",
          files: { "index.js": b5 },
          highlight: "heading.textContent = petName;",
        },
        {
          say: "Here's the magic. I change Biscuit to Pepper in one place only. The console and the heading both change. That's why variables are so useful.",
          files: { "index.js": b6 },
          highlight: 'const petName = "Pepper";',
        },
        {
          say: "Now another mistake on purpose. Pet age is a const, and I try to put a new value in the box. Read the red message in the console.",
          files: { "index.js": b7 },
          highlight: "petAge = 4;",
        },
        {
          say: "Assignment to constant variable. Assignment means putting a value in a box. Const boxes are sealed after the first time. If a value needs to change, we use let instead.",
          files: { "index.js": b8 },
          highlight: "let petAge = 3;",
        },
        { say: "Now it works. The console shows four, because the box was replaced. Notice there's no let on the second line. We only write let when we create the box. A good habit: start with const, and switch to let only when the value must change." },
        {
          say: "Time for you to try. I cleared the editor. Make your own boxes!",
          files: { "index.js": b9 },
          challenge: {
            task: `**Challenge:** under the comment:

1. Make a **const** called \`playerName\` holding any name (in quotes).
2. Make a **let** called \`score\` that starts at \`0\`.
3. Change \`score\` to \`10\`. Remember: no \`let\` when you replace it.
4. Print both with \`console.log(playerName, score)\`.

Press **Run**. The console should show your name and 10.`,
            hints: [
              'Start with: const playerName = "Mia";',
              "Next: let score = 0;",
              "Then score = 10; and finally console.log(playerName, score);",
            ],
            tests: [
              { name: "A const variable exists", code: 'return /const\\s+\\w+\\s*=/.test(files()["index.js"]);' },
              { name: "A let variable exists", code: 'return /let\\s+\\w+\\s*=/.test(files()["index.js"]);' },
              { name: "The console shows 10", code: 'return logs.some((l) => /\\b10\\b/.test(l));' },
            ],
          },
        },
        {
          say: "Here's how I did it. A const for the name, a let for the score, a new value for the score, and one console dot log. If you picked different names, that's fine.",
          files: { "index.js": b10 },
          highlight: "score = 10;",
        },
        { say: "Great work! Variables are labelled boxes. Const for values that stay, let for values that change. Next up: math and joining text." },
      ],
    },
    {
      kind: "practice",
      id: "m02-practice-fill",
      title: "Practice: fill in the boxes",
      type: "fill",
      task: `Fill in each blank (\`___\`) so that the console prints:

\`\`\`
Hello, Lena!
Visits: 1
\`\`\`

- \`greeting\` should hold the text **Hello**.
- \`visits\` should start at the number **0**, then go up by **1**.
- The last blank is the name of the variable to print.

Press **Run**, then **Check my code**.`,
      files: {
        "index.html": page(),
        "index.js": L(
          "const greeting = ___;",
          "const friend = \"Lena\";",
          "let visits = ___;",
          "",
          "visits = visits + ___;",
          "",
          'console.log(greeting + ", " + friend + "!");',
          'console.log("Visits: " + ___);'
        ),
      },
      solution: {
        "index.js": L(
          'const greeting = "Hello";',
          'const friend = "Lena";',
          "let visits = 0;",
          "",
          "visits = visits + 1;",
          "",
          'console.log(greeting + ", " + friend + "!");',
          'console.log("Visits: " + visits);'
        ),
      },
      hints: [
        "The first blank is text, so it needs quotes. The second blank is a number, so it does not.",
        "The third blank is how much to add to visits. The last blank is the name of the box that holds the count.",
        'The answers, in order: "Hello", 0, 1, visits.',
      ],
      tests: [
        { name: 'The console prints "Hello, Lena!"', code: 'return logs.some((l) => l === "Hello, Lena!");' },
        { name: 'The console prints "Visits: 1"', code: 'return logs.some((l) => l === "Visits: 1");' },
      ],
    },
    {
      kind: "scrim",
      id: "m02-math-and-names",
      title: "Math, joining text and naming things",
      notes: `## Math

\`\`\`js
console.log(2 + 3);   // 5  (add)
console.log(10 - 4);  // 6  (subtract)
console.log(6 * 7);   // 42 (multiply, the star)
console.log(20 / 4);  // 5  (divide, the slash)
\`\`\`

Multiplying and dividing happen before adding and subtracting, like in school. Use round brackets to choose the order: \`(2 + 3) * 4\` is 20.

\`\`\`js
const price = 4;
const quantity = 3;
const total = price * quantity; // 12
\`\`\`

## Joining text

The \`+\` sign **joins** strings: \`"Ada" + " " + "Lovelace"\` is \`"Ada Lovelace"\`.
If one side is text, the other side is turned into text and joined too: \`"Total: " + 12\` is \`"Total: 12"\`, and \`"2" + 2\` is \`"22"\`.

## Naming variables

- Use letters and numbers. No spaces or dashes. Do not start with a number.
- Use **camelCase**: start small, capital letter for each new word. \`favoriteColor\`, \`totalPrice\`.
- Names are **case-sensitive**: \`favoriteColor\` and \`favoritecolor\` are different names.

## Common mistake

A typo gives **"favoritecolor is not defined"**. Compare the spelling and the capital letters with where you created the variable.`,
      files: { "index.html": page(), "index.js": "" },
      steps: [
        { say: "Computers are great at math. Let's see how JavaScript writes it, and then we'll learn how to join pieces of text together." },
        {
          say: "Plus adds, and minus subtracts. Two plus three prints five. Ten minus four prints six.",
          files: { "index.js": m1 },
          open: "index.js",
          highlight: "console.log(2 + 3);",
        },
        {
          say: "For multiplying we use a star, so six star seven is forty two. For dividing we use a slash, so twenty slash four is five.",
          files: { "index.js": m2 },
          highlight: "console.log(6 * 7);",
        },
        {
          say: "Math works with variables. Say each item costs four, and we buy three. Total equals price times quantity. The result is saved in a new box called total. The console prints twelve.",
          files: { "index.js": m3 },
          highlight: "const total = price * quantity;",
        },
        {
          say: "Order matters. Two plus three times four gives fourteen, because multiplying goes first. With round brackets around two plus three, we get twenty. Brackets let you choose.",
          files: { "index.js": m4 },
          highlight: "console.log((2 + 3) * 4);",
        },
        {
          say: "The plus sign also joins text. Here are two strings, a first name and a last name. We join them with a plus, and put a space in quotes in the middle. It prints Ada Lovelace.",
          files: { "index.js": m5 },
          highlight: 'console.log(firstName + " " + lastName);',
        },
        {
          say: "You can join text and a number too. The text Total, colon, space, plus the number twelve, becomes the text Total colon twelve. This is a great way to label what you print.",
          files: { "index.js": m6 },
          highlight: 'console.log("Total: " + total);',
        },
        {
          say: "Careful, there's a surprise. The text two, plus the number two, doesn't give four. It gives twenty two, because when one side is text, plus joins instead of adding. Quotes turn numbers into text.",
          files: { "index.js": m7 },
          highlight: 'console.log("2" + 2);',
        },
        {
          say: "Now, naming. Names can't have spaces, so programmers write them in camel case: start small, then a capital letter for each new word, like favorite color. It looks like a camel's humps.",
          files: { "index.js": L('const favoriteColor = "blue";', "console.log(favoriteColor);") },
          highlight: 'const favoriteColor = "blue";',
        },
        {
          say: "Names are also case sensitive. Here I print favorite color with a small c. Read the console: favoritecolor is not defined. JavaScript sees a different name. A typo is a very common error.",
          files: { "index.js": m8 },
          highlight: "console.log(favoritecolor);",
        },
        {
          say: "Fix the capital letter and it works. Let's also check the type of the variable. Typeof works on variables too, and prints string.",
          files: { "index.js": m9 },
          highlight: "console.log(typeof favoriteColor);",
        },
        {
          say: "Your turn! A coffee costs three, and a muffin costs two. Can you work out the total and print it with a label?",
          files: { "index.js": m10 },
          challenge: {
            task: `**Challenge:** under the comment:

1. Make a variable for the coffee price (\`3\`) and one for the muffin price (\`2\`).
2. Make a variable \`total\` that adds them together.
3. Print it with a label, using \`+\`: the console should show \`Total: 5\`.

Use **camelCase** names, like \`coffeePrice\`.`,
            hints: [
              "Start with const coffeePrice = 3; and const muffinPrice = 2;",
              "const total = coffeePrice + muffinPrice;",
              'console.log("Total: " + total);',
            ],
            tests: [
              { name: "There are variables for the prices", code: 'return (files()["index.js"].match(/const\\s+\\w+\\s*=/g) || []).length >= 2;' },
              { name: "The console shows Total: 5", code: 'return logs.some((l) => l.includes("Total") && l.includes("5"));' },
            ],
          },
        },
        {
          say: "Here's how I did it. Two price variables, a total that adds them, and a labelled print. Your names might differ, and that's fine, as long as it says Total five.",
          files: { "index.js": m11 },
          highlight: "const total = coffeePrice + muffinPrice;",
        },
        { say: "Wonderful. You can now do math, join text, name things carefully, and read a not defined error. Time to practice!" },
      ],
    },
    {
      kind: "practice",
      id: "m02-practice-fix",
      title: "Practice: fix the errors",
      type: "fix",
      task: `This page should show **Biscuit is 4** in the heading, but the console shows red errors.

Read each error message, find the clue, and fix the code. There are **two** bugs. You might find the second one only after fixing the first, and that's completely normal.

Press **Run**, then **Check my code**.`,
      files: {
        "index.html": page("\n    <h1>Loading...</h1>"),
        "index.js": L(
          'const heading = document.querySelector("h1");',
          "",
          'const petName = "Biscuit";',
          "const petAge = 3;",
          "",
          "petAge = petAge + 1;",
          'heading.textContent = petname + " is " + petAge;'
        ),
      },
      solution: {
        "index.js": L(
          'const heading = document.querySelector("h1");',
          "",
          'const petName = "Biscuit";',
          "let petAge = 3;",
          "",
          "petAge = petAge + 1;",
          'heading.textContent = petName + " is " + petAge;'
        ),
      },
      hints: [
        'The first error says "Assignment to constant variable". Which box are we trying to change after creating it?',
        "A box that must change needs let instead of const.",
        "The second error is a typo: the name petname has a small n, but the box was created as petName. Names are case-sensitive.",
      ],
      tests: [
        { name: 'The heading says "Biscuit is 4"', code: 'return text("h1") === "Biscuit is 4";' },
        { name: "petAge uses let", code: 'return /let\\s+petAge/.test(files()["index.js"]);' },
      ],
    },
    {
      kind: "quiz",
      id: "m02-quiz",
      title: "Quick check: values and variables",
      questions: [
        {
          q: "What does this print?",
          code: 'console.log(typeof "42");',
          options: ["number", "string", "boolean", "42"],
          answer: 1,
          explain: "The 42 is inside quotes, so it is text, a string. Quotes turn anything into text, even digits.",
        },
        {
          q: "What does this print?",
          code: 'console.log("Score: " + 3 * 2);',
          options: ["Score: 6", "Score: 32", "Score: 3 * 2", "9"],
          answer: 0,
          explain: "Multiplying happens first, so 3 * 2 becomes 6. Then plus joins the text and the number, giving Score: 6.",
        },
        {
          q: "What goes wrong here?",
          code: "const lives = 3;\nlives = lives - 1;\nconsole.log(lives);",
          options: [
            "Nothing, it prints 2",
            "It prints 3",
            "Error: Assignment to constant variable",
            "Error: lives is not defined",
          ],
          answer: 2,
          explain: "A const box can't be replaced. Use let if the value needs to change: let lives = 3;",
        },
        {
          q: "Which line is the bug?",
          code: 'const userName = "Zed";\nconsole.log(username);',
          options: [
            'The first line, because "Zed" needs different quotes',
            "The second line, because username has a small n and the box is called userName",
            "Neither, the code works",
            "The first line, because it is missing let",
          ],
          answer: 1,
          explain: "Names are case-sensitive. username and userName are two different names, so the console says username is not defined.",
        },
        {
          q: "Which of these is a good variable name?",
          options: ["my score", "2ndPlace", "best-score", "bestScore"],
          answer: 3,
          explain: "Names can't contain spaces or dashes and can't start with a number. bestScore is written in camelCase.",
        },
        {
          q: "What does this print?",
          code: "let x = 1;\nx = x + 1;\nx = x * 5;\nconsole.log(x);",
          options: ["2", "5", "10", "6"],
          answer: 2,
          explain: "x starts at 1, becomes 2, then 2 times 5 is 10. Each line uses the value the previous line left in the box.",
        },
      ],
    },
  ],
};
