import { forwardRef, LegacyRef, ReactNode, useRef } from "react";
import { ButtonVariantProps, iconButton } from "@gist-ui/theme";
import { useRipple, UseRippleProps } from "@gist-ui/use-ripple";
import { mergeRefs } from "@gist-ui/react-utils";
import { AriaButtonOptions, mergeProps, useButton, useFocusRing, useHover } from "react-aria";
import { IconContext } from "@gist-ui/icon";

export interface IconButtonProps extends ButtonVariantProps, AriaButtonOptions<"button"> {
  rippleProps?: UseRippleProps;
  className?: string;
  children?: ReactNode;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
  const { rippleProps, className, color, isDisabled, size, variant } = props;

  const { base } = iconButton({
    color,
    isDisabled,
    size,
    variant,
  });

  const innerRef = useRef<HTMLButtonElement>(null);

  const [rippleRef, rippleEvent] = useRipple<HTMLButtonElement>({
    ...rippleProps,
    pointerCenter: false,
    duration: 400,
  });

  const { buttonProps } = useButton(props, innerRef);

  const { focusProps, isFocusVisible, isFocused } = useFocusRing();
  const { hoverProps, isHovered } = useHover(props);

  return (
    <IconContext.Provider value={{ size }}>
      <button
        data-hovered={isHovered}
        data-focused={isFocused}
        data-focus-visible={isFocusVisible}
        {...buttonProps}
        ref={mergeRefs(ref, rippleRef, innerRef) as LegacyRef<HTMLButtonElement>}
        {...mergeProps({ onPointerDown: rippleEvent }, buttonProps, focusProps, hoverProps)}
        className={base({ className })}
      >
        {props.children}
      </button>
    </IconContext.Provider>
  );
});

IconButton.displayName = "gist-ui.IconButton";

export default IconButton;
