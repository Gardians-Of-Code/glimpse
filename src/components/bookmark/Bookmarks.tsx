import { useRef, useState, useEffect } from "react";
import "./Bookmarks.css";
import InputBookmark from "./InputBookmark";
import {
  Pencil,
  Trash2,
  Star,
  ChevronLeft,
  ChevronsUpDown,
  Check,
  Text,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useOnClickOutside } from "~components/use-on-click-outside";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type BookmarkType = {
  title: string;
  url: string;
  addedAt: Date;
  count: number;
  tags: string[]; // Added tags property
};

// type sortByType = "date" | "frequency" | "custom" | "ml";

function Bookmarks() {
  const [showBookmarks, setShowBookmarks] = useState<string>("closed");
  const [currUrl, setCurrUrl] = useState<string>("");
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [customTags, setCustomTags] = useState<string[]>([]);

  const [lock, setLock] = useState<boolean>(false);
  const [sorterOpen, setSorterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>(
    (localStorage.getItem("sortBy") as string) || "date",
  );
  const sortTypes = [
    { name: "Date", value: "date" },
    { name: "Frequency", value: "frequency" },
    { name: "A-Z", value: "a-z" },
    { name: "Z-A", value: "z-a" },
  ];
  // const [mlTags, mlTags] = useState<string[]>([]);

  // Load bookmarks from localStorage when component mounts
  useEffect(() => {
    const storedBookmarks = localStorage.getItem("bookmarks");
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    }
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currUrl) {
      // get title from url
      const response = await fetch("http://localhost:3000/api/v1/urldata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: currUrl }),
      });
      const data = await response.json();
      // console.log("data", data);
      const title = await data.title;
      const url = await data.url;
      const newBookmark = {
        title: title,
        url: url,
        addedAt: new Date(),
        count: 0,
        tags: [], // Initialize tags array
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
    const sortedBookmarks = [...bookmarks];
    switch (tag) {
      case "date":
        setShowBookmarks("date");
        sortedBookmarks.sort(
          (a, b) => b.addedAt.getTime() - a.addedAt.getTime(),
        );
        break;
      case "frequency":
        setShowBookmarks("frequency");
        sortedBookmarks.sort((a, b) => b.count - a.count); // Sort by count (frequency)
        break;
      case "custom":
        setShowBookmarks("custom");
        sortedBookmarks.sort(
          (a, b) => b.addedAt.getTime() - a.addedAt.getTime(),
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
      bookmark.tags.includes(tag),
    );
    setBookmarks(filteredBookmarks);
  };

  const getTitle = (url: string) => {
    return "Title: " + url;
  };

  // on outside click, close the dropdown
  const bookmarkRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(bookmarkRef, () => {
    console.log("lock", lock);
    console.log("showBookmarks", showBookmarks);
    console.log("sorterOpen", sorterOpen);
    if (lock) return;
    // else if (!sorterOpen) setLock(false);
    setShowBookmarks("closed");
  });
  return (
    <>
      <Star
        className={cn(
          "bookmark_toggle cursor-pointer hover:scale-110 transform transition-transform duration-300 ease-in-out",
          showBookmarks === "closed" ? "" : "hidden",
        )}
        onClick={() => {
          setShowBookmarks("open");
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
              {/* bookmark sorter */}
              <div className="flex items-center justify-start m-2">
                <Popover open={sorterOpen} onOpenChange={setSorterOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="custom"
                      size="custom"
                      role="combobox"
                      aria-expanded={sorterOpen}
                      className={cn(
                        "bookmark-types w-full h-full py-2  pl-2 rounded-[10px]",
                        showBookmarks === "sort"
                          ? "bg-black text-white hover:bg-black hover:text-white"
                          : "",
                      )}
                      onClick={() => {
                        setLock(true);
                        console.log("lock", lock);
                      }}
                    >
                      {sortBy ? (
                        <span className="w-full flex items-center justify-start">
                          <Text className="h-8/12 pr-2" />
                          {"Sort by: "}
                          {
                            sortTypes?.find(
                              (sortType) => sortType.value === sortBy,
                            )?.name
                          }
                        </span>
                      ) : (
                        <span className="truncate">Sort by</span>
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Select sort type" />
                      <CommandEmpty>No sorting type found</CommandEmpty>
                      <CommandGroup>
                        {sortTypes?.map((sortType) => (
                          <CommandItem
                            key={sortType.value}
                            value={sortType.value}
                            onSelect={(currentValue) => {
                              setSortBy(
                                currentValue === sortBy ? "" : currentValue,
                              );
                              localStorage.setItem("sortBy", currentValue);
                              console.log("sortType", sortType);
                              setSorterOpen(false);
                              setLock(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                sortBy === sortType.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {sortType.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <div className="flex gap-2 items-center justify-center">
                  <button
                    className={cn(
                      "bookmark-types ml-2 p-2.5",
                      showBookmarks === "custom"
                        ? "bookmark-types-active"
                        : "",
                    )}
                    onClick={() => {
                      setShowBookmarks("custom");
                      sortBookmarksByTag("custom");
                    }}
                  >
                    Custom
                  </button>

                  <button
                    className={cn(
                      "bookmark-types mr-2 p-2.5",
                      showBookmarks === "ml"
                        ? "bookmark-types-active"
                        : "",
                    )}
                    onClick={() => {
                      setShowBookmarks("ml");
                      sortBookmarksByTag("ml");
                    }}
                  >
                    Auto
                  </button>
                </div>
              </div>

              <div className="flex flex-col justify-start px-4">
                {bookmarks?.map((bookmark, index) => (
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
                          const newTitle = prompt(
                            "Enter new Title:",
                            bookmark.title,
                          );
                          if (newUrl !== null && newTitle !== null) {
                            handleModify(index, newTitle, newUrl);
                          }
                        }}
                      />
                      <Trash2
                        className="delete cursor-pointer"
                        onClick={() => handleDelete(index)}
                      />
                    </div>
                  </div>
                ))}
              </div>
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
