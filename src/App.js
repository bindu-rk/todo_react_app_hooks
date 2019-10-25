import React, { useState, useEffect } from "react";
import "./App.css";

// Header
const Header = () => {
  const headerStyle = {
    backgroundColor: "darkslategrey",
    color: "#fff",
    padding: "2px",
    textAlign: "center"
  };

  return (
    <div style={headerStyle}>
      <h1>Todo List</h1>
    </div>
  );
};

// Add new Todo
const AddTodo = ({ addTodo }) => {
  const [title, setTitle] = useState("");

  const handleChange = e => {
    setTitle(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    addTodo(title);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", height: "40px" }}>
      <input
        type="text"
        placeholder="Add Todo..."
        name="title"
        value={title}
        onChange={handleChange}
        style={{ flex: "10" }}
      />
      <button type="submit" style={{ flex: "1" }}>
        Submit
      </button>
    </form>
  );
};

// Display Todos
const Todos = ({ todo, toggleCompleted, delTodo }) => {
  const getStyle = () => {
    return {
      textDecoration: todo.completed ? "line-through" : "none",
      backgroundColor: "lightgray",
      padding: "1px",
      borderBottom: "1px dotted darkgray"
    };
  };

  const btnStyle = {
    backgroundColor: "darkgray",
    color: "red",
    borderRadius: "50%",
    float: "right",
    marginRight: "5px",
    padding: "5px 8px",
    border: "none"
  };

  return (
    <div style={getStyle()}>
      <p>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleCompleted(todo.id, todo.completed)}
        />
        {todo.title}
        <button style={btnStyle} onClick={() => delTodo(todo.id)}>
          X
        </button>
      </p>
    </div>
  );
};

// Todos actions and state
const App = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos?_limit=10")
      .then(res => res.json())
      .then(data => setTodos(data));
    //eslint-diable-next-line
  }, []);

  const toggleCompleted = (id, completed) => {
    const newCompleted = completed ? false : true;

    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ completed: newCompleted })
    })
      .then(res => res.json())
      .then(data => {
        setTodos(
          todos.map(todo => {
            if (todo.id === data.id) {
              todo.completed = data.completed;
            }
            return todo;
          })
        );
      });
  };

  const delTodo = id => {
    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(data => {
        setTodos(todos.filter(todo => todo.id !== id));
      });
  };

  const addTodo = title => {
    const newTodo = { title: title, completed: false };

    fetch("https://jsonplaceholder.typicode.com/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTodo)
    })
      .then(res => res.json())
      .then(data => {
        setTodos([...todos, data]);
      });
  };

  return (
    <div className="App">
      <Header />
      <AddTodo addTodo={addTodo} />
      {todos.map(todo => (
        <Todos
          key={todo.id}
          todo={todo}
          toggleCompleted={toggleCompleted}
          delTodo={delTodo}
        />
      ))}
    </div>
  );
};

export default App;
