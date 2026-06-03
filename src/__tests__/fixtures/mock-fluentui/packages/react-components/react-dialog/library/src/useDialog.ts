/**
 * Mock useDialog hook for scraper default-value extraction testing.
 * Mimics the real FluentUI useDialog.ts structure.
 */

import type { DialogProps } from './Dialog.types';

/**
 * Create the state required to render Dialog.
 *
 * @param props - Dialog props from the user
 * @returns Dialog state
 */
export const useDialog_unstable = (props: DialogProps) => {
  const {
    modalType = 'modal',
    open,
    defaultOpen = false,
    onOpenChange,
    ...rest
  } = props;

  return {
    modalType,
    open: open ?? defaultOpen,
    onOpenChange,
    ...rest,
  };
};
