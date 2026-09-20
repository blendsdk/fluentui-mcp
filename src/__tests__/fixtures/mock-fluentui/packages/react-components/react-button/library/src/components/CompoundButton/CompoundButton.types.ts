/**
 * Mock CompoundButton type definitions for scraper coverage testing.
 */

export type CompoundButtonProps = {
  /**
   * The text displayed as the secondary content.
   * @default ''
   */
  secondaryContent?: string;

  /**
   * Whether the button is disabled.
   * @default false
   */
  disabled?: boolean;
};

export type CompoundButtonSlots = {
  /** The root element of the button. */
  root: 'button';
  /** The primary content slot. */
  contentContainer: 'span';
};
