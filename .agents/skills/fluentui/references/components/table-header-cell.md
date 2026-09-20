# TableHeaderCell

> **Package**: `@fluentui/react-table` v9.19.16
> **Import**: `import { TableHeaderCell } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

TableHeaderCell is the column-header primitive of the Fluent UI React v9 Table family. It renders table header content with a dedicated composition model: a root element, a sortIcon slot for the sort indicator glyph, a button slot that owns the interaction and screen-reader narration for sorting, and an aside slot for supplementary content that should follow the main header content (for example a menu, filter, or resize affordance). Because the header content is wrapped in the button slot whenever a column participates in sorting, the cell can be activated by pointer or keyboard without custom event wiring. The sortable and sortDirection props drive both the visual sort indicator and the announced sort state. TableHeaderCell is normally used inside TableHeader along with TableRow and TableSelectionCell, or as the header cell type rendered by the higher-level DataGridHeaderCell.

**When to use**: Use TableHeaderCell for any column header in a Table, and especially for columns the user can sort by. It is the correct choice over TableCell whenever the element is semantically a column header, because it carries the header semantics and the sorting contract (button slot plus sortDirection) that assistive technology relies on. Use TableSelectionCell instead for the leading checkbox column, and use DataGridHeaderCell when you are composing a DataGrid that manages sorting and selection for you. If the header is purely decorative or the table is a layout table rather than a data table, plain Text inside a TableCell may be more appropriate.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `sortDirection` | `SortDirection \| undefined` | `undefined` | No | — |
| `sortable` | `boolean \| undefined` | `false` | No | Whether the column is sortable |

### Prop Guidance

- **sortable**: Set to true when the column can be sorted by the user. This is what makes the header render an interactive button slot with proper focus, hover, and narration behavior. Leave it false or omit it for static columns so they are not announced as controls. `sortable={true}`
- **sortDirection**: Provide the current sort direction for the column: ascending when this column is the active sort applied in ascending order, descending when it is the active sort in descending order, and undefined when the column is not the active sort column. Pair it with aria-sort semantics so the visual indicator matches what is announced. When multiple columns can be sorted, only the active column should receive a defined direction. `sortDirection="ascending"`
- **button (slot)**: The interactive wrapper that handles correct narration and interactions for sorting. Attach your sort-toggle handler here, not on the root, and supply a localized accessible label when the visible label alone is ambiguous. It should contain only the header label and its indicator, never nested focusable controls. `onClick={toggleSort}`
- **sortIcon (slot)**: The indicator rendered alongside the label to show the current sort direction. It is decorative and should be hidden from assistive technology, because the sort state is already announced through the sort direction. Keep it visually aligned with the label and consistently sized across columns. `sortIcon={<SortIndicator />}`
- **aside (slot)**: Content that should appear after the main header content, such as an overflow menu, filter button, or resize affordance. Use it for anything that is secondary to the column label. Because it renders after the primary content, it also follows in reading order and in the tab order. `aside={<MenuButton />}`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `aside` | — | Yes | aside content for anything that should be after main content of the table header cell |
| `button` | — | Yes | Button handles correct narration and interactions for sorting; |
| `root` | — | Yes | — |
| `sortIcon` | — | Yes | — |

## Best Practices

### Do's

- Set sortable to true on every column the user can sort, and pass a matching sortDirection so the active sort is both drawn and announced.
- Keep the interaction on the provided button slot rather than attaching click handlers to the root, so the header receives correct focus, keyboard activation, and screen-reader narration.
- Leave the button slot in place even for non-sortable columns if you need consistent hover and focus affordances; simply omit sortable and any activation handler.
- Put secondary controls or metadata (overflow menus, filter buttons, ResizeHandle affordances) in the aside slot so they remain after the header label in DOM order and in the reading order.
- Use a short, scannable column label as the primary content and reserve the aside slot for actions, so the header stays readable at narrow column widths.
- Localize any accessible label you place on the button slot, and describe the action rather than the state, since the state is conveyed by sortDirection and aria-sort.
- Pair TableHeaderCell with TableRow inside TableHeader, and keep the same column order between the header row and the body rows so the sort affordance matches the data beneath it.

### Don'ts

- Do not pass sortDirection without also setting sortable, because the cell will announce a sort state that has no corresponding sort interaction.
- Do not nest another focusable control directly inside the button slot; nested interactives inside a button produce invalid markup and confuse both keyboard and screen-reader users.
- Do not replace the button slot with a custom clickable div, as this loses the built-in narration and keyboard activation behavior.
- Do not place long paragraphs or multi-line descriptions in the header; headers should be concise labels, with detail moved into cells or tooltips.
- Do not use TableHeaderCell for non-header cells in the body of the table, since the header semantics will be misrepresented to assistive technology.
- Do not rely on the sortIcon alone to communicate sort state, since the icon is decorative and must be accompanied by the sortDirection prop.
- Do not put the selection checkbox in a TableHeaderCell; use the dedicated selection cell component for that column.

## Anti-Patterns

### Making the whole cell clickable instead of using the button slot

❌ Click handlers on the root cell bypass the built-in button semantics, so the column is not reachable by Tab and sort state is not narrated to screen readers.

✅ Keep activation on the button slot produced by the component, and let sortable and sortDirection drive the announced state.

### Declaring sortDirection without sortable

❌ The cell announces a sort state that the user cannot change, which misleads screen-reader and keyboard users about the available interaction.

✅ Either set sortable to true so the column becomes interactive, or omit sortDirection entirely to keep the header static.

### Nesting interactive controls inside the sort button

❌ Placing a link, menu trigger, or button inside the button slot creates nested interactive elements, which is invalid markup and produces unpredictable focus and activation behavior.

✅ Move secondary controls into the aside slot so they sit beside the sort button as separate tab stops rather than inside it.

### Overloading the header with descriptive content

❌ Long labels and explanatory sentences in the header stretch column widths, break scanning, and make the announce text unwieldy for screen-reader users.

✅ Keep a short label in the primary content, push detail into body cells or an InfoLabel-style affordance, and reserve the aside slot for compact actions.

### Duplicating sort state in custom attributes

❌ Manually setting a sort attribute on the root conflicts with the value the component derives from sortDirection, producing contradictory announcements.

✅ Rely solely on the sortDirection prop and the component's own accessibility wiring, and remove any hand-rolled sort attributes.

## Accessibility

**Requirements**: TableHeaderCell must expose column-header semantics with an accurate aria-sort value whenever sorting is available: use "ascending" or "descending" for the actively sorted column and "none" for sortable-but-inactive columns. The interactive sorting target must be a real button (the button slot) so it is reachable by keyboard and exposed as a control. Color contrast of the header text and any sort icon must meet WCAG AA against the header background, and the focus indicator must remain visible against both the resting and hover backgrounds. Touch targets must be large enough (at least the standard Fluent control height) so the sort button is comfortably tappable on mobile.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the sort button inside the column header (or to the next interactive element when the column is not sortable). |
| `Shift + Tab` | Moves focus to the previous focusable element, typically the preceding column header's sort button. |
| `Enter` | Activates the header's button slot to toggle sorting on the column. |
| `Space` | Also activates the header's button slot to toggle sorting, matching native button behavior. |

**ARIA**: aria-sort (reflects sortDirection as ascending, descending, or none), aria-label on the button slot, for a descriptive, localized sort action name, aria-hidden on the sortIcon slot, which is decorative and duplicates the announced sort state, role and header semantics on the root cell element, so it is conveyed as a column header rather than a generic cell

**Screen Reader**: When focus lands on the button slot, screen readers announce the column label followed by the control role, and the cell reports its sort state through aria-sort so users hear whether the column is sorted ascending, descending, or not sorted. The sort icon is decorative and should not add extra noise, so it is hidden from the accessibility tree while the state is carried by aria-sort. Content in the aside slot is read after the primary header content; if an aside control is focusable, it appears as a separate stop in the tab order immediately after the sort button.

## Styling

Style the header through the root, button, sortIcon, and aside slots exposed by the component's className and classNames API. Common customizations include tightening the cell with padding tokens such as tokens.spacingHorizontalS and tokens.spacingVerticalXS, emphasizing the label with tokens.fontWeightSemibold, and coloring text with tokens.colorNeutralForeground1 for the default header and tokens.colorNeutralForeground2 for lower-emphasis headers. Hover feedback on the sortable button slot typically uses tokens.colorNeutralBackground1Hover or tokens.colorSubtleBackgroundHover; the active focus ring should be built from tokens.colorStrokeFocus2 and tokens.strokeWidthThin. Reserve space for the indicator by sizing the sortIcon slot with tokens.fontSizeBase300 and spacing it from the label with tokens.spacingHorizontalXS so column widths do not jump when sorting changes. Borders under header rows generally use tokens.colorNeutralStroke2 with tokens.strokeWidthThin, and the aside slot usually needs tokens.spacingHorizontalXS plus a flex alignment so trailing actions stay vertically centered with the label.

## Performance

TableHeaderCell is rendered once per column per header row, so its render cost is proportional to column count rather than row count, but a sort click typically re-renders the entire table body. Keep the sort comparator and toggle handler stable (define them outside the render path or memoize them) so memoized body rows are not invalidated on every header render. Avoid allocating new objects or inline arrays for the sortIcon and aside slots on each render when those slots contain components that rely on referential equality. For large datasets, prefer the DataGrid header cell, which coordinates sorting and virtualization at the table level rather than per column.

## Theming & Tokens

TableHeaderCell consumes Fluent theme tokens through the slots it exposes. Header text typically resolves to tokens.colorNeutralForeground1, with tokens.fontWeightSemibold for emphasis and tokens.fontSizeBase300 and tokens.lineHeightBase300 for typography. Hover feedback on the sortable button slot is derived from tokens.colorNeutralBackground1Hover and tokens.colorNeutralForeground1Hover, while the focus ring uses tokens.colorStrokeFocus2 with tokens.strokeWidthThin. Header separators and cell borders come from tokens.colorNeutralStroke2 and tokens.colorTransparentStroke, and interior padding resolves from tokens.spacingHorizontalS, tokens.spacingVerticalXS, and tokens.spacingHorizontalXS. Because all of these are theme tokens, the header adapts automatically to light, dark, and high-contrast themes as well as custom brand ramps.

## Migration Notes

TableHeaderCell is the v9 replacement for the v8 DetailsHeader-style header primitives. In v9 the sorting contract is explicit: instead of spreading arbitrary props onto the header, you declare sortable and sortDirection, and the component wires the button and sortIcon slots for narration and interaction. Consumers migrating from v8 should move custom click handlers onto the button slot, move trailing icons or menus into the aside slot, and delete any manually managed aria-sort attributes because the component now derives them from sortDirection.

## Edge Cases

- A sortable column without a defined sortDirection renders an interactive header with no active indicator; this is valid but should be paired with an explicit not-sorted state so users understand the column is sortable.
- Changing sortDirection alone does not reorder data; the consumer must apply the matching sort to the row collection or use a grid-level component that does so.
- When multiple columns support sorting, only the active column should receive a defined sortDirection, otherwise several headers will claim an active sort simultaneously.
- The header label may be visually truncated at narrow widths, which can hide the full column meaning from sighted users; ensure an alternative such as a tooltip or abbreviated-but-clear label is available.
- Focusable content placed in the aside slot becomes an extra tab stop per column, so a wide sortable table with many aside controls can create a long tab sequence.
- Column resize affordances often live in the aside slot; they must not be placed inside the button slot or sorting and resizing will compete for the same activation.
- In right-to-left layouts the aside slot still renders after the primary content in DOM order, but its visual position flips, so any manual margins or absolute positioning must be direction-aware.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
