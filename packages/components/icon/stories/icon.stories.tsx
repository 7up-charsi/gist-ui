import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { icon } from "@gist-ui/theme";

import { Icon, IconProps } from "../src";

const meta: Meta<IconProps> = {
  title: "Components/Icon",
  component: Icon,
  args: icon.defaultVariants,
};

export default meta;

const Template = (args: IconProps) => <Icon {...args} />;

export const Default: StoryObj<IconProps> = {
  render: Template,
};
