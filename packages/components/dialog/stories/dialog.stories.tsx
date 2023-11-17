import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { dialog } from "@gist-ui/theme";
import { Button } from "@gist-ui/button";
import { Overlay } from "@gist-ui/overlay";

import { Dialog, DialogTrigger, DialogProps, DialogContent, DialogPortal } from "../src";

const meta: Meta<DialogProps> = {
  title: "Components/Dialog",
  component: Dialog,
};

export default meta;

export const Default: StoryObj<DialogProps> = {
  render: (args) => {
    const { base, container, body, footer, header } = dialog({});

    return (
      <Dialog {...args}>
        <DialogTrigger>
          <button>open dialog</button>
        </DialogTrigger>

        <DialogPortal>
          <Overlay />

          <DialogContent classNames={{ base: base(), container: container() }}>
            <div className={header()}>header</div>

            <div className={body()}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste natus dolores similique
              accusantium est esse, illo fugiat aut sequi ipsum magnam laborum provident delectus
              quaerat reprehenderit nihil porro ratione cupiditate ipsam nam odio animi blanditiis
              nobis nisi! id
            </div>

            <div className={footer()}>
              <DialogTrigger close>
                <Button variant="text" color="danger">
                  Close
                </Button>
              </DialogTrigger>

              <Button color="success">Agree</Button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    );
  },
  args: {
    defaultOpen: true,
    modal: true,
  },
};
