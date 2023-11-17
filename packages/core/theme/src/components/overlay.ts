import { ClassValue, SlotsClassValue, tv, VariantProps } from "tailwind-variants";

const overlay = tv({
  slots: {
    base: "w-screen h-screen fixed inset-0 z-50",
  },
  variants: {
    variant: {
      opaque: {
        base: "bg-overlay/50 backdrop-opacity-50",
      },
      blur: {
        base: "backdrop-blur-md backdrop-saturate-150 bg-overlay/30",
      },
      transparent: { base: "hidden" },
    },
  },
  defaultVariants: {
    variant: "opaque",
  },
});

export type OverlayVariantProps = VariantProps<typeof overlay>;
export type OverlayClassNames = SlotsClassValue<typeof overlay.slots, ClassValue>;

export { overlay };
