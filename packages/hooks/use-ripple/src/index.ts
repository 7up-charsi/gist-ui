import { useCallback, useRef } from "react";

export interface UseRippleProps {
  duration?: number;
  timingFunction?: string;
  disabled?: boolean;
  completedFactor?: number;
  pointerCenter?: boolean;
}

export interface MinimalEvent {
  clientX: number;
  clientY: number;
  button: number;
}

const useRipple = <T extends HTMLElement>(_props?: UseRippleProps) => {
  const ref = useRef<T>(null);

  const props = {
    duration: 500,
    timingFunction: "cubic-bezier(.42,.36,.28,.88)",
    disabled: false,
    completedFactor: 0.5,
    pointerCenter: true,
    ...(_props || {}),
  };

  const { disabled, duration, completedFactor } = props as Required<UseRippleProps>;

  const event = useCallback((event: MinimalEvent) => {
    if (!ref.current || disabled || event.button !== 0) return;

    const target = ref.current;

    requestAnimationFrame(() => {
      const begun = Date.now();
      const ripple = createRipple(target, event, props);
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
};

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

  const { duration, timingFunction } = options as Required<UseRippleProps>;

  element.style.cssText = `
    position: absolute;
    top: ${options.pointerCenter ? `${event.clientY - top}px` : "50%"};
    left: ${options.pointerCenter ? `${event.clientX - left}px` : "50%"};
    height: ${options.pointerCenter ? `${size}px` : `${Math.max(height, width)}px`};
    width:  ${options.pointerCenter ? `${size}px` : `${Math.max(height, width)}px`};
    translate: -50% -50%;
    pointer-events: none;
    border-radius: 50%;
    background-color: var(--rippleBg);
    scale: 0;
    transition: scale ${duration}ms ${timingFunction}, opacity ${duration * 0.7}ms ease-in-out;
    `;

  requestAnimationFrame(() => {
    element.style.scale = "1";
  });

  return element;
};

export type UseRippleReturn = ReturnType<typeof useRipple>;

export { useRipple };
