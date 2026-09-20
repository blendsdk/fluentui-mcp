# FlatTreeItem

> **Package**: `@fluentui/react-tree` v9.16.1
> **Import**: `import { FlatTreeItem } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

FlatTreeItem is the low-level, single-row building block used inside a FlatTree. Unlike the higher-level TreeItem, which derives its structural metadata from how it is nested inside Tree and TreeItem components, FlatTreeItem renders one flattened row and asks the consumer to supply the ARIA structural metadata directly through the required value, aria-level, aria-setsize, and aria-posinset props. It owns no hierarchy of its own: the surrounding FlatTree renders a single flat array of items in document order, and each FlatTreeItem declares where it sits in the logical tree. That design makes FlatTreeItem the correct primitive when the tree data is already flat (for example, a server-provided or locally flattened list derived from an expanded/collapsed state map), when you need to interleave tree rows with a windowing or virtual scrolling library, or when you need precise control over row order, offsets, and rendering. Because value is the identity of the item, the FlatTree uses it to track which nodes are open, which are selected, and which descendant rows should be visible. The component itself renders the treeitem row and its content; indentation, expansion affordances, keyboard focus, and roving tabindex behavior are coordinated by the parent FlatTree.

**When to use**: Use FlatTreeItem inside FlatTree when your data is already a flat, ordered list rather than deeply nested JSX, when the number of nodes is large enough that you want to virtualize or window the rows, or when you need to control exactly which rows are mounted and in what order (for example, appending lazily loaded children). The required aria-level, aria-setsize, and aria-posinset props make FlatTreeItem the right choice when you already compute depth and sibling position in your data layer and do not want the component to re-derive it. Prefer the standard Tree with TreeItem, TreeItemLayout, and TreeItemPersonaLayout when the hierarchy is naturally expressed as nested components, when the tree is small enough to render in full, or when you want the component library to compute levels and sibling counts for you. Prefer FlatTree with FlatTreeItem over a hand-rolled list of divs whenever keyboard navigation, selection, and screen reader tree semantics matter.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `'aria-level'` | `number` | — | Yes | — |
| `'aria-posinset'` | `number` | — | Yes | — |
| `'aria-setsize'` | `number` | — | Yes | — |
| `value` | `TreeItemValue` | — | Yes | — |

### Prop Guidance

- **value**: Required identity for the item. FlatTree keys its open state, selection state, and descendant visibility off this value, so it must be unique within the tree and stable across renders. Use your domain identifier (a path, slug, or database key) rather than a label or an array index, and reuse the same value when you programmatically ask the tree to open or select an item. `folder-reports-q3`
- **aria-level**: Required, one-based depth of the item in the logical hierarchy. Top-level nodes are level 1 and each nested level adds one. This is the only depth signal available to assistive technology in a flat tree, so it must match the hierarchy users see; do not simulate depth with padding instead of setting this value. `2`
- **aria-setsize**: Required total number of siblings that share this item's parent. Count only nodes at the same level under the same parent, not every node in the tree, and recompute it whenever siblings are added, removed, or filtered. When the total is genuinely unknown at render time, ARIA permits a value of -1 to indicate an unknown set size. `6`
- **aria-posinset**: Required, one-based position of this item among its siblings that share the same parent. Together with aria-setsize it produces announcements such as item three of six. It must be recomputed whenever the flattened array is filtered, sorted, or expanded, because positions shift with sibling visibility. `3`

## Best Practices

### Do's

- Always pass all four required props — value, aria-level, aria-setsize, and aria-posinset — for every item; they are the only source of structure that assistive technology receives from a flat markup list.
- Keep value unique and stable across renders, because FlatTree uses it as the identity for open state, selection, and focus; derive it from a domain id such as a folder path or database key rather than from a mutable label.
- Compute aria-level as a one-based depth where top-level nodes are level 1 and each nested level increments by one.
- Compute aria-setsize and aria-posinset relative to siblings that share the same parent only, not relative to the total number of items in the tree; posinset is one-based.
- Emit the flattened array in the same order that a reader should traverse the tree — parents immediately followed by their visible children — and include only nodes whose ancestors are currently expanded.
- Render rich row content (chevron affordance, icon, label, secondary text) inside the item so rows visually match the rest of your tree experience; composable layout pieces such as TreeItemLayout and TreeItemPersonaLayout are available in the library for consistent row structure.
- Recompute level, setsize, and posinset in a single pass when the source data changes (expansion, filtering, insertion) so the announced structure always matches what is on screen.

### Don'ts

- Do not omit aria-level, aria-setsize, or aria-posinset, and do not pass placeholder constants; a wrong setsize causes screen readers to announce positions that contradict what the user can navigate.
- Do not fake indentation with increasing horizontal padding to represent depth — depth must be expressed through aria-level so the row is announced at the correct level.
- Do not render FlatTreeItem outside of a FlatTree, since it relies on the tree context for navigation, focus roving, and open/selection state.
- Do not mix TreeItem and FlatTreeItem inside the same tree container; choose the nested component API or the flat component API for a given tree.
- Do not use the array index as the value when items can be reordered, filtered, or lazily inserted, because identity will drift and expand/select state will attach to the wrong rows.
- Do not leave rows for collapsed descendants in the rendered array; a flattened list has no nesting to hide them, so they will remain focusable and announced.

## Anti-Patterns

### Simulating depth with indentation instead of aria-level

❌ Adding progressively larger padding or margin to rows to make them look nested leaves screen reader users with a flat list of items that all appear to be at the same level, and it forces you to maintain one wrapper or class per depth.

✅ Express depth exclusively through the required aria-level prop and let a single style handle row layout. If the visual indentation needs adjustment, apply one className and a spacing token rather than a per-level ladder of styles.

### Reusing array indexes as value

❌ The flat array changes length and order whenever nodes expand, collapse, or are filtered, so an index-based value silently points at a different logical node after any data change. Open state and selection then appear on the wrong rows.

✅ Derive value from a stable domain identifier for each node and keep that identifier in your data model so expansion and selection lookups survive reordering and filtering.

### Stale aria-setsize and aria-posinset after filtering

❌ Set sizes and positions computed once at load time become wrong as soon as siblings are filtered, collapsed, or lazily inserted, so the screen reader announces positions that do not match what the user can actually navigate to.

✅ Compute level, setsize, and posinset as part of the same pass that builds the flattened visible array, so the announced structure is always regenerated with the rendered list.

### Leaving collapsed descendants in the flat array

❌ In a flat list there is no nesting to hide children of a collapsed node. If those rows remain in the array, they stay focusable and announced even though they are logically hidden.

✅ Filter the array against the tree's open state before rendering, so a collapsed node contributes a single row and no descendants.

### Mixing nested and flat tree APIs in one container

❌ TreeItem and FlatTreeItem derive structure differently, so combining them in the same tree produces conflicting levels, sibling counts, and navigation behavior.

✅ Choose one model per tree: nested Tree with TreeItem when the hierarchy is expressed in markup, or FlatTree with FlatTreeItem when the hierarchy comes from flattened data.

## Accessibility

**Requirements**: FlatTreeItem participates in the WAI-ARIA tree pattern. The containing FlatTree must expose the tree role and the item renders the treeitem role, giving assistive technology a navigable hierarchy. The three ARIA metadata props are mandatory by design of this component: aria-level is the one-based depth of the node, aria-posinset is the one-based position of the node among its siblings, and aria-setsize is the total number of siblings at that level. Because the DOM is flat, these attributes are what allow a screen reader to announce the item as part of a hierarchy and to report position and count. The item must be reachable by keyboard as part of the tree's single-tab-stop model, and any interactive element you place inside the row should not introduce a second tab stop or it will break the roving-focus pattern. When you virtualize rows, ensure the accessible structure of the mounted rows is still coherent: only render items that are genuinely visible in the logical tree, and keep level/setsize/posinset accurate for the mounted set.

| Key | Action |
| --- | --- |
| `ArrowDown` | Moves focus to the next visible FlatTreeItem in the flattened array; handled by the surrounding FlatTree. |
| `ArrowUp` | Moves focus to the previous visible FlatTreeItem; handled by the surrounding FlatTree. |
| `ArrowRight` | Expands a collapsed parent item, or moves focus to its first child when already expanded; the open state is tracked by FlatTree using the item value. |
| `ArrowLeft` | Collapses an expanded parent item, or moves focus out to the parent node when the item is a leaf or already collapsed. |
| `Home` | Moves focus to the first visible item in the tree. |
| `End` | Moves focus to the last visible item in the tree. |
| `Enter` | Activates the focused item, typically selecting it or invoking its primary action depending on how selection is configured on the tree. |
| `Space` | Toggles selection of the focused item when selection is not following focus, matching the tree pattern. |
| `Typeahead characters` | Moves focus to the next visible item whose label starts with the typed character or string. |

**ARIA**: aria-level, aria-setsize, aria-posinset, role (treeitem, applied by the item), aria-expanded (applied by the tree for nodes that have children), aria-selected (applied by the tree when selection is enabled), aria-disabled (applied by the tree when an item is non-interactive)

**Screen Reader**: A screen reader encounters FlatTreeItem as a treeitem within a tree and announces the item label together with its position in the hierarchy derived from aria-level, aria-posinset, and aria-setsize — for example, level two, item three of six. Because the markup is flat, the announcement quality depends entirely on those values being correct and consistent with the visible order. Expansion state is announced through the aria-expanded state the tree applies to parent nodes, and selection state through the state the tree applies when selection is enabled. Roving tabindex means only the focused item is in the tab order, so screen reader users navigate the tree with arrow keys rather than the Tab key, and virtualized rows that unmount can lose focus context unless focus is restored to a sibling row.

## Styling

FlatTreeItem renders the row element that the tree styles, so most customization is done by targeting the item class and its internal parts. Row text should use tokens.colorNeutralForeground1 for the default label and tokens.colorNeutralForeground2 for secondary or supporting text, with tokens.colorNeutralForegroundDisabled for disabled nodes. Backgrounds follow the interaction tokens: tokens.colorNeutralBackground1 for the resting row, tokens.colorNeutralBackground1Hover for hover, tokens.colorNeutralBackground1Selected for selected rows, and tokens.colorBrandBackground2 with tokens.colorBrandForeground2 for a brand-tinted selection treatment. Focus visibility should use tokens.colorStrokeFocus2 with tokens.borderRadiusMedium so the focus ring matches other Fluent controls. Spacing between rows and around row content uses tokens.spacingVerticalXS, tokens.spacingVerticalS, tokens.spacingHorizontalM, and tokens.spacingHorizontalL; row typography uses tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.lineHeightBase300. Because indentation is driven by aria-level rather than by nested wrapper elements, do not add per-level padding classes that duplicate the depth signal — if you adjust indentation visually, do it through a single className on the item and a spacing token step such as tokens.spacingHorizontalL so the visual and announced hierarchy stay in agreement. When virtualizing, always set an explicit height on the row (for example derived from tokens.lineHeightBase300 plus vertical spacing) so the windowing calculations and the rendered rows stay aligned.

## Performance

FlatTreeItem exists specifically to make large trees tractable: because it is a single flat row with no nested children of its own, a virtualizer can mount only the rows in the viewport and unmount the rest without destroying the logical structure, which is impossible with a deeply nested TreeItem tree. Keep the flattened array and its level, setsize, and posinset metadata computed in a single linear pass and memoized against the open state, so that expanding one node does not trigger a full re-derivation of the whole tree. Keep value stable so that open and selection lookups remain cheap and do not cause rows to be treated as new. Avoid creating new inline style objects or className strings on every render of every row, since virtualized trees render hundreds of rows in a frame; hoist class names and style objects. When rows are memoized, ensure the props that appear in equality checks (value, aria-level, aria-setsize, aria-posinset, and any open or selected flags you pass through) are primitives rather than freshly created objects.

## Theming & Tokens

FlatTreeItem inherits its visual language from the tree styles driven by the FluentProvider theme, so switching themes restyles every row automatically. Row typography comes from tokens.fontFamilyBase, tokens.fontSizeBase300, tokens.fontSizeBase400, tokens.lineHeightBase300, and tokens.fontWeightRegular, while emphasis for selected or primary nodes uses tokens.fontWeightSemibold. Surfaces and states map to tokens.colorNeutralBackground1, tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground1Pressed, tokens.colorNeutralBackground1Selected, with brand-oriented selection expressed with tokens.colorBrandBackground2 and tokens.colorBrandForeground2. Foreground colors follow tokens.colorNeutralForeground1 for primary labels, tokens.colorNeutralForeground2 for descriptions and chevrons, tokens.colorNeutralForegroundDisabled for non-interactive nodes, and tokens.colorStrokeFocus2 for the focus indicator. Layout metrics come from tokens.spacingVerticalXS, tokens.spacingVerticalS, tokens.spacingHorizontalM, and tokens.spacingHorizontalL, and corners from tokens.borderRadiusNone or tokens.borderRadiusMedium depending on the row shape you want. Any of these can be overridden through a custom theme or a scoped FluentProvider, which is preferable to hard-coded color or spacing values that would not adapt to dark or high-contrast themes.

## Migration Notes

If you are moving a tree from the nested Tree and TreeItem API to FlatTree and FlatTreeItem, the main shift is that structural information moves from markup nesting into props: every item now needs value, aria-level, aria-setsize, and aria-posinset supplied by your data layer, and the tree is rendered as one ordered array instead of nested components. Any state you previously expressed through component nesting — which children exist, their order, and their depth — must now be computed before render. Consumers accustomed to letting the component derive sibling counts and levels should expect to maintain that bookkeeping themselves, in exchange for the ability to virtualize and to control exactly which rows mount.

## Edge Cases

- ARIA allows an unknown set size: if you genuinely cannot know how many siblings exist at render time, a value of -1 is the pattern-legal way to indicate that, rather than guessing a total.
- Top-level items must use aria-level of 1 and be counted among the root siblings; a common bug is starting depth at 0, which produces announcements one level too shallow for the entire tree.
- When a row is unmounted by virtualization while it holds focus, focus context is lost; restore focus to the nearest mounted visible sibling when the focused value scrolls out of view.
- Filtering the flat array changes both posinset and setsize for every remaining sibling, so search or filter features must regenerate the metadata rather than reuse the pre-filter values.
- Because value is the identity used for open and selection state, duplicated values make expansion and selection unpredictable — enforce uniqueness when building the array.
- Rendering FlatTreeItem outside a FlatTree container means no tree context is available for navigation or state, so the row will render but will not behave as part of a tree.
- Interactive controls placed inside a row can create a second tab stop and break the tree's roving tabindex; keep row-level interaction on the row itself and avoid focusable descendants where possible.
- Lazily loaded children change the parent's sibling counts and the setsize of the newly inserted group, so both the parent's aria-setsize and every new child's aria-setsize and aria-posinset must be recalculated on insertion.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
