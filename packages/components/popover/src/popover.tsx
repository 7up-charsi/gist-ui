import { GistUiError, validChildError } from "@gist-ui/error";
import { Slot } from "@gist-ui/slot";
import { VisuallyHidden } from "@gist-ui/visually-hidden";
import { useControllableState } from "@gist-ui/use-controllable-state";
import { FocusTrap } from "@gist-ui/focus-trap";
import { useClickOutside } from "@gist-ui/use-click-outside";
import { usePress } from "@react-aria/interactions";
import * as Popper from "@gist-ui/popper";
import { createPortal } from "react-dom";
import { useIsDisabled } from "@gist-ui/use-is-disabled";
import { createContextScope } from "@gist-ui/context";
import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

interface PopoverContext {
  isOpen: boolean;
  handleOpen(): void;
  handleClose(): void;
  id: string;
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
}

export const Root = (props: RootProps) => {
  const { children, defaultOpen, isOpen: openProp, onOpenChange } = props;

  const [isOpen, setOpen] = useControllableState({
    defaultValue: defaultOpen,
    onChange: onOpenChange,
    value: openProp,
  });

  const id = useId();

  const [givenId, setGivenId] = useState("");

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;

      handleClose();
    };

    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [handleClose, isOpen]);

  return (
    <Provider
      handleOpen={handleOpen}
      handleClose={handleClose}
      isOpen={isOpen}
      setGivenId={setGivenId}
      id={givenId || id}
    >
      <Popper.Root>{children}</Popper.Root>
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
  const ref = useRef<HTMLButtonElement>(null);

  useIsDisabled({
    ref,
    callback: (isDisabled) => {
      if (isDisabled) context.handleClose();
    },
  });

  const { pressProps } = usePress({ onPress: context.handleOpen });

  return (
    <Popper.Reference>
      <Slot
        ref={ref}
        aria-expanded={context.isOpen}
        aria-controls={context.isOpen ? context.id : undefined}
        {...pressProps}
      >
        {children}
      </Slot>
    </Popper.Reference>
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

  const { pressProps } = usePress({ onPress: context.handleClose });

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

  return (
    <>{context.isOpen && createPortal(children, container || document.body)}</>
  );
};

Portal.displayName = "gist-ui." + Portal_Name;

// *-*-*-*-* Content *-*-*-*-*

const Content_Name = "Popover.Content";

export interface ContentProps extends Popper.FloatingProps {
  children?: React.ReactNode;
}

export const Content = (props: ContentProps) => {
  const { children, ...restProps } = props;

  const context = useContext(Content_Name);

  const setOutsideEle = useClickOutside<HTMLDivElement>({
    isDisabled: !context.isOpen,
    callback: () => {
      context.handleClose();
    },
  });

  const { pressProps } = usePress({ onPress: context.handleClose });

  useEffect(() => {
    if (isValidElement(children)) {
      context.setGivenId(children.props.id || "");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  if (!isValidElement(children))
    throw new GistUiError("Content", validChildError);

  return (
    <Popper.Floating {...restProps}>
      <FocusTrap ref={setOutsideEle} loop trapped asChild>
        {cloneElement(children, {
          role: "dialog",
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
    </Popper.Floating>
  );
};

Content.displayName = "gist-ui." + Content_Name;
