import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { input } from "@gist-ui/theme";
import { Icon } from "@gist-ui/icon";
import { Button } from "@gist-ui/button";

import {
  NumberInput,
  NumberInputProps,
  PasswordInput,
  PasswordInputProps,
  TextInput,
  TextInputProps,
} from "../src";

const meta: Meta = {
  title: "Components/Input",
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

export const Text: StoryObj<TextInputProps> = {
  render: (args) => (
    <TextInput
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

export const Password: StoryObj<PasswordInputProps> = {
  render: (args) => <PasswordInput {...args} />,
  args: {
    helperText: "helper text",
    errorMessage: "error message",
    label: "label",
    error: false,
    required: true,
    hideLabel: false,
    hideToggleButton: false,
  },
};

export const Number: StoryObj<NumberInputProps> = {
  render: (args) => <NumberInput {...args} />,
  args: {
    helperText: "helper text",
    errorMessage: "error message",
    label: "label",
    error: false,
    required: true,
    hideLabel: false,
    hideButtons: false,
  },
};
