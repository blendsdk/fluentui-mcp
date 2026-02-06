# Pagination Patterns - FluentUI v9

> **Topic**: Pagination and Data Navigation
> **Components**: `Button`, custom implementations
> **Package**: `@fluentui/react-components`

## Overview

Pagination helps users navigate through large datasets by dividing content into manageable pages. FluentUI v9 doesn't have a built-in Pagination component, so we'll create custom implementations using available components.

## Basic Imports

```typescript
import {
  Button,
  makeStyles,
  tokens,
  Text,
  Select,
  Dropdown,
  Option,
} from '@fluentui/react-components';
import {
  ChevronLeftRegular,
  ChevronRightRegular,
  ChevronDoubleLeftRegular,
  ChevronDoubleRightRegular,
  MoreHorizontalRegular,
} from '@fluentui/react-icons';
```

## Basic Pagination

```tsx
const useStyles = makeStyles({
  pagination: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  pageButton: {
    minWidth: '36px',
    height: '36px',
  },
  currentPage: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    ':hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
    },
  },
  info: {
    marginLeft: tokens.spacingHorizontalM,
    color: tokens.colorNeutralForeground2,
  },
});

interface BasicPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function BasicPagination({ currentPage, totalPages, onPageChange }: BasicPaginationProps) {
  const styles = useStyles();

  return (
    <div className={styles.pagination}>
      <Button
        icon={<ChevronLeftRegular />}
        appearance="subtle"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      />

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          className={`${styles.pageButton} ${page === currentPage ? styles.currentPage : ''}`}
          appearance={page === currentPage ? 'primary' : 'subtle'}
          onClick={() => onPageChange(page)}
          aria-label={`Page ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </Button>
      ))}

      <Button
        icon={<ChevronRightRegular />}
        appearance="subtle"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      />
    </div>
  );
}
```

## Pagination with Ellipsis

For larger datasets, show ellipsis for skipped pages:

```tsx
const useEllipsisStyles = makeStyles({
  pagination: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
  },
  pageButton: {
    minWidth: '36px',
    height: '36px',
  },
  ellipsis: {
    padding: `0 ${tokens.spacingHorizontalS}`,
    color: tokens.colorNeutralForeground3,
  },
});

interface EllipsisPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

function EllipsisPagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: EllipsisPaginationProps) {
  const styles = useEllipsisStyles();

  // Generate page numbers with ellipsis
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const totalNumbers = siblingCount * 2 + 5; // siblings + first + last + current + 2 ellipsis

    if (totalPages <= totalNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftEllipsis = leftSiblingIndex > 2;
    const showRightEllipsis = rightSiblingIndex < totalPages - 1;

    if (!showLeftEllipsis && showRightEllipsis) {
      const leftRange = Array.from({ length: 3 + 2 * siblingCount }, (_, i) => i + 1);
      return [...leftRange, 'ellipsis', totalPages];
    }

    if (showLeftEllipsis && !showRightEllipsis) {
      const rightRange = Array.from(
        { length: 3 + 2 * siblingCount },
        (_, i) => totalPages - (3 + 2 * siblingCount) + i + 1
      );
      return [1, 'ellipsis', ...rightRange];
    }

    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [1, 'ellipsis', ...middleRange, 'ellipsis', totalPages];
  };

  const pages = getPageNumbers();

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <Button
        icon={<ChevronLeftRegular />}
        appearance="subtle"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      />

      {pages.map((page, index) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className={styles.ellipsis}>
            <MoreHorizontalRegular />
          </span>
        ) : (
          <Button
            key={page}
            className={styles.pageButton}
            appearance={page === currentPage ? 'primary' : 'subtle'}
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Button>
        )
      )}

      <Button
        icon={<ChevronRightRegular />}
        appearance="subtle"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      />
    </nav>
  );
}
```

## Pagination with Page Size Selector

```tsx
const useFullPaginationStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: tokens.spacingVerticalM,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
  },
  info: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
  },
  pageSizeSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
});

interface FullPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

function FullPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
}: FullPaginationProps) {
  const styles = useFullPaginationStyles();

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        {/* Page size selector */}
        <div className={styles.pageSizeSelector}>
          <Text className={styles.info}>Rows per page:</Text>
          <Dropdown
            value={String(pageSize)}
            onOptionSelect={(_, data) => {
              onPageSizeChange(Number(data.optionValue));
              onPageChange(1); // Reset to first page
            }}
            style={{ minWidth: '80px' }}
          >
            {pageSizeOptions.map((size) => (
              <Option key={size} value={String(size)}>
                {size}
              </Option>
            ))}
          </Dropdown>
        </div>

        {/* Item count info */}
        <Text className={styles.info}>
          {startItem}-{endItem} of {totalItems}
        </Text>
      </div>

      {/* Page navigation */}
      <nav className={styles.pagination} aria-label="Pagination">
        <Button
          icon={<ChevronDoubleLeftRegular />}
          appearance="subtle"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          aria-label="First page"
        />
        <Button
          icon={<ChevronLeftRegular />}
          appearance="subtle"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        />

        <Text className={styles.info}>
          Page {currentPage} of {totalPages}
        </Text>

        <Button
          icon={<ChevronRightRegular />}
          appearance="subtle"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        />
        <Button
          icon={<ChevronDoubleRightRegular />}
          appearance="subtle"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          aria-label="Last page"
        />
      </nav>
    </div>
  );
}
```

## Compact Pagination

For limited space scenarios:

```tsx
const useCompactStyles = makeStyles({
  pagination: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  info: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    minWidth: '80px',
    textAlign: 'center',
  },
});

interface CompactPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function CompactPagination({ currentPage, totalPages, onPageChange }: CompactPaginationProps) {
  const styles = useCompactStyles();

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <Button
        icon={<ChevronLeftRegular />}
        appearance="subtle"
        size="small"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      />
      
      <span className={styles.info}>
        {currentPage} / {totalPages}
      </span>
      
      <Button
        icon={<ChevronRightRegular />}
        appearance="subtle"
        size="small"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      />
    </nav>
  );
}
```

## Infinite Scroll

```tsx
import { useCallback, useRef, useEffect } from 'react';
import { Spinner } from '@fluentui/react-components';

const useInfiniteScrollStyles = makeStyles({
  container: {
    height: '400px',
    overflowY: 'auto',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  item: {
    padding: tokens.spacingVerticalM,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    padding: tokens.spacingVerticalL,
  },
  sentinel: {
    height: '1px',
  },
});

interface InfiniteScrollProps<T> {
  items: T[];
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  renderItem: (item: T, index: number) => React.ReactNode;
}

function InfiniteScroll<T>({
  items,
  hasMore,
  isLoading,
  onLoadMore,
  renderItem,
}: InfiniteScrollProps<T>) {
  const styles = useInfiniteScrollStyles();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  return (
    <div className={styles.container}>
      {items.map((item, index) => (
        <div key={index} className={styles.item}>
          {renderItem(item, index)}
        </div>
      ))}

      {isLoading && (
        <div className={styles.loader}>
          <Spinner size="small" label="Loading more..." />
        </div>
      )}

      {/* Sentinel element for intersection observer */}
      <div ref={sentinelRef} className={styles.sentinel} />
    </div>
  );
}

// Usage
function InfiniteScrollExample() {
  const [items, setItems] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const newItems = Array.from({ length: 20 }, (_, i) => `Item ${page * 20 + i + 1}`);
    setItems((prev) => [...prev, ...newItems]);
    setPage((prev) => prev + 1);
    setHasMore(page < 5); // Stop after 5 pages
    setIsLoading(false);
  }, [page]);

  return (
    <InfiniteScroll
      items={items}
      hasMore={hasMore}
      isLoading={isLoading}
      onLoadMore={loadMore}
      renderItem={(item) => <Text>{item}</Text>}
    />
  );
}
```

## Load More Button

Alternative to infinite scroll:

```tsx
const useLoadMoreStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  loadMoreContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: tokens.spacingVerticalM,
  },
  info: {
    textAlign: 'center',
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
  },
});

interface LoadMorePaginationProps<T> {
  items: T[];
  totalItems: number;
  isLoading: boolean;
  onLoadMore: () => void;
  renderItem: (item: T, index: number) => React.ReactNode;
}

function LoadMorePagination<T>({
  items,
  totalItems,
  isLoading,
  onLoadMore,
  renderItem,
}: LoadMorePaginationProps<T>) {
  const styles = useLoadMoreStyles();
  const hasMore = items.length < totalItems;

  return (
    <div className={styles.container}>
      {items.map((item, index) => renderItem(item, index))}

      {hasMore && (
        <div className={styles.loadMoreContainer}>
          <Button
            appearance="outline"
            onClick={onLoadMore}
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="tiny" /> : 'Load More'}
          </Button>
        </div>
      )}

      <Text className={styles.info}>
        Showing {items.length} of {totalItems} items
      </Text>
    </div>
  );
}
```

## usePagination Hook

```typescript
import { useState, useCallback, useMemo } from 'react';

interface UsePaginationOptions {
  totalItems: number;
  initialPage?: number;
  initialPageSize?: number;
  onChange?: (page: number, pageSize: number) => void;
}

interface UsePaginationReturn {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  setPageSize: (size: number) => void;
  getPageItems: <T>(items: T[]) => T[];
}

/**
 * Hook for managing pagination state
 */
export function usePagination(options: UsePaginationOptions): UsePaginationReturn {
  const { totalItems, initialPage = 1, initialPageSize = 10, onChange } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const totalPages = Math.ceil(totalItems / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages || totalPages === 0;

  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(validPage);
      onChange?.(validPage, pageSize);
    },
    [totalPages, pageSize, onChange]
  );

  const nextPage = useCallback(() => {
    if (!isLastPage) goToPage(currentPage + 1);
  }, [currentPage, isLastPage, goToPage]);

  const prevPage = useCallback(() => {
    if (!isFirstPage) goToPage(currentPage - 1);
  }, [currentPage, isFirstPage, goToPage]);

  const firstPage = useCallback(() => goToPage(1), [goToPage]);
  const lastPage = useCallback(() => goToPage(totalPages), [goToPage, totalPages]);

  const setPageSize = useCallback(
    (size: number) => {
      setPageSizeState(size);
      setCurrentPage(1); // Reset to first page
      onChange?.(1, size);
    },
    [onChange]
  );

  const getPageItems = useCallback(
    <T,>(items: T[]): T[] => {
      return items.slice(startIndex, endIndex);
    },
    [startIndex, endIndex]
  );

  return {
    currentPage,
    pageSize,
    totalPages,
    startIndex,
    endIndex,
    isFirstPage,
    isLastPage,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    setPageSize,
    getPageItems,
  };
}

// Usage example
function PaginatedList() {
  const allItems = useMemo(() => 
    Array.from({ length: 100 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` })),
    []
  );

  const pagination = usePagination({
    totalItems: allItems.length,
    initialPageSize: 10,
    onChange: (page, pageSize) => {
      console.log(`Page: ${page}, Size: ${pageSize}`);
    },
  });

  const currentItems = pagination.getPageItems(allItems);

  return (
    <div>
      <ul>
        {currentItems.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>

      <FullPagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={allItems.length}
        pageSize={pagination.pageSize}
        onPageChange={pagination.goToPage}
        onPageSizeChange={pagination.setPageSize}
      />
    </div>
  );
}
```

## Server-Side Pagination Hook

```typescript
interface UseServerPaginationOptions<T> {
  fetchData: (page: number, pageSize: number) => Promise<{ items: T[]; total: number }>;
  initialPageSize?: number;
}

interface UseServerPaginationReturn<T> {
  items: T[];
  isLoading: boolean;
  error: Error | null;
  pagination: UsePaginationReturn;
  refresh: () => void;
}

export function useServerPagination<T>(
  options: UseServerPaginationOptions<T>
): UseServerPaginationReturn<T> {
  const { fetchData, initialPageSize = 10 } = options;
  
  const [items, setItems] = useState<T[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const pagination = usePagination({
    totalItems,
    initialPageSize,
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { items, total } = await fetchData(pagination.currentPage, pagination.pageSize);
      setItems(items);
      setTotalItems(total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load data'));
    } finally {
      setIsLoading(false);
    }
  }, [fetchData, pagination.currentPage, pagination.pageSize]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    items,
    isLoading,
    error,
    pagination,
    refresh: loadData,
  };
}
```

## Accessibility Checklist

- [x] Pagination wrapped in `<nav>` element with `aria-label`
- [x] Current page has `aria-current="page"`
- [x] All buttons have descriptive `aria-label`
- [x] Disabled buttons use `disabled` attribute
- [x] Page count announced to screen readers
- [x] Keyboard navigation supported

## Best Practices

1. **Show Item Counts**: Always show "X-Y of Z items"
2. **Remember Page Size**: Persist user's page size preference
3. **Handle Empty State**: Show meaningful message when no items
4. **Loading States**: Show loading indicator during page transitions
5. **URL Sync**: Consider syncing page number to URL for bookmarking
6. **Reasonable Defaults**: Start with 10-25 items per page
7. **Mobile Consideration**: Use compact pagination on small screens

## Related Documentation

- [04-menu-navigation.md](04-menu-navigation.md) - Contextual menus
- [06-search-navigation.md](06-search-navigation.md) - Search-driven navigation
- [Data Fetching](../data/04-data-fetching.md) - Server-side data loading