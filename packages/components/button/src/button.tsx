import { forwardRef } from "react";
import { button, ButtonVariantProps } from "@frontplus-ui/theme";

export interface ButtonProps extends ButtonVariantProps {
  children: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { base } = button(props);

  return <button className={base()}>{props.children}</button>;
});

Button.displayName = "frontplus.Button";

export default Button;
