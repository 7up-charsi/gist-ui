import { ButtonHTMLAttributes, ElementType, forwardRef, ReactNode, useRef } from "react";
import { button, ButtonVariantProps } from "@gist-ui/theme";
import { __DEV__ } from "@gist-ui/shared-utils";
import { useRipple, UseRippleProps } from "@gist-ui/use-ripple";
import { mergeRefs, mergeProps } from "@gist-ui/react-utils";
import { useFocusRing, useHover, usePress, PressProps } from "react-aria";

export interface ButtonProps
  extends ButtonVariantProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    Omit<PressProps, "isDisabled"> {
  startContent?: ReactNode;
  endContent?: ReactNode;
  rippleProps?: UseRippleProps;
  className?: string;
  children?: ReactNode;
  isDisabled?: boolean;
  as?: ElementType;
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
    as: Comp = "button",
    ...rest
  } = props;

  const { base } = button({
    color,
    fullWidth,
    isDisabled,
    rounded,
    size,
    variant,
    isIconOnly,
  });

  const innerRef = useRef<HTMLButtonElement>(null);

  const [rippleRef, rippleEvent] = useRipple<HTMLButtonElement>({
    ...rippleProps,
    pointerCenter: !isIconOnly,
    duration: isIconOnly ? 450 : 500,
  });

  const { focusProps, isFocusVisible, isFocused } = useFocusRing();
  const { hoverProps, isHovered } = useHover(props);
  const { isPressed, pressProps } = usePress(props);

  if (__DEV__ && isIconOnly && !props["aria-label"] && !props["aria-labelledby"])
    console.warn('Gist-ui button: icon button must provide "aria-label" or "aria-labelledby"');

  return (
    <Comp
      {...mergeProps(
        { onPointerDown: rippleEvent },
        { ...pressProps },
        { ...focusProps },
        { ...hoverProps },
        { ...rest },
      )}
      data-pressed={isPressed}
      data-key-pressed={isPressed && isFocusVisible && isFocused}
      data-hovered={isHovered}
      data-focused={isFocused}
      data-focus-visible={isFocusVisible && isFocused}
      ref={mergeRefs(ref, rippleRef, innerRef)}
      className={base({ className })}
    >
      {!isIconOnly && startContent}
      {props.children}
      {!isIconOnly && endContent}
    </Comp>
  );
});

Button.displayName = "gist-ui.Button";

export default Button;
