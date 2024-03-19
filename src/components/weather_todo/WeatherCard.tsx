import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

import { useOnClickOutside } from "~components/use-on-click-outside";

type locationType = {
  latitude: number;
  longitude: number;
} | null;

type tempUnitType = "metric" | "imperial";

const WeatherCard = () => {
  const [loading, setLoading] = useState(true);

  // display the weather card
  const [showWeatherCard, setShowWeatherCard] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setShowWeatherCard(false));

  // weather data
  const [weatherData, setWeatherData] = useState(null);
  const [weatherIcon, setWeatherIcon] = useState<string>("");
  const [weatherIconCode, setWeatherIconCode] = useState<string>("");
  const [loacation, setLocation] = useState<locationType>(
    localStorage.getItem("location")
      ? JSON.parse(localStorage.getItem("location") as string)
      : null
  );
  const [place, setPlace] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [temp, setTemp] = useState<number | null>(null);
  const [maxTemp, setMaxTemp] = useState<number | null>(null);
  const [minTemp, setMinTemp] = useState<number | null>(null);
  const [feelsLike, setFeelsLike] = useState<number | null>(null);
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

          // cache the location
          localStorage.setItem(
            "location",
            JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            })
          );
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
      fetch(
        `http://localhost:3000/api/v1/weather?lat=${loacation.latitude}&lon=${loacation.longitude}&units=${tempUnit}`,
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
          setWeatherIconCode(data.weather[0].icon);
          setDescription(data.weather[0].description);
          setTemp(data.main.temp);
          setFeelsLike(data.main.feels_like);
          setMaxTemp(data.main.temp_max);
          setMinTemp(data.main.temp_min);
          setPlace(data.name);
          setCountry(data.sys.country);
          setLoading(false);
        });
    }
  }, [loacation, tempUnit]);

  // fetch weather icon
  useEffect(() => {
    if (weatherIconCode) {
      fetch(`https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`)
        .then((res) => res.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          setWeatherIcon(url);
        });
    }
  }, [weatherIconCode]);

  return (
    <>
      {/* smaller */}
      <div
        className={cn(
          "fixed top-0 right-1 m-2 cursor-pointer ",
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
          <img src={weatherIcon} alt={description} className="h-full" />
          <div className="flex flex-col items-center justify-center">
            <span className="text-3xl font-medium antialiased">
              {Math.round(temp as number).toString() +
                "\u00B0" +
                (tempUnit === "metric" ? "C" : "F")}
            </span>
            <span className="antialiased">{place}</span>
          </div>
        </div>
      </div>

      {/* larger */}
      <div
        ref={ref}
        className={cn(
          "fixed top-2 right-2 p-2 bg-black/60 rounded-md shadow-md text-white",
          showWeatherCard ? "" : "hidden"
        )}>
        <div className="w-full h-full flex items-center justify-center">
          {/* 1st */}
          <div className="flex flex-col items-start justify-center p-4 mx-4">
            <span className="text-md px-5 font-semibold antialiased">
              {place}, {country}
            </span>
            <div className="flex items-center justify-center">
              <img src={weatherIcon} alt="wi" className="h-full" />
              <div className="flex items-center justify-center">
                <span className="text-5xl">
                  {Math.round(temp as number).toString() +
                    "\u00B0" +
                    (tempUnit === "metric" ? "C" : "F")}
                </span>
              </div>
            </div>
          </div>

          {/* 2nd */}
          <div className="flex-1 flex flex-col items-center justify-center text-sm mx-2 px-2">
            <span>
              Feels like:{" "}
              {Math.round(feelsLike as number).toString() +
                "\u00B0" +
                (tempUnit === "metric" ? "C" : "F")}
            </span>
            <span className="text-center">
              Max:{" "}
              {Math.round(maxTemp as number).toString() +
                "\u00B0" +
                (tempUnit === "metric" ? "C" : "F")}{" "}
              | Min:
              {Math.round(minTemp as number).toString() +
                "\u00B0" +
                (tempUnit === "metric" ? "C" : "F")}
            </span>
            <span>
              {description.charAt(0).toUpperCase() + description.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default WeatherCard;
