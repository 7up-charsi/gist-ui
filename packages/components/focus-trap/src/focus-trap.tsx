import { useCallbackRef } from "@gist-ui/use-callback-ref";
import { FocusTrapScope, FocusTrapScopeContext } from "./scope-provider";
import { focus, focusFirst, getTabbableEdges, getTabbables, removeLinks } from "./utils";
import { mergeRefs } from "@gist-ui/react-utils";
import {
  ElementType,
  HTMLAttributes,
  KeyboardEvent,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export interface FocusTrapProps extends HTMLAttributes<HTMLDivElement> {
  loop?: boolean;
  trapped?: boolean;
  onMountAutoFocus?: (event: Event) => void;
  onUnmountAutoFocus?: (event: Event) => void;
  as?: ElementType;
}

const AUTOFOCUS_ON_MOUNT = "focusTrapScope.autoFocusOnMount";
const AUTOFOCUS_ON_UNMOUNT = "focusTrapScope.autoFocusOnUnmount";
const EVENT_OPTIONS = { bubbles: false, cancelable: true };

const FocusTrap = forwardRef<HTMLDivElement, FocusTrapProps>((props, ref) => {
  const {
    loop = true,
    trapped = true,
    onMountAutoFocus: onMountAutoFocusProp,
    onUnmountAutoFocus: onUnmountAutoFocusProp,
    as: FocusTrapComp = "div",
    ...restProps
  } = props;

  const [container, setContainer] = useState<HTMLElement | null>(null);
  const onMountAutoFocus = useCallbackRef(onMountAutoFocusProp);
  const onUnmountAutoFocus = useCallbackRef(onUnmountAutoFocusProp);

  const lastFocusedElement = useRef<HTMLElement | null>(null);

  const focusScopeContext = useContext(FocusTrapScopeContext);

  const focusScope = useRef<FocusTrapScope>({
    paused: false,
    pause() {
      this.paused = true;
    },
    resume() {
      this.paused = false;
    },
  }).current;

  useEffect(() => {
    if (!trapped) return;

    const handleFocusIn = (e: FocusEvent) => {
      if (focusScope.paused || !container) return;
      const target = e.target as HTMLElement | null;
      if (container.contains(target)) {
        lastFocusedElement.current = target;
      } else {
        focus(lastFocusedElement.current, { select: true });
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      if (focusScope.paused || !container) return;
      const relatedTarget = e.relatedTarget as HTMLElement | null;

      // if relatedTarget is null
      // its mean either browser loosed focus or user clicked at non-focusable element
      // in both cases we dont need to do any action
      if (relatedTarget === null) return;

      // if relatedTarget is not null its mean another element got focus and we need to check
      // if container does not contain it then return focus back to lastFocusedELement in container
      if (!container.contains(relatedTarget)) {
        focus(lastFocusedElement.current, { select: true });
      }
    };

    // When the focused element gets removed from the DOM, browsers move focus
    // back to the document.body. In this case, we move focus to the container
    // to keep focus trapped correctly.
    const handleMutations = (mutations: MutationRecord[]) => {
      const focusedElement = document.activeElement as HTMLElement | null;
      if (focusedElement !== document.body) return;

      for (const mutation of mutations) {
        if (mutation.removedNodes.length > 0) focus(container);
      }
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    const mutationObserver = new MutationObserver(handleMutations);
    if (container) mutationObserver.observe(container, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
      mutationObserver.disconnect();
    };
  }, [container, focusScope.paused, trapped]);

  useEffect(() => {
    if (!container) return;

    focusScopeContext?.add(focusScope);

    const prevFocusedElement = document.activeElement as HTMLElement | null;
    const hasFocusedElement = container.contains(prevFocusedElement);

    if (!hasFocusedElement) {
      const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS);
      container.addEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
      container.dispatchEvent(mountEvent);
      if (!mountEvent.defaultPrevented) {
        focusFirst(removeLinks(getTabbables(container)), { select: true });
      }
      if (prevFocusedElement === document.activeElement) focus(container);
    }

    return () => {
      container.removeEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);

      const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS);
      container.addEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
      container.dispatchEvent(unmountEvent);
      if (!unmountEvent.defaultPrevented) {
        focus(prevFocusedElement ?? document.body, { select: true });
      }

      container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);

      focusScopeContext?.remove(focusScope);
    };
  }, [container, focusScope, focusScopeContext, onMountAutoFocus, onUnmountAutoFocus]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!loop && !trapped) return;
    if (focusScope.paused) return;

    const isTab = e.key === "Tab" && !e.altKey && !e.ctrlKey && !e.metaKey;
    const focusedElement = document.activeElement as HTMLElement | null;

    if (isTab && focusedElement) {
      const container = e.currentTarget as HTMLElement;
      const [first, last] = getTabbableEdges(container);

      if (!(first && last)) {
        if (focusedElement === container) e.preventDefault();
      } else {
        if (e.shiftKey && focusedElement === first) {
          if (loop) {
            e.preventDefault();

            focus(last, { select: true });
          }
        }
        if (!e.shiftKey && focusedElement === last) {
          if (loop) {
            e.preventDefault();
            focus(first, { select: true });
          }
        }
      }
    }
  };

  return (
    <FocusTrapComp
      tabIndex={-1}
      {...restProps}
      ref={mergeRefs(ref, setContainer)}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
        handleKeyDown(e);
        restProps.onKeyDown?.(e);
      }}
    />
  );
});

FocusTrap.displayName = "gist-ui.FocusTrap";

export default FocusTrap;
