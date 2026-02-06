# Complex State Patterns

> **Module**: 03-patterns/state
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-06-02
> **Prerequisites**: [Server State](05-server-state.md)

## Overview

Complex state patterns go beyond simple CRUD — undo/redo, multi-filter management, pagination state, and sort coordination. This guide shows how to implement these patterns with FluentUI v9 components.

---

## Pattern 1: Pagination State

### Hook

```tsx
// hooks/usePagination.ts
import * as React from 'react';

interface PaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

interface UsePaginationReturn extends PaginationState {
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setTotalItems: (total: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

/**
 * Manages pagination state for data tables and lists.
 */
export function usePagination(initialPageSize = 10): UsePaginationReturn {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSizeState] = React.useState(initialPageSize);
  const [totalItems, setTotalItems] = React.useState(0);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const canGoNext = page < totalPages;
  const canGoPrev = page > 1;

  const setPageSize = React.useCallback((size: number) => {
    setPageSizeState(size);
    setPage(1); // Reset to first page when page size changes
  }, []);

  const nextPage = React.useCallback(() => {
    setPage((p) => Math.min(p + 1, totalPages));
  }, [totalPages]);

  const prevPage = React.useCallback(() => {
    setPage((p) => Math.max(p - 1, 1));
  }, []);

  return {
    page, pageSize, totalItems, totalPages,
    setPage, setPageSize, setTotalItems,
    nextPage, prevPage, canGoNext, canGoPrev,
  };
}
```

### FluentUI Pagination Controls

```tsx
import * as React from 'react';
import {
  Button,
  Select,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  ChevronLeftRegular,
  ChevronRightRegular,
} from '@fluentui/react-icons';
import { usePagination } from '../hooks/usePagination';

const useStyles = makeStyles({
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${tokens.spacingVerticalS} 0`,
  },
  pageNav: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  pageSizeSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
});

interface PaginationControlsProps {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  canGoNext: boolean;
  canGoPrev: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

function PaginationControls({
  page, pageSize, totalItems, totalPages,
  canGoNext, canGoPrev,
  onPageChange, onPageSizeChange, onNext, onPrev,
}: PaginationControlsProps) {
  const styles = useStyles();

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  return (
    <div className={styles.controls}>
      <div className={styles.pageSizeSelector}>
        <Text size={200}>Rows per page:</Text>
        <Select
          value={String(pageSize)}
          onChange={(e, data) => onPageSizeChange(Number(data.value))}
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </Select>
      </div>

      <div className={styles.pageNav}>
        <Text size={200}>
          {startItem}–{endItem} of {totalItems}
        </Text>
        <Button
          icon={<ChevronLeftRegular />}
          appearance="subtle"
          disabled={!canGoPrev}
          onClick={onPrev}
          aria-label="Previous page"
        />
        <Button
          icon={<ChevronRightRegular />}
          appearance="subtle"
          disabled={!canGoNext}
          onClick={onNext}
          aria-label="Next page"
        />
      </div>
    </div>
  );
}
```

---

## Pattern 2: Filter & Sort State

### Hook

```tsx
// hooks/useFilterSort.ts
import * as React from 'react';

interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

interface FilterSortState<TFilter extends Record<string, unknown>> {
  filters: TFilter;
  sort: SortConfig | null;
}

interface UseFilterSortReturn<TFilter extends Record<string, unknown>> {
  filters: TFilter;
  sort: SortConfig | null;
  setFilter: <K extends keyof TFilter>(key: K, value: TFilter[K]) => void;
  clearFilter: (key: keyof TFilter) => void;
  clearAllFilters: () => void;
  setSort: (column: string) => void;
  activeFilterCount: number;
}

/**
 * Manages filter and sort state for data tables.
 * Toggling sort cycles: asc → desc → null.
 */
export function useFilterSort<TFilter extends Record<string, unknown>>(
  initialFilters: TFilter,
): UseFilterSortReturn<TFilter> {
  const [state, setState] = React.useState<FilterSortState<TFilter>>({
    filters: initialFilters,
    sort: null,
  });

  const setFilter = React.useCallback(<K extends keyof TFilter>(key: K, value: TFilter[K]) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, [key]: value },
    }));
  }, []);

  const clearFilter = React.useCallback((key: keyof TFilter) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, [key]: initialFilters[key] },
    }));
  }, [initialFilters]);

  const clearAllFilters = React.useCallback(() => {
    setState((prev) => ({ ...prev, filters: initialFilters }));
  }, [initialFilters]);

  // Toggle sort: asc → desc → null → asc
  const setSort = React.useCallback((column: string) => {
    setState((prev) => {
      if (prev.sort?.column !== column) {
        return { ...prev, sort: { column, direction: 'asc' } };
      }
      if (prev.sort.direction === 'asc') {
        return { ...prev, sort: { column, direction: 'desc' } };
      }
      return { ...prev, sort: null };
    });
  }, []);

  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    for (const key of Object.keys(state.filters) as Array<keyof TFilter>) {
      if (state.filters[key] !== initialFilters[key]) count++;
    }
    return count;
  }, [state.filters, initialFilters]);

  return {
    filters: state.filters,
    sort: state.sort,
    setFilter, clearFilter, clearAllFilters, setSort,
    activeFilterCount,
  };
}
```

### FluentUI Filter Toolbar

```tsx
import * as React from 'react';
import {
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  Select,
  Input,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverSurface,
  Field,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { FilterRegular, DismissRegular } from '@fluentui/react-icons';
import { useFilterSort } from '../hooks/useFilterSort';

const useStyles = makeStyles({
  filterPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalS,
    minWidth: '250px',
  },
});

interface Filters {
  role: string;
  status: string;
  search: string;
}

function FilterToolbar() {
  const styles = useStyles();

  const { filters, activeFilterCount, setFilter, clearAllFilters } = useFilterSort<Filters>({
    role: '',
    status: '',
    search: '',
  });

  return (
    <Toolbar>
      <Input
        placeholder="Search..."
        value={filters.search}
        onChange={(e, data) => setFilter('search', data.value)}
        contentBefore={undefined}
      />

      <ToolbarDivider />

      <Popover>
        <PopoverTrigger disableButtonEnhancement>
          <ToolbarButton icon={<FilterRegular />}>
            Filters
            {activeFilterCount > 0 && (
              <Badge appearance="filled" color="brand" size="small">
                {activeFilterCount}
              </Badge>
            )}
          </ToolbarButton>
        </PopoverTrigger>
        <PopoverSurface>
          <div className={styles.filterPanel}>
            <Field label="Role">
              <Select
                value={filters.role}
                onChange={(e, data) => setFilter('role', data.value)}
              >
                <option value="">All roles</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </Select>
            </Field>

            <Field label="Status">
              <Select
                value={filters.status}
                onChange={(e, data) => setFilter('status', data.value)}
              >
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </Field>

            <Button
              icon={<DismissRegular />}
              appearance="subtle"
              onClick={clearAllFilters}
              disabled={activeFilterCount === 0}
            >
              Clear all filters
            </Button>
          </div>
        </PopoverSurface>
      </Popover>
    </Toolbar>
  );
}
```

---

## Pattern 3: Undo/Redo

### Hook

```tsx
// hooks/useUndoRedo.ts
import * as React from 'react';

interface UseUndoRedoReturn<T> {
  state: T;
  setState: (newState: T) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  /** Number of steps that can be undone. */
  undoCount: number;
  /** Number of steps that can be redone. */
  redoCount: number;
}

/**
 * Adds undo/redo capability to any state value.
 *
 * @param initialState - The starting state
 * @param maxHistory - Maximum number of undo steps (default: 50)
 */
export function useUndoRedo<T>(initialState: T, maxHistory = 50): UseUndoRedoReturn<T> {
  const [past, setPast] = React.useState<T[]>([]);
  const [present, setPresent] = React.useState<T>(initialState);
  const [future, setFuture] = React.useState<T[]>([]);

  const setState = React.useCallback(
    (newState: T) => {
      setPast((prev) => {
        const newPast = [...prev, present];
        // Trim history if it exceeds maxHistory
        return newPast.length > maxHistory ? newPast.slice(-maxHistory) : newPast;
      });
      setPresent(newState);
      setFuture([]); // Clear redo stack on new action
    },
    [present, maxHistory],
  );

  const undo = React.useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setPast((prev) => prev.slice(0, -1));
    setFuture((prev) => [present, ...prev]);
    setPresent(previous);
  }, [past, present]);

  const redo = React.useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((prev) => prev.slice(1));
    setPast((prev) => [...prev, present]);
    setPresent(next);
  }, [future, present]);

  return {
    state: present,
    setState,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    undoCount: past.length,
    redoCount: future.length,
  };
}
```

### FluentUI Undo/Redo Toolbar

```tsx
import * as React from 'react';
import {
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  Tooltip,
  Textarea,
  Field,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { ArrowUndoRegular, ArrowRedoRegular } from '@fluentui/react-icons';
import { useUndoRedo } from '../hooks/useUndoRedo';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
});

function TextEditorWithUndo() {
  const styles = useStyles();
  const { state: text, setState: setText, undo, redo, canUndo, canRedo } =
    useUndoRedo('');

  // Keyboard shortcuts
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  return (
    <div className={styles.container}>
      <Toolbar>
        <Tooltip content="Undo (Ctrl+Z)" relationship="label">
          <ToolbarButton
            icon={<ArrowUndoRegular />}
            disabled={!canUndo}
            onClick={undo}
            aria-label="Undo"
          />
        </Tooltip>
        <Tooltip content="Redo (Ctrl+Shift+Z)" relationship="label">
          <ToolbarButton
            icon={<ArrowRedoRegular />}
            disabled={!canRedo}
            onClick={redo}
            aria-label="Redo"
          />
        </Tooltip>
      </Toolbar>

      <Field label="Editor">
        <Textarea
          value={text}
          onChange={(e, data) => setText(data.value)}
          rows={10}
        />
      </Field>
    </div>
  );
}
```

---

## Pattern 4: Selection State

Manage row selection in data tables:

```tsx
// hooks/useSelection.ts
import * as React from 'react';

interface UseSelectionReturn<T> {
  selectedItems: Set<T>;
  isSelected: (item: T) => boolean;
  toggle: (item: T) => void;
  selectAll: (items: T[]) => void;
  deselectAll: () => void;
  isAllSelected: (items: T[]) => boolean;
  isSomeSelected: (items: T[]) => boolean;
  count: number;
}

/**
 * Manages selection state for lists and tables.
 */
export function useSelection<T>(): UseSelectionReturn<T> {
  const [selectedItems, setSelectedItems] = React.useState<Set<T>>(new Set());

  const isSelected = React.useCallback(
    (item: T) => selectedItems.has(item),
    [selectedItems],
  );

  const toggle = React.useCallback((item: T) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(item)) {
        next.delete(item);
      } else {
        next.add(item);
      }
      return next;
    });
  }, []);

  const selectAll = React.useCallback((items: T[]) => {
    setSelectedItems(new Set(items));
  }, []);

  const deselectAll = React.useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  const isAllSelected = React.useCallback(
    (items: T[]) => items.length > 0 && items.every((item) => selectedItems.has(item)),
    [selectedItems],
  );

  const isSomeSelected = React.useCallback(
    (items: T[]) => items.some((item) => selectedItems.has(item)) && !isAllSelected(items),
    [selectedItems, isAllSelected],
  );

  return {
    selectedItems,
    isSelected,
    toggle,
    selectAll,
    deselectAll,
    isAllSelected,
    isSomeSelected,
    count: selectedItems.size,
  };
}
```

### Bulk Actions Bar

```tsx
import {
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  Text,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { DeleteRegular, ArchiveRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  bar: {
    backgroundColor: tokens.colorBrandBackground2,
    borderRadius: tokens.borderRadiusMedium,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalM}`,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
});

interface BulkActionsBarProps {
  selectedCount: number;
  onDelete: () => void;
  onArchive: () => void;
  onDeselectAll: () => void;
}

function BulkActionsBar({ selectedCount, onDelete, onArchive, onDeselectAll }: BulkActionsBarProps) {
  const styles = useStyles();

  if (selectedCount === 0) return null;

  return (
    <div className={styles.bar}>
      <Text weight="semibold">{selectedCount} selected</Text>
      <Button appearance="subtle" size="small" onClick={onDeselectAll}>
        Clear
      </Button>
      <ToolbarDivider />
      <ToolbarButton icon={<ArchiveRegular />} onClick={onArchive}>
        Archive
      </ToolbarButton>
      <ToolbarButton icon={<DeleteRegular />} onClick={onDelete}>
        Delete
      </ToolbarButton>
    </div>
  );
}
```

---

## Best Practices

### ✅ Do

- **Reset pagination when filters change** — users expect to return to page 1
- **Debounce text filter inputs** — avoid excessive re-renders and API calls
- **Show active filter count** — helps users know filters are applied
- **Limit undo history** — prevent memory leaks with a max history size
- **Use keyboard shortcuts** — Ctrl+Z / Ctrl+Shift+Z for undo/redo

### ❌ Don't

- **Don't store filter state in URL and local state separately** — choose one source of truth
- **Don't keep stale redo stack** — clear it when a new action occurs
- **Don't forget to handle empty selection** — hide bulk actions bar when nothing selected

---

## Related Documentation

- [Server State](05-server-state.md) — React Query for paginated data fetching
- [Data Patterns](../data/00-data-index.md) — Loading, empty, error state patterns
- [Pagination Patterns](../navigation/05-pagination-patterns.md) — Pagination UI patterns
