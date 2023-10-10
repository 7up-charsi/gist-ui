import { forwardRef, ReactNode } from "react";
import { button, ButtonVariantProps } from "@frontplus-ui/theme";

export interface ButtonProps extends ButtonVariantProps {
  children: string;
  startIcon: ReactNode;
  endIcon: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { startIcon, endIcon } = props;

  const styles = button(props);

  return (
    <button ref={ref} className={styles}>
      {startIcon}
      {props.children}
      {endIcon}
    </button>
  );
});

Button.displayName = "frontplus.Button";

export default Button;