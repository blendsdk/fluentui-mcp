# DataGridHeaderCell

> **Package**: `@fluentui/react-table` v9.19.16
> **Import**: `import { DataGridHeaderCell } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

DataGridHeaderCell is the header cell of a DataGrid column. It renders inside DataGridHeader (the header row of the grid) and represents one column's label plus any interactive affordances the column needs, such as a sort button, a sort-direction indicator, a selection control, or a TableResizeHandle for column resizing. The component is context-driven: rather than being configured directly by the app author in most cases, it receives columnId, tableState, width, and related column-sizing information from the surrounding DataGrid and the column definition that produced it. It is what gives a DataGrid its column-level semantics (columnheader role, aria-sort state, row/column indexing) and it plugs into the grid's keyboard navigation model through focusMode.

**When to use**: Use DataGridHeaderCell when you are building a DataGrid and need column headers that participate in the grid's data model — sorting, column sizing/resizing, selection, and roving-focus keyboard navigation. You typically do not render it by hand: it is emitted by DataGridHeader for each column definition supplied to DataGrid, and you customize it by writing the header cell content inside the column definition's header renderer or by styling it through className. Reach for the simpler TableHeaderCell instead when you need a plain static table with no sorting, resizing, selection, or grid-level keyboard semantics — Table is the right primitive for read-only tabular layouts, while DataGrid plus DataGridHeaderCell is the right choice for interactive, data-bound grids.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `'primary'` | — | No | — |
| `appearance` | `'brand' \| 'neutral' \| 'none'` | — | No | — |
| `autoFitColumns` | `boolean` | — | No | — |
| `checked` | `CheckboxProps['checked']` | — | No | — |
| `columnId` | `TableColumnId` | — | Yes | — |
| `columnSizingOptions` | `TableColumnSizingOptions` | — | No | — |
| `containerWidthOffset` | `number` | — | No | — |
| `focusMode` | `DataGridCellFocusMode` | — | No | — |
| `hidden` | `boolean` | — | No | — |
| `invisible` | `boolean` | — | No | — |
| `onSelectionChange` | `(e: React_2.MouseEvent \| React_2.KeyboardEvent, data: OnSelectionChangeData) => void` | — | No | — |
| `onSortChange` | `(e: React_2.MouseEvent, sortState: SortState) => void` | — | No | — |
| `root` | `Slot<'tbody', 'div'>` | — | Yes | — |
| `root` | `Slot<'td', 'div'>` | — | Yes | — |
| `root` | `Slot<'thead', 'div'>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `selectionMode` | `SelectionMode_2` | — | No | — |
| `sortDirection` | `SortDirection` | — | No | — |
| `sortable` | `boolean` | — | No | — |
| `subtle` | `boolean` | — | No | — |
| `tableState` | `TableFeaturesState<unknown>` | — | Yes | — |
| `truncate` | `boolean` | — | No | — |
| `type` | `'checkbox' \| 'radio'` | — | No | — |
| `visible` | `boolean` | — | No | — |
| `width` | `number` | — | Yes | — |

## Best Practices

### Do's

- Always supply a stable columnId for every column so the header cell can be correlated with column sizing options, sort state, and the corresponding DataGridCell in the body.
- Set sortable to true on the header cell (or in the column definition) whenever the column can be ordered, and let onSortChange drive your sort state so the header cell keeps its aria-sort value in sync with the rendered data.
- Choose focusMode deliberately for each header cell: use the cell-level mode when the header is a single focus target, and the group mode when the cell contains its own focusable controls such as a sort button or an overflow menu.
- Provide an accessible name for header cells whose visible content is an icon, swatch, or avatar by passing a descriptive aria-label or by associating a visually hidden label.
- Use truncate together with a Tooltip or an accessible label so that ellipsized column titles remain discoverable and announced for assistive technology.
- Keep columnSizingOptions and the column definitions referentially stable (memoized) so that column resizing and auto-fit do not thrash the whole header row on every render.
- Rely on the grid's tableState for width, resize position, and column order rather than writing your own width styles, so header and body cells stay aligned.

### Don'ts

- Don't declare sortDirection without also marking the column sortable — a sorting arrow with no interactive affordance announces a sort state that keyboard and mouse users cannot change.
- Don't put focusable descendants (buttons, menu triggers, inputs) inside a header cell that is configured with a cell-level focus mode, because those descendants will not be reachable as separate tab stops.
- Don't hardcode pixel widths in styles instead of using the width and columnSizingOptions pipeline; manual widths desynchronize the header from the body and break resize handles.
- Don't recreate columnSizingOptions or tableState objects inline on every render, as this invalidates memoization and can reset in-flight resize or auto-fit state.
- Don't use DataGridHeaderCell in a plain Table — Table has its own header cell component and mixing the two produces conflicting table and grid semantics.
- Don't hide a column with unreadable empty header text; if a column is hidden or has no label, make that explicit rather than rendering an unlabeled header cell.
- Don't rely on the visual sort arrow alone to communicate sort order; the sort state must also be exposed through the header cell's aria-sort.

## Accessibility

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
