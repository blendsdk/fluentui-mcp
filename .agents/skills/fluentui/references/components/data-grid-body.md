# DataGridBody

> **Package**: `@fluentui/react-table` v9.19.16
> **Import**: `import { DataGridBody } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

DataGridBody is the row-rendering region of the Fluent UI React v9 DataGrid family. It exposes exactly one prop, children, which is a required RowRenderFunction over the grid's item type: the grid invokes this function once per item in the data collection, and the function is expected to return the markup for that row — in practice a DataGridRow populated with DataGridCell children. DataGridBody is deliberately thin and structural. It declares no slots, no styling slots, and no public state; column layout, sorting, selection, focus management, and keyboard navigation are all supplied by the surrounding DataGrid context that the body consumes. Because rows are generated from data rather than written by hand, DataGridBody is what makes declarative sorting, filtering, selection, and windowing possible in Fluent UI v9: you change the data, and the body re-renders the corresponding set of rows. It is always used together with DataGrid, DataGridHeader, DataGridRow, and DataGridCell rather than on its own.

**When to use**: Use DataGridBody whenever you render a DataGrid whose rows are derived from a data collection rather than authored by hand — especially when you need row selection, keyboard grid navigation, sortable columns, or virtualization. It is the correct choice for application-style tabular data such as admin tables, resource lists, and settings editors where each row is an item and each item can be identified, selected, and acted on. Prefer the plain Table family (Table, TableHeader, TableBody, TableRow, TableCell) when the content is static or presentational and you do not need a data-driven render function, sorting, selection, or roving-focus behavior. Prefer List or FlatTree when the content is not tabular — that is, when there are no meaningful columns. Within a DataGrid, DataGridBody is the only sanctioned place to emit rows: DataGridHeader emits the column headers, and the body emits the item rows that follow them.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `RowRenderFunction<TItem>` | — | Yes | Render function for rows |

### Prop Guidance

- **children**: Required and intentionally a function rather than markup. It is the RowRenderFunction for the grid's item type: Fluent UI calls it once for each item in the grid's data and uses the returned element as that item's row. The function should return a DataGridRow containing the DataGridCells for the item, and each returned row needs a stable unique key so React can track rows across sorts and filters. Keep the function pure, cheap, and referentially stable; do all data shaping before the data reaches DataGrid. Rows may also include DataGridSelectionCell when the grid is configured for selection, and interactive controls inside cells should be the real Fluent UI components so their focus and activation behavior integrates with the grid. `A function that receives each item and returns a DataGridRow containing a DataGridCell per column, with a stable key taken from the item's identifier.`

## Best Practices

### Do's

- Always nest DataGridBody inside a DataGrid and place it after DataGridHeader so the grid's context, column widths, and roving focus model are available to every row.
- Return a DataGridRow for each item and give every row a stable, unique key derived from the item's own identity, not from its position.
- Keep the render function pure: it should only map an item to its row markup, with no sorting, filtering, fetching, or state updates inside it.
- Perform sorting, filtering, and paging upstream on the data before it reaches DataGrid so the body receives exactly the rows that should be visible.
- Let DataGrid own selection state and render DataGridSelectionCell inside rows so selection, header select-all, and aria-selected stay consistent.
- Keep the render function referentially stable (for example, memoized in the parent) so row rendering is not repeated unnecessarily on unrelated parent re-renders.
- Give the grid an accessible name and keep the item count in sync so screen reader users hear how many rows the body is rendering.

### Don'ts

- Do not pass JSX elements or an array of rows as children — the children prop is a render function and must be a function of the item type.
- Do not render non-row chrome such as toolbars, banners, loading spinners, or empty-state illustrations directly inside the body; the body is the row group.
- Do not build new style objects, inline lambdas, or new cell component definitions inside the render function for every item.
- Do not use the array index as the row key when the collection can be sorted, filtered, or reordered.
- Do not mutate the item object inside the render function; mutations in place do not change row identity and will not re-render correctly.
- Do not duplicate header markup or column-header cells inside the body — headers belong to DataGridHeader.
- Do not compute column definitions or widths inside the body; columns are declared on DataGrid and cells simply fill them.

## Anti-Patterns

### Rendering the empty state inside the body

❌ DataGridBody is the row group of the grid. Injecting banners, spinners, illustrations, or placeholder text as body content inserts non-row elements into the grid semantics, so screen readers encounter elements that do not belong to any row and the column layout is thrown off.

✅ Render empty, loading, and error states outside the grid, next to the DataGrid, and keep the body reserved for rows. If the grid frame must remain visible while empty, keep the header and let the body render zero rows while a status message outside the grid explains the condition.

### Using array index as the row key

❌ Index keys make React reuse row instances by position. After sorting, filtering, or insertion, row identity shifts, so component state, focus, and selection land on the wrong rows and rows visibly re-mount.

✅ Give each row a key derived from the item's stable identity, such as a primary key or a composite of fields that uniquely identify the item, so a row follows its item through reordering.

### Sorting or filtering inside the render function

❌ The render function runs once per item, so any transformation placed inside it either runs per row or is re-derived on every render. It also makes the visible order diverge from the data order, which breaks keyboard navigation and screen reader position announcements that follow the data order.

✅ Transform the data upstream, before it is handed to DataGrid, so the render function receives the final ordered and filtered collection and only maps an item to its row markup.

### Returning bare cells instead of a row

❌ The render function is expected to return a full row. Returning loose cells or a fragment without a DataGridRow strips the row role and the row's context, so cells are announced without a row identity and roving focus and selection behavior break down.

✅ Always wrap the item's cells in a DataGridRow, one row per item, and let the body supply the grouping around them.

### Defining column widths and layout inside the body

❌ Columns are declared on DataGrid. Recomputing widths, or setting per-cell widths in the render function, produces inconsistent columns and defeats the grid's shared column sizing.

✅ Declare columns once on DataGrid and let each cell render its content within the column it belongs to; only adjust presentation details such as padding and alignment on the cell.

## Accessibility

**Requirements**: DataGridBody participates in the ARIA grid pattern established by DataGrid. Rows must be exposed as rows within a row group, and each row's cells must be exposed as grid cells so assistive technology can announce position within the grid. Focus is managed by the parent grid (roving tabindex), so the body must not introduce focusable wrappers between the grid and its rows. Provide an accessible name for the grid, keep the declared row and column counts accurate as data changes, expose selection through the grid's selection semantics, and preserve a visible focus indicator on the focused cell. Empty and loading conditions must be communicated in text outside the grid rather than by leaving a silently empty body.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the grid, landing on the first focusable cell rendered in the body; if focus was previously inside the grid, it returns to the last focused cell. |
| `Shift+Tab` | Moves focus out of the grid backwards, leaving the body and the grid container. |
| `ArrowDown` | Moves the focused cell down one row within the body's rendered rows. |
| `ArrowUp` | Moves the focused cell up one row, back toward the header when at the first body row. |
| `ArrowRight` | Moves the focused cell to the next cell in the same row. |
| `ArrowLeft` | Moves the focused cell to the previous cell in the same row. |
| `Home` | Moves focus to the first cell of the current row. |
| `End` | Moves focus to the last cell of the current row. |
| `PageUp` | Moves focus up by a page of rows within the body, when the grid enables paging navigation. |
| `PageDown` | Moves focus down by a page of rows within the body, when the grid enables paging navigation. |
| `Enter` | Activates the interactive content inside the focused cell, such as a button or link rendered by the row render function. |
| `Space` | Activates the control in the focused cell; on a selection cell it toggles the row's selected state. |
| `Escape` | Dismisses transient UI opened from within a cell, such as a menu, and returns focus to the cell. |

**ARIA**: role="rowgroup" for the group of rows the body renders, role="row" for each DataGridRow returned by the render function, role="gridcell" for each DataGridCell, and role="columnheader" for the corresponding header cells, aria-selected to expose the selection state of a row or cell, aria-rowcount and aria-colcount to declare the full grid size, including rows not currently rendered, aria-rowindex and aria-colindex to declare each rendered cell's position within the full dataset, aria-label or aria-labelledby on the grid to provide an accessible name, aria-disabled to mark rows or cells that cannot be interacted with

**Screen Reader**: Screen readers treat the body's rows as the data region of a grid: when focus enters a cell, the reader announces the cell's content together with its column header and its row and column position, and selection state is announced through the grid's selected semantics. Because the grid uses a roving tabindex, only one cell is in the tab order at a time, so screen reader users navigate with arrow keys rather than Tab, and Tab is the way in and out of the grid. Rows rendered by the body are exposed in the order returned by the render function, so sorting must be reflected in the data order rather than in CSS ordering. Any row that disappears because of filtering is removed from the accessibility tree entirely, which is why a status message outside the grid is needed to tell users the result count changed.

## Styling

DataGridBody has no styling props or slots of its own in this API surface, so all visual customization happens on the pieces it produces: the DataGridRow and DataGridCell elements returned by the render function, plus the parent DataGrid that owns the column layout. Row backgrounds should be expressed with theme tokens rather than literal colors: use tokens.colorNeutralBackground1 for the base row fill, tokens.colorNeutralBackground1Hover for hover, tokens.colorNeutralBackground1Pressed for press, and tokens.colorNeutralBackground1Selected for selected rows. Alternating or zebra rows can be produced with tokens.colorNeutralBackground2 when the design calls for it. Use tokens.colorNeutralStroke2 for row separators and tokens.colorTransparentStroke when a borderless look is desired. For the focus indicator on the focused cell, pair tokens.colorStrokeFocus2 with tokens.strokeWidthThin rather than removing the outline. Cell padding is best expressed with tokens.spacingHorizontalMNudge and tokens.spacingVerticalS, and text should use tokens.fontFamilyBase with tokens.fontSizeBase300 and tokens.lineHeightBase300 so rows match the rest of the typography scale. borderRadiusMedium is appropriate when the grid is placed inside a Card and the first and last rows need rounded corners. Keep all style objects defined once outside the render function so each row does not allocate new styles on every render.

## Performance

The children render function is invoked once per item for every render of the grid, so its cost multiplies by the size of the dataset. Keep it free of allocation-heavy work: define cell style objects and helper components once at module or component scope rather than inside the function, and avoid creating new closures or new cell component types per row. Memoize the render function itself in the parent so unrelated state changes do not re-run it, and memoize the transformed data so sorting and filtering are not repeated on every render. Stable row keys also matter for performance as well as correctness: keys tied to item identity let React move existing rows rather than unmounting and recreating them during sorting and filtering. DataGridBody does not virtualize on its own; for very large collections, pair it with a windowing strategy that only renders the rows in view while keeping the declared row count accurate for accessibility. Avoid deriving anything from the row index inside the render function, because index-derived values force work that cannot be cached across reordering.

## Theming & Tokens

DataGridBody inherits its appearance entirely from the surrounding FluentProvider theme. Row surfaces read from tokens.colorNeutralBackground1 with interaction states tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground1Pressed, and tokens.colorNeutralBackground1Selected, so selected rows automatically pick up the brand-tinted selection color of the active theme, including the darker surfaces of the dark themes. Separators and grid lines come from tokens.colorNeutralStroke2 and tokens.colorNeutralStroke1, and focus rectangles use tokens.colorStrokeFocus2, which maps to the high contrast system focus color in the high contrast themes. Text inside cells should reference tokens.colorNeutralForeground1 for primary content and tokens.colorNeutralForeground2 for secondary content, with tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.lineHeightBase300 for typography. Spacing tokens such as tokens.spacingHorizontalMNudge and tokens.spacingVerticalS keep density consistent with the rest of the design system, and tokens.borderRadiusMedium handles corner rounding when the grid is embedded in a Card. Because these are theme tokens rather than literal values, switching between the light, dark, and high contrast themes requires no changes in the render function.

## Migration Notes

DataGridBody has no direct counterpart in Fluent UI React v8, where DetailsList (and its base DetailsListBase) combined data, columns, and item rendering in a single component. In v9 the responsibility is split: DataGrid holds the items, columns, selection, and sorting configuration, and DataGridBody holds only the row render function that turns a single item into a row of cells. Migrating from DetailsList means moving the onRenderItemColumn logic into the body's render function, replacing DetailsList's column objects with the v9 column definitions, and letting the grid context provide the keyboard navigation, focus management, and aria wiring that DetailsList handled internally. There is no equivalent of the old onRenderRow as a separate prop; the row element itself is returned from the body's render function.

## Edge Cases

- children is required and must be a function of the item type; omitting it, or passing elements or an array of rows instead, means no rows are rendered at all.
- An empty data collection is valid: the body renders no rows while the header from DataGridHeader remains, so an empty or loading message must be provided outside the grid.
- DataGridBody must live inside a DataGrid so it can consume the grid context; nesting it under an unrelated wrapper element can break column layout, focus management, and row semantics.
- Mutating item objects in place does not change their identity, so rows will not re-render; replace items with new objects when their data changes.
- Returning a fragment or an array of rows from the render function instead of a single row element breaks the one-item-one-row contract and disrupts the row group and roving focus.
- Rows that are conditionally hidden by CSS remain in the accessibility tree and in the keyboard sequence, so remove items from the data rather than hiding them visually.
- If the declared row count is not updated when the collection changes, screen readers announce a stale total that no longer matches the number of rows the body renders.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
