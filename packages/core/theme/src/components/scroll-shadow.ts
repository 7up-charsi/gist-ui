import { ClassValue, SlotsClassValue, tv, type VariantProps } from "tailwind-variants";

const verticalShadow = [
  "data-[top-scroll=true]:shadow-[inset_0px_10px_9px_-3px_rgba(0,0,0,0.1)]",
  "data-[bottom-scroll=true]:shadow-[inset_0px_-5px_9px_-3px_rgba(0,0,0,0.1)]",
  "data-[top-bottom-scroll=true]:shadow-[inset_0px_10px_9px_-3px_rgba(0,0,0,0.1),_inset_0px_-10px_9px_-3px_rgba(0,0,0,0.1)]",
];

const horizontalShadow = [
  "data-[left-scroll=true]:shadow-[inset_10px_0px_9px_-3px_rgba(0,0,0,0.1)]",
  "data-[right-scroll=true]:shadow-[inset_-10px_0px_9px_-3px_rgba(0,0,0,0.1)]",
  "data-[left-right-scroll=true]:shadow-[inset_10px_0px_9px_-3px_rgba(0,0,0,0.1),_inset_-10px_0px_9px_-3px_rgba(0,0,0,0.1)]",
];

const scrollShadow = tv({
  slots: { base: "w-full h-full" },
  variants: {
    direction: {
      vertical: { base: ["overflow-y-auto", ...verticalShadow] },
      horizontal: { base: ["overflow-x-auto", ...horizontalShadow] },
    },
  },
  defaultVariants: {
    direction: "vertical",
  },
});

export type ScrollShadowVariantProps = VariantProps<typeof scrollShadow>;
export type ScrollShadowClassNames = SlotsClassValue<typeof scrollShadow.slots, ClassValue>;

export { scrollShadow };
