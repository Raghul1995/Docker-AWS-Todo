// Import necessary modules
const express = require('express');
const cors = require('cors');

// Create an Express application
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Middleware for CORS handling
app.use(cors());

// Temporary storage for todos (you can replace this with a database)
let todos = [];

// Route to handle POST requests to add todos
app.post('/api/todos', (req, res) => {
  const { text, completed } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Todo text is required' });
  }

  const newTodo = { id: todos.length + 1, text, completed: !!completed };
  todos.push(newTodo);

  res.status(201).json(newTodo);
});

// Route to get all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
