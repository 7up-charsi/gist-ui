import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Icon, IconProps } from "../src";

const meta: Meta<IconProps> = {
  title: "Components/Icon",
  component: Icon,
};

export default meta;

const svgIcon = (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 20 18"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M10 12.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17 3h-2l-.447-.894A2 2 0 0 0 12.764 1H7.236a2 2 0 0 0-1.789 1.106L5 3H3a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V5a2 2 0 0 0-2-2Z"
    />
  </svg>
);

const SizeTemplate = (args: IconProps) => (
  <table className="w-52">
    <thead>
      <tr className="border-b-2 border-default-300 h-10">
        <th className="font-medium border-r-2 border-default-300">Sm</th>
        <th className="font-medium border-r-2 border-default-300">Md</th>
        <th className="font-medium">Lg</th>
      </tr>
    </thead>
    <tbody>
      <tr className="h-10 text-primary">
        <td className="border-r-2 border-default-300">
          <span className="flex items-center justify-center">
            <Icon {...args} size="sm">
              {svgIcon}
            </Icon>
          </span>
        </td>
        <td className="border-r-2 border-default-300">
          <span className="flex items-center justify-center">
            <Icon {...args} size="md">
              {svgIcon}
            </Icon>
          </span>
        </td>
        <td className="">
          <span className="flex items-center justify-center">
            <Icon {...args} size="lg">
              {svgIcon}
            </Icon>
          </span>
        </td>
      </tr>
    </tbody>
  </table>
);

export const Defalut: StoryObj<IconProps> = {
  render: SizeTemplate,
};
