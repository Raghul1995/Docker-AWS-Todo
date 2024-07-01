import React, { useState, useEffect } from 'react';
import './App.css';

// Use relative path for API calls when the app is served by the same server
const API_URL = '/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []); // Empty dependency array means this effect runs once after initial render

  const fetchTodos = () => {
    fetch(`${API_URL}/todos`)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => {
        console.error(err);
        setTodos([]); // Set to empty array in case of error
      });
  };
  
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
 
  const handleAddTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo = { text: inputValue, completed: false };
  
      fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      })
        .then((res) => res.json())
        .then(() => {
          setInputValue('');
          fetchTodos(); // Fetch updated list from server
        })
        .catch((err) => console.error(err));
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' });
      fetchTodos(); // Fetch updated list from server
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      <div className="todo-form">
        <input 
          type="text" 
          value={inputValue} 
          onChange={handleInputChange} 
          placeholder="Enter a new todo"
        />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;