import { cn } from "@/lib/utils";
import bingLogo from "data-base64:~assets/bing-color-icon.svg";
import googleVoice from "data-base64:~assets/google-voice.png";
import googleLogo from "data-base64:~assets/icons8-google.svg";
import { Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// import "./searchBar.css";

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

const SearchBar = () => {
  const [searchEngine, setSearchEngine] = useState("google");
  const [intrimSearchQuery, setIntrimSearchQuery] = useState("");
  const [finalSearchQuery, setFinalSearchQuery] = useState("");
  const [queary, setQueary] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceSearch, setVoiceSearch] = useState(false);

  let recognition: SpeechRecognition;

  const googleInputRef = useRef<HTMLInputElement | null>(null);
  const bingInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (searchEngine === "google") {
      googleInputRef.current?.focus();
    } else {
      bingInputRef.current?.focus();
    }
  });

  useEffect(() => {
    const stopVoiceSearch = () => {
      if (voiceSearch) {
        if (recognition) {
          recognition.stop();
          setIsListening(false);
          setVoiceSearch(false);
        }
      }
    };

    window.addEventListener("blur", stopVoiceSearch);

    return () => {
      window.removeEventListener("blur", stopVoiceSearch);
    };
  }, [voiceSearch]);

  const handleVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert(
        "Your browser does not support speech recognition. Try latest version of Chrome."
      );
      setIsListening(false);
      return;
    }
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setFinalSearchQuery("");
      setVoiceSearch(true);
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      setIntrimSearchQuery("");
      setQueary(event.results[0][0].transcript);
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          // final_transcript += event.results[i][0].transcript;
          setFinalSearchQuery(
            finalSearchQuery + event.results[i][0].transcript
          );
        } else {
          // interim_transcript += event.results[i][0].transcript;
          setIntrimSearchQuery(
            intrimSearchQuery + event.results[i][0].transcript
          );
        }
      }
      // final_transcript = capitalize(final_transcript);
      // console.log(finalSearchQuery);
      // final_span.innerHTML = linebreak(final_transcript);
      // interim_span.innerHTML = linebreak(interim_transcript);
      // };
    };

    recognition.onerror = (event) => {
      console.error(event.error);
      setVoiceSearch(false);
      setIsListening(false);
    };
    recognition.onend = () => {
      // setVoiceSearch(false);
      setIsListening(false);
    };

    recognition.start();
  };

  const searchHandler = (txt: string, engine: string) => {
    if (engine === "google") {
      window.open(`https://www.google.com/search?q=${txt}`, "_self");
    } else {
      window.open(`https://www.bing.com/search?q=${txt}`, "_self");
    }
  };

  useEffect(() => {
    const keydownHandler = (e: { key: string }) => {
      if (e.key === "Escape") {
        setFinalSearchQuery("");
      }
      if (e.key === "Enter") {
        if (finalSearchQuery === "") return;
        searchHandler(finalSearchQuery, searchEngine);
      }
    };

    document.addEventListener("keydown", keydownHandler);

    // Cleanup function
    return () => {
      document.removeEventListener("keydown", keydownHandler);
    };
  });

  useEffect(() => {
    if (!isListening) {
      if (voiceSearch) {
        setQueary(finalSearchQuery);
        // console.log(finalSearchQuery);
        searchHandler(finalSearchQuery, searchEngine);
        setVoiceSearch(false);
      } else {
        setQueary(finalSearchQuery);
      }
    }
  }, [finalSearchQuery, isListening, searchEngine, voiceSearch]);

  return (
    <>
      <div className="w-full h-3 mb-3 text-center">
        {isListening ? "Listening..." : ""}
      </div>
      <div
        id="searchBox"
        className="w-full h-full px-4 flex items-center justify-center rounded-full">
        <span
          className={cn(
            "h-full flex rounded-full items-center justify-start overflow-hidden bg-white mr-2",
            "transition-all ease-in-out duration-500",
            {
              "w-[80%]": searchEngine === "google",
              "w-[45px]": searchEngine === "bing"
            }
          )}
          onClick={() => {
            setSearchEngine("google");
            localStorage.setItem("searchEngine", "google");
          }}>
          <img
            src={googleLogo}
            alt="google"
            className="h-[40px] p-1 mx-0.5 rounded-full cursor-pointer"
          />
          <input
            ref={googleInputRef}
            className={cn(
              "transition-all ease-in-out duration-500  focus:outline-none text-black",
              {
                "w-0": searchEngine === "bing",
                "w-full mx-3": searchEngine === "google"
              }
            )}
            // value={isListening ? intrimSearchQuery : finalSearchQuery}
            value={queary}
            placeholder="Search with Google or enter address"
            onChange={(e) => setFinalSearchQuery(e.target.value)}
          />
          <img
            // id="googleVoice"
            src={googleVoice}
            alt=""
            className={cn(
              searchEngine === "google" ? "" : "hidden",
              "h-[30px] mx-2 cursor-pointer rounded-full hover:rounded-full"
              // "transition transform duration-500 ease-out hover:scale-110",
            )}
            onClick={() => {
              if (isListening) {
                recognition.stop();
                setIsListening(false);
              } else {
                handleVoiceSearch();
              }
            }}
          />
        </span>
        <span
          className={cn(
            "h-full flex rounded-full items-center justify-end overflow-hidden bg-white shadow-2xl",
            "transition-all ease-in-out duration-500",
            {
              "w-[80%]": searchEngine === "bing",
              "w-[45px]": searchEngine === "google"
            }
          )}
          onClick={() => {
            setSearchEngine("bing");
            localStorage.setItem("searchEngine", "bing");
          }}>
          <Mic
            className={cn(
              searchEngine === "bing" ? "" : "hidden",
              "h-[50px] ml-2 cursor-pointer rounded-full hover:rounded-full"
            )}
            onClick={() => {
              if (isListening) {
                recognition.stop();
                setIsListening(false);
              } else {
                handleVoiceSearch();
              }
            }}
          />
          <input
            ref={bingInputRef}
            className={cn(
              "transition-all ease-in-out duration-500  focus:outline-none text-black",
              {
                "w-0": searchEngine === "google",
                "w-full mx-3": searchEngine === "bing"
              }
            )}
            // value={isListening ? intrimSearchQuery : finalSearchQuery}
            value={queary}
            placeholder="Search the web"
            onChange={(e) => setFinalSearchQuery(e.target.value)}
          />
          <img
            src={bingLogo}
            alt="bing"
            className="h-[40px] p-1 mr-1.5 cursor-pointer"
          />
        </span>
      </div>
      {/* <Button onClick={handleVoiceSearch}>
        {isListening ? "Listening..." : "Search"}
      </Button> */}
    </>
  );
};

export default SearchBar;
