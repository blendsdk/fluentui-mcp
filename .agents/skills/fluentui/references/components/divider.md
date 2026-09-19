# Divider

> **Package**: `@fluentui/react-divider` v9.7.2
> **Import**: `import { Divider } from '@fluentui/react-components';`
> **Category**: layout
> **Stability**: stable

## Overview

Divider is a layout component that visually separates content into distinct sections with a themed rule. It renders a root slot that is a div element and, when children are supplied, a wrapper slot that places the label between the two halves of the line so the rule appears to pass behind the text. The component is horizontal and full-width by default, and can be rendered vertically with the vertical prop to separate items placed side by side, such as actions in a toolbar or fields on a row. The label can be aligned to the start, center (the default), or end of the line with alignContent, and the visual weight of the rule can be tuned with appearance, which accepts default, subtle, strong, or brand. The inset prop adds padding at the beginning and the end of the divider so the line is shortened and offset from the container edges, matching the padding of the surrounding content. Divider is purely presentational: it has no internal state, no keyboard behavior, and no semantic role, but every visual aspect is driven by theme tokens, so it adapts automatically to the active theme's stroke colors, spacing, and typography.

**When to use**: Use Divider when two groups of related content need a visible boundary inside one container: between sections of a form or settings panel, between items in a list, between regions of a card, or between the two halves of a dialog footer. Use it with a short label when the boundary also needs to be named, for example a single word between a primary action and alternative options. Use the vertical variant when two pieces of content sit side by side and need a rule between them, such as inline action groups in a toolbar or adjacent fields in a single row. Use the inset variant when the divider lives inside a padded container and should align with the content padding instead of spanning edge to edge. Prefer Divider over one-off border styles because it draws its line color, spacing, and label typography from shared theme tokens, which keeps separation consistent across surfaces and themes. Do not use Divider as a generic spacer: if you only need visual breathing room between elements, use layout spacing instead, and where a heading or a labeled group would communicate structure more clearly, use that instead of a bare rule.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `alignContent` | `"start" \| "center" \| "end" \| undefined` | `'center'` | No | Determines the alignment of the content within the divider. |
| `appearance` | `"brand" \| "default" \| "strong" \| "subtle" \| undefined` | `'default'` | No | A divider can have one of the preset appearances. When not specified, the divider has its default appearance. |
| `inset` | `boolean \| undefined` | `false` | No | Adds padding to the beginning and end of the divider. |
| `vertical` | `boolean \| undefined` | `false` | No | A divider can be horizontal (default) or vertical. |

### Prop Guidance

- **appearance**: Controls the visual weight and color of the rule without changing layout or spacing. Use default for general separation, subtle for dense or secondary surfaces where the rule should recede, strong for primary structural divisions, and brand where the surface is brand-accented and the rule should pick up the brand stroke. The value should match the importance of the boundary rather than the amount of surrounding content. `strong`
- **vertical**: Switches the rule from horizontal, which fills the container width, to vertical, which separates side-by-side items such as toolbar actions, inline metadata, or fields in a row. A vertical divider has no intrinsic height, so pair it with a parent that defines one or give the divider itself a height, as the vertical and inset examples do with a height of 100 percent. `vertical with a container height of 100 percent`
- **alignContent**: Determines where the label sits along the line when children are provided: start, center (the default), or end, and it works for both horizontal and vertical dividers as the alignment example demonstrates. Use center for symmetric labels such as a word between two alternative actions, start when the label introduces the content that follows, and end when it concludes the content before it. `start`
- **inset**: Adds padding to the beginning and the end of the divider so the line is offset from the edges of its container. Use it inside padded containers such as list rows, cards, and panels so the rule aligns with the content inset. Remember that inset shortens the visible line along the divider's axis, and combine it with vertical for inset rules between side-by-side items. `inset with vertical and a fixed height`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | Root of the component that renders as a `<div>` tag. |
| `wrapper` | — | Yes | Wrapper for content when presented. |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, tokens, Divider } from '@fluentui/react-components';

export const Default = (): JSXElement => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <div className={styles.example}>
        <Divider />
      </div>
      <div className={styles.example}>
        <Divider>Text</Divider>
      </div>
    </div>
  );
};
```

### Appearance

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, tokens, Divider } from '@fluentui/react-components';

export const Appearance = (): JSXElement => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <div className={styles.example}>
        <Divider>(default)</Divider>
      </div>
      <div className={styles.example}>
        <Divider appearance="subtle">subtle</Divider>
      </div>
      <div className={styles.example}>
        <Divider appearance="brand">brand</Divider>
      </div>
      <div className={styles.example}>
        <Divider appearance="strong">strong</Divider>
      </div>
    </div>
  );
};

Appearance.parameters = {
  docs: {
    description: {
      story:
        'A divider can have a `brand`, `subtle`, or `strong` appearance.' +
        ' When not specified, it has its default experience.',
    },
  },
};
```

### AlignContent

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, tokens, Divider } from '@fluentui/react-components';

export const AlignContent = (): JSXElement => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <div className={styles.example}>
        <Divider alignContent="start">start</Divider>
      </div>
      <div className={styles.example}>
        <Divider alignContent="center">center (default)</Divider>
      </div>
      <div className={styles.example}>
        <Divider alignContent="end">end</Divider>
      </div>
      <div className={styles.example}>
        <Divider alignContent="start" vertical>
          start
        </Divider>
      </div>
      <div className={styles.example}>
        <Divider alignContent="center" vertical>
          center (default)
        </Divider>
      </div>
      <div className={styles.example}>
        <Divider alignContent="end" vertical>
          end
        </Divider>
      </div>
    </div>
  );
};

AlignContent.parameters = {
  docs: {
    description: {
      story:
        'The label associated with the divider can be aligned at the `start`, `center`, or `end` of the divider line.',
    },
  },
};
```

## Best Practices

### Do's

- Use Divider to separate groups of related content inside a single surface, such as form sections, list regions, card regions, or dialog footer areas, instead of hand-rolled border styles that drift from the theme.
- Give the divider a short label when the boundary needs to be named, for example a single word between two alternative actions; the content renders in the wrapper slot between the two line segments.
- Choose the appearance that matches the surrounding visual weight: subtle for dense, low-emphasis layouts, default for most surfaces, strong when the break is a primary structural boundary, and brand only where a brand accent is intentional.
- Set alignContent to start when the label introduces the content that follows, keep the center default for symmetric separations such as a word between two buttons, and use end when the label concludes the content before it.
- Use inset when the divider sits inside a container that already has padding, so the line lines up with the content rather than running the full width or height of the container.
- Give vertical dividers an explicit height, either a fixed value or a stretch to a sized parent, as shown in the Vertical and Inset examples where the divider receives a height of 100 percent.
- Keep the divider as a sibling of the content it separates, in the same flex, grid, or block flow, so it inherits the correct width or height and aligns with its neighbors.
- Keep label content as plain, meaningful text so it reads naturally in the surrounding text stream when a screen reader reads the page in order.

### Don'ts

- Do not stack a divider above and below the same element; repeated rules create visual noise, so use one rule plus spacing around the item instead.
- Do not put long or multi-line content in the divider label; the label sits between two rule segments, so extensive text squeezes or removes the visible line.
- Do not render a vertical divider without a defined parent height; the line has no intrinsic height and will collapse, leaving no visible separation.
- Do not use the strong or brand appearances everywhere; reserve the higher-contrast rules for the few boundaries that matter most and let default or subtle handle routine separation.
- Do not fake inset with wrapper divs, margins, or padding on the surrounding elements; use the inset prop so the offset comes from theme spacing tokens.
- Do not treat the divider's color or weight as a status indicator; it carries no semantic state and is not announced to assistive technology.
- Do not place the divider directly in inline text flow; the root renders as a block-level div element and belongs in a block or flex layout context.

## Anti-Patterns

### Height-less vertical divider

❌ A vertical divider placed in a flex row with no defined height has nothing to stretch against, so it collapses to zero height and the separation disappears entirely.

✅ Give the parent container a defined height, or set a height on the divider itself such as 100 percent inside a sized wrapper, as the vertical and inset examples do.

### Divider used as a spacer

❌ Adding a divider purely to create vertical rhythm between elements implies a semantic boundary that does not exist, adding visual and cognitive noise.

✅ Use layout spacing instead, such as gap in a flex or grid container or spacing tokens like tokens.spacingVerticalM applied as margin or padding.

### Faking inset with margins

❌ Wrapping a divider in padding or applying external margins to move the line away from the container edges duplicates spacing logic and drifts out of sync with the content inset.

✅ Use the inset prop so padding comes from theme spacing tokens and stays consistent with the rest of the layout.

### Over-decorating with strong or brand rules

❌ Rendering every boundary with the strong or brand appearance creates competing focal points and flattens the visual hierarchy of the page.

✅ Reserve strong and brand for the few boundaries that carry the most importance, and use default or subtle for routine separation.

### Long label treated as a section heading

❌ Dropping a full sentence into the divider label squeezes the rule, wraps the text awkwardly, and duplicates heading structure without providing heading semantics.

✅ Keep label text to a word or two and use a real heading or group label when the section needs to be named and announced.

## Accessibility

**Requirements**: Divider is presentational. Its root renders a plain div element with no role and no ARIA attributes, so it is never announced as a separator and never substitutes for real document structure. Because the rule can carry visual meaning, keep it perceptible: graphical boundaries should meet WCAG 1.4.11 non-text contrast, meaning at least 3 to 1 against the adjacent background, which the shipped neutral and brand stroke tokens are designed to satisfy. Any text placed in the label must meet WCAG 1.4.3 text contrast of at least 4.5 to 1, so avoid overriding label colors with low-contrast custom values. Never encode information only in the presence, color, or weight of a divider: pair the visual separation with headings, group labels, or other text so the structure is conveyed in text as well. A purely decorative divider needs no extra attributes.

| Key | Action |
| --- | --- |
| `Tab` | The divider is not focusable and is skipped; focus moves directly between the interactive elements it separates. |
| `Enter` | No effect; Divider has no interactive behavior. |
| `Space` | No effect; Divider has no interactive behavior. |

**ARIA**: No aria-* attributes are set by Divider itself; the root renders a plain div element with no implicit role., aria-hidden is unnecessary for decorative dividers because nothing is exposed to the accessibility tree to begin with., No separator role is applied; if a boundary must be conveyed to assistive technology, express it through headings or grouped structure in the surrounding markup.

**Screen Reader**: Screen readers do not announce Divider, because it exposes no role and no ARIA attributes: visually it is a line, semantically it is invisible. When a divider has children, that text lives in the wrapper slot and is read as ordinary text in the surrounding reading order, so keep label text short and understandable out of context, such as the single words used in the alignment and appearance examples. Focus never lands on a divider, so it does not interrupt keyboard or screen reader navigation between the elements it separates, and it does not create a landmark or list boundary of its own.

## Styling

Divider accepts className and style on its root slot, and the custom styles example shows the most common overrides: a fixed width for a horizontal divider, a fixed height for a vertical one, label typography changes such as a 14 pixel bold label, a custom line color, and a custom line style such as a two pixel dashed line. When overriding colors, prefer theme stroke and foreground tokens over literal color values: the neutral ramp tokens.colorNeutralStroke1, tokens.colorNeutralStroke2, and tokens.colorNeutralStroke3 cover the strong, default, and subtle weights, and tokens.colorBrandStroke1 backs the brand appearance, while palette tokens such as tokens.colorPaletteRedBorder2 can be used when a deliberate off-brand accent is required, as in the custom styles example. For label typography use tokens.fontFamilyBase, tokens.fontSizeBase200 or tokens.fontSizeBase300, tokens.fontWeightRegular or tokens.fontWeightSemibold, and tokens.lineHeightBase300. Line thickness comes from stroke width tokens such as tokens.strokeWidthThin or tokens.strokeWidthThick, and layout offsets around the divider are best expressed with spacing tokens such as tokens.spacingVerticalS, tokens.spacingHorizontalS, and tokens.spacingHorizontalM, optionally applied through shorthands such as shorthands.margin and shorthands.padding. Define overrides with makeStyles rather than inline style objects so the rules land in Griffel's atomic class cache and respond to theme and density changes.

## Performance

Divider is one of the cheapest components in the library: it holds no internal state, registers no effects, performs no measurement, and renders a single root div element, plus a wrapper element only when children are supplied. That makes it safe to use inside long lists, repeated rows, and dense panels. All styling is produced through makeStyles (Griffel), which compiles to atomic classes at build time, so many dividers that share the same prop combination share class names and avoid duplicate rule injection. Prefer the built-in appearance and inset props over per-instance custom classes when the design system values suffice, because that maximizes class reuse. If you pass inline style objects for sizing, as the vertical and inset examples do for height, hoist them to module scope or memoize them so new objects are not created on each render. Because the component renders no portals and attaches no observers or event listeners, it adds essentially nothing to the runtime cost of a layout.

## Theming & Tokens

Divider is entirely theme-token driven and follows the active theme from Provider, including light, dark, and custom themes, without any prop changes. The line color comes from the stroke ramp: the subtle appearance uses the lightest neutral stroke, tokens.colorNeutralStroke3, the default appearance uses tokens.colorNeutralStroke2, the strong appearance uses tokens.colorNeutralStroke1, and the brand appearance uses tokens.colorBrandStroke1, so contrast relationships hold when the theme switches between light and dark or uses high-contrast system colors. Inset padding and the gap around the label come from spacing tokens such as tokens.spacingHorizontalS, tokens.spacingHorizontalM, and tokens.spacingVerticalS, and label typography inherits font tokens such as tokens.fontFamilyBase, tokens.fontSizeBase200, tokens.fontSizeBase300, and tokens.lineHeightBase300. Line thickness uses stroke width tokens such as tokens.strokeWidthThin and tokens.strokeWidthThick. If you override colors in makeStyles, prefer stroke and foreground tokens or palette tokens like tokens.colorPaletteRedBorder2 over hard-coded hex values so the divider keeps responding to theme and density changes.

## Migration Notes

The v9 API is deliberately small: appearance, inset, vertical, and alignContent, with label content passed as children and rendered through the wrapper slot. If you are coming from an earlier Fluent UI version, note that visual variation that used to be expressed through theme or style overrides is now expressed through the appearance prop, edge padding that was previously hand-applied is expressed through the inset boolean, and alignContent accepts start, center, and end for both horizontal and vertical dividers. Customization is now done on the root slot with makeStyles and theme tokens, and the component reads tokens from the surrounding Provider, so no theme prop is needed.

## Edge Cases

- A vertical divider collapses unless a height is defined somewhere in the chain; the vertical and inset examples set a height of 100 percent to stretch it within a sized wrapper.
- Inset shortens the visible line: a horizontal inset divider no longer spans the full container width and a vertical inset divider is shorter than its allotted height, which affects alignment with the content edges.
- A very long or wrapping label consumes the space between the line segments, sometimes leaving no visible rule at all, so label content should stay short.
- The root renders as a block-level div element, so placing a divider directly inside a paragraph or another inline context results in invalid flow content; use a block or flex layout instead.
- Without a className or style override, a horizontal divider fills the width of its container and a vertical divider has no intrinsic height, so sizing almost always has to come from the parent or from an explicit width or height.
- Screen readers do not announce the divider at all, so a boundary you rely on visually must also be represented through headings, group labels, or other text in the surrounding structure.

## See Also

- [layout category](../categories/layout.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
