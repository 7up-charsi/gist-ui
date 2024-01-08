import { button, ButtonVariantProps } from '@gist-ui/theme';
import { __DEV__ } from '@gist-ui/shared-utils';
import { useRipple, UseRippleProps } from '@gist-ui/use-ripple';
import { ButtonHTMLAttributes, forwardRef, ReactNode, useEffect } from 'react';
import { mergeProps } from '@gist-ui/react-utils';
import { useFocusRing } from '@react-aria/focus';
import { ClassValue } from 'tailwind-variants';
import {
  usePress,
  useHover,
  HoverEvents,
  PressProps,
} from '@react-aria/interactions';
import { useCallbackRef } from '@gist-ui/use-callback-ref';

export interface ButtonProps
  extends ButtonVariantProps,
    Omit<
      ButtonHTMLAttributes<HTMLButtonElement>,
      'color' | 'className' | 'disabled'
    >,
    Omit<PressProps, 'isPressed' | 'ref'>,
    HoverEvents {
  startContent?: ReactNode;
  endContent?: ReactNode;
  className?: ClassValue;
  children?: ReactNode;
  rippleDuration?: UseRippleProps['duration'];
  rippleTimingFunction?: UseRippleProps['timingFunction'];
  rippleCompletedFactor?: UseRippleProps['completedFactor'];
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    startContent,
    endContent,
    className,
    children,
    onPress: onPressProp,
    onPressEnd,
    onPressStart,
    onPressUp,
    onPressChange,
    isIconOnly = false,
    rippleDuration = isIconOnly ? 450 : 500,
    rippleTimingFunction,
    rippleCompletedFactor,
    color,
    fullWidth,
    isDisabled,
    size,
    variant,
    allowTextSelectionOnPress,
    preventFocusOnPress,
    shouldCancelOnPointerExit,
    ...buttonProps
  } = props;

  const onPress = useCallbackRef(onPressProp);

  const { rippleProps } = useRipple<HTMLButtonElement>({
    isDisabled,
    pointerCenter: !isIconOnly,
    duration: rippleDuration,
    timingFunction: rippleTimingFunction,
    completedFactor: rippleCompletedFactor,
  });

  const { focusProps, isFocusVisible, isFocused } = useFocusRing();
  const { hoverProps, isHovered } = useHover({ isDisabled });
  const { pressProps, isPressed } = usePress({
    isDisabled,
    onPress,
    onPressEnd,
    onPressStart,
    onPressUp,
    onPressChange,
    allowTextSelectionOnPress,
    preventFocusOnPress,
    shouldCancelOnPointerExit,
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
    className,
  });

  return (
    <button
      {...mergeProps(
        rippleProps,
        pressProps,
        focusProps,
        hoverProps,
        buttonProps,
      )}
      data-pressed={isPressed}
      data-hovered={isHovered}
      data-focused={isFocused}
      data-focus-visible={isFocusVisible && isFocused}
      disabled={isDisabled}
      ref={ref}
      className={styles}
    >
      {!isIconOnly && startContent}
      {children}
      {!isIconOnly && endContent}
    </button>
  );
});

Button.displayName = 'gist-ui.Button';

export default Button;
