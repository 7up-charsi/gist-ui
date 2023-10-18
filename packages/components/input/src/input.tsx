import { forwardRef } from "react";
import BaseInput, { BaseInputProps } from "./base";

export interface InputProps extends BaseInputProps {
  type?: "text" | "password" | "number" | "date" | "tel";
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { type = "text" } = props;

  if (type === "text") return <BaseInput ref={ref} {...props} />;

  return "input type not supported";
});

Input.displayName = "front-ui.Input";

export default Input;
