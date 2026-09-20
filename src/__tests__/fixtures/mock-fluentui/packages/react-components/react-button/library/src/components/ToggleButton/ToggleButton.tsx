/**
 * Mock ToggleButton component for scraper coverage testing.
 */
import * as React from 'react';
import type { ToggleButtonProps } from './ToggleButton.types';

export const ToggleButton: React.FC<ToggleButtonProps> = (props) => {
  return React.createElement('button', props);
};

ToggleButton.displayName = 'ToggleButton';
