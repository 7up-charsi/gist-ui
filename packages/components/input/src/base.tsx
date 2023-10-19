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
import { input, InputVariantProps } from "@front-ui/theme";
import { mergeEvents, mergeRefs } from "@front-ui/react-utils";

export interface BaseInputProps
  extends Omit<InputVariantProps, "startContent">,
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
  });

  const labelId = useId();
  const innerRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState({ isFocused: false, value: "" });

  // const { focusProps, isFocusVisible, isFocused } = useFocusRing(props);
  // const { hoverProps, isHovered } = useHover(props);

  const labelHTML = (
    <label htmlFor={id || labelId} className={labelStyles()}>
      {label}
    </label>
  );

  return (
    <div
      className={outerWrapper()}
      data-focused={state.isFocused}
      data-filled={!!state.value.length}
    >
      {labelPlacement?.includes("outside") && labelHTML}

      <div className={innerWrapper()}>
        <div
          className={inputWrapper()}
          onPointerDown={(e) => {
            e.preventDefault();
            innerRef.current?.focus();
            setState((prev) => ({ ...prev, isFocused: true }));
          }}
        >
          {startContent}
          <input
            {...restProps}
            type={type}
            className={inputStyles()}
            ref={mergeRefs(ref, innerRef) as LegacyRef<HTMLInputElement>}
            id={id || labelId}
            {...mergeEvents(
              {
                onBlur: (e: FocusEvent<HTMLInputElement>) => {
                  setState((prev) => ({ ...prev, isFocused: false, value: e.target.value }));
                },
              },
              { onBlur: props.onBlur },
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

BaseInput.displayName = "front-ui.BaseInput";

export default BaseInput;
