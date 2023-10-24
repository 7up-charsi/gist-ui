import { forwardRef, LegacyRef, ReactNode, useRef } from "react";
import { button, ButtonVariantProps } from "@gist-ui/theme";
import { useRipple, UseRippleProps } from "@gist-ui/use-ripple";
import { mergeRefs, mergeEvents } from "@gist-ui/react-utils";
import { AriaButtonOptions, useButton, useFocusRing } from "react-aria";
import { IconContext } from "@gist-ui/icon";

export interface ButtonProps extends ButtonVariantProps, AriaButtonOptions<"button"> {
  startContent?: ReactNode;
  endContent?: ReactNode;
  rippleProps?: UseRippleProps;
  className?: string;
  children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    startContent,
    endContent,
    rippleProps,
    className,
    color,
    fullWidth,
    isDisabled,
    rounded,
    size,
    variant,
    isIconOnly,
  } = props;

  const { base, focusVisible } = button({
    color,
    fullWidth,
    isDisabled,
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
    <IconContext.Provider value={{ size }}>
      <button
        {...buttonProps}
        ref={mergeRefs(ref, rippleRef, innerRef) as LegacyRef<HTMLButtonElement>}
        {...mergeEvents(
          { onPointerDown: rippleEvent },
          { onPointerDown: buttonProps.onPointerDown },
          { onFocus: focusProps.onFocus, onBlur: focusProps.onBlur },
          { onFocus: buttonProps.onFocus, onBlur: buttonProps.onBlur },
        )}
        className={base({ className })}
      >
        {!isIconOnly ? startContent : null}
        {props.children}
        {!isIconOnly ? endContent : null}

        <span data-visible={isFocusVisible && isFocused} className={focusVisible()}></span>
      </button>
    </IconContext.Provider>
  );
});

Button.displayName = "gist-ui.Button";

export default Button;
