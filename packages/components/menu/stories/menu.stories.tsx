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
    <div className="h-[200vh] w-[200vw] flex items-center justify-center">
      <Menu.Root defaultOpen {...args}>
        <Menu.Trigger>
          <Button ref={ref}>open menu</Button>
        </Menu.Trigger>

        <Menu.Portal>
          <Menu.Content>
            <Menu.Arrow />

            <Menu.Group title="active">
              <Menu.Item onPress={() => console.log('item 1')}>
                item 1
              </Menu.Item>
            </Menu.Group>

            <Menu.Separator />

            <Menu.Group title="inactive">
              <Menu.Item onPress={() => console.log('item 2')}>
                item 2
              </Menu.Item>
              <Menu.Item onPress={() => console.log('item 3')}>
                item 3
              </Menu.Item>
              <Menu.Item onPress={() => console.log('item 4')}>
                item 4
              </Menu.Item>
            </Menu.Group>

            <Menu.Separator />

            <Menu.Item onPress={() => console.log('item 5')}>
              item 5 long content
            </Menu.Item>
          </Menu.Content>
        </Menu.Portal>
      </Menu.Root>
    </div>
  );
};

export const Default: StoryObj = {
  render: Template,
};
