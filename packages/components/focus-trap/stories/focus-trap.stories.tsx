import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import { FocusTrap, FocusTrapProps } from "../src";

const meta: Meta<FocusTrapProps> = {
  title: "Components/FocusTrap",
  component: FocusTrap,
};

export default meta;

const Template = (args: FocusTrapProps) => <FocusTrap {...args} />;

export const Default: StoryObj<FocusTrapProps> = {
  render: Template,
};
