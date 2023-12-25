import { useCallback } from 'react';

export interface UseRippleProps {
  /**
   * this is used as css transition duration for ripple popup animation and popup duration depends on `completedFactor` prop
   *
   * @default 500
   */
  duration?: number;
  /**
   * this is used as css transition timning function for ripple popup animation
   *
   * @default cubic-bezier(.42,.36,.28,.88)
   */
  timingFunction?: string;
  isDisabled?: boolean;

  /**
   * This prop means how much part of `duration` is used to appear the ripple and rest ot it used to disappear it
   * @default 0.5
   */
  completedFactor?: number;
  /**
   * . when this prop is true, ripple will popup from the center of pointer
   * . when this porp is false, ripple will popup from the center of element on which returned ref has set
   *
   * @default true
   */
  pointerCenter?: boolean;
}

const useRipple = <E extends HTMLElement>({
  duration = 500,
  timingFunction = 'cubic-bezier(.42,.36,.28,.88)',
  isDisabled = false,
  completedFactor = 0.5,
  pointerCenter = true,
}: UseRippleProps = {}) => {
  //

  const onPointerDown = useCallback(
    (e: React.PointerEvent<E>) => {
      if (isDisabled || e.button !== 0) return;

      const target = e.target as HTMLElement;

      const begun = Date.now();

      const ripple = createRipple(target, e, {
        duration,
        completedFactor,
        isDisabled,
        pointerCenter,
        timingFunction,
      });

      target.appendChild(ripple);

      const removeRipple = () => {
        const now = Date.now();
        const diff = now - begun;

        setTimeout(
          () => {
            ripple.style.opacity = '0';

            ripple.addEventListener(
              'transitionend',
              (e) => {
                console.log(e.propertyName);
                if (e.propertyName === 'opacity') ripple.remove();
              },
              { once: true },
            );
          },
          diff > completedFactor * duration
            ? 0
            : completedFactor * duration - diff,
        );
      };

      document.addEventListener('pointerup', removeRipple, {
        once: true,
        capture: true,
      });
    },
    [completedFactor, duration, isDisabled, pointerCenter, timingFunction],
  );

  return {
    rippleProps: { onPointerDown },
  };
};

const createRipple = (
  target: HTMLElement,
  event: React.PointerEvent,
  options: UseRippleProps,
): HTMLElement => {
  const { height, width, top, left } = target.getBoundingClientRect();
  const { clientX, clientY } = options.pointerCenter
    ? event
    : { clientX: left + width / 2, clientY: top + height / 2 };

  const maxHeight = Math.max(clientY - top, height - clientY + top);
  const maxWidth = Math.max(clientX - left, width - clientX + left);
  const size = Math.hypot(maxHeight, maxWidth) * 2;

  const element = document.createElement('span');

  const { duration, timingFunction } = options as Required<UseRippleProps>;

  element.style.cssText = `
    position: absolute;
    top: ${options.pointerCenter ? `${event.clientY - top}px` : '50%'};
    left: ${options.pointerCenter ? `${event.clientX - left}px` : '50%'};
    height: ${size}px;
    width: ${size}px;
    translate: -50% -50%;
    pointer-events: none;
    border-radius: 50%;
    background-color: var(--rippleBg);
    scale: 0;
    transition: scale ${duration}ms ${timingFunction}, opacity ${
      duration * 0.7
    }ms ease-in-out;
    `;

  requestAnimationFrame(() => {
    element.style.scale = '1';
  });

  return element;
};

export type UseRippleReturn = ReturnType<typeof useRipple>;

export { useRipple };
