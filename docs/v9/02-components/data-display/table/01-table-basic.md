# Table Basics

> **Parent**: [Table Index](00-table-index.md)
> **Topic**: Basic Table structure and components

## Overview

The Table primitive components provide building blocks for creating custom tabular layouts. They follow semantic HTML table structure with additional FluentUI styling and accessibility features.

---

## Component Hierarchy

```
Table
├── TableHeader
│   └── TableRow
│       ├── TableHeaderCell
│       └── TableHeaderCell
└── TableBody
    └── TableRow
        ├── TableCell
        │   └── TableCellLayout (optional)
        └── TableCell
```

---

## Basic Table Example

```typescript
import * as React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from '@fluentui/react-components';

interface Item {
  id: string;
  name: string;
  status: string;
  date: string;
}

const items: Item[] = [
  { id: '1', name: 'Meeting notes', status: 'Draft', date: '7h ago' },
  { id: '2', name: 'Presentation', status: 'Published', date: 'Yesterday' },
  { id: '3', name: 'Report', status: 'Review', date: 'Tue at 9:30 AM' },
];

export const BasicTable: React.FC = () => (
  <Table aria-label="Basic table example">
    <TableHeader>
      <TableRow>
        <TableHeaderCell>Name</TableHeaderCell>
        <TableHeaderCell>Status</TableHeaderCell>
        <TableHeaderCell>Date</TableHeaderCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      {items.map((item) => (
        <TableRow key={item.id}>
          <TableCell>{item.name}</TableCell>
          <TableCell>{item.status}</TableCell>
          <TableCell>{item.date}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
```

---

## Table Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'extra-small' \| 'small' \| 'medium'` | `'medium'` | Size of all table subcomponents |
| `sortable` | `boolean` | `false` | Makes header cells sortable buttons |
| `noNativeElements` | `boolean` | `false` | Render as divs with flexbox layout |

---

## Size Variants

```typescript
import * as React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  container: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL },
});

export const TableSizes: React.FC = () => {
  const styles = useStyles();
  
  const TableExample: React.FC<{ size: 'extra-small' | 'small' | 'medium' }> = ({ size }) => (
    <div>
      <h4>Size: {size}</h4>
      <Table size={size} aria-label={`${size} table`}>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Value</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Item 1</TableCell>
            <TableCell>Value 1</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Item 2</TableCell>
            <TableCell>Value 2</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className={styles.container}>
      <TableExample size="extra-small" />
      <TableExample size="small" />
      <TableExample size="medium" />
    </div>
  );
};
```

---

## TableCellLayout

`TableCellLayout` provides structured content with optional media (icon/avatar) support.

```typescript
import * as React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
  TableCellLayout,
  Avatar,
} from '@fluentui/react-components';
import { DocumentRegular, FolderRegular, VideoRegular } from '@fluentui/react-icons';

interface FileItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  author: string;
}

const items: FileItem[] = [
  { id: '1', name: 'Meeting notes', icon: <DocumentRegular />, author: 'John Doe' },
  { id: '2', name: 'Project folder', icon: <FolderRegular />, author: 'Jane Smith' },
  { id: '3', name: 'Training video', icon: <VideoRegular />, author: 'Bob Johnson' },
];

export const TableWithCellLayout: React.FC = () => (
  <Table aria-label="Table with cell layout">
    <TableHeader>
      <TableRow>
        <TableHeaderCell>File</TableHeaderCell>
        <TableHeaderCell>Author</TableHeaderCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      {items.map((item) => (
        <TableRow key={item.id}>
          <TableCell>
            <TableCellLayout media={item.icon}>
              {item.name}
            </TableCellLayout>
          </TableCell>
          <TableCell>
            <TableCellLayout
              media={<Avatar name={item.author} size={24} />}
            >
              {item.author}
            </TableCellLayout>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
```

### TableCellLayout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `media` | `Slot<'span'>` | - | Icon or avatar before content |
| `description` | `Slot<'span'>` | - | Secondary text below main content |
| `appearance` | `'primary'` | - | Primary cell emphasis |
| `truncate` | `boolean` | `false` | Truncate text with ellipsis |

---

## TableCellActions

Shows actions on row hover. Useful for edit/delete operations.

```typescript
import * as React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
  TableCellLayout,
  TableCellActions,
  Button,
} from '@fluentui/react-components';
import { EditRegular, DeleteRegular, MoreHorizontalRegular } from '@fluentui/react-icons';

interface Item {
  id: string;
  name: string;
  status: string;
}

const items: Item[] = [
  { id: '1', name: 'Document 1', status: 'Active' },
  { id: '2', name: 'Document 2', status: 'Draft' },
];

export const TableWithActions: React.FC = () => {
  const handleEdit = (id: string) => console.log('Edit:', id);
  const handleDelete = (id: string) => console.log('Delete:', id);

  return (
    <Table aria-label="Table with actions">
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <TableCellLayout>
                {item.name}
              </TableCellLayout>
              <TableCellActions>
                <Button
                  icon={<EditRegular />}
                  appearance="subtle"
                  aria-label="Edit"
                  onClick={() => handleEdit(item.id)}
                />
                <Button
                  icon={<DeleteRegular />}
                  appearance="subtle"
                  aria-label="Delete"
                  onClick={() => handleDelete(item.id)}
                />
                <Button
                  icon={<MoreHorizontalRegular />}
                  appearance="subtle"
                  aria-label="More options"
                />
              </TableCellActions>
            </TableCell>
            <TableCell>{item.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
```

---

## Non-Native Elements (Div-based)

Use `noNativeElements` for flexbox-based layout instead of native table elements.

```typescript
import * as React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from '@fluentui/react-components';

export const DivBasedTable: React.FC = () => (
  <Table noNativeElements aria-label="Div-based table">
    <TableHeader>
      <TableRow>
        <TableHeaderCell>Column 1</TableHeaderCell>
        <TableHeaderCell>Column 2</TableHeaderCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Cell 1</TableCell>
        <TableCell>Cell 2</TableCell>
      </TableRow>
    </TableBody>
  </Table>
);
```

**When to use `noNativeElements`:**
- Need flexbox-based layout control
- Using with virtualization libraries
- Complex nested content that doesn't fit table semantics

---

## Accessibility

### Required Attributes

```typescript
// Always provide aria-label for the table
<Table aria-label="Descriptive table name">

// Or use aria-labelledby with a heading
<h2 id="table-title">User List</h2>
<Table aria-labelledby="table-title">
```

### Keyboard Navigation

- **Tab**: Move between interactive elements
- **Arrow keys**: Navigate within rows (when using composite navigation)

---

## Best Practices

### ✅ Do's

```typescript
// Provide descriptive aria-label
<Table aria-label="Recent documents">

// Use TableCellLayout for consistent cell formatting
<TableCell>
  <TableCellLayout media={<Icon />}>Content</TableCellLayout>
</TableCell>

// Use semantic keys for rows
{items.map(item => <TableRow key={item.id}>...)}
```

### ❌ Don'ts

```typescript
// Don't omit aria-label
<Table> // Missing aria-label

// Don't use array index as key
{items.map((item, index) => <TableRow key={index}>...)}

// Don't mix native and non-native approaches inconsistently
```

---

## See Also

- [Table Index](00-table-index.md)
- [Selection](02-table-selection.md)
- [Sorting](03-table-sorting.md)
- [DataGrid](04-datagrid.md)