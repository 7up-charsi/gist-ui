import { ClassValue, SlotsClassValue, VariantProps, tv } from "tailwind-variants";

const tooltip = tv({
  slots: {
    base: "px-2 py-1 cursor-pointer text-sm relative group",
  },
  variants: {
    color: {
      default: { base: "bg-default text-default-foreground" },
      primary: { base: "bg-primary text-primary-foreground" },
      secondary: { base: "bg-secondary text-secondary-foreground" },
      success: { base: "bg-success text-success-foreground" },
      info: { base: "bg-info text-info-foreground" },
      warning: { base: "bg-warning text-warning-foreground" },
      danger: { base: "bg-danger text-danger-foreground" },
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
