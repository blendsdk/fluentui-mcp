# Text

> **Package**: `@fluentui/react-text` v9.6.17
> **Import**: `import { Text } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

Text is the lowest-level typography primitive in Fluent UI React v9. It renders a single root slot — an inline text element by default — and surfaces the design system's type ramp directly as props: size selects one of ten type-ramp steps (100 through 1000) that each map to a paired font size and line height, weight selects regular, medium, semibold, or bold, font chooses between the base, monospace, and numeric families, and the boolean decorations italic, underline, and strikethrough toggle text decorations. A second group of props controls layout behavior: block switches the root to block display, wrap controls white-space wrapping (defaulting to true), truncate collapses overflowing text to a single ellipsized line, and align positions the text relative to its parent container. Because Text is a styling primitive rather than a semantic element, it adds no roles, headings, or landmark semantics — it simply applies composed Griffel classes derived from theme tokens. It works both through props and through className overrides created with makeStyles, so it participates fully in FluentProvider theming and can be mixed with other typography utilities in the same component tree.

**When to use**: Use Text when you need precise, element-level control over how a run of content is typeset with design-token values: a caption under a form field, a numeric readout that needs tabular figures, a code identifier that needs the monospace family, a single-line label that must truncate with an ellipsis, or a paragraph that needs justified alignment. It is the right choice when the styling is specific to one piece of content rather than a repeated role. Reach for typography presets instead when the content plays a well-known, repeated role in the type hierarchy (for example a body paragraph or a title) and you want consistency without re-specifying size and weight each time. Use plain semantic HTML when you do not need Fluent typography at all, use Link for navigational text, Button or CompoundButton for actionable text, and Label when the text is the accessible name of a form control. Also prefer Text over hand-written CSS classes when you specifically want the theme's type ramp, its high-contrast behavior, and its RTL-aware alignment.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `align` | `"start" \| "center" \| "end" \| "justify" \| undefined` | `start` | No | Aligns text based on the parent container. |
| `block` | `boolean \| undefined` | `false` | No | Applies a block display for the content. |
| `font` | `"base" \| "monospace" \| "numeric" \| undefined` | `base` | No | Applies the font family to the content. |
| `italic` | `boolean \| undefined` | `false` | No | Applies the italic font style to the content. |
| `size` | `100 \| 200 \| 300 \| 400 \| 500 \| 600 \| 700 \| 800 \| 900 \| 1000 \| undefined` | `300` | No | Applies font size and line height based on the theme typography tokens. |
| `strikethrough` | `boolean \| undefined` | `false` | No | Applies the strikethrough text decoration to the content. |
| `truncate` | `boolean \| undefined` | `false` | No | Truncate overflowing text for block displays. |
| `underline` | `boolean \| undefined` | `false` | No | Applies the underline text decoration to the content. |
| `weight` | `"regular" \| "medium" \| "semibold" \| "bold" \| undefined` | `regular` | No | Applies font weight to the content. |
| `wrap` | `boolean \| undefined` | `true` | No | Wraps the text content on white spaces. |

### Prop Guidance

- **align**: Sets horizontal text alignment relative to the parent container. It only produces a visible effect on block-level content that is wider than its text or that wraps across multiple lines, so combine it with block or with a sized wrapper. Use center or end sparingly for short strings, and reserve justify for full-width prose where consistent flush edges are desirable. `center`
- **block**: Switches the root from inline to block display. Use it when the text is a standalone paragraph, when you need align to take effect, or when truncation requires a box that can be width-constrained. Remember it is a layout-only change and adds no paragraph or heading semantics. `true`
- **font**: Selects the font family from the theme: base for ordinary UI and body copy, numeric for figures that must align in columns (tables, counters, metrics), and monospace for code, identifiers, hashes, and keys. It changes family only, so combine it with size and weight when the content needs a distinct visual weight as well. `monospace`
- **italic**: Applies the italic font style. Use it for genuine typographic emphasis, titles of works, or inline foreign terms; pair it with appropriate semantics in the markup if the italic run carries meaning, because the slant itself is not announced by screen readers. `true`
- **size**: Chooses one of the ten type-ramp steps, each of which applies a matched font size and line height from the theme. Defaults to 300, which is the standard body size. Pick the smallest step that meets the hierarchy you need, keep sizes consistent for the same content role, and avoid inventing intermediate values since they are outside the ramp. `500`
- **strikethrough**: Draws a horizontal line through the text. Use it for visibly removed or superseded content such as an old price or a completed item, and always state the meaning in the surrounding content as well, since the decoration is purely visual. `true`
- **truncate**: Collapses overflowing text into a single ellipsized line. It requires a bounded width and single-line behavior, so it is normally used together with wrap set to false and a width-constraining className or parent. Provide a way to reveal the full string, such as a Tooltip, whenever the truncated portion is meaningful. `true`
- **underline**: Applies an underline decoration. Use it for emphasis or editorial convention, and avoid it near Link or other navigational text where an underline implies interactivity; it is not a substitute for stating that something is a link. `true`
- **weight**: Sets font weight to regular, medium, semibold, or bold. Regular is the default body weight, medium and semibold suit labels, emphasis, and small headings, and bold should be reserved for the strongest emphasis. Combine it with a size step rather than reaching for raw font-weight CSS so the pairing stays within the type ramp. `semibold`
- **wrap**: Controls whether the text wraps on white space and defaults to true, which is what you want for prose. Set it to false to keep content on one line — this is required alongside truncate for an ellipsis, and it is useful for labels in constrained horizontal layouts, though without truncate the content can overflow its container. `false`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Text } from '@fluentui/react-components';

export const Default = (): JSXElement => <Text>This is an example of the Text component's usage.</Text>;
```

### Alignment

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, Text } from '@fluentui/react-components';

export const Alignment = (): JSXElement => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Text align="start">Aligned to start</Text>
      <Text align="center">Aligned to center</Text>
      <Text align="end">Aligned to end</Text>
      <Text align="justify">
        Justified text: Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium accusamus voluptate autem?
        Recusandae alias corporis dicta quisquam sequi molestias deleniti, libero necessitatibus, eligendi, omnis cumque
        enim asperiores quasi quidem sit. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus repellat
        consectetur, sed aperiam ex nulla repellendus tempora vero illo aliquam autem! Impedit ipsa praesentium vero
        veritatis unde eos, fuga magnam!
      </Text>
    </div>
  );
};
```

### Font

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, Text } from '@fluentui/react-components';

export const Font = (): JSXElement => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Text font="base">This is the default font</Text>
      <Text font="numeric">This is numeric font</Text>
      <Text font="monospace">This is monospace font</Text>
    </div>
  );
};
```

## Best Practices

### Do's

- Pair truncate with wrap set to false so the root uses a single non-wrapping line, and give the element or its parent a bounded width — otherwise there is nothing to overflow and the ellipsis never appears.
- Set block when you use align or when the text should behave as a standalone paragraph; text alignment is only visible on block-level boxes and on multi-line content, so an inline Text with align changes nothing visually.
- Use font set to numeric for numbers that sit in columns, counters, or any place where digits must line up vertically, and font set to monospace for code, identifiers, keys, and token names.
- Express emphasis through the built-in props (weight, italic) or through theme color tokens applied with makeStyles, rather than through ad-hoc font-size or font-weight declarations that bypass the type ramp.
- Choose sizes from the ten-step ramp (100 through 1000) so line height stays paired with font size and the text scales predictably with the rest of the design system.
- Use the typography presets shown in the Presets story when the same combination of size and weight recurs across a surface, and reserve the individual Text props for one-off or dynamically computed styling.
- Set wrap to false for labels inside tight horizontal layouts such as toolbars, breadcrumbs, or table header cells so a long string cannot force the container to grow.
- When the full string matters to the user after truncation, provide the complete text through a Tooltip or another discoverable affordance rather than relying on the ellipsis alone.

### Don'ts

- Do not attach click handlers or navigation to Text to make it look and behave like a link or button — Text is not focusable, has no role, and exposes no keyboard activation, so use Link, Button, or CompoundButton instead.
- Do not create document structure by only enlarging size and weight; size and weight are purely visual, so screen reader users still get an unstructured blob of text and cannot navigate by heading.
- Do not hard-code pixel font sizes, line heights, font families, or hex colors in a className — those values do not respond to theme switches or high-contrast mode; use the size, weight, and font props or tokens from the theme.
- Do not rely on strikethrough, underline, italic, or color alone to communicate meaning such as removed, required, or erroneous content; state the meaning in the text as well.
- Do not apply truncate to inline or intrinsically sized text and expect an ellipsis — truncation needs a constrained block box, so a width limit plus block or a sized parent is mandatory.
- Do not nest Text inside Text merely to change one fragment; use the appropriate inline semantics or split the content into sibling Text elements so the styling stays predictable and the DOM stays shallow.
- Do not use align set to justify for narrow columns, short strings, or UI labels — justification stretches spaces unpredictably and can create distracting gaps of whitespace.
- Do not assume block makes the text semantically a paragraph or heading; it only changes the CSS display, not the element's meaning.

## Anti-Patterns

### Interactive text built from a presentation primitive

❌ Adding an onClick handler or navigation behavior to Text makes it look actionable but leaves it unfocusable, absent from the tab order, and without a role, so keyboard and screen reader users cannot reach or activate it.

✅ Use Link for navigation and Button or CompoundButton for actions, and keep Text for non-interactive content, including inside those controls when only the typography needs to change.

### Truncate without a bounded box

❌ Setting truncate on inline or intrinsically sized text produces no ellipsis because there is no width to overflow, and leaving wrap at its default of true prevents the single-line behavior the ellipsis depends on, so the long string simply expands its container.

✅ Give the element or its parent a constrained width through makeStyles or a grid/flex track, set block when the text must own its box, and set wrap to false together with truncate so exactly one ellipsized line is rendered.

### Faking document structure with size and weight

❌ Enlarging Text with a large size and a heavy weight looks like a heading but carries no heading semantics, so assistive technology users cannot navigate the page by structure and automated tools report missing headings.

✅ Express the hierarchy with real semantic headings in the surrounding markup, and use Text — or the typography presets — only for the visual styling of the content inside those elements.

### Hard-coded typography and color values

❌ Overriding font-size, line-height, font-family, or color with literal pixel and hex values bypasses the theme, so the text stops matching the rest of the design system, breaks when the theme or brand changes, and can fail contrast in dark and high-contrast modes.

✅ Use the size, weight, and font props for typography, and apply color through theme tokens such as tokens.colorNeutralForeground2 or tokens.colorBrandForeground1 in a makeStyles class so the values always resolve from the active theme.

### Meaning carried only by text decoration

❌ Using strikethrough, underline, italic, or a color change to signal that content is removed, required, or invalid communicates nothing to screen reader users and nothing to users who cannot perceive the decoration.

✅ State the status in the text itself or in the associated label and validation messaging, and treat the decoration as redundant reinforcement rather than the sole signal.

## Accessibility

**Requirements**: Text must satisfy WCAG 1.4.3 contrast minimums (4.5:1 for normal-size text, 3:1 for large text) against its actual background, which means you should prefer theme foreground tokens over hard-coded colors so the default pairing remains compliant. Under WCAG 1.4.4, text must remain readable and functional when zoomed to 200 percent, so avoid fixed pixel heights or overflow clipping that cuts off content when the ramp scales up. WCAG 1.3.1 requires that structure be conveyed programmatically: size and weight are visual only, so headings, list structure, and grouping must come from real semantics in the surrounding markup rather than from enlarged Text. Because truncate hides characters visually while leaving the full string in the DOM, truncated text must still make the full value discoverable (for example through a Tooltip) and must never be the only place a required value is shown. WCAG 1.4.12 text-spacing requirements mean you should not constrain Text with letter-spacing or line-height overrides that break when users apply their own spacing.

| Key | Action |
| --- | --- |
| `Tab` | Text is not focusable and is skipped in the tab order; only a focusable descendant such as a Link or Button placed inside it will become a tab stop. |
| `Enter` | No built-in behavior — Text handles no activation keys; use Link or Button when the text must be activated by keyboard. |
| `Space` | No built-in behavior — Text does not activate on Space, reinforcing that it is presentational content rather than a control. |

**ARIA**: Text sets no ARIA attributes of its own; consumer-supplied attributes such as aria-label, aria-describedby, aria-hidden, aria-live, aria-atomic, and role are passed through to the root slot., aria-hidden="true" can be applied to decorative text that duplicates information already conveyed elsewhere., aria-label or aria-describedby should be applied to the surrounding control, not to Text, when Text supplies a visible name or hint for a form field., title may be supplied for the full value of truncated text, though a Tooltip is the more discoverable and consistent pattern in Fluent UI., dir and lang pass through to the root slot and are the correct way to mark bidirectional or foreign-language runs rather than faking direction with alignment.

**Screen Reader**: Because Text carries no role and no implicit semantics, screen readers simply read its text content as part of whatever surrounding element contains it — there is no announcement of size, weight, font family, italic, underline, or strikethrough, since those are CSS-only. Truncation is implemented with CSS overflow and an ellipsis, so the full string normally remains in the accessibility tree and is announced completely; only an explicit aria-hidden on the element removes it. Alignment, block display, and wrapping have no accessibility-tree effect, and justify only changes visual spacing. As a result, any meaning you intend to convey through typography alone is invisible to assistive technology and must be expressed in the text itself or in the semantics of the parent element.

## Styling

Create styles with makeStyles from @fluentui/react-components and pass the resulting class through className; the class is merged onto the root slot by the Griffel styling engine, so it composes cleanly with the classes generated by the props. The typical customization is color: the default foreground corresponds to tokens.colorNeutralForeground1, with tokens.colorNeutralForeground2, tokens.colorNeutralForeground3, and tokens.colorNeutralForeground4 available for progressively de-emphasized text and tokens.colorBrandForeground1 for accent or link-like emphasis. Sizes map to the paired typography tokens tokens.fontSizeBase100 through tokens.fontSizeBase1000 with tokens.lineHeightBase100 through tokens.lineHeightBase1000, weights map to tokens.fontWeightRegular, tokens.fontWeightMedium, tokens.fontWeightSemibold, and tokens.fontWeightBold, and fonts map to tokens.fontFamilyBase, tokens.fontFamilyMonospace, and tokens.fontFamilyNumeric. When you need truncation, style the root or its wrapper with a bounded width using properties such as maxWidth or a grid/flex track, then set truncate and wrap set to false; because the implementation relies on overflow hidden plus an ellipsis, adding your own overflow or white-space overrides can defeat it. Prefer margin and gap on the parent layout over margin utilities inside the text so spacing stays consistent, and avoid !important or raw pixel values so theme and high-contrast modes continue to work.

## Performance

Text is an extremely light component: it renders one root element and composes a small set of Griffel classes derived from the props it receives, so hundreds of instances on a screen are inexpensive. The main cost consideration is class generation, which Griffel caches and deduplicates per unique prop combination, so repeatedly rendering the same size, weight, and font values across a list is cheaper than varying all of them per item. Truncation is handled entirely by CSS overflow and ellipsis rather than by measuring or slicing strings in JavaScript, which avoids layout thrashing and re-renders on resize; that is a strong reason to prefer truncate over a manual character-count approach. Defining styles with makeStyles at module scope — rather than inline style objects created during render — lets the styling engine reuse the same atomic classes and prevents new class allocations on every render pass, and merging classes with mergeClasses keeps the resulting className stable so memoized children are not invalidated unnecessarily.

## Theming & Tokens

Text derives everything from the theme provided by FluentProvider. Size maps to the typography token pairs tokens.fontSizeBase100 through tokens.fontSizeBase1000 and tokens.lineHeightBase100 through tokens.lineHeightBase1000, weight maps to tokens.fontWeightRegular, tokens.fontWeightMedium, tokens.fontWeightSemibold, and tokens.fontWeightBold, and font maps to tokens.fontFamilyBase, tokens.fontFamilyMonospace, and tokens.fontFamilyNumeric. The default foreground resolves to tokens.colorNeutralForeground1; secondary, tertiary, and disabled-feeling text should use tokens.colorNeutralForeground2, tokens.colorNeutralForeground3, and tokens.colorNeutralForeground4 respectively, with tokens.colorBrandForeground1 for accent emphasis. Switching between light, dark, high-contrast, or a custom brand theme recalculates these values without any change to your markup, and overriding the typography tokens in a custom theme changes the entire ramp at once. Hard-coded colors and font stacks sit outside this system and will not follow the theme, so prefer tokens in makeStyles classes whenever the default styling needs to be extended.

## Migration Notes

Migrating from Fluent UI React v8: the v8 Text exposed a named variant prop plus a styles prop for class overrides, while v9 replaces the single variant with two orthogonal props — a numeric size ramp from 100 to 1000 and a separate weight prop — so a v8 variant maps to a specific size and weight pair, and the weight part should now be expressed explicitly. v9 also adds capabilities that previously required custom styling: font for the base, monospace, and numeric families, block for block-level display, wrap for controlling white-space behavior, truncate for single-line ellipsis, align for start, center, end, and justify positioning, and the boolean italic, underline, and strikethrough decorations. Class overrides move from the v8 styles prop and mergeStyleSets to Griffel's makeStyles and mergeClasses, and colors that were once set through style overrides should now be expressed with theme tokens such as tokens.colorNeutralForeground2. If the previous code used the component's default element implicitly, verify that the needed semantics still exist in v9, since Text remains a presentation-only primitive and does not supply heading or paragraph structure.

## Edge Cases

- Truncate silently does nothing on inline content or content without a width limit, and it also does nothing when wrap is left at its default of true — both a bounded box and single-line behavior are required.
- Align values other than start are visually indistinguishable from start on short inline text and on text that is not block-level, which often reads as the prop being broken.
- Justified alignment applies only when the text wraps across multiple lines; a single line renders identically to start alignment.
- Combining underline and strikethrough draws overlapping decorations that reduce legibility, especially on characters with descenders.
- The size prop takes numeric literals from 100 to 1000 only; values outside that set are not part of the type ramp and will not map to theme tokens.
- Font set to numeric or monospace changes family only, leaving size, weight, and line height untouched, so a monospace run can still look visually inconsistent with adjacent text unless size and weight are matched deliberately.
- block changes only the CSS display, so wrapping Text in block does not create a paragraph, heading, or list item for assistive technology.
- Text provides no accessible name of its own, so when it visually labels a control, that association must be established on the control itself rather than on the Text element.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
