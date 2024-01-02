import { createContextScope } from '@gist-ui/context';
import { Slot } from '@gist-ui/slot';
import * as Popper from '@gist-ui/popper';
import { useControllableState } from '@gist-ui/use-controllable-state';
import { useCallbackRef } from '@gist-ui/use-callback-ref';
import { useClickOutside } from '@gist-ui/use-click-outside';
import {
  HoverEvents,
  PressEvents,
  useHover,
  usePress,
} from '@react-aria/interactions';
import { useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import { mergeProps } from '@gist-ui/react-utils';
import { MenuVariantProps, menu } from '@gist-ui/theme';
import { ClassValue } from 'tailwind-variants';

const Root_Name = 'Menu.Root';

interface MenuContext {
  open: boolean;
  handleOpen(): void;
  handleClose(): void;
  id: string;
}

const [Provider, useContext] = createContextScope<MenuContext>(Root_Name);

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
    <Provider
      handleOpen={handleOpen}
      handleClose={handleClose}
      open={open}
      id={id}
    >
      <Popper.Root>{children}</Popper.Root>
    </Provider>
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

  const context = useContext(Trigger_Name);

  const { pressProps } = usePress({
    onPress: context.handleOpen,
  });

  return (
    <Popper.Reference>
      <Slot
        role="button"
        aria-haspopup="menu"
        aria-expanded={context.open}
        aria-controls={context.open ? context.id : undefined}
        {...pressProps}
      >
        {children}
      </Slot>
    </Popper.Reference>
  );
};

Trigger.displayName = 'gist-ui.' + Trigger_Name;

// *-*-*-*-* Close *-*-*-*-*

const Close_Name = 'Menu.Close';

export interface CloseProps {
  children: React.ReactNode;
}

export const Close = (props: CloseProps) => {
  const { children } = props;

  const context = useContext(Close_Name);

  const { pressProps } = usePress({ onPress: context.handleClose });

  return <Slot {...pressProps}>{children}</Slot>;
};

Close.displayName = 'gist-ui.' + Close_Name;

// *-*-*-*-* Portal *-*-*-*-*

const Portal_Name = 'Menu.Portal';

export interface PortalProps {
  children?: React.ReactNode;
  container?: Element;
}

export const Portal = ({ children, container }: PortalProps) => {
  const context = useContext(Portal_Name);

  return (
    <>{context.open && createPortal(children, container || document.body)}</>
  );
};

Portal.displayName = 'gist-ui.' + Portal_Name;

// *-*-*-*-* Menu *-*-*-*-*

const Menu_Name = 'Menu.Menu';

const [StylesProvider, useStylesContext] =
  createContextScope<ReturnType<typeof menu>>(Menu_Name);

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

  const context = useContext(Menu_Name);

  const setOutsideEle = useClickOutside<HTMLUListElement>({
    isDisabled: !context.open,
    callback: context.handleClose,
  });

  const styles = menu({ shadow });

  return (
    <Popper.Floating arrowPadding={arrowPadding} {...restProps}>
      <ul
        id={context.id}
        role="menu"
        ref={setOutsideEle}
        className={styles.menu({ className })}
      >
        <StylesProvider {...styles}>{children}</StylesProvider>
      </ul>
    </Popper.Floating>
  );
};

Menu.displayName = 'gist-ui.' + Menu_Name;

// *-*-*-*-* MenuItem *-*-*-*-*

const MenuItem_Name = 'Menu.MenuItem';

export interface MenuItemProps extends PressEvents, HoverEvents {
  children?: React.ReactNode;
  isDisabled?: boolean;
  disableCloseOnPress?: boolean;
  className?: ClassValue;
}

export const MenuItem = (props: MenuItemProps) => {
  const {
    children,
    isDisabled,
    onHoverChange: onHoverChangeProp,
    onHoverEnd: onHoverEndProp,
    onHoverStart: onHoverStartProp,
    onPress: onPressProp,
    onPressChange: onPressChangeProp,
    onPressEnd: onPressEndProp,
    onPressStart: onPressStartProp,
    onPressUp: onPressUpProp,
    disableCloseOnPress,
  } = props;

  const context = useContext(MenuItem_Name);
  const stylesContext = useStylesContext(MenuItem_Name);

  const onHoverChange = useCallbackRef(onHoverChangeProp);
  const onHoverEnd = useCallbackRef(onHoverEndProp);
  const onHoverStart = useCallbackRef(onHoverStartProp);
  const onPress = useCallbackRef(onPressProp);
  const onPressChange = useCallbackRef(onPressChangeProp);
  const onPressEnd = useCallbackRef(onPressEndProp);
  const onPressStart = useCallbackRef(onPressStartProp);
  const onPressUp = useCallbackRef(onPressUpProp);

  const { pressProps, isPressed } = usePress({
    isDisabled,
    onPress: (e) => {
      if (!disableCloseOnPress) context.handleClose();
      onPress(e);
    },
    onPressChange,
    onPressEnd,
    onPressStart,
    onPressUp,
  });

  const { hoverProps, isHovered } = useHover({
    isDisabled,
    onHoverChange,
    onHoverEnd,
    onHoverStart,
  });

  return (
    <li
      role="menuitem"
      data-pressed={isPressed}
      data-hovered={isHovered}
      {...mergeProps(pressProps, hoverProps)}
      className={stylesContext.menuItem({})}
    >
      {children}
    </li>
  );
};

MenuItem.displayName = 'gist-ui.' + MenuItem_Name;

// *-*-*-*-* GroupTitle *-*-*-*-*

const GroupTitle_Name = 'Menu.GroupTitle';

export interface GroupTitleProps {
  children?: React.ReactNode;
  className?: ClassValue;
}

export const GroupTitle = (props: GroupTitleProps) => {
  const { children, className } = props;

  const stylesContext = useStylesContext(Group_Name);

  return (
    <div className={stylesContext.groupTitle({ className })}>
      <span>{children}</span>
    </div>
  );
};

GroupTitle.displayName = 'gist-ui.' + GroupTitle_Name;

// *-*-*-*-* Group *-*-*-*-*

const Group_Name = 'Menu.Group';

export interface GroupProps {
  children?: React.ReactNode;
  className?: ClassValue;
  name: string;
}

export const Group = (props: GroupProps) => {
  const { children, className, name } = props;

  const stylesContext = useStylesContext(Group_Name);

  return (
    <li role="none">
      <ul
        role="group"
        aria-label={name}
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
