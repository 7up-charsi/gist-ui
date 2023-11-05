import { VariantProps, tv } from "tailwind-variants";
import { dataFocusVisible } from "../classes";

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
      "transition-[background,border-color]",
      "duration-150",
      "outline-none",
      "data-[key-pressed=true]:scale-90",
      ...dataFocusVisible,
    ],
  },
  variants: {
    variant: {
      solid: { base: "" },
      flat: { base: "" },
      shadow: { base: "shadow-lg" },
      border: { base: "border bg-transparent" },
      text: { base: "bg-transparent" },
    },
    color: {
      default: { base: "" },
      primary: { base: "" },
      secondary: { base: "" },
      success: { base: "" },
      info: { base: "" },
      warning: { base: "" },
      danger: { base: "" },
    },
    size: {
      sm: { base: "px-3 h-8 min-w-[64px] text-sm gap-2" },
      md: { base: "px-4 h-10 min-w-[80px] gap-2" },
      lg: { base: "px-6 h-12 min-w-[96px] text-lg gap-3" },
    },
    rounded: {
      none: { base: "rounded-none" },
      sm: { base: "rounded-sm" },
      md: { base: "rounded-md" },
      lg: { base: "rounded-lg" },
      full: { base: "rounded-full" },
    },
    fullWidth: {
      true: { base: "w-full" },
    },
    isDisabled: {
      true: { base: "disabled" },
    },
    isIconOnly: {
      true: {},
    },
  },
  defaultVariants: {
    size: "md",
    rounded: "md",
    variant: "solid",
    color: "primary",
    fullWidth: false,
    isDisabled: false,
  },
  compoundVariants: [
    // color / solid
    {
      variant: "solid",
      color: "default",
      class: {
        base: "bg-default text-default-foreground [--rippleBg:theme(colors.default-foreground/20%)]",
      },
    },
    {
      variant: "solid",
      color: "primary",
      class: {
        base: "bg-primary text-primary-foreground [--rippleBg:theme(colors.primary-foreground/30%)]",
      },
    },
    {
      variant: "solid",
      color: "secondary",
      class: {
        base: "bg-secondary text-secondary-foreground [--rippleBg:theme(colors.secondary-foreground/30%)]",
      },
    },
    {
      variant: "solid",
      color: "success",
      class: {
        base: "bg-success text-success-foreground [--rippleBg:theme(colors.success-foreground/30%)]",
      },
    },
    {
      variant: "solid",
      color: "info",
      class: {
        base: "bg-info text-info-foreground [--rippleBg:theme(colors.info-foreground/30%)]",
      },
    },
    {
      variant: "solid",
      color: "warning",
      class: {
        base: "bg-warning text-warning-foreground [--rippleBg:theme(colors.warning-foreground/10%)]",
      },
    },
    {
      variant: "solid",
      color: "danger",
      class: {
        base: "bg-danger text-danger-foreground [--rippleBg:theme(colors.danger-foreground/40%)]",
      },
    },

    // color / shadow
    {
      variant: "shadow",
      color: "default",
      class: {
        base: "bg-default text-default-foreground [--rippleBg:theme(colors.default-foreground/20%)] shadow-default-400/100",
      },
    },
    {
      variant: "shadow",
      color: "primary",
      class: {
        base: "bg-primary text-primary-foreground [--rippleBg:theme(colors.primary-foreground/30%)] shadow-primary-400/80",
      },
    },
    {
      variant: "shadow",
      color: "secondary",
      class: {
        base: "bg-secondary text-secondary-foreground [--rippleBg:theme(colors.secondary-foreground/30%)] shadow-secondary-400/80",
      },
    },
    {
      variant: "shadow",
      color: "success",
      class: {
        base: "bg-success text-success-foreground [--rippleBg:theme(colors.success-foreground/30%)] shadow-success-400/80",
      },
    },
    {
      variant: "shadow",
      color: "info",
      class: {
        base: "bg-info text-info-foreground [--rippleBg:theme(colors.info-foreground/30%)] shadow-info-400/80",
      },
    },
    {
      variant: "shadow",
      color: "warning",
      class: {
        base: "bg-warning text-warning-foreground [--rippleBg:theme(colors.warning-foreground/10%)] shadow-warning-400/80",
      },
    },
    {
      variant: "shadow",
      color: "danger",
      class: {
        base: "bg-danger text-danger-foreground [--rippleBg:theme(colors.danger-foreground/40%)] shadow-danger-400/80",
      },
    },

    // color / flat
    {
      variant: "flat",
      color: "default",
      class: {
        base: "bg-default-200 text-default-800 [--rippleBg:theme(colors.default-800/20%)]",
      },
    },
    {
      variant: "flat",
      color: "primary",
      class: {
        base: "bg-primary-100 text-primary-800 [--rippleBg:theme(colors.primary-800/20%)]",
      },
    },
    {
      variant: "flat",
      color: "secondary",
      class: {
        base: "bg-secondary-100 text-secondary-800 [--rippleBg:theme(colors.secondary-800/20%)]",
      },
    },
    {
      variant: "flat",
      color: "success",
      class: {
        base: "bg-success-100 text-success-800 [--rippleBg:theme(colors.success-800/20%)]",
      },
    },
    {
      variant: "flat",
      color: "info",
      class: {
        base: "bg-info-100 text-info-800 [--rippleBg:theme(colors.info-800/20%)]",
      },
    },
    {
      variant: "flat",
      color: "warning",
      class: {
        base: "bg-warning-100 text-warning-800 [--rippleBg:theme(colors.warning-800/20%)]",
      },
    },
    {
      variant: "flat",
      color: "danger",
      class: {
        base: "bg-danger-100 text-danger-800 [--rippleBg:theme(colors.danger-800/20%)]",
      },
    },

    // color / text
    {
      variant: "text",
      color: "default",
      class: {
        base: "data-[hovered=true]:bg-default-200 text-default-700 [--rippleBg:theme(colors.default-700/20%)]",
      },
    },
    {
      variant: "text",
      color: "primary",
      class: {
        base: "data-[hovered=true]:bg-primary-100 text-primary-700 [--rippleBg:theme(colors.primary-700/20%)]",
      },
    },
    {
      variant: "text",
      color: "secondary",
      class: {
        base: "data-[hovered=true]:bg-secondary-100 text-secondary-700 [--rippleBg:theme(colors.secondary-700/20%)]",
      },
    },
    {
      variant: "text",
      color: "success",
      class: {
        base: "data-[hovered=true]:bg-success-100 text-success-700 [--rippleBg:theme(colors.success-700/20%)]",
      },
    },
    {
      variant: "text",
      color: "info",
      class: {
        base: "data-[hovered=true]:bg-info-100 text-info-700 [--rippleBg:theme(colors.info-700/20%)]",
      },
    },
    {
      variant: "text",
      color: "warning",
      class: {
        base: "data-[hovered=true]:bg-warning-100 text-warning-700 [--rippleBg:theme(colors.warning-700/20%)]",
      },
    },
    {
      variant: "text",
      color: "danger",
      class: {
        base: "data-[hovered=true]:bg-danger-100 text-danger-700 [--rippleBg:theme(colors.danger-700/20%)]",
      },
    },

    // color / border
    {
      variant: "border",
      color: "default",
      class: {
        base: "border-default-700 text-default-800 [--rippleBg:theme(colors.default-800/20%)]",
      },
    },
    {
      variant: "border",
      color: "primary",
      class: {
        base: "border-primary-700 text-primary-800 [--rippleBg:theme(colors.primary-800/20%)]",
      },
    },
    {
      variant: "border",
      color: "secondary",
      class: {
        base: "border-secondary-700 text-secondary-800 [--rippleBg:theme(colors.secondary-800/20%)]",
      },
    },
    {
      variant: "border",
      color: "success",
      class: {
        base: "border-success-700 text-success-800 [--rippleBg:theme(colors.success-800/20%)]",
      },
    },
    {
      variant: "border",
      color: "info",
      class: {
        base: "border-info-700 text-info-800 [--rippleBg:theme(colors.info-800/20%)]",
      },
    },
    {
      variant: "border",
      color: "warning",
      class: {
        base: "border-warning-700 text-warning-800 [--rippleBg:theme(colors.warning-800/20%)]",
      },
    },
    {
      variant: "border",
      color: "danger",
      class: {
        base: "border-danger-700 text-danger-800 [--rippleBg:theme(colors.danger-800/20%)]",
      },
    },

    // icIconOnly
    {
      isIconOnly: true,
      size: "sm",
      class: {
        base: "min-w-[32px] w-8 h-8",
      },
    },
    {
      isIconOnly: true,
      size: "md",
      class: {
        base: "min-w-[40px] w-10 h-10",
      },
    },
    {
      isIconOnly: true,
      size: "lg",
      class: {
        base: "min-w-[48px] w-12 h-12",
      },
    },
  ],
});

export type ButtonVariantProps = VariantProps<typeof button>;

export { button };
