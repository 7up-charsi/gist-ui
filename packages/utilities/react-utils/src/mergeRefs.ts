import { Dispatch, ForwardedRef, MutableRefObject, SetStateAction } from "react";

export const mergeRefs = <T>(
  ...refs: (ForwardedRef<T> | MutableRefObject<T> | Dispatch<SetStateAction<T>>)[]
) => {
  if (refs.length === 1) return refs[0];

  return (node: T) => {
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
