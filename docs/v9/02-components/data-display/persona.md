# Persona

> **Package**: `@fluentui/react-persona`
> **Import**: `import { Persona } from '@fluentui/react-components'`
> **Category**: Data Display

## Overview

Persona displays a user's avatar along with their name and optional secondary text like title or status.

---

## Basic Usage

```typescript
import * as React from 'react';
import { Persona } from '@fluentui/react-components';

export const BasicPersona: React.FC = () => (
  <Persona
    name="John Doe"
    secondaryText="Software Engineer"
  />
);
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | - | Person's name |
| `secondaryText` | `string` | - | Secondary info (title, status) |
| `tertiaryText` | `string` | - | Tertiary info |
| `quaternaryText` | `string` | - | Fourth line of text |
| `presence` | `PresenceBadgeStatus` | - | Presence indicator |
| `size` | `'extra-small' \| 'small' \| 'medium' \| 'large' \| 'extra-large' \| 'huge'` | `'medium'` | Size |
| `textPosition` | `'before' \| 'after' \| 'below'` | `'after'` | Text position |
| `textAlignment` | `'start' \| 'center'` | `'start'` | Text alignment |
| `avatar` | `AvatarProps` | - | Avatar configuration |

---

## Size Variants

```typescript
<Persona size="extra-small" name="John Doe" secondaryText="Engineer" />
<Persona size="small" name="John Doe" secondaryText="Engineer" />
<Persona size="medium" name="John Doe" secondaryText="Engineer" />
<Persona size="large" name="John Doe" secondaryText="Engineer" />
<Persona size="extra-large" name="John Doe" secondaryText="Engineer" />
<Persona size="huge" name="John Doe" secondaryText="Engineer" />
```

---

## With Presence

```typescript
<Persona name="John" secondaryText="Available" presence={{ status: 'available' }} />
<Persona name="Jane" secondaryText="In a meeting" presence={{ status: 'busy' }} />
<Persona name="Bob" secondaryText="Away" presence={{ status: 'away' }} />
<Persona name="Sue" secondaryText="Offline" presence={{ status: 'offline' }} />
```

---

## Text Position

```typescript
<Persona name="John" textPosition="after" />   // Text after avatar (default)
<Persona name="John" textPosition="before" />  // Text before avatar
<Persona name="John" textPosition="below" textAlignment="center" />  // Text below
```

---

## With Avatar Image

```typescript
<Persona
  name="John Doe"
  secondaryText="Software Engineer"
  avatar={{ image: { src: "https://example.com/photo.jpg" } }}
/>
```

---

## Multiple Text Lines

```typescript
<Persona
  size="extra-large"
  name="John Doe"
  secondaryText="Software Engineer"
  tertiaryText="Engineering Team"
  quaternaryText="Building 1, Office 101"
/>
```

---

## Accessibility

- Name is automatically used for avatar's `aria-label`
- Presence status is announced to screen readers

---

## Best Practices

### ✅ Do's

```typescript
<Persona name="John Doe" secondaryText="Software Engineer" />
<Persona name="John" presence={{ status: 'available' }} />
```

### ❌ Don'ts

```typescript
<Persona />  // Missing name
```

---

## See Also

- [Avatar](avatar.md) - Standalone avatar
- [Badge](badge.md) - Status badges
- [Component Index](../00-component-index.md)