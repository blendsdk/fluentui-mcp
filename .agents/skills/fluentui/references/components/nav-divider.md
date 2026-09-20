# NavDivider

> **Package**: `@fluentui/react-nav` v9.4.0
> **Import**: `import { NavDivider } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

NavDivider is the presentational separator of the Fluent UI React navigation family. It renders a single divider element whose orientation follows the container it is placed in: a horizontal rule between stacked navigation destinations inside a NavDrawer or Nav, and a vertical rule when the surrounding surface arranges items along a row. Because it participates in Nav context (NavCategoryContextValue, NavCategoryItemContextValue, NavItemValue), it automatically matches the density, colors and theming of the navigation it separates instead of being an independently themed line. NavDivider carries no selection state, no value and no keyboard behavior of its own. Its only job is visual grouping: it draws the eye boundary between clusters of destinations so the navigation hierarchy stays scannable.

**When to use**: Use NavDivider inside Nav, NavDrawer, NavDrawerBody or NavDrawerFooter whenever you need a light visual break between two clusters of navigation destinations — for example between primary destinations and a settings/help cluster at the bottom of a drawer. It is the right choice when the groups are self-explanatory and only need visual separation. Choose NavSectionHeader instead (or in addition) when the group actually needs a readable name, because a divider communicates grouping only visually and carries no text for assistive technology. Choose the standalone Divider component when you are separating content outside of a navigation surface, such as sections of a card or page layout, since NavDivider is tuned to the nav's density and alignment. Do not use NavDivider as a spacer, as a hit target, or as a way to make an item look selectable.

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

### Prop Guidance

- **root**: The root slot for the rendered divider element. Use its className or style overrides to adjust the rule's color, thickness, or surrounding spacing; keep width, height and orientation unset so the enclosing navigation layout continues to control them. `className composed with mergeClasses to apply tokens.colorNeutralStroke2`
- **href**: A link-style attribute that surfaces on navigation primitives in this family. It is meaningful for NavItem, NavSubItem and NavCategoryItem, which render anchors; a divider is never a link, so do not rely on it for NavDivider. Use it on the destinations on either side of the divider instead. `href="/settings" on the NavItem below the divider`
- **icon**: The leading icon slot used by navigation items, not by the divider. Set it on NavItem, NavCategoryItem or NavSubItem when a destination benefits from recognition, and keep NavDivider as a plain rule so the separation stays visually quiet. `icon slot rendered on the NavItem above the divider`
- **expandIcon and expandIconMotion**: Configure the expand/collapse affordance of a NavCategoryItem, including its animated presence. These belong to the category item that groups destinations; the divider merely sits between the resulting groups and needs no configuration. `expandIcon overridden on the NavCategoryItem that precedes a NavDivider`
- **value**: The identifier used by the Nav family to track selection and category state. It is supplied by NavItem, NavSubItem, NavCategoryItem and the parent Nav; NavDivider has no value and cannot be selected or reported through onNavItemSelect. `value="dashboard" on the NavItem above the divider`
- **defaultSelectedValue, selectedValue and onNavItemSelect**: Selection state and the selection callback are owned by the parent Nav (controlled with selectedValue, uncontrolled with defaultSelectedValue). NavDivider only separates groups of destinations, so configure these on the Nav that contains the divider. `onNavItemSelect on the enclosing Nav, not on the divider`
- **defaultSelectedCategoryValue, selectedCategoryValue, defaultOpenCategories, openCategories and multiple**: Category expansion and multi-select behavior are properties of the parent Nav. They determine how the groups separated by NavDivider expand and collapse; the divider never participates in that state. `multiple on the Nav to allow more than one category to stay open`
- **onNavCategoryItemToggle**: The callback fired when a category item is expanded or collapsed. Handle it on the Nav so you can react to group changes when the divider boundaries shift. `onNavCategoryItemToggle on the Nav containing the divider`
- **density**: Density is set once on the parent Nav and flows to every descendant, including the divider, so the rule's surrounding whitespace matches the vertical rhythm of the links. Change density on the Nav rather than trying to compensate with margins on the divider. `density set on the Nav to match a compact drawer`
- **tabbable**: Controls whether a navigation item participates in the roving tab order. Because nav uses a single tab stop with arrow-key movement between items, at most one item should be tabbable; the divider must never be made tabbable because it has no interaction. `tabbable on the currently focused NavItem only`
- **navItem, actionButton, toggleButton, menuButton and their tooltips**: Slot overrides used to compose richer destinations — an action button, a toggle, a menu trigger, and the tooltips that label them. These belong to the item that carries the affordance, not to NavDivider, which stays a single unstyled rule. `actionButton and actionButtonTooltip on a NavItem above the divider`
- **collapseMotion**: Defines the motion used when a NavSubItemGroup collapses. Divider placement affects how that animation reads, but the motion itself is configured on the sub item group, never on the divider. `collapseMotion on the NavSubItemGroup under an expanding category`
- **children**: Navigation primitives accept children to compose links, icons and nested groups. NavDivider is meant to render empty in the navigation; if you need textual content inside a rule, use NavSectionHeader instead of forcing children into the divider. `children on NavItem and NavCategoryItem, not on NavDivider`

## Best Practices

### Do's

- Place NavDivider between logical clusters of destinations (primary links, secondary links, footer utilities) rather than between arbitrary adjacent items.
- Let NavDivider inherit its orientation and spacing from the surrounding Nav / NavDrawer container instead of hard-coding width, height or margins on the root slot.
- Pair a divider with a NavSectionHeader when the group it introduces is not obvious from the destination labels alone.
- Remove a trailing NavDivider after the last item of a group; a leading or trailing rule with nothing on the other side reads as a rendering bug.
- Override appearance through the root slot (className) and mergeClasses so your customization still composes with the component's own styles and the active theme.
- Keep the count of dividers low — one rule per meaningful group boundary — so the navigation outline stays readable at a glance.
- Verify the rendered rule against the drawer background in both light and dark themes, since a low-contrast rule can disappear entirely against a layered surface.

### Don'ts

- Don't pass selection or navigation props such as value, selectedValue or onNavItemSelect to NavDivider — it is never selectable and never focusable.
- Don't place NavDivider between every single NavItem; that produces visual noise and competes with the selection indicator for attention.
- Don't use NavDivider as vertical padding or a spacer to push footer items down; use spacing tokens or a flex layout inside NavDrawerBody instead.
- Don't stack two NavDividers next to each other to fake a thicker line; adjust the stroke width through styling if a stronger rule is genuinely needed.
- Don't rely on NavDivider alone to convey grouping to screen reader users — the hierarchy must still be expressible through headings, landmarks and ARIA relationships.
- Don't drop NavDivider into non-navigation layouts such as a Card body or a Toolbar; those surfaces have their own separator components and densities.
- Don't put text or arbitrary children inside NavDivider to create a labelled rule in the navigation; use NavSectionHeader for that pattern.

## Anti-Patterns

### Using NavDivider as a spacer

❌ Authors reach for a divider to push a footer cluster of links to the bottom of a drawer, which makes the rule carry layout meaning it was never designed for and breaks as soon as density or content length changes.

✅ Control layout with NavDrawerBody, NavDrawerFooter and flex or spacing tokens, and reserve NavDivider for genuine group boundaries.

### Dividers instead of section headers

❌ A series of unlabelled rules splits the navigation visually but tells assistive technology nothing about the groups, leaving screen reader users with one long undifferentiated list of links.

✅ Introduce each group with NavSectionHeader (and an appropriately labelled navigation landmark) so the grouping has an accessible name; keep the divider as a purely visual reinforcement.

### Expecting divider state or interactivity

❌ Passing value, selectedValue or selection handlers to NavDivider, or making it tabbable, produces props that have no effect and a component that looks interactive but does nothing when clicked or focused.

✅ Keep all selection, value and keyboard behavior on NavItem, NavSubItem, NavCategoryItem and the parent Nav; leave NavDivider presentational and non-focusable.

### Over-dividing the navigation

❌ Placing a rule between every pair of links creates visual noise, competes with the selection indicator, and makes it harder to see which links truly belong together.

✅ Group destinations by meaning first, then add one divider per meaningful boundary — typically no more than two or three in a drawer.

### Hard-coding the rule's size or orientation

❌ Setting explicit widths, heights, or margins on the root slot fights the navigation's layout and produces rules that do not line up with the links at other densities or in the collapsed drawer state.

✅ Let the surrounding Nav and NavDrawer determine orientation and extent, and limit customization to color and thickness tokens on the root slot.

## Accessibility

**Requirements**: NavDivider is a decorative grouping device, so it must never carry information that is unavailable elsewhere. WCAG 1.3.1 (Info and Relationships) still applies to the navigation as a whole: each group of destinations introduced by a rule should also be identifiable programmatically, typically by a NavSectionHeader or an appropriately labelled navigation landmark. Because the rule is a non-text graphical object that conveys grouping, it should meet WCAG 1.4.11 Non-text Contrast with at least a 3:1 ratio against the adjacent background. Ensure the surrounding navigation landmark is labelled so users understand what set of links they are in, and ensure the visually separated groups are still reachable in a sensible order when a keyboard-only or screen reader user traverses them.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus past the NavDivider to the next focusable navigation item; the divider itself is never a tab stop. |
| `Shift+Tab` | Moves focus backwards past the NavDivider to the previously focused navigation item. |
| `ArrowDown` | Handled by the enclosing Nav to move roving focus to the next destination across the divider boundary; the divider is skipped. |
| `ArrowUp` | Handled by the enclosing Nav to move roving focus to the previous destination across the divider boundary; the divider is skipped. |
| `Enter` | Activates the focused NavItem or NavCategoryItem link; it does nothing when the divider is between items because the divider cannot receive focus. |
| `Space` | Activates the focused navigation item or toggles an expanded NavCategoryItem; NavDivider has no Space handler. |
| `Home / End` | Move roving focus to the first or last destination in the navigation region, crossing any NavDivider without stopping on it. |

**ARIA**: role="separator" (rendered by the shared divider primitive used underneath), aria-orientation (reflects whether the rule runs horizontally or vertically in the current nav layout), aria-hidden or role="presentation" for purely decorative rules so they are not announced twice, aria-label or aria-labelledby on the surrounding navigation landmark or Nav section header, aria-expanded on the enclosing NavCategoryItem when the separated region is a collapsible category, aria-current on the selected NavItem so the active destination is distinguishable from the grouping rules

**Screen Reader**: NavDivider produces no accessible name and exposes no actionable role, so screen readers generally announce nothing for it, or announce it only as a separator when it is exposed with a separator role. This is intentional: the divider's meaning is visual, and the equivalent non-visual structure must come from the surrounding Nav landmark, NavSectionHeader headings and the aria-current state of the selected item. When the same separation is already conveyed by a heading or by the navigation landmark itself, hiding the rule from assistive technology avoids a redundant stop in virtual-cursor navigation.

## Styling

Style NavDivider through the root slot and let the surrounding Nav drive orientation, alignment and density. The line itself is drawn with the neutral stripe color used across the design system — tokens.colorNeutralStripeAlt — and a hairline thickness from tokens.strokeWidthThin, so matching the rest of your app's rules is usually a matter of staying on those two tokens. If you need a slightly stronger rule on a layered drawer surface, tokens.colorNeutralStroke2 or tokens.colorNeutralStroke1 in combination with tokens.strokeWidthThin will keep the line legible without making it look like a border. Spacing around the rule should come from the nav density scale (tokens.spacingVerticalXS and tokens.spacingVerticalS for compact layouts, tokens.spacingVerticalM for comfortable ones) rather than from ad-hoc margins. When you override the root className, compose with the component's own class using mergeClasses so theme and density styles are not lost. Avoid global CSS selectors targeting the divider element; a scoped override on the slot is more predictable and survives changes to the internal markup. In a right-to-left layout, rely on the logical border properties the component already uses rather than flipping left and right values yourself.

## Performance

NavDivider is a stateless, effect-free presentational element, so its own render cost is negligible. The concerns are structural: each divider adds a DOM node and participates in the nav container's layout and style recalculation, so keeping the number of rules small keeps scrolling and resizing of long drawers cheap. Because the navigation family re-renders when selection, expansion or density changes, keep any root slot overrides stable — hoist style objects and use the styling system's class merging rather than allocating new objects on every render — so the divider can be skipped during reconciliation. Very long navs with many dividers also increase the cost of theme recalculation when the provider switches between light and dark themes, since every rule depends on the same color tokens.

## Theming & Tokens

NavDivider draws its rule from the divider color token used throughout the design system, tokens.colorNeutralStripeAlt, at tokens.strokeWidthThin, and it responds to the FluentProvider theme exactly like the rest of the navigation family. Swapping in a brand or high-contrast theme remaps the neutral tokens, so the rule follows automatically; if you need a customized line, prefer overriding with tokens.colorNeutralStroke2 or tokens.colorNeutralStroke1 rather than literal colors so dark and high-contrast themes keep working. Density set on the parent Nav drives the spacing scale around the rule through spacing tokens such as tokens.spacingVerticalXS and tokens.spacingVerticalS, which is why the divider aligns with the links without per-instance spacing. Foreground and background tokens such as tokens.colorNeutralForeground2 and tokens.colorNeutralBackground1 govern the surrounding items, so verify that a rule still meets the 3:1 non-text contrast requirement when the drawer sits on a layered or brand-colored surface.

## Migration Notes

NavDivider has no direct equivalent in the previous major version of the library, where navigation hierarchy was expressed through a Nav component configured with groups of links and dividers were emulated with custom styles or raw markup. In v9 the navigation primitives were split apart: compose Nav, NavDrawer, NavItem, NavCategory and NavSubItem explicitly, then use NavDivider where you previously injected a styled rule, and NavSectionHeader where you previously used group headers. The component is imported from the main package entry point, so older code importing navigation pieces from the preview navigation package can be consolidated onto the single react-components import. Because the divider is contextual, markup that hard-coded separator heights or widths for a fixed nav width should be simplified to let the current Nav layout and density determine the rule's extent.

## Edge Cases

- A divider placed immediately before or after another divider (or at the very start or end of the nav) produces a doubled or orphaned rule; remove trailing dividers when the following group is empty or conditionally hidden.
- When the containing Nav collapses to an icon-only drawer, horizontal rules can look disproportionately wide or misaligned relative to the icon column; confirm the layout at every density and collapsed state.
- Custom border or outline styles applied to surrounding NavItems can visually merge with the divider line, making the grouping unreadable; keep item chrome and divider color distinct.
- In right-to-left layouts and in vertical orientations, the rule's extent depends on logical border properties, so hand-written left/right values will break; rely on the component's orientation instead.
- Because the divider is decorative, removing it for assistive technology does not remove the grouping obligation — if a visually separated group has no heading or landmark, the structure is lost for non-visual users.
- Density inherited from a parent Nav affects the whitespace on both sides of the rule, so a divider moved between two navs with different densities can change the surrounding rhythm without any prop change on the divider itself.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
