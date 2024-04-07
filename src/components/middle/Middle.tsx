// import { cn } from "@/lib/utils";
import { lazy, useEffect, useState } from "react";

import "./middle.css";

// const SearchBar = lazy(() => import("@/components/middle/searchbar2"));

import DateNTime from "@/components/middle/DateNTime";
// const DateNTime = lazy(() => import("@/components/middle/DateNTime"));

import QuickLinks from "@/components/middle/QuickLinks";
import SearchBar from "@/components/middle/searchbar2";

import Greet from "./Greet";

// const QuickLinks = lazy(() => import("@/components/middle/QuickLinks"));

const Middle = ({ userName }: { userName: string }) => {
  const [quote, setQuote] = useState("");
  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    try {
      const response = await fetch("https://api.quotable.io/random?whr=en");
      const data = await response.json();
      
      if (data && data.hasOwnProperty('content')) {
        setQuote(data.content);
      } else {
        // If no quote is available, set a default quote
        setQuote("Today is the day to start.");
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
      // If an error occurs during fetching, set a default quote
      setQuote("Today is the day to start.");
    }
  };
  

  return (
    <>
      <div className="middle">
        {/* quote */}
        <div className="quote">{quote}</div>

        {/*center_card*/}
        <div className="center_card backdrop-blur-[2px]">
          {/* greeting and time */}
            <DateNTime />
            <Greet userName={userName} />
          {/* searchbar */}
          <div className="searchbar">
            <div className="w-full h-[--searchbarHeight]">
              <SearchBar />
            </div>
          </div>
        </div>

        {/* bottom */}
        <div className="quick_links ">
          <QuickLinks />
        </div>
      </div>
    </>
  );
};

export default Middle;
