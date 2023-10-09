import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import omit from "lodash.omit";
import { button } from "@frontplus-ui/theme";

import { Button, ButtonProps } from "../src";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
};

export default meta;

const defaultProps = {
  ...button.defaultVariants,
};

const Template = (args: ButtonProps) => <Button {...args} />;

export const Default: StoryObj<ButtonProps> = {
  render: Template,
  args: {
    ...defaultProps,
  },
};

export const Size: StoryObj<ButtonProps> = {
  render: (args) => (
    <div className="flex gap-4 items-center">
      <Button {...args} size="sm">
        small
      </Button>
      <Button {...args} size="md">
        medium
      </Button>
      <Button {...args} size="lg">
        large
      </Button>
    </div>
  ),
  args: {
    ...omit(defaultProps, "size"),
  },
};
