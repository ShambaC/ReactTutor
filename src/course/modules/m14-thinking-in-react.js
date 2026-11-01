// Module 14: Thinking in React (components, lifting state up, derived state) built around one small Todo app.
// In notes/task strings a tilde (~) stands for a backtick, so we do not have to escape every code sample.
const md = (s) => s.replace(/~/g, "`");

const indexHtml = `<!doctype html>
<html>
  <head>
    <title>Todo app</title>
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

const css = `body { font-family: system-ui, sans-serif; background: #f5f3ff; margin: 0; }
.app { max-width: 380px; margin: 24px auto; background: white; padding: 20px; border-radius: 12px; }
h1 { margin-top: 0; font-size: 22px; }
ul { list-style: none; padding: 0; margin: 12px 0; }
li { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid #eee; }
li span { flex: 1; }
li.done span { text-decoration: line-through; color: #888; }
.add { display: flex; gap: 6px; }
.add input { flex: 1; padding: 6px; }
.filters { display: flex; gap: 6px; }
.filters button.active { background: #6d28d9; color: white; }
.footer { display: flex; justify-content: space-between; align-items: center; }
button { cursor: pointer; }
`;

const base = { "index.html": indexHtml, "index.js": indexJs, "styles.css": css };

// ---------- shared component sources ----------
const todoItemStatic = `export default function TodoItem({ title, done }) {
  return (
    <li className={done ? "done" : ""}>
      <input type="checkbox" checked={done} readOnly />
      <span>{title}</span>
    </li>
  );
}
`;

const todoListStatic = `import TodoItem from "./TodoItem.jsx";

export default function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} title={todo.title} done={todo.done} />
      ))}
    </ul>
  );
}
`;

const footerStatic = `export default function Footer({ left }) {
  return <p>{left} left</p>;
}
`;

const addStatic = `export default function AddTodo() {
  return (
    <div className="add">
      <input placeholder="What needs doing?" />
      <button>Add</button>
    </div>
  );
}
`;

const dataArr = `const initialTodos = [
  { id: 1, title: "Learn JSX", done: true },
  { id: 2, title: "Learn props", done: true },
  { id: 3, title: "Learn state", done: false },
];
`;

const sketch = `// The boxes in our app:
// App            the whole page
//   AddTodo      a text box and a button
//   TodoList     the list
//     TodoItem   one row
//   Footer       how many are left
`;

// ---------- lesson 1 App versions ----------
const app1_0 = `export default function App() {
  return (
    <div className="app">
      <h1>My Todos</h1>
    </div>
  );
}
`;
const app1_1 = sketch + "\n" + app1_0;
const app1_2 = `import TodoItem from "./TodoItem.jsx";

${sketch}
${dataArr.replace("initialTodos", "todos")}
export default function App() {
  return (
    <div className="app">
      <h1>My Todos</h1>
      <ul>
        {todos.map((todo) => (
          <TodoItem key={todo.id} title={todo.title} done={todo.done} />
        ))}
      </ul>
    </div>
  );
}
`;
const app1_3 = `import TodoList from "./TodoList.jsx";

${sketch}
${dataArr.replace("initialTodos", "todos")}
export default function App() {
  return (
    <div className="app">
      <h1>My Todos</h1>
      <TodoList todos={todos} />
    </div>
  );
}
`;
const app1_4 = `import TodoList from "./TodoList.jsx";
import Footer from "./Footer.jsx";

${sketch}
${dataArr.replace("initialTodos", "todos")}
export default function App() {
  return (
    <div className="app">
      <h1>My Todos</h1>
      <TodoList todos={todos} />
      <Footer left={1} />
    </div>
  );
}
`;
const app1_5 = `import TodoList from "./TodoList.jsx";
import AddTodo from "./AddTodo.jsx";
import Footer from "./Footer.jsx";

${sketch}
${dataArr.replace("initialTodos", "todos")}
export default function App() {
  return (
    <div className="app">
      <h1>My Todos</h1>
      <AddTodo />
      <TodoList todos={todos} />
      <Footer left={1} />
    </div>
  );
}
`;
const app1_6 = app1_5.replace(
  '  { id: 3, title: "Learn state", done: false },\n',
  '  { id: 3, title: "Learn state", done: false },\n  { id: 4, title: "Learn effects", done: false },\n'
);

// ---------- lesson 2 versions ----------
const staticApp = `import TodoList from "./TodoList.jsx";
import AddTodo from "./AddTodo.jsx";
import Footer from "./Footer.jsx";

${dataArr.replace("initialTodos", "todos")}
export default function App() {
  return (
    <div className="app">
      <h1>My Todos</h1>
      <AddTodo />
      <TodoList todos={todos} />
      <Footer left={1} />
    </div>
  );
}
`;

const appImports = (extra) => `import { useState } from "react";
import TodoList from "./TodoList.jsx";
import AddTodo from "./AddTodo.jsx";
${extra}import Footer from "./Footer.jsx";

${dataArr}
`;

const toggleFn = `  function toggleTodo(id) {
    setTodos((current) =>
      current.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo))
    );
  }
`;
const addFn = `  function addTodo(title) {
    setTodos((current) => [...current, { id: Date.now(), title: title, done: false }]);
  }
`;
const deleteFn = `  function deleteTodo(id) {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  }
`;

const app2_1 = `${appImports("")}export default function App() {
  const [todos, setTodos] = useState(initialTodos);

  return (
    <div className="app">
      <h1>My Todos</h1>
      <AddTodo />
      <TodoList todos={todos} />
      <Footer left={1} />
    </div>
  );
}
`;
const app2_2 = `${appImports("")}export default function App() {
  const [todos, setTodos] = useState(initialTodos);

${toggleFn}
  return (
    <div className="app">
      <h1>My Todos</h1>
      <AddTodo />
      <TodoList todos={todos} onToggle={toggleTodo} />
      <Footer left={1} />
    </div>
  );
}
`;
const app2_3 = `${appImports("")}export default function App() {
  const [todos, setTodos] = useState(initialTodos);

${toggleFn}
${addFn}
  return (
    <div className="app">
      <h1>My Todos</h1>
      <AddTodo onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} />
      <Footer left={1} />
    </div>
  );
}
`;
const app2_4 = `${appImports("")}export default function App() {
  const [todos, setTodos] = useState(initialTodos);

${toggleFn}
${addFn}
${deleteFn}
  return (
    <div className="app">
      <h1>My Todos</h1>
      <AddTodo onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
      <Footer left={1} />
    </div>
  );
}
`;

const todoItem1 = `export default function TodoItem({ id, title, done, onToggle }) {
  return (
    <li className={done ? "done" : ""}>
      <input type="checkbox" checked={done} onChange={() => onToggle(id)} />
      <span>{title}</span>
    </li>
  );
}
`;
const todoList1 = `import TodoItem from "./TodoItem.jsx";

export default function TodoList({ todos, onToggle }) {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          title={todo.title}
          done={todo.done}
          onToggle={onToggle}
        />
      ))}
    </ul>
  );
}
`;
const addTodoLive = `import { useState } from "react";

export default function AddTodo({ onAdd }) {
  const [text, setText] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (text.trim() === "") return;
    onAdd(text);
    setText("");
  }

  return (
    <form className="add" onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="What needs doing?"
      />
      <button>Add</button>
    </form>
  );
}
`;
const todoItem2 = `export default function TodoItem({ id, title, done, onToggle, onDelete }) {
  return (
    <li className={done ? "done" : ""}>
      <input type="checkbox" checked={done} onChange={() => onToggle(id)} />
      <span>{title}</span>
      <button onClick={() => onDelete(id)}>Delete</button>
    </li>
  );
}
`;
const todoList2 = `import TodoItem from "./TodoItem.jsx";

export default function TodoList({ todos, onToggle, onDelete }) {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          title={todo.title}
          done={todo.done}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
`;

const l2Final = { ...base, "App.jsx": app2_4, "TodoItem.jsx": todoItem2, "TodoList.jsx": todoList2, "AddTodo.jsx": addTodoLive, "Footer.jsx": footerStatic };

// ---------- lesson 3 versions ----------
const filterBar = `const options = ["All", "Active", "Done"];

export default function FilterBar({ filter, onChange }) {
  return (
    <div className="filters">
      {options.map((name) => (
        <button
          key={name}
          className={filter === name ? "active" : ""}
          onClick={() => onChange(name)}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
`;

const clearFn = `  function clearDone() {
    setTodos((current) => current.filter((todo) => !todo.done));
  }
`;

const app3 = (stateExtra, derived, filterJsx, listProp, footerProps, fns) => `import { useState } from "react";
import TodoList from "./TodoList.jsx";
import AddTodo from "./AddTodo.jsx";
${filterJsx ? 'import FilterBar from "./FilterBar.jsx";\n' : ""}import Footer from "./Footer.jsx";

${dataArr}
export default function App() {
  const [todos, setTodos] = useState(initialTodos);
${stateExtra}
${toggleFn}
${addFn}
${deleteFn}${fns}${derived}
  return (
    <div className="app">
      <h1>My Todos</h1>
      <AddTodo onAdd={addTodo} />
${filterJsx}      <TodoList todos={${listProp}} onToggle={toggleTodo} onDelete={deleteTodo} />
      <Footer ${footerProps} />
    </div>
  );
}
`;

const app3_1 = app3("  const [left, setLeft] = useState(1);\n", "", "", "todos", "left={left}", "");
const app3_2 = app3("", "  const left = todos.filter((todo) => !todo.done).length;\n", "", "todos", "left={left}", "");
const filterDerived = `  const left = todos.filter((todo) => !todo.done).length;

  let visible = todos;
  if (filter === "Active") {
    visible = todos.filter((todo) => !todo.done);
  }
  if (filter === "Done") {
    visible = todos.filter((todo) => todo.done);
  }
`;
const filterJsx = `      <FilterBar filter={filter} onChange={setFilter} />\n`;
const app3_3 = app3('  const [filter, setFilter] = useState("All");\n', filterDerived, filterJsx, "visible", "left={left}", "");
const app3_4 = app3('  const [filter, setFilter] = useState("All");\n', filterDerived, filterJsx, "visible", "left={left} onClear={clearDone}", clearFn + "\n");
const footerClear = `export default function Footer({ left, onClear }) {
  return (
    <div className="footer">
      <span>{left} left</span>
      <button onClick={onClear}>Clear done</button>
    </div>
  );
}
`;

// =====================================================================
export default {
  id: "m14",
  title: "Thinking in React",
  summary: "Learn how React developers plan an app: break it into components, share state by lifting it up, and calculate values instead of storing them.",
  lessons: [
    // ---------------------------------------------------------------- 1
    {
      kind: "scrim",
      id: "m14-components-first",
      title: "Thinking in React: boxes first",
      notes: md(`## Thinking in React: five steps

1. **Draw boxes** around the parts of the screen. Each box becomes a component with one job.
2. **Build a static version first.** Use props and fixed data. No state yet.
3. **Find the smallest state.** What data really changes over time?
4. **Decide where the state lives.** Put it in a parent that sits above every component that needs it.
5. **Connect the flow.** Data goes **down** through props. Events go **up** through functions.

## Why static first?

Showing the screen is a lot of typing and very little thinking. Adding behaviour is the opposite. Doing them one after the other keeps your head clear.

~~~jsx
const todos = [
  { id: 1, title: "Learn JSX", done: true },
];

{todos.map((todo) => (
  <TodoItem key={todo.id} title={todo.title} done={todo.done} />
))}
~~~

Because the screen is built from data, adding a todo to the array adds a row. The UI is a picture of the data.

## Common mistakes

- Making one giant component. Split when a part has its own job.
- Adding state too early. Props and plain data are enough for a first draft.`),
      files: { ...base, "App.jsx": app1_0 },
      steps: [
        { say: "Welcome! Today we learn how React developers think before they type. We'll plan and build a small todo app, one calm step at a time." },
        { say: "There are five steps. Draw boxes. Build it static. Find the state. Decide where state lives. Then connect everything. Today we do the first two.", open: "App.jsx" },
        {
          say: "Step one: draw boxes around the parts of the screen. The whole page is App. The text box and button are AddTodo. The list is TodoList, and one row is TodoItem. The count at the bottom is Footer.",
          files: { "App.jsx": app1_1 },
          highlight: "TodoItem   one row",
        },
        { say: "Each box has one job. That's the rule of thumb. If you can describe a part in one short sentence, it's probably a good component." },
        {
          say: "Step two: build a static version. Static means it only shows things and doesn't change yet. We start at the smallest box, TodoItem. It receives a title and a done flag as props.",
          files: { "TodoItem.jsx": todoItemStatic },
          open: "TodoItem.jsx",
          highlight: "{ title, done }",
        },
        {
          say: "In App we keep a small array of fixed todos, and use map to turn each one into a TodoItem. Remember the key prop: the id gives each row a name React can track.",
          files: { "App.jsx": app1_2 },
          highlight: "todos.map((todo) => (",
        },
        {
          say: "The list of rows deserves its own component. I'll move the unordered list into TodoList. It receives the whole array as a prop. Nothing changes on screen, but the code is tidier.",
          files: { "TodoList.jsx": todoListStatic, "App.jsx": app1_3 },
          open: "TodoList.jsx",
          highlight: "export default function TodoList({ todos })",
        },
        {
          say: "Next, Footer. For now we hard-code the number: one left. A fixed number is fine in a static version. We'll make it real later.",
          files: { "Footer.jsx": footerStatic, "App.jsx": app1_4 },
          open: "Footer.jsx",
          highlight: "{left} left",
        },
        {
          say: "Last box: AddTodo. A text box and a button that don't do anything yet. That's completely fine. We're only drawing the picture right now.",
          files: { "AddTodo.jsx": addStatic, "App.jsx": app1_5 },
          open: "AddTodo.jsx",
          highlight: "<button>Add</button>",
        },
        {
          say: "Our static version is finished. Notice the screen is built from data. So what do you think happens if we add a fourth todo to the array? Try it!",
          open: "App.jsx",
          challenge: {
            task: md(`**Challenge:** the page is a picture of the data. Prove it.

1. In ~App.jsx~, add a fourth todo to the ~todos~ array. Give it a new ~id~, a ~title~ you like, and ~done: false~.
2. Press **Run** and watch a new row appear. You never touched the other components.`),
            hints: [
              "Copy one of the lines inside the array, paste it underneath, and change the values.",
              "Every todo needs its own id. The next free number is 4.",
              'Add this line inside the array: `{ id: 4, title: "Learn effects", done: false },`',
            ],
            tests: [
              { name: "The list shows four todos", code: 'return $$("li").length === 4;' },
              { name: "Two todos are still ticked as done", code: 'return $$("li input").filter((i) => i.checked).length === 2;' },
            ],
          },
        },
        {
          say: "Here's how I did it. One new line in the array, and a fourth row appeared. Yours might have a different title, and that's perfect.",
          files: { "App.jsx": app1_6 },
          highlight: '{ id: 4, title: "Learn effects", done: false },',
        },
        {
          say: "Look at how data moves in this app. It starts in App, flows down into TodoList, then down into each TodoItem. Always downwards, parent to child, through props.",
          highlight: "<TodoList todos={todos} />",
        },
        { say: "That one-way flow is what makes React apps easier to follow. Next lesson we add behaviour. We'll find the state, and decide who should own it. Great work today!" },
      ],
    },

    // ---------------------------------------------------------------- practice fill
    {
      kind: "practice",
      id: "m14-practice-components",
      title: "Practice: split into components",
      type: "fill",
      task: md(`A static contact list. Fill in the blanks (~___~) to finish it:

1. In ~Contact.jsx~, show the ~name~ and the ~phone~ that arrive as props. Remember: JavaScript values in JSX go inside curly braces.
2. In ~App.jsx~, give each ~Contact~ its ~key~ (the person's ~id~), and pass the person's ~name~ and ~phone~ as props.

Press **Run**, then **Check my code**.`),
      files: {
        ...base,
        "Contact.jsx": `export default function Contact({ name, phone }) {
  return (
    <li>
      <strong>___</strong> - ___
    </li>
  );
}
`,
        "App.jsx": `import Contact from "./Contact.jsx";

const people = [
  { id: 1, name: "Ada", phone: "555-0101" },
  { id: 2, name: "Alan", phone: "555-0102" },
  { id: 3, name: "Grace", phone: "555-0103" },
];

export default function App() {
  return (
    <div className="app">
      <h1>Contacts</h1>
      <ul>
        {people.map((person) => (
          <Contact key={person.___} name={person.___} phone={person.___} />
        ))}
      </ul>
    </div>
  );
}
`,
      },
      solution: {
        "Contact.jsx": `export default function Contact({ name, phone }) {
  return (
    <li>
      <strong>{name}</strong> - {phone}
    </li>
  );
}
`,
        "App.jsx": `import Contact from "./Contact.jsx";

const people = [
  { id: 1, name: "Ada", phone: "555-0101" },
  { id: 2, name: "Alan", phone: "555-0102" },
  { id: 3, name: "Grace", phone: "555-0103" },
];

export default function App() {
  return (
    <div className="app">
      <h1>Contacts</h1>
      <ul>
        {people.map((person) => (
          <Contact key={person.id} name={person.name} phone={person.phone} />
        ))}
      </ul>
    </div>
  );
}
`,
      },
      hints: [
        "In Contact.jsx, the two props are named in the function's curly braces. Show them with `{name}` and `{phone}`.",
        "In App.jsx, each `person` is an object. Read its fields with dots, like `person.name`.",
        "The three blanks in App.jsx are `id`, `name` and `phone`.",
      ],
      tests: [
        { name: "Three contacts are shown", code: 'return $$("li").length === 3;' },
        { name: "Each contact shows name and phone", code: 'return text("li").includes("Ada") && text("li").includes("555-0101") && text().includes("Grace") && text().includes("555-0103");' },
        { name: "The contacts come from the data", code: 'return text().includes("Alan") && text().includes("555-0102");' },
      ],
    },
    // ---------------------------------------------------------------- 2
    {
      kind: "scrim",
      id: "m14-lifting-state",
      title: "Lifting state up",
      notes: md(`## Where should state live?

Put state in the **closest parent that sits above every component that needs it**. This is called **lifting state up**.

- The list of todos is needed by the list, the footer and the add form, so it lives in ~App~.
- The text being typed is needed only by the text box, so it stays inside ~AddTodo~.

## Data down, events up

- Data goes **down** as props.
- A child cannot change the parent's state directly. So the parent passes a **function** as a prop. The child calls it, and the parent changes its own state.

~~~jsx
// parent
function addTodo(title) {
  setTodos((current) => [...current, { id: Date.now(), title, done: false }]);
}
<AddTodo onAdd={addTodo} />

// child
onAdd(text);
~~~

## Updating without mutating

~~~jsx
// toggle one
current.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
// delete one
current.filter((t) => t.id !== id)
~~~

## Common mistakes

- Calling the function while passing it: ~onClick={onDelete(id)}~ runs immediately. Write ~onClick={() => onDelete(id)}~.
- Keeping the same data in two components. Keep one copy, in the parent.`),
      files: {
        ...base,
        "App.jsx": staticApp,
        "TodoItem.jsx": todoItemStatic,
        "TodoList.jsx": todoListStatic,
        "AddTodo.jsx": addStatic,
        "Footer.jsx": footerStatic,
      },
      steps: [
        { say: "Welcome back! Last time we built the static todo app. It looks right, but nothing happens when you click. Today we bring it to life.", open: "App.jsx" },
        { say: "Step three: find the smallest state. Ask: what changes over time? The list of todos changes when we add, tick or delete. The title of the page never changes, so that's not state." },
        { say: "Step four: who should own the todos? The list shows them, the footer will count them, and the form adds to them. The nearest parent above all of those is App. So the state lives in App." },
        {
          say: "We use state with the starting array. I rename the array to initialTodos, and call use state. Now App owns the todos, and passes them down. The page looks the same.",
          files: { "App.jsx": app2_1 },
          highlight: "const [todos, setTodos] = useState(initialTodos);",
        },
        {
          say: "Let's make ticking work. A checkbox lives deep in TodoItem, but the state lives up in App. So App will hand down a function. I'll start at the bottom. TodoItem gets an id and an onToggle function, and calls it on change.",
          files: { "TodoItem.jsx": todoItem1 },
          open: "TodoItem.jsx",
          highlight: "onChange={() => onToggle(id)}",
        },
        {
          say: "TodoList doesn't use onToggle itself. It only passes it along to each item, together with the todo's id.",
          files: { "TodoList.jsx": todoList1 },
          open: "TodoList.jsx",
          highlight: "onToggle={onToggle}",
        },
        {
          say: "Now App writes the function. It makes a new array with map. The todo with the matching id gets copied, with done flipped. Every other todo stays as it is. We never change the old array.",
          files: { "App.jsx": app2_2 },
          highlight: "{ ...todo, done: !todo.done }",
        },
        { say: "Try ticking a box in the preview. It works! Data flows down as props, and events flow up as function calls. Remember that sentence. It's the heart of React." },
        {
          say: "Now adding. The text typed in the box is only needed by AddTodo, so that state stays inside AddTodo. We keep state as low as we can. When the form is sent, it calls onAdd with the text.",
          files: { "AddTodo.jsx": addTodoLive },
          open: "AddTodo.jsx",
          highlight: "onAdd(text);",
        },
        {
          say: "In App, addTodo makes a new array: all the old todos, plus a new one. Date dot now gives a number that's different every time, which is handy for a unique id. We pass addTodo down as onAdd.",
          files: { "App.jsx": app2_3 },
          highlight: "<AddTodo onAdd={addTodo} />",
        },
        { say: "Type something and press Add. A new row appears! The input clears too, because we reset the text. Two components share one list, without ever talking to each other directly." },
        {
          say: "Your turn. Every row needs a Delete button. You'll follow the same path as toggle: button in TodoItem, pass it through TodoList, write the function in App.",
          challenge: {
            task: md(`**Challenge:** add a **Delete** button to every todo.

1. In ~TodoItem.jsx~, add ~<button onClick={() => onDelete(id)}>Delete</button>~ and receive ~onDelete~ as a prop.
2. In ~TodoList.jsx~, pass ~onDelete~ down to each ~TodoItem~.
3. In ~App.jsx~, write ~deleteTodo(id)~ using ~filter~, and pass it to ~TodoList~ as ~onDelete~.`),
            hints: [
              "Work from the bottom up, the same way as toggle: TodoItem first, then TodoList, then App.",
              "filter keeps the todos that pass a test. To delete, keep every todo whose id is NOT the one clicked.",
              "In App: `function deleteTodo(id) { setTodos((current) => current.filter((todo) => todo.id !== id)); }`",
            ],
            tests: [
              { name: "Every todo row has a Delete button", code: 'const rows = $$("li"); return rows.length > 0 && rows.every((li) => li.querySelector("button"));' },
              {
                name: "Clicking Delete removes that todo",
                code: 'const before = $$("li").length; await click("li button"); return $$("li").length === before - 1 && !text().includes("Learn JSX");',
              },
              {
                name: "Ticking a todo still works",
                code: 'const box = $$("li input")[$$("li input").length - 1]; const was = box.checked; await click(box); return $$("li input")[$$("li input").length - 1].checked !== was;',
              },
            ],
          },
        },
        {
          say: "Here's how I did it. The same three moves as toggle. A button in TodoItem, the function passed through TodoList, and filter in App. If your version differs a little, that's fine!",
          files: { "TodoItem.jsx": todoItem2, "TodoList.jsx": todoList2, "App.jsx": app2_4 },
          open: "App.jsx",
          highlight: "current.filter((todo) => todo.id !== id)",
        },
        { say: "The rule to remember: put state in the nearest parent above everything that needs it. Pass data down, pass functions down so children can send events up. Next, we'll learn to calculate values instead of storing them." },
      ],
    },

    // ---------------------------------------------------------------- practice build
    {
      kind: "practice",
      id: "m14-practice-packing",
      title: "Practice: build a packing list",
      type: "build",
      task: md(`Build a tiny packing list. The state lives in ~App~.

- Keep the items in state, starting with ~"Passport"~ and ~"Charger"~.
- Show each item as an ~<li>~.
- Add a text box and an **Add** button. Pressing the button adds the typed text as a new item, and clears the box.
- Show a heading like **Packing (2)**. The number must be calculated from the list, not stored.

Press **Run** to try it, then **Check my code**.`),
      files: {
        "index.html": indexHtml,
        "index.js": indexJs,
        "styles.css": css,
        "App.jsx": `import { useState } from "react";

export default function App() {
  // Your state goes here.

  return (
    <div className="app">
      <h1>Packing</h1>
      <ul>
        <li>Passport</li>
        <li>Charger</li>
      </ul>
    </div>
  );
}
`,
      },
      solution: {
        "App.jsx": `import { useState } from "react";

export default function App() {
  const [items, setItems] = useState(["Passport", "Charger"]);
  const [text, setText] = useState("");

  function addItem() {
    if (text.trim() === "") return;
    setItems((current) => [...current, text]);
    setText("");
  }

  return (
    <div className="app">
      <h1>Packing ({items.length})</h1>
      <div className="add">
        <input value={text} onChange={(event) => setText(event.target.value)} placeholder="Add an item" />
        <button onClick={addItem}>Add</button>
      </div>
      <ul>
        {items.map((item, index) => (
          <li key={item + index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
`,
      },
      hints: [
        "You need two pieces of state: the array of items, and the text currently typed in the box.",
        "On click, build a new array with the spread syntax: `[...current, text]`, then clear the text.",
        "The number in the heading is `items.length`. Write it inside curly braces in the heading.",
      ],
      tests: [
        { name: "The two starting items are shown", code: 'return $$("li").length === 2 && text().includes("Passport") && text().includes("Charger");' },
        { name: "The heading says Packing (2)", code: 'return /Packing \\(2\\)/.test(text("h1"));' },
        {
          name: "Typing and pressing Add adds an item",
          code: 'await type("input", "Socks"); await click("button"); return $$("li").length === 3 && text("ul").includes("Socks");',
        },
        { name: "The heading count matches the list", code: 'await type("input", "Hat"); await click("button"); const m = text("h1").match(/Packing \\((\\d+)\\)/); return !!m && Number(m[1]) === $$("li").length && $$("li").length > 2;' },
        { name: "The text box is cleared after adding", code: 'await type("input", "Map"); await click("button"); return $("input").value === "";' },
      ],
    },

    // ---------------------------------------------------------------- 3
    {
      kind: "scrim",
      id: "m14-derived-state",
      title: "Derived state: calculate, don't store",
      notes: md(`## Derived state

**Derived** means worked out from something else. If you can calculate a value from state you already have, **do not store it in state**. Calculate it while rendering.

~~~jsx
const left = todos.filter((todo) => !todo.done).length;
~~~

Two copies of the same truth drift apart. One calculation can never be out of date, because it runs again on every render.

## State vs derived

- **State**: the todos array, and which filter button is selected.
- **Derived**: how many are left, and the list of todos that match the filter.

~~~jsx
let visible = todos;
if (filter === "Active") visible = todos.filter((t) => !t.done);
if (filter === "Done") visible = todos.filter((t) => t.done);
~~~

## A quick test

Ask: can I work this out from other state or props? If yes, it's derived. Make it a plain variable.

## Common mistakes

- ~useState~ for a count that is really ~items.length~.
- Storing a filtered copy of the list in state. It goes stale when the original changes.`),
      files: l2Final,
      steps: [
        { say: "Welcome back! Our todo app can add, tick and delete. But the footer always says one left, because we typed that number by hand. Let's fix that properly.", open: "App.jsx" },
        {
          say: "Here's a tempting idea: store the count in its own state. I'll try it on purpose, so we can see why it causes trouble. Watch the footer when we tick a box.",
          files: { "App.jsx": app3_1 },
          highlight: "const [left, setLeft] = useState(1);",
        },
        { say: "Tick the first box, or add a todo. The number stays at one! The list changed, but nobody told the count. We'd have to remember to update it everywhere: add, tick, delete. Forget once, and it's wrong." },
        {
          say: "The fix is to calculate it. Left is the number of todos that are not done. We use filter to keep those, then dot length to count them. No state at all. This line runs on every render, so it's always right.",
          files: { "App.jsx": app3_2 },
          highlight: "const left = todos.filter((todo) => !todo.done).length;",
        },
        { say: "Try ticking, adding and deleting now. The footer is always correct. That's derived state: if you can work it out from state you already have, don't store it." },
        {
          say: "Now filter buttons: All, Active, and Done. A new component, FilterBar. It receives the selected filter, and a function to call when you click a button. It shows the buttons from an array.",
          files: { "FilterBar.jsx": filterBar },
          open: "FilterBar.jsx",
          highlight: 'const options = ["All", "Active", "Done"];',
        },
        {
          say: "What is state here? Only which button is selected. A single word. The list of visible todos is derived. We compute it from todos and filter, every render.",
          files: { "App.jsx": app3_3 },
          highlight: "let visible = todos;",
        },
        { say: "Click Active, then tick a todo. It disappears, right away! We never removed it. The visible list was worked out again with the new data. And the count follows along." },
        {
          say: "Your turn. Add a Clear done button that removes every finished todo at once. The state lives in App, so the function lives there too. The button can live in the footer.",
          challenge: {
            task: md(`**Challenge:** add a **Clear done** button.

1. In ~App.jsx~ write ~clearDone()~. It should keep only the todos that are **not** done.
2. Pass it to ~Footer~ as a prop called ~onClear~.
3. In ~Footer.jsx~ add a button with the text ~Clear done~ that calls it.`),
            hints: [
              "It's the same recipe as Delete: a function in App, passed down as a prop, called by a button.",
              "To keep only the unfinished todos, use filter with `!todo.done`.",
              "`function clearDone() { setTodos((current) => current.filter((todo) => !todo.done)); }`",
            ],
            tests: [
              { name: "There is a Clear done button", code: 'return $$("button").some((b) => /clear/i.test(b.textContent));' },
              {
                name: "Clicking it removes the finished todos",
                code: 'await click($$("button").find((b) => /clear/i.test(b.textContent))); return $$("li").length === 1 && text().includes("Learn state");',
              },
              {
                name: "The footer count stays correct",
                code: 'await click($$("button").find((b) => /clear/i.test(b.textContent))); return text().includes("1 left");',
              },
            ],
          },
        },
        {
          say: "Here's how I did it. A new function in App, a prop called onClear, and a button in the footer. Because left is derived, we didn't have to update the count. It fixed itself.",
          files: { "App.jsx": app3_4, "Footer.jsx": footerClear },
          open: "Footer.jsx",
          highlight: "<button onClick={onClear}>Clear done</button>",
        },
        { say: "Let's recap. State is the smallest set of data that changes: the todos and the selected filter. Everything else, like the count and the visible list, is derived. Calculate, don't store." },
        { say: "You've now used all five steps of thinking in React. Draw boxes, build static, find the state, lift it up, and connect the flow. You can plan any app this way. Well done!" },
      ],
    },

    // ---------------------------------------------------------------- practice fix
    {
      kind: "practice",
      id: "m14-practice-derived",
      title: "Practice: the count that never changes",
      type: "fix",
      task: md(`This shopping list shows **Bought: 1**, but the number never changes when you tick an item. Find out why and fix it.

Hint for thinking: do we really need a second piece of state? Press **Run**, tick some boxes, then **Check my code**.`),
      files: {
        "index.html": indexHtml,
        "index.js": indexJs,
        "styles.css": css,
        "App.jsx": `import { useState } from "react";

const start = [
  { id: 1, name: "Bread", bought: true },
  { id: 2, name: "Milk", bought: false },
  { id: 3, name: "Apples", bought: false },
];

export default function App() {
  const [items, setItems] = useState(start);
  const [boughtCount, setBoughtCount] = useState(1);

  function toggle(id) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, bought: !item.bought } : item))
    );
  }

  return (
    <div className="app">
      <h1>Shopping</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id} className={item.bought ? "done" : ""}>
            <input type="checkbox" checked={item.bought} onChange={() => toggle(item.id)} />
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
      <p>Bought: {boughtCount}</p>
    </div>
  );
}
`,
      },
      solution: {
        "App.jsx": `import { useState } from "react";

const start = [
  { id: 1, name: "Bread", bought: true },
  { id: 2, name: "Milk", bought: false },
  { id: 3, name: "Apples", bought: false },
];

export default function App() {
  const [items, setItems] = useState(start);
  const boughtCount = items.filter((item) => item.bought).length;

  function toggle(id) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, bought: !item.bought } : item))
    );
  }

  return (
    <div className="app">
      <h1>Shopping</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id} className={item.bought ? "done" : ""}>
            <input type="checkbox" checked={item.bought} onChange={() => toggle(item.id)} />
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
      <p>Bought: {boughtCount}</p>
    </div>
  );
}
`,
      },
      hints: [
        "The count is stored in its own state, so nothing updates it when an item is ticked.",
        "The count can be worked out from the items array. That makes it derived, so it doesn't need state.",
        "Delete the boughtCount state line and write: `const boughtCount = items.filter((item) => item.bought).length;`",
      ],
      tests: [
        { name: "It starts with Bought: 1", code: 'return text("p").includes("Bought: 1");' },
        { name: "Ticking Milk makes it Bought: 2", code: 'await click($$("li input")[1]); return text("p").includes("Bought: 2");' },
        { name: "Unticking Bread brings it back down", code: 'await click($$("li input")[0]); return text("p").includes("Bought: 1");' },
        { name: "The count is not kept in state", code: 'return !/useState\\(\\s*[0-9]+\\s*\\)/.test(files()["App.jsx"]);' },
      ],
    },

    // ---------------------------------------------------------------- quiz
    {
      kind: "quiz",
      id: "m14-quiz",
      title: "Quick check: thinking in React",
      questions: [
        {
          q: "When planning a React app, what comes first?",
          options: ["Writing all the state", "Drawing boxes around the parts of the screen", "Fetching data from a server", "Adding colours and styles"],
          answer: 1,
          explain: "Start by breaking the screen into components, each with one job. Then build a static version before you add any state.",
        },
        {
          q: "TodoList and Footer both need the list of todos. Where should the state live?",
          options: ["Inside Footer", "Inside TodoList", "In their closest common parent", "In both, so each has a copy"],
          answer: 2,
          explain: "Lift state up to the nearest parent above every component that needs it. Two copies would drift apart.",
        },
        {
          q: "What will the footer show?",
          code: 'const todos = [\n  { id: 1, done: true },\n  { id: 2, done: true },\n  { id: 3, done: false },\n];\nconst left = todos.filter((t) => !t.done).length;\n// <p>{left} left</p>',
          options: ["3 left", "2 left", "1 left", "0 left"],
          answer: 2,
          explain: "filter keeps the todos where done is false. Only one todo passes, so length is 1.",
        },
        {
          q: "Spot the bug. This delete button misbehaves. Why?",
          code: "<TodoItem onDelete={deleteTodo(todo.id)} />",
          options: [
            "It calls deleteTodo while rendering, instead of when clicked",
            "Delete buttons need a key",
            "deleteTodo must be a state variable",
            "Nothing is wrong",
          ],
          answer: 0,
          explain: "With round brackets the function runs straight away, during render. Pass a function instead: `onDelete={() => deleteTodo(todo.id)}`.",
        },
        {
          q: "Which of these should NOT be stored in state?",
          options: ["The list of todos", "Which filter is selected", "The number of todos that are not done", "The text typed in the add box"],
          answer: 2,
          explain: "The number left can be worked out from the todos. Calculate it while rendering so it can never be out of date.",
        },
        {
          q: "A child component wants to change the parent's state. How?",
          options: [
            "It changes the parent's variable directly",
            "The parent passes down a function, and the child calls it",
            "It can't. Children never talk to parents",
            "It creates its own copy of the state",
          ],
          answer: 1,
          explain: "Data flows down as props, events flow up as function calls. The parent keeps the state and owns the changes.",
        },
      ],
    },
  ],
};
