import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [todotext, settodotext] = useState([]);
  const [inputval, setinputval] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [darkmode, setdarkmode] = useState(() => {
    const savedDarkmode = localStorage.getItem("darkmode");
    return savedDarkmode ? JSON.parse(savedDarkmode) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkmode", JSON.stringify(darkmode));
    if (darkmode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkmode]);

  useEffect(() => {
    axios.get('http://localhost:8000/todos')
      .then(response => settodotext(response.data))
      .catch(error => console.error('Error fetching todos:', error));
  }, []);

  const handleChange = (e) => {
    setinputval(e.target.value);
  };

  const handleSubmit = async () => {
    if (inputval.trim()) {
      const newTodo = { id: Date.now().toString(), text: inputval, completed: false };
      await axios.post("http://localhost:8000/todos", newTodo);
      settodotext([...todotext, newTodo]);
      setinputval("");
    }
  };

  const handleDelete = async () => {
    await axios.delete("http://localhost:8000/todos");
    settodotext([]);
  };

  const handleDeleteTask = async (indexToDelete) => {
    const todoToDelete = todotext[indexToDelete];
    await axios.delete(`http://localhost:8000/todos/${todoToDelete.id}`);
    const newTodos = todotext.filter((_, index) => index !== indexToDelete);
    settodotext(newTodos);
  };

  const handleEditTask = (indexToEdit) => {
    setEditIndex(indexToEdit);
    setEditText(todotext[indexToEdit].text);
  };

  const handleSaveTask = (indexToSave) => {
    const newTodos = todotext.map((todo, index) => {
      if (index === indexToSave) {
        return { ...todo, text: editText };
      }
      return todo;
    });
    settodotext(newTodos);
    setEditIndex(null);
    setEditText("");
  };

  const handleToggleComplete = (indexToToggle) => {
    const newTodos = todotext.map((todo, index) => {
      if (indexToToggle === index) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    settodotext(newTodos);
  };

  const toggleDarkMode = () => {
    setdarkmode(!darkmode);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className={`p-4 ${darkmode ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen`}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Todo App</h1>
        <button onClick={toggleDarkMode} className="p-2 my-2 text-2xl">
          {darkmode ? "🌞" : "🌜"}
        </button>
        <div className="flex flex-col md:flex-row mb-4">
          <input
            type="text"
            id="input"
            placeholder="Enter Your Task"
            value={inputval}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="border border-gray-300 p-2 flex-1 mb-2 md:mb-0 md:mr-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white p-2 mb-2 md:mb-0 md:ml-2"
          >
            Add
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white p-2 md:ml-2"
          >
            Delete All
          </button>
        </div>
        <ul className="list-none p-0">
          {todotext.map((todo, index) => (
            <li
              key={index}
              className="flex flex-col md:flex-row items-center justify-between mb-2 p-2 border-b dark:border-gray-600"
            >
              <div className="flex items-center flex-1 mb-2 md:mb-0">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(index)}
                  className="mr-2"
                />
                {editIndex === index ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 border p-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                ) : (
                  <span className={`flex-1 ${todo.completed ? "line-through" : ""}`}>
                    {todo.text}
                  </span>
                )}
              </div>
              <div className="flex">
                {editIndex === index ? (
                  <button
                    onClick={() => handleSaveTask(index)}
                    className="bg-green-500 text-white p-2 mr-2"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditTask(index)}
                    className="bg-yellow-500 text-white p-2 mr-2"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDeleteTask(index)}
                  className="bg-red-500 text-white p-2"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
