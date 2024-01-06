import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { switch as _switch } from '@gist-ui/theme';

import { Switch, SwitchProps } from '../src';

const meta: Meta<SwitchProps> = {
  title: 'Components/Switch',
  component: Switch,
  args: _switch.defaultVariants,
};

export default meta;

const Template = (args: SwitchProps) => <Switch {...args} />;

export const Default: StoryObj<SwitchProps> = {
  render: Template,
};
