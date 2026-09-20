/**
 * Mock DataGrid type definitions for scraper coverage testing.
 */

export type DataGridProps = {
  /**
   * The rows rendered by the grid.
   * @default []
   */
  items?: unknown[];

  /**
   * The column definitions for the grid.
   * @default []
   */
  columns?: unknown[];

  /**
   * Whether the grid rows are selectable.
   * @default false
   */
  selectionMode?: 'none' | 'single' | 'multiselect';
};

export type DataGridSlots = {
  /** The root element of the grid. */
  root: 'div';
  /** The table element. */
  table: 'table';
};
