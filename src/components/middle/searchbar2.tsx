import { cn } from "@/lib/utils";
import askcomLogo from "data-base64:~assets/askcom_icon.svg";
import bingLogo from "data-base64:~assets/bing_icon.svg";
import duckduckgoLogo from "data-base64:~assets/duckduckgo_icon.svg";
import googleLogo from "data-base64:~assets/google_icon.svg";
import googleVoice from "data-base64:~assets/google-voice.png";
import listeningSVG from "data-base64:~assets/listening.svg";
import yahooLogo from "data-base64:~assets/yahoo_icon.svg";
import yandexLogo from "data-base64:~assets/yandex_icon.svg";
import { Mic } from "lucide-react";
import { useEffect, useRef, useState, type MutableRefObject } from "react";

import { useOnClickOutside } from "@/components/use-on-click-outside";

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }

  interface SearchEngine {
    name: string;
    url: string;
    icon?: string;
    micIcon?: string;
  }
}

const searchEngines: Map<string, SearchEngine> = new Map(
  Object.entries({
    google: {
      name: "Google",
      url: "https://www.google.com/search?q=",
      icon: googleLogo,
      micIcon: googleVoice
    },
    bing: {
      name: "Bing",
      url: "https://www.bing.com/search?q=",
      icon: bingLogo
    },
    yahoo: {
      name: "Yahoo",
      url: "https://search.yahoo.com/search?p=",
      icon: yahooLogo
    },
    duckduckgo: {
      name: "DuckDuckGo",
      url: "https://duckduckgo.com/?q=",
      icon: duckduckgoLogo
    },
    askcom: {
      name: "Ask.com",
      url: "https://www.ask.com/web?q=",
      icon: askcomLogo
    },
    yandex: {
      name: "Yandex",
      url: "https://yandex.com/search/?text=",
      icon: yandexLogo
    }
  })
);

const SearchBar = () => {
  const [searchEngine, setSearchEngine] = useState(
    localStorage.getItem("searchEngine") || "google"
  );
  const [searchSelectorOpen, setSearchSelectorOpen] = useState(false);
  const [finalSearchQuery, setFinalSearchQuery] = useState("");
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceSearch, setVoiceSearch] = useState<boolean>(false);

  let ignore_onend = false;
  const recognition = useRef<SpeechRecognition | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchEngineSelectorRef = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(searchEngineSelectorRef, () => {
    setSearchSelectorOpen(false);
  });

  useEffect(() => {
    const stopVoiceSearch = () => {
      if (voiceSearch) {
        if (recognition.current) {
          recognition.current.stop();
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

  useEffect(() => {
    if ("SpeechRecognition" in window) {
      console.log("SpeechRecognition");
      recognition.current = new window.SpeechRecognition();
    } else if ("webkitSpeechRecognition" in window) {
      recognition.current = new (window as any).webkitSpeechRecognition();
    } else {
      console.log("Speech recognition is not supported by your browser");
    }
  }, []);

  const handleVoiceSearch = () => {
    // if (!("webkitSpeechRecognition" in window)) {
    //   alert(
    //     "Your browser does not support speech recognition. Try the latest version of Chrome."
    //   );
    //   setIsListening(false);
    //   return;
    // }

    if (!recognition.current) {
      console.error("Speech recognition is not supported by your browser");
      return;
    }

    // const SpeechRecognition =
    //   window.SpeechRecognition || window.webkitSpeechRecognition;
    // recognition.current = new SpeechRecognition();
    recognition.current.continuous = false;
    recognition.current.interimResults = true;

    recognition.current.onstart = () => {
      console.log("onstart");
      setFinalSearchQuery("");
      setVoiceSearch(true);
      setIsListening(true);
    };

    recognition.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      if (event.results[0].isFinal) {
        setFinalSearchQuery(finalSearchQuery + transcript);
      }
    };

    recognition.current.onerror = (event) => {
      console.log("onerror");
      ignore_onend = true;
      console.error(event.error);

      setVoiceSearch(false);
      setIsListening(false);
    };

    recognition.current.onend = (event) => {
      setIsListening(false);
      if (ignore_onend) {
        // showInfo("info_no_speech");
        console.log("onend");
        return;
      }
    };

    ignore_onend = false;
    recognition.current.start();
  };

  useEffect(() => {
    console.log("isListening", isListening);
  }, [isListening]);

  const searchHandler = (txt: string, engine: string) => {
    const searchUrl = searchEngines.get(engine)?.url;
    if (searchUrl) {
      window.open(searchUrl + txt, "_self");
    }
  };

  useEffect(() => {
    const keydownHandler = (e: { key: string }) => {
      if (e.key === "Escape") {
        setFinalSearchQuery("");
      }
      if (e.key === "Enter" && finalSearchQuery !== "") {
        searchHandler(finalSearchQuery, searchEngine);
      }
    };

    document.addEventListener("keydown", keydownHandler);

    return () => {
      document.removeEventListener("keydown", keydownHandler);
    };
  });

  useEffect(() => {
    if (!isListening) {
      if (voiceSearch) {
        setQuery(finalSearchQuery);
        searchHandler(finalSearchQuery, searchEngine);
        setVoiceSearch(false);
      } else {
        setQuery(finalSearchQuery);
      }
    }
  }, [finalSearchQuery, isListening, searchEngine, voiceSearch]);

  useEffect(() => {
    // console.log("clicked");
    localStorage.setItem("searchEngine", searchEngine);
    setSearchSelectorOpen(false);
  }, [searchEngine, setSearchSelectorOpen]);

  return (
    <>
      <div
        id="searchBox"
        className="w-full h-full px-4 flex items-center justify-center rounded-full">
        <span
          className={cn(
            "w-full h-full flex rounded-full items-center justify-between bg-white mx-2",
            "transition-all ease-in-out duration-500"
          )}>
          <div
            className={cn(
              "w-[40px] pl-0.5",
              "transition-all ease-in-out duration-500"
            )}
            onClick={() => setSearchSelectorOpen(true)}>
            <img
              src={searchEngines.get(searchEngine)?.icon}
              alt={searchEngines.get(searchEngine)?.name}
              className={cn("h-[40px] p-1.5 cursor-pointer", {
                hidden: searchSelectorOpen
              })}
            />
            <div
              ref={searchEngineSelectorRef}
              className={cn("transition-all ease-in-out duration-500", {
                "rounded-t-full rounded-b-full bg-white flex flex-col items-center justify-center gap-1":
                  searchSelectorOpen,
                "h-0": !searchSelectorOpen
              })}>
              {Array.from(searchEngines).map(([key, value]) => (
                <div
                  key={key}
                  className={cn(
                    "flex items-center justify-between rounded-full cursor-pointer hover:bg-red-300 ",
                    "transition-all ease-in-out duration-500",
                    {
                      "bg-green-400": searchEngine === key && searchSelectorOpen
                    },
                    { "h-0": !searchSelectorOpen }
                  )}
                  onClick={() => {
                    setSearchEngine(key);
                    setSearchSelectorOpen(false);
                  }}>
                  <img
                    src={value.icon}
                    alt={value.name}
                    className={cn(
                      "h-[40px] w-[40px] p-1.5",
                      "transition-all ease-in-out duration-500",
                      { "h-0": !searchSelectorOpen }
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
          <input
            ref={inputRef}
            className={cn(
              "flex-1 h-[--searchbarHeight] text-base overflow-hidden transition-all ease-in-out duration-500  focus:outline-none text-black"
            )}
            value={query}
            placeholder={`Search with ${searchEngines.get(searchEngine)?.name}`}
            onChange={(e) => setFinalSearchQuery(e.target.value)}
          />
          {searchEngines.get(searchEngine)?.micIcon !== undefined ? (
            <img
              src={
                isListening
                  ? listeningSVG
                  : searchEngines.get(searchEngine)?.micIcon
              }
              alt={searchEngines.get(searchEngine)?.name}
              className={cn(
                "h-[30px] mx-2 cursor-pointer rounded-full hover:rounded-full"
              )}
              onClick={() => {
                console.log("isListening", isListening);
                if (isListening) {
                  recognition.current.stop();
                  setIsListening(false);
                } else {
                  handleVoiceSearch();
                }
              }}
            />
          ) : (
            <>
              {isListening ? (
                <img
                  src={listeningSVG}
                  alt={searchEngines.get(searchEngine)?.name}
                  className={cn(
                    "h-[30px] mx-2 cursor-pointer rounded-full hover:rounded-full"
                  )}
                  onClick={() => {
                    console.log("isListening", isListening);
                    if (isListening) {
                      recognition.current.stop();
                      setIsListening(false);
                    } else {
                      handleVoiceSearch();
                    }
                  }}
                />
              ) : (
                <Mic
                  className={cn(
                    "h-[30px] mx-2 cursor-pointer rounded-full hover:rounded-full"
                  )}
                  onClick={() => {
                    console.log("isListening", isListening);
                    if (isListening) {
                      recognition.current.stop();
                      setIsListening(false);
                    } else {
                      handleVoiceSearch();
                    }
                  }}
                />
              )}
            </>
          )}
        </span>
      </div>
    </>
  );
};

export default SearchBar;
