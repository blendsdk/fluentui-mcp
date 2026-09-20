# ToolbarRadioGroup

> **Package**: `@fluentui/react-toolbar` v9.8.1
> **Import**: `import { ToolbarRadioGroup } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

ToolbarRadioGroup is the mutually exclusive container of the Fluent UI React v9 Toolbar family. It groups a set of ToolbarRadioButton items so that only one of them can be checked at a time, exposing the group as a single radio decision inside the toolbar. The component renders a required root slot (a div) and distributes shared context to its children: appearance, size, and vertical orientation are inherited by every radio button in the group, so members stay visually and dimensionally consistent. Selection is tracked by the toolbar-level checkedValues record, where the group's name is the key and the array of checked values is the payload; the group therefore participates in the same controlled/uncontrolled selection model as the rest of the toolbar (checkedValues, defaultCheckedValues, and onCheckedValueChange). Typical uses are formatting controls such as text alignment or list style, view switchers, and any toolbar cluster where choosing one option must deselect the previous one.

**When to use**: Use ToolbarRadioGroup whenever a toolbar contains a set of related options that are mutually exclusive and should behave like a radio group rather than a row of independent buttons. Reach for it for text alignment (left/center/right), list style (bulleted/numbered), layout density, or view-mode switching. Choose ToolbarToggleButton instead when the options are independent and several can be active at once (bold plus italic plus underline). Keep one ToolbarRadioGroup per exclusive decision so that each group has its own name and its own entry in the toolbar's checkedValues; unrelated options should not share a group.

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

- **appearance**: Controls the visual weight of the radio buttons in the group: primary for a brand-filled selected state, subtle for a low-emphasis neutral treatment, transparent for a chromeless look on colored surfaces. Set it on the group so all members match, and only override on a child when a specific option genuinely needs to stand out. `subtle`
- **vertical**: Stacks the radio buttons in a column instead of a row. Use it when the group lives in a vertical toolbar or when the option labels are long enough that a horizontal row would crowd the toolbar; the visual direction should match the direction users expect arrow keys to move. `true`
- **size**: Sets the density of the radio buttons in the group (small, medium, or large). Match the size of neighbouring toolbar items so the toolbar reads as one consistent strip, and prefer inheriting the toolbar's size rather than setting a different one per group. `medium`
- **checkedValues**: Controlled selection state for the toolbar, expressed as a record whose key is the group's name and whose value is the array of checked item values. For a radio group keep exactly zero or one value in the array so the visual state matches the exclusive semantics. Use it together with onCheckedValueChange when the selection must be owned by application state. `the group name mapping to a single checked value`
- **defaultCheckedValues**: Uncontrolled initial selection for the group, useful when the toolbar should manage its own state. Omit it if you pass checkedValues; do not use both for the same group. `the group name mapping to the initially selected value`
- **onCheckedValueChange**: Callback fired when any radio in the toolbar changes selection; the event data identifies the group name and the resulting checked items. Use it to sync selection into app state, and memoize it when the group is large so context updates do not re-render every radio button. `a handler that records the new checked item for the group`
- **name**: Identifier shared by all radio buttons in the group and used as the key in checkedValues. Every radio that belongs to the same exclusive decision must use the same name, and independent groups must use different names. `alignment`
- **value**: Identifies a single option within the group's name; it is what appears in the checked items and is what you receive in the change callback. Values must be unique inside a group and should stay stable across renders. `left`
- **root**: The required div slot that renders the group container. Use it to apply layout classes, add a data attribute, attach a ref, or supply an accessible name for the group; avoid changing the semantics of the container so the radio relationship stays intact. `div`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Give every ToolbarRadioButton in the group the same name so the toolbar treats them as one exclusive set, and give each one a unique value inside that set.
- Use one ToolbarRadioGroup per mutually exclusive decision; alignment, list style, and view mode should each be their own group.
- Set vertical on the group (or inherit it from the Toolbar) to match the visual direction the group actually reads in; arrow-key behavior is expected to follow that orientation.
- Provide an accessible name for the group itself through an aria-label or aria-labelledby target on the root slot when no visible group label exists.
- Pair each radio button with a concise, distinct label or Tooltip so screen reader users can tell the options apart; icon-only radios need an accessible name.
- Drive selection through the toolbar-level checkedValues and onCheckedValueChange so the checked state stays in one predictable place, and seed initial state with defaultCheckedValues for uncontrolled usage.
- Let appearance and size flow down from the group (or from the Toolbar) rather than styling each radio button individually, so the group reads as a single control.
- Keep the group shallow: a flat list of radio buttons is easier to navigate with arrow keys and simpler to keep in sync with checkedValues.

### Don'ts

- Don't mix ToolbarRadioButton and ToolbarToggleButton inside the same ToolbarRadioGroup; toggle buttons express independent state and break the single-select contract.
- Don't reuse the same name across two groups that are meant to be independent; selection will be reported against the same key and appear to leak between groups.
- Don't place arbitrary focusable content (links, inputs, menus) between radio buttons inside the group; it interrupts radio navigation and confuses the group's semantics.
- Don't pass more than one checked value for a radio group name in checkedValues; a radio group has at most one active option, and inconsistent state confuses the visual and announced selection.
- Don't rely on color or background fill alone to convey which radio is selected; keep a programmatic checked state alongside any visual treatment.
- Don't duplicate values within a group; repeated values make the checked item ambiguous when the toolbar reports checkedItems.
- Don't nest a ToolbarRadioGroup inside another ToolbarRadioGroup to model sub-options; nested exclusive groups become impossible to describe to assistive technology and hard to navigate.
- Don't use the radio group as a general layout wrapper for buttons or dividers — use the appropriate toolbar grouping and divider components for that.

## Anti-Patterns

### Mixing radio and toggle buttons in one group

❌ ToolbarRadioButton expresses an exclusive choice while ToolbarToggleButton expresses independent on/off state. Combining them inside a single ToolbarRadioGroup produces a control whose checked state cannot be described consistently, and users cannot predict whether activating one option will deselect another.

✅ Keep ToolbarRadioGroup for exclusive options and move any independent toggles into their own toolbar grouping, so each cluster has one clear selection model.

### Reusing the group name across unrelated option sets

❌ The name is the key into the toolbar's checkedValues record. Two visually separate groups that share a name are reported as one selection set, so the change callback receives ambiguous checked items and radio buttons in one group can appear affected by the other.

✅ Give every mutually exclusive set its own unique name, and verify that the values inside each set are unique as well.

### Multiple checked values for one radio group

❌ Radio semantics allow at most one checked option. Seeding checkedValues with several values for the same group name produces a state that looks multi-select but is announced as a radio group, which is contradictory for screen reader users and hard to reason about in application code.

✅ Store a single value per radio group name in controlled state, or switch the component to a multi-select toolbar toggle pattern if multiple simultaneous options are the real requirement.

### Scattering focusable content inside the group

❌ Links, inputs, or menus placed between radio buttons break the expected arrow-key traversal and force users to tab through unrelated controls in the middle of an exclusive choice, undermining the grouping semantics.

✅ Keep the group to radio buttons only. Move secondary or unrelated actions outside the group, or into a separate toolbar section with a divider.

### Icon-only radios with no accessible name

❌ A radio button with only an icon has no programmatic label, so assistive technology cannot tell the user which option is being selected, failing name/role/value requirements even though the visuals look fine.

✅ Add an aria-label or aria-labelledby to each icon-only radio button and consider a Tooltip for sighted users, keeping the accessible name consistent with the tooltip text.

## Accessibility

**Requirements**: The group must satisfy WCAG 1.3.1 (the grouping and the selected state must be programmatically determinable), 2.1.1 (all options reachable and selectable by keyboard), 2.4.7 (a visible focus indicator on the currently focused radio button), and 4.1.2 (each radio exposes a name, role, and checked state). Every ToolbarRadioButton needs an accessible name, either from its visible text label or from an aria-label/aria-labelledby when it is icon-only. The group itself needs an accessible name so users know what decision they are making. The selected indicator must meet 3:1 non-text contrast against the surrounding surface (1.4.11), and focus styling must not depend on color alone.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the radio group and out to the next toolbar item; only one radio in the group (the checked one, or the first enabled one when nothing is checked) participates in the tab order at a time. |
| `Shift+Tab` | Moves focus backward out of the group to the previous toolbar item. |
| `ArrowRight` | Moves focus to the next radio button in a horizontal group and selects it. |
| `ArrowLeft` | Moves focus to the previous radio button in a horizontal group and selects it. |
| `ArrowDown` | Moves focus to the next radio button; the expected direction for a group with vertical set. |
| `ArrowUp` | Moves focus to the previous radio button; the expected direction for a group with vertical set. |
| `Space` | Selects the currently focused radio button when it was reached without moving selection. |
| `Enter` | Activates the focused radio button, matching button semantics for the underlying element. |

**ARIA**: role, aria-checked, aria-label, aria-labelledby, aria-orientation, aria-disabled

**Screen Reader**: Assistive technology announces the group's accessible name followed by each option as a radio with its label and checked/unchecked state; selecting via arrow keys announces the newly checked option and the deselection of the previous one. Because the group is mutually exclusive, only the checked item is announced as selected, and the position of the option within the set (for example, the second of three) helps users understand the choice. Disabled radios are announced as dimmed/disabled and are skipped during arrow-key navigation. When the group has no checked option yet, screen readers report every option as unchecked.

## Styling

Style the group through its root slot and let shared context handle the children. Use makeStyles/createStyles from @fluentui/react-components and target the group root with a className rather than styling each ToolbarRadioButton individually; the appearance and size props distribute appearance and sizing tokens to descendants. Add spacing around a group using tokens.spacingHorizontalS, tokens.spacingHorizontalXS, tokens.spacingVerticalXS, or tokens.spacingVerticalS, and separate adjacent groups with the toolbar divider component rather than margins where possible. A container background can be set with tokens.colorNeutralBackground2 or tokens.colorNeutralBackground3, rounded with tokens.borderRadiusMedium, with an inset border of tokens.colorTransparentStroke. If you need a custom focus treatment, reference tokens.colorStrokeFocus2 so it stays theme-aware, and use tokens.colorBrandStroke1 for a brand-tinted selection outline. For vertical groups, rely on the vertical prop to switch the root layout rather than hand-writing flex direction, so arrow-key behavior and layout stay aligned.

## Performance

ToolbarRadioGroup itself is cheap: it renders a single div root and provides context rather than cloning or mapping children, so the number of radio buttons never costs an extra reconciliation pass at the group level. The real cost is state propagation — when the group's checked values change, context consumers re-render, so memoize onCheckedValueChange and keep the checkedValues record referentially stable instead of recreating it on every render. Avoid inline style objects and inline class names on the root slot when the toolbar re-renders frequently. Keep the toolbar tree shallow: each nested group adds another context layer that all descendants must read, and very large radio groups benefit from being split into separate, clearly named groups rather than one long list.

## Theming & Tokens

The appearance prop maps onto theme tokens: primary uses tokens.colorBrandBackground with tokens.colorBrandBackgroundHover and tokens.colorBrandBackgroundPressed for interaction states and tokens.colorNeutralForegroundOnBrand for the selected content; subtle uses tokens.colorNeutralBackground1 with tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed; transparent keeps the resting background transparent and uses tokens.colorNeutralBackground1Hover for interaction. Unselected buttons use tokens.colorNeutralForeground1 or tokens.colorNeutralForeground2, and hover states use tokens.colorNeutralForeground1Hover/tokens.colorNeutralForeground2Hover. The size prop selects typography and spacing scales built from tokens.fontSizeBase200/300/400, tokens.lineHeightBase200/300/400, tokens.spacingHorizontalXS/S/M, and tokens.spacingVerticalXS. Focus treatment derives from tokens.colorStrokeFocus2, and disabled radios use tokens.colorNeutralForegroundDisabled and tokens.colorNeutralBackgroundDisabled. Because these are theme tokens, the group adapts automatically to FluentProvider themes and to high-contrast modes without per-group overrides.

## Migration Notes

Fluent UI v8 had no Toolbar component family, so toolbar radio behavior was usually hand-built from divs plus Button or CommandBar items with custom state. In v9, ToolbarRadioGroup is the supported container for exclusive toolbar options: selection state moves to the toolbar's checkedValues record (keyed by the group's name) with defaultCheckedValues for uncontrolled usage and onCheckedValueChange as the change handler, replacing per-button selected props and manual state juggling. Appearance, size, and vertical are now inherited through context from the group or the parent Toolbar rather than repeated on every button, so remove per-button appearance and size props when migrating.

## Edge Cases

- A radio group may legitimately start with nothing checked; there is no 'no selection' error state, and activating the already checked radio does not clear the selection.
- Supplying both checkedValues and defaultCheckedValues for the same group creates conflicting sources of truth — pick controlled or uncontrolled, never both.
- Rendering the group outside a toolbar means there is no toolbar-level checkedValues state to read; the group still renders and lays out, but selection tracking must then come from your own controlled state.
- Changing the group's name between renders remaps the checked values, so previously checked items appear cleared; keep names stable for the lifetime of the group.
- Duplicate values within the same name make the checked item ambiguous when the change callback reports checked items — enforce uniqueness at the data level.
- When every radio in the group is disabled the group is skipped in the tab order entirely, which can strand keyboard users if it is the only way to change that setting.
- A vertical group inside a horizontal toolbar inherits the toolbar's orientation context in the opposite direction; set vertical explicitly on the group so layout and arrow-key expectations agree.
- Icon-only radios depend completely on the accessible name you supply, since there is no visible text for assistive technology to fall back on.

## See Also

- [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
