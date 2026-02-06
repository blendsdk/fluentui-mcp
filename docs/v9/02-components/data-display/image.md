# Image

> **Package**: `@fluentui/react-image`
> **Import**: `import { Image } from '@fluentui/react-components'`
> **Category**: Data Display

## Overview

Image displays visual content with built-in loading states, fallback support, and styling options.

---

## Basic Usage

```typescript
import * as React from 'react';
import { Image } from '@fluentui/react-components';

export const BasicImage: React.FC = () => (
  <Image
    src="https://example.com/photo.jpg"
    alt="Description of image"
  />
);
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | - | Image source URL |
| `alt` | `string` | - | Alternative text (required for a11y) |
| `fit` | `'none' \| 'center' \| 'contain' \| 'cover' \| 'default'` | `'default'` | Object-fit behavior |
| `shape` | `'square' \| 'circular' \| 'rounded'` | `'square'` | Image shape |
| `bordered` | `boolean` | `false` | Show border |
| `shadow` | `boolean` | `false` | Show shadow |
| `block` | `boolean` | `false` | Display as block |

---

## Fit Variants

```typescript
import * as React from 'react';
import { Image, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: { display: 'flex', gap: tokens.spacingHorizontalM },
  imageWrapper: { width: '150px', height: '150px', border: '1px dashed gray' },
});

export const ImageFit: React.FC = () => {
  const styles = useStyles();
  const src = "https://example.com/photo.jpg";

  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <Image src={src} alt="Cover fit" fit="cover" />
      </div>
      <div className={styles.imageWrapper}>
        <Image src={src} alt="Contain fit" fit="contain" />
      </div>
      <div className={styles.imageWrapper}>
        <Image src={src} alt="None fit" fit="none" />
      </div>
    </div>
  );
};
```

---

## Shape Variants

```typescript
<Image src="..." alt="Square" shape="square" />
<Image src="..." alt="Rounded" shape="rounded" />
<Image src="..." alt="Circular" shape="circular" />
```

---

## With Border and Shadow

```typescript
<Image src="..." alt="Bordered" bordered />
<Image src="..." alt="With shadow" shadow />
<Image src="..." alt="Both" bordered shadow />
```

---

## Accessibility

- **Always provide `alt` text** for meaningful images
- Use `alt=""` for decorative images
- Ensure sufficient contrast for bordered images

---

## Best Practices

### ✅ Do's

```typescript
<Image src="..." alt="Product photo showing blue widget" />  // Descriptive alt
<Image src="..." alt="" />  // Decorative image
<Image src="..." alt="..." fit="cover" />  // Appropriate fit
```

### ❌ Don'ts

```typescript
<Image src="..." />  // Missing alt
<Image src="..." alt="image" />  // Non-descriptive alt
```

---

## See Also

- [Avatar](avatar.md) - User images
- [Component Index](../00-component-index.md)