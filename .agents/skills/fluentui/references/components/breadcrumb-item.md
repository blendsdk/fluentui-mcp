# BreadcrumbItem

> **Package**: `@fluentui/react-breadcrumb` v9.4.2
> **Import**: `import { BreadcrumbItem } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

BreadcrumbItem is a single entry in a Breadcrumb trail. It renders an 'li' through its required root slot, so a series of BreadcrumbItems placed inside a Breadcrumb forms a semantic ordered list of links that shows users where they are in a site or app hierarchy and lets them jump back to an ancestor level. Each item is a layout container rather than a control: you place a BreadcrumbButton (or a similarly styled link) inside it for the clickable destination, and you place a BreadcrumbDivider next to it to visually separate it from its neighbors. The item itself owns the presentation concerns of the trail — the current flag marks the page the user is on, size scales the typography and iconography, and focusMode decides whether keyboard users move between items with arrow keys or with Tab. Because the trail is built from items, the item is where you express 'this is where we are' and 'these are the places you can go back to'.

**When to use**: Use BreadcrumbItem whenever you build a hierarchical navigation trail with Breadcrumb: one item per level, ordered from the broadest ancestor to the most specific current page. Reach for it instead of hand-rolling list items or spans so that the trail keeps correct list semantics, consistent spacing, and predictable keyboard behavior, and instead of TabList or a Menu when the destinations are not sibling views but ancestors of the current location. Use it in page headers of deep sections, in multi-step flows where earlier steps remain reachable, and in any drill-down surface where users need a cheap way to move up a level. Do not use it for primary navigation (that is Nav or a header menu) and do not use it when the path has no hierarchy worth expressing.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `current` | `boolean` | — | No | — |
| `focusMode` | `'arrow' \| 'tab'` | — | No | — |
| `root` | `Slot<'li'>` | — | Yes | — |
| `root` | `Slot<'li'>` | — | Yes | — |
| `size` | `'small' \| 'medium' \| 'large'` | — | No | — |

### Prop Guidance

- **current**: Set on the single item that represents the page or location the user is currently viewing. It marks the item as the end of the trail, suppresses the outbound link affordance, and exposes the current-page state to assistive technology. Only one item per breadcrumb should carry it, and that item should not navigate anywhere when activated. `true`
- **root**: The required slot that renders the item's outer element, an 'li' by default. Use it to attach a className or style for layout and spacing between the label and its divider, and only replace the underlying element when you have a compelling structural reason, in which case you must preserve the list semantics so the breadcrumb is still announced as an ordered trail. `root={{ className: styles.item }}`
- **focusMode**: Chooses how keyboard users move through the trail. Use 'arrow' for compact toolbars and headers where left and right arrow keys move between items while the whole trail stays a single tab stop, and use 'tab' when each destination should be individually tabbable, such as when the trail is embedded in a larger form or when users expect to tab straight through the page. Apply the same value to every item in one breadcrumb. `'arrow'`
- **size**: Controls the typographic and iconographic scale of the item with 'small', 'medium', or 'large'. Use 'medium' for standard page headers, 'small' for dense surfaces such as cards and side panels, and 'large' for prominent hero-level headers. Keep every item in a single breadcrumb at the same size so the trail reads as one component. `'medium'`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Mark exactly the last item of the trail with the current boolean so assistive technology announces it as the current page and it renders de-emphasized rather than as an outbound link.
- Render the clickable destination of each ancestor item with BreadcrumbButton so the trail inherits consistent focus, hover, and pressed styling instead of ad-hoc link styling.
- Separate entries with BreadcrumbDivider so the hierarchy is visually parsed at a glance, and keep the divider out of the tab order.
- Keep labels short and identical to the destination page title, so users can predict where an item leads before activating it.
- Set one size value and apply it consistently to every item in the same breadcrumb so the trail does not look like it was assembled from two different components.
- Give the containing Breadcrumb an accessible name, for example with aria-label, so screen reader users hear that the following list is a breadcrumb trail.
- Order items from the highest ancestor to the deepest page, mirroring the real information architecture of the site.
- Keep trails shallow — typically no more than five to seven levels — and collapse intermediate levels when the hierarchy is deeper than the space allows.

### Don'ts

- Do not give the current item a navigation target; the current page should not link to itself.
- Do not render BreadcrumbItem outside a Breadcrumb or another list container, because its root element is an 'li' and would lose its list semantics and parent context.
- Do not place raw divs, spans, or unstyled anchors as the interactive content of an item when BreadcrumbButton exists and keeps the trail visually and behaviorally consistent.
- Do not mix focusMode values across the items of one trail; keyboard users should experience a single, predictable navigation model.
- Do not use the breadcrumb as the only way to reach a page or section, since it only exposes ancestors and never siblings.
- Do not wrap long sentences or multi-line descriptions in an item; the trail is a label list, not an explanatory surface.
- Do not override the root slot with a non-list element unless you deliberately restore the list semantics with the appropriate role.
- Do not nest interactive controls into the same item, such as a button and a menu trigger side by side, since the item is a single destination.

## Anti-Patterns

### Linking the current page to itself

❌ If the last item is still an active link, keyboard and screen reader users are offered a destination that goes nowhere, and the trail no longer communicates 'you are here'. The current page also keeps looking interactive, competing visually with the ancestors the user can actually visit.

✅ Set the current boolean on the final item and render its label as non-navigating content or a button without a navigation target, so it reads as the terminus of the trail and is announced as the current page.

### Raw anchors and divs inside the item

❌ Dropping plain anchor tags, spans, or layout divs into a BreadcrumbItem bypasses the trail's consistent link styling, focus ring, and hover and pressed states, producing a visually uneven breadcrumb and inconsistent keyboard feedback.

✅ Render each destination with BreadcrumbButton inside the item, and put dividers between entries with BreadcrumbDivider so every level shares the same typography, spacing, and interaction states.

### Using breadcrumb items as primary navigation

❌ A breadcrumb only exposes the ancestors of the current location, so if it is treated as the main menu, sibling sections and peer pages become unreachable and the trail becomes long and noisy as it tries to cover the whole site.

✅ Keep BreadcrumbItem for hierarchy and recency, and expose top-level destinations through Nav, a header menu, or a Drawer instead, so the trail stays short and focused on going up a level.

### Replacing the root slot with a generic container

❌ Overriding the root slot with a plain div (or removing the surrounding list) destroys the ordered-list semantics the item was designed to provide, so screen readers no longer announce how many steps the trail contains or where an item sits in the sequence.

✅ Keep the default 'li' root inside a Breadcrumb, or if a different element is structurally required, restore equivalent semantics with an explicit list role and make sure the item remains a child of the list container.

### Mixing sizes and focus modes across one trail

❌ Items with different size values break the baseline alignment of the row, and items with different focusMode values make keyboard traversal unpredictable, so users cannot build a reliable mental model of how to move through the trail.

✅ Choose one size and one focusMode for the breadcrumb and apply them to every item, changing them only at the container level when the context of the trail changes.

## Accessibility

**Requirements**: BreadcrumbItem renders a list item, so it must live inside a Breadcrumb (or another list/landmark) to be announced as part of an ordered trail; the surrounding Breadcrumb should carry an accessible name. The item representing the page the user is on must set the current flag, which exposes aria-current so that the trail communicates position as well as navigation. Every interactive destination inside an item needs a discernible label, must be reachable and operable by keyboard, and must show a visible focus indicator. Focus order must follow the visible order of the trail, and the trail must meet contrast requirements in light, dark, and high contrast themes — the default de-emphasized color used for the current item and separators must still meet the contrast ratio for text.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the next focusable element; with focusMode set to 'tab' each item's link is its own tab stop, while with 'arrow' the whole trail is a single tab stop. |
| `Shift+Tab` | Moves focus to the previous focusable element, reversing the tab order through a 'tab' focusMode trail or leaving an 'arrow' focusMode trail in one step. |
| `ArrowRight` | With focusMode set to 'arrow', moves focus to the next item in the trail. |
| `ArrowLeft` | With focusMode set to 'arrow', moves focus to the previous item in the trail. |
| `Enter` | Activates the destination control (typically BreadcrumbButton) inside the focused item, navigating to that ancestor level. |
| `Space` | Activates the destination control inside the focused item, equivalent to Enter for button-based items. |

**ARIA**: aria-current, aria-label, role

**Screen Reader**: Because items are list items inside a breadcrumb trail, screen readers announce the trail as a navigation landmark or labeled list and then announce each item in order, including its position in the list. The item flagged with current is announced as the current page (via aria-current) rather than as a link, while ancestor items are announced as links with their visible label as the accessible name. Separators rendered with BreadcrumbDivider are announced as presentational and are not read out, so the trail reads as a clean sequence of destinations. If the root slot is replaced with a non-list element, the list container and item-count announcements are lost and the trail degrades into an undifferentiated run of links.

## Styling

Style the trail by targeting the item's root slot and the control inside it rather than wrapping the item in extra markup; use makeStyles together with mergeClasses and pass the resulting class to the root slot for layout, and to a BreadcrumbButton inside for link appearance. The item is a horizontal flex container, so gaps between the label and the divider are best expressed with tokens.spacingHorizontalXS or tokens.spacingHorizontalSNudge, and vertical rhythm with tokens.spacingVerticalXS. Text sizing should follow the size prop rather than hard-coded pixel values; the small, medium, and large options map onto the base font-size scale, so custom styles should reference tokens.fontSizeBase200, tokens.fontSizeBase300, or tokens.fontSizeBase400 and pair them with tokens.lineHeightBase200, tokens.lineHeightBase300, or tokens.lineHeightBase400 so the labels do not clip. If you need to truncate a long label, apply overflow, text-overflow, and white-space rules to the control inside the item and give it a maximum inline size, since the item itself is a flex container that will otherwise let the label wrap. Custom focus treatments should stay consistent with the rest of Fluent by using tokens.colorStrokeFocus2 with tokens.strokeWidthThick and tokens.borderRadiusMedium. Separator color is easiest to influence through the divider element, where tokens.colorNeutralStroke2 or tokens.colorNeutralForeground4 read correctly on both light and dark surfaces.

## Performance

BreadcrumbItem is a very light component: it renders a single list element plus whatever child you place inside it, so there is no extra wrapper depth and no internal state to reconcile. The main performance lever is the size of the trail itself — keep it to a handful of levels, since every item adds a focusable control and a divider to the DOM and to the tab order. Styles should be produced with makeStyles, which generates atomic classes once at module scope, and applied through mergeClasses on the root slot rather than through inline style objects, which would defeat class reuse and force new work on every render. Because items are typically static for the lifetime of a page, memoizing a trail or rendering it from a stable array avoids needless re-renders of the surrounding header, and any click handlers passed to the inner control should be stable references so the item subtree does not re-render on parent updates.

## Theming & Tokens

BreadcrumbItem inherits its typography and colors from the Fluent theme applied by FluentProvider: the size prop maps onto the base font-size and line-height ramp (tokens.fontSizeBase200/300/400 with the matching tokens.lineHeightBase200/300/400), and labels inside the item typically use tokens.colorNeutralForeground2 with tokens.colorNeutralForeground2Hover and tokens.colorNeutralForeground2Pressed for interaction states, while the current item is rendered de-emphasized with a muted foreground such as tokens.colorNeutralForeground3 so it visually steps back from the links. Emphasis for the active level can be reinforced with tokens.fontWeightSemibold against tokens.fontWeightRegular for the rest of the trail. Spacing between the label and its divider comes from the spacing ramp (tokens.spacingHorizontalXS, tokens.spacingHorizontalSNudge, tokens.spacingVerticalXS), focus rings use tokens.colorStrokeFocus2 with tokens.strokeWidthThick and tokens.borderRadiusMedium, and separators read best with a neutral stroke such as tokens.colorNeutralStroke2 or tokens.colorNeutralForeground4. All of these tokens resolve per theme, so the trail follows light, dark, and high contrast themes automatically and picks up brand variation when the theme is created with a custom brand ramp.

## Migration Notes

In v9 the trail is composed explicitly: BreadcrumbItem is a non-interactive list item and the clickable element must be provided as a child, typically BreadcrumbButton, whereas older Fluent versions exposed a single Breadcrumb component with an items array that produced both the list item and its link. That means markup written for the older array-based API does not map one-to-one — each entry becomes a BreadcrumbItem wrapping a BreadcrumbButton — and options such as the item's own href, onClick, or disabled state now belong to the child control rather than to the item. The current page is expressed with the current boolean on the item instead of a separate 'isCurrent' style flag or a manually applied aria-current attribute, and icon or divider customization is done with the divider and child slots rather than with an item template. Keyboard behavior is now configurable per component through focusMode rather than being fixed by the previous implementation.

## Edge Cases

- The root slot is required and defaults to a list item, so dropping a BreadcrumbItem into a container that is not a Breadcrumb list silently loses the list and item-count announcements that make the trail understandable to screen reader users.
- The current item is still part of the keyboard order in an arrow focusMode trail, so the focus indicator can land on the item that does not navigate; make sure focus styling on the current item is visible rather than suppressed.
- Long labels have no built-in truncation, and because the item is a horizontal flex container the text will stretch the trail instead of wrapping gracefully; apply overflow, text-overflow, and a maximum inline size to the control inside the item.
- A trail with a single item is legal but rarely useful; if the hierarchy has only one level, consider omitting the breadcrumb rather than rendering a lone current item with a trailing divider.
- Divider placement matters visually: a separator left dangling after the current item reads like a missing level, so hide or omit the trailing separator when the last item is marked current.
- In right-to-left layouts the trail's visual order and the arrow focus mode keys must be exercised together, since arrow navigation follows logical order while the separators mirror on screen.
- Items whose content is not an interactive control still render and focus as list items, but activation keys do nothing, which can confuse keyboard users if a destination-looking label is not actually a control.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
