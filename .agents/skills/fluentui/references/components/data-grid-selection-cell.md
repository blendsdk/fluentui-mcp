# DataGridSelectionCell

> **Package**: `@fluentui/react-table` v9.19.16
> **Import**: `import { DataGridSelectionCell } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

DataGridSelectionCell is the selection column cell of the Fluent UI v9 DataGrid family. It is a single-purpose cell rendered inside DataGridRow that hosts the row-level selection affordance — a checkbox when the grid allows multiple row selection, or a radio-style control when only one row may be selected. Rather than being configured directly with a selection value, it reads the grid's selection contract from context: the required tableState and columnId props connect it to the owning DataGrid's feature state, while selectionMode determines which control type is rendered. It accepts the same low-level cell props as other DataGrid cells (root and focusMode for the rendered td/div element and keyboard focus behavior, plus the column-sizing and layout props such as width, containerWidthOffset, columnSizingOptions, and autoFitColumns), and it forwards interaction upward through onSelectionChange. Attributes such as appearance, type, checked, subtle, hidden, and invisible are inherited from the underlying checkbox/radio primitive and are normally driven by the grid itself. In practice you rarely hand-author this component: it is emitted by the DataGrid's column/row rendering machinery, but it is exported for composition scenarios where you build custom cell renderers or wrap the grid with your own layout logic.

**When to use**: Use DataGridSelectionCell only inside the DataGrid family — specifically within DataGrid rows when the grid is configured for single or multiple row selection and you are composing cells manually instead of relying on the default selection column. Reach for DataGridCell (or the specialized DataGridHeaderCell / DataGridSelectionCell counterparts) for ordinary data content; use DataGridSelectionCell when the content of the cell is the row-selection control itself. If you are building a plain Table rather than a DataGrid, use TableSelectionCell instead, which serves the same role for the non-DataGrid Table API. When the tabular data is static and non-interactive, a simple Table or List is a better fit — pulling in DataGrid and its selection machinery adds state and focus management you do not need.

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

- **selectionMode**: Determines whether the cell renders a checkbox (multiple rows selectable) or a radio-style control (only one row selectable). Set it on the owning DataGrid rather than per cell so every row in the grid agrees on the selection model. `multiple`
- **tableState**: Required. The DataGrid feature state object that the cell reads to know the current selection, column sizing, and row identity. It is supplied by the grid's rendering pipeline; do not construct or substitute it manually. `tableState from DataGrid context`
- **columnId**: Required. The identifier of the selection column this cell belongs to. It must match the column definition used by the grid so sizing, focus ordering, and state lookups resolve to the right column. `selection`
- **root**: Required slot for the rendered cell element (a td in a table layout, or a div when rendering outside a native table). Use it to attach custom class names, data attributes, or event handlers to the cell wrapper. `root slot on td`
- **width**: Required. The rendered width of the selection column. Keep it narrow and constant relative to data columns so the checkbox or radio stays visually anchored at the row start; supply the value through the column definition rather than ad hoc. `48`
- **containerWidthOffset**: Compensates the computed column width for chrome such as scrollbars or padding on the grid container. Use when the grid scrolls and the selection column appears mis-measured. `scrollbar width offset`
- **autoFitColumns**: When enabled, lets the grid recalculate column widths against the container. Enable it on the grid level if you want the selection column to participate in auto-fitting; keep it off if you need a fixed selection gutter. `true`
- **columnSizingOptions**: Declares sizing behavior (such as default and minimum widths) for the selection column when column resizing is in use. Provide an entry for the selection column's columnId to prevent users from shrinking it below a usable target. `{ selection: { defaultWidth: 48, minWidth: 44 } }`
- **onSelectionChange**: Fired when the user toggles the row's selection control, whether by mouse or keyboard, with the change data describing the affected row. Handle it at the grid level to update your selection state rather than nesting handlers per cell. `(event, data) => updateSelectedRows(data)`
- **onSortChange**: Reports sort changes for sortable columns. A selection column is not sortable, so this prop is inert here; wire it on sortable header cells instead. `(event, sortState) => applySort(sortState)`
- **focusMode**: Controls how the cell participates in grid keyboard focus: cell mode makes it a focus target, none removes it from the tab order, and group treats it as part of a focus group. Leave the default so keyboard users can reach and toggle the selection control. `cell`
- **sortable**: Whether the column can be sorted. The selection column is not sortable, so this should remain unset for DataGridSelectionCell. `false`
- **sortDirection**: Indicates the current sort direction of the column. Not applicable to a selection column; use it on sortable data columns. `ascending`
- **type**: Selects the underlying control type, checkbox or radio. It is derived from the grid's selection mode; coordinate it with selectionMode rather than setting it independently so semantics and behavior stay aligned. `checkbox`
- **checked**: Reflects whether the row is currently selected. It is controlled by grid selection state; read it from tableState and never hard-code it per row, including for partially selected or indeterminate cases handled by the header control. `true`
- **appearance**: Controls the visual emphasis of the inner control. The grid applies its own appearance by default; override only as part of a documented visual variant, and keep it uniform across rows. `primary`
- **subtle**: Renders the control with reduced visual prominence. Use only if the surrounding grid intentionally de-emphasizes selection; applying it to some rows and not others makes the column look inconsistent. `true`
- **hidden**: Hides the cell's rendered content. Use sparingly and only when the selection affordance must disappear for particular rows; confirm that the loss of a selection control is communicated elsewhere. `true`
- **invisible**: Keeps the cell's layout space while removing it visually. Useful for preserving column alignment when the selection control is temporarily not shown, but the resulting blank gutter should still read as intentional. `true`
- **visible**: Controls whether the cell participates in the rendered output. Manage it through the owning grid's state so the header, body, and column sizing remain in sync when a column is toggled. `true`
- **truncate**: Whether cell content is truncated to the column width. A selection control is icon-sized, so truncation is normally irrelevant here; leave it unset unless the cell also contains text. `false`

## Best Practices

### Do's

- Let the DataGrid supply tableState and columnId through its row/cell rendering pipeline rather than passing them by hand; they are required and must match the owning grid instance.
- Set the selection behavior once on the DataGrid's selectionMode so that DataGridSelectionCell renders the correct control type automatically instead of forcing the type prop.
- Handle row selection through the grid-level onSelectionChange callback so selection state stays in one place, rather than wiring per-cell change handlers.
- Keep a stable, descriptive column identifier (for example a dedicated selection columnId) so column resizing, sizing options, and focus routing remain deterministic.
- Give the selection column an explicit narrow width and, when resizing is enabled, declare columnSizingOptions for that column so users can adjust or lock it as needed.
- Leave focusMode at its default (cell focus) so keyboard users can reach the selection control with Tab and toggle it with Space, consistent with the rest of the grid.
- Pair the selection cell with a visible header-level selection control in the corresponding header so users can select or clear all rows in one action.

### Don'ts

- Don't place arbitrary row content (text, links, badges) inside DataGridSelectionCell — it is reserved for the selection affordance; use a regular data cell for everything else.
- Don't control checked yourself on a per-row basis; the checked value reflects grid selection state and overriding it desynchronizes the UI from tableState.
- Don't mix checkbox and radio semantics by toggling type independently of selectionMode, which breaks the single-versus-multiple selection contract users see and screen readers announce.
- Don't use DataGridSelectionCell outside a DataGrid/DataGridRow hierarchy — it depends on grid context and will not behave correctly standalone.
- Don't set appearance, subtle, hidden, or invisible on individual selection cells to differentiate rows; those props are inherited primitive styling and per-row variations confuse visual hierarchy.
- Don't place sortable or sortDirection concerns on a selection column — sorting belongs on sortable data columns and is surfaced through onSortChange on those header cells.
- Don't rely on disabled-looking or invisible selection cells as a substitute for validation messaging; hide the affordance only when the row genuinely cannot be selected and communicate why elsewhere.

## Anti-Patterns

### Rebuilding the selection control by hand

❌ Placing a standalone Checkbox inside an ordinary DataGridCell duplicates the semantics, focus handling, and row-index wiring that DataGridSelectionCell provides, and it drifts out of sync with the grid's selection state.

✅ Use DataGridSelectionCell for the selection column and let the grid drive its checked state and control type; reserve plain cells and Checkbox for editing scenarios inside data columns.

### Controlling checked per row

❌ Passing an explicit checked value to each cell bypasses tableState, so the checkbox no longer reflects the real selection and select-all, range selection, and keyboard toggling all break.

✅ Keep selection in the DataGrid's selection state, update it in the grid-level onSelectionChange handler, and let the cell derive its checked value from that state.

### Mismatched control semantics

❌ Rendering checkboxes in a single-selection grid (or radios in a multi-select grid) tells screen reader users the wrong interaction model and lets the UI reach states the data model cannot represent.

✅ Align the rendered control with the grid's selection mode so multiple selection yields checkboxes and single selection yields radios, consistently for header and body cells.

### Selection column used for other content

❌ Putting avatars, status badges, or action buttons in the selection cell makes the column do too much, breaks the narrow fixed gutter the grid expects, and muddies the accessible name of the control.

✅ Keep DataGridSelectionCell limited to the selection affordance and move any other per-row content into dedicated data columns.

### Sorting indicators on the selection column

❌ Enabling sortable or setting sortDirection on the selection column invites users to sort by a meaningless key and produces confusing header affordances.

✅ Leave the selection column unsortable and expose sorting only on columns whose values are actually orderable, handling onSortChange on those header cells.

## Accessibility

**Requirements**: Row selection must be operable by keyboard alone and must not depend on color or position to convey state. The grid must advertise its selection model (single versus multiple), each row's selected state must be programmatically determinable, and the selection control must have an accessible name that identifies the row it affects. Maintain a minimum 24x24 CSS pixel interactive target (larger where practical), preserve visible focus indication on the cell wrapper and the inner control, and ensure contrast of the control's checked, unchecked, hover, and focus visuals meets WCAG 1.4.11 non-text contrast (3:1) and 1.4.3 text contrast for any accompanying label.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the grid and onto the selection cell (when focusMode permits cell focus), and out of the grid after the last focusable cell. |
| `Shift+Tab` | Moves focus backward to the preceding focusable cell or control in the grid. |
| `Space` | Toggles the checkbox (multiple selection) or selects the radio (single selection) of the focused row and raises onSelectionChange. |
| `Enter` | Activates the focused selection control, producing the same selection change as Space. |
| `ArrowDown` | Moves grid focus to the row below, keeping the selection state unchanged, via the grid's own focus management. |
| `ArrowUp` | Moves grid focus to the row above, keeping the selection state unchanged, via the grid's own focus management. |
| `Home / End` | Moves focus to the first or last cell in the grid's focusable order. |

**ARIA**: aria-label / aria-labelledby on the selection control to name the row being selected, role="checkbox" with aria-checked for multiple-selection rows, or role="radio" with aria-checked for single-selection rows, aria-selected on the row element to expose the current selection state, aria-multiselectable on the grid container to announce the selection model, aria-rowindex and aria-colindex on the cell so assistive technology can announce row and column position, aria-hidden on decorative visuals inside the cell

**Screen Reader**: Screen readers announce the cell as a checkbox or radio with its checked state, followed by its accessible name, so users hear which row the control belongs to before activating it. Because the cell coordinates with the grid's focus modes and row/column indices, moving with arrow keys announces the row and column position and the selected state of each row in turn. Toggling with Space produces a state-change announcement; in single-selection mode, moving the radio selection announces the newly selected row and implicitly unselected previous row. If the control is hidden or invisible for a row, nothing is announced for that cell, so the absence of a selection affordance must be understandable from surrounding content.

## Styling

Most visual tuning belongs on the cell wrapper and the inner control rather than on the DataGrid itself. Target the cell with its generated class and use Griffel tokens: set the background with tokens.colorNeutralBackground1 and hover with tokens.colorNeutralBackground1Hover, express selected rows with tokens.colorNeutralBackground1Selected, and use tokens.colorBrandBackground / tokens.colorBrandBackgroundSelected when the grid is styled to emphasize selection in brand color. Borders around the cell typically use tokens.colorNeutralStroke1 with tokens.borderRadiusMedium for rounded corners; separators can use tokens.colorNeutralStroke2. Keep spacing consistent with the rest of the grid by using tokens.spacingHorizontalS and tokens.spacingVerticalXS for cell padding, and align the control with the row's text baseline using the same vertical padding applied to DataGridCell. Focus indication should use tokens.colorStrokeFocus2 with a tokens.strokeWidthThick ring, ideally applied via :focus-within on the cell so the wrapper and control highlight together. If the grid supports resizing, style the resize affordance with tokens.colorNeutralForeground4 and tokens.colorNeutralStroke1Hover. Avoid hard-coded colors and pixel values so the selection column tracks theme and density changes.

## Performance

A selection cell is rendered for every row in the grid body, so its render cost multiplies with row count. Keep the grid-level onSelectionChange handler referentially stable and avoid creating new inline handlers, class names, or style objects per row, since each new identity forces additional work during selection updates. When rows are virtualized, only visible selection cells mount at once, so the affordance is cheap; when they are not virtualized, prefer paging or windowing before adding visual complexity to the cell. Column sizing work driven by width, containerWidthOffset, columnSizingOptions, and autoFitColumns is most noticeable on resize and auto-fit passes, so avoid changing those values during scroll or selection updates. Finally, selecting or clearing many rows at once should update selection state in a single batched change rather than one callback per row, keeping the grid's re-render turbulence low.

## Theming & Tokens

DataGridSelectionCell inherits the active FluentProvider theme along with the rest of the grid, so it responds to both light/dark schemes and brand ramps automatically. The cell surface uses tokens.colorNeutralBackground1 with tokens.colorNeutralBackground1Hover for pointer hover and tokens.colorNeutralBackground1Selected for selected rows; striped or elevated grids commonly use tokens.colorNeutralBackground2. Foreground and borders map to tokens.colorNeutralForeground1, tokens.colorNeutralForeground2 (secondary row metadata), and tokens.colorNeutralStroke1 with tokens.colorNeutralStroke2 for separators. Brand-driven emphasis comes from tokens.colorBrandBackground, tokens.colorBrandBackgroundSelected, tokens.colorBrandStroke1, and tokens.colorBrandForeground1. Focus rings use tokens.colorStrokeFocus2 and tokens.strokeWidthThick, and rounded corners use tokens.borderRadiusSmall or tokens.borderRadiusMedium. Spacing such as tokens.spacingHorizontalS, tokens.spacingHorizontalMNudge, and tokens.spacingVerticalXS keeps the cell aligned with sibling DataGridCell padding, and typography (tokens.fontFamilyBase, tokens.fontSizeBase300) applies if any text accompanies the control. Because these are theme tokens, customizing through them preserves high-contrast and density overrides.

## Migration Notes

In previous Fluent generations, selection was expressed as a dedicated selection column with a `selection` slot and a Selection component, and DetailsList supplied its own selection object. In v9 the responsibility is split: the DataGrid owns selectionMode and the selection state, DataGridRow exposes selected state, and DataGridSelectionCell renders the checkbox or radio affordance inside the row. There is no `selection` prop or selection object to pass to the cell — selection changes flow out through the grid-level onSelectionChange handler (and, for tables outside DataGrid, TableSelectionCell plays this role). Because the cell derives its control type from selectionMode and its checked value from grid state, migration code that manually managed checkbox state per row should be rewritten to read from the DataGrid's selection state instead.

## Edge Cases

- Rendering DataGridSelectionCell outside a DataGrid/DataGridRow hierarchy leaves it without the tableState and columnId context it requires, producing no usable selection control.
- In single-selection mode the control behaves as a radio, so clicking an already selected row cannot deselect it the way a checkbox toggles off — clear selection must be handled programmatically.
- A select-all header control can render an indeterminate state when only part of the rows are selected; rows whose selection is unavailable should not appear selectable rather than silently ignoring the click.
- If the selection column is narrow and column resizing is enabled without columnSizingOptions entries for it, users can shrink the gutter below the interactive target size recommended for touch.
- Turning the cell invisible keeps its layout width, which preserves alignment but leaves an unexplained empty gutter if the reason for hiding is not otherwise communicated.
- Virtualized bodies mount and unmount selection cells as rows scroll, so any imperative work tied to the cell's lifecycle (measurement, focus juggling) must be resilient to repeated mounting.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
