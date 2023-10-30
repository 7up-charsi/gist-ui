import plugin from "tailwindcss/plugin";
import omit from "lodash.omit";
import deepmerge from "deepmerge";
import Color from "color";
import { semanticColors } from "./colors";
import { flattenThemeObject } from "./utils/objects";
import { ConfigTheme, ConfigThemes, DefaultThemeType, GistuiConfig } from "./types";

const corePlugin = (themes: ConfigThemes = {}, defaultTheme: DefaultThemeType) => {
  const variants: { name: string; definition: string[] }[] = [];
  const utilities: Record<string, Record<string, unknown>> = {};
  const colorVariables: Record<string, string> = {};

  Object.entries(themes).forEach(([themeName, { extend, colors }]) => {
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
      colorVariables[name] = `rgb(var(--${name}) / <alpha-value>)`;
      utilities[selector][`--${name}`] = Color(value).rgb().array().join(" ");
    });
  });

  return plugin(
    ({ addUtilities, addVariant }) => {
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
          colors: {
            ...colorVariables,
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

export const gistui = (config: GistuiConfig) => {
  const { themes: userThemes, defaultExtendTheme = "light", defaultTheme = "light" } = config || {};
  if (userThemes && typeof userThemes !== "object")
    throw new TypeError("Gistui plugin: themes must be object");

  const userLightTheme = userThemes?.light?.colors || {};
  const userDarkTheme = userThemes?.dark?.colors || {};

  const otherThemes = omit(userThemes, "light", "dark") || {};

  Object.entries(otherThemes).forEach(([themeName, { extend, colors }]) => {
    const baseTheme =
      extend && (extend === "light" || extend === "dark") ? extend : defaultExtendTheme;

    if (colors && typeof colors === "object") {
      otherThemes[themeName].colors = deepmerge(semanticColors[baseTheme], colors);
    }
  });

  const lightTheme: ConfigTheme = {
    colors: deepmerge(semanticColors.light, userLightTheme),
  };

  const darkTheme: ConfigTheme = {
    colors: deepmerge(semanticColors.dark, userDarkTheme),
  };

  const themes = {
    light: lightTheme,
    darak: darkTheme,
    ...otherThemes,
  };

  return corePlugin(themes, defaultTheme);
};
