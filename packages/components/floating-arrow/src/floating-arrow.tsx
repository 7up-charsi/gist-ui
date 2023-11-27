import { Context, RefObject, forwardRef, useContext } from "react";
import { GistUiError } from "@gist-ui/error";
import { mergeRefs } from "@gist-ui/react-utils";
import { FloatingArrowClassNames, floatingArrow } from "@gist-ui/theme";

export interface FloatingArrowProps {
  context: unknown;
  classNames?: FloatingArrowClassNames;
}

const FloatingArrow = forwardRef<SVGSVGElement, FloatingArrowProps>((props, ref) => {
  const { context: contextProp, classNames } = props;
  const _context = useContext(contextProp as Context<unknown>);

  if (!_context) throw new GistUiError("FloatingArrow", "must be used inside valid provider");

  const context = _context as {
    placement: string;
    arrowRef: RefObject<SVGSVGElement>;
    arrowData: { x: number; y: number };
  };

  const [side] = context.placement.split("-");
  const isVerticalSide = side === "bottom" || side === "top";

  const styles = floatingArrow();

  return (
    <>
      <svg
        style={{
          [isVerticalSide ? "left" : "top"]: isVerticalSide
            ? context.arrowData?.x
            : context.arrowData?.y,
          [side]: "calc(100% - 2px)",
        }}
        data-side={context.placement.split("-")[0]}
        ref={mergeRefs(ref, context.arrowRef)}
        className={styles.base({ className: classNames?.base })}
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 102 64"
      >
        <path d="M61.1806 4.93997L102 64H0L40.8194 4.93998C45.3718 -1.64665 56.6282 -1.64667 61.1806 4.93997Z" />
      </svg>
    </>
  );
});

FloatingArrow.displayName = "gist-ui.FloatingArrow";

export default FloatingArrow;