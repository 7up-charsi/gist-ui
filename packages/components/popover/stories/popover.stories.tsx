import React, { useEffect, useRef } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Button } from "@gist-ui/button";

import * as Popover from "../src";

const meta: Meta<Popover.RootProps & Popover.ContentProps> = {
  title: "Components/Popover",
  args: {
    defaultOpen: true,
  },
  argTypes: {
    placement: {
      control: "select",
      options: [
        "top",
        "right",
        "bottom",
        "left",
        "top-end",
        "top-start",
        "right-end",
        "right-start",
        "bottom-end",
        "bottom-start",
        "left-end",
        "left-start",
      ],
    },
    sticky: {
      control: "select",
      options: ["partial", "always"],
    },
  },
};

export default meta;

const Template = (args: Popover.RootProps & Popover.ContentProps) => {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: "instant",
      block: "center",
      inline: "center",
    });
  }, []);

  return (
    <div className="w-[300vw] h-[300vh] flex items-center justify-center">
      <Popover.Root defaultOpen={args.defaultOpen}>
        <Popover.Trigger>
          <Button ref={ref}>open popver</Button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            alignOffset={args.alignOffset}
            arrow={args.arrow}
            mainOffset={args.mainOffset}
            sticky={args.sticky}
            placement={args.placement}
            arrowPadding={args.arrowPadding}
            hideWhenDetached={args.hideWhenDetached}
            allowMainAxisFlip={args.allowMainAxisFlip}
            allowCrossAxisFlip={args.allowCrossAxisFlip}
          >
            <div
              aria-label="very nice label"
              className="max-w-sm w-full bg-white border shadow-lg rounded-md p-4"
            >
              {args.arrow && <Popover.Arrow />}

              <h3 className="text-lg first-letter:uppercase">nice heading</h3>

              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis aperiam facere,
                molestias eius suscipit in, est distinctio deserunt culpa odit, sunt nostrum. Ad
                culpa excepturi assumenda perferendis similique dolore qui.
              </p>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};

export const Default: StoryObj<Popover.RootProps & Popover.ContentProps> = {
  render: Template,
  args: {
    alignOffset: 0,
    mainOffset: 0,
    arrowPadding: 10,
    hideWhenDetached: true,
    boundaryPadding: 0,
    sticky: "partial",
    placement: "bottom",
    arrow: true,
    allowMainAxisFlip: true,
    allowCrossAxisFlip: true,
  },
};
