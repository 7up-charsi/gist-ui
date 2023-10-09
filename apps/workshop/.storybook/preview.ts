import "./style.css";

const preview = {
  argTypes: {
    color: {
      control: { type: "select" },
      options: ["neutral", "primary", "secondary", "success", "warning", "danger"],
    },
    rounded: {
      control: { type: "select" },
      options: ["none", "sm", "md", "lg", "full"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    isDisabled: {
      control: {
        type: "boolean",
      },
    },
  },
};

export default preview;
