import { useControllableState } from "@gist-ui/use-controllable-state";
import { Slot } from "@gist-ui/slot";
import { __DEV__ } from "@gist-ui/shared-utils";
import { GistUiError, onlyChildError, validChildError } from "@gist-ui/error";
import { useClickOutside } from "@gist-ui/use-click-outside";
import { usePress } from "react-aria";
import { useScrollLock } from "@gist-ui/use-scroll-lock";
import { useCallbackRef } from "@gist-ui/use-callback-ref";
import { createPortal } from "react-dom";
import { FocusTrap, FocusScope } from "@gist-ui/focus-trap";
import { VisuallyHidden } from "@gist-ui/visually-hidden";
import { createContextScope } from "@gist-ui/context";
import {
  Children,
  Dispatch,
  ReactNode,
  SetStateAction,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

type Reason = "pointer" | "escape" | "outside" | "virtual";

type CloseEvent = { preventDefault(): void };

interface Context {
  handleOpen: () => void;
  /**
   * reason param could be "pointer" | "escape" | "outside" | "virtual"
   * 1. when dialog closed on interaction with `Close` component then reason is "pointer"
   * 2. when dialog closed on interaction outside `Content` component then reason is "outside"
   * 2. when dialog closed on Escape keypress then reason is "escape"
   * 2. when dialog closed on interaction with visually hidden close button then reason is "virtual" and this will only happen when screen reader read dialog content and close press close button
   */
  handleClose: (reason: Reason) => void;
  isOpen: boolean;
  scope: FocusScope;
  keepMounted: boolean;
  id: string;
  setGivenId: Dispatch<SetStateAction<string>>;
}

const Dialog_Name = "Dialog.Root";

const [Provider, useContext] = createContextScope<Context>(Dialog_Name);

// *-*-*-*-* Root *-*-*-*-*

export interface RootProps {
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
   * When this prop is true, all content stays in the DOM and only css visiblity changes on open/close
   *
   * @default false
   */
  keepMounted?: boolean;
}

export const Root = (props: RootProps) => {
  const {
    children,
    isOpen: isOpenProp,
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

  const [isOpen, setOpen] = useControllableState({
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

    if (isOpen) {
      document.addEventListener("keydown", handleKeydown);

      return () => {
        document.removeEventListener("keydown", handleKeydown);
      };
    }
  }, [handleClose, isOpen]);

  return (
    <>
      <Provider
        handleClose={handleClose}
        handleOpen={handleOpen}
        isOpen={isOpen}
        scope={scope}
        keepMounted={keepMounted}
        setGivenId={setGivenId}
        id={givenId || id}
      >
        {children}
      </Provider>
    </>
  );
};

Root.displayName = "gist-ui." + Dialog_Name;

// *-*-*-*-* Trigger *-*-*-*-*

const Trigger_Name = "Dialog.Trigger";

export interface TriggerProps {
  children: ReactNode;
}

export const Trigger = (props: TriggerProps) => {
  const { children } = props;

  const context = useContext(Trigger_Name);

  const { pressProps } = usePress({ onPress: context.handleOpen });

  return (
    <Slot
      aria-expanded={context.isOpen}
      aria-controls={context.isOpen ? context.id : undefined}
      {...pressProps}
    >
      {children}
    </Slot>
  );
};

Trigger.displayName = "gist-ui." + Trigger_Name;

// *-*-*-*-* Close *-*-*-*-*

const Close_Name = "Dialog.Close";

export interface CloseProps {
  children: ReactNode;
}

export const Close = (props: CloseProps) => {
  const { children } = props;

  const context = useContext(Close_Name);

  const handleClose = context.handleClose;

  const { pressProps } = usePress({
    onPress: () => {
      handleClose("pointer");
    },
  });

  return <Slot {...pressProps}>{children}</Slot>;
};

Close.displayName = "gist-ui." + Close_Name;

// *-*-*-*-* Portal *-*-*-*-*

const Portal_Name = "Dialog.Portal";

export interface PortalProps {
  children?: ReactNode;
  container?: HTMLElement;
}

export const Portal = (props: PortalProps) => {
  const { children, container = document.body } = props;

  const context = useContext(Portal_Name);

  if (context.keepMounted) {
    return createPortal(
      <div style={{ visibility: context.isOpen ? "visible" : "hidden" }}>{children}</div>,
      container,
    );
  }

  return context.isOpen ? createPortal(children, container) : null;
};

Portal.displayName = "gist-ui." + Portal_Name;

// *-*-*-*-* Content *-*-*-*-*

const Content_Name = "Dialog.Content";

export interface ContentProps {
  children?: ReactNode;
}

export const Content = (props: ContentProps) => {
  const { children } = props;

  const context = useContext(Content_Name);

  useScrollLock({ enabled: context.isOpen });

  const setOutsideEle = useClickOutside<HTMLDivElement>({
    isDisabled: !context.isOpen,
    callback: () => {
      context.handleClose("outside");
    },
  });

  useEffect(() => {
    if (isValidElement(children)) {
      context.setGivenId(children.props.id || "");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  const { pressProps } = usePress({ onPress: () => context.handleClose("virtual") });

  const childCount = Children.count(children);
  if (!childCount) return;
  if (childCount > 1) throw new GistUiError("Content", onlyChildError);
  if (!isValidElement(children)) throw new GistUiError("Content", validChildError);

  if (__DEV__ && !children.props["aria-label"] && !children.props["aria-labelledby"])
    throw new GistUiError("Content", 'add "aria-label" or "aria-labelledby" for accessibility');

  if (__DEV__ && !children.props["aria-describedby"])
    console.warn("Content", '"aria-describedby" is optional but recommended');

  return (
    <FocusTrap
      ref={setOutsideEle}
      loop
      trapped
      asChild
      scope={context.scope}
      isDisabled={!context.isOpen}
    >
      {cloneElement(children, {
        role: "dialog",
        "aria-modal": true,
        id: context.id,
        children: (
          <>
            <VisuallyHidden asChild>
              <button {...pressProps}>close</button>
            </VisuallyHidden>

            {children.props.children}

            <VisuallyHidden asChild>
              <button {...pressProps}>close</button>
            </VisuallyHidden>
          </>
        ),
      } as Partial<unknown>)}
    </FocusTrap>
  );
};

Content.displayName = "gist-ui." + Content_Name;
