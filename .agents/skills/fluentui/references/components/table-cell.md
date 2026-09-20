# TableCell

> **Package**: `@fluentui/react-table` v9.19.16
> **Import**: `import { TableCell } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

TableCell is the individual data cell of a Fluent UI React v9 Table, rendered through a single required root slot that resolves to a td element by default and can resolve to a div when the surrounding table structure is built from div elements rather than native table markup. Because table cells are stateful in v9, a TableCell is not purely presentational: it reads from the table state supplied through the required tableState prop to determine its column identity, size, sorting direction, and selection behavior, and it exposes hooks such as onSortChange, onSelectionChange, focusMode, sortable, sortDirection, and selectionMode so interactive behaviors can be wired per cell. Cell content is anything React can render, and the truncate prop lets a cell collapse overflowing content to a single line with an ellipsis. The component also participates in selection-oriented and appearance-oriented table surfaces: type (checkbox or radio), checked, subtle, hidden, and invisible drive selection presentation, while appearance values such as 'brand', 'neutral', or 'none' (and 'primary' for emphasis surfaces) adjust the visual weight of the cell. TableCell is the lowest-level building block of the Table and DataGrid families, and the same slot contract is reused across body cells, header cells, selection cells, and internal cell containers.

**When to use**: Use TableCell whenever you need a single unit of tabular data inside a Table, DataGrid, or any composite table layout, and use it for both header-bearing body cells and interactive cells that need to be sorted, selected, or truncated. Prefer TableCell over a hand-written td when you want the cell to participate in the table's column sizing, column resizing, sorting, and selection state instead of managing those behaviors yourself. Choose a selection-oriented variant of the cell (one that accepts type, checked, subtle, hidden, and invisible) when the cell's job is to render a checkbox or radio for row selection rather than to display data. Choose a header cell variant that accepts sortable and sortDirection when the cell labels a column and should toggle sort order, and reserve the plain TableCell for read-only or custom-rendered content. If you only need a static, non-interactive layout with no sorting or column resizing, a plain Table with plain cells is still the right choice, but if you need virtualization, keyboard grid navigation via focusMode, or column sizing options, use the cell within a DataGrid-style table state instead.

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

- **root**: Required slot that controls the element rendered for the cell; leave it as the default td when the surrounding structure is a native table and only point it at a div when the entire table is a div-based composite layout. `td`
- **tableState**: Required state object handed down from the table or grid parent; it is the source of truth for column identity, sizing, sorting, and selection, so never fabricate one per cell. `tableState from the table component`
- **columnId**: Required identifier that links the cell to its column definition so sorting, column sizing, and resizing resolve to the right column; it must match the id used in the table's column definitions. `columnId="name"`
- **width**: Required numeric width for the cell/column as computed by the table state; supply it from the state rather than hard-coding so that resizing and auto-fit stay consistent. `200`
- **columnSizingOptions**: Configure default, minimum, and maximum widths and padding per column here rather than with ad-hoc styles, so sizing stays centrally managed and resizable columns behave predictably. `columnSizingOptions with defaultWidth and minWidth`
- **autoFitColumns**: Enable when you want the table to measure content and size columns automatically; combine with a defined minimum width to avoid columns collapsing on short content. `true`
- **containerWidthOffset**: Use when the table's scroll container is inset by scrollbars, padding, or surrounding chrome, so auto-fit and resize calculations account for the real available width. `16`
- **focusMode**: Choose the focus behavior that matches the cell's contents: cell-level focus for pure data cells, and a mode that defers to interactive children when the cell contains controls. `cell`
- **truncate**: Enable on cells with long text that must stay on one line; keep the full value available to assistive technology and ensure the column has a bounded width. `true`
- **appearance**: Adjust the visual emphasis of the cell surface, using branded values for emphasized or selected contexts, neutral for standard data, and none when the cell should sit flat against the table background; the emphasis value 'primary' is used for accent-styled cell surfaces. `neutral`
- **sortable**: Set on cells that label a column and should offer a sort affordance; pair it with sortDirection and onSortChange so the announced state matches the rendered data order. `true`
- **sortDirection**: Reflects the current sort direction of the column and is typically driven by the table state rather than set by hand, so the indicator and the data never diverge. `ascending`
- **onSortChange**: Handle sorting in the table state when a sortable cell is activated; the callback receives the triggering event and the resulting sort state, which you then apply to your data. `(event, sortState) handler that updates sort order`
- **selectionMode**: Declare whether the table allows single or multiple selection so selection cells render the correct control and range interactions behave correctly. `multiselect`
- **onSelectionChange**: Handle selection from the cell, receiving either a mouse or keyboard event plus the selection data; use this to update selected rows so keyboard and pointer selection stay in sync. `(event, data) handler that toggles the selected row`
- **type**: Determines whether a selection cell renders a checkbox or a radio, which should follow the table's selection mode so semantics match the allowed number of selections. `checkbox`
- **checked**: Controls the checked state of a selection cell and supports the mixed state used for select-all behavior; always drive it from selection state rather than local component state. `true`
- **subtle**: Use on selection cells that should recede visually, such as when the row itself already communicates selection, and pair it with a visible selected state elsewhere. `true`
- **hidden**: Use when a selection cell should not be visually presented while the surrounding column layout still reserves its space, for example when selection becomes unavailable. `true`
- **invisible**: Use when a selection cell should not be visible and should not be exposed to assistive technology, such as placeholder selection cells in a row that does not support selection. `true`
- **visible**: Indicates whether the cell is currently rendered in the visible region, which matters for virtualized tables where cells outside the viewport may be unmounted. `true`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Keep the cell's rendered element aligned with the surrounding table: rely on the root slot defaulting to td inside a native table and only switch it to div when the whole table is a div-based composite layout.
- Provide a stable, meaningful columnId for every cell so sorting, column sizing, and column resizing can resolve the correct column definition in the table state.
- Use the truncate prop on cells that hold long, variable-length text instead of manually clipping with overflow styles, so the ellipsis and title behavior stay consistent.
- Set focusMode deliberately when cells contain their own focusable controls, so grid-level keyboard navigation does not fight with the controls inside the cell.
- Wire onSortChange and sortDirection together on sortable cells so the announced sort state always matches the actual data order.
- Use onSelectionChange with an appropriate selectionMode on selection cells so shift-click and keyboard range selection produce the same result as pointer selection.
- Keep tableState flowing from the table/grid parent rather than fabricating a state object per cell, since cell sizing, visibility, and sorting all derive from that single source of truth.
- Enable autoFitColumns or supply explicit width and columnSizingOptions only when you actually need measured or controlled column widths, and prefer one strategy per table.

### Don'ts

- Do not nest interactive controls inside a cell without giving the cell a focusMode that accounts for them, because grid keyboard navigation will otherwise swallow or conflict with their focus.
- Do not mix td-based and div-based roots within the same table, as that breaks the row and column relationships assistive technology depends on.
- Do not hard-code width on a cell when the table already derives widths from columnSizingOptions or autoFitColumns, since the two will disagree during resize.
- Do not rely on visual styling alone to indicate a selected, sorted, or disabled cell; pair it with the corresponding ARIA state exposed through the table structure.
- Do not render a selection cell in some rows and a data cell in the same column position in others, as the selection column alignment and select-all semantics will break.
- Do not use a header-type cell with sortable set when the underlying data cannot actually be reordered, because the sort affordance will be announced and then do nothing.
- Do not put overly heavy component trees inside a cell that is rendered many times per row; cells are the highest-cardinality element in the table.
- Do not use the invisible or hidden selection cell props as a substitute for conditionally omitting a column, since they change what is rendered and announced rather than the column layout contract.

## Anti-Patterns

### Div root inside a native table

❌ Switching the root slot to a div while the surrounding rows and table still use native tbody/thead/tr markup produces invalid structure, and screen readers can no longer associate cells with their column headers.

✅ Keep the root as the default cell element for native tables, and only use a div root when the entire table is a div-based composite layout with an explicit grid role structure.

### Ignoring tableState and hand-sizing cells

❌ Applying custom widths and paddings directly to individual cells while the table state also calculates widths creates conflicts during resizing and auto-fit, causing columns to jump or misalign.

✅ Drive width, columnSizingOptions, and containerWidthOffset from the table state, and express cosmetic differences with layout classes and spacing tokens instead of overriding computed widths.

### Interactive controls in a cell-level focus mode

❌ When a cell contains its own buttons or inputs but uses grid-level cell focus, keyboard users cannot reliably move into the nested control because arrow-key navigation intercepts focus.

✅ Choose a focusMode that defers to the cell's interactive children for cells containing controls, and use cell-level focus only for pure data cells.

### Sort affordance without sort handling

❌ Marking a cell sortable without implementing onSortChange and sortDirection makes the header announce a sortable column that never changes order, which is misleading for both sighted and assistive technology users.

✅ Only set sortable on cells whose column actually participates in sorting, and always keep sortDirection and onSortChange wired to the table state.

### Truncating without a bounded width

❌ Enabling truncate on a cell in a table whose columns size to content means the text never overflows and never ellipsizes, while other columns get squeezed instead.

✅ Give the column a defined width through column sizing options, or enable auto-fit with a minimum width, before relying on truncation to keep rows to a single line.

## Accessibility

**Requirements**: Cells must preserve native table semantics or a correctly implemented grid role structure: keep the root slot as td when the table uses tbody/thead/tr, and only use div roots inside a fully role-based grid. Sortable cells must expose sort state consistently with the sortDirection they receive. Selection cells must expose a checked state that matches the checked prop and use checkbox or radio semantics according to the type prop. Truncated content must remain available in full to assistive technology, since ellipsis is a purely visual treatment. Disabled or non-interactive cells must be communicated through state, not only through reduced color contrast, and all text and interactive affordances must meet WCAG contrast and target-size expectations.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the table and to the next focusable cell or focusable element inside a cell, depending on the cell focus mode. |
| `Shift+Tab` | Moves focus out of the current cell to the previous focusable element. |
| `Arrow keys` | When the cell is in a cell-level focus mode, move focus between adjacent cells in the corresponding direction; otherwise they are left to the control inside the cell. |
| `Enter` | Activates an interactive element within the cell, such as a checkbox or radio used for row selection. |
| `Space` | Toggles the checked state of a checkbox or selects a radio inside a selection cell, and activates buttons rendered in the cell. |

**ARIA**: role, role=cell, role=gridcell, aria-selected, aria-sort, aria-colindex, aria-rowindex, aria-checked, aria-label, aria-hidden

**Screen Reader**: Assistive technology announces a cell as part of a table or grid, generally including the associated column header and the cell's position within the row and column set, so keeping the td or gridcell role intact is what makes meaningful announcement possible. Sortable cells announce their current sort direction, selection cells announce checked state, and truncated text is read in full because the ellipsis is visual only. Cells rendered in a virtualized or otherwise hidden region may be omitted from the accessibility tree, and selection cells marked invisible are expected to be suppressed rather than announced.

## Styling

Cell styling is best done through the Table's own class slots and Griffel overrides on the root slot, using theme tokens rather than literal colors. Use tokens.colorNeutralBackground1 for the default cell surface and tokens.colorNeutralBackground2 to differentiate header, selected, or hovered cells. Text uses tokens.colorNeutralForeground1 for primary content and tokens.colorNeutralForeground2 for secondary or metadata text, and cell borders and dividers map to tokens.colorNeutralStroke2 or tokens.colorTransparentStroke when you want a borderless table. Emphasized or branded appearances work well with tokens.colorBrandBackground2 and tokens.colorBrandForeground2. Padding should be expressed with tokens.spacingHorizontalS, tokens.spacingHorizontalM, tokens.spacingVerticalS, and tokens.spacingVerticalMNudge so cells line up with the rest of the theme density. Typography should come from tokens.fontFamilyBase, tokens.fontSizeBase300, tokens.lineHeightBase300, and tokens.fontWeightSemibold for header-style emphasis. Truncation is applied by the truncate prop, but ensure the cell actually receives a constrained width, otherwise the ellipsis never triggers. Focus indication should use tokens.colorStrokeFocus2 with the standard focus outline treatment so keyboard users see the focused cell.

## Performance

Cells are the highest-cardinality component in a table, so keep their render work minimal: avoid creating new style objects or inline callbacks per cell on every render, and memoize expensive cell content. Column sizing and auto-fit measurement can force layout reads across the whole grid, so batch sizing changes and avoid toggling autoFitColumns or columnSizingOptions during scroll or rapid interaction. Virtualized tables mount and unmount cells as they leave the viewport, so the visible flag should be treated as a hint rather than a guarantee that a cell is mounted, and per-cell effects should be cheap or avoided entirely. Prefer structural overrides via the root slot and shared classes over per-cell Griffel overrides to keep atomic class generation bounded.

## Theming & Tokens

TableCell consumes the Fluent theme through Griffel tokens applied to its root and its internal content slots. The default surface is tokens.colorNeutralBackground1, with tokens.colorNeutralBackground2 used for alternate, hovered, or selected rows, and header-style cells typically use tokens.colorNeutralBackground2 with tokens.colorNeutralForeground1 at tokens.fontWeightSemibold. Secondary text inside a cell should use tokens.colorNeutralForeground2, and dividers or cell borders map to tokens.colorNeutralStroke2 or tokens.colorTransparentStroke when borders are disabled. Branded or emphasized cell appearances draw from tokens.colorBrandBackground2 and tokens.colorBrandForeground2. Spacing comes from tokens.spacingHorizontalS, tokens.spacingHorizontalM, tokens.spacingVerticalS, and tokens.spacingVerticalMNudge, and typography from tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.lineHeightBase300. Focus indication on a focused cell uses tokens.colorStrokeFocus2, and setting colorBrandBackground or colorNeutralBackground tokens on the Table provider-level style overrides will cascade into the cells.

## Migration Notes

Table cells in v9 replace the v8 cell primitives with slot-based components and a state-driven table model. Instead of passing items and column definitions into a monolithic table, you compose cells and let the table state carry column identity, sizing, sorting, and selection, so behaviors previously configured through shared table props are now driven per cell by props such as columnId, tableState, sortable, sortDirection, and selectionMode. The root slot makes the element configurable, which means migration work often involves deciding between td and div roots depending on whether the table keeps native semantics or becomes a role-based grid.

## Edge Cases

- The columnId of a cell must exist in the table's column definitions; if it does not, sorting and column resizing for that cell silently do nothing.
- Truncation only takes effect when the column has a constrained width, so a table that sizes columns to content will never show an ellipsis even with truncate enabled.
- Selection cells must be present in every row of the selection column, including rows that are not selectable, which is what hidden and invisible exist for.
- A selection cell using the radio type must align with a single-selection table mode, otherwise the rendered control contradicts the selection behavior the table allows.
- In virtualized tables the visible prop can be false for cells that are logically part of a row but are outside the rendered window, so code that assumes every row has mounted cells will fail.
- Switching the root slot from the default cell element to a div partway through a table creates inconsistent semantics that neither the table nor assistive technology can reconcile.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
