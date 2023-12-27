import * as Popper from '@gist-ui/popper';
import { CustomInputElement, Input, InputProps } from '@gist-ui/input';
import { SelectClassNames, SelectVariantProps, select } from '@gist-ui/theme';
import { useControllableState } from '@gist-ui/use-controllable-state';
import { useClickOutside } from '@gist-ui/use-click-outside';
import { mergeRefs } from '@gist-ui/react-utils';
import { Option } from './option';
import { Button } from '@gist-ui/button';
import {
  Fragment,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

const OpenIndicator = ({
  isOpen,
  className,
}: {
  isOpen: boolean;
  className?: string;
}) => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 10"
    style={{ rotate: isOpen ? '180deg' : '0deg' }}
    className={className}
  >
    <path d="M15.434 1.235A2 2 0 0 0 13.586 0H2.414A2 2 0 0 0 1 3.414L6.586 9a2 2 0 0 0 2.828 0L15 3.414a2 2 0 0 0 .434-2.179Z" />
  </svg>
);

interface OptionSelectProps {
  option: SelectOption;
  index: number;
}

export interface SelectOption {
  label: string;
}

export interface RenderOptionProps {
  option: SelectOption;
  state: {
    isDisabled: boolean;
    isSelected: boolean;
    isFocused: boolean;
  };
}

export type Reason = 'select' | 'clear' | 'escape';

interface CommonProps
  extends SelectVariantProps,
    Omit<InputProps, 'defaultValue' | 'value' | 'onChange'> {
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
  offset?: Popper.FloatingProps['mainOffset'];
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
  renderOption?: (props: RenderOptionProps) => React.ReactNode;
  /**
   * @default option.label
   */
  getOptionLabel?: (option: SelectOption) => string;
  /**
   * @default option.label
   */
  getOptionId?: (option: SelectOption) => string;
}

export type SelectProps<M> = M extends true
  ? {
      multiple: M;
      defaultValue?: SelectOption[];
      value?: SelectOption[];
      onChange?: (value: SelectOption[], reason: Reason) => void;
    } & CommonProps
  : {
      multiple?: M;
      defaultValue?: SelectOption;
      value?: SelectOption | null;
      onChange?: (value: SelectOption | null, reason: Reason) => void;
    } & CommonProps;

const GET_OPTION_LABEL = (option: SelectOption) => option.label;
const GET_OPTION_ID = (option: SelectOption) => option.label;

const Select = <M extends boolean = false>(
  props: SelectProps<M>,
  ref: React.ForwardedRef<CustomInputElement>,
) => {
  const {
    options,
    listboxClassNames,
    offset,
    getOptionDisabled,
    isOpen: isOpenProp,
    onOpenChange,
    maxHeight = 300,
    empltyText = 'no options',
    defaultOpen = false,
    defaultValue,
    value: valueProp,
    onChange,
    getOptionKey,
    renderOption,
    shadow,
    isDisabled,
    multiple,
    getOptionLabel = GET_OPTION_LABEL,
    getOptionId = GET_OPTION_ID,
    ...inputProps
  } = props;

  const [internalValue, setInternalValue] = useState<
    SelectOption | SelectOption[] | undefined | null
  >(defaultValue);

  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;

  const inputRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState<SelectOption | null>(null);

  const lisboxId = useId();

  const state = useRef<{
    searchedString: string;
    searchedStringTimer?: ReturnType<typeof setTimeout>;
  }>({
    searchedString: '',
  }).current;

  const [isOpen, setIsOpen] = useControllableState({
    defaultValue: defaultOpen,
    value: isOpenProp,
    onChange: onOpenChange,
  });

  const setOutsideEle = useClickOutside<HTMLUListElement>({
    isDisabled: !isOpen,
    onEvent: 'pointerdown',
    callback: (e) => {
      if (inputRef.current?.contains(e.target as Node)) return;
      setIsOpen(false);
    },
  });

  const getNextIndex = useCallback(
    (currentIndex: number) => {
      if (!getOptionDisabled) return currentIndex;

      for (let i = currentIndex; i < options!.length; i++) {
        const isDisabled = getOptionDisabled(options![i]);

        if (!isDisabled) return i;
      }

      return -1;
    },
    [getOptionDisabled, options],
  );

  const getPreviousIndex = useCallback(
    (currentIndex: number) => {
      if (!getOptionDisabled) return currentIndex;

      for (let i = currentIndex; i >= 0; i--) {
        const isDisabled = getOptionDisabled(options![i]);

        if (!isDisabled) return i;
      }

      return -1;
    },
    [getOptionDisabled, options],
  );

  const handleListboxOpen = useCallback(() => {
    setIsOpen(true);

    if (isOpen) return;

    if (!value && !defaultValue && options) {
      const index = getNextIndex(0);
      if (index >= 0) setFocused(options[index]);

      return;
    }

    if (multiple) {
      if (!value && defaultValue?.length) {
        setFocused(defaultValue[0]);
        return;
      }

      if (value && isMultiple(value) && value.length) {
        setFocused(value[0]);
        return;
      }
    } else {
      if (!value && defaultValue) {
        setFocused(defaultValue);
        return;
      }

      if (value && isSingle(value)) {
        setFocused(value);
        return;
      }
    }
  }, [defaultValue, getNextIndex, isOpen, multiple, options, setIsOpen, value]);

  const handleOptionHover = useCallback(
    (option: SelectOption) => () => {
      setFocused(option);
    },
    [],
  );

  const toggleValue = useCallback(
    (option: SelectOption) => {
      if (multiple) {
        const _value = value && isMultiple(value) ? value : [];

        const isSelected = !!_value.find((ele) => ele === option);

        const val = isSelected
          ? _value.filter((ele) => ele !== option)
          : [..._value, option];

        if (isControlled) onChange?.(val, 'select');
        else setInternalValue(val);
      } else {
        if (isControlled) onChange?.(option, 'select');
        else setInternalValue(option);
      }
    },
    [isControlled, multiple, onChange, value],
  );

  const clearValue = useCallback(
    (reason: Reason) => {
      if (multiple) {
        if (isControlled) onChange?.([], reason);
        else setInternalValue([]);
      } else {
        if (isControlled) onChange?.(null, reason);
        else setInternalValue(null);
      }
    },
    [isControlled, multiple, onChange],
  );

  const handleOptionSelect = useCallback(
    ({ option }: OptionSelectProps) =>
      () => {
        if (multiple) {
          setFocused(option);
        } else {
          setIsOpen(false);
          setFocused(null);
        }

        toggleValue(option);
      },
    [multiple, setIsOpen, toggleValue],
  );

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!options) return;

      // handle any printable character
      if (e.key.length === 1 && options) {
        setIsOpen(true);

        clearTimeout(state.searchedStringTimer);

        state.searchedStringTimer = setTimeout(() => {
          state.searchedString = '';
        }, 500);

        state.searchedString += e.key;

        const startIndex = focused ? options.indexOf(focused) + 1 : 0;

        const orderedOptions = [
          ...options.slice(startIndex),
          ...options.slice(0, startIndex),
        ];

        const filter = state.searchedString.toLowerCase();

        const excatMatch = orderedOptions.find((ele) =>
          getOptionDisabled?.(ele)
            ? false
            : ele.label.toLowerCase().startsWith(filter),
        );

        if (excatMatch) {
          setFocused(excatMatch);

          return;
        }

        const sameLetters = filter
          .split('')
          .every((letter) => letter.toLowerCase() === filter[0]);

        if (sameLetters) {
          const matched = orderedOptions.find((ele) =>
            getOptionDisabled?.(ele)
              ? false
              : ele.label.toLowerCase().startsWith(filter[0]),
          );

          if (matched) {
            setFocused(matched);
          } else {
            clearTimeout(state.searchedStringTimer);
            state.searchedString = '';
          }

          return;
        }

        return;
      }

      const ArrowDown = e.key === 'ArrowDown';
      const ArrowUp = e.key === 'ArrowUp';
      const Escape = e.key === 'Escape';
      const Enter = e.key === 'Enter';
      const Home = e.key === 'Home';
      const End = e.key === 'End';

      if (ArrowDown && !isOpen) {
        handleListboxOpen();
        return;
      }

      if (Escape && isOpen) {
        setIsOpen(false);

        return;
      }

      if (Escape && !isOpen) {
        setFocused(null);
        clearValue('escape');

        return;
      }

      if (Enter && isOpen && focused) {
        if (multiple) {
          setFocused(focused);
        } else {
          setIsOpen(false);
          setFocused(null);
        }

        toggleValue(focused);
        return;
      }

      if (Home || ((ArrowDown || ArrowUp) && !focused)) {
        const index = getNextIndex(0);
        if (index >= 0) setFocused(options[index]);

        return;
      }

      if (ArrowDown && focused) {
        const index = getNextIndex(options.indexOf(focused) + 1);
        if (index >= 0) setFocused(options[index]);

        return;
      }

      if (ArrowUp && focused) {
        const index = getPreviousIndex(options.indexOf(focused) - 1);
        if (index >= 0) setFocused(options[index]);

        return;
      }

      if (End) {
        const index = getPreviousIndex(options.length - 1);
        if (index >= 0) setFocused(options[index]);

        return;
      }
    },
    [
      clearValue,
      focused,
      getNextIndex,
      getOptionDisabled,
      getPreviousIndex,
      handleListboxOpen,
      isOpen,
      multiple,
      options,
      setIsOpen,
      state,
      toggleValue,
    ],
  );

  const getInputValue = useCallback(() => {
    if (multiple) {
      if (!value && defaultValue?.length) {
        return defaultValue.map((opt) => getOptionLabel(opt)).join(', ');
      }

      if (value && isMultiple(value) && value.length) {
        return value.map((opt) => getOptionLabel(opt)).join(', ');
      }
    } else {
      if (!value && defaultValue) {
        return getOptionLabel(defaultValue);
      }

      if (value && isSingle(value)) {
        return getOptionLabel(value);
      }
    }

    return '';
  }, [defaultValue, getOptionLabel, multiple, value]);

  useEffect(() => {
    return () => {
      clearTimeout(state.searchedStringTimer);
    };
  }, [state]);

  const styles = select({
    shadow,
  });

  return (
    <>
      <Popper.Root>
        <Popper.Reference>
          <Input
            {...inputProps}
            value={getInputValue()}
            isDisabled={isDisabled}
            ref={mergeRefs(ref, inputRef)}
            onPointerDown={handleListboxOpen}
            inputProps={{
              ...inputProps.inputProps,
              onKeyDown: handleInputKeyDown,
              'aria-expanded': isOpen,
              'aria-controls': lisboxId,
              'aria-haspopup': 'listbox',
              'aria-autocomplete': 'none',
              role: 'combobox',
              autoComplete: 'off',
              readOnly: true,
            }}
            endContent={
              <div
                className={styles.endContent({
                  className: listboxClassNames?.endContent,
                })}
              >
                {value && (
                  <Button
                    isIconOnly
                    size="sm"
                    variant="text"
                    color="neutral"
                    preventFocusOnPress
                    tabIndex={-1}
                    onPress={() => {
                      setIsOpen(true);
                      setFocused(null);
                      inputRef.current?.focus();
                      clearValue('clear');
                    }}
                  >
                    <svg
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                      className={styles.clearButton({
                        className: listboxClassNames?.clearButton,
                      })}
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                  </Button>
                )}

                <OpenIndicator
                  isOpen={isOpen}
                  className={styles.openIndicator({
                    className: listboxClassNames?.openIndicator,
                  })}
                />
              </div>
            }
          />
        </Popper.Reference>

        {isOpen && (
          <Popper.Floating sticky="always" mainOffset={offset || 5}>
            <ul
              ref={setOutsideEle}
              id={lisboxId}
              className={styles.listbox({
                className: listboxClassNames?.listbox,
              })}
              role="listbox"
              aria-activedescendant={
                focused ? getOptionId(focused).replaceAll(' ', '-') : undefined
              }
              aria-roledescription="single select"
              style={{ maxHeight }}
            >
              {options?.length ? (
                options.map((option, index) => {
                  return (
                    <Fragment
                      key={getOptionKey ? getOptionKey(option) : option.label}
                    >
                      <Option
                        option={option}
                        id={getOptionId(option).replaceAll(' ', '-')}
                        isDisabled={getOptionDisabled?.(option) ?? false}
                        isSelected={
                          multiple
                            ? !!value &&
                              isMultiple(value) &&
                              !!value.find((ele) => ele === option)
                            : value === option
                        }
                        isFocused={focused === option}
                        label={getOptionLabel(option) ?? option.label}
                        onSelect={handleOptionSelect({ index, option })}
                        onHover={handleOptionHover(option)}
                        renderOption={renderOption}
                        className={styles.option({
                          className: listboxClassNames?.option,
                        })}
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
                <div
                  className={styles.emptyText({
                    className: listboxClassNames?.emptyText,
                  })}
                >
                  {empltyText}
                </div>
              )}
            </ul>
          </Popper.Floating>
        )}
      </Popper.Root>
    </>
  );
};

Select.displayName = 'gist-ui.Select';

export default forwardRef(Select) as <M extends boolean = false>(
  props: SelectProps<M> & { ref?: React.ForwardedRef<CustomInputElement> },
) => ReturnType<typeof Select>;

// ********** utils **********

const isMultiple = (
  value: SelectOption | SelectOption[],
): value is SelectOption[] => true;

const isSingle = (
  value: SelectOption | SelectOption[],
): value is SelectOption => true;
