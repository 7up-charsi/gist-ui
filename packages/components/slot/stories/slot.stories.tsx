import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { slot } from "@gist-ui/theme";

import { Slot, SlotProps } from "../src";

const meta: Meta<SlotProps> = {
  title: "Components/Slot",
  component: Slot,
  args: slot.defaultVariants,
};

export default meta;

const Template = (args: SlotProps) => <Slot {...args} />;

export const Default: StoryObj<SlotProps> = {
  render: Template,
};
