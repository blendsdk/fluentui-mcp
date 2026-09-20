# RatingDisplay

> **Package**: `@fluentui/react-rating` v9.4.2
> **Import**: `import { RatingDisplay } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

RatingDisplay is a read-only, non-interactive presentation component that summarizes a rating: it renders a row of rating items (filled stars by default) representing the value, writes the numeric value out next to the icons, and can optionally append the total number of ratings. By default it shows five items, rounds the filled portion to the nearest half-star for the visual fill, supports four sizes (small, medium, large, extra-large), three colors (neutral, brand, marigold), and a compact mode that collapses the row into a single filled star with the value beside it. Because it never accepts user input, RatingDisplay is the correct choice for surfaces such as product cards, review summaries, media tiles, and detail pages where the rating is data rather than an editable control. It exposes three slots — root, valueText, and countText — so hosts can style or extend the static layout, and it accepts a custom icon component when stars are not the right metaphor.

**When to use**: Use RatingDisplay whenever you need to show an existing, already-computed rating to the user and interaction is not desired: aggregate star ratings on cards and tiles, average scores in review summaries, app or media quality indicators, and compact single-star treatments in dense lists. Use the interactive Rating component (with RatingItem) instead when the user must select or change a rating, and do not use RatingDisplay as a form control. Prefer the compact variant when horizontal space is scarce and the rating is secondary to other content; prefer the full row when the scale itself matters to the reader. If the underlying value or count is unknown or not yet loaded, omit the component or render a placeholder rather than displaying a zero-star rating that will be read as a real score.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `color` | `"brand" \| "marigold" \| "neutral" \| undefined` | `neutral` | No | Color of the rating items (stars). |
| `compact` | `boolean \| undefined` | `false` | No | Renders a single filled star, with the value written next to it. |
| `count` | `number \| undefined` | — | No | The number of ratings represented by the rating value. This will be formatted with a thousands separator (if applicable) and displayed next to the value. |
| `icon` | `React.ElementType<any, keyof React.JSX.IntrinsicElements> \| undefined` | `StarFilled` | No | The icon used for rating items. |
| `max` | `number \| undefined` | `5` | No | The max value of the rating. This controls the number of rating items displayed. Must be a whole number greater than 1. |
| `size` | `"small" \| "medium" \| "large" \| "extra-large" \| undefined` | `medium` | No | Sets the size of the RatingDisplay items. |
| `value` | `number \| undefined` | — | No | The value of the rating |

### Prop Guidance

- **value**: The rating being displayed. Accepts decimals; the icons fill to the nearest half-star while the exact number you pass is written out as text. Pass a real, already-computed average rather than rounding it yourself. `3.7`
- **max**: The top of the rating scale and the number of rating items rendered. Must be a whole number greater than 1; the default of 5 suits five-star scales, while 10 suits ten-point scales. Keep it consistent across every instance in the same surface. `5`
- **count**: The total number of ratings that produced the value. It is rendered next to the value and formatted with a thousands separator for the user's locale, so pass the raw number rather than a preformatted string. Omit it when there are no ratings to report. `1160`
- **compact**: Collapses the display to a single filled star with the value written beside it. Use it in dense or space-constrained contexts such as list rows, table cells, and metadata lines where the full scale does not need to be shown. `true`
- **color**: Controls the color of the rating items. Neutral is the default and fits most editorial contexts, brand ties the rating to your product identity, and marigold gives a warm review-oriented treatment. Use one color per surface rather than mixing. `brand`
- **size**: Sets the size of the rating items and their accompanying text. Small suits captions and metadata, medium is the default, and large or extra-large suit detail pages and hero areas. `large`
- **icon**: Replaces the default filled star with your own icon component when the star metaphor does not fit the domain. Supply a stable, monochrome, fill-based icon so partially filled items still read correctly. `SquareFilled`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `countText` | — | No | — |
| `root` | — | Yes | — |
| `valueText` | — | No | — |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { RatingDisplay } from '@fluentui/react-components';

export const Default = (): JSXElement => <RatingDisplay value={4} />;
```

### Color

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { RatingDisplay } from '@fluentui/react-components';
import { makeStyles } from '@fluentui/react-components';

export const Color = (): JSXElement => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <RatingDisplay value={3} />

      <RatingDisplay color="brand" value={3} />

      <RatingDisplay color="marigold" value={3} />
    </div>
  );
};

Color.parameters = {
  docs: {
    description: {
      story: "A RatingDisplay's `color` can be `neutral` (default), `brand`, or `marigold`.",
    },
  },
};
```

### Compact

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { RatingDisplay } from '@fluentui/react-components';

export const Compact = (): JSXElement => <RatingDisplay compact value={3} count={1160} />;

Compact.parameters = {
  docs: {
    description: {
      story: 'You can specify a compact RatingDisplay with `compact`.',
    },
  },
};
```

## Best Practices

### Do's

- Always pass a value so the display reflects real data; the filled icons and the written-out number are the entire meaning of the component.
- Pair value with count when you have the total number of ratings, since a score without volume (for example 5 versus 5 from 1,160 ratings) is far less trustworthy to readers.
- Match max to the actual rating scale you collected data on (for example max of 10 for a ten-point scale) so the visual proportion is honest.
- Choose the color intentionally: neutral for general or editorial contexts, brand to tie the rating to your product's identity, and marigold for a warm, review-oriented look.
- Use compact mode in space-constrained surfaces such as list rows, table cells, or metadata lines, where a single star plus the number communicates enough.
- Set size relative to the surrounding typography — small for captions and metadata, medium as the default, large and extra-large for hero or detail layouts.
- Provide a custom icon only when the star metaphor does not fit the domain (for example circles or squares for a non-review score), and keep the icon monochrome and fill-based.
- Keep the written-out value visible; it is the accessible, unambiguous source of truth behind the partially filled icons.

### Don'ts

- Do not use RatingDisplay as an input or selection control — it renders static content and provides no change events or keyboard interaction.
- Do not pass a value greater than max or a negative value; the filled portion will be misleading rather than error-corrected.
- Do not set max to 1 or to a fractional number, since max controls the number of rendered rating items and must be a whole number greater than 1.
- Do not override the item color with arbitrary CSS color values when the color prop already maps to theme-aware foreground tokens.
- Do not rely on color alone to convey good versus bad scores (for example marigold equals positive, neutral equals negative), because that information is unavailable to color-blind and screen reader users.
- Do not hide or suppress the value text in favor of icons only; unfilled and half-filled star shapes are ambiguous without the number.
- Do not mix different sizes or colors of RatingDisplay for items that sit in the same visual group, as it implies a difference in meaning.
- Do not rerender with a brand-new custom icon component identity on every render, since a new element type forces the icon subtree to remount.

## Anti-Patterns

### Using RatingDisplay as an input control

❌ RatingDisplay renders static text and icons; it has no value-change event, no focusable items, and no keyboard handling, so users cannot rate anything with it and assistive technology sees a plain number.

✅ Use the interactive Rating component with RatingItem when the user must choose a score, and reserve RatingDisplay for showing an already-known average.

### Passing values outside the scale

❌ A value greater than max or below zero, or a max of 1 or a fractional max, produces a filled portion that does not correspond to the number written next to it, quietly misrepresenting the score.

✅ Normalize data before rendering: clamp the value into the range, keep max a whole number greater than 1, and make sure every instance on the same surface uses the same max.

### Encoding sentiment in color only

❌ Using marigold for good scores and neutral for poor scores — or vice versa — makes the meaning invisible to screen reader users and indistinguishable to users with color vision deficiency, violating WCAG 1.4.1.

✅ Keep the numeric value and count visible as text, and if a qualitative judgment matters, state it in words in adjacent content rather than relying on the rating item color.

### Dropping the value text in favor of icons

❌ Half-filled and unfilled icons are visually ambiguous; hiding the written-out number removes the only unambiguous, screen-reader-accessible representation of the rating.

✅ Always let the valueText slot render, and treat the star row as supporting decoration behind the number.

### Defining the custom icon inline on every render

❌ Passing a newly created component identity to the icon prop on each render changes the element type, causing the icon subtree to unmount and remount and adding churn in long lists of rated items.

✅ Define or import the icon component once at module scope and pass the same stable reference on every render.

## Accessibility

**Requirements**: RatingDisplay is static content, not a widget, so it must never be the only interactive affordance for acting on a rating. Meet WCAG 1.4.1 Use of Color by ensuring the rating is also conveyed as text — the written-out value (and count, when supplied) is what makes the component meaningful, so it must remain visible and not be visually hidden. Meet WCAG 1.4.3 and 1.4.11 by letting the component use theme foreground tokens rather than hard-coded colors, so contrast holds in light, dark, and high-contrast themes. Meet WCAG 1.3.1 by exposing the numeric value as real text content in the valueText slot rather than as an image or pseudo-element. If the component is the only thing identifying a rating in a card or tile, give the root an descriptive aria-label that includes the numeric context, and keep that label in sync with the value and count.

| Key | Action |
| --- | --- |
| `Tab` | RatingDisplay is not a tab stop; keyboard focus moves past it to surrounding interactive elements such as links, buttons, or the card itself. |
| `Enter` | No effect on RatingDisplay itself; if the display is wrapped in a link or button (for example to open reviews), that parent element handles Enter. |
| `Space` | No effect on RatingDisplay itself; activation is handled entirely by any ancestor interactive element you wrap around it. |

**ARIA**: aria-label, aria-hidden, aria-describedby

**Screen Reader**: Screen readers treat RatingDisplay as a short piece of static text: they announce the written-out value and, when provided, the rating count, and they ignore the individual star icons. Because the filled portion is rounded to the nearest half-star while the text shows the exact value, the announced number is authoritative and will sometimes differ from what a sighted user would count. There is no live region, so a rating that changes after render (for example after data refresh) is not announced automatically — wrap the component in an AriaLiveAnnouncer or another polite live region if updates must be spoken. Icon-only custom shapes are never announced, so the value text must not be suppressed.

## Styling

Style RatingDisplay by targeting its root and its slot content with makeStyles and a className, rather than by overriding colors with raw values. The color prop already resolves to theme foreground tokens (neutral foreground for the default, brand foreground for brand, and the marigold palette foreground for marigold), so custom color work usually means changing the theme, not the component. For layout, adjust the gap between items and the inline spacing before the value text with tokens such as tokens.spacingHorizontalXS, tokens.spacingHorizontalSNudge, and tokens.spacingHorizontalS, and align the component to adjacent text using tokens.spacingHorizontalM. Typography for the value text and count text can be tuned with tokens.fontSizeBase200 through tokens.fontSizeBase500, tokens.fontWeightRegular, and tokens.fontWeightSemibold, plus the matching line-height tokens so the icons and text sit on the same baseline. If you must reach the valueText or countText slot elements, do it with descendant selectors under your root class so you do not depend on internal DOM ordering, and prefer the size and compact props over hand-forced font sizes for the numeric text.

## Performance

RatingDisplay renders one rating item per unit of max plus the value and count text nodes, so a large max (for example 10 or more) multiplies DOM nodes across every instance; in grids and long lists of rated products this adds up, and compact mode is the cheapest rendering because it produces a single item. Keep custom icon components defined or imported once at module scope so React does not treat them as new types on each render and remount their subtrees. When RatingDisplay appears inside repeated rows (cards, DataGrid rows, list items), memoize the row component or keep its props primitive and stable so the rating is not re-rendered on every parent update. Avoid animating or continuously recomputing value, since the component is pure static output and any change is a full re-render.

## Theming & Tokens

RatingDisplay takes all of its visual attributes from the Fluent theme provided by FluentProvider. The color prop maps to foreground tokens such as tokens.colorNeutralForeground1 for neutral, tokens.colorBrandForeground1 for brand, and the marigold palette foreground token for marigold, with lower-contrast neutral tokens used for the unfilled portion of the row. Size choices scale the item dimensions and the numeric text through typography tokens such as tokens.fontSizeBase200, tokens.fontSizeBase300, tokens.fontSizeBase400, tokens.fontSizeBase500, and their matching line-height and weight tokens. Internal spacing between items and between the icons and the value text uses spacing tokens such as tokens.spacingHorizontalXS, tokens.spacingHorizontalSNudge, and tokens.spacingHorizontalS. Because these are theme tokens and not fixed values, switching to a dark or high-contrast theme, or a custom brand theme, changes the rating colors and legibility automatically without component-level overrides.

## Migration Notes

RatingDisplay is a v9 component with no equivalent read-only rating component of its own in earlier Fluent releases, where teams typically rendered an interactive rating control in a disabled or read-only state to display an average. When moving such call sites to v9, replace the read-only rating input with RatingDisplay and pass the precomputed average through the value prop, the total through count, and the scale through max. Because RatingDisplay is display-only, remove any change handlers, disabled state, and form-field wiring that surrounded the old control, and move the interactive Rating component to the places where users actually submit a rating. Note also that RatingDisplay is unstyled by the older Fabric CSS classes; its appearance comes from theme tokens supplied by FluentProvider, so any custom CSS that targeted the previous rating markup should be deleted rather than ported.

## Edge Cases

- The filled portion of the row is rounded to the nearest half-star while the written value stays exact, so a value of 3.7 shows three and a half filled items next to the text 3.7 — the number, not the icon count, is the truth.
- The count is formatted with a thousands separator using the user's locale, so the same count can render differently across locales and should always be passed as a raw number rather than a preformatted string.
- compact mode renders a single filled item regardless of max, so it does not communicate the scale; avoid it where the difference between a 5-out-of-5 and a 5-out-of-10 matters.
- A value greater than max fills every item without raising an error, producing a display that looks perfect but misrepresents the underlying score.
- max must be a whole number greater than 1; passing 1 or a fractional value yields an item count that does not match the intended scale.
- A count of zero still renders a formatted number beside the value, which reads as though there are ratings; omit the count entirely when there are none.
- Custom icons that are not monochrome and fill-based do not convey partial fill clearly, so half-star rounding becomes visually meaningless.
- RatingDisplay has no live region, so a value that changes after render is not announced to screen reader users unless you wrap it in a live region yourself.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
