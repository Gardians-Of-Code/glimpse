import loadingPage from "data-text:~contents/loading.html";

function findHoverWindow() {
  const plasmoHoverWindow = document.querySelector("#hover-window");
  if (plasmoHoverWindow && plasmoHoverWindow.shadowRoot) {
    const plasmoShadowContainer = plasmoHoverWindow.shadowRoot.querySelector(
      "#plasmo-shadow-container"
    );
    if (plasmoShadowContainer) {
      const hoverWindow = plasmoShadowContainer.querySelector("#hoverWindow");
      if (hoverWindow) {
        return hoverWindow;
      }
    }
  }
  return null;
}

const fetchHtml = async (url: string, showLanguage: string) => {
  // console.log("fetching...", url, showLanguage)
  const response = await fetch(
    `${process.env.PLASMO_PUBLIC_BACKEND_URL}/api/v1/proxy`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url, showLanguage })
    }
  );
  const readingTime = parseInt(response.headers.get("x-reading-time") || "0");
  const html = await response.text();
  return { html, readingTime };
};

export const showWebPage = async (
  url: string,
  showLanguage: string,
  hoverWindow: HTMLElement | Element
) => {
  // const loadingImage = hoverWindow.querySelector("#loadingImage");
  const iframe = hoverWindow.querySelector("iframe");
  let readingTime = 0;
  if (iframe) {
    iframe.srcdoc = loadingPage;
  }

  const { html, readingTime: fetchedReadingTime } = await fetchHtml(
    url,
    showLanguage
  );
  iframe.srcdoc = html;
  // iframe.width = "100%";
  // iframe.height = "100%";
  readingTime = fetchedReadingTime;
  // hoverWindow.appendChild(iframe);
  return readingTime;
};

export const removeWebPage = () => {
  const hoverWindow = findHoverWindow();
  if (hoverWindow) {
    // remove the iframe
    const iframe = hoverWindow.querySelector("iframe");
    if (iframe) {
      iframe.srcdoc = loadingPage;
    }
  }
};

export async function putWebsite(url: string, showLanguage: string) {
  return new Promise<number>((resolve) => {
    const intervalId = setInterval(() => {
      const hoverWindow = findHoverWindow();
      if (hoverWindow) {
        clearInterval(intervalId);
        const readingTime = showWebPage(url, showLanguage, hoverWindow);
        // console.log("readingTime 1", readingTime);
        resolve(readingTime);
      }
    }, 1000); // Check every 1000ms (1 second)
  });
}

// waitForSidebar("https://projects.100xdevs.com/");
