const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const dataFile = path.join(process.env.DATA_DIR || '/app/data', 'todos.json');

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

let todos = [];

if (fs.existsSync(dataFile)) {
  const data = fs.readFileSync(dataFile, 'utf8');
  todos = JSON.parse(data);
} else {
  fs.writeFileSync(dataFile, JSON.stringify(todos));
}

const saveTodos = () => {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving todos:', error);
  }
};

app.post('/api/todos', (req, res) => {
  const { text, completed } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Todo text is required' });
  }

  const newTodo = { id: todos.length + 1, text, completed: !!completed };
  todos.push(newTodo);
  saveTodos();
  res.status(201).json(newTodo);
});

app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter(todo => todo.id !== id);
  if (todos.length === initialLength) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  saveTodos();
  res.sendStatus(204);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});