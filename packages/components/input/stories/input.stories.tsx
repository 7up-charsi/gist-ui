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
    <div className="flex items-center justify-center w-full h-screen gap-4">
      <Template {...args} />
      <Template {...args} placeholder="placeholder" />
      <Template
        {...args}
        startContent={
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 18"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 5h9M5 9h5m8-8H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h4l3.5 4 3.5-4h5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
            />
          </svg>
        }
        endContent={
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 8v1h4V8m4 7H4a1 1 0 0 1-1-1V5h14v9a1 1 0 0 1-1 1ZM2 1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z"
            />
          </svg>
        }
      />
    </div>
  ),
  args: {
    description: "Consectetur elit sint incididunt sunt.",
    label: "label",
  },
};
