import { VariantProps, tv } from "tailwind-variants";

const input = tv({
  slots: {
    mainWrapper: "overflow-hidden",
    inputWrapper: "overflow-hidden flex gap-2 w-52",
    label: "first-letter:uppercase whitespace-nowrap",
    input: "appearance-none bg-transparent outline-none grow",
    helperText: "",
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
    size: {
      sm: {
        label: "text-tiny",
        inputWrapper: "h-8 min-h-[32px] px-2",
        input: "text-tiny",
      },
      md: { label: "text-small", inputWrapper: "h-10 min-h-[40px] px-2", input: "text-small" },
      lg: { label: "text-medium", inputWrapper: "h-12 min-h-[40px] px-3", input: "text-medium" },
    },
    rounded: {
      none: {},
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
    fullWidth: {
      true: {
        mainWrapper: "w-full",
        inputWrapper: "w-full",
      },
    },
    isDisabled: {
      true: { mainWrapper: "disabled" },
    },
    labelPlacement: {
      inside: {
        mainWrapper: "relative",
        label: "absolute top-1/2 left-2 -translate-y-1/2",
      },
      outsideLeft: {
        mainWrapper: "flex gap-2 items-center",
      },
      outsideTop: {
        mainWrapper: "flex flex-col gap-1",
        label: "ml-2",
      },
    },
    error: {
      true: {},
    },
  },
  defaultVariants: {
    color: "neutral",
    error: false,
    fullWidth: false,
    isDisabled: false,
    labelPlacement: "inside",
    rounded: "md",
    size: "md",
    variant: "flat",
  },
  compoundVariants: [
    {
      variant: "flat",
      color: "neutral",
      class: {
        inputWrapper: "bg-neutral-4",
      },
    },

    // labelPlacement = "outsideTop" / size = sm
    // {
    //   labelPlacement: "outsideTop",
    //   size: "sm",
    //   class: {
    //     mainWrapper: "gap-1 items-start",
    //     inputWrapper: "h-8",
    //     label: "ml-2",
    //   },
    // },
  ],
});

export type InputVariantProps = VariantProps<typeof input>;

export { input };
