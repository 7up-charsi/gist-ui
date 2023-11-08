import { forwardRef } from "react";
import Input, { InputProps } from "./input";

export interface PasswordInputProps extends Omit<InputProps, "type"> {}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>((props, ref) => {
  const { ...rest } = props;

  return <Input ref={ref} {...rest} type="password" />;
});

PasswordInput.displayName = "gist-ui.PasswordInput";

export default PasswordInput;
