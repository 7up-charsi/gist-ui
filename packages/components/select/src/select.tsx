import * as Popper from '@gist-ui/popper';
import { CustomInputElement, Input, InputProps } from '@gist-ui/input';
import { SelectClassNames, SelectVariantProps, select } from '@gist-ui/theme';
import { useCallbackRef } from '@gist-ui/use-callback-ref';
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

export interface SelectProps
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
  defaultValue?: SelectOption;
  value?: SelectOption | null;
  onChange?: (value: SelectOption | null, reason: 'select' | 'clear') => void;
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

const GET_OPTION_LABEL = (option: SelectOption) => option.label;
const GET_OPTION_ID = (option: SelectOption) => option.label;

const Select = forwardRef<CustomInputElement, SelectProps>((props, ref) => {
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
    onChange: onChangeProp,
    getOptionKey,
    renderOption,
    shadow,
    isDisabled,
    getOptionLabel = GET_OPTION_LABEL,
    getOptionId = GET_OPTION_ID,
    ...inputProps
  } = props;

  const onChange = useCallbackRef(onChangeProp);

  const [value, setValue] = useControllableState<
    SelectOption | null | undefined,
    'select' | 'clear'
  >({
    defaultValue,
    value: valueProp,
    onChange: (value, payload) => {
      onChange?.(value || null, payload!);
    },
  });

  const inputRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>();
  const lisboxId = useId();
  const state = useRef<{
    selectedIndex?: number;
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

      return currentIndex;
    },
    [getOptionDisabled, options],
  );

  const handleListboxOpen = useCallback(() => {
    setIsOpen(true);

    if (!isOpen && !value && !focusedIndex) {
      const index = getNextIndex(0);
      setFocusedIndex(index);
    }
  }, [focusedIndex, getNextIndex, isOpen, setIsOpen, value]);

  const handleOptionHover = useCallback(
    (index: number) => () => {
      setFocusedIndex(index);
    },
    [],
  );

  const handleOptionSelect = useCallback(
    ({ index, option }: OptionSelectProps) =>
      () => {
        setFocusedIndex(index);
        setValue(option);
        setIsOpen(false);

        state.selectedIndex = index;
      },
    [setIsOpen, setValue, state],
  );

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const ArrowDown = e.key === 'ArrowDown';
      const Escape = e.key === 'Escape';

      if (ArrowDown && !isOpen) {
        setIsOpen(true);
        if (!value && !focusedIndex) {
          const index = getNextIndex(0);
          setFocusedIndex(index);
        }

        return;
      }

      if (Escape && isOpen) {
        setIsOpen(false);
        setFocusedIndex(state.selectedIndex);

        return;
      }
      if (Escape && !isOpen) {
        setValue(null);
        setFocusedIndex(undefined);
        state.selectedIndex = undefined;

        return;
      }

      if (e.key.length === 1 && options) {
        clearTimeout(state.searchedStringTimer);

        state.searchedStringTimer = setTimeout(() => {
          state.searchedString = '';
        }, 500);

        state.searchedString += e.key;

        const startIndex =
          focusedIndex || focusedIndex === 0 ? focusedIndex + 1 : 0;

        const orderedOptions = [
          ...options.slice(startIndex),
          ...options.slice(0, startIndex),
        ];

        const filter = state.searchedString.toLowerCase();

        const excatMatch = orderedOptions.find((ele) =>
          ele.label.toLowerCase().startsWith(filter),
        );

        if (excatMatch) {
          const isDisabled = getOptionDisabled?.(excatMatch);

          if (!isDisabled) setFocusedIndex(options.indexOf(excatMatch));

          return;
        }

        const sameLetters = filter
          .split('')
          .every((letter) => letter.toLowerCase() === filter[0]);

        if (sameLetters) {
          const matched = orderedOptions.find((ele) => {
            return ele.label.toLowerCase().startsWith(filter[0]);
          });

          if (matched) {
            const isDisabled = getOptionDisabled?.(matched);

            if (!isDisabled) setFocusedIndex(options.indexOf(matched));
          } else {
            clearTimeout(state.searchedStringTimer);
            state.searchedString = '';
          }

          return;
        }

        return;
      }
    },
    [
      focusedIndex,
      getNextIndex,
      getOptionDisabled,
      isOpen,
      options,
      setIsOpen,
      setValue,
      state,
      value,
    ],
  );

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
            value={value ? getOptionLabel(value) : ''}
            isDisabled={isDisabled}
            ref={mergeRefs(ref, inputRef)}
            onPointerDown={handleListboxOpen}
            inputProps={{
              ...inputProps.inputProps,
              onKeyDown: handleInputKeyDown,
              'aria-expanded': isOpen,
              'aria-controls': lisboxId,
              'aria-haspopup': 'listbox',
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
                      setValue(null);
                      setFocusedIndex(undefined);
                      inputRef.current?.focus();
                      state.selectedIndex = undefined;
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
                focusedIndex && options?.[focusedIndex]
                  ? getOptionId(options[focusedIndex]).replaceAll(' ', '-')
                  : undefined
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
                        isSelected={value?.label === option.label}
                        isFocused={focusedIndex === index}
                        label={getOptionLabel(option) ?? option.label}
                        onSelect={handleOptionSelect({ index, option })}
                        onHover={handleOptionHover(index)}
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
});

Select.displayName = 'gist-ui.Select';

export default Select;
