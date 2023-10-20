import plugin from "tailwindcss/plugin";
import { neutral, primary, secondary, success, info, warning, danger } from "./colors";

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
          },
          fontSize: {
            tiny: "0.75rem",
            small: "0.875rem",
            medium: "1rem",
            large: "1.125rem",
          },
          lineHeight: {
            tiny: "1rem",
            small: "1.25rem",
            medium: "1.5rem",
            large: "1.75rem",
          },
          borderRadius: {
            small: "8px",
            medium: "12px",
            large: "14px",
          },
          keyframes: {
            focusRipple: {
              "50%": {
                scale: ".9",
              },
              "100%": {
                scale: "1",
              },
            },
          },
          animation: {
            focusRipple: "focusRipple 3s ease-in-out infinite",
          },
        },
      },
    },
  );
};
