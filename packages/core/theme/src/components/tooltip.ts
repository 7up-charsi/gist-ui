import { ClassValue, SlotsClassValue, VariantProps, tv } from "tailwind-variants";

const tooltip = tv({
  slots: {
    base: "px-2 py-1 cursor-pointer text-sm relative",
    arrow: "absolute border-[6px] border-transparent",
  },
  variants: {
    color: {
      default: {
        base: "bg-default text-default-foreground",
        arrow:
          "data-[side=bottom]:border-b-default data-[side=top]:border-t-default data-[side=left]:border-l-default data-[side=right]:border-r-default",
      },
      primary: {
        base: "bg-primary text-primary-foreground",
        arrow:
          "data-[side=bottom]:border-b-primary data-[side=top]:border-t-primary data-[side=left]:border-l-primary data-[side=right]:border-r-primary",
      },
      secondary: {
        base: "bg-secondary text-secondary-foreground",
        arrow:
          "data-[side=bottom]:border-b-secondary data-[side=top]:border-t-secondary data-[side=left]:border-l-secondary data-[side=right]:border-r-secondary",
      },
      success: {
        base: "bg-success text-success-foreground",
        arrow:
          "data-[side=bottom]:border-b-success data-[side=top]:border-t-success data-[side=left]:border-l-success data-[side=right]:border-r-success",
      },
      info: {
        base: "bg-info text-info-foreground",
        arrow:
          "data-[side=bottom]:border-b-info data-[side=top]:border-t-info data-[side=left]:border-l-info data-[side=right]:border-r-info",
      },
      warning: {
        base: "bg-warning text-warning-foreground",
        arrow:
          "data-[side=bottom]:border-b-warning data-[side=top]:border-t-warning data-[side=left]:border-l-warning data-[side=right]:border-r-warning",
      },
      danger: {
        base: "bg-danger text-danger-foreground",
        arrow:
          "data-[side=bottom]:border-b-danger data-[side=top]:border-t-danger data-[side=left]:border-l-danger data-[side=right]:border-r-danger",
      },
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
