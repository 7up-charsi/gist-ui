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
      'px-6 h-8 cursor-pointer flex items-center text-neutral-800 data-[hovered=true]:bg-neutral-200',
    label:
      'px-4 h-6 flex items-center text-sm font-medium text-neutral-600 [&>span]:first-letter:uppercase',
    group: '',
    separator: 'h-px bg-neutral-300 my-1',
    menuItemCheckbox:
      'pr-6 h-8 cursor-pointer flex items-center text-neutral-800 data-[hovered=true]:bg-neutral-200',
    menuItemCheckboxIcon:
      'w-6 h-full px-1 flex items-center justify-center overflow-hidden svg:w-3 svg:h-3',
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
