import { RefObject, useEffect } from "react";
import { useCallbackRef } from "@gist-ui/use-callback-ref";

export interface UseClickOutsideProps<R> {
  /**
   * This will execute when user click outside of `ref`
   */
  callback?: (e: PointerEvent) => void;
  disabled?: boolean;
  ref?: RefObject<R | null>;
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
}

const useClickOutside = <R extends HTMLElement>(props: UseClickOutsideProps<R>) => {
  const { ref, callback, disabled, closeButton = 0 } = props;

  const callbackRef = useCallbackRef(callback);

  useEffect(() => {
    const el = ref?.current;

    if (!el || disabled) return;

    const handler = (e: PointerEvent) => {
      if (e.button === closeButton) {
        if (!el.contains(e.target as Node)) {
          callbackRef(e);
        }
      }
    };

    document.addEventListener("pointerup", handler);

    return () => {
      document.removeEventListener("pointerup", handler);
    };
  }, [callbackRef, closeButton, disabled, ref]);
};

export type UseClickOutsideReturn = ReturnType<typeof useClickOutside>;

export { useClickOutside };
