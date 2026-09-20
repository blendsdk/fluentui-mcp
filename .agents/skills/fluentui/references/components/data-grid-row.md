# DataGridRow

> **Package**: `@fluentui/react-table` v9.19.16
> **Import**: `import { DataGridRow } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

DataGridRow is the row primitive of the Fluent UI DataGrid composition. Unlike a typical container component, it accepts no static JSX for its content: its single required prop, children, is a CellRenderFunction<TItem> that Fluent invokes once per column definition declared on the parent DataGrid and expects a cell element back for each invocation. That data-driven contract is what keeps header cells, body cells, sorting indicators, column resizing and the selection column aligned as the column set changes. The component is generic over the row item type (DataGridRow<TItem>) so the column argument passed into the render function, and any item value you use while rendering a cell, are fully typed. The same component renders both the header row inside DataGridHeader and every data row inside DataGridBody; the objects handed to the render function differ between those two contexts. DataGridRow is the v9 counterpart of the v8 DetailsRow row rendering pattern, but item, column and selection state now flow from the surrounding DataGrid instead of being passed down as props.

**When to use**: Use DataGridRow whenever you are building a tabular experience with the DataGrid family: inside DataGridHeader for the header row and inside DataGridBody for each data row, so that sorting, row selection, column resizing and grid keyboard navigation all stay in sync with the columns the DataGrid was given. Choose it over the plain Table/TableRow primitives when your data is data-driven (items plus column definitions) and you want grid behaviors for free, and choose Table/TableRow when you are hand-authoring static markup and want full control over every cell without the column contract. For non-tabular collections, prefer List, FlatTree or Nav instead of rows inside a grid. If you only need to present read-only tabular content with no selection, sorting or column resizing, Table may be simpler, but DataGridRow is still the right choice when the same surface may later gain those behaviors.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `CellRenderFunction<TItem>` | — | Yes | — |

### Prop Guidance

- **children**: Required. It is a render function rather than JSX: Fluent calls it once for each column definition on the parent DataGrid and expects a single cell element back per call. Return DataGridCell for data columns and DataGridSelectionCell for the selection column (first, when the grid is selectable). Use the column argument to obtain the column's identity and its per-column rendering helper, close over the current item when the row lives inside DataGridBody, and attach a stable key to every returned cell. `A function that maps each column definition to a keyed DataGridCell (or DataGridSelectionCell first when selecting), rendering that column's cell renderer for the current item`

## Best Practices

### Do's

- Return exactly one cell per column definition: a DataGridCell for each data column, and a DataGridSelectionCell rendered first whenever the parent grid is in a selection mode so it lines up under the select-all header cell.
- Let the render function drive the cell content by using the per-column rendering information supplied in the column argument, so labels, sorting and custom column renderers stay consistent between header and body rows.
- Give every cell returned from the render function a stable, unique key derived from the column identity, and give the DataGridRow itself a stable key (typically the row id provided by the DataGridBody row render function) so React preserves row DOM, focus and checkbox state across sorting and filtering.
- Keep the render function pure and cheap: it runs once per column for every row on each render pass, so hoist formatters, lookup maps and memoized cell subcomponents outside of it.
- Type the row with its item type so the column argument and any item values you render are checked at compile time.
- Render interactive content inside cells (buttons, menus, links, the selection checkbox) so focus always lands on a real control rather than on the row itself.
- Keep the cell structure identical for every row, including loading and empty states, so the grid does not reflow or shift column widths as data arrives.

### Don'ts

- Do not pass elements or fragments as children; children is required and must be a render function, not JSX.
- Do not hardcode a cell count that differs from the columns declared on the parent DataGrid, and do not render a cell conditionally in the body row but not in the header row.
- Do not key cells or rows by array index, which causes React to reuse the wrong DOM when the data is reordered.
- Do not add tabIndex, onClick or hover handlers to the row to make the whole row clickable; that duplicates grid keyboard semantics and produces ambiguous screen reader output.
- Do not wrap DataGridRow in extra divs, fragments or layout containers inside DataGridBody; that breaks the row grouping structure the grid expects.
- Do not fetch data, dispatch state updates, or mutate the item inside the render function.
- Do not call body cell renderers from a row rendered in DataGridHeader, or header renderers from a body row; the column objects supplied in those two contexts are different.
- Do not use DataGridRow outside of DataGridBody or DataGridHeader, where the column context it relies on is not available.

## Anti-Patterns

### Static JSX children

❌ Passing markup or an array of elements as children does not satisfy the CellRenderFunction<TItem> contract and prevents the grid from mapping cells to its column definitions, so sorting, resizing and header alignment break.

✅ Always pass a function and return one cell per column definition, letting Fluent drive the iteration.

### Cell count drift between header and body

❌ Conditionally rendering an extra or missing cell in a body row (for example an actions cell that only some rows have) desynchronizes the row from the header and corrupts the announced grid structure.

✅ Keep the number and order of cells identical in every row; render the action cell for all rows and disable or hide its inner control instead of omitting the cell.

### Index-based keys for rows and cells

❌ Keys built from the map index change meaning after sorting, filtering or row insertion, so React reuses the wrong row DOM and users lose focus, expanded state or checkbox state.

✅ Key rows by the row id supplied by the DataGridBody row render function and key cells by the column identity.

### Making the whole row clickable

❌ Adding a tab stop and click handlers on the row competes with the grid's own focus model, produces duplicate or unreachable tab stops, and leaves screen reader users with a row that behaves like a button but is announced as a row.

✅ Put the interaction on a real control inside the cell, or use the grid's selection mode and DataGridSelectionCell so interaction is keyboard operable and correctly announced.

### Side effects or heavy work in the render function

❌ The render function executes once per column for every rendered row on each pass, so data fetching, logging or expensive formatting inside it multiplies work by rows times columns and can cause render loops.

✅ Keep it a pure mapping from column to cell, hoist formatting and derived data, and memoize any expensive cell content.

### Extra wrapper elements around rows

❌ Wrapping DataGridRow in divs or fragments inside DataGridBody breaks the row grouping that the grid relies on for navigation and table semantics.

✅ Render DataGridRow directly as the top-level child of the body or header, and put layout wrappers inside cells if needed.

## Accessibility

**Requirements**: The row must remain part of a genuine grid/table structure with one row-level semantics per item, and the number of cells it renders must match the column count used by the header, otherwise assistive technology announces a malformed table. Selection must always be operable from the keyboard and must not rely on color alone: the selection cell's checkbox carries the accessible name, and the row's selected state is reflected programmatically. Any control placed inside a cell needs its own accessible name. Hover and selected row backgrounds must meet WCAG contrast for text and non-text content; the default theme tokens used for row hover, pressed and selected states are contrast-checked, so re-styling them with arbitrary colors can break compliance. DataGridRow itself implements no keyboard handlers; keyboard behavior comes from the interactive elements inside its cells and from the parent grid's focus handling.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the grid and between the focusable controls rendered inside cells; the row does not receive focus itself. |
| `Shift+Tab` | Moves focus backwards out of the grid or to the previous focusable control in the row. |
| `Enter` | Activates the control inside the focused cell, such as a button, menu trigger or link. |
| `Space` | Toggles the selection checkbox inside DataGridSelectionCell when that cell has focus. |
| `ArrowDown` | Moves focus to the equivalent cell in the next row when the parent DataGrid is configured for cell focus navigation. |
| `ArrowUp` | Moves focus to the equivalent cell in the previous row when the parent DataGrid is configured for cell focus navigation. |
| `ArrowRight` | Moves focus to the next cell within the row when cell focus navigation is active. |
| `ArrowLeft` | Moves focus to the previous cell within the row when cell focus navigation is active. |
| `Home` | Moves focus to the first cell of the row when cell focus navigation is active. |
| `End` | Moves focus to the last cell of the row when cell focus navigation is active. |

**ARIA**: role="row", aria-selected, aria-label on the selection checkbox rendered by DataGridSelectionCell, role="gridcell" / role="columnheader" applied by the cells inside the row, not by the row itself

**Screen Reader**: Assistive technology reads the row as part of the surrounding grid: it announces the row position relative to the total row count alongside the column headers it traverses, so the cell count returned by the render function must match the header exactly or the announced structure becomes confusing. Focusable elements inside cells are announced individually with their own names and states, so the row's contents are what users actually interact with. When the parent grid enables selection, the row exposes its selected state programmatically and the checkbox in the selection cell announces its checked state and its accessible label, letting users select rows without navigating out of the grid.

## Performance

Rendering cost scales with items multiplied by columns: the children render function is invoked once per column for every row the grid mounts, so a thousand items with ten columns means ten thousand render function calls per pass plus the resulting DOM. Keep the function allocation-light (no new objects, arrays or inline component definitions per invocation) and memoize any cell content that is expensive to build. Stabilize row keys so that sorting and filtering move existing DOM rather than recreating it, and consider windowing or virtualizing the item collection you feed the grid so DataGridBody only mounts the rows that are visible. Avoiding unnecessary re-renders of the parent grid pays off more here than in almost any other component, because every parent render is amplified by the row and column count.

## Theming & Tokens

DataGridRow has no theme-specific props and derives its visual states entirely from design tokens resolved by the nearest FluentProvider. Row backgrounds map to tokens.colorNeutralBackground1 and, in interaction states, tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground1Pressed and tokens.colorNeutralBackground1Selected; text inherits tokens.colorNeutralForeground1 along with the typography tokens tokens.fontFamilyBase, tokens.fontSizeBase300 and tokens.lineHeightBase300, which the cells ultimately apply. Borders between rows and around the grid use tokens.colorNeutralStroke2, and focus indication comes from tokens.colorStrokeFocus2. Because these are semantic tokens, switching to a dark theme, high-contrast theme or a Teams theme automatically re-resolves row hover, pressed and selected colors; hardcoding literal colors on the row bypasses that and typically fails contrast requirements in at least one theme.

## Migration Notes

In v8 the equivalent rendering surface was DetailsRow inside DetailsList, where the row received the item and index as props and you customized it through onRenderRow and related callbacks. In v9, DataGridRow takes only a children render function: the item, the columns and the row id come from the surrounding DataGrid / DataGridBody, and customization moves from the row level to the cell level through DataGridCell and the column definitions. Row-level props such as a per-row checkbox visibility flag no longer exist; selection is instead expressed by rendering DataGridSelectionCell as the first cell when the grid is in a selection mode. Earlier v9 previews of this component were published from @fluentui/react-table with an unstable suffix; the suffix has been removed and the component is imported from @fluentui/react-components.

## Edge Cases

- children is required and is typed as CellRenderFunction<TItem>; passing undefined, null or raw elements fails at compile time and leaves an empty row at runtime.
- The same component is used for header and body rows, but the objects handed to the render function differ between DataGridHeader and DataGridBody, so a render function written for body rows will render the wrong helpers if reused in a header row.
- When the parent grid is in a selection mode, the selection cell is expected to be the first cell returned; rendering it last or conditionally shifts every subsequent cell out from under its header.
- Rendering a different number of cells than the declared columns (for example hiding a column only in the body) desynchronizes column widths and the announced grid structure.
- Rows rendered before the column definitions resolve, or rows rendered outside DataGridBody/DataGridHeader, receive no column context and cannot produce meaningful cells.
- Keys derived from the item index silently break when the data is sorted or filtered, which shows up as flickering cell content, lost focus, or selection checkboxes that appear to move to the wrong row.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
