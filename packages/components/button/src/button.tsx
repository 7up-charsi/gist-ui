import { forwardRef, LegacyRef, ReactNode, useRef } from "react";
import { button, ButtonVariantProps } from "@gist-ui/theme";
import { useRipple, UseRippleProps } from "@gist-ui/use-ripple";
import { mergeRefs } from "@gist-ui/react-utils";
import { AriaButtonOptions, mergeProps, useButton, useFocusRing, useHover } from "react-aria";
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
  } = props;

  const { base } = button({
    color,
    fullWidth,
    isDisabled,
    rounded,
    size,
    variant,
  });

  const innerRef = useRef<HTMLButtonElement>(null);

  const [rippleRef, rippleEvent] = useRipple<HTMLButtonElement>(rippleProps);

  const { buttonProps } = useButton(props, innerRef);

  const { focusProps, isFocusVisible, isFocused } = useFocusRing();
  const { hoverProps, isHovered } = useHover(props);

  return (
    <IconContext.Provider value={{ size }}>
      <button
        data-hovered={isHovered}
        data-focused={isFocused}
        data-focus-visible={isFocusVisible}
        {...buttonProps}
        ref={mergeRefs(ref, rippleRef, innerRef) as LegacyRef<HTMLButtonElement>}
        {...mergeProps({ onPointerDown: rippleEvent }, buttonProps, focusProps, hoverProps)}
        className={base({ className })}
      >
        {startContent}
        {props.children}
        {endContent}
      </button>
    </IconContext.Provider>
  );
});

Button.displayName = "gist-ui.Button";

export default Button;
