import { button, ButtonClassNames, ButtonVariantProps } from "@gist-ui/theme";
import { __DEV__ } from "@gist-ui/shared-utils";
import { Slot } from "@gist-ui/slot";
import { GistUiError, onlyChildError, validChildError } from "@gist-ui/error";
import { useRipple, UseRippleProps } from "@gist-ui/use-ripple";
import { mergeRefs, mergeProps } from "@gist-ui/react-utils";
import omit from "lodash.omit";
import pick from "lodash.pick";
import { useFocusRing, useHover, HoverProps } from "react-aria";
import { useCallbackRef } from "@gist-ui/use-callback-ref";
import { usePointerEvents } from "@gist-ui/use-pointer-events";
import {
  ButtonHTMLAttributes,
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactNode,
  useRef,
} from "react";

const ripplePropsKeys = ["duration", "timingFunction", "completedFactor", "pointerCenter"] as const;

const hoverPropsKeys = ["onHoverStart", "onHoverEnd", "onHoverChange"] as const;

export interface ButtonProps
  extends ButtonVariantProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color" | "className" | "disabled">,
    UseRippleProps,
    HoverProps {
  startContent?: ReactNode;
  endContent?: ReactNode;
  classNames?: ButtonClassNames;
  children?: ReactNode;
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((_props, ref) => {
  const variantProps = pick(_props, ...button.variantKeys);
  const rippleProps = pick(_props, ...ripplePropsKeys);
  const hoverHookProps = pick(_props, ...hoverPropsKeys);

  const props = omit(_props, ...button.variantKeys, ...ripplePropsKeys, ...hoverPropsKeys);

  const {
    startContent,
    endContent,
    classNames,
    asChild,
    children,
    onPointerDown: onPointerDownProp,
    onPointerUp: onPointerUpProp,
    ...rest
  } = props;

  const { isDisabled, isIconOnly } = variantProps;

  const onPointerDown = useCallbackRef(onPointerDownProp);
  const onPointerUp = useCallbackRef(onPointerUpProp);

  const innerRef = useRef<HTMLButtonElement>(null);

  const Component = asChild ? Slot : "button";

  const [rippleRef, rippleEvent] = useRipple<HTMLButtonElement>(
    isDisabled
      ? { isDisabled: true }
      : {
          pointerCenter: !isIconOnly,
          duration: isIconOnly ? 450 : 500,
          ...rippleProps,
        },
  );

  const { focusProps, isFocusVisible, isFocused } = useFocusRing();
  const { hoverProps, isHovered } = useHover({ ...hoverHookProps, isDisabled });

  const { pointerEventProps, isPressed } = usePointerEvents({ onPointerDown, onPointerUp });

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
        pointerEventProps,
        focusProps,
        hoverProps,
        rest,
      )}
      data-pressed={isPressed}
      data-hovered={isHovered}
      data-focused={isFocused}
      data-focus-visible={isFocusVisible && isFocused}
      disabled={isDisabled}
      ref={mergeRefs(ref, rippleRef, innerRef)}
      className={styles.base({ className: classNames?.base })}
      role={asChild ? "button" : undefined}
      aria-disabled={asChild ? isDisabled : undefined}
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
