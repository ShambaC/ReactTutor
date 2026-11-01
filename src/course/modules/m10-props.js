// Module 10: components and props.
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
.page { max-width: 560px; margin: 0 auto; padding: 16px; }
header, footer { background: #4f46e5; color: white; padding: 12px 16px; border-radius: 10px; }
header h1 { margin: 0 0 4px; font-size: 1.5rem; }
header p, footer p { margin: 0; }
footer { margin-top: 16px; background: #374151; font-size: 0.9rem; }
main { padding: 12px 0; }
.pet-card, .card, .profile, .product, .song { background: white; border-radius: 10px; padding: 12px 16px; margin: 10px 0; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12); }
.pet-card h2, .card h2, .profile h2, .product h2, .song h2 { margin: 0 0 6px; font-size: 1.2rem; }
.pet-card p, .card p, .profile p, .product p, .song p { margin: 2px 0; }
.status { color: #059669; font-weight: 600; }
.status.waiting { color: #b45309; }
.badge { background: #fde68a; border-radius: 999px; padding: 2px 10px; font-size: 0.85rem; }
button { font-size: 1rem; padding: 6px 14px; border-radius: 8px; border: none; background: #4f46e5; color: white; cursor: pointer; }
`;

const base = { "index.html": indexHtml, "index.js": indexJs, "styles.css": css };

// ---------- Lesson 1: components ----------
const pageV0 = `export default function App() {
  return (
    <div className="page">
      <header>
        <h1>Paws Adoption Day</h1>
        <p>Find a friend for life</p>
      </header>
      <main>
        <p>Three lovely pets are waiting for a home.</p>
      </main>
      <footer>
        <p>Made with care by the shelter</p>
      </footer>
    </div>
  );
}
`;
const headerFn = `function Header() {
  return (
    <header>
      <h1>Paws Adoption Day</h1>
      <p>Find a friend for life</p>
    </header>
  );
}
`;
const footerFn = `function Footer() {
  return (
    <footer>
      <p>Made with care by the shelter</p>
    </footer>
  );
}
`;
const pageV1 = `${headerFn}
export default function App() {
  return (
    <div className="page">
      <Header />
      <main>
        <p>Three lovely pets are waiting for a home.</p>
      </main>
      <footer>
        <p>Made with care by the shelter</p>
      </footer>
    </div>
  );
}
`;
const pageV2 = `${headerFn}
${footerFn}
export default function App() {
  return (
    <div className="page">
      <Header />
      <main>
        <p>Three lovely pets are waiting for a home.</p>
      </main>
      <Footer />
    </div>
  );
}
`;
const pageV3 = `import Header from "./Header.jsx";

${footerFn}
export default function App() {
  return (
    <div className="page">
      <Header />
      <main>
        <p>Three lovely pets are waiting for a home.</p>
      </main>
      <Footer />
    </div>
  );
}
`;
const pageV4 = `import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function App() {
  return (
    <div className="page">
      <Header />
      <main>
        <p>Three lovely pets are waiting for a home.</p>
      </main>
      <Footer />
    </div>
  );
}
`;

const lessonComponents = {
  kind: "scrim",
  id: "m10-components",
  title: "Breaking a page into components",
  notes: md(`## Components are your own building blocks

A **component** is a function that returns JSX. Once you make one, you can use it like your own HTML tag.

~~~jsx
function Header() {
  return (
    <header>
      <h1>Paws Adoption Day</h1>
    </header>
  );
}

// use it:
<Header />
~~~

## Key ideas

- **Capital letter!** Component names start with a capital letter. ~<Header />~ is your component. ~<header>~ is the plain HTML tag.
- **One component per file** keeps things tidy. Put ~export default~ before the function, then ~import~ it where you need it.
- File names match the component: ~Header.jsx~ holds ~Header~.
- Components can be used inside other components. ~App~ is the **parent**. ~Header~ and ~Footer~ are its **children**.

~~~jsx
import Header from "./Header.jsx";
~~~

## Why bother?

- Change something once, and it changes everywhere it is used.
- Big pages become small, readable pieces.
- You can reuse a piece many times.

## Common mistakes

- Writing ~<footer />~ when you meant ~<Footer />~.
- Forgetting ~export default~, so the import finds nothing.
- Forgetting the ~.jsx~ in the import path.`),
  files: { ...base, "App.jsx": pageV0 },
  steps: [
    { say: "Welcome back! So far we've written one component, App. But real websites have hundreds of pieces. Today we'll learn to break a page into smaller parts, like building with LEGO bricks." },
    { say: "Here's our page. Look at the structure. There's a header at the top, a main part in the middle, and a footer at the bottom. All three live inside App.", open: "App.jsx", highlight: "<header>" },
    {
      say: "Let's pull the header out into its own component. I'll make a new function called Header, above App. It returns exactly the header code we had before.",
      files: { "App.jsx": pageV1 },
      highlight: "function Header() {",
    },
    {
      say: "Inside App, we replace the old header code with Header written like an H T M L tag: angle bracket, Header, slash, angle bracket. The page looks exactly the same, but the code is tidier.",
      highlight: "<Header />",
    },
    {
      say: "Notice the capital H. That matters a lot. React uses the capital letter to tell your components apart from normal H T M L tags. A lowercase header would be the real H T M L header tag, not ours.",
      highlight: "<Header />",
    },
    {
      say: "Let's do the same for the footer. A function called Footer, and then Footer as a tag inside App.",
      files: { "App.jsx": pageV2 },
      highlight: "<Footer />",
    },
    {
      say: "Real projects put each component in its own file. Watch. I create Header dot J S X, and put the function there. The only new thing is the words export default in front of it. That makes it available to other files.",
      files: {
        "Header.jsx": "export default " + headerFn,
        "App.jsx": pageV3,
      },
      open: "Header.jsx",
      highlight: "export default function Header() {",
    },
    {
      say: "Back in App dot J S X, we import it. Import Header from dot slash Header dot J S X. The dot slash means: look in this same folder. Now App is shorter and the page is unchanged.",
      open: "App.jsx",
      highlight: 'import Header from "./Header.jsx";',
    },
    {
      say: "Your turn! Footer is still inside App. Move it into its own file called Footer dot J S X, like I did with Header.",
      challenge: {
        task: md(`**Challenge:** give ~Footer~ its own file.

1. Create a new file named ~Footer.jsx~ and move the ~Footer~ function into it.
2. Put ~export default~ in front of the function.
3. In ~App.jsx~, delete the old function and add ~import Footer from "./Footer.jsx";~ at the top.

The page should look exactly the same afterwards. Press **Run** to check.`),
        hints: [
          "Use the new-file button in the editor to make Footer.jsx. Then cut the whole Footer function out of App.jsx and paste it there.",
          "At the top of Footer.jsx the line should read: export default function Footer() {",
          'At the top of App.jsx add: import Footer from "./Footer.jsx";',
        ],
        tests: [
          { name: "Footer.jsx exists and exports the component", code: 'const f = files()["Footer.jsx"]; return !!f && f.includes("export default");' },
          { name: "App.jsx imports Footer", code: 'return files()["App.jsx"].includes("import Footer from");' },
          { name: "The old Footer function is gone from App.jsx", code: 'return !files()["App.jsx"].includes("function Footer");' },
          { name: "The footer still shows on the page", code: 'return text("footer").includes("Made with care");' },
        ],
      },
    },
    {
      say: "Here's how I did it. Footer lives in Footer dot J S X, and App imports it. If your files look a little different but the page still works, that's great.",
      files: {
        "Footer.jsx": "export default " + footerFn,
        "App.jsx": pageV4,
      },
      open: "Footer.jsx",
      highlight: "export default function Footer() {",
    },
    {
      say: "Look how readable App is now. It reads like an outline: a Header, some main content, a Footer. App is the parent, and Header and Footer are its children. Developers call this the component tree.",
      open: "App.jsx",
      highlight: "<Header />",
    },
    {
      say: "There's one more thing to fix. Right now Header always says Paws Adoption Day, and Footer always says the same words. How can we use one component with different content each time? That's what props are for, and that's the next lesson.",
    },
  ],
};

// ---------- Lesson 2: props ----------
const petCard0 = `export default function PetCard() {
  return (
    <div className="pet-card">
      <h2>Biscuit</h2>
      <p>Dog, 3 years old</p>
    </div>
  );
}
`;
const petApp = (cards) => `import PetCard from "./PetCard.jsx";

export default function App() {
  return (
    <div className="page">
      <h1>Pets looking for a home</h1>
${cards}
    </div>
  );
}
`;
const petCardProps = (head, body) => `export default function PetCard(${head}) {
  return (
    <div className="pet-card">
${body}
    </div>
  );
}
`;
const petBody1 = `      <h2>{props.name}</h2>
      <p>Dog, 3 years old</p>`;
const petBody2 = `      <h2>{props.name}</h2>
      <p>{props.animal}, {props.age} years old</p>`;
const petBody3 = `      <h2>{name}</h2>
      <p>{animal}, {age} years old</p>`;
const petBody4 = `      <h2>{name}</h2>
      <p>{animal}, {age} years old</p>
      <p>Vet: {vet.name}, {vet.city}</p>
      <p className={adopted ? "status" : "status waiting"}>
        {adopted ? "Adopted!" : "Looking for a home"}
      </p>`;

const twoCards = `      <PetCard name="Biscuit" animal="Dog" age={3} />
      <PetCard name="Luna" animal="Cat" age={5} />`;
const threeCards = `${twoCards}
      <PetCard name="Pip" animal="Hamster" age={1} />`;
const fullCards = `      <PetCard
        name="Biscuit"
        animal="Dog"
        age={3}
        adopted={false}
        vet={{ name: "Dr. Lee", city: "Leeds" }}
      />
      <PetCard
        name="Luna"
        animal="Cat"
        age={5}
        adopted={true}
        vet={{ name: "Dr. Lee", city: "Leeds" }}
      />
      <PetCard
        name="Pip"
        animal="Hamster"
        age={1}
        adopted={false}
        vet={{ name: "Dr. Shah", city: "York" }}
      />`;

const lessonProps = {
  kind: "scrim",
  id: "m10-props",
  title: "Props: settings for your components",
  notes: md(`## Props make components reusable

**Props** (short for *properties*) are the settings you hand to a component, like attributes on an HTML tag.

~~~jsx
<PetCard name="Luna" animal="Cat" age={5} />
~~~

## Reading props

React gives your component one object holding all the props. Destructure it in the parameter to get the pieces:

~~~jsx
export default function PetCard({ name, animal, age }) {
  return <p>{name} is a {animal}, {age} years old.</p>;
}
~~~

## Strings vs everything else

- **Text** goes in quotes: ~name="Luna"~
- **Anything else** goes in curly braces: ~age={5}~, ~adopted={true}~
- An **object** needs two pairs of braces: ~vet={{ name: "Dr. Lee" }}~. The outer pair says "JavaScript here", the inner pair is the object itself.

## Remember

- The names must match: ~<PetCard animal="Cat" />~ is read as ~animal~ inside the component.
- A missing prop is ~undefined~, so the page shows nothing there.
- ~age="5"~ is the *text* 5. ~age={5}~ is the *number* 5.`),
  files: { ...base, "App.jsx": petApp("      <PetCard />"), "PetCard.jsx": petCard0 },
  steps: [
    { say: "Here is a PetCard component. It shows a dog called Biscuit. The App uses it once. It reads nicely, but let's see what happens when we want more than one pet.", open: "App.jsx", highlight: "<PetCard />" },
    {
      say: "Let's add a second card for our cat, Luna. We use PetCard again.",
      files: { "App.jsx": petApp("      <PetCard />\n      <PetCard />") },
    },
    { say: "Oops. We get Biscuit twice! The card has Biscuit written inside it, so every copy says Biscuit. We need a way to give each copy its own details.", open: "PetCard.jsx", highlight: "<h2>Biscuit</h2>" },
    {
      say: "The answer is props. You already know H T M L attributes, like src on an image tag. Props are attributes for your own components. Let's pass a name to each card.",
      files: { "App.jsx": petApp('      <PetCard name="Biscuit" />\n      <PetCard name="Luna" />') },
      open: "App.jsx",
      highlight: '<PetCard name="Luna" />',
    },
    {
      say: "Now PetCard has to read it. React hands every component one object called props. We write props as the function's parameter, and then props dot name gives us the name. Curly braces put it into the page.",
      files: { "PetCard.jsx": petCardProps("props", petBody1) },
      open: "PetCard.jsx",
      highlight: "{props.name}",
    },
    { say: "Biscuit and Luna, each with their own name. One component, two different results. That's the magic of props." },
    {
      say: "Let's pass more details: an animal and an age. Text goes in quotes. But the age is a number, so we use curly braces: age equals curly brace, three, curly brace. Curly braces mean: a JavaScript value is coming.",
      files: {
        "App.jsx": petApp('      <PetCard name="Biscuit" animal="Dog" age={3} />\n      <PetCard name="Luna" animal="Cat" age={5} />'),
        "PetCard.jsx": petCardProps("props", petBody2),
      },
      open: "App.jsx",
      highlight: 'age={3}',
    },
    {
      say: "Typing props dot every time gets tiring. Remember destructuring from earlier? We can pull the props out right in the parameter, with curly braces around the names. Now we write name, animal and age directly.",
      files: { "PetCard.jsx": petCardProps("{ name, animal, age }", petBody3) },
      open: "PetCard.jsx",
      highlight: "{ name, animal, age }",
    },
    {
      say: "Your turn. Add a third pet to App. Give it any name, animal and age you like. You only change App, because PetCard already knows how to show whatever it receives.",
      challenge: {
        task: md(`**Challenge:** add a third ~<PetCard />~ to ~App.jsx~ with its own ~name~, ~animal~ and ~age~.

For example, a hamster called Pip who is 1 year old. Remember: the age is a number, so use curly braces.

You do not need to touch ~PetCard.jsx~.`),
        hints: [
          "Copy one of the existing PetCard lines and paste it underneath.",
          "Change the words inside the quotes to make a new pet.",
          'For example: <PetCard name="Pip" animal="Hamster" age={1} />',
        ],
        tests: [
          { name: "The page shows three pet cards", code: 'return $$(".pet-card").length >= 3;' },
          { name: "Every pet has its own name", code: 'const names = $$(".pet-card h2").map((h) => h.textContent.trim()); return names.length >= 3 && new Set(names).size === names.length && names.every((n) => n.length > 0);' },
          { name: "Every card shows an age", code: 'return $$(".pet-card").every((c) => c.textContent.includes("years old") && /[0-9]/.test(c.textContent));' },
        ],
      },
    },
    {
      say: "Here's mine: Pip the hamster. Same pattern, new values. And PetCard didn't change at all. That's reuse!",
      files: { "App.jsx": petApp(threeCards) },
      open: "App.jsx",
      highlight: '<PetCard name="Pip" animal="Hamster" age={1} />',
    },
    {
      say: "Props can be booleans too, which means true or false. Let's add adopted. We use curly braces: adopted equals curly brace true. Inside PetCard, a ternary picks which message to show. You met ternaries earlier.",
      files: {
        "App.jsx": petApp(`      <PetCard name="Biscuit" animal="Dog" age={3} adopted={false} />
      <PetCard name="Luna" animal="Cat" age={5} adopted={true} />
      <PetCard name="Pip" animal="Hamster" age={1} adopted={false} />`),
        "PetCard.jsx": petCardProps("{ name, animal, age, adopted }", petBody3 + `
      <p className={adopted ? "status" : "status waiting"}>
        {adopted ? "Adopted!" : "Looking for a home"}
      </p>`),
      },
      open: "PetCard.jsx",
      highlight: '{adopted ? "Adopted!" : "Looking for a home"}',
    },
    {
      say: "You can even pass a whole object as a prop. Here is a vet, with a name and a city. See the double curly braces? The outer pair means JavaScript is coming. The inner pair is the object itself.",
      files: { "App.jsx": petApp(fullCards) },
      open: "App.jsx",
      highlight: 'vet={{ name: "Dr. Lee", city: "Leeds" }}',
    },
    {
      say: "Inside PetCard, vet is a normal object, so we read vet dot name and vet dot city.",
      files: { "PetCard.jsx": petCardProps("{ name, animal, age, adopted, vet }", petBody4) },
      open: "PetCard.jsx",
      highlight: "{vet.name}",
    },
    {
      say: "Great work! You can now build one component and use it many times with different props. Remember: text in quotes, everything else in curly braces. Next, we'll learn how to put whole chunks of content inside a component.",
    },
  ],
};

// ---------- Lesson 3: children + read-only ----------
const card = (head, body) => `export default function Card(${head}) {
${body}
}
`;
const card0 = card("{ title }", `  return (
    <div className="card">
      <h2>{title}</h2>
    </div>
  );`);
const card1 = card("{ title, children }", `  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );`);
const card2 = card("{ title, children }", `  const heading = title.toUpperCase();

  return (
    <div className="card">
      <h2>{heading}</h2>
      {children}
    </div>
  );`);
const card3 = card('{ title = "Untitled", children }', `  const heading = title.toUpperCase();

  return (
    <div className="card">
      <h2>{heading}</h2>
      {children}
    </div>
  );`);
const cardApp = (inner) => `import Card from "./Card.jsx";

export default function App() {
  return (
    <div className="page">
${inner}
    </div>
  );
}
`;
const welcomeCard = `      <Card title="Welcome">
        <p>Glad you are here!</p>
      </Card>`;
const shoppingCard = `      <Card title="Shopping">
        <ul>
          <li>Bread</li>
          <li>Milk</li>
        </ul>
      </Card>`;
const tipsCard = `      <Card title="Tips">
        <p>Take small steps.</p>
        <button>Got it</button>
      </Card>`;

const lessonChildren = {
  kind: "scrim",
  id: "m10-children",
  title: "Children and read-only props",
  notes: md(`## The children prop

Anything you put **between** a component's opening and closing tags arrives as a special prop called ~children~.

~~~jsx
<Card title="Shopping">
  <p>Bread and milk</p>
</Card>

function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
~~~

Now ~Card~ is a reusable box that can hold anything.

## Props are read-only

A component may **read** its props. It must **never change** them. Think of a recipe card someone handed you: you can read it and cook from it, but you do not rewrite it.

If you need a changed version, make a **new value**:

~~~jsx
const heading = title.toUpperCase();
~~~

Things that change over time belong in **state**, which you'll meet very soon.

## Default values

~~~jsx
function Card({ title = "Untitled", children }) { ... }
~~~

If nobody passes ~title~, the default is used.

## Common mistake

Forgetting ~{children}~ inside the component. The content is passed in, but nothing displays it.`),
  files: { ...base, "App.jsx": cardApp('      <Card title="Welcome" />'), "Card.jsx": card0 },
  steps: [
    { say: "Components can do more than show text. Sometimes we want to put things inside a component, like putting things inside a box. H T M L tags do this all the time. A div can hold paragraphs, lists, anything.", open: "Card.jsx" },
    {
      say: "Let's try the same with our Card. We put a paragraph between the opening and closing Card tags.",
      files: { "App.jsx": cardApp(welcomeCard) },
      open: "App.jsx",
      highlight: "<p>Glad you are here!</p>",
    },
    { say: "Hmm. Look at the preview. Our paragraph doesn't appear! We passed it in, but Card never displays it. Nothing is broken. We only have to tell Card where to put it." },
    {
      say: "React passes anything between the tags as a special prop called children. We add it to the destructured props, and then place curly braces children curly braces where we want the content to go.",
      files: { "Card.jsx": card1 },
      open: "Card.jsx",
      highlight: "{children}",
    },
    { say: "There it is! Welcome, and the paragraph inside the card. Children is a normal prop. React fills it in for us with whatever sits between the tags." },
    {
      say: "The best part: the inside can be anything. Let's add a second card with a list inside. Same Card component, totally different content.",
      files: { "App.jsx": cardApp(welcomeCard + "\n" + shoppingCard) },
      open: "App.jsx",
      highlight: '<Card title="Shopping">',
    },
    {
      say: "Your turn! Add a third Card with the title Tips. Inside it, put a paragraph with any tip you like, and a button.",
      challenge: {
        task: md(`**Challenge:** add a third card to ~App.jsx~.

- Its ~title~ is ~"Tips"~.
- Between its tags, put a ~<p>~ with a tip, and a ~<button>~.

You do not need to change ~Card.jsx~.`),
        hints: [
          "Copy the Shopping card and change what's inside it.",
          "A button looks like this: <button>Got it</button>",
          'The whole card: <Card title="Tips"><p>Take small steps.</p><button>Got it</button></Card>',
        ],
        tests: [
          { name: "There are three cards", code: 'return $$(".card").length >= 3;' },
          { name: 'One card has the title "Tips"', code: 'return $$(".card h2").some((h) => h.textContent.toLowerCase().includes("tips"));' },
          { name: "The Tips card has a paragraph and a button", code: 'const c = $$(".card").find((x) => x.querySelector("h2").textContent.toLowerCase().includes("tips")); return !!c && !!c.querySelector("p") && !!c.querySelector("button");' },
        ],
      },
    },
    {
      say: "Here's my Tips card. Notice we reused Card three times, and each one holds something different. Props like title, plus children for the content.",
      files: { "App.jsx": cardApp(welcomeCard + "\n" + shoppingCard + "\n" + tipsCard) },
      open: "App.jsx",
      highlight: '<Card title="Tips">',
    },
    {
      say: "Now an important rule. A component may read its props, but it must never change them. Think of a recipe card handed to you. You can cook from it, but you shouldn't cross things out.",
    },
    {
      say: "If you want a different version of a prop, make a new value. Here we make heading, an upper case copy of title, and show that instead. The original title stays untouched.",
      files: { "Card.jsx": card2 },
      open: "Card.jsx",
      highlight: "const heading = title.toUpperCase();",
    },
    {
      say: "One last trick: default values. If someone forgets to pass a title, we can fall back to Untitled by writing equals, Untitled, right in the destructuring. Without it, to upper case on a missing title would break.",
      files: { "Card.jsx": card3 },
      highlight: 'title = "Untitled"',
    },
    {
      say: "Wonderful. You can now build reusable boxes with children, and you know props only flow one way: in, and read-only. Time to practice!",
    },
  ],
};

// ---------- Practice ----------
const practiceFill = {
  kind: "practice",
  id: "m10-practice-profile",
  title: "Practice: profile cards",
  type: "fill",
  task: md(`Fill in the blanks (~___~) so the page shows **two** profile cards.

1. In ~ProfileCard.jsx~, the component reads its props with ~props.something~. Write the name of the prop in each blank (one is the person's name, the other is the job).
2. In ~App.jsx~, the second card should be for **Grace**. Fill in her name (text goes in quotes).

Press **Run** and then **Check my code**.`),
  files: {
    ...base,
    "App.jsx": `import ProfileCard from "./ProfileCard.jsx";

export default function App() {
  return (
    <div className="page">
      <h1>Our team</h1>
      <ProfileCard name="Ada" role="Engineer" years={7} />
      <ProfileCard name="___" role="Admiral" years={30} />
    </div>
  );
}
`,
    "ProfileCard.jsx": `export default function ProfileCard(props) {
  return (
    <div className="profile">
      <h2>{props.___}</h2>
      <p>{props.___} with {props.years} years of experience</p>
    </div>
  );
}
`,
  },
  solution: {
    "App.jsx": `import ProfileCard from "./ProfileCard.jsx";

export default function App() {
  return (
    <div className="page">
      <h1>Our team</h1>
      <ProfileCard name="Ada" role="Engineer" years={7} />
      <ProfileCard name="Grace" role="Admiral" years={30} />
    </div>
  );
}
`,
    "ProfileCard.jsx": `export default function ProfileCard(props) {
  return (
    <div className="profile">
      <h2>{props.name}</h2>
      <p>{props.role} with {props.years} years of experience</p>
    </div>
  );
}
`,
  },
  hints: [
    "App passes three props to each card: name, role and years. ProfileCard reads them as props.name, props.role and props.years.",
    "In ProfileCard.jsx, the first blank is the person's name and the second is their job (role).",
    'The answers are: name, role, and "Grace".',
  ],
  tests: [
    { name: "The page shows two profile cards", code: 'return $$(".profile").length === 2;' },
    { name: "Ada's card shows her name, role and years", code: 'const t = text(".profile"); return t.includes("Ada") && t.includes("Engineer") && t.includes("7 years");' },
    { name: "Grace's card shows her name, role and 30 years", code: 'const c = $$(".profile")[1]; return !!c && c.textContent.includes("Grace") && c.textContent.includes("Admiral") && c.textContent.includes("30 years");' },
  ],
};

const practiceFix = {
  kind: "practice",
  id: "m10-practice-fix",
  title: "Practice: fix the product card",
  type: "fix",
  task: md(`The shop page should show **Cozy Mug**, its price, and a **Sale** badge inside the product card. But the name is missing and so is the badge!

There are **two bugs**. Look at what ~App.jsx~ passes in, and what ~Product.jsx~ reads and displays.

Press **Run**, find the clues, then fix them and **Check my code**.`),
  files: {
    ...base,
    "App.jsx": `import Product from "./Product.jsx";
import Badge from "./Badge.jsx";

export default function App() {
  return (
    <div className="page">
      <h1>Cozy Shop</h1>
      <Product label="Cozy Mug" price={12}>
        <Badge>Sale</Badge>
      </Product>
    </div>
  );
}
`,
    "Product.jsx": `export default function Product({ name, price }) {
  return (
    <div className="product">
      <h2>{name}</h2>
      <p>Price: \${price}</p>
    </div>
  );
}
`,
    "Badge.jsx": `export default function Badge({ children }) {
  return <span className="badge">{children}</span>;
}
`,
  },
  solution: {
    "App.jsx": `import Product from "./Product.jsx";
import Badge from "./Badge.jsx";

export default function App() {
  return (
    <div className="page">
      <h1>Cozy Shop</h1>
      <Product name="Cozy Mug" price={12}>
        <Badge>Sale</Badge>
      </Product>
    </div>
  );
}
`,
    "Product.jsx": `export default function Product({ name, price, children }) {
  return (
    <div className="product">
      <h2>{name}</h2>
      <p>Price: \${price}</p>
      {children}
    </div>
  );
}
`,
  },
  hints: [
    "Bug 1: App passes a prop called label, but Product reads a prop called name. The names must match.",
    "Bug 2: Product never displays children, so the Badge inside it is thrown away.",
    "Change label to name in App.jsx, and add children to the destructuring in Product.jsx, then show {children} below the price.",
  ],
  tests: [
    { name: "The product name shows", code: 'return text(".product h2") === "Cozy Mug";' },
    { name: "The price shows", code: 'return text(".product").includes("$12");' },
    { name: "The Sale badge shows inside the product card", code: 'return text(".product .badge") === "Sale";' },
  ],
};

const practiceBuild = {
  kind: "practice",
  id: "m10-practice-greeting",
  title: "Practice: your own component",
  type: "build",
  task: md(`Make your very own component and use it more than once.

1. Create a new file called ~Greeting.jsx~.
2. In it, write a component named ~Greeting~ (with ~export default~) that returns ~<p className="hello">Hello from my component!</p>~
3. In ~App.jsx~, import it and use ~<Greeting />~ **two times**.

Press **Run** to see two greetings, then **Check my code**.`),
  files: {
    ...base,
    "App.jsx": `export default function App() {
  return (
    <div className="page">
      <h1>My first components</h1>
    </div>
  );
}
`,
  },
  solution: {
    "Greeting.jsx": `export default function Greeting() {
  return <p className="hello">Hello from my component!</p>;
}
`,
    "App.jsx": `import Greeting from "./Greeting.jsx";

export default function App() {
  return (
    <div className="page">
      <h1>My first components</h1>
      <Greeting />
      <Greeting />
    </div>
  );
}
`,
  },
  hints: [
    "A component is a function that returns JSX, and its name starts with a capital letter.",
    "In Greeting.jsx write: export default function Greeting() { return <p className=\"hello\">Hello from my component!</p>; }",
    'In App.jsx add import Greeting from "./Greeting.jsx"; at the top, then <Greeting /> twice inside the div.',
  ],
  tests: [
    { name: "Greeting.jsx exists and exports a component", code: 'const f = files()["Greeting.jsx"]; return !!f && f.includes("export default");' },
    { name: "App.jsx imports Greeting", code: 'return files()["App.jsx"].includes("import Greeting from");' },
    { name: "The greeting shows twice", code: 'return $$(".hello").length === 2 && text(".hello").includes("Hello from my component");' },
  ],
};

const quiz = {
  kind: "quiz",
  id: "m10-quiz",
  title: "Quick check: components and props",
  questions: [
    {
      q: "What are props?",
      options: [
        "Settings you pass into a component, like attributes on an H T M L tag",
        "Special files that hold your components",
        "Functions that change the page when clicked",
        "A way to save data forever",
      ],
      answer: 0,
      explain: "Props are the settings you give a component so one component can show different things. They look like H T M L attributes.",
    },
    {
      q: "What will this show on the page?",
      code: 'function Greeting({ name }) {\n  return <p>Hi {name}!</p>;\n}\n\n// used like this:\n<Greeting name="Sam" />',
      options: ["Hi name!", "Hi Sam!", "Hi !", "An error"],
      answer: 1,
      explain: "The prop name has the value Sam. Inside the component, curly braces put that value into the paragraph, so we see Hi Sam!",
    },
    {
      q: "Which line passes the number 5 as a real number?",
      options: ['<Pet age="5" />', "<Pet age={5} />", "<Pet age=5 />", "<Pet age:5 />"],
      answer: 1,
      explain: 'Curly braces tell React "this is JavaScript". With quotes, age would be the text 5, not the number 5. The other two are not valid.',
    },
    {
      q: "Spot the bug. The page shows nothing where the footer should be. Why?",
      code: 'function Footer() {\n  return <p>The end</p>;\n}\n\nexport default function App() {\n  return <footer />;\n}',
      options: [
        "Footer needs props to work",
        "App uses the lowercase footer tag instead of the Footer component",
        "You can't use a component inside App",
        "The paragraph needs a class name",
      ],
      answer: 1,
      explain: "A lowercase tag is the plain H T M L footer, and it is empty. Our component starts with a capital letter, so we need to write Footer with a capital F.",
    },
    {
      q: "A Box component has two paragraphs between its tags in App. What must Box do to show them?",
      code: "<Box>\n  <p>One</p>\n  <p>Two</p>\n</Box>",
      options: [
        "Nothing, they show automatically",
        "Read the children prop and place {children} in its JSX",
        "Read a prop called content",
        "Use props.paragraph",
      ],
      answer: 1,
      explain: "Whatever sits between the tags arrives as the children prop. Box has to put curly braces children curly braces somewhere in its JSX, or the content is ignored.",
    },
    {
      q: "Which statement about props is true?",
      options: [
        "A component should change its props whenever it likes",
        "Props are read-only: a component reads them, and makes new values if it needs a different version",
        "Props can only be strings",
        "Props only work for the App component",
      ],
      answer: 1,
      explain: "Props flow into a component and are read-only. If you want a changed value, create a new one, like an upper case copy. Values that change over time are for state, which is coming soon.",
    },
  ],
};

export default {
  id: "m10",
  title: "Components and props",
  summary: "Break pages into reusable components, give them settings with props, and put content inside them with children.",
  lessons: [lessonComponents, practiceBuild, lessonProps, practiceFill, lessonChildren, practiceFix, quiz],
};
