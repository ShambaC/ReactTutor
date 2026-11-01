// Offline data served by the sandbox's fetch for /api/<name> and /api/<name>/<id>. Lessons on fetching use these.
export const MOCK_API = {
  users: [
    { id: 1, name: "Ada Lovelace", username: "ada", email: "ada@example.com", city: "London" },
    { id: 2, name: "Alan Turing", username: "alan", email: "alan@example.com", city: "Manchester" },
    { id: 3, name: "Grace Hopper", username: "grace", email: "grace@example.com", city: "New York" },
    { id: 4, name: "Katherine Johnson", username: "katherine", email: "kj@example.com", city: "Hampton" },
    { id: 5, name: "Linus Torvalds", username: "linus", email: "linus@example.com", city: "Helsinki" },
  ],
  posts: [
    { id: 1, userId: 1, title: "Notes on the Analytical Engine", body: "Machines can do more than arithmetic." },
    { id: 2, userId: 2, title: "Can machines think?", body: "A question worth asking carefully." },
    { id: 3, userId: 3, title: "Finding the first bug", body: "It was a real moth in a relay." },
    { id: 4, userId: 3, title: "Why compilers matter", body: "Humans should write in words, not numbers." },
    { id: 5, userId: 4, title: "Trusting the math", body: "Check the numbers, then check them again." },
  ],
  todos: [
    { id: 1, title: "Learn what a variable is", done: true },
    { id: 2, title: "Write my first function", done: true },
    { id: 3, title: "Build a React component", done: false },
    { id: 4, title: "Add a second page with React Router", done: false },
  ],
  products: [
    { id: 1, name: "Cozy Mug", price: 12, category: "kitchen", emoji: "☕", inStock: true },
    { id: 2, name: "Desk Plant", price: 18, category: "home", emoji: "🪴", inStock: true },
    { id: 3, name: "Notebook", price: 6, category: "office", emoji: "📓", inStock: false },
    { id: 4, name: "Headphones", price: 59, category: "tech", emoji: "🎧", inStock: true },
    { id: 5, name: "Water Bottle", price: 15, category: "kitchen", emoji: "🧴", inStock: true },
    { id: 6, name: "Lamp", price: 34, category: "home", emoji: "💡", inStock: false },
  ],
  recipes: [
    { id: 1, title: "Pancakes", minutes: 20, emoji: "🥞", ingredients: ["flour", "milk", "egg", "sugar"], steps: ["Mix everything.", "Cook on a hot pan.", "Flip when bubbly."] },
    { id: 2, title: "Tomato Pasta", minutes: 25, emoji: "🍝", ingredients: ["pasta", "tomatoes", "garlic", "olive oil"], steps: ["Boil the pasta.", "Cook garlic and tomatoes.", "Mix together."] },
    { id: 3, title: "Fruit Salad", minutes: 10, emoji: "🥗", ingredients: ["apple", "banana", "berries", "yogurt"], steps: ["Chop the fruit.", "Add yogurt.", "Stir and enjoy."] },
    { id: 4, title: "Grilled Cheese", minutes: 12, emoji: "🧀", ingredients: ["bread", "cheese", "butter"], steps: ["Butter the bread.", "Add cheese.", "Toast both sides."] },
  ],
  quotes: [
    { id: 1, text: "Everyone was a beginner once.", author: "Unknown" },
    { id: 2, text: "Mistakes are proof that you are trying.", author: "Unknown" },
    { id: 3, text: "Small steps every day add up.", author: "Unknown" },
  ],
};
