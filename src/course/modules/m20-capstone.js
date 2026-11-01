// Module 20: capstone. Build the Recipe Book app milestone by milestone, then celebrate.
const md = (s) => s.replace(/§/g, "`");

const html = `<!doctype html>
<html>
  <head>
    <title>Recipe Book</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="index.js"></script>
  </body>
</html>
`;

const css = `body { font-family: system-ui, sans-serif; margin: 0; color: #1f2937; background: #fffbf5; }
nav { display: flex; gap: 16px; padding: 12px 20px; background: #fde68a; }
nav a { color: #92400e; text-decoration: none; padding-bottom: 2px; }
nav a.active { font-weight: bold; border-bottom: 2px solid #92400e; }
main, .page { padding: 20px; }
input { padding: 6px; margin-bottom: 12px; }
.recipe-list { list-style: none; padding: 0; }
.recipe-card { border: 1px solid #e5e7eb; background: white; border-radius: 8px; padding: 12px; margin: 8px 0; list-style: none; }
.recipe-card h2, .recipe-card p { margin: 4px 0; }
.heart { background: none; border: none; font-size: 22px; cursor: pointer; color: #dc2626; }
.error { color: #b91c1c; }
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

// ---------- the pages that are given from the start ----------
const homeJsx = `import { Link } from "react-router";

export default function Home() {
  return (
    <div className="page">
      <h1>Welcome to the Recipe Book</h1>
      <p>Simple recipes for hungry beginners.</p>
      <Link to="/recipes">Browse recipes</Link>
    </div>
  );
}
`;
const aboutJsx = `export default function About() {
  return (
    <div className="page">
      <h1>About this book</h1>
      <p>A small recipe app built with React and React Router.</p>
    </div>
  );
}
`;
const notFoundJsx = `import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="page">
      <h1>Page not found</h1>
      <Link to="/">Go back home</Link>
    </div>
  );
}
`;
const recipesPlaceholder = `export default function Recipes() {
  return (
    <div className="page">
      <h1>Recipes</h1>
      <p>Recipes are coming soon.</p>
    </div>
  );
}
`;
const appStub = `export default function App() {
  return <h1>Recipe Book</h1>;
}
`;

// ---------- milestone 1 solution ----------
const appM1 = `import { Routes, Route, NavLink, Outlet } from "react-router";
import Home from "./Home.jsx";
import Recipes from "./Recipes.jsx";
import About from "./About.jsx";
import NotFound from "./NotFound.jsx";

function Layout() {
  return (
    <div>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/recipes">Recipes</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="recipes" element={<Recipes />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
`;

// ---------- milestone 2 solution: recipes list ----------
const recipesM2 = `import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetch("/api/recipes")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Request failed");
        }
        return res.json();
      })
      .then((data) => {
        setRecipes(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  if (status === "loading") {
    return <p className="page">Loading recipes...</p>;
  }

  if (status === "error") {
    return <p className="page error">Sorry, we couldn't load the recipes.</p>;
  }

  return (
    <div className="page">
      <h1>Recipes</h1>
      <ul className="recipe-list">
        {recipes.map((recipe) => (
          <li key={recipe.id} className="recipe-card">
            <Link to={"/recipes/" + recipe.id}>
              {recipe.emoji} {recipe.title}
            </Link>
            <p>{recipe.minutes} minutes</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
`;

// ---------- milestone 3 solution: detail page ----------
const detailStub = `export default function RecipeDetail() {
  return (
    <div className="page">
      <p>TODO: build the recipe page</p>
    </div>
  );
}
`;
const detailM3 = `import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    setStatus("loading");
    fetch("/api/recipes/" + id)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Not found");
        }
        return res.json();
      })
      .then((data) => {
        setRecipe(data);
        setStatus("ready");
      })
      .catch(() => setStatus("missing"));
  }, [id]);

  if (status === "loading") {
    return <p className="page">Loading recipe...</p>;
  }

  if (status === "missing") {
    return (
      <div className="page">
        <p>We couldn't find that recipe.</p>
        <Link to="/recipes">Back to all recipes</Link>
      </div>
    );
  }

  return (
    <div className="page recipe-detail">
      <h1>
        {recipe.emoji} {recipe.title}
      </h1>
      <p>{recipe.minutes} minutes</p>
      <h2>Ingredients</h2>
      <ul className="ingredients">
        {recipe.ingredients.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h2>Steps</h2>
      <ol className="steps">
        {recipe.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <Link to="/recipes">Back to all recipes</Link>
    </div>
  );
}
`;
const appM3 = appM1
  .replace(`import NotFound from "./NotFound.jsx";\n`, `import NotFound from "./NotFound.jsx";\nimport RecipeDetail from "./RecipeDetail.jsx";\n`)
  .replace(`        <Route path="about" element={<About />} />\n`, `        <Route path="recipes/:id" element={<RecipeDetail />} />\n        <Route path="about" element={<About />} />\n`);

// ---------- milestone 4 solution: search ----------
const recipesM4 = recipesM2
  .replace(`import { Link } from "react-router";`, `import { Link, useSearchParams } from "react-router";`)
  .replace(
    `  const [status, setStatus] = useState("loading");\n`,
    `  const [status, setStatus] = useState("loading");\n  const [searchParams, setSearchParams] = useSearchParams();\n  const q = searchParams.get("q") || "";\n`,
  )
  .replace(
    `  return (\n    <div className="page">\n      <h1>Recipes</h1>\n      <ul className="recipe-list">\n        {recipes.map(`,
    `  const shown = recipes.filter((recipe) => recipe.title.toLowerCase().includes(q.toLowerCase()));\n\n  return (\n    <div className="page">\n      <h1>Recipes</h1>\n      <input\n        value={q}\n        onChange={(e) => setSearchParams({ q: e.target.value })}\n        placeholder="Search recipes"\n      />\n      {shown.length === 0 && <p>No recipes match your search.</p>}\n      <ul className="recipe-list">\n        {shown.map(`,
  );

// ---------- milestone 5 solution: favorites ----------
const favStub = `export default function Favorites() {
  return (
    <div className="page">
      <h1>My favorites</h1>
      <p>TODO: show the favorite recipes</p>
    </div>
  );
}
`;
const recipesM5 = recipesM4
  .replace(`export default function Recipes() {`, `export default function Recipes({ favorites, onToggle }) {`)
  .replace(
    `            <p>{recipe.minutes} minutes</p>\n`,
    `            <p>{recipe.minutes} minutes</p>\n            <button className="heart" onClick={() => onToggle(recipe.id)} aria-label="Toggle favorite">\n              {favorites.includes(recipe.id) ? "♥" : "♡"}\n            </button>\n`,
  );
const favM5 = `import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function Favorites({ favorites, onToggle }) {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch("/api/recipes")
      .then((res) => res.json())
      .then((data) => setRecipes(data));
  }, []);

  const saved = recipes.filter((recipe) => favorites.includes(recipe.id));

  return (
    <div className="page">
      <h1>My favorites</h1>
      {saved.length === 0 && <p>No favorites yet. Tap a heart on the recipes page.</p>}
      <ul className="recipe-list">
        {saved.map((recipe) => (
          <li key={recipe.id} className="recipe-card fav-item">
            <Link to={"/recipes/" + recipe.id}>
              {recipe.emoji} {recipe.title}
            </Link>
            <button className="heart" onClick={() => onToggle(recipe.id)} aria-label="Remove favorite">
              ♥
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
`;
const appM5 = `import { useState } from "react";
import { Routes, Route, NavLink, Outlet } from "react-router";
import Home from "./Home.jsx";
import Recipes from "./Recipes.jsx";
import RecipeDetail from "./RecipeDetail.jsx";
import Favorites from "./Favorites.jsx";
import About from "./About.jsx";
import NotFound from "./NotFound.jsx";

function Layout({ count }) {
  return (
    <div>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/recipes">Recipes</NavLink>
        <NavLink to="/favorites">Favorites ({count})</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  const [favorites, setFavorites] = useState([]);

  function toggleFavorite(id) {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fav) => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  }

  return (
    <Routes>
      <Route element={<Layout count={favorites.length} />}>
        <Route index element={<Home />} />
        <Route path="recipes" element={<Recipes favorites={favorites} onToggle={toggleFavorite} />} />
        <Route path="recipes/:id" element={<RecipeDetail />} />
        <Route path="favorites" element={<Favorites favorites={favorites} onToggle={toggleFavorite} />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
`;

// ---------- file sets ----------
const base = { "index.html": html, "styles.css": css, "index.js": indexRouter };
const start1 = { ...base, "App.jsx": appStub, "Home.jsx": homeJsx, "About.jsx": aboutJsx, "NotFound.jsx": notFoundJsx, "Recipes.jsx": recipesPlaceholder };
const sol1 = { "App.jsx": appM1 };
const start2 = { ...start1, ...sol1 };
const sol2 = { "Recipes.jsx": recipesM2 };
const start3 = { ...start2, ...sol2, "RecipeDetail.jsx": detailStub };
const sol3 = { "RecipeDetail.jsx": detailM3, "App.jsx": appM3 };
const start4 = { ...start3, ...sol3 };
const sol4 = { "Recipes.jsx": recipesM4 };
const start5 = { ...start4, ...sol4, "Favorites.jsx": favStub };
const sol5 = { "App.jsx": appM5, "Recipes.jsx": recipesM5, "Favorites.jsx": favM5 };
const finalFiles = { ...start5, ...sol5 };

// ================= intro scrim =================
const planApp0 = `export default function App() {
  return (
    <div className="page">
      <h1>Recipe Book</h1>
    </div>
  );
}
`;
const planApp1 = `export default function App() {
  return (
    <div className="page">
      <h1>Recipe Book</h1>
      <div className="recipe-card">
        <h2>Pancakes</h2>
        <p>20 minutes</p>
      </div>
    </div>
  );
}
`;
const planApp2 = planApp1.replace(
  `      </div>\n    </div>\n  );`,
  `      </div>\n      <div className="recipe-card">\n        <h2>Tomato Pasta</h2>\n        <p>25 minutes</p>\n      </div>\n    </div>\n  );`,
);

const scrimPlan = {
  kind: "scrim",
  id: "m20-plan",
  title: "Plan the Recipe Book",
  notes: md(`## Plan before you code

Before writing code, answer four questions on paper:

1. **Pages:** what will visitors see? *Home, Recipes (list), a Recipe page, Favorites, About, and a 404.*
2. **Components:** what pieces repeat? *A layout with a menu, a recipe card.*
3. **Data:** where does it come from? *§/api/recipes§ and §/api/recipes/:id§.*
4. **State:** what changes while using the app? *Which recipes are favorites. The search text lives in the URL.*

## Build in layers

1. **Static first.** Hard-code one card. Get the look right.
2. Add **routes** and a layout.
3. Add **data** with §fetch§, loading and error states.
4. Add the **detail** page with §useParams§.
5. Add **search** with §useSearchParams§.
6. Add **favorites** with state lifted to §App§.

After each layer the app still works. That's how professionals avoid getting lost.

## Where does state live?

If two pages need the same state (the Recipes list and the Favorites page), put it in their **closest common parent**: §App§, and pass it down as props.`),
  files: { "index.html": html, "styles.css": css, "index.js": indexPlain, "App.jsx": planApp0 },
  steps: [
    { say: "You made it to the capstone! In this project you'll build a real app, a Recipe Book, using everything you've learned: JavaScript, React, and React Router. And we'll do it the way professionals do. First, we plan." },
    { say: "Question one: what pages does the app have? A home page, a recipes page with a list, a page for a single recipe, a favorites page, an about page, and a not found page for wrong addresses." },
    { say: "Question two: what parts repeat? A layout with a menu on every page, and a recipe card for each recipe in a list. Repeating parts become components." },
    { say: "Question three: where does the data come from? Our fake server gives us slash api slash recipes for the list, and slash api slash recipes slash an id for one recipe. Each recipe has a title, minutes, an emoji, ingredients, and steps." },
    { say: "Question four: what changes while someone uses the app? Which recipes are favorites. Two pages need that, the list with its hearts, and the favorites page. So that state lives in App, their closest shared parent. The search text will live in the URL." },
    {
      say: "Now, static first. Before routes and data, let's get the look right with one hard-coded card. Real developers do this all the time, because it's fast to change.",
      files: { "App.jsx": planApp1 },
      highlight: '<div className="recipe-card">',
    },
    { say: "No router, no fetch, no state. Only a card. Once the card looks right, we'll add one layer at a time. After each layer, the app still works, so we never get lost." },
    {
      say: "Your turn. Add a second card, for Tomato Pasta, 25 minutes. Copy the first card. Later, map will do this for us, but copying shows the shape.",
      challenge: {
        task: md(`**Challenge:** add a second static recipe card.

Copy the Pancakes card and change it to **Tomato Pasta**, **25 minutes**. Each card has the class §recipe-card§.`),
        hints: [
          "Select the whole <div className=\"recipe-card\"> ... </div> block, copy it, and paste it below.",
          "Change the h2 text to Tomato Pasta and the paragraph to 25 minutes.",
          "Keep both cards inside the outer div className=\"page\".",
        ],
        tests: [
          { name: "There are two recipe cards", code: `return $$(".recipe-card").length === 2;` },
          { name: "One card is Tomato Pasta", code: `return text().includes("Tomato Pasta") && text().includes("25 minutes");` },
          { name: "Pancakes is still there", code: `return text().includes("Pancakes");` },
        ],
      },
    },
    {
      say: "Here's my version, two cards. Notice they have the same shape, with different words. That's the hint that a list and map will replace this later.",
      files: { "App.jsx": planApp2 },
      highlight: "<h2>Tomato Pasta</h2>",
    },
    { say: "Here is the plan. Milestone one: layout, menu and routes. Two: the recipes list from the API. Three: the recipe page. Four: search. Five: favorites. Each one starts from the previous solution. Ready? Let's build!" },
  ],
};

// ================= practice milestones =================
const milestone1 = {
  kind: "practice",
  id: "m20-milestone-1",
  title: "Milestone 1: layout, menu and routes",
  type: "build",
  task: md(`Time to build the skeleton. The pages (§Home§, §Recipes§, §About§, §NotFound§) already exist. Write §App.jsx§ so that:

1. A **Layout** component shows a §<nav>§ with §NavLink§s to **Home** (§/§), **Recipes** (§/recipes§) and **About** (§/about§), and a §<main>§ containing an §<Outlet />§.
2. §App§ uses §<Routes>§ with a **layout route** and these children: an **index** route for Home, §recipes§, §about§, and a catch-all §*§ route for NotFound.

The app is already wrapped in §BrowserRouter§ in §index.js§. Check each page in the preview.`),
  files: start1,
  solution: sol1,
  hints: [
    "Write a Layout function that returns a div with a nav (three NavLinks) and a main with <Outlet />. Import Routes, Route, NavLink and Outlet from react-router, and the four pages.",
    "In App: <Routes><Route element={<Layout />}> ...children... </Route></Routes>. The Home route uses the index prop instead of a path.",
    "Children: <Route index element={<Home />} />, <Route path=\"recipes\" element={<Recipes />} />, <Route path=\"about\" element={<About />} />, <Route path=\"*\" element={<NotFound />} />.",
  ],
  tests: [
    { name: "The home page shows the welcome heading", code: `await goto("/"); return text("h1").includes("Welcome to the Recipe Book");` },
    { name: "The menu links to the three pages", code: `return ["/", "/recipes", "/about"].every((h) => !!$('nav a[href="' + h + '"]'));` },
    { name: "Clicking Recipes shows the recipes page", code: `await click('nav a[href="/recipes"]'); return path() === "/recipes" && text("h1") === "Recipes";` },
    { name: "Clicking About shows the about page", code: `await click('nav a[href="/about"]'); return path() === "/about" && text("h1").includes("About this book");` },
    { name: "Unknown addresses show Page not found, with one menu", code: `await goto("/nope"); return text("h1").includes("Page not found") && $$("nav").length === 1;` },
  ],
};

const milestone2 = {
  kind: "practice",
  id: "m20-milestone-2",
  title: "Milestone 2: the recipes list",
  type: "build",
  task: md(`Make the **Recipes** page load real data. Edit §Recipes.jsx§ so that it:

1. Fetches §/api/recipes§ once, when the page first appears.
2. Shows **Loading recipes...** while waiting, and an error message (any friendly words) if the fetch fails. Check §res.ok§ and use §.catch§.
3. Shows an §<h1>§ **Recipes**, then one §<li className="recipe-card">§ per recipe (with a §key§!), inside a §<ul className="recipe-list">§.
4. Each card shows the recipe's §emoji§, §title§ and §minutes§, and the title is a §Link§ to §/recipes/§ plus the recipe's id.

The recipe objects look like: §{ id, title, minutes, emoji, ingredients, steps }§.`),
  files: start2,
  solution: sol2,
  hints: [
    "Use two states: recipes (starting as an empty array) and status (\"loading\", \"ready\" or \"error\"). Fetch inside useEffect with [] as the dependency array.",
    "Before the main return, add if (status === \"loading\") return ...; and the same for \"error\". After fetch, throw an Error when !res.ok, and end the chain with .catch(() => setStatus(\"error\")).",
    "recipes.map((recipe) => <li key={recipe.id} className=\"recipe-card\"><Link to={\"/recipes/\" + recipe.id}>{recipe.emoji} {recipe.title}</Link><p>{recipe.minutes} minutes</p></li>)",
  ],
  tests: [
    { name: "It shows four recipe cards after loading", code: `await goto("/recipes"); await wait(700); return $$(".recipe-card").length === 4 && text("h1") === "Recipes";` },
    { name: "The cards show titles and minutes", code: `await goto("/recipes"); await wait(700); return text().includes("Pancakes") && text().includes("25 minutes");` },
    { name: "Each title links to its recipe", code: `await goto("/recipes"); await wait(700); return !!$('a[href="/recipes/1"]') && !!$('a[href="/recipes/4"]');` },
    { name: "The code has a loading message and handles errors", code: `const src = files()["Recipes.jsx"]; return /Loading/.test(src) && /catch/.test(src) && /res\\.ok/.test(src);` },
    { name: "The list uses map with keys", code: `const src = files()["Recipes.jsx"]; return /\\.map\\(/.test(src) && /key=/.test(src);` },
  ],
};

const milestone3 = {
  kind: "practice",
  id: "m20-milestone-3",
  title: "Milestone 3: the recipe page",
  type: "build",
  task: md(`Now each card's link should open a real page. There are two jobs:

**In §App.jsx§:** add a route for §recipes/:id§ that shows §RecipeDetail§ (import it).

**In §RecipeDetail.jsx§:**

1. Read §id§ with §useParams§ and fetch §"/api/recipes/" + id§ (re-run when §id§ changes).
2. Show **Loading recipe...** while waiting.
3. If the recipe doesn't exist, show **We couldn't find that recipe.** and a link back to §/recipes§.
4. Otherwise show the emoji and title in an §<h1>§, the minutes, a §<ul className="ingredients">§ of ingredients and an §<ol className="steps">§ of steps (each with a §key§). Wrap it all in §<div className="page recipe-detail">§ and finish with a §Link§ back to §/recipes§.`),
  files: start3,
  solution: sol3,
  hints: [
    "First the route: <Route path=\"recipes/:id\" element={<RecipeDetail />} /> next to the recipes route. Don't forget the import.",
    "RecipeDetail works like the list, but with useParams and fetch(\"/api/recipes/\" + id). Use a status state: \"loading\", \"ready\" or \"missing\", and put [id] in the dependency array.",
    "ingredients and steps are arrays of text. Use recipe.ingredients.map((item) => <li key={item}>{item}</li>), and the same idea for steps inside an <ol>.",
  ],
  tests: [
    { name: "/recipes/2 shows Tomato Pasta", code: `await goto("/recipes/2"); await wait(700); return text("h1").includes("Tomato Pasta");` },
    { name: "It lists four ingredients and three steps", code: `await goto("/recipes/2"); await wait(700); return $$(".ingredients li").length === 4 && $$(".steps li").length === 3;` },
    { name: "Clicking a card on the list opens its page", code: `await goto("/recipes"); await wait(700); await click('a[href="/recipes/3"]'); await wait(700); return path() === "/recipes/3" && text("h1").includes("Fruit Salad");` },
    { name: "An unknown recipe shows a friendly message", code: `await goto("/recipes/99"); await wait(700); return text().includes("couldn't find that recipe");` },
    { name: "There is a link back to the list on the recipe page", code: `await goto("/recipes/1"); await wait(700); return !!$('.recipe-detail a[href="/recipes"]');` },
  ],
};

const milestone4 = {
  kind: "practice",
  id: "m20-milestone-4",
  title: "Milestone 4: search the recipes",
  type: "build",
  task: md(`Let visitors search. Edit §Recipes.jsx§:

1. Read §q§ from the URL with §useSearchParams§.
2. Add a text §<input>§ under the heading whose value is §q§ and that updates the URL (§?q=...§) as you type.
3. Only show recipes whose **title** includes the search text (ignoring capital letters).
4. If nothing matches, show **No recipes match your search.**

Try §/recipes?q=cheese§. Reloading the page should keep the search.`),
  files: start4,
  solution: sol4,
  hints: [
    "const [searchParams, setSearchParams] = useSearchParams(); and const q = searchParams.get(\"q\") || \"\";",
    "Filter before the return: const shown = recipes.filter((recipe) => recipe.title.toLowerCase().includes(q.toLowerCase())); and map over shown instead of recipes.",
    "<input value={q} onChange={(e) => setSearchParams({ q: e.target.value })} placeholder=\"Search recipes\" /> and {shown.length === 0 && <p>No recipes match your search.</p>}",
  ],
  tests: [
    { name: "Without a search, all four recipes show", code: `await goto("/recipes"); await wait(700); return $$(".recipe-card").length === 4;` },
    { name: "?q=cheese shows only Grilled Cheese", code: `await goto("/recipes?q=cheese"); await wait(700); return $$(".recipe-card").length === 1 && text().includes("Grilled Cheese");` },
    { name: "The search box shows the search from the URL", code: `await goto("/recipes?q=pa"); await wait(700); return $("input").value === "pa" && $$(".recipe-card").length === 2;` },
    { name: "Typing updates the address and the list", code: `await goto("/recipes"); await wait(700); await type("input", "fruit"); await wait(100); return location.search.includes("q=fruit") && $$(".recipe-card").length === 1 && text().includes("Fruit Salad");` },
    { name: "No matches shows a friendly message", code: `await goto("/recipes?q=zzz"); await wait(700); return text().includes("No recipes match");` },
  ],
};

const milestone5 = {
  kind: "practice",
  id: "m20-milestone-5",
  title: "Milestone 5: favorites",
  type: "build",
  task: md(`The last feature! Visitors can heart their favorite recipes.

**State lives in §App.jsx§.** Create §favorites§ (an array of recipe ids) with §useState§ and a §toggleFavorite(id)§ function that adds the id, or removes it if it's already there. Don't mutate the array: use §filter§ and the spread syntax §[...favorites, id]§.

1. Pass §favorites§ and §onToggle§ to §Recipes§. In each card add a §<button className="heart">§ that calls §onToggle(recipe.id)§ and shows **♥** when it's a favorite and **♡** when not.
2. Build §Favorites.jsx§ (it receives §favorites§ and §onToggle§). It fetches §/api/recipes§ and shows only favorite recipes, each as an §<li className="recipe-card fav-item">§. If there are none, show **No favorites yet.**
3. Add a route for §favorites§ and a **Favorites** link in the menu.

You can add a favorite count to the menu link too, like **Favorites (2)**: pass it to §Layout§ as a prop.`),
  files: start5,
  solution: sol5,
  hints: [
    "In App: const [favorites, setFavorites] = useState([]); then pass favorites={favorites} onToggle={toggleFavorite} to both Recipes and Favorites routes. Recipes receives them as props: Recipes({ favorites, onToggle }).",
    "toggleFavorite: if favorites.includes(id), setFavorites(favorites.filter((fav) => fav !== id)); otherwise setFavorites([...favorites, id]). The heart is {favorites.includes(recipe.id) ? \"♥\" : \"♡\"}.",
    "Favorites.jsx: fetch the recipes like in Recipes.jsx, then const saved = recipes.filter((recipe) => favorites.includes(recipe.id)). Add <Route path=\"favorites\" element={<Favorites favorites={favorites} onToggle={toggleFavorite} />} /> and a NavLink to /favorites.",
  ],
  tests: [
    { name: "The menu has a Favorites link", code: `return !!$('nav a[href="/favorites"]');` },
    { name: "With no hearts, the favorites page says so", code: `await goto("/favorites"); await wait(700); return text().includes("No favorites yet") && $$(".fav-item").length === 0;` },
    { name: "Each recipe card has a heart button", code: `await goto("/recipes"); await wait(700); return $$(".recipe-card .heart").length === 4;` },
    { name: "Hearted recipes appear on the favorites page", code: `await goto("/recipes"); await wait(700); await click($$(".heart")[0]); await click($$(".heart")[2]); await goto("/favorites"); await wait(700); return $$(".fav-item").length === 2 && text().includes("Pancakes") && text().includes("Fruit Salad");` },
    { name: "Tapping a heart again removes the favorite", code: `await goto("/recipes"); await wait(700); await click($$(".heart")[0]); await goto("/favorites"); await wait(700); return $$(".fav-item").length === 1 && !text().includes("Pancakes") && text().includes("Fruit Salad");` },
    { name: "Favorites state lives in App (useState)", code: `return /useState/.test(files()["App.jsx"]);` },
  ],
};

// ================= final scrim =================
const aboutMadeBy = aboutJsx.replace(
  `      <p>A small recipe app built with React and React Router.</p>\n`,
  `      <p>A small recipe app built with React and React Router.</p>\n      <p>Made by a proud new React developer.</p>\n`,
);

const scrimCelebrate = {
  kind: "scrim",
  id: "m20-celebrate",
  title: "You built an app!",
  notes: md(`## Look how far you've come

- **JavaScript:** variables, functions, arrays, objects, §map§ and §filter§.
- **React:** components, props, §useState§, events, forms, lists and keys, §useEffect§ with §fetch§, lifting state up.
- **React Router:** §BrowserRouter§, routes and links, layouts with §Outlet§, params with §useParams§, search params, §useNavigate§, and data routers with loaders.

## Ideas to build next

- A **notes app** with add, edit and delete.
- A **quiz game** with scores kept in state.
- A **mini shop** with a cart (state lifted up, or context) and product pages.
- Add a **recipe form** to this app.

## What to learn next

- §useReducer§ and context for bigger state.
- Form validation and handling submits to a real server.
- Testing your components.
- Putting your app on the internet.
- TypeScript, once you're comfortable.

Keep building small things. Every project teaches you something. You can always ask Kit for help.`),
  files: finalFiles,
  steps: [
    { say: "You did it! Take a breath and look at what's on the screen. This is a real app with many pages, real data, search, and favorites. You built that. I'm so proud of you.", path: "/" },
    { say: "Here's the home page, with the menu and the layout we built in milestone one. Remember when a router, routes and links were brand new words? Now they're tools you own.", path: "/" },
    { say: "The recipes page loads data from the API, with a loading message, a list made with map, and keys on every item. That's JavaScript arrays and React effects working together.", path: "/recipes" },
    { say: "Click a recipe and the address changes to slash recipes slash two. One component, shown for every recipe, thanks to a URL parameter.", path: "/recipes/2" },
    { say: "The search box keeps its text in the address. Reload, share the link, press Back: it all works, with no extra code for that. That's the power of putting state in the URL.", path: "/recipes?q=pasta" },
    { say: "And the favorites. The hearts and the favorites page share one list of ids, which lives in App, their closest common parent. That's lifting state up, and it's how real apps stay in sync.", path: "/favorites" },
    { say: "Let's look back at the whole journey. You started with console dot log, and learned variables, functions, arrays and objects. Those are the building blocks of every program." },
    { say: "Then React: components, props, state, events, forms, lists, effects and fetching data. You learned to describe what the screen should look like, and let React keep it up to date." },
    { say: "Then React Router: turning one app into many pages, with links, layouts, parameters, search params, and loaders. That's how real web apps feel like real apps." },
    {
      say: "Last little challenge, for fun. Make the app yours. On the About page, add a line that starts with Made by, and then write your own name.",
      path: "/about",
      challenge: {
        task: md(`**Make it yours!** In §About.jsx§, add a paragraph that starts with **Made by** and then your name (or a nickname).

Check it at §/about§ in the preview.`),
        hints: [
          "Add another <p> under the existing paragraph.",
          "<p>Made by Sam</p> (use your own name!)",
        ],
        tests: [
          { name: "The About page says Made by", code: `await goto("/about"); return text("h1").includes("About this book") && text().includes("Made by");` },
        ],
      },
    },
    {
      say: "Lovely. Here's mine. It's only one line, but the app now has your name on it. Whatever you build next, put your name on it too.",
      files: { "About.jsx": aboutMadeBy },
      highlight: "<p>Made by a proud new React developer.</p>",
      path: "/about",
    },
    { say: "What should you build next? A notes app, a quiz game, a little shop with a cart, or a recipe form for this very app. Pick something small that you'd enjoy using. Small projects teach the most." },
    { say: "When you're ready for more, look into reducers and context for bigger state, form handling, testing, and putting your app on the internet. And Kit is always here when you get stuck. Everyone was a beginner once. You're a developer now. Congratulations!", path: "/" },
  ],
};

const quiz = {
  kind: "quiz",
  id: "m20-quiz",
  title: "Final quiz: the whole journey",
  questions: [
    {
      q: "What does this print?",
      code: 'const prices = [2, 4, 6];\nconst doubled = prices.map((p) => p * 2);\nconsole.log(doubled);',
      options: ["[2, 4, 6]", "[4, 8, 12]", "12", "undefined"],
      answer: 1,
      explain: "`map` builds a **new** array by running the function on every item: 2 times 2, 4 times 2, and 6 times 2.",
    },
    {
      q: "When you render a list with map, what does React want on each item?",
      options: ["A unique `key`", "An `onClick`", "A `className`", "An `id` that is a number"],
      answer: 0,
      explain: "A stable, unique `key` (like the item's id) lets React track which item is which when the list changes.",
    },
    {
      q: "What is the bug in this click handler?",
      code: 'function addFavorite(id) {\n  favorites.push(id);\n  setFavorites(favorites);\n}',
      options: ["push doesn't exist for arrays", "It changes the existing array, so React may not notice a change", "setFavorites needs two arguments", "There is no bug"],
      answer: 1,
      explain: "State must be replaced, not changed in place. Use `setFavorites([...favorites, id])` so React sees a brand new array.",
    },
    {
      q: "When does this effect run?",
      code: 'useEffect(() => {\n  fetch("/api/recipes/" + id).then(...);\n}, [id]);',
      options: ["Only once, ever", "After the first render, and again whenever id changes", "On every keypress anywhere", "Never"],
      answer: 1,
      explain: "The dependency array lists what the effect depends on. With `[id]` the effect re-runs when the recipe id in the URL changes.",
    },
    {
      q: "The address is /recipes/2. Why does this find nothing?",
      code: 'const { id } = useParams();\nconst recipe = recipes.find((r) => r.id === id);',
      options: ["useParams is not a hook", "id is the string \"2\", but r.id is the number 2", "recipes must be sorted", "find only works on strings"],
      answer: 1,
      explain: "URL params are always strings, and `\"2\" === 2` is false. Use `r.id === Number(id)`.",
    },
    {
      q: "Both the Recipes page and the Favorites page need the list of favorite ids. Where should that state live?",
      options: ["In Recipes only", "In their closest common parent, like App, passed down as props", "In a global variable that is changed directly", "In the URL's path"],
      answer: 1,
      explain: "This is lifting state up. The shared parent owns the state, and passes the data and the update function down to both pages.",
    },
  ],
};

export default {
  id: "m20",
  title: "Capstone: Recipe Book app",
  summary: "Plan and build a full Recipe Book app with pages, data, search and favorites, then celebrate everything you've learned.",
  lessons: [scrimPlan, milestone1, milestone2, milestone3, milestone4, milestone5, scrimCelebrate, quiz],
};
