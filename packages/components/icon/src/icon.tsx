import { icon } from "@gist-ui/theme";
import { ReactNode, createContext, forwardRef, useContext } from "react";

type Size = "lg" | "md" | "sm";

export interface IconProps {
  size?: Size;
  fill?: boolean;
  children?: ReactNode;
  priority?: boolean;
}

export const IconContext = createContext<{ size?: Size }>({});

const Icon = forwardRef<HTMLDivElement, IconProps>(({ fill, size, children, priority }, ref) => {
  const context = useContext(IconContext);

  const styles = icon({ size: priority ? size || context.size : context.size || size, fill });

  return (
    <div ref={ref} className={styles}>
      {children}
    </div>
  );
});

Icon.displayName = "gist-ui.Icon";

export default Icon;
