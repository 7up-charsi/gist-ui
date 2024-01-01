import { createContextScope } from '@gist-ui/context';
import { Slot } from '@gist-ui/slot';
import * as Popper from '@gist-ui/popper';
import { useControllableState } from '@gist-ui/use-controllable-state';
import { useClickOutside } from '@gist-ui/use-click-outside';
import { usePress } from '@react-aria/interactions';
import { useCallback, useId } from 'react';
import { createPortal } from 'react-dom';

const Menu_Name = 'Menu.Root';

interface MenuContext {
  open: boolean;
  handleOpen(): void;
  handleClose(): void;
  id: string;
}

const [Provider, useContext] = createContextScope<MenuContext>(Menu_Name);

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

Root.displayName = 'gist-ui.' + Menu_Name;

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

// *-*-*-*-* Content *-*-*-*-*

const Content_Name = 'Menu.Content';

export interface ContentProps extends Popper.FloatingProps {
  children?: React.ReactNode;
}

export const Content = (props: ContentProps) => {
  const { children, ...restProps } = props;

  const context = useContext(Content_Name);

  const setOutsideEle = useClickOutside<HTMLUListElement>({
    isDisabled: !context.open,
    callback: context.handleClose,
  });

  return (
    <Popper.Floating {...restProps}>
      <ul id={context.id} role="menu" ref={setOutsideEle}>
        {children}
      </ul>
    </Popper.Floating>
  );
};

Content.displayName = 'gist-ui.' + Content_Name;
