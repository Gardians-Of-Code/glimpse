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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { storeData } from "~components/indexedDb";
import { Label } from "@radix-ui/react-label";
import { Input } from "~components/ui/input";
import { useOnClickOutside } from "~components/use-on-click-outside";
import { Button } from "~components/ui/button";
import { Badge } from "~components/ui/badge";

import loadingSVG from "data-base64:~assets/loading.svg";

const defaultBackgroundImages: string[] = [];

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
  const [settingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);
  const [backgroundType, setBackgroundType] = useState<string>(
    localStorage.getItem("backgroundType") || "random"
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

  useEffect(() => {
    const resizeHandler = () => {
      setScreenSize({
        windowWidth: window.screen.width,
        windowHeight: window.screen.height
      });
    };
    resizeHandler();
    aspectRatio = screenSize.windowWidth / screenSize.windowHeight;
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
  });

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
    api.on("select", (index) => {
      // console.log(index);
      console.log(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <>
      {/* Settings icon */}
      <div className={cn("fixed bottom-4 right-2 w-12")}>
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
        ref={ref}
        className={cn(
          "fixed bottom-4 right-4 w-[600px] h-max py-4 px-5 m-4 rounded-md flex gap-4 flex-col items-center justify-center bg-black",
          settingsDialogOpen ? "" : "hidden"
        )}>
        {/* Settings header */}
        <div className="absolute top-0 left-0 w-full px-2 py-1 flex items-center justify-start">
          <ChevronDown
            className="text-accent-foreground cursor-pointer hover:translate-y-1 transform transition-transform duration-300 ease-in-out"
            onClick={() => {
              setSettingsDialogOpen(false);
            }}
          />

          <span className="flex-1 text-accent-foreground text-center text-sm font-bold">
            Settings
          </span>
        </div>

        {/* username */}
        <div className="w-full mt-3 flex flex-col gap-0.5 items-start justify-center">
          <Label
            htmlFor="username"
            className="text-lg font-semibold text-accent-foreground ">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            value={userName}
            placeholder="Set Username"
            className="flex-1 h-[40px] w-full bg-accent-foreground text-accent-background rounded-md p-2"
            onChange={(e) => {
              e.preventDefault();
              setUserName(e.target.value);
            }}></Input>
        </div>

        {/* Background */}
        <div className="w-full flex flex-col gap-2 items-start justify-center">
          <Label
            htmlFor="background"
            className="font-semibold text-accent-foreground ">
            Background
          </Label>
          <div className="w-full p-4 flex items-center justify-center">
            <Carousel
              setApi={setApi}
              opts={{
                align: "center",
                loop: true
              }}
              className="w-full max-w-sm">
              <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center">
                          <span className="text-3xl font-semibold">
                            {index + 1}
                          </span>
                          {/* <img
                            src="https://source.unsplash.com/1920x1080"
                            alt=""
                            className="w-full h-full object-contain"
                            onClick={() => {
                              console.log("clicked", index);
                            }}
                          /> */}
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
          <div className="w-full flex  items-center justify-start text-accent-foreground">
            {/* left */}
            <div className="w-max p-4 text-base">
              <RadioGroup defaultValue={backgroundType}>
                <div
                  className="flex items-center space-x-2"
                  onClick={() => {
                    setBackgroundType("tags");
                  }}>
                  <RadioGroupItem id="r2" value="tags" />
                  <Label htmlFor="r2">Modify with tags</Label>
                </div>
                <div
                  className="flex items-center space-x-2"
                  onClick={() => {
                    // console.log("custom");
                    setBackgroundType("custom");
                  }}>
                  <RadioGroupItem id="r3" value="custom" />
                  <Label htmlFor="r3">Custom</Label>
                </div>
              </RadioGroup>
            </div>

            {/* right */}
            <div className="flex-1">
              {/* Tags input */}
              <div
                className={cn(
                  "w-full h-[196px] flex flex-col items-center justify-start",
                  { hidden: backgroundType !== "tags" }
                )}>
                <Input
                  type="text"
                  value={inputvalue}
                  placeholder="Enter space-separated tags"
                  className="w-full bg-accent-background text-black p-2"
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
                        className="m-1 text-sm flex gap-1 items-center justify-between cursor-default">
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
                className={cn("w-full p-2 flex items-center justify-center", {
                  hidden: backgroundType === "custom"
                })}>
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

              {/* custom walpaper input */}
              <div
                className={cn(
                  "flex flex-col items-center justify-center gap-1",
                  { hidden: backgroundType !== "custom" }
                )}>
                {/* url */}
                <div className="w-full flex items-center justify-start bg-accent-background">
                  {/* url of the bg */}
                  <Label
                    htmlFor="bgUrl"
                    className="text-accent-foreground font-semibold p-2 ring-1 h-full rounded-s-md">
                    URL
                  </Label>
                  <input
                    id="bgUrl"
                    type="url"
                    // value={backgroundImage}
                    placeholder="Set Background Image URL"
                    className="flex-1 w-full p-2 bg-accent-background text-black"
                    onChange={(e) => {
                      // e.preventDefault();
                      setBgUrl(e.target.value);
                    }}></input>
                  <Button
                    variant="outline"
                    className="max-h-full rounded-s-none rounded-e-md text-accent-foreground"
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
                      "image/*": [".png", ".webp" , ".jpeg", ".jpg"]
                    }}
                    onDrop={(acceptedFiles) => {
                      // if the given file is not an image
                      // console.log(acceptedFiles[0].type);
                      // if (!acceptedFiles[0].type.includes("image")) {
                      //   console.log("not an image");
                      //   return;
                      // }
                      // create a FileReader instance
                      const reader = new FileReader();

                      // set the onload function of the reader
                      reader.onload = function (e) {
                        e.preventDefault();
                        // e.target.result contains the Data URL
                        // set the Data URL to the image
                        setBackgroundImage(e.target.result as string);
                        storeData("appData", "backgroundImage", {
                          backgroundImage: e.target.result
                        });
                      };

                      // read the image file as a Data URL
                      reader.readAsDataURL(acceptedFiles[0]);
                    }}>
                    {({ getRootProps, getInputProps }) => (
                      <section className={cn("w-full h-[200px]")}>
                        <div
                          {...getRootProps()}
                          className={
                            "w-full h-full rounded-3xl border-[2px] border-dashed flex items-center justify-center text-center"
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;
