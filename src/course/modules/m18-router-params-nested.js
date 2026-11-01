// Module 18: dynamic routes (useParams), useNavigate, nested routes with Outlet.
const md = (s) => s.replace(/§/g, "`");

const html = `<!doctype html>
<html>
  <head>
    <title>Shop</title>
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
.banner { margin: 0; padding: 8px 20px; background: #fef3c7; }
input { padding: 6px; margin-right: 8px; }
button { padding: 6px 12px; margin-right: 8px; }
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

const productsJs = `export const products = [
  { id: 1, name: "Cozy Mug", price: 12, category: "kitchen" },
  { id: 2, name: "Desk Plant", price: 18, category: "home" },
  { id: 3, name: "Notebook", price: 6, category: "office" },
  { id: 4, name: "Headphones", price: 59, category: "tech" },
];
`;

const fences = (s) => s.replace(/§§§/g, "```");

// ================= scrim 1: useParams =================
const s1List0 = `import { products } from "./products.js";

export default function ProductList() {
  return (
    <div className="page">
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}
`;
const s1List1 = `import { Link } from "react-router";
import { products } from "./products.js";

export default function ProductList() {
  return (
    <div className="page">
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <Link to={"/products/" + product.id}>{product.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
`;
const s1AppFn = (routes) => `import { Routes, Route, NavLink } from "react-router";
import ProductList from "./ProductList.jsx";
${routes.imp}
function Home() {
  return (
    <div className="page">
      <h1>Welcome to the shop</h1>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">Products</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
${routes.extra}      </Routes>
    </div>
  );
}
`;
const s1App0 = s1AppFn({ imp: "", extra: "" });
const s1App1 = s1AppFn({
  imp: `import ProductDetail from "./ProductDetail.jsx";\n`,
  extra: `        <Route path="/products/:id" element={<ProductDetail />} />\n`,
});
const detail0 = `export default function ProductDetail() {
  return (
    <div className="page">
      <h1>Product detail</h1>
    </div>
  );
}
`;
const detail1 = `import { useParams } from "react-router";

export default function ProductDetail() {
  const { id } = useParams();

  return (
    <div className="page">
      <h1>Product number {id}</h1>
    </div>
  );
}
`;
const detail2 = `import { useParams } from "react-router";
import { products } from "./products.js";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);

  return (
    <div className="page">
      <h1>{product.name}</h1>
      <p>Price: {product.price} dollars</p>
    </div>
  );
}
`;
const detail3 = detail2.replace("p.id === id", "p.id === Number(id)");
const detail4 = `import { Link, useParams } from "react-router";
import { products } from "./products.js";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="page">
        <p>We couldn't find that product.</p>
        <Link to="/products">See all products</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>{product.name}</h1>
      <p>Price: {product.price} dollars</p>
    </div>
  );
}
`;
const detail5 = detail4.replace(
  `      <p>Price: {product.price} dollars</p>\n    </div>\n  );\n}\n`,
  `      <p>Category: {product.category}</p>\n      <p>Price: {product.price} dollars</p>\n      <Link to="/products">Back to all products</Link>\n    </div>\n  );\n}\n`,
);

const scrim1 = {
  kind: "scrim",
  id: "m18-use-params",
  title: "One page for every product",
  notes: fences(md(`## URL parameters

A **parameter** is a changing part of the address. In the path, write it with a colon:

§§§jsx
<Route path="/products/:id" element={<ProductDetail />} />
§§§

Now §/products/1§, §/products/2§ and §/products/99§ all show §ProductDetail§. Inside it, ask for the value with §useParams§:

§§§jsx
const { id } = useParams();
const product = products.find((p) => p.id === Number(id));
§§§

## Remember

- Params are **always strings**. The URL has no numbers, only text. §"2" === 2§ is §false§, so convert with §Number(id)§ (or compare §String(p.id) === id§).
- The name after the colon (§:id§) is the name you destructure (§{ id }§).
- Always handle an unknown id: §find§ returns §undefined§, and reading §product.name§ of §undefined§ crashes.
- List pages link to detail pages: §<Link to={"/products/" + product.id}>§.`)),
  files: { "index.html": html, "styles.css": css, "index.js": indexRouter, "products.js": productsJs, "ProductList.jsx": s1List0, "App.jsx": s1App0 },
  steps: [
    { say: "Online shops don't have one hand-written page per product. They have one product page that shows a different product depending on the address. That's what we'll build.", path: "/products", open: "ProductList.jsx" },
    {
      say: "Here's a product list. First, let's turn each name into a Link that goes to slash products slash and the product's id. We build the address by adding the id onto the end.",
      files: { "ProductList.jsx": s1List1 },
      highlight: '<Link to={"/products/" + product.id}>{product.name}</Link>',
    },
    {
      say: "We can't write a Route for every product. Instead we use a placeholder. In the path we write a colon, then a name: colon id. It means: whatever is here, call it id. We also make a first, very plain ProductDetail page.",
      files: { "ProductDetail.jsx": detail0, "App.jsx": s1App1 },
      open: "App.jsx",
      highlight: '<Route path="/products/:id" element={<ProductDetail />} />',
    },
    { say: "Click a product. The address becomes slash products slash two, and our detail page shows. Slash products slash three shows the very same page. Now the page needs to know which product.", path: "/products/2", open: "ProductDetail.jsx" },
    {
      say: "The hook use params gives us the placeholder values. We write curly braces around id, because the placeholder was named id. Now we can show it in a heading.",
      files: { "ProductDetail.jsx": detail1 },
      highlight: "const { id } = useParams();",
      path: "/products/2",
    },
    {
      say: "Number two. The URL controls the page. Now let's look the product up. We import our products and use find to get the one whose id matches. I'll type the most natural way, and we'll see what happens.",
      files: { "ProductDetail.jsx": detail2 },
      highlight: "products.find((p) => p.id === id)",
      path: "/products/2",
    },
    { say: "A red error: cannot read properties of undefined, reading name. So product is undefined, meaning find found nothing. But product two exists! Here is the clue: the id from the address is a string, the text two. Our product ids are numbers. Text two is not the same as number two.", path: "/products/2" },
    {
      say: "Params are always strings, because an address is only text. We convert with Number. Now number two equals number two, and the Desk Plant appears.",
      files: { "ProductDetail.jsx": detail3 },
      highlight: "p.id === Number(id)",
      path: "/products/2",
    },
    { say: "Let's try an address with no product, slash products slash ninety nine. Same crash: product is undefined, and we asked for its name. Real visitors will type wrong addresses, so we must handle this.", path: "/products/99" },
    {
      say: "If there is no product, return early with a friendly message and a way out. A return inside an if means the rest of the component is skipped.",
      files: { "ProductDetail.jsx": detail4 },
      highlight: "We couldn't find that product.",
      path: "/products/99",
    },
    {
      say: "Your turn. Show the product's category on the page, and add a Link at the bottom that says Back to all products.",
      path: "/products/4",
      challenge: {
        task: md(`**Challenge:** improve the detail page.

1. Show the product's **category** in a paragraph.
2. Add a §<Link>§ to §/products§ that says **Back to all products**.

Try §/products/4§ in the address bar.`),
        hints: [
          "The product object has a category property, like name and price.",
          "Add <p>Category: {product.category}</p> under the heading.",
          'Add <Link to="/products">Back to all products</Link> inside the page div. Link is already imported.',
        ],
        tests: [
          { name: "/products/4 shows Headphones", code: `await goto("/products/4"); return text("h1") === "Headphones";` },
          { name: "The category is shown", code: `await goto("/products/4"); return text().includes("tech");` },
          { name: "There is a link back to /products inside the page", code: `await goto("/products/4"); const a = $('.page a[href="/products"]'); return !!a && /back/i.test(a.textContent);` },
          { name: "An unknown product still shows the friendly message", code: `await goto("/products/99"); return text().includes("couldn't find");` },
        ],
      },
    },
    {
      say: "Here's my version. A category line, and a Link back to the list. Because the guard clause runs first, an unknown id never reaches this code.",
      files: { "ProductDetail.jsx": detail5 },
      highlight: "Back to all products",
      path: "/products/4",
    },
    { say: "Recap. A colon in the path makes a parameter. Use params to read it. It is always a string, so convert it. And always handle an id that doesn't exist. Next: moving around with code instead of links." },
  ],
};

// ================= scrim 2: useNavigate =================
const nav2 = `        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>`;
const app2Fn = ({ head, nav, pages, routes }) => `${head}
${pages}
export default function App() {
  return (
    <div>
      <nav>
${nav}
      </nav>
      <Routes>
${routes}      </Routes>
    </div>
  );
}
`;
const homeAbout = `function Home() {
  return (
    <div className="page">
      <h1>Welcome</h1>
    </div>
  );
}

function About() {
  return (
    <div className="page">
      <h1>About us</h1>
    </div>
  );
}
`;
const baseRoutes = `        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
`;
const s2App0 = app2Fn({ head: `import { Routes, Route, NavLink } from "react-router";\n`, nav: nav2, pages: homeAbout, routes: baseRoutes });
const s2App1 = app2Fn({
  head: `import { Routes, Route, NavLink } from "react-router";\nimport Feedback from "./Feedback.jsx";\n`,
  nav: nav2 + `\n        <NavLink to="/feedback">Feedback</NavLink>`,
  pages: homeAbout,
  routes: baseRoutes + `        <Route path="/feedback" element={<Feedback />} />\n`,
});
const thanksPlain = `
function Thanks() {
  return (
    <div className="page">
      <h1>Thank you!</h1>
    </div>
  );
}
`;
const thanksBack = `
function Thanks() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <h1>Thank you!</h1>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}
`;
const thanksHome = `
function Thanks() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <h1>Thank you!</h1>
      <button onClick={() => navigate(-1)}>Back</button>
      <button onClick={() => navigate("/")}>Go home</button>
    </div>
  );
}
`;
const nav2f = nav2 + `\n        <NavLink to="/feedback">Feedback</NavLink>`;
const routes2f = baseRoutes + `        <Route path="/feedback" element={<Feedback />} />\n`;
const routes2t = routes2f + `        <Route path="/thanks" element={<Thanks />} />\n`;
const s2App2 = app2Fn({ head: `import { Routes, Route, NavLink } from "react-router";\nimport Feedback from "./Feedback.jsx";\n`, nav: nav2f, pages: homeAbout + thanksPlain, routes: routes2t });
const s2App3 = app2Fn({ head: `import { Routes, Route, NavLink, useNavigate } from "react-router";\nimport Feedback from "./Feedback.jsx";\n`, nav: nav2f, pages: homeAbout + thanksBack, routes: routes2t });
const s2App4 = app2Fn({ head: `import { Routes, Route, NavLink, useNavigate } from "react-router";\nimport Feedback from "./Feedback.jsx";\n`, nav: nav2f, pages: homeAbout + thanksHome, routes: routes2t });

const feedbackFn = (imp, hook, line) => `import { useState } from "react";
${imp}
export default function Feedback() {
${hook}  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
${line}  }

  return (
    <div className="page">
      <h1>Send feedback</h1>
      <form onSubmit={handleSubmit}>
        <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your message" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
`;
const fb0 = feedbackFn("", "", `    console.log("Feedback:", message);\n`);
const fb1 = feedbackFn(`import { useNavigate } from "react-router";\n`, `  const navigate = useNavigate();\n`, `    console.log("Feedback:", message);\n`);
const fb2 = feedbackFn(`import { useNavigate } from "react-router";\n`, `  const navigate = useNavigate();\n`, `    console.log("Feedback:", message);\n    navigate("/thanks");\n`);
const fb3 = fb2.replace(`navigate("/thanks");`, `navigate("/thanks", { replace: true });`);

const scrim2 = {
  kind: "scrim",
  id: "m18-use-navigate",
  title: "Navigating with code",
  notes: fences(md(`## useNavigate

A **Link** is for the person to click. Sometimes your **code** must decide to move to another page: after a form is sent, after logging in, or for a Back button.

§§§jsx
import { useNavigate } from "react-router";

const navigate = useNavigate();

navigate("/thanks");        // go to a page
navigate(-1);               // one step back, like the browser's Back button
navigate("/thanks", { replace: true }); // replace this page in the history
§§§

- Call §useNavigate()§ at the top of the component, then use the §navigate§ function it returns.
- In a button, write §onClick={() => navigate(-1)}§ with an **arrow function**. §onClick={navigate(-1)}§ would run it immediately while the page is drawing.
- After a form submit, call §event.preventDefault()§ first, then §navigate(...)§.
- §replace: true§ means the Back button skips the page you left, which is handy for forms.

Rule of thumb: **Link for clicks, navigate for code**.`)),
  files: { "index.html": html, "styles.css": css, "index.js": indexRouter, "App.jsx": s2App0 },
  steps: [
    { say: "Links are great when a person clicks on something. But sometimes our code decides where to go. For example, after someone sends a feedback form, we want to show a thank you page.", path: "/" },
    {
      say: "First, a feedback page with a small form. We've built forms before. Submitting it only prints the message in the console, for now.",
      files: { "Feedback.jsx": fb0, "App.jsx": s2App1 },
      open: "Feedback.jsx",
      highlight: "<form onSubmit={handleSubmit}>",
      path: "/feedback",
    },
    {
      say: "We also need a thank you page. I'll add a Thanks component to App dot J S, with a route for slash thanks.",
      files: { "App.jsx": s2App2 },
      highlight: '<Route path="/thanks" element={<Thanks />} />',
    },
    {
      say: "Now back in the form. React Router gives us a hook called use navigate. We import it, and call it at the top of the component. It hands us back a function, which we name navigate.",
      files: { "Feedback.jsx": fb1 },
      highlight: "const navigate = useNavigate();",
      path: "/feedback",
    },
    {
      say: "Inside handle submit, after prevent default, we call navigate with the address we want. Slash thanks. That's all. Code can now move the visitor to another page.",
      files: { "Feedback.jsx": fb2 },
      highlight: 'navigate("/thanks");',
      path: "/feedback",
    },
    { say: "Try it. Type a message and press Send. The address changes to slash thanks, and we see the thank you page. Same result as a link click, but our code did it.", path: "/thanks" },
    {
      say: "A Back button is another good use. In Thanks we call use navigate, and a button calls navigate with minus one. Minus one means one step back in history, exactly like the browser's back button.",
      files: { "App.jsx": s2App3 },
      open: "App.jsx",
      highlight: "<button onClick={() => navigate(-1)}>Back</button>",
      path: "/thanks",
    },
    { say: "Notice the arrow function in on click. If we wrote navigate minus one directly, it would run while the page is drawing, instead of when the button is clicked. The arrow function waits for the click.", path: "/thanks" },
    {
      say: "Your turn. Add a second button to the Thanks page that says Go home, and use navigate to send the visitor to slash.",
      path: "/thanks",
      challenge: {
        task: md(`**Challenge:** add a **Go home** button to the §Thanks§ page.

When clicked, it should use §navigate§ to go to §/§. (§useNavigate§ is already set up in §Thanks§.)`),
        hints: [
          "Copy the Back button line and change it.",
          'The path for the home page is "/".',
          'The finished line is: <button onClick={() => navigate("/")}>Go home</button>',
        ],
        tests: [
          { name: "There is a Go home button", code: `await goto("/thanks"); return $$("button").some((b) => /home/i.test(b.textContent));` },
          { name: "Clicking it goes to the home page", code: `await goto("/thanks"); await click($$("button").find((b) => /home/i.test(b.textContent))); return path() === "/";` },
          { name: "Sending the feedback form lands on /thanks", code: `await goto("/feedback"); await type("input", "Great lesson"); await click('button[type="submit"]'); await wait(100); return path() === "/thanks";` },
        ],
      },
    },
    {
      say: "Here's my version, one more button with navigate and the home path. Many apps do exactly this.",
      files: { "App.jsx": s2App4 },
      highlight: '<button onClick={() => navigate("/")}>Go home</button>',
      path: "/thanks",
    },
    {
      say: "One last trick. Right now, if you press Back from the thank you page, you return to the form. We can skip it by adding an option, replace true, so the form page is replaced in the history.",
      files: { "Feedback.jsx": fb3 },
      highlight: '{ replace: true }',
      open: "Feedback.jsx",
    },
    { say: "Recap. Link is for clicks. Use navigate for code: after a form, after logging in, or for a Back button. Next, we'll make our pages share layouts using nested routes." },
  ],
};

// ================= scrim 3: nested routes + Outlet =================
const navJsx = `import { NavLink } from "react-router";

export default function Nav() {
  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/products">Products</NavLink>
      <NavLink to="/about">About</NavLink>
    </nav>
  );
}
`;
const navJsx2 = navJsx.replace(`      <NavLink to="/about">About</NavLink>\n`, `      <NavLink to="/about">About</NavLink>\n      <NavLink to="/contact">Contact</NavLink>\n`);
const productsList = `        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <Link to={"/products/" + product.id}>{product.name}</Link>
            </li>
          ))}
        </ul>
`;
const pageFn = (name, title, inner, withNav) =>
  withNav
    ? `export function ${name}() {
  return (
    <div>
      <Nav />
      <div className="page">
        <h1>${title}</h1>
${inner}      </div>
    </div>
  );
}
`
    : `export function ${name}() {
  return (
    <div className="page">
      <h1>${title}</h1>
${inner.replace(/^ {2}/gm, "")}    </div>
  );
}
`;
const pagesFn = ({ withNav, extra }) => `import { Link } from "react-router";
${withNav ? `import Nav from "./Nav.jsx";
` : ""}import { products } from "./products.js";

${pageFn("Home", "Welcome", "", withNav)}
${pageFn("About", "About us", "", withNav)}
${pageFn("Products", "Products", productsList, withNav)}${extra ?? ""}`;
const pages0 = pagesFn({ withNav: true });
const pages1 = pagesFn({ withNav: false });
const contactFn = `
export function Contact() {
  return (
    <div className="page">
      <h1>Contact us</h1>
    </div>
  );
}
`;
const pages2 = pagesFn({ withNav: false, extra: contactFn });

const layoutJsx = `import { Outlet } from "react-router";
import Nav from "./Nav.jsx";

export default function Layout() {
  return (
    <div>
      <Nav />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
`;
const app3 = ({ imp, routes }) => `import { Routes, Route } from "react-router";
${imp}
export default function App() {
  return (
    <Routes>
${routes}    </Routes>
  );
}
`;
const imp0 = `import { Home, About, Products } from "./pages.jsx";\n`;
const impL = `import Layout from "./Layout.jsx";\n` + imp0;
const s3App0 = app3({
  imp: imp0,
  routes: `      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/about" element={<About />} />
`,
});
const s3App1 = app3({
  imp: impL,
  routes: `      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/about" element={<About />} />
      </Route>
`,
});
const s3App2 = app3({
  imp: impL,
  routes: `      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="about" element={<About />} />
      </Route>
`,
});
const impD = impL + `import ProductDetail from "./ProductDetail.jsx";\n`;
const s3App3 = app3({
  imp: impD,
  routes: `      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products">
          <Route index element={<Products />} />
          <Route path=":id" element={<ProductDetail />} />
        </Route>
        <Route path="about" element={<About />} />
      </Route>
`,
});
const impDC = `import Layout from "./Layout.jsx";\nimport { Home, About, Products, Contact } from "./pages.jsx";\nimport ProductDetail from "./ProductDetail.jsx";\n`;
const s3App4 = app3({
  imp: impDC,
  routes: s3App3.split("    <Routes>\n")[1].split("    </Routes>")[0].replace(`        <Route path="about" element={<About />} />\n`, `        <Route path="about" element={<About />} />\n        <Route path="contact" element={<Contact />} />\n`),
});
const impDCS = impDC + `import ShopLayout from "./ShopLayout.jsx";\n`;
const s3App5 = s3App4.replace(impDC, impDCS).replace(`<Route path="products">`, `<Route path="products" element={<ShopLayout />}>`);
const detailNested = `import { Link, useParams } from "react-router";
import { products } from "./products.js";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="page">
        <p>We couldn't find that product.</p>
        <Link to="/products">See all products</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>{product.name}</h1>
      <p>Price: {product.price} dollars</p>
    </div>
  );
}
`;
const shopLayout = `import { Outlet } from "react-router";

export default function ShopLayout() {
  return (
    <div>
      <p className="banner">Free shipping on orders over 50 dollars</p>
      <Outlet />
    </div>
  );
}
`;

const scrim3 = {
  kind: "scrim",
  id: "m18-nested-outlet",
  title: "Nested routes and layouts",
  notes: fences(md(`## Nested routes

Put routes **inside** other routes. The parent shows its own element, and the child appears where the parent has an §<Outlet />§ (a hole for the child page).

§§§jsx
function Layout() {
  return (
    <div>
      <Nav />
      <main><Outlet /></main>
    </div>
  );
}

<Routes>
  <Route element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="products">
      <Route index element={<Products />} />
      <Route path=":id" element={<ProductDetail />} />
    </Route>
    <Route path="about" element={<About />} />
  </Route>
</Routes>
§§§

- A **layout route** has an §element§ but no §path§. It wraps its children in a shared frame.
- An **index route** (§<Route index>§) is the parent's default page, shown at the parent's exact address.
- Child paths are **relative** and are added to the parent's: §"products"§ then §":id"§ gives §/products/:id§.
- Layouts can nest: a route with its own §element§ and §<Outlet />§ adds a frame around only its children.

Mistake to avoid: forgetting §<Outlet />§ in the layout. The pages will never show.`)),
  files: { "index.html": html, "styles.css": css, "index.js": indexRouter, "products.js": productsJs, "Nav.jsx": navJsx, "pages.jsx": pages0, "App.jsx": s3App0 },
  steps: [
    { say: "Look at our pages. Every single one starts with the Nav component. If we forget it on one page, that page has no menu. And every new page repeats the same line. There's a better way.", open: "pages.jsx", highlight: "<Nav />", path: "/" },
    {
      say: "We'll make a Layout component. It shows the Nav, and then a hole where the current page goes. That hole is called Outlet. Think of it as an empty picture frame the router fills in.",
      files: { "Layout.jsx": layoutJsx },
      highlight: "<Outlet />",
    },
    {
      say: "In App, we wrap our routes in a Route that has an element but no path. This is called a layout route. Its children, nested inside, appear in the Outlet.",
      files: { "App.jsx": s3App1 },
      highlight: "<Route element={<Layout />}>",
    },
    { say: "Two menus! The layout adds one, and each page still adds its own. That's a useful clue: the layout works. Now we can delete the Nav from the pages.", path: "/" },
    {
      say: "I removed the Nav from every page. Look how much smaller and cleaner they are. One menu, in one place, for all pages.",
      files: { "pages.jsx": pages1 },
      highlight: "export function Home() {",
    },
    {
      say: "Next, the home page. Instead of a path of slash, a nested route can be an index route. Index means: show this when the parent's address matches exactly. The other paths become relative, with no leading slash.",
      files: { "App.jsx": s3App2 },
      highlight: "<Route index element={<Home />} />",
      path: "/",
    },
    {
      say: "Now products. We want slash products for the list, and slash products slash colon id for the detail. So we nest: a route with path products, containing an index route for the list and a route with path colon id for the detail.",
      files: { "ProductDetail.jsx": detailNested, "App.jsx": s3App3 },
      open: "App.jsx",
      highlight: '<Route path=":id" element={<ProductDetail />} />',
      path: "/products/3",
    },
    { say: "Child paths are added to the parent's: products, then colon id, makes slash products slash colon id. Click around: the list, a detail page, and the menu never disappears.", path: "/products/3" },
    {
      say: "Your turn. Add a Contact page. Export a Contact component from pages dot J S X, add a nested Route with the path contact, and a link in the Nav.",
      path: "/products/3",
      challenge: {
        task: md(`**Challenge:** add a Contact page to the layout.

1. In §pages.jsx§, export a §Contact§ component with the heading **Contact us**.
2. In §App.jsx§, import it and add a child §<Route path="contact" ... />§ inside the layout route.
3. In §Nav.jsx§, add a §NavLink§ to §/contact§.

There should still be only **one** menu.`),
        hints: [
          "Copy the About component in pages.jsx and rename it.",
          'Inside the layout Route, add <Route path="contact" element={<Contact />} />. Remember to import Contact.',
          'In Nav.jsx add: <NavLink to="/contact">Contact</NavLink>',
        ],
        tests: [
          { name: "/contact shows Contact us", code: `await goto("/contact"); return text("h1").includes("Contact us");` },
          { name: "The menu has a Contact link that works", code: `await goto("/"); await click('a[href="/contact"]'); return path() === "/contact";` },
          { name: "There is only one menu", code: `await goto("/contact"); return $$("nav").length === 1;` },
        ],
      },
    },
    {
      say: "Here's my version. A new component, a new route as a child of the layout, and a link. Three small changes, and we never touched the other pages.",
      files: { "pages.jsx": pages2, "App.jsx": s3App4, "Nav.jsx": navJsx2 },
      open: "App.jsx",
      highlight: '<Route path="contact" element={<Contact />} />',
      path: "/contact",
    },
    {
      say: "Layouts can nest too. Say only the shop pages need a banner. We make a ShopLayout with its own Outlet, and give it to the products route as an element. Now the banner wraps both the list and the details, and nothing else.",
      files: { "ShopLayout.jsx": shopLayout, "App.jsx": s3App5 },
      open: "App.jsx",
      highlight: '<Route path="products" element={<ShopLayout />}>',
      path: "/products",
    },
    { say: "See the banner on the products pages, but not on About. That is nested routing: frames inside frames. You now know layouts, index routes and parameters. Time to practice!", path: "/about" },
  ],
};

// ================= practices =================
const fixApp = (linkPath, cmp) => `import { Routes, Route, Link, NavLink, useParams } from "react-router";
import { products } from "./products.js";

function ProductList() {
  return (
    <div className="page">
      <h1>Our products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <Link to={"${linkPath}" + product.id}>{product.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => ${cmp});

  if (!product) {
    return (
      <div className="page">
        <p>We couldn't find that product.</p>
        <Link to="/products">See all products</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>{product.name}</h1>
      <p>Price: {product.price} dollars</p>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <nav>
        <NavLink to="/products">Products</NavLink>
      </nav>
      <Routes>
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
      </Routes>
    </div>
  );
}
`;

const practiceFix = {
  kind: "practice",
  id: "m18-practice-fix",
  title: "Practice: fix the product pages",
  type: "fix",
  task: md(`The product list and detail pages are connected, but clicking a product doesn't show it. There are **two bugs**:

1. A link points to an address that doesn't match any Route.
2. The detail page says "We couldn't find that product" even for products that exist.

Clues: compare the Link's address with the Route's path. And remember: params are always **strings**.`),
  files: { "index.html": html, "styles.css": css, "index.js": indexRouter, "products.js": productsJs, "App.jsx": fixApp("/product/", "p.id === id") },
  solution: { "App.jsx": fixApp("/products/", "p.id === Number(id)") },
  hints: [
    "Click a product and look at the address bar. Then compare it with the path in the Route.",
    "One address says /product/ and the other says /products/. The second bug is in the find: id from the URL is text, and p.id is a number.",
    "Change the Link to \"/products/\" and use p.id === Number(id) (or String(p.id) === id).",
  ],
  tests: [
    { name: "The list links to /products/ID", code: `await goto("/products"); return !!$('a[href="/products/2"]');` },
    { name: "Clicking a product shows its name", code: `await goto("/products"); await click('a[href="/products/2"]'); return path() === "/products/2" && text("h1") === "Desk Plant";` },
    { name: "/products/4 shows Headphones", code: `await goto("/products/4"); return text("h1") === "Headphones";` },
    { name: "An unknown id shows the friendly message", code: `await goto("/products/99"); return text().includes("couldn't find");` },
  ],
};

const apiList = `import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="page">Loading products...</p>;
  }

  return (
    <div className="page">
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <Link to={"/products/" + product.id}>{product.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
`;
const apiApp = `import { Routes, Route, NavLink } from "react-router";
import ProductList from "./ProductList.jsx";
import ProductDetail from "./ProductDetail.jsx";

export default function App() {
  return (
    <div>
      <nav>
        <NavLink to="/">Products</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
      </Routes>
    </div>
  );
}
`;
const apiDetailStub = `export default function ProductDetail() {
  return (
    <div className="page">
      <p>TODO: build the detail page</p>
    </div>
  );
}
`;
const apiDetailSolution = `import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    setStatus("loading");
    fetch("/api/products/" + id)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Not found");
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setStatus("ready");
      })
      .catch(() => setStatus("missing"));
  }, [id]);

  if (status === "loading") {
    return <p className="page">Loading...</p>;
  }

  if (status === "missing") {
    return (
      <div className="page">
        <p>We couldn't find that product.</p>
        <Link to="/products">See all products</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>{product.name}</h1>
      <p>Price: {product.price} dollars</p>
      <Link to="/products">Back to all products</Link>
    </div>
  );
}
`;

const practiceBuild = {
  kind: "practice",
  id: "m18-practice-api-detail",
  title: "Practice: a product page that loads its data",
  type: "build",
  task: md(`The product **list** already loads from the fake API. Build \`ProductDetail.jsx\` so that \`/products/2\` shows the Desk Plant.

1. Read the id with §useParams§.
2. In §useEffect§, fetch §"/api/products/" + id§ (the effect should re-run when §id§ changes).
3. While loading, show **Loading...**
4. When it arrives, show the product's name in an §<h1>§ and its price.
5. If the product doesn't exist (the API answers with an error), show **We couldn't find that product.**
6. Add a §Link§ back to §/products§.

Tip: a failed answer has §res.ok§ equal to §false§.`),
  files: { "index.html": html, "styles.css": css, "index.js": indexRouter, "ProductList.jsx": apiList, "App.jsx": apiApp, "ProductDetail.jsx": apiDetailStub },
  solution: { "ProductDetail.jsx": apiDetailSolution },
  hints: [
    "Start from the ProductList code: useState for the data, useEffect for the fetch. Add useParams to get id.",
    "fetch(\"/api/products/\" + id). Put [id] in the dependency array so it reloads when the address changes. Use a status state: \"loading\", \"ready\" or \"missing\".",
    "After fetch, check `if (!res.ok) throw new Error(\"Not found\")`, then use .catch(() => setStatus(\"missing\")) to show the friendly message.",
  ],
  tests: [
    { name: "The code has a Loading... message", code: `return /Loading/.test(files()["ProductDetail.jsx"]);` },
    { name: "/products/2 shows the Desk Plant and its price", code: `await goto("/products/2"); await wait(700); return text("h1") === "Desk Plant" && text().includes("18");` },
    { name: "A different id shows a different product", code: `await goto("/products/4"); await wait(700); return text("h1") === "Headphones";` },
    { name: "An unknown id shows the friendly message", code: `await goto("/products/99"); await wait(700); return text().includes("couldn't find");` },
    { name: "There is a link back to /products", code: `await goto("/products/2"); await wait(700); return !!$('.page a[href="/products"]');` },
  ],
};

const loginApp = (a, b) => `import { useState } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router";

function Home() {
  return (
    <div className="page">
      <h1>Club house</h1>
      <p>Please log in to come inside.</p>
    </div>
  );
}

function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    navigate("${a}");
  }

  return (
    <div className="page">
      <h1>Log in</h1>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <h1>Welcome, friend!</h1>
      <button onClick={() => navigate("${b}")}>Log out</button>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/login">Log in</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
      </Routes>
    </div>
  );
}
`;

const practiceFillNav = {
  kind: "practice",
  id: "m18-practice-navigate",
  title: "Practice: log in and log out",
  type: "fill",
  task: md(`The club house app has a login form and a welcome page. The code uses §useNavigate§, but two addresses are blank (§"___"§). Fill them in so that:

1. Submitting the login form takes you to **/welcome**.
2. The **Log out** button on the welcome page takes you to **/login**.

Type a name, press **Log in**, then **Log out** to try it.`),
  files: { "index.html": html, "styles.css": css, "index.js": indexRouter, "App.jsx": loginApp("___", "___") },
  solution: { "App.jsx": loginApp("/welcome", "/login") },
  hints: [
    "navigate takes the address you want to go to, written as text in quotes.",
    "Look at the Route paths at the bottom of the file. The addresses are the same ones.",
    "The first blank is \"/welcome\" and the second is \"/login\".",
  ],
  tests: [
    { name: "Submitting the form goes to /welcome", code: `await goto("/login"); await type("input", "Sam"); await click('button[type="submit"]'); await wait(100); return path() === "/welcome" && text("h1").includes("Welcome, friend");` },
    { name: "Log out goes to /login", code: `await goto("/welcome"); await click($$("button").find((b) => /log out/i.test(b.textContent))); await wait(100); return path() === "/login";` },
  ],
};

const nestedApp = (shopOutlet, homeNav) => `import { Routes, Route, NavLink, Outlet, Link, useParams } from "react-router";
import { products } from "./products.js";

function Nav() {
  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/products">Products</NavLink>
    </nav>
  );
}

function Layout() {
  return (
    <div>
      <Nav />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function ShopLayout() {
  return (
    <div>
      <p className="banner">Free shipping on orders over 50 dollars</p>
${shopOutlet}    </div>
  );
}

function Home() {
  return (
    <div>
${homeNav}      <h1>Welcome to the shop</h1>
    </div>
  );
}

function ProductList() {
  return (
    <div className="page">
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <Link to={"/products/" + product.id}>{product.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return <p className="page">We couldn't find that product.</p>;
  }

  return (
    <div className="page">
      <h1>{product.name}</h1>
      <p>Price: {product.price} dollars</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<ShopLayout />}>
          <Route index element={<ProductList />} />
          <Route path=":id" element={<ProductDetail />} />
        </Route>
      </Route>
    </Routes>
  );
}
`;

const practiceFixNested = {
  kind: "practice",
  id: "m18-practice-fix-nested",
  title: "Practice: fix the nested layouts",
  type: "fix",
  task: md(`The shop uses a layout route and a nested shop layout, but two things are wrong:

1. The home page shows **two** menus.
2. On **/products** you see the banner, but the product list (and the detail pages) never appear.

Clues: where does a layout show its child page? And who already provides the menu?`),
  files: {
    "index.html": html,
    "styles.css": css,
    "index.js": indexRouter,
    "products.js": productsJs,
    "App.jsx": nestedApp("", "      <Nav />\n"),
  },
  solution: { "App.jsx": nestedApp("      <Outlet />\n", "") },
  hints: [
    "Compare ShopLayout with Layout. Layout has something that ShopLayout is missing.",
    "A layout needs an Outlet, the hole where the matching child route appears. And the Home page doesn't need its own Nav, since Layout already shows one.",
    "Add <Outlet /> under the banner in ShopLayout, and delete <Nav /> from Home.",
  ],
  tests: [
    { name: "The home page has exactly one menu", code: `await goto("/"); return $$("nav").length === 1 && text("h1").includes("Welcome to the shop");` },
    { name: "/products shows the banner and four products", code: `await goto("/products"); return text().includes("Free shipping") && $$("li").length === 4;` },
    { name: "/products/3 shows the Notebook", code: `await goto("/products/3"); return text("h1") === "Notebook" && text().includes("Free shipping");` },
    { name: "An unknown product shows the friendly message", code: `await goto("/products/99"); return text().includes("couldn't find");` },
  ],
};

const quiz = {
  kind: "quiz",
  id: "m18-quiz",
  title: "Quick check: params, navigate and nested routes",
  questions: [
    {
      q: "What does the colon mean in this path?",
      code: '<Route path="/products/:id" element={<ProductDetail />} />',
      options: ["The route is disabled", ":id is a placeholder that matches any value, like 1 or 99", "The id must be a number", "It matches only the text \":id\""],
      answer: 1,
      explain: "A colon makes a URL parameter: a placeholder for whatever is in that part of the address. You read its value in the component with `useParams`.",
    },
    {
      q: "The address is /products/5. What does this print?",
      code: 'const { id } = useParams();\nconsole.log(typeof id);',
      options: ["number", "string", "undefined", "object"],
      answer: 1,
      explain: "Addresses are text, so params are always strings. Convert with `Number(id)` when you need a number.",
    },
    {
      q: "Product 2 exists, but this page says \"not found\". What is the bug?",
      code: 'const { id } = useParams();\nconst product = products.find((p) => p.id === id);',
      options: ["find can't be used in React", "id is the string \"2\" but p.id is the number 2, so === is false", "useParams must be called twice", "products must be sorted first"],
      answer: 1,
      explain: "Strict equality compares types too, and \"2\" is not 2. Use `p.id === Number(id)`.",
    },
    {
      q: "Which button correctly goes one step back?",
      options: ["<button onClick={navigate(-1)}>", "<button onClick={() => navigate(-1)}>", "<button onClick=\"navigate(-1)\">", "<button navigate={-1}>"],
      answer: 1,
      explain: "`onClick` needs a function to call later. The arrow function waits for the click. `navigate(-1)` written directly would run while the page is drawing.",
    },
    {
      q: "What does <Outlet /> do inside a layout route?",
      options: ["Logs the user out", "Marks where the matching child route's page appears", "Creates a new route", "Loads data from the API"],
      answer: 1,
      explain: "`Outlet` is a hole in the layout. The router fills it with whichever child route matches, so menus and frames stay while the page inside changes.",
    },
  ],
};

export default {
  id: "m18",
  title: "Dynamic and nested routes",
  summary: "Build list and detail pages with URL parameters, move around with code, and share layouts with nested routes.",
  lessons: [scrim1, practiceFix, practiceBuild, scrim2, practiceFillNav, scrim3, practiceFixNested, quiz],
};
