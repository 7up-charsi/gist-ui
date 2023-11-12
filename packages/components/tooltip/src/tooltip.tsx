import { createPortal } from "react-dom";
import { useHover, useFocus, useFocusVisible, usePress } from "react-aria";
import { mergeRefs, mergeProps } from "@gist-ui/react-utils";
import { tooltip } from "@gist-ui/theme";
import Arrow, { ArrowProps } from "./arrow";
import {
  Children,
  ReactNode,
  cloneElement,
  forwardRef,
  isValidElement,
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
  OffsetOptions,
  limitShift,
  ShiftOptions,
  FlipOptions,
  hide,
  HideOptions,
  Placement,
} from "@floating-ui/react-dom";

type ClassNames = {
  [key in keyof typeof tooltip.slots]?: string;
};

export interface TooltipProps {
  children?: ReactNode;
  title?: string;
  disabled?: boolean;
  classNames?: ClassNames;
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
  } = props;

  const [isOpen, setIsOpen] = useState(false);

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

  const hideTooltip = (immediate?: boolean) => {
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
  };

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
  }, [isOpen]);

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
      shift({ limiter: limitShift(), ...middlewareOptions?.shift }),
      flip(middlewareOptions?.flip),
      arrow({ element: arrowRef }),
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

  const { base: baseStyles } = tooltip({
    arrowHide: middlewareData.hide?.escaped,
  });

  if (!Children.only(children)) throw new Error("Gist-ui tooltip: must have only one child");

  if (!isValidElement(children)) throw new Error("Gist-ui tooltip: children must be valid element");

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
          <div
            ref={mergeRefs(ref, refs.setFloating)}
            className={baseStyles({ className: classNames?.base })}
            id={tooltipId}
            style={floatingStyles}
            role="tooltip"
            {...tooltipHoverProps}
          >
            {title}

            <Arrow
              {...arrowProps}
              placement={placement}
              arrowData={middlewareData.arrow}
              ref={arrowRef}
              floatingElement={elements.floating}
            />
          </div>,
          document.body,
        )}
    </>
  );
});

Tooltip.displayName = "gist-ui.Tooltip";

export default Tooltip;
