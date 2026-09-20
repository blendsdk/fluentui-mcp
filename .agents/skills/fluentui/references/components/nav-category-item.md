# NavCategoryItem

> **Package**: `@fluentui/react-nav` v9.4.0
> **Import**: `import { NavCategoryItem } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

NavCategoryItem is the expandable category header inside a Nav. It renders a category row that contains an optional leading icon, a category label, and a trailing expandIcon, and it acts as the toggle that opens and closes the associated NavSubItemGroup of NavSubItem children. Because the row is interactive, it is rendered as a button by default — or as a link when an href is supplied — so it can be focused, activated by pointer, keyboard, or assistive technology. NavCategoryItem is always used together with NavCategory, which owns the open/closed state for its sub-items and which supplies the categoryValue and navCategoryItem context values that flow down into the item. Selection and expansion are coordinated at the Nav level through the value and onNavCategoryItemToggle communication model, and the item participates in the Nav roving-tabindex system through the tabbable prop. Appearance, density, and iconography are all theme-driven so a NavCategoryItem will match the surrounding Nav, NavDrawer, and NavSubItem content automatically.

**When to use**: Use NavCategoryItem when a navigation region needs collapsible sections — a top-level label whose children are NavSubItem entries revealed only when the user expands the category. Typical cases are an application shell sidebar (NavDrawer) with grouped destinations, a settings or admin navigation with deep hierarchies, or any nav where showing every leaf at once would overwhelm the user. Prefer NavItem when the destination has no children and does not need expand/collapse behavior; prefer NavCategory + NavCategoryItem + NavSubItemGroup only when there is a genuine second level. For hierarchical content exploration that is not primary navigation (for example a folder tree in a pane), use Tree and TreeItem instead, since Tree implements the full treegrid/tree keyboard model. NavCategoryItem is not intended as a standalone control outside of Nav or NavDrawer — it depends on Nav category context to expand, collapse, and report selection.

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

- **value**: Required identity for the category item. The Nav uses it for selection comparisons and for the controlled openCategories list, so it must be unique within the Nav and stable across renders. Avoid deriving it from a translated label. `value: 'settings'`
- **href**: Supply only when the category header itself navigates to a real URL. When href is present the root renders as a link instead of a button, so the expand affordance competes with navigation — if the category exists purely to group children, omit href and let the item act as a pure toggle. `href: '/reports'`
- **icon**: Optional leading glyph rendered before the label. Pass a small Fluent icon and mark it decorative; use icons consistently across sibling categories so the leading column aligns with NavItem icons. `icon: a 20px Fluent icon element`
- **expandIcon**: Required trailing slot that shows open vs. closed state. The default chevron from the Fluent icon set is correct for nearly all cases; override only to match a product icon language, and never remove the expandability cue entirely. `expandIcon: default ChevronRight / ChevronDown glyph`
- **expandIconMotion**: Customizes the presence/rotation animation that plays when the expandIcon changes state. Provide a slower or gentler duration when the surrounding app uses reduced motion or a heavier motion language. `expandIconMotion: presence motion slot with a rotate transition`
- **children**: The content of the category header — normally the text label, and the NavSubItem entries that represent the category's destinations. Keep the visible label short and single-line. `children: 'Settings' label plus NavSubItem links`
- **root**: The rendered root element, already typed as a button (or link when href is supplied). Override through the slot only to change the element or add positioning styles, not to replace the interactive semantics. `root: default button element`
- **tabbable**: Controls whether this category item sits in the page tab sequence. Exactly one nav item should be tabbable at a time; leave the default and let Nav manage roving tabindex unless you are implementing your own focus management. `tabbable: true for the currently focused nav item only`
- **categoryValue**: Context value injected by the parent NavCategory; it carries the category identity and open state down to the item. Read it only from inside the component or an equivalent context consumer — do not pass it manually. `categoryValue: supplied by NavCategory context`
- **navCategoryItem**: Context value describing the NavCategoryItem itself (such as its registered value and interaction handlers). It is consumed internally and by NavSubItem for coordination; do not set it directly. `navCategoryItem: supplied by NavCategoryItem context`
- **openCategories**: On the parent Nav, the controlled list of category values that are currently expanded. Use with onNavCategoryItemToggle when open state must be persisted or driven by routing. `openCategories: ['settings']`
- **defaultOpenCategories**: On the parent Nav, the initially expanded categories for uncontrolled usage. Use this for the common case of a category that should start expanded, such as the section containing the current route. `defaultOpenCategories: ['settings']`
- **onNavCategoryItemToggle**: On the parent Nav, fires with the affected category data when a NavCategoryItem is expanded or collapsed. Use it to sync the open set with persisted UI state or analytics. `onNavCategoryItemToggle: update openCategories state`
- **multiple**: On the parent Nav, allows more than one category to be open simultaneously. Set false for accordion-style navigation and true when users compare across categories. `multiple: true`
- **density**: On the parent Nav, sizes the category rows for compact or comfortable layouts. Keep it consistent across the whole Nav so category and sub-item rows stay aligned. `density: 'small'`
- **onNavItemSelect**: On the parent Nav, reports destination selection together with the selected value. Use it to route or to reflect the current page in selectedValue. `onNavItemSelect: navigate to the selected value`
- **selectedValue**: On the parent Nav, the controlled value of the selected leaf item (NavItem or NavSubItem). Pair with defaultSelectedValue for uncontrolled usage. `selectedValue: 'settings/general'`
- **selectedCategoryValue**: On the parent Nav, the controlled value of the selected category, useful when the category header itself is the current destination rather than one of its children. Pair with defaultSelectedCategoryValue for uncontrolled usage. `selectedCategoryValue: 'settings'`
- **navItem**: Shared content slot from the Nav item composition that renders the inner row (icon plus label). Override through the slot only for custom layout inside the row. `navItem: default row rendering`
- **actionButton / toggleButton / menuButton**: Optional trailing action, toggle, or menu slots from the Nav item composition for advanced rows that expose extra controls. Add them sparingly — each one competes with the expand affordance for attention and adds another tab stop. `actionButton: a small icon button for a secondary action`
- **actionButtonTooltip / toggleButtonTooltip / menuButtonTooltip**: Tooltip slots that label the corresponding trailing buttons when they are icon-only. Provide them whenever a trailing button's meaning is not obvious from its glyph. `actionButtonTooltip: 'Pin category'`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `expandIcon` | — | Yes | Expand icon slot rendered after the content to indicate an open and closed state. |
| `expandIconMotion` | — | No | Expand icon motion slot. |
| `icon` | — | No | Icon that renders before the content. Should be specific to each Category |
| `root` | — | Yes | The root element |

## Best Practices

### Do's

- Always wrap NavCategoryItem in a NavCategory and give both the same value so the category context, the expand/collapse state, and the selected value stay in sync.
- Give the category Item a meaningful, stable value, especially when href is not provided, because the Nav selection model compares values rather than rendered labels.
- Provide an icon slot when sibling categories also have icons so the leading column stays aligned; icons should be specific to the category content they represent.
- Keep the expandIcon default unless you have a product-wide reason to change it — it communicates open/closed state and animates through the expandIconMotion slot.
- Control openCategories together with onNavCategoryItemToggle when the open state must be persisted (for example, restoring the last expanded section from a user preference).
- Let multiple be false for accordion-style navigation where only one category may be open at a time, and true when users are likely to compare content across categories.
- Respect the density setting used by the parent Nav so NavCategoryItem height and padding line up with the sibling NavItem and NavSubItem rows.

### Don'ts

- Don't place NavSubItem children directly inside a plain NavItem — use NavCategoryItem so the expand affordance, aria-expanded state, and roving tabindex are wired correctly.
- Don't put a long paragraph or multi-line descriptive text in the category label; NavCategoryItem is a single-line row and truncation or wrapping will break the expand icon alignment.
- Don't nest a category more than one level deep — NavSubItems are leaves, so a NavCategoryItem inside a NavSubItemGroup is not a supported hierarchy.
- Don't hand-roll a click handler that toggles visibility of sub-items yourself; let NavCategory and onNavCategoryItemToggle own that state to avoid double toggling.
- Don't set tabbable to true on several NavCategoryItems at once — only one nav item belongs in the tab order at a time; the rest are reached with arrow keys.
- Don't use NavCategoryItem as a generic disclosure for non-navigation content such as filters or settings panels; use Accordion or a Drawer instead.

## Anti-Patterns

### Navigating and expanding from the same control

❌ Passing href on a NavCategoryItem that also has children makes activation ambiguous: the user expects the row to expand, but it navigates away, so the sub-items become unreachable by pointer.

✅ Keep href off grouping categories and let the item act purely as a toggle, or move the destination into a child NavSubItem so navigation and expansion are separate interactions.

### Manually toggling sub-item visibility

❌ Wrapping NavSubItems in custom show/hide state bypasses the NavCategory open state, so aria-expanded, the expandIcon rotation, and the openCategories model all disagree with what is on screen.

✅ Let NavCategoryItem and NavCategory manage expansion, and use openCategories / defaultOpenCategories with onNavCategoryItemToggle when you need external control.

### Icon-only category without an accessible name

❌ Removing the text label and relying on the icon alone leaves the button with no accessible name, and screen reader users cannot tell which category they are expanding.

✅ Keep the visible text label, or supply an aria-label on the root slot that matches the visible category name.

### Treating NavCategoryItem as a plain NavItem

❌ Using NavCategoryItem for a leaf destination adds a chevron and an expanded state that never change, misleading users into expecting children.

✅ Use NavItem for leaf destinations with no children, and reserve NavCategoryItem for rows that actually reveal a NavSubItemGroup.

### Deeply nested categories

❌ Placing a NavCategoryItem inside a NavSubItemGroup creates an unrecorded nesting level that breaks roving tabindex and makes the hierarchy impossible to convey audibly.

✅ Restrict the hierarchy to one category level plus leaf NavSubItems; if more depth is required, restructure the information architecture or use Tree.

## Accessibility

**Requirements**: NavCategoryItem must remain operable by keyboard and expose its expanded state. WCAG 2.1 requires that all functionality be available from a keyboard (2.1.1), that focus be visible (2.4.7), and that name, role, and state be programmatically determinable (4.1.2) — this means the rendered root must expose an accessible name (the visible label or an aria-label when the label is icon-only) and must report aria-expanded for the category state. When href is provided the root becomes a link and must meet link color-contrast expectations; when it is omitted the root is a button and must be reachable and activatable with both Enter and Space. Decorative icon and expandIcon content must be hidden from the accessibility tree so the accessible name is not polluted.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into or out of the Nav; only the item with tabbable set to true is in the tab sequence. |
| `ArrowDown` | Moves focus to the next nav item in the Nav (handled by the Nav roving-tabindex system), including across category boundaries when the category is open. |
| `ArrowUp` | Moves focus to the previous nav item in the Nav. |
| `ArrowRight` | Expands the focused category to reveal its NavSubItemGroup when the Nav is horizontal (or moves into the group in vertical layouts, as configured by the Nav). |
| `ArrowLeft` | Collapses the focused category and hides its NavSubItemGroup. |
| `Enter` | Activates the category item — toggles the category open or closed, or follows the href when the item is rendered as a link. |
| `Space` | Activates the category item in the same way as Enter when the root is rendered as a button. |
| `Home` | Moves focus to the first nav item in the Nav. |
| `End` | Moves focus to the last nav item in the Nav. |

**ARIA**: aria-expanded, aria-current, aria-label, aria-disabled, aria-hidden (on decorative icon and expandIcon glyphs), aria-controls (when the category item references its NavSubItemGroup)

**Screen Reader**: Because the root renders as a native button (or an anchor when href is set), screen readers announce it as a button or link with its accessible name taken from the category label. As the user expands and collapses the category, the state change is conveyed through aria-expanded rather than through re-announcement of the icon, so the expandIcon itself should be hidden decoratively. Selected destinations are announced as the current item via aria-current on the corresponding NavItem or NavSubItem, letting users understand both which category is expanded and which leaf is active. When the Nav is inside a NavDrawer, opening the drawer should move virtual focus into the nav so the first tabbable nav item is read first.

## Styling

Target the root slot to adjust the row: use tokens.spacingHorizontalSNudge for the leading icon gap, tokens.spacingVerticalSNudge for vertical padding so the row height matches sibling NavItem rows, and tokens.borderRadiusMedium for the hover/focus pill shape. Hover and pressed states read from tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed, while the expanded/selected category typically uses tokens.colorNeutralBackground2Selected or tokens.colorNeutralForeground1 for the label. Set the label color with tokens.colorNeutralForeground2 and the selected state with tokens.colorNeutralForeground1; brand-flavored navigation can substitute tokens.colorBrandBackground2Hover and tokens.colorCompoundBrandForeground1. The expandIcon is sized by tokens.fontSizeBase200 and colored with tokens.colorNeutralForeground2, and its transition is driven through the expandIconMotion slot using tokens.durationUltraFast with tokens.curveEasyEase so the chevron rotation stays consistent with the rest of Fluent. Compact navigation should consume tokens.spacingVerticalXS and the smaller font tokens.fontSizeBase200 / tokens.lineHeightBase200 exposed through the density prop rather than hard-coded padding.

## Performance

NavCategoryItem is cheap by itself, but each instance registers with the parent Nav for selection and open-category bookkeeping, so very large navigations (hundreds of categories and sub-items) should be virtualized or restructured into multiple Navs to avoid long render and reconciliation passes when openCategories changes. Because expansion is stateful, toggling a category re-renders that category's subtree; keep NavSubItem subtrees light and memoize any expensive custom content placed in the children. The expandIconMotion slot animates a small, compositor-friendly transform, so it does not cause layout thrash, but disabling motion on very low-end targets or under reduced-motion preferences avoids unnecessary animation work when users expand and collapse categories rapidly. Avoid recreating the value strings and icon elements on every render so the Nav's selection comparisons and any memoized children stay referentially stable.

## Theming & Tokens

NavCategoryItem draws almost all of its appearance from theme tokens, so it automatically responds to the active theme, brand ramp, and high-contrast mode. Label text uses tokens.colorNeutralForeground2 and darkens to tokens.colorNeutralForeground1 for the selected or expanded category; hover and pressed backgrounds come from tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed, and the resting selected surface uses tokens.colorNeutralBackground2Selected. Brand-flavored navigation swaps those for tokens.colorBrandBackground2 and tokens.colorCompoundBrandForeground1. Shape and rhythm come from tokens.borderRadiusMedium, tokens.spacingHorizontalSNudge, and tokens.spacingVerticalSNudge, with the density prop selecting the compact spacing scale. Typography is controlled by tokens.fontSizeBase300 with tokens.fontWeightRegular for resting labels and tokens.fontWeightSemibold for emphasized ones, and the expandIcon uses tokens.fontSizeBase200 for its size and tokens.colorNeutralForeground2 for its color. Motion for the expanding icon is expressed through tokens.durationUltraFast and tokens.curveEasyEase inside the expandIconMotion slot.

## Migration Notes

This is the v9 Nav family rather than a port of v8's Nav. In v8, expanding navigation groups was declared with Nav's groups prop plus link and onLinkClick render props, and each link passed custom rendered elements. In v9, NavCategoryItem is a declarative component: you nest NavSubItem elements inside it, the value prop (instead of a key) identifies the destination, and expansion is controlled with openCategories / defaultOpenCategories plus onNavCategoryItemToggle. The v8 Nav also relied on an onRenderLink-style callback for custom content; v9 uses the root, icon, and expandIcon slots instead. Selection moves from onLinkClick to onNavItemSelect with selectedValue / defaultSelectedValue, and category selection to selectedCategoryValue / defaultSelectedCategoryValue.

## Edge Cases

- Value collisions: if two NavCategoryItem instances share a value, openCategories and selection comparisons will update both categories at once, so keep values globally unique inside the Nav.
- Controlled open state without the toggle handler: passing openCategories without updating it in onNavCategoryItemToggle makes categories appear permanently locked open or closed.
- Missing NavCategory wrapper: NavCategoryItem relies on the category context for its value and open state, so rendering it outside NavCategory (or outside Nav and NavDrawer) leaves it without expansion behavior.
- Categories with no children render an expand affordance that can never change; if all sub-items are filtered out at runtime, fall back to NavItem for that section.
- Roving focus and disabled or hidden items: if the tabbable item is conditionally removed — for example by permission filtering — focus can be lost, so recompute which item is tabbable when the navigation contents change.
- Long labels are not automatically truncated; extremely long category names compress the trailing expandIcon and can wrap the row, so cap label length or apply your own overflow styling through the root slot.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
