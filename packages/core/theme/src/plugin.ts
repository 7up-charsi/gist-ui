import plugin from "tailwindcss/plugin";
import omit from "lodash.omit";
import kebabCase from "lodash.kebabcase";
import deepmerge from "deepmerge";
import Color from "color";
import { semanticColors } from "./semantic";
import { flattenThemeObject } from "./utils/object";
import { ConfigTheme, ConfigThemes, DefaultThemeType, GistuiConfig } from "./types";
import { defaultLayout, lightLayout, darkLayout } from "./layout";

const corePlugin = (themes: ConfigThemes = {}, defaultTheme: DefaultThemeType) => {
  const variants: { name: string; definition: string[] }[] = [];
  const utilities: Record<string, Record<string, unknown>> = {};
  const colorObject: Record<string, string> = {};
  const layoutObject: Record<string, Record<string, string>> = {};

  Object.entries(themes).forEach(([themeName, { extend, colors, layout }]) => {
    let selector = `.${themeName} ,[data-theme="${themeName}"]`;
    const scheme = themeName === "light" || themeName === "dark" ? themeName : extend;

    if (themeName === defaultTheme) {
      selector = `:root,${selector}`;
    }

    utilities[selector] = scheme ? { "color-scheme": scheme } : {};

    variants.push({
      name: themeName,
      definition: [`&.${themeName}`, `&[data-theme='${themeName}']`],
    });

    const flatColors = flattenThemeObject(colors);

    Object.entries(flatColors).forEach(([name, value]) => {
      colorObject[name] = `rgb(var(--${name}) / <alpha-value>)`;
      utilities[selector][`--${name}`] = Color(value).rgb().array().join(" ");
    });

    Object.entries(layout || {}).forEach(([key, value]) => {
      layoutObject[key] = {};
      const kebabCaseKey = kebabCase(key);

      if (typeof value === "object") {
        Object.entries(value).forEach(([k, value]) => {
          const variable = `--${kebabCaseKey}-${k}`;

          layoutObject[key][k] = `var(${variable})`;
          utilities[selector][variable] = value;
        });
      } else {
        const variable = `--${kebabCaseKey}`;

        layoutObject[key].DEFAULT = `var(${variable})`;
        utilities[selector][variable] = value;
      }
    });
  });

  return plugin(
    ({ addUtilities, addVariant, addBase }) => {
      addBase({
        'input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button':
          {
            "-webkit-appearance": "none",
            margin: "px",
          },
        'input[type="number"]': {
          "-moz-appearance": "textfield",
        },
      });

      addUtilities({
        // other utilities
        ".disabled": {
          opacity: "0.5",
          pointerEvents: "none",
        },
        ".border-test": {
          border: "1px solid red",
        },

        // theme utilities
        ...utilities,
      });

      // other variants
      addVariant("svg", "&>svg");

      // theme variants
      variants.forEach(({ name, definition }) => {
        addVariant(name, definition);
      });
    },
    {
      theme: {
        extend: {
          ...layoutObject,
          colors: {
            ...colorObject,
          },
        },
      },
    },
  );
};

export const gistui = (config: GistuiConfig) => {
  const {
    themes: userThemes = {},
    layout: userLayout = {},
    defaultExtendTheme = "light",
    defaultTheme = "light",
  } = config || {};
  if (userThemes && typeof userThemes !== "object")
    throw new TypeError("Gistui plugin: themes must be object");

  if (userLayout && typeof userLayout !== "object")
    throw new TypeError("Gistui plugin: layout must be object");

  const userLightTheme = userThemes?.light?.colors || {};
  const userDarkTheme = userThemes?.dark?.colors || {};

  const defaultLayoutObj = deepmerge(defaultLayout, userLayout);

  const baseLayouts = {
    light: {
      ...defaultLayout,
      ...lightLayout,
    },
    dark: {
      ...defaultLayoutObj,
      ...darkLayout,
    },
  };

  const otherThemes = omit(userThemes, "light", "dark") || {};

  Object.entries(otherThemes).forEach(([themeName, { extend, colors, layout }]) => {
    const baseTheme = extend === "light" || extend === "dark" ? extend : defaultExtendTheme;

    if (colors && typeof colors === "object") {
      otherThemes[themeName].colors = deepmerge(semanticColors[baseTheme], colors);
    }

    if (layout && typeof layout === "object") {
      otherThemes[themeName].layout = deepmerge(
        extend ? baseLayouts[extend] : defaultLayoutObj,
        layout,
      );
    }
  });

  const lightTheme: ConfigTheme = {
    colors: deepmerge(semanticColors.light, userLightTheme),
    layout: deepmerge(baseLayouts.light, userThemes.light?.layout || {}),
  };

  const darkTheme: ConfigTheme = {
    colors: deepmerge(semanticColors.dark, userDarkTheme),
    layout: deepmerge(baseLayouts.dark, userThemes.dark?.layout || {}),
  };

  const themes = {
    light: lightTheme,
    dark: darkTheme,
    ...otherThemes,
  };

  return corePlugin(themes, defaultTheme);
};
