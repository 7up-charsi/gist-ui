import { ReactNode, forwardRef, useState } from 'react';
import Input, { InputProps } from './input';
import { Button } from '@gist-ui/button';
import { Icon } from '@gist-ui/icon';

export interface PasswordInputProps extends Omit<InputProps, 'type'> {
  /**
   * This prop value is used in `aria-label` of ToggleButton when it is not in pressed state
   */
  showAriaLabel?: string;
  /**
   * This prop value is used in `aria-label` of ToggleButton when it is in pressed state
   */
  hideAriaLabel?: string;
  showIcon?: ReactNode;
  hideIcon?: ReactNode;
}

const PasswordInput = forwardRef<HTMLDivElement, PasswordInputProps>(
  (props, ref) => {
    const {
      showIcon,
      hideIcon,
      label,
      hideAriaLabel = `hide ${label}`,
      showAriaLabel = `show ${label}`,
      ...rest
    } = props;

    const [isPassword, setIsPassword] = useState(true);

    const toggleButton = (
      <Button
        type="button"
        isIconOnly
        size="sm"
        rounded="full"
        variant="text"
        aria-label={isPassword ? showAriaLabel : hideAriaLabel}
        aria-pressed={isPassword}
        onPress={() => {
          setIsPassword((p) => !p);
        }}
      >
        {isPassword
          ? showIcon || (
              <Icon>
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 14"
                >
                  <g
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  >
                    <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path d="M10 13c4.97 0 9-2.686 9-6s-4.03-6-9-6-9 2.686-9 6 4.03 6 9 6Z" />
                  </g>
                </svg>
              </Icon>
            )
          : hideIcon || (
              <Icon>
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 18"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1.933 10.909A4.357 4.357 0 0 1 1 9c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 19 9c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M2 17 18 1m-5 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </Icon>
            )}
      </Button>
    );

    return (
      <Input
        ref={ref}
        {...rest}
        label={label}
        type={isPassword ? 'password' : 'text'}
        endContent={toggleButton}
      />
    );
  },
);

PasswordInput.displayName = 'gist-ui.PasswordInput';

export default PasswordInput;
