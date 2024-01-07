import { forwardRef, useId } from 'react';
import { useControllableState } from '@gist-ui/use-controllable-state';
import { UseRippleProps, useRipple } from '@gist-ui/use-ripple';
import { mergeProps } from '@gist-ui/react-utils';
import { createContextScope } from '@gist-ui/context';
import { useHover, usePress } from '@react-aria/interactions';
import { useFocusRing } from '@react-aria/focus';
import { RadioClassNames, RadioVariantProps, radio } from '@gist-ui/theme';

const icon_svg = (
  <svg
    viewBox="0 0 24 24"
    width={20}
    height={20}
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
  >
    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-3a5" />
  </svg>
);

const checkIcon_svg = (
  <svg
    viewBox="0 0 24 24"
    width={20}
    height={20}
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <g>
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-3a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
    </g>
  </svg>
);

// *-*-*-*-* Group *-*-*-*-*

const Group_Name = 'Radio.Group';

interface GroupContext {
  value: string;
  onChange: (value: string) => void;
  name: string;
}

const [RootProvider, useRootContext] =
  createContextScope<GroupContext>(Group_Name);

export interface GroupProps {
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  children?: React.ReactNode;
  name: string;
}

export const Group = (props: GroupProps) => {
  const { children, defaultValue, value: valueProp, onChange, name } = props;

  const [value, setValue] = useControllableState({
    defaultValue,
    value: valueProp,
    onChange,
  });

  return (
    <RootProvider value={value} onChange={setValue} name={name}>
      {children}
    </RootProvider>
  );
};

Group.displayName = 'gist-ui.' + Group_Name;

// *-*-*-*-* Radio *-*-*-*-*

const Radio_Name = 'Radio.Radio';

export interface RadioProps extends RadioVariantProps {
  classNames?: Omit<RadioClassNames, 'input' | 'ripple'>;
  isDisabled?: boolean;
  icon?: React.ReactNode;
  checkIcon?: React.ReactNode;
  label?: string;
  labelPlacement?: 'top' | 'bottom' | 'left' | 'right';
  rippleDuration?: UseRippleProps['duration'];
  rippleTimingFunction?: UseRippleProps['timingFunction'];
  rippleCompletedFactor?: UseRippleProps['completedFactor'];
  value: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>((props, ref) => {
  const {
    isDisabled,
    classNames,
    icon = icon_svg,
    checkIcon = checkIcon_svg,
    label,
    value,
    color,
    rippleDuration = 450,
    rippleTimingFunction,
    rippleCompletedFactor,
    labelPlacement = 'right',
    size = 'md',
  } = props;

  const rootContext = useRootContext(Radio_Name);

  const id = useId();

  const { isFocusVisible, focusProps } = useFocusRing();

  const { pressProps, isPressed } = usePress({
    isDisabled,
    onPressStart: (e) => e.continuePropagation(),
    onPressEnd: (e) => e.continuePropagation(),
    onPress: (e) => e.continuePropagation(),
  });

  const { hoverProps, isHovered } = useHover({ isDisabled });

  const { rippleProps } = useRipple({
    isDisabled,
    pointerCenter: false,
    duration: rippleDuration,
    timingFunction: rippleTimingFunction,
    completedFactor: rippleCompletedFactor,
  });

  const styles = radio({ size, isDisabled, labelPlacement, color });

  const selected = rootContext.value === value;

  return (
    <div
      data-pressed={isPressed}
      data-hovered={isHovered}
      data-focus-visible={isFocusVisible}
      data-disabled={isDisabled}
      data-selected={selected}
      className={styles.base()}
    >
      <div
        className={styles.radio({ className: classNames?.base })}
        {...rippleProps}
      >
        <input
          id={id}
          ref={ref}
          type="radio"
          value={value}
          name={rootContext.name}
          className={styles.nativeInput()}
          disabled={isDisabled}
          {...mergeProps(focusProps, pressProps, hoverProps)}
          onChange={(e) => {
            rootContext.onChange(e.target.value);
          }}
        />

        {selected ? checkIcon : icon}
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

Radio.displayName = 'gist-ui.' + Radio_Name;
