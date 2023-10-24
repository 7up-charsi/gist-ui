import { icon } from "@gist-ui/theme";
import { ReactNode, createContext, forwardRef, useContext } from "react";

type Size = "lg" | "md" | "sm";

export interface IconProps {
  size?: Size;
  fill?: boolean;
  children?: ReactNode;
}

export const IconContext = createContext<{ size?: Size }>({});

const Icon = forwardRef<HTMLDivElement, IconProps>(({ fill, size, children }, ref) => {
  const context = useContext(IconContext);

  const styles = icon({ size: context.size || size, fill });

  return (
    <div ref={ref} className={styles}>
      {children}
    </div>
  );
});

Icon.displayName = "gist-ui.Icon";

export default Icon;
