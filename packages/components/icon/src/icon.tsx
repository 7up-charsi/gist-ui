import { ReactNode, forwardRef } from "react";
import { IconClassNames, IconVariantProps, icon } from "@gist-ui/theme";
import { Slot } from "@gist-ui/slot";

export interface IconProps extends IconVariantProps {
  classNames?: IconClassNames;
  children?: ReactNode;
}

const Icon = forwardRef<SVGSVGElement, IconProps>((props, ref) => {
  const { fill, size, children, classNames } = props;

  const styles = icon({ size, fill });

  return (
    <Slot<SVGSVGElement, React.SVGAttributes<SVGSVGElement>>
      ref={ref}
      className={styles.base({ className: classNames?.base })}
    >
      {children}
    </Slot>
  );
});

Icon.displayName = "gist-ui.Icon";

export default Icon;
