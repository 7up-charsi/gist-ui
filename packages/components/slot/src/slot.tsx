import { Children, ForwardedRef, ReactNode, cloneElement, forwardRef, isValidElement } from "react";
import { CustomError } from "@gist-ui/error";
import { mergeProps, mergeRefs } from "@gist-ui/react-utils";

export interface SlotProps {
  children?: ReactNode;
}

const Slot = forwardRef<HTMLElement, SlotProps>((props, ref) => {
  const { children, ...slotProps } = props;

  const count = Children.count(children);
  if (!count) return;
  if (count > 1) throw new CustomError("slot", "must have only child");
  if (!isValidElement(children)) throw new CustomError("slot", "child must be valid element");

  return cloneElement(children, {
    ...mergeProps(slotProps, children.props),
    ref: ref ? mergeRefs(ref, (children as any).ref) : (children as any).ref,
  });
});

Slot.displayName = "gist-ui.Slot";

export default Slot;
