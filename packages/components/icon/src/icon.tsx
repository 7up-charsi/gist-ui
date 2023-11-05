import { ReactNode, forwardRef } from "react";
import { IconVariantProps, icon } from "@gist-ui/theme";

export interface IconProps extends IconVariantProps {
  children?: ReactNode;
}

const Icon = forwardRef<HTMLDivElement, IconProps>(({ fill, size, children, color }, ref) => {
  const styles = icon({ size, fill, color });

  return (
    <div ref={ref} className={styles}>
      {children}
    </div>
  );
});

Icon.displayName = "gist-ui.Icon";

export default Icon;
