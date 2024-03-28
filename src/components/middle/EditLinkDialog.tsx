import { Label } from "@radix-ui/react-label";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~components/ui/button";
import { Input } from "~components/ui/input";
import { useOnClickOutside } from "~components/use-on-click-outside";
import { cn } from "~lib/utils";

const EditLinkDialog = ({
  isOpen,
  closeDialogue,
  handleEditLink,
  title,
  url,
  index
}: {
  isOpen: boolean;
  closeDialogue: () => void;
  handleEditLink: (index: number, title: string, url: string) => void;
  title: string;
  url: string;
  index: number;
}) => {
  const isMounted = useRef(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newUrl, setNewUrl] = useState(url);

  const editLinkDialogRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(editLinkDialogRef, () => {
    closeDialogue();
  });

  useEffect(() => {
    if (isMounted.current) {
      const clickHandler = (e: MouseEvent) => {
        if (
          e.target instanceof HTMLElement &&
          e.target.id !== "editLinkDialog"
        ) {
          closeDialogue();
        }
      };

      document.addEventListener("click", clickHandler, true);

      return () => {
        document.removeEventListener("click", clickHandler, true);
      };
    } else {
      isMounted.current = true;
    }
  }, [isOpen, closeDialogue]);

  useEffect(() => {
    document.getElementById("newTitle")?.focus();
  }, [isOpen]);

  return (
    <div
      className={cn(
        "fixed top-0 left-0 w-full h-full z-[99999] bg-transparent flex items-center justify-center",
        isOpen ? "" : "hidden"
      )}>
      <div
        id="editLinkDialog"
        ref={editLinkDialogRef}
        className=" relative basis-4/10 h-max bg-popover text-popover-foreground rounded-lg flex flex-col justify-center">
        <span
          className="absolute top-1 right-1 cursor-pointer"
          onClick={() => {
            closeDialogue();
          }}>
          <X />
        </span>
        <div className="absolute top-1 left-1">
          <h6>Edit url</h6>
        </div>
        <div className="m-4 p-4 flex flex-col items-center">
          <div className="w-full">
            <Label htmlFor="newTitle">Title</Label>
            <Input
              id="newTitle"
              type="text"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              // className="focus:outline-none"
              value={newTitle}
              onChange={(e) => {
                setNewTitle(e.target.value);
              }}
            />
          </div>
          <div className="w-full">
            <Label htmlFor="newUrl">Url</Label>
            <Input
              id="newUrl"
              type="url"
              // className="focus:outline-none"
              value={newUrl}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              onChange={(e) => {
                setNewUrl(e.target.value);
              }}
            />
          </div>
          <div className="w-full mt-2 flex items-center justify-between">
            <Button
              variant={"default"}
              className=""
              onClick={() => {
                closeDialogue();
              }}>
              cancel
            </Button>
            <Button
              variant={"default"}
              className=""
              onClick={() => {
                handleEditLink(index, newTitle, newUrl);
                closeDialogue();
              }}>
              Edit link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLinkDialog;
