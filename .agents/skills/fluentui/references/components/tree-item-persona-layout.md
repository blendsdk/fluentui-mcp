# TreeItemPersonaLayout

> **Package**: `@fluentui/react-tree` v9.16.1
> **Import**: `import { TreeItemPersonaLayout } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

TreeItemPersonaLayout is the persona-flavored row layout used inside a TreeItem to render a tree node as a rich person entry. Instead of the flat, text-only arrangement provided by TreeItemLayout, it introduces a dedicated media slot — most often holding an Avatar — plus a main slot for the primary line of content and a description slot for secondary supporting text such as a job title, email address, or team name. Like TreeItemLayout, it also exposes structural slots for iconBefore, iconAfter, expandIcon, aside, actions, and selector, so a persona row can simultaneously show an avatar, a name, a subtitle, a presence or status indicator, inline actions, and a Checkbox or Radio selection control. The component is a presentation layer only: expansion, selection, keyboard navigation, and open/checked state are driven by the surrounding Tree and TreeItem through props such as value, open, onOpenChange, openItems, defaultOpenItems, checkedItems, defaultCheckedItems, selectionMode, and navigationMode, which are surfaced or inherited on this layout. Use it whenever a tree needs to represent people rather than plain documents or folders.

**When to use**: Use TreeItemPersonaLayout when the nodes of a Tree represent people — org charts, approval chains, assignee hierarchies, contact/team directories, or any hierarchy where each node benefits from an avatar plus a primary and secondary line of text. Use the sibling TreeItemLayout when a node is purely textual (documents, folders, settings categories), because the persona layout reserves horizontal space for the media slot and adds a second text line that is wasted on non-person content. Choose the small size for dense directory-style trees and the medium size when avatars and names are the primary focus. Prefer this layout over rendering a Persona inside the plain layout's main slot, since the dedicated media and description slots give you correct vertical alignment, spacing, and text truncation out of the box.

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

- **value**: Required identifier for the item. It is the key the surrounding Tree uses to resolve openItems, defaultOpenItems, checkedItems, and defaultCheckedItems, and it is reported back in open-change events, so it must be unique and stable across renders. `user-42`
- **appearance**: Controls the resting and hover surface of the row. Use transparent when the row sits on a colored or patterned background, subtle for standard trees that need a visible hover and selection surface, and subtle-alpha when the row overlays imagery or content that should show through. `subtle`
- **size**: Sets the row density. Use small for long directories and sidebar trees, and medium when the avatar and two-line persona content is the focus and needs more breathing room. `medium`
- **navigationMode**: Switches the interaction model between tree and treegrid. Use tree for classic hierarchical exploration and treegrid when rows behave like grid cells with columnar content or richer keyboard traversal expectations. `tree`
- **selectionMode**: Determines whether items can be selected. Use none for navigation-only trees, single when only one person can be chosen, and multiselect when several people can be picked at once; the value should match the control rendered in the selector slot. `multiselect`
- **openItems**: Controlled collection of expanded item values. Provide it, together with onOpenChange, when expansion must be synchronized with external state such as a deep link or a saved view. `['team-1', 'team-2']`
- **defaultOpenItems**: Uncontrolled initial set of expanded items. Use it when the tree manages its own expansion and you only need to seed which branches start open, for example the current user's team. `['team-1']`
- **checkedItems**: Controlled collection of checked item values, optionally paired with a selection value per item, for multi-select persona trees. Keep it in sync with onOpenChange-driven state when the Tree is controlled. `['user-42']`
- **defaultCheckedItems**: Uncontrolled initial checked state, used to pre-select people such as an existing distribution list when the tree owns the state. `['user-42', 'user-43']`
- **open**: Boolean expansion state for this specific item when you are managing a single item's disclosure directly rather than through the Tree's openItems collection. `true`
- **onOpenChange**: Callback fired when the item is expanded or collapsed, providing the event and change data. Use it to persist expansion or to keep controlled open state in sync. `(e, data) => setOpen(data.open)`
- **parentValue**: Value of the parent item, set by the Tree when the row is nested. It is used for hierarchy navigation and for collapsing an expanded item when moving focus upward, so avoid overriding it manually. `team-1`
- **itemType**: Marks whether the node is a leaf or a branch. Branch items are expandable and should include an expandIcon affordance, while leaf items render without disclosure controls. `branch`
- **root**: The outer row element that receives layout, appearance, and interaction styling. Target it when you need custom padding, border radius, or a background that follows the selected and hover tokens. `row container`
- **media**: Leading visual region unique to the persona layout. Place an Avatar, Image, or icon here; this is what visually distinguishes TreeItemPersonaLayout from the plain layout. `Avatar`
- **main**: The primary content of the row — typically the person's name and any inline badges or presence indicators that must stay adjacent to it. `Jane Cooper`
- **description**: Secondary line rendered beneath the main content for a job title, email, or department. Keep it to a single short string so the row height stays consistent across the tree. `Senior Designer`
- **iconBefore**: Small icon placed before the main content, useful for a status glyph or a type indicator that should read ahead of the name. `status icon`
- **iconAfter**: Small icon placed after the main content, such as a verified check or an external-link marker. `verified icon`
- **expandIcon**: The disclosure affordance for branch items. Customize it when the default chevron does not fit the visual language, but keep its rotation in sync with the item's open state. `chevron`
- **aside**: Trailing region for non-interactive supporting content, such as a PresenceBadge, a CounterBadge, or a timestamp that aligns to the end of the row. `PresenceBadge`
- **actions**: Trailing region for interactive controls scoped to the item, such as a Button or Menu. Keep these few and give each an accessible name, since they sit inside a treeitem. `MenuButton`
- **selector**: Renders a Checkbox or Radio as the item selector. Match it to selectionMode (Checkbox for multiselect, Radio for single) so the visual affordance matches the tree's actual behavior. `Checkbox`

## Best Practices

### Do's

- Always supply a stable, unique value on each item so that openItems, defaultOpenItems, checkedItems, defaultCheckedItems, and onOpenChange can address the correct node.
- Populate the media slot with an Avatar, Image, or similar visual so the persona nature of the row is immediately legible.
- Keep the main slot to a single, short primary identifier such as a display name, and push everything else into the description slot.
- Use the description slot for genuinely secondary text (title, email, department) and keep it to one line so rows stay scannable.
- Give the Avatar in the media slot a meaningful name, or mark purely decorative imagery as hidden, so assistive technology does not announce an unlabeled graphic.
- Match selectionMode with the control you place in the selector slot — a Checkbox for multiselect and a Radio for single selection.
- Set appearance and size consistently across all items in a tree so the hierarchy reads as one coherent surface.
- Use the expandIcon slot for custom disclosure affordances and let the Tree own the expansion behavior through openItems and onOpenChange rather than toggling open yourself.

### Don'ts

- Don't nest interactive controls that duplicate tree behavior — for example, don't place your own expand/collapse button inside main when expandIcon already covers disclosure.
- Don't overload the actions slot with many buttons; a persona row has limited width once the media, main, description, and selector slots are occupied.
- Don't rely on the description slot for information that is essential to identify the person — put the identifying text in main, since description may be truncated or visually de-emphasized.
- Don't mix TreeItemLayout and TreeItemPersonaLayout arbitrarily at the same hierarchy level, because the differing row heights and indentation make the tree look broken.
- Don't manage open or selection state manually through open and checkedItems unless the surrounding Tree is fully controlled — mixing controlled and uncontrolled state causes flicker.
- Don't put long paragraphs or multiline content in main or description; trees are scanning surfaces, not reading surfaces.
- Don't omit the value prop, as it is required and is the key used to map the item into open and checked item collections.

## Anti-Patterns

### Building an expand button inside the row

❌ Adding a custom toggle inside main duplicates the behavior the expandIcon and the Tree's open state already provide, producing two competing expand affordances and confusing keyboard users who expect Arrow Right and Arrow Left to expand and collapse.

✅ Use the expandIcon slot for the disclosure indicator and let open, onOpenChange, and openItems drive expansion; if the default glyph is unsuitable, restyle or replace it via expandIcon rather than adding a new control.

### Rendering the whole persona into the main slot

❌ Placing a Persona or a stacked name-and-title block inside main bypasses the dedicated media and description slots, causing inconsistent alignment with neighboring rows, broken truncation, and a second line that is not exposed as description text.

✅ Split the content: Avatar into media, name into main, and title or email into description so spacing, truncation, and assistive-technology announcements follow the layout's built-in behavior.

### Mixing layout components at one level

❌ Interleaving TreeItemPersonaLayout and TreeItemLayout siblings produces visibly different row heights and indentation, which makes the hierarchy look unstable and can mislead users about nesting depth.

✅ Choose one layout per level of the tree — use the persona layout for people-centric levels and the plain layout for document-centric levels, switching only when the semantic level changes.

### Managing open or checked state in two places

❌ Passing both defaultOpenItems or defaultCheckedItems and manually mutating open or checkedItems creates two sources of truth, so expansion or selection can snap back or drift out of sync with the Tree.

✅ Pick controlled or uncontrolled state: use openItems with onOpenChange for controlled trees, or defaultOpenItems and defaultCheckedItems alone for uncontrolled ones.

### Overfilling the actions slot

❌ Persona rows already consume width with media, main, description, aside, and selector; cramming several action buttons into actions crowds the name, causes wrapping, and pushes targets too close together.

✅ Reduce to the single most important action or collapse the rest into a MenuButton in the actions slot.

## Accessibility

**Requirements**: Rendered inside a Tree, each row is exposed as a treeitem within a tree (or treegrid when navigationMode is set to treegrid), so it must participate in the parent's roving tabindex and ARIA hierarchy. Provide an accessible name for the row: the text in the main slot normally supplies it, and the description slot is announced as supporting text. Expansion state, selection state, and hierarchy position must stay in sync with the surrounding Tree through open, onOpenChange, selectionMode, openItems, and checkedItems. Any Avatar in the media slot should be named or hidden, and any control in the actions or selector slot needs its own accessible name so it is distinguishable from other items in the tree.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the tree, landing on the single tabbable treeitem; Shift+Tab moves focus back out of the tree. |
| `Enter` | Activates the focused treeitem and performs the configured selection or navigation action. |
| `Space` | Selects the focused treeitem according to selectionMode, toggling the Checkbox or Radio in the selector slot for selectable trees. |
| `ArrowDown` | Moves focus to the next visible treeitem, including items revealed by expansion. |
| `ArrowUp` | Moves focus to the previous visible treeitem. |
| `ArrowRight` | Expands a collapsed branch item, or moves focus to its first child when already expanded. |
| `ArrowLeft` | Collapses an expanded branch item, or moves focus to the parent item when already collapsed or when the item is a leaf. |
| `Home` | Moves focus to the first visible treeitem in the tree. |
| `End` | Moves focus to the last visible treeitem in the tree. |
| `Alphanumeric characters` | Typeahead: moves focus to the next visible item whose accessible name starts with the typed characters. |

**ARIA**: role="treeitem" on the row, inside the parent tree or treegrid container, aria-expanded on branch items, driven by open and openItems, aria-selected when selectionMode is set to single or multiselect, aria-checked when checkedItems are used with a selector, aria-level to communicate depth in the hierarchy, aria-setsize and aria-posinset to describe position among siblings, aria-disabled for non-interactive items, aria-label or aria-labelledby when the main slot text alone is not a sufficient accessible name, aria-describedby for secondary text rendered in the description slot

**Screen Reader**: Screen readers announce the row as a treeitem together with its level, position among siblings, expanded or collapsed state, and selection or checked state, followed by the primary text from the main slot and the supporting text from the description slot. Because the layout keeps the interactive control (Checkbox or Radio) in the selector slot separate from the row itself, the state change is announced on the treeitem rather than as an isolated checkbox when the tree manages selection. Visual elements such as the expandIcon and any decorative Avatar should be hidden from the accessibility tree so they do not interrupt the announcement.

## Styling

Style rows through the layout's slots rather than wrapping the component, since the root slot is the element that receives hover, focus, selected, and size styling. Hover and rest surfaces from the appearance prop map onto tokens such as tokens.colorSubtleBackgroundHover for subtle, tokens.colorTransparentBackgroundHover for transparent, and the subtle-alpha variants built from tokens.colorNeutralBackgroundAlpha and tokens.colorNeutralBackgroundAlpha2. Selected rows typically use tokens.colorNeutralBackground1Selected with tokens.colorNeutralForeground1Selected, while brand-tinted selections use tokens.colorBrandBackground2 and tokens.colorBrandForeground1. Use tokens.spacingHorizontalXS and tokens.spacingVerticalXS for gaps between media, main, description, aside, and actions, and tokens.spacingHorizontalXXS when a compact, small-size row needs tighter inner spacing. Secondary text in the description slot should use tokens.colorNeutralForeground2 (or tokens.colorNeutralForeground3 for the most de-emphasized treatment) with tokens.fontSizeBase200, while main content uses tokens.fontSizeBase300 and tokens.colorNeutralForeground1. Round the row with tokens.borderRadiusMedium, and use tokens.colorNeutralStroke1 or tokens.colorCompoundBrandStroke if you add focus or selection outlines. For the small size, reduce the Avatar footprint via tokens.spacingVerticalMNudge and the font scale via tokens.fontSizeBase200 so the row height matches plain tree items.

## Performance

Each row is a composition of slots, so keep the media, main, and description slots cheap: avoid creating new Avatar or icon elements inline on every render, and memoize heavy trailing content in the actions slot. Prefer a handful of Contexts-free renders by keeping open and checked state at the Tree level rather than lifting per-item state into each row, which prevents large subtrees from re-rendering on a single expansion. Virtualize or lazily render very large persona directories, since every expanded item mounts a full slot tree. Also avoid re-creating onOpenChange inline in a way that forces child updates when the parent re-renders for unrelated reasons.

## Theming & Tokens

The layout consumes design tokens from FluentProvider rather than hard-coded values, so switching between light, dark, and high-contrast themes is automatic. Hover and resting surfaces follow tokens.colorSubtleBackgroundHover and tokens.colorTransparentBackgroundHover; selected rows typically use tokens.colorNeutralBackground1Selected and tokens.colorNeutralForeground1Selected, with brand selection expressed through tokens.colorBrandBackground2 and tokens.colorBrandForeground1. Text uses tokens.colorNeutralForeground1 for main content and tokens.colorNeutralForeground2 or tokens.colorNeutralForeground3 for description. Spacing and shape come from tokens.spacingHorizontalXS, tokens.spacingVerticalXS, tokens.spacingHorizontalXXS, and tokens.borderRadiusMedium, while size-dependent typography uses tokens.fontSizeBase300 for medium and tokens.fontSizeBase200 for small. Focus indicators derive from tokens.colorStrokeFocus2 and tokens.colorCompoundBrandStroke, and disabled rows reduce contrast via tokens.colorNeutralForegroundDisabled.

## Migration Notes

This component replaces the v7/v8 pattern of rendering a Persona inside a TreeItem through persona props on the item itself. In v9 there is no implicit persona rendering: you compose an Avatar (or another element) into the media slot and the two lines of text into the main and description slots, which makes the visual structure explicit and styleable. Expansion and selection are likewise no longer configured as item-level booleans but are driven by the parent Tree through value, openItems, defaultOpenItems, checkedItems, defaultCheckedItems, selectionMode, and the onOpenChange callback. Appearance and size are now expressed with the appearance ('subtle', 'subtle-alpha', 'transparent') and size ('small', 'medium') props instead of theme-driven variants, and the row styling is delivered through Griffel tokens rather than SCSS class overrides.

## Edge Cases

- The layout does not own tree state: value is required, but open, openItems, checkedItems, and selectionMode only take effect when the surrounding Tree or TreeItem supplies context, so a row rendered outside a Tree will not expand or select.
- Long names in main and long titles in description are truncated rather than wrapped, so provide a Tooltip or title text when the full string is important.
- Persona rows are taller than plain rows, especially with a description line, so mixing both layouts in one tree creates uneven vertical rhythm.
- An Avatar in media without a name or explicit hiding can be announced as an unlabeled graphic, producing noise on every row in a large directory.
- Interactive elements in actions sit inside a treeitem; without distinct accessible names they are announced ambiguously and can conflict with the row's own keyboard handling.
- Setting selectionMode without rendering a matching selector (Checkbox for multiselect, Radio for single) leaves users without a visual cue that items are selectable.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
