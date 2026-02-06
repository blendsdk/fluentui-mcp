# Popover

> **Package**: `@fluentui/react-popover`
> **Import**: `import { Popover, PopoverTrigger, PopoverSurface } from '@fluentui/react-components'`
> **Category**: Overlays

## Overview

Popover displays content in a floating layer anchored to a trigger element. Use for contextual information, forms, or interactive content.

---

## Basic Usage

```typescript
import * as React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverSurface,
  Button,
} from '@fluentui/react-components';

export const BasicPopover: React.FC = () => (
  <Popover>
    <PopoverTrigger>
      <Button>Show Popover</Button>
    </PopoverTrigger>
    <PopoverSurface>
      This is the popover content.
    </PopoverSurface>
  </Popover>
);
```

---

## Component Structure

| Component | Purpose |
|-----------|---------|
| `Popover` | Root component, manages state |
| `PopoverTrigger` | Wraps element that opens popover |
| `PopoverSurface` | The floating content container |

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state |
| `onOpenChange` | `(ev, data) => void` | - | Open state change handler |
| `positioning` | `PositioningShorthand` | `'above'` | Position relative to trigger |
| `trapFocus` | `boolean` | `false` | Trap focus within popover |
| `withArrow` | `boolean` | `false` | Show arrow pointing to trigger |
| `openOnHover` | `boolean` | `false` | Open on mouse hover |
| `closeOnScroll` | `boolean` | `false` | Close when scrolling |

---

## Positioning

```typescript
<Popover positioning="above">...</Popover>
<Popover positioning="below">...</Popover>
<Popover positioning="before">...</Popover>
<Popover positioning="after">...</Popover>
<Popover positioning="above-start">...</Popover>
<Popover positioning="above-end">...</Popover>
```

---

## With Arrow

```typescript
<Popover withArrow>
  <PopoverTrigger>
    <Button>With Arrow</Button>
  </PopoverTrigger>
  <PopoverSurface>
    Content with arrow pointing to trigger.
  </PopoverSurface>
</Popover>
```

---

## Controlled State

```typescript
import * as React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverSurface,
  Button,
} from '@fluentui/react-components';

export const ControlledPopover: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={(_, data) => setOpen(data.open)}>
      <PopoverTrigger>
        <Button>Toggle Popover</Button>
      </PopoverTrigger>
      <PopoverSurface>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </PopoverSurface>
    </Popover>
  );
};
```

---

## Best Practices

### ✅ Do's

```typescript
// Use for contextual info
<Popover>
  <PopoverTrigger><Button icon={<Info />} /></PopoverTrigger>
  <PopoverSurface>Help text here</PopoverSurface>
</Popover>

// Use trapFocus for interactive content
<Popover trapFocus>...</Popover>
```

### ❌ Don'ts

```typescript
// Don't use for simple tooltips (use Tooltip)
// Don't use for blocking interactions (use Dialog)
```

---

## See Also

- [Tooltip](../feedback/tooltip.md) - Simple hover info
- [Dialog](../feedback/dialog.md) - Modal content
- [Component Index](../00-component-index.md)