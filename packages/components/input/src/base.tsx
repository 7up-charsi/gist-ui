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
import { useFocusWithin, useHover } from "react-aria";
import { IconContext } from "@gist-ui/icon";

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
  });

  const labelId = useId();
  const innerRef = useRef<HTMLInputElement>(null);
  const [focusWithin, setFocusWithin] = useState(false);
  const [filled, setFilled] = useState(!!defaultValue);

  // const { focusProps, isFocusVisible, isFocused } = useFocusRing(props);
  const { hoverProps, isHovered } = useHover(props);

  const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange: setFocusWithin,
  });

  return (
    <IconContext.Provider value={{ size }}>
      <div
        className={base()}
        data-focused={focusWithin}
        data-filled={filled}
        data-filled-within={focusWithin || filled || !!placeholder || !!startContent}
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
          {...focusWithinProps}
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
          </div>

          <div className={endWrapper()}>{endContent}</div>
        </div>

        {description && !error && <div className={helperText()}>{description} </div>}
        {error && <div className={helperText()}>{errorMessage} </div>}
      </div>
    </IconContext.Provider>
  );
});

BaseInput.displayName = "gist-ui.BaseInput";

export default BaseInput;
