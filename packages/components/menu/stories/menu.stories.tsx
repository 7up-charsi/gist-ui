import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { menu } from '@gist-ui/theme';

import * as Menu from '../src';

const meta: Meta = {
  title: 'Components/Menu',
  args: menu.defaultVariants,
};

export default meta;

const Template = (args) => (
  <Menu.Root {...args}>
    <Menu.Trigger>
      <button>open menu</button>
    </Menu.Trigger>
  </Menu.Root>
);

export const Default: StoryObj = {
  render: Template,
};
