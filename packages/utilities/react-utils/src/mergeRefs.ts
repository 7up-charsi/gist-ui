export const mergeRefs = <T>(
  ...refs: (
    | React.ForwardedRef<T>
    | React.MutableRefObject<T>
    | React.Dispatch<React.SetStateAction<T>>
  )[]
): React.RefCallback<T> => {
  return (node: T) => {
    const filtered = refs.filter(Boolean);

    filtered.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref !== null) {
        ref.current = node;
      }
    });
  };
};
