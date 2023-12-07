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
   * if you want to simulate event on Space and Enter then make sure button is not type of sumbit and reset otherwise browser default behaviour takes place
   *
   * @default pointerup
   */
  simulateEvent?: "pointerup" | "pointerdown";
  /**
   * @default false
   */
  shouldCancelOnPointerExit?: boolean;
  /**
   * Indicates dispatch pointerup event on pointer exit
   *
   * @default true
   */
  shouldDispatchOnExit?: boolean;
}

const usePointerEvents = <E extends HTMLElement>(props: UsePointerEventsProps<E> = {}) => {
  const {
    onPointerDown: onPointerDownProp,
    onPointerUp: onPointerUpProp,
    pointerDownStopPropagation = true,
    pointerUpStopPropagation = true,
    button = 0,
    simulateEvent = "pointerup",
    shouldCancelOnPointerExit = false,
    shouldDispatchOnExit = true,
  } = props;

  const onPointerDown = useCallbackRef(onPointerDownProp);
  const onPointerUp = useCallbackRef(onPointerUpProp);

  const [isPressed, setIsPressed] = useState(false);

  const state = useRef<{
    target?: E | null;
    hasKeyboardEvent?: boolean;
    hasPointerEvent?: boolean;
  }>({
    target: null,
    hasKeyboardEvent: false,
    hasPointerEvent: false,
  }).current;

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<E>) => {
      if (state.hasPointerEvent) return;
      if (state.hasKeyboardEvent) return;
      if (state.target) return;

      if (!(e.target instanceof HTMLButtonElement)) return;
      if (e.target.type !== "button") return;
      if (e.key !== "Enter" && e.key !== " ") return;

      state.target = e.currentTarget;
      state.hasKeyboardEvent = true;

      setIsPressed(true);
    },
    [state],
  );

  const onKeyUp = useCallback(
    (e: React.KeyboardEvent<E>) => {
      if (!state.hasKeyboardEvent) return;
      if (!state.target) return;

      if (state.target !== e.target) {
        setIsPressed(false);
        return;
      }

      e.preventDefault();

      const event = new PointerEvent(simulateEvent, {
        bubbles: true,
        cancelable: true,
        pointerType: "simulate",
      });

      e.target.dispatchEvent(event);

      state.target = null;
      state.hasKeyboardEvent = false;
      setIsPressed(false);
    },
    [simulateEvent, state],
  );

  const handlePointerDown: React.PointerEventHandler<E> = useCallback(
    (e) => {
      if (state.hasKeyboardEvent) return;
      if (state.hasPointerEvent) return;
      if (state.target) return;
      if (button !== "all" && e.button !== button) return;

      onPointerDown(e);

      if (pointerDownStopPropagation) e.stopPropagation();

      state.target = e.currentTarget;
      state.hasPointerEvent = true;
    },
    [button, onPointerDown, pointerDownStopPropagation, state],
  );

  const handlePointerUp: React.PointerEventHandler<E> = useCallback(
    (e) => {
      if (e.pointerType !== ("simulate" as string)) {
        if (!state.hasPointerEvent) return;
        if (!state.target) return;
        if (e.target !== state.target) return;
      }

      onPointerUp(e);

      if (pointerUpStopPropagation) e.stopPropagation();

      state.target = null;
      state.hasPointerEvent = false;
    },
    [onPointerUp, pointerUpStopPropagation, state],
  );

  const handlePointerLeave: React.PointerEventHandler<E> = useCallback(
    (e) => {
      if (!shouldCancelOnPointerExit) return;

      state.target = null;
      state.hasKeyboardEvent = false;
      state.hasPointerEvent = false;

      if (shouldDispatchOnExit) {
        const event = new PointerEvent("pointerup", { bubbles: true, cancelable: true });
        e.target.dispatchEvent(event);
      }
    },
    [shouldCancelOnPointerExit, shouldDispatchOnExit, state],
  );

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
