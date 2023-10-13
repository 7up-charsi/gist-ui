import { VariantProps, tv } from "tailwind-variants";

const button = tv({
  base: [
    "z-0",
    "group",
    "relative",
    "inline-flex",
    "items-center",
    "justify-center",
    "box-border",
    "appearance-none",
    "select-none",
    "whitespace-nowrap",
    "min-w-max",
    "font-normal",
    "subpixel-antialiased",
    "overflow-hidden",
    "tap-highlight-transparent",
    "[&>svg]:fill-current",
    "transition-[background,border-color]",
    "duration-100",
  ],
  variants: {
    variant: {
      solid: "",
      flat: "",
      shadow: "shadow-lg",
      border: "border-2 bg-transparent",
      light: "bg-transparent",
      //  transistion-[background] ease-in-out duration-200 motion-reduce:transition-none
    },
    color: {
      neutral: "",
      primary: "",
      secondary: "",
      success: "",
      info: "",
      warning: "",
      danger: "",
    },
    size: {
      sm: "px-3 h-8 min-w-[64px] text-tiny gap-2",
      md: "px-4 h-10 min-w-[80px] text-small gap-2",
      lg: "px-6 h-12 min-w-[96px] text-medium gap-3",
    },
    rounded: {
      none: "rounded-none",
      sm: "rounded-small",
      md: "rounded-medium",
      lg: "rounded-large",
      full: "rounded-full",
    },
    fullWidth: {
      true: "w-full",
    },
    disabled: {
      true: "disabled",
    },
  },
  defaultVariants: {
    size: "md",
    rounded: "md",
    variant: "solid",
    color: "primary",
    fullWidth: false,
    disabled: false,
  },
  compoundVariants: [
    // color / solid
    {
      variant: "solid",
      color: "neutral",
      class:
        "bg-neutral-9 text-neutral-1 data-[hoverable=true]:hover:bg-neutral-10 [--rippleBg:theme(colors.neutral.1/40%)]",
    },
    {
      variant: "solid",
      color: "primary",
      class:
        "bg-primary-9 text-primary-1 data-[hoverable=true]:hover:bg-primary-10 [--rippleBg:theme(colors.primary.1/40%)]",
    },
    {
      variant: "solid",
      color: "secondary",
      class:
        "bg-secondary-9 text-secondary-1 data-[hoverable=true]:hover:bg-secondary-10 [--rippleBg:theme(colors.secondary.1/40%)]",
    },
    {
      variant: "solid",
      color: "success",
      class:
        "bg-success-9 text-success-1 data-[hoverable=true]:hover:bg-success-10 [--rippleBg:theme(colors.success.1/40%)]",
    },
    {
      variant: "solid",
      color: "info",
      class:
        "bg-info-9 text-info-1 data-[hoverable=true]:hover:bg-info-10 [--rippleBg:theme(colors.info.1/40%)]",
    },
    {
      variant: "solid",
      color: "warning",
      class:
        "bg-warning-9 text-warning-12 data-[hoverable=true]:hover:bg-warning-10 [--rippleBg:theme(colors.warning.1/40%)]",
    },
    {
      variant: "solid",
      color: "danger",
      class:
        "bg-danger-9 text-danger-1 data-[hoverable=true]:hover:bg-danger-10 [--rippleBg:theme(colors.danger.1/40%)]",
    },

    // color / border
    {
      variant: "border",
      color: "neutral",
      class:
        "border-neutral-7 data-[hoverable=true]:hover:border-neutral-8 text-neutral-12 [--rippleBg:theme(colors.neutral.9/20%)]",
    },
    {
      variant: "border",
      color: "primary",
      class:
        "border-primary-7 data-[hoverable=true]:hover:border-primary-8 text-primary-12 [--rippleBg:theme(colors.primary.9/20%)]",
    },
    {
      variant: "border",
      color: "secondary",
      class:
        "border-secondary-7 data-[hoverable=true]:hover:border-secondary-8 text-secondary-12 [--rippleBg:theme(colors.secondary.9/20%)]",
    },
    {
      variant: "border",
      color: "success",
      class:
        "border-success-7 data-[hoverable=true]:hover:border-success-8 text-success-12 [--rippleBg:theme(colors.success.9/20%)]",
    },
    {
      variant: "border",
      color: "info",
      class:
        "border-info-7 data-[hoverable=true]:hover:border-info-8 text-info-12 [--rippleBg:theme(colors.info.9/20%)]",
    },
    {
      variant: "border",
      color: "warning",
      class:
        "border-warning-7 data-[hoverable=true]:hover:border-warning-8 text-warning-12 [--rippleBg:theme(colors.warning.9/20%)]",
    },
    {
      variant: "border",
      color: "danger",
      class:
        "border-danger-7 data-[hoverable=true]:hover:border-danger-8 text-danger-12 [--rippleBg:theme(colors.danger.9/20%)]",
    },

    // color / flat
    {
      variant: "flat",
      color: "neutral",
      class:
        "bg-neutral-4 data-[hoverable=true]:hover:bg-neutral-5 text-neutral-12 [--rippleBg:theme(colors.neutral.9/20%)]",
    },
    {
      variant: "flat",
      color: "primary",
      class:
        "bg-primary-4 data-[hoverable=true]:hover:bg-primary-5 text-primary-12 [--rippleBg:theme(colors.primary.9/20%)]",
    },
    {
      variant: "flat",
      color: "secondary",
      class:
        "bg-secondary-4 data-[hoverable=true]:hover:bg-secondary-5 text-secondary-12 [--rippleBg:theme(colors.secondary.9/20%)]",
    },
    {
      variant: "flat",
      color: "success",
      class:
        "bg-success-4 data-[hoverable=true]:hover:bg-success-5 text-success-12 [--rippleBg:theme(colors.success.9/20%)]",
    },
    {
      variant: "flat",
      color: "info",
      class:
        "bg-info-4 data-[hoverable=true]:hover:bg-info-5 text-info-12 [--rippleBg:theme(colors.info.9/20%)]",
    },
    {
      variant: "flat",
      color: "warning",
      class:
        "bg-warning-4 data-[hoverable=true]:hover:bg-warning-5 text-warning-12 [--rippleBg:theme(colors.warning.9/20%)]",
    },
    {
      variant: "flat",
      color: "danger",
      class:
        "bg-danger-4 data-[hoverable=true]:hover:bg-danger-5 text-danger-12 [--rippleBg:theme(colors.danger.9/20%)]",
    },

    // color / shadow
    {
      variant: "shadow",
      color: "neutral",
      class:
        "bg-neutral-9 text-neutral-1 data-[hoverable=true]:hover:bg-neutral-10 shadow-neutral-7 [--rippleBg:theme(colors.neutral.1/40%)]",
    },
    {
      variant: "shadow",
      color: "primary",
      class:
        "bg-primary-9 text-primary-1 data-[hoverable=true]:hover:bg-primary-10 shadow-primary-7 [--rippleBg:theme(colors.primary.1/40%)]",
    },
    {
      variant: "shadow",
      color: "secondary",
      class:
        "bg-secondary-9 text-secondary-1 data-[hoverable=true]:hover:bg-secondary-10 shadow-secondary-7 [--rippleBg:theme(colors.secondary.1/40%)]",
    },
    {
      variant: "shadow",
      color: "success",
      class:
        "bg-success-9 text-success-1 data-[hoverable=true]:hover:bg-success-10 shadow-success-7 [--rippleBg:theme(colors.success.1/40%)]",
    },
    {
      variant: "shadow",
      color: "info",
      class:
        "bg-info-9 text-info-1 data-[hoverable=true]:hover:bg-info-10 shadow-info-7 [--rippleBg:theme(colors.info.1/40%)]",
    },
    {
      variant: "shadow",
      color: "warning",
      class:
        "bg-warning-9 text-warning-12 data-[hoverable=true]:hover:bg-warning-10 shadow-warning-7 [--rippleBg:theme(colors.warning.1/40%)]",
    },
    {
      variant: "shadow",
      color: "danger",
      class:
        "bg-danger-9 text-danger-1 data-[hoverable=true]:hover:bg-danger-10 shadow-danger-7 [--rippleBg:theme(colors.danger.1/40%)]",
    },

    // color / light
    {
      variant: "light",
      color: "neutral",
      class:
        "data-[hoverable=true]:hover:bg-neutral-4 text-neutral-12 [--rippleBg:theme(colors.neutral.9/20%)]",
    },
    {
      variant: "light",
      color: "primary",
      class:
        "data-[hoverable=true]:hover:bg-primary-3 text-primary-10 [--rippleBg:theme(colors.primary.9/20%)]",
    },
    {
      variant: "light",
      color: "secondary",
      class:
        "data-[hoverable=true]:hover:bg-secondary-3 text-secondary-10 [--rippleBg:theme(colors.secondary.9/20%)]",
    },
    {
      variant: "light",
      color: "success",
      class:
        "data-[hoverable=true]:hover:bg-success-3 text-success-10 [--rippleBg:theme(colors.success.9/20%)]",
    },
    {
      variant: "light",
      color: "info",
      class:
        "data-[hoverable=true]:hover:bg-info-3 text-info-10 [--rippleBg:theme(colors.info.9/20%)]",
    },
    {
      variant: "light",
      color: "warning",
      class:
        "data-[hoverable=true]:hover:bg-warning-3 text-warning-10 [--rippleBg:theme(colors.warning.9/20%)]",
    },
    {
      variant: "light",
      color: "danger",
      class:
        "data-[hoverable=true]:hover:bg-danger-3 text-danger-10 [--rippleBg:theme(colors.danger.9/20%)]",
    },
  ],
});

export type ButtonVariantProps = VariantProps<typeof button>;

export { button };
