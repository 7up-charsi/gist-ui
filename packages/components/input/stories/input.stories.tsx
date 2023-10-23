import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { input } from "@gist-ui/theme";
import { Icon } from "@gist-ui/icon";

import { Input, InputProps } from "../src";

const meta: Meta<InputProps> = {
  title: "Components/Input",
  component: Input,
  args: { ...input.defaultVariants, placeholder: "" },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["flat", "border", "underline"],
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
    <div className="w-full h-screen flex items-center justify-center">
      <Template
        {...args}
        chips={Array.from({ length: args.chips as number }).map((_, i) => (
          <div
            key={i}
            style={{ width: Math.random() * (20 + i) + 20 }}
            className="h-5 rounded-medium flex items-center justify-center bg-neutral-7"
          >
            {i + 1}
          </div>
        ))}
      />
    </div>
  ),
  args: {
    description: "Consectetur elit sint incididunt sunt.",
    label: "label",
    chips: 0,
    startContent: (
      <Icon>
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m7 10 2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </Icon>
    ),
    endContent: (
      <Icon>
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 20">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10.335 6.514 6.91 1.464a1.122 1.122 0 0 0-1.818 0l-3.426 5.05a.988.988 0 0 0 .91 1.511h6.851a.988.988 0 0 0 .91-1.511Zm-8.67 6.972 3.426 5.05a1.121 1.121 0 0 0 1.818 0l3.426-5.05a.988.988 0 0 0-.909-1.511H2.574a.987.987 0 0 0-.909 1.511Z"
          />
        </svg>
      </Icon>
    ),
  },
};
