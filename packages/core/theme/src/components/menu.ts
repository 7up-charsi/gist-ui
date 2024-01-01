import {
  ClassValue,
  SlotsClassValue,
  tv,
  VariantProps,
} from 'tailwind-variants';

const menu = tv({
  slots: {
    menu: 'min-w-max bg-white border rounded-md py-2',
    menuItem:
      'px-3 h-8 cursor-pointer flex items-center text-neutral-700 data-[hovered=true]:bg-neutral-200',
    groupTitle:
      'px-3 h-6 flex items-center text-sm text-neutral-600 [&>span]:first-letter:uppercase',
    group: '[&>li]:pl-5',
    separator: 'h-px bg-neutral-300 my-1',
  },
  variants: {
    shadow: {
      none: { menu: 'shadow-none' },
      sm: { menu: 'shadow-sm' },
      md: { menu: 'shadow-md' },
      lg: { menu: 'shadow-lg' },
    },
  },
  defaultVariants: {
    shadow: 'md',
  },
});

export type MenuVariantProps = VariantProps<typeof menu>;
export type MenuClassNames = SlotsClassValue<typeof menu.slots, ClassValue>;

export { menu };
