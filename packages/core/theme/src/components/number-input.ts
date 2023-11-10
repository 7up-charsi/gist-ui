import { VariantProps, tv } from "tailwind-variants";

const numberInput = tv({
  slots: {
    base: "h-7 w-6 flex flex-col items-center justify-center opacity-0 group-data-[hovered=true]:opacity-100 transition-opacity",
    button: "min-w-0 min-h-0 px-0 w-full grow data-[focus-visible=true]:ring-offset-0",
    icon: "min-w-0 max-w-none min-h-0 max-h-none w-full h-full svg:w-[10px] svg:h-[10px]",
  },
});

export type NumberInputVariantProps = VariantProps<typeof numberInput>;

export { numberInput };
