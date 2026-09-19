# Text

> **Package**: `@fluentui/react-text` v9.6.17
> **Import**: `import { Text } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

Text is the Fluent UI React v9 primitive for rendering readable strings with the design system's typography scale. It renders a single root slot element and maps its props directly onto theme typography tokens, so a single component covers the full range of the Fluent type ramp: ten font sizes (100 through 1000), four weights (regular, medium, semibold, bold), three font families (base, monospace, numeric), and the italic, underline, and strikethrough decorations. Layout-oriented behavior is handled by the align, block, wrap, and truncate props, which let the same component serve as inline body copy inside a paragraph, a block-level paragraph with justified or end-aligned text, or a single-line label that ellipsizes when its container is too narrow. Because Text has no variant enumeration and no nested slots, its visual output is entirely determined by props plus the active theme, which makes it the lowest-level, most predictable building block for content in a Fluent interface.

**When to use**: Use Text whenever you need to display a string of copy, a label, a caption, a numeric value, or a short heading-like line and you want that text to inherit Fluent's type ramp, color, and font families. Prefer Text over styling raw markup with makeStyles because sizing, weight, and line height stay token-driven and automatically follow theme changes. Use the dedicated typography scale (sizes 100 through 1000 combined with weights) to express hierarchy instead of inventing pixel values, and use block plus align and truncate when the copy needs block-level layout or must be clipped to a single line. Reach for a semantic element for headings, paragraphs, lists, and links when document structure matters; Text is the presentational layer, so it is best paired with, not substituted for, those semantics.

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

- Choose size and weight from the documented ramp (100 through 1000 and regular through bold) so text matches the rest of the Fluent type scale
- Set block to true when the text needs to occupy its own line, and use align with start, center, end, or justify to control how that block flows
- Combine truncate with wrap set to false and a constrained width on the root element so single-line ellipsis actually takes effect
- Use font set to numeric for figures that should align in tables or columns, and monospace for code-like or fixed-width content
- Rely on underline, italic, and strikethrough only to reinforce meaning that is already expressed in the surrounding copy or structure
- Apply additional color, spacing, or casing through a makeStyles class passed to the root element rather than through ad-hoc inline styling
- Keep the default size of 300 for body copy and step up the size or weight for emphasis rather than changing font family

### Don'ts

- Do not use Text with a large size to imitate a document heading; screen readers will still announce it as ordinary text
- Do not set truncate without also disabling wrapping and constraining the width, because the ellipsis simply will not appear with the default wrap of true and an unconstrained container
- Do not convey state such as disabled, error, or deleted purely through strikethrough, italic, or a color change on Text
- Do not drop to size 100 or 200 for essential body copy, since those sizes resolve to very small type that harms legibility and contrast compliance
- Do not nest block-level Text inside inline contexts or inside another block Text in a way that produces invalid markup for the rendered element
- Do not override font family, size, or line height with hard-coded pixel values, because the component is designed to follow theme typography tokens
- Do not use Text as a container for interactive controls; Text is non-interactive and cannot receive focus

## Accessibility

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
