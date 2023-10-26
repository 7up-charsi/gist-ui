import { VariantProps, tv } from "tailwind-variants";
import { dataFocusVisible } from "../classes";

const iconButton = tv({
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
      "rounded-full",
      "outline-none",
      ...dataFocusVisible,
    ],
  },
  variants: {
    variant: {
      solid: { base: "" },
      flat: { base: "" },
      shadow: { base: "shadow-lg" },
      border: { base: "border-2 bg-transparent" },
      text: { base: "bg-transparent" },
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
      sm: "min-w-[32px] w-8 h-8",
      md: "min-w-[40px] w-10 h-10",
      lg: "min-w-[48px] w-12 h-12",
    },
    isDisabled: {
      true: { base: "disabled" },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "solid",
    color: "primary",
    isDisabled: false,
  },
  compoundVariants: [
    // color / solid
    {
      variant: "solid",
      color: "neutral",
      class: {
        base: "bg-neutral-9 text-neutral-1 data-[hovered=true]:bg-neutral-10 [--rippleBg:theme(colors.neutral.1/40%)]",
      },
    },
    {
      variant: "solid",
      color: "primary",
      class: {
        base: "bg-primary-9 text-primary-1 data-[hovered=true]:bg-primary-10 [--rippleBg:theme(colors.primary.1/40%)]",
      },
    },
    {
      variant: "solid",
      color: "secondary",
      class: {
        base: "bg-secondary-9 text-secondary-1 data-[hovered=true]:bg-secondary-10 [--rippleBg:theme(colors.secondary.1/40%)]",
      },
    },
    {
      variant: "solid",
      color: "success",
      class: {
        base: "bg-success-9 text-success-1 data-[hovered=true]:bg-success-10 [--rippleBg:theme(colors.success.1/40%)]",
      },
    },
    {
      variant: "solid",
      color: "info",
      class: {
        base: "bg-info-9 text-info-1 data-[hovered=true]:bg-info-10 [--rippleBg:theme(colors.info.1/40%)]",
      },
    },
    {
      variant: "solid",
      color: "warning",
      class: {
        base: "bg-warning-9 text-warning-12 data-[hovered=true]:bg-warning-10 [--rippleBg:theme(colors.warning.1/40%)]",
      },
    },
    {
      variant: "solid",
      color: "danger",
      class: {
        base: "bg-danger-9 text-danger-1 data-[hovered=true]:bg-danger-10 [--rippleBg:theme(colors.danger.1/40%)]",
      },
    },

    // color / border
    {
      variant: "border",
      color: "neutral",
      class: {
        base: "border-neutral-7 data-[hovered=true]:border-neutral-8 data-[hovered=true]:bg-neutral-2 text-neutral-11 [--rippleBg:theme(colors.neutral.9/20%)]",
      },
    },
    {
      variant: "border",
      color: "primary",
      class: {
        base: "border-primary-7 data-[hovered=true]:border-primary-8 data-[hovered=true]:bg-primary-2  text-primary-11 [--rippleBg:theme(colors.primary.9/20%)]",
      },
    },
    {
      variant: "border",
      color: "secondary",
      class: {
        base: "border-secondary-7 data-[hovered=true]:border-secondary-8 data-[hovered=true]:bg-secondary-2  text-secondary-11 [--rippleBg:theme(colors.secondary.9/20%)]",
      },
    },
    {
      variant: "border",
      color: "success",
      class: {
        base: "border-success-7 data-[hovered=true]:border-success-8 data-[hovered=true]:bg-success-2  text-success-11 [--rippleBg:theme(colors.success.9/20%)]",
      },
    },
    {
      variant: "border",
      color: "info",
      class: {
        base: "border-info-7 data-[hovered=true]:border-info-8 data-[hovered=true]:bg-info-2  text-info-11 [--rippleBg:theme(colors.info.9/20%)]",
      },
    },
    {
      variant: "border",
      color: "warning",
      class: {
        base: "border-warning-7 data-[hovered=true]:border-warning-8 data-[hovered=true]:bg-warning-2  text-warning-11 [--rippleBg:theme(colors.warning.9/20%)]",
      },
    },
    {
      variant: "border",
      color: "danger",
      class: {
        base: "border-danger-7 data-[hovered=true]:border-danger-8 data-[hovered=true]:bg-danger-2  text-danger-11 [--rippleBg:theme(colors.danger.9/20%)]",
      },
    },

    // color / flat
    {
      variant: "flat",
      color: "neutral",
      class: {
        base: "bg-neutral-3 data-[hovered=true]:bg-neutral-4 text-neutral-11 [--rippleBg:theme(colors.neutral.9/20%)]",
      },
    },
    {
      variant: "flat",
      color: "primary",
      class: {
        base: "bg-primary-3 data-[hovered=true]:bg-primary-4 text-primary-11 [--rippleBg:theme(colors.primary.9/20%)]",
      },
    },
    {
      variant: "flat",
      color: "secondary",
      class: {
        base: "bg-secondary-3 data-[hovered=true]:bg-secondary-4 text-secondary-11 [--rippleBg:theme(colors.secondary.9/20%)]",
      },
    },
    {
      variant: "flat",
      color: "success",
      class: {
        base: "bg-success-3 data-[hovered=true]:bg-success-4 text-success-11 [--rippleBg:theme(colors.success.9/20%)]",
      },
    },
    {
      variant: "flat",
      color: "info",
      class: {
        base: "bg-info-3 data-[hovered=true]:bg-info-4 text-info-11 [--rippleBg:theme(colors.info.9/20%)]",
      },
    },
    {
      variant: "flat",
      color: "warning",
      class: {
        base: "bg-warning-3 data-[hovered=true]:bg-warning-4 text-warning-11 [--rippleBg:theme(colors.warning.9/20%)]",
      },
    },
    {
      variant: "flat",
      color: "danger",
      class: {
        base: "bg-danger-3 data-[hovered=true]:bg-danger-4 text-danger-11 [--rippleBg:theme(colors.danger.9/20%)]",
      },
    },

    // color / shadow
    {
      variant: "shadow",
      color: "neutral",
      class: {
        base: "bg-neutral-9 text-neutral-1 data-[hovered=true]:bg-neutral-10 shadow-neutral-7 [--rippleBg:theme(colors.neutral.1/40%)]",
      },
    },
    {
      variant: "shadow",
      color: "primary",
      class: {
        base: "bg-primary-9 text-primary-1 data-[hovered=true]:bg-primary-10 shadow-primary-7 [--rippleBg:theme(colors.primary.1/40%)]",
      },
    },
    {
      variant: "shadow",
      color: "secondary",
      class: {
        base: "bg-secondary-9 text-secondary-1 data-[hovered=true]:bg-secondary-10 shadow-secondary-7 [--rippleBg:theme(colors.secondary.1/40%)]",
      },
    },
    {
      variant: "shadow",
      color: "success",
      class: {
        base: "bg-success-9 text-success-1 data-[hovered=true]:bg-success-10 shadow-success-7 [--rippleBg:theme(colors.success.1/40%)]",
      },
    },
    {
      variant: "shadow",
      color: "info",
      class: {
        base: "bg-info-9 text-info-1 data-[hovered=true]:bg-info-10 shadow-info-7 [--rippleBg:theme(colors.info.1/40%)]",
      },
    },
    {
      variant: "shadow",
      color: "warning",
      class: {
        base: "bg-warning-9 text-warning-12 data-[hovered=true]:bg-warning-10 shadow-warning-7 [--rippleBg:theme(colors.warning.1/40%)]",
      },
    },
    {
      variant: "shadow",
      color: "danger",
      class: {
        base: "bg-danger-9 text-danger-1 data-[hovered=true]:bg-danger-10 shadow-danger-7 [--rippleBg:theme(colors.danger.1/40%)]",
      },
    },

    // color / text
    {
      variant: "text",
      color: "neutral",
      class: {
        base: "data-[hovered=true]:bg-neutral-4 text-neutral-11 [--rippleBg:theme(colors.neutral.9/20%)]",
      },
    },
    {
      variant: "text",
      color: "primary",
      class: {
        base: "data-[hovered=true]:bg-primary-3 text-primary-11 [--rippleBg:theme(colors.primary.9/20%)]",
      },
    },
    {
      variant: "text",
      color: "secondary",
      class: {
        base: "data-[hovered=true]:bg-secondary-3 text-secondary-11 [--rippleBg:theme(colors.secondary.9/20%)]",
      },
    },
    {
      variant: "text",
      color: "success",
      class: {
        base: "data-[hovered=true]:bg-success-3 text-success-11 [--rippleBg:theme(colors.success.9/20%)]",
      },
    },
    {
      variant: "text",
      color: "info",
      class: {
        base: "data-[hovered=true]:bg-info-3 text-info-11 [--rippleBg:theme(colors.info.9/20%)]",
      },
    },
    {
      variant: "text",
      color: "warning",
      class: {
        base: "data-[hovered=true]:bg-warning-3 text-warning-11 [--rippleBg:theme(colors.warning.9/20%)]",
      },
    },
    {
      variant: "text",
      color: "danger",
      class: {
        base: "data-[hovered=true]:bg-danger-3 text-danger-11 [--rippleBg:theme(colors.danger.9/20%)]",
      },
    },
  ],
});

export type IconButtonVariantProps = VariantProps<typeof iconButton>;

export { iconButton };
