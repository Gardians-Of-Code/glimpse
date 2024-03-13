import cssText from "data-text:~style.css";

import { Button } from "~components/ui/button";

export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

// import "~style.css";

function NewTabPage() {
  return (
    <div className="bg-red-500">
      <h2>Delta Flyer Tab</h2>

      <p>This tab is only available on the Delta Flyer page.</p>
      <Button variant="destructive">Click me</Button>

      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat quo rem
        cupiditate culpa perferendis blanditiis quam vel, necessitatibus impedit
        commodi laborum, aliquid aspernatur quae consequatur, explicabo minus ex
        illo et!
      </p>
    </div>
  );
}

export default NewTabPage;
