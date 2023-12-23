import { useEffect } from 'react';
import { useCallbackRef } from '@gist-ui/use-callback-ref';

export interface UseIsDisabledProps<E> {
  ref?: React.RefObject<E>;
  callback?: (isDisabled: boolean) => void;
}

const useIsDisabled = <E extends HTMLElement>(props: UseIsDisabledProps<E>) => {
  const { ref, callback } = props;
  const callbackRef = useCallbackRef(callback);

  useEffect(() => {
    if (!ref?.current) return;

    const element = ref.current;

    if (element.hasAttribute('disabled')) callbackRef?.(true);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if ((mutation.target as unknown as { disabled?: boolean }).disabled) {
          callbackRef?.(true);
        } else {
          callbackRef?.(false);
        }
      }
    });

    observer.observe(element, { attributeFilter: ['disabled'] });

    return () => {
      observer.disconnect();
    };
  }, [callbackRef, ref]);
};

export type UseIsDisabledReturn = ReturnType<typeof useIsDisabled>;

export { useIsDisabled };
