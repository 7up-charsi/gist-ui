import { MutableRefObject, useEffect } from "react";
import { useCallbackRef } from "@gist-ui/use-callback-ref";

export interface UseClickOutsideProps<R> {
  callback?: (e: PointerEvent) => void;
  isDisabled?: boolean;
  ref?: MutableRefObject<R | undefined | null>;
}

const useClickOutside = <R extends HTMLElement>(props: UseClickOutsideProps<R>) => {
  const { ref, callback, isDisabled } = props;

  const callbackRef = useCallbackRef(callback);

  useEffect(() => {
    const el = ref?.current;

    if (!el || isDisabled) return;

    const handler = (e: PointerEvent) => {
      if (!el.contains(e.target as Node)) {
        callbackRef(e);
      }
    };

    document.addEventListener("pointerup", handler);

    return () => {
      document.removeEventListener("pointerup", handler);
    };
  }, [callbackRef, isDisabled, ref]);
};

export type UseClickOutsideReturn = ReturnType<typeof useClickOutside>;

export { useClickOutside };
