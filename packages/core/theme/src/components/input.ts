import { VariantProps, tv } from "tailwind-variants";

const input = tv({
  slots: {
    outerWrapper: "overflow-hidden flex gap-2 group/main",
    innerWrapper: "overflow-hidden w-52",
    inputWrapper: "overflow-hidden w-full flex gap-2 items-center cursor-text",
    input: "appearance-none bg-transparent outline-none min-w-0 grow",
    label: "first-letter:uppercase whitespace-nowrap",
    helperText: "px-1",
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
      none: { inputWrapper: "rounded-none" },
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
        inputWrapper: "rounded-full px-3",
      },
    },
    size: {
      sm: {},
      md: {
        inputWrapper: "h-10 px-2",
        label: "text-small",
        input: "!text-small",
        helperText: "!text-tiny",
      },
      lg: {},
    },
    fullWidth: {
      true: {
        innerWrapper: "w-full",
      },
    },
    isDisabled: {
      true: { innerWrapper: "disabled" },
    },
    labelPlacement: {
      "inside-left": {
        label: "-order-1 pointer-events-none select-none",
      },
      "inside-top": {
        inputWrapper: "relative pt-[10px]",
        label:
          "absolute top-1/2 -translate-y-1/2 pointer-events-none select-none group-data-[focused=true]/main:-translate-y-[calc(50%+10px)] group-data-[focused=true]/main:text-tiny group-data-[filled=true]/main:-translate-y-[calc(50%+10px)] group-data-[filled=true]/main:text-tiny transition-all ",
      },
      "inside-right": {
        label: "order-1 pointer-events-none select-none",
        input: "[direction:rtl]",
      },
      "outside-left": {
        label: "-order-1",
      },
      "outside-top": {
        outerWrapper: "flex-col items-start gap-1",
        label: "ml-2",
      },
      "outside-right": {
        label: "order-1",
        input: "[direction:rtl]",
      },
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
    // size = md / labelPlacement = outside-left
    {
      labelPlacement: "outside-left",
      size: "md",
      class: {
        label: "mt-[10px]",
      },
    },

    // size = sm / labelPlacement = outside-right
    {
      labelPlacement: "outside-right",
      size: "md",
      class: {
        label: "mt-[10px]",
      },
    },

    // flat
    {
      variant: "flat",
      color: "neutral",
      class: {
        inputWrapper: "bg-neutral-3",
        helperText: "text-neutral-11",
        label: "text-neutral-12",
        input: "text-neutral-12",
      },
    },
  ],
});

export type InputVariantProps = VariantProps<typeof input>;

export { input };
