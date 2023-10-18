import { InputHTMLAttributes, ReactNode, forwardRef, useId } from "react";
import { input, InputVariantProps } from "@front-ui/theme";
import { mergeProps, useFocusRing, useHover } from "react-aria";

export interface BaseInputProps
  extends InputVariantProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, "color" | "size"> {
  isClearable?: boolean;
  label?: string;
  type?: string;
  description?: string;
  errorMessage?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
}

const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>((props, ref) => {
  const {
    label,
    type,
    labelPlacement = "inside",
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
    ...restProps
  } = props;

  const {
    inputWrapper,
    label: labelStyles,
    input: inputStyles,
    helperText,
    mainWrapper,
  } = input({
    className,
    color,
    error,
    fullWidth,
    isDisabled,
    labelPlacement,
    rounded,
    size,
    variant,
  });

  const labelId = useId();

  const { focusProps, isFocusVisible, isFocused } = useFocusRing(props);
  const { hoverProps, isHovered } = useHover(props);

  return (
    <div
      className={mainWrapper()}
      data-focused={isFocused}
      data-keyboard-focus={isFocusVisible && isFocused}
      data-hovered={isHovered}
      {...hoverProps}
    >
      <label htmlFor={id || labelId} className={labelStyles()}>
        {label}
      </label>

      <div className={inputWrapper()}>
        {startContent}
        <input
          {...restProps}
          type={type}
          className={inputStyles()}
          ref={ref}
          id={id || labelId}
          {...mergeProps(focusProps)}
        />
        {endContent}
      </div>

      {description && !error && <div className={helperText()}>{description} </div>}
      {error && <div className={helperText()}>{errorMessage} </div>}
    </div>
  );
});

BaseInput.displayName = "front-ui.BaseInput";

export default BaseInput;
