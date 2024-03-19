import "./DateNTime.css";
import { useState, useEffect } from "react";
// import "./styles.css"; // Import CSS file

function DateNTime() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60 * 1000);

    return () => clearInterval(timerId);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "short",
    // year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <div className="greeting">
        <div className="time">
          <span className="">{formattedTime}</span>
        </div>
        <div className="date">
          <span className="">{formattedDate}</span>
        </div>
      </div>
    </>
  );
}

export default DateNTime;
