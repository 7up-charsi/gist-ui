import { useControllableState } from "@gist-ui/use-controllable-state";
import { usePress } from "react-aria";
import { mergeProps } from "@gist-ui/react-utils";
import { __DEV__ } from "@gist-ui/shared-utils";
import { GistUiError, onlyChildError, validChildError } from "@gist-ui/error";
import { useClickOutside } from "@gist-ui/use-click-outside";
import { FocusTrap, FocusTrapProps, FocusTrapScope } from "@gist-ui/focus-trap";
import { useCallbackRef } from "@gist-ui/use-callback-ref";
import { createPortal } from "react-dom";
import {
  Children,
  ReactNode,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

type Reason = "pointer" | "escape" | "outside";

type CloseEvent = { preventDefault(): void };

export interface RootProps {
  children?: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  defaultOpen?: boolean;
  onClose?: (event: CloseEvent, reason: Reason) => void;
}

interface Context {
  scopeName: string;
  handleOpen: () => void;
  handleClose: (reason: Reason) => void;
  isOpen: boolean;
  scope: FocusTrapScope;
}

const SCOPE_NAME = "Dialog";

const DialogContext = createContext<Context | null>(null);

export const Root = (props: RootProps) => {
  const { children, isOpen: isOpenProp, defaultOpen, onOpenChange, onClose: onCloseProp } = props;

  const scope = useRef<FocusTrapScope>({
    paused: false,
    pause() {
      this.paused = true;
    },
    resume() {
      this.paused = false;
    },
  }).current;

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
      if (scope.paused) return;

      const eventObj = { defaultPrevented: false };

      const preventDefault = () => {
        eventObj.defaultPrevented = true;
      };

      onClose({ preventDefault }, reason);

      if (!eventObj.defaultPrevented) setIsOpen(false);
    },
    [onClose, scope.paused, setIsOpen],
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
          scope,
        }}
      >
        {children}
      </DialogContext.Provider>
    </>
  );
};

Root.displayName = "gist-ui.Root";

export interface TriggerProps {
  children: ReactNode;
  close?: boolean;
}

export const Trigger = (props: TriggerProps) => {
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
    throw new GistUiError("Trigger", 'must be child of "Root"');

  const childCount = Children.count(children);
  if (!childCount) return;
  if (childCount > 1) throw new GistUiError("Trigger", onlyChildError);
  if (!isValidElement(children)) throw new GistUiError("Trigger", validChildError);

  return (
    <>
      {cloneElement(children, {
        ...mergeProps(children.props, pressProps),
      })}
    </>
  );
};

Trigger.displayName = "gist-ui.Trigger";

export interface PortalProps {
  children?: ReactNode;
  container?: HTMLElement;
}

export const Portal = (props: PortalProps) => {
  const { children, container = document.body } = props;

  const context = useContext(DialogContext);

  if (context?.scopeName !== SCOPE_NAME) throw new GistUiError("Portal", 'must be child of "Root"');

  return context?.isOpen ? createPortal(children, container) : null;
};

Portal.displayName = "gist-ui.Portal";

export interface ContentProps extends Omit<FocusTrapProps, "loop" | "trapped" | "asChild"> {
  children?: ReactNode;
  modal?: boolean;
}

export const Content = (props: ContentProps) => {
  const { children, onMountAutoFocus, onUnmountAutoFocus, modal = true } = props;

  const context = useContext(DialogContext);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useClickOutside<HTMLDivElement>({
    disabled: !context?.isOpen,
    ref: dialogRef,
    callback: () => {
      context?.handleClose("outside");
    },
  });

  if (context?.scopeName !== SCOPE_NAME)
    throw new GistUiError("Content", 'must be child of "Root"');

  const childCount = Children.count(children);
  if (!childCount) return;
  if (childCount > 1) throw new GistUiError("Content", onlyChildError);
  if (!isValidElement(children)) throw new GistUiError("Content", validChildError);

  return (
    <FocusTrap
      ref={dialogRef}
      loop={modal}
      trapped={modal}
      onMountAutoFocus={onMountAutoFocus}
      onUnmountAutoFocus={onUnmountAutoFocus}
      scope={context.scope}
      asChild
    >
      {cloneElement(children, {
        role: "dialog",
        "aria-modal": modal,
      } as Partial<unknown>)}
    </FocusTrap>
  );
};

Content.displayName = "gist-ui.Content";
