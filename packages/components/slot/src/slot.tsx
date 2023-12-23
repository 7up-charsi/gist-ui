import { Children, cloneElement, forwardRef, isValidElement } from 'react';
import { GistUiError, onlyChildError, validChildError } from '@gist-ui/error';
import { mergeProps, mergeRefs } from '@gist-ui/react-utils';

export interface SlotProps {
  children?: React.ReactNode;
}

const Slot = <E extends HTMLElement>(
  props: SlotProps,
  ref: React.ForwardedRef<E>,
) => {
  const { children, ...slotProps } = props;

  const count = Children.count(children);
  if (!count) return;
  if (count > 1) throw new GistUiError('slot', onlyChildError);
  if (!isValidElement(children)) throw new GistUiError('slot', validChildError);

  return cloneElement(children, {
    ...mergeProps(slotProps, children.props),
    ref: ref
      ? mergeRefs(
          ref,
          (children as unknown as { ref: React.ForwardedRef<E> }).ref,
        )
      : (children as unknown as { ref: React.ForwardedRef<E> }).ref,
  } as Partial<unknown>);
};

Slot.displayName = 'gist-ui.Slot';

export default forwardRef(Slot) as <T, P>(
  props: SlotProps & P & { ref?: React.ForwardedRef<T> },
) => ReturnType<typeof Slot>;
