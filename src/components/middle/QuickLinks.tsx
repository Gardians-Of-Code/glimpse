// const LinkBox = lazy(() => import("@/components/middle/LinkBox"));
import LinkBox from "@/components/middle/LinkBox";
import { lazy, useEffect, useRef, useState } from "react";

const AddLinkBox = lazy(() => import("@/components/middle/AddLinkBox"));

export type QuickLinksType = {
  index: number;
  title: string;
  url: string;
  icon?: string;
};

const QuickLinks = () => {
  const [quickLinks, setQuickLinks] = useState<QuickLinksType[]>(
    localStorage.getItem("quickLinks")
      ? JSON.parse(localStorage.getItem("quickLinks") as string)
      : []
  );

  const handleAddLink = (title: string, url: string) => {
    if (title === "") return;
    if (url === "") return;
    if (!url.startsWith("http")) {
      url = `http://${url}`;
    }
    const index = quickLinks.length;
    setQuickLinks([...quickLinks, { index, title, url }]);
  };

  const handleEditLink = (index: number, title: string, url: string) => {
    // console.log("edit", index, title, url);
    setQuickLinks(
      quickLinks.map((link) => {
        if (link.index === index) {
          // console.log("edit", index, title, url);
          return { index, title, url };
        }
        return link;
      })
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

export default QuickLinks;
