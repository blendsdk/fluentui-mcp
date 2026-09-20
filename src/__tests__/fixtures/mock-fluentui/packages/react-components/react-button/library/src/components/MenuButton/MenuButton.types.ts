/**
 * Mock MenuButton type definitions for scraper coverage testing.
 */

export type MenuButtonProps = {
  /**
   * Whether the button is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * The menu content rendered when the button is pressed.
   */
  menu?: unknown;
};

export type MenuButtonSlots = {
  /** The root element of the button. */
  root: 'button';
};
