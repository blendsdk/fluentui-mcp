/**
 * Mock Input component for scraper testing.
 * Minimal .tsx file to make the package classify as a component package.
 */
import * as React from 'react';
import type { InputProps } from './Input.types';

export const Input: React.FC<InputProps> = (props) => {
  return React.createElement('input', props);
};

Input.displayName = 'Input';
