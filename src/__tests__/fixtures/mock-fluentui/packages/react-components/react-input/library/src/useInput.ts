/**
 * Mock useInput hook for scraper default-value extraction testing.
 * Mimics the real FluentUI useInput.ts structure.
 */

import type { InputProps, InputState } from './Input.types';

/**
 * Create the state required to render Input.
 *
 * @param props - Input props from the user
 * @param ref - Ref to the input element
 * @returns InputState
 */
export const useInput_unstable = (
  props: InputProps,
  ref: React.Ref<HTMLInputElement>,
): InputState => {
  const {
    appearance = 'outline',
    disabled = false,
    size = 'medium',
    type = 'text',
    ...rest
  } = props;

  return {
    appearance,
    disabled,
    size,
    type,
    components: {
      root: 'span',
      input: 'input',
      contentBefore: 'span',
      contentAfter: 'span',
    },
    root: {} as any,
    input: {} as any,
    ...rest,
  } as InputState;
};
