import { CountButton } from "~features/count-button"

import "~style.css"

function IndexPopup() {
  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-justify-center plasmo-h-16 plasmo-w-40">
      <CountButton />
      <button
        onClick={() => {
          chrome.tabs.create({
            url: "./tabs/new-tab.html"
          })
        }}>
        open tab page
      </button>
    </div>
  )
}

export default IndexPopup
