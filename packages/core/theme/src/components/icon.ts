import { tv, VariantProps } from "tailwind-variants";

const icon = tv({
  base: "overflow-hidden flex items-center justify-center svg:h-full svg:w-full",
  variants: {
    fill: { true: "" },
    color: {
      inherit: "svg:text-current",
      default: "svg:text-default",
      primary: "svg:text-primary",
      secondary: "svg:text-secondary",
      success: "svg:text-success",
      info: "svg:text-info",
      warning: "svg:text-warning",
      danger: "svg:text-danger",
    },
    size: {
      lg: "max-w-[24px] max-h-[24px] min-w-[24px] min-h-[24px] h-6 w-6",
      md: "max-w-[20px] max-h-[20px] min-w-[20px] min-h-[20px] h-5 w-5",
      sm: "max-w-[16px] max-h-[16px] min-w-[16px] min-h-[16px] h-4 w-4",
    },
  },
  defaultVariants: {
    fill: false,
    size: "md",
    color: "inherit",
  },
  compoundVariants: [
    {
      color: "inherit",
      fill: true,
      class: "svg:fill-current",
    },
    {
      color: "default",
      fill: true,
      class: "svg:fill-default",
    },
    {
      color: "primary",
      fill: true,
      class: "svg:fill-primary",
    },
    {
      color: "secondary",
      fill: true,
      class: "svg:fill-secondary",
    },
    {
      color: "success",
      fill: true,
      class: "svg:fill-success",
    },
    {
      color: "info",
      fill: true,
      class: "svg:fill-info",
    },
    {
      color: "warning",
      fill: true,
      class: "svg:fill-warning",
    },
    {
      color: "danger",
      fill: true,
      class: "svg:fill-danger",
    },
  ],
});

export type IconVariantProps = VariantProps<typeof icon>;

export { icon };
