import { ElementType, HTMLAttributes, ReactNode, forwardRef, useRef } from "react";
import { UseScrollOverflowProps, useScrollOverflow } from "@gist-ui/use-scroll-overflow";
import { ScrollShadowClassNames, ScrollShadowVariantProps, scrollShadow } from "@gist-ui/theme";
import { mergeRefs } from "@gist-ui/react-utils";

export interface ScrollShadowProps
  extends ScrollShadowVariantProps,
    Omit<UseScrollOverflowProps<HTMLDivElement>, "ref" | "direction">,
    Omit<HTMLAttributes<HTMLDivElement>, "className"> {
  children?: ReactNode;
  as?: ElementType;
  classNames?: ScrollShadowClassNames;
}

const ScrollShadow = forwardRef<HTMLDivElement, ScrollShadowProps>((props, ref) => {
  const {
    as: Comp = "div",
    direction,
    children,
    classNames,
    isDisabled,
    offset,
    onVisibilityChange,
    visibility,

    ...rest
  } = props;

  const innerRef = useRef<HTMLDivElement>(null);

  useScrollOverflow({
    direction,
    ref: innerRef,
    isDisabled,
    offset,
    onVisibilityChange,
    visibility,
  });

  const { base } = scrollShadow({ direction });

  return (
    <Comp
      {...rest}
      ref={mergeRefs(ref, innerRef)}
      className={base({ className: classNames?.base })}
    >
      {children}
    </Comp>
  );
});

ScrollShadow.displayName = "gist-ui.ScrollShadow";

export default ScrollShadow;
