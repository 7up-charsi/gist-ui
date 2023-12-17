import plugin from "tailwindcss/plugin";
import kebabCase from "lodash.kebabcase";
import deepmerge from "deepmerge";
import Color from "color";
import { GistUiError } from "@gist-ui/error";
import { semanticColors } from "./semantic";
import { flattenThemeObject } from "./utils/object";
import { ConfigThemes, DefaultThemeType, GistuiConfig } from "./types";
import { defaultLayout } from "./layout";

const corePlugin = (
  themes: ConfigThemes = {},
  defaultTheme: DefaultThemeType,
) => {
  const variants: { name: string; definition: string[] }[] = [];
  const utilities: Record<string, Record<string, unknown>> = {};
  const colorObject: Record<string, string> = {};
  const layoutObject: Record<string, Record<string, string>> = {};

  Object.entries(themes).forEach(([themeName, { extend, colors, layout }]) => {
    let selector = `.${themeName} ,[data-theme="${themeName}"]`;
    const scheme =
      themeName === "light" || themeName === "dark" ? themeName : extend;

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

export const gistui = ({
  themes: userThemes = {},
  defaultTheme = "light",
}: GistuiConfig = {}) => {
  //

  if (userThemes && typeof userThemes !== "object")
    throw new GistUiError("plugin", "themes must be object");

  const themes: ConfigThemes = {
    ...userThemes,
    light: {
      extend: "light",
      colors: userThemes?.light?.colors,
      layout: userThemes?.light?.layout,
    },
    dark: {
      extend: "dark",
      colors: userThemes?.dark?.colors,
      layout: userThemes?.dark?.layout,
    },
  };

  Object.entries(themes).forEach(
    ([themeName, { extend = "light", colors = {}, layout = {} }]) => {
      if (colors && typeof colors === "object") {
        themes[themeName].colors = deepmerge(semanticColors[extend], colors);
      }

      if (layout && typeof layout === "object") {
        themes[themeName].layout = deepmerge(defaultLayout, layout);
      }
    },
  );

  return corePlugin(themes, defaultTheme);
};
