import { cn } from "@/lib/utils";
import { ChevronDown, Settings, X } from "lucide-react";

import "./Setting.css";

// import { timeStamp } from "console";
import { useEffect, useRef, useState } from "react";
import Dropzone from "react-dropzone";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { storeData } from "~components/indexedDb";
import { Label } from "@radix-ui/react-label";
import { Input } from "~components/ui/input";
import { useOnClickOutside } from "~components/use-on-click-outside";
import { Button } from "~components/ui/button";
import { Badge } from "~components/ui/badge";

import loadingSVG from "data-base64:~assets/loading.svg";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";

import img1 from "data-base64:~assets/wallpapers/1.webp";
import img2 from "data-base64:~assets/wallpapers/2.webp";
import img3 from "data-base64:~assets/wallpapers/3.webp";
import img4 from "data-base64:~assets/wallpapers/4.webp";
import img5 from "data-base64:~assets/wallpapers/5.webp";

let defaultBackgroundImages: string[] = [img1, img2, img3, img4, img5, ""];
const Setting = ({
  userName,
  setUserName,
  backgroundImage,
  setBackgroundImage
}: {
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  backgroundImage: string;
  setBackgroundImage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  let aspectRatio = 16 / 9;
  const [loading, setLoading] = useState<boolean>(false);
  const [api, setApi] = useState<CarouselApi>();
  const [settingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(true);
  const [backgroundType, setBackgroundType] = useState<string>(
    localStorage.getItem("backgroundType") || "tags"
  );
  const [bgUrl, setBgUrl] = useState<string>(
    localStorage.getItem("bgUrl") || ""
  );
  const [bgTags, setBgTags] = useState<string[]>(
    JSON.parse(localStorage.getItem("bgTags") || "[]")
  );
  const [inputvalue, setInputValue] = useState<string>("");
  const [screenSize, setScreenSize] = useState({
    windowWidth: window.screen.width,
    windowHeight: window.screen.height
  });

  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setSettingsDialogOpen(false));

  const fetchImage = async (url: string) => {
    setLoading(true);
    fetch(url)
      .then((response) => {
        setBackgroundImage(response.url);
        defaultBackgroundImages[5] = response.url;
        setBgUrl(response.url);
        storeData("appData", "backgroundImage", {
          backgroundImage: response.url
        });
        setLoading(false);
        localStorage.setItem("backgroundTimeStamp", Date.now().toString());
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputvalue === "") return;
      const newTags = inputvalue
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        );
      setBgTags([...bgTags, ...newTags]);
      localStorage.setItem("bgTags", JSON.stringify([...bgTags, ...newTags]));
      setInputValue("");
      localStorage.setItem("backgroundTimeStamp", "0");
    }
  };

  const resizeHandler = () => {
    setScreenSize({
      windowWidth: window.screen.width,
      windowHeight: window.screen.height
    });
  };

  useEffect(() => {
    aspectRatio = screenSize.windowWidth / screenSize.windowHeight;
    // console.log(aspectRatio);
    const keydownHandler = (e: { key: string }) => {
      if (e.key === "Escape") {
        setSettingsDialogOpen(false);
      }
      if (e.key === "Enter") {
        //
      }
    };

    document.addEventListener("keydown", keydownHandler);

    return () => {
      document.removeEventListener("keydown", keydownHandler);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("backgroundType", backgroundType);
    if (backgroundType === "random") {
      // console.log("random");
    } else if (backgroundType === "custom") {
      // console.log("custom", bgUrl);
    } else if (backgroundType === "tags") {
      localStorage.setItem("bgTags", JSON.stringify(bgTags));
      const timeStamp = localStorage.getItem("backgroundTimeStamp");
      if (timeStamp) {
        const currentTime = Date.now();
        const diff = currentTime - parseInt(timeStamp);
        if (diff < 86400000) {
          return;
        }
      }
      fetchImage(
        `https://source.unsplash.com/${screenSize.windowWidth}x${screenSize.windowHeight}/?${bgTags}`
      );
    }
  }, [backgroundType, bgTags]);

  useEffect(() => {
    if (!api) {
      return;
    }
    api.on("select", () => {
      console.log(api.selectedScrollSnap() + 1);
      const index = api.selectedScrollSnap();
      setBackgroundImage(defaultBackgroundImages[index]);
      localStorage.setItem("backgroundTimeStamp", "0");
      storeData("appData", "backgroundImage", {
        backgroundImage: defaultBackgroundImages[index]
      });
    });
  }, [api]);

  return (
    <>
      {/* Settings icon */}
      <div className={cn("fixed bottom-4 right-2 w-12 z-[500]")}>
        <Settings
          className={cn(
            "h-full rotate  cursor-pointer",
            settingsDialogOpen ? "hidden" : ""
          )}
          onClick={() => {
            setSettingsDialogOpen(true);
          }}
        />
      </div>

      {/* Settings dialogue */}
      <div
        id="settings"
        ref={ref}
        className={cn(
          "fixed bottom-4 right-4 z-[500] w-[600px] h-max py-4 px-5 m-4 rounded-[20px] flex gap-4 flex-col items-center justify-center bg-black",
          "ring-2 ring-white/20",
          "transition-all duration-300 ease-in-out overflow-hidden",
          settingsDialogOpen ? "" : "h-0 hidden overflow-hidden"
        )}>
        {/* Settings header */}
        <div className="absolute top-0 left-0 w-full h-[50px] px-3 py-1 flex items-center justify-start">
          <ChevronDown
            className="text-accent-foreground cursor-pointer hover:translate-y-1 transform transition-transform duration-300 ease-in-out"
            onClick={() => {
              setSettingsDialogOpen(false);
            }}
          />

          <span className="flex-1 text-accent-foreground text-center text-base font-bold">
            Settings
          </span>
        </div>

        {/* username */}
        <div className="w-full mt-[25px] flex flex-col gap-0.5 items-start justify-center">
          <Label
            htmlFor="username"
            className="text-base  text-accent-foreground ">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            value={userName}
            placeholder="Set Username"
            className="flex-1 h-[40px] w-full bg-transparent text-white rounded-md p-2"
            onChange={(e) => {
              e.preventDefault();
              setUserName(e.target.value);
            }}></Input>
        </div>

        {/* Background */}
        <div className="w-full flex flex-col gap-2 items-start justify-center">
          <Label
            htmlFor="background"
            className="text-base  text-accent-foreground ">
            Background
          </Label>
          {/* caraosal */}
          <div className="w-full p-4 flex items-center justify-center">
            <Carousel
              setApi={setApi}
              opts={{
                align: "center",
                loop: true
              }}
              className="w-full max-w-sm">
              <CarouselContent>
                {Array.from({ length: 6 }).map((_, index) => (
                  <CarouselItem key={index} className="basis-1/2">
                    <div className="">
                      <Card>
                        <CardContent className="aspect-[16/9] p-0">
                          {/* <span className="text-3xl font-semibold hidden">
                            {index + 1}
                          </span> */}
                          <img
                            src={defaultBackgroundImages[index]}
                            alt="cool image"
                            className="w-full h-full"
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="text-white" />
              <CarouselNext className="text-white" />
            </Carousel>
          </div>

          {/* background Type selector */}
          <div className="w-full flex items-center justify-center text-accent-foreground">
            <Tabs defaultValue={backgroundType} className="w-full h-max px-2">
              <TabsList className="flex gap-1 items-center justify-evenly ">
                <TabsTrigger
                  value="tags"
                  className={cn("basis-1/2 overflow-hidden rounded")}>
                  <Button
                    variant="custom"
                    className={cn("w-full mb-[10px]", {
                      "border-b-[2px] border-[#5858e7]":
                        backgroundType === "tags"
                    })}
                    onClick={() => setBackgroundType("tags")}>
                    Tags
                  </Button>
                </TabsTrigger>
                <TabsTrigger
                  value="custom"
                  className={cn("basis-1/2 overflow-hidden rounded")}>
                  <Button
                    variant="custom"
                    className={cn("w-full mb-[10px]", {
                      "border-b-[2px] border-[#5858e7]":
                        backgroundType === "custom"
                    })}
                    onClick={() => setBackgroundType("custom")}>
                    Custom
                  </Button>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="tags" className="w-full h-full p-2">
                <div
                  className={cn(
                    "w-full h-[100px] flex gap-1 flex-col items-center justify-start"
                  )}>
                  <Input
                    type="text"
                    value={inputvalue}
                    placeholder="Enter space-separated tags"
                    className="w-full bg-transparent text-white p-2"
                    onChange={(e) => {
                      e.preventDefault();
                      setInputValue(e.target.value);
                    }}
                    onKeyDown={handleAddTag}
                  />
                  <div className="w-full flex flex-wrap items-start justify-start">
                    {bgTags.map((tag, index) => {
                      return (
                        <Badge
                          key={index}
                          className="m-1 bg-[#ffffff41] hover:bg-[#ffffff41]  text-[#b6b6b6] text-sm flex gap-1 items-center justify-between cursor-default">
                          {tag}
                          <X
                            className="cursor-pointer h-[14px] w-[14px] text-accent-background hover:text-red-400 "
                            onClick={() => {
                              localStorage.setItem("backgroundTimeStamp", "0");
                              setBgTags(bgTags.filter((t) => t !== tag));
                            }}
                          />
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                {/* update image button */}
                <div
                  className={cn("w-full p-2 flex items-center justify-center")}>
                  <Button
                    variant="outline"
                    className={cn("rounded-md text-accent-foreground", {
                      "cursor-wait": loading
                    })}
                    disabled={loading}
                    onClick={() => {
                      fetchImage(
                        `https://source.unsplash.com/${screenSize.windowWidth}x${screenSize.windowHeight}/?${bgTags}`
                      );
                    }}>
                    {loading ? (
                      <>
                        <img
                          src={loadingSVG}
                          alt="loading"
                          className="h-[30px]"
                        />
                        Updating background
                      </>
                    ) : (
                      <>Update background</>
                    )}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="custom" className="w-full h-full p-2">
                <div
                  className={cn(
                    "flex flex-col items-center justify-center gap-1"
                  )}>
                  {/* url */}
                  <div className="w-full flex items-center justify-start bg-accent-background">
                    {/* url of the bg */}
                    <Label
                      htmlFor="bgUrl"
                      className="text-white font-semibold p-2 ring-1 h-full rounded-s-md">
                      URL
                    </Label>
                    <Input
                      id="bgUrl"
                      type="url"
                      // value={backgroundImage}
                      placeholder="Set Background Image URL"
                      className="flex-1 w-full p-2 bg-transparent text-white"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          fetchImage(bgUrl);
                        }
                      }}
                      onChange={(e) => {
                        // e.preventDefault();
                        setBgUrl(e.target.value);
                      }}></Input>
                    <Button
                      variant="outline"
                      className="max-h-full rounded-s-none rounded-e-md text-accent-foreground bg-[#0073ff33] hover:bg-[#0073ff56]"
                      onClick={() => {
                        fetchImage(bgUrl);
                      }}>
                      Set
                    </Button>
                  </div>

                  {/* Drop image */}
                  <div className="w-full p-1">
                    <Dropzone
                      maxFiles={1}
                      multiple={false}
                      accept={{
                        "image/*": [".png", ".webp", ".jpeg", ".jpg"]
                      }}
                      onDrop={(acceptedFiles) => {
                        const reader = new FileReader();
                        // set the onload function of the reader
                        reader.onload = function (e) {
                          e.preventDefault();
                          // e.target.result contains the Data URL
                          // set the Data URL to the image
                          setBackgroundImage(e.target.result as string);
                          defaultBackgroundImages[5] = e.target
                            .result as string;
                          storeData("appData", "backgroundImage", {
                            backgroundImage: e.target.result
                          });
                        };

                        // read the image file as a Data URL
                        reader.readAsDataURL(acceptedFiles[0]);
                      }}>
                      {({ getRootProps, getInputProps }) => (
                        <section className={cn("w-full h-[104px]")}>
                          <div
                            {...getRootProps()}
                            className={
                              "w-full h-full rounded-3xl border-[2px] border-dashed bg-slate-600/50 hover:bg-[#8c93d8c0] flex items-center justify-center text-center"
                            }>
                            <input {...getInputProps()} />
                            <p className="text-wrap text-sm cursor-default">
                              Drag 'n' drop image here, or click to select files
                            </p>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;
