# Drawer

> **Package**: `@fluentui/react-drawer`
> **Import**: `import { Drawer, DrawerBody, DrawerHeader, DrawerHeaderTitle } from '@fluentui/react-components'`
> **Category**: Overlays

## Overview

Drawer displays content in a panel that slides in from the edge of the screen. Use for navigation, settings, or detail panels.

---

## Basic Usage

```typescript
import * as React from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  Button,
} from '@fluentui/react-components';

export const BasicDrawer: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer open={open} onOpenChange={(_, { open }) => setOpen(open)}>
        <DrawerHeader>
          <DrawerHeaderTitle>Drawer Title</DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>
          Drawer content goes here.
        </DrawerBody>
      </Drawer>
    </>
  );
};
```

---

## Component Structure

| Component | Purpose |
|-----------|---------|
| `Drawer` / `OverlayDrawer` | Root overlay component |
| `InlineDrawer` | Non-overlay inline panel |
| `DrawerHeader` | Header container |
| `DrawerHeaderTitle` | Title with optional close action |
| `DrawerBody` | Main content area |
| `DrawerFooter` | Footer with actions |

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Open state |
| `onOpenChange` | `(ev, data) => void` | - | Open change handler |
| `position` | `'start' \| 'end' \| 'bottom'` | `'start'` | Slide-in direction |
| `size` | `'small' \| 'medium' \| 'large' \| 'full'` | `'small'` | Drawer width |

---

## Position Variants

```typescript
<Drawer position="start">...</Drawer>   // Left side (LTR)
<Drawer position="end">...</Drawer>     // Right side (LTR)
<Drawer position="bottom">...</Drawer>  // Bottom sheet
```

---

## Size Variants

| Size | Width |
|------|-------|
| `small` | 320px |
| `medium` | 592px |
| `large` | 940px |
| `full` | 100% |

---

## InlineDrawer

Non-modal drawer that pushes content:

```typescript
import * as React from 'react';
import { InlineDrawer, DrawerBody, makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: { display: 'flex', height: '400px' },
});

export const InlineExample: React.FC = () => {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      <InlineDrawer open>
        <DrawerBody>Sidebar</DrawerBody>
      </InlineDrawer>
      <div>Main content</div>
    </div>
  );
};
```

---

## With Close Button

```typescript
<DrawerHeader>
  <DrawerHeaderTitle
    action={
      <Button
        appearance="subtle"
        icon={<Dismiss24Regular />}
        onClick={() => setOpen(false)}
      />
    }
  >
    Title
  </DrawerHeaderTitle>
</DrawerHeader>
```

---

## Accessibility

- Focus trapped in overlay drawer
- Escape key closes drawer
- Background has `aria-hidden` when open

---

## See Also

- [Dialog](../feedback/dialog.md) - Modal dialogs
- [Popover](popover.md) - Anchored overlays
- [Component Index](../00-component-index.md)