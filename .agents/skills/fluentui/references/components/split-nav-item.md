# SplitNavItem

> **Package**: `@fluentui/react-nav` v9.4.0
> **Import**: `import { SplitNavItem } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

SplitNavItem is a navigation row in the Fluent UI React v9 Nav family that splits a single navigation entry into multiple regions. The primary region is the navItem slot, which behaves as a NavItem — or as a SubNavItem when the row is rendered inside a SubNavItemGroup — while up to three trailing regions expose secondary controls: an actionButton (a basic Button), a toggleButton (a ToggleButton whose pressed state reflects a boolean attribute such as mute or favorite), and a menuButton (a MenuButton used to overflow additional commands into a MenuPopover). The component renders a root wrapper div that lays out the nav item and the trailing controls side by side, plus optional tooltip slots (actionButtonTooltip, toggleButtonTooltip, menuButtonTooltip) that describe each trailing button on hover and focus. SplitNavItem does not own selection state itself: it consumes value, selectedValue, selectedCategoryValue, openCategories, density, categoryValue, and navCategoryItem from the surrounding Nav, NavCategory, and NavSubItemGroup context, so it participates in the same roving selection model as a plain NavItem. Use it for rows such as a channel or team in a navigation drawer where the label navigates but the row also needs quick actions like pin, mute, or more options.

**When to use**: Use SplitNavItem when a single navigation row must combine primary navigation with one or more secondary, row-level actions that a plain NavItem or NavSubItem cannot express. Typical cases are drawer or sidebar rows that need an inline action (favorite, pin), a stateful toggle (mute, show/hide), or an overflow menu, or a NavSubItemGroup child that needs the same treatment as its parent. Prefer NavItem when the row only navigates, NavSubItem when the row is a nested child with no extra controls, NavCategory plus NavCategoryItem when the row must expand into children, and Link or Button outside of navigation when the click does not change the selected nav value. Because SplitNavItem derives selection, expansion, and density from its ancestors, place it inside a Nav (and inside a NavCategory or NavSubItemGroup when the row is part of an expanding group), typically within a NavDrawer, InlineDrawer, or OverlayDrawer.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `actionButton` | `Slot<ButtonProps>` | — | No | — |
| `actionButtonTooltip` | `Slot<TooltipProps>` | — | No | — |
| `categoryValue` | `NavCategoryContextValue` | — | Yes | — |
| `children` | `React_2.ReactNode \| null` | — | No | — |
| `collapseMotion` | `Slot<PresenceMotionSlotProps<NavSubItemGroupCollapseMotionParams>>` | — | No | — |
| `defaultOpenCategories` | `NavItemValue[]` | — | No | — |
| `defaultSelectedCategoryValue` | `NavItemValue` | — | No | — |
| `defaultSelectedValue` | `NavItemValue` | — | No | — |
| `density` | `NavDensity` | — | No | — |
| `expandIcon` | `NonNullable<Slot<'span'>>` | — | Yes | — |
| `expandIconMotion` | `Slot<PresenceMotionSlotProps>` | — | No | — |
| `href` | `string` | — | No | — |
| `href` | `string` | — | No | — |
| `href` | `string` | — | No | — |
| `icon` | `Slot<'span'>` | — | No | — |
| `icon` | `Slot<'span'>` | — | No | — |
| `menuButton` | `Slot<MenuButtonProps>` | — | No | — |
| `menuButtonTooltip` | `Slot<TooltipProps>` | — | No | — |
| `multiple` | `boolean` | — | No | — |
| `navCategoryItem` | `NavCategoryItemContextValue` | — | Yes | — |
| `navItem` | `NonNullable<Slot<NavItemProps & NavSubItemProps>>` | — | No | — |
| `onNavCategoryItemToggle` | `EventHandler<OnNavItemSelectData>` | — | No | — |
| `onNavItemSelect` | `EventHandler<OnNavItemSelectData>` | — | No | — |
| `openCategories` | `NavItemValue[]` | — | No | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `NonNullable<Slot<'button'>>` | — | Yes | — |
| `root` | `Slot<'h2', 'h1' \| 'h3' \| 'h4' \| 'h5' \| 'h6' \| 'div'>` | — | Yes | — |
| `root` | `NonNullable<Slot<'div'>>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `selectedCategoryValue` | `NavItemValue` | — | No | — |
| `selectedValue` | `NavItemValue` | — | No | — |
| `tabbable` | `boolean` | — | No | — |
| `toggleButton` | `Slot<ToggleButtonProps>` | — | No | — |
| `toggleButtonTooltip` | `Slot<TooltipProps>` | — | No | — |
| `value` | `NavItemValue` | — | Yes | — |
| `value` | `NavItemValue` | — | Yes | — |
| `value` | `NavItemValue` | — | Yes | — |

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `actionButton` | — | No | Basic button slot. |
| `actionButtonTooltip` | — | No | Tooltip for the action button. |
| `menuButton` | — | No | Menu button slot to stuff more things in when the other two aren't enough. |
| `menuButtonTooltip` | — | No | Tooltip for the menu button. |
| `navItem` | — | Yes | The NavItem Slot. Will behave as a SubNavItem if it's in an a SubGroup. |
| `root` | — | Yes | Root of the component, wrapping the children. |
| `toggleButton` | — | No | Toggle button slot |
| `toggleButtonTooltip` | — | No | Tooltip for the toggle button. |

## Best Practices

### Do's

- Give every icon-only trailing button an accessible name (for example an aria-label such as Favorite, Mute, or More options) on the actionButton, toggleButton, or menuButton slot, because the tooltip slots alone are not a reliable accessible-name source.
- Only define the trailing slots the row actually needs; each actionButton, toggleButton, or menuButton you define adds a focus stop to every row in the navigation.
- Prefer the menuButton slot for overflow commands so the visible row stays compact instead of stacking several buttons into the row width.
- Keep the value prop unique per row so the surrounding Nav selection and openCategories logic can reliably identify the item.
- Drive toggleButton pressed state from real application state and update that state in your own data layer; treat the button as a reflection of state, not the source of truth.
- Use the actionButtonTooltip, toggleButtonTooltip, and menuButtonTooltip slots to give short, verb-first descriptions such as Pin channel or Mute notifications so hover and focus feedback matches the command.
- Let density, selected state, and background styling flow from the surrounding Nav and its ancestor drawer instead of hard coding sizes or colors per row.
- If you set tabbable to false, make sure another element in the same navigation region remains tabbable so keyboard users can still reach the nav.
- Keep the navItem label concise and let the trailing buttons carry the secondary meaning; screen reader users hear the label followed by each trailing button in order.

### Don'ts

- Don't render SplitNavItem outside a Nav, NavCategory, or NavSubItemGroup hierarchy; its required categoryValue and navCategoryItem context comes from those ancestors and the row cannot resolve selection, expansion, or density on its own.
- Don't place links, buttons, or other interactive elements inside the navItem children, because the nav item itself is already a button or link and nested interactive content breaks focus order and screen reader semantics.
- Don't use the toggleButton or actionButton for actions that should change the selected navigation value; selection belongs to the navItem region and the surrounding Nav's selection model.
- Don't add all three trailing slots to every row by default, since that multiplies tab stops and visual noise across the navigation.
- Don't rely on color alone to communicate a toggled or selected state; pair color with the toggle button's pressed semantics and, where needed, an icon change.
- Don't hard code padding, height, colors, or hover backgrounds on the root or button slots, because that defeats density and theming and will drift from the rest of the navigation.
- Don't treat the tooltip slots as a substitute for accessible names or for on-screen labels; tooltips are transient and are not announced on every pass.
- Don't override the root slot with an element that introduces a second navigation or list landmark role, since the surrounding Nav already provides navigation semantics.

## Accessibility

## Edge Cases

- SplitNavItem is not a substitute for building the navigation itself: the categoryValue and navCategoryItem context values are required and are injected only by an ancestor NavCategory and NavCategoryItem, so the row silently loses category coordination, selection, and density if it is dropped into a plain list or a Stack.
- Setting tabbable to false on the only row in a navigation region removes every focusable entry from that region, leaving keyboard users unable to reach the nav at all; keep at least one row tabbable per navigation.
- Because the trailing buttons are separate focus stops, a row at a very narrow drawer width may visually crowd or clip the nav item label when actionButton, toggleButton, and menuButton are all supplied; move secondary commands into the menuButton slot as available width shrinks.
- The tooltip slots render Tooltip components, not accessible names; an icon-only actionButton, toggleButton, or menuButton without an aria-label will be announced only by role, so always pair tooltips with explicit labels.
- Mixing controlled and uncontrolled state is a common trap: supplying selectedValue without onNavItemSelect, or openCategories without onNavCategoryItemToggle, freezes the navigation because the surrounding Nav can no longer update its own state from user interaction.
- The toggleButton's pressed appearance is independent of persisted data, so reloading with a stored mute or pin flag requires that you feed the stored value back into the toggle button rather than assuming the component remembers it.
- expandedBehavior is governed by the ancestor: a split row nested in a collapsed NavCategory or SubNavItemGroup is not rendered or exposed until the category is expanded, which can make it appear to be missing during testing.
- Density set directly on a row conflicts with the density provided by the surrounding Nav or drawer, producing rows of different heights in the same navigation; supply density once at the Nav or drawer level.
- The expandIconMotion and collapseMotion slots animate category expansion and collapse, so custom motion values should stay aligned across both, and reduced-motion preferences must be honored to avoid uncomfortable repetition in long lists.
- With multiple enabled, each split row still reports one value, so a multi-selection navigation must clear and track its own set of values rather than expecting the component to aggregate them.
- A row without href renders as a button rather than a link, which changes both the announcement and the browser's context-menu behavior; supply href where the destination is a real URL.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
