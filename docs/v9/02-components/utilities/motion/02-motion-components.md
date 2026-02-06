# Motion Components (One-Shot Animations)

> **Package**: `@fluentui/react-motion`
> **Import**: `import { createMotionComponent } from '@fluentui/react-motion'`
> **Parent**: [Motion Index](00-motion-index.md)

## Overview

`createMotionComponent` creates a React component that applies a **one-shot animation** to its child element when mounted. Unlike presence components, motion components do not manage enter/exit visibility — they simply animate once on mount.

Use motion components for:
- Entrance animations that play once
- Attention-grabbing effects (pulse, shake)
- Decorative animations on mount

---

## Creating a Motion Component

### Static Definition (Object)

```typescript
import { createMotionComponent, motionTokens } from '@fluentui/react-motion';

// Define a simple slide-down animation
const SlideDown = createMotionComponent({
  keyframes: [
    { transform: 'translateY(-20px)', opacity: 0 },
    { transform: 'translateY(0)', opacity: 1 },
  ],
  duration: motionTokens.durationNormal,
  easing: motionTokens.curveDecelerateMid,
});
```

### Dynamic Definition (Function)

Use a function when the animation depends on the element or runtime parameters:

```typescript
import { createMotionComponent, motionTokens } from '@fluentui/react-motion';

// Dynamic animation that adapts to element dimensions
const GrowFromCenter = createMotionComponent(({ element }) => {
  const { offsetWidth } = element;
  const distance = Math.min(offsetWidth, 200);

  return {
    keyframes: [
      { transform: `scale(0)`, opacity: 0 },
      { transform: `scale(1)`, opacity: 1 },
    ],
    duration: motionTokens.durationGentle,
    easing: motionTokens.curveDecelerateMax,
  };
});
```

### With Custom Parameters

```typescript
import {
  createMotionComponent,
  motionTokens,
  type AtomMotionFn,
} from '@fluentui/react-motion';

// Define a parameterized motion
const Bounce = createMotionComponent<{ intensity?: number }>(
  ({ intensity = 1 }) => ({
    keyframes: [
      { transform: 'translateY(0)' },
      { transform: `translateY(${-10 * intensity}px)` },
      { transform: 'translateY(0)' },
      { transform: `translateY(${-5 * intensity}px)` },
      { transform: 'translateY(0)' },
    ],
    duration: motionTokens.durationSlower,
    easing: motionTokens.curveEasyEase,
  }),
);

// Usage with custom parameter
<Bounce intensity={2}>
  <div>Bouncing content</div>
</Bounce>
```

---

## Multiple Animation Atoms

Return an array to run multiple animations in parallel:

```typescript
import { createMotionComponent, motionTokens } from '@fluentui/react-motion';

// Combine scale + opacity as parallel atoms
const ScaleIn = createMotionComponent([
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
]);
```

---

## MotionComponentProps

| Prop | Type | Description |
|------|------|-------------|
| `children` | `JSXElement` | Single React element to animate (will be cloned) |
| `imperativeRef` | `React.Ref<MotionImperativeRef>` | Imperative control handle |
| `onMotionStart` | `(ev: null) => void` | Called when the animation starts |
| `onMotionFinish` | `(ev: null) => void` | Called when all animations finish |
| `onMotionCancel` | `(ev: null) => void` | Called when the animation is cancelled |

---

## Imperative Control

Use `imperativeRef` to control playback programmatically:

```typescript
import * as React from 'react';
import { createMotionComponent, motionTokens } from '@fluentui/react-motion';
import type { MotionImperativeRef } from '@fluentui/react-motion';

const Pulse = createMotionComponent({
  keyframes: [
    { transform: 'scale(1)' },
    { transform: 'scale(1.1)' },
    { transform: 'scale(1)' },
  ],
  duration: motionTokens.durationSlower,
  easing: motionTokens.curveEasyEase,
});

export const ControlledMotion: React.FC = () => {
  const motionRef = React.useRef<MotionImperativeRef>();

  return (
    <div>
      <button onClick={() => motionRef.current?.setPlayState('paused')}>
        Pause
      </button>
      <button onClick={() => motionRef.current?.setPlayState('running')}>
        Resume
      </button>
      <button onClick={() => motionRef.current?.setPlaybackRate(2)}>
        2x Speed
      </button>

      <Pulse imperativeRef={motionRef}>
        <div>Controlled animation</div>
      </Pulse>
    </div>
  );
};
```

### MotionImperativeRef API

| Method | Parameters | Description |
|--------|-----------|-------------|
| `setPlaybackRate` | `(rate: number)` | Set animation speed (1 = normal, 2 = double, 0.5 = half) |
| `setPlayState` | `('running' \| 'paused')` | Pause or resume the animation |

---

## Reduced Motion Support

Each atom can specify a `reducedMotion` override for users who prefer reduced motion:

```typescript
const SlideIn = createMotionComponent({
  keyframes: [
    { transform: 'translateX(-100px)', opacity: 0 },
    { transform: 'translateX(0)', opacity: 1 },
  ],
  duration: motionTokens.durationNormal,
  easing: motionTokens.curveDecelerateMid,
  // When prefers-reduced-motion is active, only animate opacity
  reducedMotion: {
    keyframes: [{ opacity: 0 }, { opacity: 1 }],
    duration: motionTokens.durationFast,
  },
});
```

> **Default behavior**: If `reducedMotion` is not specified, the animation duration is automatically overridden to 1ms (effectively instant).

---

## AtomMotion Type Reference

```typescript
type AtomMotion = {
  keyframes: Keyframe[];          // Web Animations API keyframes
  duration?: number;               // Duration in ms
  easing?: string;                 // CSS easing function
  delay?: number;                  // Delay in ms
  fill?: FillMode;                 // 'none' | 'forwards' | 'backwards' | 'both'
  iterations?: number;             // Number of iterations
  direction?: PlaybackDirection;   // 'normal' | 'reverse' | 'alternate'
  reducedMotion?: Partial<AtomMotion>; // Override for reduced motion
};
```

---

## Best Practices

### ✅ Do's

```typescript
// Use tokens for consistent timing
createMotionComponent({
  keyframes: [...],
  duration: motionTokens.durationNormal,
  easing: motionTokens.curveDecelerateMid,
});

// Provide reducedMotion alternatives for complex animations
createMotionComponent({
  keyframes: [/* complex transform */],
  duration: motionTokens.durationSlow,
  reducedMotion: {
    keyframes: [{ opacity: 0 }, { opacity: 1 }],
  },
});
```

### ❌ Don'ts

```typescript
// Don't use createMotionComponent for enter/exit — use createPresenceComponent instead
// Don't use hardcoded duration/easing values — use motionTokens
// Don't animate layout-triggering properties (width, height) — use transform instead
```

---

## See Also

- [Motion Tokens](01-motion-tokens.md) — Duration and easing values
- [Presence Components](03-presence-components.md) — Enter/exit animations
- [Built-in Motions](04-built-in-motions.md) — Pre-built Fade, Scale, Slide, etc.
