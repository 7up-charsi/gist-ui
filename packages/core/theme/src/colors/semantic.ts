import { SemanticBaseColors, ThemeColors } from "../types";
import { swapColorValues } from "../utils/objects";
import { amber } from "./amber";
import { amethyst } from "./amethyst";
import { blue } from "./blue";
import { emerald } from "./emerald";
import { rose } from "./rose";
import { saffronMango } from "./saffronMango";
import { zinc } from "./zinc";

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
      DEFAULT: zinc[50],
      foreground: zinc[800],
    },
    content3: {
      DEFAULT: zinc[200],
      foreground: zinc[500],
    },
    content4: {
      DEFAULT: zinc[300],
      foreground: zinc[600],
    },
  },
  dark: {
    background: {
      DEFAULT: "#000000",
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
      foreground: zinc[50],
    },
    content3: {
      DEFAULT: zinc[500],
      foreground: zinc[200],
    },
    content4: {
      DEFAULT: zinc[600],
      foreground: zinc[300],
    },
  },
};

export const lightTheme: ThemeColors = {
  ...base.light,
  default: {
    ...zinc,
    foreground: zinc[600],
    DEFAULT: zinc[300],
  },
  primary: {
    ...amethyst,
    foreground: amethyst[50],
    DEFAULT: amethyst[500],
  },
  secondary: {
    ...saffronMango,
    foreground: saffronMango[50],
    DEFAULT: saffronMango[500],
  },
  success: {
    ...emerald,
    foreground: emerald[50],
    DEFAULT: emerald[500],
  },
  info: {
    ...blue,
    foreground: blue[50],
    DEFAULT: blue[500],
  },
  warning: {
    ...amber,
    foreground: amber[800],
    DEFAULT: amber[400],
  },
  danger: {
    ...rose,
    foreground: rose[50],
    DEFAULT: rose[500],
  },
};

export const darkTheme: ThemeColors = {
  ...base.dark,
  default: {
    ...zinc,
    foreground: zinc[600],
    DEFAULT: zinc[300],
  },
  primary: {
    ...swapColorValues(amethyst),
    foreground: amethyst[50],
    DEFAULT: amethyst[500],
  },
  secondary: {
    ...swapColorValues(saffronMango),
    foreground: saffronMango[50],
    DEFAULT: saffronMango[500],
  },
  success: {
    ...swapColorValues(emerald),
    foreground: emerald[50],
    DEFAULT: emerald[500],
  },
  info: {
    ...swapColorValues(blue),
    foreground: blue[50],
    DEFAULT: blue[500],
  },
  warning: {
    ...swapColorValues(amber),
    foreground: amber[800],
    DEFAULT: amber[400],
  },
  danger: {
    ...swapColorValues(rose),
    foreground: rose[50],
    DEFAULT: rose[500],
  },
};

export const semanticColors = {
  light: lightTheme,
  dark: darkTheme,
};
