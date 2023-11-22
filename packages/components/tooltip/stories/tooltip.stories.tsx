import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { tooltip } from "@gist-ui/theme";

import * as Tooltip from "../src";

const meta: Meta = {
  title: "Components/Tooltip",
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
    showDelay: { control: "number" },
    hideDelay: { control: "number" },
    disableInteractive: { control: "boolean" },
    arrow: { control: "boolean" },
  },
};

export default meta;

const Template = (args: Tooltip.RootProps & Tooltip.ContentProps) => (
  <div className="h-[300vh] flex items-center justify-center">
    <Tooltip.Root {...args}>
      <Tooltip.Trigger>
        <button className="p-10 border">button</button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content>i am tooltip content</Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </div>
);

export const Default: StoryObj<Tooltip.RootProps & Tooltip.ContentProps> = {
  render: Template,
  args: {
    defaultOpen: true,
    placement: "top-start",
  },
};
