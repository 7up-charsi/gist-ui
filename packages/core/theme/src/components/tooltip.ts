import {
  ClassValue,
  SlotsClassValue,
  VariantProps,
  tv,
} from 'tailwind-variants';

const tooltip = tv({
  base: 'px-2 py-1 cursor-pointer text-sm relative group rounded-full bg-neutral text-neutral-foreground',
  variants: {},
  defaultVariants: {},
});

export type TooltipVariantProps = VariantProps<typeof tooltip>;
export type TooltipClassNames = SlotsClassValue<
  typeof tooltip.slots,
  ClassValue
>;

export { tooltip };
