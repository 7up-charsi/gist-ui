import { Input, InputProps } from '@gist-ui/input';
import { PopperProps } from '@gist-ui/popper';
import { SelectClassNames, SelectVariantProps } from '@gist-ui/theme';

export interface onSelectProps {
  option: SelectOption;
  isDisabled: boolean;
  index: number;
}

export type SelectOption = {
  label: string;
  value: string;
};

export type RenderOptionProps = {
  option: SelectOption;
  label: string;
  state: {
    isPressed: boolean;
    isHovered: boolean;
    isDisabled: boolean;
    isSelected: boolean;
    isFocused: boolean;
  };
};

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
  offset?: PopperProps.FloatingProps['mainOffset'];
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
  isOptionEqualToValue?: (
    option: SelectOption,
    value?: SelectOption | null,
  ) => boolean;
  defaultValue?: SelectOption;
  value?: SelectOption | null;
  onChange?: (value: SelectOption | null, reason: 'select' | 'clear') => void;
  renderOption?: (props: RenderOptionProps) => React.ReactNode;
  /**
   * @default option.label
   */
  getOptionLabel?: (option: SelectOption) => string;
}

const GET_OPTION_LABEL = (option: SelectOption) => option.label;

const Select = (props: SelectProps) => {
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
    isOptionEqualToValue,
    renderOption,
    getOptionLabel = GET_OPTION_LABEL,
    shadow,
    isDisabled,
    ...inputProps
  } = props;

  return <Input />;
};

export default Select;
