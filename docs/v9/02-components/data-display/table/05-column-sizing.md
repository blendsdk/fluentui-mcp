# Column Sizing

> **Parent**: [Table Index](00-table-index.md)
> **Topic**: Resizable columns

## Overview

FluentUI v9 Table supports resizable columns through `useTableColumnSizing_unstable`. Features include:

- **Drag-to-resize** columns with mouse or touch
- **Keyboard resizing** for accessibility
- **Minimum, default, and ideal widths** per column
- **Controlled and uncontrolled** modes
- **Auto-fit** to container width

> **Note**: This feature is marked `_unstable` and API may change.

---

## Key Components & Hooks

| Item | Description |
|------|-------------|
| `useTableColumnSizing_unstable` | Hook plugin for column sizing |
| `useTableFeatures` | Main hook that accepts sizing plugin |
| `TableResizeHandle` | Visual resize handle (optional) |

---

## Basic Resizable Columns

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
  useTableColumnSizing_unstable,
  createTableColumn,
} from '@fluentui/react-components';
import type { TableColumnDefinition, TableColumnSizingOptions } from '@fluentui/react-components';

interface Item {
  id: string;
  name: string;
  description: string;
  status: string;
}

const items: Item[] = [
  { id: '1', name: 'Document 1', description: 'Important meeting notes', status: 'Active' },
  { id: '2', name: 'Document 2', description: 'Project specifications', status: 'Draft' },
  { id: '3', name: 'Document 3', description: 'Quarterly report summary', status: 'Review' },
];

const columns: TableColumnDefinition<Item>[] = [
  createTableColumn<Item>({
    columnId: 'name',
    renderHeaderCell: () => 'Name',
  }),
  createTableColumn<Item>({
    columnId: 'description',
    renderHeaderCell: () => 'Description',
  }),
  createTableColumn<Item>({
    columnId: 'status',
    renderHeaderCell: () => 'Status',
  }),
];

export const ResizableTable: React.FC = () => {
  // Column sizing options
  const columnSizingOptions: TableColumnSizingOptions = {
    name: {
      minWidth: 100,
      defaultWidth: 200,
      idealWidth: 200,
    },
    description: {
      minWidth: 150,
      defaultWidth: 300,
    },
    status: {
      minWidth: 80,
      defaultWidth: 100,
    },
  };

  const { getRows, columnSizing_unstable, tableRef } = useTableFeatures(
    { columns, items },
    [useTableColumnSizing_unstable({ columnSizingOptions })]
  );

  const rows = getRows();

  return (
    <div style={{ overflowX: 'auto' }}>
      <Table
        ref={tableRef}
        {...columnSizing_unstable.getTableProps()}
        aria-label="Resizable table"
      >
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHeaderCell
                key={column.columnId}
                {...columnSizing_unstable.getTableHeaderCellProps(column.columnId)}
              >
                {column.renderHeaderCell()}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(({ item }) => (
            <TableRow key={item.id}>
              <TableCell {...columnSizing_unstable.getTableCellProps('name')}>
                <TableCellLayout truncate>{item.name}</TableCellLayout>
              </TableCell>
              <TableCell {...columnSizing_unstable.getTableCellProps('description')}>
                <TableCellLayout truncate>{item.description}</TableCellLayout>
              </TableCell>
              <TableCell {...columnSizing_unstable.getTableCellProps('status')}>
                <TableCellLayout truncate>{item.status}</TableCellLayout>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
```

---

## Column Sizing Options

```typescript
interface TableColumnSizingOptions {
  [columnId: string]: {
    minWidth?: number;      // Minimum width (pixels)
    defaultWidth?: number;  // Initial width
    idealWidth?: number;    // Preferred width for auto-fit
    padding?: number;       // Cell padding (affects calculations)
    autoFitColumns?: boolean; // Per-column auto-fit override
  };
}
```

### Example Options

```typescript
const columnSizingOptions: TableColumnSizingOptions = {
  name: {
    minWidth: 100,       // Can't resize below 100px
    defaultWidth: 200,   // Starts at 200px
    idealWidth: 200,     // Target for auto-fit
  },
  description: {
    minWidth: 150,
    defaultWidth: 300,
  },
  actions: {
    minWidth: 60,
    defaultWidth: 60,    // Fixed-width column
  },
};
```

---

## Programmatic Width Control

Set column widths programmatically:

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
  useTableColumnSizing_unstable,
  createTableColumn,
  Input,
  Button,
} from '@fluentui/react-components';
import type { TableColumnDefinition, TableColumnSizingOptions } from '@fluentui/react-components';

export const ProgrammaticResizing: React.FC = () => {
  const [widthInput, setWidthInput] = React.useState('250');

  const columnSizingOptions: TableColumnSizingOptions = {
    name: { minWidth: 100, defaultWidth: 200 },
    value: { minWidth: 100, defaultWidth: 150 },
  };

  const { getRows, columnSizing_unstable, tableRef } = useTableFeatures(
    { columns, items },
    [useTableColumnSizing_unstable({ columnSizingOptions })]
  );

  const handleSetWidth = () => {
    const width = parseInt(widthInput, 10);
    if (!isNaN(width) && width >= 100) {
      columnSizing_unstable.setColumnWidth('name', width);
    }
  };

  const handleResetWidths = () => {
    // Set back to default widths
    columnSizing_unstable.setColumnWidth('name', 200);
    columnSizing_unstable.setColumnWidth('value', 150);
  };

  const rows = getRows();

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <label htmlFor="width-input">Name column width:</label>
        <Input
          id="width-input"
          type="number"
          value={widthInput}
          onChange={(e, data) => setWidthInput(data.value)}
          style={{ width: '100px' }}
        />
        <Button onClick={handleSetWidth}>Set Width</Button>
        <Button onClick={handleResetWidths}>Reset</Button>
      </div>
      <Table
        ref={tableRef}
        {...columnSizing_unstable.getTableProps()}
        aria-label="Programmatic resize table"
      >
        {/* ... table content */}
      </Table>
    </div>
  );
};
```

---

## Keyboard Resizing

Enable keyboard-based column resizing via context menu:

```typescript
import * as React from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  useTableFeatures,
  useTableColumnSizing_unstable,
  createTableColumn,
} from '@fluentui/react-components';
import type { TableColumnDefinition } from '@fluentui/react-components';

export const KeyboardResizableTable: React.FC = () => {
  const { getRows, columnSizing_unstable, tableRef } = useTableFeatures(
    { columns, items },
    [useTableColumnSizing_unstable({ columnSizingOptions })]
  );

  return (
    <Table ref={tableRef} {...columnSizing_unstable.getTableProps()}>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <Menu openOnContext key={column.columnId}>
              <MenuTrigger>
                <TableHeaderCell
                  {...columnSizing_unstable.getTableHeaderCellProps(column.columnId)}
                >
                  {column.renderHeaderCell()}
                </TableHeaderCell>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem
                    onClick={columnSizing_unstable.enableKeyboardMode(column.columnId)}
                  >
                    Resize with Keyboard
                  </MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
          ))}
        </TableRow>
      </TableHeader>
      {/* ... body */}
    </Table>
  );
};
```

When keyboard mode is enabled:
- **Left/Right Arrow**: Decrease/increase width
- **Escape**: Exit keyboard resize mode

---

## Controlled Column Sizing

For full control over column widths:

```typescript
import * as React from 'react';
import {
  Table,
  useTableFeatures,
  useTableColumnSizing_unstable,
} from '@fluentui/react-components';
import type { TableColumnSizingOptions, TableColumnId } from '@fluentui/react-components';

export const ControlledResizing: React.FC = () => {
  const [columnWidths, setColumnWidths] = React.useState<Record<TableColumnId, number>>({
    name: 200,
    description: 300,
    status: 100,
  });

  const columnSizingOptions: TableColumnSizingOptions = {
    name: { minWidth: 100 },
    description: { minWidth: 150 },
    status: { minWidth: 80 },
  };

  const { getRows, columnSizing_unstable, tableRef } = useTableFeatures(
    { columns, items },
    [
      useTableColumnSizing_unstable({
        columnSizingOptions,
        onColumnResize: (e, { columnId, width }) => {
          setColumnWidths((prev) => ({
            ...prev,
            [columnId]: width,
          }));
        },
      }),
    ]
  );

  // Apply controlled widths
  React.useEffect(() => {
    Object.entries(columnWidths).forEach(([columnId, width]) => {
      columnSizing_unstable.setColumnWidth(columnId, width);
    });
  }, [columnWidths, columnSizing_unstable]);

  return (
    <div>
      <div style={{ marginBottom: '8px' }}>
        Current widths: {JSON.stringify(columnWidths)}
      </div>
      <Table ref={tableRef} {...columnSizing_unstable.getTableProps()}>
        {/* ... */}
      </Table>
    </div>
  );
};
```

---

## Auto-Fit Columns

Automatically adjust columns to fit container:

```typescript
const { columnSizing_unstable, tableRef } = useTableFeatures(
  { columns, items },
  [
    useTableColumnSizing_unstable({
      columnSizingOptions,
      autoFitColumns: true, // Enable auto-fit
    }),
  ]
);
```

Disable auto-fit for specific columns:

```typescript
const columnSizingOptions: TableColumnSizingOptions = {
  name: {
    minWidth: 100,
    idealWidth: 200,
    autoFitColumns: false, // This column won't auto-fit
  },
  description: {
    minWidth: 150,
    idealWidth: 300,
    // Uses global autoFitColumns setting
  },
};
```

---

## DataGrid with Resizable Columns

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
import type { TableColumnDefinition, TableColumnSizingOptions } from '@fluentui/react-components';

export const ResizableDataGrid: React.FC = () => {
  const columnSizingOptions: TableColumnSizingOptions = {
    name: { minWidth: 100, defaultWidth: 200 },
    value: { minWidth: 100, defaultWidth: 150 },
  };

  return (
    <DataGrid
      items={items}
      columns={columns}
      getRowId={(item) => item.id}
      resizableColumns
      columnSizingOptions={columnSizingOptions}
      onColumnResize={(e, { columnId, width }) => {
        console.log(`Column ${columnId} resized to ${width}px`);
      }}
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
};
```

---

## useTableColumnSizing_unstable API

### Options

| Option | Type | Description |
|--------|------|-------------|
| `columnSizingOptions` | `TableColumnSizingOptions` | Per-column settings |
| `onColumnResize` | `(e, { columnId, width }) => void` | Resize callback |
| `containerWidthOffset` | `number` | Offset for container width calculation |
| `autoFitColumns` | `boolean` | Auto-fit columns to container |

### Returned State

| Property | Type | Description |
|----------|------|-------------|
| `getTableProps` | `() => TableProps` | Props for Table component |
| `getTableHeaderCellProps` | `(columnId) => HeaderCellProps` | Props for header cells |
| `getTableCellProps` | `(columnId) => CellProps` | Props for body cells |
| `setColumnWidth` | `(columnId, width) => void` | Set column width |
| `getColumnWidths` | `() => ColumnWidthState[]` | Get all column widths |
| `enableKeyboardMode` | `(columnId) => (e) => void` | Enable keyboard resizing |
| `getOnMouseDown` | `(columnId) => (e) => void` | Mouse handler for resize |

---

## Text Truncation

Use `truncate` prop on `TableCellLayout` for resizable columns:

```typescript
<TableCell {...columnSizing_unstable.getTableCellProps('name')}>
  <TableCellLayout truncate>
    {item.name}
  </TableCellLayout>
</TableCell>
```

Without `truncate`, text may overflow when columns are narrow.

---

## Accessibility

- Resize handles are keyboard accessible
- Context menu provides keyboard resize option
- ARIA attributes indicate resizable state
- Focus management during resize operations

---

## Best Practices

### ✅ Do's

```typescript
// Set appropriate minWidth for all columns
columnSizingOptions: {
  name: { minWidth: 100 },  // Prevent unreadable narrow columns
}

// Use truncate for text content
<TableCellLayout truncate>{content}</TableCellLayout>

// Wrap table in overflow container
<div style={{ overflowX: 'auto' }}>
  <Table ref={tableRef} {...columnSizing_unstable.getTableProps()}>
```

### ❌ Don'ts

```typescript
// Don't forget tableRef
<Table {...columnSizing_unstable.getTableProps()}> // Missing ref!

// Don't forget getTableCellProps for body cells
<TableCell>{item.name}</TableCell> // Width won't be applied

// Don't set minWidth too small
{ minWidth: 10 } // Column will become unreadable
```

---

## Performance Tips

1. **Use `truncate`** - Prevents layout shifts from long content
2. **Set reasonable defaults** - Reduces initial resize operations
3. **Memoize column definitions** - Prevent re-creating on each render

```typescript
const columns = React.useMemo(() => [
  createTableColumn({ columnId: 'name', ... }),
], []);

const columnSizingOptions = React.useMemo(() => ({
  name: { minWidth: 100, defaultWidth: 200 },
}), []);
```

---

## See Also

- [Table Index](00-table-index.md)
- [Table Basics](01-table-basic.md)
- [DataGrid](04-datagrid.md)
- [Virtualization](06-virtualization.md)