import { useState } from "react";
import { Button } from "~components/ui/button";
import AddLinkDialog from "./AddLinkDialog";

const AddLinkBox = ({
  handleAddLink
}: {
  handleAddLink: (title: string, url: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeDialogue = () => {
    setIsOpen(false);
  };
  return (
    <>
      <div
        className="flex flex-col items-center justify-center bg-black/70 m-4 pt-2 pb-4 px-1  rounded-full cursor-pointer hover:bg-black/50 transition-all duration-300 ease-in-out"
        onClick={() => {
          setIsOpen(true);
        }}>
        <Button
          variant={"ghost"}
          className="bg-transparent hover:bg-transparent place-items-center rounded-full">
          <span className="text-4xl text-white rounded-full">+</span>
        </Button>
      </div>
      {isOpen && (
        <AddLinkDialog
          isOpen={isOpen}
          closeDialogue={closeDialogue}
          handleAddLink={handleAddLink}
        />
      )}
    </>
  );
};

export default AddLinkBox;
