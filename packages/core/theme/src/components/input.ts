import {
  ClassValue,
  SlotsClassValue,
  VariantProps,
  tv,
} from "tailwind-variants";

const input = tv({
  slots: {
    base: "flex flex-col gap-1 w-64 group",
    label: "first-letter:uppercase whitespace-nowrap text-sm",
    inputWrapper: [],
    input:
      "appearance-none !bg-transparent outline-none h-full grow w-0 text-neutral-700 placeholder:text-neutral-500",
    helperText: "px-2 text-xs text-neutral",
    required: "text-danger ml-1",
    customInput: "grow truncate pointer-events-none select-none",
  },
  variants: {
    variant: {
      border: {
        inputWrapper: [
          "w-full flex gap-2 items-center cursor-text px-2 relative border border-neutral-300 group-data-[focused=true]:border-2 group-data-[focused=false]:group-data-[hovered=true]:border-neutral rounded",
        ],
      },
      filled: {
        inputWrapper: [
          "w-full flex gap-2 items-center cursor-text transition-colors px-2 relative bg-neutral-200/50 group-data-[hovered=true]:group-data-[focused=false]:bg-neutral-200/70 rounded-t",

          "before:absolute before:left-0 before:bottom-0 before:w-full before:border-b before:border-b-neutral",

          "after:absolute after:left-1/2 after:bottom-0 after:border-b-2 after:w-full after:scale-x-0 after:-translate-x-1/2 group-data-[focused=true]:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center",
        ],
      },
    },
    color: {
      primary: {},
      secondary: {},
      success: {},
      info: {},
      warning: {},
      danger: {},
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
        label:
          "-order-1 pointer-events-none select-none text-sm mr-2 cursor-text",
      },
      outside: {
        label: "ml-2 cursor-pointer place-self-start",
      },
    },
    hideNativeInput: {
      true: {
        input: "absolute bottom-0 left-0 opacity-0 pointer-events-none",
      },
    },
    customPlaceholder: {
      true: {
        customInput: "text-neutral-700 text-neutral-500",
      },
    },
    error: {
      true: {},
    },
  },
  defaultVariants: {
    color: "primary",
    fullWidth: false,
    isDisabled: false,
    size: "md",
    variant: "filled",
    labelPlacement: "outside",
  },
  compoundVariants: [
    // filled
    {
      variant: "filled",
      color: "primary",
      error: false,
      class: {
        inputWrapper: "after:border-b-primary",
        label: "text-primary-600",
      },
    },
    {
      variant: "filled",
      color: "secondary",
      error: false,
      class: {
        inputWrapper: "after:border-b-secondary",
        label: "text-secondary-600",
      },
    },
    {
      variant: "filled",
      color: "success",
      error: false,
      class: {
        inputWrapper: "after:border-b-success",
        label: "text-success-600",
      },
    },
    {
      variant: "filled",
      color: "info",
      error: false,
      class: {
        inputWrapper: "after:border-b-info",
        label: "text-info-600",
      },
    },
    {
      variant: "filled",
      color: "warning",
      error: false,
      class: {
        inputWrapper: "after:border-b-warning",
        label: "text-warning-600",
      },
    },
    {
      variant: "filled",
      color: "danger",
      error: false,
      class: {
        inputWrapper: "after:border-b-danger",
        label: "text-danger-600",
      },
    },

    // border
    {
      variant: "border",
      color: "primary",
      error: false,
      class: {
        inputWrapper: "group-data-[focused=true]:border-primary",
        label: "text-primary-600",
      },
    },
    {
      variant: "border",
      color: "secondary",
      error: false,
      class: {
        inputWrapper: "group-data-[focused=true]:border-secondary",
        label: "text-secondary-600",
      },
    },
    {
      variant: "border",
      color: "success",
      error: false,
      class: {
        inputWrapper: "group-data-[focused=true]:border-success",
        label: "text-success-600",
      },
    },
    {
      variant: "border",
      color: "info",
      error: false,
      class: {
        inputWrapper: "group-data-[focused=true]:border-info",
        label: "text-info-600",
      },
    },
    {
      variant: "border",
      color: "warning",
      error: false,
      class: {
        inputWrapper: "group-data-[focused=true]:border-warning",
        label: "text-warning-600",
      },
    },
    {
      variant: "border",
      color: "danger",
      error: false,
      class: {
        inputWrapper: "group-data-[focused=true]:border-danger",
        label: "text-danger-600",
      },
    },

    // error
    {
      variant: "filled",
      error: true,
      class: {
        inputWrapper: ["before:border-b-danger", "after:border-b-danger"],
        label: "text-danger",
        helperText: "text-danger",
      },
    },
    {
      variant: "border",
      error: true,
      class: {
        inputWrapper: [
          "border-danger group-data-[focused=false]:group-data-[hovered=true]:border-danger",
        ],
        label: "text-danger",
        helperText: "text-danger",
      },
    },
  ],
});

export type InputVariantProps = VariantProps<typeof input>;
export type InputClassNames = SlotsClassValue<typeof input.slots, ClassValue>;

export { input };
