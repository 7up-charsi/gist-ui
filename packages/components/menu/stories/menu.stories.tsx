import React, { useEffect, useRef } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { menu } from '@gist-ui/theme';
import { Button } from '@gist-ui/button';

import * as Menu from '../src';

const meta: Meta = {
  title: 'Components/Menu',
  args: menu.defaultVariants,
};

export default meta;

const Template = (args) => {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: 'instant',
      block: 'center',
      inline: 'center',
    });
  }, []);

  return (
    <div className="h-[300vh] w-[300vw] flex items-center justify-center">
      <Menu.Root defaultOpen {...args}>
        <Menu.Trigger>
          <Button ref={ref}>open menu</Button>
        </Menu.Trigger>

        <Menu.Portal>
          <Menu.Menu>
            <Menu.Arrow />

            <Menu.Group label="tools">
              <Menu.MenuItem onPress={() => console.log('item 1')}>
                item 1
              </Menu.MenuItem>

              <Menu.MenuItem onPress={() => console.log('item 2')}>
                item 2
              </Menu.MenuItem>
              <Menu.MenuItem onPress={() => console.log('item 3')}>
                item 3
              </Menu.MenuItem>
              <Menu.MenuItem onPress={() => console.log('item 4')}>
                item 4
              </Menu.MenuItem>
            </Menu.Group>

            <Menu.Separator />

            <Menu.Group label="advance">
              <Menu.MenuItemCheckbox>item long content</Menu.MenuItemCheckbox>
              <Menu.MenuItemCheckbox>item long content</Menu.MenuItemCheckbox>
              <Menu.MenuItemCheckbox>item long content</Menu.MenuItemCheckbox>
              <Menu.MenuItemCheckbox>item long content</Menu.MenuItemCheckbox>
            </Menu.Group>
          </Menu.Menu>
        </Menu.Portal>
      </Menu.Root>
    </div>
  );
};

export const Default: StoryObj = {
  render: Template,
};
