import { RefObject, useEffect, useRef } from "react";
import { capitalize } from "@gist-ui/shared-utils";

export type ScrollOverflowDirection = "horizontal" | "vertical" | "both";
export type ScrollOverflowVisibility =
  | "auto"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "both"
  | "none";

export interface UseScrollOverflowProps<R> {
  direction?: ScrollOverflowDirection;
  /**
   * This prop is used to make this hook controlled
   *
   * if this prop is defined then shadow will always show at defined visibility side
   */
  visibility?: ScrollOverflowVisibility;
  isDisabled?: boolean;
  offset?: number;
  /**
   * This prop is used to make this hook controlled
   *
   * This prop is used with `visibility` prop
   */
  onVisibilityChange?: (overflow: ScrollOverflowVisibility) => void;
  /**
   * Ref of element on which shadow will be added
   */
  ref?: RefObject<R>;
}

const useScrollOverflow = <R extends HTMLElement>(
  props: UseScrollOverflowProps<R> = {},
) => {
  const {
    isDisabled,
    direction = "vertical",
    offset = 0,
    onVisibilityChange,
    visibility = "auto",
    ref,
  } = props;

  const prevVisiblility = useRef(visibility);

  useEffect(() => {
    const el = ref?.current;

    if (!el || isDisabled) return;

    const clearOverflow = () => {
      ["top", "bottom", "top-bottom", "left", "right", "left-right"].forEach(
        (attr) => {
          el.removeAttribute(`data-${attr}-scroll`);
        },
      );
    };

    // controlled
    if (visibility === "none") {
      clearOverflow();
    }

    // controlled
    if (visibility !== "auto" && visibility !== "none") {
      clearOverflow();

      if (visibility === "both") {
        el.dataset.topBottomScroll = (direction === "vertical") + "";
        el.dataset.leftRightScroll = (direction === "horizontal") + "";
      } else {
        el.dataset.topBottomScroll = "false";
        el.dataset.leftRightScroll = "false";

        el.dataset[`${visibility}Scroll`] = "true";
      }
    }

    const checkOverflow = () => {
      const directions: {
        type: ScrollOverflowDirection;
        prefix: ScrollOverflowVisibility;
        suffix: ScrollOverflowVisibility;
      }[] = [
        { type: "vertical", prefix: "top", suffix: "bottom" },
        { type: "horizontal", prefix: "left", suffix: "right" },
      ];

      directions.forEach(({ type, prefix, suffix }) => {
        if (direction === type || direction === "both") {
          const hasBefore =
            type === "vertical"
              ? el.scrollTop > offset
              : el.scrollLeft > offset;
          const hasAfter =
            type === "vertical"
              ? el.scrollTop + el.clientHeight + offset < el.scrollHeight
              : el.scrollLeft + el.clientWidth + offset < el.scrollWidth;

          // if visibility is auto its mean we need to check whether scroll is at top, bottom or between
          if (visibility === "auto") {
            const both = `${prefix}${capitalize(suffix)}Scroll`;

            if (hasBefore && hasAfter) {
              el.dataset[both] = "true";
              el.removeAttribute(`data-${prefix}-scroll`);
              el.removeAttribute(`data-${suffix}-scroll`);
            } else {
              el.dataset[`${prefix}Scroll`] = hasBefore.toString();
              el.dataset[`${suffix}Scroll`] = hasAfter.toString();
              el.removeAttribute(`data-${prefix}-${suffix}-scroll`);
            }
          } else {
            /* 
              only call onVisibilityChange here because visiblity is static or controlled and dont need to update
              on scroll
            */

            const next: ScrollOverflowVisibility =
              hasBefore && hasAfter
                ? "both"
                : hasBefore
                ? prefix
                : hasAfter
                ? suffix
                : "none";

            if (next !== prevVisiblility.current) {
              onVisibilityChange?.(next);
              prevVisiblility.current = next;
            }
          }
        }
      });
    };

    checkOverflow();
    el.addEventListener("scroll", checkOverflow);

    return () => {
      el.removeEventListener("scroll", checkOverflow);
      clearOverflow();
    };
  }, [direction, isDisabled, offset, onVisibilityChange, ref, visibility]);
};

export type UseScrollOverflowReturn = ReturnType<typeof useScrollOverflow>;

export { useScrollOverflow };
