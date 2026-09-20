/**
 * Mock SplitButton type definitions for scraper coverage testing.
 */

export type SplitButtonProps = {
  /**
   * Whether the button is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * The label of the primary action section.
   */
  primaryActionContent?: string;
};

export type SplitButtonSlots = {
  /** The root element of the button. */
  root: 'button';
  /** The primary action slot. */
  primaryAction: 'button';
};
