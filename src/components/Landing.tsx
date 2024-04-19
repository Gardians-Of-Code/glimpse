import { cn } from "@/lib/utils";
import { lazy, useEffect, useState, type SetStateAction } from "react";

import Bookmarks from "~components/bookmark/Bookmarks";
import Middle from "~components/middle/Middle";
import Setting from "~components/weather_todo/Setting";
import WeatherCard from "~components/weather_todo/WeatherCard";
// import ToDo from "~components/weather_todo/ToDo";

import { retrieveData } from "./indexedDb";
// const Setting = lazy(() => import("~components/weather_todo/Setting"));
// const WeatherCard = lazy(() => import("~components/weather_todo/WeatherCard"));
// const Bookmarks = lazy(() => import("~components/bookmark/Bookmarks"));

const Landing = () => {
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [userName, setUserName] = useState<string>(
    localStorage.getItem("userName") || ""
  );

  useEffect(() => {
    // retrive data from the indexedDB
    retrieveData("appData", "backgroundImage", 1)
      .then((data) => {
        setBackgroundImage(data.backgroundImage);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("userName", userName);
  }, [userName]);

  return (
    <>
      <main
        className={cn("fixed w-full h-full bg-cover")}
        style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="flex w-full h-full">
          {/* bookmarks - Raman Sharma*/}

          <div className=" md:basis-1/4 p-4 flex">
            <Bookmarks />
          </div>

          {/* middle */}
          <div className="md:basis-2/4 flex-1 w-full h-full p-4">
            <Middle userName={userName} />
          </div>

          {/* Todo */}
          <div className=" relative md:basis-1/4 h-full p-4">
            <Setting
              userName={userName}
              setUserName={setUserName}
              backgroundImage={backgroundImage}
              setBackgroundImage={setBackgroundImage}
            />
            {/* <ToDo/> */}
            <WeatherCard />
          </div>
        </div>
      </main>
    </>
  );
};

export default Landing;
