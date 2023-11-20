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
      <FocusTrap {...args} asChild>
        <div className="w-[500px] h-[500px] border-2 border-default-300 rounded-md flex flex-wrap content-center items-center gap-3 justify-center">
          <span className="w-full text-center uppercase font-medium mb-4 text-info-400">
            focus can not escape this container
          </span>
          <Button variant="flat">button 1</Button>
          <Button variant="flat">button 2</Button>
          <Button variant="flat">button 3</Button>
          <Button variant="flat">button 4</Button>
          <Button variant="flat">button 5</Button>
        </div>
      </FocusTrap>
    );
  },
};
