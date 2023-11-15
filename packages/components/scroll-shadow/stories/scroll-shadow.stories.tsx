import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { scrollShadow } from "@gist-ui/theme";

import { ScrollShadow, ScrollShadowProps } from "../src";

const meta: Meta<ScrollShadowProps> = {
  title: "Components/ScrollShadow",
  component: ScrollShadow,
  args: scrollShadow.defaultVariants,
};

export default meta;

const Template = (args: ScrollShadowProps) => <ScrollShadow {...args} />;

export const Default: StoryObj<ScrollShadowProps> = {
  render: Template,
};
