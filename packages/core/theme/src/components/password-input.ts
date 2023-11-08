import { VariantProps, tv } from "tailwind-variants";

const passwordInput = tv({
  slots: {
    toggleButtonWrapper: "h-full flex items-center",
  },
  variants: {
    showOnHover: {
      true: {
        toggleButtonWrapper:
          "invisible group-data-[hovered=true]:visible group-data-[focused=true]:visible group-data-[focus-visible=true]:visible",
      },
    },
  },
  defaultVariants: {
    showOnHover: true,
  },
});

export type PasswordInputVariantProps = VariantProps<typeof passwordInput>;

export { passwordInput };
