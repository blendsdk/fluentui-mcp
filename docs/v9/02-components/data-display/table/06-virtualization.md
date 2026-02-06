# Virtualization

> **Parent**: [Table Index](00-table-index.md)
> **Topic**: Large dataset handling

## Overview

For large datasets (1000+ rows), rendering all rows at once causes performance issues. Virtualization renders only visible rows, dramatically improving performance.

FluentUI v9 provides virtualization through the community package:
- **`@fluentui-contrib/react-data-grid-react-window`**

---

## When to Virtualize

| Dataset Size | Recommendation |
|-------------|----------------|
| < 100 rows | No virtualization needed |
| 100-500 rows | Consider virtualization for complex cells |
| 500-1000 rows | Recommended |
| 1000+ rows | Required |

---

## Installation

```bash
# Install the virtualization extension
npm install @fluentui-contrib/react-data-grid-react-window react-window

# Or with yarn
yarn add @fluentui-contrib/react-data-grid-react-window react-window
```

---

## Basic Virtualized DataGrid

```typescript
import * as React from 'react';
import {
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  DataGridCell,
  TableCellLayout,
  createTableColumn,
} from '@fluentui/react-components';
import {
  DataGrid,
  DataGridBody,
} from '@fluentui-contrib/react-data-grid-react-window';
import type { TableColumnDefinition } from '@fluentui/react-components';

interface Item {
  id: string;
  name: string;
  value: number;
  status: string;
}

// Generate large dataset
const generateItems = (count: number): Item[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `item-${i}`,
    name: `Item ${i + 1}`,
    value: Math.floor(Math.random() * 1000),
    status: ['Active', 'Pending', 'Complete'][i % 3],
  }));

const items = generateItems(10000); // 10,000 rows

const columns: TableColumnDefinition<Item>[] = [
  createTableColumn<Item>({
    columnId: 'name',
    renderHeaderCell: () => 'Name',
    renderCell: (item) => <TableCellLayout>{item.name}</TableCellLayout>,
  }),
  createTableColumn<Item>({
    columnId: 'value',
    renderHeaderCell: () => 'Value',
    renderCell: (item) => item.value,
  }),
  createTableColumn<Item>({
    columnId: 'status',
    renderHeaderCell: () => 'Status',
    renderCell: (item) => item.status,
  }),
];

export const VirtualizedDataGrid: React.FC = () => {
  return (
    <DataGrid
      items={items}
      columns={columns}
      getRowId={(item) => item.id}
      style={{ height: '500px' }} // Fixed height required
    >
      <DataGridHeader>
        <DataGridRow>
          {({ renderHeaderCell }) => (
            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
          )}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<Item>
        itemSize={44} // Row height in pixels
        height={456}  // Body height (container - header)
      >
        {({ item, rowId }, style) => (
          <DataGridRow<Item> key={rowId} style={style}>
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

## Key Differences from Standard DataGrid

| Aspect | Standard | Virtualized |
|--------|----------|-------------|
| Import source | `@fluentui/react-components` | `@fluentui-contrib/react-data-grid-react-window` |
| Container height | Auto | Fixed (required) |
| Row render function | `(row) => ...` | `(row, style) => ...` |
| Row style | Automatic | Must apply `style` prop |
| `itemSize` prop | Not needed | Required |

---

## Import Pattern

```typescript
// Standard components from FluentUI
import {
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  DataGridCell,
  TableCellLayout,
  createTableColumn,
} from '@fluentui/react-components';

// Virtualized components from contrib package
import {
  DataGrid,
  DataGridBody,
} from '@fluentui-contrib/react-data-grid-react-window';
```

---

## Fixed Height Container

Virtualization requires a fixed height container:

```typescript
<DataGrid
  items={items}
  columns={columns}
  getRowId={(item) => item.id}
  style={{ height: '500px' }} // Container height
>
  <DataGridHeader>...</DataGridHeader>
  <DataGridBody<Item>
    itemSize={44}  // Row height
    height={456}   // Body height = Container - Header
  >
    ...
  </DataGridBody>
</DataGrid>
```

### Height Calculation

```
Body height = Container height - Header height - (borders/padding)

Example:
- Container: 500px
- Header: ~44px (default size)
- Body: 456px
```

---

## Row Height (itemSize)

The `itemSize` prop defines row height in pixels:

```typescript
<DataGridBody<Item>
  itemSize={44}  // Default medium size
  height={456}
>
```

### Size Guidelines

| Table Size | Approximate Row Height |
|------------|----------------------|
| `extra-small` | ~32px |
| `small` | ~36px |
| `medium` (default) | ~44px |

---

## Applying Row Style

**Critical**: You must pass the `style` prop to the row:

```typescript
<DataGridBody<Item>
  itemSize={44}
  height={456}
>
  {({ item, rowId }, style) => (
    <DataGridRow<Item> 
      key={rowId} 
      style={style}  // Required for positioning
    >
      {({ renderCell }) => (
        <DataGridCell>{renderCell(item)}</DataGridCell>
      )}
    </DataGridRow>
  )}
</DataGridBody>
```

Without `style`, rows won't be positioned correctly!

---

## Virtualized DataGrid with Selection

```typescript
import * as React from 'react';
import {
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  DataGridCell,
  createTableColumn,
} from '@fluentui/react-components';
import {
  DataGrid,
  DataGridBody,
} from '@fluentui-contrib/react-data-grid-react-window';
import type { TableColumnDefinition, TableRowId } from '@fluentui/react-components';

export const VirtualizedSelectableDataGrid: React.FC = () => {
  const [selectedItems, setSelectedItems] = React.useState<Set<TableRowId>>(
    new Set()
  );

  return (
    <DataGrid
      items={items}
      columns={columns}
      getRowId={(item) => item.id}
      selectionMode="multiselect"
      selectedItems={selectedItems}
      onSelectionChange={(e, data) => setSelectedItems(data.selectedItems)}
      style={{ height: '500px' }}
    >
      <DataGridHeader>
        <DataGridRow
          selectionCell={{ checkboxIndicator: { 'aria-label': 'Select all' } }}
        >
          {({ renderHeaderCell }) => (
            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
          )}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<Item>
        itemSize={44}
        height={456}
      >
        {({ item, rowId }, style) => (
          <DataGridRow<Item>
            key={rowId}
            style={style}
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

## Virtualized DataGrid with Sorting

```typescript
import * as React from 'react';
import {
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  DataGridCell,
  createTableColumn,
} from '@fluentui/react-components';
import {
  DataGrid,
  DataGridBody,
} from '@fluentui-contrib/react-data-grid-react-window';
import type { TableColumnDefinition } from '@fluentui/react-components';

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

export const VirtualizedSortableDataGrid: React.FC = () => {
  return (
    <DataGrid
      items={items}
      columns={columns}
      getRowId={(item) => item.id}
      sortable
      defaultSortState={{ sortColumn: 'name', sortDirection: 'ascending' }}
      style={{ height: '500px' }}
    >
      <DataGridHeader>
        <DataGridRow>
          {({ renderHeaderCell }) => (
            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
          )}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<Item>
        itemSize={44}
        height={456}
      >
        {({ item, rowId }, style) => (
          <DataGridRow<Item> key={rowId} style={style}>
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

## Memoization (Critical for Performance)

**Always memoize** the row render function:

```typescript
import * as React from 'react';

export const OptimizedVirtualizedDataGrid: React.FC = () => {
  // Memoize columns
  const columns = React.useMemo<TableColumnDefinition<Item>[]>(
    () => [
      createTableColumn<Item>({
        columnId: 'name',
        renderHeaderCell: () => 'Name',
        renderCell: (item) => item.name,
      }),
    ],
    []
  );

  // Memoize row render function
  const rowRenderer = React.useCallback(
    ({ item, rowId }: { item: Item; rowId: TableRowId }, style: React.CSSProperties) => (
      <DataGridRow<Item> key={rowId} style={style}>
        {({ renderCell }) => (
          <DataGridCell>{renderCell(item)}</DataGridCell>
        )}
      </DataGridRow>
    ),
    []
  );

  return (
    <DataGrid
      items={items}
      columns={columns}
      getRowId={(item) => item.id}
      style={{ height: '500px' }}
    >
      <DataGridHeader>
        <DataGridRow>
          {({ renderHeaderCell }) => (
            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
          )}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<Item> itemSize={44} height={456}>
        {rowRenderer}
      </DataGridBody>
    </DataGrid>
  );
};
```

---

## Variable Row Heights

For rows with variable heights, you can provide a function:

```typescript
<DataGridBody<Item>
  itemSize={(index) => {
    const item = items[index];
    return item.hasDetails ? 80 : 44; // Variable height
  }}
  height={456}
>
```

> **Note**: Variable heights are less performant than fixed heights.

---

## Alternative: Table Primitives with react-window

For maximum control, use Table primitives with react-window directly:

```typescript
import * as React from 'react';
import { FixedSizeList } from 'react-window';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from '@fluentui/react-components';

interface RowProps {
  index: number;
  style: React.CSSProperties;
  data: Item[];
}

const Row: React.FC<RowProps> = ({ index, style, data }) => {
  const item = data[index];
  return (
    <TableRow style={style}>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.value}</TableCell>
    </TableRow>
  );
};

export const VirtualizedTablePrimitives: React.FC = () => {
  return (
    <Table noNativeElements aria-label="Virtualized table">
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Value</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <FixedSizeList
          height={456}
          width="100%"
          itemCount={items.length}
          itemSize={44}
          itemData={items}
        >
          {Row}
        </FixedSizeList>
      </TableBody>
    </Table>
  );
};
```

> **Note**: Use `noNativeElements` on Table for compatibility with react-window.

---

## Performance Best Practices

### ✅ Do's

```typescript
// Memoize everything
const columns = React.useMemo(() => [...], []);
const rowRenderer = React.useCallback((...) => ..., []);

// Use stable keys
getRowId={(item) => item.id}

// Keep cells simple for large datasets
renderCell: (item) => item.name  // Fast
```

### ❌ Don'ts

```typescript
// Don't create inline functions
{({ item }, style) => (
  <DataGridRow onClick={() => handleClick(item)}>  // Creates new function each render

// Don't forget memoization
const rowRenderer = ({ item }, style) => ...  // Not memoized!

// Don't render complex content unnecessarily
renderCell: (item) => <ComplexChart data={item} />  // Expensive
```

---

## Accessibility

- Virtualized lists maintain keyboard navigation
- Screen readers can navigate through items
- Use `aria-rowcount` and `aria-rowindex` for large lists

```typescript
<DataGrid
  aria-rowcount={items.length}
  aria-label={`Table with ${items.length} items`}
>
```

---

## Troubleshooting

### Rows Not Visible
- Check `height` prop on DataGridBody
- Verify container has fixed height
- Ensure `style` prop is passed to DataGridRow

### Performance Issues
- Memoize row render function
- Simplify cell content
- Check for unnecessary re-renders

### Scroll Issues
- Verify container overflow settings
- Check itemSize matches actual row height

---

## Resources

- [NPM: @fluentui-contrib/react-data-grid-react-window](https://www.npmjs.com/package/@fluentui-contrib/react-data-grid-react-window)
- [GitHub: fluentui-contrib](https://github.com/microsoft/fluentui-contrib)
- [react-window Documentation](https://react-window.vercel.app/)

---

## See Also

- [Table Index](00-table-index.md)
- [DataGrid](04-datagrid.md)
- [Column Sizing](05-column-sizing.md)