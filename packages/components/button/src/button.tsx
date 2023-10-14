import { forwardRef, LegacyRef, ReactNode, useRef } from "react";
import { button, ButtonVariantProps } from "@frontplus-ui/theme";
import { useRipple, UseRippleProps } from "@frontplus-ui/use-ripple";
import { mergeRefs, mergeEvents } from "@frontplus-ui/react-utils";
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

  const innerRef = useRef<HTMLButtonElement>(null);

  const [rippleRef, rippleEvent] = useRipple<HTMLButtonElement>(rippleProps);

  const { buttonProps } = useButton(props, innerRef);

  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <button
      ref={mergeRefs(ref, rippleRef, innerRef) as LegacyRef<HTMLButtonElement>}
      {...buttonProps}
      {...mergeEvents(
        { onPointerDown: rippleEvent },
        { onPointerDown: buttonProps.onPointerDown },
        { onFocus: focusProps.onFocus, onBlur: focusProps.onBlur },
        { onFocus: buttonProps.onFocus, onBlur: buttonProps.onBlur },
      )}
      className={styles}
    >
      {startIcon}
      {props.children}
      {endIcon}

      <span
        data-visible={isFocusVisible}
        className="rounded-full absolute origin-center animate-none hidden data-[visible=true]:inline-block data-[visible=true]:animate-focusRipple bg-[var(--rippleBg)] w-[var(--focusRippleSize)] h-[var(--focusRippleSize)]"
      ></span>
    </button>
  );
});

Button.displayName = "frontplus.Button";

export default Button;
