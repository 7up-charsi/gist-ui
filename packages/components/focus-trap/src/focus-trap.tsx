import { forwardRef } from "react";

export interface FocusTrapProps {}

const FocusTrap = forwardRef<HTMLDivElement, FocusTrapProps>((props, ref) => {
  return <div>FocusTrap</div>;
});

FocusTrap.displayName = "gist-ui.FocusTrap";

export default FocusTrap;
