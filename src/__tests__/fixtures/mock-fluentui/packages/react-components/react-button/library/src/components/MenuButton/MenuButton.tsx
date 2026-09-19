/**
 * Mock MenuButton component for scraper coverage testing.
 */
import * as React from 'react';
import type { MenuButtonProps } from './MenuButton.types';

export const MenuButton: React.FC<MenuButtonProps> = (props) => {
  return React.createElement('button', props);
};

MenuButton.displayName = 'MenuButton';
