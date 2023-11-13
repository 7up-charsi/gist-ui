import { tv, VariantProps } from "tailwind-variants";

const dialog = tv({
  slots: {
    container: "w-screen h-[100dvh] fixed inset-0 z-[99999] flex justify-center",
    backdrop: "w-screen h-screen fixed inset-0",
    base: "flex flex-col relative bg-white z-50 w-full box-border outline-none mx-2 my-5",
    header: "flex-initial py-4 px-6 text-large font-semibold first-letter:uppercase",
    body: "flex-1 px-6 py-2",
    footer: "flex gap-2 px-6 py-4 justify-end",
  },
  variants: {
    rounded: {
      none: { base: "rounded-none" },
      sm: { base: "rounded-sm" },
      md: { base: "rounded-md" },
      lg: { base: "rounded-lg" },
      full: { base: "rounded-full" },
    },
    placement: {
      auto: {
        container: "items-end sm:items-center",
      },
      center: {
        container: "items-center sm:items-center",
      },
      top: {
        container: "items-start sm:items-start",
      },
      "top-center": {
        container: "items-start sm:items-center",
      },
      bottom: {
        container: "items-end sm:items-end",
      },
      "bottom-center": {
        container: "items-end sm:items-center",
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
        container: "items-start overflow-y-auto",
        base: "my-16",
      },
    },
    shadow: {
      sm: {
        base: "shadow-sm",
      },
      md: {
        base: "shadow-md",
      },
      lg: {
        base: "shadow-lg",
      },
    },
    size: {
      xs: {
        base: "max-w-xs",
      },
      sm: {
        base: "max-w-sm",
      },
      md: {
        base: "max-w-md",
      },
      lg: {
        base: "max-w-lg",
      },
      xl: {
        base: "max-w-xl",
      },
      "2xl": {
        base: "max-w-2xl",
      },
      "3xl": {
        base: "max-w-3xl",
      },
      "4xl": {
        base: "max-w-4xl",
      },
      "5xl": {
        base: "max-w-5xl",
      },
      full: {
        base: "my-0 mx-0 max-w-full h-[100dvh] !rounded-none",
      },
    },
  },
  defaultVariants: {
    backdrop: "opaque",
    size: "md",
    rounded: "md",
    scrollBehavior: "inside",
    shadow: "md",
    placement: "center",
  },
});

export type DialogVariantProps = VariantProps<typeof dialog>;

export { dialog };
