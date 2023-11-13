import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { dialog } from "@gist-ui/theme";

import { Dialog, DialogProps } from "../src";
import { DialogClose } from "../src/dialog";

const meta: Meta<DialogProps> = {
  title: "Components/Dialog",
  component: Dialog,
  args: dialog.defaultVariants,
  argTypes: {
    backdrop: {
      control: "select",
      options: Object.keys(dialog.variants.backdrop),
    },
    scrollBehavior: {
      control: "select",
      options: Object.keys(dialog.variants.scrollBehavior),
    },
    placement: {
      control: "select",
      options: Object.keys(dialog.variants.placement),
    },
    shadow: {
      control: "select",
      options: Object.keys(dialog.variants.shadow),
    },
  },
};

export default meta;

const Template = (args: DialogProps) => <Dialog {...args} />;

export const Default: StoryObj<DialogProps> = {
  render: Template,
  args: {
    defaultOpen: true,
    trigger: <button>open dialog</button>,
    header: "nice dialog",
    body: (
      <>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste natus dolores similique
        accusantium est esse, illo fugiat aut sequi ipsum magnam laborum provident delectus quaerat
        reprehenderit nihil porro ratione cupiditate ipsam nam odio animi blanditiis nobis nisi! id
        possimus, dicta laboriosam reprehenderit quasi aut fugit. Quidem fugit ut nemo rem expedita
        ullam animi explicabo maiores obcaecati excepturi debitis at, consequuntur mollitia?
        Asperiores laudantium quis exercitationem autem qui ex at sit commodi quo. Aspernatur
        commodi placeat ipsum at neque?
      </>
    ),
    footer: (
      <DialogClose>
        <button>close me...</button>
      </DialogClose>
    ),
  },
};
