import React, { useRef } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { dialog } from "@gist-ui/theme";
import { Button } from "@gist-ui/button";

import * as Dialog from "../src";

const meta: Meta = {
  title: "Components/Dialog",
};

export default meta;

const DialogTemplate = (args: {
  defaultOpen?: boolean;
  modal?: boolean;
  keepMounted?: boolean;
}) => {
  const styles = dialog({});

  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <Dialog.Root defaultOpen={args.defaultOpen} keepMounted={args.keepMounted}>
        <Dialog.Trigger>
          <Button color="secondary">open dialog</Button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <div className={styles.backdrop()} />

          <div className={styles.container()}>
            <Dialog.Content>
              <div className={styles.base()} aria-label="very nice dialog">
                <div className={styles.header()}>header</div>

                <div className={styles.body()} ref={ref}>
                  <p className="m-3">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste natus dolores
                    similique accusantium est esse, illo fugiat aut sequi ipsum magnam laborum
                    provident delectus quaerat reprehenderit nihil porro ratione cupiditate ipsam
                    nam odio animi blanditiis nobis nisi! id
                  </p>
                  <p className="m-3">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste natus dolores
                    similique accusantium est esse, illo fugiat aut sequi ipsum magnam laborum
                    provident delectus quaerat reprehenderit nihil porro ratione cupiditate ipsam
                    nam odio animi blanditiis nobis nisi! id
                  </p>
                </div>

                <div className={styles.footer()}>
                  <Dialog.Close>
                    <Button variant="text" color="danger">
                      Close
                    </Button>
                  </Dialog.Close>

                  <Button color="success">Agree</Button>
                </div>
              </div>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>

      {Array.from({ length: 10 }).map((_, i) => (
        <p className="m-3" key={i}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero quam fuga voluptatem
          fugiat? Ullam voluptate saepe illo quidem excepturi recusandae perspiciatis nemo cumque
          incidunt deleniti corrupti quam similique beatae unde doloremque quod id aut, pariatur
          blanditiis iste repellendus a ea? Repellat quod quo unde ipsam atque molestiae, voluptas
          accusamus ex sit sapiente placeat. Iusto quasi sunt ad autem quos laborum facilis illum
          obcaecati reiciendis tempora quidem vitae at voluptatibus, recusandae dicta necessitatibus
          itaque rerum. Possimus et officiis similique enim cumque ex a voluptas ipsam? Minus vel
          quaerat, sequi labore at necessitatibus suscipit eum ducimus error eaque explicabo qui
          iure ipsa magnam facilis illum libero rem non pariatur? Perferendis ducimus ipsum dolor
          inventore
        </p>
      ))}
    </>
  );
};

export const Default: StoryObj = {
  render: DialogTemplate,
  args: {
    defaultOpen: true,
    modal: true,
    keepMounted: false,
  },
};

const NestedTemplate = (args: {
  defaultOpen?: boolean;
  modal?: boolean;
  keepMounted?: boolean;
}) => {
  const styles = dialog({});

  return (
    <Dialog.Root defaultOpen={args.defaultOpen} keepMounted={args.keepMounted}>
      <Dialog.Trigger>
        <Button color="secondary">open dialog</Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <div className={styles.backdrop()} />

        <div className={styles.container()}>
          <Dialog.Content>
            <div className={styles.base()} aria-label="very nice dialog">
              <div className={styles.header()}>header</div>

              <div className={styles.body()}>
                <p className="m-3">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste natus dolores
                  similique accusantium est esse, illo fugiat aut sequi ipsum magnam laborum
                  provident delectus quaerat reprehenderit nihil porro ratione cupiditate ipsam nam
                  odio animi blanditiis nobis nisi! id
                </p>

                <Dialog.Root>
                  <Dialog.Trigger>
                    <Button color="secondary">open child dialog</Button>
                  </Dialog.Trigger>

                  <Dialog.Portal>
                    <div className={styles.backdrop()} />

                    <div className={styles.container()}>
                      <Dialog.Content>
                        <div className={styles.base({ size: "lg" })} aria-label="very nice dialog">
                          <div className={styles.header()}>header</div>

                          <div className={styles.body()}>
                            <p className="m-2">
                              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste natus
                              dolores similique accusantium est esse, illo fugiat aut sequi ipsum
                            </p>

                            <p className="m-2">
                              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste natus
                              dolores similique accusantium est esse, illo fugiat aut sequi ipsum
                            </p>
                          </div>

                          <div className={styles.footer()}>
                            <Dialog.Close>
                              <Button variant="text" color="danger">
                                Close
                              </Button>
                            </Dialog.Close>

                            <Button color="success">Agree</Button>
                          </div>
                        </div>
                      </Dialog.Content>
                    </div>
                  </Dialog.Portal>
                </Dialog.Root>

                <p className="m-3">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste natus dolores
                  similique accusantium est esse, illo fugiat aut sequi ipsum magnam laborum
                  provident delectus quaerat reprehenderit nihil porro ratione cupiditate ipsam nam
                  odio animi blanditiis nobis nisi! id
                </p>
              </div>

              <div className={styles.footer()}>
                <Dialog.Close>
                  <Button variant="text" color="danger">
                    Close
                  </Button>
                </Dialog.Close>

                <Button color="success">Agree</Button>
              </div>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export const Nested: StoryObj = {
  render: NestedTemplate,
  args: {
    defaultOpen: true,
    modal: true,
    keepMounted: false,
  },
};
