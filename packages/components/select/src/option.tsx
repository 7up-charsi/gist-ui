import { forwardRef, useEffect, useId, useRef } from "react";
import { SelectProps, SelectOption } from "./select";
import { useHover, usePress } from "@react-aria/interactions";
import { mergeProps, mergeRefs } from "@gist-ui/react-utils";
import { Slot } from "@gist-ui/slot";

interface OptionProps {
  option: SelectOption;
  isDisabled: boolean;
  isSelected: boolean;
  isFocused: boolean;
  className: string;
  onSelect: () => void;
  onFocus: () => void;
  renderOption?: SelectProps["renderOption"];
  setFocusedId: React.Dispatch<React.SetStateAction<string | undefined>>;
  label: string;
}

export const Option = forwardRef<HTMLDivElement, OptionProps>((props, ref) => {
  const {
    option,
    className,
    isDisabled,
    isSelected,
    isFocused,
    onSelect,
    onFocus,
    renderOption,
    setFocusedId,
    label,
  } = props;

  const innerRef = useRef<HTMLDivElement>(null);
  const id = useId();

  const { pressProps, isPressed } = usePress({
    isDisabled,
    onPress: onSelect,
  });

  const { hoverProps, isHovered } = useHover({
    isDisabled,
    onHoverStart: onFocus,
  });

  useEffect(() => {
    if (isFocused) setFocusedId(id);
  }, [id, isFocused, setFocusedId]);

  useEffect(() => {
    if (isFocused) {
      innerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [isFocused]);

  return (
    <Slot<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>
      id={id}
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
      {renderOption ? (
        renderOption({
          option,
          label,
          state: {
            isPressed,
            isHovered,
            isDisabled,
            isSelected,
            isFocused,
          },
        })
      ) : (
        <div>{label}</div>
      )}
    </Slot>
  );
});

Option.displayName = "gist-ui.Select";
