import { ReactNode, forwardRef } from "react";
import { overlay, OverlayClassNames, OverlayVariantProps } from "@gist-ui/theme";
import { Slot } from "@gist-ui/slot";

export interface OverlayProps extends OverlayVariantProps {
  asChild?: boolean;
  children?: ReactNode;
  classNames?: OverlayClassNames;
}

const Overlay = forwardRef<HTMLDivElement, OverlayProps>((props, ref) => {
  const { asChild, children, variant, classNames, ...restProps } = props;

  const styles = overlay({ variant });

  const Component = asChild ? Slot : "div";

  return (
    <Component
      {...restProps}
      aria-hidden={true}
      className={styles.base({ className: classNames?.base })}
      ref={ref}
    >
      {children}
    </Component>
  );
});

Overlay.displayName = "gist-ui.Overlay";

export default Overlay;
