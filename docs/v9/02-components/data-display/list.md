# List

> **Package**: `@fluentui/react-list`
> **Import**: `import { List, ListItem } from '@fluentui/react-components'`
> **Category**: Data Display

## Overview

List displays a collection of items in a vertical arrangement. It provides semantic list structure with FluentUI styling and accessibility features.

---

## Components

| Component | Description |
|-----------|-------------|
| `List` | Root container for list items |
| `ListItem` | Individual list item |

---

## Basic Usage

```typescript
import * as React from 'react';
import { List, ListItem } from '@fluentui/react-components';

export const BasicList: React.FC = () => (
  <List>
    <ListItem>Item 1</ListItem>
    <ListItem>Item 2</ListItem>
    <ListItem>Item 3</ListItem>
  </List>
);
```

---

## List Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `'ul' \| 'ol'` | `'ul'` | HTML list element type |
| `navigationMode` | `'items' \| 'composite' \| 'none'` | `'items'` | Keyboard navigation mode |

---

## ListItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `'li'` | `'li'` | HTML element |

---

## Ordered vs Unordered List

```typescript
import * as React from 'react';
import { List, ListItem } from '@fluentui/react-components';

export const ListTypes: React.FC = () => (
  <div style={{ display: 'flex', gap: '32px' }}>
    {/* Unordered list (default) */}
    <div>
      <h4>Unordered</h4>
      <List>
        <ListItem>First item</ListItem>
        <ListItem>Second item</ListItem>
        <ListItem>Third item</ListItem>
      </List>
    </div>

    {/* Ordered list */}
    <div>
      <h4>Ordered</h4>
      <List as="ol">
        <ListItem>Step 1</ListItem>
        <ListItem>Step 2</ListItem>
        <ListItem>Step 3</ListItem>
      </List>
    </div>
  </div>
);
```

---

## List with Complex Content

```typescript
import * as React from 'react';
import {
  List,
  ListItem,
  Avatar,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingVerticalS,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
  name: {
    fontWeight: tokens.fontWeightSemibold,
  },
  email: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
});

interface User {
  id: string;
  name: string;
  email: string;
}

const users: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
];

export const UserList: React.FC = () => {
  const styles = useStyles();

  return (
    <List aria-label="User list">
      {users.map((user) => (
        <ListItem key={user.id} className={styles.listItem}>
          <Avatar name={user.name} />
          <div className={styles.content}>
            <span className={styles.name}>{user.name}</span>
            <span className={styles.email}>{user.email}</span>
          </div>
        </ListItem>
      ))}
    </List>
  );
};
```

---

## Interactive List Items

```typescript
import * as React from 'react';
import {
  List,
  ListItem,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { DeleteRegular, EditRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: tokens.spacingVerticalS,
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  actions: {
    display: 'flex',
    gap: tokens.spacingHorizontalXS,
  },
});

interface Task {
  id: string;
  title: string;
}

const tasks: Task[] = [
  { id: '1', title: 'Complete documentation' },
  { id: '2', title: 'Review pull requests' },
  { id: '3', title: 'Update dependencies' },
];

export const InteractiveList: React.FC = () => {
  const styles = useStyles();

  const handleEdit = (id: string) => console.log('Edit:', id);
  const handleDelete = (id: string) => console.log('Delete:', id);

  return (
    <List aria-label="Task list">
      {tasks.map((task) => (
        <ListItem key={task.id} className={styles.listItem}>
          <span>{task.title}</span>
          <div className={styles.actions}>
            <Button
              icon={<EditRegular />}
              appearance="subtle"
              aria-label={`Edit ${task.title}`}
              onClick={() => handleEdit(task.id)}
            />
            <Button
              icon={<DeleteRegular />}
              appearance="subtle"
              aria-label={`Delete ${task.title}`}
              onClick={() => handleDelete(task.id)}
            />
          </div>
        </ListItem>
      ))}
    </List>
  );
};
```

---

## Selectable List

```typescript
import * as React from 'react';
import {
  List,
  ListItem,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  listItem: {
    padding: tokens.spacingVerticalS,
    paddingLeft: tokens.spacingHorizontalM,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  selected: {
    backgroundColor: tokens.colorBrandBackground2,
    '&:hover': {
      backgroundColor: tokens.colorBrandBackground2Hover,
    },
  },
});

interface Item {
  id: string;
  label: string;
}

const items: Item[] = [
  { id: '1', label: 'Option A' },
  { id: '2', label: 'Option B' },
  { id: '3', label: 'Option C' },
];

export const SelectableList: React.FC = () => {
  const styles = useStyles();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  return (
    <List aria-label="Selectable list" role="listbox">
      {items.map((item) => {
        const isSelected = item.id === selectedId;
        return (
          <ListItem
            key={item.id}
            className={`${styles.listItem} ${isSelected ? styles.selected : ''}`}
            onClick={() => setSelectedId(item.id)}
            role="option"
            aria-selected={isSelected}
          >
            {item.label}
          </ListItem>
        );
      })}
    </List>
  );
};
```

---

## Nested Lists

```typescript
import * as React from 'react';
import { List, ListItem } from '@fluentui/react-components';

export const NestedList: React.FC = () => (
  <List aria-label="Nested list">
    <ListItem>
      Parent Item 1
      <List>
        <ListItem>Child Item 1.1</ListItem>
        <ListItem>Child Item 1.2</ListItem>
      </List>
    </ListItem>
    <ListItem>
      Parent Item 2
      <List>
        <ListItem>Child Item 2.1</ListItem>
        <ListItem>Child Item 2.2</ListItem>
      </List>
    </ListItem>
  </List>
);
```

---

## Navigation Modes

Control keyboard navigation behavior:

```typescript
// Items mode (default) - Tab between items
<List navigationMode="items">

// Composite mode - Arrow keys navigate, single Tab stop
<List navigationMode="composite">

// No keyboard management
<List navigationMode="none">
```

---

## Accessibility

- Uses semantic `<ul>` or `<ol>` elements
- ListItems render as `<li>` elements
- Keyboard navigation supported based on `navigationMode`
- Provide `aria-label` for the list

```typescript
<List aria-label="Shopping cart items">
  <ListItem>...</ListItem>
</List>

// For selectable lists, add appropriate ARIA roles
<List role="listbox" aria-label="Select an option">
  <ListItem role="option" aria-selected={isSelected}>
```

---

## When to Use List vs Other Components

| Use Case | Component |
|----------|-----------|
| Simple vertical list | **List** |
| Hierarchical data | [Tree](tree.md) |
| Tabular data | [Table](table/00-table-index.md) |
| Selectable options | [Listbox](../forms/combobox.md) |
| Navigation menu | [Menu](../navigation/menu.md) |

---

## Best Practices

### ✅ Do's

```typescript
// Provide aria-label for lists
<List aria-label="Recent files">

// Use semantic markup
<List as="ol">  {/* For ordered content */}
<List as="ul">  {/* For unordered content (default) */}

// Key list items properly
{items.map(item => <ListItem key={item.id}>...)}
```

### ❌ Don'ts

```typescript
// Don't use List for interactive selection (use Listbox)
<List> {/* For complex selection, consider other components */}

// Don't forget accessible names
<List> {/* Missing aria-label */}
```

---

## See Also

- [Component Index](../00-component-index.md)
- [Tree](tree.md) - Hierarchical data display
- [Table](table/00-table-index.md) - Tabular data display
- [Menu](../navigation/menu.md) - Navigation menus