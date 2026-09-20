# NavDrawerHeader

> **Package**: `@fluentui/react-nav` v9.4.0
> **Import**: `import { NavDrawerHeader } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

NavDrawerHeader is the top region of a NavDrawer — the fixed band at the top of a navigation drawer that holds product identity and drawer-level controls. It is a deliberately thin, presentational component: its single structural slot (root) renders a div, and everything inside it is supplied through children, typically a brand mark (Image, Avatar or an inline icon), a Text label for the app or workspace, and a control such as Hamburger or Button that collapses the drawer. Because it belongs to the NavDrawer family, it is designed to be used together with NavDrawerBody (the scrolling region that holds Nav, NavItem, NavCategory, NavCategoryItem, NavSubItem, NavSubItemGroup, NavSectionHeader and NavDivider elements) and the optional NavDrawerFooter, so the header stays pinned while navigation content scrolls beneath it. NavDrawerHeader owns no navigation semantics and no selection state; those live in the Nav tree below it. The extracted prop surface for this component also carries the shared Nav-family props (value, href, icon, expandIcon, expandIconMotion, collapseMotion, tabbable, density, multiple, selectedValue and friends), which are consumed by the Nav components rendered in the drawer body rather than by the header itself, and which are documented below so the whole drawer composition can be understood end to end.

**When to use**: Use NavDrawerHeader whenever you build a persistent navigation surface with NavDrawer: it gives the drawer a fixed top band for the product or tenant identity, a workspace switcher, and the Hamburger or close control, while NavDrawerBody scrolls beneath it. Use it with Nav inside NavDrawerBody (and NavDrawerFooter for secondary links such as help or account entries) rather than mixing the generic DrawerHeader and DrawerHeaderTitle with a Nav tree — those are intended for dialogs, forms and detail panels and do not carry the navigation styling or the drawer's fixed-header layout. If the surface is not navigation at all, use DrawerHeader instead. If you only need an overlay with a single block of content and no nav tree, plain Drawer plus DrawerBody is enough and a NavDrawerHeader adds nothing. On small viewports, the same header is what remains visible when an InlineDrawer collapses to a rail, so it is also the right place for the Hamburger that restores the drawer.

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

- **root**: The header's single structural slot and the only prop that changes the header's own DOM. Use it for className (and optionally styles) so you can set height, padding, background, border and the flex layout that puts the brand mark next to the drawer control; keep the rendered element a div, because making it interactive or a heading changes its semantics. `styles.navDrawerHeader`
- **children**: The actual content of the band: a brand mark (Image, Avatar or inline icon), a Text label, and at most one or two controls such as Hamburger or Button. Children render as-is inside the root div and receive no styling from the component, so any gap, truncation or wrapping behaviour comes from your own classes. `an Image, a Text app title and a Hamburger button`
- **density**: NavDensity value (small, medium or large) that tightens or loosens the vertical rhythm of nav entries in the drawer body. The header does not read it, so whenever you change it, adjust the header's own vertical padding so the first row beneath it still lines up with the brand mark. `medium`
- **multiple**: Flag belonging to Nav that allows several categories to be open at the same time. Turn it on for large information architectures where users compare sections; keep it off for single-path applications where only one category should be expanded at once. `false`
- **defaultSelectedValue**: Uncontrolled initial selection for the Nav in the drawer body. Use it when the component can own the selection state; add onNavItemSelect only if the application also needs to observe changes. `the value of the item that should start selected`
- **selectedValue**: Controlled selection value. Pair it with onNavItemSelect when the selected entry is derived from a router or from application state, and make sure it matches the value of an existing NavItem, NavCategory or NavSubItem. `a value matching one NavItem`
- **defaultSelectedCategoryValue**: Uncontrolled starting value for which category is treated as selected, which can differ from which categories are expanded. Use it when a whole section, rather than a single entry, represents the current location. `the value of the category that starts selected`
- **selectedCategoryValue**: Controlled counterpart of the default; set it when the highlighted category is driven by external state and keep it in sync with selectedValue when the two should agree. `a value matching one NavCategory`
- **defaultOpenCategories**: Array of category values that should start expanded on first render in uncontrolled usage. Useful for dashboards that should reveal their most used section immediately. `an array of category values to expand`
- **openCategories**: Controlled list of expanded category values. Because it cannot change on its own, always supply onNavCategoryItemToggle alongside it, and store the array in state so user toggles persist. `an array of currently expanded category values`
- **onNavItemSelect**: Selection callback that receives the event plus the selected value; this is the hook for pushing a route or updating application state when a NavItem or NavSubItem is chosen. It is the single place where navigation intent should be handled. `a handler that navigates to the selected value`
- **onNavCategoryItemToggle**: Called when a NavCategoryItem expands or collapses. Use it with openCategories to decide whether expansion is persisted, whether several sections may stay open, and whether opening one category should close another. `a handler that updates the openCategories array`
- **value**: Required identity for the Nav elements in the drawer body. Selection and expansion arrays reference these values, so keep them stable and unique across the tree; the header itself never needs a value because it participates in neither selection nor expansion. `a stable unique identifier`
- **href**: Turns a nav entry into a link rather than a button so the browser and router handle navigation. Provide it on NavItem, NavSubItem or NavCategoryItem when the entry maps to a URL; with href in place, the highlighted entry is usually derived from the current route rather than from onNavItemSelect alone. `/settings/profile`
- **icon**: Leading span slot for a nav entry, normally an icon component. If a text label sits next to it, treat the icon as decorative and hide it from assistive technology; if the entry has no text, the entry needs an accessible name instead. `an icon component reference`
- **expandIcon**: The chevron that indicates a NavCategoryItem can expand. It is required on category items and reflects expanded state, so replace it only when your design system mandates a different glyph, keeping the rotation cue intact. `a chevron icon reference`
- **expandIconMotion**: Motion slot controlling how the expand chevron animates between collapsed and expanded (PresenceMotionSlotProps). Tune the duration or curve here, or suppress the animation where a product bans decorative motion. `motion parameters with a shorter duration`
- **collapseMotion**: Motion slot for NavSubItemGroup collapse and expand (NavSubItemGroupCollapseMotionParams). It owns the height and opacity animation of the nested panel, so change it when nested groups feel too slow or too abrupt. `motion parameters for a faster collapse`
- **tabbable**: Controls whether an individual nav entry takes part in the roving tabindex. Leave it unset so Nav manages focus as a single tab stop and arrow keys move between entries; set it only when you are implementing custom keyboard behaviour around the tree. `false`
- **categoryValue**: Context value that NavCategory passes to its children. It is internal plumbing that ties a NavCategoryItem and its NavSubItemGroup to the parent category, so compose the elements normally instead of passing it yourself. `propagated automatically by NavCategory`
- **navCategoryItem**: Context value shared between a NavCategoryItem and its expand icon. Also internal; render the category item's children and the component wires the relationship for you. `propagated automatically by NavCategoryItem`
- **navItem**: Slot that lets you change the element rendered for a navigation row, from the default div to an anchor or a router link component. Use it when integrating a routing library that must intercept clicks. `a router link component`
- **actionButton**: Trailing Button slot on a navigation row for a secondary, non-destructive action. Pair it with actionButtonTooltip so the icon-only control is announced with a meaningful name. `a Button with a settings icon`
- **toggleButton**: Trailing ToggleButton slot for a binary row-level state such as pin, favourite or mute. Supply toggleButtonTooltip and make sure the toggled state is conveyed and not signalled by colour alone. `a ToggleButton with a pin icon`
- **menuButton**: Trailing MenuButton slot for row overflow menus. Combine it with menuButtonTooltip and a Menu with MenuPopover content, and keep such overflow actions out of the header band itself. `a MenuButton with a more actions icon`
- **actionButtonTooltip**: Tooltip slot that names the actionButton. Provide content that describes the outcome of the action, not just the icon, and keep the same wording in the button's accessible name. `text describing what the action does`
- **toggleButtonTooltip**: Tooltip slot for the toggleButton; update the wording when the toggle changes state so the tooltip describes what the next press will do. `text describing the toggle outcome`
- **menuButtonTooltip**: Tooltip slot for the menuButton, typically short and generic, while the individual menu entries inside the Menu carry the descriptive text. `text such as more actions`

## Best Practices

### Do's

- Render NavDrawerHeader as a direct child of NavDrawer, before NavDrawerBody, so the drawer's flex layout keeps the header fixed and lets only the body scroll.
- Keep the header to a single row: one visual mark (Image or Avatar), one short Text label, and at most one or two controls such as Hamburger or Button.
- Give every icon-only control in the header an accessible name — a Tooltip for sighted users plus an aria-label on the Button — and mark purely decorative glyphs aria-hidden.
- Compose the navigation tree inside NavDrawerBody with Nav, NavItem, NavCategory/NavCategoryItem, NavSubItem and NavDivider, leaving the header purely presentational.
- Align the header's horizontal padding with the drawer edge padding and with the density you pass to Nav (small, medium or large) so items below the header line up with the brand mark.
- Style the header through the root slot's className using makeStyles and mergeClasses for height, background, padding and border, instead of wrapping it in extra elements.
- Put group labels such as Workspace or Settings in a NavSectionHeader inside the body rather than typing them into the header.
- Keep selection and expansion state on Nav (selectedValue with onNavItemSelect, openCategories with onNavCategoryItemToggle) so the header never has to know about routing.

### Don'ts

- Don't put NavItem, NavCategory or NavSubItem elements inside NavDrawerHeader — they sit outside the Nav tree, so selectedValue, openCategories and roving focus will not track them.
- Don't turn the header's root slot into a button, link or heading to make the whole band clickable; put a real Button, Hamburger or Link inside the header instead.
- Don't render a second NavDrawerHeader (or a DrawerHeaderTitle) in the same drawer — one top band keeps the landmark and heading structure predictable.
- Don't repeat the drawer's name in both the header and the first NavSectionHeader of the body.
- Don't hard-code a fixed pixel height or an overflow rule on the header; let it size from content and spacing tokens so it works in InlineDrawer, OverlayDrawer and responsive layouts.
- Don't hard-code brand colours in the header styles; use theme tokens so dark, high-contrast and forced-colours modes keep working.
- Don't leave trailing actionButton, toggleButton or menuButton controls in the drawer unlabeled — the tooltip slots are there precisely to name them.
- Don't use NavDrawerHeader as a general page header outside a NavDrawer; it has no standalone layout contract of its own.

## Anti-Patterns

### Using the header as a mini nav bar

❌ Placing NavItem, NavCategory or NavSubItem elements directly inside NavDrawerHeader takes them out of the Nav tree in NavDrawerBody, so selectedValue, selectedCategoryValue, openCategories and onNavItemSelect never see them and roving keyboard focus skips them. The result is entries that look navigable but never highlight or report their state.

✅ Keep the header for identity and drawer-level controls only, and render every navigable entry inside NavDrawerBody under a Nav so selection, aria-current and keyboard traversal all work from one model.

### Repurposing the header root as a control

❌ Overriding the header's div root with a button, an anchor or a heading makes the whole band clickable or inserts a heading whose level does not match the surrounding document outline, producing focus surprises and broken heading order.

✅ Leave the div root in place, add a Text element with the correct heading level inside the header when document structure is needed, and add a genuine Button, Hamburger or Link for any interaction.

### Unlabeled header controls

❌ Hamburgers and other icon-only buttons in the header are announced as unlabeled buttons, so screen reader users cannot tell whether the control opens navigation, closes the drawer or performs some other action.

✅ Give the control an accessible name (for example aria-label naming the action), describe it with a Tooltip for sighted users, and mark the decorative glyph aria-hidden.

### Mixing Drawer chrome with Nav chrome

❌ Pairing NavDrawer with a generic DrawerHeader and DrawerHeaderTitle, or pairing a NavDrawerHeader with non-navigation Drawer content, produces two different header treatments with mismatched padding, border and background between the header and the content below it.

✅ Use NavDrawerHeader together with NavDrawerBody and NavDrawerFooter for navigation surfaces, and reserve DrawerHeader with DrawerHeaderTitle for non-navigation Drawer content.

### Duplicated title in header and body

❌ Repeating the product or section name in both NavDrawerHeader and the first NavSectionHeader of the body wastes vertical space, creates duplicated reading-order announcements and makes the drawer's hierarchy ambiguous.

✅ Name the product once in the header and use NavSectionHeader in the body only for real grouping labels such as Workspace, Favourites or Settings.

## Accessibility

**Requirements**: The header renders a plain div, so it contributes no implicit landmark or heading semantics of its own; if you need document structure, add a Text element with an appropriate heading level inside it. All interactive children you place in the header must be reachable by keyboard, must have an accessible name, and must meet WCAG 2.1 AA contrast (body text at least 4.5:1, large text and UI glyphs at least 3:1) using theme tokens rather than literal colours. Decorative icons, logos and background images should be hidden from assistive technology so they are not announced as meaningless graphics. If the header contains the control that expands or collapses the drawer, that control must expose its state. Focus indicators must stay visible and must not be removed when you restyle the header.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the first focusable control inside the header (for example a Hamburger or Button) and then on to the next focusable element in the drawer. |
| `Shift+Tab` | Moves focus backwards out of the header, returning to the drawer surface or to the control that opened the drawer. |
| `Enter` | Activates a Button, Link, ToggleButton or MenuButton placed inside the header. |
| `Space` | Activates a Button or ToggleButton placed inside the header. |
| `ArrowDown and ArrowUp` | Move focus through nav entries when the focus is inside a Nav or Menu surface rendered from the header content; the header itself does not manage arrow navigation. |
| `Escape` | Dismisses the containing Drawer when it is modal (OverlayDrawer) or closes a Menu or Popover opened from a header control; the header does not handle Escape by itself. |

**ARIA**: aria-label, aria-labelledby, aria-expanded, aria-current, aria-hidden, role

**Screen Reader**: Because the header root is a div, screen readers announce nothing for the band itself; users hear only the individual children you render inside it — a labelled image or a link for the brand, a text node for the product name, and named buttons for the controls. Icon-only buttons without an aria-label are announced as unlabeled buttons, which is the most common failure in this region. The Nav rendered in NavDrawerBody exposes its own navigation role and labels, and the active entry is surfaced with aria-current there rather than in the header, so the drawer's location feedback is not duplicated. Decorative brand marks should be aria-hidden so they do not interrupt the reading order, and if the header carries the drawer's title it should be referenced with aria-labelledby from the drawer surface rather than announced twice.

## Styling

The header is normally styled entirely through the root slot: pass a makeStyles class with className on root and combine it with mergeClasses so consumer overrides win over the component defaults. Typical customizations are tokens.colorNeutralBackground1 for a surface that blends into the drawer, tokens.colorNeutralBackground2 or tokens.colorNeutralBackground3 for a deliberately contrasting brand band, tokens.colorNeutralStroke2 with tokens.strokeWidthThin for a bottom hairline (NavDivider uses the same neutral stroke family), and tokens.spacingHorizontalL together with tokens.spacingVerticalM or tokens.spacingVerticalMNudge for the padding that matches the drawer's own insets. Title text usually uses tokens.fontSizeBase300 or tokens.fontSizeBase400 with tokens.fontWeightSemibold, tokens.lineHeightBase300 and tokens.colorNeutralForeground1, while secondary text uses tokens.colorNeutralForeground2 or tokens.colorNeutralForeground3. A flex layout with a small gap built from tokens.spacingHorizontalS or tokens.spacingHorizontalM keeps the mark, the label and the action control aligned, and minWidth zero plus Text truncation keeps long workspace names from pushing the control out of the drawer. Brand accents belong on tokens.colorBrandForeground1 or tokens.colorBrandBackground, motion on tokens.durationNormal with tokens.curveEasyEase, and radius on tokens.borderRadiusMedium; avoid inline style objects because Griffel's compiled atomic classes are cheaper to reapply than fresh style objects on each render.

## Performance

NavDrawerHeader is a stateless, effect-free container: rendering it costs one div plus whatever you pass as children, and it does not re-render when the Nav selection or category expansion changes because all of that state lives in Nav. The practical cost is therefore in the children — create the header content once and hoist it, or memoize it, if the surrounding shell re-renders on every route change, since ReactNode children are recreated by the parent on each render. Prefer Griffel makeStyles classes over inline style objects so the atomic class names are reused instead of allocating new style objects per render. The motion slots (expandIconMotion and collapseMotion) animate cheap transform and opacity properties and are automatically toned down when the user prefers reduced motion, so they are safe to leave enabled. When a drawer grows to hundreds of navigation entries, the bottleneck is the Nav tree in NavDrawerBody rather than the header; flatten, paginate or virtualize the tree before touching the header.

## Theming & Tokens

The header is a thin wrapper, so it inherits most of its appearance from the FluentProvider theme in scope (webLightTheme, webDarkTheme or a custom theme) and from the classes you apply to root. For a band that blends into the drawer, use tokens.colorNeutralBackground1 to match the InlineDrawer and OverlayDrawer surface; for a deliberately distinct brand band use tokens.colorNeutralBackground2 or tokens.colorNeutralBackground3. Title text belongs on tokens.colorNeutralForeground1 with tokens.fontSizeBase300 or tokens.fontSizeBase400, secondary text on tokens.colorNeutralForeground2 or tokens.colorNeutralForeground3, and any accent on the brand may use tokens.colorBrandForeground1 or tokens.colorBrandBackground. Separators under the header should use tokens.colorNeutralStroke2 (the same neutral stroke family that NavDivider uses) with tokens.strokeWidthThin, and focus rings must remain visible through tokens.colorStrokeFocus2 and tokens.strokeWidthThick. Spacing that mirrors the nav density comes from tokens.spacingHorizontalS, tokens.spacingHorizontalM, tokens.spacingHorizontalL, tokens.spacingVerticalMNudge, tokens.spacingVerticalM and tokens.spacingVerticalL. Selected nav entries below the header are themed with tokens.colorCompoundBrandForeground1 for the indicator, and motion with tokens.durationNormal and tokens.curveEasyEase; all of these tokens remap automatically in dark, high-contrast and forced-colours modes, which is why literal colour values break those themes while tokens do not.

## Migration Notes

The previous generation of Fluent navigation exposed one Nav component that also owned headers, groups and a large styling surface. In v9 the surface is decomposed: Nav owns state (selectedValue and defaultSelectedValue, selectedCategoryValue and defaultSelectedCategoryValue, openCategories and defaultOpenCategories, onNavItemSelect, onNavCategoryItemToggle, multiple, density), NavItem and NavSubItem own entries (value, href, icon, tabbable, actionButton, toggleButton, menuButton and their tooltip slots), and NavDrawer, NavDrawerHeader, NavDrawerBody and NavDrawerFooter own the shell — so NavDrawerHeader is now a plain slot container rather than a configuration object with header props. Selection is value based and reported through onNavItemSelect instead of link-click callbacks, category expansion is explicit through openCategories paired with onNavCategoryItemToggle, and contextual members such as categoryValue and navCategoryItem are React context plumbing that consumers never pass by hand. When porting an existing shell, expect to add the NavDrawer wrapper, to move header markup into NavDrawerHeader children (the header no longer styles arbitrary text you give it), and to keep responsive and density decisions on Nav and the Drawer rather than on the header.

## Edge Cases

- The header renders only a div and carries no heading or landmark role, so assistive technology will not announce the drawer's structure unless you add your own heading element inside it.
- In a persistent InlineDrawer the header stays visible when the drawer collapses to a rail on narrow viewports, so plan what should remain readable once the label no longer fits next to the icon.
- Long product, tenant or workspace names overflow narrow drawers; ensure the flex children can shrink by allowing zero minimum width and rely on Text truncation rather than overflow scrolling in the header.
- The root slot's className is merged with the component's own classes and applies only to the header element, not to the arbitrary children you render inside it — child spacing needs its own classes.
- Header padding does not follow the Nav density prop, so passing a different density to Nav without adjusting the header's vertical spacing shifts the first navigation row out of alignment with the brand mark.
- When the drawer is modal (OverlayDrawer), Escape dismisses the entire drawer from anywhere in the header, so inline editors or menus placed there must consume Escape first or they will take the drawer down with them.
- Because the header participates in neither selection nor expansion, values such as selectedValue, openCategories, categoryValue and navCategoryItem passed anywhere near it have no effect on the header itself and belong on the Nav components in the body.
- Trailing actionButton, toggleButton and menuButton slots are defined per navigation row, not for the header band; adding similar controls to the header means placing plain Button, ToggleButton or MenuButton elements there with their own labels and tooltips.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
