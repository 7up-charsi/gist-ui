import { useCallbackRef } from "@gist-ui/use-callback-ref";
import { useCallback, useRef, useState } from "react";

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
  /**
   * Indicates when element is button which event to dispatch on Space and Enter
   *
   * if you want to simulate event on Space and Event then make sure button is not type of sumbit and reset otherwise browser default behaviour takes place
   *
   * @default pointerup
   */
  simulateEvent?: "pointerup" | "pointerdown";
}

const usePointerEvents = <E extends HTMLElement>(props: UsePointerEventsProps<E> = {}) => {
  const {
    onPointerDown: onPointerDownProp,
    onPointerUp: onPointerUpProp,
    pointerDownStopPropagation = true,
    pointerUpStopPropagation = true,
    button = 0,
    simulateEvent = "pointerup",
  } = props;

  const onPointerDown = useCallbackRef(onPointerDownProp);
  const onPointerUp = useCallbackRef(onPointerUpProp);

  const [isPressed, setIsPressed] = useState(false);

  const state = useRef<{
    target?: E | null;
  }>({
    target: null,
  }).current;

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<E>) => {
      if (!(e.target instanceof HTMLButtonElement)) {
        state.target = null;
        return;
      }

      if (e.key !== "Enter" && e.key !== " ") {
        state.target = null;
        return;
      }

      state.target = e.currentTarget;

      setIsPressed(true);
    },
    [state],
  );

  const onKeyUp = useCallback(
    (e: React.KeyboardEvent<E>) => {
      if (!state.target) return;

      if (state.target !== e.target) {
        state.target = null;
        setIsPressed(false);
        return;
      }

      state.target = null;
      setIsPressed(false);

      if (!(e.target instanceof HTMLButtonElement)) return;
      if (e.target.type === "submit" || e.target.type === "reset") return;
      if (e.key !== "Enter" && e.key !== " ") return;

      e.preventDefault();

      const event = new PointerEvent(simulateEvent, {
        bubbles: true,
        cancelable: true,
        pointerType: "simulate_keyboard",
      });

      e.target.dispatchEvent(event);
    },
    [simulateEvent, state],
  );

  const handlePointerDown: React.PointerEventHandler<E> = useCallback(
    (e) => {
      if (button !== "all" && e.button !== button) return;

      onPointerDown(e);

      if (pointerDownStopPropagation) e.stopPropagation();

      state.target = e.currentTarget;
    },
    [button, onPointerDown, pointerDownStopPropagation, state],
  );

  const handlePointerUp: React.PointerEventHandler<E> = useCallback(
    (e) => {
      if (e.pointerType !== ("simulate_keyboard" as string)) {
        if (!state.target) return;

        if (e.target !== state.target) {
          state.target = null;
          return;
        }

        if (button !== "all" && e.button !== button) {
          state.target = null;
          return;
        }
      }

      onPointerUp(e);

      if (pointerUpStopPropagation) e.stopPropagation();

      state.target = null;
    },
    [button, onPointerUp, pointerUpStopPropagation, state],
  );

  const handlePointerLeave: React.PointerEventHandler<E> = useCallback(() => {
    state.target = null;
  }, [state]);

  return {
    isPressed,
    pointerEventProps: {
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
      onPointerLeave: handlePointerLeave,
      onKeyDown,
      onKeyUp,
    },
  };
};

export type UsePointerEventsReturn = ReturnType<typeof usePointerEvents>;

export { usePointerEvents };
