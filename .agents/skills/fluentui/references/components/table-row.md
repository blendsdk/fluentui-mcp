# TableRow

> **Package**: `@fluentui/react-table` v9.19.16
> **Import**: `import { TableRow } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

TableRow is the row primitive of the Fluent UI React v9 Table component family. It renders the semantic table row element through its required root slot (a native tr by default), grouping one or more TableCell or TableHeaderCell children into a single row inside a table section such as TableBody or TableHeader. Its only visual prop, appearance, applies a pre-built background treatment with matching hover and pressed states that is specifically intended to be paired with row selection: brand tints a selected row with brand colors, neutral tints it with neutral colors, and none (the default) leaves the row transparent. TableRow is the plain, unopinionated building block; richer row behavior such as sorting, column resizing, keyboard grid navigation, and managed selection is layered on top of it by DataGridRow within DataGrid.

**When to use**: Use TableRow whenever you compose a table by hand from the Table primitives and need each row of data rendered with correct table semantics. Reach for it when you want full control over what each cell contains, when you are rendering a header row of TableHeaderCell elements inside TableHeader, or when you need a selected-row highlight via appearance without adopting a full grid. Prefer DataGridRow when you need built-in sorting, column resizing, roving keyboard navigation, and selection state managed for you by DataGrid. Prefer List and ListItem, FlatTree, or Tree for collections that are navigational, hierarchical, or not genuinely tabular, since those components carry list/tree semantics that screen readers expect and TableRow does not provide.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `"brand" \| "neutral" \| "none" \| undefined` | `none` | No | A table row can have different variants. These appearances are intended to be used with selection. |

### Prop Guidance

- **appearance**: Controls the row's background treatment. Accepts brand, neutral, and none, and defaults to none, which leaves the row transparent so the table background shows through. Use brand for the row that represents the user's primary selection or current item and should read as brand-colored, use neutral for selected rows that should stay visually quiet, and use none for ordinary, unselected, and header rows. The variants include matching hover and pressed background states, and they are documented as being intended for use with selection, so change the value as the selection state changes rather than as static decoration. Setting appearance does not set aria-selected or check any control; keep the visual and programmatic states in sync yourself or use DataGrid, which manages both. `brand`
- **root**: The required root slot receives all native row attributes and event handlers you pass, including className, style, id, data attributes, aria-selected, aria-rowindex, and pointer or keyboard handlers, plus the ref that points at the underlying row element. Use it for layout-neutral styling through Griffel classes and for the ARIA state that mirrors appearance, but do not use it to change the element's display value or to inject non-cell children, since both break table layout and semantics. `className`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Render TableRow inside a table section such as TableBody or TableHeader rather than dropping it loose into arbitrary containers, so that the generated tr participates in a valid table structure.
- Keep the number, order, and meaning of TableCell children identical across every row, including header rows, so columns stay aligned and screen readers can associate cells with the correct headers.
- Reserve appearance set to brand for rows that genuinely represent the user's current or selected item and need brand emphasis, and appearance set to neutral for selected rows that should stay visually restrained.
- Pair the visual state created by appearance with a real programmatic state: include a TableSelectionCell with a checkbox or set aria-selected on the row root when the row is part of a selection model.
- Place selection controls as the first cell of the row so keyboard and screen reader users find them in a predictable position in every row.
- Style custom row backgrounds through the root slot's className using Griffel tokens such as tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Selected so the row adapts to dark, high-contrast, and Teams themes.
- Give selectable or clickable rows an accessible name, either through aria-label on the row or through the text of the cells, so that focus landing on the row is meaningful.
- Use TableCell padding or a min-height on the row to control row density, keeping layout changes at the cell level where the shared table layout can still calculate column widths.

### Don'ts

- Do not use appearance to create zebra striping or decorative alternation; the appearances are documented as intended for selection, and alternating them makes hover and pressed feedback look arbitrary.
- Do not indicate selection with the row background alone; color-only cues violate WCAG 1.4.1 and are invisible to screen reader users.
- Do not put non-cell content such as toolbars, dividers, or nested containers directly inside TableRow; only cells belong in a row.
- Do not change the row's display value or otherwise take a single row out of the shared table layout, because doing so breaks column alignment for the whole table.
- Do not apply brand or neutral appearance to header rows or to rows that are not representing a selection or current-item state.
- Do not hard-code hex colors or rely on inline background styles on the row; these override or fight with the appearance hover and pressed states and break theme switching.
- Do not nest interactive elements so deeply that a row is both focusable and full of focusable children without an obvious primary action, since that creates ambiguous tab order for keyboard users.

## Anti-Patterns

### Using appearance for zebra striping

❌ Alternating brand, neutral, and none down a table to get striped rows repurposes a selection-oriented API for decoration. Users learn that a tinted row means something, hover and pressed states that ship with those variants appear on rows that are not interactive, and the meaning of a genuinely selected row is diluted.

✅ Leave appearance at its default for unselected rows and apply stripe colors with tokens such as tokens.colorNeutralBackground2 through a className on the row or cells, reserving brand and neutral for rows that are actually selected.

### Selection communicated only by row tint

❌ Setting appearance to brand or neutral on a selected row without updating aria-selected or a selection control means screen reader users are never told the row is selected, and users with low vision or color vision deficiencies may not perceive the change, which fails WCAG 1.4.1.

✅ Set aria-selected on the row root, include a TableSelectionCell with a checkbox at the start of the row, and let appearance reinforce rather than replace those signals.

### Making the whole row interactive when a cell control would do

❌ Attaching activation behavior and a tab stop to the row itself while its cells also contain focusable controls produces a confusing tab order and can trap or duplicate keyboard activation, and a focusable row with no accessible name announces only its position.

✅ Put the primary action in a Button, Link, or other control inside the relevant cell, or adopt DataGridRow, which provides a consistent row interaction and focus model with the corresponding ARIA and keyboard handling.

### Overriding row colors with hard-coded styles

❌ Inline or hard-coded background and text colors on the row bypass the appearance variants' hover and pressed states and stay fixed when the surrounding FluentProvider switches to a dark, high-contrast, or Teams theme, often producing unreadable contrast.

✅ Style through the root slot's className with Griffel tokens such as tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground1Selected, and tokens.colorNeutralStroke1 so every theme remaps the colors automatically.

## Accessibility

**Requirements**: TableRow's root slot renders a native tr, so the component inherits the accessibility contract of HTML tables: it must live inside a proper table structure (a Table with TableBody or TableHeader, or an equivalent section element) so assistive technology can compute row and column positions. Ensure TableHeaderCell elements in the header row are used for column labels so each data cell has a programmatically associated header. If the row is selectable, expose the state with aria-selected on the row and provide a focusable selection control such as the checkbox inside TableSelectionCell. If the row is interactive, it must be reachable and operable by keyboard, must show a visible focus indicator (WCAG 2.4.7), and any action must be available without relying on hover. Selection must never be conveyed by background color alone (WCAG 1.4.1), and text/background contrast inside the row must meet WCAG 1.4.3 in all themes.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the row's focusable descendants, such as the checkbox in a TableSelectionCell or an action button in a cell, then out to the next row or control. |
| `Shift+Tab` | Moves focus backwards out of the row to the previously focusable control. |
| `Enter` | Activates the row's primary action when the row itself is focusable and wired for activation, for example opening a detail view from a selectable data row. |
| `Space` | Toggles selection when the focused element is a selection control or when the focused row is part of a selection model that handles the space key. |
| `ArrowDown / ArrowUp` | Moves focus to the row below or above in grid implementations such as DataGrid that add roving row navigation; a plain TableRow does not move focus by itself. |
| `ArrowLeft / ArrowRight` | Moves focus between cells within a row in grid implementations that add roving cell navigation. |

**ARIA**: aria-selected, aria-rowindex, aria-rowcount, aria-disabled, aria-label, aria-labelledby

**Screen Reader**: Because the root renders a tr inside a table, screen readers announce the row in the context of the surrounding table and report the row and column position as focus moves through cells, reading the associated column header from the TableHeaderCell when it is configured correctly. Background tint applied by appearance is never announced, so a selected row is only reported as selected when aria-selected is set on the row or a checkbox in a TableSelectionCell is checked. A focusable row without an accessible name is announced only as a row with its position, which gives the user no information about what the row represents, so interactive rows should carry a label or meaningful cell content.

## Styling

TableRow is primarily styled through its appearance variants, so most customization happens on the root slot's className or on the cells. To restyle a row by hand, target the root and use Griffel tokens: tokens.colorNeutralBackground1 for a base surface, tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed for interaction states, tokens.colorNeutralBackground1Selected for rows you manage yourself, and tokens.colorSubtleBackgroundHover for a lighter wash. Draw separators with strokeWidthThin plus tokens.colorNeutralStroke1, and use tokens.colorStrokeFocus2 with tokens.strokeWidthThick for focus rings. Text color normally comes from the cells, so set tokens.colorNeutralForeground1 or tokens.colorNeutralForeground2 on TableCell rather than on the row. Row height and density are best controlled through TableCell padding or a min-height on the row; do not set display, width, or height tricks on an individual row because all rows in a table share one layout and column widths will drift. Remember that a custom background on a TableCell will visually cover the row's appearance tint, so keep opaque cell backgrounds and appearance variants from competing.

## Performance

TableRow itself is a thin wrapper around a tr and is inexpensive to render; the cost of a large table is dominated by the number of TableCell children and the content inside them. Give each row a stable key derived from your data so React can reuse DOM nodes when rows are reordered, filtered, or appended. Because Griffel compiles the appearance variants into shared atomic classes, switching a row between none, neutral, and brand does not generate new styles. Avoid creating inline style objects or new handler functions on every render for every row, and memoize cell content or extract heavy cell renderers into components so a change in one row does not cascade into re-rendering the whole table. For very large datasets, paginate or virtualize rather than rendering thousands of TableRow elements at once, and keep an eye on re-renders triggered by parent state such as selection sets that change on every click.

## Theming & Tokens

The appearance variants are theme-token driven rather than hard-coded colors: brand uses the brand background family, with tokens.colorBrandBackground2 as the resting tint and its hover and pressed siblings such as tokens.colorBrandBackground2Hover and tokens.colorBrandBackground2Pressed for interaction feedback, while neutral uses the neutral background family such as tokens.colorNeutralBackground3 with the corresponding hover and pressed tokens. When appearance is none the row renders transparent and the table surface, typically tokens.colorNeutralBackground1, shows through. Row separators and stroke detail come from tokens.colorNeutralStroke1 with strokeWidthThin, focus indication uses tokens.colorStrokeFocus1 and tokens.colorStrokeFocus2, and text color is inherited from TableCell and TableHeaderCell, which use tokens.colorNeutralForeground1, tokens.colorNeutralForeground2, and tokens.colorNeutralForeground3. Because every one of these is a theme token, rows restyle automatically under FluentProvider themes for light, dark, high-contrast, and Teams, and custom row styling should use the same tokens to remain theme-safe.

## Edge Cases

- appearance only tints the row; if a TableCell inside the row paints its own opaque background, the tint is hidden behind the cell and the selection state may appear to be missing for that column.
- Setting appearance does not set aria-selected, check any checkbox, or change any selection state; the visual and programmatic states are entirely your responsibility unless you use DataGrid.
- Header rows built with TableHeaderCell inside TableHeader should generally keep the default appearance, since brand and neutral are intended to signal selection rather than structure.
- Because all rows in a table share one layout, overriding display, height, or width on a single TableRow breaks alignment with every other row in the table.
- Only cell elements belong inside a row; nesting arbitrary containers directly in TableRow produces invalid table markup and React DOM validation warnings about unexpected children.
- The default none appearance makes rows transparent, so a row placed over a colored or patterned container will show that container rather than the table surface.
- Rows are only meaningful inside a table structure; rendering TableRow outside of a table section loses row and column semantics for screen reader users.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
