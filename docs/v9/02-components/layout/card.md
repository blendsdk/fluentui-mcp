# Card

> **Package**: `@fluentui/react-card`
> **Import**: `import { Card, CardHeader, CardPreview, CardFooter } from '@fluentui/react-components'`
> **Category**: Layout

## Overview

Card is a container for grouping related information and actions. It supports headers, content, media previews, and footers.

---

## Basic Usage

```typescript
import * as React from 'react';
import { Card, CardHeader, CardPreview, Text } from '@fluentui/react-components';

export const BasicCard: React.FC = () => (
  <Card>
    <CardHeader
      header={<Text weight="semibold">Card Title</Text>}
      description={<Text>Card description</Text>}
    />
    <CardPreview>
      <img src="preview.jpg" alt="Preview" />
    </CardPreview>
  </Card>
);
```

---

## Component Structure

| Component | Purpose |
|-----------|---------|
| `Card` | Root container |
| `CardHeader` | Header with image, title, description, action |
| `CardPreview` | Media/image preview area |
| `CardFooter` | Footer with actions |

---

## Card Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `appearance` | `'filled' \| 'filled-alternative' \| 'outline' \| 'subtle'` | `'filled'` | Visual style |
| `orientation` | `'horizontal' \| 'vertical'` | `'vertical'` | Layout direction |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Padding size |
| `selected` | `boolean` | - | Selected state |
| `onSelectionChange` | `(ev, data) => void` | - | Selection handler |

---

## Appearance Variants

```typescript
<Card appearance="filled">Filled (default)</Card>
<Card appearance="filled-alternative">Alternative background</Card>
<Card appearance="outline">Outlined border</Card>
<Card appearance="subtle">Minimal style</Card>
```

---

## Size Variants

```typescript
<Card size="small">Small padding</Card>
<Card size="medium">Medium padding (default)</Card>
<Card size="large">Large padding</Card>
```

---

## CardHeader Props

| Prop | Type | Description |
|------|------|-------------|
| `image` | `Slot<'div'>` | Avatar/image slot |
| `header` | `Slot<'div'>` | Title content |
| `description` | `Slot<'div'>` | Description text |
| `action` | `Slot<'div'>` | Action button (menu, etc.) |

```typescript
import * as React from 'react';
import {
  Card,
  CardHeader,
  Avatar,
  Text,
  Button,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from '@fluentui/react-components';
import { MoreHorizontalRegular } from '@fluentui/react-icons';

export const CardWithHeader: React.FC = () => (
  <Card>
    <CardHeader
      image={<Avatar name="John Doe" />}
      header={<Text weight="semibold">John Doe</Text>}
      description={<Text>Software Engineer</Text>}
      action={
        <Menu>
          <MenuTrigger>
            <Button appearance="transparent" icon={<MoreHorizontalRegular />} />
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem>Edit</MenuItem>
              <MenuItem>Delete</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      }
    />
  </Card>
);
```

---

## Horizontal Card

```typescript
<Card orientation="horizontal">
  <CardPreview>
    <img src="thumbnail.jpg" alt="Thumbnail" style={{ width: 100 }} />
  </CardPreview>
  <CardHeader
    header={<Text weight="semibold">Title</Text>}
    description={<Text>Description text</Text>}
  />
</Card>
```

---

## Selectable Card

```typescript
import * as React from 'react';
import { Card, CardHeader, Text } from '@fluentui/react-components';
import type { CardOnSelectionChangeData } from '@fluentui/react-components';

export const SelectableCard: React.FC = () => {
  const [selected, setSelected] = React.useState(false);

  const handleSelectionChange = (
    _ev: React.SyntheticEvent,
    data: CardOnSelectionChangeData
  ) => {
    setSelected(data.selected);
  };

  return (
    <Card
      selected={selected}
      onSelectionChange={handleSelectionChange}
    >
      <CardHeader
        header={<Text weight="semibold">Selectable Card</Text>}
        description={<Text>Click to select</Text>}
      />
    </Card>
  );
};
```

---

## Card with Footer

```typescript
import * as React from 'react';
import {
  Card,
  CardHeader,
  CardFooter,
  Text,
  Button,
} from '@fluentui/react-components';

export const CardWithFooter: React.FC = () => (
  <Card>
    <CardHeader
      header={<Text weight="semibold">Article Title</Text>}
      description={<Text>Article preview text...</Text>}
    />
    <CardFooter>
      <Button appearance="primary">Read More</Button>
      <Button>Share</Button>
    </CardFooter>
  </Card>
);
```

---

## Accessibility

- Use semantic header elements when appropriate
- Ensure clickable cards have proper focus indicators
- Selected state is announced to screen readers

---

## Best Practices

### ✅ Do's

```typescript
<Card>
  <CardHeader header={<Text weight="semibold">Title</Text>} />
  {/* Content */}
</Card>
```

### ❌ Don'ts

```typescript
// Don't nest interactive elements without proper handling
// Don't use cards for simple text display (use Text components)
```

---

## See Also

- [Divider](divider.md) - Content separator
- [Component Index](../00-component-index.md)