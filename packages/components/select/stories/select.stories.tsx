import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { select } from '@gist-ui/theme';
import InputStoryMeta from '@gist-ui/input/stories/input.stories';

import { Select, SelectProps } from '../src';

const meta: Meta = {
  title: 'Components/Select',
  component: Select,
  args: { ...select.defaultVariants, ...InputStoryMeta.args },
  argTypes: {
    ...InputStoryMeta.argTypes,
    shadow: {
      control: { type: 'select' },
      options: Object.keys(select.variants.shadow),
    },
  },
};

export default meta;

const options = Array.from({ length: 15 }).map((_ele, i) => ({
  label: i === 6 ? `6 test` : `${i + 1} custom label`,
}));

const DefaultTemplate = (args: SelectProps<true>) => (
  <Select
    {...args}
    multiple
    label="select"
    options={options}
    getOptionDisabled={(option) =>
      option.label.startsWith('1 c') ||
      option.label.startsWith('10') ||
      option.label.startsWith('15')
    }
    defaultValue={[options[2]]}
  />
);

export const Default: StoryObj<SelectProps<true>> = {
  render: DefaultTemplate,
};
