import * as Popper from '@gist-ui/popper';
import { Input, InputProps } from '@gist-ui/input';
import { useControllableState } from '@gist-ui/use-controllable-state';
import { useClickOutside } from '@gist-ui/use-click-outside';
import { mergeRefs } from '@gist-ui/react-utils';
import { Option } from './option';
import _groupby from 'lodash.groupby';
import { Button } from '@gist-ui/button';
import { useFocusVisible } from '@react-aria/interactions';
import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import {
  InputClassNames,
  AutocompleteClassNames,
  AutocompleteVariantProps,
  autocomplete,
} from '@gist-ui/theme';

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

export type Reason = 'select' | 'clear' | 'escape';

export type AutocompleteProps<
  Value,
  Multiple extends boolean = false,
  DisableClearable extends boolean = false,
> = (AutocompleteVariantProps &
  Omit<InputProps, 'defaultValue' | 'value' | 'onChange' | 'classNames'> & {
    /**
     * This prop value is use in `listbox` style.maxHeight
     *
     * @default "300px"
     */
    maxHeight?: number;
    classNames?: InputClassNames & AutocompleteClassNames;
    /**
     * @default "no options"
     */
    noOptionsText?: string;
    options?: Value[];
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
    getOptionDisabled?: (options: Value) => boolean;
    /**
     * Used to determine the key for a given option. By default labels are used as keys
     */
    getOptionKey?: (options: Value) => string;
    renderOption?: (props: {
      option: Value;
      state: {
        isDisabled: boolean;
        isSelected: boolean;
        isFocused: boolean;
      };
    }) => React.ReactNode;
    /**
     * @default option.label
     */
    getOptionLabel?: (option: Value) => string;
    /**
     * @default option.label
     */
    getOptionId?: (option: Value) => string;
    /**
     * If inputValue is defined then this will behave as controlled.
     */
    inputValue?: string;
    onInputChange?: (value: string) => void;
    filterOptions?: (props: {
      options: Value[];
      inputValue: string;
    }) => Value[];
    /**
     * By default it return true when option and value are equal by reference e.g. optoin === value
     */
    isOptionEqualToValue?: (option: Value, value: Value) => boolean;
    loading?: boolean;
    /**
     * @default "loading ..."
     */
    loadingText?: string;
    groupBy?: (option: Value) => string;
  }) &
  (Multiple extends true
    ? {
        multiple: Multiple;
        defaultValue?: Value[];
        value?: Value[];
        onChange?: (value: Value[], reason: Reason) => void;
        disableClearable?: undefined;
      }
    : DisableClearable extends true
    ? {
        multiple?: Multiple;
        defaultValue?: Value;
        value?: Value;
        onChange?: (value: Value, reason: Reason) => void;
        disableClearable: DisableClearable;
      }
    : {
        multiple?: Multiple;
        defaultValue?: Value;
        value?: Value | null;
        onChange?: (value: Value | null, reason: Reason) => void;
        disableClearable?: DisableClearable;
      });

const GET_OPTION_LABEL = <V,>(option: V) =>
  (option as { label?: string }).label || '';
const GET_OPTION_ID = <V,>(option: V) =>
  (option as { label?: string }).label || '';
const GET_OPTION_KEY = <V,>(option: V) =>
  (option as { label?: string }).label || '';
const IS_OPTION_EQUAL_TO_VALUE = <V,>(option: V, value: V) => option === value;

const Autocomplete = <
  Value,
  Multiple extends boolean = false,
  DisableClearable extends boolean = false,
>(
  props: AutocompleteProps<Value, Multiple, DisableClearable>,
) => {
  const {
    options: optionsProp,
    classNames,
    offset,
    isOpen: isOpenProp,
    onOpenChange,
    maxHeight = 300,
    defaultOpen = false,
    defaultValue,
    value: valueProp,
    onChange,
    renderOption,
    shadow,
    isDisabled,
    multiple,
    inputValue: inputValueProp,
    onInputChange,
    getOptionDisabled,
    filterOptions,
    loading,
    groupBy,
    noOptionsText = 'no options',
    loadingText = 'loading ...',
    getOptionKey = GET_OPTION_KEY,
    isOptionEqualToValue = IS_OPTION_EQUAL_TO_VALUE,
    getOptionLabel = GET_OPTION_LABEL,
    getOptionId = GET_OPTION_ID,
    disableClearable,
    ...inputProps
  } = props;

  const [internalValue, setInternalValue] = useState<
    Value | Value[] | undefined | null
  >(defaultValue);

  const value = valueProp !== undefined ? valueProp : internalValue;

  const inputRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState<Value | null>(null);
  const [options, setOptions] = useState(optionsProp);
  const [groupedOptions, setgroupedOptions] = useState<
    [string, Value[]][] | null
  >(null);
  const [isInputActive, setIsInputActive] = useState(false);
  const { isFocusVisible } = useFocusVisible({ isTextInput: true });

  const lisboxId = useId();
  const listboxRef = useRef<HTMLUListElement>(null);

  const [isOpen, setIsOpen] = useControllableState({
    defaultValue: defaultOpen,
    value: isOpenProp,
    onChange: onOpenChange,
  });

  const [inputValue, setInputValue] = useControllableState({
    defaultValue: '',
    value: inputValueProp,
    onChange: onInputChange,
  });

  const handleListboxClose = useCallback(() => {
    setIsOpen(false);
    setFocused(null);
    setIsInputActive(false);
    setInputValue('');

    if (groupBy && optionsProp?.length) {
      const grouped = getGroupedOptions(optionsProp, groupBy);

      setgroupedOptions(grouped);
      setOptions(flatGroupedOptions(grouped));
    } else {
      setOptions(optionsProp);
    }
  }, [groupBy, optionsProp, setInputValue, setIsOpen]);

  const setListboxOutsideEle = useClickOutside<HTMLUListElement>({
    onEvent: 'pointerdown',
    callback: (e) => {
      if (inputRef.current?.contains(e.target as Node)) return;
      handleListboxClose();
    },
  });

  const setInputOutsideEle = useClickOutside<HTMLDivElement>({
    isDisabled: !isOpen && !isInputActive,
    onEvent: 'pointerdown',
    callback: (e) => {
      if (listboxRef.current?.contains(e.target as Node)) return;
      handleListboxClose();
    },
  });

  const getNextIndex = useCallback(
    (currentIndex: number, options: Value[]) => {
      if (!getOptionDisabled) return currentIndex;

      for (let i = currentIndex; i < options.length; i++) {
        const isDisabled = getOptionDisabled(options[i]);

        if (!isDisabled) return i;
      }

      return -1;
    },
    [getOptionDisabled],
  );

  const getPreviousIndex = useCallback(
    (currentIndex: number, options: Value[]) => {
      if (!getOptionDisabled) return currentIndex;

      for (let i = currentIndex; i >= 0; i--) {
        const isDisabled = getOptionDisabled(options[i]);

        if (!isDisabled) return i;
      }

      return -1;
    },
    [getOptionDisabled],
  );

  const handleListboxOpen = useCallback(() => {
    if (isOpen) return;

    setIsOpen(true);
    setIsInputActive(true);

    if (!options?.length) return;

    if (!value) {
      const index = getNextIndex(0, options);
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
    (option: Value) => () => {
      setFocused(option);
    },
    [],
  );

  const handleOptionSelect = useCallback(
    (option: Value) => () => {
      if (multiple) {
        const _value = value && isMultiple(value) ? value : [];

        const isSelected = !!_value.find((ele) => ele === option);

        const val = isSelected
          ? _value.filter((ele) => ele !== option)
          : [..._value, option];

        onChange?.(val, 'select');
        setInternalValue(val);
        setFocused(option);
      } else {
        onChange?.(option, 'select');
        setInternalValue(option);
        handleListboxClose();
      }
    },
    [handleListboxClose, multiple, onChange, value],
  );

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const ArrowDown = e.key === 'ArrowDown';
      const ArrowUp = e.key === 'ArrowUp';
      const Escape = e.key === 'Escape';
      const Enter = e.key === 'Enter';

      if (ArrowDown || ArrowUp) e.preventDefault();

      if (Escape && isOpen) {
        setIsOpen(false);
        setFocused(null);
        return;
      }

      if (ArrowDown && !isOpen) {
        handleListboxOpen();
        return;
      }

      if (!options?.length) return;

      if (Enter && isOpen && focused) {
        handleOptionSelect(focused)();
        return;
      }

      if (ArrowDown && isOpen && focused) {
        const index = getNextIndex(options.indexOf(focused) + 1, options);
        if (index >= 0) setFocused(options[index]);

        return;
      }

      if (ArrowUp && isOpen && focused) {
        const index = getPreviousIndex(options.indexOf(focused) - 1, options);
        if (index >= 0) setFocused(options[index]);

        return;
      }
    },
    [
      focused,
      getNextIndex,
      getPreviousIndex,
      handleListboxOpen,
      handleOptionSelect,
      isOpen,
      options,
      setIsOpen,
    ],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;

      setIsOpen(true);
      setInputValue(val);
      setIsInputActive(true);

      if (!optionsProp?.length) return;

      const filter =
        filterOptions ||
        (({ options, inputValue }) =>
          options.filter(
            (opt) =>
              getOptionLabel(opt)
                ?.toLowerCase()
                .startsWith(inputValue.toLowerCase()),
          ));

      let options = val
        ? filter({ options: optionsProp, inputValue: val })
        : optionsProp;

      if (groupBy) {
        const grouped = getGroupedOptions(options, groupBy);

        options = flatGroupedOptions(grouped);
        setgroupedOptions(grouped);
      } else {
        setgroupedOptions(null);
      }

      const index = getNextIndex(0, options);

      if (index >= 0) setFocused(options[index]);
      else setFocused(null);

      setOptions(options);
      setFocused(options[index]);
    },
    [
      filterOptions,
      getNextIndex,
      getOptionLabel,
      groupBy,
      optionsProp,
      setInputValue,
      setIsOpen,
    ],
  );

  const handleOnFocus = useCallback(() => {
    if (isFocusVisible) {
      setIsInputActive(true);
    }
  }, [isFocusVisible]);

  const handleOnBlur = useCallback(() => {
    if (isFocusVisible) {
      handleListboxClose();
    }
  }, [handleListboxClose, isFocusVisible]);

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
    if (!groupBy) return;
    if (!optionsProp?.length) return;

    const grouped = getGroupedOptions(optionsProp, groupBy);

    setgroupedOptions(grouped);
    setOptions(flatGroupedOptions(grouped));
  }, [groupBy, optionsProp]);

  const styles = autocomplete({
    shadow,
    grouped: !!groupBy,
  });

  const __renderOption = (option: Value) => {
    const isDisabled = getOptionDisabled?.(option) ?? false;
    const isFocused = focused === option;
    const isSelected = multiple
      ? !!value &&
        isMultiple(value) &&
        !!value.find((ele) => isOptionEqualToValue(ele, option))
      : !!value && isSingle(value) && isOptionEqualToValue(value, option);

    return (
      <Fragment key={getOptionKey(option)}>
        <Option
          id={getOptionId(option)?.replaceAll(' ', '-')}
          isDisabled={isDisabled}
          isSelected={isSelected}
          isFocused={isFocused}
          onSelect={handleOptionSelect(option)}
          onHover={handleOptionHover(option)}
          className={styles.option({
            className: classNames?.option,
          })}
        >
          {renderOption?.({
            option,
            state: { isDisabled, isFocused, isSelected },
          }) || <li>{getOptionLabel(option)}</li>}
        </Option>
      </Fragment>
    );
  };

  return (
    <Popper.Root>
      <Popper.Reference>
        <Input
          {...inputProps}
          value={isInputActive ? inputValue : getInputValue()}
          onChange={handleInputChange}
          isDisabled={isDisabled}
          ref={mergeRefs(inputRef, setInputOutsideEle)}
          onPointerDown={handleListboxOpen}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
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
            'aria-autocomplete': 'list',
            role: 'combobox',
            autoComplete: 'off',
          }}
          endContent={
            <div
              className={styles.endContent({
                className: classNames?.endContent,
              })}
            >
              {((multiple && value && isMultiple(value) && value.length) ||
                (!multiple && value)) &&
                !isInputActive &&
                !disableClearable && (
                  <Button
                    isIconOnly
                    size="sm"
                    variant="text"
                    color="neutral"
                    preventFocusOnPress
                    aria-label="clear value"
                    tabIndex={-1}
                    onPress={() => {
                      setIsOpen(true);
                      inputRef.current?.focus();

                      if (optionsProp?.length) {
                        let options = optionsProp;

                        if (groupBy) {
                          const grouped = getGroupedOptions(options, groupBy);

                          options = flatGroupedOptions(grouped);
                          setgroupedOptions(grouped);
                        } else {
                          setgroupedOptions(null);
                        }

                        const index = getNextIndex(0, options);

                        if (index >= 0) setFocused(options[index]);
                        else setFocused(null);
                      }

                      if (multiple && !disableClearable) {
                        onChange?.([], 'clear');
                        setInternalValue([]);
                      }

                      if (!multiple && !disableClearable) {
                        onChange?.(null, 'clear');
                        setInternalValue(null);
                      }
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
            ref={mergeRefs(listboxRef, setListboxOutsideEle)}
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
            {options?.length
              ? groupedOptions
                ? groupedOptions.map(([groupByKey, optionsGroup]) => (
                    <li
                      key={groupByKey}
                      className={styles.group({
                        className: classNames?.group,
                      })}
                    >
                      <div
                        className={styles.groupHeader({
                          className: classNames?.groupHeader,
                        })}
                      >
                        {groupByKey}
                      </div>
                      <ul
                        className={styles.groupItems({
                          className: classNames?.groupItems,
                        })}
                      >
                        {optionsGroup.map(__renderOption)}
                      </ul>
                    </li>
                  ))
                : options.map(__renderOption)
              : null}

            {loading && !options?.length ? (
              <div
                className={styles.loading({ className: classNames?.loading })}
              >
                {loadingText}
              </div>
            ) : null}

            {!loading && !options?.length ? (
              <div
                className={styles.noOptions({
                  className: classNames?.noOptions,
                })}
              >
                {noOptionsText}
              </div>
            ) : null}
          </ul>
        </Popper.Floating>
      )}
    </Popper.Root>
  );
};

Autocomplete.displayName = 'gist-ui.Autocomplete';

export default Autocomplete;

// ********** utils **********

const isMultiple = <Value,>(value: Value | Value[]): value is Value[] => true;

const isSingle = <Value,>(value: Value | Value[]): value is Value => true;

const getGroupedOptions = <Value,>(
  options: Value[],
  groupBy: (option: Value) => string,
) =>
  Object.entries(
    _groupby(options, (opt) => {
      const by = groupBy(opt);

      if (!isNaN(+by)) return '0-9';

      return by;
    }),
  ).sort((a, b) => {
    const a_key = a[0];
    const b_key = b[0];

    if (a_key < b_key) return -1;
    if (a_key > b_key) return 1;
    return 0;
  });

const flatGroupedOptions = <Value,>(grouped: [string, Value[]][]) =>
  grouped.reduce<Value[]>((acc, ele) => [...acc, ...ele[1]], []);
