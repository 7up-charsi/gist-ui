import { ClassValue, SlotsClassValue, tv, VariantProps } from "tailwind-variants";

const dialog = tv({
  slots: {
    container: "w-screen h-[100dvh] fixed inset-0 z-[99999]",
    backdrop: "w-full h-full fixed",
    wrapper: "w-full h-full flex relative",
    base: "flex flex-col relative bg-white z-50 w-full box-border outline-none m-5 overflow-hidden",
    header:
      "grow-0 shrink-0 min-h-[55px] flex items-center justify-start py-2 px-6 text-large font-semibold",
    body: "flex-1 px-6 py-2",
    footer: "grow-0 shrink-0 flex gap-2 px-6 py-2 items-center justify-end min-h-[55px]",
  },
  variants: {
    variant: {
      solid: {
        base: "border-0",
      },
      border: {
        base: "border border-default-300",
      },
    },
    rounded: {
      none: { base: "rounded-none" },
      sm: { base: "rounded-sm" },
      md: { base: "rounded-md" },
      lg: { base: "rounded-lg" },
    },
    placement: {
      "top-left": {
        wrapper: "items-start justify-start",
      },
      "top-center": {
        wrapper: "items-start justify-center",
      },
      "top-right": {
        wrapper: "items-start justify-end",
      },
      "bottom-left": {
        wrapper: "items-end justify-start",
      },
      "bottom-center": {
        wrapper: "items-end justify-center",
      },
      "bottom-right": {
        wrapper: "items-end justify-end",
      },
      "center-left": {
        wrapper: "items-center justify-start",
      },
      center: {
        wrapper: "items-center justify-center",
      },
      "center-right": {
        wrapper: "items-center justify-end",
      },
    },
    backdrop: {
      opaque: {
        backdrop: "bg-overlay/50 backdrop-opacity-50",
      },
      blur: {
        backdrop: "backdrop-blur-md backdrop-saturate-150 bg-overlay/30",
      },
      transparent: { backdrop: "hidden" },
    },
    scrollBehavior: {
      inside: {
        base: "max-h-[calc(100%_-_7.5rem)]",
        body: "overflow-y-auto",
      },
      outside: {
        wrapper: "items-start overflow-y-auto",
        base: "my-16",
      },
    },
    shadow: {
      none: { base: "shadow-none" },
      sm: { base: "shadow-sm" },
      md: { base: "shadow-md" },
      lg: { base: "shadow-lg" },
    },
    size: {
      xs: { base: "max-w-xs" },
      sm: { base: "max-w-sm" },
      md: { base: "max-w-md" },
      lg: { base: "max-w-lg" },
      xl: { base: "max-w-xl" },
      "2xl": { base: "max-w-2xl" },
      "3xl": { base: "max-w-3xl" },
      "4xl": { base: "max-w-4xl" },
      "5xl": { base: "max-w-5xl" },
      full: { base: "my-0 mx-0 max-w-full max-h-full h-[100dvh] !rounded-none" },
    },
    fullWidth: {
      true: {
        base: "max-w-full",
      },
    },
    removeVerticleSpace: {
      true: {
        base: "my-0",
      },
    },
    removeHorizontalSpace: {
      true: {
        base: "mx-0",
      },
    },
    borderedBody: {
      true: {
        body: "border-y border-default-300",
      },
      false: {
        body: "border-y-0",
      },
    },
  },
  defaultVariants: {
    backdrop: "opaque",
    size: "md",
    rounded: "md",
    scrollBehavior: "inside",
    shadow: "lg",
    placement: "center",
    fullWidth: false,
    removeHorizontalSpace: false,
    removeVerticleSpace: false,
    variant: "solid",
    borderedBody: true,
  },
});

export type DialogVariantProps = VariantProps<typeof dialog>;
export type DialogClassNames = SlotsClassValue<typeof dialog.slots, ClassValue>;

export { dialog };
