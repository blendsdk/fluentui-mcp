# NavCategory

> **Package**: `@fluentui/react-nav` v9.4.0
> **Import**: `import { NavCategory } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

NavCategory is a structural grouping primitive in the Fluent UI React v9 navigation family. It wraps a single top-level navigation entry together with the collapsible set of sub-entries that belong to it, and it is composed from sibling parts: a NavCategoryItem that renders the visible, focusable label row (typically with an icon), and a NavSubItemGroup that holds the nested NavSubItem links revealed when the category is expanded. NavCategory itself renders no visual surface of its own; it contributes semantics and the parent/child relationship that the surrounding Nav (or the Nav inside a NavDrawer, InlineDrawer, or OverlayDrawer) uses to manage selection, expansion state, and roving focus. Because it is a context consumer rather than a self-contained widget, a NavCategory must be rendered inside a Nav tree so that its required value is registered and matched against the Nav's selected value. Use it whenever a navigation area has more than one level of hierarchy, such as a product shell with grouped destinations, and use a plain NavItem when a destination has no children.

**When to use**: Use NavCategory when a navigation destination has one or more child destinations that should be revealed on demand, keeping the top-level list short and scannable. It is the correct choice for application shells, settings areas, documentation sidebars, and any left-rail navigation inside NavDrawer, InlineDrawer, or OverlayDrawer where destinations fall into expandable groups. Use a plain NavItem instead when the destination is a leaf with no children, and use NavSectionHeader or NavDivider when you only need a non-interactive label or visual break between groups of flat items. Do not use NavCategory for menus of actions (use Menu, MenuTrigger, and MenuItem) or for command surfaces (use Toolbar and ToolbarButton); NavCategory exists specifically for hierarchical page navigation where the child entries are links and the parent participates in the same selection and focus model as the rest of the Nav.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | No | Children of the NavCategory |
| `value` | `string` | — | Yes | Required value that identifies this item inside an Nav component. |

### Prop Guidance

- **value**: Required. A string that uniquely identifies this category inside the parent Nav and is used to match the Nav's selected value and to track which category is expanded. Derive it from a stable route identifier or constant rather than from an index or a freshly generated id, so state survives re-renders and client-side navigation. It must be unique across all values in the Nav, including the values used by sibling NavItem entries and other categories. `settings`
- **children**: The content of the category. In practice this is a NavCategoryItem that renders the header row plus a NavSubItemGroup that contains the nested NavSubItem entries. A category that omits the sub-item group cannot be expanded, and a category that omits the header item has no focusable target, so always provide both parts together. Children are evaluated in order, so render the header first and the sub-item group second. `A NavCategoryItem for the header followed by a NavSubItemGroup containing NavSubItem entries`

## Best Practices

### Do's

- Render NavCategory only as a descendant of a Nav (including a Nav hosted inside NavDrawer, InlineDrawer, or OverlayDrawer) so its required value is registered in the navigation tree.
- Give every NavCategory a value that is unique across the whole Nav, because duplicate values make selection and expansion state ambiguous.
- Compose the category from a NavCategoryItem for the header row and a NavSubItemGroup containing NavSubItem entries for the children, so the expand/collapse affordance and the nested list semantics are both present.
- Keep the value stable across renders (derive it from a route id or a constant), rather than generating a new value each render, so the selected category is not lost on re-render.
- Keep the category label short and parallel with sibling labels so the navigation rail stays scannable at every nesting level.
- Limit nesting to a single level of children inside NavSubItemGroup; deeper hierarchies should be modeled as separate pages or sections.
- Order categories so the most frequently used destinations appear first, and keep the number of top-level categories small enough that the collapsed rail fits without scrolling.

### Don'ts

- Do not render NavCategory outside a Nav; without the parent context the value has no meaning and selection state cannot be tracked.
- Do not place NavSubItem entries directly as children of NavCategory without wrapping them in a NavSubItemGroup, because the group provides the nested list container and its expand/collapse behavior.
- Do not reuse the same value on two categories or on a category and a sibling NavItem, since the Nav matches selection by value.
- Do not use NavCategory for a leaf destination that has no children; an expandable affordance that never expands is misleading. Use NavItem instead.
- Do not nest a NavCategory inside another NavCategory's sub-item group to fake multi-level trees; only one level of children is intended.
- Do not hardcode colors, spacing, or font sizes on the category's parts; rely on theme tokens so the navigation adapts to brand and to high-contrast themes.
- Do not hide the category's sub-items with your own conditional rendering tied to unrelated state, because the parent Nav already owns the expanded/collapsed state.

## Anti-Patterns

### Category rendered outside of a Nav

❌ NavCategory relies on the parent Nav to register its value and to drive selection and expansion. Rendered standalone, the value is meaningless, no selection state can be matched, and the item may not receive proper list semantics or roving focus.

✅ Always render NavCategory as a descendant of a Nav, including when that Nav lives inside NavDrawerBody or another drawer body. If you only need a visual grouping outside a navigator, use NavSectionHeader or Divider instead.

### Sub-items left outside the sub-item group

❌ Placing NavSubItem entries directly under NavCategory skips the group container that owns the nested list semantics and the reveal behavior, so the children cannot be announced as a level of the hierarchy and may be permanently visible.

✅ Wrap the nested entries in a NavSubItemGroup and pair it with the NavCategoryItem header, so the header toggles the group and assistive technology reports the correct depth.

### Duplicate or unstable values

❌ Because selection and expansion are matched by value, reusing the same value on two categories, or generating a new value on every render, breaks selection highlighting and can cause the wrong category to appear expanded.

✅ Assign each category a unique, stable value derived from the destination it represents, and assert uniqueness across the whole navigation tree during development.

### Using a category for a leaf destination

❌ A category that never contains sub-items still presents an expandable affordance, which forces users to activate something that does nothing and adds noise to the navigation.

✅ Use a plain NavItem for destinations without children, and reserve NavCategory for entries that genuinely expand into additional destinations.

### Manual show and hide of a category's sub-items

❌ Reimplementing expansion with your own state duplicates the state already owned by the navigation tree, producing two sources of truth that desynchronize keyboard navigation, aria-expanded, and the rendered list.

✅ Let the Nav manage expansion by providing the NavCategoryItem and NavSubItemGroup parts, and drive any programmatic navigation from the value rather than from local visibility state.

## Accessibility

**Requirements**: NavCategory participates in a list-based navigation structure, so the parent Nav must render real list semantics with each category and its sub-items as list items, and the category header row rendered by NavCategoryItem must be a real button so it is reachable by keyboard and announced as interactive. Preserve the visible focus indicator supplied by the theme (tokens.colorStrokeFocus2 with tokens.strokeWidthThick) and never remove it. Every category must expose a programmatically determinable name, either from its visible text content or from an aria-label when the label is visually hidden in a collapsed rail. Expansion state must be conveyed programmatically, not only with a rotating chevron, and the associated sub-item group must be discoverable from the toggle. Text must meet the WCAG contrast minimums in both rest and selected states, and the navigation must remain fully operable at 200% zoom and with a keyboard only.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into and out of the navigation region; the parent Nav keeps a single tab stop so the user tabs past the whole navigator rather than through every item. |
| `Enter` | Activates the focused NavCategoryItem, toggling the category open or closed and navigating to the category destination when it is rendered as a link. |
| `Space` | Performs the same activation as Enter on the focused category header button. |
| `ArrowDown` | Moves focus to the next navigation item in the tree, including into an expanded category's sub-items. |
| `ArrowUp` | Moves focus to the previous navigation item in the tree. |
| `ArrowRight` | In a vertical navigation, moves focus from the category header into its expanded sub-item group; in a horizontal navigation, moves to the next top-level item. |
| `ArrowLeft` | In a vertical navigation, moves focus from a sub-item back out to its parent category header; in a horizontal navigation, moves to the previous top-level item. |
| `Home` | Moves focus to the first item in the navigation when the parent Nav uses roving focus. |
| `End` | Moves focus to the last item in the navigation when the parent Nav uses roving focus. |

**ARIA**: aria-expanded on the category header button, reflecting whether the NavSubItemGroup is currently revealed, aria-controls linking the category header button to the id of its NavSubItemGroup, aria-current set on the active NavCategoryItem or NavSubItem so the current page is announced, aria-label on the category header button when the visible label is hidden in a collapsed or icon-only navigation rail, aria-disabled on a category whose destination is temporarily unavailable, list, listitem, and group roles contributed by the surrounding Nav, NavCategory, and NavSubItemGroup so the hierarchy depth is announced

**Screen Reader**: A screen reader encounters the category as an item in a navigation list whose header is an expandable button. The accessible name is read from the visible label, and the expanded or collapsed state is announced from the header button's expanded state together with its relationship to the controlled sub-item group. Activating the header announces the state change, after which the revealed NavSubItem entries are read as nested list items at the next level, with the current destination identified by its current-page indication. In an icon-only or collapsed navigation rail, the accessible name comes from the aria-label on the category header button, so the label must still fully describe the destination even when the visible text is hidden.

## Styling

NavCategory renders no visual surface, so all styling work happens on its parts and on the parent Nav. Restyle the category header through the NavCategoryItem it contains and the nested entries through NavSubItem, using theme tokens rather than literal values: tokens.spacingHorizontalM and tokens.spacingHorizontalL for the horizontal padding of the header row, tokens.spacingVerticalS and tokens.spacingVerticalXS for vertical rhythm, tokens.borderRadiusMedium for hover and selected backgrounds, tokens.fontSizeBase300 with tokens.fontWeightSemibold for the category label, and tokens.colorNeutralForeground2 with tokens.colorNeutralForeground2Hover and tokens.colorNeutralForeground2Pressed for label color transitions. Match the theme's motion by animating the chevron and the reveal with tokens.durationNormal and tokens.curveEasyEase so expansion feels consistent with the rest of Fluent. Because the navigation rail must stay legible, keep the sub-item indentation derived from the same spacing scale the category uses (for example tokens.spacingHorizontalXXL) instead of an arbitrary pixel offset. When you need to restyle the entire navigation consistently, prefer overriding theme tokens on the surrounding FluentProvider so every category, sub-item, and divider updates together rather than styling one category in isolation.

## Performance

NavCategory is a lightweight structural wrapper that adds essentially no rendering cost; the meaningful cost comes from the number of NavSubItem entries it holds. Keep the number of entries in each category modest and avoid defining the children array inline in a way that creates new component identities on every render, since that forces React to unmount and remount the sub-items and resets any of their internal state. Do not conditionally unmount the category's sub-item group yourself to 'save work'; the navigation tree already keeps collapsed groups cheap, and remounting them on every expansion is more expensive than leaving the structure in place. When the navigation rail can collapse to icons, avoid rendering the full sub-item list twice for two layouts; render one tree and let tokens handle the visual differences.

## Theming & Tokens

NavCategory inherits everything from the Fluent theme supplied by FluentProvider, so switching between webLightTheme, webDarkTheme, and high-contrast variants restyles the whole hierarchy without component changes. The header row rendered by NavCategoryItem draws its idle label color from tokens.colorNeutralForeground1 or tokens.colorNeutralForeground2, hover from tokens.colorNeutralForeground2Hover over tokens.colorNeutralBackground1Hover, pressed from tokens.colorNeutralForeground2Pressed over tokens.colorNeutralBackground1Pressed, and selected emphasis from tokens.colorCompoundBrandForeground1 with tokens.colorCompoundBrandStroke. Nested NavSubItem entries use the same neutral ramp at a lighter weight, with selected state from tokens.colorNeutralBackground1Selected and tokens.colorNeutralForeground1Selected. Focus rings come from tokens.colorStrokeFocus2 at tokens.strokeWidthThick, spacing from tokens.spacingHorizontalM, tokens.spacingHorizontalL, tokens.spacingVerticalS, and tokens.spacingVerticalXS, and type from tokens.fontSizeBase300, tokens.lineHeightBase300, and tokens.fontWeightSemibold. Motion for the chevron rotation and group reveal uses tokens.durationNormal and tokens.curveEasyEase; overriding those tokens in the provider is the supported way to brand the navigation.

## Edge Cases

- NavCategory is not standalone: outside a Nav context its required value cannot be matched to a selection, so the category renders without selection or expansion tracking. Tests and stories must always wrap it in a Nav.
- Collapsed and icon-only navigation rails hide the visible label, so the header button still needs an accessible name; provide one explicitly rather than relying on hidden text that is removed from the accessibility tree.
- If a category's value collides with a sibling NavItem's value, the selected item highlighted in the rail may not be the one the user navigated to, because selection is resolved by value rather than by position.
- A NavSubItemGroup that is rendered without a matching NavCategoryItem header leaves nested links reachable only by direct tabbing, with no toggle or expanded-state announcement to explain the hierarchy.
- Deeply nested destinations are not supported beyond one level of children, so hierarchies that must go deeper need to be flattened or split across separate navigation areas.
- The category value must remain stable while routing between its sub-items; regenerating it on navigation collapses the category the user is currently browsing.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
