# Rating

> **Component**: `Rating`, `RatingDisplay`, `RatingItem`
> **Package**: `@fluentui/react-components` (from `@fluentui/react-rating`)

## Overview

Rating allows users to provide feedback by selecting a value from a set of visual indicators (stars by default). FluentUI v9 provides two main components:

- **Rating**: Interactive component for user input
- **RatingDisplay**: Read-only display of a rating value

## Import

```typescript
import {
  Rating,
  RatingDisplay,
  RatingItem,
  ratingClassNames,
  ratingDisplayClassNames,
  ratingItemClassNames,
} from '@fluentui/react-components';
```

## Components

| Component | Description |
|-----------|-------------|
| `Rating` | Interactive rating input with keyboard and mouse support |
| `RatingDisplay` | Read-only rating display, optionally with count |
| `RatingItem` | Individual rating item (star), typically auto-generated |

---

## Rating Component

### Basic Usage

```tsx
import { Rating } from '@fluentui/react-components';

// Uncontrolled with default value
function BasicRating() {
  return <Rating defaultValue={3} />;
}
```

### Controlled Value

```tsx
import { useState } from 'react';
import { Rating, Button } from '@fluentui/react-components';

function ControlledRating() {
  const [value, setValue] = useState(4);

  return (
    <>
      <Rating 
        value={value} 
        onChange={(_, data) => setValue(data.value)} 
      />
      <Button onClick={() => setValue(0)}>Clear Rating</Button>
      <p>Current value: {value}</p>
    </>
  );
}
```

### Rating Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | - | Controlled rating value |
| `defaultValue` | `number` | - | Default uncontrolled value |
| `onChange` | `(event, data) => void` | - | Callback when value changes |
| `max` | `number` | `5` | Maximum rating value (number of items) |
| `step` | `0.5 \| 1` | `1` | Step precision (1 = whole, 0.5 = half) |
| `size` | `'small' \| 'medium' \| 'large' \| 'extra-large'` | `'extra-large'` | Size of rating items |
| `color` | `'brand' \| 'marigold' \| 'neutral'` | `'neutral'` | Color theme of rating items |
| `iconFilled` | `React.ElementType` | `StarFilled` | Icon for filled state |
| `iconOutline` | `React.ElementType` | `StarRegular` | Icon for unfilled state |
| `itemLabel` | `(rating: number) => string` | `(rating) => \`${rating}\`` | ARIA label generator for items |
| `name` | `string` | auto-generated | Name for radio inputs |

### Size Variants

```tsx
import { Rating } from '@fluentui/react-components';

function RatingSizes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Rating size="small" defaultValue={3} />
      <Rating size="medium" defaultValue={3} />
      <Rating size="large" defaultValue={3} />
      <Rating size="extra-large" defaultValue={3} />
    </div>
  );
}
```

### Color Variants

```tsx
import { Rating } from '@fluentui/react-components';

function RatingColors() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Rating color="neutral" defaultValue={3} />
      <Rating color="brand" defaultValue={3} />
      <Rating color="marigold" defaultValue={3} />
    </div>
  );
}
```

### Half-Star Ratings (Step 0.5)

```tsx
import { Rating } from '@fluentui/react-components';

function HalfStarRating() {
  return (
    <Rating 
      step={0.5} 
      defaultValue={3.5} 
    />
  );
}
```

### Custom Icons

```tsx
import { Rating } from '@fluentui/react-components';
import { 
  CircleFilled, 
  CircleRegular,
  HeartFilled,
  HeartRegular 
} from '@fluentui/react-icons';

function CustomIconRating() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Circle icons */}
      <Rating 
        iconFilled={CircleFilled} 
        iconOutline={CircleRegular} 
        step={0.5}
        defaultValue={3}
      />
      
      {/* Heart icons */}
      <Rating 
        iconFilled={HeartFilled} 
        iconOutline={HeartRegular}
        color="brand"
        defaultValue={4}
      />
    </div>
  );
}
```

### Custom Max Value

```tsx
import { Rating } from '@fluentui/react-components';

function CustomMaxRating() {
  return (
    <>
      {/* 3-star rating */}
      <Rating max={3} defaultValue={2} />
      
      {/* 10-star rating */}
      <Rating max={10} defaultValue={7} />
    </>
  );
}
```

### Custom Aria Labels

```tsx
import { Rating } from '@fluentui/react-components';

function AccessibleRating() {
  return (
    <Rating 
      defaultValue={3}
      itemLabel={(rating) => `${rating} out of 5 stars`}
    />
  );
}
```

---

## RatingDisplay Component

RatingDisplay is a read-only component for displaying ratings, typically used to show aggregate ratings or user reviews.

### Basic Display

```tsx
import { RatingDisplay } from '@fluentui/react-components';

function BasicRatingDisplay() {
  return <RatingDisplay value={3.5} />;
}
```

### RatingDisplay Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | - | Rating value to display |
| `max` | `number` | `5` | Maximum rating value |
| `size` | `'small' \| 'medium' \| 'large' \| 'extra-large'` | `'medium'` | Size of rating items |
| `color` | `'brand' \| 'marigold' \| 'neutral'` | `'neutral'` | Color theme |
| `icon` | `React.ElementType` | `StarFilled` | Icon to use |
| `compact` | `boolean` | `false` | Show single star with value text |
| `count` | `number` | - | Number of ratings (e.g., review count) |

### Display with Count

```tsx
import { RatingDisplay } from '@fluentui/react-components';

function RatingWithCount() {
  return (
    <RatingDisplay 
      value={4.2} 
      count={1250}  // Shows "(1,250)" next to rating
    />
  );
}
```

### Compact Display

```tsx
import { RatingDisplay } from '@fluentui/react-components';

function CompactRatingDisplay() {
  return (
    <>
      {/* Shows single star with "4.2" text */}
      <RatingDisplay value={4.2} compact />
      
      {/* Compact with count */}
      <RatingDisplay value={4.2} count={1250} compact />
    </>
  );
}
```

### Display Sizes

```tsx
import { RatingDisplay } from '@fluentui/react-components';

function RatingDisplaySizes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <RatingDisplay size="small" value={4.2} count={100} />
      <RatingDisplay size="medium" value={4.2} count={100} />
      <RatingDisplay size="large" value={4.2} count={100} />
      <RatingDisplay size="extra-large" value={4.2} count={100} />
    </div>
  );
}
```

---

## Accessibility

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move focus to/from rating |
| `Arrow Left/Right` | Change rating value |
| `Home` | Set to minimum (1) |
| `End` | Set to maximum |

### ARIA Support

Rating uses radio group semantics:
- Each rating item is a radio button
- The rating group has `role="radiogroup"`
- Labels are auto-generated or customizable via `itemLabel`

```tsx
import { Rating } from '@fluentui/react-components';

function AccessibleRating() {
  return (
    <Rating
      aria-label="Product rating"
      itemLabel={(rating) => `Rate ${rating} star${rating !== 1 ? 's' : ''}`}
    />
  );
}
```

---

## Common Patterns

### Product Rating Card

```tsx
import { 
  Rating, 
  RatingDisplay, 
  Card, 
  CardHeader, 
  Body1 
} from '@fluentui/react-components';

function ProductRatingCard() {
  const [userRating, setUserRating] = useState<number | null>(null);
  
  return (
    <Card>
      <CardHeader
        header={<Body1>Product Name</Body1>}
        description={
          <RatingDisplay value={4.2} count={1250} />
        }
      />
      
      <div>
        <Body1>Your rating:</Body1>
        <Rating
          value={userRating ?? undefined}
          onChange={(_, data) => setUserRating(data.value)}
        />
      </div>
    </Card>
  );
}
```

### Rating with Feedback Text

```tsx
import { useState } from 'react';
import { Rating, Body1 } from '@fluentui/react-components';

const feedbackLabels = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent'
};

function RatingWithFeedback() {
  const [value, setValue] = useState(0);
  
  return (
    <div>
      <Rating
        value={value}
        onChange={(_, data) => setValue(data.value)}
      />
      {value > 0 && (
        <Body1>{feedbackLabels[value as keyof typeof feedbackLabels]}</Body1>
      )}
    </div>
  );
}
```

### Form Integration

```tsx
import { useState } from 'react';
import { 
  Rating, 
  Field, 
  Button, 
  Textarea 
} from '@fluentui/react-components';

function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = () => {
    console.log({ rating, review });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <Field label="Your Rating" required>
        <Rating
          value={rating}
          onChange={(_, data) => setRating(data.value)}
        />
      </Field>
      
      <Field label="Your Review">
        <Textarea
          value={review}
          onChange={(_, data) => setReview(data.value)}
        />
      </Field>
      
      <Button type="submit" appearance="primary" disabled={rating === 0}>
        Submit Review
      </Button>
    </form>
  );
}
```

---

## Styling

### Class Names

```typescript
import { 
  ratingClassNames,
  ratingDisplayClassNames,
  ratingItemClassNames 
} from '@fluentui/react-components';

// Rating class names
ratingClassNames.root  // Root element

// RatingDisplay class names
ratingDisplayClassNames.root      // Root element
ratingDisplayClassNames.valueText // Value text element
ratingDisplayClassNames.countText // Count text element

// RatingItem class names
ratingItemClassNames.root  // Individual item root
```

### Custom Styling

```tsx
import { Rating, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  customRating: {
    // Custom color for selected state
    '& [data-selected="true"]': {
      color: tokens.colorPaletteGoldForeground1,
    },
  },
});

function StyledRating() {
  const styles = useStyles();
  return <Rating className={styles.customRating} defaultValue={3} />;
}
```

---

## Best Practices

### Do's ✅

- Use `RatingDisplay` for read-only scenarios (product listings)
- Use `Rating` when users need to provide input
- Provide clear labels for accessibility
- Use appropriate `step` (0.5 vs 1) based on precision needs
- Use `compact` display for space-constrained UIs
- Include rating count when available to show credibility

### Don'ts ❌

- Don't use Rating for non-rating inputs (use Slider instead)
- Don't mix different icon styles in the same context
- Don't use very high `max` values (stick to 5 or 10)
- Don't use Rating for binary choices (use Switch or Checkbox)

---

## Related Components

- [Slider](./slider.md) - For continuous value selection
- [Field](./field.md) - For form field wrapper with label and validation
- [Input](./input.md) - For text input