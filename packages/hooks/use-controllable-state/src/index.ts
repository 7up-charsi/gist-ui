import { useCallbackRef } from "@gist-ui/use-callback-ref";
import { Dispatch, SetStateAction, useState } from "react";

export interface UseControllableStateProps<T> {
  /**
   * If value is true then this hook will behave as controlled
   */
  value?: T;
  defaultValue?: T | (() => T);
  onChange?: (value: T) => void;
}

const useControllableState = <T>(props: UseControllableStateProps<T> = {}) => {
  const { value: valueProp, defaultValue, onChange: onChangeProp } = props;

  const [state, setState] = useState<T | undefined>(defaultValue);
  const onChange = useCallbackRef(onChangeProp);

  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : state;

  const setValue = useCallbackRef(
    (next: SetStateAction<T>) => {
      const setter = next as (prevState?: T) => T;
      const nextValue = typeof next === "function" ? setter(value) : next;

      if (!controlled) setState(nextValue);

      onChange(nextValue);
    },
    [controlled, onChangeProp, value],
  );

  return [value, setValue] as [T, Dispatch<SetStateAction<T>>];
};

export type UseControllableStateReturn = ReturnType<typeof useControllableState>;

export { useControllableState };
