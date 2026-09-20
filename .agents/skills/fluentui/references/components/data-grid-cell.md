# DataGridCell

> **Package**: `@fluentui/react-table` v9.19.16
> **Import**: `import { DataGridCell } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

DataGridCell is the leaf-level primitive of the Fluent UI React v9 DataGrid family. It represents a single data cell within a DataGridRow inside a DataGrid, and it is responsible for the cell's keyboard focus semantics rather than for data fetching or sorting. The component exposes a single behavioral prop, focusMode, which decides whether the cell itself is focusable, whether focus is trapped on a group of nested interactive elements inside the cell, or whether the cell is removed from the tab sequence entirely. Because DataGrid follows the ARIA grid interaction model, the parent DataGrid and DataGridRow handle grid-level concerns such as row and column indexing, arrow-key navigation, and selection state, while DataGridCell contributes the rendered cell container plus the focus boundary. In practice you compose DataGridCell with DataGrid, DataGridBody, DataGridHeader, DataGridHeaderCell, DataGridRow, and DataGridSelectionCell, and put whatever content you need inside the cell — plain text via Text, a Button, a Menu, a Badge, or an Avatar. It renders one DOM element per cell (a gridcell role container), so it is intentionally minimal and cheap to render many times.

**When to use**: Use DataGridCell whenever you build a table with the v9 DataGrid components and you need to render the body content of a row — it is the required building block for every non-header cell. Choose it over hand-rolled table markup because it carries the correct gridcell role and because the focusMode prop gives you an explicit, declarative way to manage focus inside interactive cells. Reach for focusMode set to group when the cell contains one or more focusable children (buttons, links, menus) and you want keyboard users to step into the cell with Enter, Tab through its contents, and leave with Escape. Keep the default focusMode of cell for cells that are purely informational but must still be reachable in grid navigation, and use focusMode set to none when the cell is decorative or duplicated elsewhere and adding a focus stop would only slow keyboard users down. For header cells use DataGridHeaderCell, not DataGridCell; for the row-level selection affordance use DataGridSelectionCell.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `focusMode` | `DataGridCellFocusMode \| undefined` | `cell` | No | Used when there are nested focusble elements inside a focusable cell - `group`: Enter keypress moves focus inside the cell, focus is trapped inside the cell until Escape keypress - `cell`: The cell is focusable - if there are focusable elements in the cell use `group` - `none`: The cell is not focusable |

### Prop Guidance

- **focusMode**: Controls the keyboard focus contract of the cell. Use the default cell when the cell is read-only content that should still be reachable while navigating the grid with arrow keys. Use group when the cell contains one or more focusable descendants (Button, Link, MenuTrigger, Checkbox, and similar): the cell then becomes a single focus stop, Enter moves focus inside, and Escape returns focus to the cell. Use none when the cell should be excluded from the focus order entirely — for example purely decorative cells, or cells whose content is fully duplicated by an adjacent labeled control. Never use group without focusable children, and never use none on a cell that holds the only interactive or informational content of the row. Changing focusMode does not change visual styling, so pair group with a visible focus treatment of your own. `group`

## Best Practices

### Do's

- Set focusMode to group on any DataGridCell that contains nested focusable elements such as Button, Link, MenuTrigger, or Checkbox so screen reader and keyboard users have a predictable entry and exit point.
- Keep the default focusMode of cell for cells whose content is static text or non-interactive visuals, so the cell remains reachable through the grid's keyboard navigation.
- Render cell content in the same order across all rows — leading visual, then primary text, then trailing metadata — so that arrow-key traversal down a column reads consistently.
- Give each interactive element inside a cell a distinct accessible name (for example via aria-label) rather than relying on the column header to explain it, since column context is not always announced after focus moves inside.
- Use DataGridSelectionCell for row selection controls and DataGridHeaderCell for column headers instead of overloading DataGridCell with either responsibility.
- Keep cell content lightweight; if a cell needs a rich composite (for example an overflow menu of actions), place the composite behind a single Menu or Button entry point rather than several sibling buttons.
- Pair focusMode set to group with a visible focus indicator on the cell container so users can tell that focus is on the group boundary rather than on an inner control.

### Don'ts

- Don't set focusMode to group on a cell that has no focusable descendants — Enter will move focus nowhere and the group trap becomes a dead end.
- Don't set focusMode to none on cells that contain the only copy of important information or the only interactive control in the row; those cells become unreachable by keyboard.
- Don't nest a second grid, listbox, or dialog trigger inside a cell without also checking the surrounding focusMode, since nested focus management can conflict with the group trap.
- Don't put clickable behavior on the DataGridCell container itself; add a real Button or Link inside the cell so the control exposes a proper role and accessible name.
- Don't rely on color alone to convey cell status (for example a red cell background for an error) — include text or an icon with an accessible label.
- Don't duplicate the column header text verbatim inside every cell purely for screen readers; rely on DataGridHeaderCell relationships and only add aria-label when the cell's own control needs clarification.
- Don't apply fixed pixel widths or heights to a cell that must stay aligned with DataGridRow layout; use the column definitions on the parent DataGrid instead.

## Anti-Patterns

### Group focus trap with no focusable children

❌ Setting focusMode to group on a cell that only contains text makes Enter a no-op: focus never moves inside, and because the cell acts as a group boundary, keyboard users experience an unexplained dead stop in their traversal.

✅ Leave focusMode at its default cell for text-only content and reserve group for cells that actually contain focusable descendants such as a Button, Link, or MenuTrigger.

### Removing interactive cells from the focus order

❌ Setting focusMode to none on a cell that holds the row's action button or its only identifier makes that content unreachable by keyboard and invisible to grid navigation, which breaks WCAG 2.1.1 and often WCAG 2.4.3 as well.

✅ Give interactive cells focusMode group and keep them in the focus order, or move the action out of the cell into a row-level control such as a Menu or the row's own selection cell so it is always reachable.

### Making the whole cell clickable instead of using a control

❌ Attaching click handlers to the cell container produces an element with a gridcell role that answers to the mouse but exposes no button semantics, no accessible name, and no Enter or Space activation.

✅ Render a real Button, Link, or Menu inside the DataGridCell, set the cell's focusMode to group so keyboard users can reach it, and keep the cell container purely presentational.

### Duplicating header text inside every cell for screen readers

❌ Visually hidden repeats of the column header in each cell create noisy announcements like "Name, Name, Alice" and can drift out of sync when the header is renamed or localized.

✅ Rely on DataGridHeaderCell plus the grid's column index relationships for column context, and add aria-label only to in-cell controls whose own name is genuinely ambiguous.

### Fixed sizing on cells to force column widths

❌ Hard-coded pixel widths or heights applied to individual DataGridCell elements fight the layout computed from the column definitions, producing misaligned columns, broken resizing, and clipping when text scales.

✅ Define column sizing on the parent DataGrid and only use cell-level styles for typography, padding, borders, and text truncation.

## Accessibility

**Requirements**: DataGridCell participates in the ARIA grid pattern, so the composed table must satisfy WCAG 1.3.1 (Info and Relationships) by exposing grid, row, gridcell, and columnheader roles with accurate row and column counts and indexes, and WCAG 4.1.2 (Name, Role, Value) for every interactive control inside a cell. Keyboard operability must meet WCAG 2.1.1, focus order must remain logical per WCAG 2.4.3, and the focus indicator must remain visible per WCAG 2.4.7 — in particular when focusMode is group, users must be able to see both the cell-level focus boundary and whichever inner control currently has focus. Text and interactive content inside cells must meet WCAG 1.4.3 contrast (4.5:1 for body text, 3:1 for large text and UI boundaries) against the cell background in both light and dark themes. If a cell truncates content, provide an accessible way to read the full value, since WCAG 1.4.4 rescaling and 1.4.10 reflow require content not to be lost.

| Key | Action |
| --- | --- |
| `Enter` | When the focused cell uses focusMode group, Enter moves focus to the first focusable element inside the cell; when the cell itself is not focusable, Enter activates the focused inner control instead. |
| `Escape` | When focus is inside a cell with focusMode group, Escape returns focus to the cell container and releases the focus trap. |
| `Tab` | Moves focus into the next focusable element, which for a focusMode group cell means walking through the inner controls before leaving the cell; cells with focusMode none are skipped entirely. |
| `Shift+Tab` | Moves focus backwards through the inner controls of a focusMode group cell and then back out to the preceding focusable element. |
| `ArrowLeft / ArrowRight` | Handled by the surrounding DataGrid to move focus horizontally between cells within the same row. |
| `ArrowUp / ArrowDown` | Handled by the surrounding DataGrid to move focus vertically between cells in the same column, or to move to the next row. |
| `Home / End` | Handled by the surrounding DataGrid to move focus to the first or last cell of the current row. |
| `Ctrl+Home / Ctrl+End` | Handled by the surrounding DataGrid to move focus to the first or last cell of the grid. |
| `Space` | Activates the focused interactive control inside the cell, such as a Button or Checkbox; it has no effect on the cell container itself. |

**ARIA**: role="gridcell" on the cell element (contributes the grid cell semantics within the parent grid), aria-colindex on the cell, used together with the row and grid level indexes so assistive technology can announce the current column, aria-selected on cells whose row or cell is part of a selection model managed by DataGrid, aria-label or aria-labelledby on interactive elements inside the cell when their visible text alone is not a sufficient accessible name, aria-describedby to associate helper or error text inside the cell with the control it describes, aria-disabled on in-cell controls that are visually present but unavailable, aria-hidden="true" on purely decorative icons, avatars, or swatches inside the cell so they are not announced redundantly

**Screen Reader**: Screen readers enter the DataGrid in grid navigation mode after focusing a cell, typically announcing the grid name, dimensions, and then the focused cell's content together with its column header and row position (for example, "Status, row 3, Active"). Arrow-key movement triggers announcements of the newly focused cell rather than re-reading the whole table. When a cell uses focusMode group, activating it with Enter changes the reading context from grid browsing to form interaction, so the inner control's own role and name are announced, and Escape returns the user to grid navigation on the same cell. Cells with focusMode none are not announced as focusable stops and their content is read only as part of the surrounding grid traversal. Because DataGrid manipulates focus programmatically, screen reader users rely on the row and column index attributes being consistent with the visual layout; mismatched aria-colindex values between DataGridHeaderCell and DataGridCell cause incorrect column announcements.

## Styling

DataGridCell is intentionally unstyled beyond the layout it inherits from DataGridRow, so most customization is done by targeting the cell element with a className created through makeStyles and the Griffel token system. Typical adjustments are padding — tokens.spacingHorizontalM and tokens.spacingVerticalS or tokens.spacingVerticalMNudge — and text rhythm via tokens.fontFamilyBase, tokens.fontSizeBase300, tokens.lineHeightBase300, and tokens.colorNeutralForeground1 for primary values, tokens.colorNeutralForeground2 for secondary text, or tokens.colorNeutralForegroundDisabled for disabled values. Row striping and hover feedback are usually expressed with tokens.colorNeutralBackground1, tokens.colorNeutralBackground2, tokens.colorNeutralBackground1Hover, and tokens.colorNeutralBackground1Selected applied to the row, while cell-level emphasis for a highlighted column uses tokens.colorBrandBackground2 with tokens.colorBrandForeground1. Borders between cells should use tokens.strokeWidthThin with tokens.colorNeutralStroke2, and stronger separators tokens.colorNeutralStroke1. Focus visibility for a focusMode group cell comes from the focus outline color tokens.colorStrokeFocus2 (and its companion stroke width token tokens.strokeWidthThick), so avoid removing outlines; instead restyle them with outlineColor and a matching outline offset. Rounded corners inside a cell (for example a swatch or avatar) should use tokens.borderRadiusSmall or tokens.borderRadiusMedium to stay in scale, and truncated text should combine overflow hidden with text-overflow ellipsis plus a white-space nowrap rule so reflow behavior stays predictable. Numeric cells are commonly right-aligned with a shared class so digits line up across rows.

## Performance

DataGridCell is the most frequently rendered element in a data grid — one instance per column per visible row — so its render cost multiplies quickly in large tables. Keep the element's children simple and avoid constructing new objects, arrays, or inline style objects on every render pass inside a cell; Griffel classes created once outside the render path are dramatically cheaper than per-render style objects. Memoize expensive cell content (formatted dates, currency strings, derived status mappings) so that re-rendering a row for selection or hover state does not recompute every cell's display value. Because a cell participates in focus management, avoid re-creating cell contents on every keystroke or scroll event; unstable children can steal focus from inside a focusMode group cell and force a re-seat of the focus boundary. When rendering thousands of rows, combine deliberately simple cells with the grid's own row virtualization strategy rather than making each cell a heavy component tree, and prefer rendering a compact trigger (a single Button or Menu) over several sibling interactive elements so the cell contributes exactly one focus stop in group mode.

## Theming & Tokens

DataGridCell consumes the active FluentProvider theme, so all of its colors, typography, and spacing scale automatically when the theme changes between light and dark or when a brand theme created with createLightTheme or createDarkTheme is applied. The tokens you will most often touch on the cell and its row are tokens.colorNeutralBackground1 and tokens.colorNeutralBackground1Hover for the resting and hovered surface, tokens.colorNeutralBackground1Selected for selected rows, tokens.colorNeutralBackground2 for striped rows, tokens.colorNeutralForeground1 and tokens.colorNeutralForeground2 for primary and secondary text, tokens.colorNeutralForegroundDisabled for unavailable values, and tokens.colorNeutralStroke1 or tokens.colorNeutralStroke2 with tokens.strokeWidthThin for cell separators. Focus rings on a focusMode group cell should use tokens.colorStrokeFocus2 with tokens.strokeWidthThick so they remain visible against every theme surface. Emphasis inside a cell — a highlighted value, a status pill, a leading badge — is best expressed with tokens.colorBrandBackground2 paired with tokens.colorBrandForeground1 rather than hard-coded colors, and status colors should come from the theme's palette tokens so contrast survives dark mode. Finally, typography inside cells is normally normalized once with tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.lineHeightBase300, and density can be adjusted by overriding spacing tokens such as tokens.spacingVerticalS and tokens.spacingHorizontalM in the theme rather than by editing each cell's markup.

## Migration Notes

In Fluent UI React v8 there was no DataGridCell primitive; tabular rendering was built with DetailsList, which owned cell rendering through column-level render callbacks and produced its own focus behavior for the entire list. The v9 DataGrid model inverts that: DataGridCell is a composition primitive you place inside DataGridRow, and any per-column rendering you previously expressed as a column render function is now written as the child content of the cell. The focusMode prop is new in v9 and has no v8 counterpart — focus handling that was previously implicit in the list's row focus model must now be declared per cell, choosing group for cells with inner controls and none for cells that should stay out of the focus order. Selection affordances that were configured on the list in v8 are expressed in v9 by rendering DataGridSelectionCell alongside DataGridCell. Because DataGridCell has a native gridcell role, any custom role or tabindex that older code applied to a manually rendered cell element should be removed to avoid conflicting semantics.

## Edge Cases

- Setting focusMode to group on a cell whose descendants are disabled or conditionally rendered at runtime creates a focus boundary with nothing inside it; gate the value on whether focusable children actually exist, for example by computing it from the same data that drives the inner controls.
- Header cells are DataGridHeaderCell, not DataGridCell — passing a DataGridCell into DataGridHeader produces the wrong role and breaks sort and column index announcements.
- focusMode set to none removes the cell from the tab sequence, so keyboard users can reach its content only by reading it during grid traversal; if that content is the row's only distinguishing value, it effectively becomes invisible to keyboard-only navigation.
- Cells that truncate long values with ellipsis hide information from sighted users while screen readers still read the full text, so provide a tooltip or expandable detail view to keep the experience equivalent.
- Nested interactive components inside a cell (a Menu, a DialogTrigger, or an inner focus-managed list) each have their own focus containment; when they are placed inside a focusMode group cell, Escape closes the innermost layer first and only returns to the cell boundary once every inner layer is dismissed.
- A cell that re-renders its content while focus sits inside a focusMode group cell can lose the focus position; keep the child structure stable or restore focus explicitly after the update.
- Very wide or very long cell content interacts badly with fixed column sizing — combine text overflow handling in the cell style with column resizing on the parent DataGrid so users can still read the full value.
- Virtualized or scrollable grids can unmount cells that currently hold focus, so keep the focused cell within the rendered window or the grid will appear to jump when the viewport changes.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
