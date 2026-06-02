/**
 * Mock Dialog component for scraper testing.
 * Minimal .tsx file to make the package classify as a component package.
 */
import * as React from 'react';
import type { DialogProps } from './Dialog.types';

export const Dialog: React.FC<DialogProps> = (props) => {
  return React.createElement('div', props);
};

Dialog.displayName = 'Dialog';
