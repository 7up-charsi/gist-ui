import * as select from "./select";
import * as multipleSelect from "./multiple-select";
import * as autocomplete from "./autocomplete";

// export types
export type { SelectProps, RenderOptionProps, SelectOption } from "./select";
export type { MultipleSelectProps } from "./multiple-select";
export type { AutoCompleteProps } from "./autocomplete";

// export component
export const Select = select.default;
export const MultipleSelect = multipleSelect.default;
export const AutoComplete = autocomplete.default;
