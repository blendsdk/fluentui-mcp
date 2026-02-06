# Carousel

> **Package**: `@fluentui/react-carousel`
> **Import**: `import { Carousel, CarouselCard, CarouselNav, CarouselNavButton } from '@fluentui/react-components'`
> **Category**: Utilities

## Overview

Carousel displays content in a scrollable, slide-based format. Use for image galleries, testimonials, or any content that benefits from a sequential presentation.

---

## Basic Usage

```typescript
import * as React from 'react';
import {
  Carousel,
  CarouselCard,
  CarouselNav,
  CarouselNavButton,
} from '@fluentui/react-components';

export const BasicCarousel: React.FC = () => (
  <Carousel>
    <CarouselCard>Slide 1 content</CarouselCard>
    <CarouselCard>Slide 2 content</CarouselCard>
    <CarouselCard>Slide 3 content</CarouselCard>
    <CarouselNav>
      {(index) => <CarouselNavButton aria-label={`Go to slide ${index + 1}`} />}
    </CarouselNav>
  </Carousel>
);
```

---

## Component Structure

| Component | Purpose |
|-----------|---------|
| `Carousel` | Root container |
| `CarouselCard` | Individual slide |
| `CarouselNav` | Navigation dots container |
| `CarouselNavButton` | Navigation dot button |
| `CarouselButton` | Previous/next navigation |

---

## Carousel Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `activeIndex` | `number` | - | Controlled active slide |
| `defaultActiveIndex` | `number` | `0` | Initial active slide |
| `circular` | `boolean` | `false` | Loop navigation |
| `motion` | `'auto' \| 'always' \| 'never'` | `'auto'` | Animation behavior |
| `onActiveIndexChange` | `(ev, data) => void` | - | Index change handler |

---

## With Navigation Buttons

```typescript
import * as React from 'react';
import {
  Carousel,
  CarouselCard,
  CarouselButton,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingHorizontalXL,
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },
});

export const CarouselWithButtons: React.FC = () => {
  const styles = useStyles();

  return (
    <Carousel>
      <CarouselButton navType="prev" />
      <CarouselCard className={styles.card}>Slide 1</CarouselCard>
      <CarouselCard className={styles.card}>Slide 2</CarouselCard>
      <CarouselCard className={styles.card}>Slide 3</CarouselCard>
      <CarouselButton navType="next" />
    </Carousel>
  );
};
```

---

## Controlled Carousel

```typescript
import * as React from 'react';
import {
  Carousel,
  CarouselCard,
  CarouselNav,
  CarouselNavButton,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  controls: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalM,
  },
});

export const ControlledCarousel: React.FC = () => {
  const styles = useStyles();
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <div>
      <Carousel
        activeIndex={activeIndex}
        onActiveIndexChange={(_, data) => setActiveIndex(data.index)}
      >
        <CarouselCard>Slide 1</CarouselCard>
        <CarouselCard>Slide 2</CarouselCard>
        <CarouselCard>Slide 3</CarouselCard>
        <CarouselNav>
          {(index) => <CarouselNavButton />}
        </CarouselNav>
      </Carousel>
      <div className={styles.controls}>
        <Button onClick={() => setActiveIndex(0)}>First</Button>
        <Button onClick={() => setActiveIndex(2)}>Last</Button>
      </div>
    </div>
  );
};
```

---

## Circular Navigation

```typescript
<Carousel circular>
  <CarouselButton navType="prev" />
  <CarouselCard>Slide 1</CarouselCard>
  <CarouselCard>Slide 2</CarouselCard>
  <CarouselCard>Slide 3</CarouselCard>
  <CarouselButton navType="next" />
</Carousel>
```

---

## Accessibility

- Use `aria-label` on CarouselNavButton
- Carousel announces slide changes
- Keyboard navigation supported with arrow keys

---

## Best Practices

### ✅ Do's

```typescript
// Provide meaningful aria-labels
<CarouselNavButton aria-label="Go to slide 1" />

// Use circular for infinite scroll
<Carousel circular>...</Carousel>
```

### ❌ Don'ts

```typescript
// Don't auto-play without user control
// Don't put critical content only in later slides
```

---

## See Also

- [Tabs](../navigation/tabs.md) - Alternative content switching
- [Component Index](../00-component-index.md)