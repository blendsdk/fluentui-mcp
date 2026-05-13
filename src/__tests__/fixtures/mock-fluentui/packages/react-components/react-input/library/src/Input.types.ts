/**
 * Mock Input type definitions for scraper testing.
 * Mimics the real FluentUI Input.types.ts structure.
 */

import type { ComponentProps, ComponentState, Slot } from '@fluentui/react-utilities';

/**
 * InputProps — Props for the Input component.
 */
export type InputProps = Omit<ComponentProps<InputSlots>, 'onChange'> & {
  /**
   * Controls the colors and borders of the input.
   * @default 'outline'
   */
  appearance?: 'outline' | 'underline' | 'filled-darker' | 'filled-lighter';

  /**
   * Default value of the input (uncontrolled).
   */
  defaultValue?: string;

  /**
   * Whether the input is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Callback when the input value changes.
   */
  onChange?: (ev: React.ChangeEvent<HTMLInputElement>, data: { value: string }) => void;

  /**
   * A input supports different sizes.
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * The type of the input element.
   * @default 'text'
   */
  type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url';

  /**
   * Controlled value of the input.
   */
  value?: string;
};

/**
 * InputSlots — Slot definitions for Input.
 */
export type InputSlots = {
  /** The root wrapper element (usually a span). */
  root: NonNullable<Slot<'span'>>;

  /** The actual <input> element. */
  input: NonNullable<Slot<'input'>>;

  /** Content rendered before the input text. */
  contentBefore?: Slot<'span'>;

  /** Content rendered after the input text. */
  contentAfter?: Slot<'span'>;
};

/**
 * InputState — State for the Input component.
 */
export type InputState = ComponentState<InputSlots> & {
  appearance: NonNullable<InputProps['appearance']>;
  size: NonNullable<InputProps['size']>;
};
