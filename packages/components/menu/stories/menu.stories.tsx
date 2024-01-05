import React, { useEffect, useRef, useState } from 'react';
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

  const [favrouite, setFavrouite] = useState(true);
  const [radioValue, setRadioValue] = useState('radio item 1');

  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: 'instant',
      block: 'nearest',
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

            <div style={{ width: 170 }}>
              <Menu.Group accessibleLabel="tools">
                <Menu.Item>item 1</Menu.Item>
                <Menu.Item isDisabled>item 2</Menu.Item>
                <Menu.Item>item 3</Menu.Item>
              </Menu.Group>

              <Menu.Separator />

              <Menu.Group accessibleLabel="checkbox">
                <Menu.CheckboxItem checked={favrouite} onChange={setFavrouite}>
                  favrouite
                </Menu.CheckboxItem>
                <Menu.CheckboxItem isDisabled checked>
                  bookmark
                </Menu.CheckboxItem>
              </Menu.Group>

              <Menu.Separator />

              <Menu.Label>Select one</Menu.Label>

              <Menu.RadioGroup
                accessibleLabel="radio"
                onChange={setRadioValue}
                value={radioValue}
              >
                <Menu.RadioItem value="radio item 1">
                  radio item 1
                </Menu.RadioItem>
                <Menu.RadioItem value="radio item 2" isDisabled>
                  radio item 2
                </Menu.RadioItem>
                <Menu.RadioItem value="radio item 3">
                  radio item 3
                </Menu.RadioItem>
              </Menu.RadioGroup>
            </div>
          </Menu.Menu>
        </Menu.Portal>
      </Menu.Root>
    </div>
  );
};

export const Default: StoryObj = {
  render: Template,
};
