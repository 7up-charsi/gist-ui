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
import { Option } from "./option";
import { GistUiError } from "@gist-ui/error";
import { v4 as uuidv4 } from "uuid";
import {
  Fragment,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

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

const closeIcon = (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
    />
  </svg>
);

export interface onSelectProps {
  option: InternalSelectOption;
  isDisabled: boolean;
  index: number;
}

export type SelectOption = {
  label: string;
  value: string;
};

export type InternalSelectOption = {
  label: string;
  value: string;
  id: string;
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
  isOptionEqualToValue?: (option: SelectOption, value?: SelectOption | null) => boolean;
  defaultValue?: SelectOption;
  value?: SelectOption | null;
  onChange?: (e: { target: { value?: SelectOption | null } }) => void;
}

const Select = forwardRef<CustomInputElement, SelectProps>((_props, ref) => {
  const { isDisabled, ...inputProps } = pick(_props, ...inputPropsKeys);
  const variantProps = pick(_props, ...variantPropsKeys);
  const props = omit(_props, ...variantPropsKeys, ...inputPropsKeys);

  const {
    options: optionsProp,
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
    value: valueProp,
    onChange,
    getOptionKey,
    getOptionLabel,
    isOptionEqualToValue,
  } = props;

  const options = useMemo(
    () => optionsProp?.map((ele) => ({ ...ele, id: uuidv4() })),
    [optionsProp],
  );

  const [focused, setFocused] = useState<{
    option: SelectOption;
    index: number;
    id: string;
  } | null>(null);

  const [isOpen, setIsOpen] = useControllableState({
    defaultValue: defaultOpen,
    value: isOpenProp,
    onChange: onOpenChange,
  });

  const [value, setValue] = useControllableState({
    defaultValue,
    value: valueProp,
    onChange: (value) => {
      onChange?.({ target: { value: value || null } });
    },
  });

  const state = useRef<{
    focused?: InternalSelectOption;
    focusedIndex?: number;
    focusedId?: string;
    value?: InternalSelectOption;
    index?: number;
    handledArrowDown?: boolean;
  }>({}).current;

  const [inputWrapper, setInputWrapper] = useState<HTMLDivElement | null>(null);
  const inputFocused = useRef(inputProps.inputProps?.autoFocus || false);

  const lisboxId = useId();

  const handleClose = useCallback(() => {
    setIsOpen(false);

    inputWrapper?.focus();
  }, [inputWrapper, setIsOpen]);

  const setOutsideEle = useClickOutside<HTMLDivElement>({
    isDisabled: !isOpen,
    onEvent: "pointerdown",
    callback: (e) => {
      if (inputWrapper?.contains(e.target as Node)) return;
      setIsOpen(false);
    },
  });

  const { isFocusVisible } = useFocusVisible();

  const onSelect = useCallback(
    ({ option, isDisabled, index }: onSelectProps, select: boolean) =>
      () => {
        if (isDisabled) return;

        if (select) {
          setValue(option);
          state.value = option;
          state.index = index;
          handleClose();
        }

        setFocused({ option, index, id: option.id });
        state.focused = option;
        state.focusedIndex = index;
        state.focusedId = option.id;
      },

    [handleClose, setValue, state],
  );

  const undoValue = useCallback(() => {
    if (state.value && state.index && state.focusedId)
      setFocused({ option: state.value, index: state.index, id: state.focusedId });
    else setFocused(null);
    state.focused = undefined;
    state.focusedIndex = undefined;
  }, [state]);

  useEffect(() => {
    if (defaultValue && options) {
      const index = options?.findIndex(
        (ele) => ele.label === defaultValue.label && ele.value === defaultValue.value,
      );

      if (index < 0)
        throw new GistUiError("Select", "`defaultValue` must be from provided `options`");

      const option = options[index];

      const isDisabled = getOptionDisabled?.(option);

      if (isDisabled)
        throw new GistUiError("Select", "`defaultValue` is disabled. Please select another");

      state.focused = option;
      state.focusedIndex = index;
      state.focusedId = option.id;
      state.value = option;
      state.index = index;
    }
  }, [defaultValue, getOptionDisabled, options, state]);

  const getNextIndex = useCallback(
    (currentIndex: number) => {
      if (!getOptionDisabled) return currentIndex;

      for (let i = currentIndex; i <= options!.length; i++) {
        const option = getOptionDisabled(options![i]);

        if (!option) return i;
        if (i === options!.length - 1) i = 0;
      }
    },
    [getOptionDisabled, options],
  );

  const getPreviousIndex = useCallback(
    (currentIndex: number) => {
      if (!getOptionDisabled) return currentIndex;

      for (let i = currentIndex; i >= 0; i--) {
        const option = getOptionDisabled(options![i]);

        if (!option) return i;
        if (i === 0) i = options!.length;
      }
    },
    [getOptionDisabled, options],
  );

  useEffect(() => {
    if (!options) return;

    if (!isOpen) {
      undoValue();
      return;
    }

    if (!state.value && !state.index) {
      const index = getNextIndex(0);
      if (index === 0 || index) {
        const option = options[index];

        state.focused = option;
        state.focusedIndex = index;
        state.focusedId = option.id;
        setFocused({ option, index, id: option.id });
      }
    } else {
      const index = state.index;
      const option = state.value;

      state.focused = option;
      state.focusedIndex = index;
      state.focusedId = option?.id;
    }

    const hanldeKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      const ArrowUp = e.key === "ArrowUp";
      const ArrowDown = e.key === "ArrowDown";
      const Escape = e.key === "Escape";
      const Home = e.key === "Home";
      const End = e.key === "End";

      if (Escape) {
        undoValue();
        handleClose();

        return;
      }

      if (state.handledArrowDown) return;

      if (Home || (ArrowDown && state.focusedIndex === options.length - 1)) {
        const index = getNextIndex(0);

        if (index === 0 || index) {
          const option = options[index];

          setFocused({ option, index, id: option.id });
          state.focused = option;
          state.focusedIndex = index;
          state.focusedId = option.id;
        }

        return;
      }

      if (ArrowDown && state.focusedIndex !== options.length - 1) {
        const index = getNextIndex(state.focusedIndex! + 1);

        if (index === 0 || index) {
          const option = options[index];

          setFocused({ option, index, id: option.id });
          state.focused = option;
          state.focusedIndex! = index;
          state.focusedId = option.id;
        }

        return;
      }

      if (End || (ArrowUp && state.focusedIndex === 0)) {
        const index = getPreviousIndex(options.length - 1);
        if (index === 0 || index) {
          const option = options[index];

          setFocused({ option, index, id: option.id });
          state.focused = option;
          state.focusedIndex! = index;
          state.focusedId = option.id;
        }

        return;
      }

      if (ArrowUp && state.focusedIndex !== 0) {
        const index = getPreviousIndex(state.focusedIndex! - 1);
        if (index === 0 || index) {
          const option = options[index];

          setFocused({ option, index, id: option.id });
          state.focused = option;
          state.focusedIndex! = index;
          state.focusedId = option.id;
        }

        return;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.repeat) return;

      const Space = e.key === " ";
      const Enter = e.key === "Enter";

      if (Space || Enter) {
        onSelect({ option: state.focused!, index: state.focusedIndex!, isDisabled: false }, true)();

        return;
      }
    };

    document.addEventListener("keydown", hanldeKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", hanldeKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [getNextIndex, getPreviousIndex, handleClose, isOpen, onSelect, options, state, undoValue]);

  const handleInputArrowDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isDisabled) return;
      if (e.repeat) return;

      const ArrowDown = e.key === "ArrowDown";

      if (ArrowDown) {
        setIsOpen(true);
      }

      if (isOpen) {
        state.handledArrowDown = false;
      } else {
        state.handledArrowDown = true;
      }
    },

    [isDisabled, isOpen, setIsOpen, state],
  );

  const handleFocus = useCallback(() => {
    inputFocused.current = true;

    if (!isFocusVisible) {
      setIsOpen(true);
    }
  }, [isFocusVisible, setIsOpen]);

  const handleBlur = useCallback(() => {
    inputFocused.current = false;

    if (isFocusVisible) {
      setIsOpen(false);
    }
  }, [isFocusVisible, setIsOpen]);

  const handleInputInteraction = useCallback(
    (e: React.PointerEvent) => {
      if (isDisabled) return;
      if (e.button !== 0) return;

      if (inputFocused.current && !isOpen) {
        setIsOpen(true);
      }
    },
    [isDisabled, isOpen, setIsOpen],
  );

  const handleListboxToggle = useCallback(() => {
    if (isDisabled) return;

    if (!inputFocused.current) {
      inputWrapper?.focus();
    }

    setIsOpen((p) => !p);
  }, [inputWrapper, isDisabled, setIsOpen]);

  const handleClear = useCallback(() => {
    if (!inputFocused.current) {
      inputWrapper?.focus();
    }

    setValue(null);
    setIsOpen(true);
    state.focused = undefined;
    state.focusedIndex = undefined;
    state.index = undefined;
    state.value = undefined;
  }, [inputWrapper, setIsOpen, setValue, state]);

  const styles = select({ ...variantProps, rounded: listboxRounded, color: inputProps.color });

  return (
    <>
      <Input
        {...inputProps}
        isDisabled={isDisabled}
        ref={mergeRefs(ref, setInputWrapper)}
        value={(value && (getOptionLabel ? getOptionLabel(value) : value.label)) || ""}
        onChange={() => {}}
        hideNativeInput
        inputProps={{
          ...inputProps.inputProps,
          onPointerDown: handleInputInteraction,
          onKeyDown: handleInputArrowDown,
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
          <div className={styles.endContent()}>
            {!value ? null : (
              <Button
                isIconOnly
                variant="text"
                size="sm"
                rounded="full"
                aria-label="toggle listbox"
                asChild
                onPress={handleClear}
              >
                <div>{closeIcon}</div>
              </Button>
            )}

            <Button
              isIconOnly
              variant="text"
              size="sm"
              rounded="full"
              aria-label="toggle listbox"
              asChild
              style={{ rotate: isOpen ? "180deg" : "0deg" }}
              onPress={handleListboxToggle}
            >
              <div>{caretDown}</div>
            </Button>

            {inputProps.endContent}
          </div>
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
              aria-activedescendant={focused?.id}
              aria-roledescription="select one" // TODO: make it correct according to select/multiselect
              style={{ maxHeight }}
            >
              {options?.length ? (
                options.map((option, index) => {
                  const isDisabled = getOptionDisabled?.(option) || false;
                  const isSelected = isOptionEqualToValue
                    ? isOptionEqualToValue(option, value)
                    : value?.label === option.label && value.value === option.value;

                  return (
                    <Fragment key={getOptionKey ? getOptionKey(option) : option.label}>
                      <Option
                        option={option}
                        className={styles.option({ className: listboxClassNames?.option })}
                        isDisabled={isDisabled}
                        isFocused={focused?.index === index}
                        index={index}
                        onSelect={onSelect}
                        getOptionLabel={getOptionLabel}
                        isSelected={isSelected}
                      />

                      {index + 1 !== options.length && (
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
