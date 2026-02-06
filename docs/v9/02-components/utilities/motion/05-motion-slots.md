# Motion Slots

> **Package**: `@fluentui/react-motion`
> **Import**: `import { presenceMotionSlot } from '@fluentui/react-motion'`
> **Parent**: [Motion Index](00-motion-index.md)

## Overview

`presenceMotionSlot` integrates presence animations into the FluentUI **slot system**. This enables FluentUI components to expose motion as a customizable slot — allowing consumers to override, disable, or replace the animation behavior of a component.

Motion slots are used internally by FluentUI components (e.g., Dialog, Drawer) and can be used in custom components that follow the FluentUI slot architecture.

---

## How Motion Slots Work

A motion slot bridges the gap between FluentUI's slot system and presence components:

1. A **component author** defines a motion slot in their component
2. A **component consumer** can customize or disable the motion via slot props
3. The motion slot automatically receives `visible`, `appear`, `unmountOnExit` from the component

---

## Using Motion Slots in Custom Components

### Component Author: Defining a Motion Slot

```typescript
import * as React from 'react';
import { presenceMotionSlot, type PresenceMotionSlotProps } from '@fluentui/react-motion';
import { Fade } from '@fluentui/react-motion-components-preview';
import type { PresenceComponentProps } from '@fluentui/react-motion';

// Define component props with a motion slot
type PanelProps = {
  open: boolean;
  children: React.ReactNode;
  /** Customize the panel's entrance/exit animation */
  motion?: PresenceMotionSlotProps;
};

export const Panel: React.FC<PanelProps> = ({ open, children, motion }) => {
  // Create the motion slot with defaults
  const motionSlot = presenceMotionSlot(motion, {
    elementType: Fade, // Default animation component
    defaultProps: {
      visible: open,
      unmountOnExit: true,
      appear: true,
    },
  });

  // Render using the slot — it wraps children with the presence animation
  return (
    <motionSlot.elementType {...motionSlot}>
      <div className="panel-content">{children}</div>
    </motionSlot.elementType>
  );
};
```

### Component Consumer: Customizing Animation

```typescript
import { Scale } from '@fluentui/react-motion-components-preview';

// Use default animation (Fade)
<Panel open={isOpen}>
  <p>Default fade animation</p>
</Panel>

// Override animation callbacks
<Panel
  open={isOpen}
  motion={{
    onMotionStart: () => console.log('Panel opening'),
    onMotionFinish: () => console.log('Panel opened'),
  }}
>
  <p>Fade with callbacks</p>
</Panel>

// Disable animation entirely by passing null
<Panel open={isOpen} motion={null}>
  <p>No animation, instant show/hide</p>
</Panel>
```

---

## Disabling Motion with `null`

Passing `null` to a motion slot disables all animation. The content appears/disappears instantly, and `unmountOnExit` is still respected:

```typescript
// No animation — content immediately appears/disappears
<Panel open={isOpen} motion={null}>
  <p>Instant visibility toggle</p>
</Panel>
```

---

## Motion Slot with Custom Render Function

Use a render function to fully control how the motion wraps children:

```typescript
<Panel
  open={isOpen}
  motion={{
    children: (Component, props) => (
      <Component {...props}>
        {/* Customize what gets animated */}
        <div style={{ willChange: 'transform' }}>
          {props.children}
        </div>
      </Component>
    ),
  }}
>
  <p>Custom render</p>
</Panel>
```

---

## PresenceMotionSlotProps

| Prop | Type | Description |
|------|------|-------------|
| `imperativeRef` | `React.Ref<MotionImperativeRef>` | Imperative control over the animation |
| `onMotionStart` | `(ev, data) => void` | Called when animation starts |
| `onMotionFinish` | `(ev, data) => void` | Called when animation finishes |
| `children` | `SlotRenderFunction` | Optional render function for full control |

> **Note**: `visible`, `appear`, `unmountOnExit` are set by the component author via `defaultProps` and should not be overridden by consumers.

---

## Real-World Example: Animated Popover

```typescript
import * as React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverSurface,
  Button,
} from '@fluentui/react-components';
import { Scale } from '@fluentui/react-motion-components-preview';

export const AnimatedPopover: React.FC = () => (
  <Popover>
    <PopoverTrigger>
      <Button>Open Popover</Button>
    </PopoverTrigger>
    <PopoverSurface>
      <Scale visible appear unmountOnExit>
        <div>Popover content with scale animation</div>
      </Scale>
    </PopoverSurface>
  </Popover>
);
```

---

## Best Practices

### ✅ Do's

```typescript
// Provide a sensible default animation in your component
presenceMotionSlot(motion, {
  elementType: Fade,
  defaultProps: { visible: open, unmountOnExit: true },
});

// Allow consumers to pass null to disable animation
type MyComponentProps = {
  motion?: PresenceMotionSlotProps | null;
};

// Always set appear: true if you want initial mount animation
presenceMotionSlot(motion, {
  defaultProps: { visible: open, appear: true, unmountOnExit: true },
});
```

### ❌ Don'ts

```typescript
// Don't use `as` prop on motion slots — it's not supported
<Panel motion={{ as: "div" }} /> // ERROR: "as" is not supported on motion slots

// Don't override visible/unmountOnExit from consumer side
// These should be controlled by the component author
```

---

## See Also

- [Presence Components](03-presence-components.md) — Creating presence components used in slots
- [Built-in Motions](04-built-in-motions.md) — Pre-built motions usable as slot defaults
- [Component Architecture](../../../01-foundation/05-component-architecture.md) — FluentUI slot system
