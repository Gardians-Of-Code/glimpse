// import SearchBar from "@/components/serarchbar";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

import Bookmarks from "~components/bookmark/Bookmarks";
import Middle from "~components/middle/Middle";
import WeatherCard from "~components/weather_todo/WeatherCard";
import Settings from "~components/weather_todo/Setting";

const Landing = () => {
  const [backgroundImage, setBackgroundImage] = useState("");

  const fetchBackgroundImage = async (url: string) => {
    setBackgroundImage(url);
  };

  useEffect(() => {
    setBackgroundImage(
      "https://source.unsplash.com/1600x900/?wallpaper,landscape,day"
    );
  }, [backgroundImage]);

  return (
    <>
      <main
        className={cn(
          "fixed w-full h-full bg-cover",
          // "bg-transparent",
          // "bg-coolImage",
          //   "bg-random",
          `bg-cover`,
        )}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="flex w-full h-full">
          {/* bookmarks - Raman Sharma*/}

          <div className=" md:basis-1/4 p-4 flex">
            <Bookmarks />
          </div>

          {/* middle */}
          <div className="md:basis-2/4 flex-1 w-full h-full p-4">
            <Middle />
          </div>

          {/* Todo */}
          <div className=" relative md:basis-1/4 h-full p-4">
            <Settings />
            <WeatherCard />
          </div>
        </div>
      </main>
    </>
  );
};

export default Landing;
