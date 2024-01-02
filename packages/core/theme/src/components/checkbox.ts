import {
  ClassValue,
  SlotsClassValue,
  tv,
  VariantProps,
} from 'tailwind-variants';

const checkbox = tv({
  slots: {
    base: 'inline-flex gap-1 group',
    checkbox:
      'rounded-full relative inline-flex items-center justify-center overflow-hidden transition-colors group-data-[pressed=true]:group-data-[focus-visible=true]:scale-90',
    nativeInput:
      'outline-none w-full h-full border-test opacity-0 absolute inset-0 cursor-pointer',
    label: 'cursor-pointer select-none',
  },
  variants: {
    color: {
      primary: {
        checkbox:
          '[--rippleBg:theme(colors.primary-800/20%)] group-data-[hovered=true]:bg-primary-200 group-data-[focus-visible=true]:bg-primary-200',
      },
      secondary: {
        checkbox:
          '[--rippleBg:theme(colors.secondary-800/20%)] group-data-[hovered=true]:bg-secondary-200 group-data-[focus-visible=true]:bg-secondary-200',
      },
      success: {
        checkbox:
          '[--rippleBg:theme(colors.success-800/20%)] group-data-[hovered=true]:bg-success-200 group-data-[focus-visible=true]:bg-success-200',
      },
      info: {
        checkbox:
          '[--rippleBg:theme(colors.info-800/20%)] group-data-[hovered=true]:bg-info-200 group-data-[focus-visible=true]:bg-info-200',
      },
      warning: {
        checkbox:
          '[--rippleBg:theme(colors.warning-800/20%)] group-data-[hovered=true]:bg-warning-200 group-data-[focus-visible=true]:bg-warning-200',
      },
      danger: {
        checkbox:
          '[--rippleBg:theme(colors.danger-800/20%)] group-data-[hovered=true]:bg-danger-200 group-data-[focus-visible=true]:bg-danger-200',
      },
      neutral: {
        checkbox:
          '[--rippleBg:theme(colors.neutral-800/20%)] group-data-[hovered=true]:bg-neutral-200 group-data-[focus-visible=true]:bg-neutral-200',
      },
    },
    size: {
      sm: { checkbox: 'min-w-[32px] min-h-[32px] w-8 h-8' },
      md: { checkbox: 'min-w-[40px] min-h-[40px] w-10 h-10' },
      lg: { checkbox: 'min-w-[48px] min-h-[48px] w-12 h-12' },
    },
    isDisabled: {
      true: {
        checkbox: 'disabled',
      },
    },
    labelPlacement: {
      top: { base: 'flex-col items-center', label: '-order-1' },
      bottom: { base: 'flex-col items-center', label: 'order-1' },
      left: { base: 'items-center', label: '-order-1' },
      right: { base: 'items-center', label: 'order-1' },
    },
  },
  defaultVariants: {
    size: 'md',
    labelPlacement: 'right',
    isDisabled: false,
    color: 'neutral',
  },
});

export type CheckboxVariantProps = VariantProps<typeof checkbox>;
export type CheckboxClassNames = SlotsClassValue<
  typeof checkbox.slots,
  ClassValue
>;

export { checkbox };
