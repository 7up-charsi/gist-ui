import { createContextScope } from "@gist-ui/context";
import { Slot } from "@gist-ui/slot";
import { useSize } from "@gist-ui/use-size";
import { forwardRef, useEffect, useState } from "react";
import {
  FlipOptions,
  Side,
  UseFloatingOptions,
  arrow as arrowMiddleware,
  autoUpdate,
  flip,
  hide,
  limitShift,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react-dom";

interface PopperContext {
  reference: HTMLElement | null;
  setReference: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

const Popper_Name = "Popper.Root";

const [Provider, useContext] = createContextScope<PopperContext>(Popper_Name);

export interface PopperProps {
  children?: React.ReactNode;
}

export const Root = (props: PopperProps) => {
  const { children } = props;

  const [reference, setReference] = useState<HTMLElement | null>(null);

  return (
    <Provider reference={reference} setReference={setReference}>
      {children}
    </Provider>
  );
};

Root.displayName = "gist-ui." + Popper_Name;

const Reference_Name = "Popper.Reference";

export interface ReferenceProps {
  children?: React.ReactNode;
  /**
   * Position a floating element relative to a custom reference area, useful for context menus, range selections, following the cursor, and more.
   *
   * @see {@link https://floating-ui.com/docs/virtual-elements virtual-elements}
   *
   * @default false
   */
  virturalElement?: HTMLElement;
}

export const Reference = (props: ReferenceProps) => {
  const { children, virturalElement } = props;

  const context = useContext(Reference_Name);

  useEffect(() => {
    if (virturalElement) context.setReference(virturalElement);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [virturalElement]);

  return virturalElement ? null : <Slot ref={context.setReference}>{children}</Slot>;
};

Reference.displayName = "gist-ui." + Reference_Name;

const Floating_Name = "Popper.Reference";

interface ArrowContext {
  side: Side;
  arrowX?: number;
  arrowY?: number;
  setArrow: React.Dispatch<React.SetStateAction<HTMLSpanElement | null>>;
  shouldHideArrow: boolean;
}

const [ArrowProvider, useArrowContext] = createContextScope<ArrowContext>(Floating_Name);

export interface FloatingProps {
  children?: React.ReactNode;
  open?: UseFloatingOptions["open"];
  placement?: UseFloatingOptions["placement"];
  updatePositionStrategy?: "optimized" | "always";
  /**
   * Represents the distance (gutter or margin) between the floating element and the reference element
   *
   * @see {@link https://floating-ui.com/docs/offset#mainaxis mainaxis}
   * @default 0
   */
  mainOffset?: number;
  /**
   * Represents the skidding between the floating element and the reference element
   *
   * @see {@link https://floating-ui.com/docs/offset#alignmentaxis alignmentaxis}
   * @default 0
   */
  alignOffset?: number;
  arrow?: boolean;
  /**
   * This describes the padding between the arrow and the edges of the floating element. If your floating element has border-radius, this will prevent it from overflowing the corners.
   *
   * @see {@link https://floating-ui.com/docs/arrow#padding padding}
   * @default 0
   */
  arrowPadding?: number;
  sticky?: "partial" | "always";
  hideWhenDetached?: boolean;
  /**
   * @see {@link https://floating-ui.com/docs/flip#fallbackplacements fallbackPlacements}
   */
  fallbackPlacements?: FlipOptions["fallbackPlacements"];
  /**
   * @see {@link https://floating-ui.com/docs/flip#mainaxis mainAxis}
   * @default true
   */
  allowMainAxisFlip?: boolean;
  /**
   * when "sticky" prop is "partial" then its value will be false and it will not effect
   *
   * @see {@link https://floating-ui.com/docs/flip#crossaxis crossAxis}
   * @default true
   */
  allowCrossAxisFlip?: boolean;
}

export const Floating = (props: FloatingProps) => {
  const {
    children,
    open,
    placement: placementProp,
    updatePositionStrategy = "optimized",
    mainOffset = 0,
    alignOffset = 0,
    arrow: arrowProp = true,
    arrowPadding,
    sticky = "partial",
    hideWhenDetached = true,
    fallbackPlacements,
    allowCrossAxisFlip = true,
    allowMainAxisFlip = true,
  } = props;

  const context = useContext(Floating_Name);
  const [arrow, setArrow] = useState<HTMLSpanElement | null>(null);
  const size = useSize(arrow);

  const { middlewareData, placement, floatingStyles, refs } = useFloating({
    open,
    placement: placementProp,
    strategy: "fixed",
    elements: { reference: context.reference },
    whileElementsMounted: (...args) =>
      autoUpdate(...args, { animationFrame: updatePositionStrategy === "always" }),
    middleware: [
      offset({
        mainAxis: mainOffset + (size?.height ?? 0),
        alignmentAxis: alignOffset,
      }),
      !allowMainAxisFlip && !allowCrossAxisFlip
        ? false
        : flip({
            fallbackPlacements,
            mainAxis: allowMainAxisFlip,
            crossAxis: sticky === "partial" ? false : allowCrossAxisFlip,
          }),
      sticky === "partial" &&
        shift({
          limiter: limitShift({
            offset: ({ placement, elements }) =>
              placement.includes("top") || placement.includes("bottom")
                ? elements.reference.offsetWidth / 2
                : elements.reference.offsetHeight / 2,
          }),
        }),
      arrowProp && arrowMiddleware({ padding: arrowPadding, element: arrow }),
      hideWhenDetached && hide({ strategy: "referenceHidden" }),
    ],
  });

  const arrowData = middlewareData.arrow;

  return (
    <ArrowProvider
      arrowX={arrowData?.x}
      arrowY={arrowData?.y}
      side={placement.split("-")[0] as Side}
      setArrow={setArrow}
      shouldHideArrow={arrowData?.centerOffset !== 0}
    >
      <Slot ref={refs.setFloating} {...{ style: floatingStyles }}>
        {children}
      </Slot>
    </ArrowProvider>
  );
};

Floating.displayName = "gist-ui." + Floating_Name;

const Arrow_Name = "Popper.Arrow";

const OPPOSITE_SIDE: Record<Side, Side> = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right",
};

export const Arrow = forwardRef<SVGSVGElement, React.SVGAttributes<SVGSVGElement>>((props, ref) => {
  const context = useArrowContext(Arrow_Name);
  const baseSide = OPPOSITE_SIDE[context.side];

  return (
    <span
      ref={context.setArrow}
      style={{
        position: "absolute",
        left: context.arrowX,
        top: context.arrowY,
        [baseSide]: 0,
        transformOrigin: {
          top: "",
          right: "0 0",
          bottom: "center 0",
          left: "100% 0",
        }[context.side],
        transform: {
          top: "translateY(100%)",
          right: "translateY(50%) rotate(90deg) translateX(-50%)",
          bottom: `rotate(180deg)`,
          left: "translateY(50%) rotate(-90deg) translateX(50%)",
        }[context.side],
        visibility: context.shouldHideArrow ? "hidden" : "visible",
      }}
    >
      <svg
        {...props}
        width={props.width || 12}
        height={props.height || 7}
        ref={ref}
        viewBox="0 0 30 10"
        preserveAspectRatio="none"
      >
        <polygon points="0,0 30,0 15,10" />
      </svg>
    </span>
  );
});

Arrow.displayName = "gist-ui." + Arrow_Name;
