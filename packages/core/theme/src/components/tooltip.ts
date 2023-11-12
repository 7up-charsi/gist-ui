import { VariantProps, tv } from "tailwind-variants";

const tooltip = tv({
  slots: {
    base: "px-2 py-1 bg-default-300 cursor-pointer",
    arrow: "",
  },
  variants: {
    arrowHide: {
      true: {
        arrow: "invisible",
      },
    },
  },
});

export type TooltipVariantProps = VariantProps<typeof tooltip>;

export { tooltip };
