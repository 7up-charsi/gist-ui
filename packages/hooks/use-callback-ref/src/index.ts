import { DependencyList, useCallback, useEffect, useRef } from "react";

type Callback = (...args: never[]) => unknown;

const useCallbackRef = <T extends Callback>(callback: T | undefined, deps: DependencyList = []) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback(
    (...args: Parameters<T>) => callbackRef.current?.(...(args as never[])) as ReturnType<T>,
    deps,
  );
};

export type UseCallbackRefReturn = ReturnType<typeof useCallbackRef>;

export { useCallbackRef };
