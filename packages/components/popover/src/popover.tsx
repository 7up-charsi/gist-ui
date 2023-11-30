import { GistUiError, validChildError } from "@gist-ui/error";
import { usePress } from "react-aria";
import { Slot } from "@gist-ui/slot";
import { VisuallyHidden } from "@gist-ui/visually-hidden";
import { useControllableState } from "@gist-ui/use-controllable-state";
import { FocusTrap } from "@gist-ui/focus-trap";
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
import { useIsDisabled } from "@gist-ui/use-is-disabled";
import { mergeRefs } from "@gist-ui/react-utils";

interface PopoverContext {
  open: boolean;
  scopeName: string;
  handleOpen(): void;
  handleClose(): void;
  id: string;
  reference: HTMLElement | null;
  setReference: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  setGivenId: React.Dispatch<React.SetStateAction<string>>;
}

const SCOPE_NAME = "POPOVER";

const PopoverContext = createContext<PopoverContext | null>(null);

// *-*-*-*-* Root *-*-*-*-*

export interface RootProps {
  children?: React.ReactNode;
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
  const { children, defaultOpen, open: openProp, onOpenChange } = props;

  const [open, setOpen] = useControllableState({
    defaultValue: defaultOpen,
    onChange: onOpenChange,
    value: openProp,
  });

  const [reference, setReference] = useState<HTMLElement | null>(null);

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
        handleOpen,
        handleClose,
        open,
        id: givenId || id,
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
  children: React.ReactNode;
}

export const Trigger = (props: TriggerProps) => {
  const { children } = props;

  const context = useContext(PopoverContext);

  const isDisabledRef = useIsDisabled((isDisabled) => {
    if (isDisabled) context?.handleClose();
  });

  const { pressProps } = usePress({
    onPress: context?.handleOpen,
  });

  if (context?.scopeName !== SCOPE_NAME)
    throw new GistUiError("Trigger", 'must be child of "Root"');

  return (
    <Slot
      ref={mergeRefs(context.setReference, isDisabledRef)}
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
  children: React.ReactNode;
}

export const Close = (props: CloseProps) => {
  const { children } = props;

  const context = useContext(PopoverContext);

  const { pressProps } = usePress({
    onPress: context?.handleClose,
  });

  if (context?.scopeName !== SCOPE_NAME) throw new GistUiError("Close", 'must be child of "Root"');

  return <Slot {...pressProps}>{children}</Slot>;
};

Close.displayName = "gist-ui.Close";

// *-*-*-*-* Portal *-*-*-*-*

export interface PortalProps {
  children?: React.ReactNode;
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
  children?: React.ReactNode;
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

  if (!isValidElement(children)) throw new GistUiError("Content", validChildError);

  return (
    <FloatingArrowContext.Provider
      value={{
        middlewareData: middlewareData,
        side: placement.split("-")[0] as Side,
        arrowRef,
      }}
    >
      <FocusTrap ref={dialogRef} loop trapped asChild>
        {cloneElement(children, {
          role: "dialog",
          ref: refs.setFloating,
          style: floatingStyles,
          id: context.id,
          children: (
            <>
              <VisuallyHidden asChild>
                <button onClick={context.handleClose}>close</button>
              </VisuallyHidden>

              {children.props.children}

              <VisuallyHidden asChild>
                <button onClick={context.handleClose}>close</button>
              </VisuallyHidden>
            </>
          ),
        } as Partial<unknown>)}
      </FocusTrap>
    </FloatingArrowContext.Provider>
  );
};

Content.displayName = "gist-ui.Content";
