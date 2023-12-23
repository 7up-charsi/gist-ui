import * as popover from './popover';

export { Arrow } from '@gist-ui/popper';

// export types
export type {
  RootProps,
  TriggerProps,
  CloseProps,
  ContentProps,
  PortalProps,
} from './popover';

// export component
export const Root = popover.Root;
export const Trigger = popover.Trigger;
export const Close = popover.Close;
export const Portal = popover.Portal;
export const Content = popover.Content;
