import { forwardRef, LegacyRef, ReactNode, useRef } from "react";
import { button, ButtonVariantProps } from "@front-ui/theme";
import { useRipple, UseRippleProps } from "@front-ui/use-ripple";
import { mergeRefs, mergeEvents } from "@front-ui/react-utils";
import { AriaButtonOptions, useButton, useFocusRing } from "react-aria";

export interface ButtonProps extends ButtonVariantProps, AriaButtonOptions<"button"> {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  rippleProps?: UseRippleProps;
  className?: string;
  children?: ReactNode;
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
    isIconOnly,
  } = props;

  const { base, focusVisible } = button({
    className,
    color,
    fullWidth,
    disabled,
    rounded,
    size,
    variant,
    isIconOnly,
  });

  const innerRef = useRef<HTMLButtonElement>(null);

  const [rippleRef, rippleEvent] = useRipple<HTMLButtonElement>(rippleProps);

  const { buttonProps } = useButton(props, innerRef);

  const { focusProps, isFocusVisible, isFocused } = useFocusRing();

  return (
    <button
      {...buttonProps}
      ref={mergeRefs(ref, rippleRef, innerRef) as LegacyRef<HTMLButtonElement>}
      {...mergeEvents(
        { onPointerDown: rippleEvent },
        { onPointerDown: buttonProps.onPointerDown },
        { onFocus: focusProps.onFocus, onBlur: focusProps.onBlur },
        { onFocus: buttonProps.onFocus, onBlur: buttonProps.onBlur },
      )}
      className={base()}
    >
      {!isIconOnly ? startIcon : null}
      {props.children}
      {!isIconOnly ? endIcon : null}

      <span data-visible={isFocusVisible && isFocused} className={focusVisible()}></span>
    </button>
  );
});

Button.displayName = "front-ui.Button";

export default Button;
