import { forwardRef, useId, useRef } from 'react';
import { useControllableState } from '@gist-ui/use-controllable-state';
import { Icon } from '@gist-ui/icon';
import { UseRippleProps, useRipple } from '@gist-ui/use-ripple';
import { mergeProps } from '@gist-ui/react-utils';
import { useHover, usePress } from '@react-aria/interactions';
import { useFocusRing } from '@react-aria/focus';
import {
  SwitchClassNames,
  SwitchVariantProps,
  switch as switchStyles,
} from '@gist-ui/theme';

const icon_svg = (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 20 20"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m13 7-6 6m0-6 6 6m6-3a9"
    />
  </svg>
);

const checkIcon_svg = (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 20 20"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m7 10 2 2 4-4m6 2a9"
    />
  </svg>
);

export interface SwitchProps extends SwitchVariantProps {
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  classNames?: Omit<SwitchClassNames, 'input' | 'ripple'>;
  isDisabled?: boolean;
  icon?: React.ReactNode;
  checkIcon?: React.ReactNode;
  label?: string;
  labelPlacement?: 'top' | 'bottom' | 'left' | 'right';
  rippleDuration?: UseRippleProps['duration'];
  rippleTimingFunction?: UseRippleProps['timingFunction'];
  rippleCompletedFactor?: UseRippleProps['completedFactor'];
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>((props, ref) => {
  const {
    defaultChecked,
    checked: checkedProp,
    onChange,
    isDisabled,
    classNames,
    icon = icon_svg,
    checkIcon = checkIcon_svg,
    label,
    color,
    rippleDuration = 450,
    rippleTimingFunction,
    rippleCompletedFactor,
    labelPlacement = 'right',
    size = 'md',
  } = props;

  const id = useId();
  const thumbRef = useRef<HTMLDivElement>(null);

  const [checked, setChecked] = useControllableState({
    defaultValue: defaultChecked || false,
    value: checkedProp,
    onChange,
  });

  const { isFocusVisible, focusProps } = useFocusRing();

  const { pressProps, isPressed } = usePress({
    isDisabled,
    onPressStart: (e) => e.continuePropagation(),
    onPressEnd: (e) => e.continuePropagation(),
    onPress: (e) => e.continuePropagation(),
  });

  const { hoverProps, isHovered } = useHover({ isDisabled });

  const { rippleProps } = useRipple({
    ref: thumbRef,
    isDisabled,
    pointerCenter: false,
    duration: rippleDuration,
    timingFunction: rippleTimingFunction,
    completedFactor: rippleCompletedFactor,
  });

  const styles = switchStyles({ size, isDisabled, labelPlacement, color });

  return (
    <div
      data-pressed={isPressed}
      data-hovered={isHovered}
      data-focus-visible={isFocusVisible}
      data-disabled={isDisabled}
      data-checked={checked}
      className={styles.base({ className: classNames?.base })}
    >
      <div
        className={styles.switch({ className: classNames?.switch })}
        {...rippleProps}
      >
        <input
          id={id}
          ref={ref}
          type="checkbox"
          checked={checked}
          className={styles.nativeInput({ className: classNames?.nativeInput })}
          disabled={isDisabled}
          {...mergeProps(focusProps, pressProps, hoverProps)}
          onChange={(e) => {
            setChecked(e.target.checked);
          }}
        />

        <div className={styles.track({ className: classNames?.track })}></div>
        <div
          ref={thumbRef}
          className={styles.thumb({ className: classNames?.thumb })}
        >
          <Icon size={size}>{checked ? checkIcon : icon}</Icon>
        </div>
      </div>

      {label && (
        <label
          htmlFor={id}
          className={styles.label({ className: classNames?.label })}
        >
          {label}
        </label>
      )}
    </div>
  );
});

Switch.displayName = 'gist-ui.Switch';

export default Switch;
