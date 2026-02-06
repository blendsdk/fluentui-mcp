# TeachingPopover

> **Package**: `@fluentui/react-teaching-popover`
> **Import**: `import { TeachingPopover, TeachingPopoverTrigger, TeachingPopoverSurface, TeachingPopoverHeader, TeachingPopoverBody, TeachingPopoverFooter } from '@fluentui/react-components'`
> **Category**: Overlays

## Overview

TeachingPopover is a specialized popover for onboarding and teaching experiences. It supports step-by-step guidance with navigation controls.

---

## Basic Usage

```typescript
import * as React from 'react';
import {
  TeachingPopover,
  TeachingPopoverTrigger,
  TeachingPopoverSurface,
  TeachingPopoverHeader,
  TeachingPopoverBody,
  Button,
} from '@fluentui/react-components';

export const BasicTeachingPopover: React.FC = () => (
  <TeachingPopover>
    <TeachingPopoverTrigger>
      <Button>Show tip</Button>
    </TeachingPopoverTrigger>
    <TeachingPopoverSurface>
      <TeachingPopoverHeader>Getting Started</TeachingPopoverHeader>
      <TeachingPopoverBody>
        This is a helpful tip about this feature.
      </TeachingPopoverBody>
    </TeachingPopoverSurface>
  </TeachingPopover>
);
```

---

## Component Structure

| Component | Purpose |
|-----------|---------|
| `TeachingPopover` | Root component |
| `TeachingPopoverTrigger` | Element that opens the popover |
| `TeachingPopoverSurface` | Container for content |
| `TeachingPopoverHeader` | Title area |
| `TeachingPopoverBody` | Main content |
| `TeachingPopoverFooter` | Navigation/action buttons |
| `TeachingPopoverCarousel` | Multi-step carousel |
| `TeachingPopoverCarouselCard` | Individual step in carousel |

---

## Multi-Step Carousel

```typescript
import * as React from 'react';
import {
  TeachingPopover,
  TeachingPopoverTrigger,
  TeachingPopoverSurface,
  TeachingPopoverCarousel,
  TeachingPopoverCarouselCard,
  TeachingPopoverCarouselFooter,
  Button,
} from '@fluentui/react-components';

export const CarouselTeachingPopover: React.FC = () => (
  <TeachingPopover>
    <TeachingPopoverTrigger>
      <Button>Start Tutorial</Button>
    </TeachingPopoverTrigger>
    <TeachingPopoverSurface>
      <TeachingPopoverCarousel defaultValue="step-1">
        <TeachingPopoverCarouselCard value="step-1">
          Step 1: Welcome to the app!
        </TeachingPopoverCarouselCard>
        <TeachingPopoverCarouselCard value="step-2">
          Step 2: Here's how to create an item.
        </TeachingPopoverCarouselCard>
        <TeachingPopoverCarouselCard value="step-3">
          Step 3: You're all set!
        </TeachingPopoverCarouselCard>
        <TeachingPopoverCarouselFooter
          next="Next"
          previous="Back"
          initialStepText="Get Started"
          finalStepText="Finish"
        />
      </TeachingPopoverCarousel>
    </TeachingPopoverSurface>
  </TeachingPopover>
);
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `appearance` | `'brand'` | - | Brand-colored appearance |
| `withArrow` | `boolean` | `true` | Show arrow pointing to trigger |
| `positioning` | `PositioningShorthand` | `'above'` | Position relative to trigger |

---

## Appearance Variants

```typescript
// Default appearance
<TeachingPopover>...</TeachingPopover>

// Brand appearance (colored background)
<TeachingPopover appearance="brand">...</TeachingPopover>
```

---

## Best Practices

### ✅ Do's

```typescript
// Use for onboarding flows
<TeachingPopover>
  <TeachingPopoverSurface>
    <TeachingPopoverHeader>New Feature!</TeachingPopoverHeader>
    <TeachingPopoverBody>Learn about our new feature.</TeachingPopoverBody>
  </TeachingPopoverSurface>
</TeachingPopover>

// Use carousel for multi-step tutorials
<TeachingPopoverCarousel>
  <TeachingPopoverCarouselCard>Step 1</TeachingPopoverCarouselCard>
  <TeachingPopoverCarouselCard>Step 2</TeachingPopoverCarouselCard>
</TeachingPopoverCarousel>
```

### ❌ Don'ts

```typescript
// Don't use for simple tooltips (use Tooltip)
// Don't use for complex forms (use Dialog or Drawer)
// Don't overwhelm users with too many teaching popovers
```

---

## See Also

- [Popover](popover.md) - General purpose popover
- [Tooltip](../feedback/tooltip.md) - Simple hover info
- [Component Index](../00-component-index.md)