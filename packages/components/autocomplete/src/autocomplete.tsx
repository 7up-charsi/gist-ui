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

export interface AutocompleteOption {
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

export type FilterOptions<V> = (props: {
  options: V[];
  inputValue: string;
}) => V[];

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
   * If inputValue is defined then this will behave as controlled.
   */
  inputValue?: string;
  onInputChange?: (value: string) => void;
  filterOptions?: FilterOptions<V>;
}

export type AutocompleteProps<M, V> = M extends true
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

const GET_OPTION_LABEL = (option: AutocompleteOption) => option.label || '';
const GET_OPTION_ID = (option: AutocompleteOption) => option.label;

const Autocomplete = <
  M extends boolean = false,
  V extends AutocompleteOption = AutocompleteOption,
>(
  props: AutocompleteProps<M, V>,
  ref: React.ForwardedRef<CustomInputElement>,
) => {
  const {
    options: optionsProp,
    classNames,
    offset,
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
    inputValue: inputValueProp,
    onInputChange,
    getOptionDisabled,
    filterOptions,
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
  const [options, setOptions] = useState(optionsProp);
  const [isInputActive, setIsInputActive] = useState(false);

  const lisboxId = useId();

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
    setOptions(optionsProp);
    setIsInputActive(false);
    setInputValue('');
  }, [optionsProp, setInputValue, setIsOpen]);

  const setOutsideEle = useClickOutside<HTMLUListElement>({
    isDisabled: !isOpen,
    onEvent: 'pointerdown',
    callback: (e) => {
      if (inputRef.current?.contains(e.target as Node)) return;
      handleListboxClose();
    },
  });

  const getNextIndex = useCallback(
    (currentIndex: number, options: V[]) => {
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
    (currentIndex: number, options: V[]) => {
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

    if (!value && options?.length) {
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
    (option: V) => () => {
      setFocused(option);
    },
    [],
  );

  const clearValue = useCallback(
    (reason: Reason) => {
      setInputValue('');

      if (multiple) {
        onChange?.([], reason);
        setInternalValue([]);
      } else {
        onChange?.(null, reason);
        setInternalValue(null);
      }
    },
    [multiple, onChange, setInputValue],
  );

  const handleOptionSelect = useCallback(
    (option: V) => () => {
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
      if (!options?.length) return;

      const ArrowDown = e.key === 'ArrowDown';
      const ArrowUp = e.key === 'ArrowUp';
      const Escape = e.key === 'Escape';
      const Enter = e.key === 'Enter';

      if (ArrowDown || ArrowUp) e.preventDefault();

      if (Escape && isOpen) {
        handleListboxClose();
        return;
      }

      if (Enter && isOpen && focused) {
        handleOptionSelect(focused)();
        return;
      }

      if (ArrowDown && !isOpen) {
        handleListboxOpen();
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
      handleListboxClose,
      handleListboxOpen,
      handleOptionSelect,
      isOpen,
      options,
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
          options.filter((opt) => opt.label?.includes(inputValue)));

      const opts = val
        ? filter({ options: optionsProp, inputValue: val })
        : optionsProp;

      const index = getNextIndex(0, opts);
      if (index >= 0) setFocused(opts[index]);

      setOptions(opts);
      setFocused(opts[index]);
    },
    [filterOptions, getNextIndex, optionsProp, setInputValue, setIsOpen],
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

  const styles = select({
    shadow,
  });

  return (
    <Popper.Root>
      <Popper.Reference>
        <Input
          {...inputProps}
          value={isInputActive ? inputValue : getInputValue()}
          onChange={handleInputChange}
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
                !isInputActive && (
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
                const isDisabled = getOptionDisabled?.(option) ?? false;
                const isFocused = focused === option;
                const isSelected = multiple
                  ? !!value &&
                    isMultiple(value) &&
                    !!value.find((ele) => ele === option)
                  : value === option;

                return (
                  <Fragment
                    key={getOptionKey ? getOptionKey(option) : option.label}
                  >
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
  );
};

Autocomplete.displayName = 'gist-ui.Autocomplete';

export default forwardRef(Autocomplete) as <
  M extends boolean = false,
  V extends AutocompleteOption = AutocompleteOption,
>(
  props: AutocompleteProps<M, V> & {
    ref?: React.ForwardedRef<CustomInputElement>;
  },
) => ReturnType<typeof Autocomplete>;

// ********** utils **********

const isMultiple = (
  value: AutocompleteOption | AutocompleteOption[],
): value is AutocompleteOption[] => true;

const isSingle = (
  value: AutocompleteOption | AutocompleteOption[],
): value is AutocompleteOption => true;
