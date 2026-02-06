# Built-in Motion Components

> **Package**: `@fluentui/react-motion-components-preview`
> **Import**: `import { Fade, Scale, Slide, Collapse, Blur, Rotate } from '@fluentui/react-motion-components-preview'`
> **Parent**: [Motion Index](00-motion-index.md)

## Overview

FluentUI provides six pre-built presence components and their speed variants. Each is created with `createPresenceComponent` and supports all [PresenceComponentProps](03-presence-components.md) (`visible`, `appear`, `unmountOnExit`, callbacks).

All built-in motions support:
- Custom `duration`, `easing`, `delay` for enter
- Custom `exitDuration`, `exitEasing`, `exitDelay` for exit
- `.In` and `.Out` static sub-components for one-direction-only use

---

## Fade

Animates opacity between 0 and 1.

```typescript
import { Fade, FadeSnappy, FadeRelaxed } from '@fluentui/react-motion-components-preview';

// Basic fade
<Fade visible={isVisible}>
  <div>Fading content</div>
</Fade>

// Snappy variant (150ms)
<FadeSnappy visible={isVisible}>
  <div>Quick fade</div>
</FadeSnappy>

// Relaxed variant (250ms)
<FadeRelaxed visible={isVisible}>
  <div>Gentle fade</div>
</FadeRelaxed>
```

### FadeParams

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `duration` | `number` | `200` (durationNormal) | Enter duration in ms |
| `easing` | `string` | `curveEasyEase` | Enter easing curve |
| `delay` | `number` | `0` | Enter delay in ms |
| `exitDuration` | `number` | `duration` | Exit duration in ms |
| `exitEasing` | `string` | `easing` | Exit easing curve |
| `exitDelay` | `number` | `delay` | Exit delay in ms |
| `outOpacity` | `number` | `0` | Opacity for the exited state |
| `inOpacity` | `number` | `1` | Opacity for the entered state |

| Variant | Duration |
|---------|----------|
| `Fade` | 200ms (durationNormal) |
| `FadeSnappy` | 150ms (durationFast) |
| `FadeRelaxed` | 250ms (durationGentle) |

---

## Scale

Animates scale transform with optional opacity.

```typescript
import { Scale, ScaleSnappy, ScaleRelaxed } from '@fluentui/react-motion-components-preview';

// Basic scale (enters at 0.9, exits to 0.9)
<Scale visible={isVisible}>
  <div>Scaling content</div>
</Scale>

// Custom scale range
<Scale visible={isVisible} outScale={0.5} inScale={1}>
  <div>Scales from 50% to 100%</div>
</Scale>

// Without opacity animation
<Scale visible={isVisible} animateOpacity={false}>
  <div>Scale only, no fade</div>
</Scale>
```

### ScaleParams

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `duration` | `number` | `250` (durationGentle) | Enter duration in ms |
| `easing` | `string` | `curveDecelerateMax` | Enter easing curve |
| `delay` | `number` | `0` | Enter delay in ms |
| `exitDuration` | `number` | `200` (durationNormal) | Exit duration in ms |
| `exitEasing` | `string` | `curveAccelerateMax` | Exit easing curve |
| `exitDelay` | `number` | `delay` | Exit delay in ms |
| `outScale` | `number` | `0.9` | Scale for the exited state |
| `inScale` | `number` | `1` | Scale for the entered state |
| `animateOpacity` | `boolean` | `true` | Whether to also animate opacity |

| Variant | Enter Duration | Exit Duration |
|---------|---------------|--------------|
| `Scale` | 250ms (durationGentle) | 200ms (durationNormal) |
| `ScaleSnappy` | 200ms (durationNormal) | 150ms (durationFast) |
| `ScaleRelaxed` | 300ms (durationSlow) | 250ms (durationGentle) |

---

## Slide

Animates translateX/translateY with optional opacity.

```typescript
import { Slide, SlideSnappy, SlideRelaxed } from '@fluentui/react-motion-components-preview';

// Slide from left
<Slide visible={isVisible} outX="-100px">
  <div>Slides from left</div>
</Slide>

// Slide from top
<Slide visible={isVisible} outY="-50px">
  <div>Slides from top</div>
</Slide>

// Slide from right without opacity
<Slide visible={isVisible} outX="100px" animateOpacity={false}>
  <div>Slides from right, no fade</div>
</Slide>
```

### SlideParams

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `duration` | `number` | `200` (durationNormal) | Enter duration in ms |
| `easing` | `string` | `curveDecelerateMid` | Enter easing curve |
| `delay` | `number` | `0` | Enter delay in ms |
| `exitDuration` | `number` | `duration` | Exit duration in ms |
| `exitEasing` | `string` | `curveAccelerateMid` | Exit easing curve |
| `exitDelay` | `number` | `delay` | Exit delay in ms |
| `outX` | `string` | `'0px'` | X translate for the exited state |
| `outY` | `string` | `'0px'` | Y translate for the exited state |
| `inX` | `string` | `'0px'` | X translate for the entered state |
| `inY` | `string` | `'0px'` | Y translate for the entered state |
| `animateOpacity` | `boolean` | `true` | Whether to also animate opacity |

| Variant | Easing |
|---------|--------|
| `Slide` | `curveDecelerateMid` / `curveAccelerateMid` |
| `SlideSnappy` | `curveDecelerateMax` / `curveAccelerateMax` |
| `SlideRelaxed` | 250ms duration (durationGentle) |

---

## Collapse

Animates height (or width) for expand/collapse transitions with optional opacity. The most complex built-in motion — supports staggered fade and granular timing control.

```typescript
import {
  Collapse,
  CollapseSnappy,
  CollapseRelaxed,
  CollapseDelayed,
} from '@fluentui/react-motion-components-preview';

// Basic collapse (vertical)
<Collapse visible={isExpanded}>
  <div>Collapsible content</div>
</Collapse>

// Horizontal collapse
<Collapse visible={isExpanded} orientation="horizontal">
  <div>Collapses horizontally</div>
</Collapse>

// Collapse to specific size (partial collapse)
<Collapse visible={isExpanded} outSize="48px">
  <div>Collapses to 48px instead of 0</div>
</Collapse>

// Without opacity animation
<Collapse visible={isExpanded} animateOpacity={false}>
  <div>Height-only collapse</div>
</Collapse>

// Delayed variant: fade and size stagger with designed timing
<CollapseDelayed visible={isExpanded}>
  <div>Staggered fade + size collapse</div>
</CollapseDelayed>
```

### CollapseParams

**Basic timing:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `duration` | `number` | `200` (durationNormal) | Enter duration in ms |
| `easing` | `string` | `curveEasyEaseMax` | Enter easing |
| `delay` | `number` | `0` | Global enter delay in ms |
| `exitDuration` | `number` | `duration` | Exit duration in ms |
| `exitEasing` | `string` | `easing` | Exit easing |
| `exitDelay` | `number` | `delay` | Global exit delay in ms |

**Advanced timing (granular control):**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `sizeDuration` | `number` | `duration` | Enter size animation duration |
| `opacityDuration` | `number` | `sizeDuration` | Enter opacity animation duration |
| `exitSizeDuration` | `number` | `exitDuration` | Exit size animation duration |
| `exitOpacityDuration` | `number` | `exitSizeDuration` | Exit opacity animation duration |
| `staggerDelay` | `number` | `0` | Delay between size and opacity on enter |
| `exitStaggerDelay` | `number` | `staggerDelay` | Delay between opacity and size on exit |

**Animation controls:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `animateOpacity` | `boolean` | `true` | Whether to animate opacity |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Collapse direction |
| `outSize` | `string` | `'0px'` | Collapsed size (e.g., `'48px'` for partial) |

| Variant | Behavior |
|---------|----------|
| `Collapse` | Standard 200ms expand/collapse |
| `CollapseSnappy` | Fast 150ms (durationFast) |
| `CollapseRelaxed` | Slow 400ms (durationSlower) |
| `CollapseDelayed` | Staggered: size 200ms + opacity 400ms with delays |

---

## Blur

Animates CSS `filter: blur()` with optional opacity.

```typescript
import { Blur } from '@fluentui/react-motion-components-preview';

// Basic blur in/out
<Blur visible={isVisible}>
  <div>Blurring content</div>
</Blur>

// Custom blur radius
<Blur visible={isVisible} outRadius="20px" inRadius="0px">
  <div>Heavy blur</div>
</Blur>
```

### BlurParams

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `duration` | `number` | `300` (durationSlow) | Enter duration in ms |
| `easing` | `string` | `curveDecelerateMin` | Enter easing |
| `delay` | `number` | `0` | Enter delay in ms |
| `exitDuration` | `number` | `duration` | Exit duration |
| `exitEasing` | `string` | `curveAccelerateMin` | Exit easing |
| `exitDelay` | `number` | `delay` | Exit delay |
| `outRadius` | `string` | `'10px'` | Blur radius for exited state |
| `inRadius` | `string` | `'0px'` | Blur radius for entered state |
| `animateOpacity` | `boolean` | `true` | Whether to also animate opacity |

> **Note**: Blur has no pre-defined variants (no BlurSnappy/BlurRelaxed).

---

## Rotate

Animates rotation around X, Y, or Z axis with optional opacity.

```typescript
import { Rotate } from '@fluentui/react-motion-components-preview';

// Basic Z-axis rotation
<Rotate visible={isVisible}>
  <div>Rotates in</div>
</Rotate>

// Y-axis rotation (3D flip effect)
<Rotate visible={isVisible} axis="y" outAngle={-180} inAngle={0}>
  <div>Flips on Y axis</div>
</Rotate>

// Custom angle without opacity
<Rotate visible={isVisible} outAngle={45} animateOpacity={false}>
  <div>Rotates 45° without fading</div>
</Rotate>
```

### RotateParams

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `duration` | `number` | `250` (durationGentle) | Enter duration |
| `easing` | `string` | `curveDecelerateMax` | Enter easing |
| `delay` | `number` | `0` | Enter delay |
| `exitDuration` | `number` | `duration` | Exit duration |
| `exitEasing` | `string` | `curveAccelerateMax` | Exit easing |
| `exitDelay` | `number` | `delay` | Exit delay |
| `axis` | `'x' \| 'y' \| 'z'` | `'z'` | Rotation axis |
| `outAngle` | `number` | `-90` | Rotation angle (degrees) for exited state |
| `inAngle` | `number` | `0` | Rotation angle (degrees) for entered state |
| `animateOpacity` | `boolean` | `true` | Whether to also animate opacity |

> **Note**: Rotate has no pre-defined variants (no RotateSnappy/RotateRelaxed).

---

## Variants with `createPresenceComponentVariant`

Create speed or parameter variants of any presence component:

```typescript
import { createPresenceComponentVariant } from '@fluentui/react-motion';
import { Fade } from '@fluentui/react-motion-components-preview';
import { motionTokens } from '@fluentui/react-motion';

// Create a custom ultra-fast fade variant
const FadeUltraFast = createPresenceComponentVariant(Fade, {
  duration: motionTokens.durationFaster,   // 100ms
});

// Create a fade variant with partial opacity
const FadeSoft = createPresenceComponentVariant(Fade, {
  outOpacity: 0.3, // Doesn't fully disappear
});

// Usage
<FadeUltraFast visible={isVisible}>
  <div>Ultra-fast fade</div>
</FadeUltraFast>
```

---

## Quick Comparison

| Component | Effect | Default Duration | Opacity | Extra Params |
|-----------|--------|-----------------|---------|--------------|
| **Fade** | Opacity only | 200ms | Always | `outOpacity`, `inOpacity` |
| **Scale** | Scale + opacity | 250ms enter, 200ms exit | Optional | `outScale`, `inScale` |
| **Slide** | Translate + opacity | 200ms | Optional | `outX`, `outY`, `inX`, `inY` |
| **Collapse** | Height/width + opacity | 200ms | Optional | `orientation`, `outSize`, stagger controls |
| **Blur** | Blur filter + opacity | 300ms | Optional | `outRadius`, `inRadius` |
| **Rotate** | Rotation + opacity | 250ms | Optional | `axis`, `outAngle`, `inAngle` |

---

## See Also

- [Motion Tokens](01-motion-tokens.md) — Duration and easing values
- [Presence Components](03-presence-components.md) — Creating custom presence components
- [Stagger](06-stagger.md) — Staggering built-in motions across groups
- [Motion Slots](05-motion-slots.md) — Using motions in FluentUI component slots
