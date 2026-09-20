# TableSelectionCell

> **Package**: `@fluentui/react-table` v9.19.16
> **Import**: `import { TableSelectionCell } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

TableSelectionCell is a presentational table cell that renders a row-level selection control—either a checkbox or a radio button—inside a table. It is used inside a Table row (typically as the first cell, alongside TableCell content) to let users select single or multiple rows, and it can also be paired with a header cell to expose a select-all affordance. The cell is driven entirely by the consumer: it receives a checked value (including a "mixed" state for partially selected groups) and relies on the surrounding table or data grid to own and update selection state. Because it is a thin wrapper over the underlying checkbox or radio control, it participates in the same theming, focus, and accessibility systems as the rest of Fluent UI React v9, and it offers visual modes such as a subtle treatment that stays hidden until checked or until the parent row is hovered or focused.

**When to use**: Use TableSelectionCell when you need row selection in a static or server-driven table built from Table, TableRow, and TableCell, and you want the selection control to be visually integrated with the row rather than placed outside the table. Use type "checkbox" when users may select more than one row (multi-select, with a select-all cell in the header that can be checked or mixed), and type "radio" when exactly one row may be selected at a time. Prefer the DataGrid family (including DataGridSelectionCell) when you need sorting, filtering, virtualization, or built-in selection state management, and prefer TableSelectionCell when you are rendering a plain semantic table and managing selection yourself. Avoid using it as a general-purpose checkbox outside of a table row, and avoid using it when the row already has a primary action that would conflict with the selection gesture.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `checked` | `boolean \| "mixed" \| undefined` | `false` | No | — |
| `hidden` | `boolean \| undefined` | — | No | Completely hides the selection cell **Deprecated** |
| `invisible` | `boolean \| undefined` | `false` | No | Hides the selection cell visually but takes up the same space |
| `subtle` | `boolean \| undefined` | `false` | No | Only visible when checked or the parent row is hovered/focused |
| `type` | `"checkbox" \| "radio" \| undefined` | `checkbox` | No | A table can have two kinds of selection modes. |

### Prop Guidance

- **type**: Selects which control is rendered in the cell: "checkbox" for multi-select tables and "radio" for single-select tables. Match this value consistently across every row and the header cell so the selection model is unambiguous, and pick radio only when selecting a second row must replace the first. `checkbox`
- **checked**: Reflects the current selection state for this row, or for the header cell the aggregate state of all rows. Pass true or false for individual rows and "mixed" on a header checkbox when some but not all rows are selected; the component does not store this state, so it must come from the table's selection model. `mixed`
- **subtle**: Renders the selection control so it is only visible when checked or when the parent row is hovered or focused, which keeps dense tables visually quiet. Use it when the table is primarily read rather than acted upon, and confirm that keyboard focus still reveals the control and that the surrounding row provides hover styling. `true`
- **invisible**: Hides the selection control visually while keeping it in the layout, preserving the column's width and the cell's alignment with the header. Use it for tables where selection is available but not the primary interaction, and prefer it over the deprecated hidden prop because it prevents layout shift and keeps the column grid stable. `true`
- **hidden**: Deprecated: completely hides the selection cell, collapsing the space it occupied. Avoid it in new code because it removes the selection affordance and can shift the remaining columns; use invisible when you want the control hidden but the layout preserved. `true`

## Best Practices

### Do's

- Match the type value to the table's selection model: use checkbox for multi-select tables and radio for single-select tables, and never mix both in the same table.
- Keep the selection state in the parent table or page component and pass the resolved value into checked, so header cells, row cells, and any bulk action bar agree on what is selected.
- Use checked = "mixed" on a header selection cell to communicate that only some rows are selected, and compute it from the actual row selection state rather than hard-coding it.
- Place the selection cell as the first cell in each row, before any content cells, so the selection affordance is in a predictable position for both sighted users and screen readers.
- Keep the control discoverable when using subtle: verify that keyboard focus reveals it, since the control is only visible when checked or when the parent row is hovered or focused.
- Give the selection control an accessible name in context, for example by labeling the header selection cell with something like "Select all rows" and row cells with a name derived from the row's identifying content.
- Use invisible instead of the deprecated hidden prop whenever you want the cell to occupy the same width but not be painted, which keeps columns aligned and headers consistent.

### Don'ts

- Don't pass a checked value without wiring up the corresponding state update, because the cell is uncontrolled by design and will appear frozen to the user.
- Don't set checked to "mixed" when type is "radio": a radio group represents exactly one choice, so a partially selected state has no meaning.
- Don't use the deprecated hidden prop in new code; hiding the cell entirely removes the selection affordance and shifts the surrounding column layout.
- Don't rely on subtle in contexts where hover is unavailable or unreliable (touch devices, coarse pointers) without confirming that focus and checked states still make the control reachable.
- Don't add more than one selection cell per row, and don't place a checkbox selection cell and a radio selection cell in the same table.
- Don't treat this component as a data grid cell: it has no knowledge of sorting, filtering, paging, or virtualization, so selection across pages or filtered views must be reconciled by your own state.
- Don't obscure the control with custom styles that drop the focus outline; the visible focus indicator is what makes subtle selection usable from the keyboard.

## Anti-Patterns

### Checkbox selection in a single-select table

❌ Pairing a checkbox selection cell with logic that only keeps one row selected contradicts what the checkbox communicates, so screen reader users and sighted users alike expect cumulative selection that never happens.

✅ Use type "radio" for single-select tables so the control's semantics match the one-row-at-a-time behavior, and reserve checkbox for multi-select where a select-all header cell makes sense.

### Using the deprecated hidden prop

❌ hidden removes the cell entirely, which collapses the selection column, causes visible layout shift between the header row and body rows, and eliminates the only affordance for selecting a row.

✅ Use invisible instead: it keeps the control in the layout so columns stay aligned and selection remains programmatically reachable, and reveal it on hover or focus when you want a quieter look.

### Uncontrolled checked value

❌ Passing a checked value that never changes, or leaving it undefined while expecting the cell to remember its own state, results in a control that never reflects what the user clicked and desynchronizes the header select-all cell from the rows.

✅ Own selection state in the table or page component, derive each row's checked value from that state, and derive the header cell's checked value (including "mixed") from the same source of truth.

### Relying on subtle for undiscoverable controls

❌ The subtle variant only appears on hover or focus, so on touch devices or pointer-less environments users may never see that row selection exists, and a control that never becomes visible on focus is unusable from the keyboard.

✅ Verify that focus reveals the control on every row, and fall back to the default (non-subtle) appearance in contexts where hover cannot be relied upon; keep the resting border from tokens.colorNeutralStrokeAccessible at a contrast level that remains perceivable.

### Mixed state on a radio cell

❌ Setting checked to "mixed" while type is "radio" produces a state that has no meaning for a radio group and can be announced confusingly by assistive technology.

✅ Only use "mixed" with checkbox selection cells, typically on the header cell, and compute it from the number of selected rows rather than hard-coding it.

## Accessibility

**Requirements**: Row selection controls must be operable by keyboard alone and must expose their state programmatically. Each selection control needs an accessible name that identifies what is being selected (for example, the row's key content for row cells and an explicit label such as "Select all rows" for a header cell). Because the cell is the only affordance for selecting a row, it must remain reachable when invisible is set, and it must become visible when it receives keyboard focus if subtle is used. Preserve a visible focus indicator that meets contrast requirements, and ensure the checked, unchecked, and mixed states are distinguishable without color alone. If selection drives a bulk action, announce the change in selection count through a live region so non-visual users learn the result of their action.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the table and onto the selection control in each row; because each cell contains a separately focusable control, every row's control is part of the tab order. |
| `Shift+Tab` | Moves focus to the previous focusable element, including the selection control in the preceding row. |
| `Space` | Toggles the selection control: switches a checkbox between checked and unchecked (or clears a mixed state), and selects a radio when it is not already selected. |
| `ArrowDown / ArrowUp` | Moves between radio options in a single-select table when the row selection controls share the same radio group name. |
| `ArrowRight / ArrowLeft` | Moves between radio options in the same radio group in single-select tables, mirroring the native radio group behavior. |
| `Enter` | Follows the row or table's default behavior when the row itself is interactive; the selection control itself is activated with Space. |

**ARIA**: aria-label on the selection control to provide an accessible name when no visible text label exists, aria-labelledby to associate the selection control with a row header or other visible label in the row, aria-checked to express the checked, unchecked, and mixed states when the control is exposed as a checkable widget, aria-describedby to associate the control with additional context such as a selection summary or instruction text

**Screen Reader**: Screen readers announce the cell's control according to its type: a checkbox announces itself as a checkbox with its checked, unchecked, or mixed (partially checked) state, while a radio announces itself as a radio button and indicates its position within the group. Because the control is inside a table cell, the announced name is typically derived from the cell's accessible label rather than surrounding row content, so explicit labeling is important; users navigating in table mode hear the row and column context, while users in focus mode hear each control as an individual widget. Changes to selection are not automatically announced unless the application provides a live region summarizing the new selection count.

## Styling

The selection cell renders an unstyled-in-place control, so most customization targets the underlying checkbox or radio through the parent Table styles or a wrapping class. The subtle variant paints nothing at rest and reveals the control using tokens.colorNeutralBackground1Hover and tokens.colorNeutralStroke1Hover when the parent row is hovered or focused, with tokens.colorNeutralBackground1Pressed for the pressed state and tokens.colorBrandBackground for the checked fill. Spacing between the control and row content follows the table's cell padding, but you can nudge alignment with tokens.spacingHorizontalS or tokens.spacingHorizontalMNudge, and control rounding follows tokens.borderRadiusSmall. Keep the focus indicator strong by preserving outline styles driven by tokens.colorStrokeFocus2, and avoid overriding tokens.colorNeutralStrokeAccessible (the resting border) with a low-contrast color, since that border is what makes an unchecked control discoverable. When you use invisible, verify that the reserved width still matches the column width implied by your header cell so the selection column never shifts between header and body rows.

## Performance

Each TableSelectionCell renders one lightweight checkbox or radio control, so the cost scales with the number of rendered rows rather than the number of selected rows. In large tables, a header select-all toggle that lifts state to the top of the tree will re-render every row; keep selection state as close to the rows as practical, memoize row components, and avoid recreating selection handlers inline on each render. If rows can number in the thousands, prefer DataGrid with virtualization over a fully rendered Table, and avoid layout thrash by using invisible rather than the deprecated hidden prop so the selection column width stays constant when the control is not painted.

## Theming & Tokens

TableSelectionCell inherits its visual treatment from the active FluentProvider theme and paints with shared tokens rather than component-specific colors. The checked fill uses tokens.colorBrandBackground with tokens.colorBrandBackgroundHover and tokens.colorBrandBackgroundPressed for interaction states, the resting border uses tokens.colorNeutralStrokeAccessible, hover borders use tokens.colorNeutralStroke1Hover, and the subtle reveal paints with tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed. Focus indication comes from tokens.colorStrokeFocus2, spacing from tokens.spacingHorizontalS and tokens.spacingHorizontalMNudge, and rounding from tokens.borderRadiusSmall, so a brand ramp or dark-theme override applied through FluentProvider automatically retints the selection control without per-instance styling.

## Edge Cases

- checked is a controlled value: the component never toggles itself, so a cell that receives a constant value will look broken until the parent's state actually changes.
- The "mixed" value is only meaningful for checkbox cells and is typically used on a header selection cell after computing how many rows are currently selected.
- With subtile-style visibility, the control can be entirely invisible at rest, so screenshots, print output, and touch-only users may not perceive that selection exists unless focus or checked state reveals it.
- invisible reserves space while visually hiding the control, which keeps header and body columns aligned; the deprecated hidden prop does the opposite and causes the remaining columns to reflow.
- Mismatched type values across rows in the same table (some checkbox, some radio) break the expected selection semantics and confuse assistive technology.
- Selection state across pagination, sorting, or filtering is not tracked by the component, so "select all" behavior must be reconciled by the application against the currently visible rows.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
