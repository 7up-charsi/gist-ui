import { VariantProps, tv } from "tailwind-variants";

const input = tv({
  slots: {
    base: "overflow-hidden flex gap-2 w-64 group/base",
    wrapper: "grow",
    inputWrapper:
      "overflow-hidden w-full flex gap-2 flex-wrap cursor-text transition-[background,border]",
    input: "appearance-none bg-transparent outline-none min-w-[25px] w-0 grow text-sm",
    label: "first-letter:uppercase whitespace-nowrap text-sm",
    helperText: "px-1 text-xs",
  },
  variants: {
    variant: {
      underline: {},
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
      none: {
        inputWrapper: "rounded-none",
      },
      sm: {
        inputWrapper: "rounded-small",
      },
      md: {
        inputWrapper: "rounded-medium",
      },
      lg: {
        inputWrapper: "rounded-large",
      },
      full: {
        inputWrapper: "rounded-full !px-4",
      },
    },
    size: {
      sm: {
        inputWrapper: "h-12 px-3 py-1",
      },
      md: {
        inputWrapper: "h-14 px-3 py-2",
      },
      lg: {
        inputWrapper: "h-16 px-3 py-3",
      },
    },
    fullWidth: {
      true: {
        base: "w-full",
      },
    },
    isDisabled: {
      true: { base: "disabled" },
    },
    labelPlacement: {
      "inside-left": {
        inputWrapper: "items-center",
        label: "-order-1 pointer-events-none select-none text-sm",
      },
      "inside-top": {
        inputWrapper: "relative",
        label: "absolute text-xs pointer-events-none select-none",
      },
      "inside-right": {
        inputWrapper: "items-center",
        input: "[direction:rtl]",
        label: "order-1 pointer-events-none select-none",
      },
      "outside-left": {
        label: "-order-1 translate-y-[14px]",
      },
      "outside-top": {
        base: "flex-col items-start gap-[2px]",
        label: "ml-2",
      },
      "outside-right": {
        label: "order-1 translate-y-[14px]",
        input: "[direction:rtl]",
      },
    },
    startContent: {
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
    labelPlacement: "inside-top",
  },
  compoundVariants: [
    {
      labelPlacement: "inside-top",
      size: ["sm", "md"],
      class: {
        input: "pt-[18px]",
        label:
          "top-1/2 -translate-y-1/2 text-sm transition-all group-data-[filled-within=true]/base:-translate-y-[calc(50%_+_10px)] group-data-[filled-within=true]/base:font-medium group-data-[filled-within=true]/base:text-xs",
      },
    },
    {
      labelPlacement: "inside-top",
      size: "lg",
      class: {
        input: "pt-[16px] text-md",
        label:
          "top-1/2 -translate-y-1/2 text-md transition-all group-data-[filled-within=true]/base:-translate-y-[calc(50%_+_11px)] group-data-[filled-within=true]/base:font-medium group-data-[filled-within=true]/base:text-sm",
      },
    },
    {
      labelPlacement: "inside-top",
      size: "sm",
      class: {
        inputWrapper: "py-1",
      },
    },
    {
      labelPlacement: "inside-top",
      size: "md",
      class: {
        inputWrapper: "py-2",
      },
    },

    // flat
    {
      variant: "flat",
      color: "neutral",
      class: {
        inputWrapper:
          "border border-neutral-5 bg-neutral-3 group-data-[hovered=true]/base:bg-neutral-4 group-data-[hovered=true]/base:group-data-[focused=true]/base:bg-neutral-3 group-data-[focused=true]/base:border-neutral-9",
        label: "text-neutral-11 group-data-[filled-within=true]/base:text-neutral-12",
        input: "text-neutral-12",
        helperText: "text-neutral-11",
      },
    },
    {
      variant: "flat",
      color: "primary",
      class: {
        inputWrapper:
          "border border-primary-5 bg-primary-3 group-data-[hovered=true]/base:bg-primary-4 group-data-[hovered=true]/base:group-data-[focused=true]/base:bg-primary-3 group-data-[focused=true]/base:border-primary-9",
        label: "text-primary-11 group-data-[filled-within=true]/base:text-primary-12",
        input: "text-primary-12",
        helperText: "text-primary-11",
      },
    },
    {
      variant: "flat",
      color: "secondary",
      class: {
        inputWrapper:
          "border border-secondary-5 bg-secondary-3 group-data-[hovered=true]/base:bg-secondary-4 group-data-[hovered=true]/base:group-data-[focused=true]/base:bg-secondary-3 group-data-[focused=true]/base:border-secondary-9",
        label: "text-secondary-11 group-data-[filled-within=true]/base:text-secondary-12",
        input: "text-secondary-12",
        helperText: "text-secondary-11",
      },
    },
    {
      variant: "flat",
      color: "success",
      class: {
        inputWrapper:
          "border border-success-5 bg-success-3 group-data-[hovered=true]/base:bg-success-4 group-data-[hovered=true]/base:group-data-[focused=true]/base:bg-success-3 group-data-[focused=true]/base:border-success-9",
        label: "text-success-11 group-data-[filled-within=true]/base:text-success-12",
        input: "text-success-12",
        helperText: "text-success-11",
      },
    },
    {
      variant: "flat",
      color: "info",
      class: {
        inputWrapper:
          "border border-info-5 bg-info-3 group-data-[hovered=true]/base:bg-info-4 group-data-[hovered=true]/base:group-data-[focused=true]/base:bg-info-3 group-data-[focused=true]/base:border-info-9",
        label: "text-info-11 group-data-[filled-within=true]/base:text-info-12",
        input: "text-info-12",
        helperText: "text-info-11",
      },
    },
    {
      variant: "flat",
      color: "warning",
      class: {
        inputWrapper:
          "border border-warning-5 bg-warning-3 group-data-[hovered=true]/base:bg-warning-4 group-data-[hovered=true]/base:group-data-[focused=true]/base:bg-warning-3 group-data-[focused=true]/base:border-warning-9",
        label: "text-warning-11 group-data-[filled-within=true]/base:text-warning-12",
        input: "text-warning-12",
        helperText: "text-warning-11",
      },
    },
    {
      variant: "flat",
      color: "danger",
      class: {
        inputWrapper:
          "border border-danger-5 bg-danger-3 group-data-[hovered=true]/base:bg-danger-4 group-data-[hovered=true]/base:group-data-[focused=true]/base:bg-danger-3 group-data-[focused=true]/base:border-danger-9",
        label: "text-danger-11 group-data-[filled-within=true]/base:text-danger-12",
        input: "text-danger-12",
        helperText: "text-danger-11",
      },
    },

    // border
    {
      variant: "border",
      color: "neutral",
      class: {
        inputWrapper:
          "border-2 border-neutral-6 group-data-[hovered=true]/base:border-neutral-7 group-data-[focused=true]/base:border-neutral-8",
        label: "text-neutral-11 group-data-[filled-within=true]/base:text-neutral-12",
        input: "text-neutral-12",
        helperText: "text-neutral-11",
      },
    },
    {
      variant: "border",
      color: "primary",
      class: {
        inputWrapper:
          "border-2 border-primary-6 group-data-[hovered=true]/base:border-primary-7 group-data-[focused=true]/base:border-primary-8",
        label: "text-primary-11 group-data-[filled-within=true]/base:text-primary-12",
        input: "text-primary-12",
        helperText: "text-primary-11",
      },
    },
    {
      variant: "border",
      color: "secondary",
      class: {
        inputWrapper:
          "border-2 border-secondary-6 group-data-[hovered=true]/base:border-secondary-7 group-data-[focused=true]/base:border-secondary-8",
        label: "text-secondary-11 group-data-[filled-within=true]/base:text-secondary-12",
        input: "text-secondary-12",
        helperText: "text-secondary-11",
      },
    },
    {
      variant: "border",
      color: "success",
      class: {
        inputWrapper:
          "border-2 border-success-6 group-data-[hovered=true]/base:border-success-7 group-data-[focused=true]/base:border-success-8",
        label: "text-success-11 group-data-[filled-within=true]/base:text-success-12",
        input: "text-success-12",
        helperText: "text-success-11",
      },
    },
    {
      variant: "border",
      color: "info",
      class: {
        inputWrapper:
          "border-2 border-info-6 group-data-[hovered=true]/base:border-info-7 group-data-[focused=true]/base:border-info-8",
        label: "text-info-11 group-data-[filled-within=true]/base:text-info-12",
        input: "text-info-12",
        helperText: "text-info-11",
      },
    },
    {
      variant: "border",
      color: "warning",
      class: {
        inputWrapper:
          "border-2 border-warning-6 group-data-[hovered=true]/base:border-warning-7 group-data-[focused=true]/base:border-warning-8",
        label: "text-warning-11 group-data-[filled-within=true]/base:text-warning-12",
        input: "text-warning-12",
        helperText: "text-warning-11",
      },
    },
    {
      variant: "border",
      color: "danger",
      class: {
        inputWrapper:
          "border-2 border-danger-6 group-data-[hovered=true]/base:border-danger-7 group-data-[focused=true]/base:border-danger-8",
        label: "text-danger-11 group-data-[filled-within=true]/base:text-danger-12",
        input: "text-danger-12",
        helperText: "text-danger-11",
      },
    },
  ],
});

export type InputVariantProps = VariantProps<typeof input>;

export { input };
