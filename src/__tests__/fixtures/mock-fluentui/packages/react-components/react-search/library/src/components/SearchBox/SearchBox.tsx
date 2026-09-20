/**
 * Mock SearchBox component for scraper coverage testing.
 */
import * as React from 'react';
import type { SearchBoxProps } from './SearchBox.types';

export const SearchBox: React.FC<SearchBoxProps> = (props) => {
  return React.createElement('input', props);
};

SearchBox.displayName = 'SearchBox';
