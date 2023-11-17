import { ButtonHTMLAttributes, ElementType, forwardRef, ReactNode, useRef } from "react";
import { button, ButtonClassNames, ButtonVariantProps } from "@gist-ui/theme";
import { __DEV__ } from "@gist-ui/shared-utils";
import { useRipple, UseRippleProps } from "@gist-ui/use-ripple";
import { mergeRefs, mergeProps } from "@gist-ui/react-utils";
import { useFocusRing, useHover, usePress, PressProps, HoverProps } from "react-aria";

export interface ButtonProps
  extends ButtonVariantProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color" | "className">,
    Omit<HoverProps, "isDisabled">,
    Omit<PressProps, "isDisabled"> {
  startContent?: ReactNode;
  endContent?: ReactNode;
  rippleProps?: UseRippleProps;
  classNames?: ButtonClassNames;
  children?: ReactNode;
  isDisabled?: boolean;
  as?: ElementType;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    startContent,
    endContent,
    rippleProps,
    classNames,
    isIconOnly,
    as: Component = "button",
    ...rest
  } = props;

  const innerRef = useRef<HTMLButtonElement>(null);

  const [rippleRef, rippleEvent] = useRipple<HTMLButtonElement>({
    pointerCenter: !isIconOnly,
    duration: isIconOnly ? 450 : 500,
    ...rippleProps,
  });

  const { focusProps, isFocusVisible, isFocused } = useFocusRing();
  const { hoverProps, isHovered } = useHover(props);
  const { isPressed, pressProps } = usePress(props);

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
      ref={mergeRefs(ref, rippleRef, innerRef)}
      className={styles.base({ className: classNames?.base })}
    >
      {!isIconOnly && startContent}
      {props.children}
      {!isIconOnly && endContent}
    </Component>
  );
});

Button.displayName = "gist-ui.Button";

export default Button;
