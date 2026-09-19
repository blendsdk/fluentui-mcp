/**
 * Mock ProgressBar component for scraper coverage testing.
 */
import * as React from 'react';
import type { ProgressBarProps } from './ProgressBar.types';

export const ProgressBar: React.FC<ProgressBarProps> = (props) => {
  return React.createElement('div', props);
};

ProgressBar.displayName = 'ProgressBar';
