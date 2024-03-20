import "./Settings.css";
import { useState, useRef } from "react";
import { Settings, Pencil, Trash2, X } from "lucide-react";

function Setting() {
  const [showSettings, setShowSettings] = useState<string>("closed");
  const inputRef = useRef(null);
  const [show, setShow] = useState<boolean>(false);

  const handleUpload = () => {
    setShow(true);
    // if(inputRef.current !== null){
    //     const input = inputRef.current as HTMLInputElement;
    //     input.click();
    // }
    // return (
    //   <div
    //     className={cn(
    //       "fixed top-0 left-0 w-full h-full z-[99999] bg-transparent flex items-center justify-center",
    //       isOpen ? "" : "hidden"
    //     )}
    //   ></div>
    // );
  };
  return (
    <>
      <div className="settings-main">
        {showSettings !== "closed" && (
          <>
            <div className="settings-div">
              <ul className="buttons">
                <li onClick={handleUpload}>
                  Set Custom Wallpaper
                  <input
                    type="file"
                    ref={inputRef}
                    style={{ display: "none" }}
                  />
                  {show && <ImageDialog onClick={() => setShow(false)} />}
                </li>
                <li>Set Username</li>
                <li>B</li>
                <li>C</li>
              </ul>
            </div>
          </>
        )}
        <button
          className="setting"
          type="button"
          onClick={() => {
            if (showSettings == "show") {
              setShowSettings("closed");
            } else {
              setShowSettings("show");
            }
          }}
        >
          <Settings />
        </button>
      </div>
    </>
  );
}

const ImageDialog = (closeDialogue : ()=>void) => {
  const imageUrlRef = useRef(null);
//   const inputRef = useRef(null);
  const [newUrl, setNewUrl] = useState<string>("");


  const handleUrlSubmit = (event:React.FormEvent) => {
      event.preventDefault();
      let imageUrl = "";
      if(imageUrlRef.current !== null){
        const image = imageUrlRef.current as HTMLInputElement;
        imageUrl = image.value;
      }
      // Process the image URL here (e.g., display the image)
      closeDialogue();
  };

  const handleFileChange = (event:React.FormEvent) => {
      const selectedFile = event.target.files[0];
      // Process the selected file here (e.g., display the preview)
      closeDialogue();
  };


  return (
    <div
      id="Imgdialog"
      className="fixed top-0 left-0 w-full h-full z-[99999] bg-transparent flex items-center justify-center"
    >
      <div
        id="editImageDialog"
        className="relative basis-4/10 h-max bg-slate-100 rounded-lg flex flex-col justify-center"
      >
        <span
          className="absolute top-2 right-2 cursor-pointer"
          onClick={() => {
            closeDialogue();
          }}
        >
        <X color="white"/>
        </span>
        <h1>Add Custom Wallpaper</h1>
        <br />
        <div className="add-url"> Add URL: <input type="url" id="input-url" value={newUrl} onChange={(e) => {setNewUrl(e.target.value)}}/></div>
        <div className="add-file"> Add from local device: <input type="file" id="input-file" /></div>
      </div>
    </div>
  );
};

export default Setting;
