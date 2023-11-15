type FocusableTarget = HTMLElement | { focus(): void };

export const focusFirst = (candidates: HTMLElement[], { select = false } = {}) => {
  const previouslyFocusedElement = document.activeElement;
  for (const candidate of candidates) {
    focus(candidate, { select });
    if (document.activeElement !== previouslyFocusedElement) return;
  }
};

export const getTabbableEdges = (container: HTMLElement) => {
  const candidates = getTabbables(container);
  const first = findVisible(candidates, container);
  const last = findVisible(candidates.reverse(), container);
  return [first, last] as const;
};

export const getTabbables = (container: HTMLElement) => {
  const nodes: HTMLElement[] = [];

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node: HTMLElement) => {
      const isHiddenInput = node.tagName === "INPUT" && node.hidden;
      if ((node as unknown as { disabled: boolean }).disabled || node.hidden || isHiddenInput)
        return NodeFilter.FILTER_SKIP;

      return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    },
  });

  while (walker.nextNode()) nodes.push(walker.currentNode as HTMLElement);

  return nodes;
};

export const findVisible = (elements: HTMLElement[], container: HTMLElement) => {
  return elements.find((ele) => !isHidden(ele, { upTo: container }));
};

export const isHidden = (node: HTMLElement, { upTo }: { upTo?: HTMLElement } = {}) => {
  if (getComputedStyle(node).visibility === "hidden") return true;
  if (getComputedStyle(node).display === "none") return true;

  let _node = node;

  while (_node) {
    if (upTo !== undefined && _node === upTo) return false;
    if (getComputedStyle(_node).visibility === "hidden") return true;
    if (getComputedStyle(_node).display === "none") return true;

    _node = _node.parentElement as HTMLElement;
  }

  return false;
};

export const isSelectableInput = (
  element: FocusableTarget,
): element is FocusableTarget & { select(): void } => {
  return element instanceof HTMLInputElement && "select" in element;
};

export const focus = (element: FocusableTarget, { select }: { select?: boolean } = {}) => {
  if (element && element.focus) {
    const previousFocusedElement = document.activeElement;

    element.focus({ preventScroll: true });

    if (element !== previousFocusedElement && isSelectableInput(element) && select) {
      element.select();
    }
  }
};
