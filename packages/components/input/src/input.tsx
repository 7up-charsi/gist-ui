import { input, InputClassNames, InputVariantProps } from '@gist-ui/theme';
import { mergeProps, mergeRefs } from '@gist-ui/react-utils';
import { __DEV__ } from '@gist-ui/shared-utils';
import { useFocusRing } from '@react-aria/focus';
import { useControllableState } from '@gist-ui/use-controllable-state';
import { useCallbackRef } from '@gist-ui/use-callback-ref';
import { HoverEvents, useFocus, useHover } from '@react-aria/interactions';
import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
} from 'react';

export interface InputProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      'onChange' | 'color' | 'size' | 'type'
    >,
    Omit<InputVariantProps, 'error'>,
    HoverEvents {
  type?: 'text' | 'number' | 'password';
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  classNames?: InputClassNames;
  /**
   * When error prop is true, its value is used in "errorMessage" aria-live attribute
   * @default polite
   */
  a11yFeedback?: 'polite' | 'assertive';
}

const Input = forwardRef<HTMLDivElement, InputProps>((props, ref) => {
  const {
    label,
    id,
    helperText,
    errorMessage,
    startContent,
    endContent,
    value: valueProp,
    defaultValue,
    onBlur,
    onFocus,
    classNames,
    required,
    onChange: onChangeProp,
    onHoverChange,
    onHoverEnd,
    onHoverStart,
    isDisabled,
    error,
    color,
    fullWidth,
    hideLabel,
    size,
    type = 'text',
    a11yFeedback = 'polite',
    variant = 'filled',
    ...inputProps
  } = props;

  const labelId = useId();
  const helperTextId = useId();
  const errorMessageId = useId();
  const inputId = id || labelId;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);

  const onChange = useCallbackRef(onChangeProp);

  useEffect(() => {
    if (__DEV__) {
      if (!label)
        console.warn(
          '`Input` "label" prop is optional but recommended. if you want to hide label then pass "hideLabel" prop as well',
        );
    }
  }, [label]);

  useImperativeHandle(
    ref,
    () => {
      inputWrapperRef.current!.focus = () => {
        inputRef.current?.focus();
      };

      return inputWrapperRef.current!;
    },
    [],
  );

  const [value, setValue] = useControllableState({
    defaultValue: defaultValue || '',
    value: valueProp,
    onChange,
  });

  const {
    focusProps: focusRingProps,
    isFocusVisible,
    isFocused,
  } = useFocusRing({ isTextInput: true });

  const { hoverProps, isHovered } = useHover({
    isDisabled,
    onHoverChange,
    onHoverEnd,
    onHoverStart,
  });

  const { focusProps } = useFocus<HTMLInputElement>({ onFocus, onBlur });

  const styles = input({
    isDisabled,
    error,
    color,
    fullWidth,
    hideLabel,
    size,
    variant,
  });

  return (
    <div
      className={styles.base({ className: classNames?.base })}
      data-focused={isFocused}
      data-focus-visible={isFocusVisible && isFocused}
      data-filled={!!value}
      data-shrink={isFocused || !!value || !!startContent}
      data-hovered={isHovered}
      data-disabled={isDisabled}
    >
      <div
        ref={mergeRefs(ref, inputWrapperRef)}
        className={styles.inputWrapper({ className: classNames?.inputWrapper })}
        {...hoverProps}
        onPointerDown={(e) => {
          if (isDisabled) return;
          if (e.button !== 0) return;
          if (e.target !== inputRef.current) {
            e.preventDefault();
            inputRef.current?.focus();
          }
        }}
      >
        {!hideLabel && !!label && (
          <label
            htmlFor={inputId}
            className={styles.label({ className: classNames?.label })}
          >
            {label}
          </label>
        )}

        {startContent && (
          <div
            className={styles.startContent({
              className: classNames?.startContent,
            })}
          >
            {startContent}
          </div>
        )}

        <input
          {...inputProps}
          {...mergeProps(focusProps, focusRingProps)}
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label={hideLabel ? label : undefined}
          aria-describedby={helperText ? helperTextId : undefined}
          aria-errormessage={error && errorMessage ? errorMessageId : undefined}
          aria-required={required}
          aria-invalid={error}
          className={styles.input({ className: classNames?.input })}
          ref={inputRef}
          id={inputId}
          disabled={isDisabled}
        />

        {endContent && (
          <div
            className={styles.endContent({ className: classNames?.endContent })}
          >
            {endContent}
          </div>
        )}

        {variant === 'border' ? (
          <fieldset
            aria-hidden="true"
            className={styles.fieldset({ className: classNames?.fieldset })}
          >
            {!hideLabel && (
              <legend
                className={styles.legend({ className: classNames?.legend })}
              >
                {label}
              </legend>
            )}
          </fieldset>
        ) : null}
      </div>

      {!error && helperText && (
        <div
          id={helperTextId}
          className={styles.helperText({ className: classNames?.helperText })}
        >
          {helperText}
        </div>
      )}

      {error && errorMessage && (
        <div
          id={errorMessageId}
          aria-live={a11yFeedback}
          className={styles.helperText({ className: classNames?.helperText })}
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'gist-ui.Input';

export default Input;
