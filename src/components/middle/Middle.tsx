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

const Middle = () => {
  const [quote, setQuote] = useState("");
  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    const response = await fetch("https://api.quotable.io/random");
    const data = await response.json();
    setQuote(data.content);
  };

  return (
    <>
      <div className="middle">
        {/* quote */}
        <div className="quote">{quote}</div>

        {/*center_card*/}
        <div className="center_card backdrop-blur-[2px]">
          {/* greeting and time */}
          <div className="basis-[70%] w-full flex flex-col items-center justify-center">
            <DateNTime />
            <Greet />
          </div>
          {/* searchbar */}
          <div className="searchbar">
            <div className="w-full h-[45px]">
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
