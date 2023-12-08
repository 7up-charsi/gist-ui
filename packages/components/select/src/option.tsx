import { forwardRef, useEffect, useRef } from "react";
import { SelectOption, SelectProps, onSelectProps } from "./select";
import { useHover, usePress } from "react-aria";
import { mergeProps, mergeRefs } from "@gist-ui/react-utils";

interface OptionProps {
  option: SelectOption;
  isDisabled: boolean;
  isSelected: boolean;
  isFocused: boolean;
  className: string;
  index: number;
  onSelect: (options: onSelectProps, select: boolean) => () => void;
  getOptionLabel: SelectProps["getOptionLabel"];
}

export const Option = forwardRef<HTMLDivElement, OptionProps>((props, ref) => {
  const { option, className, isDisabled, isSelected, isFocused, onSelect, getOptionLabel, index } =
    props;

  const innerRef = useRef<HTMLDivElement>(null);

  const { pressProps } = usePress({
    isDisabled,
    onPress: onSelect({ index, isDisabled, option }, true),
  });

  const { hoverProps, isHovered } = useHover({
    onHoverStart: onSelect({ index, isDisabled, option }, false),
  });

  useEffect(() => {
    if (isFocused) {
      innerRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [isFocused]);

  return (
    <div
      ref={mergeRefs(ref, innerRef)}
      data-hovered={isHovered}
      data-disabled={isDisabled}
      data-selected={isSelected}
      data-focused={isFocused}
      role="option"
      className={className}
      aria-checked={isDisabled ? undefined : isSelected}
      {...mergeProps(pressProps, hoverProps)}
    >
      {<span>{getOptionLabel ? getOptionLabel(option) : option.label}</span>}
    </div>
  );
});

Option.displayName = "gist-ui.Select";
