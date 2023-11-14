import { DependencyList, useEffect, useRef } from "react";

export type ScrollOverflowOrientation = "horizontal" | "vertical";
export type ScrollOverflowCheck = ScrollOverflowOrientation | "both";
export type ScrollOverflowVisibility =
  | "auto"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "both"
  | "none";

export interface UseScrollShadowProps {
  overflowCheck?: ScrollOverflowCheck;
  // visibility?: ScrollOverflowVisibility;
  isDisabled?: boolean;
  offset?: number;
  onVisibilityChange?: (overflow: ScrollOverflowVisibility) => void;
  deps?: DependencyList;
}

const useScrollShadow = <R extends HTMLElement>(props: UseScrollShadowProps = {}) => {
  const { isDisabled, overflowCheck = "vertical", offset = 0, deps = [] } = props;

  const ref = useRef<R>(null);

  useEffect(() => {
    const el = ref.current;

    if (!el || !isDisabled) return;

    const checkOverflow = () => {
      const directions = [
        { type: "vertical", prefix: "top", suffix: "bottom" },
        { type: "horizontal", prefix: "left", suffix: "right" },
      ];

      for (const { type, prefix, suffix } of directions) {
        if (overflowCheck === type || overflowCheck === "both") {
          const hasBefore = type === "vertical" ? el.scrollTop > offset : el.scrollLeft > offset;
          const hasAfter =
            type === "vertical"
              ? el.scrollTop + el.clientHeight + offset < el.scrollHeight
              : el.scrollLeft + el.clientWidth + offset < el.scrollWidth;

          setAttributes(type, hasBefore, hasAfter, prefix, suffix);
        }
      }
    };

    checkOverflow();

    el.addEventListener("scroll", checkOverflow);

    return () => {
      el.removeEventListener("scroll", checkOverflow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDisabled, offset, overflowCheck, ...deps]);

  return ref;
};

export type UseScrollShadowReturn = ReturnType<typeof useScrollShadow>;

export { useScrollShadow };
