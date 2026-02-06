# Badge

> **Package**: `@fluentui/react-badge`
> **Import**: `import { Badge, CounterBadge, PresenceBadge } from '@fluentui/react-components'`
> **Category**: Data Display

## Overview

Badge displays status, notifications, or short information. Three variants:
- **Badge** - General purpose
- **CounterBadge** - Numeric counter
- **PresenceBadge** - User presence status

---

## Basic Usage

```typescript
import * as React from 'react';
import { Badge, CounterBadge, PresenceBadge } from '@fluentui/react-components';

export const BasicBadges: React.FC = () => (
  <>
    <Badge>Default</Badge>
    <CounterBadge count={5} />
    <PresenceBadge status="available" />
  </>
);
```

---

## Badge Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `appearance` | `'filled' \| 'ghost' \| 'outline' \| 'tint'` | `'filled'` | Visual style |
| `color` | `'brand' \| 'danger' \| 'important' \| 'informative' \| 'severe' \| 'subtle' \| 'success' \| 'warning'` | `'brand'` | Color |
| `size` | `'tiny' \| 'extra-small' \| 'small' \| 'medium' \| 'large' \| 'extra-large'` | `'medium'` | Size |
| `shape` | `'circular' \| 'rounded' \| 'square'` | `'circular'` | Shape |

---

## Color Variants

```typescript
<Badge color="brand">Brand</Badge>
<Badge color="success">Success</Badge>
<Badge color="warning">Warning</Badge>
<Badge color="danger">Danger</Badge>
<Badge color="severe">Severe</Badge>
<Badge color="important">Important</Badge>
<Badge color="informative">Informative</Badge>
<Badge color="subtle">Subtle</Badge>
```

---

## CounterBadge

```typescript
<CounterBadge count={5} />
<CounterBadge count={150} overflowCount={99} />  {/* Shows 99+ */}
<CounterBadge count={0} showZero />
<CounterBadge dot />  {/* Dot indicator */}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | `0` | Number to display |
| `overflowCount` | `number` | `99` | Max before showing + |
| `showZero` | `boolean` | `false` | Show when count is 0 |
| `dot` | `boolean` | `false` | Show as dot only |

---

## PresenceBadge

```typescript
<PresenceBadge status="available" />
<PresenceBadge status="busy" />
<PresenceBadge status="do-not-disturb" />
<PresenceBadge status="away" />
<PresenceBadge status="offline" />
<PresenceBadge status="out-of-office" />
```

---

## See Also

- [Avatar](avatar.md) - User avatars with badges
- [Tag](tag.md) - Interactive tags
- [Component Index](../00-component-index.md)