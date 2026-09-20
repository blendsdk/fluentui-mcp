# FlatTree

> **Package**: `@fluentui/react-tree` v9.16.1
> **Import**: `import { FlatTree } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

FlatTree is a data-display component that renders a hierarchical, keyboard-navigable tree structure from a flat list of items rather than from recursively nested children. It supplies tree-level configuration — navigation mode, item appearance, item size, and the controlled open/selection/checked state — to the FlatTreeItem descendants rendered inside it. Because it is flat, the component is well suited to large, dynamic, or virtualized datasets where recursion through nested Tree components would be expensive or where data already arrives as a flat, ordered collection. FlatTree implements the ARIA tree pattern, with the container exposing the tree role and each item exposing treeitem semantics including level, position, expansion, and selection state. Selection can be disabled entirely, limited to a single item (rendered with radio-button affordances), or extended to multiple items (rendered with checkbox affordances).

**When to use**: Use FlatTree when your hierarchy is expressed as a flat, ordered sequence of items and you want Fluent's tree semantics, roving keyboard navigation, and selection handling without authoring nested structures. Prefer it over the nested Tree component when the dataset is large, virtualized, lazily loaded, or frequently reordered, since a flat list avoids deep recursive rendering and makes index math straightforward. Choose FlatTree when you need multi-select or single-select semantics with explicit control over which items are open and which are checked; choose a plain List or Nav when the content is not hierarchical or when the relationship between entries is navigational rather than structural (for example, app-level destinations). Use the treegrid navigation mode only when items expose inline actions that users must reach with the keyboard; otherwise keep the default tree navigation mode.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `"subtle" \| "subtle-alpha" \| "transparent" \| undefined` | `'subtle'` | No | A tree item can have various appearances: - 'subtle' (default): The default tree item styles. - 'subtle-alpha': Minimizes emphasis on hovered or focused states. - 'transparent': Removes background color. |
| `checkedItems` | `Iterable<TreeItemValue \| [TreeItemValue, TreeSelectionValue]> \| undefined` | — | No | This refers to a list of ids of checked tree items, or a list of tuples of ids and checked state. Controls the state of the checked tree items. These property is ignored for subtrees. |
| `navigationMode` | `"tree" \| "treegrid" \| undefined` | `'tree'` | No | Indicates how navigation between a treeitem and its actions work - 'tree' (default): The default navigation, pressing right arrow key navigates inward the first inner children of a branch treeitem - 'treegrid': Pressing right arrow key navigate towards the actions of a treeitem |
| `openItems` | `Iterable<TreeItemValue> \| undefined` | — | No | This refers to a list of ids of opened tree items. Controls the state of the open tree items. These property is ignored for subtrees. |
| `selectionMode` | `SelectionMode \| undefined` | `undefined` | No | This refers to the selection mode of the tree. - undefined: No selection can be done. - 'single': Only one tree item can be selected, radio buttons are rendered. - 'multiselect': Multiple tree items can be selected, checkboxes are rendered. |
| `size` | `"small" \| "medium" \| undefined` | `'medium'` | No | Size of the tree item. |

### Prop Guidance

- **navigationMode**: Selects how the arrow keys behave inside the tree. Keep the default 'tree' when right arrow should open a branch and move focus into its first child. Switch to 'treegrid' only when items contain their own focusable actions, because in that mode right arrow moves focus toward the item's actions instead of into the children. `treegrid`
- **appearance**: Controls the visual weight inherited by the tree items. Use 'subtle' (the default) for standard tree surfaces, 'subtle-alpha' when the tree sits on a busy or branded background and hover/focus should be less emphatic, and 'transparent' when the tree should be drawn directly on its parent surface with no background of its own. `subtle-alpha`
- **size**: Sets the density of the tree items. Keep 'medium' for primary navigation and content hierarchies, and use 'small' for dense panels, sidebars, or nested configurations where vertical space is limited. `small`
- **openItems**: A controlled iterable of the ids of the items whose branches are expanded. Supply a new reference (for example a new set) whenever the expansion state changes, and update it from expansion change callbacks so controlled state stays authoritative. This prop is ignored on subtrees, so it belongs on the outermost tree. `new Set(['item-1', 'item-1-2'])`
- **selectionMode**: Enables selection and determines its cardinality. Leave it undefined for read-only hierarchies, set it to 'single' when exactly one item may be active (radio-button semantics are rendered), or set it to 'multiselect' to allow several items (checkbox semantics are rendered). `multiselect`
- **checkedItems**: A controlled iterable of ids of checked items, or of id/checked-state tuples when you need to express an indeterminate or explicit checked value. Use it with selectionMode 'multiselect' and keep the set in sync with the checkboxes that are rendered. Like openItems, it is ignored on subtrees. `[['item-1', true], ['item-2', false]]`

## Best Practices

### Do's

- Drive openItems, checkedItems, and selection state from component state or a store and update them from the tree's change callbacks so the UI stays in sync with the data model.
- Set selectionMode explicitly — undefined (the default) means no item can be selected at all — and pick single when only one branch or leaf may be active and multiselect when users need to batch-operate across the hierarchy.
- Choose navigationMode deliberately: keep tree so the right arrow key opens the first inner child of a branch, and switch to treegrid only when items contain real focusable actions that users should reach with the arrow keys.
- Set appearance and size on FlatTree so all descendant items inherit consistent styling, rather than trying to give each region of the tree a different visual weight.
- Keep openItems and checkedItems as stable references (memoized sets or arrays) so descendant items do not re-render on every parent render.
- Model the hierarchy explicitly in your data (levels, parents, order) before rendering, because FlatTree relies on that ordering to compute the correct tree semantics for each item.
- Provide a clear label for the tree region (for example by labelling the tree container or by preceding it with a visible heading) so assistive-technology users understand what the hierarchy represents.

### Don'ts

- Do not expect FlatTree to render a visual container or chrome of its own — it is a structural and behavioral wrapper, so do not pass styling props expecting a bordered or padded surface.
- Do not rely on openItems or checkedItems being honored inside a subtree: both are documented as ignored for subtrees, so state belongs on the outermost tree.
- Do not mix nested recursive tree structures inside a FlatTree and assume keyboard navigation will traverse them correctly; keep the item list flat.
- Do not treat selectionMode as purely visual — single renders radio buttons and multiselect renders checkboxes, so changing the mode changes the interaction model users see.
- Do not mutate the iterable you pass to openItems or checkedItems in place; create a new set or array so React can detect the change.
- Do not leave selectionMode undefined and then wonder why clicking items does nothing; enable the mode you actually need.
- Do not override item visuals with ad-hoc descendant selectors when appearance already offers subtle, subtle-alpha, and transparent variants.

## Anti-Patterns

### Reading expansion or checked state from the DOM

❌ Because openItems and checkedItems are controlled, the rendered tree is only a projection of the iterables you pass in. Applications that inspect item elements to decide what is open or checked end up with two competing sources of truth and drift out of sync after the first interaction.

✅ Keep the authoritative set in component state or a store, pass it to openItems or checkedItems, and update it from the tree's change callbacks so the rendered state always derives from your data.

### Setting state on nested FlatTree subtrees

❌ openItems and checkedItems are explicitly ignored for subtrees, so an inner FlatTree configured with its own state will appear broken or duplicated even though the code looks correct.

✅ Render a single FlatTree at the top of the hierarchy, keep all openItems and checkedItems state there, and let the items below express the structure.

### Expecting selection without enabling it

❌ selectionMode defaults to undefined, which means no selection interaction is rendered at all. Teams that add selection callbacks but forget the mode see a tree that looks interactive but never selects anything.

✅ Set selectionMode to 'single' or 'multiselect' explicitly and mirror the rendered radio-button or checkbox affordances in your state model.

### Using treegrid mode on plain items

❌ navigationMode 'treegrid' redirects the right arrow key from opening a branch to moving toward an item's actions. If items have no actions, keyboard users lose the primary way to drill into a branch.

✅ Keep the default 'tree' navigation mode for pure hierarchies that have no per-item actions, and reserve 'treegrid' for trees whose items genuinely contain focusable actions.

### Per-region appearance and size overrides

❌ appearance and size are configured on FlatTree and inherited by its items, so layering inconsistent per-item styling produces a tree with mismatched density and hover treatments.

✅ Pick one appearance and size for the whole tree, and use the built-in subtle, subtle-alpha, and transparent variants plus the small and medium sizes rather than bespoke CSS.

## Accessibility

**Requirements**: FlatTree implements the WAI-ARIA tree pattern and must be given an accessible name, either through a visible heading that labels the region or an aria-label / aria-labelledby on the tree. Every item must expose meaningful text content so its accessible name is not empty. Selection state (aria-selected for single selection, aria-checked for multiselect) must stay in sync with the controlled selection props, and expanded branches must reflect their state through aria-expanded. Focus indicators must remain visible and must meet WCAG contrast requirements; do not remove the focus outline when restyling items. Color alone must not be the only signal of selection or focus.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into and out of the tree as a single tab stop; the previously focused item regains focus. |
| `ArrowDown` | Moves focus to the next visible tree item. |
| `ArrowUp` | Moves focus to the previous visible tree item. |
| `ArrowRight` | In tree navigation mode, expands a collapsed branch and moves focus into its first inner child; in treegrid navigation mode, moves focus toward the item's actions instead. |
| `ArrowLeft` | Collapses an expanded branch, or moves focus to the parent item when the branch is already collapsed or the item is a leaf. |
| `Home` | Moves focus to the first item in the tree. |
| `End` | Moves focus to the last visible item in the tree. |
| `Enter` | Activates the focused item (for example toggles selection or triggers the item's primary action). |
| `Space` | Toggles selection or checked state of the focused item when selectionMode is single or multiselect. |
| `Asterisk (*)` | Expands all sibling branches at the focused item's level in tree navigation mode. |
| `Printable characters` | Type-ahead: moves focus to the next item whose label begins with the typed characters. |

**ARIA**: role="tree" on the FlatTree container, role="treeitem" on each rendered item, aria-expanded on branch items to communicate open state, aria-selected on items when selectionMode is single, aria-checked on items when selectionMode is multiselect, aria-level to convey depth in the flat structure, aria-setsize and aria-posinset to convey position among siblings, aria-disabled on items that cannot be interacted with, aria-label or aria-labelledby on the tree container to provide an accessible name

**Screen Reader**: Screen readers announce the tree as a single composite widget and treat items as treeitem descendants rather than as individual tab stops. When focus lands on an item, the reader announces its label together with its level, whether it is expanded or collapsed, its position among siblings, and its selected or checked state. Because the items are flat in the DOM, the accessible name computation and level/position attributes are what create the perceived hierarchy, so those attributes must be accurate. Activating an item announces the resulting state change (expanded, collapsed, selected, or checked), which is why openItems, checkedItems, and selectionMode must always reflect the rendered truth.

## Styling

FlatTree itself is a structural wrapper, so most visual customization happens on the items it configures. Use the appearance prop rather than custom CSS: 'subtle' builds on tokens.colorNeutralBackground1 with tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed for interaction, 'subtle-alpha' leans on tokens.colorSubtleBackgroundHover and tokens.colorSubtleBackgroundPressed so hover and focus are less emphatic, and 'transparent' relies on tokens.colorTransparentBackground and tokens.colorTransparentBackgroundHover so the tree sits directly on its parent surface. Selection styling is driven by tokens.colorNeutralBackground1Selected and the brand-tinted tokens.colorBrandBackground2 and tokens.colorBrandForeground2 for the selected surface and text. The size prop switches the item typography between tokens.fontSizeBase300 with tokens.lineHeightBase300 and the smaller tokens.fontSizeBase200 with tokens.lineHeightBase200, and also changes indentation and icon sizing through tokens.spacingHorizontalS and tokens.spacingHorizontalXXS. Expand/collapse chevrons and other icons inherit tokens.colorNeutralForeground2 and tokens.colorNeutralForeground2Hover, while primary text uses tokens.colorNeutralForeground1. Focus rings rely on tokens.colorStrokeFocus2 with the standard stroke widths; if you add custom item content, reuse tokens.borderRadiusMedium and the spacing tokens so items stay aligned with the rest of Fluent.

## Performance

FlatTree is designed to avoid the deep recursive rendering that nested tree structures require, which makes it the better choice for large hierarchies. Because openItems and checkedItems are iterables compared by reference, passing a freshly constructed array or set on every render forces descendant items to re-render even when nothing changed; memoize those values. Rendering thousands of items at once is still expensive in the browser, so for very large datasets pair FlatTree with virtualization or render only the currently visible slice of the flat list. Keep item content light, avoid inline function props that change identity every render, and prefer stable item keys so React can reconcile reordering cheaply. Deeply nested expansion increases the number of visible items, so consider lazily loading children when the hierarchy is fetched from a server.

## Theming & Tokens

FlatTree responds to the active theme through the Griffel tokens used by its items. Backgrounds and interaction states resolve to tokens.colorNeutralBackground1, tokens.colorNeutralBackground1Hover, and tokens.colorNeutralBackground1Pressed for the default subtle appearance, tokens.colorSubtleBackgroundHover and tokens.colorSubtleBackgroundPressed for subtle-alpha, and tokens.colorTransparentBackground with tokens.colorTransparentBackgroundHover for transparent. Selection uses tokens.colorNeutralBackground1Selected with brand emphasis from tokens.colorBrandBackground2 and tokens.colorBrandForeground2. Text colors come from tokens.colorNeutralForeground1 for labels and tokens.colorNeutralForeground2 for secondary content such as expand icons. Density is themed through tokens.fontSizeBase300 and tokens.lineHeightBase300 for medium versus tokens.fontSizeBase200 and tokens.lineHeightBase200 for small, alongside spacing tokens such as tokens.spacingHorizontalS and tokens.spacingHorizontalXXS. Focus indication uses tokens.colorStrokeFocus2, and corners follow tokens.borderRadiusMedium, so overriding any of these tokens at the FluentProvider level restyles every tree in the app consistently across light, dark, and high-contrast themes.

## Migration Notes

FlatTree is the v9 replacement for the v8 hierarchical Tree, and it deliberately inverts the data model: instead of nesting child items recursively, you render one flat sequence of items and let FlatTree compute hierarchy, position, and expansion semantics. State that v8 managed internally and imperatively — expanded nodes and selected or checked nodes — is now controlled through the openItems, checkedItems, and selectionMode props, so migrating code must lift that state into the application and update it from change callbacks. Because openItems and checkedItems are ignored for subtrees, migrated trees should keep their state on the outermost FlatTree rather than on nested instances, and visual props such as appearance and size should be set at the tree level so all items inherit them.

## Edge Cases

- openItems and checkedItems are ignored on subtrees, so a FlatTree rendered inside a FlatTreeItem will not manage its own expansion or check state.
- selectionMode defaults to undefined, meaning selection is completely disabled until you opt in; there is no implicit single-selection behavior.
- single selection renders radio-button affordances and multiselect renders checkboxes, so switching modes mid-session changes both the semantics and the visuals users see.
- In treegrid navigation mode the right arrow key no longer descends into children, so branches whose items have no actions become harder to expand with the keyboard.
- Controlled iterables that are not updated from change callbacks produce a tree that visually snaps back to its previous state after each interaction.
- Very deep hierarchies can make indentation consume most of the horizontal space at small sizes, so cap nesting depth or provide horizontal scrolling for the tree region.
- Type-ahead navigation depends on each item having a readable text label; icon-only or unlabeled items become unreachable by typing.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
