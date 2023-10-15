import { VariantProps, tv } from "tailwind-variants";

const button = tv({
  slots: {
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
      "duration-150",
      "outline-none",
    ],
    focusVisible: [
      "rounded-full",
      "absolute",
      "origin-center",
      "animate-none",
      "scale-0",
      "opacity-20",
      "transition-[transform,opacity]",
      "data-[visible=true]:opacity-100",
      "data-[visible=true]:scale-100",
      "data-[visible=true]:animate-focusRipple",
      "bg-[var(--rippleBg)]",
      "w-[calc(100%_-_10px)]",
      "aspect-square",
    ],
  },

  variants: {
    variant: {
      solid: { base: "" },
      flat: { base: "" },
      shadow: { base: "shadow-lg" },
      border: { base: "border-2 bg-transparent" },
      light: { base: "bg-transparent" },
    },
    color: {
      neutral: { base: "" },
      primary: { base: "" },
      secondary: { base: "" },
      success: { base: "" },
      info: { base: "" },
      warning: { base: "" },
      danger: { base: "" },
    },
    size: {
      sm: { base: "px-3 h-8 min-w-[64px] text-tiny gap-2" },
      md: { base: "px-4 h-10 min-w-[80px] text-small gap-2" },
      lg: { base: "px-6 h-12 min-w-[96px] text-medium gap-3" },
    },
    rounded: {
      none: { base: "rounded-none" },
      sm: { base: "rounded-small" },
      md: { base: "rounded-medium" },
      lg: { base: "rounded-large" },
      full: { base: "rounded-full" },
    },
    fullWidth: {
      true: { base: "w-full" },
    },
    disabled: {
      true: { base: "disabled" },
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
      class: {
        base: "bg-neutral-9 text-neutral-1 hover:bg-neutral-10 [--rippleBg:theme(colors.neutral.1/40%)]",
      },
    },
    {
      variant: "solid",
      color: "primary",
      class: {
        base: "bg-primary-9 text-primary-1 hover:bg-primary-10 [--rippleBg:theme(colors.primary.1/40%)]",
      },
    },
    {
      variant: "solid",
      color: "secondary",
      class: {
        base: "bg-secondary-9 text-secondary-1 hover:bg-secondary-10 [--rippleBg:theme(colors.secondary.1/40%)]",
      },
    },
    {
      variant: "solid",
      color: "success",
      class: {
        base: "bg-success-9 text-success-1 hover:bg-success-10 [--rippleBg:theme(colors.success.1/40%)]",
      },
    },
    {
      variant: "solid",
      color: "info",
      class: {
        base: "bg-info-9 text-info-1 hover:bg-info-10 [--rippleBg:theme(colors.info.1/40%)]",
      },
    },
    {
      variant: "solid",
      color: "warning",
      class: {
        base: "bg-warning-9 text-warning-12 hover:bg-warning-10 [--rippleBg:theme(colors.warning.1/40%)]",
      },
    },
    {
      variant: "solid",
      color: "danger",
      class: {
        base: "bg-danger-9 text-danger-1 hover:bg-danger-10 [--rippleBg:theme(colors.danger.1/40%)]",
      },
    },

    // color / border
    {
      variant: "border",
      color: "neutral",
      class: {
        base: "border-neutral-7 hover:border-neutral-8 text-neutral-12 [--rippleBg:theme(colors.neutral.9/20%)]",
      },
    },
    {
      variant: "border",
      color: "primary",
      class: {
        base: "border-primary-7 hover:border-primary-8 text-primary-12 [--rippleBg:theme(colors.primary.9/20%)]",
      },
    },
    {
      variant: "border",
      color: "secondary",
      class: {
        base: "border-secondary-7 hover:border-secondary-8 text-secondary-12 [--rippleBg:theme(colors.secondary.9/20%)]",
      },
    },
    {
      variant: "border",
      color: "success",
      class: {
        base: "border-success-7 hover:border-success-8 text-success-12 [--rippleBg:theme(colors.success.9/20%)]",
      },
    },
    {
      variant: "border",
      color: "info",
      class: {
        base: "border-info-7 hover:border-info-8 text-info-12 [--rippleBg:theme(colors.info.9/20%)]",
      },
    },
    {
      variant: "border",
      color: "warning",
      class: {
        base: "border-warning-7 hover:border-warning-8 text-warning-12 [--rippleBg:theme(colors.warning.9/20%)]",
      },
    },
    {
      variant: "border",
      color: "danger",
      class: {
        base: "border-danger-7 hover:border-danger-8 text-danger-12 [--rippleBg:theme(colors.danger.9/20%)]",
      },
    },

    // color / flat
    {
      variant: "flat",
      color: "neutral",
      class: {
        base: "bg-neutral-4 hover:bg-neutral-5 text-neutral-12 [--rippleBg:theme(colors.neutral.9/20%)]",
      },
    },
    {
      variant: "flat",
      color: "primary",
      class: {
        base: "bg-primary-4 hover:bg-primary-5 text-primary-12 [--rippleBg:theme(colors.primary.9/20%)]",
      },
    },
    {
      variant: "flat",
      color: "secondary",
      class: {
        base: "bg-secondary-4 hover:bg-secondary-5 text-secondary-12 [--rippleBg:theme(colors.secondary.9/20%)]",
      },
    },
    {
      variant: "flat",
      color: "success",
      class: {
        base: "bg-success-4 hover:bg-success-5 text-success-12 [--rippleBg:theme(colors.success.9/20%)]",
      },
    },
    {
      variant: "flat",
      color: "info",
      class: {
        base: "bg-info-4 hover:bg-info-5 text-info-12 [--rippleBg:theme(colors.info.9/20%)]",
      },
    },
    {
      variant: "flat",
      color: "warning",
      class: {
        base: "bg-warning-4 hover:bg-warning-5 text-warning-12 [--rippleBg:theme(colors.warning.9/20%)]",
      },
    },
    {
      variant: "flat",
      color: "danger",
      class: {
        base: "bg-danger-4 hover:bg-danger-5 text-danger-12 [--rippleBg:theme(colors.danger.9/20%)]",
      },
    },

    // color / shadow
    {
      variant: "shadow",
      color: "neutral",
      class: {
        base: "bg-neutral-9 text-neutral-1 hover:bg-neutral-10 shadow-neutral-7 [--rippleBg:theme(colors.neutral.1/40%)]",
      },
    },
    {
      variant: "shadow",
      color: "primary",
      class: {
        base: "bg-primary-9 text-primary-1 hover:bg-primary-10 shadow-primary-7 [--rippleBg:theme(colors.primary.1/40%)]",
      },
    },
    {
      variant: "shadow",
      color: "secondary",
      class: {
        base: "bg-secondary-9 text-secondary-1 hover:bg-secondary-10 shadow-secondary-7 [--rippleBg:theme(colors.secondary.1/40%)]",
      },
    },
    {
      variant: "shadow",
      color: "success",
      class: {
        base: "bg-success-9 text-success-1 hover:bg-success-10 shadow-success-7 [--rippleBg:theme(colors.success.1/40%)]",
      },
    },
    {
      variant: "shadow",
      color: "info",
      class: {
        base: "bg-info-9 text-info-1 hover:bg-info-10 shadow-info-7 [--rippleBg:theme(colors.info.1/40%)]",
      },
    },
    {
      variant: "shadow",
      color: "warning",
      class: {
        base: "bg-warning-9 text-warning-12 hover:bg-warning-10 shadow-warning-7 [--rippleBg:theme(colors.warning.1/40%)]",
      },
    },
    {
      variant: "shadow",
      color: "danger",
      class: {
        base: "bg-danger-9 text-danger-1 hover:bg-danger-10 shadow-danger-7 [--rippleBg:theme(colors.danger.1/40%)]",
      },
    },

    // color / light
    {
      variant: "light",
      color: "neutral",
      class: {
        base: "hover:bg-neutral-4 text-neutral-12 [--rippleBg:theme(colors.neutral.9/20%)]",
      },
    },
    {
      variant: "light",
      color: "primary",
      class: {
        base: "hover:bg-primary-3 text-primary-10 [--rippleBg:theme(colors.primary.9/20%)]",
      },
    },
    {
      variant: "light",
      color: "secondary",
      class: {
        base: "hover:bg-secondary-3 text-secondary-10 [--rippleBg:theme(colors.secondary.9/20%)]",
      },
    },
    {
      variant: "light",
      color: "success",
      class: {
        base: "hover:bg-success-3 text-success-10 [--rippleBg:theme(colors.success.9/20%)]",
      },
    },
    {
      variant: "light",
      color: "info",
      class: { base: "hover:bg-info-3 text-info-10 [--rippleBg:theme(colors.info.9/20%)]" },
    },
    {
      variant: "light",
      color: "warning",
      class: {
        base: "hover:bg-warning-3 text-warning-10 [--rippleBg:theme(colors.warning.9/20%)]",
      },
    },
    {
      variant: "light",
      color: "danger",
      class: { base: "hover:bg-danger-3 text-danger-10 [--rippleBg:theme(colors.danger.9/20%)]" },
    },
  ],
});

export type ButtonVariantProps = VariantProps<typeof button>;

export { button };
