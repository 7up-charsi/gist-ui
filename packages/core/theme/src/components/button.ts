import { VariantProps, tv } from "tailwind-variants";
import { dataFocusVisible } from "../utils/classes";
import { colorVariants } from "../utils/variants";

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
    ...dataFocusVisible,
  ],
  variants: {
    variant: {
      solid: "",
      flat: "",
      shadow: "",
      border: "border bg-transparent",
      light:
        "bg-transparent transistion-[background] ease-in-out duration-200 motion-reduce:transition-none",
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
      sm: "px-3 h-8 min-w-[64px] text-sm gap-2",
      md: "px-4 h-10 min-w-[80px] gap-2",
      lg: "px-6 h-12 min-w-[96px] text-lg gap-3",
    },
    rounded: {
      none: "rounded-none",
      sm: "rounded-md",
      md: "rounded-xl",
      lg: "rounded-2xl",
      full: "rounded-full",
    },
    fullWidth: {
      true: "w-full",
    },
    isDisabled: {
      true: "opacity-50 pointer-events-none",
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
      color: "neutral",
      class: colorVariants.solid.neutral,
    },
    {
      variant: "solid",
      color: "primary",
      class: colorVariants.solid.primary,
    },
    {
      variant: "solid",
      color: "secondary",
      class: colorVariants.solid.secondary,
    },
    {
      variant: "solid",
      color: "success",
      class: colorVariants.solid.success,
    },
    {
      variant: "solid",
      color: "info",
      class: colorVariants.solid.info,
    },
    {
      variant: "solid",
      color: "warning",
      class: colorVariants.solid.warning,
    },
    {
      variant: "solid",
      color: "danger",
      class: colorVariants.solid.danger,
    },

    // color / border
    {
      variant: "border",
      color: "neutral",
      class: colorVariants.border.neutral,
    },
    {
      variant: "border",
      color: "primary",
      class: colorVariants.border.primary,
    },
    {
      variant: "border",
      color: "secondary",
      class: colorVariants.border.secondary,
    },
    {
      variant: "border",
      color: "success",
      class: colorVariants.border.success,
    },
    {
      variant: "border",
      color: "info",
      class: colorVariants.border.info,
    },
    {
      variant: "border",
      color: "warning",
      class: colorVariants.border.warning,
    },
    {
      variant: "border",
      color: "danger",
      class: colorVariants.border.danger,
    },

    // color / flat
    {
      variant: "flat",
      color: "neutral",
      class: colorVariants.flat.neutral,
    },
    {
      variant: "flat",
      color: "primary",
      class: colorVariants.flat.primary,
    },
    {
      variant: "flat",
      color: "secondary",
      class: colorVariants.flat.secondary,
    },
    {
      variant: "flat",
      color: "success",
      class: colorVariants.flat.success,
    },
    {
      variant: "flat",
      color: "info",
      class: colorVariants.flat.info,
    },
    {
      variant: "flat",
      color: "warning",
      class: colorVariants.flat.warning,
    },
    {
      variant: "flat",
      color: "danger",
      class: colorVariants.flat.danger,
    },

    // color / flat
    {
      variant: "shadow",
      color: "neutral",
      class: colorVariants.shadow.neutral,
    },
    {
      variant: "shadow",
      color: "primary",
      class: colorVariants.shadow.primary,
    },
    {
      variant: "shadow",
      color: "secondary",
      class: colorVariants.shadow.secondary,
    },
    {
      variant: "shadow",
      color: "success",
      class: colorVariants.shadow.success,
    },
    {
      variant: "shadow",
      color: "info",
      class: colorVariants.shadow.info,
    },
    {
      variant: "shadow",
      color: "warning",
      class: colorVariants.shadow.warning,
    },
    {
      variant: "shadow",
      color: "danger",
      class: colorVariants.shadow.danger,
    },

    // color / light
    {
      variant: "light",
      color: "neutral",
      class: [colorVariants.light.neutral, "data-[hover=true]:bg-neutral/20"],
    },
    {
      variant: "light",
      color: "primary",
      class: [colorVariants.light.primary, "data-[hover=true]:bg-primary/20"],
    },
    {
      variant: "light",
      color: "secondary",
      class: [colorVariants.light.secondary, "data-[hover=true]:bg-secondary/20"],
    },
    {
      variant: "light",
      color: "success",
      class: [colorVariants.light.success, "data-[hover=true]:bg-success/20"],
    },
    {
      variant: "light",
      color: "info",
      class: [colorVariants.light.info, "data-[hover=true]:bg-info/20"],
    },
    {
      variant: "light",
      color: "warning",
      class: [colorVariants.light.warning, "data-[hover=true]:bg-warning/20"],
    },
    {
      variant: "light",
      color: "danger",
      class: [colorVariants.light.danger, "data-[hover=true]:bg-danger/20"],
    },
  ],
});

export type ButtonVariantProps = VariantProps<typeof button>;

export { button };
