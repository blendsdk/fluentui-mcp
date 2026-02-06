# DataGrid

> **Parent**: [Table Index](00-table-index.md)
> **Topic**: High-level DataGrid abstraction

## Overview

DataGrid is a higher-level abstraction over Table primitives. It provides:

- **Declarative column definitions** with render functions
- **Built-in sorting, selection, and focus management**
- **Automatic wiring** of state to components
- **Less boilerplate** than Table primitives

---

## DataGrid vs Table

| Feature | Table (Primitives) | DataGrid |
|---------|-------------------|----------|
| Control level | Full manual control | Auto-wired |
| State management | External (useTableFeatures) | Internal or props |
| Column definitions | Manual rendering | Declarative functions |
| Focus management | Manual | Built-in |
| Boilerplate | More | Less |
| Flexibility | Maximum | Standard patterns |

---

## Basic DataGrid Example

```typescript
import * as React from 'react';
import {
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  TableCellLayout,
  createTableColumn,
} from '@fluentui/react-components';
import type { TableColumnDefinition } from '@fluentui/react-components';

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

const columns: TableColumnDefinition<Item>[] = [
  createTableColumn<Item>({
    columnId: 'name',
    renderHeaderCell: () => 'Name',
    renderCell: (item) => <TableCellLayout>{item.name}</TableCellLayout>,
  }),
  createTableColumn<Item>({
    columnId: 'status',
    renderHeaderCell: () => 'Status',
    renderCell: (item) => item.status,
  }),
  createTableColumn<Item>({
    columnId: 'date',
    renderHeaderCell: () => 'Date',
    renderCell: (item) => item.date,
  }),
];

export const BasicDataGrid: React.FC = () => (
  <DataGrid
    items={items}
    columns={columns}
    getRowId={(item) => item.id}
  >
    <DataGridHeader>
      <DataGridRow>
        {({ renderHeaderCell }) => (
          <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
        )}
      </DataGridRow>
    </DataGridHeader>
    <DataGridBody<Item>>
      {({ item, rowId }) => (
        <DataGridRow<Item> key={rowId}>
          {({ renderCell }) => (
            <DataGridCell>{renderCell(item)}</DataGridCell>
          )}
        </DataGridRow>
      )}
    </DataGridBody>
  </DataGrid>
);
```

---

## DataGrid Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `TItem[]` | Required | Data array |
| `columns` | `TableColumnDefinition<TItem>[]` | Required | Column definitions |
| `getRowId` | `(item) => TableRowId` | Index | Row ID generator |
| `sortable` | `boolean` | `false` | Enable sorting |
| `selectionMode` | `'single' \| 'multiselect'` | - | Enable selection |
| `focusMode` | `'none' \| 'cell' \| 'row_unstable' \| 'composite'` | `'cell'` | Focus behavior |
| `size` | `'extra-small' \| 'small' \| 'medium'` | `'medium'` | Size |
| `subtleSelection` | `boolean` | `false` | Subtle selection style |
| `selectionAppearance` | `'brand' \| 'neutral'` | `'brand'` | Selection highlight |

---

## Column Definition

```typescript
interface TableColumnDefinition<TItem> {
  columnId: TableColumnId;
  compare?: (a: TItem, b: TItem) => number;
  renderHeaderCell: (data?: unknown) => React.ReactNode;
  renderCell: (item: TItem) => React.ReactNode;
}
```

### Complete Column Example

```typescript
import { Avatar, TableCellLayout } from '@fluentui/react-components';
import { DocumentRegular } from '@fluentui/react-icons';

const columns: TableColumnDefinition<Item>[] = [
  createTableColumn<Item>({
    columnId: 'file',
    // Sorting comparison (optional)
    compare: (a, b) => a.file.name.localeCompare(b.file.name),
    // Header cell content
    renderHeaderCell: () => 'File',
    // Body cell content
    renderCell: (item) => (
      <TableCellLayout media={<DocumentRegular />}>
        {item.file.name}
      </TableCellLayout>
    ),
  }),
  createTableColumn<Item>({
    columnId: 'author',
    compare: (a, b) => a.author.name.localeCompare(b.author.name),
    renderHeaderCell: () => 'Author',
    renderCell: (item) => (
      <TableCellLayout
        media={<Avatar name={item.author.name} size={24} />}
      >
        {item.author.name}
      </TableCellLayout>
    ),
  }),
];
```

---

## DataGrid with Sorting

```typescript
import * as React from 'react';
import {
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  TableCellLayout,
  createTableColumn,
} from '@fluentui/react-components';
import type { TableColumnDefinition } from '@fluentui/react-components';

interface Item {
  id: string;
  name: string;
  value: number;
}

const items: Item[] = [
  { id: '1', name: 'Alpha', value: 30 },
  { id: '2', name: 'Beta', value: 10 },
  { id: '3', name: 'Gamma', value: 20 },
];

const columns: TableColumnDefinition<Item>[] = [
  createTableColumn<Item>({
    columnId: 'name',
    compare: (a, b) => a.name.localeCompare(b.name),
    renderHeaderCell: () => 'Name',
    renderCell: (item) => item.name,
  }),
  createTableColumn<Item>({
    columnId: 'value',
    compare: (a, b) => a.value - b.value,
    renderHeaderCell: () => 'Value',
    renderCell: (item) => item.value,
  }),
];

export const SortableDataGrid: React.FC = () => (
  <DataGrid
    items={items}
    columns={columns}
    sortable
    defaultSortState={{ sortColumn: 'name', sortDirection: 'ascending' }}
    getRowId={(item) => item.id}
  >
    <DataGridHeader>
      <DataGridRow>
        {({ renderHeaderCell }) => (
          <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
        )}
      </DataGridRow>
    </DataGridHeader>
    <DataGridBody<Item>>
      {({ item, rowId }) => (
        <DataGridRow<Item> key={rowId}>
          {({ renderCell }) => (
            <DataGridCell>{renderCell(item)}</DataGridCell>
          )}
        </DataGridRow>
      )}
    </DataGridBody>
  </DataGrid>
);
```

---

## DataGrid with Selection

```typescript
import * as React from 'react';
import {
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  createTableColumn,
} from '@fluentui/react-components';
import type { TableColumnDefinition, TableRowId } from '@fluentui/react-components';

interface Item {
  id: string;
  name: string;
}

const items: Item[] = [
  { id: '1', name: 'Item 1' },
  { id: '2', name: 'Item 2' },
  { id: '3', name: 'Item 3' },
];

const columns: TableColumnDefinition<Item>[] = [
  createTableColumn<Item>({
    columnId: 'name',
    renderHeaderCell: () => 'Name',
    renderCell: (item) => item.name,
  }),
];

export const SelectableDataGrid: React.FC = () => {
  const [selectedItems, setSelectedItems] = React.useState<Set<TableRowId>>(
    new Set(['1'])
  );

  return (
    <DataGrid
      items={items}
      columns={columns}
      selectionMode="multiselect"
      selectedItems={selectedItems}
      onSelectionChange={(e, data) => setSelectedItems(data.selectedItems)}
      getRowId={(item) => item.id}
    >
      <DataGridHeader>
        <DataGridRow
          selectionCell={{ checkboxIndicator: { 'aria-label': 'Select all rows' } }}
        >
          {({ renderHeaderCell }) => (
            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
          )}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<Item>>
        {({ item, rowId }) => (
          <DataGridRow<Item>
            key={rowId}
            selectionCell={{ checkboxIndicator: { 'aria-label': 'Select row' } }}
          >
            {({ renderCell }) => (
              <DataGridCell>{renderCell(item)}</DataGridCell>
            )}
          </DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>
  );
};
```

---

## Focus Modes

DataGrid supports different focus behaviors:

### Cell Focus (Default)

```typescript
<DataGrid focusMode="cell">
  {/* Arrow keys navigate between cells */}
</DataGrid>
```

### Composite Focus

```typescript
<DataGrid focusMode="composite">
  {/* Tab into row, then arrow keys navigate within row */}
</DataGrid>
```

### Row Focus (Unstable)

```typescript
<DataGrid focusMode="row_unstable">
  {/* Focus on entire rows */}
</DataGrid>
```

### No Focus Management

```typescript
<DataGrid focusMode="none">
  {/* No special focus handling */}
</DataGrid>
```

---

## Complete Example: Sorting + Selection

```typescript
import * as React from 'react';
import {
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  TableCellLayout,
  Avatar,
  createTableColumn,
  PresenceBadgeStatus,
} from '@fluentui/react-components';
import type { TableColumnDefinition } from '@fluentui/react-components';
import { DocumentRegular, FolderRegular, VideoRegular } from '@fluentui/react-icons';

interface Item {
  file: { label: string; icon: React.ReactNode };
  author: { label: string; status: PresenceBadgeStatus };
  lastUpdated: { label: string; timestamp: number };
}

const items: Item[] = [
  {
    file: { label: 'Meeting notes', icon: <DocumentRegular /> },
    author: { label: 'Max Mustermann', status: 'available' },
    lastUpdated: { label: '7h ago', timestamp: 3 },
  },
  {
    file: { label: 'Project folder', icon: <FolderRegular /> },
    author: { label: 'Erika Mustermann', status: 'busy' },
    lastUpdated: { label: 'Yesterday', timestamp: 2 },
  },
  {
    file: { label: 'Training video', icon: <VideoRegular /> },
    author: { label: 'John Doe', status: 'away' },
    lastUpdated: { label: 'Last week', timestamp: 1 },
  },
];

const columns: TableColumnDefinition<Item>[] = [
  createTableColumn<Item>({
    columnId: 'file',
    compare: (a, b) => a.file.label.localeCompare(b.file.label),
    renderHeaderCell: () => 'File',
    renderCell: (item) => (
      <TableCellLayout media={item.file.icon}>
        {item.file.label}
      </TableCellLayout>
    ),
  }),
  createTableColumn<Item>({
    columnId: 'author',
    compare: (a, b) => a.author.label.localeCompare(b.author.label),
    renderHeaderCell: () => 'Author',
    renderCell: (item) => (
      <TableCellLayout
        media={
          <Avatar
            name={item.author.label}
            badge={{ status: item.author.status }}
            size={24}
          />
        }
      >
        {item.author.label}
      </TableCellLayout>
    ),
  }),
  createTableColumn<Item>({
    columnId: 'lastUpdated',
    compare: (a, b) => a.lastUpdated.timestamp - b.lastUpdated.timestamp,
    renderHeaderCell: () => 'Last Updated',
    renderCell: (item) => item.lastUpdated.label,
  }),
];

export const FullFeaturedDataGrid: React.FC = () => (
  <DataGrid
    items={items}
    columns={columns}
    sortable
    selectionMode="multiselect"
    getRowId={(item) => item.file.label}
    focusMode="composite"
    style={{ minWidth: '550px' }}
  >
    <DataGridHeader>
      <DataGridRow
        selectionCell={{ checkboxIndicator: { 'aria-label': 'Select all rows' } }}
      >
        {({ renderHeaderCell }) => (
          <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
        )}
      </DataGridRow>
    </DataGridHeader>
    <DataGridBody<Item>>
      {({ item, rowId }) => (
        <DataGridRow<Item>
          key={rowId}
          selectionCell={{ checkboxIndicator: { 'aria-label': 'Select row' } }}
        >
          {({ renderCell }) => (
            <DataGridCell>{renderCell(item)}</DataGridCell>
          )}
        </DataGridRow>
      )}
    </DataGridBody>
  </DataGrid>
);
```

---

## Controlled Sort State

```typescript
import * as React from 'react';
import {
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  createTableColumn,
} from '@fluentui/react-components';
import type { TableColumnDefinition, SortDirection, TableColumnId } from '@fluentui/react-components';

interface SortState {
  sortColumn: TableColumnId | undefined;
  sortDirection: SortDirection;
}

export const ControlledSortDataGrid: React.FC = () => {
  const [sortState, setSortState] = React.useState<SortState>({
    sortColumn: 'name',
    sortDirection: 'ascending',
  });

  return (
    <DataGrid
      items={items}
      columns={columns}
      sortable
      sortState={sortState}
      onSortChange={(e, nextState) => setSortState(nextState)}
      getRowId={(item) => item.id}
    >
      {/* ... */}
    </DataGrid>
  );
};
```

---

## DataGridRow Props

| Prop | Type | Description |
|------|------|-------------|
| `selectionCell` | `DataGridSelectionCellProps` | Props for selection cell |
| `children` | `CellRenderFunction` | Render function for cells |

### CellRenderFunction

```typescript
type CellRenderFunction = (column: {
  columnId: TableColumnId;
  renderCell: (item: TItem) => React.ReactNode;
  renderHeaderCell: () => React.ReactNode;
}) => React.ReactNode;
```

---

## DataGridBody Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `RowRenderFunction` | Render function for rows |

### RowRenderFunction

```typescript
type RowRenderFunction<TItem> = (row: {
  item: TItem;
  rowId: TableRowId;
}) => React.ReactNode;
```

---

## Subtle Selection

For less prominent selection highlighting:

```typescript
<DataGrid
  items={items}
  columns={columns}
  selectionMode="multiselect"
  subtleSelection
  selectionAppearance="neutral"
>
```

---

## Accessibility

- DataGrid automatically manages focus
- Selection cells have proper ARIA labels
- Sortable headers announce sort state
- Use `composite` focus mode for complex cells

```typescript
<DataGrid
  aria-label="Document list"
  focusMode="composite"
  selectionMode="multiselect"
>
  <DataGridRow
    selectionCell={{
      checkboxIndicator: { 'aria-label': 'Select all documents' }
    }}
  >
```

---

## Best Practices

### ✅ Do's

```typescript
// Memoize column definitions
const columns = React.useMemo(() => [...], []);

// Provide stable getRowId
getRowId={(item) => item.id}

// Use descriptive aria-labels
<DataGrid aria-label="User management table">
```

### ❌ Don'ts

```typescript
// Don't create columns inline on every render
<DataGrid columns={[createTableColumn(...)]} /> // Recreates every render

// Don't use index as row ID
getRowId={(item, index) => index} // Unstable on sort/filter

// Don't forget selection cell aria-labels
selectionCell={{}} // Missing aria-label
```

---

## See Also

- [Table Index](00-table-index.md)
- [Table Basics](01-table-basic.md) - For custom table needs
- [Column Sizing](05-column-sizing.md)
- [Virtualization](06-virtualization.md) - For large datasets