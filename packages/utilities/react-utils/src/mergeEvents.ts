export type MergeEventsProps = {
  [event: string]: ((...args: never[]) => unknown) | undefined | null;
}[];

export const mergeEvents = (...props: MergeEventsProps) => {
  if (props.length === 1) return props[0];

  return props.reduce((merged, ele) => {
    Object.entries(ele).forEach(([key, value]) => {
      if (!value) return;

      if (value && typeof value !== "function")
        throw new TypeError("MergeEvents: only functions are supported as values");

      const old = merged[key];
      merged[key] = old
        ? (...args: never[]) => {
            old(...args);
            value(...args);
          }
        : value;
    });

    return merged;
  }, {});
};
