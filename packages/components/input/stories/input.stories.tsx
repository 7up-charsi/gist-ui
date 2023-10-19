import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { input } from "@front-ui/theme";

import { Input, InputProps } from "../src";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  args: input.defaultVariants,
  argTypes: {
    labelPlacement: {
      name: "label placement",
      control: { type: "select" },
      options: [
        "inside-left",
        "inside-top",
        "inside-right",
        "outside-left",
        "outside-top",
        "outside-right",
      ],
    },
  },
};

export default meta;

const Template = (args: InputProps) => <Input {...args} />;

export const Default: StoryObj<InputProps> = {
  // render: (args) => (
  //   <div className="grid grid-rows-3 grid-cols-3">
  //     {(["inside", "outsideLeft", "outsideTop"] as const).map((lp) =>
  //       (["sm", "md", "lg"] as const).map((size) => (
  //         <div
  //           key={lp + size}
  //           data-last-row={lp.includes("Top")}
  //           data-first-column={size.includes("sm")}
  //           className="border-l-2 border-b-2 border-dashed flex items-center justify-center data-[last-row=true]:border-b-0 data-[first-column=true]:border-l-0"
  //         >
  //           <Template {...args} size={size} label={`${lp} ${size}`} labelPlacement={lp} />
  //         </div>
  //       )),
  //     )}
  //   </div>
  // ),
  render: Template,
  args: {
    description: "Consectetur elit sint incididunt sunt.",
    label: "label",
    // startContent: (
    //   <svg className="w-3 h-3" aria-hidden="true" fill="currentColor" viewBox="0 0 14 20">
    //     <path d="M13 20a1 1 0 0 1-.64-.231L7 15.3l-5.36 4.469A1 1 0 0 1 0 19V2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v17a1 1 0 0 1-1 1Z" />
    //   </svg>
    // ),
    // endContent: (
    //   <svg className="w-3 h-3" aria-hidden="true" fill="currentColor" viewBox="0 0 19 20">
    //     <path d="M18.012 13.453c-.219-1.173-2.163-1.416-2.6-3.76l-.041-.217c0 .006 0-.005-.007-.038v.021l-.017-.09-.005-.025v-.006l-.265-1.418a5.406 5.406 0 0 0-5.051-4.408.973.973 0 0 0 0-.108L9.6 1.082a1 1 0 0 0-1.967.367l.434 2.325a.863.863 0 0 0 .039.1A5.409 5.409 0 0 0 4.992 9.81l.266 1.418c0-.012 0 0 .007.037v-.007l.006.032.009.046v-.01l.007.038.04.215c.439 2.345-1.286 3.275-1.067 4.447.11.586.22 1.173.749 1.074l12.7-2.377c.523-.098.413-.684.303-1.27ZM1.917 9.191h-.074a1 1 0 0 1-.924-1.07 9.446 9.446 0 0 1 2.426-5.648 1 1 0 1 1 1.482 1.343 7.466 7.466 0 0 0-1.914 4.449 1 1 0 0 1-.996.926Zm5.339 8.545A3.438 3.438 0 0 0 10 19.1a3.478 3.478 0 0 0 3.334-2.5l-6.078 1.136Z" />
    //   </svg>
    // ),
  },
};
