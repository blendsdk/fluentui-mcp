/**
 * Mock SplitButton component for scraper coverage testing.
 */
import * as React from 'react';
import type { SplitButtonProps } from './SplitButton.types';

export const SplitButton: React.FC<SplitButtonProps> = (props) => {
  return React.createElement('button', props);
};

SplitButton.displayName = 'SplitButton';
