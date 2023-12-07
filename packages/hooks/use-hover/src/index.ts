import { useCallbackRef } from "@gist-ui/use-callback-ref";
import { useCallback, useEffect, useRef, useState } from "react";

export interface UseHoverProps<E> {
  onHoverStart?: React.PointerEventHandler<E>;
  onHoverEnd?: React.PointerEventHandler<E>;
  isDisabled?: boolean;
}

const useHover = <E>(props: UseHoverProps<E> = {}) => {
  const { onHoverStart: onHoverStartProp, onHoverEnd: onHoverEndProp, isDisabled } = props;

  const [isHovered, setIsHovered] = useState(false);

  const state = useRef({
    isHovered: false,
  }).current;

  const onHoverStart = useCallbackRef(onHoverStartProp);
  const onHoverEnd = useCallbackRef(onHoverEndProp);

  const handlePointerEnter: React.PointerEventHandler<E> = useCallback(
    (e) => {
      if (isDisabled || e.pointerType === "touch" || state.isHovered) return;

      onHoverStart(e);
      setIsHovered(true);
      state.isHovered = true;
    },
    [isDisabled, onHoverStart, state],
  );

  const handlePointerLeave: React.PointerEventHandler<E> = useCallback(
    (e) => {
      if (!state.isHovered) return;

      onHoverEnd(e);
      setIsHovered(false);
      state.isHovered = false;
    },
    [onHoverEnd, state],
  );

  useEffect(() => {
    if (!isDisabled) return;

    state.isHovered = false;
    setIsHovered(false);
  }, [isDisabled, state]);

  return {
    isHovered,
    hoverProps: { onPointerEnter: handlePointerEnter, onPointerLeave: handlePointerLeave },
  };
};

export type UseHoverReturn = ReturnType<typeof useHover>;

export { useHover };
