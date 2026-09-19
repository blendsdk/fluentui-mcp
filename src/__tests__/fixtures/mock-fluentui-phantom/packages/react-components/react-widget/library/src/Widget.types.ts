/**
 * Mock Widget type definitions for the phantom-component regression fixture.
 */

export type WidgetProps = {
  /**
   * The text shown inside the widget.
   * @default ''
   */
  label?: string;

  /**
   * Whether the widget is disabled.
   * @default false
   */
  disabled?: boolean;
};

export type WidgetSlots = {
  /** The root element of the widget. */
  root: 'div';
};
