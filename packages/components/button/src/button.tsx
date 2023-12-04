import { button, ButtonClassNames, ButtonVariantProps } from "@gist-ui/theme";
import { __DEV__ } from "@gist-ui/shared-utils";
import { Slot } from "@gist-ui/slot";
import { GistUiError, onlyChildError, validChildError } from "@gist-ui/error";
import { useRipple, UseRippleProps } from "@gist-ui/use-ripple";
import { mergeRefs, mergeProps } from "@gist-ui/react-utils";
import omit from "lodash.omit";
import pick from "lodash.pick";
import { useFocusRing, useHover, HoverProps } from "react-aria";
import {
  ButtonHTMLAttributes,
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { useIsPressed } from "@gist-ui/use-is-pressed";

const ripplePropsKeys = ["duration", "timingFunction", "completedFactor", "pointerCenter"] as const;

const hoverPropsKeys = ["onHoverStart", "onHoverEnd", "onHoverChange"] as const;

export interface ButtonProps
  extends ButtonVariantProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color" | "className">,
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

  const { startContent, endContent, classNames, asChild, children, ...rest } = props;

  const { isDisabled, isIconOnly } = variantProps;

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
  const { isPressed, isPressedProps } = useIsPressed<HTMLButtonElement>();

  const handleKeyUp: React.KeyboardEventHandler = useCallback((e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    if (e.repeat) return;

    e.preventDefault();

    const event = new PointerEvent("pointerup", { bubbles: true, cancelable: true });

    e.target.dispatchEvent(event);
  }, []);

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
        { onPointerDown: rippleEvent, onKeyUp: handleKeyUp },
        { ...isPressedProps },
        { ...focusProps },
        { ...hoverProps },
        { ...rest },
      )}
      data-pressed={isPressed}
      data-key-pressed={isPressed && isFocusVisible && isFocused}
      data-hovered={isHovered}
      data-focused={isFocused}
      data-focus-visible={isFocusVisible && isFocused}
      disabled={isDisabled}
      ref={mergeRefs(ref, rippleRef, innerRef)}
      className={styles.base({ className: classNames?.base })}
      role={asChild ? "button" : undefined}
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
