import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Button } from "@gist-ui/button";

import { FocusTrap, FocusTrapProps } from "../src";

const meta: Meta<FocusTrapProps> = {
  title: "Components/FocusTrap",
  component: FocusTrap,
};

export default meta;

export const Default: StoryObj<FocusTrapProps> = {
  render: (args) => {
    return (
      <FocusTrap
        className="w-[500px] h-[500px] border flex flex-wrap items-center justify-center content-center gap-4"
        {...args}
      >
        <span className="w-full text-center uppercase font-medium text-default">
          focus can not escape this container
        </span>
        <Button>button 1</Button>
        <Button>button 2</Button>
        <Button>button 3</Button>
        <Button>button 4</Button>
        <Button>button 5</Button>
      </FocusTrap>
    );
  },
};
