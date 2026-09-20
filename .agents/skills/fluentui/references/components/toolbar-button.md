# ToolbarButton

> **Package**: `@fluentui/react-toolbar` v9.8.1
> **Import**: `import { ToolbarButton } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

ToolbarButton is the command primitive that lives inside a Toolbar. It renders a Fluent Button whose sizing, padding, and hover/pressed styling are tuned to sit flush alongside other toolbar items, and it participates in the Toolbar's shared focus model (a single roving tab stop with arrow-key navigation) as well as the Toolbar's overflow behavior, where low-priority items are automatically moved into an overflow menu when space runs out. It offers three appearances — subtle (the default), primary, and transparent — so a toolbar can establish one emphasized action while keeping the rest visually quiet. Because it is a button and not a stateful control, it is intended for immediate commands such as copy, delete, share, or formatting; use ToolbarToggleButton when the command has an on/off state and ToolbarRadioButton when a group of commands is mutually exclusive. It is almost always composed with Toolbar, ToolbarGroup, and ToolbarDivider to build command bars, editor toolbars, and application headers.

**When to use**: Reach for ToolbarButton when a user needs to trigger an action from within a command bar, editor ribbon, or any cluster of related actions that should share one keyboard tab stop and collapse gracefully when horizontal space is tight. Use it for the majority of commands in a toolbar, reserving appearance="primary" for the single most important action. Choose ToolbarToggleButton instead when the action reflects persistent state (bold, mute, grid view), ToolbarRadioButton for exclusive choices within a ToolbarRadioGroup, and a plain Button when the action stands alone outside a toolbar — a standalone Button does not require (and does not benefit from) the Toolbar's roving focus, grouping, or overflow machinery. If the action navigates rather than acts, prefer a link-style component so users get standard link affordances and context-menu behavior.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `"primary" \| "subtle" \| "transparent" \| undefined` | `'subtle'` | No | — |
| `vertical` | `boolean \| undefined` | `false` | No | — |

## Best Practices

### Do's

- Place every ToolbarButton inside a Toolbar (optionally nested in a ToolbarGroup) so it inherits roving focus, arrow-key navigation, and automatic overflow into a menu.
- Give every button a clear accessible name: include a visible text label where space allows, and add aria-label for icon-only buttons.
- Keep the default appearance="subtle" for the bulk of the commands and apply "primary" to at most one button per toolbar to preserve a single visual focal point.
- Match the button's vertical setting to the parent Toolbar's orientation so icon-and-label stacking stays consistent across every item.
- Group related commands with ToolbarGroup and separate clusters of commands with ToolbarDivider to create scannable, meaningful sections.
- Order commands by importance and frequency, letting lower-priority items fall into the Toolbar's overflow menu rather than shrinking or hiding them arbitrarily.
- Use ToolbarToggleButton instead of ToolbarButton whenever the command has a persistent on/off state so assistive technology receives the correct pressed state.
- Keep icon choice, icon size, and label conventions consistent across all buttons in the same toolbar so the bar reads as one control surface.

### Don'ts

- Don't render ToolbarButton outside a Toolbar context; it loses roving focus and overflow handling, so a plain Button is the correct choice there.
- Don't apply appearance="primary" to several buttons in the same toolbar — competing emphasis makes it impossible to tell which action is the intended next step.
- Don't use ToolbarButton to model selection or toggle state by swapping icons or colors; that state change is invisible to screen readers without ToggleButton semantics.
- Don't set vertical on individual buttons in a way that conflicts with the parent Toolbar's orientation, which produces misaligned items and confusing arrow-key behavior.
- Don't hard-code heights, paddings, or margins on ToolbarButtons to force alignment; rely on the button's own sizing and Griffel tokens so items stay aligned across densities.
- Don't nest interactive elements (links, checkboxes, other buttons) inside ToolbarButton's content — a button's children must remain non-interactive.
- Don't rely on a Tooltip as the only accessible name for an icon-only button; the Tooltip is supplementary to aria-label or visible text.
- Don't use ToolbarButton for navigation actions that should behave like links, which removes expected link affordances such as open-in-new-tab.

## Accessibility

## Theming & Tokens

ToolbarButton is fully token-driven and responds to the nearest FluentProvider theme. The subtle appearance resolves to tokens.colorSubtleBackground, tokens.colorSubtleBackgroundHover, tokens.colorSubtleBackgroundPressed, and tokens.colorSubtleBackgroundSelected for its surface and tokens.colorNeutralForeground2 with tokens.colorNeutralForeground2Hover for its content. The primary appearance maps to tokens.colorBrandBackground, tokens.colorBrandBackgroundHover, and tokens.colorBrandBackgroundPressed paired with tokens.colorBrandForeground1. The transparent appearance relies on tokens.colorTransparentBackground and tokens.colorTransparentStroke. Disabled and focus styling draw from tokens.colorNeutralForegroundDisabled, tokens.colorNeutralBackgroundDisabled, and tokens.colorStrokeFocus2, while shape and density come from tokens.borderRadiusMedium, tokens.strokeWidthThin, and tokens.spacingHorizontalS. Because these are theme tokens rather than literal colors, high-contrast themes and brand variants recolor every appearance automatically.

## Edge Cases

- When the Toolbar overflows, a ToolbarButton may be relocated into an overflow menu, where its appearance and vertical settings no longer apply visually — a primary button can lose its emphasis in that context.
- Setting vertical on the button but not on the parent Toolbar (or vice versa) produces a mismatch between the rendered layout and the arrow-key navigation direction.
- The transparent appearance can fail contrast checks when placed over saturated or image-backed surfaces; verify contrast or switch to subtle in that region.
- Disabled ToolbarButtons remain in the DOM and are announced as unavailable, but they are skipped by arrow-key navigation, which can make a toolbar appear to have a gap in keyboard order.
- An icon-only ToolbarButton that opens a Menu must carry both an accessible name and the menu-related ARIA state; a tooltip alone satisfies neither requirement.
- Only one ToolbarButton in a toolbar normally holds the tab stop at a time, so adding a second tabbable element inside the same toolbar disrupts the roving focus order.

## See Also

- [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
