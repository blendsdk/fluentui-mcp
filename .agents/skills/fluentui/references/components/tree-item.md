# TreeItem

> **Package**: `@fluentui/react-tree` v9.16.1
> **Import**: `import { TreeItem } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

TreeItem is the individual node component used inside a hierarchical Tree. Each TreeItem represents a single entry in the tree — either a leaf that only displays content or a branch that can be expanded to reveal nested TreeItem children. A TreeItem owns its own expand/collapse state through the open prop, can report state changes through onOpenChange, and is identified inside the hierarchy by a value. In a nested tree the parent relationship is inferred from React context, while in a flat tree the relationship must be declared explicitly through parentValue. TreeItem renders a single root slot, and the visible content of the item — its label, icon, secondary actions, and persona markup — is normally projected through TreeItemLayout or TreeItemPersonaLayout, which handle indentation, focus ring placement, and expanded/collapsed affordances. The component is unstyled beyond theme tokens and inherits selection behavior from the surrounding Tree or FlatTree rather than managing selection itself.

**When to use**: Use TreeItem when you need to render a hierarchical, navigable structure: file and folder explorers, organizational charts, category trees, nested settings, or site navigation with collapsible sections. Choose TreeItem (as a child of Tree) for nested markup where the parent-child relationship is expressed by JSX nesting and Structure is discoverable by the framework through context. Choose FlatTreeItem (as a child of FlatTree) when the data set is naturally flat or virtualized and hierarchy must be expressed with parentValue and itemType. Set itemType to branch for any item that contains children and to leaf for terminal items without children. Reach for a different component when the structure is not hierarchical — use List for flat lists, Menu for transient command surfaces, or Nav for application-level navigation.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `itemType` | `TreeItemType` | — | Yes | A tree item can be a leaf or a branch |
| `onOpenChange` | `((e: TreeItemOpenChangeEvent, data: TreeItemOpenChangeData) => void) \| undefined` | — | No | — |
| `open` | `boolean \| undefined` | — | No | Whether the tree item is in an open state  This overrides the open value provided by the root tree, and ensure control of the visibility of the tree item per tree item.  NOTE: controlling the open state of a tree item will not affect the open state of its children |
| `parentValue` | `TreeItemValue \| undefined` | — | No | This property is inferred through context on a nested tree, and required for a flat tree. |
| `value` | `TreeItemValue \| undefined` | — | No | A tree item should have a well defined value, in case one is not provided by the user by this prop one will be inferred internally. |

### Prop Guidance

- **itemType**: Required discriminator that tells TreeItem whether it is a terminal leaf or an expandable branch. Use branch for any item that renders nested TreeItem children and leaf for terminal items. This value drives whether expansion affordances and aria-expanded are rendered, so it must match the actual shape of the data; mismatches produce items that look expandable but are not, or items whose children are unreachable. `branch`
- **value**: Optional but strongly recommended stable identifier for the item. Supply it whenever the tree uses selection, when you programmatically open or close an item, or when you need to resolve an item for scrolling or focus management. If omitted, an internal value is inferred, which is fine for purely presentational trees but makes external control fragile. `settings-appearance`
- **open**: Controls the expansion state of a single branch item, overriding the open value supplied by the root tree. Use it only for genuinely controlled scenarios such as restoring persisted expansion state or revealing a searched node. Remember the documented caveat: controlling a parent's open state does not control its children, so a fully controlled tree requires managing the open prop across every branch item. `true`
- **onOpenChange**: Callback fired when the user requests a change of the expansion state for that item. Pair it with open to keep controlled state in sync, and use the event data to distinguish which item changed and whether the request was to expand or collapse. Omit it for uncontrolled items where the tree manages expansion internally. `(event, data) => setOpenItems(next)`
- **parentValue**: Declares which item is the logical parent of this item. In a nested tree the value is inferred through context and should normally be omitted; in a flat tree it is required for every item other than root-level entries, and it is what allows arrow-key navigation, level computation, and aria-level and aria-posinset reporting to work correctly. `settings`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Always set itemType explicitly on every TreeItem so the component knows whether to render expand/collapse affordances and how to compute aria-expanded.
- Provide a stable, unique value for each item when the tree needs selection, programmatic control, or deep linking, and keep the values stable across renders.
- Use TreeItemLayout (or TreeItemPersonaLayout) as the content child of a TreeItem so indentation, focus styling, and the expand/collapse icon are rendered consistently.
- Control open only when the application genuinely needs to own expansion state (for example, expanding a path to a deep-linked node), and pass onOpenChange alongside it to keep the state synchronized.
- Set parentValue on every item when rendering a flat tree, and keep the nested structure consistent with those values so focus order and arrow-key navigation behave correctly.
- Keep the tree's visible content shallow — one label per item with an optional icon or persona — so users can scan the hierarchy quickly.

### Don'ts

- Do not render children inside an item whose itemType is leaf; the component treats leaves as terminal and the extra markup will not be exposed as a nested group.
- Do not attempt to manage selection, roving focus, or aria-selected at the TreeItem level — those behaviors belong to the surrounding Tree and must be configured there.
- Do not duplicate value strings across siblings, because selection and programmatic expansion resolve items by value.
- Do not toggle open by mutating internal state on click handlers in the content; use the built-in expansion affordance or the open plus onOpenChange pair.
- Do not assume that controlling open on a branch automatically controls its descendants — the documented behavior is that a controlled item's open state does not propagate to its children.
- Do not put long paragraphs, forms, or complex interactive widgets inside a single TreeItem; trees are for structure and navigation, not for dense content.

## Anti-Patterns

### Marking a container as a leaf

❌ Rendering nested children under an item whose itemType is leaf creates a visual hierarchy that assistive technology does not see; the children are not exposed as a group, and the parent will never announce an expanded state.

✅ Set itemType to branch for any item that renders children, and set leaf only for items that genuinely have no descendants.

### Reimplementing expansion with click handlers

❌ Adding a click handler that mutates external state to show or hide children bypasses the component's expansion semantics, so aria-expanded stays stale and arrow-key expand/collapse stops matching what is on screen.

✅ Rely on the built-in expansion behavior, and when controlled behavior is required, set open together with onOpenChange so the reported state and the rendered state stay aligned.

### Managing selection on the item

❌ Attempting to track selected state per TreeItem duplicates the tree's own selection model, producing two sources of truth and inconsistent aria-selected output.

✅ Configure selection once on the surrounding Tree or FlatTree, give every item a unique value, and read the selected values from the tree's change events.

### Unstable or duplicate values

❌ Generating values from array index, timestamps, or duplicated strings makes controlled expansion and selection resolve to the wrong item after data updates or reordering.

✅ Derive values from stable domain identifiers so an item keeps the same value across re-renders, reorders, and refetches.

### Assuming a controlled parent expands its subtree

❌ Setting open on a branch is expected to reveal all descendants, but the documented behavior limits control to that single item, so deep nodes remain collapsed and users see an empty area.

✅ Track and set open across every branch along the path you want to reveal, or leave expansion uncontrolled and drive only the specific node you need.

## Accessibility

**Requirements**: TreeItem participates in the ARIA tree pattern. Each item is exposed with the treeitem role and must be a child of the tree or group role provided by Tree, or of the flat tree container, so that assistive technology can compute depth, position, and set size. Every item must have an accessible name derived from its visible label content, or supplied through an aria-label or aria-labelledby on the root when the item has no text content. Branch items must expose an accurate expanded or collapsed state, and the expansion affordance must not be the only way to operate the item — keyboard operation through the tree's roving tabindex is required. Selection state, when the tree is configured for selection, must be programmatically conveyed rather than expressed only with color. Respect WCAG 2.1 requirements for 1.4.3 Contrast (Minimum) on labels and icons, 2.1.1 Keyboard for all expansion and selection actions, 1.4.11 Non-text Contrast for the expand chevron and focus indicator, and 2.4.7 Focus Visible so the focused item is always clearly indicated.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the tree to the last focused item, or out of the tree to the next focusable element; only one tree item is in the tab sequence at a time. |
| `ArrowDown` | Moves focus to the next visible tree item in the flattened tree order. |
| `ArrowUp` | Moves focus to the previous visible tree item in the flattened tree order. |
| `ArrowRight` | On a collapsed branch item, expands it; on an already expanded branch, moves focus to its first child; on a leaf, does nothing. |
| `ArrowLeft` | On an expanded branch item, collapses it; on a leaf or already collapsed branch, moves focus to its parent item. |
| `Home` | Moves focus to the first visible item in the tree. |
| `End` | Moves focus to the last visible item in the tree. |
| `Enter` | Activates the focused item, selecting it when the tree has selection enabled. |
| `Space` | Activates the focused item, matching the Enter behavior for selection. |
| `Character keys` | Type-ahead: moves focus to the next visible item whose label begins with the typed characters. |

**ARIA**: role="treeitem" on the root slot, aria-expanded on branch items to expose open and closed state, aria-selected when the parent tree enables selection, aria-level to convey depth in the hierarchy, aria-posinset and aria-setsize to convey position within the sibling group, aria-hidden on the decorative expand/collapse chevron so it is not announced, aria-disabled when an item is presented as non-interactive through its layout

**Screen Reader**: Screen readers announce a TreeItem as a tree item, including its label, its level in the hierarchy, its position among siblings, and whether it is expanded or collapsed. For branch items, the expanded/collapsed state is read from aria-expanded so users know whether children are currently visible. When selection is enabled on the tree, the selected state is announced as part of the item. Because the tree uses a roving tabindex, screen reader virtual cursor users navigate the structure while keyboard users arrow through visible items; collapsed descendants are removed from the accessibility tree and are not announced until the branch is expanded.

## Styling

TreeItem itself renders a minimal root slot and delegates most visuals to TreeItemLayout, so customize the layout that wraps the content rather than trying to restyle the item root. Common adjustments include overriding padding with tokens.spacingHorizontalMNudge, tokens.spacingVerticalXS, and tokens.spacingHorizontalS to tune indentation, applying tokens.borderRadiusMedium for the item shape, and using tokens.colorNeutralBackground1, tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground1Pressed, and tokens.colorNeutralBackground1Selected for the default interaction states. For brand-tinted selection, switch to tokens.colorBrandBackground2 with tokens.colorNeutralForeground2BrandSelected for the label. Text color should come from tokens.colorNeutralForeground1 for the primary label and tokens.colorNeutralForeground2 for secondary or descriptive text, with the expand chevron using tokens.colorNeutralForeground2. Focus indication should use tokens.colorStrokeFocus2 with tokens.strokeWidthThick and tokens.borderRadiusMedium so the ring stays inside the item bounds. Expand and collapse affordances can animate with tokens.durationNormal and tokens.curveEasyEase. Prefer Griffel style objects and the className prop on the layout component over descendant selectors so that overrides survive styling refactors.

## Performance

TreeItem is a light wrapper, so cost is dominated by how many items exist and how often the whole tree re-renders. Keep item values and onOpenChange handlers referentially stable — recreating them inline on every render forces children to re-render and can defeat memoization on custom layouts. Collapsed branches still mount their children in a nested tree, so very large hierarchies should be expressed as a flat tree and virtualized rather than deeply nested. Avoid expensive computation directly in the render path of an item; derive labels and icons from memoized data. When a single item's open state changes, prefer controlled state that updates only the affected branch so unrelated subtrees are not invalidated, and keep context consumers minimal so expansion does not cascade re-renders through the entire tree.

## Theming & Tokens

TreeItem inherits colors, typography, spacing, and motion from the FluentProvider theme. Backgrounds across states typically resolve to tokens.colorNeutralBackground1 with tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground1Pressed, and tokens.colorNeutralBackground1Selected, while a brand-forward treatment uses tokens.colorBrandBackground2 and tokens.colorNeutralForeground2BrandSelected. Label text uses tokens.colorNeutralForeground1, secondary content uses tokens.colorNeutralForeground2, and the expand/collapse indicator uses tokens.colorNeutralForeground2. Structure and rhythm come from tokens.spacingHorizontalMNudge for indentation, tokens.spacingVerticalXS and tokens.spacingHorizontalS for padding, and tokens.borderRadiusMedium for item shape. Focus rings draw on tokens.colorStrokeFocus2 with tokens.strokeWidthThick, and expand/collapse transitions use tokens.durationNormal with tokens.curveEasyEase. Because these are theme tokens, high-contrast and dark themes are handled automatically as long as custom styles do not hardcode color literals.

## Migration Notes

In v9 the hierarchy model is explicit: TreeItem declares whether it is a leaf or a branch through the required itemType prop, whereas older implementations inferred leaf status from the presence or absence of children. Values are now first-class — pass value when you need stable identity for selection, controlled expansion, or lookups, and accept the internally inferred value otherwise. Expansion can be owned locally per item with open and onOpenChange, but note that controlling an item's open state deliberately does not cascade to its children. When migrating a flat data structure, TreeItem continues to require parentValue because there is no nesting context to infer it from, and in v9 the flat case is normally expressed with FlatTree and FlatTreeItem, which share the same item semantics while optimizing for flat rendering and virtualization.

## Edge Cases

- Setting open on a branch item only controls that item — descendants keep their own expansion state, so revealing a deep path requires controlling every branch along the way.
- In a flat tree the parent relationship cannot be inferred from markup, so any item missing parentValue will be treated as root level, breaking depth, position, and arrow-key navigation reporting.
- When value is omitted, the component infers one internally; that inferred value is not guaranteed to be meaningful to the application, so selection and controlled expansion become unreliable for that item.
- Selecting itemType incorrectly is silent — a leaf with children still renders them visually but they are not exposed as a nested group, so the accessibility tree and the visual tree diverge.
- Uncontrolled expansion is owned by the surrounding tree, so passing onOpenChange without open gives a notification only; consumers expecting to filter or veto a change must switch to the controlled pair.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
