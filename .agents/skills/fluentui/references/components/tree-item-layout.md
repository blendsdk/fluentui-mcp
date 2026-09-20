# TreeItemLayout

> **Package**: `@fluentui/react-tree` v9.16.1
> **Import**: `import { TreeItemLayout } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

TreeItemLayout is the presentational row used inside a TreeItem to give a tree node its visual structure and interaction affordances. It renders a root container plus a required main region (children passed to the component are rendered into main automatically), optional iconBefore and iconAfter icon slots, an expandIcon slot that defaults to a rotating chevron indicating expanded or collapsed state, an aside slot for non-actionable content such as badges, an actions slot for focusable controls such as buttons and menus, and a selector slot that renders a Checkbox or Radio when the surrounding Tree enables multi- or single-selection. It is designed to be used together with Tree, TreeItem, FlatTree, and FlatTreeItem, and it inherits contextual state from those parents (value, navigationMode, appearance, size, openItems, selectionMode, checkedItems) rather than owning tree state itself. Use it whenever you need a consistent, themable, accessible tree node row instead of hand-rolling your own layout markup.

**When to use**: Use TreeItemLayout as the canonical row layout for hierarchical, expandable content: file explorers, navigation sidebars, settings trees, org charts, and any nested structure rendered with Tree or FlatTree. Choose it over Nav when the structure is genuinely hierarchical and needs expand/collapse plus optional multi-selection, over List when items nest rather than form a flat sequence, and over Menu or MenuList when the content is a persistent navigable structure rather than a transient command surface. Prefer FlatTree plus FlatTreeItem plus TreeItemLayout when the tree is large enough to need virtualization, and prefer the persona-style layout variant when each node needs an avatar and secondary description text instead of simple leading and trailing icons. Because TreeItemLayout renders structure only, it must always live inside a TreeItem (or FlatTreeItem) that supplies the tree context.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `actions` | `Slot<TreeItemLayoutActionSlotProps>` | — | No | — |
| `appearance` | `'subtle' \| 'subtle-alpha' \| 'transparent'` | — | No | — |
| `appearance` | `'subtle' \| 'subtle-alpha' \| 'transparent'` | — | No | — |
| `aside` | `Slot<'div'>` | — | No | — |
| `checkedItems` | `Iterable<TreeItemValue \| [TreeItemValue, TreeSelectionValue]>` | — | No | — |
| `checkedItems` | `Iterable<TreeItemValue \| [TreeItemValue, TreeSelectionValue]>` | — | No | — |
| `defaultCheckedItems` | `TreeProps['checkedItems']` | — | No | — |
| `defaultOpenItems` | `Iterable<TreeItemValue>` | — | No | — |
| `description` | `Slot<'div'>` | — | No | — |
| `expandIcon` | `Slot<'div'>` | — | No | — |
| `iconAfter` | `Slot<'div'>` | — | No | — |
| `iconBefore` | `Slot<'div'>` | — | No | — |
| `itemType` | `TreeItemType` | — | Yes | — |
| `main` | `NonNullable<Slot<'div'>>` | — | Yes | — |
| `main` | `NonNullable<Slot<'div'>>` | — | Yes | — |
| `media` | `NonNullable<Slot<'div'>>` | — | Yes | — |
| `navigationMode` | `'tree' \| 'treegrid'` | — | No | — |
| `navigationMode` | `TreeNavigationMode` | — | No | — |
| `onOpenChange` | `(e: TreeItemOpenChangeEvent, data: TreeItemOpenChangeData) => void` | — | No | — |
| `open` | `boolean` | — | No | — |
| `openItems` | `Iterable<TreeItemValue>` | — | No | — |
| `openItems` | `Iterable<TreeItemValue>` | — | No | — |
| `parentValue` | `TreeItemValue` | — | No | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `NonNullable<Slot<'div'>>` | — | Yes | — |
| `selectionMode` | `SelectionMode_2` | — | No | — |
| `selectionMode` | `SelectionMode_2` | — | No | — |
| `selector` | `Slot<typeof Checkbox> \| Slot<typeof Radio>` | — | No | — |
| `size` | `'small' \| 'medium'` | — | No | — |
| `size` | `'small' \| 'medium'` | — | No | — |
| `value` | `TreeItemValue` | — | Yes | — |
| `value` | `TreeItemValue` | — | No | — |

### Prop Guidance

- **value**: Required stable identifier for the item. The tree uses it to key openItems, checkedItems, and parentValue, so it must be unique within the tree and must not change between renders. `item-value-1`
- **appearance**: Controls the row background treatment. Use subtle when the row sits on the default page surface, subtle-alpha when the row sits over an image or richly colored surface and needs a translucent wash, and transparent when a parent container such as a Drawer already provides the background. `subtle`
- **size**: Sets row density. Keep medium for content trees that users read, and switch to small for compact navigation trees in drawers and sidebars where many rows must fit vertically. `small`
- **navigationMode**: Inherited from the tree. Use tree for standard hierarchical navigation where arrow keys move between rows; use treegrid when rows contain their own focusable content such as a selector or action buttons, so arrow keys move focus within a row and Tab moves between rows. `treegrid`
- **root**: The required outer slot that renders the row container. Use it for className, style, and data attributes such as test hooks; avoid replacing its semantics. `{}`
- **main**: The required content slot. Children passed to the component are rendered here automatically, so you rarely need to supply it directly except to add per-item styling to the label region. `Project files`
- **iconBefore**: Renders an icon immediately before the label. Use it for semantic leading icons such as folder, document, or status glyphs; keep them decorative and let the label carry the meaning. `FolderRegular`
- **iconAfter**: Renders an icon immediately after the label. Use it for compact trailing affordances such as status dots or locked indicators. `LockClosedRegular`
- **expandIcon**: The expand and collapse affordance, which defaults to a chevron that rotates with the open state. Supply a custom icon only when the tree requires different iconography, and keep the rotation and RTL behavior intact. `ChevronRightRegular`
- **aside**: Non-actionable content shown at the trailing edge of the row, typically a badge or count. It is visible by default and shares its position with the actions slot, so the two should not be used together on the same row. `CounterBadge`
- **actions**: Focusable controls such as buttons and menus that are only visually available when the row is active, which keeps long trees visually quiet. The slot supports a visible property when actions must always show, but reserve that for the few rows where the action is essential. `visible`
- **selector**: Renders a Checkbox or Radio when the surrounding tree enables a selection mode. Let the tree drive it rather than rendering your own input, so checked state, keyboard behavior, and announcements stay consistent. `Checkbox`
- **openItems**: Controlled collection of expanded item values when the tree's expansion is managed by your application. Prefer a Set so membership checks stay constant time. `Set of item values`
- **defaultOpenItems**: Uncontrolled initial set of expanded item values, used when expansion should start expanded but then be owned by the tree. `Set of item values`
- **open**: Per-item controlled expanded state used by the tree item, useful when a single node's expansion is driven by external logic. `true`
- **onOpenChange**: Per-item callback fired when a node expands or collapses. Use it to log, lazy-load children, or sync controlled openItems state, and keep the handler stable across renders. `(event, data) => void`
- **parentValue**: Identifies the parent node for a nested item and is normally supplied by the tree structure rather than set by hand. `parent-item-value`
- **selectionMode**: Inherited from the tree and determines whether a selector renders and how activation applies selection: none, single, multiple, or checkbox-style selection. `multiselect`
- **checkedItems**: Controlled collection of checked values for checkbox selection, optionally paired with a selection value when tri-state checking is used. `Set of item values`
- **defaultCheckedItems**: Uncontrolled initial checked values for checkbox selection when the tree should own the state after first render. `Set of item values`
- **itemType**: Belongs to the persona-style layout variant, where it classifies the node as a leaf, branch, or parent so the layout can render the correct media and expansion treatment. `leaf`
- **media**: Required slot of the persona layout variant that renders an avatar or image at the leading edge of the row; use it instead of iconBefore when each node represents a person or entity. `Avatar`
- **description**: Secondary text slot of the persona layout variant that renders supporting detail beneath or beside the main content, such as a job title or email address. `email@contoso.com`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `actions` | — | No | Actionable elements are normally buttons, menus, or other focusable elements. Those elements are only visibly available if the given tree item is currently active.  `actions` and `aside` slots are positioned on the exact same spot, so they won't be visible at the same time. `aside` slot is visible by default meanwhile `actions` slot are only visible when the tree item is active.  `actions` slot supports a `visible` prop to force visibility of the actions. |
| `aside` | — | No | Aside content is normally used to render a badge or other non-actionable content |
| `expandIcon` | — | No | Expand icon slot, by default renders a chevron icon to indicate opening and closing |
| `iconAfter` | — | No | Icon slot that renders right after main content |
| `iconBefore` | — | No | Icon slot that renders right before main content |
| `main` | — | Yes | Content. Children of the root slot are automatically rendered here |
| `root` | — | Yes | — |
| `selector` | — | No | — |

## Best Practices

### Do's

- Give every item a stable, unique value so expansion and selection state can be tracked reliably through openItems, checkedItems, and parentValue.
- Pass the human-readable label as children of the component so it lands in the required main slot, and keep that label short and scannable.
- Use iconBefore for leading semantic icons (folder, document, status) and iconAfter for trailing status icons rather than embedding decorative glyphs in the label text.
- Put actionable controls such as buttons, split buttons, and menus in the actions slot so they are revealed only when the row is active and never compete visually with the label.
- Reserve the aside slot for non-actionable, informational content such as Badge, CounterBadge, or PresenceBadge that should always be visible.
- Let the default expandIcon handle the expand and collapse affordance so the built-in chevron rotation and RTL mirroring stay consistent with the rest of the tree.
- Rely on the selector slot and the parent Tree selectionMode to render checkboxes or radios, keeping selection semantics wired to the tree's own selection model.
- Use size small in dense navigation drawers and sidebars, and leave size at medium for content trees where rows are the primary reading surface.

### Don'ts

- Do not place interactive controls in the main content area; nested focusable elements there conflict with tree keyboard navigation and roving tab index behavior.
- Do not render an aside and actions slot at the same time expecting both to be visible, because they occupy the exact same position in the row.
- Do not hand-roll your own expand chevron with a custom click handler; use the expandIcon slot so pressing Enter or Space on the row keeps toggling the node correctly.
- Do not reuse the same value across two items in the same tree; expansion and selection state are keyed by value and will collide.
- Do not use TreeItemLayout outside of a TreeItem or FlatTreeItem context, since it depends on the parent tree for value, item type, navigation mode, and open change handling.
- Do not force the actions slot to be permanently visible on every row in a long list; that adds visual noise and many extra tab stops.
- Do not hard-code colors, paddings, or font sizes on the root slot; those overrides break selection, hover, focus, and high-contrast theming.
- Do not nest a second Tree or Menu inside main content to express hierarchy; use real child TreeItems instead.

## Anti-Patterns

### Embedding buttons in the label

❌ Putting a button, link, or toggle directly into the main content area introduces a second interactive element inside the tree item, which breaks roving tab index navigation and makes Enter and Space ambiguous for keyboard and screen reader users.

✅ Move every interactive control into the actions slot, which is only revealed while the row is active, and rely on Enter or Space to activate the row itself.

### Rendering aside and actions together

❌ The aside and actions slots are positioned in the exact same place, so rendering both causes them to overlap and produces an unreadable trailing edge of the row.

✅ Pick one role per row: use aside for a persistent badge or counter, or use actions for buttons and menus that appear on interaction, never both at once.

### Always-visible row actions in long trees

❌ Forcing the actions slot visible on every row clutters the tree and creates an enormous number of tab stops, and it also competes for horizontal space with long labels.

✅ Leave actions to reveal on the active state, and reserve the forced visible behavior for the small number of rows where the action is truly essential.

### Hand-rolled expand chevrons

❌ Replacing the default expand icon with a custom chevron and a click handler duplicates state that the tree already manages and frequently leaves aria-expanded out of sync with what the user sees.

✅ Use the expandIcon slot for iconography changes only, and let the tree item continue to own the toggle, the expanded state, and the announcement.

### Duplicate or unstable item values

❌ Because expansion and selection are keyed by value, duplicated or regenerated values cause items to open or check unexpectedly, or to lose state on re-render.

✅ Derive value from a stable domain identifier for every node and assert uniqueness when building the tree data.

## Accessibility

**Requirements**: The tree must satisfy WCAG 2.1.1 Keyboard (all expansion, selection, and focus movement available from the keyboard), 2.4.3 Focus Order, 2.4.7 Focus Visible (the row must show a visible focus indicator, which the component draws using the theme focus stroke), 1.3.1 Info and Relationships (nesting, level, and expanded state conveyed structurally), 1.4.3 Contrast Minimum for label and icon colors in every appearance and selection state, and 4.1.2 Name, Role, Value for the tree item itself. Each item needs an accessible name that comes from the main content; when the visible content is purely decorative or iconographic, provide an explicit aria-label. Controls placed in the actions slot must carry their own accessible names because their visible text is often icon-only. Disabled items must be removed from the interaction path rather than merely dimmed.

| Key | Action |
| --- | --- |
| `ArrowDown` | Moves focus to the next visible tree item without changing expansion or selection. |
| `ArrowUp` | Moves focus to the previous visible tree item. |
| `ArrowRight` | Expands the focused node when it is collapsed, and moves focus into its first child when it is already expanded. |
| `ArrowLeft` | Collapses the focused node when it is expanded, and moves focus to its parent when it is already collapsed. |
| `Home` | Moves focus to the first visible tree item. |
| `End` | Moves focus to the last visible tree item. |
| `Enter` | Activates the focused item, toggling expansion for expandable nodes and applying selection according to the tree selection mode. |
| `Space` | Activates the focused item in the same way as Enter, and toggles the checkbox or radio in the selector slot when the tree uses a selection mode that renders one. |
| `Character keys` | Type-ahead moves focus to the next item whose label starts with the typed characters. |
| `Tab` | Moves focus out of the tree to the next focusable element, or into an item's actions slot when the tree uses treegrid navigation mode with focusable row content. |
| `Shift+Tab` | Moves focus back to the previous focusable element outside the tree, or back out of the actions slot. |

**ARIA**: role='treeitem' on the row container, aria-expanded on expandable items to announce collapsed or expanded state, aria-selected to communicate the currently selected node in single- and multi-select trees, aria-checked when the selector slot renders a Checkbox or Radio in a multiselect tree, aria-level, aria-setsize, and aria-posinset to expose depth and position within the parent group, aria-disabled for items that are visible but not interactive, aria-label or aria-labelledby when the visible main content is insufficient as an accessible name, role='group' on the child container that wraps nested tree items, role='checkbox' or role='radio' on the element rendered by the selector slot

**Screen Reader**: Screen readers announce each row as a tree item with its name from the main content, its level in the hierarchy, its position among siblings, and whether it is expanded, collapsed, selected, or checked. Expanding an item reveals child items that are then reachable by arrow keys, and collapsing removes them from the reading order. Because aside content is non-interactive it is read as part of the row description, while controls in the actions slot are separate focusable elements that must be announced with their own names. Live changes such as multi-select toggles are announced through the state change on the checkbox or radio, so the selector slot should never be visually hidden from assistive technology.

## Styling

Style TreeItemLayout through the slots rather than by fighting the default rules. Override the root slot className to adjust row padding with tokens.spacingHorizontalS and tokens.spacingVerticalXS, corner rounding with tokens.borderRadiusMedium, and to build custom hover, selected, and focus states from tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground1Selected, tokens.colorSubtleBackgroundPressed, and tokens.colorStrokeFocus2. Match the surrounding surface by choosing the appearance value that reads correctly: appearance subtle maps to the neutral background ramp (tokens.colorNeutralBackground2 and its hover and pressed variants), appearance subtle-alpha uses the translucent subtle background ramp, and appearance transparent leaves the row background unset (tokens.colorTransparentBackground) so a parent Drawer or Card background shows through. Use appearance and size together for density: size small pairs tokens.fontSizeBase200 with tighter vertical spacing, while size medium pairs tokens.fontSizeBase300 with the standard row height. Tint labels and icons with tokens.colorNeutralForeground1 for the primary label, tokens.colorNeutralForeground2 for secondary iconography, and tokens.colorBrandForeground1 for the selected or active accent. Always style the focus indicator through the theme's focus tokens or the custom focus indicator helper so it survives in high-contrast mode, and verify that the actions slot stays legible when it appears over a selected row background.

## Performance

TreeItemLayout renders a handful of slot divs per node, so the cost per row is small but multiplies quickly in deep trees; for large datasets prefer FlatTree with FlatTreeItem and virtualization so only visible rows mount, and render each row with TreeItemLayout. Keep the openItems collection a Set so the tree can test membership in constant time on every render. Avoid creating inline slot objects, inline icon elements, or fresh arrow functions for onOpenChange on every render, because new slot identities force the row to re-render and can invalidate memoization in the parent tree. Prefer stable values for value and parentValue, memoize row content that depends on expensive data, and defer heavy work such as lazy-loading child nodes into the onOpenChange callback rather than during render.

## Theming & Tokens

TreeItemLayout is fully token-driven and re-renders when the surrounding FluentProvider theme changes. The appearance prop selects the background ramp: subtle uses tokens.colorNeutralBackground2 with hover and pressed variants such as tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed, subtle-alpha uses the translucent subtle ramp, and transparent resolves to tokens.colorTransparentBackground so the parent surface shows through. Selected rows draw from tokens.colorNeutralBackground1Selected and brand-tinted variants. Label text uses tokens.colorNeutralForeground1, supporting iconography uses tokens.colorNeutralForeground2 and tokens.colorNeutralForeground3, and disabled rows use tokens.colorNeutralForegroundDisabled. Size selections pull typography from tokens.fontSizeBase200 or tokens.fontSizeBase300 with the matching line height tokens, spacing comes from tokens.spacingHorizontalXXS through tokens.spacingHorizontalS, and rounding from tokens.borderRadiusMedium. Focus indication uses the theme focus stroke tokens, so custom root overrides should preserve the focus indicator to keep high-contrast themes readable.

## Migration Notes

In v8 the equivalent row was the tree item layout markup inside Tree/TreeItem with ITreeItemLayoutProps and props such as expandButtonAriaLabel and selectable, and selection was driven by the tree's own selection props. In v9 the layout is a standalone TreeItemLayout component whose children are automatically rendered into the required main slot, with iconBefore, iconAfter, expandIcon, aside, actions, and selector as explicit slots. Selection and expansion are now controlled through the surrounding Tree and TreeItem (selectionMode, openItems, defaultOpenItems, checkedItems, defaultCheckedItems), and the new navigationMode prop distinguishes tree and treegrid interaction. A separate composed layout handles persona-style rows with media, main, and description regions plus an itemType. When migrating, replace attribute-based configuration with slot content, move any inline buttons into the actions slot so they no longer break tree keyboard handling, and re-check that every item has a unique value because expansion and selection state are keyed by it.

## Edge Cases

- The aside and actions slots are positioned in the exact same place, so they are never visible simultaneously; choose one per row.
- The actions slot is only visibly available when the tree item is active, and it supports a visible property when a specific action must be forced into view.
- The selector slot only produces a visible checkbox or radio when the surrounding tree is configured with a selection mode; otherwise it is effectively inert.
- The value prop is required on the layout and must be unique across the tree, since expansion and selection state are keyed by it and duplicates cause state to bleed between rows.
- Customizing expandIcon replaces the default chevron, and any custom icon loses the built-in rotation and right-to-left mirroring unless you style it yourself.
- TreeItemLayout depends on TreeItem or FlatTreeItem context for navigation mode, item type, and open change handling, so rendering it outside a tree does not produce a working row.
- Long labels can overflow the row when actions appear on the active state; plan for text truncation in narrow containers such as a Drawer or sidebar.
- In navigationMode treegrid, rows behave differently from tree mode because focus can move into controls inside the row, which changes how Tab and arrow keys are expected to behave.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
