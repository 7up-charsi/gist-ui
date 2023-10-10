import { gray, blue, orange, amber, red, green, cyan } from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["../../packages/components/**/*.{ts,tsx}", "../../packages/core/theme/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neutral: { ...gray, DEFAULT: gray["300"], foreground: gray["900"] },
        primary: { ...blue, DEFAULT: blue["500"], foreground: blue["50"] },
        secondary: { ...orange, DEFAULT: orange["500"], foreground: orange["50"] },
        success: { ...green, DEFAULT: green["500"], foreground: green["50"] },
        info: { ...cyan, DEFAULT: cyan["500"], foreground: cyan["50"] },
        warning: { ...amber, DEFAULT: amber["500"], foreground: amber["950"] },
        danger: { ...red, DEFAULT: red["500"], foreground: red["50"] },
        foreground: gray["900"],
        backgroung: "#333",
        dark: {},
      },
    },
  },
};
