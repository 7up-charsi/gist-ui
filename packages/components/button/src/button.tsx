import { forwardRef, LegacyRef, ReactNode } from "react";
import { button, ButtonVariantProps } from "@frontplus-ui/theme";
import { isTouchDevice } from "@frontplus-ui/shared-utils";
import { useRipple } from "@frontplus-ui/use-ripple";
import { mergeRefs } from "@frontplus-ui/react-utils";

export interface ButtonProps extends ButtonVariantProps {
  children: string;
  startIcon: ReactNode;
  endIcon: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { startIcon, endIcon } = props;
  const styles = button({ ...props, class: "relative" });

  const [rippleRef, event] = useRipple();

  return (
    <button
      ref={mergeRefs(ref, rippleRef) as LegacyRef<HTMLButtonElement>}
      className={styles}
      data-hoverable={!isTouchDevice()}
      onPointerDown={event}
    >
      {startIcon}
      {props.children}
      {endIcon}
    </button>
  );
});

Button.displayName = "frontplus.Button";

export default Button;
