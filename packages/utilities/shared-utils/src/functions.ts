export const capitalize = (text: string) => {
  return text[0].toUpperCase() + text.slice(1);
};

export const isTouchDevice = () => "ontouchstart" in window || navigator.maxTouchPoints > 0;
