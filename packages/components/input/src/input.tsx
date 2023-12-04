import { input, InputClassNames, InputVariantProps } from "@gist-ui/theme";
import { mergeRefs } from "@gist-ui/react-utils";
import { __DEV__ } from "@gist-ui/shared-utils";
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
import omit from "lodash.omit";
import pick from "lodash.pick";

const hoverPropsKeys = ["onHoverStart", "onHoverEnd", "onHoverChange"] as const;

export interface CustomInputElement extends HTMLInputElement {
  inputWrapper: HTMLDivElement | null;
  inputBase: HTMLDivElement | null;
  inputLabel: HTMLLabelElement | null;
}

export interface InputProps extends InputVariantProps, HoverProps {
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
  label?: string;
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
}

const Input = forwardRef<CustomInputElement, InputProps>((_props, ref) => {
  const variantProps = pick(_props, ...input.variantKeys);
  const hoverHookProps = pick(_props, ...hoverPropsKeys);

  const props = omit(_props, ...input.variantKeys, ...hoverPropsKeys);

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
  } = props;

  const { color, isDisabled, labelPlacement = "outside" } = variantProps;

  const labelId = useId();
  const helperTextId = useId();
  const errorMessageId = useId();
  const inputId = id || labelId;

  const inputRef = useRef<CustomInputElement | null>(null);
  const inputBaseRef = useRef<HTMLDivElement>(null);
  const inputLabelRef = useRef<HTMLLabelElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const [filled, setFilled] = useState(!!defaultValue);

  useImperativeHandle(
    ref,
    () => {
      inputRef.current!.inputWrapper = inputWrapperRef.current;
      inputRef.current!.inputBase = inputBaseRef.current;
      inputRef.current!.inputLabel = inputLabelRef.current;

      return inputRef.current as CustomInputElement;
    },

    [],
  );

  const {
    focusProps: focusRingProps,
    isFocusVisible,
    isFocused,
  } = useFocusRing({ isTextInput: true });

  const { hoverProps, isHovered } = useHover({ ...hoverHookProps, isDisabled });

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

  const styles = input({
    ...variantProps,
    isDisabled,
    color: error ? "danger" : color,
  });

  const labelHTML = !!label && (
    <label
      ref={inputLabelRef}
      htmlFor={inputId}
      className={styles.label({ className: classNames?.label })}
    >
      {label}
      {required && (
        <span className={styles.required({ className: classNames?.required })} aria-hidden="true">
          *
        </span>
      )}
    </label>
  );

  if (__DEV__ && !label)
    console.warn(
      '`Input` "label" prop is optional but recommended. if you want to hide label then pass "hideLabel" prop as well',
    );

  return (
    <div
      ref={inputBaseRef}
      className={styles.base({ className: classNames?.base })}
      data-focused={isFocused}
      data-focus-visible={isFocusVisible && isFocused}
      data-filled={filled}
      data-filled-within={isFocused || filled || !!placeholder || !!startContent}
      data-hovered={isHovered}
      data-is-disabled={isDisabled}
    >
      {!hideLabel && labelPlacement?.includes("outside") && labelHTML}

      <div
        ref={inputWrapperRef}
        className={styles.inputWrapper({ className: classNames?.inputWrapper })}
        {...hoverProps}
        onPointerUp={(e) => {
          hoverProps.onPointerUp?.(e);
          if (e.target === e.currentTarget) inputRef.current?.focus();
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
          aria-describedby={helperText ? helperTextId : undefined}
          aria-errormessage={error && errorMessage ? errorMessageId : undefined}
          aria-required={required}
          aria-invalid={error}
          className={styles.input({ className: classNames?.input })}
          ref={mergeRefs(ref, inputRef)}
          id={inputId}
          disabled={isDisabled}
        />
        {endContent}
      </div>

      {helperText && (
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
