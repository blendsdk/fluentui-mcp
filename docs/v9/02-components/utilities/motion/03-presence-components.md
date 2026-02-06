# Presence Components (Enter/Exit Animations)

> **Package**: `@fluentui/react-motion`
> **Import**: `import { createPresenceComponent, PresenceGroup } from '@fluentui/react-motion'`
> **Parent**: [Motion Index](00-motion-index.md)

## Overview

`createPresenceComponent` creates a React component that manages **enter and exit animations** based on a `visible` prop. When `visible` transitions to `true`, the enter animation plays; when `false`, the exit animation plays. Optionally, the child element can be unmounted after exit.

Use presence components for:
- Showing/hiding content with animations (dialogs, tooltips, panels)
- Animated list item additions/removals (with `PresenceGroup`)
- Any UI element that appears and disappears

---

## Creating a Presence Component

### Static Definition (Object)

```typescript
import { createPresenceComponent, motionTokens } from '@fluentui/react-motion';

const FadeInOut = createPresenceComponent({
  enter: {
    keyframes: [{ opacity: 0 }, { opacity: 1 }],
    duration: motionTokens.durationNormal,
    easing: motionTokens.curveEasyEase,
  },
  exit: {
    keyframes: [{ opacity: 1 }, { opacity: 0 }],
    duration: motionTokens.durationNormal,
    easing: motionTokens.curveEasyEase,
  },
});
```

### Dynamic Definition (Function)

Use a function when the animation depends on the element or runtime parameters:

```typescript
import { createPresenceComponent, motionTokens } from '@fluentui/react-motion';

const SlideFromEdge = createPresenceComponent<{ fromLeft?: boolean }>(
  ({ element, fromLeft = true }) => {
    const translateX = fromLeft ? '-100%' : '100%';
    return {
      enter: {
        keyframes: [
          { transform: `translateX(${translateX})`, opacity: 0 },
          { transform: 'translateX(0)', opacity: 1 },
        ],
        duration: motionTokens.durationGentle,
        easing: motionTokens.curveDecelerateMid,
      },
      exit: {
        keyframes: [
          { transform: 'translateX(0)', opacity: 1 },
          { transform: `translateX(${translateX})`, opacity: 0 },
        ],
        duration: motionTokens.durationNormal,
        easing: motionTokens.curveAccelerateMid,
      },
    };
  },
);

// Usage
<SlideFromEdge visible={isOpen} fromLeft={true}>
  <div>Slides from the left</div>
</SlideFromEdge>
```

---

## PresenceComponentProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | - | Controls whether the enter or exit animation plays |
| `appear` | `boolean` | `false` | If `true`, plays enter animation on initial mount |
| `unmountOnExit` | `boolean` | `false` | Unmount the child after exit animation completes |
| `children` | `JSXElement` | - | Single React element to animate |
| `imperativeRef` | `React.Ref<MotionImperativeRef>` | - | Imperative control handle |
| `onMotionStart` | `(ev, data) => void` | - | Called when animation starts. `data.direction` is `'enter'` or `'exit'` |
| `onMotionFinish` | `(ev, data) => void` | - | Called when animation finishes. `data.direction` is `'enter'` or `'exit'` |
| `onMotionCancel` | `(ev, data) => void` | - | Called when animation is cancelled |

---

## Basic Usage

```typescript
import * as React from 'react';
import { createPresenceComponent, motionTokens } from '@fluentui/react-motion';
import { Button, makeStyles, tokens } from '@fluentui/react-components';

const FadeIn = createPresenceComponent({
  enter: {
    keyframes: [{ opacity: 0 }, { opacity: 1 }],
    duration: motionTokens.durationNormal,
    easing: motionTokens.curveEasyEase,
  },
  exit: {
    keyframes: [{ opacity: 1 }, { opacity: 0 }],
    duration: motionTokens.durationNormal,
    easing: motionTokens.curveEasyEase,
  },
});

const useStyles = makeStyles({
  box: {
    padding: tokens.spacingHorizontalL,
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },
});

export const PresenceExample: React.FC = () => {
  const styles = useStyles();
  const [visible, setVisible] = React.useState(false);

  return (
    <div>
      <Button onClick={() => setVisible((v) => !v)}>Toggle</Button>
      <FadeIn visible={visible}>
        <div className={styles.box}>Animated content</div>
      </FadeIn>
    </div>
  );
};
```

---

## Appear on Mount

By default, no enter animation plays on initial mount. Set `appear={true}` to animate on first render:

```typescript
// Animate on first render
<FadeIn visible={true} appear={true}>
  <div>Appears with animation on mount</div>
</FadeIn>

// No animation on first render (default)
<FadeIn visible={true}>
  <div>Visible immediately on mount, no animation</div>
</FadeIn>
```

---

## Unmount on Exit

By default, the child remains mounted (but invisible) after exit. Use `unmountOnExit` to remove it from the DOM:

```typescript
// Child stays in DOM after exit (default)
<FadeIn visible={visible}>
  <div>Still in DOM when hidden</div>
</FadeIn>

// Child is unmounted after exit animation
<FadeIn visible={visible} unmountOnExit>
  <div>Removed from DOM after fade out</div>
</FadeIn>
```

---

## Motion Lifecycle Callbacks

```typescript
<FadeIn
  visible={visible}
  onMotionStart={(ev, { direction }) => {
    console.log(`Animation ${direction} started`); // 'enter' or 'exit'
  }}
  onMotionFinish={(ev, { direction }) => {
    console.log(`Animation ${direction} finished`);
    if (direction === 'exit') {
      // Clean up after exit animation
    }
  }}
  onMotionCancel={(ev, { direction }) => {
    console.log(`Animation ${direction} cancelled`);
  }}
>
  <div>Content with lifecycle tracking</div>
</FadeIn>
```

---

## Static `.In` and `.Out` Sub-Components

Every presence component automatically gets `.In` and `.Out` static methods that provide one-shot motion components for only the enter or exit direction:

```typescript
import { Fade } from '@fluentui/react-motion-components-preview';

// Fade.In — only plays the enter (fade-in) animation, once on mount
<Fade.In>
  <div>Fades in on mount</div>
</Fade.In>

// Fade.Out — only plays the exit (fade-out) animation, once on mount
<Fade.Out>
  <div>Fades out on mount</div>
</Fade.Out>
```

---

## Multiple Animation Atoms

Return arrays for enter/exit to run multiple animations in parallel:

```typescript
const ScaleAndFade = createPresenceComponent({
  enter: [
    {
      keyframes: [{ transform: 'scale(0.8)' }, { transform: 'scale(1)' }],
      duration: motionTokens.durationGentle,
      easing: motionTokens.curveDecelerateMax,
    },
    {
      keyframes: [{ opacity: 0 }, { opacity: 1 }],
      duration: motionTokens.durationNormal,
      easing: motionTokens.curveEasyEase,
    },
  ],
  exit: [
    {
      keyframes: [{ transform: 'scale(1)' }, { transform: 'scale(0.8)' }],
      duration: motionTokens.durationNormal,
      easing: motionTokens.curveAccelerateMax,
    },
    {
      keyframes: [{ opacity: 1 }, { opacity: 0 }],
      duration: motionTokens.durationNormal,
      easing: motionTokens.curveEasyEase,
    },
  ],
});
```

---

## PresenceGroup

`PresenceGroup` manages animated additions and removals from a **list of items**. It automatically sets `visible` and `unmountOnExit` on child presence components.

```typescript
import * as React from 'react';
import { PresenceGroup } from '@fluentui/react-motion';
import { Fade } from '@fluentui/react-motion-components-preview';
import { Button, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  item: {
    padding: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusMedium,
  },
});

export const AnimatedList: React.FC = () => {
  const styles = useStyles();
  const [items, setItems] = React.useState<string[]>(['Item 1', 'Item 2']);

  const addItem = () => {
    setItems((prev) => [...prev, `Item ${prev.length + 1}`]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <Button onClick={addItem}>Add Item</Button>

      <PresenceGroup>
        {items.map((item, index) => (
          <Fade key={item} unmountOnExit>
            <div className={styles.item}>
              {item}
              <Button
                appearance="subtle"
                size="small"
                onClick={() => removeItem(index)}
              >
                Remove
              </Button>
            </div>
          </Fade>
        ))}
      </PresenceGroup>
    </div>
  );
};
```

### PresenceGroup Behavior

- Wraps a list of presence components (e.g., `Fade`, `Scale`)
- Automatically manages `visible` prop based on list changes
- Items entering the list get `visible={true}` with `appear={true}`
- Items leaving the list get `visible={false}` and are unmounted after exit

---

## MotionBehaviourProvider

Use `MotionBehaviourProvider` to globally skip animations (useful for testing or accessibility):

```typescript
import { MotionBehaviourProvider } from '@fluentui/react-motion';

// Skip all motion animations in this subtree
<MotionBehaviourProvider value="skip">
  <App />
</MotionBehaviourProvider>
```

---

## Best Practices

### ✅ Do's

```typescript
// Use unmountOnExit for content that should not be in the DOM when hidden
<FadeIn visible={visible} unmountOnExit>
  <ExpensiveComponent />
</FadeIn>

// Use appear for initial page load animations
<FadeIn visible={true} appear>
  <HeroSection />
</FadeIn>

// Use different curves for enter vs exit
createPresenceComponent({
  enter: { easing: motionTokens.curveDecelerateMid, ... },
  exit: { easing: motionTokens.curveAccelerateMid, ... },
});
```

### ❌ Don'ts

```typescript
// Don't forget to set a key when using PresenceGroup
// <PresenceGroup>{items.map(item => <Fade>...</Fade>)}</PresenceGroup> // Missing key!

// Don't use createPresenceComponent for one-shot animations
// Use createMotionComponent instead

// Don't set both appear={false} and visible={true} and expect animation on mount
```

---

## See Also

- [Motion Components](02-motion-components.md) — One-shot animations
- [Built-in Motions](04-built-in-motions.md) — Pre-built Fade, Scale, Slide, etc.
- [Motion Slots](05-motion-slots.md) — Integrating with FluentUI component slots
- [Stagger](06-stagger.md) — Staggered group animations
