import { input, InputClassNames, InputVariantProps } from "@gist-ui/theme";
import { mergeProps, mergeRefs } from "@gist-ui/react-utils";
import { __DEV__ } from "@gist-ui/shared-utils";
import { VisuallyHidden } from "@gist-ui/visually-hidden";
import { HoverProps, useFocus, useHover } from "@react-aria/interactions";
import { useFocusRing } from "@react-aria/focus";
import { NativeInputProps } from "./types";
import omit from "lodash.omit";
import pick from "lodash.pick";
import { useCallbackRef } from "@gist-ui/use-callback-ref";
import {
  forwardRef,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const hoverPropsKeys = ["onHoverStart", "onHoverEnd", "onHoverChange"] as const;

export interface InputProps
  extends Omit<
      InputVariantProps,
      "hideNativeInput" | "customPlaceholder" | "error"
    >,
    HoverProps {
  type?: "text" | "number" | "email" | "password" | "tel" | "url";
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
  hideLabel?: boolean;
  /**
   * When error prop is true, its value is used in "errorMessage" aria-live attribute
   * @default polite
   */
  a11yFeedback?: "polite" | "assertive";
  inputProps?: NativeInputProps;
  /**
   * Indicates whether to use native input or div. As div is used when you dont want to allow select input text
   * @default false
   */
  hideNativeInput?: boolean;
}

const Input = forwardRef<HTMLDivElement, InputProps>((_props, ref) => {
  const variantProps = pick(_props, ...input.variantKeys);
  const hoverHookProps = pick(_props, ...hoverPropsKeys);

  const props = omit(_props, ...input.variantKeys, ...hoverPropsKeys);

  const {
    label,
    type = "text",
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
    hideLabel,
    required,
    a11yFeedback = "polite",
    inputProps,
    onChange: onChangeProp,
  } = props;

  const {
    error,
    isDisabled,
    labelPlacement = "outside",
    hideNativeInput,
  } = variantProps;

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
  const [filled, setFilled] = useState(!!defaultValue);

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
    error,
  });

  const labelHTML = !!label && (
    <label
      ref={inputLabelRef}
      htmlFor={inputId}
      className={styles.label({ className: classNames?.label })}
    >
      {label}
      {required && (
        <span
          className={styles.required({ className: classNames?.required })}
          aria-hidden="true"
        >
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
      data-filled-within={isFocused || filled || !!placeholder}
      data-hovered={isHovered}
      data-is-disabled={isDisabled}
    >
      {!hideLabel && labelPlacement?.includes("outside") && labelHTML}

      <div
        ref={mergeRefs(ref, inputWrapperRef)}
        className={styles.inputWrapper({ className: classNames?.inputWrapper })}
        {...mergeProps(hoverProps, {
          onPointerUp: (e: React.PointerEvent) => {
            if (isDisabled) return;
            if (e.button !== 0) return;
            if (e.currentTarget === e.target) inputRef.current?.focus();
          },
        })}
      >
        {!hideLabel && labelPlacement?.includes("inside") && labelHTML}

        {/* show label inside inputWrapper when hideLabel is true,
        because inputWrapper has position relative and VisuallyHidden element set position absolute */}
        {hideLabel && <VisuallyHidden asChild>{labelHTML}</VisuallyHidden>}

        {startContent}

        {hideNativeInput ? (
          <div
            className={styles.customInput({
              className: classNames?.input,
              customPlaceholder: !!(placeholder && !value),
            })}
          >
            {value || placeholder}
          </div>
        ) : null}
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
          ref={inputRef}
          id={inputId}
          disabled={isDisabled}
        />
        {endContent}
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

Input.displayName = "gist-ui.Input";

export default Input;
