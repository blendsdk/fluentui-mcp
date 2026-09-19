# Table

> **Package**: `@fluentui/react-table` v9.19.16
> **Import**: `import { Table } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

Table is a family of composable, unopinionated table primitives for Fluent UI React v9: Table itself plus TableHeader, TableBody, TableRow, TableHeaderCell, TableCell, TableCellLayout, TableCellActions and TableSelectionCell. By default the primitives render native semantic table elements (thead, tbody, tr, th, td) so that the browser and assistive technology understand the data relationships, and the noNativeElements option swaps that markup for div-based flexbox layout when you need virtualization or overflow behavior. Cell content is composed rather than configured: TableCellLayout provides a media slot, a description line, truncation and a primary appearance, while TableCellActions holds hover- and focus-revealed actions such as icon buttons, and TableSelectionCell renders a Checkbox or Radio indicator for row selection. Feature behavior lives in the useTableFeatures hook and its plugins: useTableSelection manages single and multiselect state (controlled or uncontrolled), useTableSort manages sort state and column sort direction with onSortChange, and useTableColumnSizing_unstable adds resizable columns with columnSizingOptions, minimum, default and ideal widths. Keyboard navigation is deliberately not built into the primitives; the stories show the recommended patterns using useArrowNavigationGroup with a grid axis, useFocusableGroup with limited-trap-focus for cells that contain several focusable elements, and useTableCompositeNavigation together with the focusMode prop for composite row-and-cell navigation. Because the primitives are unopinionated, the same building blocks scale from a simple static read-only table to a selectable, sortable, resizable and virtualized data grid.

**When to use**: Use Table when you need to present dense, multi-attribute data that users must compare across rows and columns: file and document lists, user directories, resource inventories, billing line items or any grid where aligned columns make scanning faster than a list. Reach for Table together with useTableFeatures and its plugins when users must select rows, sort by column, resize columns or work with a large virtualized data set, because the hooks keep that state consistent across row mount and unmount. Choose the default native elements whenever semantics and accessibility support are the priority, and switch to noNativeElements only when virtualization or horizontal overflow forces a flexbox layout. Prefer lighter components when the data is not genuinely tabular: List or a stack of Persona rows reads better for shallow, single-column activity feeds, Tree is the right choice for hierarchical structures, Card suits summary content, and Text or Label handles simple label-value pairs without the layout cost of a table. If you only need to display a small fixed set of read-only values, a styled list is simpler and easier to make responsive than a full table.

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
| `sortable` | `boolean` | `false` | No | — |
| `subtle` | `boolean` | — | No | — |
| `tableState` | `TableFeaturesState<unknown>` | — | Yes | — |
| `truncate` | `boolean` | — | No | — |
| `type` | `'checkbox' \| 'radio'` | — | No | — |
| `visible` | `boolean` | — | No | — |
| `width` | `number` | — | Yes | — |

### Prop Guidance

- **sortable**: Enables sorting presentation on the table; header cells render as buttons and gain the affordance styles. Pair it with useTableSort so the data actually reorders. `sortable`
- **sortDirection**: Set on TableHeaderCell to indicate whether that column is currently sorted ascending, descending or not at all; the hook returns it per column id. `ascending`
- **onSortChange**: Sort plugin callback used when you control sortState yourself; update your external state with the next sort state supplied by the callback. `(event, nextSortState) => setSortState(nextSortState)`
- **selectionMode**: Selection plugin option that switches between single-row and multi-row selection; choose single for radio-style picking and multiselect for checkbox-style batch operations. `multiselect`
- **onSelectionChange**: Selection plugin callback used in controlled mode; receive the change event and a data object containing the resulting selected items so you can store them in your own state. `(event, data) => setSelectedRows(data.selectedItems)`
- **checked**: Set on TableSelectionCell to drive the checkbox or radio indicator; use a mixed value when only some rows are selected so the header communicates a partial selection. `mixed`
- **type**: Set on TableSelectionCell to render either a checkbox or a radio indicator; the design guidance is checkbox for multiselect and radio for single select. `radio`
- **subtle**: On TableSelectionCell, keeps the selection indicator hidden until the row is hovered, focused within or checked, reducing visual noise in dense tables. `subtle`
- **hidden**: On TableSelectionCell, removes the cell from rendering when no selection affordance should exist at all. `hidden`
- **invisible**: On TableSelectionCell, keeps the cell occupying layout space while hiding its indicator, which is how the single-select header cell aligns with the body rows. `invisible`
- **visible**: Boolean visibility flag for the associated sub-element or state; leave the element rendered and rely on hidden or invisible when you need stronger concealment. `true`
- **appearance (TableRow)**: Controls the row background emphasis; use brand while a row is selected and none for normal rows, with neutral available for a neutral emphasis. `brand`
- **appearance (TableCellLayout)**: Set to primary to create emphasis in a cell by enlarging the media and strengthening the main label; normally applied to the first column. `primary`
- **truncate**: On TableCellLayout, truncates overflowing text instead of letting it wrap or expand the column, which pairs well with fixed column widths. `truncate`
- **columnSizingOptions**: Passed to the column sizing plugin to define per-column minimum, default and ideal widths, keyed by column id; in controlled usage you also update idealWidth from the resize callback. `{ file: { minWidth: 190, idealWidth: 300 } }`
- **columnId**: Identifier for a column definition, used to look up sort direction, sizing options and cell props across the table. `file`
- **width**: Numeric width reported to and from the column sizing feature; the resize callback supplies the new width so the parent can store it. `300`
- **containerWidthOffset**: Column sizing option that compensates for surrounding chrome such as scrollbars or padding when the table measures available container width. `16`
- **autoFitColumns**: Column sizing option that fits columns to available container width by default; set it to false when you want columns to keep their widths and overflow horizontally instead. `false`
- **focusMode**: Selects the keyboard navigation strategy for the table, such as composite navigation that combines row focus with cell focus; use it together with the table composite navigation utilities. `composite`
- **tableState**: The state object returned by useTableFeatures and handed to the feature plugins and helper utilities; it is the single source of truth for rows, selection, sort and column sizing. `useTableFeatures result`
- **checked (header selection)**: On the header TableSelectionCell, combine the all-selected, some-selected and checked values so the control shows true, mixed or false correctly. `mixed`
- **size**: Controls row density through the size options demonstrated in the size stories, with small and extra-small tightening vertical padding for dense data. `small`
- **noNativeElements**: Renders div-based flexbox layout instead of table elements; required for virtualization and useful when you need the table to overflow a scroll parent. `noNativeElements`
- **root**: Slot present on each primitive, mapping to the underlying tbody, td, thead or div element; use it to attach refs, classes or event handlers to the rendered host element. `root`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement, PresenceBadgeStatus } from '@fluentui/react-components';

export const Default = (): JSXElement => {
  return (
    <Table arial-label="Default table" style={{ minWidth: '510px' }}>
      <TableHeader>
        <TableRow>
          {columns.map(column => (
            <TableHeaderCell key={column.columnKey}>{column.label}</TableHeaderCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map(item => (
          <TableRow key={item.file.label}>
            <TableCell>
              <TableCellLayout media={item.file.icon}>{item.file.label}</TableCellLayout>
            </TableCell>
            <TableCell>
              <TableCellLayout
                media={
                  <Avatar
                    aria-label={item.author.label}
                    name={item.author.label}
                    badge={{ status: item.author.status as PresenceBadgeStatus }}
                  />
                }
              >
                {item.author.label}
              </TableCellLayout>
            </TableCell>
            <TableCell>{item.lastUpdated.label}</TableCell>
            <TableCell>
              <TableCellLayout media={item.lastUpdate.icon}>{item.lastUpdate.label}</TableCellLayout>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
```

### CellActions

```tsx
import * as React from 'react';
import type { JSXElement, PresenceBadgeStatus } from '@fluentui/react-components';

export const CellActions = (): JSXElement => {
  return (
    <Table aria-label="Table with cell actions" style={{ minWidth: '500px' }}>
      <TableHeader>
        <TableRow>
          {columns.map(column => (
            <TableHeaderCell key={column.columnKey}>{column.label}</TableHeaderCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map(item => (
          <TableRow key={item.file.label}>
            <TableCell>
              <TableCellLayout media={item.file.icon}>{item.file.label}</TableCellLayout>
              <TableCellActions>
                <Button icon={<EditIcon />} appearance="subtle" aria-label="Edit" />
                <Button icon={<MoreHorizontalIcon />} appearance="subtle" aria-label="More actions" />
              </TableCellActions>
            </TableCell>
            <TableCell>
              <TableCellLayout
                media={
                  <Avatar
                    aria-label={item.author.label}
                    name={item.author.label}
                    badge={{ status: item.author.status as PresenceBadgeStatus }}
                  />
                }
              >
                {item.author.label}
              </TableCellLayout>
            </TableCell>
            <TableCell>{item.lastUpdated.label}</TableCell>
            <TableCell>
              <TableCellLayout media={item.lastUpdate.icon}>{item.lastUpdate.label}</TableCellLayout>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

CellActions.parameters = {
  docs: {
    description: {
      story: [
        '`TableCellActions` is a container that is visible when the `TableRow`is hovered',
        'or when the current focused element is within the row. It is commonly used to contain interactive actions',
        'like buttons, but can be used for any generic content. Please ensure that the contents of cell actions',
        'are accessible.',
      ].join('\n'),
    },
  },
};
```

### CellNavigation

```tsx
import * as React from 'react';
import type { JSXElement, PresenceBadgeStatus } from '@fluentui/react-components';

export const CellNavigation = (): JSXElement => {
  const keyboardNavAttr = useArrowNavigationGroup({ axis: 'grid' });

  return (
    <Table
      {...keyboardNavAttr}
      role="grid"
      aria-label="Table with grid keyboard navigation"
      style={{ minWidth: '600px' }}
    >
      <TableHeader>
        <TableRow>
          {columns.map(column => (
            <TableHeaderCell key={column.columnKey}>{column.label}</TableHeaderCell>
          ))}
          <TableHeaderCell />
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map(item => (
          <TableRow key={item.file.label}>
            <TableCell tabIndex={0} role="gridcell">
              <TableCellLayout media={item.file.icon}>{item.file.label}</TableCellLayout>
            </TableCell>
            <TableCell tabIndex={0} role="gridcell">
              <TableCellLayout
                media={
                  <Avatar
                    aria-label={item.author.label}
                    name={item.author.label}
                    badge={{ status: item.author.status as PresenceBadgeStatus }}
                  />
                }
              >
                {item.author.label}
              </TableCellLayout>
            </TableCell>
            <TableCell tabIndex={0} role="gridcell">
              {item.lastUpdated.label}
            </TableCell>
            <TableCell tabIndex={0} role="gridcell">
              <TableCellLayout media={item.lastUpdate.icon}>{item.lastUpdate.label}</TableCellLayout>
            </TableCell>
            <TableCell role="gridcell">
              <TableCellLayout>
                <Button icon={<EditRegular />}>Edit</Button>
              </TableCellLayout>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

CellNavigation.parameters = {
  docs: {
    description: {
      story: [
        'The `Table` primitive components do not support keyboard navigation. This should be added by users.',
        'Cell navigation can be achieved simply using the `useArrowNavigationGroup` utility provided by the Library.',
        '',
        '>⚠️ Once there is any kind of keyboard navigation on the component it must follow the',
        '>[aria role="grid" pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/examples/data-grids/).',
      ].join('\n'),
    },
  },
};
```

## Best Practices

### Do's

- Give every table an accessible name with aria-label (or an equivalent labelling attribute) describing the data set, as every Storybook example does.
- Keep the default native semantic elements unless you have a concrete reason such as virtualization; add noNativeElements only when native table layouting blocks the feature you need.
- Drive sorting, selection and column sizing through useTableFeatures and its plugins (useTableSelection, useTableSort, useTableColumnSizing_unstable) so that state survives row mounting and unmounting during virtualization.
- Label the selection controls: pass an aria-label such as 'Select row' through checkboxIndicator or radioIndicator on body cells and an equivalent 'Select all rows' label on the header selection cell.
- Use TableCellLayout for consistent vertical alignment, media slots, descriptions and truncation instead of hand-building layout inside TableCell.
- Reflect selection state consistently: set aria-selected on the row and on the selection and data cells, and switch the TableRow appearance between 'brand' when selected and 'none' otherwise.
- Implement keyboard navigation explicitly and then adopt the matching ARIA roles: useArrowNavigationGroup with a grid axis plus role grid and role gridcell, or useTableCompositeNavigation with focusMode for row and cell focus.
- Manage cells that contain several focusable controls with useFocusableGroup and a limited-trap-focus behavior, and keep icon-only Buttons labelled with aria-label.
- Memoize row components when a table has many rows and selection or sorting causes frequent re-renders, following the memoization example that re-renders only the affected row.
- Control state externally where it must be shared (sortState, selectedItems, columnSizingOptions) so routing, persistence or server data can synchronize with the table.

### Don'ts

- Do not assume the primitives provide keyboard navigation, focus management or grid semantics; they ship none of that and screen reader users will be stuck if you do not add it.
- Do not add role grid and role gridcell to a table that has no keyboard navigation or focusable cells; the ARIA grid pattern obligates you to implement the behavior that goes with the role.
- Do not let cell action buttons bubble their click or key press into the row, or invoking an action will also toggle row selection.
- Do not hand-roll cell padding, borders and typography with inline styles; use the built-in size options, TableCellLayout properties and theme tokens so the table matches the rest of your surface.
- Do not use the brand row appearance as decoration; reserve it for the selected state so the visual language stays unambiguous.
- Do not set fixed pixel widths on columns when column resizing is enabled; configure minimum, default and ideal widths through columnSizingOptions instead.
- Do not substitute hidden for invisible in single-select layouts when you want the placeholder cell to keep occupying layout space.
- Do not virtualize rows with native table elements; strict browser table layouting conflicts with windowing libraries, so use noNativeElements for those cases.
- Do not memoize every row by default; memoization is not free and should target identified bottlenecks.
- Do not leave the default story-style typo attributes in place; an accessible name only takes effect with the correct attribute spelling.

## Anti-Patterns

### Assuming the table navigates itself

❌ The primitives contain no keyboard navigation, so arrow keys and Tab do nothing useful and keyboard users cannot reach cells or rows.

✅ Add navigation explicitly with useArrowNavigationGroup configured for a grid axis, or useTableCompositeNavigation with the focusMode prop, and adopt role grid plus role gridcell once navigation exists.

### Using grid roles without grid behavior

❌ Applying role grid and role gridcell without keyboard navigation or focusable cells breaks the obligations of the ARIA grid pattern and misleads assistive technology about what users can do.

✅ Either keep the native table semantics and simple tab order, or implement full grid navigation and focus management before adding the grid roles.

### Cell actions that also select the row

❌ Clicks and key presses on buttons inside TableCellActions bubble up to the row handler, so pressing Edit also toggles the row selection.

✅ Stop the event at the cell actions level, for example by calling preventDefault in the action handlers and checking defaultPrevented in the row handlers before toggling selection.

### Virtualizing native table markup

❌ Native table elements are subject to strict browser layouting and do not behave well when rows are mounted and unmounted by a windowing library or when the table must overflow its container.

✅ Switch to noNativeElements for a flexbox layout, expose aria-rowcount and aria-rowindex, and use role presentation for decorative alignment elements such as the scrollbar spacer.

### Keeping selection state inside rows

❌ Storing selection locally in each row component loses state whenever rows unmount, which happens constantly under virtualization and can also desynchronize select-all behavior.

✅ Hoist selection into useTableFeatures with useTableSelection in controlled or uncontrolled mode so the hook owns the selected item set and the header select-all control.

### Hard-coding column widths in inline styles

❌ Fixed pixel widths bypass the column sizing feature, break auto-fit behavior and produce inconsistent layouts across container sizes.

✅ Define widths through columnSizingOptions with minimum, default and ideal values, apply the sizing props returned for the table, header cells and cells, and wrap the table in a horizontal scroll container when auto-fit is disabled.

## Accessibility

**Requirements**: The Table must satisfy WCAG 1.3.1 by exposing real header and data relationships, which the default native elements provide; if you switch to noNativeElements you must supply equivalent roles yourself. Keyboard access (WCAG 2.1.1) is not automatic: you must add grid navigation and a visible focus indicator that meets 2.4.7, because the primitives never move focus. Provide a programmatic name for the table (WCAG 4.1.2) and, when selection or sort state changes, ensure the change is perceivable (WCAG 4.1.3) since the sort status is a known announcement gap. Interactive elements placed inside cells must meet target size and contrast requirements, and empty header cells used only for alignment must not introduce confusing semantics.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into and out of the table, or steps between focusable elements when no grid navigation is implemented |
| `Shift+Tab` | Moves focus in the reverse direction, out of the table or to the previously focusable element |
| `Arrow keys` | With useArrowNavigationGroup configured for a grid axis, move focus between grid cells in the corresponding direction |
| `Right Arrow` | In composite navigation, moves from row focus into the cells of the current row |
| `Enter` | On a cell that contains multiple focusable elements, moves focus inside the cell so its controls can be reached |
| `Escape` | From inside a cell with trapped focus, returns focus to the cell itself |
| `Space` | Toggles selection of the focused row, and toggles the select-all control in the header selection cell |
| `Enter or Space on a sortable header` | Sortable header cells are rendered as buttons, so activating them with Enter or Space applies the column sort |
| `Context menu on a header cell` | The Menu opened on a header cell exposes advanced features such as keyboard column resizing |

**ARIA**: aria-label, role grid, role gridcell, role checkbox, role presentation, aria-checked, aria-selected, aria-rowcount, aria-rowindex, aria-label on checkboxIndicator and radioIndicator, tabIndex on navigable rows and cells

**Screen Reader**: With native elements, screen readers announce the table as a table with row and column counts and read column headers in context for each cell, which is why native markup is the recommended default. Once keyboard navigation is added and role grid plus role gridcell are applied, the component is announced as a grid instead, and cells are read as grid cells with their coordinates and selection state; selected rows and cells are announced through aria-selected, and header selection controls through aria-checked with a mixed value when some but not all rows are selected. Sortable headers behave as buttons, and although the design follows the WAI sortable-table pattern, the newly sorted column state may not always be announced after activation, which is a known screen reader limitation. Virtualized tables should expose aria-rowcount and per-row aria-rowindex so assistive technology can describe position within the full data set even though only a window of rows exists in the DOM. Decorative spacer elements, such as the scrollbar alignment div used above a virtualized list, should be hidden with role presentation.

## Styling

Table styling is done with Griffel makeStyles and Fluent design tokens rather than component-level style props. Row backgrounds, hover and selected states should use tokens.colorNeutralBackground1, tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Selected, while the TableRow brand appearance resolves to brand selection tokens such as tokens.colorBrandBackground2 with text in tokens.colorBrandForeground1. Subtle selection cells are meant to stay quiet until interaction, so they lean on tokens.colorSubtleBackgroundHover and tokens.colorSubtleBackgroundSelected instead of a persistent selection color. Separators and outlines typically use tokens.colorNeutralStroke2 and tokens.strokeWidthThin, and the focus ring uses tokens.colorStrokeFocus2 so it stays visible against both neutral and brand backgrounds. Typography hierarchy inside cells maps to tokens.fontSizeBase300 and tokens.fontWeightRegular for body text, tokens.fontSizeBase200 and tokens.colorNeutralForeground3 for the secondary description line, and the primary cell appearance bumps the main label to a larger size with tokens.fontWeightSemibold and expands the media size. Spacing uses tokens.spacingHorizontalS and tokens.spacingHorizontalM for inner padding and tokens.spacingVerticalSNudge or similar vertical spacing tokens for row height; the small and extra-small size options simply reduce those paddings. Use tokens.borderRadiusMedium for rounded cell groupings and tokens.shadow2 if you make a header sticky, and always truncate long values through the TableCellLayout truncate option rather than clipping text yourself.

## Performance

Row rendering dominates Table performance. The features example shows the intended pattern: keep business logic in useTableFeatures, map rows from the hook, and memoize the row component with React.memo plus useCallback handlers so that a selection change re-renders only the affected row rather than the entire table. Column definitions and item arrays should be stable between renders, since new array identities invalidate memoized rows. For very large data sets use noNativeElements with a windowing library so only visible rows exist in the DOM, and rely on the feature state hook to preserve selection and sort state across the mounting and unmounting of rows; pair this with aria-rowcount and aria-rowindex so the model stays complete for assistive technology. Column resizing recomputes widths across the table, so debounce or batch width updates when dragging, and prefer the imperative setColumnWidth path over forcing a full controlled re-render for every pointer move. Avoid heavy cell content such as nested tables, and prefer lightweight media such as icons or avatars inside TableCellLayout for large grids.

## Theming & Tokens

Table consumes the Fluent theme provided by FluentProvider, so every color, radius, spacing and typography value comes from theme tokens rather than hard-coded values. Neutral rows and headers draw from tokens.colorNeutralBackground1 with tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Selected for interaction states, borders use tokens.colorNeutralStroke2 with tokens.strokeWidthThin, and text hierarchy uses tokens.colorNeutralForeground1, tokens.colorNeutralForeground2 and tokens.colorNeutralForeground3. The brand row appearance and brand selection accents resolve through tokens.colorBrandBackground2, tokens.colorBrandForeground1 and tokens.colorBrandStroke1, while subtle selection cells rely on tokens.colorSubtleBackgroundHover and tokens.colorSubtleBackgroundSelected. Focus indicators use tokens.colorStrokeFocus2 so they remain visible in both light and dark themes, and elevated or sticky headers can use tokens.shadow2. Density is expressed with spacing tokens such as tokens.spacingHorizontalS, tokens.spacingHorizontalM and tokens.spacingVerticalSNudge, and the size options map to the same token scale, so changing theme or density in the provider updates the table without component-level overrides.

## Migration Notes

Older generations of Fluent exposed a single monolithic table or details-list component with sorting, selection and column sizing baked in; in v9 those behaviors are opt-in and distributed across useTableFeatures and its plugins, so equivalent tables must be assembled from primitives plus hooks. Column resizing is still shipped as a preview feature through the useTableColumnSizing_unstable plugin, which is why the resize stories are labelled preview and why the accessing methods are named with the unstable suffix. Virtualization is no longer an internal table concern: use noNativeElements for flexbox layout and combine the primitives with a windowing library, relying on the feature state hook to keep selection and sorting stable across the mounting and unmounting of rows. Keyboard navigation also moved from implicit behavior to explicit utilities such as useArrowNavigationGroup, useFocusableGroup and useTableCompositeNavigation.

## Edge Cases

- The default story passes a misspelled arial-label attribute, which does nothing; an accessible name only applies when the attribute is spelled correctly, so double-check this when copying examples.
- Sort status may not be announced by some screen readers after a sortable header is activated, which is a documented limitation even though the implementation follows the WAI sortable-table pattern.
- When auto-fit is disabled, columns no longer compress to the container, so the table must be wrapped in a horizontally scrollable element or content will be clipped.
- Column resizing is a preview feature exposed through the useTableColumnSizing_unstable plugin, and keyboard-driven resizing requires opening a Menu on the header cell to reach the resizing action.
- In single-selection tables the header selection cell should render as a radio type indicator with invisible set, otherwise the header shows a control that users cannot meaningfully activate.
- The DataGrid-style example mixes a header selection cell announced as a checkbox with body cells exposed as grid cells, so role assignments must be kept consistent between header and body for valid semantics.
- Under virtualization, row components unmount frequently, so any state not held by useTableFeatures (such as local expanded rows) will be lost unless you lift it out of the row.
- The focusMode and tableState values are consumed by the feature and navigation utilities rather than rendering directly, so changing them without wiring the corresponding hooks has no visible effect.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
