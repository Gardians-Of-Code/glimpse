import { useEffect, useRef, useState } from "react";

import "./Bookmarks.css";

import { cn } from "@/lib/utils";
import { ChevronLeft, Pencil, Star, Trash2 } from "lucide-react";

import { useOnClickOutside } from "~components/use-on-click-outside";

import InputBookmark from "./InputBookmark";

type BookmarkType = {
  title: string;
  url: string;
  addedAt: Date;
  count: number;
  tags: string[]; // Added tags property
};

function Bookmarks() {
  const [showBookmarks, setShowBookmarks] = useState<string>("closed");
  const [currUrl, setCurrUrl] = useState<string>("");
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [customTags, setCustomTags] = useState<string[]>([]);
  // const [mlTags, mlTags] = useState<string[]>([]);

  // Load bookmarks from localStorage when component mounts
  useEffect(() => {
    const storedBookmarks = localStorage.getItem("bookmarks");
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    }
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (currUrl) {
      const title = getTitle(currUrl) || currUrl;
      const newBookmark = {
        title: title,
        url: currUrl,
        addedAt: new Date(),
        count: 0,
        tags: [] // Initialize tags array
      };

      // Update state using the callback form of setState to ensure localStorage is updated with the latest state
      setBookmarks((prevBookmarks) => {
        const updatedBookmarks = [...prevBookmarks, newBookmark];
        localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks)); // Update localStorage
        return updatedBookmarks;
      });

      setCurrUrl("");
    }
  };

  const handleDelete = (index: number) => {
    const newBookmarks = [...bookmarks];
    newBookmarks.splice(index, 1);
    setBookmarks(newBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
  };

  const handleModify = (index: number, newTitle: string, newUrl: string) => {
    const newBookmarks = [...bookmarks];
    newBookmarks[index].url = newUrl;
    newBookmarks[index].title = newTitle;
    setBookmarks(newBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
  };

  const handleBookmarkClick = (index: number) => {
    const newBookmarks = [...bookmarks];
    newBookmarks[index].count++; // Increment count when bookmark is clicked
    setBookmarks(newBookmarks);
    window.open(newBookmarks[index].url, "_self");
    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
  };

  const sortBookmarksByTag = (tag: string) => {
    let sortedBookmarks = [...bookmarks];
    switch (tag) {
      case "date":
        setShowBookmarks("date");
        sortedBookmarks.sort(
          (a, b) => b.addedAt.getTime() - a.addedAt.getTime()
        );
        break;
      case "frequency":
        setShowBookmarks("frequency");
        sortedBookmarks.sort((a, b) => b.count - a.count); // Sort by count (frequency)
        break;
      case "custom":
        setShowBookmarks("custom");
        sortedBookmarks.sort(
          (a, b) => b.addedAt.getTime() - a.addedAt.getTime()
        );
        break;
      case "ml":
        setShowBookmarks("ml");
        sortedBookmarks.sort((a, b) => b.count - a.count); // Sort by count (frequency)
        break;

      default:
    }
    setBookmarks(sortedBookmarks);
  };

  const handleCustomTagClick = (tag: string) => {
    const filteredBookmarks = bookmarks.filter((bookmark) =>
      bookmark.tags.includes(tag)
    );
    setBookmarks(filteredBookmarks);
  };

  const getTitle = (url: string) => {
    return "Title: " + url;
  };

  // on outside click, close the dropdown
  const bookmarkRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(bookmarkRef, () => {
    setShowBookmarks("closed");
  });
  return (
    <>
      <Star
        className={cn(
          "bookmark_toggle",
          showBookmarks === "closed" ? "" : "hidden"
        )}
        onClick={() => {
          setShowBookmarks("date");
        }}
      />

      {showBookmarks !== "closed" && (
        <>
          <div ref={bookmarkRef} className="bookmark-container">
            <button className="bookmark-button">
              <ChevronLeft
                className="bookmark_toggle"
                onClick={() => {
                  setShowBookmarks("closed");
                }}
              />
              <span className="bookmark_heading">Bookmarks </span>
            </button>

            <div className="bookmark-dropdown">
              <ul className="types">
                <li>
                  <button
                    className={cn(
                      "bookmark-types",
                      showBookmarks === "date"
                        ? "bg-black text-white hover:bg-black hover:text-white"
                        : ""
                    )}
                    onClick={() => {
                      setShowBookmarks("date");
                      sortBookmarksByTag("date");
                    }}>
                    Date
                  </button>
                </li>
                <li>
                  <button
                    className={cn(
                      "bookmark-types",
                      showBookmarks === "frequency"
                        ? "bg-black text-white hover:bg-black hover:text-white"
                        : ""
                    )}
                    onClick={() => {
                      setShowBookmarks("frequency");
                      sortBookmarksByTag("frequency");
                    }}>
                    Frequency
                  </button>
                </li>
                <li>
                  <button
                    className={cn(
                      "bookmark-types",
                      showBookmarks === "custom"
                        ? "bg-black text-white hover:bg-black hover:text-white"
                        : ""
                    )}
                    onClick={() => {
                      setShowBookmarks("custom");
                      sortBookmarksByTag("custom");
                    }}>
                    Custom tags
                  </button>
                </li>
                <li>
                  <button
                    className={cn(
                      "bookmark-types",
                      showBookmarks === "ml"
                        ? "bg-black text-white hover:bg-black hover:text-white"
                        : ""
                    )}
                    onClick={() => {
                      setShowBookmarks("ml");
                      sortBookmarksByTag("ml");
                    }}>
                    ML tags
                  </button>
                </li>
              </ul>
              <ul className="bookmarks">
                {bookmarks?.map((bookmark, index) => (
                  <li key={index}>
                    <div className="bookmark-elements">
                      <img
                        className="each_bookmark_img"
                        src={`https://www.google.com/s2/favicons?domain=${bookmark.url}`}
                        alt="favicon"
                        onClick={() => handleBookmarkClick(index)}
                      />
                      <span
                        className="each_bookmark_title"
                        onClick={() => handleBookmarkClick(index)}>
                        {bookmark.title}
                      </span>
                      <Pencil
                        className="edit"
                        onClick={() => {
                          const newUrl = prompt("Enter new URL:", bookmark.url);
                          const newTitle = prompt(
                            "Enter new Title:",
                            bookmark.title
                          );
                          if (newUrl !== null && newTitle !== null) {
                            handleModify(index, newTitle, newUrl);
                          }
                        }}
                      />
                      <Trash2
                        className="delete"
                        onClick={() => handleDelete(index)}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <InputBookmark
                bookmark={currUrl}
                setBookmark={setCurrUrl}
                handleAdd={handleAdd}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Bookmarks;
