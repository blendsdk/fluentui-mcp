# TableBody

> **Package**: `@fluentui/react-table` v9.19.16
> **Import**: `import { TableBody } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

TableBody is the row-group container of the Fluent UI React v9 Table family. It renders the semantic body of a table — a tbody element by default — and owns the TableRow elements that make up the data being displayed. It is designed to be composed with Table, TableHeader, TableRow, TableCell, TableHeaderCell, TableSelectionCell, and TableResizeHandle, and the same body primitive sits underneath the DataGrid body when a table needs built-in sorting, selection, and column resizing. Its single slot, root, can be rendered as either a tbody or a div, which allows the component to participate in a real table layout or in a generic row container where rows carry grid semantics. TableBody is primarily structural: interaction props such as focusMode, selectionMode, onSelectionChange, onSortChange, sortable, and sortDirection, plus sizing props such as columnSizingOptions, columnId, width, containerWidthOffset, and autoFitColumns, are threaded through the surrounding table or grid so that the header, the body, and the selection cells all stay in sync through the shared tableState.

**When to use**: Use TableBody any time you render tabular data with the Table family, because it provides the grouping element that browsers and assistive technology expect between the table root and its rows. Choose the plain Table plus TableBody composition for static or presentational tables where you fully control the markup and behavior yourself. Choose the DataGrid composition — whose body is built on this same structure — when you need built-in sorting, row selection, column resizing, or configurable cell focus, since those features require shared state that flows through tableState, selectionMode, onSelectionChange, onSortChange, and columnSizingOptions. If the content is not truly tabular — a feed of items, a list of actions, a file explorer — use List, ListItem, or Tree instead, because TableBody carries rowgroup and row semantics that are wrong for those patterns and will confuse screen reader users.

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

### Prop Guidance

- **root**: The only slot TableBody defines. It renders a tbody by default and can be rendered as a div when rows need to be laid out outside a native table. Use the slot to attach the body class name, style overrides, or data attributes, and keep the element type consistent with the surrounding table root. `tbody`
- **tableState**: Required shared state object produced by the owning table or grid. All feature behavior — sorting, selection, column sizing, focus — is read from and written back to this state, so it must be the same object instance the header and cells receive. Do not construct or fork it inside the body. `tableState`
- **focusMode**: Controls how focus is applied to cells within the body when the table is used as a grid. Use cell-level focus when users need to tab between individual cells, group focus when the whole row should be one tab stop, and none when the body contains no focusable content. Keep one consistent value for the entire body. `cell`
- **selectionMode**: Declares whether rows in the body can be selected, and whether a single row or many rows may be selected at once. Set it on the shared table state so headers, selection cells, and the body agree; a single-selection mode pairs naturally with radio selection, multi-selection with checkboxes. `multiselect`
- **onSelectionChange**: Callback invoked with the originating mouse or keyboard event and the resulting selection data whenever a user toggles selection in the body. Use it to update your own selection state; because rows only report the change, the source of truth stays in your component. `onSelectionChange`
- **onSortChange**: Callback invoked with the event and a new sort state when a sortable header is activated. Handle it by updating sort state and reordering the data that is passed into the body, since the body renders in the order it is given. `onSortChange`
- **sortable**: Marks a column as sortable so its header presents a sort affordance and reports sort changes. Sorting applies to the data feeding the body, not to the body itself, and should be set consistently with sortDirection. `true`
- **sortDirection**: Communicates the current sort direction for a column so the header can render the correct indicator and assistive technology can announce it. Always drive it from the same state you use to order the rows. `ascending`
- **columnSizingOptions**: Supplies default and minimum/maximum sizes per column identifier so header and body cells compute identical widths. Prefer this over per-cell inline widths when you want resizable or auto-fitted columns. `columnSizingOptions`
- **columnId**: Identifies which column a sizing or sorting definition applies to. Every width and sizing entry must reference a column id that the body and header both know about, otherwise the column falls back to intrinsic sizing. `columnId`
- **width**: A numeric column width in pixels used by the sizing computation for a column rather than for an individual row. Keep widths expressed through the sizing options so all rows, including header rows, resolve to the same value. `200`
- **containerWidthOffset**: An adjustment applied to the measured container width when computing column sizes, typically used to account for scrollbars, padding, or a fixed trailing column. Use it when auto-fitting appears to overflow or under-fill the visible area. `16`
- **autoFitColumns**: Enables automatic distribution of available width across the columns instead of using only the explicit widths. Turn it on for fluid layouts, and pair it with minimum widths so narrow columns do not collapse. `true`
- **visible**: A presentation-level flag indicating whether a row or cell is shown. It does not remove the underlying data, so use it for transient visual states and remove items from your data when they should truly be gone. `true`
- **hidden**: Hides a row or cell visually. Because the element usually remains in the DOM, do not use it as a substitute for filtering data, and check the resulting reading order for assistive technology before shipping. `true`
- **invisible**: Renders a row or cell without visible styling while preserving layout space. Use it to keep column alignment stable during loading or progressive rendering rather than to permanently remove content. `true`
- **appearance**: Variant selector used by selection cells and cells in the table family, accepting brand, neutral, or none. Use brand to emphasize a primary action or highlighted row, neutral for standard interactive cells, and none when the cell should not present any surface of its own. `neutral`
- **truncate**: Truncates overflowing cell text with an ellipsis instead of wrapping. Enable it on cells whose content can be arbitrarily long so row height stays predictable; combine it with a tooltip if the full value must remain discoverable. `true`
- **type**: Selects the control used by a selection cell, either checkbox for multi-selection or radio for single selection. Match it to selectionMode so the visual affordance and the announced role are consistent. `checkbox`
- **checked**: Controls the checked state of a selection cell, including indeterminate values for headers that represent a partially selected set. Always drive it from your selection state so the control stays controlled and predictable. `true`
- **subtle**: Reduces the visual weight of a selection cell or row control so it blends into the row until hovered or focused. Use it in dense tables where persistent control chrome competes with the data. `true`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Keep TableBody as a direct child of the table root so the rowgroup/row structure stays valid and equal-width column layout is preserved.
- Render only TableRow children inside TableBody; place header cells in TableHeader and data cells in TableRow.
- Define column widths in one place — through columnId, width, and columnSizingOptions — so header cells and body cells always agree.
- Set focusMode on the body when the table behaves as a grid, so every body cell follows the same keyboard focus contract.
- Lift sorting and selection into shared state via onSortChange, sortDirection, and onSelectionChange, and feed the results back into the rows so header indicators and row state never drift apart.
- Apply truncate to cells that can contain long values so a single long string cannot inflate row height across the whole body.
- Give every row a stable, unique key so resizing, sorting, and selection updates update rows in place instead of remounting them.

### Don'ts

- Don't place non-row content such as toolbars, pagination controls, or empty-state illustrations directly inside TableBody; render them outside the table or inside a spanning row.
- Don't hardcode width values on the body while the header derives widths from containerWidthOffset or autoFitColumns — the columns will visibly misalign.
- Don't use visible, hidden, or invisible as data filters; they are presentation-level toggles and the rows remain in your data set and state.
- Don't hand-roll arrow-key navigation on top of focusMode when the surrounding grid already manages focus and selection.
- Don't sort or filter inside a row component; sorting is a table-level concern surfaced through onSortChange and sortDirection.
- Don't mix checkbox and radio selection semantics inside one body; choose a single model through selectionMode and type.
- Don't nest another Table inside TableBody; if a nested table is truly required, place it inside a single cell.

## Anti-Patterns

### Non-row children inside the body

❌ Placing toolbars, loaders, or empty-state graphics directly inside TableBody produces children that are not rows, which breaks the rowgroup/row relationship and confuses both layout and screen reader navigation.

✅ Keep only TableRow children in the body. Render surrounding chrome outside the table, or, when an in-table message is required, render a single full-width row containing one cell that spans the columns.

### Rendering the body outside a table root

❌ A tbody rendered without its owning table element has no table context, so column widths, header association, and the shared table state are all lost and the rows render as unstyled blocks.

✅ Always compose TableBody inside the table root, or render the root slot as a div only when the surrounding composition also uses div-based rows and cells, so the layout semantics stay internally consistent.

### Duplicating sort and selection state in the body

❌ Keeping a local sort order or local selected-row list inside the body while the header reads different state produces indicators that disagree with the visible data and races between the two sources of truth.

✅ Treat tableState, onSortChange, sortDirection, and onSelectionChange as the single source of truth, update it in the parent component, and pass the resulting ordered and selected data back into the rows.

### Hardcoding widths per cell instead of per column

❌ Setting widths on individual body cells while headers rely on columnSizingOptions, width, or autoFitColumns causes columns to drift apart, especially after a resize or a container width change.

✅ Define every column once through columnId plus width and columnSizingOptions, let autoFitColumns and containerWidthOffset handle the available space, and avoid overriding widths in individual cells.

### Using visibility flags as a filter

❌ Using visible, hidden, or invisible to represent removed data leaves stale entries in the data set, keeps them in the tab order in some cases, and makes sorting and selection counts incorrect.

✅ Filter the data that is passed into the body for real exclusions, and reserve the visibility flags for short-lived visual transitions such as progressive loading.

## Accessibility

**Requirements**: TableBody must render inside a table root so that its default tbody maps to the rowgroup role; each TableRow inside it maps to a row and each cell to a gridcell or cell depending on context. When the body is used as part of a grid, the grid root must expose the total row and column counts and each row must report its selected state. Every interactive control rendered in a row — selection checkboxes, buttons, links, menus — needs its own accessible name; selection controls in particular need a label that identifies which row they act on. Sorting must be conveyed on the corresponding header cell rather than in the body. Column resizing handles must be reachable and operable by keyboard and must announce their current column. Focus indicators must remain visible at all times, which means the component's default outline styles should not be removed without an equivalent replacement.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the next focusable element in the body; when focusMode makes cells individually focusable, focus steps through the body cells one at a time. |
| `Shift + Tab` | Moves focus to the previous focusable element, stepping backwards through body cells or interactive controls. |
| `Space` | Toggles a focused selection checkbox in a row and activates other native controls, such as buttons, rendered inside body cells. |
| `Enter` | Commits the focused checkbox value or activates a focused interactive control such as a button or link inside a row. |
| `Escape` | Dismisses a menu, popover, or other overlay opened from a row without changing the row's selection or data. |

**ARIA**: role=rowgroup (implicit on the tbody root), role=row (applied by each TableRow in the body), role=gridcell (applied to cells when the table is used as a grid), aria-selected (on rows whose selection state can be toggled), aria-checked (on selection checkboxes inside selection cells), aria-label (on selection checkboxes and other row-level controls that need row identity), aria-rowcount and aria-colcount (on the grid root that contains the body), aria-sort (on header cells, not on body cells)

**Screen Reader**: A screen reader entering the table announces it as a table or grid with its row and column counts, then as users move through the body it announces the current row, the cell contents, and any selection state attached to the row or its checkbox. Because TableBody renders a real rowgroup, rows are read in the order they are rendered, so visual reordering without reordering the DOM produces a mismatch between what is seen and what is announced. Interactive content inside cells is announced with its own role and name, and selection checkboxes announce their checked state plus the row label they are associated with. Decorative markup inside cells should be hidden from the accessibility tree so it does not add noise to row announcements.

## Styling

TableBody itself only exposes the root slot, so most visual customization happens on the body CSS class and on the rows and cells inside it. Use tokens.colorNeutralBackground1 for the default row surface and tokens.colorNeutralBackground2Hover or tokens.colorSubtleBackgroundHover for hover feedback on interactive rows. Selected rows should use tokens.colorNeutralBackground1Selected or the brand equivalent tokens.colorBrandBackground2, with tokens.colorNeutralStroke1Selected for emphasis. Row separators are best expressed with tokens.colorNeutralStroke2 as a bottom border, and the outer table frame with tokens.colorNeutralStroke1. Cell padding should follow the spacing scale, typically tokens.spacingVerticalS plus tokens.spacingHorizontalM, with tighter variants in compact layouts. Typography inside the body should use tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.lineHeightBase300, while emphasized cells can use tokens.fontWeightSemibold. Keep column widths consistent by aligning padding across header and body cells so the shared sizing math still produces equal columns, and use tokens.borderRadiusMedium if you style the body as a card-like surface rather than an edge-to-edge table.

## Performance

TableBody is a lightweight DOM container, so its cost is almost entirely determined by how many rows and cells it renders. Large bodies create proportional DOM nodes and layout work; paginate or window the data rather than rendering thousands of rows at once, and keep the number of columns reasonable since each cell adds both a node and a layout box. Column resizing is the most expensive interaction because every pointer move recomputes column widths and re-renders the body, so keep row components memoized and avoid recreating row render callbacks or inline style objects on each render. Reach for the truncate flag instead of measuring text in JavaScript, since truncation is handled by CSS and does not add layout thrash. Selection updates touch only the affected rows when rows are stable and keyed; unstable keys force remounts of whole rows and their cell subtrees on every state change.

## Theming & Tokens

TableBody inherits its appearance entirely from the surrounding FluentProvider theme, so overriding brand or neutral palettes at the provider level automatically updates row surfaces, selection highlights, and separators. Row backgrounds resolve from tokens.colorNeutralBackground1 with hover states from tokens.colorNeutralBackground2Hover and tokens.colorSubtleBackgroundHover, while selected rows use tokens.colorNeutralBackground1Selected and the brand variants tokens.colorBrandBackground2 and tokens.colorBrandStroke1. Borders and dividers map to tokens.colorNeutralStroke1 and tokens.colorNeutralStroke2, and focus rings use the theme's accessible stroke tokens. Spacing and typography inside cells should reference tokens.spacingVerticalS, tokens.spacingHorizontalM, tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.lineHeightBase300 so the body scales with density settings, and radius treatments should use tokens.borderRadiusMedium to stay consistent with other surfaces in the theme.

## Migration Notes

TableBody is a v9 concept and replaces the row markup that was previously hand-written or produced by the v8 DetailsList and Table components. In v8 the body of a table was implicit in DetailsList or rendered through IColumn/IRenderFunction callbacks; in v9 you compose the body explicitly and place TableRow children inside it. Code migrating from v8 should map row rendering into TableRow plus TableCell, replace DetailsList selection and sorting configuration with the shared grid state driven by selectionMode, onSelectionChange, sortable, sortDirection, and onSortChange, and move column width definitions from IColumn into columnId, width, and columnSizingOptions. Because the v9 body participates in a shared tableState instead of owning state itself, avoid porting stateful logic into the body and keep it in the component that renders the table.

## Edge Cases

- Rendering TableBody with a div root changes the element semantics and the styles that apply, so the matching rows and cells must also use div-based roots or the layout will not line up.
- Header and body cells must resolve identical column widths; mixing columnSizingOptions with explicit per-cell widths leaves columns permanently misaligned after any resize or container change.
- Emptying the body entirely removes all rows from the accessibility tree, so provide an explicit empty state outside the table or as a single spanning row rather than leaving the table with no content.
- Sorting is not performed by the body: if onSortChange updates an indicator but the parent does not reorder the data, the header will show a direction that does not match the visible row order.
- focusMode values that make every cell focusable multiply tab stops, so a large body with cell-level focus can require many Tab presses to traverse; use group focus for long, dense tables.
- Rows rendered with visible, hidden, or invisible still count toward your underlying data, so selection summaries and counts can disagree with what is rendered if those flags are used as filters.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
