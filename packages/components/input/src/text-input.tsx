import { forwardRef } from "react";
import BaseInput, { BaseInputProps } from "./base-input";

export interface TextInputProps extends Omit<BaseInputProps, "type"> {}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  return <BaseInput ref={ref} {...props} type="text" />;
});

TextInput.displayName = "gist-ui.TextInput";

export default TextInput;
