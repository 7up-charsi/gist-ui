import { useControllableState } from "@gist-ui/use-controllable-state";
import { usePress } from "react-aria";
import { createPortal } from "react-dom";
import { mergeProps, mergeRefs } from "@gist-ui/react-utils";
import { __DEV__ } from "@gist-ui/shared-utils";
import { DialogClassNames, DialogVariantProps, dialog } from "@gist-ui/theme";
import { useClickOutside } from "@gist-ui/use-click-outside";
import { ScrollShadow } from "@gist-ui/scroll-shadow";
import { FocusTrap, FocusTrapProps } from "@gist-ui/focus-trap";
import {
  Children,
  ReactNode,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
} from "react";
import { useCallbackRef } from "@gist-ui/use-callback-ref";

type Reason = "pointer" | "escape" | "outside";

type CloseEvent = { preventDefault(): void };

export interface DialogProps extends DialogVariantProps, Omit<FocusTrapProps, "loop" | "trapped"> {
  trigger?: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  defaultOpen?: boolean;
  modal?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  header?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
  classNames?: DialogClassNames;
  onClose?: (event: CloseEvent, reason: Reason) => void;
}

interface Context {
  scopeName?: string;
  handleClose?: (reason: Reason) => void;
}

const SCOPE_NAME = "Dialog";

const context = createContext<Context>({});

const Dialog = forwardRef<HTMLDivElement, DialogProps>((props, ref) => {
  const {
    trigger,
    modal = true,
    isOpen: isOpenProp,
    defaultOpen,
    onOpenChange,
    header,
    body,
    footer,
    classNames,
    onClose: onCloseProp,
    backdrop,
    borderedBody,
    fullWidth,
    placement,
    removeHorizontalSpace,
    removeVerticleSpace,
    rounded,
    scrollBehavior,
    shadow,
    size,
    variant,
    onMountAutoFocus,
    onUnmountAutoFocus,
  } = props;

  const labelledbyId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const onClose = useCallbackRef(onCloseProp);

  const [isOpen, setIsOpen] = useControllableState({
    defaultValue: defaultOpen,
    value: isOpenProp,
    onChange: onOpenChange,
  });

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const handleClose = useCallback(
    (reason: Reason) => {
      const eventObj = { defaultPrevented: false };

      const preventDefault = () => {
        eventObj.defaultPrevented = true;
      };

      onClose({ preventDefault }, reason);

      if (!eventObj.defaultPrevented) setIsOpen(false);
    },
    [onClose, setIsOpen],
  );

  const { pressProps: triggerPressProps } = usePress({
    onPress: handleOpen,
  });

  useClickOutside<HTMLDivElement>({
    isDisabled: !isOpen,
    ref: dialogRef,
    callback: () => {
      handleClose("outside");
    },
  });

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose("escape");
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeydown, true);

      return () => {
        document.removeEventListener("keydown", handleKeydown, true);
      };
    }
  }, [handleClose, isOpen]);

  const {
    base,
    container,
    backdrop: backdropStyles,
    header: headerStyles,
    body: bodyStyles,
    footer: footerStyles,
  } = dialog({
    backdrop,
    borderedBody,
    fullWidth,
    placement,
    removeHorizontalSpace,
    removeVerticleSpace,
    rounded,
    scrollBehavior,
    shadow,
    size,
    variant,
  });

  if (!trigger) throw new Error("Gist-ui dialog: trigger is required");
  if (!Children.only(trigger)) throw new Error("Gist-ui dialog: trigger must be only child");
  if (!isValidElement(trigger)) throw new Error("Gist-ui dialog: trigger must be valid element");

  const triggerClone = cloneElement(trigger, {
    ...triggerPressProps,
  });

  const isStringHeader = typeof header === "string";

  const diloagHTML = (
    <context.Provider
      value={{
        scopeName: SCOPE_NAME,
        handleClose,
      }}
    >
      <div>
        {props.backdrop === "transparent" ? null : (
          <div className={backdropStyles({ className: classNames?.backdrop })}></div>
        )}

        <div className={container({ className: classNames?.container })}>
          <FocusTrap
            ref={mergeRefs(ref, dialogRef)}
            role="dialog"
            aria-modal={modal}
            className={base({ className: classNames?.base })}
            aria-label={props["aria-label"]}
            aria-labelledby={isStringHeader ? labelledbyId : props["aria-labelledby"]}
            aria-describedby={props["aria-describedby"]}
            loop={modal}
            trapped={modal}
            onMountAutoFocus={onMountAutoFocus}
            onUnmountAutoFocus={onUnmountAutoFocus}
          >
            {header && (
              <div
                className={headerStyles({ className: classNames?.header })}
                id={isStringHeader ? labelledbyId : undefined}
              >
                {header}
              </div>
            )}
            {body && (
              <ScrollShadow
                classNames={{ base: bodyStyles({ className: classNames?.body }) }}
                offset={15}
              >
                {body}
              </ScrollShadow>
            )}
            {footer && (
              <div className={footerStyles({ className: classNames?.footer })}>{footer}</div>
            )}
          </FocusTrap>
        </div>
      </div>
    </context.Provider>
  );

  return (
    <>
      {triggerClone}

      {isOpen && createPortal(diloagHTML, document.body)}
    </>
  );
});

Dialog.displayName = "gist-ui.Dialog";

export default Dialog;

export interface DialogCloseProps {
  children: ReactNode;
}

export const DialogClose = (props: DialogCloseProps) => {
  const { children } = props;

  const { handleClose, scopeName } = useContext(context);

  const { pressProps } = usePress({
    isDisabled: scopeName !== SCOPE_NAME,
    onPress: async () => {
      try {
        handleClose?.("pointer");
      } catch (error) {
        if (__DEV__) console.log(error);
      }
    },
  });

  if (scopeName !== SCOPE_NAME) throw new Error('Gist-ui: "DialogClose" must be child of "Dialog"');
  if (!Children.only(children)) throw new Error('Gist-ui: "DialogClose" must have only child');
  if (!isValidElement(children))
    throw new Error('Gist-ui: "DialogClose" child must be valid element');

  const childClone = cloneElement(children, {
    ...mergeProps(children.props, pressProps),
  });

  return <>{childClone}</>;
};
