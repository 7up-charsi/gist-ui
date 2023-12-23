import type { ThemeColors, SemanticBaseColors } from './types';
import { swapColorValues } from './utils/object';
import {
  zinc,
  emerald,
  amber,
  red,
  blue,
  sky,
  neutral,
} from 'tailwindcss/colors';

const primary = {
  '50': '#faf5ff',
  '100': '#f2e8ff',
  '200': '#e7d4ff',
  '300': '#d4b3ff',
  '400': '#ba83fd',
  '500': '#a053f9',
  '600': '#8a31ec',
  '700': '#7520d0',
  '800': '#641faa',
  '900': '#531b88',
  '950': '#360665',
};

const secondary = {
  '50': '#fdf3ff',
  '100': '#fae7ff',
  '200': '#f4ceff',
  '300': '#f0a7ff',
  '400': '#e97aff',
  '500': '#d93ef7',
  '600': '#c01edb',
  '700': '#a315b6',
  '800': '#871395',
  '900': '#711679',
  '950': '#4a0151',
};

const base: SemanticBaseColors = {
  light: {
    background: {
      DEFAULT: '#FFFFFF',
    },
    foreground: {
      ...zinc,
      DEFAULT: '#11181C',
    },
    divider: {
      DEFAULT: 'rgba(17, 17, 17, 0.15)',
    },
    focus: {
      DEFAULT: sky[500],
    },
    overlay: {
      DEFAULT: '#000000',
    },
    content1: {
      DEFAULT: '#FFFFFF',
      foreground: '#11181C',
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
      DEFAULT: '#333333',
    },
    foreground: {
      ...swapColorValues(zinc),
      DEFAULT: '#ECEDEE',
    },
    focus: {
      DEFAULT: sky[500],
    },
    overlay: {
      DEFAULT: '#000000',
    },
    divider: {
      DEFAULT: 'rgba(255, 255, 255, 0.15)',
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
  primary: {
    ...primary,
    foreground: '#ffffff',
    DEFAULT: primary[500],
  },
  secondary: {
    ...secondary,
    foreground: '#ffffff',
    DEFAULT: secondary[500],
  },
  success: {
    ...emerald,
    foreground: '#ffffff',
    DEFAULT: emerald[500],
  },
  info: {
    ...blue,
    foreground: '#ffffff',
    DEFAULT: blue[500],
  },
  warning: {
    ...amber,
    foreground: '#ffffff',
    DEFAULT: amber[500],
  },
  danger: {
    ...red,
    foreground: '#ffffff',
    DEFAULT: red[500],
  },
  neutral: {
    ...neutral,
    foreground: '#ffffff',
    DEFAULT: neutral[500],
  },
};

export const themeColorsDark: ThemeColors = {
  ...base.dark,
  primary: {
    ...swapColorValues(primary),
    foreground: '#ffffff',
    DEFAULT: primary[500],
  },
  secondary: {
    ...swapColorValues(secondary),
    foreground: '#ffffff',
    DEFAULT: secondary[500],
  },
  success: {
    ...swapColorValues(emerald),
    foreground: '#ffffff',
    DEFAULT: emerald[500],
  },
  info: {
    ...swapColorValues(blue),
    foreground: '#ffffff',
    DEFAULT: blue[500],
  },
  warning: {
    ...swapColorValues(amber),
    foreground: '#ffffff',
    DEFAULT: amber[500],
  },
  danger: {
    ...swapColorValues(red),
    foreground: '#ffffff',
    DEFAULT: red[500],
  },
  neutral: {
    ...swapColorValues(neutral),
    foreground: '#ffffff',
    DEFAULT: neutral[500],
  },
};

export const semanticColors = {
  light: themeColorsLight,
  dark: themeColorsDark,
};
