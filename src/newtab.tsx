import { useState } from "react";

import { ThemeProvider } from "~components/theme-provider";
import { Button } from "~components/ui/button";
import { cn } from "~lib/utils";

import "~style.css";

function IndexNewtab() {
  const [data, setData] = useState("");

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div
        className={cn(
          "flex",
          "flex-col",
          "items-center",
          "justify-center",
          "h-screen"
        )}>
        <h1 className={cn("text-4xl", "font-bold", "mb-4")}>Vite Newtab</h1>
        <Button onClick={() => setData("Hello, World!")}>Click me</Button>
        <p className={cn("mt-4")}>{data}</p>
      </div>
    </ThemeProvider>
  );
}

export default IndexNewtab;
