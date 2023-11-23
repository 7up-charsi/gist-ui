import { gistui } from "@gist-ui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "../../packages/components/**/*.{ts,tsx}",
    "../../packages/core/theme/**/*.{ts,tsx}",
    "./.storybook/**/*.{ts,tsx}",
  ],
  plugins: [gistui()],
};
