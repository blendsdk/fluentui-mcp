# AppItem

> **Package**: `@fluentui/react-nav` v9.4.0
> **Import**: `import { AppItem } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

AppItem is a single navigation entry in Fluent UI React v9's app-level navigation surface. It renders a root element (typically an anchor when a destination is supplied through the href prop) plus an optional icon slot that renders before the content, producing the classic icon-plus-label row used in navigation drawers and app rails. Because navigation items are used at the top tier of an application shell, AppItem is designed to sit inside a Nav region (for example within a NavDrawer, NavDrawerBody, or InlineDrawer) so that grouping, ordering, and the selected-destination state are supplied by the surrounding navigation container. AppItem is interactive and destination-oriented: it is the item you use when clicking should take the user somewhere, while its companion AppItemStatic covers the non-navigable, presentation-only case such as a section label, a heading row, or a placeholder entry that has no destination.

**When to use**: Use AppItem for top-level, app-scoped destinations in a navigation drawer or app rail: Dashboards, Reports, Settings, and similar primary places a user moves between. Use it when each entry has (or should have) a real destination you can express as a link, because the href prop gives the item native anchor behavior, including open-in-new-tab, copy-link, and status-bar URL preview. Prefer AppItemStatic when the entry is not a destination — a group header, an informational row, or an item that is temporarily unavailable. Prefer NavItem or NavSubItem when the navigation is hierarchical and expandable inside a Nav section, and prefer Button, ToggleButton, or MenuItem when the interaction performs an action in place rather than navigating.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `href` | `string \| undefined` | — | No | — |

### Prop Guidance

- **href**: Set href on every AppItem that represents a real destination so the item keeps native anchor semantics — copyable URLs, open in new tab, and predictable mouse behavior. Omit it only for items that are intentionally not navigable, and in that case prefer AppItemStatic so the missing destination is explicit. `/settings/billing`
- **icon**: The icon slot renders immediately before the item's content and is the standard way to add a leading glyph. Provide a single, decorative icon that reinforces the label; hide it from assistive technology when the label already carries the meaning, and keep the icon consistent across all items in the same navigation region. `A single icon element rendering a dashboard, document, or settings glyph`
- **root**: The root slot is the element users focus and activate. When href is provided it behaves as a link, so attach event handlers, className overrides, and data attributes here rather than to a wrapper. Overriding the element type changes semantics and keyboard behavior and should be done only deliberately. `An anchor element when href is set, otherwise the default interactive root element`
- **children**: The content rendered after the icon slot is the item's label and becomes the accessible name for the link. Keep it to a short, parallel, title-cased destination name; anything longer harms scanability in a navigation rail and is better placed on the destination page. `Reports`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `icon` | — | No | Icon that renders before the content. |
| `root` | — | Yes | The root element of the AppItem. |

## Best Practices

### Do's

- Always supply the href prop for entries that navigate, so the item keeps native link semantics such as open in new tab, copy link address, and hover URL preview.
- Keep labels to one or two words with consistent title casing; app-level destinations are scanned quickly, so short parallel labels outperform sentences.
- Place AppItems inside a Nav within a NavDrawer or InlineDrawer so the navigation landmark, ordering, and selected-state management come from the container rather than being reimplemented per item.
- Use the icon slot on every item in the same navigation region, or on none of them — a mix of icon and icon-less rows makes the list feel ragged.
- Use only one destination per AppItem and phrase the label as the destination name (for example 'Billing') instead of an instruction like 'Click here to go to billing'.
- Use AppItemStatic for non-navigable rows such as section headings, informational entries, or disabled placeholders so users do not expect a click to navigate.
- Keep the same icon family, stroke weight, and size across the region so the rail reads as one coherent set.

### Don'ts

- Don't use AppItem for in-page view switching or content toggling; Tab and TabList or a Button communicate that interaction far better.
- Don't nest interactive content (buttons, links, checkboxes, menus) inside an AppItem's content — nested interactive elements inside a single link produce invalid, confusing focus behavior.
- Don't render an icon-only AppItem without an accessible name; a bare glyph is announced ambiguously or not at all.
- Don't build multi-level, expandable hierarchies inside AppItem; use NavItem and NavSubItem inside a Nav for hierarchical navigation instead.
- Don't encode state — counts, unread markers, status — into the label text; use a Badge or CounterBadge next to the label instead.
- Don't hard-code colors, background fills, or focus outlines on the root, since that fights the hover, pressed, and selected treatments the navigation container applies.
- Don't overload a single AppItem with a long description or secondary paragraph; keep the row scannable and put detail on the destination page.

## Anti-Patterns

### Interactive controls nested inside a navigation item

❌ Placing a Button, Link, Checkbox, or Menu inside an AppItem's content creates nested interactive elements, producing invalid link markup, duplicate focus stops, and unpredictable activation for keyboard and screen reader users.

✅ Keep AppItem's content to label text plus optional decorative content such as a Badge or CounterBadge, and move real actions to a separate control outside the item — for example a Toolbar or a Menu anchored next to the row.

### Using AppItem for non-navigable rows

❌ Rendering section headings, informational rows, or unavailable entries with AppItem makes users expect navigation that never happens, which is especially damaging for keyboard and assistive technology users who activate the item and get nothing.

✅ Use AppItemStatic for any row without a destination, and reserve AppItem for entries that actually take the user somewhere via href.

### Icon-only items without an accessible name

❌ An AppItem whose only visible content is background imagery or an icon has no computed accessible name, so screen readers announce just 'link' and voice-control users cannot target it by name.

✅ Provide an accessible name through aria-label on the root slot for icon-only items, and aria-hide the decorative glyph so the name is announced exactly once.

### Hand-rolled selection styling that ignores the nav container

❌ Hard-coding backgrounds, borders, or colors to indicate the active destination duplicates what the navigation container already manages, drifts out of sync with the theme, and frequently drops the programmatic current-state signal.

✅ Let the enclosing navigation region own the selected treatment and make sure the current destination also carries aria-current, so the state is conveyed both visually and programmatically.

### Turning AppItem into a hierarchical tree

❌ Stuffing expandable sub-destinations into a single AppItem mixes a leaf link with composite widget behavior, breaking the predictable Tab order users expect from a list of links.

✅ Use NavItem and NavSubItem inside a Nav when the navigation is hierarchical, and keep AppItem as a single, flat destination.

## Accessibility

**Requirements**: Each AppItem must expose a single, meaningful accessible name derived from its visible label; icon-only items require an explicit accessible name on the root. Items must be reachable in keyboard order that matches their visual order. The currently active destination must be conveyed programmatically (for example through aria-current on the current item) and not by color alone, satisfying WCAG 1.4.1 Use of Color. Label text must meet WCAG 2.1 AA contrast of 4.5:1 against the item background for normal-size text and 3:1 for large text, and the focus indicator must maintain at least 3:1 contrast against adjacent colors (WCAG 1.4.11). Interactive targets should be at least 24 by 24 CSS pixels (WCAG 2.5.8) — the default AppItem row height comfortably exceeds this, but custom compact styling must not shrink below it. Because AppItem sets or supports the href attribute, it should be reachable and activatable the same way as any other link on the page.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the AppItem (or to the next focusable element when the AppItem is already focused). |
| `Shift+Tab` | Moves focus to the previous focusable element, returning to the previously focused AppItem or out of the navigation region. |
| `Enter` | Activates the item and follows the destination given by href when it is set. |
| `Space` | Has no default effect on a link-based AppItem; do not rely on Space to navigate — only Enter follows the destination. |

**ARIA**: aria-label — supplies an accessible name for icon-only AppItems or when the visible text is not a complete description of the destination., aria-current — marks the item that represents the user's current location, typically with the value "page"., aria-describedby — associates supplementary text, such as a short description of the destination, without changing the accessible name., aria-hidden — applied to the contents of the icon slot when the icon is purely decorative and its meaning is already carried by the label., role — the root slot keeps its implicit link role when href is present; override only when the item genuinely changes semantics.

**Screen Reader**: AppItem is announced as a link (when href is present) with the accessible name taken from its text content, and it is reported inside the enclosing navigation landmark so users can jump between navigation regions with landmark shortcuts. Decorative icons in the icon slot should be hidden from assistive technology so they are not announced in addition to the label. When the item carries aria-current, screen readers add an announcement such as 'current page', which is how the active destination is communicated without relying on the visual selected treatment. Because there is no composite widget behavior, arrow keys do not move between AppItems; users move through them with the standard Tab and Shift+Tab flow in DOM order.

## Styling

AppItem's default look is built from neutral foreground and background tokens, so restyling is usually a matter of overriding the root through className with Griffel's makeStyles rather than rewriting its state styles. The resting label uses tokens.colorNeutralForeground2, and the hover treatment pairs tokens.colorNeutralForeground2Hover with tokens.colorNeutralBackground2Hover; the pressed treatment uses tokens.colorNeutralForeground2Pressed with tokens.colorNeutralBackground2Pressed. Selected or active destinations are typically rendered by the surrounding navigation region using brand tokens such as tokens.colorBrandForeground1, tokens.colorBrandBackground2, and tokens.colorBrandBackground2Hover, with tokens.colorBrandStroke1 for an accent bar. For geometry, use tokens.borderRadiusMedium for the row shape, tokens.spacingHorizontalS for inline padding, tokens.spacingVerticalS or tokens.spacingVerticalMNudge for the row's vertical padding, and tokens.spacingHorizontalXS or tokens.spacingHorizontalSNudge for the gap between the icon slot and the label. Typography should stay on tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.lineHeightBase300, optionally strengthening the active item with tokens.fontWeightSemibold. Never remove the focus outline: keep the built-in indicator or restyle it with tokens.strokeFocus2, and pass your class names to the icon slot's className rather than wrapping the icon in extra elements, since an extra wrapper breaks the default flex alignment and truncation behavior.

## Performance

AppItem is a light component: it renders one root element plus an optional icon slot, so cost is dominated by how many items the navigation region contains rather than by the item itself. Because every AppItem is a focusable link, very long rails increase the number of tab stops and should be consolidated rather than allowed to grow unbounded. Define styles once at module scope with makeStyles instead of constructing style objects or new class names per render, and memoize icon elements so re-rendering a drawer does not recreate them. Avoid passing inline functions that change identity on every render when you attach handlers to the root, since that defeats the memoization that keeps large navigation lists cheap to re-render.

## Theming & Tokens

AppItem consumes the theme supplied by FluentProvider and expresses its resting, hover, and pressed states through neutral tokens: tokens.colorNeutralForeground2 for the label, tokens.colorNeutralForeground2Hover with tokens.colorNeutralBackground2Hover for hover, and tokens.colorNeutralForeground2Pressed with tokens.colorNeutralBackground2Pressed for press. The active/selected destination is typically styled with the brand ramp — tokens.colorBrandForeground1, tokens.colorBrandBackground2, tokens.colorBrandBackground2Hover, and tokens.colorBrandStroke1 — so it follows the brand variation set on the provider. Row geometry uses tokens.borderRadiusMedium together with the spacing scale (tokens.spacingHorizontalS, tokens.spacingVerticalS, tokens.spacingVerticalMNudge, tokens.spacingHorizontalXS), and typography follows tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.lineHeightBase300. Focus indication comes from the theme's stroke tokens such as tokens.strokeFocus2, and in high-contrast themes these resolve to system colors so the item stays visible. Because the spacing tokens are logical, the icon slot and label spacing mirror automatically in right-to-left layouts.

## Edge Cases

- When the href prop is omitted, the item no longer behaves as a link — it loses native affordances such as open in new tab and copy link address, and its semantics shift to whatever the root slot renders. If the entry has no destination, AppItemStatic is the clearer choice.
- An AppItem whose content is only an icon has no accessible name from its content; an explicit aria-label (or visually hidden text) is required, otherwise assistive technology announces an unlabeled link.
- Long labels wrap or truncate inside a fixed-width drawer, which can push the icon slot out of alignment with neighboring rows; keep labels short, or constrain the content and verify wrapping at the narrowest supported drawer width.
- Icons are placed logically before the content, so in right-to-left locales they appear on the right; do not hard-code left margins on the icon slot or the layout will break in RTL.
- Nesting AppItem inside another interactive container produces nested focus stops, so verify that each item is a single tab stop and that the surrounding region is not itself a link or button.
- Because clickable rows are commonly used as navigation links, middle-click and modifier-click must be allowed to open a new tab; avoid intercepting activation in a way that prevents the browser's default link behavior.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
