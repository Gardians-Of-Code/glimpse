import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip";

import { Pencil, Trash2 } from 'lucide-react';
import './ToDoElement.css';
import { useState } from 'react';

import DatePicker from "react-datepicker";

export default function SelectDateTime() {
    const [date, setDate] = useState(new Date());
    return (
        <div>
            <DatePicker
                showTimeSelect
                minTime={new Date(0, 0, 0, 12, 30)}
                maxTime={new Date(0, 0, 0, 19, 0)}
                selected={date}
                onChange={date => setDate(date)}
                dateFormat="MMMM d, yyyy h:mm aa"
            />
        </div>
    )
}

const DateTimeInlineEdit = ({ value, setValue }) => {
    const [editingValue, setEditingValue] = useState(value);
    const onChange = (event) => setEditingValue(event.target.value);

    const handleKeyDown = (event) => {
        const key = event.key;
        if (key === 'Enter' || key === 'Escape') {
            event.target.blur();
        }
    }

    const onBlur = () => {
        setValue(editingValue);
    }

    return (
        <input
            type="text"
            aria-label='Field to edit content'
            value={editingValue}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            onBlur={onBlur}
        />
    )
}

const InlineEdit = ({ value, setValue }) => {
    const [editingValue, setEditingValue] = useState(value);
    const onChange = (event) => setEditingValue(event.target.value);

    const handleKeyDown = (event) => {
        const key = event.key;
        if (key === 'Enter' || key === 'Escape') {
            event.target.blur();
        }
    }

    const onBlur = () => {
        setValue(editingValue);
    }

    return (
        <input
            type="text"
            aria-label='Field to edit content'
            value={editingValue}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            onBlur={onBlur}
        />
    )
}

export type ToDoType = {
    title: string;
    checked: boolean;
    deadline: Date;
}


const ToDoElement = (
    { toDoItem,
        // index,
        changeDeadline,
        changeTitle,
        handleDeleteToDo
    }:

        {
            toDoItem: ToDoType;
            // index: number; 
            changeTitle: (index: number, newTitle: string) => void;
            changeDeadline: (index: number, newDeadline: Date) => void;
            handleDeleteToDo: (index: number) => void;
        }

) => (
    <div key={index} className="todo-elements hover:scale-[1.02] transition-all duration-100 ease-out">
        <span className="each_todo_title">
            <InlineEdit value={toDoItem.title} setValue={(newTitle) => changeTitle(index, newTitle)} />
        </span>
        <span className="each_todo_deadline">
            <DateTimeInlineEdit value={toDoItem.deadline} setValue={(newDeadline) => changeDeadline(index, newDeadline)} />
        </span>
        <div className="flex items-center justify-center w-fit">
            <Trash2
                className="edit cursor-pointer"
                onClick={() => {
                    handleDeleteToDo(index);
                }} />
        </div>
    </div>
)