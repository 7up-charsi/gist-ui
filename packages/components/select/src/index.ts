import * as select from "./select";
import * as multipleSelect from "./multiple-select";

// export types
export type { SelectProps, RenderOptionProps, SelectOption } from "./select";
export type { MultipleSelectProps } from "./multiple-select";

// export component
export const Select = select.default;
export const MultipleSelect = multipleSelect.default;
