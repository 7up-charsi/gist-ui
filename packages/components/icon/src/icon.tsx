import { ReactNode, createContext, forwardRef, useContext } from "react";

type Size = "lg" | "md" | "sm";

export interface IconProps {
  size?: Size;
  fill?: boolean;
  children?: ReactNode;
}

export const IconContext = createContext<{ size?: Size }>({});

const Icon = forwardRef<HTMLDivElement, IconProps>(({ fill, size = "md", children }, ref) => {
  const context = useContext(IconContext);

  const sizes = {
    lg: "max-w-[24px] max-h-[24px] min-w-[24px] min-h-[24px] h-6 w-6",
    md: "max-w-[20px] max-h-[20px] min-w-[20px] min-h-[20px] h-5 w-5",
    sm: "max-w-[16px] max-h-[16px] min-w-[16px] min-h-[16px] h-4 w-4",
  };

  return (
    <div
      ref={ref}
      className={`overflow-hidden flex items-center justify-center svg:h-full svg:w-full ${
        sizes[context.size || size]
      } svg:text-current ${fill ? "svg:fill-current" : ""}`}
    >
      {children}
    </div>
  );
});

Icon.displayName = "gist-ui.Icon";

export default Icon;
