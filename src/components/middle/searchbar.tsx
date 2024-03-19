import { cn } from "@/lib/utils";
import bingLogo from "data-base64:~assets/bing-color-icon.svg";
import googleLogo from "data-base64:~assets/icons8-google.svg";
import { useEffect, useState } from "react";

const SearchBar = () => {
  const [searchEngine, setSearchEngine] = useState("google");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const keydownHandler = (e: { key: string }) => {
      if (e.key === "Escape") {
        setSearchText("");
      }
      if (e.key === "Enter") {
        if (searchText === "") return;
        if (searchEngine === "google") {
          window.open(`https://www.google.com/search?q=${searchText}`, "_self");
        } else {
          window.open(`https://www.bing.com/search?q=${searchText}`, "_self");
        }
      }
    };

    document.addEventListener("keydown", keydownHandler);

    // Cleanup function
    return () => {
      document.removeEventListener("keydown", keydownHandler);
    };
  });

  return (
    <div
      id="searchBox"
      className="w-full h-full px-4 flex items-center justify-center rounded-full shadow-2xl">
      <span
        className={cn(
          "h-full flex rounded-full items-center justify-start overflow-hidden bg-white mr-2",
          "transition-all ease-in-out duration-500",
          {
            "w-[80%]": searchEngine === "google",
            "w-[45px]": searchEngine === "bing"
          }
        )}
        onClick={() => {
          setSearchEngine("google");
        }}>
        <img
          src={googleLogo}
          alt="google"
          className="h-[40px] p-1 mx-0.5 rounded-full cursor-pointer"
        />
        <input
          className={cn(
            "transition-all ease-in-out duration-500  focus:outline-none text-black",
            {
              "w-0": searchEngine === "bing",
              "w-full mx-3": searchEngine === "google"
            }
          )}
          placeholder="Search with Google or enter address"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </span>
      <span
        className={cn(
          "h-full flex rounded-full items-center justify-end overflow-hidden bg-white shadow-2xl",
          "transition-all ease-in-out duration-500",
          {
            "w-[80%]": searchEngine === "bing",
            "w-[45px]": searchEngine === "google"
          }
        )}
        onClick={() => {
          setSearchEngine("bing");
        }}>
        <input
          className={cn(
            "transition-all ease-in-out duration-500  focus:outline-none text-black",
            {
              "w-0": searchEngine === "google",
              "w-full mx-3": searchEngine === "bing"
            }
          )}
          placeholder="Search the web"
          onChange={(e) => setSearchText(e.target.value)}
        />
        <img
          src={bingLogo}
          alt="bing"
          className="h-[40px] p-1 mr-1.5 cursor-pointer"
        />
      </span>
    </div>
  );
};

export default SearchBar;
