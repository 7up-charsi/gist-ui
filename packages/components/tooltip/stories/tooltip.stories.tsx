import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { tooltip } from "@gist-ui/theme";

import { Tooltip, TooltipProps } from "../src";

const meta: Meta<TooltipProps> = {
  title: "Components/Tooltip",
  component: Tooltip,
  args: tooltip.defaultVariants,
  argTypes: {
    color: {
      control: "select",
      options: Object.keys(tooltip.variants.color),
    },
    rounded: {
      control: "select",
      options: Object.keys(tooltip.variants.rounded),
    },
    placement: {
      control: "select",
      options: [
        "top",
        "right",
        "bottom",
        "left",
        "top-start",
        "top-end",
        "right-start",
        "right-end",
        "bottom-start",
        "bottom-end",
        "left-start",
        "left-end",
      ],
    },
  },
};

export default meta;

const Template = (args: TooltipProps) => (
  <div className="h-[300vh] flex items-center justify-center">
    <Tooltip {...args}>
      <button className="p-10 border">button</button>
    </Tooltip>
  </div>
);

export const Default: StoryObj<TooltipProps> = {
  render: Template,
  args: {
    title: "i'm tooltip text content",
    disableInteractive: false,
    showDelay: 100,
    hideDelay: 300,
    defaultOpen: true,
    placement: "top-start",
  },
};
