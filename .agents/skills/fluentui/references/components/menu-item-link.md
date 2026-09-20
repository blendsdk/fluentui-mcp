# MenuItemLink

> **Package**: `@fluentui/react-menu` v9.25.0
> **Import**: `import { MenuItemLink } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

MenuItemLink is a navigation-oriented menu item that renders as an anchor element, giving link semantics inside a Menu. Because its only documented prop, href, is required, every MenuItemLink is a real navigation target rather than a purely in-page action: activating it moves the user to the destination URL while the surrounding Menu or MenuList handles focus management, dismissal, and keyboard navigation. It sits alongside MenuItem, MenuItemCheckbox, MenuItemRadio, and MenuItemSwitch, and is composed the same way — placed as a child of MenuList inside MenuPopover, opened from a MenuTrigger. Use it whenever a menu entry represents a destination (a page, an external site, a documentation anchor) instead of a command that mutates state on the current screen.

**When to use**: Use MenuItemLink when a menu entry should navigate somewhere — the same semantics as the Link component, but presented inside a Menu with correct menu keyboard behavior, roving focus, and popover dismissal. It is the right choice for application navigation menus, overflow navigation menus, and account or profile menus whose entries open other pages. Prefer plain MenuItem when the entry performs an in-page command (opening a Dialog, toggling a setting, submitting an action) rather than changing the URL. Prefer MenuItemCheckbox, MenuItemRadio, or MenuItemSwitch when the entry represents a persisted state the user toggles. If the destination is a single standalone link rather than part of a menu, use Link directly; if it is a primary call to action on the page, use a Button or CompoundButton instead.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `href` | `string` | — | Yes | — |

### Prop Guidance

- **href**: Required. The destination the entry navigates to when activated. Supply a real, resolvable URL — an absolute URL for external destinations, an application route for internal navigation, or a hash target for in-page anchors. Because this prop renders the item as an anchor, omit it only by switching to MenuItem for non-navigational commands. Keep the href and the visible label semantically aligned so that the announced link matches the destination the user expects. `/settings/profile`

## Best Practices

### Do's

- Always supply a meaningful href that points to a real, resolvable destination; the prop is required and drives both behavior and link semantics.
- Keep the visible label short and destination-focused (for example, a page or section name) so users can scan the menu quickly.
- Group related destinations with MenuGroup and MenuGroupHeader, and separate unrelated clusters with MenuDivider, so a navigation menu stays legible.
- Order entries by importance or by the user's likely task flow, and keep the most frequently used destinations closest to the MenuTrigger.
- Use MenuItemLink only for entries that actually change the URL, so assistive technology users can rely on consistent link behavior.
- Ensure the label text alone communicates the destination — avoid relying on surrounding context to disambiguate two similar entries.
- When a destination is external or opens in a new tab, make that explicit in the label or an accompanying description so users are not surprised.

### Don'ts

- Do not use MenuItemLink to trigger in-page actions such as opening a Dialog, toggling a theme, or signing out with a client-side handler only; use MenuItem for those commands.
- Do not pass placeholder or fragment-only hrefs purely to make the item look clickable — an anchor with no destination breaks the link contract.
- Do not nest interactive controls (buttons, checkboxes, other links) inside a MenuItemLink, since the item itself is the interactive element.
- Do not duplicate the same destination in multiple entries of one menu; consolidate instead of repeating.
- Do not use MenuItemLink outside of a Menu, MenuList, or MenuPopover context, because the surrounding composite widget supplies the focus and keyboard behavior it depends on.
- Do not encode destructive or irreversible operations as links, since links imply navigation and can be opened in new tabs or previewed by browsers.
- Do not overload the label with long sentences or trailing hints that belong in a Tooltip or description rather than the item text.

## Anti-Patterns

### Command masquerading as a link

❌ Attaching an href that is intercepted by a click handler so nothing navigates — for example a menu entry that only opens a Dialog — misleads users, breaks middle-click and new-tab behavior, and confuses screen reader users who are told the entry is a link.

✅ Use MenuItem for in-page commands and reserve MenuItemLink for entries that genuinely change the URL.

### Placeholder or dead destination

❌ Using an empty, fragment-only, or placeholder href to make the entry appear interactive produces a link that goes nowhere, damaging trust and failing link semantics.

✅ Always point href at a real destination; if no destination exists yet, render a disabled MenuItem instead of a fake link.

### Menu outside a menu context

❌ Rendering MenuItemLink on its own, without a MenuList inside a MenuPopover, loses the menu role, roving tabindex, typeahead, and Escape-to-close behavior that the surrounding composite widget provides.

✅ Always compose MenuItemLink within MenuTrigger, MenuPopover, and MenuList so the full menu accessibility contract is satisfied.

### Nested interactivity inside the link

❌ Embedding buttons, checkboxes, or additional links inside a MenuItemLink creates nested interactive elements, which is invalid markup and produces unpredictable focus and activation behavior.

✅ Keep one interactive element per entry; if a secondary affordance is needed, use MenuSplitGroup or place the control in a separate entry.

## Accessibility

**Requirements**: MenuItemLink participates in a composite menu widget, so it must be rendered inside a MenuList within a MenuPopover so that menu semantics, roving focus, and the required ARIA relationship between the MenuTrigger and the popover are established by the parent components. The required href prop gives the element native link semantics, which means the accessible name must come from the visible label text — never from an icon alone. Contrast for the label must meet WCAG 1.4.3 (4.5:1 for normal text) in default, hover, pressed, focused, and disabled states. Focus indication must remain visible when the item is focused via keyboard (WCAG 2.4.7), and target size should meet WCAG 2.5.8's minimum. Because an anchor with a destination is expected to navigate, avoid intercepting activation in a way that leaves the link without any observable result.

| Key | Action |
| --- | --- |
| `Enter` | Activates the MenuItemLink, follows href, and dismisses the open menu. |
| `Space` | In the menu composite, Space may activate the focused entry; note that on a plain anchor the browser's default Space behavior is page scrolling, so Enter remains the canonical activation key for link items. |
| `ArrowDown` | Moves focus to the next item in the MenuList, wrapping according to the menu's configured direction. |
| `ArrowUp` | Moves focus to the previous item in the MenuList. |
| `ArrowRight` | Moves toward or opens a submenu when the item participates in one; otherwise it follows the menu's horizontal movement policy. |
| `ArrowLeft` | Closes an open submenu and returns focus to the parent item that opened it. |
| `Home` | Moves focus to the first focusable item in the MenuList. |
| `End` | Moves focus to the last focusable item in the MenuList. |
| `Escape` | Closes the open menu without navigating and returns focus to the MenuTrigger. |
| `Tab` | Per standard menu behavior, closes the open menu and moves focus out of the menu rather than cycling within it. |
| `Character keys` | Typeahead: typing letters moves focus to the next menu entry whose label starts with the typed characters. |

**ARIA**: role, aria-label, aria-disabled, aria-haspopup, aria-expanded, tabindex

**Screen Reader**: The parent MenuList exposes menu semantics, so screen readers announce the list as a menu and each entry as a menu item; when a MenuItemLink is focused, its visible label is read as the accessible name and the anchor destination from href is exposed as link information, letting users distinguish navigational entries from command entries. Menus are announced as having a number of items, and moving with arrow keys reads each item in turn without leaving the menu. When the item is disabled, the disabled state is conveyed through aria-disabled rather than by removing the element, so it remains discoverable while being announced as unavailable. Closing the menu with Escape returns focus to the MenuTrigger, and screen readers announce that trigger again so the user's position is preserved.

## Styling

MenuItemLink inherits the MenuItem visual treatment, so style it through the parent MenuList or by targeting the item's root class rather than layering ad hoc inline styles. Use tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed for the hover and pressed backgrounds, and tokens.colorNeutralBackground1Selected for the selected entry in menus that track the current page. Text should default to tokens.colorNeutralForeground1, with hover and pressed emphasis via tokens.colorNeutralForeground1Hover and tokens.colorNeutralForeground1Pressed, and disabled entries using tokens.colorNeutralForegroundDisabled paired with tokens.colorTransparentBackground. Because the element is a link, accents can come from tokens.colorBrandForegroundLink, tokens.colorBrandForegroundLinkHover, and tokens.colorBrandForegroundLinkPressed, but keep the default neutral treatment for menu navigation so the whole menu reads consistently. Layout uses tokens.spacingHorizontalS and tokens.spacingHorizontalMNudge for the internal gutter, tokens.spacingVerticalSNudge for vertical padding, tokens.borderRadiusMedium for the item radius, and tokens.fontSizeBase300 with tokens.fontWeightRegular for the label. Focus styling relies on tokens.colorStrokeFocus2 with tokens.strokeWidthThin; never remove the focus outline. Size and shape tokens such as tokens.borderRadiusMedium scale with the FluentProvider theme, so avoid hard-coded pixel values that would break high-contrast or compact-density themes.

## Performance

MenuItemLink is lightweight because it renders a single anchor; rendering cost comes from the number of entries in the MenuList, not from any one item. Large navigation menus should be kept short or virtualized by the consuming application, since MenuList renders every entry into the popover when it opens. Avoid constructing new inline style objects or class-name strings per item on each render, as that defeats Griffel's atomic class caching; define shared styles once and reference them. Keep the item's children stable (plain text or memoized icon elements) so that re-renders of the menu container do not force unnecessary work on every entry. Because the popover content is typically mounted lazily on open, there is no benefit to pre-warming individual items.

## Theming & Tokens

MenuItemLink receives all of its colors, typography, and spacing from the nearest FluentProvider theme through Griffel tokens rather than hard-coded values. Background states map to tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground1Pressed, and tokens.colorNeutralBackground1Selected, while label color uses tokens.colorNeutralForeground1 with tokens.colorNeutralForeground1Hover for emphasis and tokens.colorNeutralForegroundDisabled for unavailable entries. Link-oriented accent colors are available through tokens.colorBrandForegroundLink, tokens.colorBrandForegroundLinkHover, and tokens.colorBrandForegroundLinkPressed. Focus relies on tokens.colorStrokeFocus2 and tokens.strokeWidthThin, spacing uses tokens.spacingHorizontalS, tokens.spacingHorizontalMNudge, and tokens.spacingVerticalSNudge, radius uses tokens.borderRadiusMedium, and text uses tokens.fontSizeBase300 and tokens.fontWeightRegular. Because these are theme tokens, switching between light, dark, high-contrast, and teams themes — and between density variants — updates the item automatically.

## Migration Notes

In Fluent UI React v8 menus, a navigational entry was typically expressed by giving a MenuItem an href or by placing a Link inside a menu entry, which blurred command and navigation semantics. In v9, MenuItemLink is the dedicated component for navigational entries: it requires href and renders as an anchor while still participating in MenuList keyboard navigation and focus management. When migrating, replace href-bearing MenuItem usages and Link-in-menu patterns with MenuItemLink, keep command entries on MenuItem, and move checkable entries to MenuItemCheckbox, MenuItemRadio, or MenuItemSwitch. Because styling now flows through Griffel and the theme, v8-era class name overrides for menu items should be replaced with tokens-based styles applied through the parent MenuList slot's className.

## Edge Cases

- Two entries with identical visible labels but different hrefs are ambiguous to screen reader users navigating by link text; differentiate the labels rather than relying on position.
- Because activating the entry navigates, any async work triggered on selection races with the page change; complete state persistence before navigation or use MenuItem for the command.
- External destinations and new-tab targets are not announced automatically by an anchor, so the label or an accompanying description must state that the destination leaves the current app or page.
- A MenuItemLink that is also rendered as disabled will not navigate, yet href is still required by the type; ensure the disabled state is intentional and that the entry is still understandable without activation.
- Menus containing many entries can overflow the viewport; the MenuPopover handles scroll, but extremely long navigation menus should be restructured rather than compressed.
- Typeahead matches on label text, so entries whose labels begin with decorative characters or icon glyphs may be hard to reach by typing.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
