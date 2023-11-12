import { SVGAttributes, forwardRef, useId } from "react";
import { __DEV__ } from "@gist-ui/shared-utils";
import {
  platform,
  Alignment,
  Side,
  Placement,
  Elements,
  MiddlewareData,
} from "@floating-ui/react-dom";

export interface ArrowProps extends SVGAttributes<SVGSVGElement> {
  placement: Placement;
  floatingElement: Elements["floating"] | null;
  arrowData: MiddlewareData["arrow"];
  width?: number;
  height?: number;
  tipRadius?: number;
  staticOffset?: string | number | null;
  d?: string;
  stroke?: string;
  strokeWidth?: number;
}

// eslint-disable-next-line react/display-name
const Arrow = forwardRef<SVGSVGElement, ArrowProps>((props, ref) => {
  const {
    placement,
    floatingElement: floating,
    arrowData: arrow,
    width = 10,
    height = 5,
    tipRadius = 0,
    strokeWidth: sw = 0,
    staticOffset,
    stroke,
    d,
    style: { transform, ...restStyle } = {},
    ...rest
  } = props;

  const clipPathId = useId();

  if (__DEV__ && !ref) {
    console.warn("Gist-ui tooltip: The `ref` prop is required for the `arrow`", "component.");
  }

  if (!floating) {
    return null;
  }

  // Strokes must be double the border width, this ensures the stroke's width
  // works as you'd expect.
  const strokeWidth = sw * 2;
  const halfStrokeWidth = strokeWidth / 2;

  const svgX = (width / 2) * (tipRadius / -8 + 1);
  const svgY = ((height / 2) * tipRadius) / 4;

  const [side, alignment] = placement.split("-") as [Side, Alignment];
  const isRTL = floating ? platform.isRTL(floating) : false;
  const isCustomShape = !!d;
  const isVerticalSide = side === "top" || side === "bottom";

  const yOffsetProp = staticOffset && alignment === "end" ? "bottom" : "top";
  let xOffsetProp = staticOffset && alignment === "end" ? "right" : "left";
  if (staticOffset && isRTL) {
    xOffsetProp = alignment === "end" ? "left" : "right";
  }

  const arrowOffsetY = isCustomShape ? 0 : halfStrokeWidth;
  const arrowX = arrow?.x != null ? staticOffset || arrow.x : "";
  const arrowY = arrow?.y != null ? staticOffset || arrow.y + arrowOffsetY : "";

  const dValue =
    d ||
    "M0,0" +
      ` H${width}` +
      ` L${width - svgX},${height - svgY}` +
      ` Q${width / 2},${height} ${svgX},${height - svgY}` +
      " Z";

  const rotation = {
    top: isCustomShape ? "rotate(180deg)" : "",
    left: isCustomShape ? "rotate(90deg)" : "rotate(-90deg)",
    bottom: isCustomShape ? "" : "rotate(180deg)",
    right: isCustomShape ? "rotate(-90deg)" : "rotate(90deg)",
  }[side];

  return (
    <svg
      {...rest}
      aria-hidden
      ref={ref}
      width={isCustomShape ? width : width + strokeWidth}
      height={width}
      viewBox={`0 0 ${width} ${height > width ? height : width}`}
      style={{
        position: "absolute",
        pointerEvents: "none",
        [xOffsetProp]: arrowX,
        [yOffsetProp]: arrowY,
        [side]: isVerticalSide || isCustomShape ? "100%" : `calc(100% - ${strokeWidth / 2}px)`,
        transform: `${rotation}${transform ?? ""}`,
        ...restStyle,
      }}
    >
      {strokeWidth > 0 && (
        <path
          clipPath={`url(#${clipPathId})`}
          fill="none"
          stroke={stroke}
          // Account for the stroke on the fill path rendered below.
          strokeWidth={strokeWidth + (d ? 0 : 1)}
          d={dValue}
        />
      )}
      {/* In Firefox, for left/right placements there's a ~0.5px gap where the
      border can show through. Adding a stroke on the fill removes it. */}
      <path stroke={strokeWidth && !d ? rest.fill : "none"} d={dValue} />
      {/* Assumes the border-width of the floating element matches the 
      stroke. */}
      <clipPath id={clipPathId}>
        <rect
          x={-halfStrokeWidth}
          y={halfStrokeWidth * (isCustomShape ? -1 : 1)}
          width={width + strokeWidth}
          height={width}
        />
      </clipPath>
    </svg>
  );
});

export default Arrow;
