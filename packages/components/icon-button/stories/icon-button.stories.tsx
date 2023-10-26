import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { iconButton } from "@gist-ui/theme";

import { IconButton, IconButtonProps } from "../src";
import { Icon } from "@gist-ui/icon";

const meta: Meta<IconButtonProps> = {
  title: "Components/IconButton",
  component: IconButton,
  args: iconButton.defaultVariants,
  argTypes: {
    variant: {
      control: { type: "select" },
      options: Object.keys(iconButton.variants.variant),
    },
  },
};

export default meta;

const Template = (args: IconButtonProps) => <IconButton {...args} />;

export const Default: StoryObj<IconButtonProps> = {
  render: Template,
  args: {
    children: (
      <Icon>
        <svg aria-hidden="true" fill="none" viewBox="0 0 20 21">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 3.464V1.1m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175C17 15.4 17 16 16.462 16H3.538C3 16 3 15.4 3 14.807c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 10 3.464ZM1.866 8.832a8.458 8.458 0 0 1 2.252-5.714m14.016 5.714a8.458 8.458 0 0 0-2.252-5.714M6.54 16a3.48 3.48 0 0 0 6.92 0H6.54Z"
          />
        </svg>
      </Icon>
    ),
  },
};

export const Size: StoryObj<IconButtonProps> = {
  render: (args) => (
    <div className="flex gap-4 items-center">
      <IconButton {...args} size="sm" />
      <IconButton {...args} size="md" />
      <IconButton {...args} size="lg" />
    </div>
  ),
  args: {
    size: undefined,
    children: (
      <Icon>
        <svg aria-hidden="true" fill="none" viewBox="0 0 20 21">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 3.464V1.1m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175C17 15.4 17 16 16.462 16H3.538C3 16 3 15.4 3 14.807c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 10 3.464ZM1.866 8.832a8.458 8.458 0 0 1 2.252-5.714m14.016 5.714a8.458 8.458 0 0 0-2.252-5.714M6.54 16a3.48 3.48 0 0 0 6.92 0H6.54Z"
          />
        </svg>
      </Icon>
    ),
  },
};
