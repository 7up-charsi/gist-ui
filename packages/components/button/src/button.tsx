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

  // TODO: add useMediaQuery/useIsTouchDevice for data-hoverabe

  return (
    <button ref={ref} className={styles} data-hoverable={true}>
      {startIcon}
      {props.children}
      {endIcon}
    </button>
  );
});

Button.displayName = "frontplus.Button";

export default Button;
