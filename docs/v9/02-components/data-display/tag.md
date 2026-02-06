# Tag

> **Package**: `@fluentui/react-tags`
> **Import**: `import { Tag, InteractionTag } from '@fluentui/react-components'`
> **Category**: Data Display

## Overview

Tag displays a small piece of information, like a category or status. Tags can be dismissible or interactive.

---

## Basic Usage

```typescript
import * as React from 'react';
import { Tag } from '@fluentui/react-components';

export const BasicTag: React.FC = () => (
  <Tag>Example Tag</Tag>
);
```

---

## Tag Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `appearance` | `'filled' \| 'outline' \| 'brand'` | `'filled'` | Visual style |
| `size` | `'extra-small' \| 'small' \| 'medium'` | `'medium'` | Tag size |
| `shape` | `'rounded' \| 'circular'` | `'rounded'` | Tag shape |
| `dismissible` | `boolean` | `false` | Show dismiss button |
| `icon` | `Slot<'span'>` | - | Icon before content |
| `primaryText` | `Slot<'span'>` | - | Primary text |
| `secondaryText` | `Slot<'span'>` | - | Secondary text |

---

## Appearance Variants

```typescript
<Tag appearance="filled">Filled</Tag>
<Tag appearance="outline">Outline</Tag>
<Tag appearance="brand">Brand</Tag>
```

---

## Size Variants

```typescript
<Tag size="extra-small">Extra Small</Tag>
<Tag size="small">Small</Tag>
<Tag size="medium">Medium</Tag>
```

---

## Dismissible Tags

```typescript
import * as React from 'react';
import { Tag, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: { display: 'flex', gap: tokens.spacingHorizontalS },
});

export const DismissibleTags: React.FC = () => {
  const styles = useStyles();
  const [tags, setTags] = React.useState(['React', 'TypeScript', 'FluentUI']);

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <div className={styles.container}>
      {tags.map(tag => (
        <Tag
          key={tag}
          dismissible
          dismissIcon={{ onClick: () => removeTag(tag) }}
        >
          {tag}
        </Tag>
      ))}
    </div>
  );
};
```

---

## With Icons

```typescript
import * as React from 'react';
import { Tag } from '@fluentui/react-components';
import { PersonRegular, CalendarRegular } from '@fluentui/react-icons';

export const TagsWithIcons: React.FC = () => (
  <>
    <Tag icon={<PersonRegular />}>John Doe</Tag>
    <Tag icon={<CalendarRegular />}>Today</Tag>
  </>
);
```

---

## InteractionTag

For clickable tags:

```typescript
import * as React from 'react';
import {
  InteractionTag,
  InteractionTagPrimary,
  InteractionTagSecondary,
} from '@fluentui/react-components';

export const ClickableTag: React.FC = () => (
  <InteractionTag>
    <InteractionTagPrimary onClick={() => console.log('clicked')}>
      Click Me
    </InteractionTagPrimary>
    <InteractionTagSecondary onClick={() => console.log('dismiss')} />
  </InteractionTag>
);
```

---

## With Secondary Text

```typescript
import * as React from 'react';
import { Tag } from '@fluentui/react-components';

export const TagWithSecondary: React.FC = () => (
  <Tag
    primaryText={{ children: 'John Doe' }}
    secondaryText={{ children: 'Software Engineer' }}
  />
);
```

---

## TagGroup

Use TagGroup for multiple related tags:

```typescript
import * as React from 'react';
import { TagGroup, Tag } from '@fluentui/react-components';

export const TagGroupExample: React.FC = () => (
  <TagGroup aria-label="Skills">
    <Tag>JavaScript</Tag>
    <Tag>TypeScript</Tag>
    <Tag>React</Tag>
  </TagGroup>
);
```

---

## Accessibility

- Use `aria-label` on TagGroup
- Dismissible tags have proper button semantics
- Use meaningful tag content

---

## Best Practices

### ✅ Do's

```typescript
<TagGroup aria-label="Selected filters">
  <Tag dismissible>Active Filter</Tag>
</TagGroup>
```

### ❌ Don'ts

```typescript
// Don't use tags for actions (use Button)
<Tag onClick={handleSubmit}>Submit</Tag>
```

---

## See Also

- [Badge](badge.md) - Status indicators
- [TagPicker](tag-picker.md) - Tag selection
- [Component Index](../00-component-index.md)