import { createPortal } from "react-dom";
import { useHover, useFocus, useFocusVisible, usePress } from "react-aria";
import { mergeRefs, mergeProps, mapProps } from "@gist-ui/react-utils";
import { GistUiError } from "@gist-ui/error";
import { useControllableState } from "@gist-ui/use-controllable-state";
import { Slot } from "@gist-ui/slot";
import { TooltipClassNames, TooltipVariantProps, tooltip } from "@gist-ui/theme";
import {
  useFloating,
  Side,
  UseFloatingMiddlewareOptions,
  UseFloatingOptions,
  Placement,
  FloatingArrowContext,
} from "@gist-ui/use-floating";
import {
  Dispatch,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

type Trigger = "hover" | "focus";

interface TooltipContext {
  scopeName: string;
  handleShow: (a?: boolean) => void;
  handleHide: (a?: boolean) => void;
  showTooltip: (a?: boolean) => void;
  hideTooltip: (a?: boolean) => void;
  trigger?: Trigger;
  isHovered: MutableRefObject<boolean>;
  isFocused: MutableRefObject<boolean>;
  id: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isDisabled: boolean;
  setIsDisabled: Dispatch<SetStateAction<boolean>>;
  reference: HTMLElement | null;
  setReference: Dispatch<SetStateAction<HTMLElement | null>>;
  setGivenId: Dispatch<SetStateAction<string>>;
}

const TooltipContext = createContext<TooltipContext | null>(null);

const SCOPE_NAME = "Tooltip";

// *-*-*-*-* Root *-*-*-*-*

export interface RootProps {
  children?: ReactNode;
  showDelay?: number;
  hideDelay?: number;
  /**
   * On which action tooltip shows. undefined means show tooltip on both 'hover' and 'keyboard focus'
   * @default undefined
   */
  trigger?: Trigger;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Root = (props: RootProps) => {
  const {
    children,
    showDelay = 100,
    hideDelay = 300,
    trigger,
    open: isOpenProp,
    onOpenChange,
    defaultOpen = false,
  } = props;

  const [open, setOpen] = useControllableState({
    value: isOpenProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const [reference, setReference] = useState<HTMLElement | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const id = useId();
  const [givenId, setGivenId] = useState("");

  const isHovered = useRef(false);
  const isFocused = useRef(false);

  const showTimeout = useRef<NodeJS.Timeout>();
  const hideTimeout = useRef<NodeJS.Timeout>();

  const showTooltip = (immediate?: boolean) => {
    clearTimeout(hideTimeout.current);
    hideTimeout.current = undefined;

    if (open) return;

    if (!immediate && showDelay > 0) {
      showTimeout.current = setTimeout(() => {
        setOpen(true);
      }, showDelay);
    } else {
      setOpen(true);
    }
  };

  const handleShow = (immediate = false) => {
    if (isHovered.current || isFocused.current) {
      showTooltip(immediate);
    }
  };

  const hideTooltip = useCallback(
    (immediate?: boolean) => {
      if (immediate || hideDelay <= 0) {
        clearTimeout(hideTimeout.current);
        hideTimeout.current = undefined;
        setOpen(false);
      } else {
        hideTimeout.current = setTimeout(() => {
          setOpen(false);
        }, hideDelay);
      }

      clearTimeout(showTimeout.current);
      showTimeout.current = undefined;
    },
    [hideDelay, setOpen],
  );

  const handleHide = (immediate = false) => {
    if (!isHovered.current && !isFocused.current) {
      hideTooltip(immediate);
    }
  };

  useEffect(() => {
    if (isDisabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        hideTooltip(true);
      }
    };

    if (open) {
      document.addEventListener("keydown", onKeyDown, true);
      return () => {
        document.removeEventListener("keydown", onKeyDown, true);
      };
    }
  }, [hideTooltip, isDisabled, open]);

  useEffect(() => {
    return () => {
      clearTimeout(showTimeout.current);
      clearTimeout(hideTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (!open && hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = undefined;
    }
  }, [open]);

  return (
    <TooltipContext.Provider
      value={{
        scopeName: SCOPE_NAME,
        handleShow,
        handleHide,
        showTooltip,
        hideTooltip,
        trigger,
        isHovered,
        isFocused,
        id: givenId || id,
        open,
        setOpen,
        isDisabled,
        setIsDisabled,
        reference,
        setReference,
        setGivenId,
      }}
    >
      {children}
    </TooltipContext.Provider>
  );
};

Root.displayName = "gist-ui.Root";

// *-*-*-*-* Trigger *-*-*-*-*

export interface TriggerProps {
  children?: ReactNode;
}

export const Trigger = ({ children }: TriggerProps) => {
  const context = useContext(TooltipContext);
  const [toObserver, setToObserver] = useState<HTMLElement | null>(null);

  const { hoverProps } = useHover({
    isDisabled: context?.isDisabled,
    onHoverStart: () => {
      if (context!.trigger === "focus") return;

      context!.isHovered.current = true;
      context!.isFocused.current = false;

      context!.handleShow();
    },
    onHoverEnd: () => {
      if (context!.trigger === "focus") return;

      context!.isFocused.current = false;
      context!.isHovered.current = false;
      context!.handleHide();
    },
  });

  const { pressProps } = usePress({
    isDisabled: context?.isDisabled,
    onPressStart: () => {
      context!.isFocused.current = false;
      context!.isHovered.current = false;
      context!.handleHide(true);
    },
  });

  const { isFocusVisible } = useFocusVisible();
  const { focusProps } = useFocus({
    isDisabled: context?.isDisabled,
    onFocus: () => {
      if (context?.trigger === "hover") return;

      if (isFocusVisible) {
        context!.isFocused.current = true;
        context!.isHovered.current = false;
        context!.handleShow(true);
      }
    },
    onBlur: () => {
      if (context?.trigger === "hover") return;

      context!.isFocused.current = false;
      context!.isHovered.current = false;
      context!.handleHide(true);
    },
  });

  useEffect(() => {
    if (!toObserver) return;

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if ((mutation.target as unknown as { disabled?: boolean }).disabled) {
          context?.setOpen(false);
          context?.setIsDisabled(true);
        } else {
          context?.setIsDisabled(false);
        }
      }
    });

    observer.observe(toObserver, { attributeFilter: ["disabled"] });

    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toObserver]);

  if (context?.scopeName !== SCOPE_NAME)
    throw new GistUiError("Trigger", 'must be used inside "Root"');

  return (
    <Slot
      ref={mergeRefs(context.setReference, setToObserver)}
      aria-describedby={context.open ? context.id : undefined}
      {...mergeProps({ ...hoverProps }, { ...focusProps }, pressProps, {
        tabIndex: 0,
      })}
    >
      {children}
    </Slot>
  );
};

Trigger.displayName = "gist-ui.Trigger";

// *-*-*-*-* Portal *-*-*-*-*

export interface PortalProps {
  children?: ReactNode;
  container?: Element;
}

export const Portal = ({ children, container }: PortalProps) => {
  const context = useContext(TooltipContext);

  if (context?.scopeName !== SCOPE_NAME)
    throw new GistUiError("Portal", 'must be used inside "Root"');

  return <>{context.open && createPortal(children, container || document.body)}</>;
};

Portal.displayName = "gist-ui.Portal";

// *-*-*-*-* Content *-*-*-*-*

export interface ContentProps
  extends TooltipVariantProps,
    Omit<UseFloatingOptions, "open" | "elements">,
    UseFloatingMiddlewareOptions {
  children?: ReactNode;
  asChild?: boolean;
  placement?: Placement;
  classNames?: TooltipClassNames;
  disableInteractive?: boolean;
}

export const Content = forwardRef<HTMLDivElement, ContentProps>((_props, ref) => {
  const [props, variantProps] = mapProps({ ..._props }, tooltip.variantKeys);

  const {
    children,
    asChild,
    placement: placementProp,
    disableInteractive,
    classNames,
    arrowOptions,
    flipOptions,
    offsetOptions,
    platform,
    strategy,
    transform,
    whileElementsMounted,
  } = props;

  const context = useContext(TooltipContext);
  const arrowRef = useRef<SVGSVGElement>(null);

  const Component = asChild ? Slot : "div";

  const { hoverProps: tooltipHoverProps } = useHover(
    context?.isDisabled
      ? { isDisabled: true }
      : {
          isDisabled: disableInteractive,
          onHoverStart: () => {
            context?.showTooltip(true);
          },
          onHoverEnd: () => {
            context?.hideTooltip();
          },
        },
  );

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

  useEffect(() => {
    if (isValidElement(children)) {
      context?.setGivenId(children.props.id || "");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  if (context?.scopeName !== SCOPE_NAME)
    throw new GistUiError("Content", 'must be used inside "Root"');

  const styles = tooltip(variantProps);

  return (
    <FloatingArrowContext.Provider
      value={{
        middlewareData: middlewareData,
        side: placement.split("-")[0] as Side,
        arrowRef,
      }}
    >
      <Component
        ref={mergeRefs(ref, refs.setFloating)}
        role="tooltip"
        className={styles.base({ className: classNames?.base })}
        {...tooltipHoverProps}
        id={context.id}
        style={{
          ...floatingStyles,
          visibility: middlewareData.hide?.escaped ? "hidden" : "visible",
        }}
      >
        {children}
      </Component>
    </FloatingArrowContext.Provider>
  );
});

Content.displayName = "gist-ui.Content";
