// Module 4: making decisions (plain JavaScript, console + a little DOM).
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

// ---- scrim 1: comparisons ----
const c1 = L("console.log(5 > 3);", "console.log(2 > 10);");
const c2 = c1 + L("console.log(3 < 10);", "console.log(7 >= 7);", "console.log(4 <= 3);");
const c3 = c2 + L('console.log(5 === 5);', 'console.log("cat" === "dog");');
const c4 = c3 + L("console.log(5 !== 3);");
const c5 = L("const age = 18;", "console.log(age === 18);");
const c6 = c5 + L("console.log(age = 20);");
const c7 = c5 + L("console.log(age === 20);");
const c8 = c7 + L('console.log(5 === "5");', 'console.log("Hello" === "hello");');
const c9 = L("const age = 18;", "const isAdult = age >= 18;", "console.log(isAdult);");
const c10 = L("// Your turn below");
const c11 = c10 + L("const score = 75;", "const passed = score >= 50;", "const perfect = score === 100;", "console.log(passed);", "console.log(perfect);");

// ---- scrim 2: if / else if / else, and or not ----
const i1 = L("const temperature = 30;", "", "if (temperature > 25) {", '  console.log("It is hot!");', "}");
const i2 = i1.replace("30", "10");
const i3 = L("const temperature = 10;", "", "if (temperature > 25) {", '  console.log("It is hot!");', "} else {", '  console.log("Not so hot.");', "}");
const i4 = L(
  "const temperature = 20;",
  "",
  "if (temperature > 25) {",
  '  console.log("It is hot!");',
  "} else if (temperature > 15) {",
  '  console.log("Nice and warm.");',
  "} else {",
  '  console.log("Brr, it is cold.");',
  "}"
);
const i5 = L(
  "const temperature = 30;",
  "",
  "if (temperature > 15) {",
  '  console.log("Nice and warm.");',
  "} else if (temperature > 25) {",
  '  console.log("It is hot!");',
  "} else {",
  '  console.log("Brr, it is cold.");',
  "}"
);
const i6 = i4.replace("= 20;", "= 30;");
const i7 = L(
  "const age = 20;",
  "const hasTicket = true;",
  "",
  "if (age >= 18 && hasTicket) {",
  '  console.log("Welcome in!");',
  "} else {",
  '  console.log("Sorry, you cannot enter.");',
  "}"
);
const i8 = L("const isWeekend = true;", "const isHoliday = false;", "", "if (isWeekend || isHoliday) {", '  console.log("No work today!");', "}");
const i9 = L("const isRaining = false;", "", "if (!isRaining) {", '  console.log("Let us go outside.");', "}");
const i10 = L("const score = 85;", "", "// Your turn below: print the grade");
const i11 = i10 + L(
  "if (score >= 90) {",
  '  console.log("A");',
  "} else if (score >= 80) {",
  '  console.log("B");',
  "} else if (score >= 70) {",
  '  console.log("C");',
  "} else {",
  '  console.log("Keep practicing");',
  "}"
);

// ---- scrim 3: truthy / falsy, ternary, short-circuit ----
const t1 = L(
  "const check = (label, value) => {",
  "  if (value) {",
  '    console.log(label + " is truthy");',
  "  } else {",
  '    console.log(label + " is falsy");',
  "  }",
  "};",
  "",
  'check("a word", "hello");',
  'check("number 42", 42);'
);
const t2 = t1 + L('check("zero", 0);', 'check("empty text", "");');
const t3 = t2 + L('check("null", null);', 'check("undefined", undefined);');
const t4 = L("const age = 20;", "let label;", "", "if (age >= 18) {", '  label = "adult";', "} else {", '  label = "child";', "}", "", "console.log(label);");
const t5 = L("const age = 20;", 'const label = age >= 18 ? "adult" : "child";', "", "console.log(label);");
const t6 = t5 + L("", "const isOnline = true;", 'console.log("Status: " + (isOnline ? "online" : "offline"));');
const t7 = L("const isLoggedIn = true;", "", 'console.log(isLoggedIn && "Welcome back!");', 'console.log(!isLoggedIn && "Please log in.");');
const t8 = t7 + L("", "const count = 0;", 'console.log(count && "You have items");');
const t9 = t7 + L("", "const count = 0;", 'console.log(count > 0 && "You have items");');
const t10 = L('const nickname = "";', "", 'console.log(nickname || "Anonymous");');
const t11 = L("const itemCount = 1;", "", "// Your turn below: print You have 1 item");
const t12 = L("const itemCount = 1;", "", "// Your turn below: print You have 1 item", 'console.log("You have " + itemCount + " " + (itemCount === 1 ? "item" : "items"));');

export default {
  id: "m04",
  title: "Making decisions",
  summary: "Teach your code to choose: compare values, use if and else, combine conditions, and meet the ternary and short-circuit shortcuts that React uses all the time.",
  lessons: [
    {
      kind: "scrim",
      id: "m04-comparisons",
      title: "Comparing values",
      notes: `## Questions with yes-or-no answers

A **comparison** asks a question about two values. The answer is always a boolean: \`true\` or \`false\`.

| Symbol | Question |
| --- | --- |
| \`>\` | greater than? |
| \`<\` | less than? |
| \`>=\` | greater than or equal? |
| \`<=\` | less than or equal? |
| \`===\` | exactly equal? |
| \`!==\` | not equal? |

\`\`\`js
console.log(5 > 3);       // true
console.log(7 >= 7);      // true
console.log("cat" === "dog"); // false
\`\`\`

## One equals sign is not three

- \`=\` **puts a value in a box**: \`const age = 18;\`
- \`===\` **asks a question**: \`age === 18\` is \`true\`.

Writing \`age = 20\` when you meant \`age === 20\` is a classic slip.

## Types and capital letters matter

\`5 === "5"\` is \`false\` (a number is not text). \`"Hello" === "hello"\` is \`false\` (capital letters count).

## Saving the answer

\`\`\`js
const isAdult = age >= 18;
\`\`\`

Booleans are often named starting with \`is\` or \`has\`: \`isAdult\`, \`hasTicket\`.`,
      files: { "index.html": page(), "index.js": "" },
      steps: [
        { say: "Welcome! Real programs make decisions. Show this menu if the user is logged in. Say well done if the score is high. To decide, code first needs to ask a question that has a yes or no answer." },
        {
          say: "A comparison asks that kind of question. Is five greater than three? We write five, a greater than sign, three. The console says true. Is two greater than ten? That prints false.",
          files: { "index.js": c1 },
          open: "index.js",
          highlight: "console.log(5 > 3);",
        },
        {
          say: "There are more comparisons. A less than sign, and greater than or equal to, which is the greater than sign followed by an equals sign. Seven is greater than or equal to seven, so that's true. Four is not less than or equal to three.",
          files: { "index.js": c2 },
          highlight: "console.log(7 >= 7);",
        },
        {
          say: "To ask if two things are equal, we use three equals signs in a row. Five, three equals signs, five, is true. Cat, three equals signs, dog, is false. This works on text too.",
          files: { "index.js": c3 },
          highlight: "console.log(5 === 5);",
        },
        {
          say: "And to ask if two things are different, we write an exclamation mark followed by two equals signs. Five is not equal to three, so that's true.",
          files: { "index.js": c4 },
          highlight: "console.log(5 !== 3);",
        },
        {
          say: "Now a very important difference. I'll clear the editor. We make a box called age holding eighteen, and ask: is age equal to eighteen? Three equals signs ask a question. The answer is true.",
          files: { "index.js": c5 },
          highlight: "age === 18",
        },
        {
          say: "What if I use only one equals sign? One equals sign means put into the box, not compare. Age is a const, so JavaScript complains: Assignment to constant variable. A familiar clue from module two!",
          files: { "index.js": c6 },
          highlight: "age = 20",
        },
        {
          say: "With three equals signs, we correctly ask: is age twenty? False. One equals sign stores a value. Three equals signs ask a question.",
          files: { "index.js": c7 },
          highlight: "console.log(age === 20);",
        },
        {
          say: "Comparisons care about types and capitals. The number five is not equal to the text five in quotes. And Hello with a capital H is not equal to hello with a small h. Both are false.",
          files: { "index.js": c8 },
          highlight: 'console.log(5 === "5");',
        },
        {
          say: "We can keep the answer in a variable. Is adult is true when age is greater than or equal to eighteen. Programmers often start boolean names with is or has, so the code reads like a question.",
          files: { "index.js": c9 },
          highlight: "const isAdult = age >= 18;",
        },
        {
          say: "Your turn! I've cleared the editor again. Make some comparisons of your own.",
          files: { "index.js": c10 },
          challenge: {
            task: `**Challenge:** under the comment:

1. Make a variable \`score\` that holds \`75\`.
2. Make a variable \`passed\` that is \`true\` when the score is **at least 50** (use \`>=\`).
3. Make a variable \`perfect\` that is \`true\` when the score is **exactly 100** (use \`===\`).
4. Print both with \`console.log\`.

The console should show \`true\` and then \`false\`.`,
            hints: [
              "Start with: const score = 75;",
              "const passed = score >= 50; asks: is the score at least 50?",
              "const perfect = score === 100; uses three equals signs. Then console.log(passed); and console.log(perfect);",
            ],
            tests: [
              { name: "The console shows true and false", code: 'return logs.includes("true") && logs.includes("false");' },
              { name: "It uses >= (or another comparison) and ===", code: 'const src = files()["index.js"]; return /(>=|>|<=|<)/.test(src) && /===/.test(src);' },
            ],
          },
        },
        {
          say: "Here's how I did it. Passed is true because seventy five is at least fifty. Perfect is false because it's not exactly one hundred.",
          files: { "index.js": c11 },
          highlight: "const perfect = score === 100;",
        },
        { say: "Great! Comparisons give booleans, and three equals signs ask a question. Next, we'll use those booleans to make the code choose what to do." },
      ],
    },
    {
      kind: "practice",
      id: "m04-practice-fix",
      title: "Practice: fix the comparisons",
      type: "fix",
      task: `The console should print **true** twice:

1. \`canVote\`: someone who is exactly **18** is old enough to vote.
2. \`sameAge\`: is \`age\` exactly the **number** 18?

Right now both print \`false\`. There are two bugs hiding in the comparisons. Hint: think about "at least", and about numbers versus text.

Press **Run**, then **Check my code**.`,
      files: {
        "index.html": page(),
        "index.js": L(
          "const age = 18;",
          "",
          "const canVote = age > 18;",
          'const sameAge = age === "18";',
          "",
          "console.log(canVote);",
          "console.log(sameAge);"
        ),
      },
      solution: {
        "index.js": L(
          "const age = 18;",
          "",
          "const canVote = age >= 18;",
          "const sameAge = age === 18;",
          "",
          "console.log(canVote);",
          "console.log(sameAge);"
        ),
      },
      hints: [
        "Is 18 greater than 18? No. Which comparison means greater than or equal?",
        'The second line compares the number 18 with the text "18". Different types are never equal.',
        "Change > to >= on the first line, and remove the quotes around 18 on the second line.",
      ],
      tests: [
        { name: "canVote prints true", code: 'return logs[0] === "true";' },
        { name: "sameAge prints true", code: 'return logs[1] === "true";' },
      ],
    },
    {
      kind: "scrim",
      id: "m04-if-else",
      title: "if, else if and else",
      notes: `## if: do this only when something is true

\`\`\`js
const temperature = 30;

if (temperature > 25) {
  console.log("It is hot!");
}
\`\`\`

- \`if\`, then a **condition** in round brackets, then curly braces with the code to run.
- If the condition is \`false\`, the curly braces are skipped.

## else and else if

\`\`\`js
if (temperature > 25) {
  console.log("It is hot!");
} else if (temperature > 15) {
  console.log("Nice and warm.");
} else {
  console.log("Brr, it is cold.");
}
\`\`\`

JavaScript checks from the top and runs **the first** branch whose condition is true. The rest are skipped. \`else\` catches everything left.

**Order matters.** Put the most specific condition first. If \`> 15\` came first, 30 degrees would say "Nice and warm."

## and, or, not

- \`&&\` means **and**: both sides must be true. \`age >= 18 && hasTicket\`
- \`||\` means **or**: at least one side must be true. \`isWeekend || isHoliday\`
- \`!\` means **not**: flips true to false. \`!isRaining\`

## Common mistakes

- Writing \`=\` instead of \`===\` in the condition.
- Putting conditions in the wrong order: no error, but the wrong answer.`,
      files: { "index.html": page(), "index.js": "" },
      steps: [
        { say: "Now that we can ask questions, let's act on the answers. The tool for this is the if statement. It means: if this is true, do that." },
        {
          say: "We have a temperature of thirty. Then the word if, round brackets with a condition inside, and curly braces with the code to run. If temperature is greater than twenty five, print It is hot.",
          files: { "index.js": i1 },
          open: "index.js",
          highlight: "if (temperature > 25) {",
        },
        {
          say: "It printed, because thirty is greater than twenty five. Now watch what happens if I change the temperature to ten. The condition is false, so JavaScript skips the curly braces. The console stays empty.",
          files: { "index.js": i2 },
          highlight: "const temperature = 10;",
        },
        {
          say: "To do something else when the condition is false, add an else part. Now with ten degrees, the console says Not so hot.",
          files: { "index.js": i3 },
          highlight: "} else {",
        },
        {
          say: "For more than two choices, use else if. JavaScript checks from the top. Above twenty five, hot. Otherwise above fifteen, warm. Otherwise, cold. Temperature is twenty, so it prints Nice and warm.",
          files: { "index.js": i4 },
          highlight: "} else if (temperature > 15) {",
        },
        {
          say: "Order matters. Here I swapped the two conditions and set the temperature to thirty. Look at the console: Nice and warm. No error, but the wrong answer, because thirty is greater than fifteen, and the first true condition wins.",
          files: { "index.js": i5 },
          highlight: "if (temperature > 15) {",
        },
        {
          say: "Put the most specific condition first, and thirty degrees is correctly hot. When code runs without errors but gives a surprising answer, check the order of your conditions.",
          files: { "index.js": i6 },
          highlight: "if (temperature > 25) {",
        },
        {
          say: "We can combine conditions. Two ampersands mean and: both sides must be true. You get in if your age is at least eighteen and you have a ticket.",
          files: { "index.js": i7 },
          highlight: "age >= 18 && hasTicket",
        },
        {
          say: "Two vertical bars mean or: at least one side must be true. It's a day off if it's the weekend or a holiday. Only the weekend is true here, and that's enough.",
          files: { "index.js": i8 },
          highlight: "isWeekend || isHoliday",
        },
        {
          say: "An exclamation mark means not. It flips true into false and false into true. Is raining is false, so not is raining is true, and we go outside.",
          files: { "index.js": i9 },
          highlight: "!isRaining",
        },
        {
          say: "Your turn! I made a score of eighty five. Print a grade: A for ninety or more, B for eighty or more, C for seventy or more, otherwise Keep practicing.",
          files: { "index.js": i10 },
          challenge: {
            task: `**Challenge:** use \`if\`, \`else if\` and \`else\` to print a grade for \`score\`:

- 90 or more: \`A\`
- 80 or more: \`B\`
- 70 or more: \`C\`
- anything else: \`Keep practicing\`

With \`score = 85\` the console should show \`B\`. Try changing the score to check the other grades too.`,
            hints: [
              "Start with the highest grade: if (score >= 90) { console.log(\"A\"); }",
              'Add else if (score >= 80) { ... } for B, and another else if for C.',
              "Finish with a plain else { ... } for everything left.",
            ],
            tests: [
              { name: "Exactly one grade is printed", code: "return logs.length === 1;" },
              { name: "A score of 85 prints B", code: 'return logs[0].includes("B");' },
              { name: "It uses else if", code: 'return /else\\s+if/.test(files()["index.js"]);' },
            ],
          },
        },
        {
          say: "Here's how I did it. The highest grade is checked first, then each lower one. Because the first true condition wins, the order makes it work.",
          files: { "index.js": i11 },
          highlight: "} else if (score >= 80) {",
        },
        { say: "Excellent. You can now make your code choose. Next, three shortcuts for decisions that you'll use constantly in React." },
      ],
    },
    {
      kind: "practice",
      id: "m04-practice-build",
      title: "Practice: build a traffic light",
      type: "build",
      task: `Build a tiny traffic light message. The variable \`light\` holds the colour (keep that first line as it is). Use \`if\`, \`else if\` and \`else\` to set the text of the paragraph with the id \`message\`:

| light | message |
| --- | --- |
| \`"green"\` | \`Go\` |
| \`"yellow"\` | \`Get ready\` |
| \`"red"\` | \`Stop\` |
| anything else | \`Light is broken\` |

Your code is also tested with other colours, so make sure all four cases work.

Press **Run**, then **Check my code**.`,
      files: {
        "index.html": page('\n    <h1>Traffic light</h1>\n    <p id="message"></p>'),
        "index.js": L(
          'const light = "green";',
          "",
          'const message = document.querySelector("#message");',
          "",
          "// Use if / else if / else to set message.textContent"
        ),
      },
      solution: {
        "index.js": L(
          'const light = "green";',
          "",
          'const message = document.querySelector("#message");',
          "",
          'if (light === "green") {',
          '  message.textContent = "Go";',
          '} else if (light === "yellow") {',
          '  message.textContent = "Get ready";',
          '} else if (light === "red") {',
          '  message.textContent = "Stop";',
          "} else {",
          '  message.textContent = "Light is broken";',
          "}"
        ),
      },
      hints: [
        'Start with: if (light === "green") { message.textContent = "Go"; }',
        'Add else if (light === "yellow") { ... } and another else if for "red".',
        'Finish with a plain else { message.textContent = "Light is broken"; } for any other colour.',
      ],
      tests: [
        { name: "Green shows Go", code: 'return text("#message") === "Go";' },
        {
          name: "Yellow shows Get ready",
          code: 'const src = files()["index.js"].replace(/(const|let)\\s+light\\s*=\\s*["\'][^"\']*["\']/, \'const light = "yellow"\'); new Function(src)(); return text("#message") === "Get ready";',
        },
        {
          name: "Red shows Stop",
          code: 'const src = files()["index.js"].replace(/(const|let)\\s+light\\s*=\\s*["\'][^"\']*["\']/, \'const light = "red"\'); new Function(src)(); return text("#message") === "Stop";',
        },
        {
          name: "Any other colour shows Light is broken",
          code: 'const src = files()["index.js"].replace(/(const|let)\\s+light\\s*=\\s*["\'][^"\']*["\']/, \'const light = "purple"\'); new Function(src)(); return text("#message") === "Light is broken";',
        },
      ],
    },
    {
      kind: "scrim",
      id: "m04-shortcuts",
      title: "Truthy, ternary and short-circuit",
      notes: `## Truthy and falsy

\`if\` accepts any value, not only booleans. Some values count as **falsy** (treated like false):

\`false\`, \`0\`, \`""\` (empty text), \`null\`, \`undefined\`

Everything else is **truthy**, including \`"0"\` (text with a character in it) and \`"false"\`.

- \`null\` means "empty on purpose".
- \`undefined\` means "nothing is here yet".

## The ternary operator: a one-line choice

\`\`\`js
const label = age >= 18 ? "adult" : "child";
\`\`\`

Read it as: *is age at least 18? If yes, "adult". If no, "child".*
Pattern: \`condition ? valueIfTrue : valueIfFalse\`. It produces a value, so you can put it right inside other code, in round brackets when joining text.

## Short-circuit with &&

\`\`\`js
isLoggedIn && "Welcome back!"
\`\`\`

If the left side is truthy, you get the right side. If it is falsy, you get the left side and JavaScript stops.

**Careful:** \`0 && "text"\` gives \`0\`. Write \`count > 0 && "text"\` instead.

## Default with ||

\`nickname || "Anonymous"\` gives \`nickname\` if it is truthy, otherwise \`"Anonymous"\`.

You will use the ternary and \`&&\` in React to show different things on the page.`,
      files: { "index.html": page(), "index.js": "" },
      steps: [
        { say: "Welcome! In React, deciding what to show on the page is something you do all the time. This lesson has three shortcuts that React developers use every day. First, a surprising fact about if." },
        {
          say: "An if doesn't need a true or false. It accepts any value. Let's see how. This function, called check, takes a label and a value, and tells us if the value counts as truthy or falsy. The word hello is truthy. So is forty two.",
          files: { "index.js": t1 },
          open: "index.js",
          highlight: "if (value) {",
        },
        {
          say: "Zero counts as falsy, and so does empty text, two quotes with nothing between them.",
          files: { "index.js": t2 },
          highlight: 'check("zero", 0);',
        },
        {
          say: "Two more. Null means empty on purpose. Undefined means nothing is here yet. Both are falsy. So the falsy values are false, zero, empty text, null and undefined. Everything else is truthy.",
          files: { "index.js": t3 },
          highlight: 'check("undefined", undefined);',
        },
        {
          say: "Next, the ternary operator. Here's a normal if and else that sets a label to adult or child. It works, but takes eight lines for a simple choice.",
          files: { "index.js": t4 },
          highlight: "if (age >= 18) {",
        },
        {
          say: "Here's the ternary version. The condition, a question mark, the value if true, a colon, the value if false. Read it: is age at least eighteen? If yes, adult. If no, child. One line!",
          files: { "index.js": t5 },
          highlight: 'age >= 18 ? "adult" : "child"',
        },
        {
          say: "The ternary gives back a value, so it can go anywhere a value can go, like inside joined text. We need round brackets around it, so the plus sign doesn't get confused.",
          files: { "index.js": t6 },
          highlight: 'isOnline ? "online" : "offline"',
        },
        {
          say: "Second shortcut: and with a value. If the left side is truthy, we get the right side. Logged in is true, so we get Welcome back. If it's false, we get false back and JavaScript stops. In React, false shows nothing on the page.",
          files: { "index.js": t7 },
          highlight: 'isLoggedIn && "Welcome back!"',
        },
        {
          say: "Now a trap. Count is zero. We expect nothing, but the console shows the number zero! Zero is falsy, so we get zero itself back. React would show that zero on the page.",
          files: { "index.js": t8 },
          highlight: 'count && "You have items"',
        },
        {
          say: "The fix: use a real comparison. Count greater than zero is a true or false answer. Now we get false, and no stray zero.",
          files: { "index.js": t9 },
          highlight: 'count > 0 && "You have items"',
        },
        {
          say: "One last shortcut: or with a default. The nickname is empty text, which is falsy, so we get the second value, Anonymous. It means: use this, otherwise that.",
          files: { "index.js": t10 },
          highlight: 'nickname || "Anonymous"',
        },
        {
          say: "Your turn! Use a ternary to print You have one item, but when the count isn't one, it should say items with an s. I'll leave a count of one for you.",
          files: { "index.js": t11 },
          challenge: {
            task: `**Challenge:** print a message about \`itemCount\` that gets the grammar right, using a **ternary**:

- When \`itemCount\` is \`1\`: \`You have 1 item\`
- Otherwise: \`You have 3 items\` (for 3), and so on

Join the pieces with \`+\`, and put the ternary in **round brackets**. Then change \`itemCount\` to \`3\` and run it again to check.`,
            hints: [
              'Start with: console.log("You have " + itemCount + " " + ...);',
              'The last piece is the ternary: (itemCount === 1 ? "item" : "items")',
              'Full line: console.log("You have " + itemCount + " " + (itemCount === 1 ? "item" : "items"));',
            ],
            tests: [
              { name: "It prints a You have message", code: 'return logs.some((l) => /^You have \\d+ items?$/.test(l));' },
              { name: "The word item matches the number", code: 'return logs.some((l) => { const m = l.match(/(\\d+) (items?)$/); return !!m && ((m[1] === "1") === (m[2] === "item")); });' },
              { name: "It uses a ternary", code: 'return /\\?[\\s\\S]*:/.test(files()["index.js"]);' },
            ],
          },
        },
        {
          say: "Here's how I did it. The ternary picks item or items, and the plus signs join everything. Change item count to three, and it says items.",
          files: { "index.js": t12 },
          highlight: '(itemCount === 1 ? "item" : "items")',
        },
        { say: "Great work! Truthy and falsy, the ternary, and and with a value. You'll meet them again when we build React pages. Now, practice time!" },
      ],
    },
    {
      kind: "practice",
      id: "m04-practice-fill",
      title: "Practice: complete the decisions",
      type: "fill",
      task: `Fill in the three blanks (\`___\`) so that the console prints, in order:

\`\`\`
Pass
Member
Bonus points!
\`\`\`

1. The score must **pass** when it is at least **60**.
2. A member gets the label **"Member"**. Everyone else would be a **"Guest"**.
3. A member also gets the text **"Bonus points!"** using \`&&\`.

Press **Run**, then **Check my code**.`,
      files: {
        "index.html": page(),
        "index.js": L(
          "const score = 72;",
          "const isMember = true;",
          "",
          "if (score >= ___) {",
          '  console.log("Pass");',
          "} else {",
          '  console.log("Try again");',
          "}",
          "",
          'const label = isMember ? ___ : "Guest";',
          "console.log(label);",
          "",
          "const bonus = isMember && ___;",
          "console.log(bonus);"
        ),
      },
      solution: {
        "index.js": L(
          "const score = 72;",
          "const isMember = true;",
          "",
          "if (score >= 60) {",
          '  console.log("Pass");',
          "} else {",
          '  console.log("Try again");',
          "}",
          "",
          'const label = isMember ? "Member" : "Guest";',
          "console.log(label);",
          "",
          'const bonus = isMember && "Bonus points!";',
          "console.log(bonus);"
        ),
      },
      hints: [
        "The first blank is a number: the lowest passing score.",
        "The second and third blanks are text, so they need quotes.",
        'The answers, in order: 60, "Member", "Bonus points!".',
      ],
      tests: [
        { name: 'The first line printed is "Pass"', code: 'return logs[0] === "Pass";' },
        { name: 'The second line printed is "Member"', code: 'return logs[1] === "Member";' },
        { name: 'The third line printed is "Bonus points!"', code: 'return logs[2] === "Bonus points!";' },
      ],
    },
    {
      kind: "quiz",
      id: "m04-quiz",
      title: "Quick check: decisions",
      questions: [
        {
          q: "What does this print?",
          code: 'console.log(5 === "5");',
          options: ["true", "false", "5", "An error"],
          answer: 1,
          explain: 'Three equals signs compare the value and the type. The number 5 and the text "5" are different types, so the answer is false.',
        },
        {
          q: "What does this print?",
          code: 'const n = 15;\n\nif (n > 10) {\n  console.log("big");\n} else if (n > 5) {\n  console.log("medium");\n} else {\n  console.log("small");\n}',
          options: ["medium", "big and medium", "small", "big"],
          answer: 3,
          explain: "JavaScript runs only the first branch whose condition is true. 15 is greater than 10, so it prints big and skips the rest, even though 15 is also greater than 5.",
        },
        {
          q: "What does this print, line by line?",
          code: "const a = true;\nconst b = false;\nconsole.log(a && b);\nconsole.log(a || b);\nconsole.log(!a);",
          options: ["false, true, false", "true, true, false", "false, false, true", "true, false, true"],
          answer: 0,
          explain: "and needs both sides true, so a && b is false. or needs only one, so a || b is true. not flips a, so !a is false.",
        },
        {
          q: "Which of these is truthy?",
          options: ["0", '""', '"0"', "null"],
          answer: 2,
          explain: 'The number 0, empty text, and null are falsy. But "0" is text with a character in it, so it is truthy. A surprising one!',
        },
        {
          q: "What does this print?",
          code: 'const stock = 0;\nconsole.log(stock > 0 ? "In stock" : "Sold out");',
          options: ["In stock", "Sold out", "0", "false"],
          answer: 1,
          explain: "The ternary asks: is stock greater than 0? That is false, so it gives the value after the colon: Sold out.",
        },
        {
          q: "What does this print?",
          code: 'console.log(0 && "Hello");',
          options: ["Hello", "false", "0", "Nothing at all"],
          answer: 2,
          explain: "Zero is falsy, so && stops and gives back the left side: 0. In React, that 0 would show up on the page. Use a comparison like count > 0 && ... instead.",
        },
      ],
    },
  ],
};
