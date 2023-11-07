import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { input } from "@gist-ui/theme";
import { Icon } from "@gist-ui/icon";
import { Button } from "@gist-ui/button";

import { Input, InputProps } from "../src";

const meta: Meta<InputProps> = {
  title: "Components/Input",
  component: Input,
  args: { ...input.defaultVariants, placeholder: "" },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: Object.keys(input.variants.variant),
    },
    labelPlacement: {
      name: "label placement",
      control: { type: "select" },
      options: Object.keys(input.variants.labelPlacement),
    },
  },
};

export default meta;

const Template = (args: InputProps) => <Input {...args} />;

export const Default: StoryObj<InputProps> = {
  render: (args) => (
    <Template
      {...args}
      endContent={
        <Button size="sm" variant="text" rounded="full" className="data-[hovered=true]:bg-white">
          show all
        </Button>
      }
      startContent={
        <Icon>
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m7 10 2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </Icon>
      }
    />
  ),
  args: {
    helperText: "helper text",
    errorMessage: "error message",
    label: "label",
    error: false,
    required: true,
    hideLabel: false,
  },
};
