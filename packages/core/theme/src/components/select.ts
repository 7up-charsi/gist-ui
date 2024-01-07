import {
  ClassValue,
  SlotsClassValue,
  tv,
  VariantProps,
} from 'tailwind-variants';

const select = tv({
  slots: {
    listbox: 'w-[--reference-width] bg-white border overflow-y-auto rounded',
    option:
      'h-10 flex items-center px-2 select-none truncate cursor-pointer data-[disabled=true]:opacity-50 data-[selected=true]:bg-info-200 data-[focused=true]:data-[selected=false]:bg-neutral-200 data-[focused=true]:data-[selected=true]:bg-info-300 data-[hovered=true]:data-[selected=false]:bg-neutral-200 data-[hovered=true]:data-[selected=true]:bg-info-300 text-neutral-800',
    noOptions: 'h-10 flex items-center justify-center capitalize text-neutral',
    loading: 'h-10 flex items-center justify-center capitalize text-neutral',
    openIndicator:
      'text-neutral pointer-events-none rotate-0 data-[open=true]:rotate-180',
    clearButton: 'text-neutral',
    input: '!cursor-pointer',
    inputWrapper: '!cursor-pointer',
    group: 'relative isolate',
    groupHeader:
      'sticky top-0 bg-white px-3 py-2 z-50 text-sm font-medium text-neutral-600',
    groupItems: '',
  },
  variants: {
    shadow: {
      none: { listbox: 'shadow-none' },
      sm: { listbox: 'shadow-sm' },
      md: { listbox: 'shadow-md' },
      lg: { listbox: 'shadow-lg' },
    },
    grouped: {
      true: {
        option: 'pl-4',
      },
    },
  },
  defaultVariants: {
    shadow: 'md',
  },
});

export type SelectVariantProps = VariantProps<typeof select>;
export type SelectClassNames = SlotsClassValue<typeof select.slots, ClassValue>;

export { select };
