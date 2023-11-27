import {
  useFloating as _useFloating,
  UseFloatingOptions as _UseFloatingOptions,
  arrow,
  autoUpdate,
  flip,
  offset,
  FlipOptions,
  MiddlewareData as _MiddlewareData,
  Alignment as _Alignment,
  Side as _Side,
  AlignedPlacement as _AlignedPlacement,
  Placement as _Placement,
  Strategy as _Strategy,
} from "@floating-ui/react-dom";
import { RefObject, createContext } from "react";

interface OffsetOptions {
  /**
   * The axis that runs along the side of the floating element. Represents
   * the distance (gutter or margin) between the reference and floating
   * element.
   * @default 10
   */
  mainAxis: number;
  /**
   * The axis that runs along the alignment of the floating element.
   * Represents the skidding between the reference and floating element.
   * @default 0
   */
  crossAxis: number;
  /**
   * The same axis as `crossAxis` but applies only to aligned placements
   * and inverts the `end` alignment. When set to a number, it overrides the
   * `crossAxis` value.
   *
   * A positive number will move the floating element in the direction of
   * the opposite edge to the one that is aligned, while a negative number
   * the reverse.
   * @default 5
   */
  alignmentAxis: number | null;
}

type Padding =
  | number
  | Partial<{
      [key in Side]: number;
    }>;

interface ArrowOptions {
  /**
   * The arrow element to be positioned.
   * @default undefined
   */
  element: React.MutableRefObject<Element | null> | Element | null;
  /**
   * The padding between the arrow element and the floating element edges.
   * Useful when the floating element has rounded corners.
   * @default 10
   */
  padding?: Padding;
}

export type Alignment = _Alignment;
export type Side = _Side;
export type AlignedPlacement = _AlignedPlacement;
export type Placement = _Placement;
export type Strategy = _Strategy;
export type MiddlewareData = _MiddlewareData;

export interface UseFloatingMiddlewareOptions {
  offsetOptions?: OffsetOptions;
  flipOptions?: FlipOptions;
  arrowOptions?: ArrowOptions;
}

export interface UseFloatingOptions extends Omit<_UseFloatingOptions, "middleware"> {}

export const FloatingArrowContext = createContext<{
  middlewareData: MiddlewareData;
  side: Side;
  arrowRef: RefObject<SVGSVGElement>;
} | null>(null);

export interface UseFloatingProps extends UseFloatingOptions, UseFloatingMiddlewareOptions {}

const useFloating = (props: UseFloatingProps = {}) => {
  const {
    elements,
    open,
    placement,
    platform,
    strategy,
    transform,
    whileElementsMounted,
    offsetOptions: { mainAxis = 10, alignmentAxis = 5, crossAxis = 0 } = {},
    flipOptions,
    arrowOptions: { element = null, padding = 10 } = {},
  } = props;

  const floating = _useFloating({
    open,
    elements,
    placement,
    platform,
    strategy,
    transform,
    whileElementsMounted: whileElementsMounted || autoUpdate,
    middleware: [
      offset({
        mainAxis,
        alignmentAxis,
        crossAxis,
      }),
      flip(flipOptions),
      arrow({ element, padding }),
    ],
  });

  return floating;
};

export type UseFloatingReturn = ReturnType<typeof useFloating>;

export { useFloating };
