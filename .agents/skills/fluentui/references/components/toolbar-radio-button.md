# ToolbarRadioButton

> **Package**: `@fluentui/react-toolbar` v9.8.1
> **Import**: `import { ToolbarRadioButton } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

ToolbarRadioButton is a toolbar-specialized radio control that represents one option inside a mutually exclusive set of toolbar modes. It renders as a button-styled element but carries radio semantics, so exactly one option in its logical set is selected at a time. It is designed to be placed inside a ToolbarRadioGroup (itself inside a Toolbar or ToolbarGroup) so the surrounding group can coordinate selection and expose the correct radiogroup behavior to assistive technology. Two props are mandatory: 'name' identifies the logical radio set and must be identical for every radio in that set, while 'value' identifies the individual option and must be unique within the set. The 'appearance' prop controls visual emphasis and defaults to 'subtle', which keeps toolbars visually quiet; 'primary' and 'transparent' are available when the surrounding design calls for a brand-forward or chrome-free treatment. Because it is optimized for toolbar layouts, it participates in toolbar grouping, dividers, and overflow behavior alongside ToolbarButton and ToolbarToggleButton.

**When to use**: Use ToolbarRadioButton when a toolbar needs to let the user choose exactly one option from a small, related set of modes or views — for example text alignment, view density, or drawing mode. It belongs inside a ToolbarRadioGroup so the set behaves as a single radiogroup with arrow-key navigation and one tab stop. Choose ToolbarButton instead for one-shot actions such as save, delete, or open, and ToolbarToggleButton for independent on/off states where multiple options can be active at the same time. Choose plain Radio or RadioGroup when the controls are not part of a toolbar layout, since the toolbar variants exist to match toolbar spacing, appearance, and overflow mechanics. Avoid ToolbarRadioButton for sets larger than roughly seven options, where a Dropdown or Select is a better fit.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `"primary" \| "subtle" \| "transparent" \| undefined` | `'subtle'` | No | — |
| `name` | `string` | — | Yes | — |
| `value` | `string` | — | Yes | — |

### Prop Guidance

- **appearance**: Controls the visual weight of the radio. Leave it at the default 'subtle' for the vast majority of toolbar radios so the toolbar stays neutral and the checked state carries the emphasis. Use 'primary' only for a single high-priority option that must draw the eye, and use 'transparent' when the radio sits on a colored or branded surface and should not add its own background until hover or selection. `subtle`
- **name**: Required. Identifies the logical radio set: every ToolbarRadioButton that should be mutually exclusive must share the exact same name, and unrelated sets on the page must use different names so they do not become exclusive with each other. `text-alignment`
- **value**: Required. Identifies this individual option within the set and must be unique among the radios that share the same name. The value is what distinguishes the option when the group reports which mode is selected, so keep it stable and meaningful rather than derived from display text. `center`

## Best Practices

### Do's

- Wrap related ToolbarRadioButtons in a ToolbarRadioGroup so the options share radio semantics and roving focus.
- Give every radio in a set the same 'name' and a distinct 'value' so selection identity is unambiguous.
- Keep the default 'subtle' appearance for most toolbar radios; reserve 'primary' for the one control that genuinely needs brand emphasis.
- Provide an accessible name on every radio — visible text when possible, or aria-label when the radio is icon-only.
- Place radios inside a ToolbarGroup and separate unrelated groups with ToolbarDivider so the toolbar reads as distinct clusters.
- Ensure one option in a required set is selected by default so the current mode is always visible and announced.
- Keep each radio set small (two to seven options) so arrow-key traversal stays practical.

### Don'ts

- Don't give two radios in the same set the same 'value' — duplicate values make the selected option ambiguous.
- Don't use different 'name' values inside one logical set; that silently splits the radios into separate groups.
- Don't reuse the same 'name' for two unrelated sets of radios on the same page, since they may be treated as one exclusive group.
- Don't use ToolbarRadioButton for independent toggles or for one-shot commands — use ToolbarToggleButton or ToolbarButton.
- Don't set appearance to 'primary' on every radio in a group; it destroys the visual distinction between selected and unselected states.
- Don't rely on background color alone to signal the selected option; the checked state must also be conveyed programmatically.
- Don't nest other interactive elements inside a ToolbarRadioButton.

## Anti-Patterns

### Radios rendered without a ToolbarRadioGroup

❌ A ToolbarRadioButton placed directly in a ToolbarGroup or Toolbar loses the enclosing radiogroup role and its roving arrow-key navigation, so users must Tab through every option and screen readers cannot announce the set as a group.

✅ Always wrap mutually exclusive toolbar radios in a ToolbarRadioGroup and give that group an accessible name that describes the choice being made.

### Duplicate or reused values and names

❌ Two radios in one set sharing the same value makes the selected option ambiguous, and reusing a name across two unrelated sets can make them behave as a single exclusive group, letting a selection in one area clear a selection in another.

✅ Assign each radio a unique value within its set and a name that is unique to that logical group across the page.

### Using radio behavior for independent toggles or commands

❌ Modeling bold, italic, and underline as toolbar radios forces the user to choose one at a time, and modeling a save action as a radio button makes an action look like persistent state.

✅ Use ToolbarToggleButton for options that can be enabled independently and ToolbarButton for immediate actions, reserving ToolbarRadioButton for genuinely exclusive modes.

### Brand-colored radio for every option

❌ Setting appearance to 'primary' on all radios floods the toolbar with brand color and removes the visual signal that separates the selected option from the others.

✅ Leave appearance at the default 'subtle' for the set and let the checked state, not the appearance variant, communicate selection.

### Icon-only radios with no accessible name

❌ An icon-only ToolbarRadioButton has no text content, so assistive technology announces an unlabeled radio button and users cannot tell which mode it represents.

✅ Provide an aria-label that names the mode, and pair it with a Tooltip so sighted users get the same information.

## Accessibility

**Requirements**: ToolbarRadioButton must be rendered inside a ToolbarRadioGroup, which supplies the enclosing radiogroup role and the group-level accessible name. Every radio needs an accessible name from visible text, aria-label, or aria-labelledby. Exactly one radio in a required set should be checked at any time so screen reader users are never left without a current mode. Ensure the focus indicator is visible against the toolbar background and that the checked and unchecked states meet WCAG 1.4.3 contrast requirements; when using appearance='transparent' or 'subtle', verify the selected state is still distinguishable without relying on color alone. Target size should meet WCAG 2.5.8 (24x24 CSS pixels minimum) for pointer users.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the toolbar and, within the radio group, lands on the currently selected radio; moves focus out of the group to the next toolbar control. |
| `ArrowRight` | Moves focus to the next radio in a horizontal group and selects it. |
| `ArrowLeft` | Moves focus to the previous radio in a horizontal group and selects it. |
| `ArrowDown` | Moves focus to the next radio in a vertical group and selects it. |
| `ArrowUp` | Moves focus to the previous radio in a vertical group and selects it. |
| `Space` | Selects the currently focused radio button. |
| `Enter` | Activates the focused radio button, since the underlying element is a button. |

**ARIA**: role='radiogroup', role='radio', aria-checked, aria-label, aria-labelledby, aria-describedby, aria-disabled, aria-orientation

**Screen Reader**: The enclosing ToolbarRadioGroup is announced as a radio group with its accessible name, and each ToolbarRadioButton is announced as a radio button with its label, its checked or unchecked state, and its position within the set (for example, 'Center align, radio button, checked, 2 of 3'). When arrow keys move selection, screen readers announce the newly focused and checked radio, providing immediate feedback about the mode change. Because the visual treatment is a toolbar button, the checked state must come from the rendered radio semantics rather than from styling alone, otherwise screen reader users cannot determine which mode is active. Radio controls with aria-disabled are announced as unavailable but remain discoverable in the group.

## Styling

Style ToolbarRadioButton through the appearance prop first, then fine-tune with makeStyles and mergeClasses rather than overriding internals. For hover and pressed states, real semantic tokens include tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground1Pressed, and tokens.colorNeutralForeground2Hover; for the checked state in the default subtle appearance, pair tokens.colorNeutralBackground1Selected or the brand pair tokens.colorBrandBackground with tokens.colorNeutralForegroundOnBrand, and use tokens.colorBrandBackgroundHover and tokens.colorBrandBackgroundPressed for interactive feedback. Disabled radios should use tokens.colorNeutralForegroundDisabled against tokens.colorNeutralBackgroundDisabled. Use tokens.borderRadiusMedium for the button shape, tokens.spacingHorizontalS and tokens.spacingHorizontalXS for icon-to-label gaps, tokens.strokeWidthThin with tokens.colorNeutralStroke1 for any outline, and tokens.colorStrokeFocus2 for the focus ring so it is visible in both light and dark themes. Typography should follow tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.fontWeightSemibold when an option is emphasized. Keep additional styles in classes applied through the className prop so they layer on top of the appearance styles instead of fighting them.

## Performance

ToolbarRadioButton is a light control, but each radio contributes to the toolbar's measurement and overflow calculations, so large toolbars benefit from wrapping radios in OverflowItem so they can collapse into a menu when space runs out. The appearance variants resolve to atomic, precompiled Griffel classes, so switching appearance at runtime does not generate new CSS; however, passing freshly created inline style objects or unmemoized child content forces re-renders of every radio in the group. Hoist makeStyles calls to module scope, memoize custom wrappers with React.memo, and keep handlers stable so a single selection change does not re-render unrelated toolbar groups. Avoid recomputing the list of options on every render when the set is large.

## Theming & Tokens

ToolbarRadioButton derives its colors entirely from the FluentProvider theme, so appearance='primary' pulls from brand tokens (tokens.colorBrandBackground, tokens.colorBrandBackgroundHover, tokens.colorBrandBackgroundPressed, tokens.colorNeutralForegroundOnBrand) and automatically follows brand ramp changes, including the branded variant of FluentProvider. The default 'subtle' appearance uses neutral tokens such as tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground1Pressed, tokens.colorNeutralForeground1, and tokens.colorNeutralForeground2, while 'transparent' removes the resting background and layers the neutral hover tokens only on interaction. Disabled states resolve through tokens.colorNeutralForegroundDisabled and tokens.colorNeutralBackgroundDisabled, and the focus ring resolves through tokens.colorStrokeFocus2. Shape and rhythm come from tokens.borderRadiusMedium, tokens.spacingHorizontalS, and the typography tokens, so density and roundness customizations applied at the theme level cascade into toolbar radios without per-component overrides. In forced-colors and high contrast modes, selected and disabled states fall back to system colors, so avoid hard-coded color values in custom classes.

## Edge Cases

- A ToolbarRadioButton rendered outside a ToolbarRadioGroup still renders as a radio, but it does not gain group-level arrow-key navigation or an announced group name.
- If no radio in a set is checked, keyboard users tab into the group without landing on a selected option and screen readers cannot report a current mode; ensure a default selection where the mode is required.
- When the toolbar overflows and radios move into a menu, radio semantics can be lost in the collapsed presentation, so verify the overflowed options remain understandable and selectable.
- Arrow-key direction depends on the group's orientation, so a horizontal group inside a vertically oriented toolbar can produce unexpected key behavior unless orientation is configured consistently.
- Because 'name' is required and shared across a set, copy-pasting a radio group to create a second, independent set duplicates the name and can cause the two sets to interfere with each other.
- Selecting a mode via pointer triggers the same selection pathway as the keyboard, so any custom styling applied only to the checked state must also be reflected when the group changes programmatically.

## See Also

- [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
