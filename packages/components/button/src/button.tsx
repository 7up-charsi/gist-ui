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
  const { startIcon, endIcon, rippleProps, ...restProps } = props;

  const styles = button({
    className: props.className,
    color: props.color,
    fullWidth: props.fullWidth,
    disabled: props.disabled,
    rounded: props.rounded,
    size: props.size,
    variant: props.variant,
  });

  const [rippleRef, event] = useRipple(rippleProps);

  return (
    <button
      ref={mergeRefs(ref, rippleRef) as LegacyRef<HTMLButtonElement>}
      data-hoverable={!isTouchDevice()}
      {...mergeEvents({ onPointerDown: event }, { onPointerDown: restProps.onPointerDown })}
      {...restProps}
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
