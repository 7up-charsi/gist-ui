import { ClassValue, SlotsClassValue, VariantProps, tv } from "tailwind-variants";

const tooltip = tv({
  slots: {
    base: "px-2 py-1 cursor-pointer text-sm",
  },
  variants: {
    color: {
      default: { base: "bg-default text-default-foreground svg:fill-default" },
      primary: { base: "bg-primary text-primary-foreground svg:fill-primary" },
      secondary: { base: "bg-secondary text-secondary-foreground svg:fill-secondary" },
      success: { base: "bg-success text-success-foreground svg:fill-success" },
      info: { base: "bg-info text-info-foreground svg:fill-info" },
      warning: { base: "bg-warning text-warning-foreground svg:fill-warning" },
      danger: { base: "bg-danger text-danger-foreground svg:fill-danger" },
    },
    rounded: {
      none: { base: "rounded-none" },
      sm: { base: "rounded-sm" },
      md: { base: "rounded-md" },
      lg: { base: "rounded-lg" },
      full: { base: "rounded-full" },
    },
  },
  defaultVariants: {
    color: "default",
    rounded: "md",
  },
});

export type TooltipVariantProps = VariantProps<typeof tooltip>;
export type TooltipClassNames = SlotsClassValue<typeof tooltip.slots, ClassValue>;

export { tooltip };
