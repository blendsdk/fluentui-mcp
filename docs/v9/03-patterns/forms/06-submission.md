# Form Submission Patterns

> **File**: 03-patterns/forms/06-submission.md
> **FluentUI Version**: 9.x

## Overview

Form submission patterns for FluentUI v9, including loading states, success/error handling, toast notifications, and optimistic updates.

## Basic Form Submission

```tsx
import { useState } from 'react';
import {
  Field,
  Input,
  Button,
  Spinner,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const BasicSubmission = () => {
  const styles = useStyles();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Submitted:', email);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Field label="Email" required>
        <Input
          type="email"
          value={email}
          onChange={(e, data) => setEmail(data.value)}
          disabled={isSubmitting}
        />
      </Field>

      <Button
        type="submit"
        appearance="primary"
        disabled={isSubmitting}
        icon={isSubmitting ? <Spinner size="tiny" /> : undefined}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
};
```

## Submission with Toast Notifications

```tsx
import { useState } from 'react';
import {
  Field,
  Input,
  Button,
  Spinner,
  useToastController,
  Toast,
  ToastTitle,
  ToastBody,
  Toaster,
  useId,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

// Simulated API call
const submitForm = async (data: { name: string; email: string }) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate random failure for demo
  if (Math.random() > 0.7) {
    throw new Error('Server error');
  }
  
  return { success: true, id: '123' };
};

export const SubmissionWithToast = () => {
  const styles = useStyles();
  const toasterId = useId('toaster');
  const { dispatchToast } = useToastController(toasterId);
  
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitForm(formData);
      
      dispatchToast(
        <Toast>
          <ToastTitle>Success!</ToastTitle>
          <ToastBody>Your form has been submitted successfully.</ToastBody>
        </Toast>,
        { intent: 'success' }
      );
      
      // Reset form
      setFormData({ name: '', email: '' });
    } catch (error) {
      dispatchToast(
        <Toast>
          <ToastTitle>Error</ToastTitle>
          <ToastBody>
            Failed to submit form. Please try again.
          </ToastBody>
        </Toast>,
        { intent: 'error' }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster toasterId={toasterId} />
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <Field label="Name" required>
          <Input
            value={formData.name}
            onChange={(e, data) => setFormData(prev => ({ ...prev, name: data.value }))}
            disabled={isSubmitting}
          />
        </Field>

        <Field label="Email" required>
          <Input
            type="email"
            value={formData.email}
            onChange={(e, data) => setFormData(prev => ({ ...prev, email: data.value }))}
            disabled={isSubmitting}
          />
        </Field>

        <Button
          type="submit"
          appearance="primary"
          disabled={isSubmitting}
          icon={isSubmitting ? <Spinner size="tiny" /> : undefined}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </>
  );
};
```

## Inline Success/Error Messages

```tsx
import { useState } from 'react';
import {
  Field,
  Input,
  Button,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
  message: {
    marginBottom: tokens.spacingVerticalM,
  },
});

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export const InlineMessages = () => {
  const styles = useStyles();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email.includes('error')) {
            reject(new Error('Invalid email domain'));
          } else {
            resolve(true);
          }
        }, 1500);
      });
      
      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {status === 'success' && (
        <MessageBar intent="success" className={styles.message}>
          <MessageBarBody>
            <MessageBarTitle>Success</MessageBarTitle>
            Your subscription has been confirmed!
          </MessageBarBody>
        </MessageBar>
      )}

      {status === 'error' && (
        <MessageBar intent="error" className={styles.message}>
          <MessageBarBody>
            <MessageBarTitle>Error</MessageBarTitle>
            {errorMessage}
          </MessageBarBody>
        </MessageBar>
      )}

      <Field label="Email" required>
        <Input
          type="email"
          value={email}
          onChange={(e, data) => {
            setEmail(data.value);
            if (status !== 'idle') setStatus('idle');
          }}
          disabled={status === 'loading'}
        />
      </Field>

      <Button
        type="submit"
        appearance="primary"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </Button>
    </form>
  );
};
```

## Submission with Confirmation Dialog

```tsx
import { useState } from 'react';
import {
  Field,
  Input,
  Button,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Spinner,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const SubmissionWithConfirmation = () => {
  const styles = useStyles();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitClick = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Submitted:', formData);
      setShowConfirm(false);
      setFormData({ name: '', email: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmitClick}>
        <Field label="Name" required>
          <Input
            value={formData.name}
            onChange={(e, data) => setFormData(prev => ({ ...prev, name: data.value }))}
          />
        </Field>

        <Field label="Email" required>
          <Input
            type="email"
            value={formData.email}
            onChange={(e, data) => setFormData(prev => ({ ...prev, email: data.value }))}
          />
        </Field>

        <Button type="submit" appearance="primary">
          Submit
        </Button>
      </form>

      <Dialog open={showConfirm} onOpenChange={(e, data) => setShowConfirm(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Confirm Submission</DialogTitle>
            <DialogContent>
              Are you sure you want to submit this form?
              <br /><br />
              <strong>Name:</strong> {formData.name}<br />
              <strong>Email:</strong> {formData.email}
            </DialogContent>
            <DialogActions>
              <Button
                appearance="secondary"
                onClick={() => setShowConfirm(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                appearance="primary"
                onClick={handleConfirm}
                disabled={isSubmitting}
                icon={isSubmitting ? <Spinner size="tiny" /> : undefined}
              >
                {isSubmitting ? 'Submitting...' : 'Confirm'}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
};
```

## Optimistic Update Pattern

```tsx
import { useState } from 'react';
import {
  Field,
  Input,
  Button,
  Card,
  Text,
  Spinner,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: tokens.spacingVerticalS,
  },
  pending: {
    opacity: 0.6,
  },
});

interface Todo {
  id: string;
  text: string;
  pending?: boolean;
}

export const OptimisticUpdate = () => {
  const styles = useStyles();
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: 'Learn FluentUI' },
    { id: '2', text: 'Build forms' },
  ]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticTodo: Todo = {
      id: tempId,
      text: newTodo,
      pending: true,
    };

    // Optimistically add to list
    setTodos(prev => [...prev, optimisticTodo]);
    setNewTodo('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Replace optimistic item with confirmed item
      setTodos(prev =>
        prev.map(todo =>
          todo.id === tempId
            ? { ...todo, id: `real-${Date.now()}`, pending: false }
            : todo
        )
      );
    } catch (error) {
      // Remove optimistic item on failure
      setTodos(prev => prev.filter(todo => todo.id !== tempId));
      console.error('Failed to add todo');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={addTodo}>
        <Field label="Add Todo">
          <Input
            value={newTodo}
            onChange={(e, data) => setNewTodo(data.value)}
            placeholder="What needs to be done?"
            contentAfter={
              <Button type="submit" size="small" appearance="primary">
                Add
              </Button>
            }
          />
        </Field>
      </form>

      {todos.map(todo => (
        <Card
          key={todo.id}
          className={`${styles.item} ${todo.pending ? styles.pending : ''}`}
        >
          <Text>{todo.text}</Text>
          {todo.pending && <Spinner size="tiny" />}
        </Card>
      ))}
    </div>
  );
};
```

## useFormSubmit Hook

```tsx
import { useState, useCallback } from 'react';

interface UseFormSubmitOptions<T, R> {
  onSubmit: (data: T) => Promise<R>;
  onSuccess?: (result: R, data: T) => void;
  onError?: (error: Error, data: T) => void;
  resetOnSuccess?: boolean;
}

interface UseFormSubmitReturn<T> {
  isSubmitting: boolean;
  error: Error | null;
  success: boolean;
  submit: (data: T) => Promise<void>;
  reset: () => void;
}

export function useFormSubmit<T, R = void>({
  onSubmit,
  onSuccess,
  onError,
  resetOnSuccess = false,
}: UseFormSubmitOptions<T, R>): UseFormSubmitReturn<T> {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = useCallback(async (data: T) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await onSubmit(data);
      setSuccess(true);
      onSuccess?.(result, data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error, data);
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, onSuccess, onError]);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    isSubmitting,
    error,
    success,
    submit,
    reset,
  };
}

// Usage Example
export const FormWithSubmitHook = () => {
  const [email, setEmail] = useState('');
  
  const { isSubmitting, error, success, submit, reset } = useFormSubmit({
    onSubmit: async (data: { email: string }) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { id: '123' };
    },
    onSuccess: (result) => {
      console.log('Created with ID:', result.id);
      setEmail('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit({ email });
  };

  return (
    <form onSubmit={handleSubmit}>
      {success && <MessageBar intent="success">Success!</MessageBar>}
      {error && <MessageBar intent="error">{error.message}</MessageBar>}
      
      <Field label="Email">
        <Input
          value={email}
          onChange={(e, data) => {
            setEmail(data.value);
            if (success || error) reset();
          }}
          disabled={isSubmitting}
        />
      </Field>
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
};
```

## Retry on Failure

```tsx
import { useState } from 'react';
import {
  Field,
  Input,
  Button,
  MessageBar,
  MessageBarBody,
  MessageBarActions,
  Spinner,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const RetryOnFailure = () => {
  const styles = useStyles();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const submitForm = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate 50% failure rate
          if (Math.random() > 0.5) {
            reject(new Error('Network error'));
          } else {
            resolve(true);
          }
        }, 1000);
      });
      
      console.log('Success!');
      setEmail('');
      setRetryCount(0);
    } catch (err) {
      setError('Failed to submit. Please try again.');
      setRetryCount(prev => prev + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && (
        <MessageBar intent="error">
          <MessageBarBody>
            {error}
            {retryCount > 0 && ` (Attempt ${retryCount})`}
          </MessageBarBody>
          <MessageBarActions>
            <Button
              size="small"
              onClick={submitForm}
              disabled={isSubmitting}
            >
              Retry
            </Button>
          </MessageBarActions>
        </MessageBar>
      )}

      <Field label="Email" required>
        <Input
          type="email"
          value={email}
          onChange={(e, data) => setEmail(data.value)}
          disabled={isSubmitting}
        />
      </Field>

      <Button
        type="submit"
        appearance="primary"
        disabled={isSubmitting}
        icon={isSubmitting ? <Spinner size="tiny" /> : undefined}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
};
```

## Related Documentation

- [01-basic-forms.md](01-basic-forms.md) - Basic form structure
- [02-validation.md](02-validation.md) - Form validation patterns
- [../../02-components/feedback/toast.md](../../02-components/feedback/toast.md) - Toast component
- [../../02-components/feedback/messagebar.md](../../02-components/feedback/messagebar.md) - MessageBar component