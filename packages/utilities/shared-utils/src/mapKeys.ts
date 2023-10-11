type Input = Record<string | number, unknown>;

type Iterator = (
  key: string | number,
  value: unknown,
  index: number,
  input: Input,
) => string | number;

export const mapKeys = (input: Input, iterator: Iterator) =>
  Object.entries(input).reduce<Input>(
    (acc, [key, value], i) => ((acc[iterator(key, value, i, input)] = value), acc),
    {},
  );
