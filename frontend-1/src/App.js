import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []); // Empty dependency array means this effect runs once after initial render

  const fetchTodos = () => {
    fetch('http://localhost:3001/api/todos')
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error(err));
  };

  const handleInputChange = (e) => {
    console.log(e.target.value)
    setInputValue(e.target.value);
  };

  const handleAddTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo = { text: inputValue, completed: false };

      fetch('http://localhost:3001/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      })
        .then((res) => res.json())
        .then((data) => {
          setTodos([...todos, data]);
          setInputValue('');
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      <div className="todo-form">
        <input type="text" value={inputValue} onChange={handleInputChange} />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
