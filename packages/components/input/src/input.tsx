import { input, InputClassNames, InputVariantProps } from '@gist-ui/theme';
import { mergeProps, mergeRefs } from '@gist-ui/react-utils';
import { __DEV__ } from '@gist-ui/shared-utils';
import { HoverProps, useFocus, useHover } from '@react-aria/interactions';
import { useFocusRing } from '@react-aria/focus';
import { NativeInputProps } from './types';
import { useCallbackRef } from '@gist-ui/use-callback-ref';
import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

export interface InputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color' | 'className'>,
    Omit<InputVariantProps, 'error'>,
    HoverProps {
  type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url';
  id?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  name?: string;
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
  inputProps?: NativeInputProps;
}

const Input = forwardRef<HTMLDivElement, InputProps>((props, ref) => {
  const {
    label,
    type = 'text',
    id,
    helperText,
    errorMessage,
    startContent,
    endContent,
    placeholder,
    value,
    defaultValue,
    onBlur: onBlurProp,
    onFocus: onFocusProp,
    classNames,
    name,
    required,
    a11yFeedback = 'polite',
    inputProps,
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
    variant = 'filled',
    ...inputWrapperProps
  } = props;

  const labelId = useId();
  const helperTextId = useId();
  const errorMessageId = useId();
  const inputId = id || labelId;

  const onBlur = useCallbackRef(onBlurProp);
  const onFocus = useCallbackRef(onFocusProp);
  const onChange = useCallbackRef(onChangeProp);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputBaseRef = useRef<HTMLDivElement>(null);
  const inputLabelRef = useRef<HTMLLabelElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);

  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    if (__DEV__ && !label)
      console.warn(
        '`Input` "label" prop is optional but recommended. if you want to hide label then pass "hideLabel" prop as well',
      );
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

  const { focusProps } = useFocus<HTMLInputElement>({
    onFocus: (e) => {
      onFocus?.(e);
      focusRingProps.onFocus?.(e);
    },
    onBlur: (e) => {
      onBlur?.(e);
      setHasValue(!!e.target.value);
      focusRingProps.onBlur?.(e);
    },
  });

  const styles = input({
    isDisabled,
    error,
    color,
    fullWidth,
    hideLabel,
    size,
    variant,
  });

  const filled = !!value || hasValue || !!defaultValue;

  return (
    <div
      ref={inputBaseRef}
      className={styles.base({ className: classNames?.base })}
      data-focused={isFocused}
      data-focus-visible={isFocusVisible && isFocused}
      data-filled={filled}
      data-filled-within={isFocused || filled || !!startContent}
      data-hovered={isHovered}
      data-disabled={isDisabled}
    >
      <div
        ref={mergeRefs(ref, inputWrapperRef)}
        className={styles.inputWrapper({ className: classNames?.inputWrapper })}
        {...mergeProps(hoverProps, inputWrapperProps, {
          onPointerUp: (e: React.PointerEvent) => {
            if (isDisabled) return;
            if (e.button !== 0) return;
            if (e.currentTarget === e.target) inputRef.current?.focus();
          },
        })}
      >
        {!hideLabel && !!label && (
          <label
            ref={inputLabelRef}
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
          {...focusProps}
          value={value}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          type={type}
          onChange={onChange}
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
