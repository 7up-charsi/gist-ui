import { forwardRef } from "react";
import { SpinButtonVariantProps, spinButton } from "@gist-ui/theme";
import { Button } from "@gist-ui/button";
import { Icon } from "@gist-ui/icon";

type ClassNames = { [key in keyof typeof spinButton.slots]?: string };

export interface SpinButtonProps extends SpinButtonVariantProps {
  classNames?: ClassNames;
}

const SpinButton = forwardRef<HTMLDivElement, SpinButtonProps>((props, ref) => {
  const { classNames } = props;

  const { base, button, icon } = spinButton({});

  return (
    <div ref={ref} className={base({ className: classNames?.base })}>
      {/* step up */}
      <Button
        isIconOnly
        size="sm"
        variant="text"
        rounded="none"
        className={button({ className: classNames?.button })}
      >
        <Icon fill className={icon({ className: classNames?.icon })}>
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10">
            <path d="M9.207 1A2 2 0 0 0 6.38 1L.793 6.586A2 2 0 0 0 2.207 10H13.38a2 2 0 0 0 1.414-3.414L9.207 1Z" />
          </svg>
        </Icon>
      </Button>

      {/* step down */}
      <Button
        isIconOnly
        size="sm"
        variant="text"
        rounded="none"
        className={button({ className: classNames?.button })}
      >
        <Icon fill className={icon({ className: classNames?.icon })}>
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10">
            <path d="M15.434 1.235A2 2 0 0 0 13.586 0H2.414A2 2 0 0 0 1 3.414L6.586 9a2 2 0 0 0 2.828 0L15 3.414a2 2 0 0 0 .434-2.179Z" />
          </svg>
        </Icon>
      </Button>
    </div>
  );
});

SpinButton.displayName = "gist-ui.SpinButton";

export default SpinButton;
