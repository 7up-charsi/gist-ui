import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { dialog } from "@gist-ui/theme";
import { Button } from "@gist-ui/button";

import * as Dialog from "../src";
import { FocusTrapScopeProvider } from "@gist-ui/focus-trap";

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

  return (
    <FocusTrapScopeProvider>
      <Dialog.Root defaultOpen={args.defaultOpen} keepMounted={args.keepMounted}>
        <Dialog.Trigger>
          <button>open dialog</button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <div className={styles.backdrop()} />

          <div className={styles.container()}>
            <Dialog.Content modal={args.modal}>
              <div className={styles.base()}>
                <div className={styles.header()}>header</div>

                <div className={styles.body()}>
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
    </FocusTrapScopeProvider>
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
    <FocusTrapScopeProvider>
      <Dialog.Root defaultOpen={args.defaultOpen} keepMounted={args.keepMounted}>
        <Dialog.Trigger>
          <button>open dialog</button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <div className={styles.backdrop()} />

          <div className={styles.container()}>
            <Dialog.Content modal={args.modal}>
              <div className={styles.base()}>
                <div className={styles.header()}>header</div>

                <div className={styles.body()}>
                  <p className="m-3">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste natus dolores
                    similique accusantium est esse, illo fugiat aut sequi ipsum magnam laborum
                    provident delectus quaerat reprehenderit nihil porro ratione cupiditate ipsam
                    nam odio animi blanditiis nobis nisi! id
                  </p>

                  <Dialog.Root>
                    <Dialog.Trigger>
                      <Button color="secondary">open child dialog</Button>
                    </Dialog.Trigger>

                    <Dialog.Portal>
                      <div className={styles.backdrop()} />

                      <div className={styles.container()}>
                        <Dialog.Content>
                          <div className={styles.base({ size: "lg" })}>
                            <div className={styles.header()}>header</div>

                            <div className={styles.body()}>
                              <p className="m-2">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste natus
                                dolores similique accusantium est esse, illo fugiat aut sequi ipsum
                              </p>

                              <Dialog.Root>
                                <Dialog.Trigger>
                                  <Button color="secondary">open grandchild dialog</Button>
                                </Dialog.Trigger>

                                <Dialog.Portal>
                                  <div className={styles.backdrop()} />

                                  <div className={styles.container()}>
                                    <Dialog.Content>
                                      <div className={styles.base({ size: "sm" })}>
                                        <div className={styles.header()}>header</div>

                                        <div className={styles.body()}>
                                          Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                          Iste natus dolores similique accusantium est esse, illo
                                          fugiat aut sequi ipsum magnam laborum provident delectus
                                          quaerat reprehenderit nihil porro ratione cupiditate ipsam
                                          nam odio animi blanditiis nobis nisi! id
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

                              <p className="m-2">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste natus
                                dolores similique accusantium est esse, illo fugiat aut sequi ipsum
                              </p>
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

                  <p className="m-3">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste natus dolores
                    similique accusantium est esse, illo fugiat aut sequi ipsum magnam laborum
                    provident delectus quaerat reprehenderit nihil porro ratione cupiditate ipsam
                    nam odio animi blanditiis nobis nisi! id
                  </p>
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
    </FocusTrapScopeProvider>
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
