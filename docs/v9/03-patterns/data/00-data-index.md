# Data Patterns

> **Module**: 03-patterns/data
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-04-02

## Overview

Data patterns for handling loading states, empty states, error handling, data fetching, and optimistic updates in FluentUI v9 applications.

## Documentation Index

| File | Description |
|------|-------------|
| [01-loading-states.md](01-loading-states.md) | Loading spinners, skeleton screens, progress indicators |
| [02-empty-states.md](02-empty-states.md) | Empty state patterns with illustrations and CTAs |
| [03-error-handling.md](03-error-handling.md) | Error states, recovery patterns, error boundaries |
| [04-data-fetching.md](04-data-fetching.md) | Data fetching patterns with React Query, SWR |
| [05-optimistic-updates.md](05-optimistic-updates.md) | Optimistic UI updates for better UX |

## Quick Reference

### Common Data State Pattern

```tsx
import { useState, useEffect } from 'react';
import { Spinner, MessageBar, Text } from '@fluentui/react-components';

type DataState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

interface DataContainerProps<T> {
  state: DataState<T>;
  loading?: React.ReactNode;
  empty?: React.ReactNode;
  error?: (error: Error) => React.ReactNode;
  children: (data: T) => React.ReactNode;
}

export function DataContainer<T>({
  state,
  loading = <Spinner label="Loading..." />,
  empty = <Text>No data available</Text>,
  error = (err) => <MessageBar intent="error">{err.message}</MessageBar>,
  children,
}: DataContainerProps<T>) {
  switch (state.status) {
    case 'idle':
    case 'loading':
      return <>{loading}</>;
    case 'error':
      return <>{error(state.error)}</>;
    case 'success':
      if (!state.data || (Array.isArray(state.data) && state.data.length === 0)) {
        return <>{empty}</>;
      }
      return <>{children(state.data)}</>;
  }
}
```

### Loading States

```tsx
import { Spinner, Skeleton, SkeletonItem } from '@fluentui/react-components';

// Simple spinner
<Spinner label="Loading..." />

// Skeleton loading
<Skeleton>
  <SkeletonItem />
  <SkeletonItem />
</Skeleton>
```

### Empty States

```tsx
import { makeStyles, tokens, Text, Button } from '@fluentui/react-components';
import { DocumentRegular } from '@fluentui/react-icons';

const EmptyState = () => (
  <div style={{ textAlign: 'center', padding: '48px' }}>
    <DocumentRegular style={{ fontSize: '48px', color: tokens.colorNeutralForeground3 }} />
    <Text block weight="semibold" size={500}>No documents yet</Text>
    <Text block style={{ color: tokens.colorNeutralForeground3 }}>
      Create your first document to get started
    </Text>
    <Button appearance="primary" style={{ marginTop: '16px' }}>
      Create Document
    </Button>
  </div>
);
```

### Error States

```tsx
import { MessageBar, MessageBarBody, MessageBarTitle, Button } from '@fluentui/react-components';

const ErrorState = ({ error, onRetry }: { error: Error; onRetry: () => void }) => (
  <MessageBar intent="error">
    <MessageBarBody>
      <MessageBarTitle>Error loading data</MessageBarTitle>
      {error.message}
    </MessageBarBody>
    <Button onClick={onRetry}>Retry</Button>
  </MessageBar>
);
```

## State Management Flow

```
┌─────────────┐
│    idle     │
└──────┬──────┘
       │ fetch()
       ▼
┌─────────────┐
│   loading   │
└──────┬──────┘
       │
       ├─────────────┐
       ▼             ▼
┌─────────────┐ ┌─────────────┐
│   success   │ │    error    │
└─────────────┘ └──────┬──────┘
                       │ retry()
                       ▼
                ┌─────────────┐
                │   loading   │
                └─────────────┘
```

## Best Practices

1. **Always show loading state** - Users should know data is being fetched
2. **Provide meaningful empty states** - Guide users on what to do next
3. **Make errors actionable** - Include retry buttons and helpful messages
4. **Use skeleton screens** - Better perceived performance than spinners
5. **Handle edge cases** - Empty arrays, null values, network errors
6. **Consider optimistic updates** - Better UX for user actions

## Related Documentation

- [Spinner Component](../../02-components/feedback/spinner.md)
- [Skeleton Component](../../02-components/data-display/skeleton.md)
- [MessageBar Component](../../02-components/feedback/messagebar.md)
- [Form Submission Patterns](../forms/06-submission.md)