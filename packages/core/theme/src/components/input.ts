import { VariantProps, tv } from "tailwind-variants";
import { inputDataFocusVisible } from "../classes";

const input = tv({
  slots: {
    base: "flex flex-col gap-1 w-64 group",
    inputWrapper: [
      "w-full flex gap-2 items-center cursor-text transition-[background,border] px-2",
      inputDataFocusVisible,
    ],
    input: "appearance-none !bg-transparent outline-none h-full grow text-inherit",
    label: "first-letter:uppercase whitespace-nowrap text-sm place-self-start",
    helperText: "px-1 text-xs",
  },
  variants: {
    variant: {
      border: {},
      flat: {},
    },
    color: {
      default: {},
      primary: {},
      secondary: {},
      success: {},
      info: {},
      warning: {},
      danger: {},
    },
    rounded: {
      none: { inputWrapper: "rounded-none" },
      sm: { inputWrapper: "rounded-sm" },
      md: { inputWrapper: "rounded-md" },
      lg: { inputWrapper: "rounded-lg" },
      full: { inputWrapper: "rounded-full !px-4" },
    },
    size: {
      sm: {
        inputWrapper: "h-[32px]",
        input: "text-sm",
      },
      md: {
        inputWrapper: "h-[40px]",
        input: "text-sm",
      },
      lg: {
        inputWrapper: "h-[48px]",
        input: "text-lg",
      },
    },
    fullWidth: {
      true: { base: "w-full" },
    },
    isDisabled: {
      true: { base: "disabled" },
    },
    labelPlacement: {
      inside: {
        label: "-order-1 pointer-events-none select-none text-sm mr-2 font-medium cursor-text",
      },
      outside: {
        label: "ml-2 font-medium cursor-pointer",
      },
    },
  },
  defaultVariants: {
    color: "default",
    fullWidth: false,
    isDisabled: false,
    rounded: "md",
    size: "md",
    variant: "flat",
    labelPlacement: "outside",
  },
  compoundVariants: [
    // flat
    {
      variant: "flat",
      color: "default",
      class: {
        inputWrapper:
          "border border-default-200 bg-default-100 group-data-[focused=true]:group-data-[focus-visible=false]:border-default-400 text-default-700",
        label: "text-default-600",
        input: "placeholder:text-default-400",
        helperText: "text-default-600",
      },
    },
    {
      variant: "flat",
      color: "primary",
      class: {
        inputWrapper:
          "border border-primary-200 bg-primary-100 group-data-[focused=true]:group-data-[focus-visible=false]:border-primary-400 text-primary-600",
        label: "text-primary-600",
        input: "placeholder:text-primary-400",
        helperText: "text-primary-600",
      },
    },
    {
      variant: "flat",
      color: "secondary",
      class: {
        inputWrapper:
          "border border-secondary-200 bg-secondary-100 group-data-[focused=true]:group-data-[focus-visible=false]:border-secondary-400 text-secondary-600",
        label: "text-secondary-600",
        input: "placeholder:text-secondary-400",
        helperText: "text-secondary-600",
      },
    },
    {
      variant: "flat",
      color: "success",
      class: {
        inputWrapper:
          "border border-success-200 bg-success-100 group-data-[focused=true]:group-data-[focus-visible=false]:border-success-400 text-success-600",
        label: "text-success-600",
        input: "placeholder:text-success-400",
        helperText: "text-success-600",
      },
    },
    {
      variant: "flat",
      color: "info",
      class: {
        inputWrapper:
          "border border-info-200 bg-info-100 group-data-[focused=true]:group-data-[focus-visible=false]:border-info-400 text-info-600",
        label: "text-info-600",
        input: "placeholder:text-info-400",
        helperText: "text-info-600",
      },
    },
    {
      variant: "flat",
      color: "warning",
      class: {
        inputWrapper:
          "border border-warning-200 bg-warning-100 group-data-[focused=true]:group-data-[focus-visible=false]:border-warning-400 text-warning-600",
        label: "text-warning-600",
        input: "placeholder:text-warning-400",
        helperText: "text-warning-600",
      },
    },
    {
      variant: "flat",
      color: "danger",
      class: {
        inputWrapper:
          "border border-danger-200 bg-danger-100 group-data-[focused=true]:group-data-[focus-visible=false]:border-danger-400 text-danger-600",
        label: "text-danger-600",
        input: "placeholder:text-danger-400",
        helperText: "text-danger-600",
      },
    },

    // border
    {
      variant: "border",
      color: "default",
      class: {
        inputWrapper:
          "border-2 border-default-6 group-data-[hovered=true]:border-default-7 group-data-[focused=true]:border-default-8 text-default-11",
        label: "text-default-11",
        input: "text-default-12 placeholder:text-default-9",
        helperText: "text-default-11",
      },
    },
    {
      variant: "border",
      color: "primary",
      class: {
        inputWrapper:
          "border-2 border-primary-6 group-data-[hovered=true]:border-primary-7 group-data-[focused=true]:border-primary-8 text-primary-11",
        label: "text-primary-11",
        input: "text-primary-12 placeholder:text-primary-9",
        helperText: "text-primary-11",
      },
    },
    {
      variant: "border",
      color: "secondary",
      class: {
        inputWrapper:
          "border-2 border-secondary-6 group-data-[hovered=true]:border-secondary-7 group-data-[focused=true]:border-secondary-8 text-secondary-11",
        label: "text-secondary-11",
        input: "text-secondary-12 placeholder:text-secondary-9",
        helperText: "text-secondary-11",
      },
    },
    {
      variant: "border",
      color: "success",
      class: {
        inputWrapper:
          "border-2 border-success-6 group-data-[hovered=true]:border-success-7 group-data-[focused=true]:border-success-8 text-success-11",
        label: "text-success-11",
        input: "text-success-12 placeholder:text-success-9",
        helperText: "text-success-11",
      },
    },
    {
      variant: "border",
      color: "info",
      class: {
        inputWrapper:
          "border-2 border-info-6 group-data-[hovered=true]:border-info-7 group-data-[focused=true]:border-info-8 text-info-11",
        label: "text-info-11",
        input: "text-info-12 placeholder:text-info-9",
        helperText: "text-info-11",
      },
    },
    {
      variant: "border",
      color: "warning",
      class: {
        inputWrapper:
          "border-2 border-warning-6 group-data-[hovered=true]:border-warning-7 group-data-[focused=true]:border-warning-8 text-warning-11",
        label: "text-warning-11",
        input: "text-warning-12 placeholder:text-warning-10",
        helperText: "text-warning-11",
      },
    },
    {
      variant: "border",
      color: "danger",
      class: {
        inputWrapper:
          "border-2 border-danger-6 group-data-[hovered=true]:border-danger-7 group-data-[focused=true]:border-danger-8 text-danger-11",
        label: "text-danger-11",
        input: "text-danger-12 placeholder:text-danger-9",
        helperText: "text-danger-11",
      },
    },
  ],
});

export type InputVariantProps = VariantProps<typeof input>;

export { input };
