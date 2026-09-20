# NavDrawerBody

> **Package**: `@fluentui/react-nav` v9.4.0
> **Import**: `import { NavDrawerBody } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

NavDrawerBody is the content region of a NavDrawer. It renders a flexible div container that holds the actual navigation structure — Nav, NavItem, NavCategory, NavCategoryItem, NavSubItem, NavSectionHeader, NavDivider, and SplitNavItem — and is responsible for the padding and scrolling behavior of that content inside the drawer. Because navigation hierarchies can be long, the body is the element that grows to fill the available drawer height, letting the surrounding drawer header and footer stay pinned while the nav list scrolls. It is a purely structural, non-interactive component: it contributes no landmark semantics of its own, and all interaction, selection, and expansion state lives on the nav components it hosts. Its visual density and coloring follow the Fluent theme and can be tuned through the density prop exposed by the nav children and through Griffel styling on the root slot.

**When to use**: Use NavDrawerBody whenever you build a navigation drawer with NavDrawer, InlineDrawer, or OverlayDrawer and you need a scrollable region for the navigation items in between the drawer header and drawer footer. It is the correct place for a Nav tree, category groups, and section headers. Do not use it as a general-purpose layout container for page content, forms, or action lists — those should live in the main application surface or in DrawerBody when the drawer is not a navigation drawer. If you only need a handful of standalone links or buttons with no hierarchical selection model, a plain DrawerBody with Links or Buttons is simpler than a full Nav hierarchy inside a NavDrawerBody.

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

- **root**: The container slot for the drawer body. Use it when you need to attach a className, style, or ref to the scrolling region instead of adding an extra wrapper div. `root={{ className: styles.body }}`
- **children**: The navigation content rendered inside the body — Nav, NavItem, NavCategory, NavCategoryItem, NavSubItem, NavSectionHeader, NavDivider, and SplitNavItem. Keep it strictly navigational. `<Nav>...</Nav>`
- **density**: Controls the vertical rhythm of the nav entries so a drawer can be comfortable in a spacious app shell or compact in a dense dashboard. Set it on the nav content inside the body rather than overriding padding with CSS. `compact`
- **value**: The identifier of an individual nav entry. Selection and expansion logic key off this value, so keep values stable across renders and unique across the whole navigation hierarchy. `inbox`
- **href**: Turns a nav entry into a real link so browser affordances such as middle-click, copy-link, and open-in-new-tab keep working. Provide it for any destination that maps to a URL. `/settings/profile`
- **icon**: Leading visual slot for a nav entry or category. Icons make the hierarchy scannable and are essential when the drawer collapses to an icon-only rail. `<FolderRegular />`
- **expandIcon**: The chevron-style indicator on a NavCategoryItem that communicates collapsible state. Keep it as the default unless you need a custom glyph that still clearly reads as expand/collapse. `<ChevronDownRegular />`
- **expandIconMotion**: Motion slot for animating the expand icon. Tune or replace it only when you need different timing; the default rotation already matches the collapse animation. `default rotation`
- **collapseMotion**: Motion slot for NavSubItemGroup expansion and collapse. Use it to customize duration or to opt out of animation for reduced-motion or high-density scenarios. `height transition`
- **tabbable**: Controls whether a composite nav item participates in the sequential tab order. Leave only one entry tabbable per grouped navigation so Tab does not walk every item individually. `true`
- **selectedValue**: Controlled selection for the navigation inside the drawer body. Drive it from your router or state so the highlighted entry always matches the current page. `dashboard`
- **defaultSelectedValue**: Uncontrolled initial selection for simple drawers that do not need to sync selection with routing. Do not combine it with selectedValue. `home`
- **selectedCategoryValue**: Controlled value of the currently active category, useful when a sub item should also highlight its parent category. `settings`
- **defaultSelectedCategoryValue**: Initial active category for uncontrolled navigation where the highlighted category is derived from the initial selection. `settings`
- **openCategories**: Controlled list of expanded categories. Use it when deep links must open ancestors automatically or when expansion should persist across sessions. `['settings', 'reports']`
- **defaultOpenCategories**: Uncontrolled initial set of expanded categories for straightforward navigation trees that the user manages themselves. `['settings']`
- **multiple**: Allows more than one category to stay expanded at a time. Turn it off for accordion-style drawers where only one section should be open. `true`
- **onNavItemSelect**: Selection handler for nav entries in the body. Use it to commit routing, persist the selection, and close an overlay drawer after navigation. `(event, data) => navigate(data.value)`
- **onNavCategoryItemToggle**: Fires when a category expands or collapses. Use it when open categories are controlled, or to record analytics and lazy-load category content. `(event, data) => setOpenCategories(next)`
- **navItem**: Slot used by split navigation entries so the primary clickable region can be customized or replaced while keeping the action, toggle, and menu buttons intact. `custom primary region`
- **actionButton**: Slot for a related action on a split nav entry, such as compose or create. Keep it secondary to the primary navigation click target. `compose action`
- **toggleButton**: Slot for the expand/collapse control on a split nav entry. It should always reflect the expanded state so the chevron and aria-expanded stay in agreement. `expand sections`
- **menuButton**: Slot for an overflow menu on a split nav entry. Reserve it for secondary options that would otherwise clutter the drawer. `more options`
- **actionButtonTooltip**: Tooltip slot for the action button. Supply it whenever the action is icon-only or the drawer is in a compact density. `New message`
- **toggleButtonTooltip**: Tooltip slot for the toggle button, clarifying what expands or collapses in dense navigation. `Expand sections`
- **menuButtonTooltip**: Tooltip slot for the overflow menu button so an unlabeled menu trigger is never ambiguous. `More options`
- **categoryValue**: Context value supplied by the category wrapper to its children so nested items can report which category they belong to. It is provided by the framework rather than authored by hand. `settings`
- **navCategoryItem**: Context value shared between a category item and its sub items to coordinate expansion and selection. Also framework-provided rather than passed directly by consumers. `category context`

## Best Practices

### Do's

- Render NavDrawerBody as the direct body child of NavDrawer so the navigation content inherits the drawer's padding, background, and scroll containment.
- Keep exactly one navigation root (a Nav with its NavItem, NavCategory, NavCategoryItem, NavSubItem, NavSectionHeader, and NavDivider children) inside the body so that selection state stays unambiguous.
- Use a single controlling pair — either selectedValue plus onNavItemSelect for controlled routing, or defaultSelectedValue for uncontrolled use — never both at once.
- Drive category expansion with openCategories plus onNavCategoryItemToggle when the expanded state affects routing or deep links, and defaultOpenCategories for simple cases.
- Leverage the density prop on the nav content for compact app-shell layouts instead of overriding paddings with custom CSS, so spacing stays consistent with the rest of the theme.
- Provide actionButtonTooltip, toggleButtonTooltip, and menuButtonTooltip on SplitNavItem actions and icon, so icon-only or collapsed affordances remain understandable.
- Give every navigational entry a meaningful value (and href where it routes) so assistive technology and selection tracking both have something stable to work with.
- Use the root slot (for example with className and mergeClasses) when the body needs extra layout rules such as flex growth or overflow, rather than wrapping it in additional divs.

### Don'ts

- Don't render NavDrawerBody outside of a NavDrawer — it exists to be the body region of that drawer and depends on the drawer's context for its intended layout.
- Don't place non-navigation content such as forms, tables, cards, or marketing copy inside the body; navigation drawers should contain navigation only.
- Don't nest multiple Nav components inside one NavDrawerBody, as this creates competing selection and expansion state.
- Don't hard-code pixel padding or margins on the body root that fight the density prop; the resulting rhythm will break in compact mode.
- Don't manage selection with local component state that duplicates selectedValue; let the Nav elements own the value and lift it into your routing layer instead.
- Don't drop the icon slot or expandIcon slot on nav items when the drawer can collapse, because the visual and accessible labeling then has nothing to fall back on.
- Don't mix multiple equal toggles or uncontrolled defaults with a controlled selectedValue, since the controlled prop always wins and the default is silently ignored.

## Anti-Patterns

### Navigation body used as a generic container

❌ Developers drop forms, cards, or marketing content into NavDrawerBody because it conveniently fills the drawer. The result is an unlabeled content region that mixes navigation and page content, confusing screen reader users and making selection state meaningless.

✅ Keep only navigational elements inside NavDrawerBody. Put non-navigation content in the main application surface, or use DrawerBody and a non-navigation drawer when the drawer is not primarily for navigation.

### Duplicating selection state locally

❌ The drawer keeps its own useState for the active item while also passing selectedValue, so the highlight and the routed page drift apart after deep links or back-navigation.

✅ Choose one owner: pass selectedValue and onNavItemSelect and let your routing layer be the single source of truth, or go fully uncontrolled with defaultSelectedValue for static demos and prototypes.

### Fighting density with hard-coded spacing

❌ Custom padding and margins are applied to the body root to make rows tighter, which breaks in the compact density and produces inconsistent rhythm with NavSectionHeader and NavDivider.

✅ Set the density prop for the navigation content and rely on theme spacing tokens if further tuning is required, so spacing scales with the Fluent theme instead of being fixed.

### Missing labels on compact split items

❌ In a narrow or collapsed drawer, the action, toggle, and menu buttons inside a SplitNavItem render as bare icons with no accessible name, so assistive technology announces unlabeled buttons.

✅ Always populate actionButtonTooltip, toggleButtonTooltip, and menuButtonTooltip, and keep the item icon available so there is a visual and accessible affordance in every density.

### Multiple navigation roots in one body

❌ Two Nav components inside the same NavDrawerBody each maintain their own selection and open categories, producing two competing current items and inconsistent expansion behavior.

✅ Render a single Nav tree per NavDrawerBody and use NavSectionHeader and NavDivider to visually separate groups within that one tree.

## Accessibility

**Requirements**: NavDrawerBody itself is a non-interactive div and adds no landmark or widget role; the accessibility contract comes from its children and from the drawer that wraps it. The surrounding drawer should provide the region or dialog semantics for the navigation area, and the hosted navigation should expose a clear label (aria-label) so users know what the list navigates. Every interactive item inside must be reachable by Tab or arrow navigation, must have a visible focus indicator derived from the theme focus tokens, and must meet WCAG 2.1 AA contrast for text, icons, and the selected-item indicator. Because nav items can be icon-only in compact densities, each such control needs an accessible name via aria-label or an associated tooltip with actionButtonTooltip, toggleButtonTooltip, or menuButtonTooltip.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into and out of the navigation drawer body; only the tabbable entry (controlled by the tabbable prop) is in the sequential tab order for composite nav items. |
| `Enter` | Activates the focused NavItem, NavSubItem, or link so the selection is committed and onNavItemSelect fires. |
| `Space` | Toggles the focused NavCategoryItem open or closed when the item is rendered as a toggle button, firing onNavCategoryItemToggle. |
| `ArrowDown` | Moves focus to the next nav item within the body, including into expanded sub item groups. |
| `ArrowUp` | Moves focus to the previous nav item within the body. |
| `ArrowRight` | Expands a collapsed NavCategoryItem to reveal its NavSubItem children. |
| `ArrowLeft` | Collapses an expanded NavCategoryItem, or moves focus out of a sub item group back to its parent category. |
| `Home` | Moves focus to the first focusable navigation item in the body. |
| `End` | Moves focus to the last focusable navigation item in the body. |
| `Escape` | Closes an open menu or overlay drawer that originated from the navigation content. |

**ARIA**: aria-label, aria-current, aria-expanded, aria-disabled, aria-hidden, aria-haspopup, role

**Screen Reader**: Screen readers traverse the drawer body as an ordered list of navigation entries. A NavItem rendered as a link announces its accessible name plus the current-page state exposed through aria-current, while an expanded NavCategoryItem announces its expanded state through aria-expanded so users understand that its sub items are now visible. SplitNavItem exposes separate, individually named controls for its action, toggle, and menu buttons, and those buttons should always carry a label or a tooltip slot so they are not announced as unlabeled buttons. Decorative icons and expand icons are hidden from the accessibility tree with aria-hidden, so the announcement is limited to the item text and state; motion wrappers such as expandIconMotion and collapseMotion only affect rendering and produce no announcements themselves.

## Styling

Style NavDrawerBody from the outside by targeting the root slot with makeStyles and mergeClasses, or by passing className through the slot; the component exposes no visual variants of its own because density and color come from the Nav elements it contains. Match the drawer's background with tokens.colorNeutralBackground1 (or tokens.colorNeutralBackground2 for a tinted panel) and set text with tokens.colorNeutralForeground1 and tokens.colorNeutralForeground2. Use tokens.spacingHorizontalMNudge and tokens.spacingVerticalMNudge for the nav item padding rhythm, tokens.spacingVerticalS / tokens.spacingHorizontalS for compact groupings, tokens.borderRadiusMedium and tokens.borderRadiusLarge for separated drawer shells, and tokens.strokeWidthThin with tokens.colorNeutralStroke1 for separators. Selection and hover states inside the body should use theme-aware tokens such as tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground2Selected, tokens.colorCompoundBrandBackground for the selected indicator bar, tokens.colorNeutralForeground2BrandSelected for selected labels, and the focus ring tokens tokens.colorStrokeFocus2 with tokens.strokeWidthThick. Keep typography consistent with tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.lineHeightBase300, and avoid absolute positioning inside the body so the natural scroll region keeps working.

## Performance

NavDrawerBody itself is a lightweight div and adds essentially no rendering cost; the cost comes from the navigation tree it hosts. Large hierarchies render one element per NavItem and NavSubItem, so keep deep trees virtualized or lazily populated when a drawer can contain hundreds of entries. The collapseMotion and expandIconMotion slots mount and unmount sub item groups on every toggle, so avoid recreating motion slot objects on each render and prefer letting openCategories be the stable driver of expansion. Keep the openCategories and selectedValue values referentially stable (memoized arrays and primitive values) so that Nav children do not re-render on every parent render. Avoiding unnecessary wrapper elements around the body also preserves the drawer's scroll containment and prevents extra layout passes.

## Theming & Tokens

NavDrawerBody inherits everything from the nearest FluentProvider. Its background and text read from neutral tokens such as tokens.colorNeutralBackground1, tokens.colorNeutralBackground2, tokens.colorNeutralForeground1, and tokens.colorNeutralForeground2, while interactive states inside it resolve through tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground2Selected, and tokens.colorSubtleBackground. The selected item indicator uses the brand-colored tokens tokens.colorCompoundBrandBackground with the label color tokens.colorNeutralForeground2BrandSelected, so switching between light and dark themes or swapping brand ramps restyles the drawer automatically. Focus rings come from tokens.colorStrokeFocus2 and tokens.strokeWidthThick, and density changes derive their spacing from tokens.spacingVerticalS, tokens.spacingVerticalMNudge, and tokens.spacingHorizontalMNudge. In the separated InlineDrawer layout, corners and edges pull from tokens.borderRadiusLarge and tokens.colorNeutralStroke1 so the drawer reads as a distinct surface within the shell.

## Migration Notes

In Fluent UI v9 the navigation drawer body is a dedicated structural component rather than a set of loosely styled divs used in v8 Nav and Panel compositions. The v9 API is slot based: the container is exposed as the root slot, density replaces ad-hoc padding overrides, and expansion of categories is expressed through the openCategories and defaultOpenCategories props with the onNavCategoryItemToggle callback rather than through manual DOM manipulation. Selection is handled with selectedValue and onNavItemSelect, mirroring the declarative v9 Nav pattern. Consumers migrating from v8 should also expect the navigation items themselves (NavItem, NavCategoryItem, NavSubItem, SplitNavItem) to carry their own slots such as icon, expandIcon, actionButton, toggleButton, menuButton, and navItem, plus the corresponding tooltip slots.

## Edge Cases

- NavDrawerBody is designed to sit inside a NavDrawer; rendering it standalone produces an unstyled scroll container with no drawer context, padding, or surrounding landmark.
- With an overlay drawer, the body is the scrollable region while the header and footer stay fixed — long navigation lists therefore scroll inside the body rather than moving the whole drawer.
- When selectedValue is controlled, the uncontrolled defaultSelectedValue is ignored, which can look like a broken highlight if both are accidentally supplied.
- Compact density plus a collapsed drawer can strip visible text labels; without tooltip slots on action, toggle, and menu buttons, those controls become unlabeled for both sighted and assistive users.
- Expansion state for categories lives with openCategories or defaultOpenCategories, not in the body, so resetting the drawer (for example on route change) requires explicitly resetting those values.
- The expandIcon and expandIconMotion slots only make sense on collapsible category items; passing them on a leaf nav entry produces a decorative chevron with no behavior behind it.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
