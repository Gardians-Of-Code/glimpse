import { Label } from "@radix-ui/react-label";
import { X } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Button } from "~components/ui/button";
import { Input } from "~components/ui/input";
import { useOnClickOutside } from "~components/use-on-click-outside";
import { cn } from "~lib/utils";

const AddLinkDialog = ({
  isOpen,
  closeDialogue,
  handleAddLink
}: {
  isOpen: boolean;
  closeDialogue: () => void;
  handleAddLink: (title: string, url: string) => void;
}) => {
  const isMounted = useRef(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const addLinkDialogRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(addLinkDialogRef, () => {
    closeDialogue();
  });

  useEffect(() => {
    document.getElementById("title")?.focus();
  }, [isOpen]);

  return (
    <div
      className={cn(
        "fixed top-0 left-0 w-full h-full z-[99999] bg-transparent flex items-center justify-center",
        isOpen ? "" : "hidden"
      )}>
      <div
        id="addLinkDialog"
        ref={addLinkDialogRef}
        className=" relative basis-4/10 h-max bg-popover text-popover-foreground rounded-lg flex flex-col justify-center">
        <span
          className="absolute top-1 right-1 cursor-pointer"
          onClick={() => {
            closeDialogue();
          }}>
          <X />
        </span>
        <div className="absolute top-1 left-1">
          <h6>Add url</h6>
        </div>
        <div className="m-4 p-4 flex flex-col items-center">
          <div className="w-full">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              // className="focus:outline-none"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>
          <div className="w-full">
            <Label htmlFor="url">Url</Label>
            <Input
              id="url"
              type="url"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              // className="focus:outline-none"
              onChange={(e) => {
                setUrl(e.target.value);
              }}
            />
          </div>
          <div className="w-full mt-2 pt-2 flex items-center justify-between">
            <Button
              variant={"secondary"}
              className=""
              onClick={() => {
                closeDialogue();
              }}>
              cancel
            </Button>
            <Button
              variant={"secondary"}
              className=""
              onClick={() => {
                handleAddLink(title, url);
                closeDialogue();
              }}>
              Add link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLinkDialog;