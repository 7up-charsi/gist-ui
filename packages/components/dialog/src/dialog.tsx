import { useControllableState } from "@gist-ui/use-controllable-state";
import { usePress } from "react-aria";
import { mergeProps } from "@gist-ui/react-utils";
import { __DEV__ } from "@gist-ui/shared-utils";
import { GistUiError, onlyChildError, validChildError } from "@gist-ui/error";
import { useClickOutside } from "@gist-ui/use-click-outside";
import {
  FocusTrap,
  FocusTrapProps,
  FocusTrapScope,
  FocusTrapScopeContext,
  focus,
  focusFirst,
  getTabbables,
  removeLinks,
} from "@gist-ui/focus-trap";
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

const AUTOFOCUS_ON_OPEN = "focusTrapScope.autoFocusOnOPEN";
const AUTOFOCUS_ON_CLOSE = "focusTrapScope.autoFocusOnCLOSE";
const EVENT_OPTIONS = { bubbles: false, cancelable: true };

interface Context extends Pick<FocusTrapProps, "onMountAutoFocus" | "onUnmountAutoFocus"> {
  scopeName: string;
  handleOpen: () => void;
  handleClose: (reason: Reason) => void;
  isOpen: boolean;
  scope: FocusTrapScope;
  keepMounted: boolean;
  modal: boolean;
  onOpenAutoFocus: Exclude<FocusTrapProps["onMountAutoFocus"], undefined>;
  onCloseAutoFocus: Exclude<FocusTrapProps["onUnmountAutoFocus"], undefined>;
}

const SCOPE_NAME = "Dialog";

const DialogContext = createContext<Context | null>(null);

// *-*-*-*-* Root *-*-*-*-*

export interface RootProps extends Pick<FocusTrapProps, "onMountAutoFocus" | "onUnmountAutoFocus"> {
  children?: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  defaultOpen?: boolean;
  onClose?: (event: CloseEvent, reason: Reason) => void;
  /**
   * when this prop is true, it will trap focus and set aria-modal=true on children of Content component
   * when this prop is flase, it will not trap focus and set aria-modal=false on children of Content component
   */
  modal?: boolean;
  /**
   * when this prop is true, all content stays in the DOM and only css visiblity changes on open/close
   */
  keepMounted?: boolean;
  /**
   * this will only executes when keepMounted is true
   * by default it focus first tabbable element if you want to prevent it just call event.preventDefault
   */
  onOpenAutoFocus?: FocusTrapProps["onMountAutoFocus"];
  /**
   * this will only executes when keepMounted is true
   * by default it returns focus to trigger if you want to prevent it just call event.preventDefault
   */
  onCloseAutoFocus?: FocusTrapProps["onUnmountAutoFocus"];
}

export const Root = (props: RootProps) => {
  const {
    children,
    isOpen: isOpenProp,
    defaultOpen,
    onOpenChange,
    onClose: onCloseProp,
    keepMounted = false,
    modal = true,
    onMountAutoFocus: onMountAutoFocusProp,
    onUnmountAutoFocus: onUnmountAutoFocusProp,
    onOpenAutoFocus: onOpenAutoFocusProp,
    onCloseAutoFocus: onCloseAutoFocusProp,
  } = props;

  const onMountAutoFocus = useCallbackRef(onMountAutoFocusProp);
  const onUnmountAutoFocus = useCallbackRef(onUnmountAutoFocusProp);
  const onOpenAutoFocus = useCallbackRef(onOpenAutoFocusProp);
  const onCloseAutoFocus = useCallbackRef(onCloseAutoFocusProp);

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
          keepMounted,
          onMountAutoFocus,
          onUnmountAutoFocus,
          modal,
          onOpenAutoFocus,
          onCloseAutoFocus,
        }}
      >
        {children}
      </DialogContext.Provider>
    </>
  );
};

Root.displayName = "gist-ui.Root";

// *-*-*-*-* Trigger *-*-*-*-*

export interface TriggerProps {
  children: ReactNode;
}

export const Trigger = (props: TriggerProps) => {
  const { children } = props;

  const context = useContext(DialogContext);

  const { pressProps } = usePress({
    isDisabled: context?.scopeName !== SCOPE_NAME,
    onPress: async () => {
      try {
        context?.handleOpen();
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

// *-*-*-*-* Close *-*-*-*-*

export interface CloseProps {
  children: ReactNode;
}

export const Close = (props: CloseProps) => {
  const { children } = props;

  const context = useContext(DialogContext);

  const { pressProps } = usePress({
    isDisabled: context?.scopeName !== SCOPE_NAME,
    onPress: async () => {
      try {
        context?.handleClose("pointer");
      } catch (error) {
        if (__DEV__) console.log(error);
      }
    },
  });

  if (context?.scopeName !== SCOPE_NAME) throw new GistUiError("Close", 'must be child of "Root"');

  const childCount = Children.count(children);
  if (!childCount) return;
  if (childCount > 1) throw new GistUiError("Close", onlyChildError);
  if (!isValidElement(children)) throw new GistUiError("Close", validChildError);

  return (
    <>
      {cloneElement(children, {
        ...mergeProps(children.props, pressProps),
      })}
    </>
  );
};

Close.displayName = "gist-ui.Close";

// *-*-*-*-* Portal *-*-*-*-*

export interface PortalProps {
  children?: ReactNode;
  container?: HTMLElement;
}

export const Portal = (props: PortalProps) => {
  const { children, container = document.body } = props;

  const context = useContext(DialogContext);

  if (context?.scopeName !== SCOPE_NAME) throw new GistUiError("Portal", 'must be child of "Root"');

  if (context.keepMounted) {
    return createPortal(
      <div style={{ visibility: context.isOpen ? "visible" : "hidden" }}>{children}</div>,
      container,
    );
  }

  return context?.isOpen ? createPortal(children, container) : null;
};

Portal.displayName = "gist-ui.Portal";

// *-*-*-*-* Content *-*-*-*-*

export interface ContentProps {
  children?: ReactNode;
}

export const Content = (props: ContentProps) => {
  const { children } = props;

  const scopeContext = useContext(FocusTrapScopeContext);
  const context = useContext(DialogContext);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useClickOutside<HTMLDivElement>({
    disabled: !context?.isOpen,
    ref: dialogRef,
    callback: () => {
      context?.handleClose("outside");
    },
  });

  useEffect(() => {
    const container = dialogRef.current as HTMLElement;

    if (!container) return;
    if (!context) return;
    if (!context.keepMounted) return;
    if (!context.isOpen) return;

    scopeContext?.add(context.scope);

    const prevFocusedElement = document.activeElement as HTMLElement | null;
    const hasFocusedElement = container.contains(prevFocusedElement);

    if (!hasFocusedElement) {
      const openEvent = new CustomEvent(AUTOFOCUS_ON_OPEN, EVENT_OPTIONS);
      container.addEventListener(AUTOFOCUS_ON_OPEN, context.onOpenAutoFocus);
      container.dispatchEvent(openEvent);
      if (!openEvent.defaultPrevented) {
        focusFirst(removeLinks(getTabbables(container)), { select: true });
      }
      if (prevFocusedElement === document.activeElement) focus(container);
    }

    return () => {
      container.removeEventListener(AUTOFOCUS_ON_OPEN, context.onOpenAutoFocus);

      const closeEvent = new CustomEvent(AUTOFOCUS_ON_CLOSE, EVENT_OPTIONS);
      container.addEventListener(AUTOFOCUS_ON_CLOSE, context.onCloseAutoFocus);
      container.dispatchEvent(closeEvent);
      if (!closeEvent.defaultPrevented) {
        focus(prevFocusedElement ?? document.body, { select: true });
      }

      container.removeEventListener(AUTOFOCUS_ON_CLOSE, context.onCloseAutoFocus);

      scopeContext?.remove(context.scope);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context?.isOpen, context?.keepMounted]);

  if (context?.scopeName !== SCOPE_NAME)
    throw new GistUiError("Content", 'must be child of "Root"');

  const childCount = Children.count(children);
  if (!childCount) return;
  if (childCount > 1) throw new GistUiError("Content", onlyChildError);
  if (!isValidElement(children)) throw new GistUiError("Content", validChildError);

  const modal = context.modal;

  return (
    <FocusTrap
      ref={dialogRef}
      loop={modal}
      trapped={modal}
      onMountAutoFocus={context?.onMountAutoFocus}
      onUnmountAutoFocus={context?.onUnmountAutoFocus}
      scope={context.scope}
      asChild
      disabled={!context.isOpen}
    >
      {cloneElement(children, {
        role: "dialog",
        "aria-modal": modal,
      } as Partial<unknown>)}
    </FocusTrap>
  );
};

Content.displayName = "gist-ui.Content";
