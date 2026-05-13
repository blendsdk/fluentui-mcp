/**
 * Mock useButton hook for scraper default-value extraction testing.
 * Mimics the real FluentUI useButton.ts structure.
 */

import type { ButtonProps, ButtonState } from './Button.types';

/**
 * Create the state required to render Button.
 * Merges props with defaults, resolves slots, and returns the state object.
 *
 * @param props - Button props from the user
 * @param ref - Ref to the root element
 * @returns ButtonState
 */
export const useButton_unstable = (
  props: ButtonProps,
  ref: React.Ref<HTMLButtonElement>,
): ButtonState => {
  const {
    appearance = 'secondary',
    disabled = false,
    disabledFocusable = false,
    iconPosition = 'before',
    shape = 'rounded',
    size = 'medium',
    ...rest
  } = props;

  // Default values are extracted from the destructuring above
  // The scraper should detect: appearance='secondary', size='medium', etc.

  return {
    appearance,
    disabled,
    disabledFocusable,
    iconPosition,
    shape,
    size,
    components: {
      root: 'button',
      icon: 'span',
    },
    root: {} as any,
    icon: undefined,
    ...rest,
  } as ButtonState;
};
