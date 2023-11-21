import { ReactNode, useRef } from "react";
import { UseScrollOverflowProps, useScrollOverflow } from "@gist-ui/use-scroll-overflow";
import { ScrollShadowClassNames, ScrollShadowVariantProps, scrollShadow } from "@gist-ui/theme";
import { Slot } from "@gist-ui/slot";

export interface ScrollShadowProps
  extends ScrollShadowVariantProps,
    Omit<UseScrollOverflowProps<HTMLDivElement>, "ref" | "direction"> {
  children?: ReactNode;
  classNames?: ScrollShadowClassNames;
  asChild?: boolean;
}

const ScrollShadow = (props: ScrollShadowProps) => {
  const {
    direction,
    children,
    classNames,
    disabled,
    offset,
    onVisibilityChange,
    visibility,
    asChild,
  } = props;

  const Component = asChild ? Slot : "div";

  const ref = useRef<HTMLDivElement>(null);

  useScrollOverflow({
    direction,
    ref: ref,
    disabled,
    offset,
    onVisibilityChange,
    visibility,
  });

  const { base } = scrollShadow({ direction });

  return (
    <Component ref={ref} className={base({ className: classNames?.base })}>
      {children}
    </Component>
  );
};

ScrollShadow.displayName = "gist-ui.ScrollShadow";

export default ScrollShadow;
