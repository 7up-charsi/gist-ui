import * as Popper from '@gist-ui/popper';
import { Input, InputProps } from '@gist-ui/input';
import { useControllableState } from '@gist-ui/use-controllable-state';
import { useClickOutside } from '@gist-ui/use-click-outside';
import { Option } from './option';
import { Button } from '@gist-ui/button';
import _groupby from 'lodash.groupby';
import {
  InputClassNames,
  SelectClassNames,
  SelectVariantProps,
  select,
} from '@gist-ui/theme';
import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { GistUiError } from '@gist-ui/error';

export type Reason = 'select' | 'clear';

export type SelectProps<
  Value,
  Multiple extends boolean = false,
  DisableClearable extends boolean = false,
> = (SelectVariantProps &
  Omit<InputProps, 'defaultValue' | 'value' | 'onChange' | 'classNames'> & {
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
    noOptionsText?: string;
    options?: Value[];
    /**
     * This prop add distance between `Input` and listbox
     */
    offset?: Popper.FloatingProps['mainOffset'];
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
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
     * By default it return true when option and value are equal by reference e.g. optoin === value
     */
    isOptionEqualToValue?: (option: Value, value: Value) => boolean;
    loading?: boolean;
    /**
     * @default "loading ..."
     */
    loadingText?: string;
    groupBy?: (option: Value) => string;
    openIndicator?: React.ReactNode;
    clearIcon?: React.ReactNode;
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

const Select = <
  Value extends object,
  Multiple extends boolean = false,
  DisableClearable extends boolean = false,
>(
  props: SelectProps<Value, Multiple, DisableClearable>,
) => {
  const {
    options: optionsProp,
    classNames,
    offset,
    open: openProp,
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
    getOptionDisabled,
    startContent,
    endContent,
    groupBy,
    loading,
    clearIcon,
    openIndicator,
    noOptionsText = 'no options',
    loadingText = 'loading ...',
    getOptionKey = GET_OPTION_KEY,
    isOptionEqualToValue = IS_OPTION_EQUAL_TO_VALUE,
    getOptionLabel = GET_OPTION_LABEL,
    getOptionId = GET_OPTION_ID,
    disableClearable,
    ...inputProps
  } = props;

  const [value, setValue] = useControllableState<
    Value | Value[] | null,
    Reason
  >({
    defaultValue,
    value: valueProp,
    onChange: (value, reason) => {
      if (!reason)
        throw new GistUiError(
          'Autocomplete',
          'internal Error, reason is not defined',
        );

      if (multiple && Array.isArray(value)) {
        onChange?.(value, reason);
        return;
      }

      if (!multiple && !Array.isArray(value)) {
        if (value && disableClearable) {
          onChange?.(value, reason);
          return;
        }

        if (!disableClearable) {
          onChange?.(value, reason);
          return;
        }
      }
    },
  });

  const inputRef = useRef<HTMLDivElement>(null);
  const [options, setOptions] = useState(optionsProp);
  const [focused, setFocused] = useState<Value | null>(null);
  const [groupedOptions, setgroupedOptions] = useState<
    [string, Value[]][] | null
  >(null);

  const lisboxId = useId();

  const state = useRef<{
    searchedString: string;
    searchedStringTimer?: ReturnType<typeof setTimeout>;
  }>({
    searchedString: '',
  }).current;

  const [open, setOpen] = useControllableState({
    defaultValue: defaultOpen,
    value: openProp,
    onChange: onOpenChange,
  });

  const handleListboxClose = useCallback(() => {
    setOpen(false);
    setFocused(null);
  }, [setOpen]);

  const setOutsideEle = useClickOutside<HTMLUListElement>({
    isDisabled: !open,
    onEvent: 'pointerdown',
    callback: (e) => {
      if (inputRef.current?.contains(e.target as Node)) return;
      handleListboxClose();
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
    if (open) return;

    setOpen(true);

    if (!options?.length) return;

    if (!value) {
      const index = getNextIndex(0);
      if (index >= 0) setFocused(options[index]);
      return;
    }

    if (multiple && isMultiple<Value>(value) && value.length) {
      setFocused(value[0]);
      return;
    }

    if (!multiple && isSingle<Value>(value)) {
      setFocused(value);
      return;
    }
  }, [getNextIndex, multiple, open, options, setOpen, value]);

  const handleOptionHover = useCallback(
    (option: Value) => () => {
      setFocused(option);
    },
    [],
  );

  const handleOptionSelect = useCallback(
    (option: Value) => () => {
      //

      if (multiple && isMultiple<Value>(value)) {
        const val = value.find((ele) => ele === option)
          ? value.filter((ele) => ele !== option)
          : [...value, option];

        setValue(val, 'select');
        setFocused(option);
      }

      if (!multiple) {
        setValue(option, 'select');
        handleListboxClose();
      }
    },
    [handleListboxClose, multiple, setValue, value],
  );

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // handle any printable character
      if (e.key.length === 1 && options?.length) {
        setOpen(true);

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
            : getOptionLabel(ele).toLowerCase().startsWith(filter),
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
              : getOptionLabel(ele).toLowerCase().startsWith(filter[0]),
          );

          if (matched) {
            setFocused(matched);
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

      if (Escape && open) {
        handleListboxClose();
        return;
      }

      if (ArrowDown && !open) {
        handleListboxOpen();
        return;
      }

      if (!options) return;

      if (Enter && open && focused) {
        handleOptionSelect(focused)();
        return;
      }

      if (ArrowDown && open && focused) {
        const index = getNextIndex(options.indexOf(focused) + 1);
        if (index >= 0) setFocused(options[index]);

        return;
      }

      if (ArrowUp && open && focused) {
        const index = getPreviousIndex(options.indexOf(focused) - 1);
        if (index >= 0) setFocused(options[index]);

        return;
      }

      if (Home) {
        setOpen(true);

        const index = getNextIndex(0);
        if (index >= 0) setFocused(options[index]);

        return;
      }

      if (End) {
        setOpen(true);

        const index = getPreviousIndex(options.length - 1);
        if (index >= 0) setFocused(options[index]);

        return;
      }
    },
    [
      focused,
      getNextIndex,
      getOptionDisabled,
      getOptionLabel,
      getPreviousIndex,
      handleListboxClose,
      handleListboxOpen,
      handleOptionSelect,
      open,
      options,
      setOpen,
      state,
    ],
  );

  const handleClearValue = useCallback(() => {
    setOpen(true);
    setFocused(null);
    inputRef.current?.focus();

    if (multiple) {
      setValue([], 'clear');
    } else {
      setValue(null, 'clear');
    }
  }, [multiple, setOpen, setValue]);

  useEffect(() => {
    return () => {
      clearTimeout(state.searchedStringTimer);
    };
  }, [state]);

  useEffect(() => {
    if (!groupBy) return;

    const grouped = Object.entries(
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

    setgroupedOptions(grouped);
    setOptions(grouped.reduce<Value[]>((acc, ele) => [...acc, ...ele[1]], []));
  }, [groupBy, options]);

  const styles = select({
    shadow,
    grouped: !!groupBy,
  });

  const __renderOption = (option: Value) => {
    const isDisabled = getOptionDisabled?.(option) ?? false;
    const isFocused = focused === option;
    const isSelected =
      (multiple &&
        isMultiple<Value>(value) &&
        !!value.find((ele) => isOptionEqualToValue(ele, option))) ||
      (!multiple &&
        isSingle<Value>(value) &&
        isOptionEqualToValue(value, option));

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

  const startContentSelected =
    multiple &&
    isMultiple(value) &&
    (value.length ? `${value.length} selected` : null);

  return (
    <Popper.Root>
      <Popper.Reference>
        <Input
          {...inputProps}
          value={
            !multiple && isSingle<Value>(value) ? getOptionLabel(value) : ''
          }
          isDisabled={isDisabled}
          ref={inputRef}
          onPointerDown={handleListboxOpen}
          classNames={{
            ...classNames,
            input: styles.input({ className: classNames?.input }),
            inputWrapper: styles.inputWrapper({
              className: classNames?.inputWrapper,
            }),
          }}
          inputProps={{
            ...inputProps.inputProps,
            onKeyDown: handleInputKeyDown,
            'aria-expanded': open,
            'aria-controls': lisboxId,
            'aria-haspopup': 'listbox',
            'aria-autocomplete': 'none',
            role: 'combobox',
            autoComplete: 'off',
            readOnly: true,
          }}
          startContent={
            startContent ? (
              <>
                {startContent}
                {startContentSelected}
              </>
            ) : (
              startContentSelected
            )
          }
          endContent={
            <>
              {((multiple && value && isMultiple(value) && value.length) ||
                (!multiple && value)) &&
                !disableClearable && (
                  <Button
                    isIconOnly
                    size="sm"
                    variant="text"
                    color="neutral"
                    preventFocusOnPress
                    tabIndex={-1}
                    onPress={handleClearValue}
                  >
                    <div>
                      {clearIcon || (
                        <svg
                          width={18}
                          height={18}
                          viewBox="-2.4 -2.4 28.80 28.80"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          stroke="currentColor"
                          transform="rotate(0)"
                        >
                          <g strokeWidth="0"></g>
                          <g strokeLinecap="round" strokeLinejoin="round"></g>
                          <g>
                            <path
                              d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
                              fill="currentColor"
                            ></path>
                          </g>
                        </svg>
                      )}
                    </div>
                  </Button>
                )}

              <div
                data-open={open}
                className={styles.openIndicator({
                  className: classNames?.openIndicator,
                })}
              >
                {openIndicator || (
                  <svg
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g strokeWidth="0"></g>
                    <g strokeLinecap="round" strokeLinejoin="round"></g>
                    <g>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.00003 8.5C6.59557 8.5 6.23093 8.74364 6.07615 9.11732C5.92137 9.49099 6.00692 9.92111 6.29292 10.2071L11.2929 15.2071C11.6834 15.5976 12.3166 15.5976 12.7071 15.2071L17.7071 10.2071C17.9931 9.92111 18.0787 9.49099 17.9239 9.11732C17.7691 8.74364 17.4045 8.5 17 8.5H7.00003Z"
                        fill="currentColor"
                      ></path>
                    </g>
                  </svg>
                )}
              </div>
              {endContent}
            </>
          }
        />
      </Popper.Reference>

      {open && (
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
            aria-multiselectable={multiple}
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

Select.displayName = 'gist-ui.Select';

export default Select;

// ********** utils **********

const isMultiple = <V,>(value: unknown): value is V[] => {
  if (Array.isArray(value)) return true;

  return false;
};

const isSingle = <V,>(value: unknown): value is V => {
  if (!value) return false;

  if (!Array.isArray(value)) return true;

  return false;
};
