import plugin from "tailwindcss/plugin";
import {
  neutral,
  primary,
  secondary,
  success,
  info,
  warning,
  danger,
  foreground,
  background,
  outline,
} from "./colors";

export const gistui = () => {
  return plugin(
    ({ addUtilities, addVariant }) => {
      addUtilities({
        ".disabled": {
          opacity: "0.5",
          pointerEvents: "none",
        },
        ".border-test": {
          border: "1px solid red",
        },
      });

      addVariant("svg", "&>svg");
    },
    {
      theme: {
        extend: {
          colors: {
            neutral,
            primary,
            secondary,
            success,
            info,
            warning,
            danger,
            foreground,
            background,
            outline,
          },
          borderRadius: {
            small: "8px",
            medium: "12px",
            large: "14px",
          },
        },
      },
    },
  );
};
