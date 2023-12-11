import { cloneElement, forwardRef, isValidElement, useEffect, useRef } from "react";
import { InternalSelectOption, SelectOptionProps } from "./select";
import { useHover, usePress } from "@react-aria/interactions";
import { mergeProps, mergeRefs } from "@gist-ui/react-utils";

export interface OptionProps {
  option: InternalSelectOption;
  isDisabled: boolean;
  isSelected: boolean;
  isFocused: boolean;
  className: string;
  onSelect: () => void;
  onFocus: () => void;
  label: string;
  children?: React.ReactNode;
}

export const Option = forwardRef<HTMLDivElement, OptionProps>((props, ref) => {
  const {
    option,
    className,
    isDisabled,
    isSelected,
    isFocused,
    onSelect,
    label,
    onFocus,
    children,
  } = props;

  const innerRef = useRef<HTMLDivElement>(null);

  const { pressProps, isPressed } = usePress({
    isDisabled,
    onPress: onSelect,
  });

  const { hoverProps, isHovered } = useHover({
    isDisabled,
    onHoverStart: onFocus,
  });

  useEffect(() => {
    if (isFocused) {
      innerRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [isFocused]);

  return (
    <div
      id={option.id}
      ref={mergeRefs(ref, innerRef)}
      data-hovered={isHovered}
      data-disabled={isDisabled}
      data-selected={isSelected}
      data-focused={isFocused}
      data-pressed={isPressed}
      role="option"
      className={className}
      aria-checked={isDisabled ? undefined : isSelected}
      {...mergeProps(pressProps, hoverProps)}
    >
      {children
        ? isValidElement(children) &&
          cloneElement(children, {
            option,
            label,
            state: {
              isPressed,
              isHovered,
              isDisabled,
              isSelected,
              isFocused,
            },
          } as SelectOptionProps)
        : label}
    </div>
  );
});

Option.displayName = "gist-ui.Select";
