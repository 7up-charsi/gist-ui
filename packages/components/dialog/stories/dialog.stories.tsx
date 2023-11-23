import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { dialog } from "@gist-ui/theme";
import { Button } from "@gist-ui/button";

import * as Dialog from "../src";

const meta: Meta = {
  title: "Components/Dialog",
};

export default meta;

const DialogTemplate = (args) => {
  const styles = dialog({});

  return (
    <Dialog.Root {...args}>
      <Dialog.Trigger>
        <button>open dialog</button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <div className={styles.backdrop()} />

        <div className={styles.container()}>
          <Dialog.Content>
            <div className={styles.base()}>
              <div className={styles.header()}>header</div>

              <div className={styles.body()}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste natus dolores
                similique accusantium est esse, illo fugiat aut sequi ipsum magnam laborum provident
                delectus quaerat reprehenderit nihil porro ratione cupiditate ipsam nam odio animi
                blanditiis nobis nisi! id
              </div>

              <div className={styles.footer()}>
                <Dialog.Trigger close>
                  <Button variant="text" color="danger">
                    Close
                  </Button>
                </Dialog.Trigger>

                <Button color="success">Agree</Button>
              </div>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export const Default: StoryObj = {
  render: DialogTemplate,
  args: {
    defaultOpen: true,
    modal: true,
  },
};
