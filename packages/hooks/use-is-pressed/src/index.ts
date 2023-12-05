import { useCallback, useState } from "react";

export interface UseIsPressedProps {}

const useIsPressed = <E extends HTMLElement>() => {
  const [isPressed, setIsPressed] = useState<false | "pointer" | "keyboard">(false);

  const onPointerDown = useCallback((e: React.PointerEvent<E>) => {
    if (e.button !== 0) return;

    setIsPressed("pointer");
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent<E>) => {
    if (e.button !== 0) return;

    setIsPressed(false);
  }, []);

  const onKeyDown = useCallback((e: React.KeyboardEvent<E>) => {
    if (e.key !== "Enter" && e.key !== " ") return;

    setIsPressed("keyboard");
  }, []);

  const onKeyUp = useCallback((e: React.KeyboardEvent<E>) => {
    if (e.key !== "Enter" && e.key !== " ") return;

    setIsPressed(false);
  }, []);

  return { isPressedProps: { onKeyDown, onKeyUp, onPointerDown, onPointerUp }, isPressed };
};

export type UseIsPressedReturn = ReturnType<typeof useIsPressed>;

export { useIsPressed };
