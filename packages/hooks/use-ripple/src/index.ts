import { useCallback, useMemo, useRef } from "react";

export interface UseRippleProps {
  duration: number;
  timingFunction: string;
  disabled: boolean;
  completedFactor: number;
}

export interface MinimalEvent {
  clientX: number;
  clientY: number;
  button: number;
}

export function useRipple<T extends HTMLElement>(props: Partial<UseRippleProps> = {}) {
  const ref = useRef<T>(null);

  const options: UseRippleProps = useMemo(
    () => ({
      duration: 500,
      timingFunction: "cubic-bezier(.42,.36,.28,.88)",
      disabled: false,
      completedFactor: 0.5,
      ...(props ?? {}),
    }),
    [props],
  );

  const { disabled, duration, completedFactor } = options;

  const event = useCallback((event: MinimalEvent) => {
    if (!ref.current || disabled || event.button !== 0) return;

    const target = ref.current;

    requestAnimationFrame(() => {
      const begun = Date.now();
      const ripple = createRipple(target, event, options);
      target.appendChild(ripple);

      const removeRipple = () => {
        const now = Date.now();
        const diff = now - begun;

        setTimeout(
          () => {
            ripple.style.opacity = "0";

            ripple.addEventListener("transitionend", (e) => {
              if (e.propertyName === "opacity") ripple.remove();
            });
          },
          diff > completedFactor * duration ? 0 : completedFactor * duration - diff,
        );
      };

      document.addEventListener("pointerup", removeRipple, { once: true });
    });
  }, []);

  return [ref, event] as const;
}

const createRipple = (
  target: HTMLElement,
  event: MinimalEvent,
  options: UseRippleProps,
): HTMLElement => {
  const { clientX, clientY } = event;
  const { height, width, top, left } = target.getBoundingClientRect();
  const maxHeight = Math.max(clientY - top, height - clientY + top);
  const maxWidth = Math.max(clientX - left, width - clientX + left);
  const size = Math.hypot(maxHeight, maxWidth) * 2;

  const element = document.createElement("span");

  element.style.cssText = `
    position: absolute;
    top: ${event.clientY - top}px;
    left: ${event.clientX - left}px;
    height: ${size}px;
    width: ${size}px;
    translate: -50% -50%;
    pointer-events: none;
    border-radius: 50%;
    background-color: var(--rippleBg);
    scale: 0;
    transition: scale ${options.duration}ms ${options.timingFunction}, opacity ${
      options.duration * 0.7
    }ms ease-in-out;
    `;

  requestAnimationFrame(() => {
    element.style.scale = "1";
  });

  return element;
};

export type UseRippleReturn = ReturnType<typeof useRipple>;