import { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../../../packages/components/**/stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-essentials"],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
  },

  features: {
    storyStoreV7: true,
  },

  docs: {
    autodocs: true
  }
};

export default config;
