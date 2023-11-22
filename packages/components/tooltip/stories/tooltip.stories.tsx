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
    trigger: {
      control: "select",
      options: ["none", "focus", "hover"],
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

const Template = (args: Tooltip.RootProps & Tooltip.ContentProps) => (
  <div className="h-[300vh] flex items-center justify-center">
    <Tooltip.Root
      color={args.color}
      defaultOpen={args.defaultOpen}
      hideDelay={args.hideDelay}
      rounded={args.rounded}
      showDelay={args.showDelay}
      trigger={args.trigger}
    >
      <Tooltip.Trigger>
        <button className="p-10 border">button</button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          arrow={args.arrow}
          arrowPadding={args.arrowPadding}
          disableInteractive={args.disableInteractive}
          offsetAlignmentAxis={args.offsetAlignmentAxis}
          offsetMainAxis={args.offsetMainAxis}
          shiftOffset={args.shiftOffset}
          placement={args.placement}
        >
          i am tooltip content
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </div>
);

export const Default: StoryObj<Tooltip.RootProps & Tooltip.ContentProps> = {
  render: Template,
  args: {
    defaultOpen: true,
    placement: "top-start",
    showDelay: 100,
    hideDelay: 300,
    offsetMainAxis: 10,
    offsetAlignmentAxis: 5,
    shiftOffset: 10,
    arrowPadding: 10,
    disableInteractive: false,
    arrow: true,
  },
};
