import { VariantProps, tv } from "tailwind-variants";

const input = tv({
  slots: {
    outerWrapper: "overflow-hidden flex gap-2 group/main",
    innerWrapper: "overflow-hidden w-52",
    inputWrapper: "overflow-hidden relative w-full flex gap-2 items-center cursor-text",
    input: "appearance-none bg-transparent outline-none min-w-0 grow text-sm",
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
      none: { inputWrapper: "rounded-none px-3" },
      sm: {
        inputWrapper: "rounded-small px-3",
      },
      md: {
        inputWrapper: "rounded-medium px-3",
      },
      lg: {
        inputWrapper: "rounded-large px-3",
      },
      full: {
        inputWrapper: "rounded-full px-5",
      },
    },
    size: {
      sm: {
        inputWrapper: "h-10 px-3 py-[6px]",
      },
      md: {
        inputWrapper: "h-12 px-3 py-2",
      },
      lg: {
        inputWrapper: "h-14",
        label: "text-md",
        input: "text-md",
      },
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
        label: "-order-1 pointer-events-none select-none text-sm",
      },
      "inside-top": {
        label:
          "absolute top-1/2 -translate-y-1/2 pointer-events-none select-none group-data-[filled-within=true]/main:translate-y-0 ",
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
    isLabelFloating: {
      true: {},
    },
    isLabelPlaceholder: {
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
    // size = sm + md / labelPlacement = inside-top
    {
      labelPlacement: "inside-top",
      size: ["sm", "md"],
      class: {
        input: "pt-[15px]",
        label:
          "group-data-[filled-within=true]/main:top-[6px] group-data-[filled-within=true]/main:text-xs group-data-[filled-within=true]/main:font-medium transition-all",
      },
    },

    // size = lg / labelPlacement = inside-top
    {
      labelPlacement: "inside-top",
      size: "lg",
      class: {
        inputWrapper: "pt-[15px]",
        input: "text-md",
        label:
          "group-data-[filled=true]/main:-translate-y-0 group-data-[focused=true]/main:top-[8px] group-data-[focused=true]/main:text-sm group-data-[filled=true]/main:top-[8px] group-data-[focused=true]/main:font-medium group-data-[filled=true]/main:text-sm group-data-[filled=true]/main:font-medium transition-all",
      },
    },

    // size = md / labelPlacement = outside-left
    {
      labelPlacement: "outside-left",
      size: "md",
      class: {
        label: "mt-[10px]",
      },
    },

    // size = md / labelPlacement = outside-right
    {
      labelPlacement: "outside-right",
      size: "md",
      class: {
        label: "mt-[10px]",
      },
    },

    // isLabelPlaceholder = true / labelPlacement = inside-top // TODO: add support for placeholder

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
