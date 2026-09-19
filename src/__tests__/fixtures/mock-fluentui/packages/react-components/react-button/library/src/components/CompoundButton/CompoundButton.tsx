/**
 * Mock CompoundButton component for scraper coverage testing.
 */
import * as React from 'react';
import type { CompoundButtonProps } from './CompoundButton.types';

export const CompoundButton: React.FC<CompoundButtonProps> = (props) => {
  return React.createElement('button', props);
};

CompoundButton.displayName = 'CompoundButton';
