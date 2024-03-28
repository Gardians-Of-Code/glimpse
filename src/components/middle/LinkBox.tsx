import type { QuickLinksType } from "@/components/middle/QuickLinks";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Pencil, Trash2 } from "lucide-react";
import { lazy, useEffect, useState } from "react";

// import EditLinkDialog from "@/components/middle/EditLinkDialog";
const EditLinkDialog = lazy(() => import("@/components/middle/EditLinkDialog"));

const LinkBox = ({
  title,
  index,
  url,
  onRemove,
  onEdit
}: QuickLinksType & {
  onRemove: (index: number) => void;
  onEdit: (index: number, title: string, url: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [icon, setIcon] = useState("");
  const closeDialogue = () => {
    setIsOpen(false);
  };
  const fetchIcon = async () => {
    try {
      let res = await fetch(`https://logo.clearbit.com/${url}`);
      if (!res.ok) {
        res = await fetch(`https://www.google.com/s2/favicons?domain=${url}`);
      }
      const blob = await res.blob();
      setIcon(URL.createObjectURL(blob));
      // update the icon in quickLinks which has index
      const quickLinks = JSON.parse(
        localStorage.getItem("quickLinks") as string
      );
      quickLinks.forEach((link: QuickLinksType) => {
        if (link.index === index) {
          link.icon = URL.createObjectURL(blob);
        }
      });
      localStorage.setItem("quickLinks", JSON.stringify(quickLinks));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (icon === "") {
      fetchIcon();
    }
  });
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className=" max-h-[80px] w-[80px] flex flex-col items-center justify-center bg-black/70 m-4 px-4 pt-2 pb-2 rounded-xl cursor-pointer hover:bg-black/50 transition-all duration-300 ease-in-out "
              onClick={() => {
                window.open(url, "_self");
              }}>
              <img
                src={icon ? icon : "/favicon.ico"}
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
                }}>
                <Pencil className=" text-[#bababa] hover:text-white" />
              </span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index);
                }}>
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

export default LinkBox;
