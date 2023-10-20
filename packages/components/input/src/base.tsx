import {
  FocusEvent,
  InputHTMLAttributes,
  LegacyRef,
  ReactNode,
  forwardRef,
  useId,
  useRef,
  useState,
} from "react";
import { input, InputVariantProps } from "@gist-ui/theme";
import { mergeEvents, mergeRefs } from "@gist-ui/react-utils";
import { useFocusWithin } from "react-aria";

export interface BaseInputProps
  extends Omit<InputVariantProps, "isLabelFloating" | "placeholder">,
    Omit<InputHTMLAttributes<HTMLInputElement>, "color" | "size"> {
  isClearable?: boolean;
  label?: string;
  type?: string;
  description?: string;
  errorMessage?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  error?: boolean;
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
    onBlur,
    ...restProps
  } = props;

  const {
    inputWrapper,
    label: labelStyles,
    input: inputStyles,
    helperText,
    innerWrapper,
    outerWrapper,
  } = input({
    className,
    color,
    fullWidth,
    isDisabled,
    rounded,
    size,
    variant,
    labelPlacement,
    isLabelPlaceholder: !placeholder && !startContent,
  });

  const labelId = useId();
  const innerRef = useRef<HTMLInputElement>(null);
  const [focusWithin, setFocusWithin] = useState(!!defaultValue);
  const [filled, setFilled] = useState(false);

  // const { focusProps, isFocusVisible, isFocused } = useFocusRing(props);
  // const { hoverProps, isHovered } = useHover(props);

  const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange: setFocusWithin,
  });

  const labelHTML = (
    <label htmlFor={id || labelId} className={labelStyles()}>
      {label}
    </label>
  );

  return (
    <div className={outerWrapper()} data-filled-within={focusWithin || filled || !!defaultValue}>
      {labelPlacement?.includes("outside") && labelHTML}

      <div className={innerWrapper()}>
        <div
          className={inputWrapper()}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              innerRef.current?.focus();
            }
          }}
          {...focusWithinProps}
        >
          {startContent}
          <input
            {...restProps}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            type={type}
            className={inputStyles()}
            ref={mergeRefs(ref, innerRef) as LegacyRef<HTMLInputElement>}
            id={id || labelId}
            {...mergeEvents(
              {
                onBlur: (e: FocusEvent<HTMLInputElement>) => {
                  setFilled(!!e.target.value.length);
                },
              },
              {
                onBlur,
              },
            )}
          />
          {labelPlacement?.includes("inside") && labelHTML}

          {endContent}
        </div>

        {description && !error && <div className={helperText()}>{description} </div>}
        {error && <div className={helperText()}>{errorMessage} </div>}
      </div>
    </div>
  );
});

BaseInput.displayName = "gist-ui.BaseInput";

export default BaseInput;
