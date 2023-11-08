import { ReactNode, forwardRef, useCallback, useRef } from "react";
import Input, { InputProps } from "./input";
import { Button, ButtonProps } from "@gist-ui/button";
import { NumberInputVariantProps, numberInput } from "@gist-ui/theme";
import { Icon, IconProps } from "@gist-ui/icon";
import { mergeRefs } from "@gist-ui/react-utils";

export interface NumberInputProps extends NumberInputVariantProps, Omit<InputProps, "type"> {
  inputMode?: "decimal" | "numeric";
  min?: number;
  max?: number;
  invalidValue?: number;
  step?: number;
  buttonsPosition?: "start" | "end";
  startContentPosition?: "left" | "right";
  endContentPosition?: "left" | "right";
  hideButtons?: boolean;
  increaseContent?: ReactNode;
  decreaseContent?: ReactNode;
  increaseButtonProps?: Omit<ButtonProps, "onPress">;
  decreaseButtonProps?: Omit<ButtonProps, "onPress">;
  increaseIconProps?: IconProps;
  decreaseIconProps?: IconProps;
  classNames?: InputProps["classNames"] & { buttons?: string };
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>((props, ref) => {
  const {
    inputMode = "numeric",
    inputProps,
    buttonsPosition = "end",
    min,
    max,
    invalidValue = 0,
    step = 1,
    endContent,
    startContent,
    endContentPosition = "left",
    startContentPosition = "left",
    hideButtons,
    increaseContent,
    decreaseContent,
    increaseButtonProps,
    decreaseButtonProps,
    increaseIconProps,
    decreaseIconProps,
    showOnHover,
    classNames,

    ...rest
  } = props;

  const { buttons: buttonsStyles } = numberInput({ showOnHover });

  const innerRef = useRef<HTMLInputElement>(null);

  const handleDecrease = useCallback(() => {
    const target = innerRef.current;

    if (!target) return;
    const value = +target.value;

    if (min && value <= min) {
      target.value = min + "";

      return;
    }

    if (!isNaN(value)) {
      target.value = `${value - step}`;
    } else {
      target.value = invalidValue + "";
    }
  }, []);

  const handleIncrease = useCallback(() => {
    const target = innerRef.current;

    if (!target) return;
    const value = +target.value;

    if (max && value >= max) {
      target.value = max + "";

      return;
    }

    if (!isNaN(value)) {
      target.value = `${value + step}`;
    } else {
      target.value = invalidValue + "";
    }
  }, []);

  const buttons = !hideButtons && (
    <div className={buttonsStyles({ className: classNames?.buttons })}>
      {/* decrease */}
      <Button
        isIconOnly
        size="sm"
        variant="text"
        rounded="full"
        {...decreaseButtonProps}
        onPress={handleDecrease}
      >
        <Icon size="sm" color="default" {...decreaseIconProps}>
          {decreaseContent || (
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1v12m0 0 4-4m-4 4L1 9"
              />
            </svg>
          )}
        </Icon>
      </Button>

      {/* increase */}
      <Button
        isIconOnly
        size="sm"
        variant="text"
        rounded="full"
        {...increaseButtonProps}
        onPress={handleIncrease}
      >
        <Icon size="sm" color="default" {...increaseIconProps}>
          {increaseContent || (
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13V1m0 0L1 5m4-4 4 4"
              />
            </svg>
          )}
        </Icon>
      </Button>
    </div>
  );

  return (
    <Input
      classNames={classNames}
      ref={mergeRefs(ref, innerRef)}
      {...rest}
      type="text"
      inputProps={{
        ...inputProps,
        inputMode,
      }}
      startContent={
        <>
          {startContentPosition === "left" && startContent}
          {buttonsPosition === "start" && buttons}
          {startContentPosition === "right" && startContent}
        </>
      }
      endContent={
        <>
          {endContentPosition === "left" && endContent}
          {buttonsPosition === "end" && buttons}
          {endContentPosition === "right" && endContent}
        </>
      }
    />
  );
});

NumberInput.displayName = "gist-ui.NumberInput";

export default NumberInput;
