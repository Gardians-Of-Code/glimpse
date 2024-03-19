;

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ["./src/**/*.{tsx,html}"],
//   darkMode: "media",
//   // prefix: ""
// }

import { fontFamily } from "tailwindcss/defaultTheme";





;













/** @type {import('tailwindcss').Config} */
export const darkMode = ["class", "media"];
export const content = [
  "app/**/*.{ts,tsx}",
  "components/**/*.{ts,tsx}",
  "./src/**/*.{tsx,html}"
];
export const prefix = "";
export const theme = {
  container: {
    center: true,
    padding: "2rem",
    screens: {
      "2xl": "1400px"
    }
  },
  extend: {
    colors: {
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))"
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))"
      },
      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        foreground: "hsl(var(--destructive-foreground))"
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))"
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))"
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))"
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))"
      }
    },
    borderRadius: {
      lg: `var(--radius)`,
      md: `calc(var(--radius) - 2px)`,
      sm: "calc(var(--radius) - 4px)"
    },
    fontFamily: {
      sans: ["var(--font-sans)", ...fontFamily.sans]
    },
    keyframes: {
      "accordion-down": {
        from: { height: "0" },
        to: { height: "var(--radix-accordion-content-height)" }
      },
      "accordion-up": {
        from: { height: "var(--radix-accordion-content-height)" },
        to: { height: "0" }
      }
    },
    animation: {
      "accordion-down": "accordion-down 0.2s ease-out",
      "accordion-up": "accordion-up 0.2s ease-out"
    },
    backgroundImage: {
      random: "url(https://source.unsplash.com/random)",
      // coolImage: "url(pexels-christian-heitz-842711.jpg)"
    },
    flexBasis: {
      "1/10": "10%",
      "2/10": "20%",
      "3/10": "30%",
      "4/10": "40%",
      "5/10": "50%",
      "6/10": "60%",
      "7/10": "70%",
      "8/10": "80%",
      "9/10": "90%",

      "1/15": "6.666667%",
      "2/15": "13.333333%",
      "3/15": "20%",
      "4/15": "26.666667%",
      "6/15": "40%",
      "5/15": "33.333333%",
      "7/15": "46.666667%",
      "8/15": "53.333333%"
    }
  }
};
export const plugins = [require("tailwindcss-animate")];