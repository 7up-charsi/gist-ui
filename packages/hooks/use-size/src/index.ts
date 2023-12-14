import { useLayoutEffect, useState } from "react";

const useSize = <E extends HTMLElement>(element: E | null) => {
  const [size, setSize] = useState<
    { width: number; height: number } | undefined
  >(undefined);

  useLayoutEffect(() => {
    if (element) {
      setSize({
        width: element.offsetWidth,
        height: element.offsetHeight,
      });

      const observer = new ResizeObserver((enteies) => {
        if (!enteies.length) return;

        const entry = enteies[0];

        setSize({
          width: entry.borderBoxSize[0].inlineSize,
          height: entry.borderBoxSize[0].blockSize,
        });
      });

      observer.observe(element, { box: "border-box" });

      return () => {
        observer.unobserve(element);
      };
    } else {
      setSize(undefined);
    }
  }, [element]);

  return size;
};

export type UseSizeReturn = ReturnType<typeof useSize>;

export { useSize };
