# Avatar

> **Package**: `@fluentui/react-avatar`
> **Import**: `import { Avatar, AvatarGroup } from '@fluentui/react-components'`
> **Category**: Data Display

## Overview

Avatar displays a user's image, initials, or icon. AvatarGroup displays multiple avatars in a compact layout.

---

## Basic Usage

```typescript
import * as React from 'react';
import { Avatar } from '@fluentui/react-components';

export const BasicAvatar: React.FC = () => (
  <Avatar name="John Doe" />
);
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | - | Name used for initials and aria-label |
| `image` | `Slot<'img'>` | - | Image element |
| `icon` | `Slot<'span'>` | - | Icon when no image/name |
| `initials` | `string` | - | Custom initials (overrides name) |
| `size` | `16-128` | `32` | Size in pixels |
| `shape` | `'circular' \| 'square'` | `'circular'` | Shape |
| `color` | `'neutral' \| 'brand' \| 'colorful' \| ColorName` | `'neutral'` | Background color |
| `active` | `'active' \| 'inactive' \| 'unset'` | `'unset'` | Active state indicator |
| `badge` | `Slot<typeof PresenceBadge>` | - | Badge overlay |

---

## Size Variants

```typescript
import * as React from 'react';
import { Avatar, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: { display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalM },
});

export const AvatarSizes: React.FC = () => {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      <Avatar name="John" size={16} />
      <Avatar name="John" size={24} />
      <Avatar name="John" size={32} />
      <Avatar name="John" size={48} />
      <Avatar name="John" size={64} />
      <Avatar name="John" size={96} />
      <Avatar name="John" size={128} />
    </div>
  );
};
```

---

## With Image

```typescript
import * as React from 'react';
import { Avatar } from '@fluentui/react-components';

export const AvatarWithImage: React.FC = () => (
  <Avatar
    name="John Doe"
    image={{ src: "https://example.com/avatar.jpg" }}
  />
);
```

---

## With Badge

```typescript
import * as React from 'react';
import { Avatar } from '@fluentui/react-components';

export const AvatarWithBadge: React.FC = () => (
  <>
    <Avatar name="John" badge={{ status: 'available' }} />
    <Avatar name="Jane" badge={{ status: 'busy' }} />
    <Avatar name="Bob" badge={{ status: 'away' }} />
    <Avatar name="Sue" badge={{ status: 'offline' }} />
  </>
);
```

---

## Color Variants

```typescript
import * as React from 'react';
import { Avatar, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: { display: 'flex', gap: tokens.spacingHorizontalS },
});

export const AvatarColors: React.FC = () => {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      <Avatar name="Neutral" color="neutral" />
      <Avatar name="Brand" color="brand" />
      <Avatar name="Colorful" color="colorful" />
      <Avatar name="Dark Red" color="dark-red" />
      <Avatar name="Cranberry" color="cranberry" />
      <Avatar name="Pumpkin" color="pumpkin" />
    </div>
  );
};
```

---

## AvatarGroup

```typescript
import * as React from 'react';
import {
  Avatar,
  AvatarGroup,
  AvatarGroupItem,
  AvatarGroupPopover,
} from '@fluentui/react-components';

const users = [
  { name: 'John Doe' },
  { name: 'Jane Smith' },
  { name: 'Bob Johnson' },
  { name: 'Alice Brown' },
  { name: 'Charlie Wilson' },
];

export const BasicAvatarGroup: React.FC = () => (
  <AvatarGroup>
    {users.map(user => (
      <AvatarGroupItem key={user.name} name={user.name} />
    ))}
    <AvatarGroupPopover>
      {users.map(user => (
        <AvatarGroupItem key={user.name} name={user.name} />
      ))}
    </AvatarGroupPopover>
  </AvatarGroup>
);
```

---

## Accessibility

- Automatically generates `aria-label` from `name` prop
- Use `aria-label` for icon-only avatars
- Badge states are announced to screen readers

---

## Best Practices

### ✅ Do's

```typescript
<Avatar name="John Doe" />  // Generates initials "JD"
<Avatar name="John" image={{ src: "/photo.jpg" }} />  // Fallback to initials
<Avatar badge={{ status: 'available' }} name="John" />  // Status indicator
```

### ❌ Don'ts

```typescript
<Avatar />  // Missing name or aria-label
<Avatar initials="JD" />  // Missing name for accessibility
```

---

## See Also

- [Badge](badge.md) - Status badges
- [Persona](persona.md) - User card with avatar
- [Component Index](../00-component-index.md)