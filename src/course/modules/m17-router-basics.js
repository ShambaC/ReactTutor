// Module 17: React Router basics (declarative mode with BrowserRouter).
const md = (s) => s.replace(/§/g, "`");

const html = `<!doctype html>
<html>
  <head>
    <title>Router demo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="index.js"></script>
  </body>
</html>
`;

const css = `body { font-family: system-ui, sans-serif; margin: 0; color: #1f2937; }
nav { display: flex; gap: 16px; padding: 12px 20px; background: #eef2ff; }
nav a { color: #4338ca; text-decoration: none; padding-bottom: 2px; }
nav a.active { font-weight: bold; border-bottom: 2px solid #4338ca; }
main, .page { padding: 20px; }
footer { padding: 12px 20px; color: #6b7280; border-top: 1px solid #e5e7eb; }
`;

const indexPlain = `import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(<App />);
`;

const indexRouter = `import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
`;

const pagesHA = `function Home() {
  return <h1>Welcome home</h1>;
}

function About() {
  return <h1>About this app</h1>;
}
`;
const contactFn = `
function Contact() {
  return <h1>Contact us</h1>;
}
`;

// ---------- scrim 1 ----------
const s1App0 = `${pagesHA}
export default function App() {
  return (
    <div>
      <Home />
    </div>
  );
}
`;
const s1App1 = `import { Routes, Route } from "react-router";

${pagesHA}
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
`;
const s1App2 = s1App1.replace(
  `      <Route path="/" element={<Home />} />\n`,
  `      <Route path="/" element={<Home />} />\n      <Route path="/about" component={About} />\n`,
);
const s1App3 = s1App2.replace("component={About}", "element={<About />}");
const s1App4 = `import { Routes, Route } from "react-router";

${pagesHA}${contactFn}
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}
`;

// ---------- scrim 2 ----------
const s2Pages = `${pagesHA}${contactFn}`;
const s2Routes = `      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
`;
const s2App0 = `import { Routes, Route } from "react-router";

${s2Pages}
export default function App() {
  return (
    <div>
${s2Routes}    </div>
  );
}
`;
const s2App1 = s2App0.replace(`    <div>\n`, `    <div>\n      <a href="/about">About</a>\n`);
const s2App2 = s2App1.replace(`import { Routes, Route }`, `import { Routes, Route, Link }`).replace(`<a href="/about">About</a>`, `<Link to="/about">About</Link>`);
const navTwo = `
function Nav() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </nav>
  );
}
`;
const navThree = `
function Nav() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
    </nav>
  );
}
`;
const appWithNav = (head, nav, pages) => `${head}
${pages}${nav}
export default function App() {
  return (
    <div>
      <Nav />
${s2Routes}    </div>
  );
}
`;
const s2App3 = appWithNav(`import { Routes, Route, Link } from "react-router";\n`, navTwo, s2Pages);
const s2App4 = appWithNav(`import { Routes, Route, Link } from "react-router";\n`, navThree, s2Pages);
const s2App5 = s2App4.replace(`import { Routes, Route, Link }`, `import { Routes, Route, NavLink }`).replace(/<Link /g, "<NavLink ").replace(/<\/Link>/g, "</NavLink>");
const s2App6 = s2App5
  .replace(`\nfunction Nav() {`, `\nconst linkClass = ({ isActive }) => (isActive ? "active" : "");\n\nfunction Nav() {`)
  .replace(/<NavLink to="([^"]+)">/g, `<NavLink to="$1" className={linkClass}>`);

// ---------- scrim 3 ----------
const s3Pages = `${pagesHA}`;
const s3Nav = `
function Nav() {
  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/about">About</NavLink>
    </nav>
  );
}
`;
const s3Routes = (extra) => `      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
${extra}      </Routes>
`;
const notFound1 = `
function NotFound() {
  return <h1>Page not found</h1>;
}
`;
const notFound2 = `
function NotFound() {
  return (
    <div>
      <h1>Page not found</h1>
      <Link to="/">Go back home</Link>
    </div>
  );
}
`;
const s3App0 = `import { Routes, Route, NavLink } from "react-router";

${s3Pages}${s3Nav}
export default function App() {
  return (
    <div>
      <Nav />
${s3Routes("")}    </div>
  );
}
`;
const s3App1 = `import { Routes, Route, NavLink } from "react-router";

${s3Pages}${notFound1}${s3Nav}
export default function App() {
  return (
    <div>
      <Nav />
${s3Routes(`        <Route path="*" element={<NotFound />} />\n`)}    </div>
  );
}
`;
const s3App2 = s3App1.replace(`import { Routes, Route, NavLink }`, `import { Routes, Route, NavLink, Link }`).replace(notFound1, notFound2);
const layoutFn = (footer) => `
function Layout({ children }) {
  return (
    <div>
      <Nav />
      <main>{children}</main>
${footer}    </div>
  );
}
`;
const s3App3 = `import { Routes, Route, NavLink, Link } from "react-router";

${s3Pages}${notFound2}${s3Nav}${layoutFn("")}
export default function App() {
  return (
    <Layout>
${s3Routes(`        <Route path="*" element={<NotFound />} />\n`).replace(/^/gm, "  ").replace(/^ {2}$/gm, "")}    </Layout>
  );
}
`;
const s3App4 = s3App3.replace(`      <main>{children}</main>\n`, `      <main>{children}</main>\n      <footer>Made with React Router</footer>\n`);

const scrim1 = {
  kind: "scrim",
  id: "m17-first-routes",
  title: "One app, many pages",
  notes: md(`## Routing in one picture

Think of a building with many rooms. The **URL** in the address bar is the room number. **Routing** means: look at the URL, then show the right room (page).

You still have *one* React app. The router decides which component to show.

§§§jsx
// index.js: wrap the whole app once
<BrowserRouter>
  <App />
</BrowserRouter>

// App.jsx: the list of rules
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
</Routes>
§§§

- §BrowserRouter§ watches the address bar. Everything that uses routing must be **inside** it.
- §Routes§ holds the rules. §Route§ says: *when the path is this, show this element*.
- §element§ takes a **tag**, like §<About />§, not a bare name.

## Mistakes are clues

- Error "§useRoutes() may be used only in the context of a <Router>§": you forgot §BrowserRouter§.
- A Route that shows a blank page: you probably wrote §component=§ instead of §element=§.`).replace(/§§§/g, "```"),
  files: { "index.html": html, "styles.css": css, "index.js": indexPlain, "App.jsx": s1App0 },
  steps: [
    { say: "Welcome! Today we teach your app to have many pages. Think of a building with lots of rooms. The address, called the U R L, is the room number. Routing means showing the right room for that number.", path: "/" },
    { say: "Look at the bar above the preview. That's the address bar, and it says slash. Slash means the front door, the home page. As we add pages, watch this bar change.", path: "/", open: "App.jsx" },
    {
      say: "Here is our app. It always shows Home. Let's add routing. We import Routes and Route from react router, and describe one rule: when the path is slash, show Home.",
      files: { "App.jsx": s1App1 },
      highlight: '<Route path="/" element={<Home />} />',
    },
    { say: "A red error! Don't worry. Errors are clues. It says routes may only be used inside a Router. A Router is the helper that watches the address bar, and we forgot to add one.", open: "App.jsx" },
    {
      say: "Open index dot J S. We wrap our whole app in B-r-o-w-s-e-r Router, imported from react router. Now everything inside can use routing.",
      files: { "index.js": indexRouter },
      highlight: "<BrowserRouter>",
    },
    { say: "The home page is back. Routes is a list of rules. Each Route has a path, which is the room number, and an element, which is what to show in that room.", open: "App.jsx", highlight: "<Routes>" },
    {
      say: "Let's add an about page at slash about. I'm going to type it a slightly wrong way, on purpose, so we can learn from it.",
      files: { "App.jsx": s1App2 },
      highlight: '<Route path="/about" component={About} />',
      path: "/about",
    },
    { say: "The address says slash about, but the page is blank. No red error, so this is a sneaky one. The clue: React Router doesn't know the word component. It wants element.", path: "/about" },
    {
      say: "The fix: element, equals, and then the tag itself, About inside angle brackets. An element is a tag, not only a name.",
      files: { "App.jsx": s1App3 },
      highlight: '<Route path="/about" element={<About />} />',
      path: "/about",
    },
    { say: "There's the about page! And look, the page changed without reloading. React swapped one component for another. One app, many pages.", path: "/about" },
    {
      say: "Your turn! Add a Contact page. Make a Contact component with a heading, then a Route for slash contact. Check it with the buttons.",
      path: "/about",
      challenge: {
        task: md(`**Challenge:** add a third page.

1. Write a §Contact§ component that returns an §<h1>§ saying **Contact us**.
2. Add a §<Route>§ for the path §/contact§ that shows it.

To try it, type §/contact§ in the preview's address bar.`),
        hints: [
          "Copy the About component and change its name and its words.",
          'Add a line inside <Routes>: <Route path="/contact" element={<Contact />} />',
          "Remember: element takes a tag, so write <Contact /> with angle brackets.",
        ],
        tests: [
          { name: "/contact shows the Contact us heading", code: `await goto("/contact"); return text("h1").includes("Contact us");` },
          { name: "/about still works", code: `await goto("/about"); return text("h1").includes("About");` },
          { name: "The home page still works", code: `await goto("/"); return text("h1").includes("Welcome home");` },
        ],
      },
    },
    {
      say: "Here's how I did it. A Contact component and one more Route. If yours looks a little different, that's fine, as long as slash contact works.",
      files: { "App.jsx": s1App4 },
      highlight: '<Route path="/contact" element={<Contact />} />',
      path: "/contact",
    },
    { say: "Quick recap. Wrap the app in Browser Router once. List your pages with Routes and Route. Give each a path and an element. Next time we'll add real links to move between pages." },
  ],
};

const scrim2 = {
  kind: "scrim",
  id: "m17-links-nav",
  title: "Links and the navigation bar",
  notes: md(`## Moving between pages

§§§jsx
import { Link, NavLink } from "react-router";

<Link to="/about">About</Link>
<NavLink to="/about">About</NavLink>
§§§

- A plain §<a href="/about">§ asks the server for a brand new page. In a real browser that **reloads everything** and your app forgets what it remembered (a counter, a typed word).
- §<Link to="/about">§ looks the same but **stops the reload**. React Router changes the URL and swaps the page.
- Use §to§ with §Link§, not §href§.
- §<NavLink>§ is a Link that knows if it points at the page you are on. It adds the class §active§ (and §aria-current="page"§) so you can style it.
- Put your links in a §Nav§ component and show it above §<Routes>§. It stays put while pages change.

## Custom active style

§§§jsx
const linkClass = ({ isActive }) => (isActive ? "active" : "");
<NavLink to="/about" className={linkClass}>About</NavLink>
§§§`).replace(/§§§/g, "```"),
  files: { "index.html": html, "styles.css": css, "index.js": indexRouter, "App.jsx": s2App0 },
  steps: [
    { say: "Last time we visited pages by typing in the address bar. Real visitors click links. Let's add some, and learn an important difference.", path: "/" },
    {
      say: "The first idea that comes to mind is an ordinary H T M L link: an a tag with an h-ref of slash about. Let's try it.",
      files: { "App.jsx": s2App1 },
      highlight: '<a href="/about">About</a>',
    },
    { say: "Here is the catch. In a real browser, an a tag throws the page away and asks the server for a new one. Your whole app restarts and forgets everything, like a counter you clicked. Our practice browser hides this, but remember it." },
    {
      say: "React Router has its own link. Import Link, and write it with a prop called to. The to prop takes the path we want.",
      files: { "App.jsx": s2App2 },
      highlight: '<Link to="/about">About</Link>',
    },
    { say: "On the screen it looks the same. Underneath it's still a real link. But when you click, React Router stops the reload, changes the address, and swaps the page. Fast, and the app keeps its memory." },
    {
      say: "A menu needs several links. Let's make a Nav component with a nav tag, and links to Home and About. Then we show it above the Routes.",
      files: { "App.jsx": s2App3 },
      highlight: "<Nav />",
    },
    {
      say: "Now click around. The menu stays, and only the page below it changes. Your turn: our Contact page has no link yet. Add one to the Nav.",
      challenge: {
        task: md(`**Challenge:** add a **Contact** link to the menu.

Inside the §Nav§ component, add a §<Link>§ that goes to §/contact§ and says **Contact**. Then click it in the preview.`),
        hints: [
          "Copy one of the other Link lines inside <nav>.",
          'Change to="/about" to to="/contact".',
          'The finished line is: <Link to="/contact">Contact</Link>',
        ],
        tests: [
          { name: "There is a link to /contact", code: `return !!$('a[href="/contact"]');` },
          { name: "Clicking it shows the Contact page", code: `await click('a[href="/contact"]'); return path() === "/contact" && text("h1").includes("Contact us");` },
          { name: "Clicking Home goes back", code: `await click('a[href="/"]'); return path() === "/" && text("h1").includes("Welcome");` },
        ],
      },
    },
    {
      say: "Here's my version. One more Link in the menu. Notice we used Link and not an a tag, so there is no reload.",
      files: { "App.jsx": s2App4 },
      highlight: '<Link to="/contact">Contact</Link>',
      path: "/contact",
    },
    {
      say: "It would be nice if the menu showed where we are. React Router has a link for that: NavLink. Swap Link for NavLink, and our style sheet already has a style for the active link.",
      files: { "App.jsx": s2App5 },
      highlight: '<NavLink to="/contact">Contact</NavLink>',
      path: "/contact",
    },
    { say: "See how Contact is bold with a line under it? NavLink adds a class called active to the link that matches the address. Click the other links and watch the highlight move.", path: "/about" },
    {
      say: "You can decide the class yourself. className can be a function that receives is active, which is true or false. Return the class name you want. Behavior is the same, but now you are in control.",
      files: { "App.jsx": s2App6 },
      highlight: 'const linkClass = ({ isActive }) => (isActive ? "active" : "");',
      path: "/about",
    },
    { say: "Recap. Use Link instead of an a tag, so pages change without a reload. Use NavLink for menus, so the current page is highlighted. Next: what happens when someone visits a page that doesn't exist." },
  ],
};

const scrim3 = {
  kind: "scrim",
  id: "m17-layout-404",
  title: "Page not found and shared layouts",
  notes: md(`## The catch-all route

§§§jsx
<Route path="*" element={<NotFound />} />
§§§

- §*§ means *anything*. It catches every address that no other Route matched.
- React Router picks the **best** match, so the catch-all can sit at the end and only wins when nothing else fits.
- A good 404 page says what happened and gives a way out: §<Link to="/">Go back home</Link>§.

## A shared layout

Parts every page shares (menu, footer) belong in one component:

§§§jsx
function Layout({ children }) {
  return (
    <div>
      <Nav />
      <main>{children}</main>
      <footer>Made with React Router</footer>
    </div>
  );
}
§§§

Wrap §<Routes>§ in §<Layout>§ and every page gets the menu and footer. In the next module you'll learn a router-native version with §<Outlet />§.`).replace(/§§§/g, "```"),
  files: { "index.html": html, "styles.css": css, "index.js": indexRouter, "App.jsx": s3App0 },
  steps: [
    { say: "What happens if someone types an address that doesn't exist, like slash pizza? Let's visit and see.", path: "/pizza" },
    { say: "The menu is there, but below it nothing at all. No error, only no match. A blank page is confusing for visitors, so let's give them a friendly message.", path: "/pizza" },
    {
      say: "We write a NotFound component, and a Route with the path set to a single star. Star means anything. It catches every address no other Route wanted.",
      files: { "App.jsx": s3App1 },
      highlight: '<Route path="*" element={<NotFound />} />',
      path: "/pizza",
    },
    { say: "There's our message, Page not found. But it's a dead end. A kind page shows the visitor a way out.", path: "/pizza" },
    {
      say: "Let's add a Link back home inside NotFound. We import Link too, because a 404 page needs an exit door.",
      files: { "App.jsx": s3App2 },
      highlight: '<Link to="/">Go back home</Link>',
      path: "/pizza",
    },
    { say: "Does the star route break the other pages? No. React Router chooses the best match, and star is the weakest, so it only wins when nothing else fits. Slash about still works.", path: "/about" },
    {
      say: "Now notice our Nav sits right inside App. When an app grows, we want one place for everything pages share, like a menu and a footer. Let's make a Layout component that receives children.",
      files: { "App.jsx": s3App3 },
      highlight: "function Layout({ children }) {",
      path: "/about",
    },
    { say: "App wraps Routes in Layout. Whatever page matches appears where children goes, between the menu and the end. Every page shares one frame." },
    {
      say: "Your turn. Add a footer to the Layout, after the main part, with any text you like. Then check slash about and a page that doesn't exist.",
      challenge: {
        task: md(`**Challenge:** give every page a footer.

Inside §Layout§, after §<main>§, add a §<footer>§ with some text, for example **Made with React Router**.

It should appear on real pages *and* on the 404 page.`),
        hints: [
          "Layout returns a div. Add the footer inside that div.",
          "Put it right under the <main>{children}</main> line.",
          "<footer>Made with React Router</footer>",
        ],
        tests: [
          { name: "The About page has a footer", code: `await goto("/about"); return !!$("footer") && text("footer").length > 0;` },
          { name: "The 404 page has a footer too", code: `await goto("/zzz"); return !!$("footer") && text("h1").includes("not found");` },
          { name: "Only one menu is shown", code: `return $$("nav").length === 1;` },
        ],
      },
    },
    {
      say: "Here's my footer, one line in the Layout. And because every page lives inside Layout, even the not found page got it. That's the beauty of a shared frame.",
      files: { "App.jsx": s3App4 },
      highlight: "<footer>Made with React Router</footer>",
      path: "/zzz",
    },
    { say: "That's React Router basics! Browser Router, Routes and Route, Link and NavLink, a catch-all 404, and a layout. Next time: pages that change based on the address, like slash products slash two." },
  ],
};

const shopPages = `function Home() {
  return <h1>Welcome to the pizza shop</h1>;
}

function Menu() {
  return <h1>Our menu</h1>;
}

function Contact() {
  return <h1>Contact the shop</h1>;
}
`;
const shopApp = (nav, routes, imp = "Routes, Route") => `import { ${imp} } from "react-router";

${shopPages}
export default function App() {
  return (
    <div>
${nav}      <Routes>
${routes}      </Routes>
    </div>
  );
}
`;
const shopFilled = `        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/contact" element={<Contact />} />
`;
const shopBlank = `        <Route path="/" ___={<Home />} />
        <Route ___="/menu" element={<Menu />} />
        <Route path="/contact" ___={<Contact />} />
`;

const practiceFill = {
  kind: "practice",
  id: "m17-practice-routes",
  title: "Practice: the pizza shop pages",
  type: "fill",
  task: md(`The pizza shop has three pages, but the Routes have blanks (§___§). Fill them in so that:

1. §/§ shows **Welcome to the pizza shop**
2. §/menu§ shows **Our menu**
3. §/contact§ shows **Contact the shop**

Try each address in the preview's address bar, then press **Check my code**.`),
  files: { "index.html": html, "styles.css": css, "index.js": indexRouter, "App.jsx": shopApp("", shopBlank) },
  solution: { "App.jsx": shopApp("", shopFilled) },
  hints: [
    "Each Route needs two props: a path (the address) and an element (the tag to show).",
    "Two blanks are the word that goes before the tag in curly braces. One blank is the word before the address in quotes.",
    "The answers in order: element, path, element.",
  ],
  tests: [
    { name: "/ shows the welcome heading", code: `await goto("/"); return text("h1").includes("Welcome to the pizza shop");` },
    { name: "/menu shows the menu", code: `await goto("/menu"); return text("h1").includes("Our menu");` },
    { name: "/contact shows the contact page", code: `await goto("/contact"); return text("h1").includes("Contact the shop");` },
  ],
};

const practiceBuild = {
  kind: "practice",
  id: "m17-practice-nav",
  title: "Practice: build the menu bar",
  type: "build",
  task: md(`The pizza shop has pages but no menu. Build one.

1. Above the §<Routes>§, add a §<nav>§.
2. Inside it, add three §NavLink§s: **Home** (§/§), **Menu** (§/menu§) and **Contact** (§/contact§).
3. Use §NavLink§, so the link for the current page gets the class §active§.

Don't forget to import §NavLink§.`),
  files: { "index.html": html, "styles.css": css, "index.js": indexRouter, "App.jsx": shopApp("", shopFilled) },
  solution: {
    "App.jsx": shopApp(
      `      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/menu">Menu</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </nav>
`,
      shopFilled,
      "Routes, Route, NavLink",
    ),
  },
  hints: [
    "Add <nav> ... </nav> right above <Routes>. Inside, one NavLink per page.",
    "A NavLink looks like a Link: <NavLink to=\"/menu\">Menu</NavLink>. Remember to add NavLink to the import line.",
    "You need three: to=\"/\" Home, to=\"/menu\" Menu, to=\"/contact\" Contact.",
  ],
  tests: [
    { name: "The menu has links to /, /menu and /contact", code: `return ["/", "/menu", "/contact"].every((h) => !!$('nav a[href="' + h + '"]'));` },
    { name: "Clicking Menu shows the menu page", code: `await click('nav a[href="/menu"]'); return path() === "/menu" && text("h1").includes("Our menu");` },
    { name: "Clicking Contact shows the contact page", code: `await click('nav a[href="/contact"]'); return path() === "/contact" && text("h1").includes("Contact the shop");` },
    { name: "The link for the current page is active", code: `await goto("/menu"); const a = $("nav a.active"); return !!a && a.getAttribute("href") === "/menu";` },
  ],
};

const bakeryApp = (routeNF, nav, imp) => `import { ${imp} } from "react-router";

function Home() {
  return <h1>Fresh bread daily</h1>;
}

function About() {
  return <h1>About our bakery</h1>;
}

function NotFound() {
  return <h1>Page not found</h1>;
}

export default function App() {
  return (
    <div>
      <nav>
${nav}      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="${routeNF}" element={<NotFound />} />
      </Routes>
    </div>
  );
}
`;
const practiceFix = {
  kind: "practice",
  id: "m17-practice-fix",
  title: "Practice: fix the bakery site",
  type: "fix",
  task: md(`The bakery site runs, but it has two bugs:

1. An address that doesn't exist, like §/cake§, shows **nothing** instead of **Page not found**.
2. The menu uses ordinary §<a>§ tags, which reload the whole page in a real browser.

Fix both. Clues: which path means "anything else"? And which tag does React Router want for links?`),
  files: {
    "index.html": html,
    "styles.css": css,
    "index.js": indexRouter,
    "App.jsx": bakeryApp("/404", `        <a href="/">Home</a>\n        <a href="/about">About</a>\n`, "Routes, Route"),
  },
  solution: {
    "App.jsx": bakeryApp("*", `        <Link to="/">Home</Link>\n        <Link to="/about">About</Link>\n`, "Routes, Route, Link"),
  },
  hints: [
    "Visit /cake. The not-found Route only matches the exact address it was given.",
    "The path that matches anything is a single star. For the menu, import Link from react-router.",
    "Change path=\"/404\" to path=\"*\", and write <Link to=\"/about\">About</Link> (to, not href).",
  ],
  tests: [
    { name: "An unknown address shows Page not found", code: `await goto("/cake"); return text("h1").includes("Page not found");` },
    { name: "Real pages still work", code: `await goto("/about"); return text("h1").includes("About our bakery");` },
    { name: "The menu uses Link or NavLink, not plain a tags", code: `const src = files()["App.jsx"]; return /<(Nav)?Link\\b/.test(src) && !/<a\\s/.test(src);` },
    { name: "Clicking About changes the page", code: `await goto("/"); await click('a[href="/about"]'); return path() === "/about" && text("h1").includes("About our bakery");` },
  ],
};

const quiz = {
  kind: "quiz",
  id: "m17-quiz",
  title: "Quick check: React Router basics",
  questions: [
    {
      q: "Which component must wrap your app so routing works?",
      options: ["<Routes>", "<BrowserRouter>", "<Link>", "<Route>"],
      answer: 1,
      explain: "`<BrowserRouter>` watches the address bar for the whole app. Without it, `Routes` and `Link` show an error that says they must be used inside a Router.",
    },
    {
      q: "This Route shows a blank page. What is wrong?",
      code: '<Route path="/about" component={About} />',
      options: ["The path needs a capital letter", "It should use `element={<About />}`", "Routes can only have one Route", "About must be a class"],
      answer: 1,
      explain: "React Router doesn't know a prop called `component`. It wants `element`, and an element is a tag like `<About />`.",
    },
    {
      q: "Why use <Link to=\"/about\"> instead of <a href=\"/about\">?",
      options: ["Link is prettier", "Link changes the page without reloading the whole app", "a tags are not allowed in React", "Link works offline only"],
      answer: 1,
      explain: "A plain `a` tag makes the browser load a brand new page, so the app forgets everything. `Link` changes the URL and swaps the page while React keeps its memory.",
    },
    {
      q: "What does <Route path=\"*\" element={<NotFound />} /> do?",
      options: ["Shows NotFound on every page", "Shows NotFound when no other Route matches", "Hides the menu", "Redirects to the home page"],
      answer: 1,
      explain: "A star means anything. React Router prefers more specific paths, so the star route only wins when nothing else matches. It's perfect for a 404 page.",
    },
    {
      q: "What does NavLink add that Link does not?",
      options: ["It reloads the page", "It adds an `active` class to the link for the current page", "It works without a Router", "It makes the link open in a new tab"],
      answer: 1,
      explain: "`NavLink` knows whether its path matches the current address and adds the class `active` (plus `aria-current=\"page\"`), so menus can highlight where you are.",
    },
  ],
};

export default {
  id: "m17",
  title: "React Router basics",
  summary: "Give your app many pages: wrap it in a router, describe routes, add links and a menu, and handle pages that don't exist.",
  lessons: [scrim1, practiceFill, scrim2, practiceBuild, scrim3, practiceFix, quiz],
};
