import { GistUiError, onlyChildError, validChildError } from "@gist-ui/error";
import { usePress } from "react-aria";
import { Slot } from "@gist-ui/slot";
import { __DEV__ } from "@gist-ui/shared-utils";
import { useCallbackRef } from "@gist-ui/use-callback-ref";
import { useControllableState } from "@gist-ui/use-controllable-state";
import { FocusTrap, FocusTrapProps } from "@gist-ui/focus-trap";
import { useClickOutside } from "@gist-ui/use-click-outside";
import { createPortal } from "react-dom";
import {
  useFloating,
  Side,
  UseFloatingMiddlewareOptions,
  UseFloatingOptions,
  FloatingArrowContext,
} from "@gist-ui/use-floating";
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

interface PopoverContext
  extends Required<Pick<FocusTrapProps, "onMountAutoFocus" | "onUnmountAutoFocus">> {
  open: boolean;
  scopeName: string;
  disabled: boolean;
  setDisabled: Dispatch<SetStateAction<boolean>>;
  handleOpen(): void;
  handleClose(): void;
  id: string;
  reference: HTMLElement | null;
  setReference: Dispatch<SetStateAction<HTMLElement | null>>;
  setGivenId: Dispatch<SetStateAction<string>>;
}

const SCOPE_NAME = "POPOVER";

const PopoverContext = createContext<PopoverContext | null>(null);

// *-*-*-*-* Root *-*-*-*-*

export interface RootProps extends Pick<FocusTrapProps, "onMountAutoFocus" | "onUnmountAutoFocus"> {
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
}

export const Root = (props: RootProps) => {
  const {
    children,
    defaultOpen,
    open: openProp,
    onOpenChange,
    onMountAutoFocus: onMountAutoFocusProp,
    onUnmountAutoFocus: onUnmountAutoFocusProp,
  } = props;

  const [open, setOpen] = useControllableState({
    defaultValue: defaultOpen,
    onChange: onOpenChange,
    value: openProp,
  });
  const [disabled, setDisabled] = useState(true);
  const [reference, setReference] = useState<HTMLElement | null>(null);

  const onMountAutoFocus = useCallbackRef(onMountAutoFocusProp);
  const onUnmountAutoFocus = useCallbackRef(onUnmountAutoFocusProp);
  const id = useId();

  const [givenId, setGivenId] = useState("");

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <PopoverContext.Provider
      value={{
        scopeName: SCOPE_NAME,
        disabled,
        setDisabled,
        handleOpen,
        handleClose,
        open,
        id: givenId || id,
        onMountAutoFocus,
        onUnmountAutoFocus,
        reference,
        setReference,
        setGivenId,
      }}
    >
      {children}
    </PopoverContext.Provider>
  );
};

Root.displayName = "gist-ui.Root";

// *-*-*-*-* Trigger *-*-*-*-*

export interface TriggerProps {
  children: ReactNode;
}

export const Trigger = (props: TriggerProps) => {
  const { children } = props;

  const context = useContext(PopoverContext);

  const { pressProps } = usePress({
    isDisabled: context?.scopeName !== SCOPE_NAME,
    onPress: context?.handleOpen,
  });

  if (context?.scopeName !== SCOPE_NAME)
    throw new GistUiError("Trigger", 'must be child of "Root"');

  return (
    <Slot
      ref={context.setReference}
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

  const context = useContext(PopoverContext);

  const { pressProps } = usePress({
    isDisabled: context?.scopeName !== SCOPE_NAME,
    onPress: context?.handleClose,
  });

  if (context?.scopeName !== SCOPE_NAME) throw new GistUiError("Close", 'must be child of "Root"');

  return <Slot {...pressProps}>{children}</Slot>;
};

Close.displayName = "gist-ui.Close";

// *-*-*-*-* Portal *-*-*-*-*

export interface PortalProps {
  children?: ReactNode;
  container?: Element;
}

export const Portal = ({ children, container }: PortalProps) => {
  const context = useContext(PopoverContext);

  if (context?.scopeName !== SCOPE_NAME)
    throw new GistUiError("Portal", 'must be used inside "Root"');

  return <>{context.open && createPortal(children, container || document.body)}</>;
};

Portal.displayName = "gist-ui.Portal";

// *-*-*-*-* Content *-*-*-*-*

export interface ContentProps
  extends Omit<UseFloatingOptions, "open" | "elements">,
    UseFloatingMiddlewareOptions {
  children?: ReactNode;
}

export const Content = (props: ContentProps) => {
  const {
    children,
    placement: placementProp,
    platform,
    strategy,
    transform,
    whileElementsMounted,
    arrowOptions,
    flipOptions,
    offsetOptions,
  } = props;

  const context = useContext(PopoverContext);
  const dialogRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);

  const { refs, middlewareData, floatingStyles, placement } = useFloating({
    placement: placementProp,
    platform,
    strategy,
    transform,
    whileElementsMounted,
    open: context?.open,
    elements: {
      reference: context?.reference,
    },
    offsetOptions,
    flipOptions,
    arrowOptions: { padding: arrowOptions?.padding, element: arrowRef },
  });

  useClickOutside<HTMLDivElement>({
    ref: dialogRef,
    callback: () => {
      context?.handleClose();
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
    <FloatingArrowContext.Provider
      value={{
        middlewareData: middlewareData,
        side: placement.split("-")[0] as Side,
        arrowRef,
      }}
    >
      <FocusTrap
        ref={dialogRef}
        loop
        trapped
        onMountAutoFocus={context?.onMountAutoFocus}
        onUnmountAutoFocus={context?.onUnmountAutoFocus}
        asChild
      >
        {cloneElement(children, {
          role: "dialog",
          ref: refs.setFloating,
          style: floatingStyles,
          id: context.id,
        } as Partial<unknown>)}
      </FocusTrap>
    </FloatingArrowContext.Provider>
  );
};

Content.displayName = "gist-ui.Content";
