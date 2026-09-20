# BreadcrumbDivider

> **Package**: `@fluentui/react-breadcrumb` v9.4.2
> **Import**: `import { BreadcrumbDivider } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

BreadcrumbDivider is the separator element that sits between individual crumbs inside a Breadcrumb. It renders as a list item (the required root slot is typed as a Slot of 'li'), so it participates directly in the ordered list structure that Breadcrumb establishes, and it visually communicates hierarchy by drawing a small chevron-style glyph between two links. The component is purely decorative and non-interactive: it carries no click handler, no focus target, and no link semantics of its own. Its appearance is coordinated with the rest of the breadcrumb through the current, focusMode, and size props, which mirror the configuration of the surrounding navigation so that spacing, glyph scale, and focus behavior stay consistent from the first crumb to the last. Because it is a structural separator rather than a control, BreadcrumbDivider should always be rendered as a sibling of BreadcrumbItem and BreadcrumbButton elements inside a Breadcrumb, never as a standalone decorative glyph.

**When to use**: Use BreadcrumbDivider whenever you build a breadcrumb trail by hand — that is, whenever you compose Breadcrumb children yourself rather than relying on automatic separator injection — and you need the divider to match the size, theme, and focus model of the surrounding crumbs. It is the correct choice for separating ancestor crumbs from the current page in page headers, app shells, drawer headers, and multi-level settings or detail pages. Do not use it as a general-purpose visual separator between unrelated pieces of content: Divider is the right component for that, since Divider is designed for arbitrary content blocks and supports vertical orientation and alignment. Do not use BreadcrumbDivider outside of a Breadcrumb either, because it renders an 'li' and depends on the parent list semantics for valid markup. If your breadcrumb is short (a single crumb) or you supply the entire trail through the Breadcrumb component's own item list, you generally do not need to render BreadcrumbDivider directly at all.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `current` | `boolean` | — | No | — |
| `focusMode` | `'arrow' \| 'tab'` | — | No | — |
| `root` | `Slot<'li'>` | — | Yes | — |
| `root` | `Slot<'li'>` | — | Yes | — |
| `size` | `'small' \| 'medium' \| 'large'` | — | No | — |

### Prop Guidance

- **current**: Marks the element as representing the current location in the trail. On a divider this should remain unset or false in essentially all cases, because a separator is never the page the user is on; the current crumb is expressed with the current state on BreadcrumbItem or BreadcrumbButton instead. Set it only if a shared item-rendering abstraction hands the flag down to every child, and then ensure it resolves to false for the divider. `false`
- **root**: Required slot typed as an 'li'. It determines the element BreadcrumbDivider renders and is the hook for className, styles, and slot-level overrides. Keep the default list-item element so the breadcrumb keeps valid list semantics; if you change the element, make sure it is still a valid child of the surrounding list and that spacing is reapplied. Use it to add horizontal margin or to replace the default glyph with a custom child. `Slot<'li'>`
- **focusMode**: Describes how focus travels across the breadcrumb trail: 'arrow' for roving focus with arrow keys, or 'tab' for a conventional tab stop per crumb. The divider is not focusable, so this prop only needs to match the surrounding breadcrumb so the separator's spacing and glyph treatment stay visually consistent with the active focus model. Mismatching it with the sibling crumbs produces an inconsistent focus ring rhythm across the trail. `arrow`
- **size**: Controls the scale of the divider glyph and its surrounding box: 'small', 'medium', or 'large'. Match it to the adjacent crumbs — typically the same value passed to the parent breadcrumb — so that glyph height, text baseline, and horizontal rhythm line up. Use 'small' in dense surfaces such as toolbars and side panels, 'medium' for standard page headers, and 'large' for hero or marketing-level headers. `medium`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Render exactly one BreadcrumbDivider between every pair of adjacent crumbs, so a trail of N crumbs contains N minus one dividers.
- Keep the size prop on the divider identical to the size of the neighboring BreadcrumbItem and BreadcrumbButton elements so the glyph, text, and line height scale together.
- Keep focusMode consistent with the surrounding breadcrumb so the divider's spacing and glyph weight do not visually imply a different interaction model than the crumbs beside it.
- Leave current unset on the divider; reserve the current marker for the crumb that represents the page the user is already on.
- Use the root slot to attach className, styles, or a custom element when you need to adjust spacing or swap the glyph, rather than wrapping the divider in an extra element.
- Place BreadcrumbDivider as a direct child of Breadcrumb, alongside BreadcrumbItem children, so the generated list structure stays valid.
- Prefer the divider over hand-written slash or chevron characters so the separator automatically picks up theme colors, RTL flipping, and focus-visible spacing.

### Don'ts

- Do not render a divider before the first crumb or after the last crumb; leading and trailing separators are visually noisy and confuse the reading order.
- Do not set current on a BreadcrumbDivider to indicate the active page — use the current state on the BreadcrumbItem or BreadcrumbButton that represents that page.
- Do not make the divider focusable, wrap it in a link, or attach click handlers; it is a decorative separator and should never appear in the tab order.
- Do not mix sizes on the divider and the crumbs — a large divider between small crumbs breaks the baseline alignment of the whole trail.
- Do not use BreadcrumbDivider as a replacement for Divider when separating sections, toolbars, or menu content; the divider is bound to breadcrumb list semantics.
- Do not nest the divider inside additional wrapper elements or fragments, since that detaches it from the parent list and can produce invalid markup.
- Do not duplicate dividers when a Breadcrumb already inserts separators automatically, as you will end up with doubled glyphs between crumbs.

## Anti-Patterns

### Hand-rolled separator characters

❌ Typing a slash, greater-than sign, or raw chevron character between crumbs bypasses the divider's themed colors, size scaling, RTL flipping, and spacing tokens, so the trail drifts out of alignment the moment the theme or density changes.

✅ Render BreadcrumbDivider between crumbs and let it supply the glyph, spacing, and theme-aware color.

### Focusable or clickable divider

❌ Wrapping the divider in a link, adding a tab index, or attaching an onClick handler inserts a meaningless tab stop into the trail, forcing keyboard and screen reader users to step through a purely decorative element.

✅ Keep the divider non-interactive and non-focusable. Put interactivity only on the crumbs via BreadcrumbButton or Link.

### Size mismatch across the trail

❌ Giving the divider a different size than its neighboring crumbs breaks vertical alignment and makes the separator look like a separate control rather than part of the same navigation unit.

✅ Pass one size value to the breadcrumb and its dividers together, and verify the glyph baseline against tokens for small, medium, and large.

### Divider used as the current marker

❌ Setting current on a BreadcrumbDivider to signify the active page communicates the wrong semantics to assistive technology, because the current location must be attached to the crumb that represents that page.

✅ Apply the current state to the last BreadcrumbItem or BreadcrumbButton and leave current unset on every divider in the trail.

### Leading and trailing separators

❌ Rendering a divider before the first crumb or after the last one adds visual noise and implies that content exists on both sides when it does not, which is especially confusing in single-level trails.

✅ Emit dividers only between adjacent crumbs, so the count of dividers is always one fewer than the number of crumbs.

## Accessibility

**Requirements**: BreadcrumbDivider is decorative and must not be exposed as an interactive control. The glyph it renders should be hidden from assistive technology (typically via aria-hidden) while the surrounding navigation landmark — provided by Breadcrumb — supplies the accessible name and list structure. The current page must be conveyed with aria-current on the crumb itself (via BreadcrumbItem or BreadcrumbButton current), not by the divider. Contrast between the divider glyph and its background should meet WCAG 1.4.11 non-text contrast expectations, which the default theme tokens satisfy at both small and large sizes.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the next focusable crumb when the breadcrumb is configured with the tab focus mode; the divider itself is never a tab stop. |
| `Arrow Right` | Moves focus to the next crumb when the breadcrumb uses the arrow focus mode, with the divider skipped as a non-focusable element. |
| `Arrow Left` | Moves focus to the previous crumb in arrow focus mode, again skipping over the divider. |
| `Home` | Moves focus to the first crumb in the trail in arrow focus mode. |
| `End` | Moves focus to the last (current) crumb in the trail in arrow focus mode. |
| `Enter` | Activates the focused crumb link or button; pressing it while a divider would be in the visual path does nothing because the divider is not focusable. |
| `Space` | Activates the focused crumb when the crumb is rendered as a button; the divider never receives this key. |

**ARIA**: aria-hidden, aria-current, aria-label, role

**Screen Reader**: Screen readers announce the breadcrumb as a navigation region and read the crumbs in order, but skip the divider glyph entirely because it is marked decorative. The glyph's presence in the visual layout therefore adds no verbosity to the announcement. Because the divider renders as a list item, it contributes to the list's child count in some screen readers, which is why it must always be a genuine sibling of the crumb list items and must never be duplicated or wrapped. The current page is announced through aria-current on the final crumb, not through the divider.

## Styling

BreadcrumbDivider inherits its glyph color from the theme, so the lightest reliable customization is to adjust the divider through the root slot's className or styles rather than overriding the icon path directly. Use tokens.colorNeutralForeground2 for a standard separator and tokens.colorNeutralForeground3 when the trail should recede further behind the page title; the current crumb typically uses tokens.colorNeutralForeground1, and interactive crumbs use tokens.colorBrandForeground1 at rest with tokens.colorBrandForeground1Hover on hover. Horizontal breathing room is controlled with tokens.spacingHorizontalXS or tokens.spacingHorizontalS on the root slot, and vertical alignment is best handled with tokens.spacingVerticalXXS plus tokens.lineHeightBase300 so the glyph centers against text. Font-size based scaling should follow the size prop: tokens.fontSizeBase200 for small, tokens.fontSizeBase300 for medium, and tokens.fontSizeBase400 for large, with matching icon sizes. If you need a custom glyph, style the root slot to keep the same box dimensions and center it with tokens.strokeWidthThin borders or an icon color of tokens.colorNeutralForeground2Hover when a parent is hovered. Never hard-code hex colors, since the divider must remain legible across the light, dark, and high-contrast themes that FluentProvider switches between.

## Performance

BreadcrumbDivider is a stateless, non-interactive element with no internal state, no effects, and no event subscriptions, so its render cost is essentially that of the glyph plus its wrapper. In long or dynamically generated trails, the practical cost scales with the number of dividers, so avoid re-creating the crumb array on every render and instead derive it from stable data. Because the divider accepts slot props, passing inline style objects or freshly created className strings forces unnecessary style recalculation — prefer Griffel classes from makeStyles or the styles prop resolved outside the render path. Memoizing repeated crumb-and-divider sequences is worthwhile in navigation surfaces that re-render frequently, such as shells that update on every route change.

## Theming & Tokens

BreadcrumbDivider draws its default glyph color from tokens.colorNeutralForeground2, which is the same token family used for secondary breadcrumb text, so the separator automatically recedes relative to the current crumb rendered with tokens.colorNeutralForeground1 and to interactive crumbs rendered with tokens.colorBrandForeground1. Interactive crumb hover states use tokens.colorBrandForeground1Hover and pressed states use tokens.colorBrandForeground1Pressed, and hovering an adjacent crumb is a good cue to lift the divider toward tokens.colorNeutralForeground2Hover. Spacing around the divider comes from tokens.spacingHorizontalXS and tokens.spacingHorizontalS, while size-related scaling maps to tokens.fontSizeBase200, tokens.fontSizeBase300, and tokens.fontSizeBase400 with tokens.lineHeightBase300 keeping the glyph vertically centered. Display and background values such as tokens.colorTransparentBackground and the stroke width tokens.colorTransparentStroke keep the divider clean on colored header surfaces. All of these are theme-switched by FluentProvider, so the divider stays legible in light, dark, and high-contrast themes without local overrides.

## Edge Cases

- A breadcrumb with a single crumb should render no dividers at all; a lone separator implies a hierarchy that does not exist.
- Because the divider renders an 'li', wrapping it in a div, span, or fragment to apply layout styles invalidates the list structure — apply those styles through the root slot instead.
- When the trail is generated from data, an off-by-one in the mapping loop commonly produces a trailing divider after the current page; verify the divider count is one fewer than the crumb count.
- In right-to-left layouts the separator glyph direction flips with the document direction, so any custom glyph substitution must also be direction-aware to avoid pointing the wrong way.
- Long trails that collapse into an overflow menu reduce the visible crumb count, and the divider count must shrink with it to avoid orphaned separators around the overflow trigger.
- When the divider is placed inside a horizontally constrained container, spacing tokens on the root slot are the first thing to compress, which can cause crumbs to visually touch; set a minimum gap rather than relying on flex shrink.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
