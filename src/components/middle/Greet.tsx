import { useEffect, useState } from "react";
import "./middle.css"

const Greet = ({ userName }: { userName: string }) => {
  const [greetingMode, setGreetingMode] = useState(
    localStorage.getItem("greetingMode") || "automatic"
  );
  const [currentGreeting, setCurrentGreeting] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("greetingMode", greetingMode);
    localStorage.setItem("userName", userName);
    if (greetingMode === "automatic") {
      const time = new Date().getHours();
      if (time < 12) {
        setCurrentGreeting("Good Morning" + (userName ? `, ${userName}` : ""));
      } else if (time < 18) {
        setCurrentGreeting(
          "Good Afternoon" + (userName ? `, ${userName}` : "")
        );
      } else {
        setCurrentGreeting("Good Evening" + (userName ? `, ${userName}` : ""));
      }
    } else {
      setCurrentGreeting(localStorage.getItem("greeting") || "");
    }
  }, [greetingMode, userName]);

  return (
    <div className="greet">
      <input
        type="text"
        value={currentGreeting}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        className="greet_input"
        onChange={(e) => {
          if (e.target.value.startsWith("/")) {
            if (e.target.value === "/auto") {
              setGreetingMode("automatic");
            } else if (e.target.value === "/manual") {
              setGreetingMode("manual");
              setCurrentGreeting("");
            } else {
              setCurrentGreeting(e.target.value);
            }
          } else {
            setGreetingMode("manual");
            setCurrentGreeting(e.target.value);
            localStorage.setItem("greeting", e.target.value);
          }
        }}
      />
    </div>
  );
};

export default Greet;
