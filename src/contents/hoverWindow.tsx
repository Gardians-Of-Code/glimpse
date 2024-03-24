import cssText from "data-text:~style.css";
import { Bookmark, BookmarkCheck, Languages, Text } from "lucide-react";
import type { PlasmoCSConfig } from "plasmo";
import { useEffect, useRef, useState } from "react";

import { useOnClickOutside } from "~components/use-on-click-outside";
import { cn } from "~lib/utils";

import {
  addBookmark,
  checkIfBookmarked,
  removeBookmark
} from "./bookmark-utility";
import { putWebsite, removeWebPage } from "./show-website";

export const config: PlasmoCSConfig = {
  matches: [
    // "*://*/*"
    "https://www.google.com/search*",
    "https://www.bing.com/search*",
    "https://www.yahoo.com/search*",
    "https://duckduckgo.com/*",
    "https://www.ecosia.org/search*",
    "https://www.qwant.com/*",
    "https://www.searchencrypt.com/*",
    "https://www.startpage.com/*",
    "https://www.search.com/*"
  ]
};

export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

export type PlasmoCSUIAnchor = {
  type: "overlay";
};

export const getShadowHostId = () => "hover-window";
const HoverWindow = () => {
  // sates
  const [viewPortWidth, setViewPortWidth] = useState<number>();
  const [isOpen, setIsOpen] = useState(false);
  const [allachors, setAllachors] = useState<HTMLAnchorElement[]>([]);
  const [currentHoveredLink, setCurrentHoveredLink] = useState("");
  const [lockWindow, setLockWindow] = useState<boolean>(false);
  const [windowPosition, setWindowPosition] = useState<string>("right");
  const [readingTime, setReadingTime] = useState<number>(0);
  const [isBoockmarked, setIsBoockmarked] = useState<boolean>(
    checkIfBookmarked(currentHoveredLink)
  );

  const updateViewPortWidth = () => {
    setViewPortWidth(window.innerWidth);
  };
  useEffect(() => {
    // Update the viewport width when the component mounts
    updateViewPortWidth();

    // Add a listener to update the viewport width when the window is resized
    window.addEventListener("resize", updateViewPortWidth);

    // Clean up the listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", updateViewPortWidth);
    };
  }, []);

  useEffect(() => {
    const anchorTags = Array.from(document.querySelectorAll("a"));
    // console.log("anchots loaded");
    setAllachors(anchorTags);

    // Create a new observer
    const observer = new MutationObserver(() => {
      // Update the anchor tags when the DOM changes
      const updatedAnchorTags = Array.from(document.querySelectorAll("a"));
      setAllachors(updatedAnchorTags);
      // console.log("anchots updated");
    });

    // Start observing the document with the configured parameters
    observer.observe(document, { childList: true, subtree: true });

    // Clean up the observer on component unmount
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let hoverTimeout: NodeJS.Timeout;
    allachors.forEach((anchor) => {
      // hover event listener
      anchor.addEventListener("mouseover", (e) => {
        hoverTimeout = setTimeout(() => {
          // setLockWindow(true)
          if (e.clientX > viewPortWidth / 2) {
            setWindowPosition("left");
          } else {
            setWindowPosition("right");
          }
          // setIsOpen(true);
          setCurrentHoveredLink(anchor.href);
        }, 400); // 500ms delay
      });
      anchor.addEventListener("mouseout", (e) => {
        clearTimeout(hoverTimeout);
      });
    });
  }, [allachors]);

  // put the website in the hover window
  useEffect(() => {
    if (currentHoveredLink !== "") {
      // console.log("currentHoveredLink: ", currentHoveredLink)
      putWebsite(currentHoveredLink).then((readingTime) => {
        setReadingTime(readingTime);
      });
      setIsOpen(true);
      // setLockWindow(true)
    }
  }, [currentHoveredLink]);

  // const hoverContainerRef = useRef<HTMLDivElement>(null);
  // useOnClickOutside(hoverContainerRef, () => {
  //   // setIsOpen(false);
  //   // setLockWindow(false);
  //   // setCurrentHoveredLink("");
  //   // removeWebPage();
  // });

  useEffect(() => {
    // click event listener
    document.addEventListener("click", (e) => {
      const hoverContainer = document.getElementById("hover-window");
      if (hoverContainer && !hoverContainer.contains(e.target as Node)) {
        setIsOpen(false);
        setLockWindow(false);
        setCurrentHoveredLink("");
        removeWebPage();
      }
    });
  }, []);

  return (
    <div
      // ref={hoverContainerRef}
      id="hoverContainer"
      className={cn(
        "bg-black/70 backdrop-blur-sm dark:bg-white/70 md:w-[800px] md:h-[640px] sm:w-[300px] sm:h-[440px] z-240 py-2 fixed rounded-[20px] overflow-hidden shadow-lg border-2 border-gray-800",
        {
          "top-20 right-8": windowPosition === "right",
          "top-20 left-8": windowPosition === "left"
        },
        {
          hidden: !isOpen
        }
      )}>
      <div className="flex w-full px-2 h-[40px] items-center justify-between">
        <div className="">
          Estimated Reading Time: <span> {readingTime} </span> minutes
        </div>
        <div className="flex items-center justify-center">
          <div className="h-full px-2 ">
            <Text className="cursor-pointer" />
            {/* <span>Summerize</span> */}
          </div>
          <div className="h-full px-2 ">
            {isBoockmarked ? (
              <BookmarkCheck
                className={cn("cursor-pointer")}
                onClick={() => {
                  removeBookmark(currentHoveredLink);
                  setIsBoockmarked(false);
                }}
              />
            ) : (
              <Bookmark
                className={cn("cursor-pointer")}
                onClick={() => {
                  addBookmark(currentHoveredLink);
                  setIsBoockmarked(true);
                }}
              />
            )}
            {/* <span>Bookmark</span> */}
          </div>
        </div>
      </div>
      <div
        id="hoverWindow"
        className={cn("w-full md:h-[600px] sm:h-[400px] ")}></div>
    </div>
  );
};

export default HoverWindow;
