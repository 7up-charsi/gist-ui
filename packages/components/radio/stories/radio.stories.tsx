import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { radio } from '@gist-ui/theme';

import * as Radio from '../src';

const meta: Meta = {
  title: 'Components/Radio',
  args: radio.defaultVariants,
};

export default meta;

const Template = () => (
  <Radio.Group name="radio-group">
    <Radio.Radio value="radio 1" label="radio 1" />
    <Radio.Radio value="radio 2" label="radio 2" />
    <Radio.Radio value="radio 3" label="radio 3" />
  </Radio.Group>
);

export const Default: StoryObj = {
  render: Template,
};
