/**
 * Mock stable exports index for scraper testing.
 * Mimics the real FluentUI react-components/src/index.ts.
 *
 * The scraper reads this file to determine which components
 * are part of the stable public API.
 */

// Stable component exports
export { Button, buttonClassNames, useButtonStyles_unstable } from '@fluentui/react-button';
export type { ButtonProps, ButtonSlots, ButtonState } from '@fluentui/react-button';

export {
  CompoundButton,
  MenuButton,
  SplitButton,
  ToggleButton,
} from '@fluentui/react-button';
export type { CompoundButtonProps, MenuButtonProps, SplitButtonProps, ToggleButtonProps } from '@fluentui/react-button';

export { ProgressBar } from '@fluentui/react-progress';
export type { ProgressBarProps, ProgressBarSlots } from '@fluentui/react-progress';

export { SearchBox } from '@fluentui/react-search';
export type { SearchBoxProps, SearchBoxSlots } from '@fluentui/react-search';

export { DataGrid } from '@fluentui/react-table';
export type { DataGridProps, DataGridSlots } from '@fluentui/react-table';

export { Input, inputClassNames, useInputStyles_unstable } from '@fluentui/react-input';
export type { InputProps, InputSlots, InputState } from '@fluentui/react-input';

export { Dialog, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, DialogTrigger } from '@fluentui/react-dialog';
export type { DialogProps, DialogSurfaceProps, DialogOpenChangeData, DialogOpenChangeEvent } from '@fluentui/react-dialog';
