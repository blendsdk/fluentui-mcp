/**
 * Mock Button type definitions for scraper testing.
 * Mimics the real FluentUI Button.types.ts structure.
 */

import type { ComponentProps, ComponentState, Slot } from '@fluentui/react-utilities';

/**
 * ButtonProps — Props for the Button component.
 */
export type ButtonProps = ComponentProps<ButtonSlots> & {
  /**
   * A button can have its content and borders styled for greater emphasis or to be subtle.
   * @default 'secondary'
   */
  appearance?: 'primary' | 'secondary' | 'outline' | 'subtle' | 'transparent';

  /**
   * A button supports different sizes.
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Whether the button is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * When set, allows the button to be focusable even when disabled.
   * @default false
   */
  disabledFocusable?: boolean;

  /**
   * A button can format its icon to appear before or after its content.
   * @default 'before'
   */
  iconPosition?: 'before' | 'after';

  /**
   * A button can be styled to look like it has a shape.
   * @default 'rounded'
   */
  shape?: 'rounded' | 'circular' | 'square';
};

/**
 * ButtonSlots — Slot definitions for Button.
 */
export type ButtonSlots = {
  /** The root element of the button. */
  root: NonNullable<Slot<'button', 'a'>>;

  /** Icon that renders before or after the content. */
  icon?: Slot<'span'>;
};

/**
 * ButtonState — State for the Button component.
 */
export type ButtonState = ComponentState<ButtonSlots> & {
  appearance: NonNullable<ButtonProps['appearance']>;
  size: NonNullable<ButtonProps['size']>;
};
