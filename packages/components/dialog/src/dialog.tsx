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
  useId,
  useRef,
} from "react";
import { useScrollLock } from "@gist-ui/use-scroll-lock";

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
  dialogId: string;
}

const SCOPE_NAME = "Dialog";

const DialogContext = createContext<Context | null>(null);

// *-*-*-*-* Root *-*-*-*-*

export interface RootProps extends Pick<FocusTrapProps, "onMountAutoFocus" | "onUnmountAutoFocus"> {
  children?: ReactNode;
  /**
   * This prop is used for controled state
   * @default undefined
   */
  isOpen?: boolean;
  /**
   * This prop is used for controled state
   * @default undefined
   */
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * @default undefined
   */
  defaultOpen?: boolean;
  /**
   * This callback can be used to prevent close conditionally
   * @default undefined
   * @example
   * 1. when user click outside of `Content` component
   * ```js
   * onClose={(event, reason)=>{
   *  if(reason === 'outside') {
   *    event.preventDefault()
   *  }
   * }}
   * ```
   *
   * 2. when user press Escape key
   * ```js
   * onClose={(event, reason)=>{
   *  if(reason === 'escape') {
   *    event.preventDefault()
   *  }
   * }}
   * ```
   *
   * 3. when user press `Close` button
   * ```js
   * onClose={(event, reason)=>{
   *  if(reason === 'pointer') {
   *    event.preventDefault()
   *  }
   * }}
   * ```
   */
  onClose?: (event: CloseEvent, reason: Reason) => void;
  /**
   * When this prop is true
   * 1. It will trap focus
   * 2. Set aria-modal=true on children of `Content` component.
   *
   * When this prop is flase
   * 1. It will not trap focus
   * 2. Set aria-modal=false on children of `Content` component
   *
   * @default true
   */
  modal?: boolean;
  /**
   * When this prop is true, all content stays in the DOM and only css visiblity changes on open/close
   *
   * @default false
   */
  keepMounted?: boolean;
  /**
   * **This will only executes when keepMounted is true.**
   *
   * This callback executes on open and by default on open first tabbable element focused, if you want to prevent this behaviour then call event.preventDefault()
   * @default undefined
   * @example
   *
   * ```js
   * import * as Dialog from '@gist-ui/dialog'
   *
   * <Dialog.Root
   *   onOpenAutoFocus={(event) => {
   *     event.preventDefault();
   *   }}
   * >
   *   // other stuff
   * </Dialog.Root>
   * ```
   */
  onOpenAutoFocus?: FocusTrapProps["onMountAutoFocus"];
  /**
   * **This will only executes when keepMounted is true.**
   *
   * This callback executes on close and by default on close focus returns to trigger, if you want to prevent this behaviour then call event.preventDefault()
   *
   * @default undefined
   * @example
   *
   * ```js
   * import * as Dialog from '@gist-ui/dialog'
   *
   * <Dialog.Root
   *   onCloseAutoFocus={(event) => {
   *     event.preventDefault();
   *   }}
   * >
   *   // other stuff
   * </Dialog.Root>
   * ```
   */
  onCloseAutoFocus?: FocusTrapProps["onUnmountAutoFocus"];
  /**
   * id to pass to `Content` component
   *
   * this id is also used in "aria-controls" in `Trigger` component
   */
  id?: string;
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
    id,
  } = props;

  const onMountAutoFocus = useCallbackRef(onMountAutoFocusProp);
  const onUnmountAutoFocus = useCallbackRef(onUnmountAutoFocusProp);
  const onOpenAutoFocus = useCallbackRef(onOpenAutoFocusProp);
  const onCloseAutoFocus = useCallbackRef(onCloseAutoFocusProp);

  const dialogId = useId();

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
          dialogId: id || dialogId,
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
        ...mergeProps(
          pressProps,
          { "aria-expanded": context.isOpen, "aria-controls": context.dialogId },
          children.props,
        ),
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
        ...mergeProps(pressProps, children.props),
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
  const dialogRef = useRef<HTMLDivElement>(null);

  useScrollLock({ enabled: context?.isOpen });

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

  if (children.props.id) throw new GistUiError("Content", 'add "id" prop on "Root" component');

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
        id: context.dialogId,
      } as Partial<unknown>)}
    </FocusTrap>
  );
};

Content.displayName = "gist-ui.Content";
