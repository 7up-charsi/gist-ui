import { forwardRef, useRef } from "react";
import Input, { InputProps } from "./input";
import { mergeRefs } from "@gist-ui/react-utils";

export interface NumberInputProps extends Omit<InputProps, "type"> {
  inputMode?: "decimal" | "numeric";
  min?: number;
  max?: number;
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>((props, ref) => {
  const { inputMode = "numeric", inputProps, ...rest } = props;

  const innerRef = useRef<HTMLInputElement>(null);

  return (
    <Input
      {...rest}
      ref={mergeRefs(ref, innerRef)}
      type="text"
      inputProps={{
        ...inputProps,
        inputMode,
      }}
    />
  );
});

NumberInput.displayName = "gist-ui.NumberInput";

export default NumberInput;
