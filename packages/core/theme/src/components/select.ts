import { ClassValue, SlotsClassValue, tv, VariantProps } from "tailwind-variants";

const select = tv({
  slots: {
    listbox: "w-[--reference-width] bg-white border overflow-y-auto",
    option:
      "h-10 flex gap-2 items-center px-2 select-none border-b last:border-b-0 [&>span]:first-letter:uppercase cursor-pointer",
    emptyText: "h-10 flex items-center justify-center capitalize text-default",
  },
  variants: {
    rounded: {
      none: { listbox: "rounded-none" },
      sm: { listbox: "rounded-sm" },
      md: { listbox: "rounded-md" },
      lg: { listbox: "rounded-lg" },
    },
    shadow: {
      none: { listbox: "shadow-none" },
      sm: { listbox: "shadow-sm" },
      md: { listbox: "shadow-md" },
      lg: { listbox: "shadow-lg" },
    },
    color: {
      default: {},
      primary: {},
      secondary: {},
      success: {},
      info: {},
      warning: {},
      danger: {},
    },
    size: {
      sm: { option: "h-8" },
      md: { option: "h-10" },
      lg: { option: "h-12" },
    },
  },
  defaultVariants: {
    rounded: "md",
    shadow: "md",
    color: "default",
    size: "md",
  },
  compoundVariants: [
    { color: "default", className: { option: "hover:bg-default-100" } },
    { color: "primary", className: { option: "hover:bg-primary-100" } },
    { color: "secondary", className: { option: "hover:bg-secondary-100" } },
    { color: "success", className: { option: "hover:bg-success-100" } },
    { color: "info", className: { option: "hover:bg-info-100" } },
    { color: "warning", className: { option: "hover:bg-warning-100" } },
    { color: "danger", className: { option: "hover:bg-danger-100" } },
  ],
});

export type SelectVariantProps = VariantProps<typeof select>;
export type SelectClassNames = SlotsClassValue<typeof select.slots, ClassValue>;

export { select };
