import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { tooltip } from "@gist-ui/theme";

import { Tooltip, TooltipProps } from "../src";

const meta: Meta<TooltipProps> = {
  title: "Components/Tooltip",
  component: Tooltip,
  args: tooltip.defaultVariants,
};

export default meta;

const Template = (args: TooltipProps) => <Tooltip {...args} />;

export const Default: StoryObj<TooltipProps> = {
  render: (args) => (
    <div className="h-[300vh] w-[300vw] flex items-center justify-center">
      <Template {...args} />
    </div>
  ),
  args: {
    children: <button>button</button>,
    title: "i'm tooltip text content",
    disableInteractive: false,
    showDelay: 100,
    hideDelay: 300,
    defaultOpen: true,
  },
};
