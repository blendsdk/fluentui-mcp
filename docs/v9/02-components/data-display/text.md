# Text

> **Package**: `@fluentui/react-text`
> **Import**: `import { Text, Title1, Body1, Caption1, ... } from '@fluentui/react-components'`
> **Category**: Data Display

## Overview

Text components provide consistent typography. FluentUI includes `Text` (generic) and semantic components for headings, body, and captions.

---

## Basic Usage

```typescript
import * as React from 'react';
import { Text } from '@fluentui/react-components';

export const BasicText: React.FC = () => (
  <Text>Default text content</Text>
);
```

---

## Text Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `100-1000` | `300` | Font size token |
| `weight` | `'regular' \| 'medium' \| 'semibold' \| 'bold'` | `'regular'` | Font weight |
| `align` | `'start' \| 'center' \| 'end' \| 'justify'` | `'start'` | Text alignment |
| `font` | `'base' \| 'monospace' \| 'numeric'` | `'base'` | Font family |
| `italic` | `boolean` | `false` | Italic style |
| `underline` | `boolean` | `false` | Underline style |
| `strikethrough` | `boolean` | `false` | Strikethrough |
| `truncate` | `boolean` | `false` | Truncate with ellipsis |
| `block` | `boolean` | `false` | Display as block |
| `wrap` | `boolean` | `true` | Allow text wrapping |
| `as` | `'span' \| 'p' \| 'h1-h6' \| etc.` | `'span'` | HTML element |

---

## Typography Components

```typescript
import * as React from 'react';
import {
  Display,
  LargeTitle,
  Title1, Title2, Title3,
  Subtitle1, Subtitle2,
  Body1, Body2,
  Caption1, Caption2,
} from '@fluentui/react-components';

export const AllTypography: React.FC = () => (
  <>
    <Display>Display (68px)</Display>
    <LargeTitle>LargeTitle (40px)</LargeTitle>
    <Title1>Title1 (28px)</Title1>
    <Title2>Title2 (24px)</Title2>
    <Title3>Title3 (20px)</Title3>
    <Subtitle1>Subtitle1 (20px semibold)</Subtitle1>
    <Subtitle2>Subtitle2 (16px semibold)</Subtitle2>
    <Body1>Body1 (14px) - Default body text</Body1>
    <Body2>Body2 (12px)</Body2>
    <Caption1>Caption1 (12px)</Caption1>
    <Caption2>Caption2 (10px)</Caption2>
  </>
);
```

---

## Size Reference

| Size | Pixels | Component |
|------|--------|-----------|
| 100 | 10px | Caption2 |
| 200 | 12px | Caption1, Body2 |
| 300 | 14px | Body1 (default) |
| 400 | 16px | Subtitle2 |
| 500 | 20px | Title3, Subtitle1 |
| 600 | 24px | Title2 |
| 700 | 28px | Title1 |
| 900 | 40px | LargeTitle |
| 1000 | 68px | Display |

---

## Styling Options

```typescript
<Text weight="regular">Regular weight</Text>
<Text weight="semibold">Semibold weight</Text>
<Text weight="bold">Bold weight</Text>
<Text italic>Italic text</Text>
<Text underline>Underlined text</Text>
<Text strikethrough>Strikethrough text</Text>
<Text font="monospace">Monospace font</Text>
```

---

## Truncation

```typescript
import * as React from 'react';
import { Text, makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  truncated: { width: '200px' },
});

export const TruncatedText: React.FC = () => {
  const styles = useStyles();
  return (
    <Text truncate block className={styles.truncated}>
      This is a very long text that will be truncated with ellipsis.
    </Text>
  );
};
```

---

## Semantic HTML

```typescript
import * as React from 'react';
import { Title1, Body1 } from '@fluentui/react-components';

export const SemanticText: React.FC = () => (
  <article>
    <Title1 as="h1">Page Title</Title1>
    <Body1 as="p">Paragraph content goes here.</Body1>
  </article>
);
```

---

## Best Practices

### ✅ Do's

```typescript
<Title1 as="h1">Page Heading</Title1>  // Semantic HTML
<Body1>Regular content</Body1>  // Appropriate component
<Text truncate block>Long text...</Text>  // Handle overflow
```

### ❌ Don'ts

```typescript
<Text size={700}>Title</Text>  // Use Title1 instead
<Body1 as="h1">Heading</Body1>  // Wrong semantic element
```

---

## See Also

- [Theming - Typography](../../01-foundation/03-theming.md)
- [Component Index](../00-component-index.md)