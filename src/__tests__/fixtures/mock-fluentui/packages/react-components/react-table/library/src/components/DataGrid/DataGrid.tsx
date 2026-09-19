/**
 * Mock DataGrid component for scraper coverage testing.
 */
import * as React from 'react';
import type { DataGridProps } from './DataGrid.types';

export const DataGrid: React.FC<DataGridProps> = (props) => {
  return React.createElement('div', props);
};

DataGrid.displayName = 'DataGrid';
