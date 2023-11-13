import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { dialog } from "@gist-ui/theme";

import { Dialog, DialogProps } from "../src";
import { DialogClose } from "../src/dialog";

const meta: Meta<DialogProps> = {
  title: "Components/Dialog",
  component: Dialog,
  args: dialog.defaultVariants,
};

export default meta;

const Template = (args: DialogProps) => <Dialog {...args} />;

export const Default: StoryObj<DialogProps> = {
  render: Template,
  args: {
    trigger: <button>open dialog</button>,
    children: (
      <>
        <span>dialog title</span>
        <div>dialog button</div>

        <DialogClose>
          <button>close me...</button>
        </DialogClose>
      </>
    ),
  },
};
