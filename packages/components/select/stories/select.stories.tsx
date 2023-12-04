import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { select } from "@gist-ui/theme";

import { Select, SelectProps } from "../src";

const meta: Meta<SelectProps> = {
  title: "Components/Select",
  component: Select,
  args: select.defaultVariants,
};

export default meta;

const Template = (args: SelectProps) => (
  <Select
    {...args}
    label="select"
    options={[
      ...Array.from({ length: 5 }).map((_ele, i) => `option ${i + 1}`),
      ...Array.from({ length: 5 }).map((_ele, i) => ({
        label: `custom label ${i + 1}`,
        value: `option ${i + 1}`,
      })),
      ...Array.from({ length: 5 }).map((_ele, i) => `option ${i + 1}`),
    ]}
  />
);

export const Default: StoryObj<SelectProps> = {
  render: Template,
};
