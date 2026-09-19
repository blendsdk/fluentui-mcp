/**
 * Mock SearchBox type definitions for scraper coverage testing.
 */

export type SearchBoxProps = {
  /**
   * The placeholder text for the search input.
   * @default ''
   */
  placeholder?: string;

  /**
   * Whether the search box is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * The size of the search box.
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
};

export type SearchBoxSlots = {
  /** The root element of the search box. */
  root: 'div';
  /** The underlying input element. */
  input: 'input';
};
