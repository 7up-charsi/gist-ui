import { frontui } from "@front-ui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["../../packages/components/**/*.{ts,tsx}", "../../packages/core/theme/**/*.{ts,tsx}"],
  plugins: [frontui()],
};
