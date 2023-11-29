import { input, InputClassNames, InputVariantProps } from "@gist-ui/theme";
import { mapProps, mergeRefs } from "@gist-ui/react-utils";
import { __DEV__ } from "@gist-ui/shared-utils";
import { GistUiError } from "@gist-ui/error";
import { VisuallyHidden } from "@gist-ui/visually-hidden";
import { HoverProps, useFocus, useFocusRing, useHover } from "react-aria";
import { NativeInputProps } from "./types";
import {
  ChangeEventHandler,
  FocusEventHandler,
  ReactNode,
  forwardRef,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export interface CustomInputElement extends HTMLInputElement {
  inputWrapper: HTMLDivElement | null;
}

export interface InputProps extends InputVariantProps {
  type?: "text" | "number" | "email" | "password" | "tel" | "url";
  id?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  name?: string;
  label: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  classNames?: InputClassNames;
  hideLabel?: boolean;
  /**
   * When error prop is true, its value is used in "errorMessage" aria-live attribute
   * @default polite
   */
  a11yFeedback?: "polite" | "assertive";
  inputProps?: NativeInputProps;
  hoverProps?: HoverProps;
}

const Input = forwardRef<CustomInputElement, InputProps>((_props, ref) => {
  const [props, variantProps] = mapProps({ ..._props }, input.variantKeys);

  const {
    label,
    type = "text",
    id,
    helperText,
    error,
    errorMessage,
    startContent,
    endContent,
    placeholder,
    value,
    defaultValue,
    onBlur,
    onFocus,
    classNames,
    name,
    hideLabel,
    required,
    a11yFeedback = "polite",
    inputProps,
    onChange,
    hoverProps: hoverHookProps = {},
  } = props;

  const { color, disabled, labelPlacement } = variantProps;

  const labelId = useId();
  const helperTextId = useId();
  const errorMessageId = useId();
  const inputId = id || labelId;

  const inputRef = useRef<CustomInputElement | null>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const [filled, setFilled] = useState(!!defaultValue);

  useImperativeHandle(
    ref,
    () =>
      ({
        inputWrapper: inputWrapperRef.current,
      }) as CustomInputElement,

    [],
  );

  const {
    focusProps: focusRingProps,
    isFocusVisible,
    isFocused,
  } = useFocusRing({ isTextInput: true });

  const { hoverProps, isHovered } = useHover(
    disabled ? { isDisabled: true } : { ...hoverHookProps },
  );

  const { focusProps } = useFocus<HTMLInputElement>(
    disabled
      ? { isDisabled: true }
      : {
          onFocus: (e) => {
            onFocus?.(e);
            focusRingProps.onFocus?.(e);
          },
          onBlur: (e) => {
            setFilled(!!e.target.value.length);
            onBlur?.(e);
            focusRingProps.onBlur?.(e);
          },
        },
  );

  const styles = input({
    ...variantProps,
    disabled,
    color: error ? "danger" : color,
  });

  const labelHTML = !!label && (
    <label htmlFor={inputId} className={styles.label({ className: classNames?.label })}>
      {label}
      {required && (
        <span className={styles.required({ className: classNames?.required })} aria-hidden="true">
          *
        </span>
      )}
    </label>
  );

  if (__DEV__ && !label)
    throw new GistUiError(
      "Input",
      '"label" prop is required. if you want to hide label then pass "hideLabel" prop as well',
    );

  return (
    <div
      className={styles.base({ className: classNames?.base })}
      data-focused={isFocused}
      data-focus-visible={isFocusVisible && isFocused}
      data-filled={filled}
      data-filled-within={isFocused || filled || !!placeholder || !!startContent}
      data-hovered={isHovered}
      data-disabled={disabled}
    >
      {!hideLabel && labelPlacement?.includes("outside") && labelHTML}

      <div
        ref={inputWrapperRef}
        className={styles.inputWrapper({ className: classNames?.inputWrapper })}
        {...hoverProps}
        onPointerUp={(e) => {
          hoverProps.onPointerUp?.(e);
          inputRef.current?.focus();
        }}
      >
        {!hideLabel && labelPlacement?.includes("inside") && labelHTML}

        {/* show label inside inputWrapper when hideLabel is true,
        because inputWrapper has position relative and VisuallyHidden element set position absolute */}
        {hideLabel && <VisuallyHidden asChild>{labelHTML}</VisuallyHidden>}

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
          aria-describedby={helperText && !error ? helperTextId : undefined}
          aria-errormessage={error && errorMessage ? errorMessageId : undefined}
          aria-required={required}
          aria-invalid={error}
          className={styles.input({ className: classNames?.input })}
          ref={mergeRefs(ref, inputRef)}
          id={inputId}
          disabled={disabled}
        />
        {endContent}
      </div>

      {helperText && !error && (
        <div id={helperTextId} className={styles.helperText({ className: classNames?.helperText })}>
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

Input.displayName = "gist-ui.Input";

export default Input;
