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
      'h-10 flex items-center px-2 select-none truncate cursor-pointer data-[disabled=true]:disabled data-[selected=true]:bg-info-200 data-[focused=true]:data-[selected=false]:bg-neutral-200 data-[focused=true]:data-[selected=true]:bg-info-300 data-[hovered=true]:data-[selected=false]:bg-neutral-200 data-[hovered=true]:data-[selected=true]:bg-info-300',
    emptyText: 'h-10 flex items-center justify-center capitalize text-neutral',
    optionSeperator: 'h-px bg-neutral-200',
    endContent: 'flex items-center gap-1',
    openIndicator:
      'fill-neutral-400 max-w-[theme(spacing.3)] max-h-[theme(spacing.3)] min-w-[theme(spacing.3)] min-h-[theme(spacing.3)]',
    clearButton:
      'max-w-[theme(spacing.3)] max-h-[theme(spacing.3)] min-w-[theme(spacing.3)] min-h-[theme(spacing.3)]',
    input: 'truncate',
  },
  variants: {
    shadow: {
      none: { listbox: 'shadow-none' },
      sm: { listbox: 'shadow-sm' },
      md: { listbox: 'shadow-md' },
      lg: { listbox: 'shadow-lg' },
    },
  },
  defaultVariants: {
    shadow: 'md',
  },
});

export type SelectVariantProps = VariantProps<typeof select>;
export type SelectClassNames = SlotsClassValue<typeof select.slots, ClassValue>;

export { select };
