import Landing from "~components/Landing";
import { ThemeProvider } from "~components/theme-provider";

import "~style.css";

function IndexNewtab() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Landing />
    </ThemeProvider>
  );
}

export default IndexNewtab;
