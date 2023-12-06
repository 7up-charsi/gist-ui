import { useCallbackRef } from "@gist-ui/use-callback-ref";
import { useCallback, useRef } from "react";

export interface UsePointerEventsProps<E> {
  onPointerUp?: React.PointerEventHandler<E>;
  onPointerDown?: React.PointerEventHandler<E>;
  /**
   * @default true
   */
  pointerDownStopPropagation?: boolean;
  /**
   * @default true
   */
  pointerUpStopPropagation?: boolean;
  /**
   * Indicates which button was pressed on the mouse to execute the Events
   *
   * 0: Main button pressed, usually the left button or the un-initialized state
   * 1: Auxiliary button pressed, usually the wheel button or the middle button (if present)
   * 2: Secondary button pressed, usually the right button
   * 3: Fourth button, typically the Browser Back button
   * 4: Fifth button, typically the Browser Forward button
   *
   * @default 0
   */
  button?: number | "all";
}

const usePointerEvents = <E extends HTMLElement>(props: UsePointerEventsProps<E> = {}) => {
  const {
    onPointerDown: onPointerDownProp,
    onPointerUp: onPointerUpProp,
    pointerDownStopPropagation = true,
    pointerUpStopPropagation = true,
    button = 0,
  } = props;

  const onPointerDown = useCallbackRef(onPointerDownProp);
  const onPointerUp = useCallbackRef(onPointerUpProp);

  const state = useRef<{ target?: E | null }>({
    target: null,
  }).current;

  const handlePointerDown: React.PointerEventHandler<E> = useCallback(
    (e) => {
      if (state.target) return;

      state.target = e.currentTarget;

      if (button !== "all" && e.button !== button) return;

      onPointerDown(e);

      if (pointerDownStopPropagation) e.stopPropagation();
    },
    [button, onPointerDown, pointerDownStopPropagation, state],
  );

  const handlePointerUp: React.PointerEventHandler<E> = useCallback(
    (e) => {
      if (!state.target) return;

      if (e.target !== state.target) {
        state.target = null;
        return;
      }

      if (button !== "all" && e.button !== button) return;

      onPointerUp(e);

      if (pointerUpStopPropagation) e.stopPropagation();
    },
    [button, onPointerUp, pointerUpStopPropagation, state],
  );

  const handlePointerLeave: React.PointerEventHandler<E> = useCallback(() => {
    state.target = null;
  }, [state]);

  return {
    pointerEventProps: {
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
      onPointerLeave: handlePointerLeave,
    },
  };
};

export type UsePointerEventsReturn = ReturnType<typeof usePointerEvents>;

export { usePointerEvents };
