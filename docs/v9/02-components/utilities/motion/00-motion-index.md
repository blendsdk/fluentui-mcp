# Motion & Animation

> **Packages**: `@fluentui/react-motion`, `@fluentui/react-motion-components-preview`
> **Import**: `import { createPresenceComponent, createMotionComponent, motionTokens, PresenceGroup } from '@fluentui/react-motion'`
> **Category**: Utilities

## Overview

FluentUI v9 provides a comprehensive motion system built on the **Web Animations API**. The system is divided into two packages:

- **`@fluentui/react-motion`** — Core motion infrastructure (factory functions, tokens, PresenceGroup)
- **`@fluentui/react-motion-components-preview`** — Pre-built motion components (Fade, Scale, Slide, Collapse, Blur, Rotate, Stagger)

The motion system supports:
- Enter/exit (presence) animations for mounting/unmounting
- One-shot motion animations
- Reduced motion preferences (respects `prefers-reduced-motion`)
- Imperative animation control (pause, play, reverse, playback rate)
- Slot integration with FluentUI components via `presenceMotionSlot`
- Staggered group animations

---

## Document Index

| File | Topic | Description |
|------|-------|-------------|
| [00-motion-index](00-motion-index.md) | Overview | This document — motion system overview |
| [01-motion-tokens](01-motion-tokens.md) | Tokens | Duration and easing curve tokens |
| [02-motion-components](02-motion-components.md) | Motion | `createMotionComponent` for one-shot animations |
| [03-presence-components](03-presence-components.md) | Presence | `createPresenceComponent` for enter/exit animations |
| [04-built-in-motions](04-built-in-motions.md) | Built-in | Fade, Scale, Slide, Collapse, Blur, Rotate |
| [05-motion-slots](05-motion-slots.md) | Slots | `presenceMotionSlot` for FluentUI component integration |
| [06-stagger](06-stagger.md) | Stagger | Staggered group animations |

---

## Quick Start

```typescript
import * as React from 'react';
import { Fade } from '@fluentui/react-motion-components-preview';

export const FadeExample: React.FC = () => {
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <button onClick={() => setVisible((v) => !v)}>Toggle</button>
      <Fade visible={visible}>
        <div>This content fades in and out</div>
      </Fade>
    </>
  );
};
```

---

## Package Installation

```bash
# Core motion infrastructure
yarn add @fluentui/react-motion

# Pre-built motion components (preview)
yarn add @fluentui/react-motion-components-preview
```

> **Note**: The core `@fluentui/react-motion` package is included in `@fluentui/react-components`. The preview components require a separate install.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Motion Component** | One-shot animation that plays on mount (created via `createMotionComponent`) |
| **Presence Component** | Enter/exit animation triggered by `visible` prop (created via `createPresenceComponent`) |
| **Motion Tokens** | Standardized durations and easing curves (`motionTokens`) |
| **Atom Motion** | A single animation definition with keyframes and timing |
| **Presence Motion** | A pair of enter/exit atom motions |
| **PresenceGroup** | Manages animated list items with mount/unmount transitions |
| **Stagger** | Choreographs sequential animations across multiple children |
| **Motion Slot** | Integration point for motions in FluentUI component slots |

---

## See Also

- [Component Index](../../00-component-index.md)
- [Styling & Griffel](../../../01-foundation/04-styling-griffel.md)
- [Component Architecture](../../../01-foundation/05-component-architecture.md)
