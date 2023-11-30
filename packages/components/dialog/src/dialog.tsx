import { useControllableState } from "@gist-ui/use-controllable-state";
import { usePress } from "react-aria";
import { Slot } from "@gist-ui/slot";
import { __DEV__ } from "@gist-ui/shared-utils";
import { GistUiError, onlyChildError, validChildError } from "@gist-ui/error";
import { useClickOutside } from "@gist-ui/use-click-outside";
import { useScrollLock } from "@gist-ui/use-scroll-lock";
import { useCallbackRef } from "@gist-ui/use-callback-ref";
import { createPortal } from "react-dom";
import { FocusTrap, FocusScope } from "@gist-ui/focus-trap";
import {
  Children,
  Dispatch,
  ReactNode,
  SetStateAction,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { VisuallyHidden } from "@gist-ui/visually-hidden";

type Reason = "pointer" | "escape" | "outside" | "virtual";

type CloseEvent = { preventDefault(): void };

interface Context {
  scopeName: string;
  handleOpen: () => void;
  /**
   * reason param could be "pointer" | "escape" | "outside" | "virtual"
   * 1. when dialog closed on interaction with `Close` component then reason is "pointer"
   * 2. when dialog closed on interaction outside `Content` component then reason is "outside"
   * 2. when dialog closed on Escape keypress then reason is "escape"
   * 2. when dialog closed on interaction with visually hidden close button then reason is "virtual" and this will only happen when screen reader read dialog content and close press close button
   */
  handleClose: (reason: Reason) => void;
  open: boolean;
  scope: FocusScope;
  keepMounted: boolean;
  id: string;
  setGivenId: Dispatch<SetStateAction<string>>;
}

const SCOPE_NAME = "Dialog";

const DialogContext = createContext<Context | null>(null);

// *-*-*-*-* Root *-*-*-*-*

export interface RootProps {
  children?: ReactNode;
  /**
   * This prop is used for controled state
   * @default undefined
   */
  open?: boolean;
  /**
   * This prop is used for controled state
   * @default undefined
   */
  onOpenChange?: (open: boolean) => void;
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
   * When this prop is true, all content stays in the DOM and only css visiblity changes on open/close
   *
   * @default false
   */
  keepMounted?: boolean;
}

export const Root = (props: RootProps) => {
  const {
    children,
    open: isOpenProp,
    defaultOpen,
    onOpenChange,
    onClose: onCloseProp,
    keepMounted = false,
  } = props;

  const id = useId();

  const [givenId, setGivenId] = useState("");

  const scope = useRef<FocusScope>({
    paused: false,
    pause() {
      this.paused = true;
    },
    resume() {
      this.paused = false;
    },
  }).current;

  const onClose = useCallbackRef(onCloseProp);

  const [open, setOpen] = useControllableState({
    defaultValue: defaultOpen,
    value: isOpenProp,
    onChange: onOpenChange,
  });

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const handleClose = useCallback(
    (reason: Reason) => {
      if (scope.paused) return;

      const eventObj = { defaultPrevented: false };

      const preventDefault = () => {
        eventObj.defaultPrevented = true;
      };

      onClose({ preventDefault }, reason);

      if (!eventObj.defaultPrevented) setOpen(false);
    },
    [onClose, scope.paused, setOpen],
  );

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose("escape");
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeydown, true);

      return () => {
        document.removeEventListener("keydown", handleKeydown, true);
      };
    }
  }, [handleClose, open]);

  return (
    <>
      <DialogContext.Provider
        value={{
          scopeName: SCOPE_NAME,
          handleClose,
          handleOpen,
          open,
          scope,
          keepMounted,
          id: givenId || id,
          setGivenId,
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
    onPress: context?.handleOpen,
  });

  if (context?.scopeName !== SCOPE_NAME)
    throw new GistUiError("Trigger", 'must be child of "Root"');

  return (
    <Slot
      aria-expanded={context.open}
      aria-controls={context.open ? context.id : undefined}
      {...pressProps}
    >
      {children}
    </Slot>
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
    onPress: () => {
      context?.handleClose("pointer");
    },
  });

  if (context?.scopeName !== SCOPE_NAME) throw new GistUiError("Close", 'must be child of "Root"');

  const childCount = Children.count(children);
  if (!childCount) return;
  if (childCount > 1) throw new GistUiError("Close", onlyChildError);
  if (!isValidElement(children)) throw new GistUiError("Close", validChildError);

  return <Slot {...pressProps}>{children}</Slot>;
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
      <div style={{ visibility: context.open ? "visible" : "hidden" }}>{children}</div>,
      container,
    );
  }

  return context?.open ? createPortal(children, container) : null;
};

Portal.displayName = "gist-ui.Portal";

// *-*-*-*-* Content *-*-*-*-*

export interface ContentProps {
  children?: ReactNode;
}

export const Content = (props: ContentProps) => {
  const { children } = props;

  const context = useContext(DialogContext);
  const dialogRef = useRef<HTMLDivElement>(null);

  useScrollLock({ enabled: context?.open });

  useClickOutside<HTMLDivElement>({
    disabled: !context?.open,
    ref: dialogRef,
    callback: () => {
      context?.handleClose("outside");
    },
  });

  useEffect(() => {
    if (isValidElement(children)) {
      context?.setGivenId(children.props.id || "");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  if (context?.scopeName !== SCOPE_NAME)
    throw new GistUiError("Content", 'must be child of "Root"');

  const childCount = Children.count(children);
  if (!childCount) return;
  if (childCount > 1) throw new GistUiError("Content", onlyChildError);
  if (!isValidElement(children)) throw new GistUiError("Content", validChildError);

  if (__DEV__ && !children.props["aria-label"] && !children.props["aria-labelledby"])
    throw new GistUiError("Content", 'add "aria-label" or "aria-labelledby" for accessibility');

  if (__DEV__ && !children.props["aria-describedby"])
    console.warn("Content", '"aria-describedby" is optional but recommended');

  return (
    <FocusTrap ref={dialogRef} loop trapped asChild scope={context.scope} disabled={!context.open}>
      {cloneElement(children, {
        role: "dialog",
        "aria-modal": true,
        id: context.id,
        children: (
          <>
            <VisuallyHidden asChild>
              <button onClick={() => context.handleClose("virtual")}>close</button>
            </VisuallyHidden>

            {children.props.children}

            <VisuallyHidden asChild>
              <button onClick={() => context.handleClose("virtual")}>close</button>
            </VisuallyHidden>
          </>
        ),
      } as Partial<unknown>)}
    </FocusTrap>
  );
};

Content.displayName = "gist-ui.Content";
