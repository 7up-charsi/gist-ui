import { useControllableState } from "@gist-ui/use-controllable-state";
import {
  Children,
  ReactNode,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
} from "react";
import { usePress } from "react-aria";
import { createPortal } from "react-dom";
import { mergeProps } from "@gist-ui/react-utils";

export interface DialogProps {
  trigger?: ReactNode;
  children?: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  defaultOpen?: boolean;
  modal?: boolean;
}

interface Context {
  scopeName?: string;
  handleClose?: () => void;
}

const SCOPE_NAME = "Dialog";

const context = createContext<Context>({});

const Dialog = forwardRef<HTMLDivElement, DialogProps>((props, ref) => {
  const { trigger, children, modal = true, isOpen: isOpenProp, defaultOpen, onOpenChange } = props;

  const [isOpen, setIsOpen] = useControllableState({
    defaultValue: defaultOpen,
    value: isOpenProp,
    onChange: onOpenChange,
  });

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const { pressProps } = usePress({
    onPress: handleOpen,
  });

  if (!trigger) throw new Error("Gist-ui dialog: trigger is required");
  if (!Children.only(trigger)) throw new Error("Gist-ui dialog: trigger must be only child");
  if (!isValidElement(trigger)) throw new Error("Gist-ui dialog: trigger must be valid element");

  const triggerClone = cloneElement(trigger, {
    ...pressProps,
  });

  const dialog = (
    <context.Provider
      value={{
        scopeName: SCOPE_NAME,
        handleClose,
      }}
    >
      <div ref={ref} role="dialog" aria-modal={modal}>
        {children}
      </div>
    </context.Provider>
  );

  return (
    <>
      {triggerClone}

      {isOpen && createPortal(dialog, document.body)}
    </>
  );
});

Dialog.displayName = "gist-ui.Dialog";

export default Dialog;

export interface DialogCloseProps {
  children: ReactNode;
}

export const DialogClose = (props: DialogCloseProps) => {
  const { children } = props;

  const { handleClose, scopeName } = useContext(context);

  const { pressProps } = usePress({
    onPress: handleClose,
  });

  if (scopeName !== SCOPE_NAME) throw new Error('Gist-ui: "DialogClose" must be child of "Dialog"');
  if (!Children.only(children)) throw new Error('Gist-ui: "DialogClose" must have only child');
  if (!isValidElement(children))
    throw new Error('Gist-ui: "DialogClose" child must be valid element');

  const childClone = cloneElement(children, {
    ...mergeProps(children.props, pressProps),
  });

  return <>{childClone}</>;
};
