import clsx from "clsx";

export const mergeProps = (...props: object[]) => {
  const result: Record<string, unknown> = { ...props[0] };

  props.slice(1).forEach((obj) => {
    Object.entries(obj).forEach(([key, newValue]) => {
      const presentValue = result[key];

      // chain events
      if (
        typeof presentValue === "function" &&
        typeof newValue === "function" &&
        key[0] === "o" &&
        key[1] === "n" &&
        key.charCodeAt(2) >= 65 &&
        key.charCodeAt(2) <= 90
      ) {
        result[key] = (...args: unknown[]) => {
          presentValue(...args);
          newValue(...args);
        };
      }
      //   Merge classnames
      else if (
        (key === "className" || key === "UNSAFE_className") &&
        typeof presentValue === "string" &&
        typeof newValue === "string"
      ) {
        result[key] = clsx(presentValue, newValue);
      } else if (
        key === "style" &&
        typeof presentValue === "object" &&
        typeof newValue === "object"
      ) {
        result.style = { ...presentValue, ...newValue };
      }
      //   override others
      else {
        result[key] = newValue !== undefined ? newValue : presentValue;
      }
    });
  });

  return result;
};
