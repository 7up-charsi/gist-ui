import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { input } from "@front-ui/theme";

import { Input, InputProps } from "../src";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  args: input.defaultVariants,
  argTypes: {
    labelPlacement: {
      control: { type: "select" },
      options: ["inside", "outsideTop", "outsideLeft"],
    },
  },
};

export default meta;

const Template = (args: InputProps) => <Input {...args} />;

export const Default: StoryObj<InputProps> = {
  render: (args) => (
    <div className="flex gap-2 items-end flex-wrap">
      {(["inside", "outsideLeft", "outsideTop"] as const).map((lp) => (
        <Template key={lp} {...args} labelPlacement={lp} />
      ))}
    </div>
  ),
  args: {
    type: "text",
    label: "first name",
  },
};
