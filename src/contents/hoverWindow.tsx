import cn from "classnames";
import cssText from "data-text:~style.css";
import type { PlasmoCSConfig } from "plasmo";
import { useEffect, useState } from "react";

import { putWebsite, removeWebPage } from "./show-website";

export const config: PlasmoCSConfig = {
  matches: [
    "*://*/*"
    // "https://www.google.com/search*",
    // "https://www.bing.com/search*",
    // "https://www.yahoo.com/search*",
    // "https://duckduckgo.com/*",
    // "https://www.ecosia.org/search*",
    // "https://www.qwant.com/*",
    // "https://www.searchencrypt.com/*",
    // "https://www.startpage.com/*",
    // "https://www.search.com/*"
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
  const [viewPortWidth, setViewPortWidth] = useState<number>();
  const [isOpen, setIsOpen] = useState(false);
  const [allachors, setAllachors] = useState<HTMLAnchorElement[]>([]);
  const [currentHoveredLink, setCurrentHoveredLink] = useState("");
  const [lockWindow, setLockWindow] = useState<boolean>(false);
  const [windowPosition, setWindowPosition] = useState<string>("right");

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
    console.log("anchots loaded");
    setAllachors(anchorTags);

    // Create a new observer
    const observer = new MutationObserver(() => {
      // Update the anchor tags when the DOM changes
      const updatedAnchorTags = Array.from(document.querySelectorAll("a"));
      setAllachors(updatedAnchorTags);
      console.log("anchots updated");
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

  useEffect(() => {
    if (currentHoveredLink !== "") {
      // console.log("currentHoveredLink: ", currentHoveredLink)
      putWebsite(currentHoveredLink);
      setIsOpen(true);
      // setLockWindow(true)
    }
  }, [currentHoveredLink]);

  useEffect(() => {
    // click event listener
    document.addEventListener("click", (e) => {
      if (e.target !== document.getElementById("hoverWindow")) {
        setIsOpen(false);
        setLockWindow(false);
        setCurrentHoveredLink("");
        removeWebPage();
      }
    });
  }, []);

  // print the current states
  // useEffect(() => {
  //   console.log("isOpen: ", isOpen);
  //   console.log("currentHoveredLink: ", currentHoveredLink);
  //   console.log("lockWindow: ", lockWindow);
  //   console.log("windowPosition: ", windowPosition);
  //   console.log("viewPortWidth: ", viewPortWidth);
  //   // console.log("allachors: ", allachors)
  //   // console.log("anchorsWithListeners: ", anchorsWithListeners)
  // }, [isOpen, currentHoveredLink, lockWindow, windowPosition]);

  return (
    <div
      id="hoverWindow"
      className={cn(
        {
          "plasmo-top-32 plasmo-right-8": windowPosition === "right",
          "plasmo-top-32 plasmo-left-8": windowPosition === "left"
        },
        {
          "plasmo-bg-slate-50 md:plasmo-w-[800px] md:plasmo-h-[600px] sm:plasmo-w-[300px] sm:plasmo-h-[400px] plasmo-z-240 plasmo-fixed":
            isOpen,
          "plasmo-hidden": !isOpen
        }
      )}></div>
  );
};

export default HoverWindow;
