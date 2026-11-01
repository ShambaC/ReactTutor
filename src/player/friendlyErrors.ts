// Plain-language explanations for the errors beginners hit most. Matched against the raw message.
const RULES: [RegExp, (m: RegExpExecArray) => string][] = [
  [/(\w+) is not defined/, (m) => `JavaScript doesn't know anything called "${m[1]}" yet. Check the spelling (capital letters matter!), and make sure you created it with const/let/function or imported it.`],
  [/Adjacent JSX elements must be wrapped/i, () => "A component can only return one outer element. Wrap your elements in a <div>...</div> or an empty fragment <>...</>."],
  [/Unterminated JSX contents|Expected corresponding JSX closing tag/i, () => "A JSX tag was opened but not closed. Every <tag> needs a matching </tag>, or it should self-close like <img />."],
  [/Unexpected token|Unexpected character|Unterminated string/i, () => "There's a small typo that confuses JavaScript, like a missing bracket, quote or comma. Look at the line shown and the line just before it."],
  [/Cannot read propert(?:y|ies) of (undefined|null)(?: \(reading '(\w+)'\))?/, (m) => `The code tried to read ${m[2] ? `".${m[2]}"` : "a property"} from something that is ${m[1]} (empty). Often the data hasn't loaded yet, or a name is misspelled.`],
  [/(\S+) is not a function/, (m) => `"${m[1]}" was used like a function (with parentheses), but it isn't one. Check the name, and whether it was imported correctly.`],
  [/Assignment to constant variable/i, () => "A const can't be given a new value. Use let if the value needs to change (or useState in React)."],
  [/Objects are not valid as a React child/i, () => "React can't show a whole object on the page. Show one of its properties instead, like {user.name}."],
  [/Too many re-renders/i, () => "The component keeps updating itself forever. Usually an onClick={doThing()} should be onClick={doThing} or onClick={() => doThing()}."],
  [/Invalid hook call|Rendered (more|fewer) hooks/i, () => "Hooks like useState must be called at the top of a component function, not inside if-statements, loops or regular functions."],
  [/unique "key" prop/i, () => "When you make a list with .map(), give each item a key, like <li key={item.id}>. This is a warning, so your page still works."],
  [/Couldn't find the file/i, () => "An import points to a file that doesn't exist. Check the file name and the ./ path."],
  [/does not provide an export named|is not exported|default export/i, () => "The import doesn't match the export. A default export is imported without { }, a named export with { }."],
  [/useNavigate\(\)|useLocation\(\)|useParams|<Link> outside a <Router>|useHref\(\) may be used only in the context of a <Router>/i, () => "Router features only work inside a router. Make sure your app is wrapped in <BrowserRouter> (usually in index.js)."],
  [/Failed to fetch/i, () => "The data request didn't work. In this practice browser, use the built-in addresses like /api/users or /api/posts."],
];

export function explainError(message: string): string | null {
  for (const [re, f] of RULES) {
    const m = re.exec(message);
    if (m) return f(m);
  }
  return null;
}
