# DataGrid

> **Package**: `@fluentui/react-table` v9.19.16
> **Import**: `import { DataGrid } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

DataGrid is the Fluent UI React v9 data-display component for rendering tabular collections with built-in sorting, row selection, column resizing, and composite (grid-style) keyboard focus management. It is a declarative wrapper around the same table feature hooks used by Table: the documented examples state that its API surface is directly equivalent to the usage of useTableFeatures, and its behavior mirrors the options of Table and TableColumnDefinition. DataGrid is configured through data-oriented props such as items and columns rather than through hand-written header and body markup. Authors declare the column definitions, a row identity function, an optional selection mode, and optional sorting, then compose DataGridHeader, DataGridRow, DataGridHeaderCell, DataGridBody, DataGridCell, and DataGridSelectionCell to describe how each cell is rendered. Selection can be uncontrolled through defaultSelectedItems or controlled through selectedItems plus the onSelectionChange callback, which receives the updated set of selected row IDs. Sorting can likewise be uncontrolled through defaultSortState or controlled through sortState plus the onSortChange callback, and column resizing is driven by resizableColumns together with columnSizingOptions, onColumnResize, and resizableColumnsOptions. The component also supports a composite focusMode for roving grid navigation, a subtleSelection mode that reveals selection indicators only on hover, focus, or checked state, and a brand or neutral selectionAppearance. Because it is a compositional and unopinionated rendering surface, DataGrid stays performant on large collections only when row identity, render callbacks, and virtualization are handled deliberately.

**When to use**: Use DataGrid when you need a full-featured, accessible data table rather than a static presentational table: it is the right choice when rows must be sorted, selected (single or multiple), resized, or navigated with hierarchical keyboard focus. Choose DataGrid over the lower-level Table, TableHeader, TableBody, TableRow, TableCell, and TableHeaderCell primitives once you want built-in state management for sorting and selection, or when you want composite focus behavior across cells. Choose DataGrid over List or FlatTree when the content is genuinely two-dimensional and column-oriented rather than a flat or hierarchical sequence of items. Choose it over DataGrid-like custom compositions of the useTableFeatures hook when you prefer a declarative API, since the documentation notes the API surface is directly equivalent. Use DataGrid over simple Card lists when users need to scan, compare, and act on many attributes per record. If the data set is very large and scrolling performance degrades, keep DataGrid but move to a virtualized variant provided by the community extension package described in the Virtualization example.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `columnSizingOptions` | `TableColumnSizingOptions \| undefined` | — | No | Options for column resizing, specific for each column |
| `containerWidthOffset` | `number \| undefined` | — | No | For column resizing. Allows for a container size to be adjusted by a number of pixels, to make sure the columns don't overflow the table. By default, this value is calculated internally based on other props, but can be overriden. |
| `onColumnResize` | `((e: KeyboardEvent \| TouchEvent \| MouseEvent \| undefined, data: { columnId: TableColumnId; width: number; }) => void) \| undefined` | — | No | A callback triggered when a column is resized. |
| `onSelectionChange` | `((e: React.MouseEvent \| React.KeyboardEvent, data: OnSelectionChangeData) => void) \| undefined` | — | No | — |
| `onSortChange` | `((e: React.MouseEvent, sortState: SortState) => void) \| undefined` | — | No | — |
| `resizableColumnsOptions` | `{ autoFitColumns?: boolean; } \| undefined` | — | No | Custom options for column resizing. |
| `selectionMode` | `SelectionMode \| undefined` | `false` | No | Enables row selection and sets the selection mode |

### Prop Guidance

- **items**: The data array that backs the grid. Each rendered row is produced from one entry, and the same array is passed to the row render function so cells can call renderCell with the item. `The array of file records shown in the Default and SingleSelect examples`
- **columns**: The array of TableColumnDefinition objects describing each column. A column without a compare function will not be sortable, so supply compare for anything that must participate in sorting. `An array of TableColumnDefinition entries for file name, author, and last update`
- **getRowId**: Derives a stable row ID from the item instead of the default index-based ID. Use it whenever sorting, filtering, or reordering could change item positions and selection must follow the record. `item => item.file.label`
- **selectionMode**: Enables row selection and switches between single and multiple selection. Leave it unset when the grid is read-only, use single for radio-style one-of-many selection, and use multiselect when users compare and act on many rows. `multiselect`
- **onSelectionChange**: Callback fired with the next selection data whenever the user changes selection by mouse or keyboard. Pair it with selectedItems for controlled state, as in the MultipleSelectControlled and SingleSelectControlled examples. `Set state from data.selectedItems in the callback`
- **selectedItems**: Controlled set of selected row IDs. Use it together with onSelectionChange so the grid never diverges from application state. `A Set containing the IDs of the currently selected rows`
- **defaultSelectedItems**: Initial selection for uncontrolled usage. Provide it when the grid can own selection state and you only need to seed the initial rows, as in the MultipleSelect and SingleSelect examples. `A memoized Set containing the ID 1`
- **sortable**: Turns on sorting for the grid. Only columns whose definitions include a compare function can actually be sorted once this is enabled. `true`
- **onSortChange**: Callback invoked with the next sort state when a sortable header is activated. Use it with sortState for controlled sorting or with defaultSortState for uncontrolled sorting. `Store the incoming sort state from the callback`
- **sortState**: Controlled sort state containing the sorted column and direction, such as an ascending sort on the file column. Supply it when sort state must be shared or persisted outside the grid. `Sort column file, direction ascending`
- **defaultSortState**: Initial sort state for uncontrolled usage, applied before the user interacts with any header. `Sort column file, direction ascending`
- **focusMode**: On the DataGrid, composite makes the whole grid one tab stop with roving arrow-key navigation. On DataGridCell and DataGridHeaderCell, group is for cells with multiple focusable elements and none is for cells with exactly one focusable element; a sortable header cell should not contain nested focusable elements at all. `composite on the grid, group or none on individual cells`
- **selectionAppearance**: Chooses how selected rows are painted. The default brand appearance uses the brand background color, while neutral uses a grey background that is less visually dominant. `neutral`
- **subtleSelection**: Keeps the selection indicator out of the way until it is relevant. The indicator appears when the row is hovered, when focus is inside the row, or when the selection cell is checked. `true`
- **resizableColumns**: Enables column resizing, which is a preview capability. When enabled, the rendered header cell receives resize affordances and the render function exposes the column sizing API for enabling keyboard resizing. `true`
- **columnSizingOptions**: Per-column resizing configuration keyed by column ID, covering properties such as minimum width, default width, and ideal width. Setting idealWidth together with onColumnResize gives you control over the resize state. `An options object keyed by column ID`
- **onColumnResize**: Callback triggered when a column is resized, receiving the event and the column ID together with the new width. Use it to persist or mirror resize state, and it is the second half of the controlled resizing story along with idealWidth. `Log the columnId and the resulting width`
- **containerWidthOffset**: Adjusts the container width used by column resizing by a number of pixels so columns do not overflow the table. It is calculated internally based on other props, so override it only when your layout requires a correction. `A number of pixels to subtract from the measured container width`
- **resizableColumnsOptions**: Extra resizing behavior. Setting autoFitColumns to false stops columns from being squeezed and stretched to the container, allowing columns to be wider than the container and enabling the resize handle on the last column, at the cost of horizontal overflow. `An object with autoFitColumns set to false`

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement, PresenceBadgeStatus, TableColumnDefinition } from '@fluentui/react-components';

export const Default = (): JSXElement => {
  return (
    <DataGrid
      items={items}
      columns={columns}
      sortable
      selectionMode="multiselect"
      getRowId={item => item.file.label}
      focusMode="composite"
      style={{ minWidth: '550px' }}
    >
      <DataGridHeader>
        <DataGridRow selectionCell={{ checkboxIndicator: { 'aria-label': 'Select all rows' } }}>
          {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<Item>>
        {({ item, rowId }) => (
          <DataGridRow<Item> key={rowId} selectionCell={{ checkboxIndicator: { 'aria-label': 'Select row' } }}>
            {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
          </DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>
  );
};
```

### SelectionAppearance

```tsx
import * as React from 'react';
import type { JSXElement, PresenceBadgeStatus, TableColumnDefinition } from '@fluentui/react-components';

export const SelectionAppearance = (): JSXElement => {
  const defaultSelectedItems = React.useMemo(() => new Set([1]), []);

  return (
    <DataGrid
      items={items}
      columns={columns}
      selectionMode="multiselect"
      selectionAppearance="neutral"
      defaultSelectedItems={defaultSelectedItems}
      style={{ minWidth: '550px' }}
    >
      <DataGridHeader>
        <DataGridRow selectionCell={{ checkboxIndicator: { 'aria-label': 'Select all rows' } }}>
          {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<Item>>
        {({ item, rowId }) => (
          <DataGridRow<Item> key={rowId} selectionCell={{ checkboxIndicator: { 'aria-label': 'Select row' } }}>
            {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
          </DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>
  );
};

SelectionAppearance.parameters = {
  docs: {
    description: {
      story: [
        'The `selectionAppearance` prop will vary the appearance of selected rows. The default appearance is a brand',
        'background color. However a neutral (grey) background is also available.',
      ].join('\n'),
    },
  },
};
```

### CompositeNavigation

```tsx
import * as React from 'react';
import type { JSXElement, PresenceBadgeStatus, TableColumnDefinition } from '@fluentui/react-components';

export const CompositeNavigation = (): JSXElement => {
  return (
    <DataGrid
      selectionMode="multiselect"
      items={items}
      columns={columns}
      focusMode="composite"
      style={{ minWidth: '550px' }}
    >
      <DataGridHeader>
        <DataGridRow selectionCell={{ checkboxIndicator: { 'aria-label': 'Select all rows' } }}>
          {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<Item>>
        {({ item, rowId }) => (
          <DataGridRow<Item> key={rowId} selectionCell={{ checkboxIndicator: { 'aria-label': 'Select row' } }}>
            {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
          </DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>
  );
};
```

## Best Practices

### Do's

- Always provide getRowId when row identity should be derived from the data; by default row IDs are the index of the item in the collection, so selection and focus can shift when items are added, removed, or reordered.
- Set focusMode to composite on the DataGrid when the grid should behave as a single tab stop with roving arrow-key navigation between cells, as shown in the CompositeNavigation and Default examples.
- Set focusMode to group on a DataGridCell or DataGridHeaderCell when that cell contains multiple focusable elements, so Enter moves focus into the cell, focus is trapped inside it, and Escape returns focus to the cell.
- Set focusMode to none on a cell that contains exactly one focusable element, which makes the cell itself non-focusable and lets the inner control receive focus directly.
- Give every selection indicator an accessible name through the selectionCell prop, for example a checkboxIndicator with an aria-label of Select all rows on the header row and Select row on body rows.
- Provide a compare function in the column definition for every column users should be able to sort, because column definitions without a compare function will not be sortable even when the sortable prop is set.
- Use selectedItems plus onSelectionChange for controlled selection and defaultSelectedItems for uncontrolled selection, matching the MultipleSelectControlled, SingleSelectControlled, and MultipleSelect examples.
- Use sortState plus onSortChange when sort state must be lifted into application state, and defaultSortState when the grid can own its own initial sort, as shown in Sort and SortControlled.
- Wrap a DataGrid with resizableColumns in a container that allows horizontal overflow so that columns can grow past the viewport when autoFitColumns is disabled.
- Memoize the row render function when virtualizing the grid, since the virtualization extension creates components based on that renderer and an unstable function causes excessive unmounting and mounting.

### Don'ts

- Do not place nested focusable elements inside a sortable DataGridHeaderCell, because they are rendered within the sort button and the resulting interaction is broken.
- Do not leave a cell at its default focus behavior when it contains interactive content such as links, buttons, or inputs; choose group for multiple focusable children and none for a single focusable child.
- Do not rely on the default index-based row IDs for data that is sorted, filtered, or paginated, since selection will follow positions instead of records.
- Do not assume a sortable column will sort if its column definition lacks a compare function; the header will be present but the column is not sortable.
- Do not expect screen readers to reliably announce the updated sort status after a sortable header is invoked; this is a documented known issue, even though the implementation follows the WAI sortable-table pattern.
- Do not omit accessible labels on the row and select-all checkbox indicators; without an aria-label the selection controls have no discernible name.
- Do not disable autoFitColumns unless you genuinely want columns to exceed the container width, since that option also disables automatic resizing of adjacent columns and enables the resize handle on the last column.
- Do not read containerWidthOffset as a styling-only value; override it only when the internally calculated container width is wrong for your layout, otherwise columns may overflow the table.
- Do not ship a virtualized grid with an inline, unmemoized row renderer.
- Do not try to manage sorting and selection through ad-hoc cell clicks when sortable or selectionMode already exist; use the documented callbacks and state props so keyboard and screen reader behavior stay intact.

## Anti-Patterns

### Index-based row identity for dynamic data

❌ By default row IDs are the index of the item in the collection, so sorting, filtering, or inserting a row silently reassigns selection and focus to the wrong records.

✅ Pass getRowId and derive the ID from a stable field of the item, as the CustomRowId example does with the file label, so selection follows the data rather than its position.

### Focusable content crammed into a sortable header cell

❌ Nested focusable elements inside a sortable DataGridHeaderCell are rendered within the sort button, producing invalid nested interaction and unpredictable keyboard behavior.

✅ Keep sortable header cells free of nested focusable controls; if a header needs extra actions, use focusMode group on an unsortable header cell or move the actions into the body cells or a context Menu.

### Leaving interactive cells at the default focus mode

❌ Cells containing links, inputs, or buttons break composite grid navigation when their focusMode is not adjusted: keyboard users either cannot reach the inner controls or get trapped without a way back.

✅ Set focusMode group for cells with multiple focusable elements so Enter enters the cell and Escape returns to it, and set focusMode none for cells with a single focusable element so the cell itself is skipped, exactly as the FocusableElementsInCells example describes.

### Unlabeled selection controls

❌ Selection checkboxes and radio buttons have no visible text, so omitting an aria-label leaves them with no accessible name for screen reader users.

✅ Provide an aria-label through the selectionCell prop for both the header select-all indicator and each row indicator, for example Select all rows and Select row, or the radio equivalent when selectionMode is single.

### Unmemoized virtualized row renderer

❌ The virtualization extension creates components from the row render function, so an unstable renderer causes excessive unmounting and mounting as the user scrolls, destroying performance.

✅ Memoize the row render function when using the virtualized DataGrid components from the react-window extension package, and keep items, columns, and callbacks stable across renders.

### Expecting resizable columns without container management

❌ With autoFitColumns disabled, columns are allowed to exceed the container width, so a grid that is not inside a scrollable container clips or breaks the layout, and column resizing silently depends on a correctly measured container width.

✅ Wrap the grid in a horizontally scrollable container when disabling auto fit, and only override containerWidthOffset when the internal measurement is wrong for the surrounding layout.

## Accessibility

**Requirements**: DataGrid follows the WAI ARIA pattern for sortable tables for its sorting experience, and it provides keyboard navigation and screen reader navigation across the whole grid, including column resizing. Selection controls must have discernible names: the documented examples supply an aria-label such as Select all rows on the header selection checkbox and Select row on each body selection checkbox, or an equivalent aria-label on the radioIndicator when selectionMode is single. Because selection is exposed through native checkbox and radio semantics, the grid satisfies the WCAG requirements for name, role, and value on form controls, keyboard operability, and programmatically determinable relationships between headers and cells. Content rendered inside cells must remain reachable: cells containing multiple focusable elements need focusMode group, cells with a single focusable element need focusMode none, and the whole DataGrid should typically use focusMode composite so the grid is a single tab stop with roving arrow-key navigation. Column resizing must be reachable without a mouse; the documented approach exposes keyboard column resizing through a context Menu on the header cell, which uses the accessible name Keyboard Column Resizing and then switches the arrow keys into resize mode.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into and out of the grid; with focusMode composite the entire grid participates as a single stop in the tab order. |
| `Arrow keys` | In composite focus mode, moves focus between header cells, cells, and rows; once keyboard column resizing is enabled on a header, the arrow keys adjust the width of that column. |
| `Enter` | Moves focus into a cell whose focusMode is group so its inner focusable elements can be reached; activates a sortable header button; and returns the grid from keyboard column-resizing mode to the original navigation mode. |
| `Space` | Activates a sortable header button and toggles the selection control of the focused row; also returns the grid from keyboard column-resizing mode to the original navigation mode. |
| `Escape` | Moves focus out of a focusMode group cell and back to the cell itself, and returns the grid from keyboard column-resizing mode to the original navigation mode. |

**ARIA**: aria-label on the header checkboxIndicator, for example Select all rows, aria-label on each row checkboxIndicator, for example Select row, aria-label on the row radioIndicator when selectionMode is single, aria-sort on sortable column headers, following the WAI sortable-table pattern used by the implementation

**Screen Reader**: Screen readers perceive the grid as a navigable two-dimensional structure rather than a free-form collection of divs, and the composite focus behavior keeps a single element in the tab order while arrow keys move the virtual cursor between cells. Sortable headers are exposed as buttons within the header cell, and the sorted column carries sort information per the WAI sortable-table pattern; however, the sort status might not be announced once a sortable column header is invoked in some screen readers, which is a documented known issue with the implementation still following the recommended pattern. Selection controls are announced as checkboxes or radio buttons, and their accessible names come entirely from the aria-label values you supply through selectionCell. When a cell uses focusMode group, screen reader focus can move into the cell contents and Escape returns it to the cell, and when a cell uses focusMode none the cell itself is skipped and only the inner control is exposed as focusable.

## Styling

DataGrid itself is intentionally light on visual opinion so that Table styling surfaces carry the presentation. The documented examples constrain overall size with the inline style prop, typically a minWidth such as 550px, and wrap the grid in a horizontally scrollable container when columns can exceed the viewport. Per-column sizing is controlled through columnSizingOptions with values such as minWidth, defaultWidth, and idealWidth rather than CSS, which is also the mechanism for controlling the resizing state together with the onColumnResize callback. Visual customization of selected rows is governed by selectionAppearance: the default brand appearance paints selected rows with the brand background token, while the neutral option yields a grey background, so overriding selection colors should reuse tokens.colorBrandBackground2, tokens.colorBrandBackground2Hover, and tokens.colorNeutralBackground2 for consistency. Row hover and focus surfaces map naturally to tokens.colorNeutralBackground1Hover and tokens.colorSubtleBackgroundHover, borders and dividers to tokens.colorNeutralStroke2 and tokens.colorNeutralStroke1, focus indication to tokens.colorStrokeFocus2, and spacing and radius to tokens.spacingHorizontalS, tokens.spacingVerticalS, tokens.spacingHorizontalMNudge, and tokens.borderRadiusMedium. Typography for header cells should come from tokens.fontFamilyBase with tokens.fontWeightSemibold and tokens.fontSizeBase300. The subtleSelection prop does not change colors; it only changes when the selection indicator appears, and the indicator shows on row hover, when focus is inside the row, or when the selection cell is checked.

## Performance

DataGrid renders every row you pass as items unless you replace it with a virtualized variant, so large collections should use the extension package @fluentui-contrib/react-data-grid-react-window described in the Virtualization example, which provides DataGrid components powered by react-window. When virtualizing, memoize the row render function because react-window creates components based on that renderer and an unstable function causes excessive unmounting and mounting. Keep items, columns, and callbacks stable between renders, and memoize values such as defaultSelectedItems and default sort state, which the examples do with React.useMemo and an empty dependency array. Sorting only works where column definitions supply a compare function, which avoids wasteful comparisons for non-sortable columns. Column resizing recalculates widths for adjacent columns and depends on an internally measured container width, so avoid forcing frequent layout changes around the grid; use containerWidthOffset only as a correction rather than as a per-frame value. Composite focus mode keeps a single tab stop for the whole grid, which avoids mounting many tab stops and keeps focus movement cheap during keyboard navigation.

## Theming & Tokens

DataGrid inherits appearance from the nearest FluentProvider theme, so all of its default surfaces, text, borders, and focus visuals resolve from Griffel theme tokens rather than hard-coded colors. Selection rendering is the most theme-sensitive aspect: the default brand selectionAppearance paints selected rows with the brand background family such as tokens.colorBrandBackground2 and tokens.colorBrandBackground2Hover, while the neutral option uses the neutral surface family such as tokens.colorNeutralBackground2. Row and cell surfaces generally map to tokens.colorNeutralBackground1 with hover states from tokens.colorNeutralBackground1Hover or tokens.colorSubtleBackgroundHover, borders and dividers to tokens.colorNeutralStroke2 and tokens.colorNeutralStroke1, text to tokens.colorNeutralForeground1, and focus rings to tokens.colorStrokeFocus2. Spacing and shape come from tokens.spacingHorizontalS, tokens.spacingVerticalS, tokens.spacingHorizontalMNudge, and tokens.borderRadiusMedium, and header typography from tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.fontWeightSemibold. Because column widths are expressed through columnSizingOptions rather than raw CSS, theme changes to density or typography scale flow through the grid automatically without re-measuring columns by hand.

## Migration Notes

DataGrid is the declarative v9 entry point for the same table features that were previously wired manually through the useTableFeatures hook; the documentation explicitly states that the selection and sorting APIs are directly equivalent to the usage of useTableFeatures, so migrating hand-written table feature compositions mainly means moving state and callbacks onto DataGrid props such as selectionMode, selectedItems, defaultSelectedItems, onSelectionChange, sortState, defaultSortState, and onSortChange. Row identity that was previously computed inside a custom hook should be expressed through getRowId. Column resizing is still marked as preview in the Storybook documentation, so treat resizableColumns, columnSizingOptions, resizableColumnsOptions, containerWidthOffset, and onColumnResize as a preview surface that may evolve. Virtualized rendering is not built in; it lives in the extension package @fluentui-contrib/react-data-grid-react-window, which provides extended DataGrid components powered by react-window.

## Edge Cases

- Column definitions without a compare function are not sortable even when sortable is set on the DataGrid.
- The updated sort status may not be announced after a sortable header is invoked in some screen readers; this is a documented known issue even though the implementation follows the WAI sortable-table pattern.
- By default row IDs are the index of the item in the collection, so any reordering invalidates index-based selection and focus; use getRowId for data-derived identity.
- Nested focusable elements inside a sortable DataGridHeaderCell are rendered inside the sort button and should be avoided entirely.
- Disabling autoFitColumns lets columns exceed the container width, disables automatic resizing of adjacent columns, and enables the resize handle on the last column; without a scrolling container the extra width is clipped.
- Keyboard column resizing requires switching modes through a header context Menu (for example a MenuItem labeled Keyboard Column Resizing); once enabled the arrow keys adjust the column, and Escape, Enter, or Space return the grid to its normal navigation mode.
- When a DataGridCell or DataGridHeaderCell uses focusMode group, Enter is required to move focus into the cell and Escape to move it back, so users cannot reach inner controls with a single Tab press.
- containerWidthOffset is computed internally from the other props, so an incorrect manual override can make columns overflow the table rather than preventing overflow.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
