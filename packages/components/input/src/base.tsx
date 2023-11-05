import { InputHTMLAttributes, ReactNode, forwardRef, useId, useRef, useState } from "react";
import { input, InputVariantProps } from "@gist-ui/theme";
import { mergeProps, mergeRefs } from "@gist-ui/react-utils";
import { useFocus, useFocusRing, useHover } from "react-aria";

type ClassNames = { [key in keyof typeof input.slots]?: string };

export interface BaseInputProps
  extends InputVariantProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, "color" | "size" | "className"> {
  isClearable?: boolean;
  label?: string;
  type?: string;
  helperText?: string;
  errorMessage?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  error?: boolean;
  classNames?: ClassNames;
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
    size,
    rounded,
    fullWidth,
    isDisabled,
    variant,
    startContent,
    endContent,
    labelPlacement,
    placeholder,
    value,
    defaultValue,
    onBlur,
    onFocus,
    classNames,
    ...restProps
  } = props;

  const {
    base,
    inputWrapper,
    label: labelStyles,
    input: inputStyles,
    helperText: helperTextStyles,
  } = input({
    color,
    fullWidth,
    isDisabled,
    rounded,
    size,
    variant,
    labelPlacement,
  });

  const labelId = useId();
  const innerRef = useRef<HTMLInputElement>(null);
  const [filled, setFilled] = useState(!!defaultValue);

  const {
    focusProps: focusRingProps,
    isFocusVisible,
    isFocused,
  } = useFocusRing({ isTextInput: true });

  const { hoverProps, isHovered } = useHover(props);

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

  return (
    <div
      className={base({ className: classNames?.base })}
      data-focused={isFocused}
      data-focus-visible={isFocusVisible && isFocused}
      data-filled={filled}
      data-filled-within={isFocused || filled || !!placeholder || !!startContent}
      data-hovered={isHovered}
    >
      {labelPlacement?.includes("outside") && (
        <label htmlFor={id || labelId} className={labelStyles({ className: classNames?.label })}>
          {label}
        </label>
      )}

      <div
        className={inputWrapper({ className: classNames?.inputWrapper })}
        onClick={() => {
          innerRef.current?.focus();
        }}
        {...hoverProps}
      >
        {labelPlacement?.includes("inside") && (
          <label htmlFor={id || labelId} className={labelStyles()}>
            {label}
          </label>
        )}

        {startContent}
        <input
          {...restProps}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          type={type}
          className={inputStyles({ className: classNames?.input })}
          ref={mergeRefs(ref, innerRef)}
          id={id || labelId}
          {...mergeProps(focusProps as never)}
        />
        {endContent}
      </div>

      {helperText && !error && (
        <div className={helperTextStyles({ className: classNames?.helperText })}>{helperText} </div>
      )}
      {error && <div className={helperTextStyles()}>{errorMessage} </div>}
    </div>
  );
});

BaseInput.displayName = "gist-ui.BaseInput";

export default BaseInput;
