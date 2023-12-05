import { Fragment, forwardRef, useCallback, useId, useRef, useState } from "react";
import * as Popper from "@gist-ui/popper";
import { CustomInputElement, Input, InputProps } from "@gist-ui/input";
import { SelectClassNames, SelectVariantProps, select } from "@gist-ui/theme";
import { mergeRefs } from "@gist-ui/react-utils";
import { Button } from "@gist-ui/button";
import omit from "lodash.omit";
import pick from "lodash.pick";
import { useControllableState } from "@gist-ui/use-controllable-state";
import { useClickOutside } from "@gist-ui/use-click-outside";
import { useFocusVisible } from "react-aria";

const caretDown = (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 16 10"
    style={{
      minWidth: 10,
      minHeight: 10,
    }}
  >
    <path d="M15.434 1.235A2 2 0 0 0 13.586 0H2.414A2 2 0 0 0 1 3.414L6.586 9a2 2 0 0 0 2.828 0L15 3.414a2 2 0 0 0 .434-2.179Z" />
  </svg>
);

export type SelectOption = {
  label: string;
  value: string;
};

// const keys: { [key in keyof Popper.FloatingProps]: undefined } = {};

const inputPropsKeys = [
  "a11yFeedback",
  "classNames",
  "color",
  "isDisabled",
  "endContent",
  "error",
  "errorMessage",
  "fullWidth",
  "helperText",
  "hideLabel",
  "id",
  "inputProps",
  "label",
  "labelPlacement",
  "name",
  "onBlur",
  "onFocus",
  "placeholder",
  "required",
  "rounded",
  "size",
  "startContent",
  "type",
  "variant",
  "onHoverChange",
  "onHoverEnd",
  "onHoverStart",
] as const;

const variantPropsKeys = select.variantKeys.filter((e) => e !== "rounded");

export interface SelectProps
  extends Omit<SelectVariantProps, "rounded">,
    Omit<InputProps, "defaultValue" | "value" | "onChange"> {
  listboxRounded?: SelectVariantProps["rounded"];
  /**
   * This prop value is use in `listbox` style.maxHeight
   *
   * @default "300px"
   */
  maxHeight?: number;
  listboxClassNames?: SelectClassNames;
  /**
   * @default "no options"
   */
  empltyText?: string;
  options?: SelectOption[];
  /**
   * This prop add distance between `Input` and listbox
   */
  offset?: Popper.FloatingProps["mainOffset"];
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * Used to determine the disabled state for a given option
   */
  getOptionDisabled?: (options: SelectOption) => boolean;
  /**
   * Used to determine the key for a given option. By default labels are used as keys
   */
  getOptionKey?: (options: SelectOption) => string;
  /**
   * by default `option.label` is used
   */
  getOptionLabel?: (options: SelectOption) => string;
  isOptionEqualToValue?: (option: SelectOption, value?: SelectOption) => boolean;
  defaultValue?: SelectOption;
  value?: SelectOption;
  onChange?: (e: { target: { value?: SelectOption } }) => void;
}

const Select = forwardRef<CustomInputElement, SelectProps>((_props, ref) => {
  const inputProps = pick(_props, ...inputPropsKeys);
  const variantProps = pick(_props, ...variantPropsKeys);
  const props = omit(_props, ...variantPropsKeys, ...inputPropsKeys);

  const {
    options,
    listboxClassNames,
    listboxRounded,
    offset,
    getOptionDisabled,
    isOpen: isOpenProp,
    onOpenChange,
    maxHeight = 300,
    empltyText = "no options",
    defaultOpen = false,
    defaultValue,
    value,
    onChange,
    getOptionKey,
    getOptionLabel,
    isOptionEqualToValue,
  } = props;

  const [isOpen, setIsOpen] = useControllableState({
    defaultValue: defaultOpen,
    value: isOpenProp,
    onChange: onOpenChange,
  });

  const [selected, setSelected] = useControllableState({
    defaultValue,
    value,
    onChange: (value) => {
      onChange?.({ target: { value: value || null } });
    },
  });

  const [inputWrapper, setInputWrapper] = useState<HTMLDivElement | null>(null);
  const inputFocused = useRef(inputProps.inputProps?.autoFocus || false);

  const lisboxId = useId();

  const { isFocusVisible } = useFocusVisible();

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;

      if (inputFocused.current && !isOpen) setIsOpen(true);
    },
    [isOpen, setIsOpen],
  );

  const handleFocus = useCallback(() => {
    inputFocused.current = true;

    if (!isFocusVisible) setIsOpen(true);
  }, [isFocusVisible, setIsOpen]);

  const handleBlur = useCallback(() => {
    inputFocused.current = false;

    if (isFocusVisible) setIsOpen(false);
  }, [isFocusVisible, setIsOpen]);

  const onSelect =
    ({ option, isDisabled }: { option: SelectOption; isDisabled?: boolean }) =>
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;

      if (isDisabled) return;

      setSelected(option);
    };

  const handleListboxToggle = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;

      if (!inputFocused.current) {
        inputWrapper?.focus();
      }

      setIsOpen((p) => !p);
    },
    [inputWrapper, setIsOpen],
  );

  const setOutsideEle = useClickOutside<HTMLDivElement>({
    isDisabled: !isOpen,
    onEvent: "pointerdown",
    callback: (e) => {
      if (inputWrapper?.contains(e.target as Node)) return;
      setIsOpen(false);
    },
  });

  const styles = select({ ...variantProps, rounded: listboxRounded, color: inputProps.color });

  return (
    <>
      <Input
        {...inputProps}
        ref={mergeRefs(ref, setInputWrapper)}
        value={(selected && (getOptionLabel ? getOptionLabel(selected) : selected.label)) || ""}
        onChange={() => {}}
        inputProps={{
          ...inputProps.inputProps,
          onPointerDown: handlePointerDown,
          "aria-expanded": isOpen,
          "aria-controls": lisboxId,
          "aria-haspopup": "listbox",
          role: "combobox",
          autoComplete: "off",
          readOnly: true,
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        endContent={
          <>
            <Button
              isIconOnly
              variant="text"
              size="sm"
              rounded="full"
              aria-label="toggle listbox"
              asChild
              style={{ cursor: "pointer", rotate: isOpen ? "180deg" : "0deg" }}
              onPointerUp={handleListboxToggle}
            >
              <div>{caretDown}</div>
            </Button>

            {inputProps.endContent}
          </>
        }
      />

      <Popper.Root>
        <Popper.Reference virturalElement={inputWrapper} />

        {isOpen && (
          <Popper.Floating sticky="always" mainOffset={offset || 5}>
            <div
              ref={setOutsideEle}
              id={lisboxId}
              className={styles.listbox({ className: listboxClassNames?.listbox })}
              role="listbox"
              aria-activedescendant=""
              aria-roledescription="select one" // TODO: make it correct according to select/multiselect
              style={{ maxHeight }}
            >
              {options?.length ? (
                options.map((option, i) => {
                  const key = getOptionKey ? getOptionKey(option) : option.label;
                  const isDisabled = getOptionDisabled?.(option);
                  const isSelected = isOptionEqualToValue
                    ? isOptionEqualToValue(option, selected)
                    : selected === option;

                  return (
                    <Fragment key={key}>
                      <div
                        data-disabled={isDisabled}
                        data-selected={isSelected}
                        role="option"
                        className={styles.option({ className: listboxClassNames?.option })}
                        aria-checked={isDisabled ? undefined : isSelected}
                        onPointerUp={isDisabled ? undefined : onSelect({ option, isDisabled })}
                      >
                        {<span>{getOptionLabel ? getOptionLabel(option) : option.label}</span>}
                      </div>

                      {i + 1 !== options.length && (
                        <div
                          className={styles.optionSeperator({
                            className: listboxClassNames?.optionSeperator,
                          })}
                        />
                      )}
                    </Fragment>
                  );
                })
              ) : (
                <div className={styles.emptyText({ className: listboxClassNames?.emptyText })}>
                  {empltyText}
                </div>
              )}
            </div>
          </Popper.Floating>
        )}
      </Popper.Root>
    </>
  );
});

Select.displayName = "gist-ui.Select";

export default Select;
