# AppItemStatic

> **Package**: `@fluentui/react-nav` v9.4.0
> **Import**: `import { AppItemStatic } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

AppItemStatic is the non-interactive member of the Fluent UI React v9 application-item family used by the Nav navigation system. It renders a single root element — a div by default, supplied through the required root slot — that contains an optional leading graphic rendered through the icon slot (a span) followed by its children. Because the root is not a button, AppItemStatic contributes no activation, expansion, or selection behavior of its own; it exists so that an application-identity or header row can share the exact geometry, density, spacing, and typography of the interactive AppItem and NavItem rows that sit beneath it. It is typically composed inside NavDrawerHeader at the top of a NavDrawer, where it presents a product name, logo, or workspace label above the navigable destinations. The component draws its surrounding state from Nav context: the categoryValue and navCategoryItem context values that appear on its type surface are supplied by the enclosing Nav, NavCategory, or NavCategoryItem containers rather than being set by callers. An href may be provided when the static row should still act as a navigation target, in which case the root behaves like a link rather than a decorative block.

**When to use**: Use AppItemStatic when a row must visually belong to the navigation surface — matching the padding, icon sizing, and density of the items around it — but must not be a selectable destination or expose interactive affordances. The classic case is the brand or application name area at the top of a NavDrawer, composed through NavDrawerHeader above the Nav that holds the real destinations. Choose AppItem instead when the row needs built-in interactive slots such as actionButton, toggleButton, or menuButton; choose NavItem or NavSubItem when the row is a selectable destination that reports a value; choose NavCategoryItem when the row expands to reveal a group of children; and choose plain Text, Image, or a Card header when no navigation geometry or Nav context is desired at all. If the row must navigate but stay otherwise static, AppItemStatic with href is the appropriate middle ground.

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

- **root**: Required slot that renders the row's outer element; its default is a div, which is what makes the item non-interactive. Use it to attach className or style for spacing and typography customization, or to override the rendered element and attributes when the row needs different semantics. Anything you put here is merged with the component's own classes, so avoid replacing the built-in styling wholesale. `Provide a className that adjusts padding and font weight on the default div root`
- **icon**: Optional slot rendered as a span before the children, used for the product logo or a leading glyph. Because it always precedes the content, keep it to a single visual mark and hide decorative glyphs from assistive technology so only the app name is announced. `A small brand or product glyph shown immediately left of the application name`
- **href**: Supply only when the static row should navigate somewhere, such as a home or documentation link; the root then behaves as a link target and must have a discernible name and visible focus indicator. Omit it for purely decorative brand rows so the row stays out of the tab order. `A URL pointing at the product home page`
- **children**: The visible label of the row, rendered after the icon slot. Keep it to the application or workspace name; the type also permits null, in which case the row must be named some other way (for example aria-label on the root) or it will be meaningless to screen readers. `The application or workspace name, for example a short product title`
- **categoryValue**: A Nav context value describing the surrounding category. It is supplied by the enclosing Nav and NavCategory tree rather than set by consumers, so treat it as internal plumbing that keeps the row consistent with the drawer's category state. `Populated automatically from the surrounding NavCategory context`
- **navCategoryItem**: A NavCategoryItem context value describing the nearest category item. Like categoryValue it comes from context, not from call sites, and exists so the row can render with the right density and alignment inside the navigation surface. `Populated automatically from the surrounding NavCategoryItem context`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `icon` | — | No | Icon that renders before the content. |
| `root` | — | Yes | The root element of the AppItemStatic. |

## Best Practices

### Do's

- Render AppItemStatic inside the navigation surface that owns it — normally NavDrawerHeader at the top of a NavDrawer — so it inherits Nav density, alignment, and background from context.
- Pass the leading graphic through the icon slot instead of embedding an extra wrapper element at the start of children, so icon sizing and spacing stay consistent with sibling items.
- Keep children to a short application, product, or workspace name; long strings wrap or truncate awkwardly at narrow drawer widths.
- Mark purely decorative icons as hidden from assistive technology and let the visible text in children carry the name, or provide an accessible name when children are empty.
- Use href only when the row genuinely navigates somewhere, and then style the focus indicator so the link state remains visible against the drawer background.
- Adjust spacing through the root slot's className or style hooks (merged Griffel classes) rather than inserting additional wrapper divs, which break the shared row rhythm.
- Keep the row at the top of the drawer and out of the tab order of destinations, so keyboard users reach real navigation items first.

### Don'ts

- Do not use AppItemStatic for selectable destinations; it never reports a value and never renders selected styling. Use NavItem, NavSubItem, or NavCategoryItem instead.
- Do not expect hover, pressed, or selected visuals — the component is presentational and has no interactive states to style.
- Do not pass the categoryValue or navCategoryItem context values yourself; they are populated by the surrounding Nav containers and overriding them desynchronizes the row from the drawer.
- Do not nest focusable controls (buttons, links, inputs) inside children; use AppItem's actionButton, toggleButton, or menuButton slots when the row needs controls.
- Do not stack many AppItemStatic rows to imitate a navigation list; that produces a list with no selection semantics. Use NavItem rows inside a Nav instead.
- Do not use AppItemStatic as a general-purpose page header or layout container outside a Nav surface; it will pick up navigation styling that does not belong there.
- Do not add heading semantics to the root unless the row truly titles a section; a decorative brand row announced as a heading adds noise for screen reader users.

## Anti-Patterns

### Using AppItemStatic as a navigation destination

❌ The row renders a div root with no value, no selection handling, and no selected styling, so treating it as a destination produces navigation that nothing can highlight, track, or restore, and users cannot tell where they are.

✅ Use NavItem or NavSubItem with a value inside a Nav that supplies selectedValue and onNavItemSelect, and reserve AppItemStatic for the non-selectable application identity row.

### Making it clickable by nesting controls or handlers in children

❌ The static root has no button semantics, so nested buttons and links create ambiguous focus order, duplicated tab stops, and screen reader announcements that do not match the visual row.

✅ If the row must be interactive, switch to AppItem and use its actionButton, toggleButton, or menuButton slots, or add href when a plain link is enough.

### Passing Nav context values by hand

❌ categoryValue and navCategoryItem are context-driven; supplying them manually desynchronizes the row from the enclosing Nav density and category state and will break when the surrounding navigation changes.

✅ Place AppItemStatic inside the appropriate Nav, NavCategory, or NavDrawerHeader tree and let the component read context; do not forward these values yourself.

### Rebuilding the drawer header from divs and Text

❌ Hand-rolled header markup drifts from the padding, icon sizing, and density of the navigation items below it, so the drawer looks misaligned at every density and theme.

✅ Use AppItemStatic inside NavDrawerHeader and customize it through the root and icon slots so the row always shares the navigation geometry.

## Accessibility

**Requirements**: The default root is a div with no implicit role, so AppItemStatic carries no interactive semantics and needs no keyboard contract of its own. Content must still be perceivable and named: give the row an accessible name through visible text in children, or through aria-label or aria-labelledby when the row is icon-only. Icons placed in the icon slot should be aria-hidden when decorative, so screen readers do not announce an unnamed graphic ahead of the text. If href is provided and the root becomes a link, it must meet link requirements: a discernible name, an obvious focus indicator that meets the WCAG focus-appearance criteria (use tokens.colorStrokeFocus2 with tokens.strokeWidthThick and tokens.borderRadiusMedium), and color contrast of at least 4.5:1 for text against the drawer background (tokens.colorNeutralForeground1 on tokens.colorNeutralBackground2 satisfies this in the default light and dark themes). Never rely on color alone to distinguish the app row from destinations.

| Key | Action |
| --- | --- |
| `Tab` | The default div root is not focusable and is skipped when it holds no focusable content; the browser tabs into any focusable descendant, such as an anchor produced by href or custom children. |
| `Enter` | Follows the link when href makes the root an anchor; pressing Enter has no effect when the row is a plain static block, because AppItemStatic does not implement button activation. |
| `Space` | Has no effect. The component does not implement button semantics, so Space does not activate the row (and may scroll the drawer instead). |

**ARIA**: aria-hidden — apply to decorative icons rendered in the icon slot, aria-label — name the row when children provide no usable text (for example an icon-only brand mark), aria-labelledby — point at an existing visible element when the row is named elsewhere, aria-current — only when href makes the root a link that represents the user's current location

**Screen Reader**: Assistive technology encounters AppItemStatic as ordinary static content: there is no button role, no expand or collapse announcement, no selected state, and no live-region activity. Text is read in DOM order, and the icon slot content is announced before the children unless it is hidden with aria-hidden, which is why decorative glyphs should be hidden and meaningful text left in children. When href is present and the root renders as a link, screen readers announce it as a link with its accessible name and expose link navigation commands, so the name must be descriptive on its own.

## Styling

AppItemStatic accepts className and style on its root slot (and on the icon slot), both of which are merged with the component's own Griffel classes; prefer that over wrapping the row in extra containers. Build styles with makeStyles and merge with mergeClasses, and reach for shorthands where a shorthand exists (shorthands.padding, shorthands.margin, shorthands.gap) rather than repeating longhand properties. For a brand row that matches the drawer, common choices are tokens.spacingHorizontalMNudge and tokens.spacingVerticalMNudge for horizontal/vertical padding, tokens.spacingHorizontalS or tokens.spacingHorizontalXS for the gap between the icon slot and children, tokens.fontFamilyBase with tokens.fontSizeBase300 and tokens.fontWeightSemibold for the app name, tokens.lineHeightBase300 for stable row height, tokens.borderRadiusMedium for the rounded hover or focus surface, and tokens.colorNeutralForeground1 for the label so it reads as primary content while destinations use tokens.colorNeutralForeground2. When the row links out through href, add a focus style using tokens.colorStrokeFocus2 plus tokens.strokeWidthThick, and if you want a subtle brand treatment use tokens.colorBrandForeground1 for the icon and tokens.colorNeutralBackground3 or tokens.colorBrandBackground2 as a background when the row sits on tokens.colorNeutralBackground2. Truncate long names with Griffel's overflow, textOverflow, and whiteSpace properties (or the truncate helper) instead of allowing the row to wrap and change the drawer header height.

## Performance

AppItemStatic is a very light presentational component: it renders one root element plus an optional icon span, holds no state, registers no effects, and attaches no listeners of its own, so its render cost is essentially the cost of its subtree. Because it is meant to appear once or twice per drawer header, it is not a rendering hot spot. When styling it, define makeStyles calls at module scope rather than inside render so Griffel can cache and reuse the atomic classes; avoid creating new inline style objects on every render, since those defeat class reuse and can force repaints. If the icon slot receives an expensive inline SVG or an animated element, hoist that element so it is not recreated on each parent render, and keep the children to plain text rather than nested component trees so React reconciliation stays trivial. It performs no measurement or layout effects, so there is no reflow thrash risk beyond what your own overrides introduce.

## Theming & Tokens

AppItemStatic consumes the FluentProvider theme and the surrounding Nav context rather than exposing appearance or tone props, so its colors and metrics come from design tokens. Text and icons are drawn from the foreground ramp — tokens.colorNeutralForeground1 for the primary label, tokens.colorNeutralForeground2 for secondary or subdued icons, and tokens.colorBrandForeground1 when the app mark should read as branded. Backgrounds come from the surface ramp: the row itself is transparent so it inherits the drawer surface (typically tokens.colorNeutralBackground2 or tokens.colorNeutralBackground1), and any custom hover or accent treatment should use tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground3, or tokens.colorBrandBackground2 so it adapts to dark and high-contrast themes. Typography uses tokens.fontFamilyBase, tokens.fontSizeBase300, tokens.lineHeightBase300, and tokens.fontWeightSemibold; spacing uses the spacing ramp (tokens.spacingHorizontalMNudge, tokens.spacingVerticalMNudge, tokens.spacingHorizontalS, tokens.spacingHorizontalXS); shape and focus use tokens.borderRadiusMedium, tokens.colorStrokeFocus2, and tokens.strokeWidthThick. Because density is inherited from the Nav context rather than set on this component, the row's vertical rhythm changes with the surrounding navigation — verify any spacing overrides at every density and in both color schemes, since hard-coded pixel values will not follow the token ramp.

## Migration Notes

AppItemStatic is a v9-only component with no v8 equivalent: the v8 Nav shipped no static application row, so teams typically hand-built a header row from Stack, Icon, and Text and then fought to match nav spacing. When moving such custom header markup to v9, replace it with AppItemStatic inside NavDrawerHeader so the row inherits Nav density and alignment automatically. Note the deliberate split from AppItem: only AppItem renders the actionButton, toggleButton, and menuButton slots for interactive rows, while AppItemStatic stays a plain div root (optionally upgraded to a link with href). The component is not deprecated and has no renamed counterpart, but be aware that the generated prop table for this family is shared with Nav, NavCategoryItem, NavSubItemGroup, and NavDrawer props — entries such as value, selectedValue, defaultOpenCategories, onNavItemSelect, multiple, onNavCategoryItemToggle, and density belong to those surrounding containers, not to AppItemStatic itself.

## Edge Cases

- The default root is a div, so the row is not focusable and cannot be tabbed to; any perceived interactivity must come from href or from content you place inside children.
- Supplying href changes the root into a link target, which introduces link semantics, focus styling requirements, and Enter-key navigation that do not exist on the purely static variant.
- children accepts null, so an icon-only row is possible — it must then be named with aria-label on the root, otherwise screen readers announce an unnamed graphic.
- Density and category state arrive from the surrounding Nav context; rendering AppItemStatic outside a Nav or NavDrawerHeader tree means it falls back to defaults and may not line up with the items below it.
- Long application names can wrap and increase the drawer header height; handle overflow explicitly with Griffel's overflow, textOverflow, and whiteSpace properties rather than relying on the default.
- Because the component has no interactive states, any custom hover or active styling you add through the root slot is purely cosmetic and should not imply selectability that the component does not provide.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
