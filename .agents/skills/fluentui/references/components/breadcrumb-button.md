# BreadcrumbButton

> **Package**: `@fluentui/react-breadcrumb` v9.4.2
> **Import**: `import { BreadcrumbButton } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

BreadcrumbButton is the interactive crumb element of the Fluent UI React v9 breadcrumb family. It renders a single, focusable button that represents one level in the page hierarchy and is designed to be placed inside a BreadcrumbItem, with BreadcrumbDivider elements rendered between items by the parent Breadcrumb. Its defining feature is the `current` prop, which declares the crumb as the page the user is currently viewing; when `current` is true the crumb is visually emphasized (typically a heavier font weight and a stronger foreground color) and the appropriate ARIA state is applied so assistive technology announces it as the current page rather than as another navigable step. Because it is a button-based control, BreadcrumbButton is intended for crumbs that need to be activated in place; it composes naturally inside BreadcrumbItem and inherits sizing and layout behavior from its breadcrumb ancestors.

**When to use**: Use BreadcrumbButton for each crumb inside a Breadcrumb when you are rendering a hierarchical location trail — for example, Home > Products > Accessories > Product detail. Reach for it whenever the crumb must be actionable (the user can jump back up the hierarchy) or when it is the terminal crumb that should be marked with the `current` prop. Prefer it over dropping a generic Button into a Breadcrumb, because BreadcrumbButton participates in the breadcrumb's layout, divider placement, size context, and current-page semantics. Do not use breadcrumbs for linear, ordered processes such as wizards, checkout steps, or onboarding flows — those are sequential rather than hierarchical and belong in a stepper or progress-style pattern. Likewise, do not use breadcrumbs as a substitute for primary navigation (a Nav or NavDrawer); breadcrumbs are a secondary, contextual aid that complements the main navigation, and they should be omitted entirely on top-level pages where there is no hierarchy to express.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `current` | `boolean \| undefined` | `false` | No | Defines current sate of BreadcrumbButton. |

### Prop Guidance

- **current**: Boolean flag that declares this crumb as the page the user is currently viewing. Set it to true on exactly one crumb — normally the last item in the trail — so the crumb receives the emphasized typography and the current-page ARIA state. Leave it at its default of false for every ancestor crumb that the user can still navigate to. Avoid using it as a general-purpose "selected" or "disabled" marker for arbitrary crumbs. `true`

## Best Practices

### Do's

- Mark exactly one crumb per breadcrumb trail with the current prop, and place it last so the reading order matches the visual hierarchy.
- Order crumbs from the highest-level ancestor to the most specific page, so the trail reads left-to-right as a path into the site.
- Keep each crumb label short and identical to the destination page's title so users can predict where the crumb leads.
- Wrap every BreadcrumbButton in a BreadcrumbItem and let the parent Breadcrumb insert BreadcrumbDivider elements between items — manual dividers quickly drift out of sync.
- Omit crumbs that have no meaningful destination and collapse long trails rather than letting the row wrap or overflow its container.
- Give the enclosing Breadcrumb a distinct accessible name (for example via its aria-label) so the trail is distinguishable from the primary navigation landmark.
- Verify that the current crumb's label still matches the rendered page title when titles are localized, since breadcrumbs are frequently built from a route configuration.

### Don'ts

- Don't set the current prop on more than one crumb — a breadcrumb trail describes a single location, and multiple current states are ambiguous to both sighted and screen-reader users.
- Don't use a breadcrumb trail for sequential processes such as multi-step forms; it implies hierarchy, not progress.
- Don't rely on color or font weight alone to communicate the current crumb — the current prop exists precisely so the state is also exposed non-visually.
- Don't place BreadcrumbButton directly inside Breadcrumb without a BreadcrumbItem wrapper; the item is what carries spacing, sizing context, and divider position.
- Don't let trails grow unbounded — long hierarchies that wrap onto multiple lines or push content off-screen should be trimmed or collapsed.
- Don't treat a breadcrumb as the user's only way to navigate; users landing deep from search or a shared link still need the primary navigation and a working browser back button.
- Don't reuse BreadcrumbButton as a general-purpose action button outside of a breadcrumb, since its styling and semantics assume a hierarchy context.

## Anti-Patterns

### Multiple current crumbs

❌ Setting the current prop on more than one BreadcrumbButton makes the trail describe several locations at once. Screen reader users hear contradictory "current page" announcements, and sighted users cannot tell which level they are actually on.

✅ Mark only the terminal crumb — the page being rendered — with current and leave all ancestor crumbs in their default state, deriving the flag from the active route rather than hardcoding it.

### Using breadcrumbs for linear progress

❌ Breadcrumbs express a hierarchy, not a sequence. Reusing a trail to show wizard, checkout, or installation steps tells users they can jump freely between steps, which is usually false and can bypass validation.

✅ Use a stepper or a progress indicator for ordered processes and reserve the Breadcrumb family for hierarchical location trails.

### Bypassing BreadcrumbItem

❌ Placing BreadcrumbButton directly inside Breadcrumb skips the wrapper that manages per-crumb spacing, sizing context, and divider placement, so the trail renders inconsistently and breaks under overflow or responsive conditions.

✅ Always wrap each BreadcrumbButton in a BreadcrumbItem and let Breadcrumb render BreadcrumbDivider elements between the items.

### Indicating the current page with styling only

❌ Overriding the current crumb's color, weight, or background while ignoring the current prop removes the programmatic current-page signal, leaving screen reader users unable to determine their location (WCAG 2.4.8).

✅ Set the current prop first so the ARIA state is applied, then layer visual overrides through tokens; never suppress the prop in favor of custom classes alone.

### Unbounded trails that wrap or overflow

❌ Long, deep hierarchies produce breadcrumbs that wrap to several lines or spill outside their container, pushing page content and making the trail hard to scan.

✅ Shorten labels, trim crumbs that carry no value, or collapse the leading portion of the trail into a Menu-based overflow crumb driven by a BreadcrumbButton.

## Accessibility

**Requirements**: The breadcrumb must live inside a navigation landmark (provided by the parent Breadcrumb) that has an accessible name, satisfying WCAG 2.4.1 (Bypass Blocks) and 2.4.8 (Location) by giving users a way to understand and move within the page hierarchy. Every crumb must be reachable and operable by keyboard alone (WCAG 2.1.1) with a clearly visible focus indicator that meets non-text contrast expectations (WCAG 2.4.7 and 1.4.11); Fluent's focus ring tokens are applied for you but must not be removed by custom styles. Text and any icons must meet WCAG 1.4.3 contrast ratios in every theme, and the current crumb must never be distinguished by color alone. Because BreadcrumbButton is a button, it must expose a programmatic name from its visible label text; when the label is an icon-only or truncated value, an explicit accessible name is required (WCAG 4.1.2).

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the breadcrumb and forward through each BreadcrumbButton in DOM order (which should match the visual left-to-right order). |
| `Shift+Tab` | Moves focus backward through the crumbs and out of the breadcrumb back to the previously focused element. |
| `Enter` | Activates the focused crumb, navigating the user to that level of the hierarchy. |
| `Space` | Activates the focused crumb, matching native button behavior. |

**ARIA**: aria-current (set to "page" on the crumb marked with the current prop), aria-label (on the enclosing Breadcrumb navigation landmark, to name the trail), aria-labelledby (alternative naming strategy for the breadcrumb landmark when a visible heading describes it), aria-haspopup and aria-expanded (when a crumb triggers a Menu-based overflow or sibling picker)

**Screen Reader**: BreadcrumbButton renders with the native button role, so screen readers announce it as a button with its visible label and support activation with Enter and Space. When the current prop is set, the crumb exposes aria-current="page" and is announced as the current page, letting users distinguish their present location from the other links in the trail. The enclosing navigation landmark is announced as a navigation region whose name comes from the breadcrumb's aria-label, so users can jump to it from a landmark list. Position within the trail (for example "3 of 5") is not announced automatically; the ordered list structure and the visual dividers convey that information, so keep the DOM order aligned with the visual order and avoid reordering crumbs with CSS.

## Styling

BreadcrumbButton is styled almost entirely through Griffel theme tokens, so start by overriding tokens rather than writing raw CSS. Rest-state labels use tokens.colorNeutralForeground2, hover uses tokens.colorNeutralForeground2Hover (and, when a brand-tinted hover is desired, tokens.colorNeutralForeground2BrandHover). The crumb marked with current is emphasized with tokens.colorNeutralForeground1 plus tokens.fontWeightSemibold, which is why the current state reads as heavier without any extra markup. Pressed feedback uses tokens.colorNeutralForeground2Pressed, and hover backgrounds can be layered with tokens.colorNeutralBackground2Hover and tokens.colorSubtleBackgroundHover when you want a filled-chip look. Radius and spacing come from tokens.borderRadiusMedium, tokens.spacingHorizontalXS, tokens.spacingHorizontalS, and tokens.spacingHorizontalM; typography from tokens.fontFamilyBase, tokens.fontSizeBase300 (and tokens.fontSizeBase200 in dense toolbars). Keep the focus indicator intact by preserving tokens.colorStrokeFocus2 / tokens.colorStrokeFocus1 rather than zeroing out the outline. Target individual crumbs via the className you pass to BreadcrumbButton, and only reach for descendant selectors on the breadcrumb container as a last resort.

## Performance

BreadcrumbButton itself is extremely lightweight: it renders a single focusable button element per crumb with no portals, positioning logic, or internal state beyond what the parent breadcrumb context provides. The realistic performance risk is how the trail is generated — avoid rebuilding breadcrumb arrays on every render in large applications, memoize the component that maps a route hierarchy to crumbs, and keep event handlers stable rather than creating new closures for each crumb on every render. When the breadcrumb sits in a frequently re-rendering header or shell, isolating it in its own memoized component prevents unrelated state changes elsewhere in the shell from re-rendering the whole trail. If an overflow menu is composed from a BreadcrumbButton, keep the menu contents mounted lazily so a collapsed trail does not pay for a full menu tree it may never open.

## Theming & Tokens

BreadcrumbButton consumes the theme supplied by FluentProvider, so switching between light, dark, high-contrast, and brand themes automatically re-resolves every token it uses. Its resting label color comes from tokens.colorNeutralForeground2 and moves to tokens.colorNeutralForeground2Hover and tokens.colorNeutralForeground2Pressed for interaction states, while the crumb marked with current is rendered with tokens.colorNeutralForeground1 and tokens.fontWeightSemibold so it reads as the active location. Typography follows tokens.fontFamilyBase with tokens.fontSizeBase300, and spacing between the label, icon, and sibling items comes from tokens.spacingHorizontalXS through tokens.spacingHorizontalM. The focus indicator is drawn from tokens.colorStrokeFocus2 and tokens.colorStrokeFocus1; if you rebrand the breadcrumb, override these tokens on the breadcrumb container or via the FluentProvider theme rather than hardcoding hex values, so contrast is preserved in high-contrast themes.

## Migration Notes

In Fluent UI React v8 the breadcrumb was a single declarative component whose items were plain data objects with fields such as text, key, href, onClick, and isCurrentItem, and the current marker was expressed through isCurrentItem. In v9 the pattern is decomposed: you render a Breadcrumb containing BreadcrumbItem children, each holding a BreadcrumbButton, with BreadcrumbDivider between items. The v8 isCurrentItem concept maps to the v9 current prop on BreadcrumbButton, which also supplies the current-page ARIA state instead of only a visual style. Because items are now real components rather than data, per-item rendering, custom content, and event handling are expressed by composing children instead of by supplying configuration objects.

## Edge Cases

- A single-crumb breadcrumb (only the current page) conveys no hierarchy; consider omitting the breadcrumb entirely at the site root rather than rendering one lonely current crumb.
- When the trail collapses for narrow viewports, the collapsed crumb that opens an overflow menu is itself a BreadcrumbButton, so it must not also be marked as current.
- Truncated or icon-only crumb labels lose their accessible name — supply an explicit accessible label whenever text is visually clipped, and make sure the full label is still discoverable, for example through a Tooltip.
- The current prop is presentation and semantics only; it does not disable navigation. If the current crumb is also wired to activate, users can trigger a redundant reload of the page they are already on, so avoid attaching navigation behavior to the current crumb.
- Sizing is inherited from the surrounding breadcrumb context rather than set per button, so mixing different sized breadcrumb rows in the same header can produce visually inconsistent trails.
- Deep hierarchies cached from a route configuration can outlive a rename or move; verify that generated crumb labels still match the destination page titles after routing changes.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
