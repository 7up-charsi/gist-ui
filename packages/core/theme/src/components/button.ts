import { VariantProps, tv } from "tailwind-variants";

const button = tv({
  slots: {
    base: "px-3 bg-sky-300",
    icon: "",
  },
  variants: {
    size: {
      sm: "px-3 h-8 min-w-[64px] text-xs",
      md: "px-4 h-10 min-w-[80px] text-sm",
      lg: "px-6 h-12 min-w-[96px] ",
    },
    rounded: {
      none: "rounded-none",
      sm: "rounded-md",
      md: "rounded-xl",
      lg: "rounded-2xl",
      full: "rounded-full",
    },
  },
  defaultVariants: {
    size: "md",
    rounded: "md",
  },
});

export type ButtonVariantProps = VariantProps<typeof button>;

export { button };
