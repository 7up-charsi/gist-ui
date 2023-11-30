import { useEffect, useState } from "react";

const useIsDisabled = <E extends HTMLElement>(callback?: (isDisabled: boolean) => void) => {
  const [ref, setRef] = useState<E | null>(null);

  useEffect(() => {
    if (!ref) return;

    if (ref.hasAttribute("disabled")) callback?.(true);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if ((mutation.target as unknown as { disabled?: boolean }).disabled) {
          callback?.(true);
        } else {
          callback?.(false);
        }
      }
    });

    observer.observe(ref, { attributeFilter: ["disabled"] });

    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return setRef;
};

export type UseIsDisabledReturn = ReturnType<typeof useIsDisabled>;

export { useIsDisabled };
