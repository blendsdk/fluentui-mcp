# Badge

> **Package**: `@fluentui/react-badge` v9.5.3
> **Import**: `import { Badge } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

Badge is a small, non-interactive visual indicator that annotates other content with a short status, a count, or a categorical label. It renders as a single inline root element with an optional icon slot placed before or after the label, and its entire visual identity is controlled by five presentational props: appearance, color, shape, size, and iconPosition. Because the component is purely decorative-by-default, it ships with no focus behavior, no keyboard handling, and no implicit ARIA role — the meaning must come from its text, from an accessible name you supply, or from the label of the control the Badge is attached to. Defaults are appearance filled, color brand, shape circular, size medium, and iconPosition before, so an unconfigured Badge already reads as a brand-colored circular pill. Typical uses include unread counts such as 999+, status words such as New or Beta, severity markers next to a record, and compact category markers inside tables, cards, and list items.

**When to use**: Use Badge when you need a compact, static, attention-drawing marker that sits next to other content: notification counts, status or severity words, version or environment labels, and short category markers. Reach for CounterBadge instead when the requirement is specifically a numeric count indicator and the count is the primary payload. Choose PresenceBadge when the state is an availability or presence state tied to a person. Choose Tag or InteractionTag when the user must select, dismiss, or otherwise act on the item — Badge itself offers no interaction, focus, or dismissal. Use Badge rather than plain bold text when the value needs a distinct, tokenized color or shape treatment that stays consistent across the product, and prefer a Badge over a full MessageBar when the information is a short attribute of an existing element rather than a page-level notification.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `"filled" \| "ghost" \| "outline" \| "tint" \| undefined` | `'filled'` | No | A Badge can be filled, outline, ghost, inverted |
| `color` | `"brand" \| "danger" \| "important" \| "informative" \| "severe" \| "subtle" \| "success" \| "warning" \| undefined` | `'brand'` | No | A Badge can be one of preset colors |
| `iconPosition` | `"before" \| "after" \| undefined` | `'before'` | No | A Badge can position the icon before or after the content. |
| `shape` | `"circular" \| "rounded" \| "square" \| undefined` | `'circular'` | No | A Badge can be square, circular or rounded. |
| `size` | `"tiny" \| "extra-small" \| "small" \| "medium" \| "large" \| "extra-large" \| undefined` | `'medium'` | No | A Badge can be on of several preset sizes. |

### Prop Guidance

- **appearance**: Controls the visual weight of the badge. filled is the default and the highest-emphasis option, suitable for neutral or custom surfaces. ghost removes the background so the badge blends with the surface, outline adds a stroke-only treatment for a structured look, and tint produces the softest, lowest-contrast result that reads best on known backgrounds. Choose the appearance based on how much the badge should compete with its neighbor; a badge on a dense table row generally wants less weight than a badge on an empty state. `tint`
- **color**: Selects a preset semantic color ramp. brand is the default and is the safe choice for generic counters and neutral status. danger and severe are for error and blocking states, warning for caution, success for confirmation, important and informative for graded emphasis, and subtle for the quietest treatment, which the ColorAndAppearance story reserves for brand backgrounds. Never let color be the only difference between two states; combine it with a word or an icon. Note that the eight values listed here are the only supported presets. `success`
- **shape**: Sets the corner treatment of the badge. circular is the default and produces the familiar pill for short text or a true circle for a single character, rounded is the middle ground for multi-character labels that should not look like a lozenge, and square is for badges that need to align tightly with rectangular UI such as table cells. Shape affects corner radius only; a circular badge with a long label still renders as a pill. `rounded`
- **size**: Chooses one of six preset heights and font sizes, from tiny up to extra-large, with medium as the default. Match the badge to the text or control it sits beside so the two share an optical baseline, and avoid tiny and extra-small for anything that carries information the user must read. Larger sizes give longer labels and icons more room without clipping. `extra-small`
- **iconPosition**: Determines whether the icon slot renders before or after the label, defaulting to before. Keep the default when the icon reinforces what the label means, which is the usual pattern for a status glyph, and use after when the icon is a trailing accent that should not delay reading the text. The prop has no visible effect when no icon is provided. `after`

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

- Pair every color with text or a meaningful icon so the status is not communicated by color alone, which is the explicit accessibility guidance in the Color story.
- Pick the appearance to match the surface the Badge sits on: filled for neutral or custom surfaces, ghost and outline when the Badge would otherwise compete with adjacent controls, and tint for the lightest visual weight on a known background.
- Keep the label to a few characters or a single word. The canonical pattern in the examples is a capped count such as 999+, which the application must format itself.
- Match size to the neighboring typography or control so baselines and control heights line up; medium is the default and pairs well with body text, while tiny and extra-small are for dense surfaces.
- Leave iconPosition at its before default when the icon reinforces the label, and switch to after only when the icon reads as a trailing indicator rather than a prefix.
- Give the Badge an accessible name when its visible text is not self-explanatory, for example by adding an aria-label to the root that spells out what the count refers to.
- Use the icon slot for a symbol and always include accompanying text when the icon carries real meaning, since the Icon story requires either the icon itself or the parent control's label to convey the information.
- Use color equal to subtle together with ghost or outline appearance only on a brand-colored background, as called out in the ColorAndAppearance story.

### Don'ts

- Do not attach click handlers or expect focus and pressed states. Badge is not focusable, is not announced as a control, and cannot satisfy keyboard or screen reader interaction requirements.
- Do not use a red or green Badge alone to signal error or success. Color is not a sufficient channel on its own and fails WCAG use-of-color expectations.
- Do not place sentences, paragraphs, or multi-word explanations inside a Badge. It is sized for short markers and will stretch or wrap awkwardly.
- Do not render a Badge with the subtle color on an arbitrary or unknown background; the subtle and ghost/outline combinations are intended for brand backgrounds and lose contrast elsewhere.
- Do not use Badge as a substitute for Field validation messaging, MessageBar, or Toast when the information is an actionable message the user must notice and respond to.
- Do not stack many differently colored Badges in a row to express hierarchy; that becomes visual noise and users cannot decode the ordering.
- Do not rely on an unlabeled Badge floating over an icon-only button to communicate a count, because the count will not be part of the button's accessible name.
- Do not repeat the same information in the visible parent label and in the Badge when both are exposed to assistive technology, which causes duplicate announcements.

## Anti-Patterns

### Making the badge act like a button

❌ Attaching an onClick handler, hover styling, and a button role to a Badge makes it look interactive while leaving it unreachable by keyboard and unannounced as a control, so mouse users can trigger it and keyboard or screen reader users cannot.

✅ If the element must be actionable, use a Button, ToggleButton, Tag, or InteractionTag that provides focus, keyboard activation, and correct semantics, and keep Badge purely presentational next to it.

### Communicating status by color alone

❌ A row of red and green badges with no text or icon forces users with color vision deficiencies to guess, and it fails the WCAG use-of-color guidance that the Color story explicitly cites.

✅ Always include a short word or a meaningful icon inside the badge so the status is readable without color, using color only as a redundant reinforcement.

### Using subtle colors on arbitrary surfaces

❌ The subtle color combined with ghost or outline appearance is designed for brand backgrounds; on a neutral or dark custom surface the resulting foreground and background collapse into each other and the label becomes unreadable.

✅ Reserve subtle with ghost or outline for brand-colored surfaces, and use filled with a palette color or an outlined neutral badge for ordinary surfaces.

### Treating the badge as a text container

❌ Dropping a full sentence or a long multi-word explanation into a Badge breaks the compact layout, wraps unpredictably at small sizes, and dilutes the visual signal the badge is supposed to give.

✅ Reduce the content to a short label or a capped count, and move explanatory text to body copy, a Tooltip, or a MessageBar depending on how much the user needs to act on it.

### Unlabeled count floating over an icon-only control

❌ A numeric badge rendered next to an icon-only button is not part of the button's accessible name, so screen reader users hear the icon's label and never learn that there are unread items.

✅ Fold the count into the control's accessible name, or expose it through an aria-label on the badge and associate it with the control, so the count is announced with the action.

## Accessibility

**Requirements**: Badge is presentational: it exposes no interactive semantics, is not focusable, and does not participate in the tab order, so every accessibility requirement around it falls on the surrounding composition. Information conveyed by color must also be conveyed by text or an icon to satisfy WCAG guidance on use of color, and every appearance and color combination must maintain at least 4.5:1 contrast for normal-sized text and 3:1 for large text against the background it is rendered on. The tiny and extra-small sizes are the highest risk for legibility and contrast, so avoid them for information the user must read. When a badge conveys information that changes dynamically, announce the change through a dedicated live region such as AriaLiveAnnouncer rather than assuming the badge itself will be re-announced.

**ARIA**: aria-label, aria-hidden, role

**Screen Reader**: Badge renders an inline element with no implicit role, so screen readers read its text in the natural reading order of the surrounding content, inline with whatever precedes and follows it. A Badge containing text such as 999+ or New is announced as plain text with no context, which is why the parent control's label should include the meaning of the badge. A Badge with no children and no icon, as shown in the Shapes and Sizes examples, produces an empty element that is silent to screen readers and conveys nothing at all unless it is labeled or described elsewhere. Purely decorative badges can be removed from the accessibility tree with aria-hidden on the root when the adjacent text already carries the information, preventing duplicate announcements, while an aria-label on the root supplies a name when the visible content is ambiguous.

## Styling

Badge is styled through Griffel, so the recommended customization path is makeStyles plus tokens imported from the same package, exactly as the ColorAndAppearance story does. Because the root is a slot, a className passed to Badge lands on the root element and can adjust padding, background, border, and text color without breaking the appearance defaults. Real tokens worth using when overriding: tokens.colorBrandBackground and tokens.colorNeutralForegroundOnBrand for brand-filled treatment, tokens.colorNeutralBackground1, tokens.colorNeutralForeground1, and tokens.colorNeutralStroke1 for a neutral outlined pill, tokens.colorPaletteRedBackground3, tokens.colorPaletteGreenBackground3, tokens.colorPaletteYellowBackground3, and tokens.colorPaletteMarigoldBackground3 for severity backgrounds, tokens.colorBrandBackground2 and tokens.colorBrandForeground2 for the low-emphasis tint look, tokens.borderRadiusCircular, tokens.borderRadiusMedium, and tokens.borderRadiusSmall to echo the shape prop, tokens.strokeWidthThin for outline borders, tokens.fontSizeBase100 through tokens.fontSizeBase300 to align with the size scale, tokens.fontWeightSemibold for emphasis, and spacing tokens such as tokens.spacingHorizontalXS and tokens.spacingHorizontalSNudge for the gap between the icon and the label. To style the glyph itself, put your own class on the element you pass into the icon slot rather than trying to reach into the component internals.

## Performance

Badge is one of the cheapest components in the library: it renders a single root element and, at most, one icon element, with no state, effects, or event listeners of its own. The performance cost therefore comes from the parent, so optimize the list, table, or card grid that renders badges rather than the badges themselves. In large tables or virtualized lists, create the icon element once per data item rather than constructing fresh elements on every keystroke or scroll tick, and prefer Griffel classes from makeStyles over new inline style objects, which would defeat the atomic class cache and force style recalculation. Frequent numeric updates to a counter badge should be throttled or debounced so every increment does not trigger a full parent re-render; the badge itself will never batch or delay those updates for you.

## Theming & Tokens

Badge resolves all of its colors, radii, spacing, and typography from the theme supplied by FluentProvider, so it automatically follows light, dark, high-contrast, and brand-variant themes without any prop changes. The brand color maps to the brand background and on-brand foreground tokens, palette colors map to the shared color palette tokens, and the tint and ghost appearances map to the softer brand and neutral background tokens. Radius comes from the shared circular, medium, and small radius tokens that the shape prop selects from, borders come from the thin stroke width token, and text sizing comes from the base font size ramp that the size prop selects from. Overriding any of these at the component level is done with Griffel classes and the same tokens, which keeps the badge consistent when the surrounding theme switches.

## Migration Notes

Moving from Fluent UI React v8 to v9 changes how Badge is authored and styled. The v8 size scale that ranged from smallest to largest was replaced by the six-step scale tiny, extra-small, small, medium, large, and extra-large, so any size value carried over from v8 must be remapped. The appearance values filled, ghost, outline, and tint carried over with filled remaining the default, and the color names brand, danger, important, informative, severe, subtle, success, and warning also carried over with brand remaining the default, but the underlying colors now resolve to v9 theme tokens rather than the older palette. Icon rendering moved into the icon slot, and iconPosition still accepts before and after with before as the default. Styling that previously relied on overriding generated CSS class names should be rewritten with makeStyles and tokens or with a className on the root slot, and the component now expects a FluentProvider near the app root so that the theme tokens it consumes are available.

## Edge Cases

- A Badge with no children and no icon renders as a bare shape, which is exactly what the Shapes and Sizes examples show; it conveys nothing to assistive technology and should only be used when an adjacent label supplies the meaning.
- The iconPosition prop has no visible effect unless the icon slot is populated, so layouts that appear to ignore it usually just have an empty icon slot.
- Badge never truncates or computes content. A literal 999+ must be formatted by the application, and a long label will simply widen the badge rather than ellipsize, which can disturb adjacent layout at small sizes.
- The shape prop only changes corner radius, so a circular badge containing several characters renders as an elongated pill rather than a circle.
- The subtle color is intended for brand backgrounds when paired with ghost or outline appearance, so reusing that combination on neutral surfaces can produce insufficient contrast.
- Very small sizes reduce both the font size and the badge height, which lowers legibility and makes the badge hard to tap or point at even though it is not interactive.
- When the same count appears in a parent control's label and inside a badge, screen readers announce it twice unless the decorative badge is hidden from the accessibility tree.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
