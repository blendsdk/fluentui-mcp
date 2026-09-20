# NavDrawerFooter

> **Package**: `@fluentui/react-nav` v9.4.0
> **Import**: `import { NavDrawerFooter } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

NavDrawerFooter is a layout container placed at the bottom of a NavDrawer (or InlineDrawer used as navigation) that holds persistent, low-frequency navigation actions — typically settings, help, account switching, theme toggles, or a collapse/expand control. It renders a single required root slot typed as Slot<'div'>, which means the styling and semantics of the container are fully customizable: you can swap the rendered element, attach a className, or pass refs and native div attributes through the slot's shorthand or object form. Because it is a structural surface rather than a control, it owns no selection state of its own; anything interactive inside it (NavItem, Button, MenuButton, Link) keeps its own behavior. The component participates in the same navigation context and prop vocabulary as the rest of the Nav family — density, value, selectedValue, defaultSelectedValue, openCategories, multiple, onNavItemSelect, and onNavCategoryItemToggle all appear in the same surface — so the footer can host nav items that reflect and update the surrounding navigation state without bespoke wiring. It ships from '@fluentui/react-components' and is not deprecated.

**When to use**: Use NavDrawerFooter when a NavDrawer needs a visually separated, always-visible region at its bottom that is distinct from the scrolling primary navigation in NavDrawerBody and distinct from the identifying header content in NavDrawerHeader. Typical cases: a settings entry point, a help/support link, an account or tenant switcher, a theme or density toggle, or a collapse/expand affordance for the drawer itself. Put the scrolling list of destinations in NavDrawerBody instead, and put titles, logos, and hamburger controls in NavDrawerHeader. If the drawer is purely a list of links with no persistent secondary actions, omit the footer entirely rather than using it for decoration. If you need a footer in a generic (non-navigation) drawer, use DrawerFooter; NavDrawerFooter exists for the navigation-flavored drawer composition and expects to sit alongside NavDrawerHeaderBody-style structure.

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

- **root**: The only required prop: a Slot<'div'> that renders the footer container. Use the shorthand string form for a className shortcut, or the object form to change the rendered element, forward a ref, or set native div attributes such as an aria-label on the region. `{ className: 'myFooter', 'aria-label': 'Utility navigation' }`
- **children**: The footer's content. Provide a short, stable set of navigation entries or utility controls; null is permitted when the footer should render as an empty structural spacer during a collapsed state. `a NavItem for Settings and a MenuButton for the account switcher`
- **href**: Set when a footer entry navigates to a URL, producing a link-styled destination rather than a button-styled one. Omit it for actions that mutate state instead of navigating. `/settings`
- **value**: The identifier for a footer nav item within the navigation model. Give each footer destination a stable, unique value so selection can be tracked alongside the primary navigation. `settings`
- **selectedValue**: Controlled current selection for navigation entries, including footer items. Pass the value that matches the active route so the footer entry renders as selected with aria-current and the selected text/icon tokens. `settings`
- **defaultSelectedValue**: Uncontrolled initial selection, used when the navigation state is not hoisted into application state. Do not combine it with selectedValue. `home`
- **onNavItemSelect**: Fires when a footer (or body) nav item is chosen, carrying the selection data. Use it to route, persist the selected value, or close an overlay drawer after navigation. `(event, data) => setSelectedValue(data.value)`
- **defaultSelectedCategoryValue**: Uncontrolled initial category selection when the footer or drawer hosts category items with expandable children; pair with selectedCategoryValue for controlled usage. `team`
- **selectedCategoryValue**: Controlled category selection for expandable groups that include footer entries, keeping the highlighted category consistent with the active route. `team`
- **defaultOpenCategories**: Initial set of expanded categories, used uncontrolled so a footer category that holds the active page starts open on first render. `['team']`
- **openCategories**: Controlled set of expanded categories. Supply it together with onNavCategoryItemToggle when the expansion state must be persisted or restored across sessions. `['team', 'reports']`
- **onNavCategoryItemToggle**: Notifies when a category item in the navigation — including one rendered in the footer — is expanded or collapsed, so you can keep openCategories in sync. `(event, data) => setOpenCategories(data.openCategories)`
- **multiple**: Allows more than one category to be open at once. Enable it when footer or body categories are independent resources; leave it off when the navigation is a single hierarchical tree. `true`
- **density**: Controls the vertical compactness of navigation items, including footer entries. Use a compact density in constrained or collapsed drawers and a comfortable density for full-height navigation surfaces. `compact`
- **tabbable**: Controls whether an item participates in the tab sequence. Set it to false for items that should only be reachable via arrow-key navigation within the nav item set, and true for the entry that should receive tab focus. `false`
- **icon**: A Slot<'span'> for the leading glyph on a footer item or category. Keep icons decorative and mirror the label rather than introducing new meaning, and mark them aria-hidden when the text already names the destination. `a settings glyph preceding the Settings label`
- **expandIcon**: The required slot for the chevron-style indicator on expandable footer category items. Swap it only to change direction or styling, not to convey state by itself. `a chevron that rotates when the category opens`
- **expandIconMotion**: Slot for the motion props applied to the expand icon, used to tune or disable the rotation animation. Respect prefers-reduced-motion when overriding it. `{ duration: 150 }`
- **collapseMotion**: Slot for the collapse/expand motion configuration of grouped items, letting you shorten, lengthen, or remove the transition for footer-hosted expandable groups. `{ duration: 200 }`
- **navItem**: The rendered nav item element inside a composition slot; override it only when you must change the underlying element or forward refs, not to restyle ordinary footer items. `a custom anchor element for a footer destination`
- **actionButton**: The primary action button slot for a composite footer entry, used when the footer item performs an action in addition to (or instead of) navigating. `a Button that opens Settings`
- **toggleButton**: The toggle button slot for composite footer entries that expand or collapse content; wire its accessible state so screen readers announce the toggle. `a ToggleButton that collapses the drawer`
- **menuButton**: The menu button slot for footer entries that open a Menu (account switcher, overflow actions). Pair it with a Menu and ensure Escape returns focus to the button. `an account MenuButton labeled with the current user`
- **actionButtonTooltip**: Tooltip slot for the action button. Provide it whenever the footer action is condensed to an icon so the control retains an accessible description. `{ content: 'Settings', relationship: 'description' }`
- **toggleButtonTooltip**: Tooltip slot for the toggle button, used to name the collapsed/expanded control with text such as Collapse navigation. `{ content: 'Collapse navigation' }`
- **menuButtonTooltip**: Tooltip slot for the menu button, supplying a visible or screen-reader description for condensed account or overflow controls in the footer. `{ content: 'Account menu' }`

## Best Practices

### Do's

- Keep footer content short and stable — two to four items such as Settings, Help, and Account — so it reads as a fixed utility strip rather than a second navigation list.
- Wrap footer actions that participate in navigation selection in NavItem (or NavSubItem) so they inherit the nav context, density, and selectedValue handling instead of inventing parallel state.
- Give the footer icons via a span-based icon slot or the child component's icon slot, and pair icon-only controls with a tooltip so their meaning survives without visible text.
- Order footer entries from most general to most personal (Help, then Settings, then Account) to mirror the mental model users have for utility regions.
- Hide or condense labels when the drawer is narrow or collapsed, but keep a tooltip and an accessible name on each control so meaning is preserved.
- Use the root slot to attach a className for the top separator/border and internal padding instead of wrapping the footer in an extra div.
- Verify the footer remains reachable and legible in both light and dark themes, since it sits over a themed drawer surface.

### Don'ts

- Don't duplicate primary destinations in the footer — if a link already appears in NavDrawerBody, repeating it in NavDrawerFooter creates two competing sources of truth for the current page.
- Don't put the app's primary call to action in the footer; a footer is a low-emphasis region and will bury conversion-critical actions.
- Don't hard-code pixel heights or absolute positioning on the root slot — let the drawer's flex layout size the footer so it participates in the drawer's own scrolling model.
- Don't place a focusable control inside the footer that has no visible focus indicator; removing the outline breaks the footer for keyboard users.
- Don't rely on color alone to indicate selection or state in footer items; pair it with an icon, weight change, or text.
- Don't nest another navigation landmark inside the footer when the surrounding NavDrawer already exposes one; use a plain div root and let the parent own the landmark.
- Don't use NavDrawerFooter as a generic DrawerFooter substitute when the drawer isn't a navigation surface.

## Anti-Patterns

### Secondary main menu in the footer

❌ Filling NavDrawerFooter with the full set of destinations turns it into a second primary navigation list, which fragments information architecture and makes the drawer scan poorly because two lists compete for attention.

✅ Keep the scrolling destination list in NavDrawerBody and reserve the footer for two to four persistent utilities such as Settings, Help, and Account.

### Icon-only controls with no accessible name

❌ Condensing footer actions to bare icons without a tooltip or aria-label leaves screen reader users with unnamed buttons and sighted users guessing at meaning; the control also fails WCAG name/role/value requirements.

✅ Provide a visible label when space allows, otherwise supply aria-label on the control and pair it with the matching tooltip slot so the description is available to both sighted and assistive-technology users.

### Forcing layout with absolute positioning or fixed heights

❌ Pinning the footer with position: absolute or a hard-coded pixel height breaks the drawer's flex sizing, causing overlap with the scrolling body and clipped or unreachable controls on short viewports.

✅ Style the root slot with spacing and background tokens only and let the drawer's own flex layout size and place the footer; use padding from tokens.spacingVerticalM and tokens.spacingHorizontalM to shape it.

### Duplicating state instead of using the nav model

❌ Implementing footer selection with local component state rather than the shared value and selectedValue props causes the footer and the body list to disagree about which destination is current.

✅ Give footer destinations values, drive them from selectedValue (or defaultSelectedValue when uncontrolled), and respond to onNavItemSelect so the footer and body share one source of truth.

### Treating the footer as a decorative divider strip

❌ Adding an empty NavDrawerFooter purely to draw a line creates an extra region with no content, adding noise for screen reader users who encounter an unlabeled empty container.

✅ Omit the footer when there is nothing persistent to place in it, or apply the separating border directly to the body via a className instead of rendering an empty container.

## Accessibility

**Requirements**: NavDrawerFooter is a container, so its accessibility is inherited from what it contains and from the enclosing navigation landmark. Every interactive child must be reachable in DOM order, which also determines tab order. Focus indicators must meet WCAG 2.2 non-text contrast (3:1) against the drawer surface, and text must meet 4.5:1 (or 3:1 for large text). Because footers are commonly condensed into icon-only controls, each such control needs an accessible name — a visible label is preferred, otherwise use aria-label or an associated tooltip. If the footer is rendered as a region distinct from the main nav list, give it a descriptive label so screen reader users can jump to it. Respect the user's reduced-motion preference for any expand/collapse or open/close motion configured through the motion slots.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the footer and between each interactive child in DOM order |
| `Shift + Tab` | Moves focus backwards out of the footer to the previous control in the drawer |
| `Enter` | Activates a focused link, nav item, or button rendered inside the footer |
| `Space` | Activates a focused button or toggle control in the footer; not applicable to plain links |
| `ArrowDown` | Moves focus to the next item when the footer hosts NavItem or NavCategoryItem entries |
| `ArrowUp` | Moves focus to the previous item within the footer's nav items |
| `ArrowRight` | Expands a focused NavCategoryItem when the footer contains category items and they are not already open |
| `ArrowLeft` | Collapses a focused, expanded NavCategoryItem in the footer |
| `Home` | Moves focus to the first item in the footer's nav item set |
| `End` | Moves focus to the last item in the footer's nav item set |
| `Escape` | Closes an open menu or popover anchored to a footer control, returning focus to that control |

**ARIA**: aria-label (on the footer region or on icon-only controls inside it), aria-labelledby (when the footer's label is rendered as visible text), aria-current="page" (on the footer nav item matching the active route), aria-expanded (on expand/collapse controls such as a drawer toggle), aria-describedby (to associate a tooltip or help text with a condensed footer control), aria-hidden (on purely decorative spans passed through the icon slot), aria-disabled (when a footer action is intentionally unavailable rather than removed), role="navigation" or role="region" (only on the enclosing landmark, not duplicated inside the footer)

**Screen Reader**: Screen reader users encounter the footer as the final set of controls inside the drawer's navigation landmark, in DOM order. Each child exposes its own role — links announce as links, nav items expose selected state, and toggle-style controls announce expanded or pressed state — so an activated footer destination is typically announced with its name plus the current-page indicator. Condensed or icon-only footer controls announce only their accessible name, which is why aria-label or a tooltip-linked description is mandatory for them. Decorative spans passed through the icon slot should be hidden so they don't inject noise into the announcement.

## Styling

Style the footer through the root slot rather than wrapping it: pass a className to add a separating border with tokens.colorNeutralStroke2 and upward padding with tokens.spacingVerticalM and tokens.spacingHorizontalM. Use tokens.colorNeutralBackground2 for a subtly recessed footer surface or tokens.colorNeutralBackground1 to keep it flush with the drawer body. Rounding on the footer container or on footer buttons uses tokens.borderRadiusMedium, and footer link text reads best with tokens.fontSizeBase300 plus tokens.fontWeightRegular, reserving tokens.fontWeightSemibold for the currently selected footer item. For condensed footers, keep hit targets at least tokens.spacingVerticalL tall with tokens.spacingHorizontalSNudge horizontal padding so touch targets stay adequate. Icon color should use tokens.colorNeutralForeground2 at rest, tokens.colorNeutralForeground1 on hover, and tokens.colorBrandForeground1 for a selected footer destination. Because the drawer can be overlaid, ensure the footer background is opaque (tokens.colorNeutralBackground1 or a themed drawer token) rather than translucent so text stays legible over page content.

## Performance

NavDrawerFooter is a thin structural wrapper, so its own render cost is negligible; the cost comes from what you put inside it. Keep the child set small and stable, and memoize the content if it is produced by a render function, otherwise every drawer open/close re-renders the footer subtree. Avoid passing freshly created objects to object-form root slot props or to the motion slots (expandIconMotion, collapseMotion) on every render, since new identities defeat slot memoization and can retrigger transitions. When the footer hosts expandable categories, uncontrolled state via defaultOpenCategories avoids re-rendering the whole navigation on every toggle, and disabling the collapse motion is the cheapest way to make toggles feel instant on low-powered devices.

## Theming & Tokens

NavDrawerFooter inherits FluentProvider theme tokens, so it adapts automatically to brand ramps and light/dark/high-contrast themes. Surface it with tokens.colorNeutralBackground1 or tokens.colorNeutralBackground2 depending on whether it should read as flush with or recessed from the drawer body, and separate it with tokens.colorNeutralStroke2 (or tokens.colorNeutralStroke1 for stronger contrast). Text defaults to tokens.colorNeutralForeground1, secondary or condensed labels to tokens.colorNeutralForeground2, and disabled entries to tokens.colorNeutralForegroundDisabled. Selected footer destinations typically use tokens.colorBrandForeground1 with tokens.colorNeutralBackground1Selected for the background, and focus rings derive from tokens.colorStrokeFocus2. Spacing should come from the spacing ramp — tokens.spacingVerticalM, tokens.spacingHorizontalM, tokens.spacingVerticalSNudge — and rounding from tokens.borderRadiusMedium, so density changes and theme switches propagate without per-component overrides.

## Migration Notes

NavDrawerFooter is a v9-only API with no direct v8 counterpart: in v8 the navigation drawer was assembled from a different component set, and footer-style content was typically a hand-rolled div. If you are porting v8 navigation surfaces, map footer content to NavDrawerFooter inside a NavDrawer, move destination lists into NavDrawerBody, and use NavDrawerHeader for title and hamburger composition. The v9 footer accepts slot-shaped root with a div base element, so any wrapper div you carried over from v8 should be collapsed into the root slot's className and element overrides instead of being kept as an extra nesting level.

## Edge Cases

- When the drawer collapses to an icon-only rail, footer labels must be hidden but each control still needs a tooltip or aria-label, otherwise the footer becomes unusable and unnamed.
- A footer entry whose href matches no route should not be given selectedValue; a stuck selected footer item misleads users about their current location and misreports aria-current.
- In an OverlayDrawer, the footer sits over page content, so any translucent background will let underlying text bleed through and hurt contrast — use an opaque themed background.
- Very short viewports can squeeze the footer against the body list; since the footer is not inherently scrollable, offload long content into NavDrawerBody rather than letting the footer grow.
- Mixing controlled and uncontrolled selection props (selectedValue together with defaultSelectedValue) produces unpredictable highlighting; choose one model for the whole navigation surface.
- Because root is required and div-based, swapping the rendered element without preserving the layout contract can break the drawer's flex distribution — keep the element a block-level container.
- Condensing categories into the footer while the same categories are expanded in NavDrawerBody creates duplicate expand/collapse targets and duplicate announcements for assistive technology.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
