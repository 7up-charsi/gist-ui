import { DependencyList, useCallback, useEffect, useRef } from "react";

type Callback = (...args: unknown[]) => unknown;

const useCallbackRef = <T extends Callback>(callback: T, deps: DependencyList = []) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback((...args: unknown[]) => callbackRef.current?.(...args) as T, deps);
};

export type UseCallbackRefReturn = ReturnType<typeof useCallbackRef>;

export { useCallbackRef };
