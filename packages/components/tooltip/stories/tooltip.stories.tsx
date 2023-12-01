import React, { useEffect, useRef } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { tooltip } from "@gist-ui/theme";

import * as Tooltip from "../src";

const meta: Meta = {
  title: "Components/Tooltip",
  args: tooltip.defaultVariants,
  argTypes: {
    color: {
      control: "select",
      options: Object.keys(tooltip.variants.color),
    },
    rounded: {
      control: "select",
      options: Object.keys(tooltip.variants.rounded),
    },
    trigger: {
      control: "select",
      options: ["none", "focus", "hover"],
    },
    placement: {
      control: "select",
      options: [
        "top",
        "right",
        "bottom",
        "left",
        "top-start",
        "top-end",
        "right-start",
        "right-end",
        "bottom-start",
        "bottom-end",
        "left-start",
        "left-end",
      ],
    },
  },
};

export default meta;

const Template = (args: Tooltip.RootProps & Tooltip.ContentProps) => {
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
      <Tooltip.Root
        defaultOpen={args.defaultOpen}
        hideDelay={args.hideDelay}
        showDelay={args.showDelay}
        trigger={args.trigger}
      >
        <Tooltip.Trigger>
          <button ref={ref} className="p-10 border">
            button
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            color={args.color}
            rounded={args.rounded}
            disableInteractive={args.disableInteractive}
          >
            i am tooltip content
            <Tooltip.Arrow width={7} height={5} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </div>
  );
};

export const Default: StoryObj<Tooltip.RootProps & Tooltip.ContentProps> = {
  render: Template,
  args: {
    defaultOpen: true,
    showDelay: 100,
    hideDelay: 300,
    disableInteractive: false,
  },
};
