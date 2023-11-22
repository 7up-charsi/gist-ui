import { ClassValue, SlotsClassValue, VariantProps, tv } from "tailwind-variants";

const tooltip = tv({
  slots: {
    base: "px-2 py-1 cursor-pointer text-sm relative group",
    arrow: "absolute border-[6px] border-transparent",
  },
  variants: {
    color: {
      default: {
        base: "bg-default text-default-foreground",
        arrow:
          "group-data-[side=bottom]:border-b-default group-data-[side=top]:border-t-default group-data-[side=left]:border-l-default group-data-[side=right]:border-r-default",
      },
      primary: {
        base: "bg-primary text-primary-foreground",
        arrow:
          "group-data-[side=bottom]:border-b-primary group-data-[side=top]:border-t-primary group-data-[side=left]:border-l-primary group-data-[side=right]:border-r-primary",
      },
      secondary: {
        base: "bg-secondary text-secondary-foreground",
        arrow:
          "group-data-[side=bottom]:border-b-secondary group-data-[side=top]:border-t-secondary group-data-[side=left]:border-l-secondary group-data-[side=right]:border-r-secondary",
      },
      success: {
        base: "bg-success text-success-foreground",
        arrow:
          "group-data-[side=bottom]:border-b-success group-data-[side=top]:border-t-success group-data-[side=left]:border-l-success group-data-[side=right]:border-r-success",
      },
      info: {
        base: "bg-info text-info-foreground",
        arrow:
          "group-data-[side=bottom]:border-b-info group-data-[side=top]:border-t-info group-data-[side=left]:border-l-info group-data-[side=right]:border-r-info",
      },
      warning: {
        base: "bg-warning text-warning-foreground",
        arrow:
          "group-data-[side=bottom]:border-b-warning group-data-[side=top]:border-t-warning group-data-[side=left]:border-l-warning group-data-[side=right]:border-r-warning",
      },
      danger: {
        base: "bg-danger text-danger-foreground",
        arrow:
          "group-data-[side=bottom]:border-b-danger group-data-[side=top]:border-t-danger group-data-[side=left]:border-l-danger group-data-[side=right]:border-r-danger",
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
