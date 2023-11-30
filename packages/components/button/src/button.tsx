import { button, ButtonClassNames, ButtonVariantProps } from "@gist-ui/theme";
import { __DEV__ } from "@gist-ui/shared-utils";
import { Slot } from "@gist-ui/slot";
import { GistUiError, onlyChildError, validChildError } from "@gist-ui/error";
import { useRipple, UseRippleProps } from "@gist-ui/use-ripple";
import { mergeRefs, mergeProps, mapProps } from "@gist-ui/react-utils";
import { useFocusRing, useHover, usePress, PressProps, HoverProps } from "react-aria";
import {
  ButtonHTMLAttributes,
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactNode,
  useRef,
} from "react";

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

const Button = forwardRef<HTMLButtonElement, ButtonProps>((_props, ref) => {
  const [props, variantProps] = mapProps({ ..._props }, button.variantKeys);

  const {
    startContent,
    endContent,
    classNames,
    rippleProps = {},
    hoverProps: hoverHookProps = {},
    pressProps: pressHookProps = {},
    asChild,
    children,
    ...rest
  } = props;

  const { disabled, isIconOnly } = variantProps;

  const innerRef = useRef<HTMLButtonElement>(null);

  const Component = asChild ? Slot : "button";

  const [rippleRef, rippleEvent] = useRipple<HTMLButtonElement>(
    disabled
      ? { disabled: true }
      : {
          pointerCenter: !isIconOnly,
          duration: isIconOnly ? 450 : 500,
          ...rippleProps,
        },
  );

  const { focusProps, isFocusVisible, isFocused } = useFocusRing();
  const { hoverProps, isHovered } = useHover(disabled ? { isDisabled: true } : hoverHookProps);
  const { isPressed, pressProps } = usePress(pressHookProps);

  const styles = button(variantProps);

  if (__DEV__ && isIconOnly && !props["aria-label"] && !props["aria-labelledby"])
    console.warn('Gist-ui button: icon button must provide "aria-label" or "aria-labelledby"');

  if (asChild) {
    const countChild = Children.count(children);
    if (!countChild) return;
    if (countChild > 1) throw new GistUiError("button", onlyChildError);
    if (!isValidElement(children)) throw new GistUiError("button", validChildError);
  }

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
      {asChild && isValidElement(children) ? (
        cloneElement(children, {
          children: (
            <>
              {!isIconOnly && startContent}
              {children.props.children}
              {!isIconOnly && endContent}
            </>
          ),
        } as Partial<unknown>)
      ) : (
        <>
          {!isIconOnly && startContent}
          {children}
          {!isIconOnly && endContent}
        </>
      )}
    </Component>
  );
});

Button.displayName = "gist-ui.Button";

export default Button;
