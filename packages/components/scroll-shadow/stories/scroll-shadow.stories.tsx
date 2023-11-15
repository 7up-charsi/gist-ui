import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { scrollShadow } from "@gist-ui/theme";

import { ScrollShadow, ScrollShadowProps } from "../src";

const meta: Meta<ScrollShadowProps> = {
  title: "Components/ScrollShadow",
  component: ScrollShadow,
  args: scrollShadow.defaultVariants,
  argTypes: {},
};

export default meta;

export const Vertical: StoryObj<ScrollShadowProps> = {
  render: (args) => {
    return (
      <ScrollShadow {...args} classNames={{ base: "w-[300px] h-[300px]" }}>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam illo quaerat praesentium rem
        nisi recusandae tenetur quidem. Quod eaque vero, beatae cum ratione veritatis quasi quo, nam
        pariatur nemo eligendi, alias natus doloribus tenetur iure recusandae consectetur iusto
        doloremque nobis reprehenderit quidem. Totam eligendi magni, distinctio mollitia repellat
        repellendus accusantium eum nesciunt, velit quisquam inventore, quo optio deserunt.
        Assumenda, eligendi magnam veritatis praesentium quia dolore modi id error nam impedit
        nulla? Nemo officiis vel ex iste rerum nostrum commodi doloribus minus unde nulla error
        voluptatibus,
      </ScrollShadow>
    );
  },
  args: {},
};

export const Horizontal: StoryObj<ScrollShadowProps> = {
  render: (args) => {
    return (
      <ScrollShadow {...args} direction="horizontal" classNames={{ base: "w-[300px] h-[300px]" }}>
        <p className="h-full w-[500px]">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam illo quaerat praesentium
          rem nisi recusandae tenetur quidem. Quod eaque vero, beatae cum ratione veritatis quasi
          quo, nam pariatur nemo eligendi, alias natus doloribus tenetur iure recusandae consectetur
          iusto doloremque nobis reprehenderit quidem. Totam eligendi magni, distinctio mollitia
          repellat repellendus accusantium eum nesciunt, velit quisquam inventore, quo optio
          deserunt. Assumenda, eligendi magnam veritatis praesentium quia dolore modi id error nam
          impedit nulla? Nemo officiis vel ex iste rerum nostrum commodi doloribus minus unde nulla
          error voluptatibus,
        </p>
      </ScrollShadow>
    );
  },
  args: {},
};
