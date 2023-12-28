import { useCallbackRef } from '@gist-ui/use-callback-ref';
import { useState } from 'react';

export interface UseControllableStateProps<T> {
  /**
   * If value is defined then this hook will behave as controlled
   */
  value?: T;
  defaultValue?: T | (() => T);
  onChange?: (value: T) => void;
}

const useControllableState = <T>(props: UseControllableStateProps<T> = {}) => {
  const { value: valueProp, defaultValue, onChange: onChangeProp } = props;

  const [state, setState] = useState(defaultValue);
  const onChange = useCallbackRef(onChangeProp);

  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : state;

  const setValue = useCallbackRef((next: React.SetStateAction<T>) => {
    const setter = next as (prevState?: T) => T;
    const nextValue = typeof next === 'function' ? setter(value) : next;

    if (!controlled) setState(nextValue);

    onChange(nextValue);
  });

  return [value, setValue] as [T, typeof setValue];
};

export type UseControllableStateReturn = ReturnType<
  typeof useControllableState
>;

export { useControllableState };
