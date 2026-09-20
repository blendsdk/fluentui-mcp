/**
 * Mock ProgressBar type definitions for scraper coverage testing.
 */

export type ProgressBarProps = {
  /**
   * The value of the progress bar between 0 and max.
   * @default 0
   */
  value?: number;

  /**
   * The maximum value of the progress bar.
   * @default 1
   */
  max?: number;

  /**
   * The thickness of the progress bar.
   * @default 'medium'
   */
  thickness?: 'medium' | 'large';
};

export type ProgressBarSlots = {
  /** The root element of the progress bar. */
  root: 'div';
  /** The track element behind the bar. */
  track: 'div';
  /** The filled bar element. */
  bar: 'div';
};
