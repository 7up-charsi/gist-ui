import { VariantProps, tv } from "tailwind-variants";
import { groupDataFocusVisible } from "../classes";

const input = tv({
  slots: {
    base: "flex flex-col gap-1 w-64 group",
    inputWrapper: [
      "w-full flex gap-2 items-center cursor-text transition-[background,border] px-2",
      groupDataFocusVisible,
    ],
    input: "appearance-none !bg-transparent outline-none h-full grow text-inherit w-0",
    label: "first-letter:uppercase whitespace-nowrap text-sm",
    helperText: "px-1 text-xs",
  },
  variants: {
    variant: {
      border: { inputWrapper: "border-2" },
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
        input: "",
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
        label: "ml-2 font-medium cursor-pointer place-self-start",
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
          "border-default-400 group-data-[focused=true]:group-data-[focus-visible=false]:border-default-600 text-default-600",
        label: "text-default-600",
        input: "placeholder:text-default-400",
        helperText: "text-default-600",
      },
    },
    {
      variant: "border",
      color: "primary",
      class: {
        inputWrapper:
          "border-primary-400 group-data-[focused=true]:group-data-[focus-visible=false]:border-primary-600 text-primary-600",
        label: "text-primary-600",
        input: "placeholder:text-primary-400",
        helperText: "text-primary-600",
      },
    },
    {
      variant: "border",
      color: "secondary",
      class: {
        inputWrapper:
          "border-secondary-400 group-data-[focused=true]:group-data-[focus-visible=false]:border-secondary-600 text-secondary-600",
        label: "text-secondary-600",
        input: "placeholder:text-secondary-400",
        helperText: "text-secondary-600",
      },
    },
    {
      variant: "border",
      color: "success",
      class: {
        inputWrapper:
          "border-success-400 group-data-[focused=true]:group-data-[focus-visible=false]:border-success-600 text-success-600",
        label: "text-success-600",
        input: "placeholder:text-success-400",
        helperText: "text-success-600",
      },
    },
    {
      variant: "border",
      color: "info",
      class: {
        inputWrapper:
          "border-info-400 group-data-[focused=true]:group-data-[focus-visible=false]:border-info-600 text-info-600",
        label: "text-info-600",
        input: "placeholder:text-info-400",
        helperText: "text-info-600",
      },
    },
    {
      variant: "border",
      color: "warning",
      class: {
        inputWrapper:
          "border-warning-400 group-data-[focused=true]:group-data-[focus-visible=false]:border-warning-600 text-warning-600",
        label: "text-warning-600",
        input: "placeholder:text-warning-400",
        helperText: "text-warning-600",
      },
    },
    {
      variant: "border",
      color: "danger",
      class: {
        inputWrapper:
          "border-danger-400 group-data-[focused=true]:group-data-[focus-visible=false]:border-danger-600 text-danger-600",
        label: "text-danger-600",
        input: "placeholder:text-danger-400",
        helperText: "text-danger-600",
      },
    },
  ],
});

export type InputVariantProps = VariantProps<typeof input>;

export { input };
