# Table Sorting

> **Parent**: [Table Index](00-table-index.md)
> **Topic**: Column sorting functionality

## Overview

Table sorting enables users to sort data by clicking column headers. FluentUI v9 provides:

- **Ascending/descending** sort directions
- **Visual indicators** for sort state
- **Controlled and uncontrolled** modes
- **Custom comparison** functions per column

---

## Key Components & Hooks

| Item | Description |
|------|-------------|
| `useTableSort` | Hook plugin for sort state |
| `useTableFeatures` | Main hook that accepts sort plugin |
| `createTableColumn` | Define columns with `compare` function |
| `TableHeaderCell` | Displays sort direction indicator |

---

## Basic Sorting Example

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
  useTableFeatures,
  useTableSort,
  createTableColumn,
} from '@fluentui/react-components';
import type { TableColumnDefinition, TableColumnId } from '@fluentui/react-components';

interface Item {
  id: string;
  name: string;
  status: string;
  date: string;
  timestamp: number;
}

const items: Item[] = [
  { id: '1', name: 'Meeting notes', status: 'Draft', date: '7h ago', timestamp: 3 },
  { id: '2', name: 'Presentation', status: 'Published', date: 'Yesterday', timestamp: 2 },
  { id: '3', name: 'Report', status: 'Review', date: 'Tue at 9:30 AM', timestamp: 1 },
  { id: '4', name: 'Budget', status: 'Final', date: 'Last week', timestamp: 0 },
];

// Define columns with compare functions for sorting
const columns: TableColumnDefinition<Item>[] = [
  createTableColumn<Item>({
    columnId: 'name',
    compare: (a, b) => a.name.localeCompare(b.name),
  }),
  createTableColumn<Item>({
    columnId: 'status',
    compare: (a, b) => a.status.localeCompare(b.status),
  }),
  createTableColumn<Item>({
    columnId: 'date',
    compare: (a, b) => a.timestamp - b.timestamp, // Numeric comparison
  }),
];

export const SortableTable: React.FC = () => {
  const {
    getRows,
    sort: { getSortDirection, toggleColumnSort, sort },
  } = useTableFeatures(
    { columns, items },
    [
      useTableSort({
        defaultSortState: { sortColumn: 'name', sortDirection: 'ascending' },
      }),
    ]
  );

  // Helper to create header click props
  const headerSortProps = (columnId: TableColumnId) => ({
    onClick: (e: React.MouseEvent) => toggleColumnSort(e, columnId),
    sortDirection: getSortDirection(columnId),
  });

  // Apply sorting to rows
  const rows = sort(getRows());

  return (
    <Table sortable aria-label="Sortable table">
      <TableHeader>
        <TableRow>
          <TableHeaderCell {...headerSortProps('name')}>Name</TableHeaderCell>
          <TableHeaderCell {...headerSortProps('status')}>Status</TableHeaderCell>
          <TableHeaderCell {...headerSortProps('date')}>Date</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(({ item }) => (
          <TableRow key={item.id}>
            <TableCell>
              <TableCellLayout>{item.name}</TableCellLayout>
            </TableCell>
            <TableCell>{item.status}</TableCell>
            <TableCell>{item.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
```

---

## Column Compare Functions

Define how each column should be sorted:

### String Comparison

```typescript
createTableColumn<Item>({
  columnId: 'name',
  compare: (a, b) => a.name.localeCompare(b.name),
})
```

### Numeric Comparison

```typescript
createTableColumn<Item>({
  columnId: 'price',
  compare: (a, b) => a.price - b.price,
})
```

### Date Comparison

```typescript
createTableColumn<Item>({
  columnId: 'createdAt',
  compare: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
})
```

### Boolean Comparison

```typescript
createTableColumn<Item>({
  columnId: 'active',
  compare: (a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1),
})
```

### Nested Property Comparison

```typescript
createTableColumn<Item>({
  columnId: 'author',
  compare: (a, b) => a.author.name.localeCompare(b.author.name),
})
```

---

## Controlled Sorting

Manage sort state externally for full control:

```typescript
import * as React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
  useTableFeatures,
  useTableSort,
  createTableColumn,
  Button,
} from '@fluentui/react-components';
import type { 
  TableColumnDefinition, 
  TableColumnId, 
  SortDirection 
} from '@fluentui/react-components';

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
  }),
  createTableColumn<Item>({
    columnId: 'value',
    compare: (a, b) => a.value - b.value,
  }),
];

interface SortState {
  sortColumn: TableColumnId | undefined;
  sortDirection: SortDirection;
}

export const ControlledSortTable: React.FC = () => {
  // Controlled sort state
  const [sortState, setSortState] = React.useState<SortState>({
    sortColumn: 'name',
    sortDirection: 'ascending',
  });

  const {
    getRows,
    sort: { getSortDirection, toggleColumnSort, sort },
  } = useTableFeatures(
    { columns, items },
    [
      useTableSort({
        sortState,
        onSortChange: (e, nextState) => {
          setSortState(nextState);
        },
      }),
    ]
  );

  const headerSortProps = (columnId: TableColumnId) => ({
    onClick: (e: React.MouseEvent) => toggleColumnSort(e, columnId),
    sortDirection: getSortDirection(columnId),
  });

  const rows = sort(getRows());

  // Programmatic sort control
  const sortByName = () => setSortState({ sortColumn: 'name', sortDirection: 'ascending' });
  const sortByValueDesc = () => setSortState({ sortColumn: 'value', sortDirection: 'descending' });
  const clearSort = () => setSortState({ sortColumn: undefined, sortDirection: 'ascending' });

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <Button onClick={sortByName}>Sort by Name (A-Z)</Button>
        <Button onClick={sortByValueDesc}>Sort by Value (High-Low)</Button>
        <Button onClick={clearSort}>Clear Sort</Button>
        <span>
          Current: {sortState.sortColumn || 'none'} ({sortState.sortDirection})
        </span>
      </div>
      <Table sortable aria-label="Controlled sort table">
        <TableHeader>
          <TableRow>
            <TableHeaderCell {...headerSortProps('name')}>Name</TableHeaderCell>
            <TableHeaderCell {...headerSortProps('value')}>Value</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(({ item }) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
```

---

## useTableSort API

### Options

| Option | Type | Description |
|--------|------|-------------|
| `defaultSortState` | `SortState` | Initial sort state (uncontrolled) |
| `sortState` | `SortState` | Current sort state (controlled) |
| `onSortChange` | `(e, state) => void` | Sort change callback |

### SortState Type

```typescript
interface SortState {
  sortColumn: TableColumnId | undefined;
  sortDirection: 'ascending' | 'descending';
}
```

### Returned State

| Property | Type | Description |
|----------|------|-------------|
| `sortDirection` | `SortDirection` | Current sort direction |
| `sortColumn` | `TableColumnId \| undefined` | Currently sorted column |
| `getSortDirection` | `(columnId) => SortDirection \| undefined` | Get column's sort direction |
| `toggleColumnSort` | `(e, columnId) => void` | Toggle sort on a column |
| `setColumnSort` | `(e, columnId, direction) => void` | Set specific sort |
| `sort` | `(rows) => rows` | Apply sorting to row array |

---

## Sorting with Selection

Combine sorting and selection:

```typescript
import * as React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
  TableSelectionCell,
  useTableFeatures,
  useTableSort,
  useTableSelection,
  createTableColumn,
} from '@fluentui/react-components';
import type { TableColumnDefinition, TableColumnId } from '@fluentui/react-components';

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
  }),
  createTableColumn<Item>({
    columnId: 'value',
    compare: (a, b) => a.value - b.value,
  }),
];

export const SortableSelectableTable: React.FC = () => {
  const {
    getRows,
    sort: { getSortDirection, toggleColumnSort, sort },
    selection: { allRowsSelected, someRowsSelected, toggleAllRows, toggleRow, isRowSelected },
  } = useTableFeatures(
    { columns, items },
    [
      useTableSort({ defaultSortState: { sortColumn: 'name', sortDirection: 'ascending' } }),
      useTableSelection({ selectionMode: 'multiselect' }),
    ]
  );

  const headerSortProps = (columnId: TableColumnId) => ({
    onClick: (e: React.MouseEvent) => toggleColumnSort(e, columnId),
    sortDirection: getSortDirection(columnId),
  });

  // First apply sort, then enhance with selection
  const rows = sort(
    getRows((row) => ({
      ...row,
      selected: isRowSelected(row.rowId),
    }))
  );

  return (
    <Table sortable aria-label="Sortable and selectable table">
      <TableHeader>
        <TableRow>
          <TableSelectionCell
            checked={allRowsSelected ? true : someRowsSelected ? 'mixed' : false}
            onClick={toggleAllRows}
            checkboxIndicator={{ 'aria-label': 'Select all rows' }}
          />
          <TableHeaderCell {...headerSortProps('name')}>Name</TableHeaderCell>
          <TableHeaderCell {...headerSortProps('value')}>Value</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(({ item, selected, rowId }) => (
          <TableRow
            key={item.id}
            onClick={(e) => toggleRow(e, rowId)}
            aria-selected={selected}
            appearance={selected ? 'brand' : 'none'}
          >
            <TableSelectionCell
              checked={selected}
              checkboxIndicator={{ 'aria-label': 'Select row' }}
            />
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
```

---

## Columns Without Sort

Make specific columns non-sortable:

```typescript
// Column with no compare function - not sortable
const columns: TableColumnDefinition<Item>[] = [
  createTableColumn<Item>({
    columnId: 'name',
    compare: (a, b) => a.name.localeCompare(b.name), // Sortable
  }),
  createTableColumn<Item>({
    columnId: 'actions', // No compare - not sortable
  }),
];

// In header, don't add sort props to non-sortable columns
<TableHeaderCell>Actions</TableHeaderCell> // No onClick or sortDirection
```

---

## TableHeaderCell Props for Sorting

| Prop | Type | Description |
|------|------|---------|
| `sortDirection` | `'ascending' \| 'descending' \| undefined` | Current sort state |
| `onClick` | `(e) => void` | Click handler for toggling sort |

When `sortable` is `true` on Table and `sortDirection` is provided:
- Header cell renders as a button
- Sort indicator icon appears
- Focus styling is applied

---

## Accessibility

- `sortable` prop on `Table` enables ARIA sorting attributes
- `sortDirection` on `TableHeaderCell` sets `aria-sort`
- Header cells become buttons for keyboard interaction
- Screen readers announce sort state changes

```typescript
// Accessible sortable table
<Table sortable aria-label="User list sorted by name">
  <TableHeader>
    <TableRow>
      <TableHeaderCell sortDirection="ascending">
        Name {/* aria-sort="ascending" applied automatically */}
      </TableHeaderCell>
    </TableRow>
  </TableHeader>
</Table>
```

---

## Best Practices

### ✅ Do's

```typescript
// Provide meaningful compare functions
compare: (a, b) => a.name.localeCompare(b.name)

// Use stable sort indicators
const sortDirection = getSortDirection(columnId);

// Keep sorted data predictable
// Secondary sort for equal values
compare: (a, b) => {
  const primary = a.status.localeCompare(b.status);
  return primary !== 0 ? primary : a.name.localeCompare(b.name);
}
```

### ❌ Don'ts

```typescript
// Don't forget to apply sort() to rows
const rows = getRows(); // Missing sort()!

// Don't use inconsistent comparison types
compare: (a, b) => a.value - b.value // Don't mix with string comparisons

// Don't make all columns sortable if it doesn't make sense
// Actions, checkboxes columns shouldn't be sortable
```

---

## Performance Tips

1. **Memoize column definitions** - Prevent re-creating on every render
2. **Use stable comparison functions** - Define outside component or memoize
3. **Consider large datasets** - For 1000+ rows, consider server-side sorting

```typescript
// Memoized columns
const columns = React.useMemo<TableColumnDefinition<Item>[]>(
  () => [
    createTableColumn({
      columnId: 'name',
      compare: (a, b) => a.name.localeCompare(b.name),
    }),
  ],
  []
);
```

---

## See Also

- [Table Index](00-table-index.md)
- [Table Basics](01-table-basic.md)
- [Selection](02-table-selection.md)
- [DataGrid](04-datagrid.md) - Built-in sorting with `sortable` prop