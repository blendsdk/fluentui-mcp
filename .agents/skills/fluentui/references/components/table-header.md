# TableHeader

> **Package**: `@fluentui/react-table` v9.19.16
> **Import**: `import { TableHeader } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

TableHeader is the structural "head" container of the Fluent UI React v9 Table family. It renders the table's header section (a thead element by default, or a div when a non-table root is required) and hosts the header rows built from TableRow, TableHeaderCell, and TableSelectionCell. Beyond layout, TableHeader is the conduit for table-wide behavior: it accepts the table feature state object, selection mode and selection callbacks, sort callbacks and sort direction, and column sizing options, then distributes that context to its descendant header cells so that sorting, selection, and column resizing behave consistently between the header and the body. Because it owns the header semantics of the table, it is responsible for the column header markup that assistive technology reads when announcing cells in the body.

**When to use**: Use TableHeader whenever you render a tabular layout with Table and you need a real, semantic header row — particularly when the header participates in behavior such as sorting, row selection with a select-all checkbox, or resizable/auto-fitting columns. It is the correct choice for data tables where header cells label the data beneath them and where column-level interactions (sort toggles, select-all) live. If you are rendering a purely decorative grid with no column semantics, or you are building a simple definition list, prefer List or a plain layout component instead. For data-focused scenarios that go beyond tabular presentation — keyboard grid navigation with cell-level focus, virtualization, and row/column indexing — the DataGrid family is the more appropriate layer, and TableHeader's focusMode, tableState, and containerWidthOffset props are the bridge for those scenarios.

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

- **tableState**: Required. Supply the table feature state object produced by your table setup; TableHeader uses it to resolve selection, sorting, and sizing behavior for its descendant header cells. Without it, header interactivity cannot be reconciled with the body. `the table feature state object shared with TableBody`
- **selectionMode**: Declares whether the header offers single-row, multiple-row, or no selection. Set it to a multi-selection value when you render a select-all cell in the header, and to a single-select value when header selection should mirror a radio-style choice. `multiple`
- **onSelectionChange**: Called whenever the header's select-all control or a header-level selection interaction occurs, receiving the event and the updated selection data. Pair it with selectionMode so the body selection reflects the change. `handler that toggles all rows in the current page`
- **onSortChange**: Fired when a sortable header is activated, providing the event and the resulting sort state. Implement it to reorder your data and keep sortDirection in sync with what the header announces. `handler that sorts the data and updates sortDirection`
- **columnSizingOptions**: Maps column identifiers to sizing configuration such as preferred, minimum, and maximum widths, plus default width. Use it instead of ad-hoc CSS widths so header and body columns stay aligned and resizing behaves predictably. `a map keyed by columnId with preferred and min widths`
- **columnId**: Required for column identity. It ties a header cell to its sizing options, sort state, and hidden/visible status, so it must be unique and stable across renders. `fileSize`
- **width**: Required numeric width for the column. Provide a value that accommodates the widest realistic header label and cell content; extremely small widths force truncation or wrapping. `160`
- **containerWidthOffset**: Adjusts the width available for layout when the scroll container is narrower than the viewport, for example to account for a vertical scrollbar or surrounding padding. Use it when auto-fit or resizing calculations come out slightly too wide. `16`
- **autoFitColumns**: Enables automatic width fitting based on content and available space. Turn it on for tables with unpredictable content lengths, and off when you need pixel-exact, designer-specified column widths. `true`
- **focusMode**: Controls how focus is managed for the header cells. Choose a cell-level mode when you want arrow-key traversal between header cells in a grid-like experience, and a non-focusable mode when the header should contain only ordinary tabbable controls such as buttons and checkboxes. `cell`
- **sortable**: Marks the column as participating in sorting so it renders a sort affordance and can be activated by Enter or Space. Only set it on columns whose data has a meaningful order, and always pair it with onSortChange. `true`
- **sortDirection**: Communicates the current sort order for the column so the header renders the correct indicator and exposes the corresponding sort state to assistive technology. Leave it unset for columns that are not the active sort column. `ascending`
- **appearance**: Selects the visual treatment of the header or its cells. Use the primary variant for a single emphasized header, and use the neutral or none variants for standard headers or for header cells that should blend into the surrounding surface. `primary`
- **truncate**: Truncates header cell content with an ellipsis when the column is narrower than its label. It is the right choice for dense tables, but keep the full text available through a tooltip or title so the label is not lost. `true`
- **type**: Determines whether the header selection control renders as a checkbox or a radio. Use the radio form for single-selection tables where choosing a row replaces the previous choice, and the checkbox form for multi-selection with select-all. `checkbox`
- **checked**: Supplies the checked state of the header selection control, including mixed state when only some rows are selected. Drive it from your selection state rather than holding it in local component state. `mixed when some rows are selected`
- **subtle**: Applies a lower-emphasis visual style, typically to header selection cells, so the control does not compete with the column labels. Use it when the selection cell sits in an otherwise neutral header. `true`
- **hidden**: Removes the column from layout entirely, as if it were not part of the table. Use it for columns the user has chosen to hide; remember that hidden columns also drop out of the accessibility tree. `true`
- **invisible**: Keeps the column's space in the layout while hiding its content, which is useful during measurement, resize previews, or when alignment must be preserved. Do not use it to permanently hide a column the user removed. `true`
- **visible**: Controls whether the header section or header row is rendered. Use it with virtualized or progressively disclosed tables so off-screen headers are skipped without discarding their state. `false while scrolled out of view`
- **root**: Required slot for the section element. It renders a thead by default and supports a div alternative for non-table layouts; use its className and other slot props for section-level styling such as sticky positioning. `a thead root with a sticky className`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Always render TableHeader as the first child section of Table, followed by TableBody, so the thead and tbody order is correct for both visual layout and screen reader table navigation.
- Provide tableState and columnSizingOptions on TableHeader so header cells receive the same sizing and feature context as the body rows and stay aligned during resize.
- Give every column a stable, unique columnId and an explicit width; sortable and resizable behavior keys off column identity, and missing widths force the browser to recompute layout on every render.
- Set onSortChange together with sortable header cells and a matching sortDirection so the header's announced sort state always reflects the actual data order.
- Use selectionMode together with onSelectionChange so the select-all control in the header and the individual row selection in the body stay synchronized.
- Use autoFitColumns when column contents vary in length and you want the header and body to negotiate widths instead of relying on hand-tuned numbers.
- Reserve appearance="primary" for a single, deliberate emphasis header (for example a total or summary column) rather than applying it broadly.

### Don'ts

- Don't render TableHeader outside of Table or replace it with a hand-rolled thead; you lose the shared feature state that drives sorting, selection, and sizing.
- Don't hard-code column widths in CSS on header cells while also passing width or columnSizingOptions — the two sources will disagree and columns will drift out of alignment with the body.
- Don't add a select-all selection cell without wiring selectionMode and onSelectionChange; a checkbox that silently does nothing is worse than no checkbox.
- Don't mix hidden and invisible interchangeably when suppressing columns: hidden removes the column from layout while invisible preserves its space, and mixing them causes header/body column index mismatches.
- Don't enable sortable on every header cell if only some columns have a meaningful sort order; unsortable data should not advertise a sort affordance.
- Don't duplicate ARIA sort or selection state manually on header cells when the component already derives it; conflicting attributes produce unpredictable announcements.
- Don't nest interactive controls such as buttons or menu triggers inside a header cell without ensuring they remain reachable and labeled, since header cells themselves may take focus when focusMode enables cell focus.

## Anti-Patterns

### Header rendered without shared table state

❌ Placing TableHeader outside a Table, or replacing it with a hand-written thead, means the header has no feature state to resolve selection, sorting, or sizing against. Header controls then either do nothing or drift out of sync with the body.

✅ Keep TableHeader and TableBody as siblings inside a single Table and pass tableState and columnSizingOptions so both sections operate on the same state.

### Sort affordance with no sort handler

❌ Marking columns as sortable or setting a sortDirection without implementing onSortChange gives users a clickable, screen-reader-announced sort control that never changes the data order.

✅ Only enable sortable on columns that can actually be ordered, implement onSortChange to reorder the data, and update sortDirection to match the resulting order.

### Select-all checkbox with no wiring

❌ A checkbox or radio in the header selection cell without selectionMode and onSelectionChange suggests bulk selection but never propagates to the rows, and its checked state can silently contradict the body.

✅ Set selectionMode, handle onSelectionChange, and drive the checked prop — including its mixed state — from the same selection state used by the body rows.

### Fighting column sizing with CSS

❌ Overriding header cell widths with stylesheet rules while also providing width or columnSizingOptions produces two competing sources of truth. The header and body columns then misalign, especially after resizing or auto-fit.

✅ Express column dimensions through columnSizingOptions and width, and reserve CSS for non-dimensional styling such as background, borders, and typography.

### Confusing hidden and invisible columns

❌ Using hidden and invisible interchangeably for user-removed columns changes the column count between header and body, which corrupts announced column indices and shifts alignment for every subsequent cell.

✅ Use hidden for columns the user has removed from the table and invisible only for temporary, layout-preserving suppression, keeping the two consistent between header and body.

### Emphasis by appearance everywhere

❌ Applying the primary appearance to many header cells removes any visual hierarchy and reduces contrast for ordinary labels, making the table harder to scan.

✅ Reserve the primary emphasis for one or two truly summarizing headers and leave the rest on the neutral treatment using theme tokens.

## Accessibility

**Requirements**: TableHeader must produce correct table semantics: the header section becomes a thead (or an explicit role="rowgroup" when a div root is used), header rows are rows, and each TableHeaderCell maps to a columnheader. Sortable columns must expose the current sort state so assistive technology announces it, and the selection header cell must expose a programmatically associated accessible name describing the bulk selection action. Color must not be the only indication of sorted or selected state — pair it with the sort indicator glyph and selection control. Target sizes for any interactive control placed in the header should meet WCAG 2.2 minimum target size, and focus indicators on header cells and embedded controls must remain visible against the header background.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the header region and to the next focusable element, such as a sort button or the select-all checkbox in a header cell. |
| `Shift+Tab` | Moves focus to the previous focusable element, returning out of the header region when the first header control is focused. |
| `Enter` | Activates a focused sort control or select-all checkbox inside a header cell, triggering onSortChange or onSelectionChange. |
| `Space` | Toggles a focused checkbox or radio selection control in the header selection cell without scrolling the page. |
| `ArrowRight` | Moves focus to the next header cell within the row when header cells are focusable under the configured focusMode. |
| `ArrowLeft` | Moves focus to the previous header cell within the row when header cells are focusable under the configured focusMode. |
| `ArrowDown` | Moves focus vertically from the header into the corresponding cell of the body row below when the table uses cell-level focus management. |
| `Home` | Moves focus to the first focusable header cell in the row. |
| `End` | Moves focus to the last focusable header cell in the row. |

**ARIA**: aria-sort, aria-selected, aria-rowcount, aria-colcount, aria-rowindex, aria-colindex, aria-label, aria-labelledby, aria-hidden, aria-disabled, role

**Screen Reader**: Because TableHeader emits a true thead with columnheader cells, screen readers treat the header as a navigation anchor: when focus lands in a body cell, the reader announces the corresponding column header text along with the row header, which is what makes a table comprehensible without sighted reference. Sortable columns surface their state through aria-sort (ascending or descending), so the reader announces the ordering rather than just the label. The select-all control is announced as a checkbox or radio with its accessible name and mixed/checked state, and hidden columns are removed from the accessibility tree while invisible columns remain addressable but unrendered visually.

## Styling

TableHeader is styled through the slots on its root and through the header cells it contains, so most visual tuning happens on TableHeaderCell and TableSelectionCell rather than on the section itself. The root slot accepts a className, which is the right place for section-level adjustments such as a sticky header via position and top offsets, or a heavier bottom rule using tokens.colorNeutralStroke2. Default header surfaces come from tokens.colorNeutralBackground1, with brand emphasis from tokens.colorBrandBackground and tokens.colorNeutralForegroundOnBrand when appearance is primary. Text weight and size for header labels use tokens.fontWeightSemibold and tokens.fontSizeBase300, and cell padding is typically tuned with tokens.spacingHorizontalMNudge and tokens.spacingVerticalSNudge. Interactive sort affordances should use tokens.colorNeutralForeground1 for the resting label and tokens.colorNeutralForeground1Hover plus tokens.colorNeutralBackground1Hover for hover feedback, while focus rings should reference tokens.colorStrokeFocus2 so they remain visible in both light and dark themes. Selection cells typically render on tokens.colorSubtleBackground or tokens.colorNeutralBackground2. Separator lines between header and body read tokens.colorNeutralStroke1 or tokens.colorNeutralStroke2, and a subtle elevation under a sticky header can use tokens.shadow2. Prefer these tokens over literal colors so the header stays coherent across themes.

## Performance

TableHeader re-renders whenever the table feature state it receives changes, so avoid recreating column definitions, sizing maps, or callback handlers on every parent render — stable columnId values let the header memoize per-column work instead of re-resolving it. Large tables benefit from the visible prop to skip rendering header rows that are scrolled out of view, but the underlying state must still be updated so sort, selection, and sizing remain correct when they scroll back in. autoFitColumns and containerWidthOffset trigger measurement passes, so on very wide tables prefer fixed widths or debounce layout-affecting changes rather than toggling auto-fit frequently. Keep column counts reasonable; each additional column adds a header cell, a resize handle, and a corresponding measurement, and the cost grows with the number of simultaneously rendered header and body rows.

## Theming & Tokens

TableHeader inherits everything from FluentProvider and expresses its surfaces through design tokens rather than fixed colors. Standard header surfaces and labels use tokens.colorNeutralBackground1 and tokens.colorNeutralForeground1, with hover feedback on sort affordances from tokens.colorNeutralBackground1Hover and tokens.colorNeutralForeground1Hover. The primary appearance maps to brand surfaces using tokens.colorBrandBackground with tokens.colorNeutralForegroundOnBrand text, while subtle header selection styling leans on tokens.colorSubtleBackground and tokens.colorNeutralBackground2. Header label typography uses tokens.fontWeightSemibold and tokens.fontSizeBase300, and spacing comes from tokens.spacingHorizontalMNudge and tokens.spacingVerticalSNudge. Separators and sticky header edges read tokens.colorNeutralStroke1 and tokens.colorNeutralStroke2, focus indication uses tokens.colorStrokeFocus2, and elevated sticky headers can use tokens.shadow2. Because these are theme tokens, switching between light, dark, and high-contrast themes automatically adjusts header contrast without component-level overrides.

## Migration Notes

For teams moving from Fluent UI React v8, TableHeader replaces the header portion of DetailsList and DetailsHeader. The v8 model owned sorting, selection, and column resizing internally inside a single list component; in v9 those responsibilities are expressed declaratively through TableHeader's props — selectionMode and onSelectionChange for selection, onSortChange with sortDirection and sortable header cells for sorting, and columnSizingOptions with width and autoFitColumns for sizing. The root slot also gives you a div variant, which v8 did not expose, so layouts that previously required manual table markup can now be expressed with the same component. Because the header and body are separate children in v9, keep TableHeader and TableBody inside a single Table so both sections see the same feature state.

## Edge Cases

- When the root slot is rendered as a div instead of a thead, the implicit table semantics are lost; you must supply the appropriate rowgroup and columnheader roles yourself or assistive technology will not treat the header as a table header.
- If only the header suppresses a column via hidden or invisible, the body keeps rendering it and the column count diverges — always apply the same column state to TableHeader and TableBody.
- A sortable column whose sortDirection is left over from a previous sort can announce an order that no longer matches the rendered data; clear or update the direction whenever the data order changes.
- Auto-fit sizing combined with a narrow container and no containerWidthOffset can push the header wider than the scroll viewport, producing a header that scrolls out of alignment with the body.
- Very long header labels in a fixed-width column will wrap or overflow unless truncate is enabled; truncation without an accessible full-label fallback hides the column meaning from sighted users.
- Interactive controls placed inside header cells compete with cell-level focus when focusMode enables cell focus, so keyboard users may need an extra key press to reach a sort button or checkbox.
- A select-all control in a table with paginated or virtualized data must clearly indicate whether it applies to the visible page or the entire data set, otherwise users cannot predict its scope.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
