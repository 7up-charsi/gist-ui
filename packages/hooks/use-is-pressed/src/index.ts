import { useCallback, useState } from "react";

export interface UseIsPressedProps {}

const useIsPressed = <E extends HTMLElement>() => {
  const [isPressed, setIsPressed] = useState(false);

  const onPointerDown: React.PointerEventHandler<E> = useCallback(() => {
    setIsPressed(true);
  }, []);

  const onPointerUp: React.PointerEventHandler<E> = useCallback(() => {
    setIsPressed(true);
  }, []);

  const onKeyDown: React.KeyboardEventHandler<E> = useCallback((e) => {
    if (e.key !== "Enter" && e.key !== " ") return;

    setIsPressed(true);
  }, []);

  const onKeyUp: React.KeyboardEventHandler<E> = useCallback((e) => {
    if (e.key !== "Enter" && e.key !== " ") return;

    setIsPressed(false);
  }, []);

  return { isPressedProps: { onKeyDown, onKeyUp, onPointerDown, onPointerUp }, isPressed };
};

export type UseIsPressedReturn = ReturnType<typeof useIsPressed>;

export { useIsPressed };
