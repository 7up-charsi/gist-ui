import { KeyboardEventHandler, forwardRef, useCallback, useRef } from "react";
import Input, { CustomInputElement, InputProps } from "./input";
import { mergeRefs, mergeProps } from "@gist-ui/react-utils";
import { NumberInputClassNames, numberInput } from "@gist-ui/theme";
import { Button } from "@gist-ui/button";
import { useLongPress } from "react-aria";
import { __DEV__ } from "@gist-ui/shared-utils";
import { GistUiError } from "@gist-ui/error";

export interface NumberInputProps extends Omit<InputProps, "type"> {
  classNames?: InputProps["classNames"] & { stepButton: NumberInputClassNames };
  inputMode?: "decimal" | "numeric";
  min?: number;
  max?: number;
  step?: number;
  largeStep?: number;
  repeatRate?: number;
  threshold?: number;
}

const NumberInput = forwardRef<CustomInputElement, NumberInputProps>((props, ref) => {
  const {
    classNames,
    inputMode = "numeric",
    inputProps,
    min,
    max,
    step = 1,
    largeStep = 5,
    repeatRate = 100,
    threshold = 500,
    endContent,
    ...rest
  } = props;

  const innerRef = useRef<CustomInputElement>(null);

  const state = useRef<{
    longPressInterval?: NodeJS.Timeout;
    keyDownInterval?: NodeJS.Timeout;
    repeatedEvent?: boolean;
  }>({});

  const handleStepUp = (normalStep = true) => {
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

    target.value =
      max && value + (normalStep ? step : largeStep) > max
        ? max + ""
        : `${value + (normalStep ? step : largeStep)}`;
  };

  const handleStepDown = (normalStep = true) => {
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

    target.value =
      min && value - (normalStep ? step : largeStep) < min
        ? min + ""
        : `${value - (normalStep ? step : largeStep)}`;
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    const ArrowUp = e.key === "ArrowUp";
    const ArrowDown = e.key === "ArrowDown";
    const PageUp = e.key === "PageUp";
    const PageDown = e.key === "PageDown";
    const Home = e.key === "Home";
    const End = e.key === "End";
    const repeatEvent = e.repeat;

    if (ArrowUp || ArrowDown || PageUp || PageDown || Home || End) e.preventDefault();

    if (ArrowUp && !repeatEvent) {
      handleStepUp();
      return;
    }

    if (ArrowDown && !repeatEvent) {
      handleStepDown();
      return;
    }

    if (PageUp && !repeatEvent) {
      handleStepUp(false);
      return;
    }

    if (PageDown && !repeatEvent) {
      handleStepDown(false);
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

    if (PageUp && repeatEvent && !state.current.repeatedEvent) {
      state.current.repeatedEvent = true;

      state.current.keyDownInterval = setInterval(() => {
        handleStepUp(false);
      }, repeatRate);

      return;
    }

    if (PageDown && repeatEvent && !state.current.repeatedEvent) {
      state.current.repeatedEvent = true;

      state.current.keyDownInterval = setInterval(() => {
        handleStepDown(false);
      }, repeatRate);

      return;
    }

    const target = innerRef.current;
    if (!target) return;

    if (Home && min) {
      target.value = min + "";
      return;
    }

    if (Home && !min) {
      target.value = "0";
      return;
    }

    if (End && max) {
      target.value = max + "";
      return;
    }
  };

  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (e) => {
    const ArrowUp = e.key === "ArrowUp";
    const ArrowDown = e.key === "ArrowDown";
    const PageUp = e.key === "PageUp";
    const PageDown = e.key === "PageDown";

    if (ArrowUp || ArrowDown || PageUp || PageDown) {
      clearInterval(state.current.keyDownInterval);
      state.current.repeatedEvent = undefined;
      state.current.keyDownInterval = undefined;

      return;
    }
  };

  const { longPressProps: stepUpLongPressProps } = useLongPress({
    threshold,
    accessibilityDescription: "long press to increase speedly",
    onLongPressStart: () => {
      innerRef.current?.focus();
      handleStepUp();
    },
    onLongPress: () => {
      state.current.longPressInterval = setInterval(handleStepUp, repeatRate);
    },
  });

  const handleStepUpClear: React.PointerEventHandler = useCallback(() => {
    clearInterval(state.current.longPressInterval);
    state.current.longPressInterval = undefined;
  }, []);

  const { longPressProps: stepDownLongPressProps } = useLongPress({
    threshold,
    accessibilityDescription: "long press to decrease speedly",
    onLongPressStart: () => {
      innerRef.current?.focus();
      handleStepDown();
    },
    onLongPress: () => {
      state.current.longPressInterval = setInterval(handleStepDown, repeatRate);
    },
  });

  const handleStepDownClear: React.PointerEventHandler = useCallback(() => {
    clearInterval(state.current.longPressInterval);
    state.current.longPressInterval = undefined;
  }, []);

  const styles = numberInput();

  const buttons = (
    <div ref={ref} className={styles.base({ className: classNames?.stepButton.base })}>
      {/* step up */}
      <Button
        aria-label="increase value"
        tabIndex={-1}
        isIconOnly
        size="sm"
        variant="text"
        rounded="none"
        classNames={{
          base: styles.button({
            className: `text-default-500 ${classNames?.stepButton.button}`,
          }),
        }}
        {...mergeProps({ onPointerUp: handleStepUpClear }, { ...stepUpLongPressProps })}
        asChild
      >
        <div>
          <svg
            fill="current"
            className={styles.icon({ className: classNames?.stepButton.icon })}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 10"
          >
            <path d="M9.207 1A2 2 0 0 0 6.38 1L.793 6.586A2 2 0 0 0 2.207 10H13.38a2 2 0 0 0 1.414-3.414L9.207 1Z" />
          </svg>
        </div>
      </Button>

      {/* step down */}
      <Button
        aria-label="decrease value"
        tabIndex={-1}
        isIconOnly
        size="sm"
        variant="text"
        rounded="none"
        classNames={{
          base: styles.button({
            className: `text-default-500 ${classNames?.stepButton.button}`,
          }),
        }}
        {...mergeProps({ onPointerUp: handleStepDownClear }, { ...stepDownLongPressProps })}
        asChild
      >
        <div>
          <svg
            fill="current"
            className={styles.icon({ className: classNames?.stepButton.icon })}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 10"
          >
            <path d="M15.434 1.235A2 2 0 0 0 13.586 0H2.414A2 2 0 0 0 1 3.414L6.586 9a2 2 0 0 0 2.828 0L15 3.414a2 2 0 0 0 .434-2.179Z" />
          </svg>
        </div>
      </Button>
    </div>
  );

  if (__DEV__ && min && max && min > max)
    throw new GistUiError("NumberInput", '"min" must be lower than "max"');
  if (__DEV__ && step > largeStep)
    throw new GistUiError("NumberInput", '"step" must be lower than "largeStep"');

  return (
    <Input
      {...rest}
      classNames={classNames}
      ref={mergeRefs(ref, innerRef)}
      type="number"
      endContent={
        <>
          {endContent}
          {buttons}
        </>
      }
      inputProps={{
        ...inputProps,
        onKeyDown: (e) => {
          inputProps?.onKeyDown?.(e);
          handleKeyDown(e);
        },
        onKeyUp: (e) => {
          inputProps?.onKeyUp?.(e);
          handleKeyUp(e);
        },
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
