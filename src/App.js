import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todotext, settodotext] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [inputval, setinputval] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todotext));
  }, [todotext]);

  const handleChange = (e) => {
    setinputval(e.target.value);
  };

  const handleSubmit = () => {
    if (inputval.trim()) {
      settodotext([...todotext, { text: inputval, completed: false }]);
      setinputval("");
    }
  };

  const handleDelete = () => {
    settodotext([]);
  };

  const handleDeleteTask = (indexToDelete) => {
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
  const handletogglecomplete = (indextotoggle) => {
    const newTodos = todotext.map((todo, index) => {
      if (indextotoggle === index) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    settodotext(newTodos);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
      <div className="flex mb-4">
        <input
          type="text"
          id="input"
          placeholder="Enter Your Task"
          value={inputval}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          className="border border-gray-300 p-2 flex-1"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white p-2 ml-2"
        >
          Add
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white p-2 ml-2"
        >
          Delete All
        </button>
      </div>
      <ul className="list-none p-0">
        {todotext.map((todo, index) => (
          <li
            key={index}
            className="flex items-center justify-between mb-2 p-2 border-b"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handletogglecomplete(index)}
              className="mr-2"
            />
            {editIndex === index ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-1 border p-2"
              />
            ) : (
              <span
                className={`flex-1 ${todo.completed ? "line-through" : ""}`}
              >
                {todo.text}
              </span>
            )}
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
  );
}

export default App;
