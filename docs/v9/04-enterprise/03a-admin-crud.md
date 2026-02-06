# Admin Interface: CRUD Data Tables

> **Module**: 04-enterprise
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-06-02

## Overview

CRUD (Create, Read, Update, Delete) data tables are the backbone of admin interfaces. This guide shows how to build a full CRUD table using FluentUI v9 DataGrid with inline actions, bulk selection, toolbar operations, and confirmation dialogs.

---

## CRUD Table with DataGrid

```tsx
import * as React from 'react';
import {
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  TableColumnDefinition,
  createTableColumn,
  Button,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Badge,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  EditRegular,
  DeleteRegular,
  MoreHorizontalRegular,
  EyeRegular,
} from '@fluentui/react-icons';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: 'active' | 'draft' | 'archived';
}

const useStyles = makeStyles({
  actions: {
    display: 'flex',
    gap: tokens.spacingHorizontalXS,
  },
});

const statusBadge: Record<Product['status'], { color: 'success' | 'warning' | 'informative'; label: string }> = {
  active: { color: 'success', label: 'Active' },
  draft: { color: 'warning', label: 'Draft' },
  archived: { color: 'informative', label: 'Archived' },
};

interface CrudTableProps {
  items: Product[];
  onView: (item: Product) => void;
  onEdit: (item: Product) => void;
  onDelete: (item: Product) => void;
}

/**
 * ProductCrudTable — DataGrid with inline row actions.
 *
 * Each row has View, Edit, Delete actions accessible
 * via icon buttons or an overflow menu on narrow screens.
 */
export function ProductCrudTable({ items, onView, onEdit, onDelete }: CrudTableProps) {
  const styles = useStyles();

  const columns: TableColumnDefinition<Product>[] = [
    createTableColumn<Product>({
      columnId: 'name',
      renderHeaderCell: () => 'Product Name',
      renderCell: (item) => <Text weight="semibold">{item.name}</Text>,
      compare: (a, b) => a.name.localeCompare(b.name),
    }),
    createTableColumn<Product>({
      columnId: 'sku',
      renderHeaderCell: () => 'SKU',
      renderCell: (item) => <Text>{item.sku}</Text>,
    }),
    createTableColumn<Product>({
      columnId: 'price',
      renderHeaderCell: () => 'Price',
      renderCell: (item) => <Text>${item.price.toFixed(2)}</Text>,
      compare: (a, b) => a.price - b.price,
    }),
    createTableColumn<Product>({
      columnId: 'stock',
      renderHeaderCell: () => 'Stock',
      renderCell: (item) => <Text>{item.stock}</Text>,
      compare: (a, b) => a.stock - b.stock,
    }),
    createTableColumn<Product>({
      columnId: 'status',
      renderHeaderCell: () => 'Status',
      renderCell: (item) => {
        const badge = statusBadge[item.status];
        return <Badge color={badge.color} appearance="filled">{badge.label}</Badge>;
      },
    }),
    createTableColumn<Product>({
      columnId: 'actions',
      renderHeaderCell: () => 'Actions',
      renderCell: (item) => (
        <div className={styles.actions}>
          <Button
            icon={<EyeRegular />}
            appearance="subtle"
            size="small"
            aria-label={`View ${item.name}`}
            onClick={() => onView(item)}
          />
          <Button
            icon={<EditRegular />}
            appearance="subtle"
            size="small"
            aria-label={`Edit ${item.name}`}
            onClick={() => onEdit(item)}
          />
          <Button
            icon={<DeleteRegular />}
            appearance="subtle"
            size="small"
            aria-label={`Delete ${item.name}`}
            onClick={() => onDelete(item)}
          />
        </div>
      ),
    }),
  ];

  return (
    <DataGrid
      items={items}
      columns={columns}
      getRowId={(item) => item.id}
      sortable
      selectionMode="multiselect"
    >
      <DataGridHeader>
        <DataGridRow>
          {({ renderHeaderCell }) => (
            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
          )}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<Product>>
        {({ item, rowId }) => (
          <DataGridRow<Product> key={rowId}>
            {({ renderCell }) => (
              <DataGridCell>{renderCell(item)}</DataGridCell>
            )}
          </DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>
  );
}
```

---

## CRUD Toolbar

```tsx
import * as React from 'react';
import {
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  SearchBox,
  Select,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  AddRegular,
  ArrowDownloadRegular,
  FilterRegular,
  DeleteRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${tokens.spacingVerticalS} 0`,
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalS,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
});

interface CrudToolbarProps {
  /** Number of currently selected rows */
  selectedCount: number;
  onAdd: () => void;
  onDeleteSelected: () => void;
  onExport: () => void;
  onSearch: (query: string) => void;
  onFilterStatus: (status: string) => void;
}

/**
 * CrudToolbar — Action bar above a CRUD table.
 *
 * Shows Add button, search, filter, and bulk actions
 * (delete selected, export) when rows are selected.
 */
export function CrudToolbar({
  selectedCount,
  onAdd,
  onDeleteSelected,
  onExport,
  onSearch,
  onFilterStatus,
}: CrudToolbarProps) {
  const styles = useStyles();

  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <ToolbarButton
          icon={<AddRegular />}
          appearance="primary"
          onClick={onAdd}
        >
          Add Product
        </ToolbarButton>

        {selectedCount > 0 && (
          <>
            <ToolbarDivider />
            <Text size={200}>{selectedCount} selected</Text>
            <ToolbarButton
              icon={<DeleteRegular />}
              appearance="subtle"
              onClick={onDeleteSelected}
            >
              Delete Selected
            </ToolbarButton>
          </>
        )}
      </div>

      <div className={styles.right}>
        <SearchBox
          placeholder="Search products..."
          size="small"
          onChange={(e, data) => onSearch(data.value)}
        />
        <Select
          size="small"
          onChange={(e, data) => onFilterStatus(data.value)}
          defaultValue=""
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </Select>
        <ToolbarButton
          icon={<ArrowDownloadRegular />}
          appearance="subtle"
          onClick={onExport}
        >
          Export
        </ToolbarButton>
      </div>
    </div>
  );
}
```

---

## Delete Confirmation Dialog

```tsx
import * as React from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogActions,
  Button,
  Text,
} from '@fluentui/react-components';
import { WarningRegular } from '@fluentui/react-icons';

interface DeleteConfirmDialogProps {
  open: boolean;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * DeleteConfirmDialog — Confirmation dialog before deleting a record.
 *
 * Requires explicit user confirmation to prevent accidental data loss.
 */
export function DeleteConfirmDialog({
  open,
  itemName,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(e, data) => !data.open && onCancel()}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>
            <WarningRegular /> Delete {itemName}?
          </DialogTitle>
          <DialogContent>
            <Text>
              This action cannot be undone. The item &quot;{itemName}&quot; will be
              permanently removed.
            </Text>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onCancel}>Cancel</Button>
            <Button appearance="primary" onClick={onConfirm}>
              Delete
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
```

---

## Complete CRUD Page

```tsx
import * as React from 'react';
import { makeStyles, tokens, Text } from '@fluentui/react-components';
import { ProductCrudTable } from './ProductCrudTable';
import { CrudToolbar } from './CrudToolbar';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

const useStyles = makeStyles({
  page: {
    padding: tokens.spacingVerticalL,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

/**
 * ProductsPage — Complete CRUD page with toolbar, table, and dialogs.
 *
 * Manages search/filter state, selection state, and dialog visibility.
 */
export function ProductsPage() {
  const styles = useStyles();
  const [products, setProducts] = React.useState<Product[]>(mockProducts);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = React.useState<Product | null>(null);

  // Filter products by search query and status
  const filtered = React.useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  const handleDelete = () => {
    if (deleteTarget) {
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const handleDeleteSelected = () => {
    setProducts((prev) => prev.filter((p) => !selectedIds.has(p.id)));
    setSelectedIds(new Set());
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Text size={600} weight="semibold">Products</Text>
      </div>

      <CrudToolbar
        selectedCount={selectedIds.size}
        onAdd={() => {/* open create dialog */}}
        onDeleteSelected={handleDeleteSelected}
        onExport={() => {/* export CSV */}}
        onSearch={setSearch}
        onFilterStatus={setStatusFilter}
      />

      <ProductCrudTable
        items={filtered}
        onView={(item) => {/* navigate to detail */}}
        onEdit={(item) => {/* open edit dialog */}}
        onDelete={(item) => setDeleteTarget(item)}
      />

      <DeleteConfirmDialog
        open={deleteTarget !== null}
        itemName={deleteTarget?.name ?? ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
```

---

## Best Practices

### ✅ Do

- **Always confirm destructive actions** with a Dialog before deleting
- **Show selection count** in the toolbar when rows are selected
- **Provide inline row actions** (view/edit/delete) on every row
- **Support keyboard navigation** — DataGrid handles this automatically
- **Use sortable columns** for all comparable data

### ❌ Don't

- **Don't delete without confirmation** — always show a Dialog
- **Don't hide actions in a menu-only pattern** — keep common actions visible
- **Don't reload the entire page after mutations** — update state locally
- **Don't forget empty states** — show a message when filters return no results

---

## Related Documentation

- [Admin User Management](03b-admin-user-management.md) — User/role CRUD patterns
- [Admin Settings](03c-admin-settings.md) — Settings panel patterns
- [DataGrid Component](../02-components/data-display/table/04-datagrid.md) — DataGrid API reference
- [Dialog Patterns](../03-patterns/modals/01-dialog-patterns.md) — Dialog patterns
