import { forwardRef } from "react";
import { Slot } from "@gist-ui/slot";

export interface VisuallyHiddenProps {
  children?: React.ReactNode;
  asChild?: boolean;
}

const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  (props, ref) => {
    const { asChild, children } = props;

    const Component = asChild ? Slot : "span";

    return (
      <Component
        ref={ref}
        tabIndex={-1}
        style={{
          position: "absolute",
          border: 0,
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
        }}
      >
        {children}
      </Component>
    );
  },
);

VisuallyHidden.displayName = "gist-ui.VisuallyHidden";

export default VisuallyHidden;
