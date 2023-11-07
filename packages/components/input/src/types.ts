import { InputHTMLAttributes } from "react";

export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | "onBlur"
  | "onFocus"
  | "value"
  | "name"
  | "defaultValue"
  | "placeholder"
  | "type"
  | "onChange"
  | "aria-label"
  | "aria-labelledby"
  | "aria-describedby"
  | "aria-required"
  | "aria-invalid"
  | "className"
  | "ref"
  | "id"
  | "disabled"
>;
