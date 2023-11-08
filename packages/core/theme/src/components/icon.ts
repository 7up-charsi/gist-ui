import { tv, VariantProps } from "tailwind-variants";

const icon = tv({
  base: "overflow-hidden flex items-center justify-center svg:h-full svg:w-full svg:text-current",
  variants: {
    fill: { true: "svg:fill-current" },
    size: {
      lg: "max-w-[24px] max-h-[24px] min-w-[24px] min-h-[24px] h-6 w-6",
      md: "max-w-[20px] max-h-[20px] min-w-[20px] min-h-[20px] h-5 w-5",
      sm: "max-w-[16px] max-h-[16px] min-w-[16px] min-h-[16px] h-4 w-4",
    },
  },
  defaultVariants: {
    fill: false,
    size: "md",
  },
});

export type IconVariantProps = VariantProps<typeof icon>;

export { icon };
