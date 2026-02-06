# Error Handling Pattern

> **File**: 03-patterns/data/03-error-handling.md
> **FluentUI Version**: 9.x

## Overview

Error handling patterns for FluentUI v9 applications. Includes inline errors, full-page errors, error boundaries, toast notifications, and recovery patterns.

## Basic Error Display

```tsx
import { makeStyles, tokens, Text, Button } from '@fluentui/react-components';
import { ErrorCircleRegular, ArrowSyncRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: tokens.spacingVerticalXXL,
    textAlign: 'center',
  },
  icon: {
    fontSize: '64px',
    color: tokens.colorPaletteRedForeground1,
    marginBottom: tokens.spacingVerticalL,
  },
  title: {
    marginBottom: tokens.spacingVerticalS,
  },
  message: {
    color: tokens.colorNeutralForeground3,
    maxWidth: '400px',
    marginBottom: tokens.spacingVerticalL,
  },
});

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorDisplay = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
}: ErrorDisplayProps) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <ErrorCircleRegular className={styles.icon} />
      <Text as="h2" size={600} weight="semibold" className={styles.title}>
        {title}
      </Text>
      <Text className={styles.message}>{message}</Text>
      {onRetry && (
        <Button appearance="primary" icon={<ArrowSyncRegular />} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};
```

## MessageBar Error

```tsx
import {
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  MessageBarActions,
  Button,
  Link,
} from '@fluentui/react-components';
import { DismissRegular } from '@fluentui/react-icons';

interface InlineErrorProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
}

export const InlineError = ({
  title,
  message,
  onDismiss,
  onRetry,
}: InlineErrorProps) => (
  <MessageBar intent="error">
    <MessageBarBody>
      {title && <MessageBarTitle>{title}</MessageBarTitle>}
      {message}
    </MessageBarBody>
    <MessageBarActions
      containerAction={
        onDismiss && (
          <Button
            appearance="transparent"
            icon={<DismissRegular />}
            onClick={onDismiss}
          />
        )
      }
    >
      {onRetry && (
        <Button appearance="transparent" onClick={onRetry}>
          Retry
        </Button>
      )}
    </MessageBarActions>
  </MessageBar>
);

// Different error intents
export const WarningMessage = ({ message }: { message: string }) => (
  <MessageBar intent="warning">
    <MessageBarBody>{message}</MessageBarBody>
  </MessageBar>
);

export const InfoMessage = ({ message }: { message: string }) => (
  <MessageBar intent="info">
    <MessageBarBody>{message}</MessageBarBody>
  </MessageBar>
);

export const SuccessMessage = ({ message }: { message: string }) => (
  <MessageBar intent="success">
    <MessageBarBody>{message}</MessageBarBody>
  </MessageBar>
);
```

## Error Boundary Component

```tsx
import { Component, ErrorInfo, ReactNode } from 'react';
import { makeStyles, tokens, Text, Button } from '@fluentui/react-components';
import { ErrorCircleRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: tokens.spacingVerticalXXL,
    textAlign: 'center',
  },
});

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorBoundaryFallback
          error={this.state.error}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

// Fallback component
const ErrorBoundaryFallback = ({
  error,
  onReset,
}: {
  error: Error | null;
  onReset: () => void;
}) => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    padding: '48px',
    textAlign: 'center',
  }}>
    <ErrorCircleRegular style={{ fontSize: '64px', color: tokens.colorPaletteRedForeground1 }} />
    <Text as="h2" size={600} weight="semibold" style={{ marginTop: '16px' }}>
      Something went wrong
    </Text>
    <Text style={{ color: tokens.colorNeutralForeground3, marginTop: '8px' }}>
      {error?.message || 'An unexpected error occurred'}
    </Text>
    <Button appearance="primary" onClick={onReset} style={{ marginTop: '24px' }}>
      Try Again
    </Button>
  </div>
);
```

## Form Field Error

```tsx
import { Field, Input, Text, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  fieldError: {
    color: tokens.colorPaletteRedForeground1,
    fontSize: tokens.fontSizeBase200,
    marginTop: tokens.spacingVerticalXS,
  },
});

interface FormFieldWithErrorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export const FormFieldWithError = ({
  label,
  value,
  onChange,
  error,
  required,
}: FormFieldWithErrorProps) => {
  return (
    <Field
      label={label}
      required={required}
      validationState={error ? 'error' : 'none'}
      validationMessage={error}
    >
      <Input
        value={value}
        onChange={(e, data) => onChange(data.value)}
      />
    </Field>
  );
};
```

## API Error Handler

```tsx
/**
 * Standard API error response structure
 */
interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

/**
 * Parse API error response
 */
export async function parseApiError(response: Response): Promise<ApiError> {
  try {
    const data = await response.json();
    return {
      status: response.status,
      code: data.code || 'UNKNOWN_ERROR',
      message: data.message || getDefaultErrorMessage(response.status),
      details: data.details,
    };
  } catch {
    return {
      status: response.status,
      code: 'PARSE_ERROR',
      message: getDefaultErrorMessage(response.status),
    };
  }
}

/**
 * Get user-friendly error message based on status code
 */
function getDefaultErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'The request was invalid. Please check your input.';
    case 401:
      return 'You need to sign in to continue.';
    case 403:
      return 'You don\'t have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'This action conflicts with existing data.';
    case 422:
      return 'The provided data is invalid.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'An unexpected server error occurred.';
    case 502:
    case 503:
    case 504:
      return 'The service is temporarily unavailable.';
    default:
      return 'An unexpected error occurred.';
  }
}

// Usage with fetch
async function fetchWithErrorHandling<T>(url: string): Promise<T> {
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await parseApiError(response);
    throw new Error(error.message);
  }
  
  return response.json();
}
```

## Toast Error Notifications

```tsx
import {
  useToastController,
  Toast,
  ToastTitle,
  ToastBody,
  ToastFooter,
  ToastTrigger,
  Toaster,
  useId,
  Button,
  Link,
} from '@fluentui/react-components';

// Create error toast
export const useErrorToast = () => {
  const toasterId = useId('error-toaster');
  const { dispatchToast } = useToastController(toasterId);

  const showError = (message: string, options?: { 
    title?: string;
    onRetry?: () => void;
  }) => {
    dispatchToast(
      <Toast>
        <ToastTitle>{options?.title || 'Error'}</ToastTitle>
        <ToastBody>{message}</ToastBody>
        {options?.onRetry && (
          <ToastFooter>
            <ToastTrigger>
              <Link onClick={options.onRetry}>Retry</Link>
            </ToastTrigger>
          </ToastFooter>
        )}
      </Toast>,
      { intent: 'error', timeout: 5000 }
    );
  };

  return { toasterId, showError };
};

// Usage
export const MyComponent = () => {
  const { toasterId, showError } = useErrorToast();

  const handleAction = async () => {
    try {
      await doSomething();
    } catch (error) {
      showError(error.message, { 
        title: 'Action Failed',
        onRetry: handleAction,
      });
    }
  };

  return (
    <>
      <Toaster toasterId={toasterId} />
      <Button onClick={handleAction}>Do Something</Button>
    </>
  );
};
```

## Network Error Handler

```tsx
import { useState, useCallback } from 'react';
import { MessageBar, MessageBarBody, Button } from '@fluentui/react-components';

interface NetworkErrorState {
  isOnline: boolean;
  hasNetworkError: boolean;
  error: Error | null;
}

export const useNetworkError = () => {
  const [state, setState] = useState<NetworkErrorState>({
    isOnline: navigator.onLine,
    hasNetworkError: false,
    error: null,
  });

  const handleNetworkError = useCallback((error: Error) => {
    const isNetworkError = 
      error.message === 'Failed to fetch' ||
      error.message.includes('NetworkError') ||
      !navigator.onLine;

    setState({
      isOnline: navigator.onLine,
      hasNetworkError: isNetworkError,
      error,
    });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, hasNetworkError: false, error: null }));
  }, []);

  return { ...state, handleNetworkError, clearError };
};

// Network error banner
export const NetworkErrorBanner = ({ onRetry }: { onRetry: () => void }) => (
  <MessageBar intent="error" style={{ marginBottom: '16px' }}>
    <MessageBarBody>
      Unable to connect. Please check your internet connection.
      <Button appearance="transparent" onClick={onRetry} style={{ marginLeft: '8px' }}>
        Retry
      </Button>
    </MessageBarBody>
  </MessageBar>
);
```

## Error Recovery Pattern

```tsx
import { useState, useCallback } from 'react';
import { Button, makeStyles, tokens, Text } from '@fluentui/react-components';
import { ArrowSyncRegular, CheckmarkCircleRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalL,
  },
  retryButton: {
    minWidth: '120px',
  },
});

type RecoveryStatus = 'idle' | 'retrying' | 'success' | 'failed';

interface ErrorRecoveryProps {
  error: Error;
  onRetry: () => Promise<void>;
  maxRetries?: number;
}

export const ErrorRecovery = ({
  error,
  onRetry,
  maxRetries = 3,
}: ErrorRecoveryProps) => {
  const styles = useStyles();
  const [status, setStatus] = useState<RecoveryStatus>('idle');
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = useCallback(async () => {
    if (retryCount >= maxRetries) return;
    
    setStatus('retrying');
    setRetryCount(prev => prev + 1);
    
    try {
      await onRetry();
      setStatus('success');
    } catch {
      setStatus('failed');
    }
  }, [onRetry, retryCount, maxRetries]);

  if (status === 'success') {
    return (
      <div className={styles.container}>
        <CheckmarkCircleRegular style={{ fontSize: '48px', color: tokens.colorPaletteGreenForeground1 }} />
        <Text>Recovered successfully!</Text>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Text weight="semibold">Error: {error.message}</Text>
      <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
        Retry attempt {retryCount} of {maxRetries}
      </Text>
      <Button
        appearance="primary"
        icon={<ArrowSyncRegular />}
        onClick={handleRetry}
        disabled={status === 'retrying' || retryCount >= maxRetries}
        className={styles.retryButton}
      >
        {status === 'retrying' ? 'Retrying...' : 'Retry'}
      </Button>
      {retryCount >= maxRetries && (
        <Text size={200} style={{ color: tokens.colorPaletteRedForeground1 }}>
          Maximum retries reached. Please contact support.
        </Text>
      )}
    </div>
  );
};
```

## useError Hook

```tsx
import { useState, useCallback } from 'react';

interface UseErrorResult {
  error: Error | null;
  setError: (error: Error | null) => void;
  clearError: () => void;
  withErrorHandling: <T>(fn: () => Promise<T>) => Promise<T | undefined>;
}

export function useError(): UseErrorResult {
  const [error, setError] = useState<Error | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const withErrorHandling = useCallback(async <T,>(fn: () => Promise<T>) => {
    try {
      clearError();
      return await fn();
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return undefined;
    }
  }, [clearError]);

  return { error, setError, clearError, withErrorHandling };
}

// Usage
const MyComponent = () => {
  const { error, clearError, withErrorHandling } = useError();

  const handleSubmit = async () => {
    await withErrorHandling(async () => {
      await submitData();
    });
  };

  return (
    <>
      {error && (
        <InlineError 
          message={error.message} 
          onDismiss={clearError}
          onRetry={handleSubmit}
        />
      )}
      <Button onClick={handleSubmit}>Submit</Button>
    </>
  );
};
```

## Best Practices

1. **Be specific** - Tell users what went wrong in plain language
2. **Provide recovery options** - Include retry buttons, alternative actions
3. **Log errors** - Send errors to monitoring service for debugging
4. **Handle gracefully** - Never show raw error messages to users
5. **Preserve user data** - Don't lose form data on error
6. **Use appropriate severity** - Error vs warning vs info
7. **Test error states** - Include error scenarios in testing

## Related Documentation

- [01-loading-states.md](01-loading-states.md) - Loading patterns
- [02-empty-states.md](02-empty-states.md) - Empty state patterns
- [04-data-fetching.md](04-data-fetching.md) - Data fetching with error handling
- [MessageBar Component](../../02-components/feedback/messagebar.md)
- [Toast Component](../../02-components/feedback/toast.md)