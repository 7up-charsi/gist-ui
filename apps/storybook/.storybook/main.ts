import { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../../../packages/components/**/stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  framework: "@storybook/react-vite",
  core: {
    builder: "@storybook/builder-vite",
  },
  features: {
    storyStoreV7: true,
  },
};

export default config;
