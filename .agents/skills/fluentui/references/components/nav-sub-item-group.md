# NavSubItemGroup

> **Package**: `@fluentui/react-nav` v9.4.0
> **Import**: `import { NavSubItemGroup } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

NavSubItemGroup is a structural container in the Fluent UI React v9 Nav family that wraps a collection of NavSubItem elements belonging to an expanded NavCategoryItem. It renders a required root slot (a div) and an optional collapseMotion slot (a PresenceMotionSlotProps carrying NavSubItemGroupCollapseMotionParams) so that the entire block of nested sub-links expands and collapses as one animated unit when the parent category is toggled. The component is intentionally non-interactive: it holds no selection, focus, or expansion state of its own. Instead it participates in the Nav context, reading category and category-item context values supplied by the surrounding Nav and NavCategoryItem, and it lays out its children in DOM order beneath the category header. Because it is a pure grouping primitive, nearly all behavior you observe in it — which category is open, which item is selected, whether categories can be open simultaneously, and how dense the links are — is owned by the parent Nav through its own props and events. Use NavSubItemGroup only as the second level of a two-tier navigation model.

**When to use**: Use NavSubItemGroup when you are building a multi-level navigation region with Nav and have one or more NavCategoryItem entries whose destinations should be revealed only when that category is expanded. It is the correct wrapper for the nested NavSubItem elements and gives you a single styling and motion target for the whole nested block. Do not use it as a generic accordion or disclosure panel — that is the job of Accordion, AccordionItem, and AccordionPanel. Do not use it for top-level destinations; those are NavItem elements placed directly inside Nav. Do not use it as a general-purpose list container (use List and ListItem) or as a way to group unrelated content such as actions, badges, or descriptions. If your information architecture needs more than two levels of depth, NavSubItemGroup is not the right primitive and a Tree or FlatTree pattern should be considered instead, because the Nav family is explicitly a two-tier model of items and sub-items.

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

- **root**: The required root slot renders the div that wraps all nested sub-items. Use it to attach a custom class name, id, data attribute, or extra ARIA passthrough when the surrounding Nav markup needs to target this specific tier. Keep its styles limited to indentation, spacing, and background so the collapse animation's height calculation stays accurate. `div (default), with className or data-* attributes merged onto the slot`
- **collapseMotion**: Optional slot that controls how the group animates when its category is opened or closed. It carries PresenceMotionSlotProps parameterized with NavSubItemGroupCollapseMotionParams, so the slot receives information about the collapse transition and can be overridden or disabled when you need instant reveal — for example inside a very tall menu or when a custom motion theme is in use. In most applications the default motion is correct and should be left untouched. `default presence motion; override only to disable or retune the collapse transition`
- **children**: The nested content of the group, which should consist of second-tier navigation entries created from the Nav sub-item primitives. Order the children the same way the destinations should be read by assistive technology, and avoid placing decorative or non-navigational elements among them. `one or more sub-item entries, in reading order`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `collapseMotion` | — | No | Collapse motion slot |
| `root` | — | Yes | The root element |

## Best Practices

### Do's

- Place one NavSubItemGroup inside the NavCategoryItem whose sub-destinations it contains, so the expand/collapse relationship between the category header and the nested block stays one-to-one.
- Render only NavSubItem children directly inside the group; the group is a container for the second tier of the navigation hierarchy.
- Use one NavSubItemGroup per category rather than splitting a category's sub-links across several groups, so a single category toggle reveals a single coherent block.
- Lean on the Nav-level density prop to make nested items compact in space-constrained surfaces such as a NavDrawer, instead of overriding per-item padding yourself.
- Customize the group through the root slot — for example, attaching a Griffel class name, a data attribute for tests, or an id — rather than wrapping the group in extra divs that break the collapse measurement.
- Keep the number of nested NavSubItem entries small and ordered by importance, since a collapsed group is invisible and long groups push unrelated top-level destinations out of view.
- Let the collapseMotion slot handle expand/collapse animation; it respects the motion preferences of the FluentProvider theme and keeps the reveal consistent with other Nav transitions.
- Drive open and closed state from the Nav's openCategories (controlled) or defaultOpenCategories (uncontrolled) props so that the group's visibility stays in sync with the category header's state.

### Don'ts

- Do not render a NavSubItemGroup outside of a Nav and NavCategoryItem combination; without the category context the group has no expansion state or indentation baseline to work from.
- Do not nest a NavSubItemGroup inside another NavSubItemGroup to reach a third level — the Nav family supports exactly two tiers and deeper nesting produces undefined layout and keyboard order.
- Do not put NavItem, arbitrary buttons, dividers, or free-form content inside the group; only sub-items belong there, and mixing tiers confuses both visual hierarchy and assistive technology.
- Do not attach selection or expansion handlers to the group itself; selection is reported through the Nav's onNavItemSelect and category toggles through onNavCategoryItemToggle.
- Do not hide and show the group with ad-hoc CSS such as display none or visibility hidden, because that bypasses the collapse motion slot and can leave the parent category header's expanded state out of sync with what is actually visible.
- Do not apply large margins or transforms to the root slot that would interfere with the animated height calculation during expand and collapse.
- Do not hardcode colors or paddings on the group when the surrounding Nav, NavDrawer, or NavCategoryItem already supplies themed values; doing so breaks dark and high-contrast themes.
- Do not assume the group places itself in the tab order; it is a passive container and never receives focus on its own.

## Anti-Patterns

### Using the group as a standalone accordion

❌ NavSubItemGroup has no independent open or closed state; it reads category context supplied by Nav and NavCategoryItem. Rendered on its own it never expands, collapses, or indents correctly, and the surrounding navigation semantics are missing entirely.

✅ Compose a real navigation hierarchy: place NavCategoryItem inside Nav, and put the NavSubItemGroup inside that category so the category header owns the expanded state and the group animates in response.

### Nesting groups to build a third level

❌ The Nav family models exactly two tiers. Stacking NavSubItemGroup inside NavSubItemGroup produces visual indentation with no corresponding state, keyboard order, or screen reader structure, and the inner group will not respond to any category toggle.

✅ Flatten the hierarchy to two levels, or switch to a hierarchical pattern such as Tree and TreeItemLayout when the content genuinely needs deeper nesting.

### Hand-rolling visibility with CSS

❌ Toggling display, visibility, or a custom height on the group's root takes control away from the collapseMotion slot. The animation stutters or disappears, and the parent category header can report an expanded state while the content is actually hidden, which is misleading to assistive technology.

✅ Drive visibility from Nav's openCategories or defaultOpenCategories state and let the collapseMotion slot perform the reveal, so visual state, announced state, and animation stay synchronized.

### Mixing tiers inside the group

❌ Putting top-level destinations, action buttons, or free-form text among the nested entries collapses the distinction between primary and secondary navigation and makes it impossible for users to predict where in the hierarchy they are.

✅ Keep only second-tier navigation entries in the group. Promote top-level destinations to NavItem directly under Nav, and move actions into a dedicated surface such as a menu or footer.

### Overriding spacing per item instead of using density

❌ Individual padding overrides on nested entries fight the density scale managed by Nav, producing inconsistent rhythm between categories and making it impossible to switch the whole navigation to a compact layout.

✅ Set density on the enclosing Nav and use spacing tokens on the group's root slot for the tier indentation, leaving individual item metrics to the design system.

## Accessibility

**Requirements**: NavSubItemGroup is a presentational grouping container, so the accessibility burden sits with the surrounding Nav and NavCategoryItem: the category header must expose its expanded or collapsed state, and each nested NavSubItem must expose its own selected state and accessible name. Maintain a minimum 3:1 contrast for the interactive sub-item text and focus indicators and 4.5:1 for body-sized link text against the Nav surface (WCAG 1.4.3 and 1.4.11). Never place focusable content in the group that is hidden while the category is collapsed, and make sure the collapsed block is removed from the accessibility tree so screen reader users do not encounter invisible destinations. If the group contains only sub-items of the same category, no additional landmark or role is required on the group itself.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the Nav region and then through the focusable elements in DOM order; the group itself is never a tab stop, so focus lands on the category header or the nested NavSubItem links when the category is expanded. |
| `Enter` | Activates the focused NavSubItem when it is rendered as a link, navigating to its href. |
| `Space` | Activates the focused NavSubItem when it is rendered as a button, and toggles the parent NavCategoryItem when the category header has focus. |
| `Escape` | May be handled by an enclosing overlay such as NavDrawer or Drawer to dismiss the navigation surface; the group does not intercept it. |
| `Home / End` | Not implemented by the group; page or list-level behavior applies because the group does not own a composite widget role. |

**ARIA**: aria-current, aria-expanded (on the parent NavCategoryItem that controls the group), aria-label / aria-labelledby (on the enclosing Nav landmark), aria-hidden or removal from the DOM for the collapsed group's contents

**Screen Reader**: Assistive technology announces the category header first, including whether it is expanded, and then reads the nested NavSubItem entries of the group in DOM order. Because the group adds no role or name of its own, users hear a flat sequence of navigation links with their selected state announced via aria-current; the only grouping cue is the indentation and the preceding category header. When a category is collapsed, its NavSubItemGroup contents should be absent from the accessibility tree so that screen reader users are not presented with links they cannot see, and expanding the category should announce the newly revealed set of items in the order they appear.

## Styling

Style NavSubItemGroup through its root slot and let the enclosing Nav, NavCategoryItem, and NavDrawer supply the base look. A common pattern is to give the root a left inset for the second tier using a spacing token such as tokens.spacingHorizontalL or tokens.spacingHorizontalXXL and vertical breathing room with tokens.spacingVerticalXXS, then let each NavSubItem render its own hover pill with tokens.colorNeutralBackground1Hover, tokens.colorNeutralForeground1Hover for text, and tokens.borderRadiusMedium. Selected sub-items typically use tokens.colorNeutralForeground2Selected or tokens.colorBrandForeground2 with tokens.colorBrandBackground2 as the highlight fill, while resting text uses tokens.colorNeutralForeground2 against a surface of tokens.colorNeutralBackground1 or tokens.colorNeutralBackground2. If you need a separator between tiers, prefer tokens.strokeWidthThin with tokens.colorNeutralStroke3 over a hardcoded border. The collapseMotion slot is where motion feels right: it consumes the theme's durations and curves (tokens.durationNormal, tokens.curveDecelerateMid, tokens.curveAccelerateMin, tokens.curveEasyEase), so leaving it as the default keeps expansion in step with the rest of Fluent. Avoid setting an explicit height or overflow on the root, since that fights the animated height used during expand and collapse, and avoid animating the group yourself with custom keyframes because the theme already negotiates reduced-motion behavior.

## Performance

The group itself is a thin wrapper, so its cost is dominated by how many sub-items you render and whether the collapse motion component is mounted. Because a collapsed category is not visible, rendering large hidden sub-trees wastes reconciliation work on every Nav state change; where a category has many entries, consider mounting the group's children only once the category has been opened at least once, while still letting the collapseMotion slot handle the transition. Keep the children array referentially stable when it is derived from data so memoized sub-items are not recreated on each render, and avoid constructing slot objects inline for root or collapseMotion, since new object identities force slot re-merging. If the Nav has dozens of categories, prefer controlled openCategories so that toggling one category does not trigger unnecessary re-renders of unrelated groups, and avoid reading layout in render since the collapse motion measures height during transitions.

## Theming & Tokens

NavSubItemGroup inherits everything it displays from the FluentProvider theme and the Nav tokens applied by its parent. Nested entries read text and icon colors from tokens.colorNeutralForeground2 at rest, tokens.colorNeutralForeground1Hover or tokens.colorNeutralForeground2Hover on hover, and tokens.colorNeutralForeground2Selected or tokens.colorBrandForeground2 when marked current, with backgrounds drawn from tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground2, and tokens.colorBrandBackground2. The tier's indentation and padding should be expressed with spacing tokens such as tokens.spacingVerticalXS, tokens.spacingHorizontalM, and tokens.spacingHorizontalL rather than raw pixel values, and any divider between tiers should use tokens.colorNeutralStroke3 with tokens.strokeWidthThin. Motion comes from the collapseMotion slot, which draws on tokens.durationNormal, tokens.durationFast, tokens.curveDecelerateMid, tokens.curveAccelerateMin, and tokens.curveEasyEase so that expand and collapse match the rest of the product and automatically shorten under a reduced-motion theme. In high-contrast themes the hover and selected fills are replaced by system colors supplied through the same token names, so never hardcode hex values on the group. FluentProvider direction also matters: indentation applied to the root slot should use logical spacing values so right-to-left layouts mirror correctly.

## Migration Notes

NavSubItemGroup is new in Fluent UI React v9 and has no direct v8 counterpart; v8 navigation was typically hand-built from links and custom expand/collapse markup. When porting, replace manual nested link lists with Nav, NavCategoryItem, NavSubItemGroup, and NavSubItem, and move any per-category open state you tracked manually onto the Nav's openCategories or defaultOpenCategories props. Selection handling previously done with click listeners on individual anchors should move to onNavItemSelect, and category toggling to onNavCategoryItemToggle. Because the group is engine-driven, remove leftover CSS that toggles height or display on nested lists, and re-express indentation and density using Nav's density prop plus the spacing tokens applied to the root slot.

## Edge Cases

- Rendering a NavSubItemGroup without an ancestor Nav and NavCategoryItem means the category and category-item context values it depends on are absent, so the group will not expand, collapse, or align with the category header.
- Only two tiers are supported: placing the group inside another group, or placing top-level NavItem elements inside it, produces an undefined hierarchy that neither the styling nor the keyboard order is designed to handle.
- When openCategories is controlled, forgetting to update the array in onNavCategoryItemToggle leaves the category header and the group's visibility permanently out of sync, and the group can appear stuck open or closed.
- Repeatedly toggling a category while the collapse motion is mid-flight can interrupt the transition; the height is remeasured on each pass, so avoid changing the number of children during the animation or the panel may visibly jump.
- Under a reduced-motion theme the collapseMotion slot still exists but the transition is compressed or removed, so do not build logic that depends on a fixed animation duration or a transition-end event.
- Nested groups are hidden from view when their category is collapsed, so any focus management that assumes the group's contents are always mounted must be adjusted to avoid moving focus into invisible sub-items.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
