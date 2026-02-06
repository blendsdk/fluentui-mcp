# Server State Patterns

> **Module**: 03-patterns/state
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-06-02
> **Prerequisites**: [External Stores](04-external-stores.md), [Data Fetching](../data/04-data-fetching.md)

## Overview

Server state — data fetched from APIs — has fundamentally different requirements than client state: it can be stale, needs caching, requires background refetching, and can fail. Libraries like React Query (TanStack Query) and SWR are purpose-built for this. This guide covers integrating them with FluentUI v9 components.

---

## React Query (TanStack Query)

### Setup

```tsx
// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,    // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FluentProvider theme={webLightTheme}>
        <AppContent />
      </FluentProvider>
    </QueryClientProvider>
  );
}
```

### Data Table with React Query

```tsx
import * as React from 'react';
import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  MessageBar,
  MessageBarBody,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { useQuery } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    padding: tokens.spacingVerticalXXL,
  },
});

async function fetchUsers(): Promise<User[]> {
  const response = await fetch('/api/users');
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}

function UserTable() {
  const styles = useStyles();

  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.center}>
        <Spinner label="Loading users..." />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <MessageBar intent="error">
        <MessageBarBody>
          {(error as Error).message}
          <Button appearance="transparent" onClick={() => refetch()}>
            Retry
          </Button>
        </MessageBarBody>
      </MessageBar>
    );
  }

  // Success state
  return (
    <div className={styles.container}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Role</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

### Mutations with FluentUI Feedback

```tsx
import * as React from 'react';
import {
  Button,
  Input,
  Field,
  useToastController,
  Toast,
  ToastTitle,
  ToastBody,
  Toaster,
  useId,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

interface CreateUserData {
  name: string;
  email: string;
}

function CreateUserForm() {
  const styles = useStyles();
  const queryClient = useQueryClient();
  const toasterId = useId('toaster');
  const { dispatchToast } = useToastController(toasterId);

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');

  const mutation = useMutation({
    mutationFn: async (data: CreateUserData) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create user');
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] });

      // Show success toast
      dispatchToast(
        <Toast>
          <ToastTitle>User created successfully</ToastTitle>
        </Toast>,
        { intent: 'success' },
      );

      // Reset form
      setName('');
      setEmail('');
    },
    onError: (error: Error) => {
      dispatchToast(
        <Toast>
          <ToastTitle>Failed to create user</ToastTitle>
          <ToastBody>{error.message}</ToastBody>
        </Toast>,
        { intent: 'error' },
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, email });
  };

  return (
    <>
      <Toaster toasterId={toasterId} />
      <form className={styles.form} onSubmit={handleSubmit}>
        <Field label="Name" required>
          <Input
            value={name}
            onChange={(e, data) => setName(data.value)}
          />
        </Field>

        <Field label="Email" required>
          <Input
            type="email"
            value={email}
            onChange={(e, data) => setEmail(data.value)}
          />
        </Field>

        <Button
          type="submit"
          appearance="primary"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Creating...' : 'Create User'}
        </Button>
      </form>
    </>
  );
}
```

### Search with Debounced Query

```tsx
import * as React from 'react';
import {
  SearchBox,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { useQuery } from '@tanstack/react-query';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
});

/**
 * Custom hook to debounce a value.
 * Returns the value only after it stops changing for `delay` ms.
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function SearchableUserList() {
  const styles = useStyles();
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: users, isLoading } = useQuery({
    queryKey: ['users', 'search', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch) return [];
      const response = await fetch(`/api/users?search=${encodeURIComponent(debouncedSearch)}`);
      return response.json();
    },
    enabled: debouncedSearch.length > 0,
  });

  return (
    <div className={styles.container}>
      <SearchBox
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e, data) => setSearchTerm(data.value)}
      />

      {isLoading && <Spinner size="small" label="Searching..." />}

      {users && users.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: { id: number; name: string; email: string }) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
```

---

## SWR Integration

SWR (Stale-While-Revalidate) from Vercel is a lighter alternative to React Query with a similar API:

```tsx
import * as React from 'react';
import useSWR from 'swr';
import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  MessageBar,
  MessageBarBody,
  Button,
} from '@fluentui/react-components';

/** Generic JSON fetcher for SWR. */
const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('Fetch failed');
  return res.json();
});

function UserListSWR() {
  const { data: users, error, isLoading, mutate } = useSWR('/api/users', fetcher);

  if (isLoading) return <Spinner label="Loading..." />;

  if (error) {
    return (
      <MessageBar intent="error">
        <MessageBarBody>
          {error.message}
          <Button appearance="transparent" onClick={() => mutate()}>Retry</Button>
        </MessageBarBody>
      </MessageBar>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Email</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users?.map((user: { id: number; name: string; email: string }) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

---

## React Query vs SWR

| Feature | React Query | SWR |
|---------|------------|-----|
| Bundle size | ~13 KB | ~4 KB |
| Mutations | Built-in `useMutation` | Manual with `mutate()` |
| Devtools | Dedicated devtools | Community extension |
| Pagination | `useInfiniteQuery` | `useSWRInfinite` |
| Cache control | Fine-grained `queryClient` | Global config |
| Best for | Complex apps, CRUD heavy | Simple apps, read-heavy |

---

## Best Practices

### ✅ Do

- **Use query keys that reflect parameters** — `['users', { search, page }]` ensures correct caching
- **Show loading/error/empty states** — Use Spinner, MessageBar, empty state patterns
- **Debounce search inputs** — Avoid firing a query on every keystroke
- **Invalidate after mutations** — `queryClient.invalidateQueries` keeps data fresh
- **Show success/error feedback** — Use FluentUI Toast for mutation results

### ❌ Don't

- **Don't duplicate server data in client state** — Let React Query/SWR be the cache
- **Don't forget error handling** — Always show a retry mechanism
- **Don't fetch everything at once** — Use pagination for large datasets
- **Don't skip the loading state** — Users need feedback that data is being loaded

---

## Related Documentation

- [Data Fetching Patterns](../data/04-data-fetching.md) — Loading and error state patterns
- [Loading States](../data/01-loading-states.md) — Skeleton and spinner patterns
- [Error Handling](../data/03-error-handling.md) — Error display patterns
- [Complex State](06-complex-state.md) — Pagination and filter state management
