// Module 11: lists and conditional rendering.
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
.app, .shop, .page { max-width: 560px; margin: 0 auto; padding: 16px; }
ul { padding-left: 22px; }
li { margin: 4px 0; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px; }
.card, .pet { background: white; border-radius: 10px; padding: 10px 14px; margin: 8px 0; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12); }
.card h3, .pet h3 { margin: 0 0 6px; }
.card p, .pet p { margin: 2px 0; }
.category { color: #6b7280; font-size: 0.85rem; }
.sold { color: #b91c1c; font-weight: 600; }
.left, .done, .vaccinated { color: #059669; }
.badge { background: #fde68a; border-radius: 999px; padding: 2px 10px; font-size: 0.8rem; margin-left: 6px; }
button { font-size: 0.95rem; padding: 6px 14px; border-radius: 8px; border: none; background: #4f46e5; color: white; cursor: pointer; margin-top: 6px; }
`;

const base = { "index.html": indexHtml, "index.js": indexJs, "styles.css": css };

// ---------- Lesson 1: map + keys ----------
const songsApp = (decl, body, extra = "") => `export default function App() {
${decl}  return (
    <div className="app">
      <h1>My Playlist</h1>
      <ul>
${body}
      </ul>${extra}
    </div>
  );
}
`;
const staticLis = `        <li>Sunrise</li>
        <li>Rainy Day</li>
        <li>Night Drive</li>`;
const decl1 = `  const songs = ["Sunrise", "Rainy Day", "Night Drive"];

`;
const decl2 = `  const songs = ["Sunrise", "Rainy Day", "Night Drive", "Blue Hour"];

`;
const mapBody = (inner) => `        {songs.map((song) => (
          ${inner}
        ))}`;
const objDecl = `  const songs = [
    { id: 1, title: "Sunrise", artist: "Ada" },
    { id: 2, title: "Rainy Day", artist: "Alan" },
    { id: 3, title: "Night Drive", artist: "Grace" },
    { id: 4, title: "Blue Hour", artist: "Linus" },
  ];

`;
const idBody = `        {songs.map((song) => (
          <li key={song.id}>{song.title} by {song.artist}</li>
        ))}`;
const genresExtra = `
      <h2>Genres</h2>
      <ul>
        {genres.map((genre) => (
          <li key={genre}>{genre}</li>
        ))}
      </ul>`;

const lessonMap = {
  kind: "scrim",
  id: "m11-map-lists",
  title: "Showing lists with map",
  notes: md(`## Turning an array into list items

~map~ goes through an array and builds something new for every item. If that "something" is JSX, React puts all of it on the page.

~~~jsx
const songs = ["Sunrise", "Rainy Day"];

<ul>
  {songs.map((song) => (
    <li key={song}>{song}</li>
  ))}
</ul>
~~~

## The key prop

Every item in a list needs a ~key~: a label that is **unique among its neighbours** and **never changes**. React uses keys to tell items apart when the list changes (adding, removing, reordering).

- Best key: an ~id~ from your data, like ~key={song.id}~.
- Avoid ~key={index}~. When items move or get deleted, the numbers shift and React gets confused.
- Put the ~key~ on the **outermost element** inside ~map~.

## Objects in the list

~~~jsx
songs.map((song) => <li key={song.id}>{song.title} by {song.artist}</li>)
~~~

## The error to know

**"Objects are not valid as a React child"** means you put a whole object inside curly braces, like ~{song}~. React can show text and numbers, but not an object. Pick the part you want: ~{song.title}~.

## The warning to know

**"Each child in a list should have a unique key prop"** means you forgot ~key~. The page still works, but fix it!`),
  files: { ...base, "App.jsx": songsApp("", staticLis) },
  steps: [
    { say: "Welcome back! Websites are full of lists. Playlists, products, messages, friends. In this lesson you'll learn how React shows a whole list of things, using the map method you already know." },
    { say: "Here's a little playlist. Three songs, each one written by hand as a list item. That works for three. But what about three hundred? And real data usually arrives as an array, not typed into the page.", open: "App.jsx", highlight: "<li>Rainy Day</li>" },
    {
      say: "So let's store the songs in an array first. Const songs equals square brackets with three pieces of text inside. The page doesn't change yet.",
      files: { "App.jsx": songsApp(decl1, staticLis) },
      highlight: 'const songs = ["Sunrise", "Rainy Day", "Night Drive"];',
    },
    {
      say: "Now the magic. Inside the ul, we open curly braces and write songs dot map. For each song, we return a list item showing that song. Map builds a new array of list items, and React knows how to show it.",
      files: { "App.jsx": songsApp(decl1, mapBody("<li>{song}</li>")) },
      highlight: "{songs.map((song) => (",
    },
    {
      say: "Same page, but now it's driven by data. Watch what happens when we add a fourth song to the array.",
      files: { "App.jsx": songsApp(decl2, mapBody("<li>{song}</li>")) },
      highlight: '"Blue Hour"',
    },
    {
      say: "Blue Hour appeared by itself. We never touched the list items. That's the power of map. But look at the console. React printed a warning: Each child in a list should have a unique key prop.",
    },
    {
      say: "A key is like a name tag for each list item. When the list changes, React uses the tags to know which item is which. Our songs are all different, so each song's own text can be its key. We write key equals curly braces song.",
      files: { "App.jsx": songsApp(decl2, mapBody("<li key={song}>{song}</li>")) },
      highlight: "key={song}",
    },
    {
      say: "The warning is gone. Real data usually has more than a name, so let's switch to objects. Each song gets an id, a title and an artist. The id is a number that's different for every song. Ids make perfect keys.",
      files: { "App.jsx": songsApp(objDecl, mapBody("<li key={song.id}>{song}</li>")) },
      highlight: "{ id: 1, title: \"Sunrise\", artist: \"Ada\" },",
    },
    {
      say: "Uh oh. The page went blank, and there's a red error. Don't worry, errors are clues. Read it with me: Objects are not valid as a React child. That means we put a whole object in the curly braces.",
      highlight: "<li key={song.id}>{song}</li>",
    },
    {
      say: "Song is now an object with an id, title and artist. React can show text and numbers, but it doesn't know how to show a whole object. We need to choose which parts to display: song dot title, and song dot artist.",
      files: { "App.jsx": songsApp(objDecl, idBody) },
      highlight: "{song.title} by {song.artist}",
    },
    {
      say: "Fixed! And key is song dot id. Some people write key equals index instead, using the position number. Let me show it, but it's a trap.",
      files: { "App.jsx": songsApp(objDecl, `        {songs.map((song, index) => (
          <li key={index}>{song.title} by {song.artist}</li>
        ))}`) },
      highlight: "key={index}",
    },
    {
      say: "It seems to work. But imagine we delete the first song. Every other song moves up, and their index numbers change. React thinks Sunrise became Rainy Day, and can get things mixed up. An id stays with its song forever. So we go back to ids.",
      files: { "App.jsx": songsApp(objDecl, idBody) },
      highlight: "key={song.id}",
    },
    {
      say: "Your turn! Below the playlist, add a second list. Make an array called genres with three pieces of text, and show them with map, with a key.",
      challenge: {
        task: md(`**Challenge:** add a **Genres** list under the playlist.

1. Inside ~App~, make an array: ~const genres = ["Pop", "Rock", "Jazz"];~
2. Under the first ~</ul>~, add an ~<h2>~ and a second ~<ul>~.
3. Use ~genres.map(...)~ to make an ~<li>~ for each genre. Don't forget the ~key~!

Press **Run** to see your list.`),
        hints: [
          "Copy the playlist's ul and change the names. The array goes next to the songs array, above return.",
          "Each genre is a piece of text, so the key can be the genre itself: <li key={genre}>{genre}</li>",
          "{genres.map((genre) => (<li key={genre}>{genre}</li>))} goes between the new <ul> tags.",
        ],
        tests: [
          { name: "The page has two lists", code: 'return $$("ul").length >= 2;' },
          { name: "All three genres show up", code: 'const t = text(); return t.includes("Pop") && t.includes("Rock") && t.includes("Jazz");' },
          { name: "Both lists use map", code: 'return (files()["App.jsx"].match(/[.]map[(]/g) || []).length >= 2;' },
          { name: "Both lists use a key", code: 'return (files()["App.jsx"].match(/key=[{]/g) || []).length >= 2;' },
        ],
      },
    },
    {
      say: "Here's mine. A genres array, and a second map with its own keys. Yours may use different names, and that's fine, as long as every list item has a key.",
      files: { "App.jsx": songsApp(objDecl.replace("  ];\n\n", '  ];\n  const genres = ["Pop", "Rock", "Jazz"];\n\n'), idBody, genresExtra) },
      highlight: "{genres.map((genre) => (",
    },
    {
      say: "To remember: map turns an array into JSX. Every item needs a key. Use an id when you have one. And never put a whole object in curly braces. Next, we'll map arrays into our own components.",
    },
  ],
};

// ---------- Lesson 2: lists of components ----------
const card0 = `export default function ProductCard({ name, price, emoji }) {
  return (
    <div className="card">
      <h3>{emoji} {name}</h3>
      <p>Price: \${price}</p>
    </div>
  );
}
`;
const card1 = `export default function ProductCard({ name, price, emoji, category }) {
  return (
    <div className="card">
      <h3>{emoji} {name}</h3>
      <p>Price: \${price}</p>
      <p className="category">{category}</p>
    </div>
  );
}
`;
const prods3 = `const products = [
  { id: 1, name: "Cozy Mug", price: 12, emoji: "☕", category: "kitchen" },
  { id: 2, name: "Desk Plant", price: 18, emoji: "🪴", category: "home" },
  { id: 3, name: "Notebook", price: 6, emoji: "📓", category: "office" },
`;
const prods4 = prods3 + `  { id: 4, name: "Headphones", price: 59, emoji: "🎧", category: "tech" },
`;
const shopApp = (prods, content) => `import ProductCard from "./ProductCard.jsx";

${prods}];

export default function App() {
  return (
    <div className="shop">
      <h1>Cozy Shop</h1>
${content}
    </div>
  );
}
`;
const handWritten = `      <ProductCard name="Cozy Mug" price={12} emoji="☕" />
      <ProductCard name="Desk Plant" price={18} emoji="🪴" />
      <ProductCard name="Notebook" price={6} emoji="📓" />`;
const mapLong = `      {products.map((product) => (
        <ProductCard
          key={product.id}
          name={product.name}
          price={product.price}
          emoji={product.emoji}
        />
      ))}`;
const mapSpread = `      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}`;
const mapGrid = `      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>`;
const filterPrice = `      <div className="grid">
        {products
          .filter((product) => product.price < 20)
          .map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
      </div>`;
const filterCategory = filterPrice.replace("product.price < 20", 'product.category !== "office"');

const lessonComponentLists = {
  kind: "scrim",
  id: "m11-component-lists",
  title: "Lists of components, and filtering",
  notes: md(`## Mapping data into components

Real apps keep data in arrays of objects, and show each object with a component.

~~~jsx
{products.map((product) => (
  <ProductCard key={product.id} name={product.name} price={product.price} />
))}
~~~

## Where does the key go?

On the **outermost element in the map**, which here is ~<ProductCard>~, not inside the ProductCard component. React reads ~key~ itself and does not pass it on as a prop.

## The spread shortcut

~{...product}~ copies **every property** of the object in as a prop:

~~~jsx
<ProductCard key={product.id} {...product} />
~~~

If ~product~ is ~{ name: "Mug", price: 12 }~, that is the same as ~name="Mug" price={12}~. Extra properties are fine: a component only uses the props it asks for.

## Filter first, then map

~filter~ keeps only the items that pass a test, and gives back a new array. Chain ~map~ after it:

~~~jsx
products
  .filter((product) => product.price < 20)
  .map((product) => <ProductCard key={product.id} {...product} />)
~~~

The original ~products~ array is not changed.`),
  files: { ...base, "App.jsx": shopApp(prods3, handWritten), "ProductCard.jsx": card0 },
  steps: [
    { say: "In the last lesson we mapped an array into list items. Now let's level up: mapping an array of objects into our own components. This is how almost every real app shows its data." },
    { say: "Here's a shop with a ProductCard component, and the three cards are written out by hand. But look at the products array above. It has the very same information. We're repeating ourselves.", open: "App.jsx", highlight: "const products = [" },
    {
      say: "Let's let the data do the work. We replace the hand written cards with products dot map. For each product, we make a ProductCard and pass its name, price and emoji as props. And we add the key, using the id.",
      files: { "App.jsx": shopApp(prods3, mapLong) },
      highlight: "key={product.id}",
    },
    {
      say: "Same page, but now if the array changes, the page follows. One thing to notice. The key goes on the outermost thing inside the map. That's the ProductCard tag here, not something inside the ProductCard file.",
      highlight: "<ProductCard",
    },
    {
      say: "Passing every property one by one gets long. There's a shortcut: spread. Curly braces, three dots, product. It copies every property of the object in as a prop. Name, price, emoji, all in one go.",
      files: { "App.jsx": shopApp(prods3, mapSpread) },
      highlight: "{...product}",
    },
    {
      say: "ProductCard only uses the props it asks for, so extra ones like id and category are quietly ignored. Let's wrap the cards in a div with the class grid, so they sit side by side.",
      files: { "App.jsx": shopApp(prods3, mapGrid) },
      highlight: '<div className="grid">',
    },
    {
      say: "Your turn. Add a fourth product to the array, for example headphones, with a new id. Then change ProductCard to show the category too, in a paragraph with the class category. Since we spread everything, the category already arrives as a prop.",
      challenge: {
        task: md(`**Challenge:**

1. Add a **fourth product** to the ~products~ array in ~App.jsx~. Give it its own ~id~ (4), a ~name~, ~price~, ~emoji~ and ~category~.
2. In ~ProductCard.jsx~, add ~category~ to the destructured props and show it in a paragraph: ~<p className="category">{category}</p>~

You'll end up with four cards, and every card shows its category.`),
        hints: [
          'Copy one object in the array, paste it with a comma after it, and change the values. The id must be different!',
          "In ProductCard, change { name, price, emoji } to { name, price, emoji, category }.",
          'Under the price paragraph add: <p className="category">{category}</p>',
        ],
        tests: [
          { name: "There are at least four product cards", code: 'return $$(".card").length >= 4;' },
          { name: "Every card shows a category", code: 'const cards = $$(".card"); return cards.length > 0 && cards.every((c) => { const e = c.querySelector(".category"); return !!e && e.textContent.trim().length > 0; });' },
        ],
      },
    },
    {
      say: "Here's my version. Headphones with id four, and a category line in the card. Adding a product took one line of data and no new cards. That's the payoff of map.",
      files: { "App.jsx": shopApp(prods4, mapGrid), "ProductCard.jsx": card1 },
      open: "App.jsx",
      highlight: '{ id: 4, name: "Headphones", price: 59, emoji: "🎧", category: "tech" },',
    },
    {
      say: "Often we only want some of the items. For that we use filter before map. Filter goes through the array and keeps only the items that pass a test. Here, only products with a price under twenty.",
      files: { "App.jsx": shopApp(prods4, filterPrice) },
      highlight: ".filter((product) => product.price < 20)",
    },
    {
      say: "Filter gives back a new, shorter array, and then map turns that into cards. Headphones cost fifty nine, so they're gone from the page. But the original products array is untouched.",
    },
    {
      say: "One more challenge. Change the filter so it hides products in the office category instead of looking at the price. Remember, not equal to is exclamation mark, equals, equals.",
      challenge: {
        task: md(`**Challenge:** change the filter in ~App.jsx~ so that it keeps every product **except** the ones in the ~"office"~ category.

Use ~!==~ (not equal to) inside the filter, like: ~product.category !== "office"~

The Notebook card should disappear and the others should stay.`),
        hints: [
          "The filter test currently says product.price < 20. Replace that whole test.",
          "Each product has a category property, so you can write product.category.",
          '.filter((product) => product.category !== "office")',
        ],
        tests: [
          { name: "The Notebook is not shown", code: 'return !text().includes("Notebook");' },
          { name: "Other products are still shown", code: 'return $$(".card").length >= 2 && text().includes("Cozy Mug");' },
          { name: "The code still uses filter and map", code: 'const s = files()["App.jsx"]; return s.includes(".filter(") && s.includes(".map(");' },
        ],
      },
    },
    {
      say: "Here's how I did it. The test now looks at category, not equal to office. The Notebook is gone and everything else stays. You can filter by anything in your data.",
      files: { "App.jsx": shopApp(prods4, filterCategory) },
      highlight: 'product.category !== "office"',
    },
    {
      say: "Lovely work. Map turns data into components, spread passes all the props in one go, and filter picks which items to show. Next up: showing things only some of the time.",
    },
  ],
};

// ---------- Lesson 3: conditional rendering ----------
const pc = (head, body) => `export default function ProductCard(${head}) {
${body}
}
`;
const cardBase = `    <div className="card">
      <h3>{name}</h3>
      <p>Price: \${price}</p>
    </div>`;
const pc0 = pc("{ name, price, stock }", `  return (
${cardBase}
  );`);
const pcIf = pc("{ name, price, stock }", `  if (stock === 0) {
    return (
      <div className="card">
        <h3>{name}</h3>
        <p className="sold">Sold out</p>
      </div>
    );
  }

  return (
${cardBase}
  );`);
const pcBody = (extra) => `  return (
    <div className="card">
      <h3>{name}</h3>
      <p>Price: \${price}</p>
${extra}
    </div>
  );`;
const ternaryLine = `      {stock > 0 ? <p className="left">{stock} in stock</p> : <p className="sold">Sold out</p>}`;
const pcTernary = pc("{ name, price, stock }", pcBody(ternaryLine));
const pcAnd = pc("{ name, price, stock }", pcBody(ternaryLine + "\n      {stock > 0 && <button>Add to cart</button>}"));
const pcTrap = pc("{ name, price, stock }", pcBody(ternaryLine + "\n      {stock && <button>Add to cart</button>}"));
const pcSale = `export default function ProductCard({ name, price, stock, onSale }) {
  return (
    <div className="card">
      <h3>{name}</h3>
      {onSale && <span className="badge">Sale</span>}
      <p>Price: \${price}</p>
${ternaryLine}
      {stock > 0 && <button>Add to cart</button>}
    </div>
  );
}
`;
const condApp = `import ProductCard from "./ProductCard.jsx";

export default function App() {
  return (
    <div className="shop">
      <h1>Cozy Shop</h1>
      <ProductCard name="Cozy Mug" price={12} stock={5} onSale={true} />
      <ProductCard name="Lamp" price={34} stock={0} />
    </div>
  );
}
`;

const lessonConditions = {
  kind: "scrim",
  id: "m11-conditions",
  title: "Showing things only sometimes",
  notes: md(`## Three ways to decide what to show

~~~jsx
// 1. if + return: very different outputs
if (stock === 0) {
  return <p>Sold out</p>;
}

// 2. ternary: this OR that, inside JSX
{stock > 0 ? <p>In stock</p> : <p>Sold out</p>}

// 3. &&: show this, or show nothing
{onSale && <span>Sale</span>}
~~~

- **if** works above the ~return~, as normal JavaScript. You cannot write ~if~ inside the curly braces of JSX.
- **ternary** (~condition ? a : b~) works inside curly braces.
- **&&** means "if the left side is true, show the right side".

## Showing nothing

React draws nothing for ~false~, ~null~ and ~undefined~. A component can also ~return null;~ to show nothing at all.

## The zero gotcha

~~~jsx
{stock && <button>Buy</button>}   // if stock is 0, the page shows 0!
{stock > 0 && <button>Buy</button>}  // correct
~~~

The number ~0~ is something React *does* show. So make the left side a real true or false, like ~stock > 0~.`),
  files: { ...base, "App.jsx": condApp, "ProductCard.jsx": pc0 },
  steps: [
    { say: "Pages aren't always the same. A button appears only when you're logged in. A message shows only when something goes wrong. Today we learn how to show things only sometimes." },
    { say: "Here's our shop again, with a Lamp that has zero in stock. Right now the Lamp card looks exactly like the Mug card. It should tell us it's sold out.", open: "App.jsx", highlight: "stock={0}" },
    {
      say: "Our first tool is an if statement, which you've used already. Inside ProductCard, before the return, we write: if stock equals zero, return a different card that says Sold out. A component can return early, and React shows whichever card it gets.",
      files: { "ProductCard.jsx": pcIf },
      open: "ProductCard.jsx",
      highlight: "if (stock === 0) {",
    },
    {
      say: "The Lamp says Sold out. This works, but we copied the whole card. For small differences inside one card, there's a neater way: the ternary. It's a question mark and a colon: condition, question mark, this, colon, that.",
      files: { "ProductCard.jsx": pcTernary },
      highlight: "{stock > 0 ? <p",
    },
    {
      say: "Read it aloud. Is stock greater than zero? If yes, show the in stock paragraph. If not, show Sold out. Ternaries work inside curly braces. An if statement can't go there, but a ternary can.",
    },
    {
      say: "Sometimes there's no either-or. We want to show something or show nothing. For that we use the double ampersand. Here, the Add to cart button only appears when stock is greater than zero.",
      files: { "ProductCard.jsx": pcAnd },
      highlight: "{stock > 0 && <button>Add to cart</button>}",
    },
    {
      say: "How does it work? If the left side is true, React shows the right side. If the left side is false, it shows nothing. The Mug has a button, the Lamp does not.",
    },
    {
      say: "Now a famous trap. Some people shorten it to stock and the double ampersand. Let me show you what happens with the Lamp.",
      files: { "ProductCard.jsx": pcTrap },
      highlight: "{stock && <button>Add to cart</button>}",
    },
    {
      say: "Look at the Lamp card. There's a zero sitting there! Why? Stock is the number zero, so the left side is zero, and the and operator hands back that zero. React happily shows numbers, so it prints it. React skips true, false, null and undefined. But zero it shows.",
    },
    {
      say: "The fix is to make the left side a real true or false, by writing stock greater than zero. Now the Lamp shows nothing extra. Whenever the left side of an and could be a number, compare it first.",
      files: { "ProductCard.jsx": pcAnd },
      highlight: "stock > 0 &&",
    },
    {
      say: "Your turn! The Mug has an onSale prop, set to true. The Lamp has none. Show a badge that says Sale, but only when onSale is true. Use the and operator.",
      challenge: {
        task: md(`**Challenge:** show a **Sale** badge only when the product is on sale.

1. In ~ProductCard.jsx~, add ~onSale~ to the destructured props.
2. Show ~<span className="badge">Sale</span>~ **only when** ~onSale~ is true. Use ~&&~.

The Mug (which has ~onSale={true}~) gets the badge. The Lamp doesn't.`),
        hints: [
          "Add onSale to the curly braces in the function's parentheses: { name, price, stock, onSale }.",
          "Remember the pattern: {condition && <something />}. Here the condition is onSale.",
          '{onSale && <span className="badge">Sale</span>}',
        ],
        tests: [
          { name: "Exactly one Sale badge is on the page", code: 'return $$(".badge").length === 1 && text(".badge") === "Sale";' },
          { name: "The badge is on the Cozy Mug card", code: 'const c = $$(".card")[0]; return !!c && c.textContent.includes("Cozy Mug") && !!c.querySelector(".badge");' },
          { name: "The Lamp card has no badge", code: 'const c = $$(".card")[1]; return !!c && c.textContent.includes("Lamp") && !c.querySelector(".badge");' },
        ],
      },
    },
    {
      say: "Here's my version. The Sale badge sits right under the name. If onSale isn't passed, it's undefined, and React shows nothing for undefined. So the Lamp stays clean.",
      files: { "ProductCard.jsx": pcSale },
      highlight: '{onSale && <span className="badge">Sale</span>}',
    },
    {
      say: "To sum up. Use if with return for big differences. Use a ternary for this or that inside JSX. Use the and operator for something or nothing, and remember to compare numbers first. Well done!",
    },
  ],
};

// ---------- Practice ----------
const practiceFix = {
  kind: "practice",
  id: "m11-practice-fix",
  title: "Practice: fix the shopping list",
  type: "fix",
  task: md(`This shopping list has **two bugs**.

1. Every list item is missing something that React needs (you may see a warning about it in the console).
2. All the items are already bought, so nothing is left to buy, but the page shows a stray **0** instead of the "All done!" message.

Fix both, then press **Check my code**.`),
  files: {
    ...base,
    "App.jsx": `export default function App() {
  const items = [
    { id: 1, name: "Apples", bought: true },
    { id: 2, name: "Bread", bought: true },
    { id: 3, name: "Milk", bought: true },
  ];
  const remaining = items.filter((item) => !item.bought).length;

  return (
    <div className="app">
      <h1>Shopping list</h1>
      <ul>
        {items.map((item) => (
          <li>{item.name}</li>
        ))}
      </ul>
      {remaining && <p className="left">{remaining} items left to buy</p>}
      {remaining === 0 && <p className="done">All done!</p>}
    </div>
  );
}
`,
  },
  solution: {
    "App.jsx": `export default function App() {
  const items = [
    { id: 1, name: "Apples", bought: true },
    { id: 2, name: "Bread", bought: true },
    { id: 3, name: "Milk", bought: true },
  ];
  const remaining = items.filter((item) => !item.bought).length;

  return (
    <div className="app">
      <h1>Shopping list</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      {remaining > 0 && <p className="left">{remaining} items left to buy</p>}
      {remaining === 0 && <p className="done">All done!</p>}
    </div>
  );
}
`,
  },
  hints: [
    "Bug 1: each item made by map needs a key. Every item already has an id you can use.",
    "Bug 2: when remaining is the number 0, the and operator hands back 0, and React shows it. Make the left side a real true or false.",
    "Add key={item.id} to the li, and change {remaining && ...} to {remaining > 0 && ...}.",
  ],
  tests: [
    { name: "The three items are listed", code: 'return $$("li").length === 3;' },
    { name: "Each list item uses a key", code: 'return /key=[{]/.test(files()["App.jsx"]);' },
    { name: 'The stray "0" is gone', code: 'return !text().split(" ").includes("0");' },
    { name: 'The page says "All done!"', code: 'return text(".done") === "All done!";' },
  ],
};

const playlistFix = (li) => `export default function App() {
  const songs = [
    { id: 1, title: "Sunrise", artist: "Ada" },
    { id: 2, title: "Rainy Day", artist: "Alan" },
    { id: 3, title: "Night Drive", artist: "Grace" },
  ];

  return (
    <div className="app">
      <h1>My Playlist</h1>
      <ul>
        {songs.map((song) => (
          ${li}
        ))}
      </ul>
    </div>
  );
}
`;

const practiceKeys = {
  kind: "practice",
  id: "m11-practice-keys",
  title: "Practice: fix the playlist",
  type: "fix",
  task: md(`The playlist should show **Sunrise by Ada**, **Rainy Day by Alan** and **Night Drive by Grace**. But there are **two bugs**:

1. The song titles are blank. Look at what each song object really contains.
2. The list items are missing the special prop that React needs when it shows a list.

Fix both, then press **Check my code**.`),
  files: { ...base, "App.jsx": playlistFix("<li>{song.name} by {song.artist}</li>") },
  solution: { "App.jsx": playlistFix("<li key={song.id}>{song.title} by {song.artist}</li>") },
  hints: [
    "Bug 1: each song has id, title and artist. There is no property called name.",
    "Bug 2: every item made by map needs a key. Each song already has an id.",
    "Use <li key={song.id}>{song.title} by {song.artist}</li>",
  ],
  tests: [
    { name: "Three songs are listed", code: 'return $$("li").length === 3;' },
    { name: "The first song reads Sunrise by Ada", code: 'return text("li") === "Sunrise by Ada";' },
    { name: "The list items use a key from the data", code: 'const s = files()["App.jsx"]; return /key=[{]/.test(s) && !s.includes("key={index}");' },
  ],
};

const petCardFile = `export default function PetCard({ name, animal, vaccinated }) {
  return (
    <div className="pet">
      <h3>{name}</h3>
      <p>{animal}</p>
      {vaccinated && <p className="vaccinated">Vaccinated</p>}
    </div>
  );
}
`;
const petsData = `const pets = [
  { id: 1, name: "Biscuit", animal: "Dog", adopted: false, vaccinated: true },
  { id: 2, name: "Luna", animal: "Cat", adopted: true, vaccinated: true },
  { id: 3, name: "Pip", animal: "Hamster", adopted: false, vaccinated: false },
  { id: 4, name: "Rex", animal: "Dog", adopted: true, vaccinated: false },
];
`;

const practiceBuild = {
  kind: "practice",
  id: "m11-practice-pets",
  title: "Practice: pets that need a home",
  type: "build",
  task: md(`Build a page of pets that **still need a home**.

The ~pets~ array and a finished ~PetCard~ component are ready for you. In ~App.jsx~:

1. Use ~.filter(...)~ to keep only the pets that are **not adopted** yet.
2. Use ~.map(...)~ to show a ~<PetCard>~ for each one. Give each a ~key~, and use the spread shortcut ~{...pet}~ to pass the props.
3. Show a paragraph ~<p className="count">~ that says how many there are, for example **2 pets need a home**.

Press **Run** to see it, then **Check my code**.`),
  files: {
    ...base,
    "PetCard.jsx": petCardFile,
    "App.jsx": `import PetCard from "./PetCard.jsx";

${petsData}
export default function App() {
  // Your code here: keep only the pets that are not adopted.

  return (
    <div className="page">
      <h1>Adoptable pets</h1>
      {/* Show the count and the PetCards here */}
    </div>
  );
}
`,
  },
  solution: {
    "App.jsx": `import PetCard from "./PetCard.jsx";

${petsData}
export default function App() {
  const available = pets.filter((pet) => !pet.adopted);

  return (
    <div className="page">
      <h1>Adoptable pets</h1>
      <p className="count">{available.length} pets need a home</p>
      {available.map((pet) => (
        <PetCard key={pet.id} {...pet} />
      ))}
    </div>
  );
}
`,
  },
  hints: [
    "Start with: const available = pets.filter((pet) => !pet.adopted); The exclamation mark means not.",
    "Then in the JSX: {available.map((pet) => (<PetCard key={pet.id} {...pet} />))}",
    "For the count: <p className=\"count\">{available.length} pets need a home</p>",
  ],
  tests: [
    { name: "Two pet cards are shown", code: 'return $$(".pet").length === 2;' },
    { name: "Only the pets without a home are shown", code: 'const t = text(); return t.includes("Biscuit") && t.includes("Pip") && !t.includes("Luna") && !t.includes("Rex");' },
    { name: 'The count says "2 pets need a home"', code: 'return text(".count").includes("2 pets need a home");' },
    { name: "The code uses filter, map and a key", code: 'const s = files()["App.jsx"]; return s.includes(".filter(") && s.includes(".map(") && /key=[{]/.test(s);' },
    { name: "Only Biscuit shows the vaccinated label", code: 'return $$(".vaccinated").length === 1;' },
  ],
};

const quiz = {
  kind: "quiz",
  id: "m11-quiz",
  title: "Quick check: lists and conditions",
  questions: [
    {
      q: "How many list items will this show?",
      code: "const nums = [10, 20, 30, 40];\n\n<ul>\n  {nums\n    .filter((n) => n > 15)\n    .map((n) => <li key={n}>{n}</li>)}\n</ul>",
      options: ["1", "2", "3", "4"],
      answer: 2,
      explain: "Filter keeps 20, 30 and 40, because those are bigger than 15. Map then makes a list item for each of the three.",
    },
    {
      q: "Why does React want a key on every list item?",
      options: [
        "To make the items look different",
        "So it can tell the items apart when the list changes",
        "Because map only works with keys",
        "To pass data into the component",
      ],
      answer: 1,
      explain: "A key is like a name tag. When items are added, removed or moved, React uses the tags to know which item is which.",
    },
    {
      q: "You have a list of pets, and each pet has a unique id. What is the best key?",
      code: "pets.map((pet, index) => (\n  <PetCard key={???} {...pet} />\n))",
      options: ["index", "pet.id", "Math.random()", "pets"],
      answer: 1,
      explain: "An id belongs to its pet and never changes. The index changes when items move or get deleted, and a random number is different on every render, so React can't track the items.",
    },
    {
      q: "The number of messages is 0. What does the page show?",
      code: "const count = 0;\n\n<div>\n  {count && <p>You have messages</p>}\n</div>",
      options: ["Nothing", "You have messages", "The number 0", "An error"],
      answer: 2,
      explain: "Zero is falsy, so the and operator hands back the zero, and React shows numbers. Write count > 0 on the left to get a real true or false.",
    },
    {
      q: 'Spot the bug. React says "Objects are not valid as a React child". Why?',
      code: 'const user = { name: "Sam", age: 9 };\n\n<p>Hello {user}</p>',
      options: [
        "The paragraph needs a key",
        "user is an object, and React cannot show a whole object",
        "age must be a string",
        "You can't put curly braces inside a paragraph",
      ],
      answer: 1,
      explain: "React can show text and numbers, but not a whole object. Pick the part you want, like {user.name}.",
    },
    {
      q: "What does the page show?",
      code: "const loggedIn = false;\n\n{loggedIn ? <p>Welcome back</p> : <p>Please sign in</p>}",
      options: ["Welcome back", "Please sign in", "Both messages", "Nothing"],
      answer: 1,
      explain: "A ternary picks the first option when the condition is true and the second when it is false. loggedIn is false, so we see Please sign in.",
    },
  ],
};

export default {
  id: "m11",
  title: "Lists and conditional rendering",
  summary: "Show arrays of data with map and keys, pass objects into components, and decide what appears with if, ternary and &&.",
  lessons: [lessonMap, practiceKeys, lessonComponentLists, practiceBuild, lessonConditions, practiceFix, quiz],
};
