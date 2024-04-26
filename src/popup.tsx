import { Button } from "~components/ui/button";
import { CountButton } from "~features/count-button";

import "~style.css";

function IndexPopup() {
  return (
    <div className="w-[500px] h-max p-4 rounded-md bg-accent">
      <p className="text-base text-accent-foreground">
        This project is developed by group of students of IIT Roorkee. It is
        developed as a part of Software Enginnering Course.
      </p>
      <span className="text-base">
        For quaries{" "}
        <a
          href="https://github.com/Gardians-Of-Code/glimpse/discussions"
          className="text-blue-600 underline visited:text-purple-600">
          here
        </a>
        {/* <Button
          variant="link"
          onClick={() => {
            chrome.tabs.create({
              url: "https://github.com/Gardians-Of-Code/glimpse/discussions"
            });
          }}>
          here
        </Button> */}
      </span>
    </div>
  );
}

export default IndexPopup;
