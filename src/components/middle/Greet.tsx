import { useEffect, useState } from "react";

const Greet = () => {
  const [greetingMode, setGreetingMode] = useState(
    localStorage.getItem("greetingMode") || "automatic",
  );
  const [userName, setUserName] = useState<string>(
    localStorage.getItem("userName") || "",
  );
  const [currentGreeting, setCurrentGreeting] = useState<string>();

  useEffect(() => {
    localStorage.setItem("greetingMode", greetingMode);
    localStorage.setItem("userName", userName);
    if (greetingMode === "automatic") {
      const time = new Date().getHours();
      if (time < 12) {
        setCurrentGreeting("Good Morning" + (userName ? `, ${userName}` : ""));
      } else if (time < 18) {
        setCurrentGreeting(
          "Good Afternoon" + (userName ? `, ${userName}` : ""),
        );
      } else {
        setCurrentGreeting("Good Evening" + (userName ? `, ${userName}` : ""));
      }
    } else {
      setCurrentGreeting(localStorage.getItem("greeting") || "");
    }
  }, [greetingMode, userName]);

  return (
    <div className="w-full h-max my-2 flex items-center justify-center">
      <input
        type="text"
        value={currentGreeting}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        className="w-full h-full text-center bg-transparent border-none focus:outline-none focus:underline text-3xl text-white font-semibold mx-2 py-2"
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
