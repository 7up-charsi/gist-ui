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

const options = Array.from({ length: 15 }).map((_ele, i) => ({
  label: `custom label ${i + 1}`,
  value: `option ${i + 1}`,
}));

const Template = (args: SelectProps) => (
  <Select
    {...args}
    label="select"
    options={options}
    getOptionDisabled={(option) =>
      typeof option === "string" ? false : option.value === "option 2"
    }
    defaultValue={options[2]}
    getOptionLabel={(option) => `${option.label} cute`}
  />
);

export const Default: StoryObj<SelectProps> = {
  render: Template,
  args: {
    defaultOpen: true,
  },
};
