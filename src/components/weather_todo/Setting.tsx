import { cn } from "@/lib/utils";
import { Settings, X } from "lucide-react";

import "./Setting.css";

import { resolve } from "path";
// import { timeStamp } from "console";
import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";

import { storeData } from "~components/indexedDb";

const Setting = ({
  backgroundImage,
  setBackgroundImage
}: {
  backgroundImage: string;
  setBackgroundImage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [dialogueOpen, setDialogueOpen] = useState<boolean>(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);
  const [backgroundType, setBackgroundType] = useState<string>(
    localStorage.getItem("backgroundType") || "random"
  );

  const fetchRandomImage = async (url: string) => {
    fetch(url)
      .then((response) => {
        setBackgroundImage(response.url);
        storeData("appData", "backgroundImage", {
          backgroundImage: response.url
        });
        localStorage.setItem("backgroundTimeStamp", Date.now().toString());
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (backgroundType === "random") {
      // check if the random background image is newer than 1 day
      const timeStamp = localStorage.getItem("backgroundTimeStamp");
      if (timeStamp) {
        const currentTime = Date.now();
        const diff = currentTime - parseInt(timeStamp);
        if (diff < 86400000 && currentTime !== 0) {
          return;
        }
      }
      fetchRandomImage("https://source.unsplash.com/random/1920x1080");
    } else if (backgroundType === "custom") {
      if (backgroundImage === "") {
        return;
      }
      localStorage.setItem("backgroundTimeStamp", "0");
      storeData("appData", "backgroundImage", {
        backgroundImage: backgroundImage
      });
    } else {
      const timeStamp = localStorage.getItem("backgroundTimeStamp");
      if (timeStamp) {
        const currentTime = Date.now();
        const diff = currentTime - parseInt(timeStamp);
        if (diff < 86400000 && currentTime !== 0) {
          return;
        }
      }
      const url = `https://source.unsplash.com/1920x1080/?${backgroundType}`;
      fetchRandomImage(url);
    }
  }, [backgroundType]);

  useEffect(() => {}, [backgroundImage, backgroundType]);

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
            setDialogueOpen(true);
          }}
        />
      </div>

      {/* Settings dialogue */}
      <div
        className={cn(
          "fixed bottom-4 right-4 w-40 h-40 flex items-center justify-center bg-green-500 rounded-md",
          settingsDialogOpen ? "" : "hidden"
        )}></div>

      {/* Background image set dialogue */}
      <div
        className={cn(
          "fixed top-0 left-0 w-full h-full flex items-center justify-center",
          dialogueOpen ? "" : "hidden"
        )}>
        <div
          className={cn("relative bg-green-400 w-[500px] m-4 p-2 rounded-sm")}>
          <h2 className="text-lg font-semibold">Set background image</h2>
          <X
            className="absolute top-1 right-1 cursor-pointer"
            onClick={() => {
              setDialogueOpen(false);
            }}
          />
          <div className="flex flex-col items-center justify-start">
            <div className="w-full">
              <label htmlFor="url" className="px-2">
                Add url
              </label>
              <input type="url" />
            </div>

            {/* Drop box */}
            <Dropzone
              onDrop={(acceptedFiles) => {
                // if the given file is not an image
                // console.log(acceptedFiles[0].type);
                if (!acceptedFiles[0].type.includes("image")) {
                  // console.log("not an image");
                  return;
                }
                // create a FileReader instance
                const reader = new FileReader();

                // set the onload function of the reader
                reader.onload = function (e) {
                  e.preventDefault();
                  // e.target.result contains the Data URL
                  // set the Data URL to the image
                  setBackgroundImage(e.target.result as string);
                  setBackgroundType("custom");
                };

                // read the image file as a Data URL
                reader.readAsDataURL(acceptedFiles[0]);
              }}>
              {({ getRootProps, getInputProps }) => (
                <section className={cn("w-full h-[200px]")}>
                  <div
                    {...getRootProps()}
                    className={
                      "w-full h-full bg-red-400 border-[2px] border-dashed flex items-center justify-center text-center"
                    }>
                    <input {...getInputProps()} />
                    <p className="text-wrap text-sm">
                      Drag 'n' drop image here, or click to select files
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;
