import plugin from "tailwindcss/plugin";
import { neutral, primary, secondary, success, info, warning, danger } from "./colors";

export const frontplusui = () => {
  return plugin(() => {}, {
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
      },
    },
  });
};
