import { ClassValue, SlotsClassValue, VariantProps, tv } from "tailwind-variants";

const floatingArrow = tv({
  slots: {
    base: "absolute w-3 h-3 fill-default-400 data-[side=top]:rotate-180 data-[side=bottom]:rotate-0 data-[side=right]:-rotate-90 data-[side=left]:rotate-90",
  },
});

export type FloatingArrowVariantProps = VariantProps<typeof floatingArrow>;
export type FloatingArrowClassNames = SlotsClassValue<typeof floatingArrow.slots, ClassValue>;

export { floatingArrow };
