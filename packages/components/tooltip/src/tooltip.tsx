import { createPortal } from "react-dom";
import { useHover, useFocus, useFocusVisible, usePress } from "react-aria";
import { mergeRefs, mergeProps } from "@gist-ui/react-utils";
import { GistUiError } from "@gist-ui/error";
import { useControllableState } from "@gist-ui/use-controllable-state";
import { TooltipClassNames, TooltipVariantProps, tooltip } from "@gist-ui/theme";
import Arrow, { ArrowProps } from "./arrow";
import {
  Children,
  ReactNode,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
} from "react";
import {
  useFloating,
  autoUpdate,
  arrow,
  flip,
  shift,
  offset,
  OffsetOptions,
  limitShift,
  ShiftOptions,
  FlipOptions,
  hide,
  HideOptions,
  Placement,
} from "@floating-ui/react-dom";

export interface TooltipProps extends TooltipVariantProps {
  children?: ReactNode;
  title?: string;
  disabled?: boolean;
  classNames?: TooltipClassNames;
  arrowProps?: Omit<ArrowProps, "placement" | "arrowData" | "ref" | "floatingElement">;
  placement?: Placement;
  middlewareOptions?: {
    offset?: OffsetOptions;
    shift?: ShiftOptions;
    flip?: FlipOptions;
    hide?: HideOptions;
  };
  disableInteractive?: boolean;
  showDelay?: number;
  hideDelay?: number;
  trigger?: "hover" | "focus";
  arrowHide?: boolean;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  portalContainer?: Element;
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>((props, ref) => {
  const {
    title,
    children,
    disabled,
    classNames,
    middlewareOptions,
    placement: position,
    arrowProps,
    showDelay = 100,
    hideDelay = 300,
    trigger,
    disableInteractive,
    isOpen: isOpenProp,
    onOpenChange,
    defaultOpen = false,
    arrowHide,
    portalContainer = document.body,
  } = props;

  const Component = "div";

  const [isOpen, setIsOpen] = useControllableState({
    value: isOpenProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const tooltipId = useId();
  const arrowRef = useRef<SVGSVGElement>(null);

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
  }, [hideTooltip, isOpen]);

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

  const { refs, floatingStyles, middlewareData, placement, elements } = useFloating({
    open: isOpen,
    whileElementsMounted: autoUpdate,
    placement: position,
    middleware: [
      offset(middlewareOptions?.offset || 10),
      shift({
        limiter: limitShift(({ elements }) => ({
          offset: elements.reference.getBoundingClientRect().width / 2,
        })),
        ...middlewareOptions?.shift,
      }),
      flip(middlewareOptions?.flip),
      arrow({ element: arrowRef, padding: 10 }),
      hide(middlewareOptions?.hide),
    ],
  });

  const { hoverProps: tooltipHoverProps } = useHover({
    isDisabled: disableInteractive,
    onHoverStart: () => {
      showTooltip(true);
    },
    onHoverEnd: () => {
      hideTooltip();
    },
  });

  const { hoverProps } = useHover({
    isDisabled: disabled,
    onHoverStart: () => {
      if (trigger === "focus") return;

      isHovered.current = true;
      isFocused.current = false;

      handleShow();
    },
    onHoverEnd: () => {
      if (trigger === "focus") return;

      isFocused.current = false;
      isHovered.current = false;
      handleHide();
    },
  });

  const { pressProps } = usePress({
    onPressStart: () => {
      isFocused.current = false;
      isHovered.current = false;
      handleHide(true);
    },
  });

  const { isFocusVisible } = useFocusVisible();
  const { focusProps } = useFocus({
    onFocus: () => {
      if (isFocusVisible) {
        isFocused.current = true;
        isHovered.current = false;
        handleShow(true);
      }
    },
    onBlur: () => {
      isFocused.current = false;
      isHovered.current = false;
      handleHide(true);
    },
  });

  const { base: baseStyles } = tooltip(props);

  const childCount = Children.count(children);
  if (!childCount) return;
  if (childCount > 1) throw new GistUiError("tooltip", "must have only one child");
  if (!isValidElement(children)) throw new GistUiError("tooltip", "children must be valid element");

  const tooltipTrigger = cloneElement(children, {
    ref: refs.setReference,
    "aria-describedby": isOpen ? tooltipId : undefined,
    tabIndex: 0,
    ...mergeProps(children.props, hoverProps, focusProps, pressProps),
  } as Partial<unknown>);

  return (
    <>
      {tooltipTrigger}

      {isOpen &&
        !disabled &&
        !children.props.disabled &&
        createPortal(
          <Component
            ref={mergeRefs(ref, refs.setFloating)}
            className={baseStyles({ className: classNames?.base })}
            id={tooltipId}
            style={{
              ...floatingStyles,
              visibility: middlewareData.hide?.escaped ? "hidden" : "visible",
            }}
            role="tooltip"
            {...tooltipHoverProps}
          >
            {title}

            {!arrowHide && (
              <Arrow
                {...arrowProps}
                placement={placement}
                arrowData={middlewareData.arrow}
                ref={arrowRef}
                floatingElement={elements.floating}
              />
            )}
          </Component>,
          portalContainer,
        )}
    </>
  );
});

Tooltip.displayName = "gist-ui.Tooltip";

export default Tooltip;
