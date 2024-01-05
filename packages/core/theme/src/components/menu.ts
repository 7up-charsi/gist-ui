import {
  ClassValue,
  SlotsClassValue,
  tv,
  VariantProps,
} from 'tailwind-variants';

const menu = tv({
  slots: {
    menu: 'min-w-max bg-white border rounded-md py-2',
    item: 'px-2 h-8 cursor-pointer select-none flex items-center gap-1 text-neutral-800 outline-none data-[disabled=true]:cursor-default data-[disabled=true]:opacity-50 data-[hovered=true]:bg-neutral-200 data-[focused=true]:bg-neutral-200 relative [--rippleBg:theme(colors.neutral-800/20%)] overflow-hidden [&>span:first-of-type]:w-[15px] [&>span:first-of-type]:h-full [&>span:first-of-type]:overflow-hidden [&>span:first-of-type]:flex [&>span:first-of-type]:items-center [&>span:first-of-type]:justify-center',
    label: 'px-4 py-1 text-sm text-neutral-700',
    group: '',
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
