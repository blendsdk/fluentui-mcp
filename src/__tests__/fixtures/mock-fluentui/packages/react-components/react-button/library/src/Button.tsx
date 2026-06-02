/**
 * Mock Button component for scraper testing.
 * Minimal .tsx file to make the package classify as a component package.
 */
import * as React from 'react';
import type { ButtonProps } from './Button.types';

export const Button: React.FC<ButtonProps> = (props) => {
  return React.createElement('button', props);
};

Button.displayName = 'Button';
