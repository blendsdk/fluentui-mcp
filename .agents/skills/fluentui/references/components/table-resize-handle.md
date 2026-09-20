# TableResizeHandle

> **Package**: `@fluentui/react-table` v9.19.16
> **Import**: `import { TableResizeHandle } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

TableResizeHandle is the draggable affordance that lets users change an individual column's width at runtime. It renders as a single root slot (a div) and is placed at the trailing edge of a table header cell, usually inside DataGridHeaderCell or TableHeaderCell, where it sits over the boundary between two columns. The handle does not own sizing logic itself: it consumes the surrounding table's feature state through the required columnId, width, and tableState props, plus the optional columnSizingOptions, containerWidthOffset, and autoFitColumns settings, and hands pointer interaction back to the table's column sizing feature so widths stay in sync with the rest of the grid. Because the sizing, sorting, selection, and focus behaviors all live in the shared table state, the handle exposes only the identity of the column it resizes and the current measured width, and it inherits interaction semantics (focusMode, selectionMode, onSelectionChange, onSortChange, sortable, sortDirection) from the table it is embedded in rather than being configured independently. In practice it is a small, mostly visual component whose correct behavior depends entirely on being rendered inside a Table or DataGrid that has column sizing enabled.

**When to use**: Use TableResizeHandle when you are building a data table where users need to control column widths themselves — for example, report grids with long text columns, dashboards where the same table is reused with different data shapes, or any DataGrid where columnSizingOptions is configured and the default widths are only a starting point. It belongs inside header cells of a Table or DataGrid that already has the column sizing feature wired up; adding handles without that state produces an inert separator. Do not use it as a generic drag-to-resize primitive for non-table layouts, do not use it to resize rows or panels, and do not add it to body cells. If your columns are fixed and never change, or you can express the widths with autoFitColumns and CSS, you do not need a resize handle at all.

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

- **columnId**: Required. Identifies which column boundary this handle controls; it is the key the table's column sizing state uses to store and report widths. It must match the column identifier used in your column definitions and in columnSizingOptions, or the handle will resize nothing. `file-name`
- **width**: Required. The column's current rendered width in pixels, supplied by the table's column sizing state. It anchors the drag math, so always pass the live value for the given columnId instead of a constant or a value captured at mount. `240`
- **tableState**: Required. The table feature state object (column sizing, selection, sorting, focus metadata) that the handle reads and writes through. It is produced by the table's hook/state pipeline and must come from the same table instance that renders the column; passing a state object from a different table instance will resize the wrong grid. `tableState.columnSizing_unstable`
- **root**: Required slot. Renders as a div and is the element users grab. Use it to attach className, style, ref, or event handlers, and override the rendered element through the table's slot mechanism when your styling system requires it. `className`
- **containerWidthOffset**: Optional. A pixel value subtracted from the measured container width when the table computes how much room is available. Set it when the table lives inside a wrapper with horizontal padding, borders, or a visible scrollbar, otherwise auto-fit results and the final column boundary drift away from the visible edge. `16`
- **autoFitColumns**: Optional. Enables distributing leftover or deficit space across columns so the table fills its container instead of leaving a gap after a resize. Combine it with containerWidthOffset so the available space is measured against the real content box. Leave it off when you want each drag to change exactly one column. `true`
- **columnSizingOptions**: Optional in the handle surface and normally configured on the table. Defines the per-column defaultWidth, minWidth, and maxWidth used by the sizing state. Supply bounds for every resizable column so a drag cannot collapse it to zero width or push it beyond the viewport. `minWidth: 60, maxWidth: 400`
- **visible**: Optional. Controls whether the handle is present and interactive for a given column. Use it to expose resize affordances only where resizing is allowed, and make sure a non-visible handle is also out of the tab order. `false`
- **focusMode**: Inherited from the table's focus-management feature. It decides whether header cells participate in a single-tab-stop grid or use standard cell-by-cell focus, which in turn affects how users reach the handle. Keep the default for data grids; only change it when the surrounding application manages focus itself. `cell`
- **selectionMode**: Inherited from the table's selection feature, not configured on the handle. It describes whether the grid allows single or multiple row selection, which affects the presence of a leading selection cell next to the resizable columns. Configure it on the table, never on the resize handle. `multiselect`
- **onSelectionChange**: Part of the table's selection feature. It reports selection changes for the grid and is not driven by the resize handle; keep it on the table component so the handle stays purely about widths. `(e, data) => setSelected(data.selectedItems)`
- **onSortChange**: Part of the table's sorting feature. It is surfaced through shared table state so a header cell that is both sortable and resizable keeps one source of truth. Wire sorting on the table, not on the handle. `(e, sortState) => setSortState(sortState)`
- **sortable**: Marks whether the owning column can be sorted. When a header cell is both sortable and resizable, make sure the sort trigger and the resize handle do not overlap, so a drag never activates a sort. `true`
- **sortDirection**: Describes the current sort direction of the owning column, so header styling can reflect ascending or descending state independently of the resize affordance. `ascending`
- **appearance**: A visual appearance value surfaced from adjacent table parts (for example a primary emphasis on a cell or selection control). The resize handle itself does not change its size or behavior based on it; style the handle through styling overrides instead. `primary`
- **truncate**: Belongs to the header cell's layout, not to the handle. It controls whether header text clips with an ellipsis when a column is narrowed. Expect truncation to kick in as users shrink columns, and verify the ellipsis does not obscure the resize affordance. `true`
- **type**: Describes the kind of selection control used in a table cell (checkbox versus radio). It is part of the selection cell's surface, not of the resize handle, so it should never be set on the handle. `checkbox`
- **checked**: The checked state of a selection control in the table, exposed through shared state. It is unrelated to column resizing and should be managed by the selection cell that renders the control. `true`
- **subtle**: A visual emphasis flag from adjacent cell surfaces. Use it on the element that actually supports it; applying it to the resize handle has no effect on the drag behavior. `true`
- **hidden**: Removes the element from rendering. Use it to drop a resize affordance entirely when a column must not be resizable, rather than leaving a focusable but non-functional handle in place. `true`
- **invisible**: Keeps the element's layout space while making it visually hidden. Useful when you need column boundaries to stay aligned but want to suppress the visible grip; remember that an invisible handle must also be removed from the tab order if it should not be interactive. `true`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Render the handle inside the header cell of the column it controls, passing that column's columnId so the sizing state knows which boundary is being dragged.
- Pass the live measured width for the column (the value the table's column sizing state currently reports) rather than a constant, so drag math stays anchored to the rendered width.
- Configure columnSizingOptions on the table before rendering handles, including per-column defaultWidth, minWidth, and maxWidth, so users cannot collapse a column into nothing or push it off screen.
- Set containerWidthOffset when the table sits inside a container with horizontal padding, borders, or a scrollbar, so auto-fit calculations and the last column line up with the visible edge.
- Keep the handle's accessible name descriptive and localized — it is the only cue a screen reader user gets that the column boundary is interactive.
- Verify the handle's hit area is large enough to grab comfortably on touch devices; widen the interactive zone with padding or a transparent extension rather than enlarging the visible line.
- Test resizing with keyboard focus and with a screen reader active, and announce the new width with an AriaLiveAnnouncer if column width changes are meaningful to the task.
- Confirm that resizing does not visually collide with a sort affordance in the same header cell; the sort trigger should remain reachable and should not fire on a drag that begins on the resize handle.

### Don'ts

- Don't render TableResizeHandle outside a Table or DataGrid that provides column sizing state — without tableState and columnSizingOptions the handle has nothing to resize and becomes a decorative, focusable separator.
- Don't hard-code the width prop or cache it once at mount; a stale width makes the drag jump on the first pointer move and drift afterwards.
- Don't strip, hard-code, or override the handle's separator role and accessible name, and don't mark it aria-hidden while it is still focusable.
- Don't build a parallel resize implementation with your own document-level mouse listeners; that competes with the table's column sizing state and produces double updates or orphaned listeners.
- Don't add handles to every cell or to body rows — a handle only makes sense at a column boundary in the header.
- Don't set selectionMode, focusMode, sortable, or sortDirection on the handle hoping to change table behavior; those belong to the table's feature configuration and are only surfaced through shared state.
- Don't rely on a hidden or invisible handle to communicate that a column is resizable — removed affordances should also be removed from the tab order and from the accessibility tree.

## Anti-Patterns

### Handle rendered without table sizing state

❌ TableResizeHandle has no internal sizing logic — it derives everything from columnId, width, and tableState. Rendering it in a standalone layout or in a table without column sizing configured produces a focusable separator that does nothing when dragged, which is confusing for both pointer and keyboard users.

✅ Render the handle only inside header cells of a Table or DataGrid that has the column sizing feature enabled, and confirm each handle's columnId matches a column that actually exists in columnSizingOptions.

### Hard-coded or stale width

❌ The width prop anchors the drag math. Passing a literal, a value captured once at mount, or a value from a different column makes the boundary jump on the first pointer move and drift progressively as the user keeps dragging.

✅ Always pass the width the table's column sizing state currently reports for that columnId, so every render of the handle reflects the real rendered width.

### Custom resize implementation layered on the handle

❌ Adding your own mousemove and mouseup listeners to duplicate what the sizing state already does leads to double width updates, conflicting minimums, leaked listeners on unmount, and a handle whose visual position disagrees with the stored width.

✅ Let the table's column sizing feature own the interaction. The handle should receive the column identifier and current width and nothing more; if you need different constraints, express them through columnSizingOptions rather than a parallel implementation.

### Separator role or name stripped for styling reasons

❌ Removing the separator role, clearing the accessible name, or setting aria-hidden on a still-focusable handle makes the affordance invisible to screen readers while leaving it in the tab order — a focus stop with no announcement.

✅ Keep the separator role, orientation, and a descriptive accessible name, and if the handle is meant to be purely decorative, remove it from the tab order as well so keyboard users never land on an unlabeled element.

### Ignoring container chrome when auto-fitting

❌ When autoFitColumns and the column sizing state measure the container, padding, borders, and scrollbars are counted as usable width unless containerWidthOffset is set. The symptom is a table that overflows its wrapper or leaves a visible gap after the last resize.

✅ Measure the horizontal chrome around the table and set containerWidthOffset to that value, then re-check the layout when the wrapper's padding, border, or scrollbar behavior changes.

### Resize handles on every cell

❌ Adding handles to body cells or to every cell in a row multiplies focus stops, contradicts the expected model of column-boundary resizing, and makes the tab sequence through a large table unusable.

✅ Place exactly one handle at the trailing edge of each resizable header cell, and only for columns that should be user-resizable.

## Accessibility

**Requirements**: The handle must expose a name, a role, and a state that assistive technology can interpret: render it as a vertical separator with a descriptive aria-label, keep it focusable, and keep it visible enough to satisfy non-text contrast requirements (the grip line must meet 3:1 against the surface behind it). Provide a touch target of at least 24 by 24 CSS pixels. Because resizing is a pointer-first interaction, ensure the same outcome is achievable another way — for example by preserving keyboard-reachable column sizing controls or a documented equivalent — and don't allow resizing to hide content that has no other access path. Any announcement of the resulting width should go through AriaLiveAnnouncer rather than through focus changes.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the handle when it participates in the header cell's focus order, letting keyboard users discover the resize affordance. |
| `Shift+Tab` | Moves focus back out of the handle to the previous focusable element in the header row. |
| `Enter or Space` | Activates the handle when keyboard resizing is wired by the column sizing state; without that wiring the key has no effect, so confirm behavior in your table before documenting it. |
| `ArrowLeft and ArrowRight` | Nudge the owning column boundary by a step where keyboard resizing is supported, shrinking or growing the column relative to its current width. |
| `Escape` | Cancels an in-progress resize interaction and restores the previous column width where the column sizing feature supports cancellation. |

**ARIA**: role="separator" (vertical orientation) — communicates that the element divides two columns and can be adjusted, aria-orientation="vertical", aria-label — the only accessible name for the handle; describe the column it resizes, aria-valuenow, aria-valuemin, and aria-valuemax when the current, minimum, and maximum widths are known, tabIndex — keeps the handle in the tab sequence while it is interactive, aria-hidden — set only on purely decorative variants that are also removed from the tab order

**Screen Reader**: Screen readers announce the handle as a vertical separator with its aria-label, typically when the user tabs through the header row, so the label is what tells the user which column boundary they have reached. The handle lives inside the header cell's DOM, so its label may also be picked up when the header cell itself is read; keep the name short and avoid repeating the column's visible text verbatim. Drag-driven width changes are silent — a screen reader user gets no feedback that the column grew or shrank unless you announce it through AriaLiveAnnouncer. Because focus remains on the separator during a keyboard interaction, make sure the handle is not hidden or unmounted mid-interaction, as that would drop focus back to the document body.

## Styling

The root slot is a plain div, so it accepts className, style, and the standard slot override mechanism; target the handle class in your stylesheet when you need a wider or taller grab zone without changing the visible line. The default look is a thin vertical line using tokens.strokeWidthThin and tokens.colorNeutralStroke1, which reads as a column boundary until the user hovers. For hover and press feedback, move to tokens.colorNeutralStroke1Hover and tokens.colorNeutralStroke1Pressed, or use tokens.colorBrandStroke1 to highlight the column being resized. Widen the interactive region with tokens.spacingHorizontalXS or tokens.spacingHorizontalSNudge of padding, or with a transparent pseudo-element that overhangs the column edge, so the hit area meets touch-target guidance while the visible line stays one pixel. Round the grip with tokens.borderRadiusSmall if you render a thicker affordance, and animate state changes with tokens.durationNormal and tokens.curveEasyEase rather than an ad-hoc transition. In RTL layouts, rely on the FluentProvider direction instead of hard-coded left or right offsets, and when the table is inside a padded or bordered wrapper, coordinate your container padding with the containerWidthOffset value so the last column's boundary and the wrapper edge agree. If you change the header cell height or density, re-check that the handle still spans the full header height — it is usually stretched with height 100% rather than a fixed value.

## Performance

Resizing is a continuous pointer interaction, so every pointer move can trigger a width update and a re-render of the table header and rows; the cost scales with the number of rendered rows. Keep the resize path free of extra work — avoid deriving new arrays or objects inside the drag handler, avoid writing to state that other parts of the page depend on, and do not recreate the columnSizingOptions object on every render, since a new identity forces the sizing state to reconcile. Column auto-fit measurement is materially more expensive than a plain drag because it needs to measure content, so prefer explicit defaultWidth and minWidth values for large or virtualized tables and reserve autoFitColumns for small grids or one-time initialization. If your table virtualizes rows, remember that column width changes invalidate the horizontal layout of every visible row, so batch any programmatic width changes rather than applying them per frame. Finally, keep the handle's own DOM minimal — a single div is enough; adding wrappers or an icon inside it increases the element count per header cell without adding function.

## Theming & Tokens

The handle has no colors of its own; it is themed entirely through Griffel tokens, which means it follows FluentProvider automatically across the light and dark web themes and high-contrast variants. The idle grip line is drawn with tokens.strokeWidthThin and tokens.colorNeutralStroke1, and interaction states move through tokens.colorNeutralStroke1Hover and tokens.colorNeutralStroke1Pressed; use tokens.colorBrandStroke1 when you want to emphasize the column under an active resize. Spacing around the grip should come from tokens.spacingHorizontalXS and tokens.spacingHorizontalSNudge so the hit area scales with density, and any radius on a thicker affordance should use tokens.borderRadiusSmall. Transitions should use tokens.durationNormal with tokens.curveEasyEase. Because column widths themselves are values in the table's sizing state rather than tokens, remember that a resize permanently overrides any token-derived default width for that column; if you want widths to snap back to a themed default, re-apply the sizing options on the relevant layout breakpoint. In forced-colors mode the handle must remain distinguishable, so avoid background-image-only grips and keep a real border or outline color that the system can remap.

## Migration Notes

In Fluent UI v8-style DetailsList resizing, column resizability and the resize callback were declared per column (an isResizable flag plus an onColumnResize handler) and the drag mechanics were handled imperatively by the list. The v9 model is declarative and state-driven: column widths live in the table's column sizing state, configured through columnSizingOptions and read back through tableState, and TableResizeHandle is simply the visual affordance rendered in each header cell. Migrating means removing per-column callbacks and any custom drag listeners, adding handles to the header cells of the columns that should be resizable, and supplying columnSizingOptions with defaultWidth, minWidth, and maxWidth per column so the new sizing state has bounds to work with. Remember to set containerWidthOffset if your v8 layout relied on container padding or borders that are now measured differently.

## Edge Cases

- Auto-fit width measurements taken before web fonts finish loading can be wrong, leaving columns slightly too narrow or too wide; re-measure after fonts settle if exact sizing matters.
- When the last resizable column abuts a vertical scrollbar, the effective container width changes as the scrollbar appears and disappears; containerWidthOffset must account for that or the final boundary will shift.
- In right-to-left layouts the handle should sit on the opposite column edge; rely on FluentProvider direction rather than hard-coded left or right positioning so the grip and the drag direction both flip correctly.
- A header cell that is both sortable and resizable has two overlapping pointer targets; if the resize handle covers the sort trigger, a drag intended to widen the column can instead toggle the sort order.
- Columns without a minWidth in columnSizingOptions can be dragged down to an unusably small width, effectively hiding their content with no way to recover except reloading the view.
- Hidden or invisible handles still occupy layout space or the DOM; if they remain focusable, keyboard users get a focus stop with no visible indication of where focus went.
- If the table instance re-mounts (for example after a data-source swap) and the handle receives a tableState from the previous instance, resizing silently updates state that nothing renders from.
- Very wide tables with many rows will visibly lag during a drag because each width change re-lays out every rendered row; consider throttling or constraining resizable columns on large datasets.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
