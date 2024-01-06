import { createContextScope } from '@gist-ui/context';
import { Slot } from '@gist-ui/slot';
import * as Popper from '@gist-ui/popper';
import { useControllableState } from '@gist-ui/use-controllable-state';
import { useClickOutside } from '@gist-ui/use-click-outside';
import { useFocusVisible, useHover, usePress } from '@react-aria/interactions';
import { createPortal } from 'react-dom';
import { mergeProps, mergeRefs } from '@gist-ui/react-utils';
import { useRipple } from '@gist-ui/use-ripple';
import { MenuVariantProps, menu } from '@gist-ui/theme';
import { ClassValue } from 'tailwind-variants';
import { useScrollLock } from '@gist-ui/use-scroll-lock';
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { useCallbackRef } from '@gist-ui/use-callback-ref';

const Root_Name = 'Menu.Root';

interface RootContext {
  open: boolean;
  handleOpen(): void;
  handleClose(): void;
  id: string;
}

const [RootProvider, useRootContext] =
  createContextScope<RootContext>(Root_Name);

// *-*-*-*-* Root *-*-*-*-*

export interface RootProps {
  children?: React.ReactNode;
  defaultOpen: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const Root = (props: RootProps) => {
  const { children, defaultOpen, open: openProp, onOpenChange } = props;

  const [open, setOpen] = useControllableState({
    defaultValue: defaultOpen,
    value: openProp,
    onChange: onOpenChange,
  });

  const id = useId();

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <RootProvider
      handleOpen={handleOpen}
      handleClose={handleClose}
      open={open}
      id={id}
    >
      <Popper.Root>{children}</Popper.Root>
    </RootProvider>
  );
};

Root.displayName = 'gist-ui.' + Root_Name;

// *-*-*-*-* Trigger *-*-*-*-*

const Trigger_Name = 'Menu.Trigger';

export interface TriggerProps {
  children?: React.ReactNode;
}

export const Trigger = (props: TriggerProps) => {
  const { children } = props;

  const rootContext = useRootContext(Trigger_Name);

  const { pressProps } = usePress({
    onPress: rootContext.handleOpen,
  });

  return (
    <Popper.Reference>
      <Slot
        role="button"
        aria-haspopup="menu"
        aria-expanded={rootContext.open}
        aria-controls={rootContext.open ? rootContext.id : undefined}
        {...pressProps}
      >
        {children}
      </Slot>
    </Popper.Reference>
  );
};

Trigger.displayName = 'gist-ui.' + Trigger_Name;

// *-*-*-*-* Portal *-*-*-*-*

const Portal_Name = 'Menu.Portal';

export interface PortalProps {
  children?: React.ReactNode;
  container?: Element;
}

export const Portal = ({ children, container }: PortalProps) => {
  const rootContext = useRootContext(Portal_Name);

  return (
    <>
      {rootContext.open && createPortal(children, container || document.body)}
    </>
  );
};

Portal.displayName = 'gist-ui.' + Portal_Name;

// *-*-*-*-* Menu *-*-*-*-*

const Menu_Name = 'Menu.Menu';

type FocusableItem = { type: string; callback?: () => void };

interface FocusContext {
  items: FocusableItem[];
  setItems: React.Dispatch<React.SetStateAction<FocusableItem[]>>;
  setFocusedItem: React.Dispatch<React.SetStateAction<FocusableItem | null>>;
  focusedItem: FocusableItem | null;
  isFocusVisible: boolean;
}

const [StylesProvider, useStylesContext] =
  createContextScope<ReturnType<typeof menu>>(Menu_Name);

const [FocusProvider, useFocusContext] =
  createContextScope<FocusContext>(Menu_Name);

export interface MenuProps extends Popper.FloatingProps, MenuVariantProps {
  children?: React.ReactNode;
  className?: ClassValue;
}

export const Menu = (props: MenuProps) => {
  const {
    children,
    className,
    shadow,
    arrowPadding = 10,
    ...restProps
  } = props;

  const rootContext = useRootContext(Menu_Name);

  const [items, setItems] = useState<FocusableItem[]>([]);
  const [focusedItem, setFocusedItem] = useState<FocusableItem | null>(null);

  const { isFocusVisible } = useFocusVisible();

  const setOutsideEle = useClickOutside<HTMLUListElement>({
    isDisabled: !rootContext.open,
    callback: rootContext.handleClose,
  });

  useScrollLock({ enabled: true });

  const handleClose = rootContext.handleClose;

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const Tab = e.key === 'Tab';
      const ArrowDown = e.key === 'ArrowDown';
      const ArrowUp = e.key === 'ArrowUp';
      const Home = e.key === 'Home';
      const End = e.key === 'End';
      const Escape = e.key === 'Escape';
      const Enter = e.key === 'Enter';
      const Space = e.key === ' ';

      if (Enter || Space) {
        e.preventDefault();
        focusedItem?.callback?.();
        return;
      }

      if (Escape) {
        setFocusedItem(null);
        handleClose();
        return;
      }

      if (Tab) {
        handleClose();
        return;
      }

      if (ArrowDown) {
        if (!focusedItem) {
          setFocusedItem(items[0]);
          return;
        }

        if (focusedItem) {
          const index = items.indexOf(focusedItem);
          if (index !== items.length - 1) setFocusedItem(items[index + 1]);
          return;
        }
      }

      if (ArrowUp) {
        if (!focusedItem) {
          setFocusedItem(items[0]);
          return;
        }

        if (focusedItem) {
          const index = items.indexOf(focusedItem);
          if (index !== 0) setFocusedItem(items[index - 1]);
          return;
        }
      }

      if (Home) {
        setFocusedItem(items[0]);
        return;
      }

      if (End) {
        setFocusedItem(items[items.length - 1]);
        return;
      }
    },
    [focusedItem, handleClose, items],
  );

  const styles = menu({ shadow });

  return (
    <Popper.Floating arrowPadding={arrowPadding} {...restProps}>
      <ul
        id={rootContext.id}
        role="menu"
        ref={setOutsideEle}
        className={styles.menu({ className })}
        onKeyDown={onKeyDown}
      >
        <FocusProvider
          items={items}
          setItems={setItems}
          focusedItem={focusedItem}
          setFocusedItem={setFocusedItem}
          isFocusVisible={isFocusVisible}
        >
          <StylesProvider {...styles}>{children}</StylesProvider>
        </FocusProvider>
      </ul>
    </Popper.Floating>
  );
};

Menu.displayName = 'gist-ui.' + Menu_Name;

// *-*-*-*-* Item *-*-*-*-*

const Item_Name = 'Menu.Item';

export interface ItemProps {
  children?: React.ReactNode;
  isDisabled?: boolean;
  disableCloseOnPress?: boolean;
  className?: ClassValue;
  onPress?: () => void;
  asChild?: boolean;
}

export const Item = forwardRef<HTMLLIElement, ItemProps>((props, ref) => {
  const {
    children,
    isDisabled,
    onPress,
    disableCloseOnPress,
    className,
    asChild,
  } = props;

  const { handleClose } = useRootContext(Item_Name);
  const stylesContext = useStylesContext(Item_Name);
  const { isFocusVisible, items, setFocusedItem, setItems, focusedItem } =
    useFocusContext(Item_Name);

  const focusRef = useRef<FocusableItem>({ type: 'item' }).current;

  const innerRef = useRef<HTMLLIElement>(null);

  const { hoverProps, isHovered } = useHover({ isDisabled });

  const handleOnPress = useCallback(() => {
    if (!disableCloseOnPress) handleClose();
    onPress?.();
  }, [disableCloseOnPress, handleClose, onPress]);

  useEffect(() => {
    focusRef.callback = handleOnPress;
  }, [focusRef, handleOnPress]);

  useEffect(() => {
    if (isDisabled) return;

    setItems((prev) => [...prev, focusRef]);
    () => {
      setItems((prev) => prev.filter((ele) => ele !== focusRef));
    };
  }, [focusRef, isDisabled, setItems]);

  const tabIndex = items[0] === focusRef ? 0 : -1;

  useEffect(() => {
    if (isFocusVisible && tabIndex === 0) {
      setFocusedItem(focusRef);
      innerRef.current?.focus();
    }

    return () => {
      if (tabIndex === 0) setFocusedItem(null);
    };
  }, [focusRef, isFocusVisible, setFocusedItem, tabIndex]);

  const Component = asChild ? Slot : 'li';

  return (
    <Component
      ref={mergeRefs(ref, innerRef)}
      role="menuitem"
      data-hovered={isHovered}
      data-focused={focusedItem === focusRef}
      data-disabled={!!isDisabled}
      aria-disabled={isDisabled}
      className={stylesContext.item({ className })}
      tabIndex={tabIndex}
      {...mergeProps(hoverProps, { onPointerUp: handleOnPress })}
    >
      <span></span>
      {children}
    </Component>
  );
});

Item.displayName = 'gist-ui.' + Item_Name;

// *-*-*-*-* Group *-*-*-*-*

const Label_Name = 'Menu.Label';

export interface LabelProps {
  children?: React.ReactNode;
  className?: ClassValue;
}

export const Label = (props: LabelProps) => {
  const { children, className } = props;

  const stylesContext = useStylesContext(Label_Name);

  return (
    <li role="none" className={stylesContext.label({ className })}>
      {children}
    </li>
  );
};

Label.displayName = 'gist-ui.' + Label_Name;

// *-*-*-*-* Group *-*-*-*-*

const Group_Name = 'Menu.Group';

export interface GroupProps {
  children?: React.ReactNode;
  className?: ClassValue;
  accessibleLabel?: string;
}

export const Group = (props: GroupProps) => {
  const { children, className, accessibleLabel } = props;

  const stylesContext = useStylesContext(Group_Name);

  return (
    <li role="none">
      <ul
        role="group"
        aria-label={accessibleLabel}
        className={stylesContext.group({ className })}
      >
        {children}
      </ul>
    </li>
  );
};

Group.displayName = 'gist-ui.' + Group_Name;

// *-*-*-*-* Separator *-*-*-*-*

const Separator_Name = 'Menu.Separator';

export interface SeparatorProps {
  className?: ClassValue;
}

export const Separator = (props: SeparatorProps) => {
  const { className } = props;

  const stylesContext = useStylesContext(Separator_Name);

  return (
    <div
      role="separator"
      className={stylesContext.separator({ className })}
    ></div>
  );
};

Separator.displayName = 'gist-ui.' + Separator_Name;

// *-*-*-*-* CheckboxItem *-*-*-*-*

const CheckboxItem_Name = 'Menu.CheckboxItem';

export interface CheckboxItemProps {
  children?: React.ReactNode;
  isDisabled?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: ClassValue;
  asChild?: boolean;
}

export const CheckboxItem = forwardRef<HTMLLIElement, CheckboxItemProps>(
  (props, ref) => {
    const { children, isDisabled, className, checked, onChange, asChild } =
      props;

    const stylesContext = useStylesContext(CheckboxItem_Name);
    const { isFocusVisible, items, setFocusedItem, setItems, focusedItem } =
      useFocusContext(Item_Name);

    const focusRef = useRef<FocusableItem>({ type: 'checkbox' }).current;

    const innerRef = useRef<HTMLLIElement>(null);

    const { hoverProps, isHovered } = useHover({ isDisabled });

    const { rippleProps } = useRipple({ isDisabled });

    const handleOnChange = useCallback(() => {
      onChange?.(!checked);
    }, [checked, onChange]);

    useEffect(() => {
      focusRef.callback = handleOnChange;
    }, [focusRef, handleOnChange]);

    useEffect(() => {
      if (isDisabled) return;

      setItems((prev) => [...prev, focusRef]);
      () => {
        setItems((prev) => prev.filter((ele) => ele !== focusRef));
      };
    }, [focusRef, isDisabled, setItems]);

    const tabIndex = items[0] === focusRef ? 0 : -1;

    useEffect(() => {
      if (isFocusVisible && tabIndex === 0) {
        setFocusedItem(focusRef);
        innerRef.current?.focus();
      }

      return () => {
        if (tabIndex === 0) setFocusedItem(null);
      };
    }, [focusRef, isFocusVisible, setFocusedItem, tabIndex]);

    const Component = asChild ? Slot : 'li';

    return (
      <Component
        ref={mergeRefs(ref, innerRef)}
        role="menuitemcheckbox"
        data-hovered={isHovered}
        data-focused={focusedItem === focusRef}
        data-disabled={!!isDisabled}
        data-checked={checked}
        aria-checked={checked}
        aria-disabled={isDisabled}
        className={stylesContext.item({ className })}
        tabIndex={tabIndex}
        {...mergeProps(rippleProps, hoverProps, {
          onPointerUp: handleOnChange,
        })}
      >
        <span>
          {!checked ? null : (
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 16 12"
              style={{ height: 11, width: 11 }}
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5.917 5.724 10.5 15 1.5"
              />
            </svg>
          )}
        </span>

        {children}
      </Component>
    );
  },
);

CheckboxItem.displayName = 'gist-ui.' + CheckboxItem_Name;

// *-*-*-*-* RadioGroup *-*-*-*-*

const RadioGroup_Name = 'Menu.RadioGroup';

interface RadioGroupContext {
  onChange?: (value: string) => void;
  value?: string;
}

const [RadioGroupProvider, useRadioGroupContext] =
  createContextScope<RadioGroupContext>(RadioGroup_Name);

export interface RadioGroupProps extends GroupProps {
  children?: React.ReactNode;
  onChange?: (value: string) => void;
  value?: string;
}

export const RadioGroup = (props: RadioGroupProps) => {
  const {
    children,
    onChange: onChangeProp,
    value,
    accessibleLabel,
    className,
  } = props;

  const onChange = useCallbackRef(onChangeProp);

  return (
    <RadioGroupProvider onChange={onChange} value={value}>
      <Group accessibleLabel={accessibleLabel} className={className}>
        {children}
      </Group>
    </RadioGroupProvider>
  );
};

RadioGroup.displayName = 'gist-ui.' + RadioGroup_Name;

// *-*-*-*-* RadioItem *-*-*-*-*

const RadioItem_Name = 'Menu.RadioItem';

export interface RadioItemProps {
  children?: React.ReactNode;
  isDisabled?: boolean;
  value: string;
  className?: ClassValue;
  asChild?: boolean;
}

export const RadioItem = forwardRef<HTMLLIElement, RadioItemProps>(
  (props, ref) => {
    const { children, isDisabled, className, value, asChild } = props;

    const stylesContext = useStylesContext(RadioItem_Name);
    const groupContext = useRadioGroupContext(RadioItem_Name);
    const { isFocusVisible, items, setFocusedItem, setItems, focusedItem } =
      useFocusContext(Item_Name);

    const focusRef = useRef<FocusableItem>({ type: 'radio' }).current;

    const innerRef = useRef<HTMLLIElement>(null);

    const { hoverProps, isHovered } = useHover({ isDisabled });

    const { rippleProps } = useRipple({ isDisabled });

    const groupContextOnChange = groupContext.onChange;

    const handleOnChange = useCallback(() => {
      groupContextOnChange?.(value);
    }, [groupContextOnChange, value]);

    useEffect(() => {
      focusRef.callback = handleOnChange;
    }, [focusRef, handleOnChange]);

    useEffect(() => {
      if (isDisabled) return;

      setItems((prev) => [...prev, focusRef]);
      () => {
        setItems((prev) => prev.filter((ele) => ele !== focusRef));
      };
    }, [focusRef, isDisabled, setItems]);

    const tabIndex = items[0] === focusRef ? 0 : -1;

    useEffect(() => {
      if (isFocusVisible && tabIndex === 0) {
        setFocusedItem(focusRef);
        innerRef.current?.focus();
      }

      return () => {
        if (tabIndex === 0) setFocusedItem(null);
      };
    }, [focusRef, isFocusVisible, setFocusedItem, tabIndex]);

    const checked = value === groupContext.value;

    const Component = asChild ? Slot : 'li';

    return (
      <Component
        ref={mergeRefs(ref, innerRef)}
        role="menuitemradio"
        data-hovered={isHovered}
        data-focused={focusedItem === focusRef}
        data-disabled={!!isDisabled}
        data-checked={checked}
        aria-checked={checked}
        aria-disabled={isDisabled}
        className={stylesContext.item({ className })}
        tabIndex={tabIndex}
        {...mergeProps(rippleProps, hoverProps, {
          onPointerUp: handleOnChange,
        })}
      >
        <span>
          {!checked ? null : (
            <svg
              viewBox="0 0 512 512"
              fill="currentColor"
              style={{ width: 6, height: 6 }}
            >
              <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0 0 114.6 0 256s114.6 256 256 256zm0-160c-53" />
            </svg>
          )}
        </span>

        {children}
      </Component>
    );
  },
);

RadioItem.displayName = 'gist-ui.' + RadioItem_Name;
