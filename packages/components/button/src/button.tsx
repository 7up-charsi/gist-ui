import { button, ButtonClassNames, ButtonVariantProps } from '@gist-ui/theme';
import { __DEV__ } from '@gist-ui/shared-utils';
import { Slot } from '@gist-ui/slot';
import { GistUiError, onlyChildError, validChildError } from '@gist-ui/error';
import { useRipple, UseRippleProps } from '@gist-ui/use-ripple';
import { mergeRefs, mergeProps } from '@gist-ui/react-utils';
import {
  PressProps,
  usePress,
  useHover,
  HoverEvents,
} from '@react-aria/interactions';
import { useFocusRing } from '@react-aria/focus';
import {
  ButtonHTMLAttributes,
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import { useCallbackRef } from '@gist-ui/use-callback-ref';

export interface ButtonProps
  extends ButtonVariantProps,
    Omit<
      ButtonHTMLAttributes<HTMLButtonElement>,
      'color' | 'className' | 'disabled'
    >,
    Omit<PressProps, 'isPressed' | 'isDisabled'>,
    HoverEvents {
  startContent?: ReactNode;
  endContent?: ReactNode;
  classNames?: ButtonClassNames;
  children?: ReactNode;
  asChild?: boolean;
  rippleDuration?: UseRippleProps['duration'];
  rippleTimingFunction?: UseRippleProps['timingFunction'];
  rippleCompletedFactor?: UseRippleProps['completedFactor'];
  ripplePointerCenter?: UseRippleProps['pointerCenter'];
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    startContent,
    endContent,
    classNames,
    asChild,
    children,
    onPress: onPressProp,
    onPressEnd: onPressEndProp,
    onPressStart: onPressStartProp,
    onPressUp: onPressUpProp,
    onPressChange: onPressChangeProp,
    rippleDuration,
    rippleTimingFunction,
    rippleCompletedFactor,
    ripplePointerCenter,
    color,
    fullWidth,
    isDisabled,
    isIconOnly,
    size,
    variant,
    ...buttonProps
  } = props;

  const onPress = useCallbackRef(onPressProp);
  const onPressEnd = useCallbackRef(onPressEndProp);
  const onPressStart = useCallbackRef(onPressStartProp);
  const onPressUp = useCallbackRef(onPressUpProp);
  const onPressChange = useCallbackRef(onPressChangeProp);

  const innerRef = useRef<HTMLButtonElement>(null);

  const Component = asChild ? Slot : 'button';

  const [rippleRef, rippleEvent] = useRipple<HTMLButtonElement>(
    isDisabled
      ? { isDisabled: true }
      : {
          pointerCenter: ripplePointerCenter ?? !isIconOnly,
          duration: rippleDuration || isIconOnly ? 450 : 500,
          timingFunction: rippleTimingFunction,
          completedFactor: rippleCompletedFactor,
        },
  );

  const { focusProps, isFocusVisible, isFocused } = useFocusRing();
  const { hoverProps, isHovered } = useHover({ isDisabled });
  const { pressProps, isPressed } = usePress({
    isDisabled,
    onPress,
    onPressEnd,
    onPressStart,
    onPressUp,
    onPressChange,
  });

  const ariaLabel = props['aria-label'];
  const ariaLabelledby = props['aria-labelledby'];

  useEffect(() => {
    if (__DEV__ && isIconOnly && !ariaLabel && !ariaLabelledby)
      console.warn(
        'Gist-ui button: icon button must provide "aria-label" or "aria-labelledby"',
      );
  }, [ariaLabel, ariaLabelledby, isIconOnly]);

  const styles = button({
    color,
    fullWidth,
    isDisabled,
    isIconOnly,
    size,
    variant,
  });

  if (asChild) {
    const countChild = Children.count(children);
    if (!countChild) return;
    if (countChild > 1) throw new GistUiError('button', onlyChildError);
    if (!isValidElement(children))
      throw new GistUiError('button', validChildError);
  }

  return (
    <Component
      {...mergeProps(
        { onPointerDown: rippleEvent },
        pressProps,
        focusProps,
        hoverProps,
        buttonProps,
      )}
      data-pointer-pressed={isPressed}
      data-keyboard-pressed={isFocusVisible && isPressed}
      data-hovered={isHovered}
      data-focused={isFocused}
      data-focus-visible={isFocusVisible && isFocused}
      disabled={isDisabled}
      ref={mergeRefs(ref, rippleRef, innerRef)}
      className={styles.base({ className: classNames?.base })}
      role={asChild ? 'button' : undefined}
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

Button.displayName = 'gist-ui.Button';

export default Button;
