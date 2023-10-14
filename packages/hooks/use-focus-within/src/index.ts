import { FocusEventHandler, useCallback, useRef } from "react";

export interface UseFocusWithinProps<T> {
  /** Whether the focus within events should be disabled. */
  isDisabled?: boolean;
  /** Handler that is called when the target element or a descendant receives focus. */
  onFocusWithin?: FocusEventHandler<T>;
  /** Handler that is called when the target element and all descendants lose focus. */
  onBlurWithin?: FocusEventHandler<T>;
  /** Handler that is called when the the focus within state changes. */
  onFocusWithinChange?: (isFocusWithin: boolean) => void;
}

export function useFocusWithin<T extends HTMLElement>(props: UseFocusWithinProps<T> = {}) {
  const { isDisabled, onBlurWithin, onFocusWithin, onFocusWithinChange } = props;

  const state = useRef({
    isFocusWithin: false,
  });

  const onBlur: FocusEventHandler<T> = useCallback(
    (e) => {
      // We don't want to trigger onBlurWithin and then immediately onFocusWithin again
      // when moving focus inside the element.
      if (state.current.isFocusWithin && !e.currentTarget.contains(e.relatedTarget)) {
        state.current.isFocusWithin = false;

        onBlurWithin?.(e);
        onFocusWithinChange?.(false);
      }
    },
    [onBlurWithin, onFocusWithinChange],
  );

  const onFocus: FocusEventHandler<T> = useCallback(
    (e) => {
      // Double check that document.activeElement actually matches e.target
      if (!state.current.isFocusWithin && document.activeElement === e.target) {
        onFocusWithin?.(e);
        onFocusWithinChange?.(true);

        state.current.isFocusWithin = true;
      }
    },
    [onFocusWithin, onFocusWithinChange],
  );

  if (isDisabled)
    return {
      focusWithinProps: {
        onFocus: null,
        onBlur: null,
      },
    };

  return {
    focusWithinProps: {
      onFocus,
      onBlur,
    },
  };
}

export type UseFocusWithinReturn = ReturnType<typeof useFocusWithin>;
