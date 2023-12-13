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

const DefaultTemplate = (args: SelectProps) => (
  <Select
    {...args}
    label="select"
    options={options}
    getOptionDisabled={(option) =>
      typeof option === "string"
        ? false
        : option.value === "option 1" ||
          option.value === "option 15" ||
          option.value === "option 10"
    }
    defaultValue={options[2]}
    getOptionLabel={(option) => `${option.label} very long label too much`}
  />
);

export const Default: StoryObj<SelectProps> = {
  render: DefaultTemplate,
};

const CustomOptionTemplate = (args: SelectProps) => (
  <Select
    {...args}
    label="select"
    options={options}
    getOptionDisabled={(option) =>
      typeof option === "string"
        ? false
        : option.value === "option 1" ||
          option.value === "option 15" ||
          option.value === "option 10"
    }
    defaultValue={options[2]}
    getOptionLabel={(option) => `${option.label} very long label too much`}
    renderOption={({ label, state }) => {
      return (
        <div>
          <input type="checkbox" checked={state.isSelected} />
          <span className="ml-2 truncate">{label}</span>
        </div>
      );
    }}
  />
);

export const CustomOption: StoryObj<SelectProps> = {
  render: CustomOptionTemplate,
};
