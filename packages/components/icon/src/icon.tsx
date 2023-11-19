import { ReactNode, forwardRef } from "react";
import { IconVariantProps, icon } from "@gist-ui/theme";
import { Slot } from "@gist-ui/slot";

export interface IconProps extends IconVariantProps {
  className?: string;
  children?: ReactNode;
  asChild?: boolean;
}

const Icon = forwardRef<HTMLDivElement, IconProps>((props, ref) => {
  const { fill, size, children, className, asChild } = props;

  const Component = asChild ? Slot : "div";

  const styles = icon({ size, fill, className });

  return (
    <Component ref={ref} className={styles}>
      {children}
    </Component>
  );
});

Icon.displayName = "gist-ui.Icon";

export default Icon;
