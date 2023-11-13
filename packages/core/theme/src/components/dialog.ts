import { tv, VariantProps } from "tailwind-variants";

const dialog = tv({
  slots: {
    base: "",
  },
  defaultVariants: {},
});

export type DialogVariantProps = VariantProps<typeof dialog>;

export { dialog };
