# Table & DataGrid Components

> **Package**: `@fluentui/react-table`
> **Import**: `import { Table, DataGrid, ... } from '@fluentui/react-components'`
> **Category**: Data Display

## Overview

FluentUI v9 provides two approaches for displaying tabular data:

1. **Table Primitives** - Low-level components for building custom tables
2. **DataGrid** - High-level abstraction with built-in features

---

## Document Index

| # | Document | Description |
|---|----------|-------------|
| 00 | [Index](00-table-index.md) | This document - overview and navigation |
| 01 | [Table Basics](01-table-basic.md) | Basic Table structure and components |
| 02 | [Selection](02-table-selection.md) | Row selection (single/multi) |
| 03 | [Sorting](03-table-sorting.md) | Column sorting functionality |
| 04 | [DataGrid](04-datagrid.md) | High-level DataGrid abstraction |
| 05 | [Column Sizing](05-column-sizing.md) | Resizable columns |
| 06 | [Virtualization](06-virtualization.md) | Large dataset handling |

---

## Quick Reference

### Table Components (Primitives)

| Component | Description |
|-----------|-------------|
| `Table` | Root table element |
| `TableHeader` | Header container |
| `TableHeaderCell` | Header cell |
| `TableBody` | Body container |
| `TableRow` | Table row |
| `TableCell` | Table cell |
| `TableCellLayout` | Cell content layout with media |
| `TableCellActions` | Actions that appear on hover |
| `TableSelectionCell` | Checkbox cell for selection |
| `TableResizeHandle` | Column resize handle |

### DataGrid Components (Abstraction)

| Component | Description |
|-----------|-------------|
| `DataGrid` | Root DataGrid with built-in features |
| `DataGridHeader` | Header container |
| `DataGridHeaderCell` | Header cell with auto-wiring |
| `DataGridBody` | Body with row virtualization support |
| `DataGridRow` | Row with selection support |
| `DataGridCell` | Cell with focus management |
| `DataGridSelectionCell` | Checkbox cell |

### Hooks & Utilities

| Hook/Function | Description |
|---------------|-------------|
| `useTableFeatures` | State management for Table primitives |
| `useTableSelection` | Selection state plugin |
| `useTableSort` | Sort state plugin |
| `useTableColumnSizing_unstable` | Column sizing plugin |
| `createTableColumn` | Column definition factory |

---

## When to Use What

### Use Table Primitives When:
- You need maximum flexibility
- Custom rendering logic is required
- You're building a non-standard table layout
- You want full control over state management

### Use DataGrid When:
- You want built-in sorting, selection, focus management
- Standard table patterns are acceptable
- You prefer declarative column definitions
- Rapid development is a priority

---

## Installation

```bash
# Table is included in the main package
npm install @fluentui/react-components

# Or install standalone
npm install @fluentui/react-table
```

---

## Basic Import Pattern

```typescript
// From main package (recommended)
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
  TableCellLayout,
  DataGrid,
  DataGridHeader,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  DataGridHeaderCell,
  createTableColumn,
  useTableFeatures,
  useTableSort,
  useTableSelection,
} from '@fluentui/react-components';

// Types
import type {
  TableColumnDefinition,
  TableRowId,
  TableColumnId,
  SortDirection,
} from '@fluentui/react-components';
```

---

## See Also

- [Component Index](../00-component-index.md)
- [Avatar](avatar.md) - Often used in table cells
- [Badge](badge.md) - Status indicators in tables