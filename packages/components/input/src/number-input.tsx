import { forwardRef, useCallback, useRef } from 'react';
import Input, { InputProps } from './input';
import { mergeRefs } from '@gist-ui/react-utils';
import { NumberInputClassNames, numberInput } from '@gist-ui/theme';
import { Icon } from '@gist-ui/icon';
import { Button } from '@gist-ui/button';
import { __DEV__ } from '@gist-ui/shared-utils';
import { GistUiError } from '@gist-ui/error';
import { useControllableState } from '@gist-ui/use-controllable-state';
import { useLongPress } from '@react-aria/interactions';

export interface NumberInputProps
  extends Omit<InputProps, 'type' | 'onChange' | 'defaultValue'> {
  classNames?: InputProps['classNames'] & { stepButton: NumberInputClassNames };
  inputMode?: 'decimal' | 'numeric';
  min?: number;
  max?: number;
  step?: number;
  largeStep?: number;
  repeatRate?: number;
  threshold?: number;
  onChange?: (e: { target: { value: string } }) => void;
}

const NumberInput = forwardRef<HTMLDivElement, NumberInputProps>(
  (props, ref) => {
    const {
      classNames,
      inputMode = 'numeric',
      inputProps,
      min,
      max,
      step = 1,
      largeStep = 5,
      repeatRate = 100,
      threshold = 500,
      endContent,
      onChange,
      value: valueProp,
      ...rest
    } = props;

    const innerRef = useRef<HTMLDivElement>(null);

    const [value, setValue] = useControllableState({
      defaultValue: '',
      value: valueProp,
      onChange: (val) => {
        onChange?.({ target: { value: val } });
      },
    });

    const state = useRef<{
      longPressInterval?: NodeJS.Timeout;
      keyDownInterval?: NodeJS.Timeout;
      repeatedEvent?: boolean;
    }>({});

    const handleStepUp = useCallback(
      (toAdd = step) => {
        setValue((prev) => {
          const val = +prev;

          if (val === max) return prev;
          if (max && val > max) return max + '';
          if (min && val < min) return min + '';

          return max && val + toAdd > max ? max + '' : `${val + toAdd}`;
        });
      },
      [max, min, setValue, step],
    );

    const handleStepDown = useCallback(
      (toAdd = step) => {
        setValue((prev) => {
          const val = +prev;

          if (val === min) return prev;
          if (max && val > max) return max + '';
          if (min && val < min) return min + '';

          return min && +prev - toAdd < min ? min + '' : `${+prev - toAdd}`;
        });
      },
      [max, min, setValue, step],
    );

    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
      const ArrowUp = e.key === 'ArrowUp';
      const ArrowDown = e.key === 'ArrowDown';
      const PageUp = e.key === 'PageUp';
      const PageDown = e.key === 'PageDown';
      const Home = e.key === 'Home';
      const End = e.key === 'End';
      const repeatEvent = e.repeat;

      if (ArrowUp || ArrowDown || PageUp || PageDown || Home || End)
        e.preventDefault();

      if (ArrowUp && !repeatEvent) {
        handleStepUp();
        return;
      }

      if (ArrowDown && !repeatEvent) {
        handleStepDown();
        return;
      }

      if (PageUp && !repeatEvent) {
        handleStepUp(largeStep);
        return;
      }

      if (PageDown && !repeatEvent) {
        handleStepDown(largeStep);
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
          handleStepUp(largeStep);
        }, repeatRate);

        return;
      }

      if (PageDown && repeatEvent && !state.current.repeatedEvent) {
        state.current.repeatedEvent = true;

        state.current.keyDownInterval = setInterval(() => {
          handleStepDown(largeStep);
        }, repeatRate);

        return;
      }

      const target = innerRef.current;
      if (!target) return;

      if (Home && min) {
        setValue(min + '');
        return;
      }

      if (Home && !min) {
        setValue('0');
        return;
      }

      if (End && max) {
        setValue(max + '');
        return;
      }
    };

    const handleKeyUp: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
      const ArrowUp = e.key === 'ArrowUp';
      const ArrowDown = e.key === 'ArrowDown';
      const PageUp = e.key === 'PageUp';
      const PageDown = e.key === 'PageDown';

      if (ArrowUp || ArrowDown || PageUp || PageDown) {
        clearInterval(state.current.keyDownInterval);
        state.current.repeatedEvent = undefined;
        state.current.keyDownInterval = undefined;

        return;
      }
    };

    const { longPressProps: stepUpLongPressProps } = useLongPress({
      threshold,
      onLongPressStart: () => {
        innerRef.current?.focus();
        handleStepUp();
      },
      onLongPress: () => {
        state.current.longPressInterval = setInterval(handleStepUp, repeatRate);
        document.addEventListener(
          'pointerup',
          () => {
            clearInterval(state.current.longPressInterval);
            state.current.longPressInterval = undefined;
          },
          { once: true },
        );
      },
    });

    const { longPressProps: stepDownLongPressProps } = useLongPress({
      threshold,
      onLongPressStart: () => {
        innerRef.current?.focus();
        handleStepDown();
      },
      onLongPress: () => {
        state.current.longPressInterval = setInterval(
          handleStepDown,
          repeatRate,
        );
        document.addEventListener(
          'pointerup',
          () => {
            clearInterval(state.current.longPressInterval);
            state.current.longPressInterval = undefined;
          },
          { once: true },
        );
      },
    });

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
      },
      [setValue],
    );

    const styles = numberInput();

    const buttons = (
      <div
        ref={ref}
        className={styles.base({ className: classNames?.stepButton.base })}
      >
        {/* step up */}
        <Button
          aria-label="increase value"
          aria-description="long press to increase speedly"
          tabIndex={-1}
          isIconOnly
          size="sm"
          variant="text"
          color="neutral"
          preventFocusOnPress
          {...stepUpLongPressProps}
          classNames={{
            base: styles.button({ className: classNames?.stepButton.button }),
          }}
        >
          <Icon
            fill
            classNames={{
              base: styles.icon({ className: classNames?.stepButton.icon }),
            }}
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 10"
            >
              <path d="M9.207 1A2 2 0 0 0 6.38 1L.793 6.586A2 2 0 0 0 2.207 10H13.38a2 2 0 0 0 1.414-3.414L9.207 1Z" />
            </svg>
          </Icon>
        </Button>

        {/* step down */}
        <Button
          aria-label="decrease value"
          aria-description="long press to decrease speedly"
          tabIndex={-1}
          isIconOnly
          size="sm"
          variant="text"
          color="neutral"
          preventFocusOnPress
          {...stepDownLongPressProps}
          classNames={{
            base: styles.button({ className: classNames?.stepButton.button }),
          }}
        >
          <Icon
            fill
            classNames={{
              base: styles.icon({ className: classNames?.stepButton.icon }),
            }}
          >
            <svg
              className={styles.icon({
                className: classNames?.stepButton.icon,
              })}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 10"
            >
              <path d="M15.434 1.235A2 2 0 0 0 13.586 0H2.414A2 2 0 0 0 1 3.414L6.586 9a2 2 0 0 0 2.828 0L15 3.414a2 2 0 0 0 .434-2.179Z" />
            </svg>
          </Icon>
        </Button>
      </div>
    );

    if (__DEV__ && min && max && min > max)
      throw new GistUiError('NumberInput', '"min" must be lower than "max"');
    if (__DEV__ && step > largeStep)
      throw new GistUiError(
        'NumberInput',
        '"step" must be lower than "largeStep"',
      );

    return (
      <Input
        {...rest}
        classNames={classNames}
        ref={mergeRefs(ref, innerRef)}
        type="number"
        value={value}
        onChange={handleChange}
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
  },
);

NumberInput.displayName = 'gist-ui.NumberInput';

export default NumberInput;
