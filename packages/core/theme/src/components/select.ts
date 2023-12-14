import {
  ClassValue,
  SlotsClassValue,
  tv,
  VariantProps,
} from "tailwind-variants";

const select = tv({
  slots: {
    listbox: "w-[--reference-width] bg-white border overflow-y-auto",
    option:
      "flex items-center px-2 select-none truncate cursor-pointer data-[disabled=true]:disabled data-[selected=true]:bg-info-200 data-[focused=true]:data-[selected=false]:bg-default-200 data-[focused=true]:data-[selected=true]:bg-info-300",
    emptyText: "h-10 flex items-center justify-center capitalize text-default",
    optionSeperator: "h-px bg-default-200",
    endContent: "flex",
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
});

export type SelectVariantProps = VariantProps<typeof select>;
export type SelectClassNames = SlotsClassValue<typeof select.slots, ClassValue>;

export { select };
