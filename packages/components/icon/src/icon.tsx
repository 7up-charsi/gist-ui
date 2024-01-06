import { ReactNode, forwardRef } from 'react';
import { IconVariantProps, icon } from '@gist-ui/theme';
import { Slot } from '@gist-ui/slot';
import { ClassValue } from 'tailwind-variants';

export interface IconProps extends IconVariantProps {
  className?: ClassValue;
  children?: ReactNode;
}

const Icon = forwardRef<SVGSVGElement, IconProps>((props, ref) => {
  const { size, children, className } = props;

  const styles = icon({ size, className });

  return (
    <Slot<SVGSVGElement, React.SVGAttributes<SVGSVGElement>>
      ref={ref}
      className={styles}
    >
      {children}
    </Slot>
  );
});

Icon.displayName = 'gist-ui.Icon';

export default Icon;
