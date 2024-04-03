import { useRef, useState, useEffect } from "react";
import "./Bookmarks.css";
import InputBookmark from "./InputBookmark";
import { Pencil, Trash2, Star, ChevronLeft, ChevronsUpDown, Check, Text, ChevronDown, ChevronRight, } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOnClickOutside } from "~components/use-on-click-outside";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import Bookmark from "./Bookmark";


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

  useEffect(() => {
    // console.log("customTags 1", customTags);
    // console.log("bookmarks 1", bookmarks);
    // Filter out tags with count === 0
    const filteredCustomTags = customTags.filter(tag => tag.count > 0);
    setCustomTags(filteredCustomTags);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    localStorage.setItem("customTags", JSON.stringify(customTags));
  }, [customTags, bookmarks])

  // Load bookmarks from localStorage when component mounts
  useEffect(() => {
    const storedBookmarks = localStorage.getItem("bookmarks");
    const storedCustomTags = localStorage.getItem("customTags");
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    }
    if (storedCustomTags) {
      setCustomTags(JSON.parse(storedCustomTags));
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
        addedAt: Date.now(),
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
    const deletedBookmark = bookmarks[index];
    const newBookmarks = [...bookmarks];

    newBookmarks.splice(index, 1);

    // Reduce count of tags in customTags for the deleted bookmark
    const updatedCustomTags: customTagType[] = customTags.map(tag => {
      if (deletedBookmark.tags.includes(tag.tagname)) {
        return {
          ...tag,
          count: tag.count - 1,
        };
      }
      return tag;
    });



    setBookmarks(newBookmarks);
    setCustomTags(updatedCustomTags);
    // localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));

  };

  const handleModify = (index: number, newTitle: string, newUrl: string, newTags: string) => {
    const newBookmarks = [...bookmarks];
    const oldTagsArray = newBookmarks[index].tags;
    const newTagsArray = newTags.split(" ").filter(tag => tag.trim() !== ""); // Parse entered tags

    // Determine tags that were added, removed, or retained
    const tagsAdded = newTagsArray.filter(tag => !oldTagsArray.includes(tag));
    const tagsRemoved = oldTagsArray.filter(tag => !newTagsArray.includes(tag));
    const tagsRetained = newTagsArray.filter(tag => oldTagsArray.includes(tag));

    // Update bookmark
    newBookmarks[index].url = newUrl;
    newBookmarks[index].title = newTitle;
    newBookmarks[index].tags = newTagsArray;
    console.log("tagsAdded", tagsAdded);
    console.log("tagsRemoved", tagsRemoved);

    // // Update custom tags
    // const updatedCustomTags: customTagType[] = customTags.map(tag => {
    //     if (tagsRemoved.includes(tag.tagname)) {
    //       // console.log("tagsRemoved", tagsRemoved);
    //         // Decrement count if tag is removed
    //         return {
    //             ...tag,
    //             count: tag.count - 1,
    //         };
    //     } 
    //     else if (tagsAdded.includes(tag.tagname)) {
    //       // console.log("tagsAdded", tagsAdded);
    //         // Increment count if tag is added
    //         return {
    //             ...tag,
    //             count: tag.count + 1,
    //         };
    //     }
    //   else if (tagsRetained.includes(tag.tagname)) {
    //     console.log("tagsRetained", tagsRetained);
    //     // Retain count for existing tags that were not removed or added
    //     return {
    //         ...tag,
    //         count: tag.count,
    //     };
    // }
    //   return tag; // Retain count for existing tags
    // });

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

    setCustomTags(updatedCustomTags);
    setBookmarks(newBookmarks);
  };



  const handleBookmarkClick = (index: number) => {
    const newBookmarks = [...bookmarks];
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
                        handleModify={handleModify}
                        handleDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}

                {bookmarkCategory === "custom" && (
                  <div className="flex flex-col justify-start px-4">
                    {customTags.map((currentTag, index) => (
                      <div key={index} className="h-max ">

                        <span className="tag" onClick={function () {
                          currentTag.show = !currentTag.show;
                          setCustomTags([...customTags]);
                          // console.log("customTags", customTags);
                        }} >{currentTag.tagname}
                          {currentTag.show ? <ChevronDown className="w-5 opacity-[5] ml-1" /> : <ChevronRight className="w-5 opacity-[5] ml-1" />}
                        </span>

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
                                handleModify={handleModify}
                                handleDelete={handleDelete}
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
