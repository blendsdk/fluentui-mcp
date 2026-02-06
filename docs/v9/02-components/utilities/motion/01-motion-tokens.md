# Motion Tokens

> **Package**: `@fluentui/react-motion`
> **Import**: `import { motionTokens, durations, curves } from '@fluentui/react-motion'`
> **Parent**: [Motion Index](00-motion-index.md)

## Overview

Motion tokens provide standardized duration and easing values for consistent animations. These tokens are numeric (milliseconds) for direct use with the Web Animations API, unlike the CSS-string design tokens in `@fluentui/tokens`.

---

## Duration Tokens

Duration tokens define how long animations should take, in milliseconds.

```typescript
import { motionTokens, durations } from '@fluentui/react-motion';

// Access via motionTokens (merged object)
motionTokens.durationNormal; // 200

// Or via dedicated durations object
durations.durationNormal; // 200
```

| Token | Value (ms) | Use Case |
|-------|-----------|----------|
| `durationUltraFast` | `50` | Micro-interactions, instant feedback |
| `durationFaster` | `100` | Quick state changes, hover effects |
| `durationFast` | `150` | Snappy transitions, button feedback |
| `durationNormal` | `200` | **Default** — standard transitions |
| `durationGentle` | `250` | Relaxed transitions, scale animations |
| `durationSlow` | `300` | Noticeable transitions, blur effects |
| `durationSlower` | `400` | Deliberate transitions, complex animations |
| `durationUltraSlow` | `500` | Dramatic transitions, page-level changes |

### Duration Guidelines

```typescript
// Quick feedback (buttons, toggles)
{ duration: motionTokens.durationFast }       // 150ms

// Standard UI transitions (dialogs, popovers)
{ duration: motionTokens.durationNormal }     // 200ms

// Gentle reveal (cards, panels)
{ duration: motionTokens.durationGentle }     // 250ms

// Complex multi-step animations
{ duration: motionTokens.durationSlower }     // 400ms
```

---

## Easing Curve Tokens

Easing curves control the acceleration profile of animations. All values are CSS `cubic-bezier()` strings.

```typescript
import { motionTokens, curves } from '@fluentui/react-motion';

// Access via motionTokens (merged object)
motionTokens.curveEasyEase; // 'cubic-bezier(0.33,0,0.67,1)'

// Or via dedicated curves object
curves.curveEasyEase; // 'cubic-bezier(0.33,0,0.67,1)'
```

| Token | Value | Use Case |
|-------|-------|----------|
| `curveAccelerateMax` | `cubic-bezier(0.9,0.1,1,0.2)` | Fast exit, abrupt stop |
| `curveAccelerateMid` | `cubic-bezier(1,0,1,1)` | Standard exit acceleration |
| `curveAccelerateMin` | `cubic-bezier(0.8,0,0.78,1)` | Gentle exit acceleration |
| `curveDecelerateMax` | `cubic-bezier(0.1,0.9,0.2,1)` | Dramatic entrance, slow arrival |
| `curveDecelerateMid` | `cubic-bezier(0,0,0,1)` | Standard entrance deceleration |
| `curveDecelerateMin` | `cubic-bezier(0.33,0,0.1,1)` | Gentle entrance deceleration |
| `curveEasyEaseMax` | `cubic-bezier(0.8,0,0.2,1)` | Dramatic ease-in-out |
| `curveEasyEase` | `cubic-bezier(0.33,0,0.67,1)` | **Default** — standard ease-in-out |
| `curveLinear` | `cubic-bezier(0,0,1,1)` | Constant speed, no acceleration |

### Easing Guidelines

```typescript
// Entering elements — decelerate (fast start, slow finish)
{ easing: motionTokens.curveDecelerateMid }

// Exiting elements — accelerate (slow start, fast finish)
{ easing: motionTokens.curveAccelerateMid }

// Symmetric transitions — ease both ways
{ easing: motionTokens.curveEasyEase }

// Progress bars, continuous motion
{ easing: motionTokens.curveLinear }
```

---

## Using Tokens in Custom Motions

```typescript
import { createPresenceComponent, motionTokens } from '@fluentui/react-motion';

// Use tokens for consistent timing across your app
const CustomFade = createPresenceComponent({
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

---

## Best Practices

### ✅ Do's

```typescript
// Always use motion tokens for consistent timing
{ duration: motionTokens.durationNormal }

// Use decelerate curves for entering elements
{ easing: motionTokens.curveDecelerateMid }

// Use accelerate curves for exiting elements
{ easing: motionTokens.curveAccelerateMid }
```

### ❌ Don'ts

```typescript
// Don't use hardcoded duration values
{ duration: 200 }  // Use motionTokens.durationNormal instead

// Don't use hardcoded easing strings
{ easing: 'ease-in-out' }  // Use motionTokens.curveEasyEase instead

// Don't use overly long durations for simple transitions
{ duration: motionTokens.durationUltraSlow }  // 500ms is too slow for a button hover
```

---

## See Also

- [Motion Index](00-motion-index.md) — Motion system overview
- [Motion Components](02-motion-components.md) — Using tokens in custom motion components
- [Theming](../../../01-foundation/03-theming.md) — Design tokens system
