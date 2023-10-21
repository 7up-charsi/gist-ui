import { VariantProps, tv } from "tailwind-variants";

const input = tv({
  slots: {
    base: "overflow-hidden flex gap-2 w-64 group/base",
    wrapper: "grow",
    inputWrapper: "overflow-hidden w-full flex gap-2 flex-wrap cursor-text",
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
        inputWrapper: "rounded-full",
      },
    },
    size: {
      sm: {
        inputWrapper: "h-12 px-3 py-1",
      },
      md: {
        inputWrapper: "h-14 px-3 py-2",
      },
      lg: {},
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
        // label: "-order-1 pointer-events-none select-none text-sm",
      },
      "inside-top": {
        inputWrapper: "relative",
        label: "absolute text-xs pointer-events-none select-none",
      },
      "inside-right": {
        // label: "order-1 pointer-events-none select-none",
        // input: "[direction:rtl]",
      },
      "outside-left": {
        // label: "-order-1",
      },
      "outside-top": {
        // outerWrapper: "flex-col items-start gap-1",
        // label: "ml-2",
      },
      "outside-right": {
        // label: "order-1",
        // input: "[direction:rtl]",
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
          "top-1/2 -translate-y-1/2 text-sm transition-all group-data-[filled-within=true]/base:-translate-y-[calc(50%_+_10px)]",

        /*  group-data-[filled-within=true]/base:translate-y-0 group-data-[filled-within=true]/base:text-xs group-data-[filled-within=true]/base:font-medium */
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
        inputWrapper: "bg-neutral-3",
      },
    },
  ],
});

export type InputVariantProps = VariantProps<typeof input>;

export { input };
