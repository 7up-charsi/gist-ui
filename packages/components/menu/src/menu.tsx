import { createContextScope } from '@gist-ui/context';
import { Slot } from '@gist-ui/slot';
import * as Popper from '@gist-ui/popper';
import { useControllableState } from '@gist-ui/use-controllable-state';
import { useCallbackRef } from '@gist-ui/use-callback-ref';
import { useClickOutside } from '@gist-ui/use-click-outside';
import { PressEvents, useHover, usePress } from '@react-aria/interactions';
import { useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import { mergeProps } from '@gist-ui/react-utils';
import { useRipple } from '@gist-ui/use-ripple';
import { MenuVariantProps, menu } from '@gist-ui/theme';
import { ClassValue } from 'tailwind-variants';

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

  const context = useRootContext(Trigger_Name);

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

  const context = useRootContext(Close_Name);

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
  const context = useRootContext(Portal_Name);

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

  const context = useRootContext(Menu_Name);

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

// *-*-*-*-* Item *-*-*-*-*

const Item_Name = 'Menu.Item';

export interface ItemProps {
  children?: React.ReactNode;
  isDisabled?: boolean;
  disableCloseOnPress?: boolean;
  onPress?: PressEvents['onPress'];
  className?: ClassValue;
}

export const Item = (props: ItemProps) => {
  const {
    children,
    isDisabled,
    onPress: onPressProp,
    disableCloseOnPress,
    className,
  } = props;

  const context = useRootContext(Item_Name);
  const stylesContext = useStylesContext(Item_Name);

  const onPress = useCallbackRef(onPressProp);

  const { pressProps, isPressed } = usePress({
    isDisabled,
    onPress: (e) => {
      if (!disableCloseOnPress) context.handleClose();
      onPress(e);
    },
  });

  const { hoverProps, isHovered } = useHover({ isDisabled });

  return (
    <li
      role="menuitem"
      data-pressed={isPressed}
      data-hovered={isHovered}
      data-disabled={!!isDisabled}
      aria-disabled={isDisabled}
      {...mergeProps(pressProps, hoverProps)}
      className={stylesContext.item({ className })}
    >
      <span></span>
      {children}
    </li>
  );
};

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
  /**
   * @default true
   */
  disableCloseOnPress?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: ClassValue;
}

export const CheckboxItem = (props: CheckboxItemProps) => {
  const {
    children,
    isDisabled,
    disableCloseOnPress = true,
    className,
    checked,
    onChange,
  } = props;

  const context = useRootContext(CheckboxItem_Name);
  const stylesContext = useStylesContext(CheckboxItem_Name);

  const { pressProps, isPressed } = usePress({
    isDisabled,
    onPress: () => {
      if (!disableCloseOnPress) context.handleClose();
      onChange?.(!checked);
    },
  });

  const { hoverProps, isHovered } = useHover({ isDisabled });

  const { rippleProps } = useRipple({ isDisabled });

  return (
    <li
      role="menuitemcheckbox"
      data-pressed={isPressed}
      data-hovered={isHovered}
      data-disabled={!!isDisabled}
      data-checked={checked}
      aria-checked={checked}
      aria-disabled={isDisabled}
      {...mergeProps(rippleProps, pressProps, hoverProps)}
      className={stylesContext.item({ className })}
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
    </li>
  );
};

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
  const { children, onChange, value, accessibleLabel, className } = props;

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
  /**
   * @default true
   */
  disableCloseOnPress?: boolean;
  value: string;
  className?: ClassValue;
}

export const RadioItem = (props: RadioItemProps) => {
  const {
    children,
    isDisabled,
    disableCloseOnPress = true,
    className,
    value,
  } = props;

  const context = useRootContext(RadioItem_Name);
  const stylesContext = useStylesContext(RadioItem_Name);
  const groupContext = useRadioGroupContext(RadioItem_Name);

  const { pressProps, isPressed } = usePress({
    isDisabled,
    onPress: () => {
      if (!disableCloseOnPress) context.handleClose();
      groupContext.onChange?.(value);
    },
  });

  const { hoverProps, isHovered } = useHover({ isDisabled });

  const { rippleProps } = useRipple({ isDisabled });

  const checked = value === groupContext.value;

  return (
    <li
      role="menuitemradio"
      data-pressed={isPressed}
      data-hovered={isHovered}
      data-disabled={!!isDisabled}
      data-checked={checked}
      aria-checked={checked}
      aria-disabled={isDisabled}
      {...mergeProps(rippleProps, pressProps, hoverProps)}
      className={stylesContext.item({ className })}
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
    </li>
  );
};

RadioItem.displayName = 'gist-ui.' + RadioItem_Name;
