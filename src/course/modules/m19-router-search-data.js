// Module 19: search params (useSearchParams) and data routers (createBrowserRouter, loaders, errorElement).
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
.error { color: #b91c1c; }
input, select { padding: 6px; margin: 0 8px 8px 0; }
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
  { id: 5, name: "Water Bottle", price: 15, category: "kitchen" },
  { id: 6, name: "Lamp", price: 34, category: "home" },
];
`;

// ================= scrim 1: useSearchParams =================
const s1App = `import { Routes, Route, Link } from "react-router";
import Products from "./Products.jsx";

function Home() {
  return (
    <div className="page">
      <h1>Welcome!</h1>
      <Link to="/products">See our products</Link>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
    </Routes>
  );
}
`;
const prodFn = ({ imp, hook, vars, filter, body, list = "products" }) => `${imp}import { products } from "./products.js";

export default function Products() {
${hook}${vars}${filter}
  return (
    <div className="page">
      <h1>Products</h1>
${body}      <ul>
        {${list}.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}
`;
const hookLine = `  const [searchParams, setSearchParams] = useSearchParams();\n`;
const impSP = `import { useSearchParams } from "react-router";\n`;
const qLine = `  const q = searchParams.get("q") || "";\n`;
const filterQ = `  const shown = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));\n`;
const inputQ = `      <input
        value={q}
        onChange={(e) => setSearchParams({ q: e.target.value })}
        placeholder="Search products"
      />
`;
const s1P0 = prodFn({ imp: "", hook: "", vars: "", filter: "", body: "" });
const s1P1 = prodFn({ imp: impSP, hook: hookLine, vars: "", filter: "", body: "" });
const s1P2 = prodFn({ imp: impSP, hook: hookLine, vars: qLine, filter: "", body: `      <p>You searched for: {q}</p>\n` });
const s1P3 = prodFn({ imp: impSP, hook: hookLine, vars: qLine, filter: filterQ, body: `      <p>You searched for: {q}</p>\n`, list: "shown" });
const s1P4 = prodFn({ imp: impSP, hook: hookLine, vars: qLine, filter: filterQ, body: inputQ, list: "shown" });
const s1P5 = s1P4.replace(
  `      <ul>\n`,
  `      {shown.length === 0 && <p>No products match your search.</p>}\n      <ul>\n`,
);
const s1P6 = `import { useSearchParams } from "react-router";
import { products } from "./products.js";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";

  const shown = products.filter((p) => {
    const matchesName = p.name.toLowerCase().includes(q.toLowerCase());
    const matchesCategory = category === "" || p.category === category;
    return matchesName && matchesCategory;
  });

  return (
    <div className="page">
      <h1>Products</h1>
      <input
        value={q}
        onChange={(e) => setSearchParams({ q: e.target.value, category })}
        placeholder="Search products"
      />
      <select value={category} onChange={(e) => setSearchParams({ q, category: e.target.value })}>
        <option value="">All categories</option>
        <option value="kitchen">Kitchen</option>
        <option value="home">Home</option>
        <option value="office">Office</option>
        <option value="tech">Tech</option>
      </select>
      {shown.length === 0 && <p>No products match your search.</p>}
      <ul>
        {shown.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}
`;

const scrim1 = {
  kind: "scrim",
  id: "m19-search-params",
  title: "Search boxes that live in the URL",
  notes: md(`## Search params

Anything after a §?§ in the address is a **search param** (also called a query string): §/products?q=mug§. Several are joined with §&§: §?q=mug&category=kitchen§.

§§§jsx
import { useSearchParams } from "react-router";

const [searchParams, setSearchParams] = useSearchParams();
const q = searchParams.get("q") || "";

<input value={q} onChange={(e) => setSearchParams({ q: e.target.value })} />
§§§

- §searchParams.get("q")§ reads one value. It gives §null§ when the param is missing, so add §|| ""§.
- §setSearchParams({ ... })§ changes the URL. React re-renders, like with §useState§.
- This is state **stored in the address**, so there is no §useState§ for it.

## Why put it in the URL?

- Reload the page and the search is still there.
- The Back button steps through earlier searches.
- You can copy the link and a friend sees the same results.

## Path params vs search params

- **Path** (§/products/2§): *which thing* to show.
- **Search** (§?q=mug§): *how* to view a list: filter, sort, page number.

Note: §setSearchParams§ replaces **all** params, so pass the others along too: §setSearchParams({ q, category: newValue })§.`).replace(/```/g, "```"),
  files: { "index.html": html, "styles.css": css, "index.js": indexRouter, "products.js": productsJs, "App.jsx": s1App, "Products.jsx": s1P0 },
  steps: [
    { say: "Imagine you search a shop for mug, and then send the link to a friend. If the search only lives in a variable, your friend sees all products. If it lives in the address, they see your results. Let's build that.", path: "/products", open: "Products.jsx" },
    { say: "Look at the address bar. After the path there can be a question mark, then a name, an equals sign, and a value. Like question mark q equals mug. These are called search params.", path: "/products?q=mug" },
    {
      say: "Our product list shows everything. Let's use the hook use search params. It works a bit like use state: it gives us a pair, the current params, and a function to change them.",
      files: { "Products.jsx": s1P1 },
      highlight: "const [searchParams, setSearchParams] = useSearchParams();",
      path: "/products?q=mug",
    },
    {
      say: "To read the value of q, we call search params dot get, with the name. If q isn't in the address, get returns null, so we add two bars and an empty string as a backup. Look at the page: it says mug.",
      files: { "Products.jsx": s1P2 },
      highlight: 'const q = searchParams.get("q") || "";',
      path: "/products?q=mug",
    },
    {
      say: "Now filter the list. We lowercase both the name and the search, so capital letters don't matter, and keep products whose name includes the search. Then we show shown instead of products.",
      files: { "Products.jsx": s1P3 },
      highlight: "const shown = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));",
      path: "/products?q=mug",
    },
    { say: "Only the Cozy Mug is left. We changed the address by hand, and the page followed. That's the idea: the URL is the state. Next we make a box that changes the address for us.", path: "/products?q=mug" },
    {
      say: "An input with value q, and on change we call set search params with an object. Type in the box and watch the address bar. Every key you press updates the URL, and the list follows.",
      files: { "Products.jsx": s1P4 },
      highlight: "onChange={(e) => setSearchParams({ q: e.target.value })}",
      path: "/products?q=",
    },
    { say: "Notice there is no use state anywhere. The address bar is our memory. Reload the page: the search is still there. Press Back: you step through your earlier searches. State in state variables can't do that.", path: "/products?q=lamp" },
    {
      say: "A small kindness: when nothing matches, say so, instead of showing an empty page. This line only appears when the shown list has length zero.",
      files: { "Products.jsx": s1P5 },
      highlight: "{shown.length === 0 && <p>No products match your search.</p>}",
      path: "/products?q=zzz",
    },
    {
      say: "Your turn. Add a category filter that also lives in the URL. A select box that sets the category param, and a filter that respects it, along with the search.",
      path: "/products?category=kitchen",
      challenge: {
        task: md(`**Challenge:** add a **category** filter stored in the URL.

1. Read §category§ with §searchParams.get("category") || ""§.
2. Only show products whose §category§ matches (or all, when it is empty).
3. Add a §<select>§ with options for **kitchen**, **home**, **office** and **tech** (plus an "All categories" option with value §""§). Changing it should set the §category§ param.
4. The search box should keep the category: §setSearchParams({ q: e.target.value, category })§.

Try §/products?category=kitchen§ in the address bar.`),
        hints: [
          "Copy how q is read and write one more line for category.",
          "In the filter, a product matches when category === \"\" or p.category === category. Combine it with the name check using &&.",
          "setSearchParams replaces all params, so each onChange passes both: { q, category: e.target.value } for the select, { q: e.target.value, category } for the input.",
        ],
        tests: [
          { name: "?category=kitchen shows only kitchen products", code: `await goto("/products?category=kitchen"); return text().includes("Cozy Mug") && text().includes("Water Bottle") && !text().includes("Lamp");` },
          { name: "?q=mug still searches by name", code: `await goto("/products?q=mug"); return text().includes("Cozy Mug") && !text().includes("Lamp");` },
          { name: "Search and category work together", code: `await goto("/products?q=bottle&category=kitchen"); const n = $$("li").length; await goto("/products?q=mug&category=home"); return n === 1 && $$("li").length === 0;` },
          { name: "Choosing a category in the select updates the URL", code: `await goto("/products"); const s = $("select"); if (!s) return false; Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set.call(s, "home"); s.dispatchEvent(new Event("change", { bubbles: true })); await wait(100); return location.search.includes("category=home") && !text().includes("Cozy Mug") && text().includes("Lamp");` },
        ],
      },
    },
    {
      say: "Here's my version. One new variable, a stricter filter, and a select. Notice each set search params call passes both values, because set search params replaces the whole query.",
      files: { "Products.jsx": s1P6 },
      highlight: "const matchesCategory = category === \"\" || p.category === category;",
      path: "/products?category=kitchen",
    },
    { say: "Recap. Path params say which thing. Search params say how to view a list: search, filter, page. Read them with get, change them with set search params, and the address bar remembers everything. Time to practice!" },
  ],
};

// ================= scrim 2: createBrowserRouter + loader =================
const s2App0 = `import { Routes, Route, NavLink } from "react-router";
import Products from "./Products.jsx";

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
        <Route path="/products" element={<Products />} />
      </Routes>
    </div>
  );
}
`;
const s2Prod0 = `import { useEffect, useState } from "react";

export default function Products() {
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
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}
`;
const appLayout = (extraLink = "", extraTop = "", impExtra = "") => `import { NavLink, Outlet${impExtra} } from "react-router";

export default function App() {
${extraTop}  return (
    <div>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">Products</NavLink>
${extraLink}      </nav>
      <Outlet />
    </div>
  );
}
`;
const s2AppOutlet = appLayout();
const s2AppQuotes = appLayout(`        <NavLink to="/quotes">Quotes</NavLink>\n`);
const idxFn = ({ imp, children }) => `import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App.jsx";
${imp}import "./styles.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
${children}    ],
  },
]);

createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);
`;
const homeChild = `      { index: true, element: <h1 className="page">Welcome to the shop</h1> },\n`;
const s2Idx1 = idxFn({ imp: `import Products from "./Products.jsx";\n`, children: homeChild + `      { path: "products", element: <Products /> },\n` });
const s2Idx2 = idxFn({ imp: `import Products, { productsLoader } from "./Products.jsx";\n`, children: homeChild + `      { path: "products", element: <Products />, loader: productsLoader },\n` });
const loaderFn = (name, url) => `export async function ${name}() {
  const res = await fetch("${url}");
  return res.json();
}
`;
const s2Prod2 = `import { useLoaderData } from "react-router";

${loaderFn("productsLoader", "/api/products")}
export default function Products() {
  const products = useLoaderData();

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
// the old effect version needs its imports at the very top
const s2ProdLoaderAddedFixed = s2Prod0.replace(`export default function Products() {`, loaderFn("productsLoader", "/api/products") + `\nexport default function Products() {`);
const quotesJsx = `import { useLoaderData } from "react-router";

${loaderFn("quotesLoader", "/api/quotes")}
export default function Quotes() {
  const quotes = useLoaderData();

  return (
    <div className="page">
      <h1>Quotes</h1>
      <ul>
        {quotes.map((quote) => (
          <li key={quote.id}>
            {quote.text} - {quote.author}
          </li>
        ))}
      </ul>
    </div>
  );
}
`;
const s2IdxQuotes = idxFn({
  imp: `import Products, { productsLoader } from "./Products.jsx";\nimport Quotes, { quotesLoader } from "./Quotes.jsx";\n`,
  children: homeChild + `      { path: "products", element: <Products />, loader: productsLoader },\n      { path: "quotes", element: <Quotes />, loader: quotesLoader },\n`,
});

const scrim2 = {
  kind: "scrim",
  id: "m19-data-router",
  title: "Data routers and loaders",
  notes: md(`## A second way to set up the router

So far we used §<BrowserRouter>§ with §<Routes>§. React Router also has a **data router**, where all routes are described as plain objects in one place:

§§§jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,            // a layout with <Outlet />
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Products />, loader: productsLoader },
    ],
  },
]);

createRoot(root).render(<RouterProvider router={router} />);
§§§

It's the same ideas as before: paths, elements, nesting, index routes, Outlet.

## Loaders

A **loader** is a function that fetches the data a route needs **before** the page shows. The page reads the result with §useLoaderData()§:

§§§jsx
export async function productsLoader() {
  const res = await fetch("/api/products");
  return res.json();
}

function Products() {
  const products = useLoaderData();
  ...
}
§§§

No §useEffect§, no §useState§, no loading flag inside the component.

## Remember

- Replace §<BrowserRouter>§ with §<RouterProvider router={router} />§. Don't use both.
- Pass the loader function itself (§loader: productsLoader§), don't call it.
- The loader runs on every visit to the route, so the data is always fresh.`).replace(/```/g, "```"),
  files: { "index.html": html, "styles.css": css, "index.js": indexRouter, "App.jsx": s2App0, "Products.jsx": s2Prod0 },
  steps: [
    { say: "Everything so far used Browser Router. React Router has a second style, called a data router. It lets the router fetch data for a page before the page shows. Let's convert this shop and see.", path: "/products", open: "Products.jsx" },
    { say: "Here's the products page we know well. It shows the page, then use effect fetches, then it updates. It works fine. In a data router, the route itself fetches, and the component gets finished data.", highlight: 'fetch("/api/products")', path: "/products" },
    {
      say: "First, App becomes our layout. It keeps the menu, and where the routes were we put an Outlet. The home page is leaving this file. The page looks empty for a moment, because the routes are about to move.",
      files: { "App.jsx": s2AppOutlet },
      highlight: "<Outlet />",
      path: "/products",
    },
    {
      say: "Now in index dot J S. We import create browser router and router provider. We describe our routes as an array of objects. The first object has a path, an element, and children. It's the same layout idea as before.",
      files: { "index.js": s2Idx1 },
      highlight: "const router = createBrowserRouter([",
      path: "/products",
    },
    { say: "Compare with what we had. A Route with path and element becomes an object with path and element. Nested Routes become a children array. Index true is the index route. And router provider replaces Browser Router. Same ideas, written as data.", highlight: "<RouterProvider router={router} />", path: "/products" },
    {
      say: "Now the new power: a loader. In Products dot J S X we export an async function that fetches and returns the data. It's an ordinary function, no hooks in sight.",
      files: { "Products.jsx": s2ProdLoaderAddedFixed },
      highlight: "export async function productsLoader() {",
      open: "Products.jsx",
      path: "/products",
    },
    {
      say: "We hand it to the route with the loader property. Notice there are no round brackets after the name. We pass the function, and the router calls it when someone visits slash products.",
      files: { "index.js": s2Idx2 },
      highlight: "loader: productsLoader",
      path: "/products",
    },
    {
      say: "Now the component gets simpler. Use loader data gives us whatever the loader returned. The use effect, the use state and the loading check can all be deleted. By the time this component runs, the data is already here.",
      files: { "Products.jsx": s2Prod2 },
      highlight: "const products = useLoaderData();",
      path: "/products",
    },
    { say: "The page looks the same, but the code is much shorter. The router waits for the data, then shows the page. In the next lesson, we'll show a message while it waits, and handle loaders that fail.", path: "/products" },
    {
      say: "Your turn. Add a quotes page. Make Quotes dot J S X with a loader for slash api slash quotes, show each quote's text and author, and add a route for slash quotes.",
      path: "/products",
      challenge: {
        task: md(`**Challenge:** add a **Quotes** page with its own loader.

1. Create §Quotes.jsx§ that exports an async §quotesLoader§ (fetch §/api/quotes§ and return the JSON) and a default §Quotes§ component that uses §useLoaderData()§.
2. Show each quote's §text§ in an §<li>§ (with a §key§!). Each quote also has an §author§.
3. In §index.js§, import them and add a child route: §{ path: "quotes", element: <Quotes />, loader: quotesLoader }§.

Try §/quotes§ in the address bar.`),
        hints: [
          "Copy Products.jsx and rename things: productsLoader to quotesLoader, the URL to /api/quotes.",
          "Quotes have text and author, so each list item can show {quote.text} - {quote.author}.",
          "In index.js: import Quotes, { quotesLoader } from \"./Quotes.jsx\"; then add the route object next to products.",
        ],
        tests: [
          { name: "/quotes shows the quotes", code: `await goto("/quotes"); await wait(700); return text().includes("Everyone was a beginner once.") && $$("li").length === 3;` },
          { name: "Products still load", code: `await goto("/products"); await wait(700); return $$("li").length === 6;` },
          { name: "Quotes.jsx uses useLoaderData", code: `return /useLoaderData\\(/.test(files()["Quotes.jsx"] || "");` },
        ],
      },
    },
    {
      say: "Here's my version. The same shape as products: a loader, a component using use loader data, and one more route object. I also added a menu link.",
      files: { "Quotes.jsx": quotesJsx, "index.js": s2IdxQuotes, "App.jsx": s2AppQuotes },
      open: "Quotes.jsx",
      highlight: "const quotes = useLoaderData();",
      path: "/quotes",
    },
    { say: "Recap. Create browser router takes an array of route objects. Router provider shows it. A loader fetches before the page appears, and use loader data hands the result to the component. Next: loaders that take params, and what happens when things go wrong." },
  ],
};

// ================= scrim 3: params in loaders, errorElement =================
const prodLinks = s2Prod2.replace(
  `import { useLoaderData } from "react-router";`,
  `import { Link, useLoaderData } from "react-router";`,
).replace(`<li key={product.id}>{product.name}</li>`, `<li key={product.id}>\n            <Link to={"/products/" + product.id}>{product.name}</Link>\n          </li>`);
const detailLoaderBody = (check) => `export async function productLoader({ params }) {
  const res = await fetch("/api/products/" + params.id);
${check}  return res.json();
}
`;
const detailJsx = (check) => `import { useLoaderData } from "react-router";

${detailLoaderBody(check)}
export default function ProductDetail() {
  const product = useLoaderData();

  return (
    <div className="page">
      <h1>{product.name}</h1>
      <p>Price: {product.price} dollars</p>
    </div>
  );
}
`;
const notOk = `  if (!res.ok) {\n    throw new Response("Not found", { status: 404 });\n  }\n`;
const errJsx0 = `export default function ErrorPage() {
  return (
    <div className="page error">
      <h1>Something went wrong</h1>
      <p>We couldn't find that page.</p>
    </div>
  );
}
`;
const errJsx1 = `import { Link } from "react-router";

export default function ErrorPage() {
  return (
    <div className="page error">
      <h1>Something went wrong</h1>
      <p>We couldn't find that page.</p>
      <Link to="/products">Back to products</Link>
    </div>
  );
}
`;
const idx3 = ({ imp, detailRoute }) => idxFn({
  imp: `import Products, { productsLoader } from "./Products.jsx";\nimport Quotes, { quotesLoader } from "./Quotes.jsx";\n${imp}`,
  children: homeChild + `      { path: "products", element: <Products />, loader: productsLoader },\n${detailRoute}      { path: "quotes", element: <Quotes />, loader: quotesLoader },\n`,
});
const detailRouteBase = `      { path: "products/:id", element: <ProductDetail />, loader: productLoader },\n`;
const detailRouteErr = `      {
        path: "products/:id",
        element: <ProductDetail />,
        loader: productLoader,
        errorElement: <ErrorPage />,
      },
`;
const s3Idx1 = idx3({ imp: `import ProductDetail, { productLoader } from "./ProductDetail.jsx";\n`, detailRoute: detailRouteBase });
const s3Idx2 = idx3({ imp: `import ProductDetail, { productLoader } from "./ProductDetail.jsx";\nimport ErrorPage from "./ErrorPage.jsx";\n`, detailRoute: detailRouteErr });
const s3App2 = appLayout("", `  const navigation = useNavigation();\n\n`, ", useNavigation").replace(
  `      </nav>\n`,
  `      </nav>\n      {navigation.state === "loading" && <p className="banner">Loading...</p>}\n`,
).replace(`        <NavLink to="/products">Products</NavLink>\n`, `        <NavLink to="/products">Products</NavLink>\n        <NavLink to="/quotes">Quotes</NavLink>\n`);

const scrim3 = {
  kind: "scrim",
  id: "m19-errors-loading",
  title: "Loader params, errors and loading",
  notes: md(`## Params in a loader

A loader receives an object with §params§, so you don't need §useParams§ there:

§§§jsx
export async function productLoader({ params }) {
  const res = await fetch("/api/products/" + params.id);
  if (!res.ok) {
    throw new Response("Not found", { status: 404 });
  }
  return res.json();
}

{ path: "products/:id", element: <ProductDetail />, loader: productLoader, errorElement: <ErrorPage /> }
§§§

## When something goes wrong

- A loader that **throws** stops the page from showing. The router shows the route's §errorElement§ instead.
- Without an §errorElement§ you get the router's plain default error screen, which is not friendly for visitors.
- Always check §res.ok§ and throw when it's false. \`fetch\` doesn't throw on a 404 by itself.
- An §errorElement§ on a child route keeps the menu and layout around it.

## Pending state

§§§jsx
const navigation = useNavigation();
{navigation.state === "loading" && <p>Loading...</p>}
§§§

## Which router should I use?

- §BrowserRouter§ + §Routes§: simple, great for most beginner apps.
- §createBrowserRouter§ + §RouterProvider§: choose it when you like loaders, error elements and pending states built in.
- Concepts (paths, params, Link, Outlet) are the same, so switching later is not hard.`).replace(/```/g, "```"),
  files: { "index.html": html, "styles.css": css, "index.js": s2IdxQuotes, "App.jsx": s2AppQuotes, "Products.jsx": s2Prod2, "Quotes.jsx": quotesJsx },
  steps: [
    { say: "Our shop now needs a detail page for each product, loaded with a loader. We'll also meet what happens when a loader fails, which is an important part of real apps.", path: "/products", open: "Products.jsx" },
    {
      say: "First, each product in the list becomes a Link to slash products slash its id. We've done this before.",
      files: { "Products.jsx": prodLinks },
      highlight: '<Link to={"/products/" + product.id}>{product.name}</Link>',
      path: "/products",
    },
    {
      say: "Now the detail page. A loader receives an object, and one thing inside is params. So params dot id is the colon id part of the address. No use params hook needed, because the loader isn't a component.",
      files: { "ProductDetail.jsx": detailJsx("") },
      highlight: 'fetch("/api/products/" + params.id)',
    },
    {
      say: "We register it as a route with a colon id in the path, and the loader. Click a product: the detail page loads its data first, then appears.",
      files: { "index.js": s3Idx1 },
      highlight: '{ path: "products/:id", element: <ProductDetail />, loader: productLoader },',
      path: "/products/2",
    },
    { say: "Now try a product that doesn't exist, slash products slash ninety nine. The page shows, but the heading is empty. The API answered with an error message, and we treated it like a product. Nothing warned us. That's a silent bug.", path: "/products/99" },
    {
      say: "Fetch doesn't fail on a not found answer, so we check res dot ok. If it's not ok, we throw a Response with status four oh four. Throwing in a loader tells the router: this route can't be shown.",
      files: { "ProductDetail.jsx": detailJsx(notOk) },
      highlight: 'throw new Response("Not found", { status: 404 });',
      path: "/products/99",
    },
    { say: "Now we see the router's default error screen. It works, and it's a good clue that our thrown error was noticed. But it's not something we want visitors to read. Let's make a friendly one.", path: "/products/99" },
    {
      say: "An ErrorPage component. A heading, and a calm message. It's an ordinary component, nothing special about it yet.",
      files: { "ErrorPage.jsx": errJsx0 },
      highlight: "We couldn't find that page.",
      path: "/products/99",
    },
    {
      say: "We attach it with the error element property. Now, whenever this route's loader throws, the router shows our page. Because it's on the child route, the menu stays around it.",
      files: { "index.js": s3Idx2 },
      highlight: "errorElement: <ErrorPage />,",
      path: "/products/99",
    },
    {
      say: "One more kindness: loaders take time. In App, the hook use navigation tells us the router's state. When it says loading, we show a message. Click between pages and watch the banner.",
      files: { "App.jsx": s3App2 },
      highlight: 'navigation.state === "loading"',
      path: "/products",
    },
    {
      say: "Your turn. The error page is a dead end. Add a Link inside it that goes back to slash products and says Back to products.",
      path: "/products/99",
      challenge: {
        task: md(`**Challenge:** give the error page a way out.

In §ErrorPage.jsx§, import §Link§ and add a §<Link>§ to §/products§ that says **Back to products**. Keep the page's wrapper \`<div className="error">\` classes as they are.

Then try §/products/99§.`),
        hints: [
          "Import Link from react-router at the top of ErrorPage.jsx.",
          "Add the Link inside the div, under the paragraph.",
          '<Link to="/products">Back to products</Link>',
        ],
        tests: [
          { name: "An unknown product shows the friendly message", code: `await goto("/products/99"); await wait(700); return text(".error").includes("couldn't find");` },
          { name: "The error page has a link back to /products", code: `await goto("/products/99"); await wait(700); const a = $('.error a[href="/products"]'); return !!a && /back/i.test(a.textContent);` },
          { name: "A real product still loads", code: `await goto("/products/2"); await wait(700); return text("h1") === "Desk Plant";` },
        ],
      },
    },
    {
      say: "Here's my version, a Link inside the error page. A visitor who lands here by mistake now has a clear way back.",
      files: { "ErrorPage.jsx": errJsx1 },
      highlight: '<Link to="/products">Back to products</Link>',
      path: "/products/99",
    },
    { say: "So which router should you use? Browser Router with Routes is simple, and perfect for most beginner apps. Choose a data router when you like having loaders, error elements and loading states built in. The ideas are the same, so you can switch later." },
    { say: "That's React Router: paths, params, nesting, search params, and data routers. You have everything you need for the capstone project. Let's practice first!" },
  ],
};

// ================= practices =================
const shelfApp = (key, prop, val) => `import { Routes, Route, useSearchParams } from "react-router";
import { products } from "./products.js";

function Shelf() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("${key}") || "";

  const shown = products.filter((p) => category === "" || p.${prop} === category);

  return (
    <div className="page">
      <h1>The shelf</h1>
      <select value={category} onChange={(e) => setSearchParams({ category: e.target.${val} })}>
        <option value="">All categories</option>
        <option value="kitchen">Kitchen</option>
        <option value="home">Home</option>
        <option value="office">Office</option>
        <option value="tech">Tech</option>
      </select>
      <ul>
        {shown.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Shelf />} />
    </Routes>
  );
}
`;
const practiceFill = {
  kind: "practice",
  id: "m19-practice-category",
  title: "Practice: a category filter in the URL",
  type: "fill",
  task: md(`The shelf page has a category filter that should live in the URL, but three blanks (§___§) are missing. Fill them so that:

1. §/?category=kitchen§ shows only kitchen products.
2. Choosing a category in the select box updates the address bar.

Try it: choose **Home** and look at the address bar.`),
  files: { "index.html": html, "styles.css": css, "index.js": indexRouter, "products.js": productsJs, "App.jsx": shelfApp("___", "___", "___") },
  solution: { "App.jsx": shelfApp("category", "category", "value") },
  hints: [
    "The name inside searchParams.get(...) must match the name used in the URL: ?category=...",
    "Each product has a category property. And the chosen option is on the event: e.target.something.",
    "The answers in order: \"category\", category (the product property), value.",
  ],
  tests: [
    { name: "?category=kitchen shows only kitchen products", code: `await goto("/?category=kitchen"); return text().includes("Cozy Mug") && text().includes("Water Bottle") && !text().includes("Lamp");` },
    { name: "With no category, all six products show", code: `await goto("/"); return $$("li").length === 6;` },
    { name: "Choosing Home in the select updates the URL and the list", code: `await goto("/"); const s = $("select"); Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set.call(s, "home"); s.dispatchEvent(new Event("change", { bubbles: true })); await wait(100); return location.search.includes("category=home") && $$("li").length === 2;` },
  ],
};

const usersStub = `export default function Users() {
  return (
    <div className="page">
      <h1>Users</h1>
      <p>TODO: build the user search</p>
    </div>
  );
}
`;
const usersApp = `import { Routes, Route, NavLink } from "react-router";
import Users from "./Users.jsx";

export default function App() {
  return (
    <div>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/users">Users</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<h1 className="page">Welcome</h1>} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </div>
  );
}
`;
const usersSolution = `import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const shown = users.filter((u) => u.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="page">
      <h1>Users</h1>
      <input
        value={q}
        onChange={(e) => setSearchParams({ q: e.target.value })}
        placeholder="Search by name"
      />
      <ul>
        {shown.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
}
`;
const practiceBuild = {
  kind: "practice",
  id: "m19-practice-user-search",
  title: "Practice: search users from the API",
  type: "build",
  task: md(`Build the **Users** page (§Users.jsx§) so that it:

1. Fetches the users from §/api/users§ when it first appears.
2. Shows each user's §name§ in an §<li>§ (with a §key§).
3. Has a text §<input>§ whose value lives in the URL as §?q=§. Typing in it updates the address bar.
4. Only shows users whose name includes the search (ignore capital letters).

Try §/users?q=ada§ in the address bar.`),
  files: { "index.html": html, "styles.css": css, "index.js": indexRouter, "App.jsx": usersApp, "Users.jsx": usersStub },
  solution: { "Users.jsx": usersSolution },
  hints: [
    "You need two hooks from different places: useState + useEffect for the fetched users, and useSearchParams for q.",
    "Fetch once with an effect and [] as dependencies, store the list in state. Read q with searchParams.get(\"q\") || \"\".",
    "Filter with users.filter((u) => u.name.toLowerCase().includes(q.toLowerCase())) and call setSearchParams({ q: e.target.value }) in the input's onChange.",
  ],
  tests: [
    { name: "/users shows all five users", code: `await goto("/users"); await wait(700); return $$("li").length === 5;` },
    { name: "?q=ada shows only Ada Lovelace", code: `await goto("/users?q=ada"); await wait(700); return $$("li").length === 1 && text().includes("Ada Lovelace");` },
    { name: "Typing in the box updates the address and the list", code: `await goto("/users"); await wait(700); await type("input", "grace"); await wait(100); return location.search.includes("q=grace") && $$("li").length === 1 && text().includes("Grace Hopper");` },
    { name: "The box shows the search from the URL", code: `await goto("/users?q=linus"); await wait(700); return $("input").value === "linus";` },
  ],
};

const todosStub = `export default function Todos() {
  return (
    <div className="page">
      <h1>My todos</h1>
      <p>TODO: show the todos</p>
    </div>
  );
}
`;
const todosIdx = `import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App.jsx";
import Todos, { todosLoader } from "./Todos.jsx";
import "./styles.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <h1 className="page">Welcome</h1> },
      { path: "todos", element: <Todos />, loader: todosLoader },
    ],
  },
]);

createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);
`;
const todosApp = `import { NavLink, Outlet } from "react-router";

export default function App() {
  return (
    <div>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/todos">Todos</NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
`;
const todosSolution = `import { useLoaderData } from "react-router";

export async function todosLoader() {
  const res = await fetch("/api/todos");
  return res.json();
}

export default function Todos() {
  const todos = useLoaderData();

  return (
    <div className="page">
      <h1>My todos</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.title}
            {todo.done ? " (done)" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
`;
const practiceTodos = {
  kind: "practice",
  id: "m19-practice-loader",
  title: "Practice: a todo list with a loader",
  type: "build",
  task: md(`The router in §index.js§ is already set up with a §/todos§ route. It expects §Todos.jsx§ to export a **loader** called §todosLoader§. Write §Todos.jsx§:

1. Export an async §todosLoader§ that fetches §/api/todos§ and returns the JSON.
2. In the §Todos§ component, get the data with §useLoaderData()§ (no §useEffect§!).
3. Show each todo's §title§ in an §<li>§ with a §key§. Add **(done)** after the title when §todo.done§ is true.`),
  files: { "index.html": html, "styles.css": css, "index.js": todosIdx, "App.jsx": todosApp, "Todos.jsx": todosStub },
  solution: { "Todos.jsx": todosSolution },
  hints: [
    "Look at Products.jsx from the lesson: a loader function on top, then a component using useLoaderData.",
    "The loader: const res = await fetch(\"/api/todos\"); return res.json();",
    "In the list item: {todo.title} followed by {todo.done ? \" (done)\" : \"\"}.",
  ],
  tests: [
    { name: "/todos shows four todos", code: `await goto("/todos"); await wait(700); return $$("li").length === 4;` },
    { name: "Finished todos say (done)", code: `await goto("/todos"); await wait(700); const li = $$("li"); return li.length === 4 && li[0].textContent.includes("done") && !li[2].textContent.includes("done");` },
    { name: "The page reads the data with useLoaderData", code: `const src = files()["Todos.jsx"]; return /useLoaderData\\(/.test(src) && !/useEffect/.test(src);` },
  ],
};

const userIdx = (errEl) => `import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App.jsx";
import UserDetail, { userLoader } from "./UserDetail.jsx";
import ErrorPage from "./ErrorPage.jsx";
import "./styles.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <h1 className="page">Welcome</h1> },
      {
        path: "users/:id",
        element: <UserDetail />,
        loader: userLoader,
${errEl}      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);
`;
const userApp = `import { NavLink, Outlet } from "react-router";

export default function App() {
  return (
    <div>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/users/1">Ada</NavLink>
        <NavLink to="/users/2">Alan</NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
`;
const userDetail = (check) => `import { useLoaderData } from "react-router";

export async function userLoader({ params }) {
  const res = await fetch("/api/users/" + params.id);
${check}  return res.json();
}

export default function UserDetail() {
  const user = useLoaderData();

  return (
    <div className="page">
      <h1>{user.name}</h1>
      <p>Lives in {user.city}</p>
    </div>
  );
}
`;
const userError = `export default function ErrorPage() {
  return (
    <div className="page error">
      <h1>Oops!</h1>
      <p>We couldn't find that user.</p>
    </div>
  );
}
`;
const practiceFix = {
  kind: "practice",
  id: "m19-practice-fix-errors",
  title: "Practice: fix the missing-user page",
  type: "fix",
  task: md(`The user pages load with a loader. Real users work, but visiting a user that doesn't exist, like §/users/99§, shows an **empty page** instead of the friendly **ErrorPage**.

There are two bugs:

1. The loader never checks whether the answer was OK, so it never throws.
2. The route has no §errorElement§, even though §ErrorPage.jsx§ is ready to use.`),
  files: { "index.html": html, "styles.css": css, "index.js": userIdx(""), "App.jsx": userApp, "UserDetail.jsx": userDetail(""), "ErrorPage.jsx": userError },
  solution: {
    "index.js": userIdx("        errorElement: <ErrorPage />,\n"),
    "UserDetail.jsx": userDetail(`  if (!res.ok) {\n    throw new Response("Not found", { status: 404 });\n  }\n`),
  },
  hints: [
    "Two places need a fix: the loader in UserDetail.jsx and the route object in index.js.",
    "fetch doesn't fail on a 404 by itself. After fetch, check res.ok, and throw when it's false. Then give the route an errorElement.",
    "In the loader add: if (!res.ok) { throw new Response(\"Not found\", { status: 404 }); }. In the route object add: errorElement: <ErrorPage />,",
  ],
  tests: [
    { name: "A real user still loads", code: `await goto("/users/2"); await wait(700); return text("h1") === "Alan Turing";` },
    { name: "A missing user shows the friendly error page", code: `await goto("/users/99"); await wait(700); return text(".error").includes("couldn't find that user");` },
    { name: "The menu still works afterwards", code: `await goto("/users/1"); await wait(700); return text("h1") === "Ada Lovelace" && $$("nav").length === 1;` },
  ],
};

const quiz = {
  kind: "quiz",
  id: "m19-quiz",
  title: "Quick check: search params and data routers",
  questions: [
    {
      q: "The address is /products?q=mug. What does this return?",
      code: 'const [searchParams] = useSearchParams();\nsearchParams.get("q");',
      options: ["\"/products\"", "\"mug\"", "null", "{ q: \"mug\" }"],
      answer: 1,
      explain: "`get` returns the value of the param with that name: the text `\"mug\"`. If the param were missing, you would get `null`.",
    },
    {
      q: "Why store a search box's text in the URL instead of in useState?",
      options: ["It's faster", "The search survives reload and Back, and the link can be shared", "useState can't store text", "The URL is encrypted"],
      answer: 1,
      explain: "State in the address bar is remembered by the browser. Reloading, pressing Back, or sharing the link all bring the same search back.",
    },
    {
      q: "You have ?q=mug&category=kitchen. In the category select you call setSearchParams({ category: \"home\" }). What happens to q?",
      options: ["It stays as mug", "It is removed, because setSearchParams replaces all params", "It turns into home", "The page reloads"],
      answer: 1,
      explain: "`setSearchParams` replaces the whole query. To keep `q`, pass it along: `setSearchParams({ q, category: \"home\" })`.",
    },
    {
      q: "In a data router, what does a route's loader do?",
      options: ["Styles the page", "Fetches the data before the page shows; the component reads it with useLoaderData", "Replaces useState", "Checks the user's password"],
      answer: 1,
      explain: "The router calls the loader when you visit the route and waits for it. The component then receives the finished data with `useLoaderData()`.",
    },
    {
      q: "A loader fetches /api/products/99 and gets a 404. What should it do so the errorElement appears?",
      code: 'const res = await fetch("/api/products/" + params.id);',
      options: ["Nothing, fetch throws by itself", "Check `res.ok` and throw a Response when it's false", "Return null", "Call console.log"],
      answer: 1,
      explain: "`fetch` only throws when the network fails, not for a 404. Check `res.ok` and `throw new Response(\"Not found\", { status: 404 })`; the router then shows the `errorElement`.",
    },
    {
      q: "Which statement is true?",
      options: [
        "You must use createBrowserRouter in every app",
        "BrowserRouter with Routes is a fine choice for most beginner apps",
        "Data routers don't support Link",
        "You can't use both ideas in one project over time",
      ],
      answer: 1,
      explain: "Both styles share the same ideas (paths, params, Link, Outlet). `BrowserRouter` is simple and plenty for many apps. Choose a data router when you want built-in loaders and error handling.",
    },
  ],
};

export default {
  id: "m19",
  title: "Search params and data routers",
  summary: "Keep search and filters in the URL, then meet the data-router style with loaders and error pages.",
  lessons: [scrim1, practiceFill, practiceBuild, scrim2, practiceTodos, scrim3, practiceFix, quiz],
};
