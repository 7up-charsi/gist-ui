import * as focusTrap from "./focus-trap";
import * as focusTrapScope from "./scope-provider";

// export types
export type { FocusTrapProps } from "./focus-trap";
export type { FocusTrapScope, FocusTrapScopeContext } from "./scope-provider";

// export component
export const FocusTrapScopeProvider = focusTrapScope.default;
export const FocusTrap = focusTrap.default;
