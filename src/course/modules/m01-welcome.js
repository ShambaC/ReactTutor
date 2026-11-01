// Module 1: orientation. Reference example for every other module (see docs/AUTHORING.md).
const html = `<!doctype html>
<html>
  <head>
    <title>My first page</title>
  </head>
  <body>
    <h1>Hello!</h1>
    <script type="module" src="index.js"></script>
  </body>
</html>
`;

export default {
  id: "m01",
  title: "Welcome to React Tutor",
  summary: "Meet the editor, the preview browser and the console, and write your very first line of code.",
  lessons: [
    {
      kind: "scrim",
      id: "m01-tour",
      title: "How this app works",
      notes: `## How lessons work

- **Lessons are interactive.** The code on the left is typed by your teacher, live. It is real code, not a video.
- **Pause any time** (click the play button or press the space bar). Then the editor is *yours*: change anything and press **Run** (or **Ctrl+S**).
- **Press play again** and the lesson continues from where it was. Your own version is saved, and the **My code** button brings it back.
- **The preview** on the right is a small web browser that shows your page.
- **The console** under the preview shows messages your code prints with \`console.log\`.
- **Purple dots** on the timeline are challenges. Playback stops there so you can try first.
- **Kit**, your AI tutor, is on the right. Ask anything, any time. There are no silly questions.

## Your first line of code

\`\`\`js
console.log("Hello!");
\`\`\`

\`console.log(...)\` prints whatever is inside the round brackets to the console. Text goes inside quotes.`,
      files: {
        "index.html": html,
        "index.js": "",
      },
      steps: [
        { say: "Hi, and welcome! I'm so glad you're here. In this app you learn by watching me write code, and by writing code yourself, right in the same place." },
        { say: "On the left is the code editor. That's where code lives. Right now we have two files. index dot H T M L describes the page, and index dot J S is where our JavaScript goes.", open: "index.html", highlight: "<h1>Hello!</h1>" },
        { say: "On the right is a tiny web browser called the preview. It shows the page our code makes. See the word Hello? That comes from this h1 line." },
        { say: "Now let's write our very first line of JavaScript. Watch the editor.", open: "index.js" },
        {
          say: "This line says console dot log, then round brackets, and inside them some text in quotes. It means: please print this message.",
          files: { "index.js": 'console.log("Hello from JavaScript!");\n' },
          highlight: 'console.log("Hello from JavaScript!");',
        },
        { say: "Look under the preview, at the console. There's our message! The console is where JavaScript can talk to us. Programmers use it all the time to check what their code is doing." },
        {
          say: "Here's the most important trick in this app. You can pause me at any moment, and the editor becomes yours. Try it now: the lesson will stop and wait for you.",
          challenge: {
            task: `**Your turn!** Change the message so it prints your own name, for example:

\`\`\`js
console.log("Hi, I'm Sam!");
\`\`\`

Then press **Run** (or **Ctrl+S**) and look at the console. When you're ready, press **play** to continue.`,
            hints: [
              "Click inside the editor on the left and change the words between the quotes.",
              "Keep the quotes and the round brackets. Only change the text inside the quotes.",
            ],
            tests: [{ name: "Something is printed to the console", code: "return logs.length > 0;" }],
          },
        },
        {
          say: "Welcome back! Whatever you typed is saved, and the My code button can bring it back later. Here's my version. You can print as many messages as you like, one per line.",
          files: { "index.js": 'console.log("Hello from JavaScript!");\nconsole.log("I am learning to code.");\n' },
          highlight: 'console.log("I am learning to code.");',
        },
        {
          say: "Computers run the lines from top to bottom, one after another. That's why the messages appear in the same order in the console.",
        },
        { say: "One more thing. If you ever feel stuck or confused, that's completely normal. Click Ask Kit on the right. Kit is a friendly tutor who will listen and help, no matter the question." },
        { say: "That's the whole tour! In the next lesson we'll use JavaScript to change the page itself. See you there." },
      ],
    },
    {
      kind: "practice",
      id: "m01-practice-log",
      title: "Practice: print and change",
      type: "fill",
      task: `Fill in the blanks (\`___\`) so that:

1. The console prints **Ready to learn!**
2. The heading on the page says **My learning journey**

Press **Run** to try it, then **Check my code**.`,
      files: {
        "index.html": html,
        "index.js": 'console.___("Ready to learn!");\n\nconst heading = document.querySelector("___");\nheading.textContent = "My learning journey";\n',
      },
      solution: {
        "index.js": 'console.log("Ready to learn!");\n\nconst heading = document.querySelector("h1");\nheading.textContent = "My learning journey";\n',
      },
      hints: [
        "The first blank is the word we use to print messages to the console.",
        "The second blank is the name of the tag for the big heading in index.html.",
        'The answers are `log` and `h1`.',
      ],
      tests: [
        { name: 'The console prints "Ready to learn!"', code: 'return logs.some((l) => l.includes("Ready to learn!"));' },
        { name: 'The heading says "My learning journey"', code: 'return text("h1") === "My learning journey";' },
      ],
    },
    {
      kind: "scrim",
      id: "m01-first-page",
      title: "JavaScript changes the page",
      notes: `## HTML and JavaScript work together

- **HTML** describes *what is on the page*: headings (\`<h1>\`), paragraphs (\`<p>\`), buttons (\`<button>\`).
- **JavaScript** makes the page *do things*: change text, react to clicks, load data.

\`\`\`js
const heading = document.querySelector("h1");
heading.textContent = "I changed this with JavaScript!";
\`\`\`

- \`document\` is the whole page.
- \`document.querySelector("h1")\` finds the first \`<h1>\` on the page.
- \`.textContent = "..."\` replaces the text inside it.
- \`const heading = ...\` gives that element a name so we can use it on the next line. You'll learn all about \`const\` in the next module.

React, which you'll learn soon, is a tool that does this kind of page-changing for you in a much easier way.`,
      files: {
        "index.html": html.replace("<h1>Hello!</h1>", "<h1>Hello!</h1>\n    <p>This page is about to change.</p>"),
        "index.js": "",
      },
      steps: [
        { say: "Welcome back! Last time we printed messages to the console. This time, JavaScript will change what you see on the page." },
        { say: "Our page has two things: a big heading, made with the h1 tag, and a paragraph, made with the p tag. H T M L tags come in pairs, an opening tag and a closing tag with a slash.", open: "index.html", highlight: "<p>This page is about to change.</p>" },
        { say: "Let's go to index dot J S and ask the page for the heading.", open: "index.js" },
        {
          say: "Document means the whole web page. Query selector means: find me something. We ask for h1, so we get the heading. We give it a name, heading, so we can use it again.",
          files: { "index.js": 'const heading = document.querySelector("h1");\n' },
          highlight: 'document.querySelector("h1")',
        },
        {
          say: "Now we change its text. heading dot text content equals some new words in quotes. Watch the preview when I finish typing.",
          files: { "index.js": 'const heading = document.querySelector("h1");\nheading.textContent = "I changed this with JavaScript!";\n' },
          highlight: 'heading.textContent = "I changed this with JavaScript!";',
        },
        { say: "The heading changed! The H T M L file still says Hello, but JavaScript ran afterwards and replaced the text. That's the power of JavaScript." },
        {
          say: "Your turn. Can you change the paragraph too? It works exactly the same way, but the paragraph tag is called p.",
          challenge: {
            task: `**Challenge:** use JavaScript to change the paragraph's text to anything you like.

1. Find the paragraph with \`document.querySelector("p")\` and give it a name.
2. Set its \`textContent\` to a new message in quotes.

Press **Run** to see it.`,
            hints: [
              "Copy the two heading lines and change them a little.",
              'You could write: `const paragraph = document.querySelector("p");`',
              'Then: `paragraph.textContent = "JavaScript is fun!";`',
            ],
            tests: [
              { name: "The paragraph has new text", code: 'return !text("p").includes("about to change") && text("p").length > 0;' },
              { name: "The heading still says it changed", code: 'return text("h1").includes("JavaScript");' },
            ],
          },
        },
        {
          say: "Here's how I did it. I found the paragraph, named it paragraph, and gave it new text. If yours uses a different name or message, that's perfect too.",
          files: { "index.js": 'const heading = document.querySelector("h1");\nheading.textContent = "I changed this with JavaScript!";\n\nconst paragraph = document.querySelector("p");\nparagraph.textContent = "JavaScript is fun!";\n' },
          highlight: 'paragraph.textContent = "JavaScript is fun!";',
        },
        { say: "Finding things on the page and changing them by hand works, but in big apps it gets messy fast. That's exactly the problem React solves, and you'll be building React apps sooner than you think." },
        { say: "Before React, we'll learn a few JavaScript basics, one small step at a time. You did great today. Let's practice!" },
      ],
    },
    {
      kind: "practice",
      id: "m01-practice-page",
      title: "Practice: make the page yours",
      type: "build",
      task: `This page has a heading and a paragraph. Write JavaScript in **index.js** so that:

1. The heading says **Welcome to my page**
2. The paragraph says anything you like about yourself
3. The console prints **Page updated!**

Use \`document.querySelector\`, \`.textContent\` and \`console.log\`, just like in the lesson.`,
      files: {
        "index.html": html.replace("<h1>Hello!</h1>", "<h1>Hello!</h1>\n    <p>Something about me.</p>"),
        "index.js": "// Write your code here\n",
      },
      solution: {
        "index.js": `const heading = document.querySelector("h1");
heading.textContent = "Welcome to my page";

const paragraph = document.querySelector("p");
paragraph.textContent = "I am learning JavaScript and React.";

console.log("Page updated!");
`,
      },
      hints: [
        "Start by finding the heading: `const heading = document.querySelector(\"h1\");`",
        "Change its text with `heading.textContent = \"Welcome to my page\";` and do the same for the paragraph with \"p\".",
        "Finish with `console.log(\"Page updated!\");`",
      ],
      tests: [
        { name: 'The heading says "Welcome to my page"', code: 'return text("h1") === "Welcome to my page";' },
        { name: "The paragraph has your own text", code: 'return text("p").length > 0 && text("p") !== "Something about me.";' },
        { name: 'The console prints "Page updated!"', code: 'return logs.some((l) => l.includes("Page updated!"));' },
      ],
    },
    {
      kind: "quiz",
      id: "m01-quiz",
      title: "Quick check: the basics",
      questions: [
        {
          q: "What does this line do?",
          code: 'console.log("Hi!");',
          options: ["Shows Hi! as a big heading on the page", "Prints Hi! in the console", "Opens a popup that says Hi!", "Nothing, it's a comment"],
          answer: 1,
          explain: "`console.log` prints a message in the console, the panel under the preview. It doesn't change the page itself.",
        },
        {
          q: "In what order will these messages appear in the console?",
          code: 'console.log("one");\nconsole.log("two");\nconsole.log("three");',
          options: ["three, two, one", "In a random order", "one, two, three", "Only three"],
          answer: 2,
          explain: "JavaScript runs lines from top to bottom, one after another, so the messages appear in the same order.",
        },
        {
          q: "Which line finds the first paragraph on the page?",
          options: ['document.querySelector("p")', 'console.log("p")', 'document.textContent("p")', '<p>'],
          answer: 0,
          explain: '`document.querySelector("p")` asks the page (the document) to find the first `<p>` element.',
        },
        {
          q: "You paused a lesson and changed the code. What happens when you press play?",
          options: ["Your changes are lost forever", "The lesson continues with the teacher's code, and your version is saved for later", "The app restarts", "You have to start the lesson again"],
          answer: 1,
          explain: "Your version is saved separately. The **My code** button brings it back whenever you're paused.",
        },
      ],
    },
  ],
};
