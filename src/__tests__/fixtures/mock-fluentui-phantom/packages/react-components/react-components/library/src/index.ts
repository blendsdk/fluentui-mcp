/**
 * Mock stable exports index for the phantom-component regression fixture.
 *
 * Only `Widget` is a public component export. `useThing` is a hook, and the
 * preview package is intentionally absent because it is not re-exported.
 */

export { Widget } from '@fluentui/react-widget';
export type { WidgetProps, WidgetSlots } from '@fluentui/react-widget';

export { useThing } from '@fluentui/react-thing';
