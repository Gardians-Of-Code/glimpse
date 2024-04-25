import { useState, useRef, useEffect } from "react";
import "./ToDo.css";
import React from "react";

import ToDoElement from "./ToDoElement";
import type { ToDoType } from "./ToDoType";
// import type { ToDoType } from "./ToDoElement";


function ToDo() {

  const [toDoList, settoDoList] = useState<ToDoType[]>(
    JSON.parse(localStorage.getItem("toDoList") as string || "[]")
  );
  // const [inEditMode,setinEditMode] = useState<boolean>(false);
  const [lastIndex, setLastIndex] = useState<number>(0);


  useEffect(() => {
    // if(inEditMode){
    localStorage.setItem("toDoList", JSON.stringify(toDoList));
    // }
  }, [toDoList]);

  const handleDeleteToDo = (index: number) => {
    const newToDoList = toDoList.filter((_, i) => i !== index);
    settoDoList(newToDoList);
  };

  const handleAddToDo = () => {
    const newToDoList = [
      ...toDoList,
      {
        title: "New ToDo",
        checked: false,
        deadline: new Date(),
      },
    ];
    settoDoList(newToDoList);
    // setinEditMode(true);
    setLastIndex(lastIndex + 1);
  };

  const changeTitle = (index: number, newTitle: string) => {
    const newToDoList = toDoList.map((toDo, i) =>
      i === index ? { ...toDo, title: newTitle } : toDo
    );
    settoDoList(newToDoList);
  };

  const changeDeadline = (index: number, newDeadline: Date) => {
    const newToDoList = toDoList.map((toDo, i) =>
      i === index ? { ...toDo, deadline: newDeadline } : toDo
    );
    settoDoList(newToDoList);
  };

  return (
    <div className="toDo">
      <div className="toDo_header">
        <h1 className="toDo_title">To Do</h1>
        <button className="toDo_add" onClick={handleAddToDo}>
          Add
        </button>
      </div>

      <div className="ToDo-Showing flex flex-col justify-start px-4">
        {toDoList?.map((toDoItem, index) => (
          <ToDoElement
            key={index}
            index={index} // Add the index prop here
            toDoItem={toDoItem}
            changeTitle={changeTitle}
            changeDeadline={changeDeadline}
            handleDeleteToDo={handleDeleteToDo}

          />
        ))}
      </div>
    </div>
  );






}