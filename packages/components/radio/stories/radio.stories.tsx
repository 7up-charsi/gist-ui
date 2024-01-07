import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { radio } from '@gist-ui/theme';

import * as Radio from '../src';

const meta: Meta = {
  title: 'Components/Radio',
  args: radio.defaultVariants,
  argTypes: {
    labelPlacement: {
      control: 'select',
      options: Object.keys(radio.variants.labelPlacement),
    },
    color: {
      control: 'select',
      options: Object.keys(radio.variants.color),
    },
    size: {
      control: 'select',
      options: Object.keys(radio.variants.size),
    },
  },
};

export default meta;

const Template = (args) => (
  <Radio.Group name="radio-group">
    <Radio.Radio {...args} value="radio 1" label="radio 1" />
    <Radio.Radio {...args} value="radio 2" label="radio 2" />
    <Radio.Radio {...args} value="radio 3" label="radio 3" />
  </Radio.Group>
);

export const Default: StoryObj = {
  render: Template,
};
