import { FocusEventHandler, useCallback } from "react";

export interface UseFocusProps<T> {
  isDisabled?: boolean;
  onFocus?: FocusEventHandler<T>;
  onBlur?: FocusEventHandler<T>;
  onFocusChange?: (isFocused: boolean) => void;
}

export function useFocus<T extends HTMLElement>(props: UseFocusProps<T> = {}) {
  const { isDisabled, onFocus: onFocusProp, onBlur: onBlurProp, onFocusChange } = props;

  const onBlur: FocusEventHandler<T> = useCallback(
    (e) => {
      onBlurProp?.(e);
      onFocusChange?.(false);

      return true;
    },
    [onBlurProp, onFocusChange],
  );

  const onFocus: FocusEventHandler<T> = useCallback(
    (e) => {
      onFocusProp?.(e);
      onFocusChange?.(true);
    },
    [onFocusProp, onFocusChange],
  );

  if (isDisabled)
    return {
      focusProps: {
        onFocus: undefined,
        onBlur: undefined,
      },
    };

  return {
    focusProps: {
      onFocus: !isDisabled && (onFocusProp || onFocusChange || onBlurProp) ? onFocus : undefined,
      onBlur: !isDisabled && (onBlurProp || onFocusChange) ? onBlur : undefined,
    },
  };
}

export type UseFocusReturn = ReturnType<typeof useFocus>;
