import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import loadingSVG from "data-base64:~assets/loading.svg";
import "./weather.css";

import { useOnClickOutside } from "~components/use-on-click-outside";

type locationType = {
  latitude: number;
  longitude: number;
} | null;

type tempUnitType = "metric" | "imperial";

const WeatherCard = () => {
  const [loading, setLoading] = useState(false);

  // display the weather card
  const [showWeatherCard, setShowWeatherCard] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setShowWeatherCard(false));

  // weather data
  const [weatherData, setWeatherData] = useState(
    JSON.parse(localStorage.getItem("weatherData") as string) || null
  );
  const [weatherIcon, setWeatherIcon] = useState<string>(
    localStorage.getItem("weatherIcon") || ""
  );
  const [loacation, setLocation] = useState<locationType>(
    localStorage.getItem("location")
      ? JSON.parse(localStorage.getItem("location") as string)
      : null
  );

  const [tempUnit, setTempUnit] = useState<tempUnitType>(
    localStorage.getItem("tempUnit")
      ? (localStorage.getItem("tempUnit") as tempUnitType)
      : "metric"
  );

  // get the user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error Code = " + error.code + " - " + error.message);
        }
      );
    }
  }, []);

  // update the temp unit
  useEffect(() => {
    localStorage.setItem("tempUnit", tempUnit);
  }, [tempUnit]);

  // fetch weather data
  useEffect(() => {
    if (loacation) {
      setLoading(true);
      fetch(
        `${process.env.PLASMO_PUBLIC_BACKEND_URL}/api/v1/weather?lat=${loacation.latitude}&lon=${loacation.longitude}&units=${tempUnit}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setWeatherData(data);
          localStorage.setItem("weatherData", JSON.stringify(data));
          setLoading(false);
        });
    }
  }, [loacation, tempUnit]);

  // fetch weather icon
  useEffect(() => {
    if (weatherData) {
      fetch(
        `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
      )
        .then((res) => res.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          setWeatherIcon(url);
          // store the icon in local storage as a base64 string
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            localStorage.setItem("weatherIcon", reader.result as string);
          };
        });
    }
  }, [weatherData]);

  return (
    <>
      {/* smaller */}
      <div
        className={cn(
          "weather_card fixed top-0 right-1 m-2 cursor-pointer ",
          showWeatherCard ? "hidden" : ""
        )}
        onClick={(e) => {
          e.preventDefault();
          setShowWeatherCard(true);
        }}>
        <div
          className={cn(
            "relative h-[70px] w-max flex items-center justify-center rounded-lg",
            loading ? "animate-pulse" : ""
          )}>
          <img src={weatherIcon} alt={""} className="h-full" />
          <div className="temperature-text flex flex-col items-center justify-center">
            <span className="text-3xl font-medium antialiased">
              {Math.round(weatherData?.main.temp as number).toString() +
                "\u00B0" +
                (tempUnit === "metric" ? "C" : "F")}
            </span>
            <span className="antialiased">{weatherData?.name}</span>
          </div>
        </div>
      </div>

      {/* larger */}
      <div
        ref={ref}
        className={cn(
          " weather_card fixed top-2 right-2 p-2 shadow-md text-white",
          showWeatherCard ? "" : "hidden"
        )}>
        <div className="w-full h-full flex items-center justify-center">
          {/* 1st */}
          <div className="flex flex-col items-start justify-center p-4 mx-4">
            <span className="text-md px-5 font-semibold antialiased">
              {loading ? (
                <div className="flex items-center justify-center">
                  <img src={loadingSVG} alt="" className="h-[30px]" />
                  <span>Loading...</span>
                </div>
              ) : (
                weatherData?.name + ", " + weatherData?.sys.country
              )}
            </span>
            <div className="flex items-center justify-center">
              <img src={weatherIcon} alt="wi" className="h-full" />
              <div className="temperature-text flex items-center justify-center">
                <span className="temperature-text text-5xl">
                  {Math.round(weatherData?.main.temp as number).toString() +
                    "\u00B0" +
                    (tempUnit === "metric" ? "C" : "F")}
                </span>
              </div>
            </div>
          </div>

          {/* 2nd */}
          <div className="temperature-text flex-1 flex flex-col items-center justify-center text-sm mx-2 px-2">
            <span>
              Feels like:{" "}
              {Math.round(weatherData?.main.feels_like as number).toString() +
                "\u00B0" +
                (tempUnit === "metric" ? "C" : "F")}
            </span>
            <span className="text-center">
              Max:{" "}
              {Math.round(weatherData?.main.temp_max as number).toString() +
                "\u00B0" +
                (tempUnit === "metric" ? "C" : "F")}{" "}
              | Min:
              {Math.round(weatherData?.main.temp_max as number).toString() +
                "\u00B0" +
                (tempUnit === "metric" ? "C" : "F")}
            </span>
            <span>
              {weatherData?.weather[0].description.charAt(0).toUpperCase() +
                weatherData?.weather[0].description.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default WeatherCard;
