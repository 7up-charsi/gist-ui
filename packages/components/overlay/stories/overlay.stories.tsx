import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { overlay } from "@gist-ui/theme";

import { Overlay, OverlayProps } from "../src";

const meta: Meta<OverlayProps> = {
  title: "Components/Overlay",
  component: Overlay,
  args: overlay.defaultVariants,
};

export default meta;

const Template = (args: OverlayProps) => <Overlay {...args} />;

export const Default: StoryObj<OverlayProps> = {
  render: Template,
};
