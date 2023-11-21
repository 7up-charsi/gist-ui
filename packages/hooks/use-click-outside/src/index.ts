import { MutableRefObject, useEffect } from "react";
import { useCallbackRef } from "@gist-ui/use-callback-ref";

export interface UseClickOutsideProps<R> {
  callback?: (e: PointerEvent) => void;
  disabled?: boolean;
  ref?: MutableRefObject<R | undefined | null>;
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
