import {
  InputHTMLAttributes,
  LegacyRef,
  ReactNode,
  forwardRef,
  useId,
  useRef,
  useState,
} from "react";
import { input, InputVariantProps } from "@gist-ui/theme";
import { mergeProps, mergeRefs } from "@gist-ui/react-utils";
import { useFocus, useFocusRing, useHover } from "react-aria";

export interface BaseInputProps
  extends Omit<InputVariantProps, "chips">,
    Omit<InputHTMLAttributes<HTMLInputElement>, "color" | "size"> {
  isClearable?: boolean;
  label?: string;
  type?: string;
  description?: string;
  errorMessage?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  error?: boolean;
  chips?: ReactNode;
}

const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>((props, ref) => {
  const {
    label,
    type,
    id,
    description,
    error,
    errorMessage,
    color,
    size,
    rounded,
    fullWidth,
    isDisabled,
    className,
    variant,
    startContent,
    endContent,
    labelPlacement,
    placeholder,
    value,
    defaultValue,
    chips,
    onBlur,
    onFocus,
    ...restProps
  } = props;

  const {
    base,
    inputWrapper,
    label: labelStyles,
    input: inputStyles,
    helperText,
    endWrapper,
    wrapper,
  } = input({
    className,
    color,
    fullWidth,
    isDisabled,
    rounded,
    size,
    variant,
    labelPlacement,
    chips: !!chips,
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
      className={base()}
      data-focused={isFocused}
      data-focus-visible={isFocusVisible && isFocused}
      data-filled={filled}
      data-filled-within={isFocused || filled || !!placeholder || !!startContent}
      data-hovered={isHovered}
    >
      {labelPlacement?.includes("outside") && (
        <label htmlFor={id || labelId} className={labelStyles()}>
          {label}
        </label>
      )}

      <div
        className={wrapper()}
        onClick={() => {
          innerRef.current?.focus();
        }}
        {...hoverProps}
      >
        <div className={inputWrapper()}>
          {labelPlacement?.includes("inside") && (
            <label htmlFor={id || labelId} className={labelStyles()}>
              {label}
            </label>
          )}
          {startContent}
          {chips}
          <input
            {...restProps}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            type={type}
            className={inputStyles()}
            ref={mergeRefs(ref, innerRef) as LegacyRef<HTMLInputElement>}
            id={id || labelId}
            {...mergeProps(focusProps as never)}
          />
        </div>

        <div className={endWrapper()}>{endContent}</div>
      </div>

      {description && !error && <div className={helperText()}>{description} </div>}
      {error && <div className={helperText()}>{errorMessage} </div>}
    </div>
  );
});

BaseInput.displayName = "gist-ui.BaseInput";

export default BaseInput;
