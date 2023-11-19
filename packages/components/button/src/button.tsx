import { ButtonHTMLAttributes, forwardRef, ReactNode, useRef } from "react";
import { button, ButtonClassNames, ButtonVariantProps } from "@gist-ui/theme";
import { __DEV__ } from "@gist-ui/shared-utils";
import { Slot } from "@gist-ui/slot";
import { useRipple, UseRippleProps } from "@gist-ui/use-ripple";
import { mergeRefs, mergeProps } from "@gist-ui/react-utils";
import { useFocusRing, useHover, usePress, PressProps, HoverProps } from "react-aria";

export interface ButtonProps
  extends ButtonVariantProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color" | "className"> {
  startContent?: ReactNode;
  endContent?: ReactNode;
  classNames?: ButtonClassNames;
  children?: ReactNode;
  rippleProps?: UseRippleProps;
  hoverProps?: HoverProps;
  pressProps?: PressProps;
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    startContent,
    endContent,
    classNames,
    isIconOnly,
    disabled,
    rippleProps,
    hoverProps: hoverHookProps = {},
    pressProps: pressHookProps = {},
    asChild,
    children,
    ...rest
  } = props;

  const innerRef = useRef<HTMLButtonElement>(null);

  const Component = asChild ? Slot : "button";

  const [rippleRef, rippleEvent] = useRipple<HTMLButtonElement>({
    pointerCenter: !isIconOnly,
    duration: isIconOnly ? 450 : 500,
    ...rippleProps,
  });

  const { focusProps, isFocusVisible, isFocused } = useFocusRing();
  const { hoverProps, isHovered } = useHover(hoverHookProps);
  const { isPressed, pressProps } = usePress(pressHookProps);

  const styles = button(props);

  if (__DEV__ && isIconOnly && !props["aria-label"] && !props["aria-labelledby"])
    console.warn('Gist-ui button: icon button must provide "aria-label" or "aria-labelledby"');

  return (
    <Component
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
      disabled={disabled}
      ref={mergeRefs(ref, rippleRef, innerRef)}
      className={styles.base({ className: classNames?.base })}
    >
      {!isIconOnly && startContent}
      {children}
      {!isIconOnly && endContent}
    </Component>
  );
});

Button.displayName = "gist-ui.Button";

export default Button;
