import { flatten } from "flat";

export function swapColorValues<T extends Record<string, unknown>>(colors: T) {
  const keys = Object.keys(colors);
  const length = keys.length;

  const swapped: Record<string, unknown> = {};

  for (let i = 0; i < length / 2; i++) {
    const key = keys[i];
    const toSwap = keys[length - 1 - i];

    swapped[key] = colors[toSwap];
    swapped[toSwap] = colors[key];
  }

  if (length % 2 !== 0) {
    const leftKey = keys[Math.floor(length / 2)];

    swapped[leftKey] = colors[leftKey];
  }

  return swapped;
}

export function removeDefaultKeys<T extends Record<string, string>>(obj: T) {
  const newObj: Record<string, string> = {};

  for (const key in obj) {
    if (key.endsWith("-DEFAULT")) {
      newObj[key.replace("-DEFAULT", "")] = obj[key];
      continue;
    }
    newObj[key] = obj[key];
  }

  return newObj;
}

export const flattenThemeObject = <T, R extends Record<string, string>>(
  obj: T,
) =>
  removeDefaultKeys(
    flatten<T, R>(obj, {
      safe: true,
      delimiter: "-",
    }),
  );
