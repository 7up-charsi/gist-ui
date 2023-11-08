import { VariantProps, tv } from "tailwind-variants";

const numberInput = tv({
  slots: {
    buttons: "h-full flex items-center",
  },
  variants: {
    showOnHover: {
      true: {
        buttons:
          "invisible group-data-[hovered=true]:visible group-data-[focused=true]:visible group-data-[focus-visible=true]:visible",
      },
    },
  },
  defaultVariants: {
    showOnHover: true,
  },
});

export type NumberInputVariantProps = VariantProps<typeof numberInput>;

export { numberInput };
