import { VariantProps, tv } from "tailwind-variants";
import { inputDataFocusVisible } from "../classes";

const input = tv({
  slots: {
    base: "flex flex-col gap-1 w-64 group",
    wrapper: [
      "w-full flex gap-2 cursor-text transition-[background,border]",
      inputDataFocusVisible,
    ],
    inputWrapper: "flex flex-wrap gap-2 items-center grow",
    endWrapper: "flex items-center justify-end",
    input: "appearance-none bg-transparent outline-none min-w-[50px] max-h-[24px] w-0 grow text-sm",
    label: "first-letter:uppercase whitespace-nowrap text-sm",
    helperText: "px-1 text-xs",
  },
  variants: {
    variant: {
      border: {},
      flat: {},
    },
    color: {
      neutral: {},
      primary: {},
      secondary: {},
      success: {},
      info: {},
      warning: {},
      danger: {},
    },
    rounded: {
      none: { wrapper: "rounded-none" },
      sm: { wrapper: "rounded-small" },
      md: { wrapper: "rounded-medium" },
      lg: { wrapper: "rounded-large" },
      full: { wrapper: "rounded-full !px-4" },
    },
    size: {
      sm: { wrapper: "h-[40px] min-h-[40px] max-h-[40px] px-3 py-1", input: "text-sm" },
      md: { wrapper: "h-[48px] min-h-[48px] max-h-[48px] px-3 py-2", input: "text-md" },
      lg: { wrapper: "h-[64px] min-h-[64px] max-h-[64px] px-3 py-3", input: "text-md" },
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
    chips: {
      true: {},
    },
  },
  defaultVariants: {
    color: "neutral",
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
      color: "neutral",
      class: {
        wrapper:
          "border border-neutral-5 bg-neutral-3 group-data-[hovered=true]:bg-neutral-4 group-data-[hovered=true]:group-data-[focused=true]:bg-neutral-3 group-data-[focused=true]:group-data-[focus-visible=false]:border-neutral-9 text-neutral-11",
        label: "text-neutral-11",
        input: "text-neutral-12 placeholder:text-neutral-9",
        helperText: "text-neutral-11",
      },
    },
    {
      variant: "flat",
      color: "primary",
      class: {
        wrapper:
          "border border-primary-5 bg-primary-3 group-data-[hovered=true]:bg-primary-4 group-data-[hovered=true]:group-data-[focused=true]:bg-primary-3 group-data-[focused=true]:border-primary-9 text-primary-11",
        label: "text-primary-11",
        input: "text-primary-12 placeholder:text-primary-7",
        helperText: "text-primary-11",
      },
    },
    {
      variant: "flat",
      color: "secondary",
      class: {
        wrapper:
          "border border-secondary-5 bg-secondary-3 group-data-[hovered=true]:bg-secondary-4 group-data-[hovered=true]:group-data-[focused=true]:bg-secondary-3 group-data-[focused=true]:border-secondary-9 text-secondary-11",
        label: "text-secondary-11",
        input: "text-secondary-12 placeholder:text-secondary-9",
        helperText: "text-secondary-11",
      },
    },
    {
      variant: "flat",
      color: "success",
      class: {
        wrapper:
          "border border-success-5 bg-success-3 group-data-[hovered=true]:bg-success-4 group-data-[hovered=true]:group-data-[focused=true]:bg-success-3 group-data-[focused=true]:border-success-9 text-success-11",
        label: "text-success-11",
        input: "text-success-12 placeholder:text-success-9",
        helperText: "text-success-11",
      },
    },
    {
      variant: "flat",
      color: "info",
      class: {
        wrapper:
          "border border-info-5 bg-info-3 group-data-[hovered=true]:bg-info-4 group-data-[hovered=true]:group-data-[focused=true]:bg-info-3 group-data-[focused=true]:border-info-9 text-info-11",
        label: "text-info-11",
        input: "text-info-12 placeholder:text-info-9",
        helperText: "text-info-11",
      },
    },
    {
      variant: "flat",
      color: "warning",
      class: {
        wrapper:
          "border border-warning-5 bg-warning-3 group-data-[hovered=true]:bg-warning-4 group-data-[hovered=true]:group-data-[focused=true]:bg-warning-3 group-data-[focused=true]:border-warning-9 text-warning-11",
        label: "text-warning-11",
        input: "text-warning-12 placeholder:text-warning-9",
        helperText: "text-warning-11",
      },
    },
    {
      variant: "flat",
      color: "danger",
      class: {
        wrapper:
          "border border-danger-5 bg-danger-3 group-data-[hovered=true]:bg-danger-4 group-data-[hovered=true]:group-data-[focused=true]:bg-danger-3 group-data-[focused=true]:border-danger-9 text-danger-11",
        label: "text-danger-11",
        input: "text-danger-12 placeholder:text-danger-9",
        helperText: "text-danger-11",
      },
    },

    // border
    {
      variant: "border",
      color: "neutral",
      class: {
        wrapper:
          "border-2 border-neutral-6 group-data-[hovered=true]:border-neutral-7 group-data-[focused=true]:border-neutral-8 text-neutral-11",
        label: "text-neutral-11",
        input: "text-neutral-12 placeholder:text-neutral-9",
        helperText: "text-neutral-11",
      },
    },
    {
      variant: "border",
      color: "primary",
      class: {
        wrapper:
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
        wrapper:
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
        wrapper:
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
        wrapper:
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
        wrapper:
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
        wrapper:
          "border-2 border-danger-6 group-data-[hovered=true]:border-danger-7 group-data-[focused=true]:border-danger-8 text-danger-11",
        label: "text-danger-11",
        input: "text-danger-12 placeholder:text-danger-9",
        helperText: "text-danger-11",
      },
    },

    {
      chips: true,
      size: "sm",
      class: { wrapper: "h-auto min-h-[40px] max-h-[auto]" },
    },
    {
      chips: true,
      size: "md",
      class: { wrapper: "h-auto min-h-[48px] max-h-[auto]" },
    },
    {
      chips: true,
      size: "lg",
      class: { wrapper: "h-auto min-h-[64px] max-h-[auto]" },
    },
  ],
});

export type InputVariantProps = VariantProps<typeof input>;

export { input };
