import * as Popper from '@gist-ui/popper';
import { CustomInputElement, Input, InputProps } from '@gist-ui/input';
import {
  InputClassNames,
  SelectClassNames,
  SelectVariantProps,
  select,
} from '@gist-ui/theme';
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

interface OptionSelectProps<V> {
  option: V;
  index: number;
}

export interface SelectOption {
  label?: string;
}

export type Reason = 'select' | 'clear' | 'escape';

interface RenderOptionProps<V> {
  option: V;
  state: {
    isDisabled: boolean;
    isSelected: boolean;
    isFocused: boolean;
  };
}

export type RenderOption<V> = (props: RenderOptionProps<V>) => React.ReactNode;

interface CommonProps<V>
  extends SelectVariantProps,
    Omit<InputProps, 'defaultValue' | 'value' | 'onChange' | 'classNames'> {
  /**
   * This prop value is use in `listbox` style.maxHeight
   *
   * @default "300px"
   */
  maxHeight?: number;
  classNames?: InputClassNames & SelectClassNames;
  /**
   * @default "no options"
   */
  empltyText?: string;
  options?: V[];
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
  getOptionDisabled?: (options: V) => boolean;
  /**
   * Used to determine the key for a given option. By default labels are used as keys
   */
  getOptionKey?: (options: V) => string;
  renderOption?: RenderOption<V>;
  /**
   * @default option.label
   */
  getOptionLabel?: (option: V) => string;
  /**
   * @default option.label
   */
  getOptionId?: (option: V) => string;
  /**
   * when listbox is closed then on Escape value will be cleared. Disable this behaviour by defining this prop as true
   */
  disableClearOnEscape?: boolean;
}

export type SelectProps<M, V> = M extends true
  ? {
      multiple: M;
      defaultValue?: V[];
      value?: V[];
      onChange?: (value: V[], reason: Reason) => void;
    } & CommonProps<V>
  : {
      multiple?: M;
      defaultValue?: V;
      value?: V | null;
      onChange?: (value: V | null, reason: Reason) => void;
    } & CommonProps<V>;

const GET_OPTION_LABEL = (option: SelectOption) => option.label;
const GET_OPTION_ID = (option: SelectOption) => option.label;

const Select = <
  M extends boolean = false,
  V extends SelectOption = SelectOption,
>(
  props: SelectProps<M, V>,
  ref: React.ForwardedRef<CustomInputElement>,
) => {
  const {
    options,
    classNames,
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
    disableClearOnEscape,
    getOptionLabel = GET_OPTION_LABEL,
    getOptionId = GET_OPTION_ID,
    ...inputProps
  } = props;

  const [internalValue, setInternalValue] = useState<
    V | V[] | undefined | null
  >(defaultValue);

  const value = valueProp !== undefined ? valueProp : internalValue;

  const inputRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState<V | null>(null);

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

    if (!value && options) {
      const index = getNextIndex(0);
      if (index >= 0) setFocused(options[index]);

      return;
    }

    if (multiple) {
      if (value && isMultiple(value) && value.length) {
        setFocused(value[0]);
        return;
      }
    } else {
      if (value && isSingle(value)) {
        setFocused(value);
        return;
      }
    }
  }, [getNextIndex, isOpen, multiple, options, setIsOpen, value]);

  const handleOptionHover = useCallback(
    (option: V) => () => {
      setFocused(option);
    },
    [],
  );

  const toggleValue = useCallback(
    (option: V) => {
      if (multiple) {
        const _value = value && isMultiple(value) ? value : [];

        const isSelected = !!_value.find((ele) => ele === option);

        const val = isSelected
          ? _value.filter((ele) => ele !== option)
          : [..._value, option];

        onChange?.(val, 'select');
        setInternalValue(val);
      } else {
        onChange?.(option, 'select');
        setInternalValue(option);
      }
    },
    [multiple, onChange, value],
  );

  const clearValue = useCallback(
    (reason: Reason) => {
      if (multiple) {
        onChange?.([], reason);
        setInternalValue([]);
      } else {
        onChange?.(null, reason);
        setInternalValue(null);
      }
    },
    [multiple, onChange],
  );

  const handleOptionSelect = useCallback(
    ({ option }: OptionSelectProps<V>) =>
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
            : getOptionLabel(ele)?.toLowerCase().startsWith(filter),
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
              : getOptionLabel(ele)?.toLowerCase().startsWith(filter[0]),
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
        if (!disableClearOnEscape) clearValue('escape');

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
      disableClearOnEscape,
      focused,
      getNextIndex,
      getOptionDisabled,
      getOptionLabel,
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
    if (!value) return '';

    if (multiple) {
      if (value && isMultiple(value) && value.length) {
        return value.map((opt) => getOptionLabel(opt)).join(', ');
      }
    } else {
      if (value && isSingle(value)) {
        return getOptionLabel(value);
      }
    }

    return '';
  }, [getOptionLabel, multiple, value]);

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
            classNames={{
              ...classNames,
              input: styles.input({ className: classNames?.input }),
            }}
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
                  className: classNames?.endContent,
                })}
              >
                {((multiple && value && isMultiple(value) && value.length) ||
                  (!multiple && value)) && (
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
                        className: classNames?.clearButton,
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
                    className: classNames?.openIndicator,
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
                className: classNames?.listbox,
              })}
              role="listbox"
              aria-activedescendant={
                focused ? getOptionId(focused)?.replaceAll(' ', '-') : undefined
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
                      <Option<V>
                        option={option}
                        id={getOptionId(option)?.replaceAll(' ', '-')}
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
                          className: classNames?.option,
                        })}
                      />

                      {index + 1 !== options.length && (
                        <div
                          className={styles.optionSeperator({
                            className: classNames?.optionSeperator,
                          })}
                        />
                      )}
                    </Fragment>
                  );
                })
              ) : (
                <div
                  className={styles.emptyText({
                    className: classNames?.emptyText,
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

export default forwardRef(Select) as <
  M extends boolean = false,
  V extends SelectOption = SelectOption,
>(
  props: SelectProps<M, V> & { ref?: React.ForwardedRef<CustomInputElement> },
) => ReturnType<typeof Select>;

// ********** utils **********

const isMultiple = (
  value: SelectOption | SelectOption[],
): value is SelectOption[] => true;

const isSingle = (
  value: SelectOption | SelectOption[],
): value is SelectOption => true;
