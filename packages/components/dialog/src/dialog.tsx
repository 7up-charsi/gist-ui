import { useControllableState } from "@gist-ui/use-controllable-state";
import { usePress } from "react-aria";
import { createPortal } from "react-dom";
import { mergeProps, mergeRefs } from "@gist-ui/react-utils";
import { __DEV__ } from "@gist-ui/shared-utils";
import { DialogClassNames, DialogVariantProps, dialog } from "@gist-ui/theme";
import { useClickOutside } from "@gist-ui/use-click-outside";
import { ScrollShadow } from "@gist-ui/scroll-shadow";
import { useCallbackRef } from "@gist-ui/use-callback-ref";
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

type Reason = "pointer" | "escape" | "outside";

export interface DialogProps extends DialogVariantProps {
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
  disableEscapeKey?: boolean;
  disableClickOutside?: boolean;
  onClickOutside?: () => void;
  onCloseStart?: (reason: Reason) => Promise<void> | void;
  onCloseEnd?: (reason: Reason) => void;
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
    disableEscapeKey,
    disableClickOutside,
    onClickOutside,
    onCloseStart,
    onCloseEnd,
  } = props;

  const onCloseEndRef = useCallbackRef(onCloseEnd);
  const onCloseStartRef = useCallbackRef(onCloseStart);

  const labelledbyId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useControllableState({
    defaultValue: defaultOpen,
    value: isOpenProp,
    onChange: onOpenChange,
  });

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const handleClose = useCallback(
    async (reason: Reason) => {
      await onCloseStartRef(reason);

      setIsOpen(false);
      onCloseEndRef(reason);
    },
    [onCloseEndRef, onCloseStartRef, setIsOpen],
  );

  const { pressProps: triggerPressProps } = usePress({
    onPress: handleOpen,
  });

  useClickOutside<HTMLDivElement>({
    isDisabled: disableClickOutside,
    ref: dialogRef,
    callback: () => {
      onClickOutside?.();
      handleClose("outside");
    },
  });

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose("escape");
      }
    };

    if (isOpen && !disableEscapeKey) {
      document.addEventListener("keydown", handleKeydown, true);

      return () => {
        document.removeEventListener("keydown", handleKeydown, true);
      };
    }
  }, [disableEscapeKey, handleClose, isOpen]);

  const {
    base,
    container,
    backdrop,
    header: headerStyles,
    body: bodyStyles,
    footer: footerStyles,
  } = dialog({
    ...props,
  });

  if (!trigger) throw new Error("Gist-ui dialog: trigger is required");
  if (!Children.only(trigger)) throw new Error("Gist-ui dialog: trigger must be only child");
  if (!isValidElement(trigger)) throw new Error("Gist-ui dialog: trigger must be valid element");

  const triggerClone = cloneElement(trigger, {
    ...triggerPressProps,
  });

  const isStringHeader = typeof header === "string";

  const dialogHTML = (
    <context.Provider
      value={{
        scopeName: SCOPE_NAME,
        handleClose,
      }}
    >
      <div>
        {props.backdrop === "transparent" ? null : (
          <div className={backdrop({ className: classNames?.backdrop })}></div>
        )}

        <div className={container({ className: classNames?.container })}>
          <div
            ref={mergeRefs(ref, dialogRef)}
            role="dialog"
            aria-modal={modal}
            className={base({ className: classNames?.base })}
            aria-label={props["aria-label"]}
            aria-labelledby={isStringHeader ? labelledbyId : props["aria-labelledby"]}
            aria-describedby={props["aria-describedby"]}
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
          </div>
        </div>
      </div>
    </context.Provider>
  );

  return (
    <>
      {triggerClone}

      {isOpen && createPortal(dialogHTML, document.body)}
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