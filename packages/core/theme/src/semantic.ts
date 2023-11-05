import { zinc, emerald, yellow, red, blue } from "tailwindcss/colors";
import type { ThemeColors, SemanticBaseColors } from "./types";
import { swapColorValues } from "./utils/object";

// tuscany
const primary = {
  "50": "#f0fdfb",
  "100": "#cdfaf6",
  "200": "#9af5ec",
  "300": "#60e8e1",
  "400": "#2fd2ce",
  "500": "#14a5a4",
  "600": "#0f9092",
  "700": "#107375",
  "800": "#125a5d",
  "900": "#144b4d",
  "950": "#052b2e",
};

// cerulean-blue
const secondary = {
  "50": "#faf6fd",
  "100": "#f5edfa",
  "200": "#eadaf4",
  "300": "#dbbdea",
  "400": "#c696dc",
  "500": "#ac6cc9",
  "600": "#9c5cb6",
  "700": "#783d8e",
  "800": "#643474",
  "900": "#552f60",
  "950": "#34153d",
};

const base: SemanticBaseColors = {
  light: {
    background: {
      DEFAULT: "#FFFFFF",
    },
    foreground: {
      ...zinc,
      DEFAULT: "#11181C",
    },
    divider: {
      DEFAULT: "rgba(17, 17, 17, 0.15)",
    },
    focus: {
      DEFAULT: blue[500],
    },
    overlay: {
      DEFAULT: "#000000",
    },
    content1: {
      DEFAULT: "#FFFFFF",
      foreground: "#11181C",
    },
    content2: {
      DEFAULT: zinc[100],
      foreground: zinc[800],
    },
    content3: {
      DEFAULT: zinc[200],
      foreground: zinc[700],
    },
    content4: {
      DEFAULT: zinc[300],
      foreground: zinc[600],
    },
  },
  dark: {
    background: {
      DEFAULT: "#333333",
    },
    foreground: {
      ...swapColorValues(zinc),
      DEFAULT: "#ECEDEE",
    },
    focus: {
      DEFAULT: blue[500],
    },
    overlay: {
      DEFAULT: "#000000",
    },
    divider: {
      DEFAULT: "rgba(255, 255, 255, 0.15)",
    },
    content1: {
      DEFAULT: zinc[900],
      foreground: zinc[50],
    },
    content2: {
      DEFAULT: zinc[800],
      foreground: zinc[100],
    },
    content3: {
      DEFAULT: zinc[700],
      foreground: zinc[200],
    },
    content4: {
      DEFAULT: zinc[600],
      foreground: zinc[300],
    },
  },
};

export const themeColorsLight: ThemeColors = {
  ...base.light,
  default: {
    ...zinc,
    foreground: "#ffffff",
    DEFAULT: zinc[500],
  },
  primary: {
    ...primary,
    foreground: "#ffffff",
    DEFAULT: primary[500],
  },
  secondary: {
    ...secondary,
    foreground: "#ffffff",
    DEFAULT: secondary[500],
  },
  success: {
    ...emerald,
    foreground: "#ffffff",
    DEFAULT: emerald[500],
  },
  info: {
    ...blue,
    foreground: "#ffffff",
    DEFAULT: blue[500],
  },
  warning: {
    ...yellow,
    foreground: "#000000",
    DEFAULT: yellow[500],
  },
  danger: {
    ...red,
    foreground: "#ffffff",
    DEFAULT: red[500],
  },
};

export const themeColorsDark: ThemeColors = {
  ...base.dark,
  default: {
    ...swapColorValues(zinc),
    foreground: "#ffffff",
    DEFAULT: zinc[500],
  },
  primary: {
    ...swapColorValues(primary),
    foreground: "#ffffff",
    DEFAULT: primary[500],
  },
  secondary: {
    ...swapColorValues(secondary),
    foreground: "#ffffff",
    DEFAULT: secondary[500],
  },
  success: {
    ...swapColorValues(emerald),
    foreground: "#ffffff",
    DEFAULT: emerald[500],
  },
  info: {
    ...swapColorValues(blue),
    foreground: "#ffffff",
    DEFAULT: blue[500],
  },
  warning: {
    ...swapColorValues(yellow),
    foreground: "#000000",
    DEFAULT: yellow[500],
  },
  danger: {
    ...swapColorValues(red),
    foreground: "#ffffff",
    DEFAULT: red[500],
  },
};

export const semanticColors = {
  light: themeColorsLight,
  dark: themeColorsDark,
};
