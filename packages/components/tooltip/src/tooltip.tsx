import { createPortal } from "react-dom";
import { useHover, useFocus, useFocusVisible, usePress } from "react-aria";
import { mergeRefs, mergeProps } from "@gist-ui/react-utils";
import { GistUiError, onlyChildError, validChildError } from "@gist-ui/error";
import { useControllableState } from "@gist-ui/use-controllable-state";
import { Slot } from "@gist-ui/slot";
import { TooltipClassNames, TooltipVariantProps, tooltip } from "@gist-ui/theme";
import {
  Children,
  Dispatch,
  MutableRefObject,
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
import {
  useFloating,
  autoUpdate,
  arrow,
  flip,
  shift,
  offset,
  limitShift,
  hide,
  Placement,
} from "@floating-ui/react-dom";

type Alignment = "start" | "end";
type Side = "top" | "right" | "bottom" | "left";

type Trigger = "hover" | "focus";

export interface RootProps extends TooltipVariantProps {
  children?: ReactNode;
  showDelay?: number;
  hideDelay?: number;
  trigger?: Trigger;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

interface TooltipContext {
  handleShow: (a?: boolean) => void;
  handleHide: (a?: boolean) => void;
  showTooltip: (a?: boolean) => void;
  hideTooltip: (a?: boolean) => void;
  trigger?: Trigger;
  isHovered: MutableRefObject<boolean>;
  isFocused: MutableRefObject<boolean>;
  tooltipId: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isDisabled: boolean;
  setIsDisabled: Dispatch<SetStateAction<boolean>>;
  triggerElement: HTMLElement | null;
  setTriggerElement: Dispatch<SetStateAction<HTMLElement | null>>;
}

const TooltipContext = createContext<TooltipContext | null>(null);

export const Root = (props: RootProps) => {
  const {
    children,
    showDelay = 100,
    hideDelay = 300,
    trigger,
    isOpen: isOpenProp,
    onOpenChange,
    defaultOpen = false,
  } = props;

  const [isOpen, setIsOpen] = useControllableState({
    value: isOpenProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null);

  const [isDisabled, setIsDisabled] = useState(false);

  const tooltipId = useId();

  const isHovered = useRef(false);
  const isFocused = useRef(false);

  const showTimeout = useRef<NodeJS.Timeout>();
  const hideTimeout = useRef<NodeJS.Timeout>();

  const showTooltip = (immediate?: boolean) => {
    clearTimeout(hideTimeout.current);
    hideTimeout.current = undefined;

    if (isOpen) return;

    if (!immediate && showDelay > 0) {
      showTimeout.current = setTimeout(() => {
        setIsOpen(true);
      }, showDelay);
    } else {
      setIsOpen(true);
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
        setIsOpen(false);
      } else {
        hideTimeout.current = setTimeout(() => {
          setIsOpen(false);
        }, hideDelay);
      }

      clearTimeout(showTimeout.current);
      showTimeout.current = undefined;
    },
    [hideDelay, setIsOpen],
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

    if (isOpen) {
      document.addEventListener("keydown", onKeyDown, true);
      return () => {
        document.removeEventListener("keydown", onKeyDown, true);
      };
    }
  }, [hideTooltip, isDisabled, isOpen]);

  useEffect(() => {
    return () => {
      clearTimeout(showTimeout.current);
      clearTimeout(hideTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (!isOpen && hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = undefined;
    }
  }, [isOpen]);

  return (
    <TooltipContext.Provider
      value={{
        handleShow,
        handleHide,
        showTooltip,
        hideTooltip,
        trigger,
        isHovered,
        isFocused,
        tooltipId,
        isOpen,
        setIsOpen,
        isDisabled,
        setIsDisabled,
        triggerElement,
        setTriggerElement,
      }}
    >
      {children}
    </TooltipContext.Provider>
  );
};

Root.displayName = "gist-ui.Root";

export const Trigger = ({ children }: { children?: ReactNode }) => {
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
          context?.setIsOpen(false);
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

  if (!context) throw new GistUiError("Trigger", 'must be used inside "Root"');

  const childCount = Children.count(children);
  if (!childCount) return;
  if (childCount > 1) throw new GistUiError("tooltip", onlyChildError);
  if (!isValidElement(children)) throw new GistUiError("tooltip", validChildError);

  return (
    <>
      {cloneElement(children, {
        ref: mergeRefs(context.setTriggerElement, setToObserver),
        "aria-describedby": context!.isOpen ? context!.tooltipId : undefined,
        tabIndex: 0,
        ...mergeProps(hoverProps, focusProps, pressProps, children.props),
        id: context.tooltipId,
      } as Partial<unknown>)}
    </>
  );
};

Trigger.displayName = "gist-ui.Trigger";

export const Portal = ({ children, container }: { children?: ReactNode; container?: Element }) => {
  const context = useContext(TooltipContext);

  if (!context) throw new GistUiError("Trigger", 'must be used inside "Root"');

  return <>{context.isOpen && createPortal(children, container || document.body)}</>;
};

Portal.displayName = "gist-ui.Portal";

export interface ContentProps {
  children?: ReactNode;
  asChild?: boolean;
  placement?: Placement;
  classNames?: TooltipClassNames;
  disableInteractive?: boolean;
  arrow?: boolean;
  offsetMainAxis?: number;
  offsetAlignmentAxis?: number;
  shiftOffset?: number;
  arrowPadding?: number;
}

export const Content = (props: ContentProps) => {
  const {
    children,
    asChild,
    placement: position,
    disableInteractive,
    classNames,
    arrow: arrowProp = true,
    offsetMainAxis = 10,
    offsetAlignmentAxis = 5,
    shiftOffset = 10,
    arrowPadding = 10,
  } = props;

  const context = useContext(TooltipContext);
  const arrowRef = useRef<HTMLDivElement | null>(null);

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

  const { refs, floatingStyles, middlewareData, placement } = useFloating({
    elements: { reference: context?.triggerElement },
    open: context?.isOpen,
    whileElementsMounted: autoUpdate,
    placement: position,
    middleware: [
      offset({ mainAxis: offsetMainAxis, alignmentAxis: offsetAlignmentAxis }),
      shift({
        limiter: limitShift({ offset: shiftOffset }),
      }),
      flip(),
      arrow({ element: arrowRef, padding: arrowPadding }),
      hide(),
    ],
  });

  if (!context) throw new GistUiError("Content", 'must be used inside "Root"');

  const styles = tooltip();

  const [side] = placement.split("-") as [Side, Alignment];
  const isVerticalSide = side === "bottom" || side === "top";

  return (
    <Component
      ref={refs.setFloating}
      id={context.tooltipId}
      role="tooltip"
      className={styles.base({ className: classNames?.base })}
      {...tooltipHoverProps}
      style={{
        ...floatingStyles,
        visibility: middlewareData.hide?.escaped ? "hidden" : "visible",
      }}
      data-side={placement.split("-")[0]}
    >
      {!arrowProp ? null : (
        <div
          ref={arrowRef}
          style={{
            [isVerticalSide ? "left" : "top"]: isVerticalSide
              ? middlewareData.arrow?.x
              : middlewareData.arrow?.y,
            [side]: "calc(100% - 1px)",
          }}
          className={styles.arrow({ className: classNames?.arrow })}
        />
      )}

      {children}
    </Component>
  );
};

Content.displayName = "gist-ui.Content";
