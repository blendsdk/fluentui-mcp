# Stagger (Group Choreography)

> **Package**: `@fluentui/react-motion-components-preview`
> **Import**: `import { Stagger } from '@fluentui/react-motion-components-preview'`
> **Parent**: [Motion Index](00-motion-index.md)

## Overview

`Stagger` orchestrates **sequential animations** across a group of children. Items animate one after another with a configurable delay between each, creating a cascading "stagger" effect. This is commonly used for list entrances, card grids, and menu items.

Stagger supports:
- Bidirectional animation (enter and exit) via `visible` prop
- One-way animation via `Stagger.In` and `Stagger.Out` sub-components
- Auto-detection of optimal animation modes based on children types
- Reversed stagger order (last item animates first)

---

## Basic Usage

### With Presence Components (Recommended)

```typescript
import * as React from 'react';
import { Stagger, Fade, Scale } from '@fluentui/react-motion-components-preview';
import { Button, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  item: {
    padding: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusMedium,
  },
});

export const StaggerExample: React.FC = () => {
  const styles = useStyles();
  const [visible, setVisible] = React.useState(false);

  return (
    <div>
      <Button onClick={() => setVisible((v) => !v)}>Toggle List</Button>

      {/* Auto-detects optimal modes for presence components */}
      <Stagger visible={visible} itemDelay={100}>
        <Fade><div className={styles.item}>Item 1</div></Fade>
        <Fade><div className={styles.item}>Item 2</div></Fade>
        <Fade><div className={styles.item}>Item 3</div></Fade>
        <Fade><div className={styles.item}>Item 4</div></Fade>
      </Stagger>
    </div>
  );
};
```

### With DOM Elements

```typescript
// Auto-detects timing mode for plain DOM elements
<Stagger visible={visible} itemDelay={150}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Stagger>
```

---

## Stagger.In and Stagger.Out

One-way stagger animations that don't toggle — they only animate entrance or exit:

```typescript
import { Stagger, Scale, Fade } from '@fluentui/react-motion-components-preview';

// Stagger.In — entrance animation only
<Stagger.In itemDelay={100}>
  <Scale.In><div>Item 1</div></Scale.In>
  <Fade.In><div>Item 2</div></Fade.In>
  <Scale.In><div>Item 3</div></Scale.In>
</Stagger.In>

// Stagger.Out — exit animation only
<Stagger.Out itemDelay={80}>
  <Fade.Out><div>Item 1</div></Fade.Out>
  <Fade.Out><div>Item 2</div></Fade.Out>
</Stagger.Out>
```

---

## StaggerProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | `false` | Controls enter (`true`) or exit (`false`) direction |
| `children` | `React.ReactNode` | - | Elements to stagger |
| `itemDelay` | `number` | `50` | Milliseconds between each item's animation start |
| `itemDuration` | `number` | `200` | Duration of each item's animation (only used with `delayMode="timing"`) |
| `reversed` | `boolean` | `false` | Reverse stagger order (last item animates first) |
| `hideMode` | `HideMode` | Auto-detected | How hidden children are managed |
| `delayMode` | `DelayMode` | Auto-detected | How stagger timing is implemented |
| `onMotionFinish` | `() => void` | - | Called when the full stagger sequence completes |

> **Note**: `Stagger.In` and `Stagger.Out` don't have a `visible` prop — direction is fixed.

---

## Hide Modes

Controls how children are hidden/shown during stagger:

| Mode | Description | When Used |
|------|-------------|-----------|
| `'visibleProp'` | Sets `visible` prop on presence components | Auto-detected for presence children (Fade, Scale, etc.) |
| `'visibilityStyle'` | Sets `visibility: hidden/visible` CSS | Auto-detected for DOM elements |
| `'unmount'` | Mounts/unmounts children from DOM | Must be explicitly set |

```typescript
// Explicit hide mode
<Stagger visible={visible} hideMode="unmount" itemDelay={100}>
  <div>Item 1</div>
  <div>Item 2</div>
</Stagger>
```

---

## Delay Modes

Controls how stagger timing is implemented:

| Mode | Description | Performance | When Used |
|------|-------------|-------------|-----------|
| `'delayProp'` | Passes `delay`/`exitDelay` props to motion components | ⚡ Best | Auto-detected for motion components with delay support |
| `'timing'` | Uses JavaScript timing to show/hide items sequentially | Good | Auto-detected for DOM elements without delay support |

```typescript
// Explicit delay mode
<Stagger visible={visible} delayMode="timing" itemDelay={100}>
  <div>Item 1</div>
  <div>Item 2</div>
</Stagger>
```

---

## Auto-Detection Behavior

Stagger automatically detects the best modes based on children:

| Children Type | hideMode | delayMode |
|---------------|----------|-----------|
| Presence components (Fade, Scale, etc.) | `visibleProp` | `delayProp` ⚡ |
| Motion components (Fade.In, Scale.Out, etc.) | `visibilityStyle` | `delayProp` ⚡ |
| DOM elements (`<div>`, `<span>`, etc.) | `visibilityStyle` | `timing` |

```typescript
// These all auto-detect optimally — no manual mode setting needed:

// Presence children → visibleProp + delayProp
<Stagger visible={visible} itemDelay={100}>
  <Fade><div>Item</div></Fade>
  <Scale><div>Item</div></Scale>
</Stagger>

// DOM children → visibilityStyle + timing
<Stagger visible={visible} itemDelay={100}>
  <div>Item</div>
  <div>Item</div>
</Stagger>
```

---

## Reversed Stagger

Reverse the animation order so the last item animates first:

```typescript
// Forward: Item 1 → Item 2 → Item 3
<Stagger visible={visible} itemDelay={100}>
  <Fade><div>Item 1</div></Fade>
  <Fade><div>Item 2</div></Fade>
  <Fade><div>Item 3</div></Fade>
</Stagger>

// Reversed: Item 3 → Item 2 → Item 1
<Stagger visible={visible} itemDelay={100} reversed>
  <Fade><div>Item 1</div></Fade>
  <Fade><div>Item 2</div></Fade>
  <Fade><div>Item 3</div></Fade>
</Stagger>
```

---

## Mixing Motion Types

You can mix different motion components within a stagger:

```typescript
import { Stagger, Fade, Scale, Slide, Rotate } from '@fluentui/react-motion-components-preview';

<Stagger visible={visible} itemDelay={150}>
  <Fade><div>Fades in</div></Fade>
  <Scale><div>Scales in</div></Scale>
  <Slide outX="-50px"><div>Slides in from left</div></Slide>
  <Rotate outAngle={-45}><div>Rotates in</div></Rotate>
</Stagger>
```

---

## Complete Example: Staggered Card Grid

```typescript
import * as React from 'react';
import { Stagger, Scale } from '@fluentui/react-motion-components-preview';
import {
  Button,
  Card,
  CardHeader,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: tokens.spacingHorizontalL,
    padding: tokens.spacingHorizontalL,
  },
});

const items = [
  { title: 'Analytics', description: 'View your data insights' },
  { title: 'Reports', description: 'Generate custom reports' },
  { title: 'Settings', description: 'Configure your workspace' },
  { title: 'Users', description: 'Manage team members' },
  { title: 'Billing', description: 'Subscription and payments' },
  { title: 'Support', description: 'Get help and documentation' },
];

export const StaggeredCardGrid: React.FC = () => {
  const styles = useStyles();
  const [visible, setVisible] = React.useState(false);

  return (
    <div>
      <Button appearance="primary" onClick={() => setVisible((v) => !v)}>
        {visible ? 'Hide Cards' : 'Show Cards'}
      </Button>

      <div className={styles.grid}>
        <Stagger visible={visible} itemDelay={80}>
          {items.map((item) => (
            <Scale key={item.title} outScale={0.8}>
              <Card>
                <CardHeader
                  header={<Text weight="semibold">{item.title}</Text>}
                  description={item.description}
                />
              </Card>
            </Scale>
          ))}
        </Stagger>
      </div>
    </div>
  );
};
```

---

## Best Practices

### ✅ Do's

```typescript
// Use presence components for best performance (auto-detects delayProp mode)
<Stagger visible={visible} itemDelay={100}>
  <Fade><div>Best performance</div></Fade>
</Stagger>

// Keep itemDelay reasonable (50-200ms) for smooth cascading
<Stagger visible={visible} itemDelay={80}> ... </Stagger>

// Use reversed for exit animations (last item exits first feels natural)
<Stagger visible={visible} itemDelay={80} reversed={!visible}>
```

### ❌ Don'ts

```typescript
// Don't use very long itemDelay — makes the animation feel slow
<Stagger visible={visible} itemDelay={500}> // Too slow!

// Don't mix presence and non-presence children (auto-detection may not work well)
<Stagger visible={visible}>
  <Fade><div>Presence</div></Fade>
  <div>DOM element</div>  // Mixed types — inconsistent behavior
</Stagger>

// Don't stagger too many items — users shouldn't wait for 20+ sequential animations
```

---

## See Also

- [Built-in Motions](04-built-in-motions.md) — Fade, Scale, Slide, etc. used inside Stagger
- [Presence Components](03-presence-components.md) — PresenceGroup for list add/remove animations
- [Motion Tokens](01-motion-tokens.md) — Duration values for tuning itemDelay
