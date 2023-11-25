import React from "react";
import { Preview, ReactRenderer } from "@storybook/react";
import { withThemeByClassName, withThemeByDataAttribute } from "@storybook/addon-themes";

import "./style.css";

const preview: Preview = {
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => {
      return (
        <div className="p-4">
          <Story />
        </div>
      );
    },
    withThemeByClassName<ReactRenderer>({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
    withThemeByDataAttribute<ReactRenderer>({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "light",
      attributeName: "data-theme",
    }),
  ],
};

export default preview;
