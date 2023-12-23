import * as Popper from '@gist-ui/popper';
import { CustomInputElement, Input, InputProps } from '@gist-ui/input';
import { SelectClassNames, SelectVariantProps, select } from '@gist-ui/theme';
import { mergeRefs } from '@gist-ui/react-utils';
import { Button } from '@gist-ui/button';
import omit from 'lodash.omit';
import pick from 'lodash.pick';
import { useControllableState } from '@gist-ui/use-controllable-state';
import { useClickOutside } from '@gist-ui/use-click-outside';
import { useFocusVisible } from '@react-aria/interactions';
import { Option } from './option';
import {
  Fragment,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { RenderOptionProps, SelectOption, onSelectProps } from './select';
import { GistUiError } from '@gist-ui/error';

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

const clearIcon = (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 14 14"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
    />
  </svg>
);

const inputPropsKeys = [
  'a11yFeedback',
  'classNames',
  'color',
  'isDisabled',
  'endContent',
  'error',
  'errorMessage',
  'fullWidth',
  'helperText',
  'hideLabel',
  'id',
  'inputProps',
  'label',
  'labelPlacement',
  'name',
  'onBlur',
  'onFocus',
  'placeholder',
  'required',
  'rounded',
  'size',
  'startContent',
  'type',
  'variant',
  'onHoverChange',
  'onHoverEnd',
  'onHoverStart',
] as const;

const variantPropsKeys = select.variantKeys.filter((e) => e !== 'rounded');

export interface MultipleSelectProps
  extends Omit<SelectVariantProps, 'rounded'>,
    Omit<
      InputProps,
      'defaultValue' | 'value' | 'onChange' | 'hideNativeInput'
    > {
  listboxRounded?: SelectVariantProps['rounded'];
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
  defaultValue?: SelectOption[];
  value?: SelectOption[];
  onChange?: (value: SelectOption[], reason: 'select' | 'clear') => void;
  renderOption?: (props: RenderOptionProps) => React.ReactNode;
  /**
   * @default option.label
   */
  getOptionLabel?: (option: SelectOption) => string;
}

const GET_OPTION_LABEL = (option: SelectOption) => option.label;

const MultipleSelect = forwardRef<CustomInputElement, MultipleSelectProps>(
  (_props, ref) => {
    const { isDisabled, ...inputProps } = pick(_props, ...inputPropsKeys);
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
      empltyText = 'no options',
      defaultOpen = false,
      defaultValue,
      value: valueProp,
      onChange,
      getOptionKey,
      renderOption,
      getOptionLabel = GET_OPTION_LABEL,
    } = props;

    const [isOpen, setIsOpen] = useControllableState({
      defaultValue: defaultOpen,
      value: isOpenProp,
      onChange: onOpenChange,
    });

    const [value, setValue] = useControllableState<
      SelectOption[],
      'select' | 'clear'
    >({
      defaultValue: () => {
        if (!defaultValue) return [];

        if (!Array.isArray(defaultValue))
          throw new GistUiError('Select', '`defaultValue` must be an array');

        return defaultValue;
      },
      value: valueProp,
      onChange: (value, payload) => {
        onChange?.(value, payload!);
      },
    });

    const [focused, setFocused] = useState<number | null>(null);
    const [focusedId, setFocusedId] = useState<string>();
    const [inputWrapper, setInputWrapper] = useState<HTMLDivElement | null>(
      null,
    );
    const inputFocused = useRef(inputProps.inputProps?.autoFocus || false);
    const arrowDownHandled = useRef(false);
    const selectedIndex = useRef<number | null>(null);

    const lisboxId = useId();

    const setOutsideEle = useClickOutside<HTMLDivElement>({
      isDisabled: !isOpen,
      onEvent: 'pointerdown',
      callback: (e) => {
        if (inputWrapper?.contains(e.target as Node)) return;
        setIsOpen(false);
        setFocused(selectedIndex.current);
      },
    });

    const { isFocusVisible } = useFocusVisible();

    const onSelect = useCallback(
      ({ option, isDisabled, index }: onSelectProps) =>
        () => {
          if (isDisabled) return;

          const isSelected = value.find((ele) => ele === option);
          const newValue = isSelected
            ? value.filter((ele) => ele !== option)
            : [...value, option];

          setValue(newValue, 'select');
          setFocused(index);

          selectedIndex.current = index;
        },
      [setValue, value],
    );

    const onFocus = useCallback(
      ({ isDisabled, index }: onSelectProps) =>
        () => {
          if (isDisabled) return;

          setFocused(index);
        },
      [],
    );

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

    const handleInputArrowDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (isDisabled) return;
        if (e.repeat) return;

        const ArrowDown = e.key === 'ArrowDown';

        if (ArrowDown) setIsOpen(true);

        if (isOpen) {
          arrowDownHandled.current = false;
        } else {
          arrowDownHandled.current = true;
        }
      },
      [isDisabled, isOpen, setIsOpen],
    );

    const handleFocus = useCallback(() => {
      inputFocused.current = true;

      if (!isFocusVisible) setIsOpen(true);
    }, [isFocusVisible, setIsOpen]);

    const handleBlur = useCallback(() => {
      inputFocused.current = false;

      if (isFocusVisible) {
        setIsOpen(false);
        setFocused(selectedIndex.current);
      }
    }, [isFocusVisible, setIsOpen]);

    const handleInputInteraction = useCallback(
      (e: React.PointerEvent) => {
        if (isDisabled) return;
        if (e.button !== 0) return;

        setIsOpen(true);
      },
      [isDisabled, setIsOpen],
    );

    const handleCaretDown = useCallback(() => {
      if (isDisabled) return;

      inputWrapper?.focus();
      setIsOpen((p) => !p);
    }, [inputWrapper, isDisabled, setIsOpen]);

    const handleClear = useCallback(() => {
      inputWrapper?.focus();

      setValue([], 'clear');
      setIsOpen(true);
      setFocused(null);
      selectedIndex.current = null;
    }, [inputWrapper, setIsOpen, setValue]);

    useEffect(() => {
      if (defaultValue?.length && options) {
        const index = options?.findIndex((ele) => ele === defaultValue.at(-1));

        if (index < 0) return;

        setFocused(index);
        selectedIndex.current = index;
      }
    }, [defaultValue, options]);

    useEffect(() => {
      if (!options) return;

      if (!isOpen) return;

      if (!value.length && !focused) {
        const index = getNextIndex(0);
        if (index !== undefined) setFocused(index);
      }

      const hanldeKeyDown = (e: KeyboardEvent) => {
        if (e.repeat) return;

        const ArrowUp = e.key === 'ArrowUp';
        const ArrowDown = e.key === 'ArrowDown';
        const Escape = e.key === 'Escape';
        const Home = e.key === 'Home';
        const End = e.key === 'End';

        if (Escape) {
          setFocused(selectedIndex.current);
          inputWrapper?.focus();
          setIsOpen(false);

          return;
        }

        if (arrowDownHandled.current) return;

        // hanlde ArrowDown when focused is at last option
        // also handle Home key
        if (Home || (ArrowDown && focused === options.length - 1)) {
          const index = getNextIndex(0);

          if (index !== undefined) setFocused(index);

          return;
        }

        // hanlde ArrowDown when focused is at any but not last option
        if (ArrowDown && focused !== null && focused !== options.length - 1) {
          const index = getNextIndex(focused + 1);

          if (index !== undefined) setFocused(index);

          return;
        }

        // hanlde ArrowUP when focused is at first option
        // also handle End key
        if (End || (ArrowUp && focused === 0)) {
          const index = getPreviousIndex(options.length - 1);
          if (index !== undefined) setFocused(index);

          return;
        }

        // hanlde ArrowUp when focused is at any but not first option
        if (ArrowUp && focused !== null && focused !== 0) {
          const index = getPreviousIndex(focused - 1);

          if (index !== undefined) setFocused(index);

          return;
        }
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        if (e.repeat) return;

        const Space = e.key === ' ';
        const Enter = e.key === 'Enter';

        if ((Space || Enter) && focused) {
          onSelect({
            option: options[focused],
            index: focused,
            isDisabled: false,
          })();

          return;
        }
      };

      document.addEventListener('keydown', hanldeKeyDown);
      document.addEventListener('keyup', handleKeyUp);

      return () => {
        document.removeEventListener('keydown', hanldeKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
      };
    }, [
      focused,
      getNextIndex,
      getPreviousIndex,
      inputWrapper,
      isOpen,
      onSelect,
      options,
      setIsOpen,
      value,
    ]);

    const styles = select({
      ...variantProps,
      rounded: listboxRounded,
      color: inputProps.color,
    });

    return (
      <>
        <Input
          {...inputProps}
          isDisabled={isDisabled}
          ref={mergeRefs(ref, setInputWrapper)}
          value={value.map(getOptionLabel).join(', ')}
          onChange={() => {}}
          hideNativeInput
          inputProps={{
            ...inputProps.inputProps,
            onPointerDown: handleInputInteraction,
            onKeyDown: handleInputArrowDown,
            'aria-expanded': isOpen,
            'aria-controls': lisboxId,
            'aria-haspopup': 'listbox',
            role: 'combobox',
            autoComplete: 'off',
            readOnly: true,
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          endContent={
            <div className={styles.endContent()}>
              {!value.length ? null : (
                <Button
                  isIconOnly
                  variant="text"
                  size="sm"
                  rounded="full"
                  aria-label="toggle listbox"
                  asChild
                  onPress={handleClear}
                >
                  <div>{clearIcon}</div>
                </Button>
              )}

              <Button
                isIconOnly
                variant="text"
                size="sm"
                rounded="full"
                aria-label="toggle listbox"
                asChild
                style={{ rotate: isOpen ? '180deg' : '0deg' }}
                onPress={handleCaretDown}
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
                className={styles.listbox({
                  className: listboxClassNames?.listbox,
                })}
                role="listbox"
                aria-activedescendant={focusedId}
                aria-roledescription="single select"
                style={{ maxHeight }}
              >
                {options?.length ? (
                  options.map((option, index) => {
                    const isDisabled = getOptionDisabled?.(option) || false;
                    const isSelected = !!value.find((ele) => ele === option);

                    return (
                      <Fragment
                        key={getOptionKey ? getOptionKey(option) : option.label}
                      >
                        <Option
                          option={option}
                          isDisabled={isDisabled}
                          isSelected={isSelected}
                          isFocused={focused === index}
                          className={styles.option({
                            className: listboxClassNames?.option,
                          })}
                          label={getOptionLabel(option)}
                          onSelect={onSelect({ index, isDisabled, option })}
                          onFocus={onFocus({ index, isDisabled, option })}
                          renderOption={renderOption}
                          setFocusedId={setFocusedId}
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
              </div>
            </Popper.Floating>
          )}
        </Popper.Root>
      </>
    );
  },
);

MultipleSelect.displayName = 'gist-ui.MultipleSelect';

export default MultipleSelect;
