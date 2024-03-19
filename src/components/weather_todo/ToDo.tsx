import { useState, useRef, useEffect } from "react";
import "./ToDo.css";
import React from "react";
// import ReactDOM from "react-dom/client";


const Input = ({ items, setItems }:{items:string[], setItems:React.Dispatch<React.SetStateAction<string[]>>}) => {
    const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (inputRef.current) {
      setItems([...items, inputRef.current.value]);
      inputRef.current.value = "";
    }
  };

  const handleDelete = (itemToDelete:string) => {
    setItems(() => items.filter((item) => item !== itemToDelete));
  };

  return (
    <div>
      <form
        onSubmit={(evt) => {
          handleSubmit(evt);
        }}
      >
        <input className="addTask" type="text" placeholder="Add a Task" ref={inputRef} />
        <button className="addButton">Add</button>
      </form>
      <div className="item-list-container">
        {items.length > 0 &&
          items.map((item:string) => (
            <div className="item" key={item}>
              {item}
              <button
                className="deleteButton"
                onClick={(evt) => {
                  handleDelete(item);
                }
              }
              >
                X
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

// const toggleTodos = () => {
//   setTodos(!Todos);
// };

function ToDo() {
  const storedItems = JSON.parse(localStorage.getItem("items")) || [];
  const [Todos, setTodos] = useState<boolean>(false);

  const toggleTodos = () => {
    setTodos(!Todos);
  };

  const [items, setItems] = useState(storedItems);

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items))
  }, [items]);
  
  return (
    <div className="todo-container">
      <button className="todo-button" onClick={toggleTodos}>
        To-do List
      </button>
      {Todos && (
        <div className="todo-dropdown">
          <Input items={items} setItems={setItems} />
        </div>
      )}
    </div>
  );

}

export default ToDo;
