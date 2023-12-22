import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { input } from "@gist-ui/theme";

import {
  NumberInput,
  NumberInputProps,
  PasswordInput,
  PasswordInputProps,
  Input as InputComp,
  InputProps,
} from "../src";

const meta: Meta = {
  title: "Components/Input",
  args: {
    ...input.defaultVariants,
    placeholder: "",
    helperText: "helper text",
    errorMessage: "error message",
    label: "label",
    error: false,
    required: true,
    hideLabel: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: Object.keys(input.variants.variant),
    },
    color: {
      control: { type: "select" },
      options: Object.keys(input.variants.color),
      if: { arg: "color", exists: true },
    },
    size: {
      control: { type: "select" },
      options: Object.keys(input.variants.size),
      if: { arg: "size", exists: true },
    },
    fullWidth: {
      control: { type: "boolean" },
      if: { arg: "fullWidth", exists: true },
      name: "full width",
    },
    labelPlacement: {
      name: "label placement",
      control: "select",
      options: Object.keys(input.variants.labelPlacement),
    },
  },
};

export default meta;

const InputTemplate = (args: InputProps) => <InputComp {...args} />;

export const Input: StoryObj<InputProps> = {
  render: InputTemplate,
};

const PasswordTemplate = (args: PasswordInputProps) => (
  <PasswordInput {...args} />
);

export const Password: StoryObj<PasswordInputProps> = {
  render: PasswordTemplate,
};

const NumberTemplate = (args: NumberInputProps) => <NumberInput {...args} />;

export const Number: StoryObj<NumberInputProps> = {
  render: NumberTemplate,
  argTypes: {
    min: { control: "number" },
    max: { control: "number" },
  },
  args: {
    step: 1,
    largeStep: 5,
  },
};
