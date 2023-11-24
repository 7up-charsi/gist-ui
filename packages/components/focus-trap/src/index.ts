import * as focusTrap from "./focus-trap";
import * as focusTrapScope from "./scope-provider";
import * as utils from "./utils";

// export types
export type { FocusTrapProps } from "./focus-trap";
export type { FocusTrapScope } from "./scope-provider";

// export component
export const FocusTrapScopeProvider = focusTrapScope.FocusTrapScopeProvider;
export const FocusTrapScopeContext = focusTrapScope.FocusTrapScopeContext;

export const FocusTrap = focusTrap.default;

export const firstTabbable = utils.firstTabbable;
export const focus = utils.focus;
export const focusFirst = utils.focusFirst;
export const getTabbableEdges = utils.getTabbableEdges;
export const getTabbables = utils.getTabbables;
export const isHidden = utils.isHidden;
export const lastTabbable = utils.lastTabbable;
export const removeLinks = utils.removeLinks;
