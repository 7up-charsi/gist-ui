import { useEffect, useRef } from 'react';
import { mergeProps } from '@gist-ui/react-utils';
import { Slot } from '@gist-ui/slot';
import {
  HoverEvent,
  PressEvent,
  useHover,
  usePress,
} from '@react-aria/interactions';

interface OptionProps {
  isDisabled: boolean;
  isSelected: boolean;
  isFocused: boolean;
  className: string;
  onSelect: (e: PressEvent) => void;
  onHover: (e: HoverEvent) => void;
  id?: string;
  children: React.ReactNode;
}

export const Option = (props: OptionProps) => {
  const {
    className,
    isDisabled,
    isSelected,
    isFocused,
    onSelect,
    onHover,
    id,
    children,
  } = props;

  const ref = useRef<HTMLLIElement>(null);

  const { pressProps } = usePress({
    onPress: (e) => {
      if (isDisabled) return;
      onSelect(e);
    },
  });

  const { hoverProps, isHovered } = useHover({
    isDisabled,
    onHoverStart: onHover,
  });

  useEffect(() => {
    if (isFocused && !isHovered) {
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  return (
    <Slot<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>
      id={id}
      ref={ref}
      data-disabled={isDisabled}
      data-selected={isSelected}
      data-focused={isFocused}
      role="option"
      className={className}
      aria-selected={isDisabled ? undefined : isSelected}
      {...mergeProps(pressProps, hoverProps)}
    >
      {children}
    </Slot>
  );
};

Option.displayName = 'gist-ui.Select';
