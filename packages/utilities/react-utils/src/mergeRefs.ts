import { ForwardedRef } from "react";

export const mergeRefs = <T extends HTMLElement>(...refs: ForwardedRef<T>[]): ForwardedRef<T> => {
  if (refs.length === 1) return refs[0];

  return (node) => {
    const filtered = refs.filter(Boolean);

    filtered.forEach((ref) => {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref !== null) {
        ref.current = node;
      }
    });
  };
};
