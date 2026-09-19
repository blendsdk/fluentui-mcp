/**
 * Mock ToggleButton type definitions for scraper coverage testing.
 */

export type ToggleButtonProps = {
  /**
   * Whether the button is rendered in the checked state.
   * @default false
   */
  checked?: boolean;

  /**
   * Whether the button is disabled.
   * @default false
   */
  disabled?: boolean;
};

export type ToggleButtonSlots = {
  /** The root element of the button. */
  root: 'button';
};
