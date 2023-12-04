import { ClassValue, SlotsClassValue, VariantProps, tv } from "tailwind-variants";

const numberInput = tv({
  slots: {
    base: "h-7 w-6 flex flex-col items-center justify-center opacity-0 group-data-[hovered=true]:opacity-100 group-data-[focused=true]:opacity-100 group-data-[focus-visible=true]:opacity-100 transition-opacity",
    button:
      "min-w-0 min-h-0 px-0 w-full grow data-[focus-visible=true]:ring-offset-0 cursor-pointer",
    icon: "min-w-[10px] min-h-[10px] w-[10px] h-[10px]",
  },
});

export type NumberInputVariantProps = VariantProps<typeof numberInput>;
export type NumberInputClassNames = SlotsClassValue<typeof numberInput.slots, ClassValue>;

export { numberInput };
