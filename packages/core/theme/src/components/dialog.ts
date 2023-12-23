import {
  ClassValue,
  SlotsClassValue,
  tv,
  VariantProps,
} from 'tailwind-variants';

const dialog = tv({
  slots: {
    backdrop: 'w-screen h-screen fixed inset-0 z-50',
    container: 'w-screen h-[100dvh] fixed inset-0 z-50 flex',
    base: 'flex flex-col bg-white w-full max-h-[calc(100%_-_7.5rem)] box-border outline-none m-5 overflow-hidden',
    header:
      'grow-0 shrink-0 min-h-[55px] flex items-center justify-start py-2 px-6 text-large font-semibold',
    body: 'flex-1 px-6 py-2',
    footer:
      'grow-0 shrink-0 flex gap-2 px-6 py-2 items-center justify-end min-h-[55px]',
  },
  variants: {
    backdrop: {
      opaque: {
        backdrop: 'bg-overlay/50 backdrop-opacity-50',
      },
      blur: {
        backdrop: 'backdrop-blur-md backdrop-saturate-150 bg-overlay/30',
      },
      transparent: { backdrop: 'hidden' },
    },
    variant: {
      solid: {
        base: 'border-0',
      },
      border: {
        base: 'border border-default-300',
      },
    },
    rounded: {
      none: { base: 'rounded-none' },
      sm: { base: 'rounded-sm' },
      md: { base: 'rounded-md' },
      lg: { base: 'rounded-lg' },
    },
    placement: {
      'top-left': {
        container: 'items-start justify-start',
      },
      'top-center': {
        container: 'items-start justify-center',
      },
      'top-right': {
        container: 'items-start justify-end',
      },
      'bottom-left': {
        container: 'items-end justify-start',
      },
      'bottom-center': {
        container: 'items-end justify-center',
      },
      'bottom-right': {
        container: 'items-end justify-end',
      },
      'center-left': {
        container: 'items-center justify-start',
      },
      center: {
        container: 'items-center justify-center',
      },
      'center-right': {
        container: 'items-center justify-end',
      },
    },
    scrollBehavior: {
      inside: {
        base: 'overflow-hidden',
        body: 'overflow-auto',
      },
      outside: {
        container: 'overflow-y-auto items-start',
        base: 'max-h-max overflow-visible',
      },
    },
    shadow: {
      none: { base: 'shadow-none' },
      sm: { base: 'shadow-sm' },
      md: { base: 'shadow-md' },
      lg: { base: 'shadow-lg' },
    },
    size: {
      xs: { base: 'max-w-xs' },
      sm: { base: 'max-w-sm' },
      md: { base: 'max-w-md' },
      lg: { base: 'max-w-lg' },
      xl: { base: 'max-w-xl' },
      '2xl': { base: 'max-w-2xl' },
      '3xl': { base: 'max-w-3xl' },
      '4xl': { base: 'max-w-4xl' },
      '5xl': { base: 'max-w-5xl' },
      full: {
        base: 'my-0 mx-0 max-w-full max-h-full h-[100dvh] !rounded-none',
      },
    },
    fullWidth: {
      true: {
        base: 'max-w-full',
      },
    },
    removeVerticleSpace: {
      true: {
        base: 'my-0',
      },
    },
    removeHorizontalSpace: {
      true: {
        base: 'mx-0',
      },
    },
    borderedBody: {
      true: {
        body: 'border-y border-default-300',
      },
      false: {
        body: 'border-y-0',
      },
    },
  },
  defaultVariants: {
    backdrop: 'opaque',
    size: 'md',
    rounded: 'md',
    scrollBehavior: 'inside',
    shadow: 'lg',
    placement: 'center',
    fullWidth: false,
    removeHorizontalSpace: false,
    removeVerticleSpace: false,
    variant: 'solid',
    borderedBody: true,
  },
});

export type DialogVariantProps = VariantProps<typeof dialog>;
export type DialogClassNames = SlotsClassValue<typeof dialog.slots, ClassValue>;

export { dialog };
