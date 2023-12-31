import {
  ClassValue,
  SlotsClassValue,
  tv,
  VariantProps,
} from 'tailwind-variants';

const autocomplete = tv({
  slots: {
    listbox: 'w-[--reference-width] bg-white border overflow-y-auto rounded',
    option:
      'h-10 flex items-center px-2 select-none truncate cursor-pointer data-[disabled=true]:opacity-50 data-[selected=true]:bg-info-200 data-[focused=true]:data-[selected=false]:bg-neutral-200 data-[focused=true]:data-[selected=true]:bg-info-300 data-[hovered=true]:data-[selected=false]:bg-neutral-200 data-[hovered=true]:data-[selected=true]:bg-info-300',
    noOptions: 'h-10 flex items-center justify-center capitalize text-neutral',
    loading: 'h-10 flex items-center justify-center capitalize text-neutral',
    endContent: 'flex items-center gap-1',
    openIndicator:
      'fill-neutral-400 max-w-[theme(spacing.3)] max-h-[theme(spacing.3)] min-w-[theme(spacing.3)] min-h-[theme(spacing.3)]',
    clearButton:
      'max-w-[theme(spacing.3)] max-h-[theme(spacing.3)] min-w-[theme(spacing.3)] min-h-[theme(spacing.3)]',
    input: 'truncate !cursor-pointer',
    inputWrapper: '!cursor-pointer',
    group: 'relative isolate',
    groupHeader:
      'sticky top-0 bg-white px-3 py-2 z-50 text-sm text-neutral-600',
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

export type AutocompleteVariantProps = VariantProps<typeof autocomplete>;
export type AutocompleteClassNames = SlotsClassValue<
  typeof autocomplete.slots,
  ClassValue
>;

export { autocomplete };
