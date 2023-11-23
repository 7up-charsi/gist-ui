import React, { useState } from "react";
import { Preview } from "@storybook/react";
import "./style.css";

const preview: Preview = {
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => {
      const [isLight, setIsLight] = useState(true);

      return (
        <div
          className={`${
            isLight ? "light" : "dark"
          } relative group/theme data-[theme=light]:bg-white data-[theme=dark]:bg-[#333] p-3`}
          data-theme={isLight ? "light" : "dark"}
        >
          <button
            type="button"
            className="absolute top-5 right-5 border-2 px-4 py-1 rounded-md bg-slate-200 z-[9999999]"
            onClick={() => {
              setIsLight((p) => !p);
            }}
          >
            {isLight ? "light" : "dark"}
          </button>

          <Story />
        </div>
      );
    },
  ],
};

export default preview;
