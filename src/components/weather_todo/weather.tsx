import "./weather.css";
import { useState, useEffect } from "react";

type WeatherData = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: [
    {
      id: number;
      main: string;
      description: string;
      icon: string;
    }
  ];
  main: {
    temp: number;    
  };
};                        

const weather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData>();

  useEffect(() => {

    const apiKey = "e47127c68406988457d9efb4d096acd3";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Roorkee&appid=${apiKey}`; // Adjust city name as needed

    fetch(url)
      .then((response) => response.json())
      .then((data) => setWeatherData(data))
      .catch((error) => console.error(error));
  }, []);


  if (!weatherData) {
    return <div>Loading weather data...</div>;
  }

  const weatherIcon = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
  const temperature = Math.floor(weatherData.main.temp - 273.15) + "°C"; // Convert Kelvin to Celsius

  return (
    <>
      <div className="weather">
        <img src={weatherIcon} alt="Weather icon" />
        <span className="temp">{temperature}</span>
      </div>
    </>
  );
}


export default weather;
