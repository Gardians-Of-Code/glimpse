import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOnClickOutside } from "~components/use-on-click-outside";

type QuickLinksType = {
  index: number;
  title: string;
  url: string;
};

const QuickLinks = () => {
  const [quickLinks, setQuickLinks] = useState<QuickLinksType[]>(
    localStorage.getItem("quickLinks")
      ? JSON.parse(localStorage.getItem("quickLinks") as string)
      : [],
  );

  const handleAddLink = (title: string, url: string) => {
    if (title === "") return;
    if (url === "") return;

    const index = quickLinks.length;
    setQuickLinks([...quickLinks, { index, title, url }]);
  };

  const handleEditLink = (index: number, title: string, url: string) => {
    console.log("edit", index, title, url);
    setQuickLinks(
      quickLinks.map((link) => {
        if (link.index === index) {
          console.log("edit", index, title, url);
          return { index, title, url };
        }
        return link;
      }),
    );
  };

  const handleRemoveLink = (index: number) => {
    setQuickLinks(quickLinks.filter((_, i) => i !== index));
  };

  useEffect(() => {
    localStorage.setItem("quickLinks", JSON.stringify(quickLinks));
    // console.log(quickLinks);
  }, [quickLinks]);

  return (
    <div className="w-full h-full flex flex-wrap items-center justify-center overflow-hidden">
      {quickLinks.map((link, index) => (
        <LinkBox
          key={index}
          index={index}
          title={link.title}
          url={link.url}
          onRemove={handleRemoveLink}
          onEdit={handleEditLink}
        />
      ))}
      {quickLinks.length < 15 && <AddLinkBox handleAddLink={handleAddLink} />}
    </div>
  );
};

const LinkBox = ({
  title,
  index,
  url,
  onRemove,
  onEdit,
}: QuickLinksType & {
  onRemove: (index: number) => void;
  onEdit: (index: number, title: string, url: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeDialogue = () => {
    setIsOpen(false);
  };
  // useEffect(() => {
  //   // console.log("linkbox");
  //   console.log(title, url, index);
  // });
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className=" max-h-[80px] w-[80px] flex flex-col items-center justify-center bg-black/70 m-4 px-4 pt-2 pb-2 rounded-xl cursor-pointer hover:bg-black/50 transition-all duration-300 ease-in-out "
              onClick={() => {
                window.open(url, "_self");
              }}
            >
              <img
                src={`https://www.google.com/s2/favicons?domain=${url}`}
                alt={title}
                className="w-[35px] mb-1"
              />
              <span className="text-white text-xs w-full text-center border-t-2 border-white/50 pt-1 max-w-[70px] max-h-[30px] truncate">
                {title}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className=" bg-transparent flex gap-1">
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(true);
                }}
              >
                <Pencil className=" text-[#bababa] hover:text-white" />
              </span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index);
                }}
              >
                <Trash2 className="text-[#ec7474] hover:text-red-500" />
              </span>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {isOpen && (
        <EditLinkDialog
          isOpen={isOpen}
          closeDialogue={closeDialogue}
          handleEditLink={onEdit}
          title={title}
          url={url}
          index={index}
        />
      )}
    </>
  );
};

const AddLinkBox = ({
  handleAddLink,
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
        }}
      >
        <Button
          variant={"ghost"}
          className="bg-transparent hover:bg-transparent place-items-center rounded-full"
        >
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

const AddLinkDialog = ({
  isOpen,
  closeDialogue,
  handleAddLink,
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
        isOpen ? "" : "hidden",
      )}
    >
      <div
        id="addLinkDialog"
        ref={addLinkDialogRef}
        className=" relative basis-4/10 h-max bg-popover text-popover-foreground rounded-lg flex flex-col justify-center"
      >
        <span
          className="absolute top-1 right-1 cursor-pointer"
          onClick={() => {
            closeDialogue();
          }}
        >
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
              }}
            >
              cancel
            </Button>
            <Button
              variant={"secondary"}
              className=""
              onClick={() => {
                handleAddLink(title, url);
                closeDialogue();
              }}
            >
              Add link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditLinkDialog = ({
  isOpen,
  closeDialogue,
  handleEditLink,
  title,
  url,
  index,
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
        isOpen ? "" : "hidden",
      )}
    >
      <div
        id="editLinkDialog"
        ref={editLinkDialogRef}
        className=" relative basis-4/10 h-max bg-popover text-popover-foreground rounded-lg flex flex-col justify-center"
      >
        <span
          className="absolute top-1 right-1 cursor-pointer"
          onClick={() => {
            closeDialogue();
          }}
        >
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
              }}
            >
              cancel
            </Button>
            <Button
              variant={"default"}
              className=""
              onClick={() => {
                handleEditLink(index, newTitle, newUrl);
                closeDialogue();
              }}
            >
              Edit link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickLinks;
