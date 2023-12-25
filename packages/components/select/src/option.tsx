import { useEffect, useRef } from 'react';
import { SelectProps, SelectOption } from './select';
import { mergeProps } from '@gist-ui/react-utils';
import { Slot } from '@gist-ui/slot';
import {
  HoverEvent,
  PressEvent,
  useHover,
  usePress,
} from '@react-aria/interactions';

interface OptionProps {
  option: SelectOption;
  isDisabled: boolean;
  isSelected: boolean;
  isFocusVisible: boolean;
  isHovered: boolean;
  className: string;
  onSelect: (e: PressEvent) => void;
  onHover: (e: HoverEvent) => void;
  renderOption?: SelectProps['renderOption'];
  label: string;
  id: string;
}

export const Option = (props: OptionProps) => {
  const {
    option,
    className,
    isDisabled,
    isSelected,
    isFocusVisible,
    isHovered,
    onSelect,
    onHover,
    renderOption,
    label,
    id,
  } = props;

  const innerRef = useRef<HTMLLIElement>(null);

  const { pressProps } = usePress({
    isDisabled,
    onPress: onSelect,
  });

  const { hoverProps } = useHover({
    isDisabled,
    onHoverStart: onHover,
  });

  useEffect(() => {
    if (isFocusVisible) {
      innerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [isFocusVisible]);

  return (
    <Slot<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>
      id={id}
      ref={innerRef}
      data-hovered={isHovered}
      data-disabled={isDisabled}
      data-selected={isSelected}
      data-focused={isFocusVisible}
      role="option"
      className={className}
      aria-checked={isDisabled ? undefined : isSelected}
      {...mergeProps(pressProps, hoverProps)}
    >
      {renderOption ? (
        renderOption({
          option,
          state: {
            isDisabled,
            isSelected,
            isFocusVisible,
            isHovered,
          },
        })
      ) : (
        <li>{label}</li>
      )}
    </Slot>
  );
};

Option.displayName = 'gist-ui.Select';
