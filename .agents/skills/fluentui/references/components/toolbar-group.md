# ToolbarGroup

> **Package**: `@fluentui/react-toolbar` v9.8.1
> **Import**: `import { ToolbarGroup } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

ToolbarGroup is a layout and state container inside a Toolbar that visually and semantically clusters related toolbar items — for example a set of formatting buttons kept apart from a set of navigation buttons. It renders a single div as its root slot, applies a shared appearance (primary, subtle, or transparent) and size (small, medium, or large) to every item inside it, and can be flipped to a column layout with the vertical prop. In addition to visual grouping, ToolbarGroup can own selection state: when it receives checkedValues or defaultCheckedValues plus an onCheckedValueChange handler, it acts as a scoped toolbar whose ToolbarToggleButton and ToolbarRadioButton children declare a required name and value and report checked state back to the group. Groups participate in the parent Toolbar's roving-focus keyboard model, so arrow-key navigation flows through the items of each group in order.

**When to use**: Use ToolbarGroup whenever a toolbar contains more than one conceptual cluster of actions and the separation matters for either comprehension or keyboard behavior — for instance grouping text-formatting actions separately from alignment actions, or separating destructive actions from primary ones. Use it when you need a subset of items to have a different appearance or size than the surrounding toolbar, since appearance and size set on a group override the values inherited from the Toolbar. Use it also when you need independent selection state for a subset of items (for example a radio-style group of view switchers alongside unrelated command buttons) by supplying checkedValues, defaultCheckedValues, and onCheckedValueChange. Do not reach for ToolbarGroup when the toolbar has only a few homogeneous items with no logical seams; a flat Toolbar with ToolbarDivider separators is simpler and keeps focus order obvious.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `'primary' \| 'subtle' \| 'transparent'` | — | No | — |
| `appearance` | `'primary' \| 'subtle' \| 'transparent'` | — | No | — |
| `appearance` | `'primary' \| 'subtle' \| 'transparent'` | — | No | — |
| `checkedValues` | `Record<string, string[]>` | — | No | — |
| `defaultCheckedValues` | `Record<string, string[]>` | — | No | — |
| `name` | `string` | — | Yes | — |
| `name` | `string` | — | Yes | — |
| `onCheckedValueChange` | `(e: ToolbarCheckedValueChangeEvent, data: ToolbarCheckedValueChangeData) => void` | — | No | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `size` | `'small' \| 'medium' \| 'large'` | — | No | — |
| `value` | `string` | — | Yes | — |
| `value` | `string` | — | Yes | — |
| `vertical` | `boolean` | — | No | — |
| `vertical` | `boolean` | — | No | — |
| `vertical` | `boolean` | — | No | — |

### Prop Guidance

- **appearance**: Controls the visual weight of every control in this group. Use primary for the single most important action cluster, subtle for the default toolbar treatment, and transparent when the group sits on a colored or image background. Set it on the group when only that cluster should differ from the parent Toolbar. `primary`
- **vertical**: Renders the group as a column and switches the group's arrow-key navigation to the vertical axis. Use it for side rails or for flyout toolbars that stack controls; make sure the arrow-key direction matches what users see. `true`
- **size**: Sets the control size for children of this group: small, medium, or large. Use the same size across the toolbar unless a specific cluster genuinely needs denser or larger targets, such as a large primary action among medium secondary ones. `small`
- **checkedValues**: Controlled selection state for the group, keyed by the name values declared on the child items, with each entry holding the array of currently selected value strings. Provide this when the selection must live in application state, and always pair it with onCheckedValueChange. `{ alignment: ['left'] }`
- **defaultCheckedValues**: Uncontrolled initial selection for the group, using the same name-to-values shape. Use it when the group can own its own selection state and no external synchronization is needed; do not combine it with checkedValues. `{ alignment: ['center'] }`
- **onCheckedValueChange**: Callback fired when a child item inside the group toggles or selects a value. Use it to update the state backing checkedValues; keep the handler stable with a memoized callback because the group provides it to descendants through context. `(event, data) => setSelection(previous => ({ ...previous, [data.name]: data.checkedItems }))`
- **name**: Required on selectable children of a stateful group; identifies the selection category that the item belongs to, and becomes the key in checkedValues and defaultCheckedValues. Give every item of one logical selection set the same name and use distinct names for unrelated sets. `fontStyle`
- **value**: Required on selectable children of a stateful group; identifies the specific option within its name category and appears in the checkedItems array reported by onCheckedValueChange. Values must be unique within a name. `bold`
- **root**: The div slot that renders the group container. Use it to attach refs, ids, extra className values, or the group's accessible label via aria-label or aria-labelledby; avoid replacing it with non-div content that would break toolbar layout expectations. `root={{ className: styles.compactGroup, 'aria-label': 'Text formatting' }}`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Give each group a clear purpose so its items read as one cluster (for example 'text formatting' versus 'list formatting') and keep related actions adjacent.
- Set appearance and size on the group when only that cluster should differ from the rest of the toolbar, rather than styling each child button individually.
- Use defaultCheckedValues for uncontrolled selection within a group and checkedValues plus onCheckedValueChange when the selection must be reflected in application state.
- Ensure every selectable child inside a stateful group declares both the required name and value props so the group can identify which item reported a change.
- Use the vertical prop together with vertical orientation when a group is laid out as a column, so arrow-key direction matches the visual layout.
- Keep group item ordering stable across renders so roving focus and Home/End behavior remain predictable for keyboard users.
- Wrap many-item groups in OverflowItem-aware structures when the toolbar can be narrow, so items collapse gracefully instead of wrapping unpredictably.

### Don'ts

- Don't nest arbitrary non-toolbar markup (paragraphs, forms, large panels) inside a ToolbarGroup; it is intended for toolbar items and its focus management assumes focusable toolbar children.
- Don't mix controlled checkedValues with defaultCheckedValues on the same group — pick one selection model to avoid contradictory state.
- Don't reuse the same name value for items in two different groups that both own selection state, or a single checked-value change can be ambiguous.
- Don't use ToolbarGroup only to add padding or margin; adjust the parent Toolbar's styles or the group's className instead of adding structural noise.
- Don't place a vertical group inside a horizontal toolbar without also confirming the toolbar's orientation handling, or arrow keys will move focus in the wrong direction relative to what users see.
- Don't mark more than one action in a group as primary appearance; primary should signal the single most important action in that cluster.
- Don't rely on the group to label itself visually — an unlabeled cluster of icons gives screen reader users no context about what the items do.

## Anti-Patterns

### Controlled and uncontrolled selection on the same group

❌ Supplying both checkedValues and defaultCheckedValues, or supplying checkedValues without onCheckedValueChange, leaves the group in an ambiguous state where user interaction either does nothing or is immediately overwritten on the next render.

✅ Choose one model: use defaultCheckedValues for self-managed selection, or checkedValues plus onCheckedValueChange when the parent owns the state. Never set both on the same group.

### Group used as a generic layout wrapper

❌ Dropping arbitrary markup or non-toolbar content into a ToolbarGroup breaks the assumptions of the toolbar's roving focus and produces a group whose contents screen readers cannot interpret as a set of commands.

✅ Keep group children to toolbar controls such as ToolbarButton, ToolbarToggleButton, ToolbarRadioButton, ToolbarDivider, and overflow-aware wrappers, and use layout components outside the toolbar for general page structure.

### Unlabeled clusters of icon-only items

❌ A ToolbarGroup without an accessible name is announced as an anonymous group, so screen reader users hear a sequence of buttons with no indication of how they relate or what category they belong to.

✅ Always provide aria-label or aria-labelledby on the group root describing the cluster, and give each icon-only child its own accessible name.

### Orientation mismatch between visual layout and arrow keys

❌ Rendering a group as a column without the vertical prop, or using vertical inside a toolbar that expects horizontal navigation, makes arrow keys move focus in a direction that does not match the visual layout.

✅ Set vertical on the group whenever the items are stacked, and keep the group's orientation consistent with the containing toolbar so that arrow-key movement follows the on-screen arrangement.

### Duplicate selection names across groups

❌ When two groups both own selection state and their items share the same name values, a change reported by onCheckedValueChange cannot be attributed to the intended cluster and selections appear to bleed between groups.

✅ Namespace the name prop per group — for example alignment versus listStyle — so each selection set is unambiguous, and keep the handler logic keyed on those names.

## Accessibility

**Requirements**: ToolbarGroup is a semantic grouping container, so it must carry an accessible name describing the cluster; supply aria-label or aria-labelledby on the group root. All interactive children must satisfy their own WCAG requirements: ToolbarButton and ToolbarToggleButton need accessible names (visible text or aria-label), state must be conveyed programmatically (aria-pressed for toggle buttons, aria-checked with radio semantics for ToolbarRadioButton), and color contrast for the chosen appearance must meet at least 4.5:1 for text and 3:1 for focus indicators and boundaries. The group must never be the only thing conveying state; the individual controls must expose disabled state via aria-disabled rather than removing them from the tab order mid-interaction. Focus indicators must remain visible against the group's background for all three appearance values.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into or out of the toolbar; the group exposes a single tab stop and the parent Toolbar restores focus to the last focused item in that group. |
| `ArrowRight` | Moves focus to the next item within a horizontal group. |
| `ArrowLeft` | Moves focus to the previous item within a horizontal group. |
| `ArrowDown` | Moves focus to the next item when the group is rendered with the vertical prop. |
| `ArrowUp` | Moves focus to the previous item when the group is rendered with the vertical prop. |
| `Home` | Moves focus to the first item in the group. |
| `End` | Moves focus to the last item in the group. |
| `Enter` | Activates the focused item, or toggles/selects it when the group owns checkedValues. |
| `Space` | Activates the focused item, or toggles/selects it when the group owns checkedValues. |
| `Escape` | Closes a menu or popover opened from an item inside the group and returns focus to that item. |

**ARIA**: role, aria-label, aria-labelledby, aria-orientation, aria-disabled, aria-pressed, aria-checked, aria-haspopup, aria-expanded

**Screen Reader**: Screen readers announce the group root as a named group, reading its accessible label before the contained items, which gives users context such as 'text formatting, group' followed by the individual controls. Because the Toolbar implements roving tabindex, only one item in the toolbar is in the tab sequence at a time; screen readers announce each item as focus moves with the arrow keys, and the item's role, name, and state (pressed, checked, or disabled) are read together. Items that open menus announce a popup and its expanded state. When selection state is managed through checkedValues, the state change caused by activating a toggle or radio button is announced because the underlying control updates aria-pressed or aria-checked.

## Styling

ToolbarGroup applies its own container styles through Griffel and exposes a className on its root slot, so prefer overriding spacing and background there rather than restyling each child. The group's internal item gap and padding derive from spacing tokens such as tokens.spacingHorizontalXS, tokens.spacingHorizontalS, tokens.spacingHorizontalM, tokens.spacingVerticalXS, and tokens.spacingVerticalS; size controls which of these are used for children. Border radius and background follow tokens.borderRadiusMedium, tokens.colorNeutralBackground1, tokens.colorNeutralBackground1Hover, and tokens.colorNeutralStroke1 for subtle appearance, tokens.colorBrandBackground and tokens.colorNeutralForegroundOnBrand for primary, and tokens.colorTransparentBackground when appearance is transparent. Focus rings come from tokens.colorStrokeFocus2 (with tokens.colorStrokeFocus1 as the inner ring in high-contrast scenarios). If you need a visual separator between groups, insert a ToolbarDivider rather than adding borders to the group. Keep custom styles inside a child selector or a wrapper so that overriding one group does not bleed into sibling groups.

## Performance

ToolbarGroup is a lightweight container that renders exactly one div and provides its appearance, size, and selection configuration to descendants through context, so adding groups does not add meaningful DOM weight. The cost to watch is re-rendering: because the group supplies values through a provider, changing appearance, size, or checkedValues re-renders the group's children, so memoize onCheckedValueChange and avoid constructing new checkedValues objects or arrays on every render. Items inside a group re-render individually when their own state changes, which keeps updates scoped, but a frequently changing checkedValues record can still cascade through a dense toolbar; keep selection state as shallow and stable as practical. For toolbars with many items, wrap children in overflow-aware wrappers so that resizing does not force repeated layout work across the full item list.

## Theming & Tokens

ToolbarGroup reads its container visuals from theme tokens, so switching FluentProvider themes restyles groups automatically. Subtle groups draw from tokens.colorNeutralBackground1 with hover states in tokens.colorNeutralBackground1Hover and borders from tokens.colorNeutralStroke1; primary groups use tokens.colorBrandBackground with foreground tokens.colorNeutralForegroundOnBrand and hover tokens.colorBrandBackgroundHover; transparent groups rely on tokens.colorTransparentBackground so the surrounding surface shows through. Sizing follows spacing tokens such as tokens.spacingHorizontalXS, tokens.spacingHorizontalS, tokens.spacingHorizontalM, tokens.spacingVerticalXS, and tokens.spacingVerticalS, plus borderRadius tokens like tokens.borderRadiusSmall and tokens.borderRadiusMedium. Focus rings use tokens.colorStrokeFocus1 and tokens.colorStrokeFocus2, and disabled children fall back to tokens.colorNeutralForegroundDisabled. Because appearance and size propagate to children, restyling a group through tokens changes every button in the cluster consistently.

## Migration Notes

ToolbarGroup has no direct equivalent in Fluent UI v8, where toolbars were typically built from CommandBar with its own internal grouping and item-rendering callbacks. When migrating, replace CommandBar item renderers with a Toolbar containing one ToolbarGroup per logical cluster of ToolbarButton, ToolbarToggleButton, or ToolbarRadioButton children. Selection behavior that CommandBar managed internally through its item definitions is now explicit: set name and value on each selectable child and supply checkedValues or defaultCheckedValues plus onCheckedValueChange on the group. Appearance and size replace v8 style overrides, and command bar overflow is replaced by wrapping items in OverflowItem within the appropriate group.

## Edge Cases

- A ToolbarGroup can itself behave as a toolbar when it owns checkedValues or defaultCheckedValues, which means selection-scoped behavior can exist inside a larger toolbar; ensure distinct name values so the two levels of state do not collide.
- The vertical prop changes both layout and keyboard direction, so a vertical group nested inside a horizontal toolbar moves focus along the vertical axis for its own items while the surrounding toolbar continues horizontally.
- appearance and size set on a group override the values inherited from the parent Toolbar for that cluster only, which is useful for a single large primary action but can look inconsistent if applied arbitrarily.
- Selectable children require both name and value; omitting either causes the group to be unable to attribute the change, so selection appears broken rather than throwing an obvious error.
- Groups do not render their own separators — spacing alone may be insufficient to distinguish adjacent clusters in dense layouts, so add a ToolbarDivider between groups when visual separation matters.
- An empty group still renders its root div and remains in the toolbar's focus order traversal, so avoid rendering groups with no items.

## See Also

- [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
