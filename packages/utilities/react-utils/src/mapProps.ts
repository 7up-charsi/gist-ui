export const mapProps = <P extends Record<string, unknown>, M extends keyof P>(
  props: P,
  toMap: M[],
) => {
  const omitted = Object.keys(props)
    .filter((key) => !toMap.includes(key as M))
    .reduce((acc, key) => (key in props ? { ...acc, [key]: props[key] } : acc), {}) as {
    [key in keyof Omit<P, M[][number]>]: P[key];
  };

  const picked = toMap.reduce(
    (acc, key) => (key in props ? { ...acc, [key]: props[key] } : acc),
    {},
  ) as {
    [key in M[][number]]: P[key];
  };

  return [omitted, picked] as const;
};
