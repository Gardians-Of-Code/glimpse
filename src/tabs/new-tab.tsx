import cssText from "data-text:~style.css"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

function NewTabPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      <h2>Delta Flyer Tab</h2>

      <p>This tab is only available on the Delta Flyer page.</p>
    </div>
  )
}

export default NewTabPage
