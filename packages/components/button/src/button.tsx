import { ButtonHTMLAttributes, forwardRef, LegacyRef, ReactNode } from "react";
import { button, ButtonVariantProps } from "@frontplus-ui/theme";
import { isTouchDevice } from "@frontplus-ui/shared-utils";
import { useRipple, UseRippleProps } from "@frontplus-ui/use-ripple";
import { mergeRefs, mergeEvents } from "@frontplus-ui/react-utils";

export interface ButtonProps
  extends ButtonVariantProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  rippleProps?: UseRippleProps;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    startIcon,
    endIcon,
    rippleProps,
    className,
    color,
    fullWidth,
    disabled,
    rounded,
    size,
    variant,
    ...restProps
  } = props;

  const styles = button({
    className,
    color,
    fullWidth,
    disabled,
    rounded,
    size,
    variant,
  });

  const [rippleRef, rippleEvent] = useRipple<HTMLButtonElement>(rippleProps);

  return (
    <button
      ref={mergeRefs(ref, rippleRef) as LegacyRef<HTMLButtonElement>}
      data-hoverable={!isTouchDevice()}
      {...restProps}
      {...mergeEvents({ onPointerDown: rippleEvent }, { onPointerDown: restProps.onPointerDown })}
      className={styles}
    >
      {startIcon}
      {props.children}
      {endIcon}
    </button>
  );
});

Button.displayName = "frontplus.Button";

export default Button;
