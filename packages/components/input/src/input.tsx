import { forwardRef } from "react";
import BaseInput, { BaseInputProps } from "./base";

export interface InputProps extends BaseInputProps {
  type?: "text" | "password" | "number" | "date" | "tel";
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  // const { type } = props;

  return <BaseInput ref={ref} {...props} type="text" />;
});

Input.displayName = "gist-ui.Input";

export default Input;
