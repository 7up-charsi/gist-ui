import { InputHTMLAttributes, ReactNode, forwardRef, useId, useRef, useState } from "react";
import { input, InputVariantProps } from "@gist-ui/theme";
import { mergeRefs } from "@gist-ui/react-utils";
import { __DEV__ } from "@gist-ui/shared-utils";
import { HoverEvents, useFocus, useFocusRing, useHover } from "react-aria";
import { InputProps } from "./types";

type ClassNames = { [key in keyof typeof input.slots]?: string };

export interface BaseInputProps
  extends InputVariantProps,
    HoverEvents,
    Pick<
      InputHTMLAttributes<HTMLInputElement>,
      | "id"
      | "placeholder"
      | "value"
      | "defaultValue"
      | "onBlur"
      | "onFocus"
      | "name"
      | "onChange"
      | "type"
    > {
  label: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  classNames?: ClassNames;
  hideLabel?: boolean;
  feedback?: "polite" | "assertive";
  inputProps?: InputProps;
}

const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>((props, ref) => {
  const {
    label,
    type,
    id,
    helperText,
    error,
    errorMessage,
    color,
    disabled,
    startContent,
    endContent,
    labelPlacement,
    placeholder,
    value,
    defaultValue,
    onBlur,
    onFocus,
    classNames,
    name,
    hideLabel,
    required,
    feedback = "polite",
    inputProps,
    onChange,
    onHoverChange,
    onHoverEnd,
    onHoverStart,
  } = props;

  const {
    base,
    inputWrapper,
    label: labelStyles,
    input: inputStyles,
    helperText: helperTextStyles,
    required: requiredStyles,
  } = input({
    ...props,
    disabled,
    color: error ? "danger" : color,
  });

  const labelId = useId();
  const helperTextId = useId();
  const errorMessageId = useId();
  const inputId = id || labelId;

  const innerRef = useRef<HTMLInputElement>(null);
  const [filled, setFilled] = useState(!!defaultValue);

  const {
    focusProps: focusRingProps,
    isFocusVisible,
    isFocused,
  } = useFocusRing({ isTextInput: true });

  const { hoverProps, isHovered } = useHover({
    onHoverChange,
    onHoverEnd,
    onHoverStart,
    isDisabled: disabled,
  });

  const { focusProps } = useFocus<HTMLInputElement>({
    onFocus: (e) => {
      onFocus?.(e);
      focusRingProps.onFocus?.(e);
    },
    onBlur: (e) => {
      setFilled(!!e.target.value.length);
      onBlur?.(e);
      focusRingProps.onBlur?.(e);
    },
  });

  const labelHTML = (
    <label htmlFor={id || labelId} className={labelStyles({ className: classNames?.label })}>
      {label}
      {required && <span className={requiredStyles({ className: classNames?.required })}>*</span>}
    </label>
  );

  if (__DEV__ && !label) throw new Error('Gist-ui BaseInput: "label" must be passed');

  return (
    <div
      className={base({ className: classNames?.base })}
      data-focused={isFocused}
      data-focus-visible={isFocusVisible && isFocused}
      data-filled={filled}
      data-filled-within={isFocused || filled || !!placeholder || !!startContent}
      data-hovered={isHovered}
      data-disabled={disabled}
    >
      {!hideLabel && labelPlacement?.includes("outside") && label && labelHTML}

      <div
        className={inputWrapper({ className: classNames?.inputWrapper })}
        onClick={() => {
          innerRef.current?.focus();
        }}
        {...hoverProps}
      >
        {!hideLabel && labelPlacement?.includes("inside") && label && labelHTML}
        {hideLabel && label && labelHTML}

        {startContent}
        <input
          {...inputProps}
          {...focusProps}
          value={value}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          type={type}
          onChange={onChange}
          aria-describedby={error ? errorMessageId : helperTextId}
          aria-required={required}
          aria-invalid={error}
          className={inputStyles({ className: classNames?.input })}
          ref={mergeRefs(ref, innerRef)}
          id={inputId}
          disabled={disabled}
        />
        {endContent}
      </div>

      {helperText && !error && (
        <div id={helperTextId} className={helperTextStyles({ className: classNames?.helperText })}>
          {helperText}
        </div>
      )}

      {error && errorMessage && (
        <div
          id={errorMessageId}
          aria-live={feedback}
          className={helperTextStyles({ className: classNames?.helperText })}
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
});

BaseInput.displayName = "gist-ui.BaseInput";

export default BaseInput;