import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { input } from "@gist-ui/theme";

import { Input, InputProps } from "../src";

const meta: Meta<InputProps> = {
  title: "Components/Input",
  component: Input,
  args: { ...input.defaultVariants, placeholder: "" },
  argTypes: {
    labelPlacement: {
      name: "label placement",
      control: { type: "select" },
      options: [
        "inside-left",
        "inside-top",
        "inside-right",
        "outside-left",
        "outside-top",
        "outside-right",
      ],
    },
  },
};

export default meta;

const Template = (args: InputProps) => <Input {...args} />;

export const Default: StoryObj<InputProps> = {
  render: (args) => (
    <div className="w-full h-screen flex items-center justify-center">
      <Template {...args} />
    </div>
  ),
  args: {
    description: "Consectetur elit sint incididunt sunt.",
    label: "label",
    defaultValue: "JFGYUR:yytyty3887",
  },
};
