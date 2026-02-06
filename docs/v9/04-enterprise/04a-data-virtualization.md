# Data-Heavy Apps: Virtualization & Large Datasets

> **Module**: 04-enterprise
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-06-02

## Overview

Enterprise applications often handle thousands or millions of records. Rendering all rows into the DOM is impractical — it causes slow rendering, high memory usage, and poor scroll performance. Virtualization renders only the visible rows, keeping the DOM lightweight. This guide covers FluentUI v9 DataGrid virtualization, list virtualization with `react-window`, and infinite scroll patterns.

---

## DataGrid with Virtualized Rows

FluentUI v9 DataGrid supports row virtualization for large datasets:

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
  Text,
} from '@fluentui/react-components';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  source: string;
}

interface VirtualizedLogTableProps {
  items: LogEntry[];
}

/**
 * VirtualizedLogTable — DataGrid with row virtualization for large log datasets.
 *
 * Uses DataGrid's built-in virtualization via the `itemSize` prop on DataGridBody.
 * Only visible rows are rendered in the DOM, allowing 100K+ rows without lag.
 */
export function VirtualizedLogTable({ items }: VirtualizedLogTableProps) {
  const columns: TableColumnDefinition<LogEntry>[] = [
    createTableColumn<LogEntry>({
      columnId: 'timestamp',
      renderHeaderCell: () => 'Timestamp',
      renderCell: (item) => <Text size={200}>{item.timestamp}</Text>,
    }),
    createTableColumn<LogEntry>({
      columnId: 'level',
      renderHeaderCell: () => 'Level',
      renderCell: (item) => <Text size={200}>{item.level.toUpperCase()}</Text>,
    }),
    createTableColumn<LogEntry>({
      columnId: 'message',
      renderHeaderCell: () => 'Message',
      renderCell: (item) => <Text size={200}>{item.message}</Text>,
    }),
    createTableColumn<LogEntry>({
      columnId: 'source',
      renderHeaderCell: () => 'Source',
      renderCell: (item) => <Text size={200}>{item.source}</Text>,
    }),
  ];

  return (
    <DataGrid
      items={items}
      columns={columns}
      getRowId={(item) => item.id}
      sortable
      style={{ height: '600px' }}
    >
      <DataGridHeader>
        <DataGridRow>
          {({ renderHeaderCell }) => (
            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
          )}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<LogEntry>
        itemSize={40}  /* Fixed row height for virtualization */
      >
        {({ item, rowId }) => (
          <DataGridRow<LogEntry> key={rowId}>
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

## List Virtualization with react-window

For non-table list UIs, use `react-window` with FluentUI components:

```bash
yarn add react-window @types/react-window
```

```tsx
import * as React from 'react';
import { FixedSizeList } from 'react-window';
import {
  Card,
  Text,
  Avatar,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    height: '500px',
    overflow: 'hidden',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    padding: `0 ${tokens.spacingHorizontalM}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

interface Contact {
  id: string;
  name: string;
  email: string;
}

interface VirtualizedContactListProps {
  contacts: Contact[];
}

/**
 * VirtualizedContactList — Renders thousands of contacts efficiently.
 *
 * Uses react-window FixedSizeList to virtualize rows.
 * Only ~15 rows are in the DOM at any time regardless of total count.
 */
export function VirtualizedContactList({ contacts }: VirtualizedContactListProps) {
  const styles = useStyles();

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const contact = contacts[index];
    return (
      <div style={style} className={styles.row}>
        <Avatar name={contact.name} size={28} />
        <div>
          <Text weight="semibold" size={200}>{contact.name}</Text>
          <br />
          <Text size={100} style={{ color: tokens.colorNeutralForeground3 }}>
            {contact.email}
          </Text>
        </div>
      </div>
    );
  };

  return (
    <Card className={styles.container}>
      <FixedSizeList
        height={500}
        width="100%"
        itemCount={contacts.length}
        itemSize={48}
      >
        {Row}
      </FixedSizeList>
    </Card>
  );
}
```

---

## Infinite Scroll Pattern

Load more data as the user scrolls to the bottom:

```tsx
import * as React from 'react';
import {
  Spinner,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    height: '600px',
    overflowY: 'auto',
  },
  sentinel: {
    display: 'flex',
    justifyContent: 'center',
    padding: tokens.spacingVerticalL,
  },
});

interface UseInfiniteScrollOptions {
  /** Function to load next page */
  loadMore: () => Promise<void>;
  /** Whether more data is available */
  hasMore: boolean;
  /** Whether data is currently loading */
  isLoading: boolean;
}

/**
 * useInfiniteScroll — Triggers loadMore when a sentinel element is visible.
 *
 * Uses IntersectionObserver to detect when the user has scrolled
 * near the bottom of the container. Efficient and battery-friendly.
 */
export function useInfiniteScroll({ loadMore, hasMore, isLoading }: UseInfiniteScrollOptions) {
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, hasMore, isLoading]);

  return sentinelRef;
}

// Usage:
function InfiniteLogViewer() {
  const styles = useStyles();
  const [logs, setLogs] = React.useState<LogEntry[]>([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const loadMore = React.useCallback(async () => {
    setIsLoading(true);
    const response = await fetch(`/api/logs?page=${page}&limit=50`);
    const data = await response.json();
    setLogs((prev) => [...prev, ...data.items]);
    setHasMore(data.hasMore);
    setPage((p) => p + 1);
    setIsLoading(false);
  }, [page]);

  const sentinelRef = useInfiniteScroll({ loadMore, hasMore, isLoading });

  return (
    <div className={styles.container}>
      {logs.map((log) => (
        <LogRow key={log.id} log={log} />
      ))}
      <div ref={sentinelRef} className={styles.sentinel}>
        {isLoading && <Spinner size="small" label="Loading more..." />}
        {!hasMore && <Text size={200}>No more entries</Text>}
      </div>
    </div>
  );
}
```

---

## Pagination vs Infinite Scroll vs Virtualization

| Approach | Best For | Data Size | UX |
|----------|----------|-----------|-----|
| **Pagination** | Tables with actions | Any | Explicit navigation |
| **Infinite Scroll** | Feeds, logs, timelines | Growing | Continuous reading |
| **Virtualization** | All rows loaded | 1K–100K+ | Smooth scrolling |

### When to Combine

- **Virtualization + Pagination**: Virtualize 50 rows per page, paginate across pages
- **Virtualization + Infinite Scroll**: Virtualize visible rows, load more as scrolling nears end
- **Pagination alone**: Best when users need to jump to specific pages

---

## Best Practices

### ✅ Do

- **Set a fixed `height`** on virtualized containers — virtualization requires a scroll container
- **Use `itemSize` (fixed row height)** when all rows are the same height
- **Show row count** ("Showing 1–50 of 12,345") so users know dataset size
- **Provide a loading indicator** at the bottom during infinite scroll fetches
- **Debounce search/filter** to avoid re-virtualizing on every keystroke

### ❌ Don't

- **Don't render 1000+ DOM nodes** — always virtualize large lists
- **Don't use variable-height rows** unless you use `VariableSizeList` from react-window
- **Don't forget keyboard scrolling** — virtualized lists must support Page Up/Down
- **Don't load all data upfront** for truly large datasets — combine with server-side pagination

---

## Related Documentation

- [Data Filtering & Sorting](04b-data-filtering-sorting.md) — Advanced filter/sort patterns
- [Data Export & Import](04c-data-export-import.md) — Bulk data operations
- [DataGrid Component](../02-components/data-display/table/04-datagrid.md) — DataGrid API
- [Pagination Patterns](../03-patterns/navigation/05-pagination-patterns.md) — Pagination patterns
