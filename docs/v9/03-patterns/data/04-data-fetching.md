# Data Fetching Pattern

> **File**: 03-patterns/data/04-data-fetching.md
> **FluentUI Version**: 9.x

## Overview

Data fetching patterns for FluentUI v9 applications. Includes native fetch patterns, React Query integration, SWR integration, and custom hooks for data management.

## Basic useFetch Hook

```tsx
import { useState, useEffect, useCallback } from 'react';

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

interface UseFetchOptions {
  immediate?: boolean;
}

export function useFetch<T>(
  url: string,
  options?: UseFetchOptions
): FetchState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: options?.immediate !== false,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        isLoading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }, [url]);

  useEffect(() => {
    if (options?.immediate !== false) {
      fetchData();
    }
  }, [fetchData, options?.immediate]);

  return { ...state, refetch: fetchData };
}

// Usage
const UserList = () => {
  const { data, isLoading, error, refetch } = useFetch<User[]>('/api/users');

  if (isLoading) return <Spinner />;
  if (error) return <ErrorDisplay error={error} onRetry={refetch} />;
  if (!data) return <EmptyState />;

  return <UserTable users={data} />;
};
```

## React Query Integration

```tsx
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Spinner, Button } from '@fluentui/react-components';

// Query client setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

// Fetch function
async function fetchUsers(): Promise<User[]> {
  const response = await fetch('/api/users');
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}

// Query hook
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
};

// Component using React Query
export const UserListWithQuery = () => {
  const { data, isLoading, error, refetch, isFetching } = useUsers();

  if (isLoading) return <Spinner label="Loading users..." />;
  if (error) return <ErrorDisplay message={error.message} onRetry={() => refetch()} />;

  return (
    <div>
      {isFetching && <Spinner size="tiny" />}
      <UserTable users={data || []} />
    </div>
  );
};

// Mutation example
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newUser: CreateUserInput) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error('Failed to create user');
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
```

## SWR Integration

```tsx
import useSWR, { SWRConfig } from 'swr';
import { Spinner } from '@fluentui/react-components';

// Global fetcher
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
};

// SWR Provider
export const SWRProvider = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig
    value={{
      fetcher,
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }}
  >
    {children}
  </SWRConfig>
);

// Component using SWR
export const UserListWithSWR = () => {
  const { data, error, isLoading, mutate } = useSWR<User[]>('/api/users');

  if (isLoading) return <Spinner />;
  if (error) return <ErrorDisplay onRetry={() => mutate()} />;

  return <UserTable users={data || []} />;
};

// SWR with mutation
export const useUserMutation = () => {
  const { mutate } = useSWR<User[]>('/api/users');

  const createUser = async (newUser: CreateUserInput) => {
    // Optimistically update
    mutate(
      async (currentUsers) => {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
        });
        const createdUser = await response.json();
        return [...(currentUsers || []), createdUser];
      },
      { optimisticData: (currentUsers) => [...(currentUsers || []), { ...newUser, id: 'temp' }] }
    );
  };

  return { createUser };
};
```

## Pagination Pattern

```tsx
import { useState, useCallback } from 'react';
import { Button, Spinner, Text } from '@fluentui/react-components';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface UsePaginatedFetchResult<T> {
  data: T[];
  isLoading: boolean;
  error: Error | null;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
}

export function usePaginatedFetch<T>(
  baseUrl: string,
  pageSize: number = 10
): UsePaginatedFetchResult<T> {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<T[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPage = useCallback(async (pageNum: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${baseUrl}?page=${pageNum}&pageSize=${pageSize}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const result: PaginatedResponse<T> = await response.json();
      setData(result.data);
      setTotalPages(result.totalPages);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, pageSize]);

  // Initial fetch
  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  return {
    data,
    isLoading,
    error,
    page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: () => fetchPage(page + 1),
    prevPage: () => fetchPage(page - 1),
    goToPage: fetchPage,
  };
}

// Pagination controls component
interface PaginationControlsProps {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  isLoading?: boolean;
}

export const PaginationControls = ({
  page,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onNextPage,
  onPrevPage,
  isLoading,
}: PaginationControlsProps) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center' }}>
    <Button 
      disabled={!hasPrevPage || isLoading} 
      onClick={onPrevPage}
    >
      Previous
    </Button>
    <Text>
      Page {page} of {totalPages}
    </Text>
    <Button 
      disabled={!hasNextPage || isLoading} 
      onClick={onNextPage}
    >
      Next
    </Button>
    {isLoading && <Spinner size="tiny" />}
  </div>
);
```

## Infinite Scroll Pattern

```tsx
import { useState, useCallback, useRef, useEffect } from 'react';
import { Spinner, Button } from '@fluentui/react-components';

interface UseInfiniteScrollResult<T> {
  data: T[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

export function useInfiniteScroll<T>(
  fetchFn: (page: number) => Promise<{ data: T[]; hasMore: boolean }>,
): UseInfiniteScrollResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    try {
      const result = await fetchFn(page + 1);
      setData(prev => [...prev, ...result.data]);
      setHasMore(result.hasMore);
      setPage(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoadingMore(false);
    }
  }, [fetchFn, page, isLoadingMore, hasMore]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setPage(1);
    try {
      const result = await fetchFn(1);
      setData(result.data);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn]);

  // Initial load
  useEffect(() => {
    refresh();
  }, []);

  return { data, isLoading, isLoadingMore, error, hasMore, loadMore, refresh };
}

// Intersection Observer for auto-loading
export const InfiniteScrollTrigger = ({
  onIntersect,
  isLoading,
}: {
  onIntersect: () => void;
  isLoading: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          onIntersect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [onIntersect, isLoading]);

  return (
    <div ref={ref} style={{ height: '20px', display: 'flex', justifyContent: 'center' }}>
      {isLoading && <Spinner size="small" />}
    </div>
  );
};
```

## Search with Debounce

```tsx
import { useState, useEffect, useCallback } from 'react';
import { SearchBox, Spinner } from '@fluentui/react-components';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

interface UseSearchResult<T> {
  query: string;
  setQuery: (query: string) => void;
  results: T[];
  isLoading: boolean;
  error: Error | null;
}

export function useSearch<T>(
  searchFn: (query: string) => Promise<T[]>,
  debounceMs: number = 300
): UseSearchResult<T> {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const debouncedQuery = useDebounce(query, debounceMs);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    const search = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await searchFn(debouncedQuery);
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    search();
  }, [debouncedQuery, searchFn]);

  return { query, setQuery, results, isLoading, error };
}

// Search component
export const SearchableList = () => {
  const { query, setQuery, results, isLoading, error } = useSearch(
    async (q) => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      return response.json();
    }
  );

  return (
    <div>
      <SearchBox
        value={query}
        onChange={(e, data) => setQuery(data.value)}
        placeholder="Search..."
        contentAfter={isLoading ? <Spinner size="tiny" /> : undefined}
      />
      
      {error && <ErrorDisplay message={error.message} />}
      {results.length > 0 && <ResultsList items={results} />}
      {!isLoading && query && results.length === 0 && (
        <EmptyState title="No results" />
      )}
    </div>
  );
};
```

## Caching Pattern

```tsx
// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();

interface CacheOptions {
  ttl?: number; // Time to live in ms
}

export function useCachedFetch<T>(
  url: string,
  options: CacheOptions = {}
): { data: T | null; isLoading: boolean; error: Error | null } {
  const { ttl = 5 * 60 * 1000 } = options; // Default 5 minutes
  const [state, setState] = useState<{
    data: T | null;
    isLoading: boolean;
    error: Error | null;
  }>({ data: null, isLoading: true, error: null });

  useEffect(() => {
    const cached = cache.get(url);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      setState({ data: cached.data, isLoading: false, error: null });
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        cache.set(url, { data, timestamp: Date.now() });
        setState({ data, isLoading: false, error: null });
      } catch (err) {
        setState({
          data: null,
          isLoading: false,
          error: err instanceof Error ? err : new Error(String(err)),
        });
      }
    };

    fetchData();
  }, [url, ttl]);

  return state;
}

// Clear cache utility
export const clearCache = (key?: string) => {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
};
```

## Best Practices

1. **Handle all states** - Loading, error, empty, success
2. **Use appropriate caching** - Avoid unnecessary re-fetches
3. **Implement retries** - Automatic retry for transient failures
4. **Show loading indicators** - Users should know data is loading
5. **Cancel stale requests** - Use AbortController for cleanup
6. **Debounce user input** - Prevent excessive API calls
7. **Prefetch data** - Load data before it's needed

## Related Documentation

- [01-loading-states.md](01-loading-states.md) - Loading patterns
- [03-error-handling.md](03-error-handling.md) - Error handling
- [05-optimistic-updates.md](05-optimistic-updates.md) - Optimistic UI