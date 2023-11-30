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
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { useIsDisabled } from "@gist-ui/use-is-disabled";
import { mergeRefs } from "@gist-ui/react-utils";
import { createContextScope } from "@gist-ui/context";

interface PopoverContext {
  open: boolean;
  handleOpen(): void;
  handleClose(): void;
  id: string;
  reference: HTMLElement | null;
  setReference: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  setGivenId: React.Dispatch<React.SetStateAction<string>>;
}

const Popover_Name = "Popover.Root";

const [Provider, useContext] = createContextScope<PopoverContext>(Popover_Name);

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
    <Provider
      handleOpen={handleOpen}
      handleClose={handleClose}
      open={open}
      reference={reference}
      setReference={setReference}
      setGivenId={setGivenId}
      id={givenId || id}
    >
      {children}
    </Provider>
  );
};

Root.displayName = "gist-ui." + Popover_Name;

// *-*-*-*-* Trigger *-*-*-*-*

const Trigger_Name = "Popover.Trigger";

export interface TriggerProps {
  children: React.ReactNode;
}

export const Trigger = (props: TriggerProps) => {
  const { children } = props;

  const context = useContext(Trigger_Name);

  const isDisabledRef = useIsDisabled((isDisabled) => {
    if (isDisabled) context.handleClose();
  });

  const { pressProps } = usePress({
    onPress: context.handleOpen,
  });

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

Trigger.displayName = "gist-ui." + Trigger_Name;

// *-*-*-*-* Close *-*-*-*-*

const Close_Name = "Popover.Close";

export interface CloseProps {
  children: React.ReactNode;
}

export const Close = (props: CloseProps) => {
  const { children } = props;

  const context = useContext(Close_Name);

  const { pressProps } = usePress({
    onPress: context.handleClose,
  });

  return <Slot {...pressProps}>{children}</Slot>;
};

Close.displayName = "gist-ui." + Close_Name;

// *-*-*-*-* Portal *-*-*-*-*

const Portal_Name = "Popover.Portal";

export interface PortalProps {
  children?: React.ReactNode;
  container?: Element;
}

export const Portal = ({ children, container }: PortalProps) => {
  const context = useContext(Portal_Name);

  return <>{context.open && createPortal(children, container || document.body)}</>;
};

Portal.displayName = "gist-ui." + Portal_Name;

// *-*-*-*-* Content *-*-*-*-*

const Content_Name = "Popover.Content";

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

  const context = useContext(Content_Name);
  const dialogRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);

  const { refs, middlewareData, floatingStyles, placement } = useFloating({
    placement: placementProp,
    platform,
    strategy,
    transform,
    whileElementsMounted,
    open: context.open,
    elements: {
      reference: context.reference,
    },
    offsetOptions,
    flipOptions,
    arrowOptions: { padding: arrowOptions?.padding, element: arrowRef },
  });

  useClickOutside<HTMLDivElement>({
    ref: dialogRef,
    callback: () => {
      context.handleClose();
    },
  });

  useEffect(() => {
    if (isValidElement(children)) {
      context.setGivenId(children.props.id || "");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

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

Content.displayName = "gist-ui." + Content_Name;
