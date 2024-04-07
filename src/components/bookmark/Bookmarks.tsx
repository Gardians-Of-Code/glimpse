import { useRef, useState, useEffect } from "react";
import "./Bookmarks.css";
import InputBookmark from "./InputBookmark";
import { Pencil, Trash2, Star, ChevronLeft, ChevronsUpDown, Check, Text, ChevronDown, ChevronRight, Delete, X, } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOnClickOutside } from "~components/use-on-click-outside";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import Bookmark from "./Bookmark";
import { count } from "console";


export type BookmarkType = {
  title: string;
  url: string;
  addedAt: number;
  count: number;
  tags: string[]; // Added tags property
};

type customTagType = {
  tagname: string;
  show: boolean;
  count: number;
};

// type sortByType = "date" | "frequency" | "custom" | "ml";

function Bookmarks() {
  const [bookmarkCategory, setBookmarkCategory] = useState<string>("closed");
  const [currUrl, setCurrUrl] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>(
    JSON.parse(localStorage.getItem("bookmarks") as string) || [],
  );
  const [customTags, setCustomTags] = useState<customTagType[]>(
    JSON.parse(localStorage.getItem("customTags") as string) || [],
  );

  const [lock, setLock] = useState<boolean>(false);
  const [sorterOpen, setSorterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>(
    (localStorage.getItem("sortBy") as string) || "m_recent",
  );
  const sortTypes = [
    { name: "Most recent", value: "m_recent" },
    { name: "Least recent", value: "l_recent" },
    { name: "Most used", value: "m_frequency" },
    { name: "Least used", value: "l_frequency" },
    { name: "A-Z", value: "a-z" },
    { name: "Z-A", value: "z-a" },
  ];

  useEffect(() => {
    const sortedBookmarks = [...bookmarks];
    // console.log(sortedBookmarks);

    switch (sortBy) {

      case "m_recent":
        sortedBookmarks.sort((a, b) => b.addedAt - a.addedAt);
        break;

      case "l_recent":
        sortedBookmarks.sort((a, b) => a.addedAt - b.addedAt);
        break;

      case "m_frequency":
        sortedBookmarks.sort((a, b) => b.count - a.count);
        break;

      case "l_frequency":
        sortedBookmarks.sort((a, b) => a.count - b.count);
        break;

      case "a-z":
        sortedBookmarks.sort((a, b) => a.title.localeCompare(b.title));
        break;

      case "z-a":
        sortedBookmarks.sort((a, b) => b.title.localeCompare(a.title));
        break;

      default:
        break;
    }
    setBookmarks(sortedBookmarks);
  }, [sortBy])

  const updateLocalStorage = () => {
    // Filtering and updating custom tags and bookmarks in local storage
    const filteredCustomTags = customTags.filter(tag => tag.count > 0);
    console.log("filteredCustomTags", filteredCustomTags);
    localStorage.setItem("customTags", JSON.stringify(filteredCustomTags));
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  };

  //any changes in customTags or bookmarks will trigger this useEffect
  // useEffect(() => {
  //   // Filter out tags with count === 0
  //     updateLocalStorage(); // Call the function to update local storage

  //   //no need to call LocalStorage.setItem in handleAddBookmark, handleDeleteBookmark, handleModifyBookmark as it is already being called here
  // }, [customTags, bookmarks])

  useEffect(() => {
    const filteredCustomTags = customTags.filter(tag => tag.count > 0);
    console.log("filteredCustomTags", filteredCustomTags);
    localStorage.setItem("customTags", JSON.stringify(filteredCustomTags));
  }, [customTags]);


  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks])

  // // Load bookmarks from localStorage when component mounts
  // useEffect(() => {
  //   const storedBookmarks = localStorage.getItem("bookmarks");
  //   const storedCustomTags = localStorage.getItem("customTags");
  //   if (storedBookmarks) {
  //     setBookmarks(JSON.parse(storedBookmarks));
  //   }
  //   if (storedCustomTags) {
  //     setCustomTags(JSON.parse(storedCustomTags));
  //   }
  // }, []);

  const handleAddBookmark = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("tags", tags);
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

      //if bookmark already exists, do not add, show message that already exists
      if (bookmarks.some(bookmark => bookmark.url === url)) {
        alert("Bookmark already exists");
        //clear input fields
        setCurrUrl("");
        setTags("");
        return;
      }

      //else add the bookmark

      const tagsToAdd = tags.split(",").filter(tag => tag.trim() !== ""); // Parse entered tags
      // trim in each tag inside tagsToAdd trailing or leading spaces
      tagsToAdd.forEach((tag, index) => { tagsToAdd[index] = tag.trim(); });
      //remove repeated elements from tagsToAdd
      const uniqueTagsArray = tagsToAdd.filter((item, index) => tagsToAdd.indexOf(item) === index);
      // console.log("tagsToAdd", tagsToAdd);
      const newBookmark = {
        title: title,
        url: url,
        addedAt: Date.now(),
        count: 0,
        tags: uniqueTagsArray, // Initialize tags array
      };
      console.log("newBookmark", newBookmark);
      updateTags("", tags); // Update custom tags

      // Update state using the callback form of setState to ensure localStorage is updated with the latest state
      setBookmarks((prevBookmarks) => {
        const updatedBookmarks = [...prevBookmarks, { ...newBookmark, tags: uniqueTagsArray }];
        localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks)); // Update localStorage
        return updatedBookmarks;
      });

      setCurrUrl("");
      setTags("");
    }
  };

  const handleDeleteBookmark = (url: string) => {
    const index = bookmarks.findIndex(bookmark => bookmark.url === url);
    const deletedBookmark = bookmarks[index];
    const newBookmarks = [...bookmarks];

    newBookmarks.splice(index, 1); // Remove bookmark from array

    updateTags(deletedBookmark.tags.join(","), ""); // Update custom tags

    setBookmarks(newBookmarks);

  };

  const updateTags = (oldtags: string, newtags: string) => {

    const oldTagsArray = oldtags.split(",").filter(tag => tag.trim() !== ""); // Parse existing tags
    // trim in each tag inside oldTagsArray trailing or leading spaces
    oldTagsArray.forEach((tag, index) => { oldTagsArray[index] = tag.trim(); });
    console.log("oldTagsArray", oldTagsArray);

    const newTagsArray = newtags.split(",").filter(tag => tag.trim() !== ""); // Parse entered tags
    // trim in each tag inside newTagsArray trailing or leading spaces
    newTagsArray.forEach((tag, index) => { newTagsArray[index] = tag.trim(); });
    console.log("newTagsArray", newTagsArray);

    //remove repeated tags from newTagsArray
    const uniqueTagsArray = newTagsArray.filter((item, index) => newTagsArray.indexOf(item) === index);
    // Determine tags that were added, removed, or retained
    const tagsAdded = uniqueTagsArray.filter(tag => !oldTagsArray.includes(tag));
    const tagsRemoved = oldTagsArray.filter(tag => !uniqueTagsArray.includes(tag));
    const tagsRetained = uniqueTagsArray.filter(tag => oldTagsArray.includes(tag));

    // Update custom tags
    const updatedCustomTags: customTagType[] = [];
    for (let i = 0; i < customTags.length; i++) {
      const tag = customTags[i];
      if (tagsRemoved.includes(tag.tagname)) {
        // Decrement count if tag is removed
        updatedCustomTags.push({
          ...tag,
          count: tag.count - 1,
        });
      } else if (tagsAdded.includes(tag.tagname)) {
        // Increment count if tag is added
        updatedCustomTags.push({
          ...tag,
          count: tag.count + 1,
        });
      } else {
        // Retain count for existing tags
        updatedCustomTags.push(tag);
      }
    }

    // Add new tags to custom tags if they don't exist
    tagsAdded.forEach(tag => {
      const existingTag = updatedCustomTags.find(t => t.tagname === tag);
      if (!existingTag) {
        updatedCustomTags.push({
          tagname: tag,
          show: false,
          count: 1,
        });
      }
    });

    // Sort custom tags alphabetically
    updatedCustomTags.sort((a, b) => a.tagname.localeCompare(b.tagname));
    console.log("updatedCustomTags", updatedCustomTags);

    setCustomTags(updatedCustomTags);
    // return newTagsArray;
  }

  const handleModifyBookmark = (newTitle: string, newUrl: string, newTags: string) => {
    let index: number;
    if (bookmarks.some(bookmark => bookmark.url === newUrl)) {
      index = bookmarks.findIndex(bookmark => bookmark.url === newUrl);
    }
    else {
      // to write code to handle this case if url changes
      return;
    }

    const newBookmarks = [...bookmarks];
    const oldTagsArray = newBookmarks[index].tags;
    const newTagsArray = newTags.split(",").filter(tag => tag.trim() !== ""); // Parse entered tags
    // trim in each tag inside newTagsArray trailing or leading spaces
    newTagsArray.forEach((tag, index) => { newTagsArray[index] = tag.trim(); });
    //remove repeated tags from newTagsArray
    const uniqueTagsArray = newTagsArray.filter((item, index) => newTagsArray.indexOf(item) === index);

    //update tags
    updateTags(oldTagsArray.join(","), newTags);

    // Update bookmark
    newBookmarks[index].url = newUrl;
    newBookmarks[index].title = newTitle;
    newBookmarks[index].tags = uniqueTagsArray;
    // console.log("newBookmarks", newBookmarks);
    setBookmarks(newBookmarks);
  };

  const handleDeleteCustomTag = (tagname: string) => {
    //if any bookmark contain this tag remove it from tags list of that bookmark
    const newBookmarks = [...bookmarks];
    newBookmarks.forEach(bookmark => {
      if (bookmark.tags.includes(tagname)) {
        const index = bookmark.tags.indexOf(tagname);
        bookmark.tags.splice(index, 1);
      }
    });
    // Remove tag from custom tags
    const updatedCustomTags = customTags.filter(tag => tag.tagname !== tagname);
    localStorage.setItem("customTags", JSON.stringify(updatedCustomTags));

    setBookmarks(newBookmarks);
    setCustomTags(updatedCustomTags);
    // setCustomTags([]);
    // console.log("updatedCustomTags", updatedCustomTags);
  }

  const handleBookmarkClick = (url: string) => {
    const newBookmarks = [...bookmarks];
    //get index of bookmark with this url
    const index = newBookmarks.findIndex(bookmark => bookmark.url === url);
    newBookmarks[index].count++; // Increment count when bookmark is clicked
    setBookmarks(newBookmarks);
    window.open(newBookmarks[index].url, "_self");
    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
  };

  // on outside click, close the dropdown
  const bookmarkRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(bookmarkRef, () => {
    // console.log("lock", lock);
    // console.log("bookmarkCategory", bookmarkCategory);
    // console.log("sorterOpen", sorterOpen);
    if (lock) return;
    // else if (!sorterOpen) setLock(false);
    setBookmarkCategory("closed");
  });

  //------------------------------------------------------------------//
  return (
    <>
      <Star
        className={cn(
          "star cursor-pointer hover:scale-110 transform transition-transform duration-300 ease-in-out",
          bookmarkCategory === "closed" ? "" : "hidden",
        )}
        onClick={() => {
          setBookmarkCategory("sort");
        }}
      />

      {bookmarkCategory !== "closed" && (
        <>
          <div ref={bookmarkRef} className="bookmark-container">
            {/* heading*/}

            <div className="bookmark-button">
              <ChevronLeft
                className="bookmark_close cursor-pointer"
                onClick={() => {
                  setBookmarkCategory("closed");
                }}
              />
              <span className="bookmark_heading">Bookmarks</span>
            </div>


            {/* options of category UI for bookmarks */}

            <div className="bookmark-dropdown">
              {/* bookmark showing options */}
              <div>
                <div className="flex items-center justify-start m-2">



                  {/* sortBy implementation */}

                  {/* end of sortBy implementation */}
                  <div className="flex gap-2 items-center justify-center">

                    <button
                      className={cn(
                        "bookmark-types h-full ml-2 py-1 pl-2 rounded-[10px] flex items-center",
                        { "hover:bg-black/20 hover:text-white": bookmarkCategory !== "sort" },
                        { "bookmark-types-active": bookmarkCategory === "sort" },
                      )}
                      onClick={() => {
                        setBookmarkCategory("sort");
                        setLock(true);
                        // console.log("lock", lock);
                      }}
                    >
                      {sortBy ? (
                        <span className="w-full flex items-center justify-start">
                          <Text className="h-8/12 pr-2" />
                          {"All: "}
                          {
                            sortTypes?.find(
                              (sortType) => sortType.value === sortBy,
                            )?.name
                          }
                        </span>
                      ) : (
                        <span className="truncate">Sort by</span>
                      )}
                      <Popover open={sorterOpen} onOpenChange={setSorterOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="custom"
                            size="custom"
                            role="combobox"
                            aria-expanded={sorterOpen}

                          >

                            <ChevronsUpDown className="ml-2 h-4 w-4 mr-2 shrink-0 opacity-100" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="ml-5 w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Select sort type" />
                            <CommandEmpty>No sorting type found</CommandEmpty>
                            <CommandGroup>
                              {sortTypes?.map((sortType) => (
                                <CommandItem
                                  key={sortType.value}
                                  value={sortType.value}
                                  onSelect={(currentValue) => {
                                    // setSortBy(
                                    //   currentValue === sortBy ? "" : currentValue,
                                    // );
                                    setSortBy(currentValue);
                                    localStorage.setItem("sortBy", currentValue);
                                    // console.log("sortBy", sortBy);
                                    // console.log("sortType", sortType);
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
                    </button>


                    {/* Custom tags */}
                    <button
                      className={cn(
                        "bookmark-types p-1.5 px-2.5",
                        { "bookmark-types-active": bookmarkCategory === "custom" },
                        { "hover:bg-black/20 hover:text-white": bookmarkCategory !== "custom" }
                      )}
                      onClick={() => {
                        setBookmarkCategory("custom");
                      }}
                    >
                      Custom
                    </button>



                    {/* ML tags */}
                    <button
                      className={cn(
                        "bookmark-types mr-2 p-1.5 px-2.5",
                        { "bookmark-types-active": bookmarkCategory === "ml" },
                        { "hover:bg-black/20 hover:text-white": bookmarkCategory !== "ml" }
                      )}
                      onClick={() => {
                        setBookmarkCategory("ml");
                      }}
                    >
                      Auto
                    </button>
                  </div>
                </div>

                <div className="w-[calc(100%-10px)] h-[1.5px] bg-black/50 mb-2 ml-[5px] rounded-full "></div>
              </div>


              <div className="bookmark-showing">

                {bookmarkCategory === "sort" && (
                  <div className="flex flex-col justify-start px-4">
                    {bookmarks?.map((bookmark, index) => (
                      <Bookmark
                        key={index}
                        bookmark={bookmark}
                        index={index}
                        handleBookmarkClick={handleBookmarkClick}
                        handleModifyBookmark={handleModifyBookmark}
                        handleDeleteBookmark={handleDeleteBookmark}
                      />
                    ))}
                  </div>
                )}

                {bookmarkCategory === "custom" && (
                  <div className="flex flex-col justify-start px-4">
                    {customTags.map((currentTag, index) => (
                      <div key={index} className="h-max">
                        <div className="flex items-center">
                          <span className="remove cursor-pointer z-10">
                            <X className="p-[3px]"
                              onClick={
                                function () {
                                  console.log("currentTag", currentTag);
                                  handleDeleteCustomTag(currentTag.tagname);
                                }
                              } />

                          </span>

                          <span className="h-[50%] w-[2px]"></span>
                          <span className="tag" onClick={function () {
                            currentTag.show = !currentTag.show;
                            setCustomTags([...customTags]);
                            // console.log("customTags", customTags);
                          }} >


                            {currentTag.tagname}
                            {currentTag.show ? <ChevronDown className="w-5 opacity-[5] ml-1" /> : <ChevronRight className="w-5 opacity-[5] ml-1" />}

                          </span>
                        </div>

                        {currentTag.show && (
                          bookmarks
                            .filter(bookmark => {
                              // console.log("bookmark", bookmark);
                              if (bookmark.tags.includes(currentTag.tagname)) {
                                // console.log("bookmark", bookmark);
                                return bookmark;
                              }
                            })
                            .map((bookmark, index) => (
                              <Bookmark
                                key={index}
                                bookmark={bookmark}
                                index={index}
                                handleBookmarkClick={handleBookmarkClick}
                                handleModifyBookmark={handleModifyBookmark}
                                handleDeleteBookmark={handleDeleteBookmark}
                              />
                            )))}
                      </div>
                    ))}
                  </div>
                )}
              </div>


              <InputBookmark
                bookmark={currUrl}
                setBookmark={setCurrUrl}
                tags={tags}
                setTags={setTags}
                handleAddBookmark={handleAddBookmark}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Bookmarks;
