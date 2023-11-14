import { useControllableState } from "@gist-ui/use-controllable-state";
import { usePress } from "react-aria";
import { createPortal } from "react-dom";
import { mergeProps } from "@gist-ui/react-utils";
import { __DEV__ } from "@gist-ui/shared-utils";
import { DialogClassNames, DialogVariantProps, dialog } from "@gist-ui/theme";
import {
  Children,
  ReactNode,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useId,
} from "react";

export interface DialogProps extends DialogVariantProps {
  trigger?: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  defaultOpen?: boolean;
  modal?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  header?: string;
  body?: ReactNode;
  footer?: ReactNode;
  classNames?: DialogClassNames;
}

interface Context {
  scopeName?: string;
  handleClose?: () => void;
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
  } = props;

  const labelledbyId = useId();

  const [isOpen, setIsOpen] = useControllableState({
    defaultValue: defaultOpen,
    value: isOpenProp,
    onChange: onOpenChange,
  });

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const { pressProps } = usePress({
    onPress: handleOpen,
  });

  const {
    base,
    container,
    wrapper,
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
    ...pressProps,
  });

  const dialogHTML = (
    <context.Provider
      value={{
        scopeName: SCOPE_NAME,
        handleClose,
      }}
    >
      <div className={container({ className: classNames?.container })}>
        <div className={backdrop({ className: classNames?.backdrop })}></div>

        <div className={wrapper({ className: classNames?.wrapper })}>
          <div
            ref={ref}
            role="dialog"
            aria-modal={modal}
            className={base({ className: classNames?.base })}
            aria-label={props["aria-label"]}
            aria-labelledby={header ? labelledbyId : props["aria-labelledby"]}
            aria-describedby={props["aria-describedby"]}
          >
            {header && (
              <div className={headerStyles({ className: classNames?.header })} id={labelledbyId}>
                {header}
              </div>
            )}
            {body && <div className={bodyStyles({ className: classNames?.body })}>{body}</div>}
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
  onCloseStart?: () => Promise<void> | void;
  onCloseEnd?: () => void;
}

export const DialogClose = (props: DialogCloseProps) => {
  const { children, onCloseStart, onCloseEnd } = props;

  const { handleClose, scopeName } = useContext(context);

  const { pressProps } = usePress({
    isDisabled: scopeName !== SCOPE_NAME,
    onPress: async () => {
      try {
        await onCloseStart?.();
        handleClose?.();
        onCloseEnd?.();
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
