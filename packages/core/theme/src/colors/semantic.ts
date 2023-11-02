import type { ThemeColors, SemanticBaseColors } from "./types";
import { swapColorValues } from "../utils/object";
import { commonColors as common } from "./common";

const base: SemanticBaseColors = {
  light: {
    background: {
      DEFAULT: "#FFFFFF",
    },
    foreground: {
      ...common.zinc,
      DEFAULT: "#11181C",
    },
    divider: {
      DEFAULT: "rgba(17, 17, 17, 0.15)",
    },
    focus: {
      DEFAULT: common.blue[500],
    },
    overlay: {
      DEFAULT: "#000000",
    },
    content1: {
      DEFAULT: "#FFFFFF",
      foreground: "#11181C",
    },
    content2: {
      DEFAULT: common.zinc[100],
      foreground: common.zinc[800],
    },
    content3: {
      DEFAULT: common.zinc[200],
      foreground: common.zinc[700],
    },
    content4: {
      DEFAULT: common.zinc[300],
      foreground: common.zinc[600],
    },
  },
  dark: {
    background: {
      DEFAULT: "#333333",
    },
    foreground: {
      ...swapColorValues(common.zinc),
      DEFAULT: "#ECEDEE",
    },
    focus: {
      DEFAULT: common.blue[500],
    },
    overlay: {
      DEFAULT: "#000000",
    },
    divider: {
      DEFAULT: "rgba(255, 255, 255, 0.15)",
    },
    content1: {
      DEFAULT: common.zinc[900],
      foreground: common.zinc[50],
    },
    content2: {
      DEFAULT: common.zinc[800],
      foreground: common.zinc[100],
    },
    content3: {
      DEFAULT: common.zinc[700],
      foreground: common.zinc[200],
    },
    content4: {
      DEFAULT: common.zinc[600],
      foreground: common.zinc[300],
    },
  },
};

export const themeColorsLight: ThemeColors = {
  ...base.light,
  default: {
    ...common.zinc,
    foreground: "#ffffff",
    DEFAULT: common.zinc[500],
  },
  primary: {
    ...common.blue,
    foreground: "#ffffff",
    DEFAULT: common.blue[500],
  },
  secondary: {
    ...common.purple,
    foreground: "#ffffff",
    DEFAULT: common.purple[500],
  },
  success: {
    ...common.green,
    foreground: "#000000",
    DEFAULT: common.green[500],
  },
  info: {
    ...common.blue,
    foreground: "#ffffff",
    DEFAULT: common.blue[500],
  },
  warning: {
    ...common.yellow,
    foreground: "#000000",
    DEFAULT: common.yellow[500],
  },
  danger: {
    ...common.red,
    foreground: common.white,
    DEFAULT: common.red[500],
  },
};

export const themeColorsDark: ThemeColors = {
  ...base.dark,
  default: {
    ...swapColorValues(common.zinc),
    foreground: "#ffffff",
    DEFAULT: common.zinc[500],
  },
  primary: {
    ...swapColorValues(common.blue),
    foreground: "#ffffff",
    DEFAULT: common.blue[500],
  },
  secondary: {
    ...swapColorValues(common.purple),
    foreground: "#ffffff",
    DEFAULT: common.purple[500],
  },
  success: {
    ...swapColorValues(common.green),
    foreground: "#000000",
    DEFAULT: common.green[500],
  },
  info: {
    ...swapColorValues(common.blue),
    foreground: "#ffffff",
    DEFAULT: common.blue[500],
  },
  warning: {
    ...swapColorValues(common.yellow),
    foreground: "#000000",
    DEFAULT: common.yellow[500],
  },
  danger: {
    ...swapColorValues(common.red),
    foreground: common.white,
    DEFAULT: common.red[500],
  },
};

export const semanticColors = {
  light: themeColorsLight,
  dark: themeColorsDark,
};
