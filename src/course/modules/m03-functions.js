// Module 3: functions (plain JavaScript, console + a little DOM).
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

// ---- scrim 1: declaring and calling ----
const a1 = L(
  'console.log("Hello, friend!");',
  'console.log("Welcome to the app.");',
  'console.log("Hello, friend!");',
  'console.log("Welcome to the app.");'
);
const a2 = L("function greet() {", '  console.log("Hello, friend!");', '  console.log("Welcome to the app.");', "}");
const a3 = a2 + L("", "greet();");
const a4 = a2 + L("", "greet();", "greet();", "greet();");
const a5 = a2 + L("", "greet();", "greet();", "greeet();");
const a6 = a4 + L("", "// Your turn below");
const a7 = a4 + L("", "function celebrate() {", '  console.log("Hooray!");', "}", "", "celebrate();", "celebrate();");

// ---- scrim 2: parameters and return ----
const p1 = L("function greet(name) {", '  console.log("Hello, " + name + "!");', "}", "", 'greet("Ada");');
const p2 = p1 + L('greet("Alan");', 'greet("Grace");');
const p3 = L(
  "function describePet(name, age) {",
  '  console.log(name + " is " + age + " years old.");',
  "}",
  "",
  'describePet("Biscuit", 3);'
);
const p4 = p3 + L('describePet("Biscuit");');
const p5 = L("function double(n) {", "  console.log(n * 2);", "}", "", "const result = double(5);", "console.log(result);");
const p6 = L("function double(n) {", "  return n * 2;", "}", "", "const result = double(5);", "console.log(result);");
const p7 = p6 + L("console.log(double(5) + double(2));");
const p8 = L(
  "function itemsCost(price, quantity) {",
  "  return price * quantity;",
  "}",
  "",
  "function orderTotal(price, quantity) {",
  "  const cost = itemsCost(price, quantity);",
  "  return cost + 5;",
  "}",
  "",
  'console.log("Order total: " + orderTotal(4, 3));'
);
const p9 = L("// Your turn below");
const p10 = p9 + L("function fullName(first, last) {", '  return first + " " + last;', "}", "", 'console.log(fullName("Ada", "Lovelace"));');

// ---- scrim 3: arrow functions ----
const r1 = L("function double(n) {", "  return n * 2;", "}", "", "console.log(double(4));");
const r2 = L("const double = (n) => {", "  return n * 2;", "};", "", "console.log(double(4));");
const r3 = L("const double = (n) => n * 2;", "", "console.log(double(4));");
const r4 = r3 + L("", "const triple = (n) => {", "  n * 3;", "};", "", "console.log(triple(4));");
const r5 = r3 + L("", "const triple = (n) => {", "  return n * 3;", "};", "", "console.log(triple(4));");
const r6 = r5 + L("", "const add = (a, b) => a + b;", 'const greet = () => "Hello!";', "", "console.log(add(2, 3));", "console.log(greet());");
const r7 = r6 + L(
  "",
  "const describe = (name, age) => {",
  '  const text = name + " is " + age;',
  "  return text;",
  "};",
  "",
  'console.log(describe("Ada", 36));'
);
const r8 = r7 + L("", "// Your turn below");
const r9 = r7 + L("", "const square = (n) => n * n;", 'const shout = (word) => word + "!";', "", "console.log(square(5));", 'console.log(shout("hey"));');

export default {
  id: "m03",
  title: "Functions",
  summary: "Write reusable recipes called functions: give them ingredients, get results back, and meet the arrow function you will see everywhere in React.",
  lessons: [
    {
      kind: "scrim",
      id: "m03-first-function",
      title: "Functions: recipes you can reuse",
      notes: `## A function is a recipe

A **function** is a named set of instructions. You write it once, then run it as many times as you like.

\`\`\`js
function greet() {
  console.log("Hello, friend!");
  console.log("Welcome to the app.");
}

greet();
greet();
\`\`\`

- **Declaring** (writing the recipe): the word \`function\`, a name, round brackets \`()\`, then curly braces \`{ }\` around the instructions.
- **Calling** (cooking the recipe): the name followed by round brackets, \`greet()\`.
- Declaring a function prints nothing by itself. It only runs when you call it.
- Each call runs the whole body again.

## Why functions?

Without them, you copy and paste the same lines over and over. With a function, you fix a mistake in one place and every call is fixed.

## Common mistakes

- Forgetting to call the function. The recipe exists, but nobody cooked it.
- Misspelling the name when calling. You get **"greeet is not defined"**. Compare the spelling.
- Forgetting the round brackets when calling: \`greet;\` does nothing, \`greet();\` runs it.`,
      files: { "index.html": page(), "index.js": "" },
      steps: [
        { say: "Welcome! Today's big idea is the function. Think of a function as a recipe card: a set of steps with a name, which you can follow whenever you like." },
        {
          say: "Here's a problem. We want to print a greeting, two lines, and do it twice. Without functions we copy and paste the same lines. That works, but imagine fifty copies!",
          files: { "index.js": a1 },
          open: "index.js",
        },
        {
          say: "Instead, let's write the recipe once. The word function, then a name, greet, then round brackets, then curly braces. Between the curly braces go the steps. I've cleared the repeats.",
          files: { "index.js": a2 },
          highlight: "function greet() {",
        },
        {
          say: "Look at the console. It's empty! Writing a recipe doesn't cook it. Programmers call this declaring a function. Nothing runs until we call it.",
        },
        {
          say: "To call it, we write its name followed by round brackets, and a semicolon. Greet, round brackets. Now the console shows both lines.",
          files: { "index.js": a3 },
          highlight: "greet();",
        },
        {
          say: "And here's the power. Call it three times, and the greeting prints three times. One recipe, as many meals as you want.",
          files: { "index.js": a4 },
          highlight: "greet();\ngreet();\ngreet();",
        },
        {
          say: "Time for a mistake on purpose. I'll misspell the name on the last call: g r e e e t. Read the console. Greeet is not defined. It's the same clue as before: a name that JavaScript can't find.",
          files: { "index.js": a5 },
          highlight: "greeet();",
        },
        {
          say: "Spelling fixed, and all three greetings appear again. When you see not defined, check how the name is spelled, including capital letters.",
          files: { "index.js": a4 },
          highlight: "greet();",
        },
        {
          say: "Your turn. Write your own function called celebrate that prints Hooray. Then call it twice.",
          files: { "index.js": a6 },
          challenge: {
            task: `**Challenge:** under the comment, write a function called \`celebrate\` that prints **Hooray!** with \`console.log\`. Then **call** it twice.

Remember the two parts:

1. Declare it: \`function celebrate() { ... }\`
2. Call it: \`celebrate();\`

The console should show Hooray! two times, after the greetings.`,
            hints: [
              "Start with: function celebrate() {",
              'Inside the curly braces: console.log("Hooray!");',
              "Close the curly braces, then write celebrate(); two times below the function.",
            ],
            tests: [
              { name: "A function called celebrate exists", code: 'return /function\\s+celebrate\\s*\\(/.test(files()["index.js"]);' },
              { name: "Hooray! is printed twice", code: 'return logs.filter((l) => l.includes("Hooray")).length === 2;' },
            ],
          },
        },
        {
          say: "Here's how I did it. The declaration at the top, then two calls. If your message is different, that's fine.",
          files: { "index.js": a7 },
          highlight: "celebrate();\ncelebrate();",
        },
        { say: "Fantastic! A function is declared once and called as often as you like. Next, we'll give our recipes ingredients." },
      ],
    },
    {
      kind: "practice",
      id: "m03-practice-fill",
      title: "Practice: declare and call",
      type: "fill",
      task: `Fill in the blanks (\`___\`) so that the console prints:

\`\`\`
Good morning!
Good morning!
Hello, Ada!
\`\`\`

1. Name the first function \`morning\`, then **call** it twice.
2. The second function needs a **parameter** called \`person\`.
3. Call \`sayHello\` with the **argument** \`"Ada"\`.

Press **Run**, then **Check my code**.`,
      files: {
        "index.html": page(),
        "index.js": L(
          "function ___() {",
          '  console.log("Good morning!");',
          "}",
          "",
          "___();",
          "___();",
          "",
          "function sayHello(___) {",
          '  console.log("Hello, " + person + "!");',
          "}",
          "",
          "sayHello(___);"
        ),
      },
      solution: {
        "index.js": L(
          "function morning() {",
          '  console.log("Good morning!");',
          "}",
          "",
          "morning();",
          "morning();",
          "",
          "function sayHello(person) {",
          '  console.log("Hello, " + person + "!");',
          "}",
          "",
          'sayHello("Ada");'
        ),
      },
      hints: [
        "The name in a call must match the name in the declaration exactly. The first three blanks are all morning.",
        "A parameter is a placeholder name inside the round brackets. The body already uses a name: person.",
        'The last blank is the argument, the real value: "Ada" in quotes.',
      ],
      tests: [
        { name: "Good morning! is printed twice", code: 'return logs.filter((l) => l === "Good morning!").length === 2;' },
        { name: "Hello, Ada! is printed", code: 'return logs.includes("Hello, Ada!");' },
      ],
    },
    {
      kind: "scrim",
      id: "m03-parameters-return",
      title: "Parameters and return values",
      notes: `## Parameters: the recipe's ingredients

\`\`\`js
function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("Ada");   // Hello, Ada!
greet("Alan");  // Hello, Alan!
\`\`\`

- A **parameter** is a placeholder name in the declaration: \`name\`.
- An **argument** is the real value you give when calling: \`"Ada"\`.
- Several parameters are separated by commas, and arguments are matched **by order**.
- If you forget an argument, the parameter is \`undefined\`, which means "nothing is here".

## Return: handing a result back

\`\`\`js
function double(n) {
  return n * 2;
}
const result = double(5); // 10
\`\`\`

- \`console.log\` **shows** a value to you. It does not give the value back to the program.
- \`return\` **hands the value back** to whoever called the function. The function stops there.
- A function with no \`return\` gives back \`undefined\`.

## Functions can call other functions

A function can use another function's result: \`return cost + 5;\` where \`cost\` came from \`itemsCost(...)\`. Split big jobs into small functions.

## Common mistake

Using \`console.log\` inside a function when you needed \`return\`. The variable ends up \`undefined\`.`,
      files: { "index.html": page(), "index.js": "" },
      steps: [
        { say: "Our greet function always says the same thing. Real recipes have ingredients, so you can cook different meals. Functions can have ingredients too. They're called parameters." },
        {
          say: "Inside the round brackets we write a name for the ingredient: name. Inside the function we use it like any variable. When we call greet with Ada in quotes, the name box holds Ada.",
          files: { "index.js": p1 },
          open: "index.js",
          highlight: "function greet(name) {",
        },
        {
          say: "Quick vocabulary. The name in the declaration is a parameter. The real value we hand over when calling, Ada, is an argument. Now we can greet anyone.",
          files: { "index.js": p2 },
          highlight: 'greet("Alan");',
        },
        {
          say: "A function can take more than one parameter. Separate them with commas. Describe pet takes a name and an age. The arguments go in the same order.",
          files: { "index.js": p3 },
          highlight: "function describePet(name, age) {",
        },
        {
          say: "What if we forget an argument? Look at the console: Biscuit is undefined years old. Undefined means nothing is here. No error, but a clue. Check that you gave every argument.",
          files: { "index.js": p4 },
          highlight: 'describePet("Biscuit");',
        },
        {
          say: "Now a very important idea. Here, double prints n times two. Then we save the call's answer in a box called result and print that. First, the console shows ten. Then it shows undefined!",
          files: { "index.js": p5 },
          highlight: "const result = double(5);",
        },
        {
          say: "Why? Console dot log only shows a value to us humans. It doesn't hand the value back to the program. The box got nothing. To hand a value back, we use the word return.",
          files: { "index.js": p6 },
          highlight: "return n * 2;",
        },
        {
          say: "Now result holds ten. Think of an oven. Logging is peeking through the glass. Returning is taking the cake out so you can use it. Returned values can go anywhere a value can go.",
          files: { "index.js": p7 },
          highlight: "console.log(double(5) + double(2));",
        },
        {
          say: "Functions can call other functions. Items cost multiplies a price and a quantity. Order total calls items cost, then adds five for shipping. The word cost lives only inside order total. Small functions, joined together.",
          files: { "index.js": p8 },
          highlight: "const cost = itemsCost(price, quantity);",
        },
        {
          say: "Your turn. Write a function with two parameters that returns something. I cleared the editor.",
          files: { "index.js": p9 },
          challenge: {
            task: `**Challenge:** under the comment:

1. Write a function \`fullName\` with two parameters, \`first\` and \`last\`.
2. It should **return** the two names joined with a space in between.
3. Print the result of \`fullName("Ada", "Lovelace")\` with \`console.log\`.

The console should show \`Ada Lovelace\`. Remember: use **return**, not console.log, inside the function.`,
            hints: [
              "Start with: function fullName(first, last) {",
              'Inside, join with plus signs: return first + " " + last;',
              'Below the function: console.log(fullName("Ada", "Lovelace"));',
            ],
            tests: [
              { name: "The console shows Ada Lovelace", code: 'return logs.some((l) => l === "Ada Lovelace");' },
              { name: "The function uses return", code: 'return /return\\s/.test(files()["index.js"]);' },
              { name: "fullName is a function with two parameters", code: 'return /function\\s+fullName\\s*\\(\\s*\\w+\\s*,\\s*\\w+\\s*\\)/.test(files()["index.js"]);' },
            ],
          },
        },
        {
          say: "Here's how I did it. The function returns the joined text, and console dot log prints what came back. Your parameter names might differ, and that's perfect.",
          files: { "index.js": p10 },
          highlight: 'return first + " " + last;',
        },
        { say: "Well done! Parameters are the ingredients going in, and return is the result coming out. Next: a shorter way to write functions, the arrow function." },
      ],
    },
    {
      kind: "practice",
      id: "m03-practice-build",
      title: "Practice: build three helper functions",
      type: "build",
      task: `Write three small functions, then use them.

1. \`makeGreeting(name)\` **returns** the text \`Hello, \` + the name + \`!\`
2. \`average(a, b)\` **returns** the average of two numbers (add them, divide by 2)
3. \`showOnPage(message)\` puts the message into the paragraph with the id \`output\`

Then call them like this:

\`\`\`js
showOnPage(makeGreeting("Sam"));
console.log(average(4, 10));
\`\`\`

The page should show **Hello, Sam!** and the console should show **7**. Use function declarations or arrow functions, whichever you like.

Press **Run**, then **Check my code**.`,
      files: {
        "index.html": page('\n    <h1>Helper functions</h1>\n    <p id="output">...</p>'),
        "index.js": L(
          "// 1. makeGreeting(name) returns a greeting",
          "",
          "// 2. average(a, b) returns the average of two numbers",
          "",
          '// 3. showOnPage(message) puts the message in the paragraph with id "output"',
          "",
          "// Now use them:"
        ),
      },
      solution: {
        "index.js": L(
          "function makeGreeting(name) {",
          '  return "Hello, " + name + "!";',
          "}",
          "",
          "const average = (a, b) => (a + b) / 2;",
          "",
          "function showOnPage(message) {",
          '  const output = document.querySelector("#output");',
          "  output.textContent = message;",
          "}",
          "",
          'showOnPage(makeGreeting("Sam"));',
          "console.log(average(4, 10));"
        ),
      },
      hints: [
        'Start with the first one: function makeGreeting(name) { return "Hello, " + name + "!"; }',
        "average can be an arrow function in the short form: const average = (a, b) => (a + b) / 2; Round brackets around a + b make the addition happen first.",
        'showOnPage finds the paragraph with document.querySelector("#output") and sets its textContent to message. Then call both functions at the bottom.',
      ],
      tests: [
        { name: "The page shows Hello, Sam!", code: 'return text("#output") === "Hello, Sam!";' },
        { name: "The console shows 7", code: 'return logs.some((l) => l === "7");' },
        { name: "The functions are written in the code", code: 'const src = files()["index.js"]; return /makeGreeting/.test(src) && /average/.test(src) && /showOnPage/.test(src) && /return|=>/.test(src);' },
      ],
    },
    {
      kind: "scrim",
      id: "m03-arrow-functions",
      title: "Arrow functions",
      notes: `## Another way to write a function

Functions are values too, so you can store one in a \`const\`:

\`\`\`js
const double = (n) => {
  return n * 2;
};
\`\`\`

This is an **arrow function**: parameters in round brackets, then the arrow \`=>\` (an equals sign and a greater-than sign), then the body. You call it the same way: \`double(4)\`.

## Short form (implicit return)

If the body is one expression, drop the curly braces **and** the word \`return\`:

\`\`\`js
const double = (n) => n * 2;
const greet = () => "Hello!";
const add = (a, b) => a + b;
\`\`\`

Whatever comes after the arrow is returned automatically.

## The big gotcha

\`\`\`js
const triple = (n) => {
  n * 3;          // no return here!
};
triple(4);        // undefined
\`\`\`

**With curly braces you must write \`return\` yourself.** Without curly braces, the return is automatic.

## Which one?

- One simple expression: short form.
- Several lines of work: curly braces and \`return\`.

You will write arrow functions all the time in React. With a single parameter the round brackets are optional (\`n => n * 2\`), but we will always write them to stay consistent.`,
      files: { "index.html": page(), "index.js": "" },
      steps: [
        { say: "There's a second way to write functions, and you'll see it everywhere in React. It's called the arrow function. Let's compare it with what we know." },
        {
          say: "Here's a regular function that doubles a number, and we print double of four. Eight.",
          files: { "index.js": r1 },
          open: "index.js",
        },
        {
          say: "Now the arrow version. We store the function in a const. Round brackets for the parameter, then the arrow, an equals sign followed by a greater than sign, then curly braces. Functions are values, so a box can hold one.",
          files: { "index.js": r2 },
          highlight: "const double = (n) => {",
        },
        {
          say: "Calling it is exactly the same. Double, four, still eight. The only difference is how we wrote it.",
        },
        {
          say: "Here's the shorter form. When the body is one expression, we can drop the curly braces and the word return. Whatever comes after the arrow is handed back automatically.",
          files: { "index.js": r3 },
          highlight: "const double = (n) => n * 2;",
        },
        {
          say: "Now watch out, this trips up almost everybody. Here we keep the curly braces but forget return. Look at the console: undefined! With curly braces, nothing is returned unless we say so.",
          files: { "index.js": r4 },
          highlight: "n * 3;",
        },
        {
          say: "The fix: with curly braces, write return. The rule to remember: curly braces mean you must say return. No curly braces means the return is automatic.",
          files: { "index.js": r5 },
          highlight: "return n * 3;",
        },
        {
          say: "A few more shapes. With two parameters, we separate them with a comma. With no parameters, we write empty round brackets. Both can use the short form.",
          files: { "index.js": r6 },
          highlight: "const add = (a, b) => a + b;",
        },
        {
          say: "When a function needs several lines, like making a variable first, use curly braces and return. Short form for small things, curly braces for bigger jobs.",
          files: { "index.js": r7 },
          highlight: "const describe = (name, age) => {",
        },
        {
          say: "Your turn. Write two arrow functions. Square takes a number and returns it multiplied by itself, in the short form. Shout takes a word and returns it with an exclamation mark added.",
          files: { "index.js": r8 },
          challenge: {
            task: `**Challenge:** under the comment, write two arrow functions:

1. \`square\`: takes \`n\` and returns \`n * n\`. Use the **short form** (no curly braces).
2. \`shout\`: takes \`word\` and returns the word with \`"!"\` added on the end.

Print \`square(5)\` and \`shout("hey")\`. The console should show \`25\` and \`hey!\`.`,
            hints: [
              "Start with: const square = (n) => n * n;",
              'For shout, join with a plus: const shout = (word) => word + "!";',
              'Print them: console.log(square(5)); and console.log(shout("hey"));',
            ],
            tests: [
              { name: "square(5) prints 25", code: 'return logs.some((l) => l === "25");' },
              { name: "shout prints hey!", code: 'return logs.some((l) => l === "hey!");' },
              { name: "Both are arrow functions", code: 'const src = files()["index.js"]; return /square\\s*=\\s*\\(?\\w+\\)?\\s*=>/.test(src) && /shout\\s*=\\s*\\(?\\w+\\)?\\s*=>/.test(src);' },
            ],
          },
        },
        {
          say: "Here's how I did it. Both are one line, with the arrow and no curly braces. Yours may be a little different, and that's fine.",
          files: { "index.js": r9 },
          highlight: 'const shout = (word) => word + "!";',
        },
        { say: "You now know functions: declare, call, parameters, return, and arrows. You'll use these in every lesson from here on. Let's practice!" },
      ],
    },
    {
      kind: "practice",
      id: "m03-practice-fix",
      title: "Practice: functions that give nothing back",
      type: "fix",
      task: `These two functions don't hand back their results. The console should show:

\`\`\`
Final price: 12
Double: 42
\`\`\`

But right now it shows **undefined**. There are two bugs. Hint: one is a missing \`return\`, and the other is an arrow function with curly braces.

Press **Run**, then **Check my code**.`,
      files: {
        "index.html": page(),
        "index.js": L(
          "function addShipping(price) {",
          "  console.log(price + 2);",
          "}",
          "",
          "const double = (n) => {",
          "  n * 2;",
          "};",
          "",
          "const finalPrice = addShipping(10);",
          'console.log("Final price: " + finalPrice);',
          'console.log("Double: " + double(21));'
        ),
      },
      solution: {
        "index.js": L(
          "function addShipping(price) {",
          "  return price + 2;",
          "}",
          "",
          "const double = (n) => {",
          "  return n * 2;",
          "};",
          "",
          "const finalPrice = addShipping(10);",
          'console.log("Final price: " + finalPrice);',
          'console.log("Double: " + double(21));'
        ),
      },
      hints: [
        "Look at what finalPrice holds. A function only hands a value back when it uses return.",
        "In addShipping, replace console.log(...) with return ...",
        "In double, the curly braces mean you must write return before n * 2. (Removing the braces and return also works.)",
      ],
      tests: [
        { name: 'The console shows "Final price: 12"', code: 'return logs.some((l) => l === "Final price: 12");' },
        { name: 'The console shows "Double: 42"', code: 'return logs.some((l) => l === "Double: 42");' },
      ],
    },
    {
      kind: "quiz",
      id: "m03-quiz",
      title: "Quick check: functions",
      questions: [
        {
          q: "How many times does this print Hi!?",
          code: 'function sayHi() {\n  console.log("Hi!");\n}\n\nsayHi();\nsayHi();',
          options: ["Zero", "Once", "Twice", "It causes an error"],
          answer: 2,
          explain: "Each call runs the function's body once, and there are two calls. Declaring the function doesn't print anything.",
        },
        {
          q: "What does this print?",
          code: 'function sayHi() {\n  console.log("Hi!");\n}',
          options: ["Hi!", "undefined", "sayHi", "Nothing, the function was never called"],
          answer: 3,
          explain: "A declared function is a recipe nobody has cooked. You need to call it with sayHi();",
        },
        {
          q: "In this code, what is 3?",
          code: "function double(n) {\n  return n * 2;\n}\n\ndouble(3);",
          options: ["A parameter", "An argument", "A function", "A return"],
          answer: 1,
          explain: "The n in the declaration is the parameter, a placeholder. The real value 3 that we pass when calling is the argument.",
        },
        {
          q: "What does this print, in order?",
          code: "function double(n) {\n  console.log(n * 2);\n}\n\nconst r = double(4);\nconsole.log(r);",
          options: ["8, then undefined", "8, then 8", "undefined, then 8", "Only undefined"],
          answer: 0,
          explain: "The console.log inside prints 8. But the function has no return, so r holds undefined, and the second console.log prints that.",
        },
        {
          q: "What does this print?",
          code: "const add = (a, b) => {\n  a + b;\n};\nconsole.log(add(2, 3));",
          options: ["undefined", "5", "23", "An error"],
          answer: 0,
          explain: "With curly braces you must write return yourself. Either write return a + b; or drop the curly braces: (a, b) => a + b",
        },
        {
          q: "What does this print?",
          code: "const square = (n) => n * n;\nconsole.log(square(square(2)));",
          options: ["4", "8", "16", "22"],
          answer: 2,
          explain: "The inner call square(2) gives 4. The outer call then squares that: 4 times 4 is 16. Functions can use other functions' results.",
        },
      ],
    },
  ],
};
