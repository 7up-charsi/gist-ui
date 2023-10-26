import "./style.css";

const preview = {
  argTypes: {
    color: {
      control: { type: "select" },
      options: ["neutral", "primary", "secondary", "success", "info", "warning", "danger"],
      if: { arg: "color", exists: true },
    },
    rounded: {
      control: { type: "select" },
      options: ["none", "sm", "md", "lg", "full"],
      if: { arg: "rounded", exists: true },
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      if: { arg: "size", exists: true },
    },
    isDisabled: {
      control: {
        type: "boolean",
        if: { arg: "isDisabled", exists: true },
      },
    },
  },
};

export default preview;
