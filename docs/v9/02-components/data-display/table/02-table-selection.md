# Table Selection

> **Parent**: [Table Index](00-table-index.md)
> **Topic**: Row selection (single and multi-select)

## Overview

Table selection allows users to select one or more rows for batch operations. FluentUI v9 provides:

- **Single selection** - One row at a time (radio-style)
- **Multi-selection** - Multiple rows with checkboxes
- **Controlled and uncontrolled** modes

---

## Key Components

| Component | Description |
|-----------|-------------|
| `TableSelectionCell` | Checkbox/radio cell for row selection |
| `useTableSelection` | Hook plugin for selection state |
| `useTableFeatures` | Main hook that accepts selection plugin |

---

## Multi-Select Example

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
  TableCellLayout,
  useTableFeatures,
  useTableSelection,
  createTableColumn,
} from '@fluentui/react-components';
import type { TableColumnDefinition, TableRowId } from '@fluentui/react-components';

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
  { id: '4', name: 'Budget', status: 'Final', date: 'Last week' },
];

const columns: TableColumnDefinition<Item>[] = [
  createTableColumn<Item>({ columnId: 'name' }),
  createTableColumn<Item>({ columnId: 'status' }),
  createTableColumn<Item>({ columnId: 'date' }),
];

export const MultiSelectTable: React.FC = () => {
  const {
    getRows,
    selection: {
      allRowsSelected,
      someRowsSelected,
      toggleAllRows,
      toggleRow,
      isRowSelected,
    },
  } = useTableFeatures(
    { columns, items },
    [
      useTableSelection({
        selectionMode: 'multiselect',
        defaultSelectedItems: new Set<TableRowId>(['1']), // Pre-select first item
      }),
    ]
  );

  const rows = getRows((row) => {
    const selected = isRowSelected(row.rowId);
    return {
      ...row,
      onClick: (e: React.MouseEvent) => toggleRow(e, row.rowId),
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === ' ') {
          e.preventDefault();
          toggleRow(e, row.rowId);
        }
      },
      selected,
      appearance: selected ? ('brand' as const) : ('none' as const),
    };
  });

  const toggleAllKeydown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === ' ') {
        toggleAllRows(e);
        e.preventDefault();
      }
    },
    [toggleAllRows]
  );

  return (
    <Table aria-label="Table with multi-select">
      <TableHeader>
        <TableRow>
          <TableSelectionCell
            checked={allRowsSelected ? true : someRowsSelected ? 'mixed' : false}
            onClick={toggleAllRows}
            onKeyDown={toggleAllKeydown}
            checkboxIndicator={{ 'aria-label': 'Select all rows' }}
          />
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Date</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(({ item, selected, onClick, onKeyDown, appearance }) => (
          <TableRow
            key={item.id}
            onClick={onClick}
            onKeyDown={onKeyDown}
            aria-selected={selected}
            appearance={appearance}
          >
            <TableSelectionCell
              checked={selected}
              checkboxIndicator={{ 'aria-label': 'Select row' }}
            />
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

## Single Select Example

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
  useTableSelection,
  createTableColumn,
} from '@fluentui/react-components';
import type { TableColumnDefinition, TableRowId } from '@fluentui/react-components';

interface Item {
  id: string;
  name: string;
  value: string;
}

const items: Item[] = [
  { id: '1', name: 'Option A', value: 'Value A' },
  { id: '2', name: 'Option B', value: 'Value B' },
  { id: '3', name: 'Option C', value: 'Value C' },
];

const columns: TableColumnDefinition<Item>[] = [
  createTableColumn<Item>({ columnId: 'name' }),
  createTableColumn<Item>({ columnId: 'value' }),
];

export const SingleSelectTable: React.FC = () => {
  const {
    getRows,
    selection: { toggleRow, isRowSelected },
  } = useTableFeatures(
    { columns, items },
    [
      useTableSelection({
        selectionMode: 'single',
      }),
    ]
  );

  const rows = getRows((row) => {
    const selected = isRowSelected(row.rowId);
    return {
      ...row,
      onClick: (e: React.MouseEvent) => toggleRow(e, row.rowId),
      selected,
      appearance: selected ? ('brand' as const) : ('none' as const),
    };
  });

  return (
    <Table aria-label="Table with single select">
      <TableHeader>
        <TableRow>
          <TableSelectionCell type="radio" invisible />
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Value</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(({ item, selected, onClick, appearance }) => (
          <TableRow
            key={item.id}
            onClick={onClick}
            aria-selected={selected}
            appearance={appearance}
          >
            <TableSelectionCell
              checked={selected}
              type="radio"
              radioIndicator={{ 'aria-label': 'Select row' }}
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

## Controlled Selection

For controlled selection, manage the state externally.

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
  useTableSelection,
  createTableColumn,
  Button,
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
  createTableColumn<Item>({ columnId: 'name' }),
];

export const ControlledSelectionTable: React.FC = () => {
  // Controlled state
  const [selectedItems, setSelectedItems] = React.useState<Set<TableRowId>>(
    new Set(['1'])
  );

  const {
    getRows,
    selection: {
      allRowsSelected,
      someRowsSelected,
      toggleAllRows,
      toggleRow,
      isRowSelected,
    },
  } = useTableFeatures(
    { columns, items },
    [
      useTableSelection({
        selectionMode: 'multiselect',
        selectedItems,
        onSelectionChange: (e, data) => {
          setSelectedItems(data.selectedItems);
        },
      }),
    ]
  );

  const rows = getRows((row) => ({
    ...row,
    selected: isRowSelected(row.rowId),
  }));

  const clearSelection = () => setSelectedItems(new Set());
  const selectAll = () => setSelectedItems(new Set(items.map((i) => i.id)));

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <Button onClick={selectAll}>Select All</Button>
        <Button onClick={clearSelection}>Clear Selection</Button>
        <span>Selected: {selectedItems.size} items</span>
      </div>
      <Table aria-label="Controlled selection table">
        <TableHeader>
          <TableRow>
            <TableSelectionCell
              checked={allRowsSelected ? true : someRowsSelected ? 'mixed' : false}
              onClick={toggleAllRows}
              checkboxIndicator={{ 'aria-label': 'Select all rows' }}
            />
            <TableHeaderCell>Name</TableHeaderCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
```

---

## useTableSelection API

### Options

| Option | Type | Description |
|--------|------|-------------|
| `selectionMode` | `'single' \| 'multiselect'` | Selection mode |
| `defaultSelectedItems` | `Set<TableRowId>` | Initial selection (uncontrolled) |
| `selectedItems` | `Set<TableRowId>` | Current selection (controlled) |
| `onSelectionChange` | `(e, data) => void` | Selection change callback |

### Returned State

| Property | Type | Description |
|----------|------|-------------|
| `selectedRows` | `Set<TableRowId>` | Currently selected row IDs |
| `allRowsSelected` | `boolean` | Whether all rows are selected |
| `someRowsSelected` | `boolean` | Whether some (but not all) rows are selected |
| `isRowSelected` | `(rowId) => boolean` | Check if a row is selected |
| `toggleRow` | `(e, rowId) => void` | Toggle row selection |
| `toggleAllRows` | `(e) => void` | Toggle all rows |
| `selectRow` | `(e, rowId) => void` | Select a specific row |
| `deselectRow` | `(e, rowId) => void` | Deselect a specific row |
| `clearRows` | `(e) => void` | Clear all selections |

---

## TableSelectionCell Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean \| 'mixed'` | - | Selection state |
| `type` | `'checkbox' \| 'radio'` | `'checkbox'` | Selection indicator type |
| `invisible` | `boolean` | `false` | Hide indicator (for header with single select) |
| `checkboxIndicator` | `Slot` | - | Checkbox slot props |
| `radioIndicator` | `Slot` | - | Radio slot props |

---

## Subtle Selection Appearance

For less prominent selection highlighting:

```typescript
<TableRow
  aria-selected={selected}
  appearance={selected ? 'neutral' : 'none'} // Use 'neutral' instead of 'brand'
>
```

---

## Selection with Actions

Combine selection with batch actions:

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
  useTableSelection,
  createTableColumn,
  Button,
  Toolbar,
  ToolbarButton,
} from '@fluentui/react-components';
import { DeleteRegular, ArchiveRegular } from '@fluentui/react-icons';
import type { TableColumnDefinition, TableRowId } from '@fluentui/react-components';

interface Item {
  id: string;
  name: string;
}

const items: Item[] = [
  { id: '1', name: 'Document 1' },
  { id: '2', name: 'Document 2' },
  { id: '3', name: 'Document 3' },
];

const columns: TableColumnDefinition<Item>[] = [
  createTableColumn<Item>({ columnId: 'name' }),
];

export const SelectionWithActions: React.FC = () => {
  const {
    getRows,
    selection: {
      selectedRows,
      allRowsSelected,
      someRowsSelected,
      toggleAllRows,
      toggleRow,
      isRowSelected,
      clearRows,
    },
  } = useTableFeatures(
    { columns, items },
    [useTableSelection({ selectionMode: 'multiselect' })]
  );

  const rows = getRows((row) => ({
    ...row,
    selected: isRowSelected(row.rowId),
  }));

  const handleDelete = () => {
    console.log('Delete items:', Array.from(selectedRows));
    // Perform delete action
  };

  const handleArchive = () => {
    console.log('Archive items:', Array.from(selectedRows));
    // Perform archive action
  };

  const hasSelection = selectedRows.size > 0;

  return (
    <div>
      {hasSelection && (
        <Toolbar aria-label="Batch actions">
          <ToolbarButton
            icon={<DeleteRegular />}
            onClick={handleDelete}
          >
            Delete ({selectedRows.size})
          </ToolbarButton>
          <ToolbarButton
            icon={<ArchiveRegular />}
            onClick={handleArchive}
          >
            Archive
          </ToolbarButton>
          <Button appearance="subtle" onClick={(e) => clearRows(e)}>
            Clear Selection
          </Button>
        </Toolbar>
      )}
      <Table aria-label="Table with batch actions">
        <TableHeader>
          <TableRow>
            <TableSelectionCell
              checked={allRowsSelected ? true : someRowsSelected ? 'mixed' : false}
              onClick={toggleAllRows}
              checkboxIndicator={{ 'aria-label': 'Select all rows' }}
            />
            <TableHeaderCell>Name</TableHeaderCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
```

---

## Accessibility

- `TableSelectionCell` automatically adds proper ARIA attributes
- Always provide `aria-label` for checkbox/radio indicators
- Use `aria-selected` on rows to indicate selection state
- Keyboard users can use Space to toggle selection

---

## Best Practices

### ✅ Do's

```typescript
// Provide clear aria-labels
<TableSelectionCell
  checkboxIndicator={{ 'aria-label': 'Select row' }}
/>

// Handle keyboard selection
onKeyDown={(e) => {
  if (e.key === ' ') {
    e.preventDefault();
    toggleRow(e, rowId);
  }
}}

// Show visual feedback for selected rows
appearance={selected ? 'brand' : 'none'}
```

### ❌ Don'ts

```typescript
// Don't forget to set aria-selected
<TableRow> // Missing aria-selected

// Don't use inconsistent selection modes
// Stick to either single or multi-select per table
```

---

## See Also

- [Table Index](00-table-index.md)
- [Table Basics](01-table-basic.md)
- [Sorting](03-table-sorting.md)
- [DataGrid](04-datagrid.md) - Built-in selection support