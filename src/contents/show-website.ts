function findHoverWindow() {
  const plasmoGoogleSidebar = document.querySelector("#hover-window")
  if (plasmoGoogleSidebar && plasmoGoogleSidebar.shadowRoot) {
    const plasmoShadowContainer = plasmoGoogleSidebar.shadowRoot.querySelector(
      "#plasmo-shadow-container"
    )
    if (plasmoShadowContainer) {
      const sidebar = plasmoShadowContainer.querySelector("#hoverWindow")
      if (sidebar) {
        return sidebar
      }
    }
  }
  return null
}

const fetchHtml = async (url: string) => {
  const response = await fetch("http://localhost:3000/proxy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url })
  })
  const html = await response.text()
  return html
}

const showWebPage = (url: string, sidebar: Element | null = null) => {
  const iframe = document.createElement("iframe")
  iframe.srcdoc = "<h1>Loading...</h1>"
  console.log("loading...")
  iframe.width = "100%"
  iframe.height = "100%"

  fetchHtml(url).then((html) => {
    iframe.srcdoc = html
  })

  sidebar.innerHTML = ""
  sidebar.appendChild(iframe)
}

export const removeWebPage = () => {
  const sidebar = findHoverWindow()
  if (sidebar) {
    sidebar.innerHTML = ""
  }
}

export function putWebsite(url: string = "") {
  const intervalId = setInterval(() => {
    const sidebar = findHoverWindow()
    if (sidebar) {
      //   console.log(sidebar)
      clearInterval(intervalId)
      showWebPage(url, sidebar)
      //   console.log(sidebar)
    }
  }, 1000) // Check every 1000ms (1 second)
}

// waitForSidebar("https://projects.100xdevs.com/");
