import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { spinButton } from "@gist-ui/theme";

import { SpinButton, SpinButtonProps } from "../src";

const meta: Meta<SpinButtonProps> = {
  title: "Components/SpinButton",
  component: SpinButton,
  args: spinButton.defaultVariants,
};

export default meta;

const Template = (args: SpinButtonProps) => <SpinButton {...args} />;

export const Default: StoryObj<SpinButtonProps> = {
  render: Template,
};
