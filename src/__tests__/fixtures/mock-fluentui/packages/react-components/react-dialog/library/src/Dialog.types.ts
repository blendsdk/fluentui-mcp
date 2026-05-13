/**
 * Mock Dialog type definitions for scraper testing.
 * Mimics the real FluentUI Dialog.types.ts structure.
 */

import type { ComponentProps, Slot } from '@fluentui/react-utilities';

/**
 * DialogProps — Props for the Dialog component.
 */
export type DialogProps = {
  /**
   * Controls the open/closed state of the dialog.
   */
  open?: boolean;

  /**
   * Default open state for uncontrolled usage.
   */
  defaultOpen?: boolean;

  /**
   * The type of modal behavior.
   * - modal: Blocks interaction outside the dialog (default)
   * - non-modal: Allows interaction outside
   * - alert: Like modal, but used for urgent messages
   * @default 'modal'
   */
  modalType?: 'modal' | 'non-modal' | 'alert';

  /**
   * Callback when the open state changes.
   */
  onOpenChange?: (event: DialogOpenChangeEvent, data: DialogOpenChangeData) => void;

  /**
   * Dialog content — typically DialogSurface.
   */
  children?: React.ReactNode;
};

/** Event type for dialog open changes */
export type DialogOpenChangeEvent = MouseEvent | KeyboardEvent;

/** Data passed to onOpenChange */
export type DialogOpenChangeData = {
  open: boolean;
  type: 'escapeKeyDown' | 'backdropClick' | 'triggerClick';
};

/**
 * DialogSurfaceProps — Props for the dialog surface.
 */
export type DialogSurfaceProps = ComponentProps<DialogSurfaceSlots>;

/**
 * DialogSurfaceSlots — Slot definitions for DialogSurface.
 */
export type DialogSurfaceSlots = {
  /** The root element. */
  root: NonNullable<Slot<'div'>>;

  /** Optional backdrop element behind the dialog. */
  backdrop?: Slot<'div'>;
};
