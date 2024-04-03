import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip";
import type { BookmarkType } from './Bookmarks';
import { Pencil, Trash2 } from 'lucide-react';

import './Bookmarks.css';

const Bookmark = (
    { bookmark, index, handleBookmarkClick, handleModify, handleDelete }:
        {
            bookmark: BookmarkType;
            index: number;
            handleBookmarkClick: (index: number) => void;
            handleModify: (index: number, title: string, newurl: string, tags: string) => void;
            handleDelete: (index: number) => void;
        }) => {
    return (
        <div key={index} className="bookmark-elements">
            <img
                className="each_bookmark_img cursor-pointer"
                src={`https://www.google.com/s2/favicons?domain=${bookmark.url}`}
                alt="favicon"
                onClick={() => handleBookmarkClick(index)}
            />
            <span
                className="each_bookmark_title cursor-pointer "
                onClick={() => handleBookmarkClick(index)}
            >
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span
                                // variant="custom"
                                // size="custom"
                                // className="w-full px-2 mx-2 overflow-ellipsis"
                                className=" text-nowrap overflow-ellipsis"
                            >
                                {bookmark.title}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <div className="flex flex-col text-center max-w-md overflow-hidden">
                                <span className="text-xs">{bookmark.title}</span>
                                <span className="text-xs truncate">
                                    {bookmark.url}
                                </span>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </span>
            <div className="flex items-center justify-center w-fit">
                <Pencil
                    className="edit cursor-pointer"
                    onClick={() => {
                        const newUrl = prompt("Enter new URL:", bookmark.url);
                        const newTitle = prompt("Enter new Title:", bookmark.title);
                        const newTags = prompt("Enter space-separated tags:", bookmark.tags.join(" "));
                        if (newUrl !== null && newTitle !== null && newTags !== null) {
                            handleModify(index, newTitle, newUrl, newTags);
                        }
                    }}
                />
                <Trash2
                    className="delete cursor-pointer"
                    onClick={() =>{handleDelete(index) } }
                />
            </div>
        </div>
    )
}

export default Bookmark;