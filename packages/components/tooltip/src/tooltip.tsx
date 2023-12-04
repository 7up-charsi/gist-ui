import { createPortal } from "react-dom";
import { useHover, useFocus, useFocusVisible } from "react-aria";
import { mergeProps } from "@gist-ui/react-utils";
import { useControllableState } from "@gist-ui/use-controllable-state";
import { Slot } from "@gist-ui/slot";
import { TooltipClassNames, TooltipVariantProps, tooltip } from "@gist-ui/theme";
import { useIsDisabled } from "@gist-ui/use-is-disabled";
import { createContextScope } from "@gist-ui/context";
import * as Popper from "@gist-ui/popper";
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
  useMemo,
  useRef,
  useState,
} from "react";
import pick from "lodash.pick";
import omit from "lodash.omit";

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
  setGivenId: Dispatch<SetStateAction<string>>;
}

const Tooltip_Name = "Tooltip.Root";

const [Provider, useContext] = createContextScope<TooltipContext>(Tooltip_Name);

const tooltips: Record<string, (a: boolean) => void> = {};
let tooltipId = 0;

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
  } = props;

  const [open, setOpen] = useControllableState({
    value: isOpenProp,
    onChange: onOpenChange,
  });

  const [givenId, setGivenId] = useState("");
  const id = useId();

  const tooltipIdentifier = useMemo(() => `${++tooltipId}`, []);

  const isHovered = useRef(false);
  const isFocused = useRef(false);

  const showTimeout = useRef<NodeJS.Timeout>();
  const hideTimeout = useRef<NodeJS.Timeout>();

  const addOpenTooltip = () => {
    tooltips[tooltipIdentifier] = hideTooltip;
  };

  const closeOpenTooltips = () => {
    for (const hideId in tooltips) {
      if (hideId !== tooltipIdentifier) {
        if (Object.prototype.hasOwnProperty.call(tooltips, hideId)) {
          tooltips[hideId](true);
          delete tooltips[hideId];
        }
      }
    }
  };

  const showTooltip = (immediate?: boolean) => {
    clearTimeout(hideTimeout.current);
    hideTimeout.current = undefined;

    closeOpenTooltips();
    addOpenTooltip();

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
      setGivenId={setGivenId}
    >
      <Popper.Root>{children}</Popper.Root>
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
  const ref = useRef<HTMLButtonElement>(null);

  useIsDisabled({
    ref,
    callback: (isDisabled) => {
      setDisabled(isDisabled);

      if (!isDisabled) context.handleShow(true);
    },
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

  const handlePointerDown = () => {
    context.isFocused.current = false;
    context.isHovered.current = false;
    context.handleHide(true);
  };

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
    <Popper.Reference>
      <Slot
        ref={ref}
        aria-describedby={context.open ? context.id : undefined}
        {...mergeProps(
          { ...hoverProps },
          { ...focusProps },
          { onPointerDown: handlePointerDown },
          { tabIndex: 0 },
        )}
      >
        {children}
      </Slot>
    </Popper.Reference>
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

export interface ContentProps extends TooltipVariantProps, Popper.FloatingProps {
  children?: ReactNode;
  asChild?: boolean;
  classNames?: TooltipClassNames;
  disableInteractive?: boolean;
}

export const Content = forwardRef<HTMLDivElement, ContentProps>((_props, ref) => {
  const variantProps = pick(_props, ...tooltip.variantKeys);
  const props = omit(_props, ...tooltip.variantKeys);

  const { children, asChild, disableInteractive, classNames } = props;

  const context = useContext(Content_Name);

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

  useEffect(() => {
    if (isValidElement(children)) {
      context.setGivenId((children.props as { id?: string }).id || "");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  const styles = tooltip(variantProps);

  return (
    <Popper.Floating>
      <Component
        ref={ref}
        role="tooltip"
        className={styles.base({ className: classNames?.base })}
        {...tooltipHoverProps}
        id={context.id}
      >
        {children}
      </Component>
    </Popper.Floating>
  );
});

Content.displayName = "gist-ui." + Content_Name;
