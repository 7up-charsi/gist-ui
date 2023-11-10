import { KeyboardEventHandler, forwardRef, useRef } from "react";
import Input, { InputProps } from "./input";
import { mergeRefs } from "@gist-ui/react-utils";
import { numberInput } from "@gist-ui/theme";
import { Button, ButtonProps } from "@gist-ui/button";
import { Icon, IconProps } from "@gist-ui/icon";
import { mergeProps, useLongPress, usePress } from "react-aria";

type ClassNames = { [key in keyof typeof numberInput.slots]?: string };

type ExcludeStepButtonProps =
  | "excludeFromTabOrder"
  | "isIconOnly"
  | "size"
  | "variant"
  | "rounded"
  | "className";

type ExcludeStepButtonIconProps = "fill" | "className";

export interface NumberInputProps extends Omit<InputProps, "type"> {
  classNames?: InputProps["classNames"] & { stepButton: ClassNames };
  inputMode?: "decimal" | "numeric";
  stepUpButtonProps?: Omit<ButtonProps, ExcludeStepButtonProps>;
  stepDownButtonProps?: Omit<ButtonProps, ExcludeStepButtonProps>;
  stepUpButtonIconProps?: Omit<IconProps, ExcludeStepButtonIconProps>;
  stepDownButtonIconProps?: Omit<IconProps, ExcludeStepButtonIconProps>;
  min?: number;
  max?: number;
  step?: number;
  repeatRate?: number;
  threshold?: number;
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>((props, ref) => {
  const {
    classNames,
    stepUpButtonProps,
    stepDownButtonProps,
    stepUpButtonIconProps,
    stepDownButtonIconProps,
    inputMode = "numeric",
    inputProps,
    min,
    max,
    step = 1,
    repeatRate = 100,
    threshold = 500,

    ...rest
  } = props;

  const innerRef = useRef<HTMLInputElement>(null);

  const { base, button, icon } = numberInput();

  const state = useRef<{
    longPressInterval?: NodeJS.Timeout;
    keyDownInterval?: NodeJS.Timeout;
    repeatedEvent?: boolean;
  }>({});

  const handleStepUp = () => {
    const target = innerRef.current;

    if (!target) return;

    const value = +target.value;

    if (value === max) return;

    if (max && value > max) {
      target.value = max + "";
      return;
    }

    if (min && value < min) {
      target.value = min + "";
      return;
    }

    target.value = max && value + step > max ? max + "" : `${value + step}`;
  };

  const handleStepDown = () => {
    const target = innerRef.current;

    if (!target) return;

    const value = +target.value;

    if (value === min) return;

    if (max && value > max) {
      target.value = max + "";
      return;
    }

    if (min && value < min) {
      target.value = min + "";
      return;
    }

    target.value = min && value - step < min ? min + "" : `${value - step}`;
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    const ArrowUp = e.key === "ArrowUp";
    const ArrowDown = e.key === "ArrowDown";
    const repeatEvent = e.repeat;

    if (ArrowUp || ArrowDown) e.preventDefault();

    if (ArrowUp && !repeatEvent) {
      handleStepUp();
      return;
    }

    if (ArrowDown && !repeatEvent) {
      handleStepDown();
      return;
    }

    if (ArrowUp && repeatEvent && !state.current.repeatedEvent) {
      state.current.repeatedEvent = true;

      state.current.keyDownInterval = setInterval(handleStepUp, repeatRate);

      return;
    }

    if (ArrowDown && repeatEvent && !state.current.repeatedEvent) {
      state.current.repeatedEvent = true;

      state.current.keyDownInterval = setInterval(handleStepDown, repeatRate);

      return;
    }
  };

  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (e) => {
    const ArrowUp = e.key === "ArrowUp";
    const ArrowDown = e.key === "ArrowDown";

    if (ArrowUp || ArrowDown) {
      clearInterval(state.current.keyDownInterval);
      state.current.repeatedEvent = undefined;
      state.current.keyDownInterval = undefined;
    }
  };

  const { longPressProps: stepUpLongPressProps } = useLongPress({
    threshold,
    accessibilityDescription: "long press to increase speedly",
    onLongPressStart: handleStepUp,
    onLongPress: () => {
      state.current.longPressInterval = setInterval(handleStepUp, repeatRate);
    },
  });

  const { pressProps: stepUpPressProps } = usePress({
    onPress: stepUpButtonProps?.onPress,
    onPressUp: () => {
      clearInterval(state.current.longPressInterval);
      state.current.longPressInterval = undefined;
    },
  });

  const { longPressProps: stepDownLongPressProps } = useLongPress({
    threshold,
    accessibilityDescription: "long press to decrease speedly",
    onLongPressStart: handleStepDown,
    onLongPress: () => {
      state.current.longPressInterval = setInterval(handleStepDown, repeatRate);
    },
  });

  const { pressProps: stepDownPressProps } = usePress({
    onPress: stepDownButtonProps?.onPress,
    onPressUp: () => {
      clearInterval(state.current.longPressInterval);
      state.current.longPressInterval = undefined;
    },
  });

  const buttons = (
    <div ref={ref} className={base({ className: classNames?.stepButton.base })}>
      {/* step up */}
      <Button
        aria-label="increase value"
        {...stepUpButtonProps}
        excludeFromTabOrder
        isIconOnly
        size="sm"
        variant="text"
        rounded="none"
        className={button({ className: classNames?.stepButton.button })}
        nativeButtonProps={mergeProps(stepUpPressProps, stepUpLongPressProps)}
      >
        <Icon
          {...stepUpButtonIconProps}
          fill
          className={icon({ className: classNames?.stepButton.icon })}
        >
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10">
            <path d="M9.207 1A2 2 0 0 0 6.38 1L.793 6.586A2 2 0 0 0 2.207 10H13.38a2 2 0 0 0 1.414-3.414L9.207 1Z" />
          </svg>
        </Icon>
      </Button>

      {/* step down */}
      <Button
        aria-label="decrease value"
        {...stepDownButtonProps}
        excludeFromTabOrder
        isIconOnly
        size="sm"
        variant="text"
        rounded="none"
        className={button({ className: classNames?.stepButton.button })}
        nativeButtonProps={mergeProps(stepDownPressProps, stepDownLongPressProps)}
      >
        <Icon
          {...stepDownButtonIconProps}
          fill
          className={icon({ className: classNames?.stepButton.icon })}
        >
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10">
            <path d="M15.434 1.235A2 2 0 0 0 13.586 0H2.414A2 2 0 0 0 1 3.414L6.586 9a2 2 0 0 0 2.828 0L15 3.414a2 2 0 0 0 .434-2.179Z" />
          </svg>
        </Icon>
      </Button>
    </div>
  );

  return (
    <Input
      {...rest}
      classNames={classNames}
      ref={mergeRefs(ref, innerRef)}
      type="number"
      endContent={buttons}
      inputProps={{
        ...inputProps,
        onKeyDown: handleKeyDown,
        onKeyUp: handleKeyUp,
        inputMode,
        min,
        max,
        step,
      }}
    />
  );
});

NumberInput.displayName = "gist-ui.NumberInput";

export default NumberInput;
