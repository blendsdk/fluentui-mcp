# Divider

> **Package**: `@fluentui/react-divider`
> **Import**: `import { Divider } from '@fluentui/react-components'`
> **Category**: Layout

## Overview

Divider visually separates content with a horizontal or vertical line. It can optionally include text or other content.

---

## Basic Usage

```typescript
import * as React from 'react';
import { Divider } from '@fluentui/react-components';

export const BasicDivider: React.FC = () => (
  <Divider />
);
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `alignContent` | `'start' \| 'center' \| 'end'` | `'center'` | Content alignment |
| `appearance` | `'default' \| 'subtle' \| 'brand' \| 'strong'` | `'default'` | Visual style |
| `inset` | `boolean` | `false` | Add padding to ends |
| `vertical` | `boolean` | `false` | Vertical orientation |

---

## With Content

```typescript
import * as React from 'react';
import { Divider } from '@fluentui/react-components';

export const DividerWithContent: React.FC = () => (
  <>
    <Divider>Section Title</Divider>
    <Divider>OR</Divider>
  </>
);
```

---

## Content Alignment

```typescript
<Divider alignContent="start">Start</Divider>
<Divider alignContent="center">Center (default)</Divider>
<Divider alignContent="end">End</Divider>
```

---

## Appearance Variants

```typescript
<Divider appearance="default">Default</Divider>
<Divider appearance="subtle">Subtle</Divider>
<Divider appearance="brand">Brand</Divider>
<Divider appearance="strong">Strong</Divider>
```

---

## Vertical Divider

```typescript
import * as React from 'react';
import { Divider, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    height: '100px',
    gap: tokens.spacingHorizontalM,
  },
});

export const VerticalDivider: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <span>Left content</span>
      <Divider vertical />
      <span>Right content</span>
    </div>
  );
};
```

---

## Inset Divider

```typescript
// Adds padding to the start and end of the divider
<Divider inset />
<Divider inset>With content</Divider>
```

---

## Common Use Cases

### List Separator

```typescript
import * as React from 'react';
import { Divider, Text, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  item: {
    padding: tokens.spacingVerticalS,
  },
});

export const ListWithDividers: React.FC = () => {
  const styles = useStyles();
  const items = ['Item 1', 'Item 2', 'Item 3'];

  return (
    <div className={styles.list}>
      {items.map((item, index) => (
        <React.Fragment key={item}>
          {index > 0 && <Divider />}
          <Text className={styles.item}>{item}</Text>
        </React.Fragment>
      ))}
    </div>
  );
};
```

### Section Separator

```typescript
import * as React from 'react';
import { Divider, Text, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
});

export const SectionSeparator: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Text>Section 1 content</Text>
      <Divider appearance="brand">New Section</Divider>
      <Text>Section 2 content</Text>
    </div>
  );
};
```

---

## Accessibility

- Dividers are decorative by default (`role="separator"`)
- Content within dividers is accessible to screen readers
- Use `aria-hidden="true"` for purely decorative dividers without content

---

## Best Practices

### ✅ Do's

```typescript
// Use to separate logical sections
<Divider />

// Use with descriptive text for section breaks
<Divider>Settings</Divider>

// Use vertical for inline separation
<Toolbar>
  <Button>Bold</Button>
  <Divider vertical />
  <Button>Align Left</Button>
</Toolbar>
```

### ❌ Don'ts

```typescript
// Don't use multiple dividers in succession
<Divider />
<Divider />

// Don't use dividers inside small components
// Don't overuse - creates visual clutter
```

---

## See Also

- [Card](card.md) - Content container
- [Component Index](../00-component-index.md)