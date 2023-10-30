import { zinc, blue, purple, green, yellow, red, fuchsia, white } from "tailwindcss/colors";
import { readableColor } from "color2k";
import { SemanticBaseColors, ThemeColors } from "./types";
import { swapColorValues } from "./utils/objects";

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

export const lightTheme: ThemeColors = {
  ...base.light,
  default: {
    ...zinc,
    foreground: readableColor(zinc[300]),
    DEFAULT: zinc[300],
  },
  primary: {
    ...fuchsia,
    foreground: readableColor(blue[500]),
    DEFAULT: blue[500],
  },
  secondary: {
    ...purple,
    foreground: readableColor(purple[500]),
    DEFAULT: purple[500],
  },
  success: {
    ...green,
    foreground: readableColor(green[500]),
    DEFAULT: green[500],
  },
  info: {
    ...blue,
    foreground: readableColor(blue[500]),
    DEFAULT: blue[500],
  },
  warning: {
    ...yellow,
    foreground: readableColor(yellow[500]),
    DEFAULT: yellow[500],
  },
  danger: {
    ...red,
    foreground: white,
    DEFAULT: red[500],
  },
};

export const darkTheme: ThemeColors = {
  ...base.dark,
  default: {
    ...swapColorValues(zinc),
    foreground: readableColor(zinc[300]),
    DEFAULT: zinc[300],
  },
  primary: {
    ...swapColorValues(fuchsia),
    foreground: readableColor(blue[500]),
    DEFAULT: blue[500],
  },
  secondary: {
    ...swapColorValues(purple),
    foreground: readableColor(purple[500]),
    DEFAULT: purple[500],
  },
  success: {
    ...swapColorValues(green),
    foreground: readableColor(green[500]),
    DEFAULT: green[500],
  },
  info: {
    ...swapColorValues(blue),
    foreground: readableColor(blue[500]),
    DEFAULT: blue[500],
  },
  warning: {
    ...swapColorValues(yellow),
    foreground: readableColor(yellow[500]),
    DEFAULT: yellow[500],
  },
  danger: {
    ...swapColorValues(red),
    foreground: white,
    DEFAULT: red[500],
  },
};

export const semanticColors = {
  light: lightTheme,
  dark: darkTheme,
};
