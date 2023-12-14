type FocusableTarget = HTMLElement | { focus(): void };

export const focusFirst = (
  elements: HTMLElement[],
  { select = false } = {},
) => {
  const previouslyFocusedElement = document.activeElement;
  for (const ele of elements) {
    focus(ele, { select });

    // if statement is true, then focus moved
    if (document.activeElement !== previouslyFocusedElement) return;
  }
};

export const getTabbableEdges = (container: HTMLElement) => {
  const tabbables = getTabbables(container);
  const first = tabbables.find((ele) => !isHidden(ele, { upTo: container }));
  const last = tabbables
    .reverse()
    .find((ele) => !isHidden(ele, { upTo: container }));
  return [first, last] as const;
};

export const firstTabbable = (container: HTMLElement) => {
  const tabbables = getTabbables(container);
  return tabbables.find((ele) => !isHidden(ele, { upTo: container }));
};

export const lastTabbable = (container: HTMLElement) => {
  const tabbables = getTabbables(container);
  return tabbables.reverse().find((ele) => !isHidden(ele, { upTo: container }));
};

export const getTabbables = (container: HTMLElement) => {
  const nodes: HTMLElement[] = [];

  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_ELEMENT,
    (node) => {
      if (!(node instanceof HTMLElement)) return NodeFilter.FILTER_REJECT;

      if (
        (node as unknown as { disabled: boolean }).disabled ||
        node.hidden ||
        (node.tagName === "INPUT" && node.hidden)
      )
        return NodeFilter.FILTER_SKIP;

      return node.tabIndex >= 0
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP;
    },
  );

  while (walker.nextNode()) nodes.push(walker.currentNode as HTMLElement);

  return nodes;
};

export const isHidden = (
  node: HTMLElement,
  { upTo }: { upTo?: HTMLElement } = {},
) => {
  if (getComputedStyle(node).visibility === "hidden") return true;

  let _node = node;

  while (_node) {
    if (upTo !== undefined && _node === upTo) return false;
    if (getComputedStyle(_node).display === "none") return true;

    _node = _node.parentElement as HTMLElement;
  }

  return false;
};

export const focus = (
  element: FocusableTarget | null,
  { select }: { select?: boolean } = {},
) => {
  if (element && element.focus) {
    const previousFocusedElement = document.activeElement;

    element.focus({ preventScroll: true });

    if (
      element !== previousFocusedElement &&
      element instanceof HTMLInputElement &&
      "select" in element &&
      select
    ) {
      element.select();
    }
  }
};

export const removeLinks = (elements: HTMLElement[]) =>
  elements.filter((ele) => ele.tagName !== "A");
