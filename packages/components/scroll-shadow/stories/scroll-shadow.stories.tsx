import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import { ScrollShadow, ScrollShadowProps } from "../src";

const meta: Meta<ScrollShadowProps> = {
  title: "Components/ScrollShadow",
  component: ScrollShadow,
  argTypes: {
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;

const VerticalTemplate = (args: ScrollShadowProps) => {
  return (
    <div className="w-96 h-96 border-2 border-default-400 rounded-md p-3 flex flex-col gap-2">
      <span className="capitalize font-medium">direction : vertical</span>
      <ScrollShadow {...args}>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam illo quaerat praesentium rem
        nisi recusandae tenetur quidem. Quod eaque vero, beatae cum ratione veritatis quasi quo, nam
        pariatur nemo eligendi, alias natus doloribus tenetur iure recusandae consectetur iusto
        doloremque nobis reprehe Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam
        illo quaerat praesentium rem nisi recusandae tenetur quidem. Quod eaque vero, beatae cum
        ratione veritatis quasi quo, nam pariatur nemo eligendi, alias natus doloribus tenetur iure
        recusandae consectetur iusto doloremque nobis reprehe Lorem ipsum, dolor sit amet
        consectetur adipisicing elit. Totam illo quaerat praesentium rem nisi recusandae tenetur
        quidem. Quod eaque vero, beatae cum ratione veritatis quasi quo, nam pariatur nemo eligendi,
        alias natus doloribus tenetur iure recusandae consectetur iusto doloremque nobis reprehe
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam illo quaerat praesentium rem
        nisi recusandae tenetur quidem. Quod eaque vero, beatae cum ratione veritatis quasi quo, nam
        pariatur nemo eligendi, alias natus doloribus tenetur iure recusandae consectetur iusto
        doloremque nobis reprehe
      </ScrollShadow>
    </div>
  );
};

export const Vertical: StoryObj<ScrollShadowProps> = {
  render: VerticalTemplate,
};

const HorizontalTemplate = (args: ScrollShadowProps) => {
  return (
    <div className="w-96 h-96 border-2 border-default-400 rounded-md p-3 flex flex-col gap-2">
      <span className="capitalize font-medium">direction : horizontal</span>
      <ScrollShadow {...args} direction="horizontal">
        <p className="h-full w-[500px]">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam illo quaerat praesentium
          rem nisi recusandae tenetur quidem. Quod eaque vero, beatae cum ratione veritatis quasi
          quo, nam pariatur nemo eligendi, alias natus doloribus tenetur iure recusandae consectetur
          iusto doloremque nobis reprehenderit quidem. Totam eligendi magni, distinctio mollitia
          repellat repellendus accusantium eum nesciunt, velit quisquam inventore, quo optio
          deserunt. Assumenda, eligendi magnam veritatis praesentium quia nobis reprehe
        </p>
      </ScrollShadow>
    </div>
  );
};

export const Horizontal: StoryObj<ScrollShadowProps> = {
  render: HorizontalTemplate,
};

const BothTemplate = (args: ScrollShadowProps) => {
  return (
    <div className="w-96 h-96 border-2 border-default-400 rounded-md p-3 flex flex-col gap-2">
      <span className="capitalize font-medium">direction : both</span>
      <ScrollShadow {...args} direction="both">
        <p className="h-full w-[500px]">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam illo quaerat praesentium
          rem nisi recusandae tenetur quidem. Quod eaque vero, beatae cum ratione veritatis quasi
          quo, nam pariatur nemo eligendi, alias natus doloribus tenetur iure recusandae consectetur
          iusto doloremque nobis reprehenderit quidem. Totam eligendi magni, distinctio mollitia
          repellat repellendus accusantium eum nesciunt, velit quisquam inventore, quo optio
          deserunt. Assumenda, eligendi magnam veritatis praesentium quia dolore modi id error nam
          impedit nulla? Nemo officiis vel ex iste rerum nostrum commodi doloribus minus unde nulla
          error voluptatibus, cum ratione veritatis quasi quo, nam pariatur nemo eligendi, alias
          natus doloribus tenetur iure recusandae consectetur iusto doloremque nobis reprehe Lorem
          ipsum, dolor sit amet consectetur adipisicing elit. Totam illo quaerat praesentium rem
          nisi recusandae tenetur quidem. Quod eaque vero, beatae cum ratione veritatis quasi quo,
          nam pariatur nemo eligendi, alias natus doloribus tenetur iure recusandae consectetur
          iusto doloremque nobis reprehe Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          Totam illo quaerat praesentium rem nisi recusandae tenetur quidem. Quod eaque vero, beatae
          cum ratione veritatis quasi quo, nam pariatur nemo eligendi, alias natus doloribus tenetur
          iure recusandae consectetur iusto doloremque nobis reprehe
        </p>
      </ScrollShadow>
    </div>
  );
};

export const Both: StoryObj<ScrollShadowProps> = {
  render: BothTemplate,
};
