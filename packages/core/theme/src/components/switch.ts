import {
  ClassValue,
  SlotsClassValue,
  tv,
  VariantProps,
} from 'tailwind-variants';
import { groupDataFocusVisible } from '../classes';

const _switch = tv({
  slots: {
    base: 'inline-flex gap-2 group',
    switch: [
      'rounded-full relative flex items-center transition-colors group-data-[checked=false]:text-neutral-700 group-data-[checked=false]:[--rippleBg:theme(colors.neutral-800/20%)] isolate cursor-pointer',
      ...groupDataFocusVisible,
    ],
    track:
      'rounded-full absolute inset-0 group-data-[checked=false]:bg-neutral-200',
    thumb:
      'absolute z-10 bg-white shadow-md rounded-full left-1 translate-x-0 group-data-[checked=true]:left-[calc(100%-4px)] group-data-[checked=true]:-translate-x-full transition-[left,transform]',
    nativeInput:
      'absolute z-50 outline-none w-full h-full border-test opacity-0 absolute inset-0 cursor-pointer',
    label: 'cursor-pointer select-none text-neutral-700 first-letter:uppercase',
  },
  variants: {
    color: {
      primary: {
        switch:
          'group-data-[checked=true]:[--rippleBg:theme(colors.primary-800/20%)] group-data-[checked=true]:text-primary-700 group-data-[checked=true]:bg-primary-400',
      },
      secondary: {
        switch:
          'group-data-[checked=true]:[--rippleBg:theme(colors.secondary-800/20%)] group-data-[checked=true]:text-secondary-700 group-data-[checked=true]:bg-secondary-400',
      },
      success: {
        switch:
          'group-data-[checked=true]:[--rippleBg:theme(colors.success-800/20%)] group-data-[checked=true]:text-success-700 group-data-[checked=true]:bg-success-400',
      },
      info: {
        switch:
          'group-data-[checked=true]:[--rippleBg:theme(colors.info-800/20%)] group-data-[checked=true]:text-info-700 group-data-[checked=true]:bg-info-400',
      },
      warning: {
        switch:
          'group-data-[checked=true]:[--rippleBg:theme(colors.warning-800/20%)] group-data-[checked=true]:text-warning-700 group-data-[checked=true]:bg-warning-400',
      },
      danger: {
        switch:
          'group-data-[checked=true]:[--rippleBg:theme(colors.danger-800/20%)] group-data-[checked=true]:text-danger-700 group-data-[checked=true]:bg-danger-400',
      },
      neutral: {
        switch:
          'group-data-[checked=true]:[--rippleBg:theme(colors.neutral-800/20%)] group-data-[checked=true]:text-neutral-700 group-data-[checked=true]:bg-neutral-400',
      },
    },
    size: {
      sm: { switch: 'w-10 h-6', thumb: 'w-4 h-4' },
      md: { switch: 'w-12 h-7', thumb: 'w-5 h-5' },
      lg: { switch: 'w-14 h-8', thumb: 'w-6 h-6' },
    },
    isDisabled: {
      true: {
        switch: 'disabled',
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

export type SwitchVariantProps = VariantProps<typeof _switch>;
export type SwitchClassNames = SlotsClassValue<
  typeof _switch.slots,
  ClassValue
>;

export { _switch as switch };
