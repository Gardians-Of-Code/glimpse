import { Button } from "~components/ui/button";
import { CountButton } from "~features/count-button";

import "~style.css";

function IndexPopup() {
  return (
    <div className="flex flex-col items-center justify-center h-[160px] w-[160px]">
      <CountButton />
      <h2>
        Welcome to your{" "}
        <a
          className="text-blue-500 underline"
          href="https://www.plasmo.com"
          target="_blank">
          Plasmo
        </a>{" "}
        Extension!
      </h2>
      <Button
        variant="secondary"
        onClick={() => {
          chrome.tabs.create({
            url: "./tabs/new-tab.html"
          });
        }}>
        open new tab page
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          chrome.tabs.create({
            url: "./tab"
          });
        }}>
        open tab page
      </Button>
    </div>
  );
}

export default IndexPopup;
