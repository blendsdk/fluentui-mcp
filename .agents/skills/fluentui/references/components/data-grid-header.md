# DataGridHeader

> **Package**: `@fluentui/react-table` v9.19.16
> **Import**: `import { DataGridHeader } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

DataGridHeader is the header-row group of the Fluent UI React v9 DataGrid family. It renders a table header region (a thead, or a div when a virtualized/non-table layout is used) that hosts the header cells for every column in the grid, and it participates directly in the grid's shared table state rather than owning state of its own. Because it is driven by the tableState produced by DataGrid's feature hooks, it can reflect sorting, row selection, and column resizing without any bespoke wiring: a sortable header cell toggles through the onSortChange callback and reports its current sortDirection, a selection cell renders a select-all checkbox or radio that reports through onSelectionChange, and column widths flow from columnSizingOptions, width, and columnId. It also controls how header cells join the keyboard interaction model through focusMode and whether a column is rendered at all through visible. DataGridHeader is almost never used in isolation: it is rendered as one of the children of DataGrid, alongside DataGridBody, and its cells are composed with DataGridHeaderCell and DataGridSelectionCell.

**When to use**: Use DataGridHeader whenever you need the interactive, state-aware header of a DataGrid — specifically when columns must be sortable, when the grid supports row selection through a header-level select-all control, when users must be able to resize columns, or when the grid needs arrow-key cell navigation across header cells. Use it together with DataGridBody so that both regions read from the same tableState; splitting them across different state sources leads to headers that visually claim a sort order the rows do not honor. Prefer the plainer TableHeader when you only need static, semantic table markup with no sorting, selection, or resizing behavior, and prefer a List or FlatTree when the data is not tabular. DataGridHeader is also the right choice when a grid is rendered inside a scrollable container, because autoFitColumns and containerWidthOffset let the header distribute available width correctly.

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

- **focusMode**: Accepts a DataGridCellFocusMode value that determines whether the header cells can receive focus and whether they are included in the sequential tab order. Use it to let keyboard users reach sortable headers and header menus, or to keep focus out of the header when it is purely presentational and everything happens in the body. `cell`
- **onSortChange**: Called with the originating mouse event and a SortState when a sortable header cell is activated. Use it to update the parent's sort state and re-sort the rows you pass into the grid; the header does not sort data by itself, so the callback must be wired whenever any header cell is marked sortable. `handler that receives the new sortState and re-sorts items by columnId`
- **onSelectionChange**: Called with either a mouse or keyboard event plus OnSelectionChangeData, typically with all row ids in the grid. Use it to keep the parent's selected items in sync with the header select-all control, and make sure the same callback contract is used by DataGridBody. `handler receiving all row ids and updating the selected set`
- **selectionMode**: Declares the grid's selection model, which determines what kind of control the header selection cell renders and what the body rows should render. Choose a single-selection mode when only one row may be chosen and a multi-selection mode when the header should offer a select-all affordance, and keep it identical across the header, body, and rows. `multiselect`
- **columnSizingOptions**: Provides per-column sizing metadata such as minimum, maximum, and ideal widths and padding, keyed by column id. Use it to constrain user resizing, to ensure columns grow sensibly when the container widens, and to keep the header and body columns in lockstep. `map of columnId to minWidth, idealWidth, and padding`
- **columnId**: The stable identifier for the column this header cell represents, and it must match the key used in your items and column definitions. Sorting callbacks, selection bookkeeping, and column sizing all resolve columns through this value, so it should be immutable across renders. `name`
- **width**: The rendered width of the column header cell. Provide an explicit value (or a sizing entry with an ideal width) so the header does not reflow unpredictably as data loads; when auto-fitting is enabled this value is the starting point that layout adjusts from. `200`
- **containerWidthOffset**: A number of pixels subtracted from the measured container width before columns are laid out, useful for compensating for scrollbars, gutters, or padding around the grid. Set it when auto-fitting leaves the last column clipped or causes an unexpected horizontal scrollbar. `16`
- **autoFitColumns**: When true, available container width is distributed across the columns instead of relying solely on fixed widths. Combine it with columnSizingOptions minimum and maximum widths so no column collapses to an unusable size or stretches beyond a readable measure. `true`
- **tableState**: The TableFeaturesState object produced by the DataGrid feature hooks (selection, sorting, column sizing, and similar). The header reads selection, sort, and sizing information from it, so the same object must be handed to both the header and the body; never fabricate this object by hand. `state returned by the DataGrid feature hooks`
- **root**: Slot for the underlying element of the header, header cell, row, or selection cell — a thead on DataGridHeader, a td on the header cell, a tbody or div on the row, and a div on the selection cell. Use it to attach className, style, id, data-* attributes, or to change the rendered element when a div-based layout is required. `root with className and data-testid applied`
- **visible**: Controls whether a column or header cell is rendered. Set it to false instead of removing the column from your column definitions, so internal column indexes, sizing, and selection accounting stay consistent with the data model. `false`
- **appearance**: Controls the visual emphasis of the header cell or selection cell. The primary value is used to emphasize header content such as the active sort column, while the brand, neutral, and none values on selection cells let you dial the selection control from fully branded through fully de-emphasized to unstyled. `primary`
- **truncate**: Clips overflowing header text with an ellipsis instead of wrapping or expanding the column. Enable it for dense grids with long column names, and always provide a tooltip or title so the full label is still reachable. `true`
- **sortable**: Marks a header cell as sortable, which makes it interactive and lets it report its sort state to assistive technology. Only set it on columns your onSortChange handler actually knows how to sort. `true`
- **sortDirection**: The current sort direction for the column, set only on the header cell that is actively sorted and left unset on the rest. This value drives the visible sort indicator and the announced sort state, so it must be updated from the parent when onSortChange fires. `ascending`
- **type**: Chooses whether the header selection cell renders a checkbox or a radio, and it must agree with selectionMode: a checkbox for multi-selection with a select-all semantic, a radio for mutually exclusive single selection. `checkbox`
- **checked**: Accepts the checkbox-style checked state, including a mixed value. Use the mixed value on the header select-all control when only some rows are selected, and true only when every selectable row is selected. `mixed`
- **subtle**: Renders the selection control with reduced visual weight so it recedes into the header background. Use it in dense grids or when selection is secondary to the data, but keep the control large enough and high-contrast enough to remain a clear target. `true`
- **hidden**: Hides the header or selection cell visually while reserving its space in the layout. Use it to keep column alignment stable when a control is temporarily not applicable, rather than removing the cell and shifting every following column. `true`
- **invisible**: Removes the header or selection cell from the layout entirely so surrounding columns can reclaim the space. Use it when a column genuinely should not occupy width, and verify that column indexing and selection behavior remain correct afterwards. `true`

## Best Practices

### Do's

- Supply a stable columnId for every header cell so sorting, selection, and column resizing can address the column unambiguously.
- Derive the header and body from a single tableState (plus the same items and columns) so header affordances and rendered rows can never disagree.
- Set sortDirection on the header cell whose column is currently sorted, and clear it on the others, so assistive technology announces exactly one active sort.
- Handle onSortChange by updating your own sort state in the parent and re-sorting the data you pass back into the grid; treat the callback as a request, not as the source of truth.
- Give every column an explicit width (or a sizing entry with idealWidth and minWidth in columnSizingOptions) so the header does not jump when data loads or when a column is resized.
- Pair truncate with a title attribute or a Tooltip so clipped header labels remain discoverable, and check the result under increased text zoom.
- Choose focusMode deliberately — for example, allow header cells to be focusable when header sorting or header-level menus must be reached by keyboard, and restrict focus to the body when the header is purely decorative.
- Keep selectionMode consistent across DataGridHeader, DataGridBody, and every row so the header checkbox and the row checkboxes describe the same selection model.

### Don'ts

- Don't render multiple DataGridHeader regions for the same grid; two headers with independent state will produce contradictory sort indicators and duplicate select-all controls.
- Don't mark a column sortable without implementing onSortChange — the header will advertise interactivity it cannot fulfill.
- Don't hard-code pixel widths on the header cell root while also using autoFitColumns or columnSizingOptions; the two will fight and produce layout thrash.
- Don't use selectionMode together with a selection cell type that contradicts it (for example a radio type in a multi-select grid), because the header control will describe an interaction model the rows do not implement.
- Don't hide columns by simply not rendering them while keeping them in the columns array, or sorting and selection indices will drift; use the visible option so the grid's state stays aligned with what is painted.
- Don't nest interactive controls such as buttons inside a sortable header cell's label area without stopping event propagation, or a click intended for the control will trigger a sort.
- Don't place large blocks of explanatory text inside header cells; headers should be short labels so truncation and column sizing remain predictable.
- Don't rely on color alone to communicate sort direction; the sorted state must also be conveyed through ARIA and a visible indicator.

## Anti-Patterns

### Header sorting without a data source of truth

❌ Marking header cells as sortable and letting them display a sort indicator while never handling onSortChange leaves the header claiming an order the rows do not follow. Users see an ascending indicator over unsorted data, and screen reader users are told the table is sorted when it is not.

✅ Treat onSortChange as the single entry point for sorting: store the resulting SortState in the parent, sort the items array with it, and pass the matching sortDirection back down to the active header cell only.

### Two header regions for one grid

❌ Rendering more than one DataGridHeader, or a DataGridHeader that does not share the body's tableState, produces duplicate select-all controls and contradictory sort indicators, and it breaks the row/column association that screen readers rely on.

✅ Render exactly one DataGridHeader per grid, give it the same tableState, items, and columns as DataGridBody, and keep a sticky or repeated header purely presentational if a visual duplicate is needed.

### Mixing fixed widths with auto-fit layout

❌ Setting hard pixel widths on the header cell roots while also enabling autoFitColumns or columnSizingOptions causes the two systems to overwrite each other, producing flicker, clipped labels, and an unexpected horizontal scrollbar.

✅ Choose one strategy. Either use explicit width values everywhere, or enable autoFitColumns and express per-column constraints through columnSizingOptions with minimum, maximum, and ideal widths so the layout engine owns the final sizes.

### Removing columns to hide them

❌ Filtering a column out of the column definitions to hide it from the header desynchronizes internal column indexes from the data model, which corrupts selection bookkeeping, sorting keys, and any persisted column sizing state.

✅ Keep the column in the definitions and turn it off with the visible option so the grid retains its column identity while simply not painting the header cell.

### Selection mode that disagrees with the selection control

❌ A multi-row selectionMode combined with a radio selection cell type (or a single-selection mode with a select-all checkbox) tells users they can do something the data layer will not honor, leading to lost or overwritten selections.

✅ Keep selectionMode, the selection cell type, and the body rows aligned: checkbox with a mixed checked value for multi-selection, radio for mutually exclusive single selection, and the same onSelectionChange contract in both header and body.

## Accessibility

**Requirements**: The header region must expose correct table semantics: header cells should be announced as column headers belonging to the header row, and sortable headers must communicate their sort state programmatically (WCAG 1.3.1 Info and Relationships, 4.1.2 Name, Role, Value). All header interactions — sorting, select-all, column resizing — must be operable by keyboard alone with a visible focus indicator (WCAG 2.1.1 Keyboard, 2.4.7 Focus Visible). Focus order must follow visual order across header cells and then into the body (WCAG 2.4.3 Focus Order). The select-all control needs an accessible name that describes its scope, and its mixed state must not be conveyed by the indeterminate glyph alone (WCAG 1.4.1 Use of Color). Header text and sort indicators must meet contrast minimums in all themes (WCAG 1.4.3 Contrast), must remain usable at 200% text zoom without clipping meaningful labels (WCAG 1.4.4 Resize Text), and grids wider than the viewport must reflow or scroll without trapping content (WCAG 1.4.10 Reflow). Resize handles and sort triggers should meet minimum target size expectations (WCAG 2.5.8 Target Size).

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into and out of the grid; when header cells are in the tab order (per focusMode) the first header cell receives focus, otherwise focus passes to the body. |
| `Shift + Tab` | Moves focus backwards out of the header region or to the previous focusable cell. |
| `Arrow Left / Arrow Right` | Moves focus between adjacent header cells in the same row, including the selection cell column. |
| `Arrow Up / Arrow Down` | Moves focus between the header row and the first body row, or between body rows when focus is already in the body. |
| `Home` | Moves focus to the first header cell of the row. |
| `End` | Moves focus to the last header cell of the row. |
| `Enter` | Activates the focused sortable header cell and requests a sort change through onSortChange, and toggles the focused select-all checkbox or radio. |
| `Space` | Toggles the select-all checkbox or radio in the header selection cell, and activates a focused sortable header cell without scrolling the page. |

**ARIA**: role="row" on the header row and role="columnheader" on each header cell, aria-sort="ascending", "descending", or "none" on sortable header cells, aria-selected on the header selection cell to reflect the current selection state, aria-checked (including the mixed value) on the select-all checkbox control, aria-label providing an accessible name such as "Select all rows" for the header selection control, aria-colindex and aria-rowindex when the grid renders as a div-based layout rather than a real table, aria-rowcount and aria-colcount on the grid root to describe total dimensions when virtualization is used, aria-hidden on purely decorative sort and resize glyphs so they are not announced

**Screen Reader**: Screen readers announce the header region as a row of column headers, reading each header cell's label together with its position in the grid. A cell with an active sort is announced with its direction, for example "Name, column header, sorted ascending, button", and pressing Enter or Space on it announces the new sort direction once the parent re-renders with the updated sortDirection. The header selection cell is announced as a checkbox (or radio) named for its scope, and its indeterminate checked value is announced as "mixed" so users know that some but not all rows are selected. When DataGridHeader renders as a div-based layout, the explicit row and column index attributes are what allow screen readers to reconstruct the column associations that a native table would supply implicitly.

## Styling

Most header styling should target the header cell slots rather than the header row itself. Header cell backgrounds and text typically use tokens.colorNeutralBackground1 and tokens.colorNeutralForeground1, with tokens.colorNeutralForeground2 for secondary or sorting-indicator glyphs and tokens.colorNeutralBackground1Hover / tokens.colorNeutralBackground1Pressed for interactive sortable cells. Emphasized header cells styled with appearance set to primary read from tokens.colorBrandBackground and tokens.colorBrandForeground1 for the selected brand look. Use tokens.colorNeutralStroke1 or tokens.colorNeutralStroke2 for the row separator, tokens.borderRadiusMedium for rounded resize hover states, and tokens.spacingHorizontalS / tokens.spacingHorizontalM plus tokens.spacingVerticalXS for cell padding so the header aligns with body cells that share the same spacing tokens. Header label typography should use tokens.fontWeightSemibold with tokens.fontSizeBase300 to match grid column headers elsewhere in the product. For sticky headers inside a scrolling container, apply position: sticky, tokens.colorNeutralBackground1 (an opaque background, so rows do not bleed through), a tokens.colorNeutralStroke2 bottom border, and tokens.zIndexSticky. Always compare your output in the dark and high-contrast themes, where the neutral and brand token sets resolve to different values.

## Performance

The header re-renders whenever the shared tableState changes, so anything you pass down — columnSizingOptions objects, column definitions, sort handlers, selection handlers — should be memoized or defined outside the render path. Creating a new columnSizingOptions object or a new columns array on every render forces the header and every body row to recompute sizing and re-render, which is the most common cause of sluggish grids. Column resizing is the heaviest interaction because it updates width values for the resized column on every pointer move; keep the resize path free of expensive work such as re-sorting or re-fetching, and debounce anything that must happen continuously. When the grid is large or virtualized, avoid attaching expensive render logic inside header cells and prefer CSS-driven indicators for sort state. Row selection work in onSelectionChange should operate on ids and sets rather than scanning arrays of objects inside the handler.

## Theming & Tokens

DataGridHeader inherits everything from the surrounding FluentProvider, so switching between light, dark, and high-contrast themes changes the resolved values of every token it uses without any component changes. Header surfaces resolve from tokens.colorNeutralBackground1, hover and pressed states on interactive sortable cells from tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed, and header text from tokens.colorNeutralForeground1 with secondary glyphs such as sort indicators drawn in tokens.colorNeutralForeground2. Emphasized header cells styled with the primary appearance draw from tokens.colorBrandBackground and tokens.colorBrandForeground1. Separators and resize affordances resolve from tokens.colorNeutralStroke1, tokens.colorNeutralStroke2, and tokens.colorNeutralBackground1Hover, while spacing and shape come from tokens.spacingHorizontalS, tokens.spacingHorizontalM, tokens.spacingVerticalXS, and tokens.borderRadiusMedium. Typography follows tokens.fontSizeBase300 with tokens.fontWeightSemibold. If you build a custom theme, override the neutral and brand token families rather than hard-coding colors on the header, and verify that the sort indicator and select-all control remain distinguishable in high contrast.

## Migration Notes

In Fluent UI React v8 the equivalent surface was DetailsList / DetailsHeader, where column behavior was configured imperatively through props on the column definition (onColumnHeaderClick, isSorted, isSortedDescending, onColumnResize, onRenderDetailsHeader) and selection came from a Selection object. In v9 the header is a declarative component: sorting is expressed through onSortChange plus the sortDirection state on each header cell, selection through selectionMode, the header selection cell type, checked, and onSelectionChange, and resizing through columnSizingOptions and width values keyed by columnId. Selection no longer requires constructing a v8 Selection utility — the header and body read the same tableState produced by the DataGrid feature hooks. Imports also change: the component is imported from @fluentui/react-components rather than from @fluentui/react, and header cells are composed with DataGridHeaderCell and DataGridSelectionCell instead of the DetailsList column render props.

## Edge Cases

- Every column in a DataGrid requires a unique columnId; a missing or duplicated id breaks sorting keys, selection ranges, and sizing lookups even though the grid still renders.
- A sortable header cell that never receives a sortDirection renders without a sort indicator, so the parent must set the direction on exactly the active column and clear it from the others on every sort change.
- The header selection cell occupies its own column, so column counts, column widths, and auto-fit calculations must account for it; forgetting this offsets every subsequent column.
- When autoFitColumns is enabled inside a scrollable container, the measured container width includes the scrollbar unless containerWidthOffset compensates for it, which can leave the last column clipped or trigger a horizontal scrollbar.
- The hidden option reserves layout space while invisible removes it entirely, so swapping between them shifts column alignment; choose based on whether column positions must stay stable.
- Inside a sticky header inside a scrolling viewport, a transparent background lets body rows show through the header; set an opaque background token such as tokens.colorNeutralBackground1.
- Setting focusMode so header cells are not focusable means sortable headers and header-level menus can only be reached if an equivalent control exists elsewhere, which can make sorting mouse-only.
- Truncation interacts badly with variable-width fonts and text zoom: a label that fits at 100% may clip at 200%, so verify truncated headers under zoom before shipping.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
