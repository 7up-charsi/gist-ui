import {
  ClassValue,
  SlotsClassValue,
  tv,
  VariantProps,
} from "tailwind-variants";

const icon = tv({
  slots: {
    base: "pointer-events-none",
  },
  variants: {
    fill: { true: { base: "svg:fill-current" } },
    size: {
      lg: { base: "min-w-[24px] min-h-[24px] h-6 w-6" },
      md: { base: "min-w-[20px] min-h-[20px] h-5 w-5" },
      sm: { base: "min-w-[16px] min-h-[16px] h-4 w-4" },
    },
  },
  defaultVariants: {
    fill: false,
    size: "md",
  },
});

export type IconVariantProps = VariantProps<typeof icon>;
export type IconClassNames = SlotsClassValue<typeof icon.slots, ClassValue>;

export { icon };
