import { icon } from "@gist-ui/theme";
import { ReactNode, forwardRef } from "react";

type Size = "lg" | "md" | "sm";

export interface IconProps {
  size?: Size;
  fill?: boolean;
  children?: ReactNode;
  priority?: boolean;
}

const Icon = forwardRef<HTMLDivElement, IconProps>(({ fill, size, children }, ref) => {
  const styles = icon({ size, fill });

  return (
    <div ref={ref} className={styles}>
      {children}
    </div>
  );
});

Icon.displayName = "gist-ui.Icon";

export default Icon;
