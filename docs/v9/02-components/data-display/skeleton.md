# Skeleton

> **Package**: `@fluentui/react-skeleton`
> **Import**: `import { Skeleton, SkeletonItem } from '@fluentui/react-components'`
> **Category**: Data Display

## Overview

Skeleton provides loading placeholders that indicate content is being fetched. Use to reduce perceived loading time.

---

## Basic Usage

```typescript
import * as React from 'react';
import { Skeleton, SkeletonItem } from '@fluentui/react-components';

export const BasicSkeleton: React.FC = () => (
  <Skeleton>
    <SkeletonItem />
  </Skeleton>
);
```

---

## Skeleton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `animation` | `'wave' \| 'pulse'` | `'wave'` | Animation type |
| `appearance` | `'opaque' \| 'translucent'` | `'opaque'` | Visual appearance |

## SkeletonItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `shape` | `'rectangle' \| 'circle' \| 'square'` | `'rectangle'` | Item shape |
| `size` | `number` | `16` | Size for circle/square shapes |

---

## Animation Types

```typescript
<Skeleton animation="wave">
  <SkeletonItem />
</Skeleton>

<Skeleton animation="pulse">
  <SkeletonItem />
</Skeleton>
```

---

## Shape Variants

```typescript
import * as React from 'react';
import { Skeleton, SkeletonItem, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  row: { display: 'flex', gap: tokens.spacingHorizontalM, alignItems: 'center' },
});

export const SkeletonShapes: React.FC = () => {
  const styles = useStyles();

  return (
    <Skeleton>
      <div className={styles.row}>
        <SkeletonItem shape="circle" size={48} />
        <SkeletonItem shape="square" size={48} />
        <SkeletonItem shape="rectangle" style={{ width: '200px' }} />
      </div>
    </Skeleton>
  );
};
```

---

## Card Loading Pattern

```typescript
import * as React from 'react';
import { Skeleton, SkeletonItem, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingHorizontalL,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    width: '300px',
  },
  header: { display: 'flex', gap: tokens.spacingHorizontalM, alignItems: 'center' },
  text: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXS, flex: 1 },
});

export const CardSkeleton: React.FC = () => {
  const styles = useStyles();

  return (
    <Skeleton>
      <div className={styles.card}>
        <div className={styles.header}>
          <SkeletonItem shape="circle" size={48} />
          <div className={styles.text}>
            <SkeletonItem style={{ width: '120px' }} />
            <SkeletonItem style={{ width: '80px' }} />
          </div>
        </div>
        <SkeletonItem style={{ width: '100%', height: '100px' }} />
        <SkeletonItem style={{ width: '60%' }} />
      </div>
    </Skeleton>
  );
};
```

---

## Conditional Loading

```typescript
import * as React from 'react';
import { Skeleton, SkeletonItem, Text } from '@fluentui/react-components';

interface Props {
  data: string | null;
  isLoading: boolean;
}

export const DataDisplay: React.FC<Props> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Skeleton>
        <SkeletonItem style={{ width: '200px' }} />
      </Skeleton>
    );
  }
  return <Text>{data}</Text>;
};
```

---

## Accessibility

- Skeletons have `aria-busy="true"` applied
- Use `aria-label` to describe what's loading

```typescript
<Skeleton aria-label="Loading user profile">
  <SkeletonItem />
</Skeleton>
```

---

## Best Practices

### ✅ Do's

```typescript
// Match skeleton to actual content structure
<Skeleton>
  <SkeletonItem shape="circle" size={48} />  {/* Avatar */}
  <SkeletonItem style={{ width: '150px' }} />  {/* Name */}
</Skeleton>
```

### ❌ Don'ts

```typescript
// Generic skeleton that doesn't match content
<Skeleton>
  <SkeletonItem />
</Skeleton>
```

---

## See Also

- [Spinner](../feedback/spinner.md) - Loading spinner
- [ProgressBar](../feedback/progressbar.md) - Progress indicator
- [Component Index](../00-component-index.md)