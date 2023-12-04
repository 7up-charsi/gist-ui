import { useEffect } from "react";
import { useCallbackRef } from "@gist-ui/use-callback-ref";

export interface UseClickOutsideProps<R> {
  /**
   * This will execute when user click outside of `ref`
   */
  callback?: (e: PointerEvent) => void;
  isDisabled?: boolean;
  ref?: R | null;
  /**
   * Indicates which button was pressed on the mouse to execute the `callback`
   *
   * 0: Main button pressed, usually the left button or the un-initialized state
   * 1: Auxiliary button pressed, usually the wheel button or the middle button (if present)
   * 2: Secondary button pressed, usually the right button
   * 3: Fourth button, typically the Browser Back button
   * 4: Fifth button, typically the Browser Forward button
   *
   * @default 0
   */
  closeButton?: number;
  /**
   * @default "pointerup"
   */
  onEvent?: "pointerup" | "pointerdown";
}

const useClickOutside = <R extends HTMLElement>(props: UseClickOutsideProps<R>) => {
  const { ref, callback, isDisabled, closeButton = 0, onEvent = "pointerup" } = props;

  const callbackRef = useCallbackRef(callback);

  useEffect(() => {
    const el = ref;

    if (!el || isDisabled) return;

    const handler = (e: PointerEvent) => {
      if (e.button === closeButton) {
        if (!el.contains(e.target as Node)) {
          callbackRef(e);
        }
      }
    };

    document.addEventListener(onEvent, handler);

    return () => {
      document.removeEventListener(onEvent, handler);
    };
  }, [callbackRef, closeButton, isDisabled, onEvent, ref]);
};

export type UseClickOutsideReturn = ReturnType<typeof useClickOutside>;

export { useClickOutside };
