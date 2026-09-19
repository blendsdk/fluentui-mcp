# Badge

> **Package**: `@fluentui/react-badge` v9.5.3
> **Import**: `import { Badge } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

Badge is a small, purely presentational data-display component that renders a compact label, count, or status marker next to the element it describes. It exposes two slots: a required root slot that renders the visible capsule, and an optional icon slot exposed through the icon prop for a small leading or trailing glyph. Visually it is driven by five orthogonal props: appearance (filled, ghost, outline, tint), color (brand, danger, important, informative, severe, subtle, success, warning), shape (circular, rounded, square), size (tiny, extra-small, small, medium, large, extra-large), and iconPosition (before, after). Badge holds no state, manages no focus, and is not interactive — it is a decoration layer that adds glanceable metadata such as unread counts, status, or category to a parent control like a Button, Avatar, Tab, Menu item, or Card.

**When to use**: Use Badge when you need a short, non-interactive annotation attached to another element: unread counts, status words such as New or Blocked, category labels, or numeric totals. It is the right choice when the information must be visible at a glance and must not steal space or focus from the parent control. Do not use Badge when the annotation itself must be clickable (use Button or Link), when the message is long-form or requires dismissal (use MessageBar), when the annotation is a key-value label for a form field (use Label or Infolabel), or when the text is simply emphasized body copy (use Text). If the marker is meant to be removed or filtered by the user, Tag and TagPicker are the appropriate components rather than Badge.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `"filled" \| "ghost" \| "outline" \| "tint" \| undefined` | `'filled'` | No | A Badge can be filled, outline, ghost, inverted |
| `color` | `"brand" \| "danger" \| "important" \| "informative" \| "severe" \| "subtle" \| "success" \| "warning" \| undefined` | `'brand'` | No | A Badge can be one of preset colors |
| `iconPosition` | `"before" \| "after" \| undefined` | `'before'` | No | A Badge can position the icon before or after the content. |
| `shape` | `"circular" \| "rounded" \| "square" \| undefined` | `'circular'` | No | A Badge can be square, circular or rounded. |
| `size` | `"tiny" \| "extra-small" \| "small" \| "medium" \| "large" \| "extra-large" \| undefined` | `'medium'` | No | A Badge can be on of several preset sizes. |

### Prop Guidance

- **appearance**: Controls visual weight. filled is the default and reads as a solid, high-emphasis capsule; tint is a softer, low-contrast variant that still carries color; ghost removes the fill so the badge sits quietly on a surface; outline draws a border instead of a fill and works better on busy or photographic backgrounds. Note the documented restriction that ghost and outline combined with subtle color are intended only for use on brand backgrounds. `tint`
- **color**: Selects the semantic palette. Use brand for neutral product metadata, danger and important for errors and blockers, severe for the highest-severity escalation, warning for caution, success for completed or healthy states, informative for neutral notices, and subtle for the quietest treatment. Always duplicate the meaning in text or an icon so color is not the only signal. `success`
- **iconPosition**: Places the icon slot content before or after the badge text, defaulting to before. Use before when the icon categorizes the content (a status dot or type glyph) and after when the icon acts as an action affordance hint or trailing indicator. Setting this prop when the icon slot is empty has no visible effect. `after`
- **shape**: Controls corner rounding. Use circular (the default) for counts and single characters so the capsule reads as a pill, rounded for short words and chips that need a softer rectangle, and square for dense tabular or badge-like contexts where a tight rectangle reads more precisely. `rounded`
- **size**: Sets the scale across six steps from tiny to extra-large, defaulting to medium. Match the badge to the parent control: tiny and extra-small inside dense tables, avatars, and toolbars, small and medium beside standard Buttons, Menu items, and Tabs, and large or extra-large when the badge stands alone or must be legible at a distance. `small`
- **icon (slot)**: The optional icon slot renders a glyph inside the badge and respects iconPosition. Keep icons visually small and single-color so they inherit the badge foreground, and treat meaningful icons as requiring either their own accessible name or inclusion in the parent control's label. Icons also render correctly with no text content, producing a compact icon-only badge. `ClipboardPasteRegular`
- **root (slot)**: The required root slot is the inline element that renders the capsule. Use it to attach className, id, or data attributes, but avoid restructuring it into a block element or applying absolute positioning directly, since that fights the layout of the surrounding control. `className`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `icon` | — | No | — |
| `root` | — | Yes | — |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Badge } from '@fluentui/react-components';
import type { BadgeProps } from '@fluentui/react-components';

export const Default = (props: BadgeProps): JSXElement => <Badge {...props} />;
```

### Appearance

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Badge } from '@fluentui/react-components';

export const Appearance = (): JSXElement => {
  return (
    <>
      <Badge appearance="filled">999+</Badge>
      <Badge appearance="ghost">999+</Badge>
      <Badge appearance="outline">999+</Badge>
      <Badge appearance="tint">999+</Badge>
    </>
  );
};

Appearance.parameters = {
  docs: {
    description: {
      story: 'A badge can have a `filled`, `ghost`, `outline`, or `tint` appearance. The default is `filled`.',
    },
  },
};
```

### ColorAndAppearance

```tsx
import * as React from 'react';
import type { JSXElement, BadgeProps } from '@fluentui/react-components';
import { Badge, makeStyles, tokens } from '@fluentui/react-components';
import { ClipboardPasteRegular as PasteIcon } from '@fluentui/react-icons';

export const ColorAndAppearance = (): JSXElement => {
  const styles = useStyles();

  return (
    <div className={styles.example}>
      <h3>Filled</h3>
      <Badges appearance="filled" />
      <h3>Ghost</h3>
      <Badges appearance="ghost" />
      <h3>Outline</h3>
      <Badges appearance="outline" />
      <h3>Tint</h3>
      <Badges appearance="tint" />
    </div>
  );
};

ColorAndAppearance.parameters = {
  docs: {
    description: {
      story: 'Note: `ghost-subtle` and `outline-subtle` are intended only for use on brand background.',
    },
  },
};
```

## Best Practices

### Do's

- Keep badge content extremely short — a number, an abbreviation, or one word such as New, Beta, or Blocked — because the component sizes itself around compact content.
- Pair the color prop with text or an icon so the meaning survives without color perception; information conveyed by color alone fails the use-of-color guideline referenced in the component's own Color story.
- Choose appearance deliberately by emphasis level: filled for high-emphasis counts and alerts, tint and ghost for quiet in-context annotations, outline for annotations on busy or photographic backgrounds.
- Match size to the surrounding control so the badge does not dominate it — small or medium beside standard Buttons and Menu items, tiny or extra-small inside dense tables, avatars, and toolbars.
- Use shape circular for numeric counts and single characters, and rounded or square when the badge carries a short word or behaves like an inline token.
- Use the icon slot with iconPosition before or after when a glyph reinforces meaning, and make sure the icon is either decorative or covered by the parent control's accessible name.
- Format values yourself before passing them in, for example capping large totals behind a plus suffix, since Badge neither truncates nor abbreviates content.

### Don'ts

- Don't attach click, hover, or focus behavior expectations to a Badge — it renders no interactive semantics, has no disabled state, and is never a tab stop.
- Don't rely on color alone to communicate state; a red badge without a word or icon is meaningless to screen reader users and to anyone with color-vision deficiency.
- Don't use Badge for messages the user must not miss, such as validation failures or service outages — MessageBar, Field validation messages, and Toast exist for that purpose.
- Don't put sentences, multi-line text, or long localized strings in a Badge; the capsule grows very wide and legibility at tiny and extra-small sizes degrades quickly.
- Don't use size tiny or extra-small for content that must be reliably read, such as legal or financial status text, because the smallest sizes trade legibility for density.
- Don't combine ghost or outline appearance with subtle color on neutral backgrounds; the component's own guidance states those subtle variants are intended only for use on brand backgrounds.
- Don't use a lone icon in the icon slot as the only carrier of meaning unless the parent control's label already includes that information.
- Don't mutate the root slot with absolute positioning hacks to float the badge over a parent; wrap the pair in a positioned container and leave the Badge's own layout intact.

## Anti-Patterns

### Color as the only carrier of meaning

❌ A badge that is red for error and green for success but contains only a number communicates nothing to screen reader users or to anyone who cannot distinguish those colors, violating the use-of-color requirement called out in the component's own Color documentation.

✅ Pair the color prop with an explicit word such as Failed or Passed, or with a labeled icon, and ensure the parent control's accessible name includes the same information.

### Treating Badge as an interactive control

❌ Adding click handlers, hover cursors, or tab stops to a Badge creates an element that looks interactive in the DOM but exposes no button or link semantics, no focus ring requirements, and no keyboard activation, so keyboard and screen reader users cannot operate it.

✅ When the annotation must be actionable, place a real Button, Link, or Menu item in the layout and use the Badge purely as the visual counter or status inside it.

### Substituting Badge for messaging components

❌ Using a Badge to surface failures, warnings, or instructions that users must act on hides important content in a small, easily missed, non-announced element with no dismissal or action affordance.

✅ Use MessageBar for page-level notices, Field validation messages for input errors, and Toast for transient notifications, reserving Badge for at-a-glance metadata.

### Overloading the badge with long text

❌ Putting a full sentence or a long localized string in a Badge forces the capsule to grow very wide, breaks alignment with the parent control, and becomes unreadable at tiny and extra-small sizes.

✅ Keep badge content to a number, abbreviation, or single word; if more context is needed, move that context to Tooltip, Text, or a dedicated status column.

### Restyling the root to float over a parent

❌ Pushing the badge out of normal flow with absolute positioning overrides makes it overlap adjacent content unpredictably, breaks in RTL or zoomed layouts, and defeats the size and spacing tokens the component applies.

✅ Wrap the parent control and the badge in a relatively positioned container and let the Badge keep its intrinsic sizing, adjusting offsets through wrapper spacing tokens such as tokens.spacingHorizontalXS.

## Accessibility

**Requirements**: Badge must satisfy WCAG 1.4.1 Use of Color: any status, severity, or category encoded through the color prop must also be present as text or conveyed by the parent control's accessible name. Contrast requirements (WCAG 1.4.3 for text and 1.4.11 for non-text contrast) apply to the badge capsule and its label against whatever surface it sits on, which is why ghost and outline subtle variants are documented as brand-background only. Text must remain readable at the chosen size step, so tiny and extra-small should not carry critical content. Badge renders no implicit ARIA role, so it never becomes a live region or a landmark on its own; if a badge value changes dynamically and must be announced, the update has to be owned by the surrounding control or an explicit live region in the consuming app.

| Key | Action |
| --- | --- |
| `Tab` | Focus moves past the badge to the next focusable element. The badge itself is never a tab stop and receives no focus styling. |
| `Enter` | Has no effect on the badge itself; when the badge is nested inside an interactive parent such as a Button or Menu item, pressing Enter activates that parent control. |
| `Space` | Has no effect on the badge itself; when nested inside a button-like parent, Space activates the parent control instead. |
| `Arrow keys` | No effect. Badge does not implement roving focus, navigation, or any key handling of its own. |

**ARIA**: aria-hidden — apply to decorative icon content inside the icon slot, or to the badge as a whole when it is purely visual duplication of adjacent text., aria-label — apply to the parent control when a count or status must be included in that control's spoken name, since the badge does not provide one itself., aria-labelledby — alternative to aria-label on the parent control when an existing visible element already names the badge., aria-describedby — use on the parent control when the badge value is supplementary context rather than part of the name., role — Badge applies no role by default; avoid inventing interactive roles for it, and keep any live-region role on the surrounding control instead.

**Screen Reader**: Because Badge renders a plain inline element with no role, screen readers read its text content in document order as part of the surrounding element's text, so a count inside a button becomes part of that button's announced name. The color, shape, size, and appearance props are never announced, meaning severity or category encoded only visually is invisible to assistive technology. An icon-only badge contributes nothing to the accessibility tree unless the icon carries its own accessible name or the parent control's label includes the same information. A badge that is purely decorative should be hidden with aria-hidden so it is not read twice.

## Styling

Style Badge through the className on the root slot using makeStyles and Griffel tokens rather than inline style objects. Corner rounding is driven by tokens.borderRadiusCircular, tokens.borderRadiusMedium, and tokens.borderRadiusSmall for the circular, rounded, and square shapes; typography by tokens.fontSizeBase100 through tokens.fontSizeBase300 with tokens.lineHeightBase100 through tokens.lineHeightBase300 and optional tokens.fontWeightSemibold for counts; padding by tokens.spacingHorizontalXXS and tokens.spacingHorizontalXS with tokens.spacingVerticalXXS. Filled brand badges pair tokens.colorBrandBackground with tokens.colorNeutralForegroundOnBrand, while outline appearances use tokens.strokeWidthThin with tokens.colorNeutralStroke1 or tokens.colorBrandStroke1. When you need to overlay a badge on an Avatar or icon, give the wrapper a relative position and let the Badge keep its intrinsic layout instead of restyling the root. Prefer changing appearance, color, and size props over overriding background and foreground classes, because those props resolve to pre-generated atomic classes.

## Performance

Badge is one of the lightest components in the library: it renders a single root element with an optional icon node and uses slot merging rather than wrapper elements, so it has no measurable interaction cost. The main cost in real applications is volume — long lists, tables, and grids can render hundreds of badges, and while each instance is cheap, re-rendering a virtualized list with fresh icon elements on every pass defeats memoization. Hoist icon elements or memoize them, avoid creating inline style objects per render, and prefer the appearance, color, shape, and size props over custom className overrides because prop-driven styles reuse pre-generated atomic classes while ad hoc overrides generate new rules per call site.

## Theming & Tokens

Badge draws all of its color, typography, spacing, and radius values from the Fluent theme supplied by the Provider, so switching themes restyles it automatically. Filled brand badges use tokens.colorBrandBackground with tokens.colorNeutralForegroundOnBrand, while tint and outline treatments use brand and neutral foreground and stroke tokens such as tokens.colorBrandForeground1, tokens.colorNeutralForeground1, tokens.colorNeutralStroke1, tokens.colorBrandStroke1, and tokens.colorSubtleBackground. Semantic colors resolve to palette tokens — for example danger and important to the red family (tokens.colorPaletteRedBackground3, tokens.colorPaletteRedForeground1), success to the green family (tokens.colorPaletteGreenBackground3, tokens.colorPaletteGreenForeground1), warning to the marigold and yellow family (tokens.colorPaletteYellowBackground3, tokens.colorPaletteMarigoldBackground3), severe to the dark orange family (tokens.colorPaletteDarkOrangeBackground3), and informative to neutral surfaces such as tokens.colorNeutralBackground3 with tokens.colorNeutralForeground1. Size maps to tokens.fontSizeBase100 through tokens.fontSizeBase300 and matching line heights, shape maps to tokens.borderRadiusSmall, tokens.borderRadiusMedium, and tokens.borderRadiusCircular, and padding uses tokens.spacingHorizontalXXS, tokens.spacingHorizontalXS, and tokens.spacingVerticalXXS.

## Migration Notes

Compared with the Fluent UI v8 Badge, the v9 component is slot-based: the root and icon slots are the only extension points, and the icon arrives through the icon slot prop rather than being spread into arbitrary child markup. The v8 size scale used names such as smallest, smaller, small, medium, large, larger, and largest, whereas v9 uses tiny, extra-small, small, medium, large, and extra-large with medium as the default. Appearance and shape keep the same value names as v8 (filled, ghost, outline, tint; rounded, circular, square), while the color set is the v9 semantic palette of brand, danger, important, informative, severe, subtle, success, and warning. Styling moves from mergeStyleSets and theme objects to makeStyles and tokens imported from the package, and theme values flow from the v9 Provider rather than the v8 theme context.

## Edge Cases

- A Badge rendered with no children still renders an empty capsule, as shown in the Shapes and Sizes stories; it occupies layout space, so only do this intentionally for icon-only or purely decorative markers.
- iconPosition before or after has no visible effect when the icon slot is empty, so the prop can be set without any visual change and should not be used as a proxy for layout intent.
- Badge never truncates or abbreviates its content; a raw total like a five-digit number renders at full width, so capping values behind a plus suffix is the consumer's responsibility.
- Long text inside a circular badge produces a very wide pill rather than a clipping issue, because circular only controls the corner radius and not the maximum width.
- Combining ghost or outline appearance with subtle color is documented as intended for brand backgrounds only; on neutral surfaces the resulting contrast may fall below readable thresholds.
- An icon-only badge with no label contributes no accessible name, so screen reader users hear nothing unless the parent control's label includes the same information.
- Because Badge has no focus or hover states of its own, any visual affordance it appears to have comes entirely from the parent control it is nested in.

## See Also

- - [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
