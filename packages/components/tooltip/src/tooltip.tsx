import { createPortal } from "react-dom";
import { useHover, useFocus, useFocusVisible, usePress } from "react-aria";
import { mergeRefs, mergeProps, mapProps } from "@gist-ui/react-utils";
import { useControllableState } from "@gist-ui/use-controllable-state";
import { Slot } from "@gist-ui/slot";
import { TooltipClassNames, TooltipVariantProps, tooltip } from "@gist-ui/theme";
import { useIsDisabled } from "@gist-ui/use-is-disabled";
import { createContextScope } from "@gist-ui/context";
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
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

type Trigger = "hover" | "focus";

interface TooltipContext {
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
  reference: HTMLElement | null;
  setReference: Dispatch<SetStateAction<HTMLElement | null>>;
  setGivenId: Dispatch<SetStateAction<string>>;
}

const Tooltip_Name = "Tooltip.Root";

const [Provider, useContext] = createContextScope<TooltipContext>(Tooltip_Name);

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
  const [givenId, setGivenId] = useState("");
  const id = useId();

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
  }, [hideTooltip, open]);

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
    <Provider
      handleShow={handleShow}
      handleHide={handleHide}
      showTooltip={showTooltip}
      hideTooltip={hideTooltip}
      trigger={trigger}
      isHovered={isHovered}
      isFocused={isFocused}
      id={givenId || id}
      open={open}
      setOpen={setOpen}
      reference={reference}
      setReference={setReference}
      setGivenId={setGivenId}
    >
      {children}
    </Provider>
  );
};

Root.displayName = "gist-ui." + Tooltip_Name;

// *-*-*-*-* Trigger *-*-*-*-*

const Trigger_Name = "Tooltip.Trigger";

export interface TriggerProps {
  children?: ReactNode;
}

export const Trigger = ({ children }: TriggerProps) => {
  const context = useContext(Trigger_Name);
  const [disabled, setDisabled] = useState(false);

  const isDisabledRef = useIsDisabled((isDisabled) => {
    setDisabled(isDisabled);

    if (!isDisabled) context.handleShow(true);
  });

  const { hoverProps } = useHover({
    isDisabled: disabled,
    onHoverStart: () => {
      if (context.trigger === "focus") return;

      context.isHovered.current = true;
      context.isFocused.current = false;

      context.handleShow();
    },
    onHoverEnd: () => {
      if (context.trigger === "focus") return;

      context.isFocused.current = false;
      context.isHovered.current = false;
      context.handleHide();
    },
  });

  const { pressProps } = usePress({
    onPressStart: () => {
      context.isFocused.current = false;
      context.isHovered.current = false;
      context.handleHide(true);
    },
  });

  const { isFocusVisible } = useFocusVisible();
  const { focusProps } = useFocus({
    onFocus: () => {
      if (context.trigger === "hover") return;

      if (isFocusVisible) {
        context.isFocused.current = true;
        context.isHovered.current = false;
        context.handleShow(true);
      }
    },
    onBlur: () => {
      if (context.trigger === "hover") return;

      context.isFocused.current = false;
      context.isHovered.current = false;
      context.handleHide(true);
    },
  });

  return (
    <Slot
      ref={mergeRefs(context.setReference, isDisabledRef)}
      aria-describedby={context.open ? context.id : undefined}
      {...mergeProps({ ...hoverProps }, { ...focusProps }, pressProps, {
        tabIndex: 0,
      })}
    >
      {children}
    </Slot>
  );
};

Trigger.displayName = "gist-ui." + Trigger_Name;

// *-*-*-*-* Portal *-*-*-*-*

const Portal_Name = "Tooltip.Portal";

export interface PortalProps {
  children?: ReactNode;
  container?: Element;
}

export const Portal = ({ children, container }: PortalProps) => {
  const context = useContext(Portal_Name);

  return <>{context.open && createPortal(children, container || document.body)}</>;
};

Portal.displayName = "gist-ui." + Portal_Name;

// *-*-*-*-* Content *-*-*-*-*

const Content_Name = "Tooltip.Content";

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

  const context = useContext(Content_Name);
  const arrowRef = useRef<SVGSVGElement>(null);

  const Component = asChild ? Slot : "div";

  const { hoverProps: tooltipHoverProps } = useHover({
    isDisabled: disableInteractive,
    onHoverStart: () => {
      context.showTooltip(true);
    },
    onHoverEnd: () => {
      context.hideTooltip();
    },
  });

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

  useEffect(() => {
    if (isValidElement(children)) {
      context.setGivenId(children.props.id || "");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

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

Content.displayName = "gist-ui." + Content_Name;
