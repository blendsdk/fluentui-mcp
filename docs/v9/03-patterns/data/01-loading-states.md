# Loading States Pattern

> **File**: 03-patterns/data/01-loading-states.md
> **FluentUI Version**: 9.x

## Overview

Loading state patterns for FluentUI v9 applications. Includes spinners, skeleton screens, progress indicators, and best practices for perceived performance.

## Basic Spinner Loading

```tsx
import { Spinner, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
  },
});

export const LoadingSpinner = () => {
  const styles = useStyles();
  
  return (
    <div className={styles.container}>
      <Spinner label="Loading..." />
    </div>
  );
};

// Spinner sizes
<Spinner size="tiny" />    // 20px
<Spinner size="extra-small" /> // 24px
<Spinner size="small" />   // 28px (default)
<Spinner size="medium" />  // 32px
<Spinner size="large" />   // 36px
<Spinner size="extra-large" /> // 40px
<Spinner size="huge" />    // 44px
```

## Skeleton Loading

```tsx
import {
  Skeleton,
  SkeletonItem,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingVerticalL,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  row: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    alignItems: 'center',
  },
});

export const CardSkeleton = () => {
  const styles = useStyles();

  return (
    <Skeleton className={styles.card}>
      <div className={styles.row}>
        <SkeletonItem shape="circle" size={48} />
        <div style={{ flex: 1 }}>
          <SkeletonItem size={16} style={{ width: '40%' }} />
          <SkeletonItem size={12} style={{ width: '60%', marginTop: '8px' }} />
        </div>
      </div>
      <SkeletonItem size={16} />
      <SkeletonItem size={16} style={{ width: '80%' }} />
      <SkeletonItem size={16} style={{ width: '60%' }} />
    </Skeleton>
  );
};
```

## Table Skeleton

```tsx
import {
  Skeleton,
  SkeletonItem,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  header: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    padding: `${tokens.spacingVerticalS} 0`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  row: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    padding: `${tokens.spacingVerticalM} 0`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  cell: {
    flex: 1,
  },
});

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const TableSkeleton = ({ rows = 5, columns = 4 }: TableSkeletonProps) => {
  const styles = useStyles();

  return (
    <Skeleton className={styles.table}>
      <div className={styles.header}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className={styles.cell}>
            <SkeletonItem size={16} />
          </div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className={styles.cell}>
              <SkeletonItem size={16} />
            </div>
          ))}
        </div>
      ))}
    </Skeleton>
  );
};
```

## List Skeleton

```tsx
import {
  Skeleton,
  SkeletonItem,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingVerticalS,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
});

interface ListSkeletonProps {
  items?: number;
  showAvatar?: boolean;
}

export const ListSkeleton = ({ items = 5, showAvatar = true }: ListSkeletonProps) => {
  const styles = useStyles();

  return (
    <Skeleton className={styles.list}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className={styles.item}>
          {showAvatar && <SkeletonItem shape="circle" size={40} />}
          <div className={styles.content}>
            <SkeletonItem size={16} style={{ width: '60%' }} />
            <SkeletonItem size={12} style={{ width: '40%' }} />
          </div>
        </div>
      ))}
    </Skeleton>
  );
};
```

## Full Page Loading

```tsx
import { Spinner, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacingVerticalM,
  },
});

interface FullPageLoadingProps {
  message?: string;
}

export const FullPageLoading = ({ message = 'Loading...' }: FullPageLoadingProps) => {
  const styles = useStyles();

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <Spinner size="large" />
        <span>{message}</span>
      </div>
    </div>
  );
};
```

## Inline Loading Button

```tsx
import { useState } from 'react';
import { Button, Spinner } from '@fluentui/react-components';

interface LoadingButtonProps {
  children: React.ReactNode;
  onClick: () => Promise<void>;
  appearance?: 'primary' | 'secondary' | 'subtle' | 'transparent';
}

export const LoadingButton = ({
  children,
  onClick,
  appearance = 'primary',
}: LoadingButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onClick();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      appearance={appearance}
      onClick={handleClick}
      disabled={isLoading}
      icon={isLoading ? <Spinner size="tiny" /> : undefined}
    >
      {isLoading ? 'Loading...' : children}
    </Button>
  );
};
```

## Progress Indicator

```tsx
import { useState, useEffect } from 'react';
import { ProgressBar, Text, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

interface ProgressLoadingProps {
  progress: number; // 0-100
  label?: string;
}

export const ProgressLoading = ({ progress, label }: ProgressLoadingProps) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text>{label || 'Loading...'}</Text>
        <Text>{Math.round(progress)}%</Text>
      </div>
      <ProgressBar value={progress / 100} />
    </div>
  );
};

// Indeterminate progress
export const IndeterminateProgress = () => (
  <ProgressBar />
);
```

## Conditional Loading Wrapper

```tsx
import { Spinner, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  content: {
    opacity: 1,
  },
  contentLoading: {
    opacity: 0.5,
  },
});

interface LoadingWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
  overlay?: boolean;
}

export const LoadingWrapper = ({
  isLoading,
  children,
  skeleton,
  overlay = false,
}: LoadingWrapperProps) => {
  const styles = useStyles();

  // Show skeleton if provided and loading
  if (isLoading && skeleton) {
    return <>{skeleton}</>;
  }

  // Show overlay loading
  if (overlay) {
    return (
      <div className={styles.container}>
        {isLoading && (
          <div className={styles.overlay}>
            <Spinner />
          </div>
        )}
        <div className={isLoading ? styles.contentLoading : styles.content}>
          {children}
        </div>
      </div>
    );
  }

  // Show spinner or content
  return isLoading ? <Spinner label="Loading..." /> : <>{children}</>;
};
```

## Loading with Delay

```tsx
import { useState, useEffect } from 'react';
import { Spinner } from '@fluentui/react-components';

interface DelayedLoadingProps {
  isLoading: boolean;
  delay?: number;
  children: React.ReactNode;
}

/**
 * Shows loading indicator only after a delay.
 * Prevents flash of loading state for fast operations.
 */
export const DelayedLoading = ({
  isLoading,
  delay = 200,
  children,
}: DelayedLoadingProps) => {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setShowLoading(true), delay);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [isLoading, delay]);

  if (showLoading && isLoading) {
    return <Spinner label="Loading..." />;
  }

  return <>{children}</>;
};
```

## useLoading Hook

```tsx
import { useState, useCallback } from 'react';

interface UseLoadingResult<T> {
  isLoading: boolean;
  error: Error | null;
  data: T | null;
  execute: (...args: any[]) => Promise<T | undefined>;
  reset: () => void;
}

/**
 * Hook to manage loading state for async operations
 */
export function useLoading<T>(
  asyncFunction: (...args: any[]) => Promise<T>
): UseLoadingResult<T> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await asyncFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return { isLoading, error, data, execute, reset };
}

// Usage
const MyComponent = () => {
  const { isLoading, error, data, execute } = useLoading(fetchData);

  useEffect(() => {
    execute();
  }, [execute]);

  if (isLoading) return <Spinner />;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;
  
  return <div>{/* Render data */}</div>;
};
```

## Best Practices

1. **Use skeletons for content loading** - Better perceived performance
2. **Use spinners for actions** - Button clicks, form submissions
3. **Add delay before showing spinner** - Avoid flash for fast operations
4. **Provide context** - Use labels to explain what's loading
5. **Maintain layout** - Skeletons should match final content layout
6. **Consider accessibility** - Use aria-busy and aria-live regions

## Accessibility

```tsx
// Announce loading state to screen readers
<div aria-busy={isLoading} aria-live="polite">
  {isLoading ? <Spinner label="Loading data..." /> : <DataContent />}
</div>
```

## Related Documentation

- [02-empty-states.md](02-empty-states.md) - Empty state patterns
- [03-error-handling.md](03-error-handling.md) - Error handling patterns
- [Spinner Component](../../02-components/feedback/spinner.md)
- [Skeleton Component](../../02-components/data-display/skeleton.md)