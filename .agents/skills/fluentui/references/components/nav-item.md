# NavItem

> **Package**: `@fluentui/react-nav` v9.4.0
> **Import**: `import { NavItem } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

NavItem is a single destination entry within a Fluent UI React v9 navigation region, most commonly rendered inside NavDrawerBody inside a NavDrawer. It renders a root element (the root slot) containing an optional leading icon (the icon slot) followed by the item's label content, and it represents a place the user can navigate to rather than an action they perform. Each NavItem carries a required value string that identifies it to the surrounding navigation so the currently active destination can be tracked and styled consistently, plus an optional href that determines whether the item behaves as a link. Because NavItem only declares value and href, all selected-state and layout behavior is coordinated by the navigation container it lives in, which keeps individual items lightweight and declarative. Use it for top-level destinations; use NavCategoryItem when the entry expands into nested NavSubItem children, and NavSubItem for the nested destinations themselves.

**When to use**: Use NavItem for flat, leaf-level destinations in an application's primary navigation, such as the entries of a NavDrawer that take the user to a top-level page or section. Reach for it whenever the destination is a URL: supplying href gives real link semantics so users can open the target in a new tab, copy the address, or see the destination on hover. Use NavCategoryItem instead when an entry must expand to reveal a nested group of NavSubItem elements, and use SplitNavItem when an entry needs both a navigable primary target and a separate expanding affordance. Do not use NavItem for commands that change state on the current page; use Button, MenuItem, or ToolbarButton for those. Outside of a navigation container, use Link for inline hyperlinks and TabList or Toolbar for switching views or exposing commands.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `href` | `string \| undefined` | — | No | Destination where the nav item points to. |
| `value` | `string` | — | Yes | The value that identifies this navCategoryItem when selected. |

### Prop Guidance

- **value**: Required. Identifies this item within its navigation region so the container can determine which destination is current and apply current-item semantics. Use a stable, unique string such as the route path or a section id, and never duplicate it across sibling items in the same navigation; when you refactor routes, update the value alongside the router so the current destination does not silently point at the wrong entry. `dashboard`
- **href**: Optional. The destination the item points to. Supply it for any real navigable destination so the item renders as a link with full browser affordances such as middle-click, open in new tab, copy link address, and status-bar preview. Omit it only for items whose navigation is handled entirely by application code; be aware that the item then loses link semantics for assistive technology and cannot be opened in a new tab. `/settings/profile`
- **icon**: Optional slot. Renders immediately before the item's content and is decorative, so the label must still make sense without it. Provide a single small Fluent icon that reinforces the label's meaning, keep the icon set consistent across the whole navigation, and avoid using the icon as the only signal for the current or disabled state. `a home or settings glyph matching the destination`
- **root**: Required slot. The element that carries the item's layout, focus indicator, and interaction states. Its rendering is driven by whether href is present, so avoid replacing it with a custom element unless you also preserve the correct interactive semantics and keyboard behavior. `an anchor when href is supplied, otherwise the default interactive element`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `icon` | — | No | Icon that renders before the content. |
| `root` | — | Yes | The root element of the NavItem. |

## Best Practices

### Do's

- Give every NavItem a unique, stable value, because value is the required identifier the surrounding navigation uses to determine which destination is current; derive it from the route or section id rather than from the label text.
- Provide href for real destinations so the item renders with link semantics and users can open the destination in a new tab, copy the link address, or preview it on hover.
- Keep labels short, sentence-cased, and understandable on their own, because in a navigation region screen reader users often browse a list of links without the surrounding page context.
- Populate the icon slot only when the icon reinforces the label's meaning, and keep the same icon vocabulary across the whole navigation so the visual rhythm stays consistent.
- Order items by the frequency or importance of the destination, and group them logically with NavSectionHeader, NavDivider, or separate NavDrawerBody regions instead of relying on position alone.
- Use NavSubItem inside NavSubItemGroup for nested destinations under a NavCategoryItem so indentation, nesting depth, and selection state are handled by the navigation rather than by ad hoc styles.
- Keep the navigation container's current value in sync with the router so the correct NavItem receives selected styling and current-item semantics after every navigation event.

### Don'ts

- Do not use NavItem for actions such as signing out, opening a dialog, or toggling a setting; it is a destination element, so commands belong in Button, MenuItem, or ToolbarButton.
- Do not reuse the same value on two NavItems in one navigation region, because selection becomes ambiguous and the wrong entry may render as current.
- Do not render NavItem standalone, outside a Nav, NavDrawer, or NavDrawerBody; it loses its landmark context, selection coordination, and consistent spacing.
- Do not place NavItem directly inside a NavSubItemGroup or in place of a NavSubItem; nested entries must use the sub-item components to get correct indentation and depth behavior.
- Do not rely on color alone to communicate the current destination; combine the selected appearance with current-item semantics so low-vision and color-blind users can still identify it.
- Do not omit href and still expect link behavior; without it the item no longer offers open-in-new-tab, copy-link-address, or link announcements.
- Do not cram multi-line descriptions, badges, or nested interactive controls into the item's content, since NavItem exposes only the root and icon slots and long content crowds the fixed icon area.

## Anti-Patterns

### Using NavItem for actions

❌ NavItem is a destination element, so wiring sign-out, theme toggles, or dialog triggers to it breaks the mental model of a navigation list, and screen reader users hear them announced as links rather than as buttons. It also means those commands appear when users browse the navigation region by landmark or link list.

✅ Keep NavItem for destinations only and move commands to Button, MenuItem, ToolbarButton, or a footer region such as NavDrawerFooter so they are announced with the correct control role.

### Duplicate or label-derived values

❌ Because value is the required identifier used by the surrounding navigation, two items sharing a value make the current destination ambiguous: the wrong entry can render as current, or the active styling can disappear after a route change. Deriving value from translated or user-visible label text creates the same problem as soon as the label changes or is localized.

✅ Derive value from a stable route or section identifier, keep it unique within the navigation region, and update it deliberately whenever routes change rather than letting it track display text.

### Rendering NavItem outside its navigation container

❌ A NavItem used standalone, or dropped into a NavDrawerFooter or other non-navigation region, does not participate in selection coordination and is not inside the landmark that users jump to. The result is an item that looks navigational but never shows as current and is harder to discover with assistive technology.

✅ Render NavItems inside NavDrawerBody, or the equivalent navigation list of your container, and reserve footer and header regions for header content, commands, and actions.

### Flattening hierarchy into sibling NavItems

❌ Placing what is conceptually a child destination next to its parent as another NavItem produces a flat, unindented list that hides the information architecture and makes long navigations hard to scan. It also bypasses the depth and indentation handling that NavSubItem and NavSubItemGroup provide.

✅ Model the hierarchy with NavCategoryItem for the expandable parent and NavSubItem inside NavSubItemGroup for its children, so nesting is both visual and structural.

### Overriding styling in a way that erases states

❌ Hard-coding label colors or removing the focus outline to match a design breaks the hover, pressed, and selected distinctions, which are the primary visual cue for the current destination, and removes the only visible focus indicator for keyboard users.

✅ Override via theme tokens such as tokens.colorNeutralForeground2Selected and the neutral background state tokens, and keep a visible focus treatment using tokens.colorStrokeFocus2.

## Accessibility

**Requirements**: NavItem must meet WCAG 2.1 AA expectations for navigational links: link purpose must be clear from the label alone (2.4.4), focus must be visibly indicated at all times (2.4.7), text and icon contrast must reach at least 4.5:1 against the item background in every state including hover, pressed, and selected (1.4.3 and 1.4.11), and the interactive target must be large enough to activate reliably (2.5.8). The current destination must be programmatically determinable rather than conveyed by color alone, and the navigation region should be wrapped in a landmark so users can jump directly to it. Because NavItem is purely presentational about its own selection, the surrounding navigation is responsible for exposing which item is current and for keeping the accessible name of each item in sync with its visible label.

| Key | Action |
| --- | --- |
| `Enter` | Activates the focused item, following its href when one is provided. |
| `Space` | Activates the focused item when it does not render as a link; when href is present the native link behavior takes over and Space scrolls the page instead. |
| `Tab` | Moves focus to the next focusable nav item or out of the navigation region toward the page content. |
| `Shift+Tab` | Moves focus to the previously focused nav item or back out of the navigation region. |

**ARIA**: aria-current (for example, page) on the active destination so assistive technology announces the current item, aria-label or aria-labelledby when the visible label is abbreviated or ambiguous and needs a fuller accessible name, role link via the rendered anchor when href is provided, and no link role when it is not, aria-hidden on decorative icons rendered through the icon slot so they are not announced alongside the label

**Screen Reader**: A NavItem with href is announced as a link whose name comes from its label content, and the active one is additionally announced as the current page or current item when current-item semantics are present on it. Without href the item is announced as plain text inside the navigation, so it provides no way for users to know it is activatable. Navigating by landmark reaches the surrounding navigation region first, and listing links then reads each item's label in order, which is why labels must stand alone without relying on the icon or surrounding group header for meaning. Icons supplied through the icon slot are decorative and are not spoken, and nested sub-items are announced in the order they appear inside their expanded group.

## Styling

Style NavItem with makeStyles at module scope so Griffel emits one atomic class set per rule and every instance shares it. The most useful knobs are spacing and surface tokens: tune padding with tokens.spacingHorizontalM and tokens.spacingVerticalSNudge, round the item with tokens.borderRadiusMedium, and set the resting label color to tokens.colorNeutralForeground2 with hover, pressed, and selected variants tokens.colorNeutralForeground2Hover, tokens.colorNeutralForeground2Pressed, and tokens.colorNeutralForeground2Selected. State surfaces come from tokens.colorNeutralBackground2Hover, tokens.colorNeutralBackground2Pressed, tokens.colorNeutralBackground2Selected, tokens.colorNeutralBackground2HoverSelected, and tokens.colorNeutralBackground2PressedSelected. Typography defaults to tokens.fontSizeBase300, tokens.lineHeightBase300, and tokens.fontFamilyBase, with tokens.fontWeightSemibold available when you want the current destination to stand out. The gap between the icon slot and the label can be adjusted with tokens.spacingHorizontalSNudge or tokens.spacingHorizontalS, and focus can be reinforced with tokens.colorStrokeFocus2 and tokens.strokeWidthThin. Prefer overriding these tokens over hard-coded colors so the item keeps working across light, dark, and high-contrast themes.

## Performance

NavItem is a thin compositional component: it resolves a small number of slots and applies memoized Griffel classes, so its per-instance cost is low and it is safe to render dozens of them in a NavDrawer. Define every style through makeStyles at module scope rather than creating style objects or merging class strings during render, so class name resolution is cached across instances. Avoid passing freshly created objects, arrays, or inline element values into the icon slot on every render, since that defeats child reconciliation; hoist icon elements or memoize the parent list instead. The practical scaling limit is not NavItem itself but its container: when the current destination changes, the navigation re-renders, so keep heavy sibling content, such as large nested lists, out of the same render path and let long or deep navigations be grouped so the whole tree is not rebuilt unnecessarily.

## Theming & Tokens

NavItem consumes only Fluent theme tokens, which means it adapts automatically to FluentProvider's light, dark, and high-contrast themes without any custom CSS. The label color comes from the neutral foreground ramp: tokens.colorNeutralForeground2 at rest, with tokens.colorNeutralForeground2Hover, tokens.colorNeutralForeground2Pressed, tokens.colorNeutralForeground2Selected, and tokens.colorNeutralForeground2BrandHover for interactive and selected emphasis. Hover, pressed, and selected surfaces are driven by tokens.colorNeutralBackground2Hover, tokens.colorNeutralBackground2Pressed, tokens.colorNeutralBackground2Selected, tokens.colorNeutralBackground2HoverSelected, and tokens.colorNeutralBackground2PressedSelected, with tokens.colorSubtleBackgroundHover and tokens.colorSubtleBackgroundSelected available for subtler treatments. Shape and rhythm come from tokens.borderRadiusMedium, tokens.spacingHorizontalM, tokens.spacingHorizontalSNudge, and tokens.spacingVerticalSNudge, which shift together when the provider applies a density change. Typography resolves through tokens.fontFamilyBase, tokens.fontSizeBase300, tokens.lineHeightBase300, and tokens.fontWeightSemibold, and focus uses tokens.colorStrokeFocus2. Overriding any of these tokens cascades to every NavItem and keeps the navigation visually consistent with the rest of the themed surface.

## Migration Notes

In the previous major version the navigation components were configured declaratively: Nav accepted grouped item collections plus a selected-key style prop, and NavItem exposed separate props for a name, key, icon definition, secondary text, and a custom link renderer. In v9 the navigation is composed from primitives: NavItem declares only a required value and an optional href, the icon is supplied through the icon slot instead of an icon props object, and the current destination is owned by the surrounding navigation rather than by a selected-key prop on each item. Selection is therefore keyed off value rather than an arbitrary key, so migrate by giving every item a stable value that matches your route identity. The collapsible navigation panel from the older API is now expressed with NavDrawer, InlineDrawer, or OverlayDrawer plus NavCategoryItem and NavSubItemGroup for expanding entries, and SplitNavItem replaces the older split-entry pattern.

## Edge Cases

- value is required even for items that exist only as links with an href; omitting it fails at the type level and removes the item from selection coordination, so every item needs a stable identifier.
- Omitting href changes the rendered element so it no longer behaves as a link. Users lose open-in-new-tab, copy-link-address, and hover preview, and the item is announced as plain text rather than as a link.
- Two items with the same value inside one navigation region make the current destination ambiguous, which typically shows up as the wrong entry appearing selected after a route change rather than as an obvious error.
- Nested destinations must use NavSubItem inside NavSubItemGroup; placing a NavItem under a NavCategoryItem's expanded content bypasses indentation and depth handling and can break the visual hierarchy.
- Items rendered outside the navigation body, such as in NavDrawerFooter or NavDrawerHeader, are not part of the navigation landmark and will not receive coordinated current-item treatment.
- The icon slot occupies a fixed leading position, so pairing an icon with a very long label crowds the item and can push the text under the icon in narrow drawers; keep labels short and let grouping carry the structure.
- Items with href pointing to an external origin still render as links, but application routing no longer handles them, so any external-navigation affordance must be provided by your own wrapper rather than by NavItem.
- Because NavItem only exposes values and links, a hover or press style override that forgets the selected tokens will make the current destination look identical to an unselected one, which is invisible in code review but obvious to color-blind users.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
