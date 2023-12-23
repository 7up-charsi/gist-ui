import React, { useEffect, useRef, useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { tooltip } from '@gist-ui/theme';

import * as Tooltip from '../src';

const meta: Meta = {
  title: 'Components/Tooltip',
  args: tooltip.defaultVariants,
  argTypes: {
    color: {
      control: 'select',
      options: Object.keys(tooltip.variants.color),
    },
    rounded: {
      control: 'select',
      options: Object.keys(tooltip.variants.rounded),
    },
    trigger: {
      control: 'select',
      options: ['none', 'focus', 'hover'],
    },
    placement: {
      control: 'select',
      options: [
        'top',
        'right',
        'bottom',
        'left',
        'top-start',
        'top-end',
        'right-start',
        'right-end',
        'bottom-start',
        'bottom-end',
        'left-start',
        'left-end',
      ],
    },
  },
};

export default meta;

const Template = (args: Tooltip.RootProps & Tooltip.ContentProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(true);

  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: 'instant',
      block: 'center',
      inline: 'center',
    });
  }, []);

  return (
    <div className="w-[300vw] h-[300vh] flex items-center justify-center">
      <div ref={ref} className="flex items-center justify-center gap-4">
        {Array.from({ length: 4 }).map((_ele, i) => (
          <Tooltip.Root
            key={i}
            isOpen={i === 0 ? open : undefined}
            onOpenChange={i === 0 ? setOpen : undefined}
            hideDelay={args.hideDelay}
            showDelay={args.showDelay}
            trigger={args.trigger}
          >
            <Tooltip.Trigger>
              <button className="p-10 border">button</button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                color={args.color}
                rounded={args.rounded}
                disableInteractive={args.disableInteractive}
              >
                i am tooltip
                <Tooltip.Arrow width={7} height={5} />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        ))}
      </div>
    </div>
  );
};

export const Default: StoryObj<Tooltip.RootProps & Tooltip.ContentProps> = {
  render: Template,
  args: {
    showDelay: 100,
    hideDelay: 1000,
    disableInteractive: false,
    alignOffset: 0,
    mainOffset: 0,
    arrowPadding: 10,
    hideWhenDetached: true,
    boundaryPadding: 0,
    sticky: 'partial',
    placement: 'bottom',
    arrow: true,
    allowMainAxisFlip: true,
    allowCrossAxisFlip: true,
  },
};
