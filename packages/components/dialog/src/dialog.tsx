import { useControllableState } from "@gist-ui/use-controllable-state";
import { usePress } from "react-aria";
import { mergeProps, mergeRefs } from "@gist-ui/react-utils";
import { __DEV__ } from "@gist-ui/shared-utils";
import { GistUiError } from "@gist-ui/error";
import { useClickOutside } from "@gist-ui/use-click-outside";
import { FocusTrap, FocusTrapProps } from "@gist-ui/focus-trap";
import {
  Children,
  ReactNode,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useCallbackRef } from "@gist-ui/use-callback-ref";
import { createPortal } from "react-dom";

type Reason = "pointer" | "escape" | "outside";

type CloseEvent = { preventDefault(): void };

export interface DialogProps {
  children?: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  defaultOpen?: boolean;
  modal?: boolean;
  onClose?: (event: CloseEvent, reason: Reason) => void;
}

interface Context {
  scopeName: string;
  handleOpen: () => void;
  handleClose: (reason: Reason) => void;
  isOpen: boolean;
  modal?: boolean;
}

const SCOPE_NAME = "Dialog";

const DialogContext = createContext<Context | null>(null);

const Dialog = (props: DialogProps) => {
  const {
    children,
    modal = true,
    isOpen: isOpenProp,
    defaultOpen,
    onOpenChange,
    onClose: onCloseProp,
  } = props;

  const onClose = useCallbackRef(onCloseProp);

  const [isOpen, setIsOpen] = useControllableState({
    defaultValue: defaultOpen,
    value: isOpenProp,
    onChange: onOpenChange,
  });

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const handleClose = useCallback(
    (reason: Reason) => {
      const eventObj = { defaultPrevented: false };

      const preventDefault = () => {
        eventObj.defaultPrevented = true;
      };

      onClose({ preventDefault }, reason);

      if (!eventObj.defaultPrevented) setIsOpen(false);
    },
    [onClose, setIsOpen],
  );

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose("escape");
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeydown, true);

      return () => {
        document.removeEventListener("keydown", handleKeydown, true);
      };
    }
  }, [handleClose, isOpen]);

  return (
    <>
      <DialogContext.Provider
        value={{
          scopeName: SCOPE_NAME,
          handleClose,
          handleOpen,
          isOpen,
          modal,
        }}
      >
        {children}
      </DialogContext.Provider>
    </>
  );
};

Dialog.displayName = "gist-ui.Dialog";

export default Dialog;

export const DialogTrigger = (props: { children: ReactNode; close?: boolean }) => {
  const { children, close } = props;

  const context = useContext(DialogContext);

  const { pressProps } = usePress({
    isDisabled: context?.scopeName !== SCOPE_NAME,
    onPress: async () => {
      try {
        if (close) context?.handleClose("pointer");
        else context?.handleOpen();
      } catch (error) {
        if (__DEV__) console.log(error);
      }
    },
  });

  if (context?.scopeName !== SCOPE_NAME)
    throw new GistUiError("DialogTrigger", 'must be child of "Dialog"');

  const childCount = Children.count(children);
  if (!childCount) return;
  if (childCount > 1) throw new GistUiError("DialogTrigger", "must have only child");
  if (!isValidElement(children))
    throw new GistUiError("DialogTrigger", "must have valid element child");

  return (
    <>
      {cloneElement(children, {
        ...mergeProps(children.props, pressProps),
      })}
    </>
  );
};

export const DialogPortal = (props: { children?: ReactNode; container?: HTMLElement }) => {
  const { children, container = document.body } = props;

  const context = useContext(DialogContext);

  if (context?.scopeName !== SCOPE_NAME)
    throw new GistUiError("DialogPortal", 'must be child of "Dialog"');

  return context?.isOpen ? createPortal(children, container) : null;
};

interface DialogContentProps extends Omit<FocusTrapProps, "loop" | "trapped"> {
  children?: ReactNode;
  classNames?: {
    container?: string;
    base?: string;
  };
}

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  function DialogContent(props, ref) {
    const { children, classNames, onMountAutoFocus, onUnmountAutoFocus } = props;

    const context = useContext(DialogContext);
    const dialogRef = useRef<HTMLDivElement | null>(null);

    useClickOutside<HTMLDivElement>({
      isDisabled: !context?.isOpen,
      ref: dialogRef,
      callback: () => {
        context?.handleClose("outside");
      },
    });

    if (context?.scopeName !== SCOPE_NAME)
      throw new GistUiError("DialogContent", 'must be child of "Dialog"');

    return (
      <div className={classNames?.container}>
        <FocusTrap
          ref={mergeRefs(ref, dialogRef)}
          role="dialog"
          className={classNames?.base}
          aria-modal={context?.modal}
          loop={context?.modal}
          trapped={context?.modal}
          onMountAutoFocus={onMountAutoFocus}
          onUnmountAutoFocus={onUnmountAutoFocus}
        >
          {children}
        </FocusTrap>
      </div>
    );
  },
);
