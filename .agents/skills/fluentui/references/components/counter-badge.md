# CounterBadge

> **Package**: `@fluentui/react-badge` v9.5.3
> **Import**: `import { CounterBadge } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

CounterBadge is a compact, non-interactive data-display component that renders a numeric count or a small dot indicator to communicate quantities such as unread messages, pending tasks, or newly added content. It shares the visual foundation of Badge but adds count-specific behavior: the count prop supplies the number being displayed, overflowCount caps what is rendered once the value grows past a threshold, showZero decides whether a zero value still renders at all, and dot collapses the badge into a minimal indicator when the precise number is not useful to the user. CounterBadge exposes no slots and contains no focusable elements, so it is intended to sit beside or inside another component — a Button, Tab, NavItem, MenuItem, Avatar, or similar — and to derive its meaning from that parent. Appearance, color, shape, and size let the badge blend into whatever surface it is attached to without any custom styling.

**When to use**: Use CounterBadge whenever you need to surface a small, glanceable quantity that augments another element: the number of unread messages on an inbox NavItem, the count of new items in a Tab, the number of pending approvals on a toolbar Button, or a dot on an Avatar indicating unseen activity. Reach for Badge instead when you need a short static label or status word rather than a number, and use PresenceBadge when you are communicating availability or presence states (available, away, busy) rather than a count. Prefer the dot variant of CounterBadge when the exact quantity is noise — the user only needs to know that something exists — and the count variant when the magnitude matters. Because CounterBadge is decorative by nature, it should always be used in combination with a parent control or label that carries the accessible name, rather than as a standalone piece of information.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `"filled" \| "ghost" \| undefined` | `filled` | No | A Badge can have different appearances that emphasize certain parts of it:  - filled: The default appearance if one is not specified.    The badge background is filled with color with a contrasting foreground text to match.  - ghost: The badge background is transparent, with the foreground text taking color to emphasize it. |
| `color` | `"brand" \| "danger" \| "important" \| "informative" \| undefined` | `brand` | No | Semantic colors for a counter badge |
| `count` | `number \| undefined` | `0` | No | Value displayed by the Badge |
| `dot` | `boolean \| undefined` | `false` | No | If a dot should be displayed without the count |
| `overflowCount` | `number \| undefined` | `99` | No | Max number to be displayed |
| `shape` | `"circular" \| "rounded" \| undefined` | `circular` | No | A Badge can be circular or rounded |
| `showZero` | `boolean \| undefined` | `false` | No | If the badge should be shown when count is 0 |

### Prop Guidance

- **appearance**: Controls whether the badge has a solid colored background with contrasting text (filled, the default) or a transparent background with colored text (ghost). Use filled when the badge sits on a neutral surface and needs to stand out; use ghost when it sits on a colored, branded, or image background where a filled badge would clash. `filled`
- **color**: Selects the semantic color of the badge. The documented values are brand (default) for standard product emphasis, danger for error and destructive counts, important for high-priority alerts, and informative for neutral informational callouts. Always pair the color with another cue so meaning is not conveyed by color alone. `danger`
- **count**: The number rendered inside the badge. Pass the raw value and let overflowCount handle capping; the badge renders nothing at zero unless showZero is enabled. Keep the value in state so it updates as the underlying data changes. `12`
- **dot**: Renders a small dot instead of a number, which is the right choice when the user only needs to know that something exists rather than how much. The Dot story pairs dot with count of zero, and the numeric value is not displayed while dot is set. `true`
- **overflowCount**: The maximum number the badge displays before it switches to an overflow treatment. The default is 99. Lower it for small badges attached to icons, where a two-digit value already crowds the target, and raise it only when the exact large number matters. `99`
- **shape**: Chooses between a fully circular badge (default) and a rounded rectangular one. Circular reads best for single-digit counts and dots; rounded gives more room and a calmer silhouette for multi-digit counts or when the badge sits flush against a rectangular control. `rounded`
- **showZero**: Determines whether the badge is rendered when count is zero. Leave it at the default false so an empty count disappears entirely; enable it when an explicit zero is meaningful on the surface, such as a metrics dashboard where absence and zero are different states. `true`

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { CounterBadge } from '@fluentui/react-components';
import type { CounterBadgeProps } from '@fluentui/react-components';

export const Default = (args: CounterBadgeProps): JSXElement => <CounterBadge {...args} />;

Default.args = {
  count: 5,
};
```

### Appearance

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { CounterBadge } from '@fluentui/react-components';

export const Appearance = (): JSXElement => {
  return (
    <>
      <CounterBadge count={5} appearance="filled" />
      <CounterBadge count={5} appearance="ghost" />
    </>
  );
};

Appearance.parameters = {
  docs: {
    description: {
      story: 'A counter badge can have a `ghost` or `filled` appearance. The default is `filled`.',
    },
  },
};
```

### Color

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { CounterBadge } from '@fluentui/react-components';

export const Color = (): JSXElement => {
  return (
    <>
      <CounterBadge appearance="filled" color="brand" count={5} />
      <CounterBadge appearance="filled" color="danger" count={5} />
      <CounterBadge appearance="filled" color="important" count={5} />
      <CounterBadge appearance="filled" color="informative" count={5} />
    </>
  );
};

Color.parameters = {
  docs: {
    description: {
      story:
        'A counter badge can be different colors.' +
        ' The available colors are `brand`, `danger`, `important`, `informative`, ' +
        '`severe`, `severe`, `success` or `warning`.' +
        ' The default is `brand`.' +
        ' Information conveyed by color should also be communicated in another way' +
        ' to meet [accessibility requirements](https://w3c.github.io/wcag/guidelines/22/#use-of-color).',
    },
  },
};
```

## Best Practices

### Do's

- Pass the real numeric value through count and let overflowCount handle capping, so the component can render its own overflow treatment instead of you pre-formatting a truncated string.
- Set overflowCount to a value that matches your product's expectations — the default of 99 is fine for inbox-style counts, but a lower cap such as 9 or 20 often reads better on small badges attached to icons.
- Give the parent control an accessible name that includes the meaning of the count, because the badge itself is not focusable and screen readers announce the text in the context of the element it is attached to.
- Use dot when the user only needs to know that something is new; reserve the numeric variant for cases where the magnitude genuinely changes the user's decision.
- Set showZero when a zero value is meaningful to show (for example, a dashboard-style surface where an explicit 0 is informative) and leave it off everywhere else, since the default is to hide a zero count.
- Choose color semantically — brand for neutral product emphasis, danger for error or destructive counts, important for high-priority alerts, and informative for neutral informational callouts — and reinforce that meaning with the surrounding text or icon.
- Use the ghost appearance when the badge sits on a colored, branded, or image background where a filled badge would either clash or disappear.
- Let React state drive the count so that the badge re-renders as the underlying data changes, rather than mutating DOM text directly.

### Don'ts

- Do not build the overflow string yourself (for example, appending a plus sign to a truncated number) — pass the raw value to count and configure overflowCount instead.
- Do not attach click handlers, tabIndex, or focus behavior to CounterBadge; it is not an interactive element, and adding interactivity to it breaks keyboard and screen reader expectations.
- Do not rely on the badge color alone to convey severity or status; color must always be paired with another cue to satisfy the WCAG Use of Color requirement.
- Do not combine dot with a numeric count expecting both to render — dot collapses the badge to an indicator and the number is not shown.
- Do not use CounterBadge to represent presence, availability, or a status word; that is what Badge and PresenceBadge are for.
- Do not stack multiple CounterBadges on a single target element, which creates ambiguity about what each number refers to.
- Do not place a CounterBadge inside a component that has no accessible name of its own, such as an icon-only Button without an aria-label, because the count will be announced without context.
- Do not animate or continuously tick the count as a decorative effect; frequent unannounced changes create noise for assistive technology users.

## Anti-Patterns

### Formatting the overflow string by hand

❌ Building a display string such as a truncated number with a trailing plus sign before passing it in bypasses the component's own overflow logic, produces inconsistent typography, and makes it impossible to change the threshold later without touching every call site.

✅ Pass the true value to count and set overflowCount to the threshold you want; the badge handles the capped display itself.

### Treating the badge as an interactive control

❌ Adding click handlers, tabIndex, or hover affordances to CounterBadge creates a target that is not keyboard reachable in a predictable way and confuses screen reader users, who hear a number with no role attached to it.

✅ Attach the interaction and the accessible name to the parent control — Button, MenuItem, NavItem, Tab, or a wrapping Link — and let the badge remain purely decorative inside it.

### Communicating status through color alone

❌ Switching color between brand, danger, important, and informative without any accompanying text or icon means users with color vision deficiencies, and users of monochrome or high-contrast modes, lose the meaning entirely.

✅ Pair the colored badge with a visible label, icon, or explanatory text in the surrounding UI, and confirm that the badge text keeps sufficient contrast in every theme.

### Using a dot when the magnitude matters

❌ A dot-style badge tells the user that something exists but nothing about how much, so quantities that drive prioritization — such as a queue of dozens of items — become impossible to judge at a glance.

✅ Use the numeric count with an appropriate overflowCount when the size of the quantity affects the user's decision, and reserve dot for simple seen/unseen signaling.

### Expecting zero-count badges to appear by default

❌ Teams often assume a badge will render with a zero value and are surprised by an empty slot, then work around it by passing a formatted string or a fake count of one.

✅ Enable showZero when a literal zero must be visible; otherwise treat the hidden state as the intended behavior and let the badge disappear when the count reaches zero.

## Accessibility

**Requirements**: CounterBadge must meet WCAG 1.4.1 Use of Color, which requires that any information conveyed by the badge color also be available through text, iconography, or position. Filled and ghost appearances must both provide text contrast of at least 4.5:1 against their background (WCAG 1.4.3), which the component achieves through theme tokens but which can be broken if you override colors. Because the badge is non-interactive, WCAG 4.1.2 Name, Role, Value applies to the element it decorates: the parent Button, Tab, NavItem, or MenuItem must expose an accessible name that makes sense of the count. If the badge is purely redundant with a visible label, it should be hidden from assistive technology rather than duplicated in the reading order.

| Key | Action |
| --- | --- |
| `Tab` | CounterBadge is not focusable and never receives focus; the Tab key moves focus to the parent control the badge is attached to, such as a Button or Tab. |
| `Enter` | Activates the parent control (Button, MenuItem, NavItem) that the badge decorates, not the badge itself. |
| `Space` | Activates the parent control when it is a Button or similar button-role element; the badge has no separate activation behavior. |
| `Arrow keys` | Moves selection between sibling controls — for example between Tabs or NavItems — each of which may carry its own CounterBadge. |
| `Escape` | Closes an overlaying surface (Menu, Popover, Drawer) in which a badge-bearing item lives; the badge itself does not respond to Escape. |

**ARIA**: aria-hidden — set on the badge when the numeric value is already communicated by the parent's label or is purely decorative., aria-label — applied to the parent control (for example an icon-only Button) so the count is announced with context rather than as a bare number., aria-live and role="status" — used on a wrapper or on an accompanying live region when a count updates and the change must be announced., aria-describedby — used when the badge count is better read as supplementary description of the parent control than as part of its name., aria-disabled — relevant on the parent control to indicate that the action carrying the badge is unavailable.

**Screen Reader**: CounterBadge renders as plain text inside a non-focusable element, so screen readers read its content as part of the accessible name or description of the parent control — for example, an inbox navigation item announced as 'Inbox, 12 unread'. The badge itself has no role, no live region, and no focus stop, so dynamic count changes are silent unless you announce them explicitly through a live region such as the AriaLiveAnnouncer or by setting role="status" on a container. A dot-style badge exposes no text at all and is effectively invisible to screen readers, so any meaning it carries must be expressed in the parent's accessible name; if it is decorative only, marking it aria-hidden is appropriate.

## Styling

CounterBadge is styles-agnostic: apply overrides with a Griffel makeStyles class and mergeClasses on the component rather than writing global CSS. For the filled appearance the background comes from the semantic color tokens (tokens.colorBrandBackground for brand, tokens.colorPaletteRedBackground3 for danger, and comparable palette tokens for important and informative) with the foreground text picking up tokens.colorNeutralForegroundOnBrand. The ghost appearance drops the background entirely and moves color to the text, using tokens.colorBrandForeground1 or tokens.colorNeutralForeground1 so the badge stays legible over any surface. Shape maps to tokens.borderRadiusCircular and tokens.borderRadiusMedium; padding and minimum width are driven by tokens.spacingHorizontalXS and tokens.spacingHorizontalXXS, and the label uses tokens.fontSizeBase100 through tokens.fontSizeBase300 with matching tokens.lineHeightBase100 to tokens.lineHeightBase300 across the tiny through extra-large sizes. When overriding, always override the color pair (background plus foreground) together so contrast is preserved, and use tokens instead of literal hex values so the badge follows theme switching.

## Performance

CounterBadge renders a single lightweight element with no portals, no focus management, and no internal state, so its render cost is negligible; the real cost driver is how often the parent re-renders when the count changes. Update counts through state rather than direct DOM manipulation so React can batch updates, and avoid high-frequency tickers that re-render a whole list of badge-bearing items every frame. When many badges live inside a large list or DataGrid, keep the count computation memoized at the list level rather than recomputing per row, and prefer rendering the badge conditionally (letting it unmount at zero instead of forcing showZero) to keep the tree smaller. Because the badge has no live region of its own, announcing frequent changes through AriaLiveAnnouncer is also the cheaper approach than forcing many parents to re-render for accessibility reasons.

## Theming & Tokens

CounterBadge consumes theme values exclusively through Fluent design tokens, so it automatically follows the FluentProvider theme, including brand ramp overrides and dark mode. The brand color resolves through tokens.colorBrandBackground with text on tokens.colorNeutralForegroundOnBrand, while danger, important, and informative resolve through the palette tokens for those hues (for example tokens.colorPaletteRedBackground3 for danger fills and tokens.colorPaletteRedForeground3 in ghost form). The ghost appearance uses foreground tokens such as tokens.colorBrandForeground1 and tokens.colorNeutralForeground1 against a transparent background. Shape and sizing are token-driven as well: tokens.borderRadiusCircular and tokens.borderRadiusMedium for the two shapes, and the font and line-height scales (tokens.fontSizeBase100 through tokens.fontSizeBase300, tokens.lineHeightBase100 through tokens.lineHeightBase300) plus tokens.spacingHorizontalXXS and tokens.spacingHorizontalXS for the padding across sizes. Because everything routes through tokens, high contrast and forced-colors themes are respected as long as you do not hard-code colors in overrides.

## Migration Notes

In v9, CounterBadge is a dedicated export from @fluentui/react-components rather than a mode of a single Badge component, sitting alongside Badge and PresenceBadge so each visual purpose has its own component. The count-oriented props — count, overflowCount, dot, and showZero — carry over from the earlier badge implementations, while the shared visual props such as appearance, color, shape, and size now follow the v9 token-based theming system. Sizes were re-expressed on the v9 scale demonstrated by the Sizes story (tiny, extra-small, small, medium, large, extra-large, defaulting to medium), and styling is done with Griffel classes rather than the v8 styling utilities or theme palette objects. If you were previously constructing badge markup by hand or styling a span for counts, replace it with CounterBadge so you inherit the correct token mapping and accessibility posture.

## Edge Cases

- A count of zero renders nothing by default; set showZero when an explicit zero is meaningful, as is often the case on metrics-style surfaces.
- Values above overflowCount (default 99) are capped by the component's own overflow treatment rather than by anything you format, so lowering overflowCount for icon-sized badges changes the displayed threshold everywhere that badge is used.
- The Dot story pairs dot with a count of zero, confirming that dot replaces the numeric display — do not expect both a dot and a number to appear for the same badge.
- The color story text lists additional hue names beyond the values documented on the color prop type (brand, danger, important, informative); verify which values your installed version accepts before shipping a badge that depends on one of the extra names.
- A size prop is used throughout the Sizes story (tiny, extra-small, small, medium, large, extra-large, defaulting to medium) even though the per-component prop list above enumerates only the count-specific props — treat sizing as inherited from the shared badge base.
- A dot-style badge carries no text, so it is invisible to screen readers; if the state it represents matters, encode that meaning in the parent control's accessible name or provide an accompanying label.
- Ghost and filled appearances have very different contrast characteristics on colored or photographic backgrounds; verify the ghost variant against the actual surface rather than assuming the default filled styling will transfer.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
