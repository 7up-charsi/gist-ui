import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { select } from '@gist-ui/theme';
import InputStoryMeta from '@gist-ui/input/stories/input.stories';

import { Autocomplete, AutocompleteProps } from '../src';

const meta: Meta = {
  title: 'Components/Autocomplete',
  component: Autocomplete,
  args: {
    ...select.defaultVariants,
    ...InputStoryMeta.args,
  },
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
  id: i,
  value: i,
}));

type Option = (typeof options)[number];

const SingleTemplate = (args: AutocompleteProps<false, Option>) => (
  <Autocomplete
    label="single select"
    {...args}
    options={options}
    getOptionDisabled={(option) =>
      option.label.startsWith('1 c') ||
      option.label.startsWith('10') ||
      option.label.startsWith('15')
    }
    defaultValue={options[2]}
  />
);

export const Single: StoryObj<AutocompleteProps<false, Option>> = {
  render: SingleTemplate,
};
