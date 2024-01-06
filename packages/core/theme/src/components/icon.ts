import {
  ClassValue,
  SlotsClassValue,
  tv,
  VariantProps,
} from 'tailwind-variants';

const icon = tv({
  base: 'pointer-events-none text-current',

  variants: {
    size: {
      lg: 'min-w-[24px] min-h-[24px] h-6 w-6',
      md: 'min-w-[20px] min-h-[20px] h-5 w-5',
      sm: 'min-w-[16px] min-h-[16px] h-4 w-4',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type IconVariantProps = VariantProps<typeof icon>;
export type IconClassNames = SlotsClassValue<typeof icon.slots, ClassValue>;

export { icon };
