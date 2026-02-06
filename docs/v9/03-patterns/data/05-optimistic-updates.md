# Optimistic Updates Pattern

> **File**: 03-patterns/data/05-optimistic-updates.md
> **FluentUI Version**: 9.x

## Overview

Optimistic update patterns for FluentUI v9 applications. Provides instant UI feedback before server confirmation, improving perceived performance and user experience.

## Basic Optimistic Update

```tsx
import { useState, useCallback } from 'react';
import { Button, Checkbox, Text, Spinner } from '@fluentui/react-components';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export const OptimisticTodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', title: 'Learn FluentUI', completed: false },
    { id: '2', title: 'Build app', completed: false },
  ]);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const toggleTodo = useCallback(async (id: string) => {
    // Store previous state for rollback
    const previousTodos = [...todos];
    
    // Optimistically update UI
    setTodos(current =>
      current.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    setPendingIds(prev => new Set(prev).add(id));

    try {
      // Make API call
      const response = await fetch(`/api/todos/${id}/toggle`, { method: 'PATCH' });
      if (!response.ok) throw new Error('Failed to update');
    } catch (error) {
      // Rollback on failure
      setTodos(previousTodos);
      console.error('Failed to toggle todo:', error);
    } finally {
      setPendingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, [todos]);

  return (
    <div>
      {todos.map(todo => (
        <div key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Checkbox
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
            disabled={pendingIds.has(todo.id)}
          />
          <Text style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            {todo.title}
          </Text>
          {pendingIds.has(todo.id) && <Spinner size="tiny" />}
        </div>
      ))}
    </div>
  );
};
```

## useOptimistic Hook

```tsx
import { useState, useCallback, useRef } from 'react';

interface UseOptimisticOptions<T> {
  onError?: (error: Error, rollbackData: T) => void;
}

interface UseOptimisticResult<T> {
  data: T;
  isPending: boolean;
  optimisticUpdate: (
    updateFn: (current: T) => T,
    asyncOperation: () => Promise<void>
  ) => Promise<void>;
}

export function useOptimistic<T>(
  initialData: T,
  options: UseOptimisticOptions<T> = {}
): UseOptimisticResult<T> {
  const [data, setData] = useState(initialData);
  const [isPending, setIsPending] = useState(false);
  const previousDataRef = useRef<T>(initialData);

  const optimisticUpdate = useCallback(
    async (updateFn: (current: T) => T, asyncOperation: () => Promise<void>) => {
      // Store current data for potential rollback
      previousDataRef.current = data;
      
      // Optimistically update
      setData(updateFn);
      setIsPending(true);

      try {
        await asyncOperation();
      } catch (error) {
        // Rollback on error
        setData(previousDataRef.current);
        options.onError?.(
          error instanceof Error ? error : new Error(String(error)),
          previousDataRef.current
        );
      } finally {
        setIsPending(false);
      }
    },
    [data, options]
  );

  return { data, isPending, optimisticUpdate };
}

// Usage
const TodoApp = () => {
  const { data: todos, isPending, optimisticUpdate } = useOptimistic<Todo[]>(
    initialTodos,
    { onError: (err) => showToast(`Error: ${err.message}`) }
  );

  const addTodo = (title: string) => {
    const newTodo = { id: Date.now().toString(), title, completed: false };
    
    optimisticUpdate(
      (current) => [...current, newTodo],
      async () => {
        await fetch('/api/todos', {
          method: 'POST',
          body: JSON.stringify(newTodo),
        });
      }
    );
  };

  return <TodoList todos={todos} onAdd={addTodo} isPending={isPending} />;
};
```

## Optimistic Delete with Undo

```tsx
import { useState, useCallback } from 'react';
import {
  Button,
  Toast,
  ToastTitle,
  ToastBody,
  ToastFooter,
  Toaster,
  useToastController,
  useId,
  Link,
} from '@fluentui/react-components';

interface Item {
  id: string;
  name: string;
}

export const OptimisticDeleteWithUndo = () => {
  const [items, setItems] = useState<Item[]>([
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
  ]);
  
  const toasterId = useId('delete-toaster');
  const { dispatchToast } = useToastController(toasterId);
  
  const deleteItem = useCallback(async (id: string) => {
    // Find and store the item
    const deletedItem = items.find(item => item.id === id);
    if (!deletedItem) return;

    // Optimistically remove from UI
    setItems(current => current.filter(item => item.id !== id));

    // Create undo timeout
    let isUndone = false;
    const undoTimeout = setTimeout(async () => {
      if (isUndone) return;
      
      // Actually delete from server
      try {
        await fetch(`/api/items/${id}`, { method: 'DELETE' });
      } catch (error) {
        // Restore if delete fails
        setItems(current => [...current, deletedItem]);
      }
    }, 5000);

    // Show toast with undo option
    dispatchToast(
      <Toast>
        <ToastTitle>Item deleted</ToastTitle>
        <ToastBody>"{deletedItem.name}" was removed.</ToastBody>
        <ToastFooter>
          <Link
            onClick={() => {
              isUndone = true;
              clearTimeout(undoTimeout);
              setItems(current => [...current, deletedItem]);
            }}
          >
            Undo
          </Link>
        </ToastFooter>
      </Toast>,
      { timeout: 5000 }
    );
  }, [items, dispatchToast]);

  return (
    <>
      <Toaster toasterId={toasterId} />
      {items.map(item => (
        <div key={item.id}>
          {item.name}
          <Button onClick={() => deleteItem(item.id)}>Delete</Button>
        </div>
      ))}
    </>
  );
};
```

## Optimistic Create with Temporary ID

```tsx
import { useState, useCallback } from 'react';
import { Button, Input, Spinner, Badge } from '@fluentui/react-components';

interface Message {
  id: string;
  text: string;
  status: 'sending' | 'sent' | 'failed';
  tempId?: string;
}

export const OptimisticMessageList = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = useCallback(async (text: string) => {
    // Create message with temporary ID
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      id: tempId,
      text,
      status: 'sending',
      tempId,
    };

    // Add to list immediately
    setMessages(current => [...current, optimisticMessage]);
    setInput('');

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) throw new Error('Failed to send');
      
      const savedMessage = await response.json();

      // Replace temp message with real one
      setMessages(current =>
        current.map(msg =>
          msg.tempId === tempId
            ? { ...savedMessage, status: 'sent' as const }
            : msg
        )
      );
    } catch (error) {
      // Mark as failed
      setMessages(current =>
        current.map(msg =>
          msg.tempId === tempId ? { ...msg, status: 'failed' as const } : msg
        )
      );
    }
  }, []);

  const retryMessage = useCallback(async (tempId: string) => {
    const message = messages.find(m => m.tempId === tempId);
    if (!message) return;

    // Update status back to sending
    setMessages(current =>
      current.map(msg =>
        msg.tempId === tempId ? { ...msg, status: 'sending' as const } : msg
      )
    );

    // Retry the send
    await sendMessage(message.text);
  }, [messages, sendMessage]);

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        {messages.map(message => (
          <div key={message.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px' }}>
            <span>{message.text}</span>
            {message.status === 'sending' && <Spinner size="tiny" />}
            {message.status === 'sent' && <Badge color="success">Sent</Badge>}
            {message.status === 'failed' && (
              <>
                <Badge color="danger">Failed</Badge>
                <Button size="small" onClick={() => retryMessage(message.tempId!)}>
                  Retry
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
      
      <div style={{ display: 'flex', gap: '8px' }}>
        <Input
          value={input}
          onChange={(e, data) => setInput(data.value)}
          placeholder="Type a message..."
        />
        <Button
          appearance="primary"
          disabled={!input.trim()}
          onClick={() => sendMessage(input)}
        >
          Send
        </Button>
      </div>
    </div>
  );
};
```

## React Query Optimistic Updates

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToastController, Toast, ToastTitle, ToastBody } from '@fluentui/react-components';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export const useOptimisticToggleTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (todoId: string) => {
      const response = await fetch(`/api/todos/${todoId}/toggle`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Failed to toggle');
      return response.json();
    },
    
    onMutate: async (todoId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // Snapshot previous value
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      // Optimistically update
      queryClient.setQueryData<Todo[]>(['todos'], (old) =>
        old?.map((todo) =>
          todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
        )
      );

      // Return context for rollback
      return { previousTodos };
    },

    onError: (err, todoId, context) => {
      // Rollback on error
      queryClient.setQueryData(['todos'], context?.previousTodos);
    },

    onSettled: () => {
      // Refetch after mutation settles
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};
```

## SWR Optimistic Updates

```tsx
import useSWR, { mutate } from 'swr';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export const useOptimisticTodos = () => {
  const { data, error, isLoading } = useSWR<Todo[]>('/api/todos');

  const toggleTodo = async (id: string) => {
    // Optimistically update
    mutate(
      '/api/todos',
      (todos: Todo[] | undefined) =>
        todos?.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ),
      false // Don't revalidate yet
    );

    try {
      await fetch(`/api/todos/${id}/toggle`, { method: 'PATCH' });
      // Revalidate after success
      mutate('/api/todos');
    } catch {
      // Revalidate to restore correct state
      mutate('/api/todos');
    }
  };

  return { todos: data, isLoading, error, toggleTodo };
};
```

## useOptimisticMutation Hook

```tsx
import { useState, useCallback } from 'react';

interface OptimisticMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onMutate?: (variables: TVariables) => TData | void;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables, rollbackData?: TData) => void;
  onSettled?: () => void;
}

export function useOptimisticMutation<TData, TVariables>(
  options: OptimisticMutationOptions<TData, TVariables>
) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (variables: TVariables) => {
      setIsPending(true);
      setError(null);

      // Get optimistic data
      const rollbackData = options.onMutate?.(variables);

      try {
        const result = await options.mutationFn(variables);
        options.onSuccess?.(result, variables);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        options.onError?.(error, variables, rollbackData as TData);
      } finally {
        setIsPending(false);
        options.onSettled?.();
      }
    },
    [options]
  );

  return { mutate, isPending, error };
}
```

## Best Practices

1. **Store previous state** - Always keep rollback data
2. **Show pending states** - Indicate which items are updating
3. **Handle failures gracefully** - Rollback and show error message
4. **Provide undo for destructive actions** - Give users a chance to recover
5. **Use temporary IDs** - For creates, use temp IDs until server confirms
6. **Revalidate after success** - Ensure data is eventually consistent
7. **Consider race conditions** - Handle multiple rapid updates

## Related Documentation

- [01-loading-states.md](01-loading-states.md) - Loading patterns
- [03-error-handling.md](03-error-handling.md) - Error handling
- [04-data-fetching.md](04-data-fetching.md) - Data fetching patterns
- [Toast Component](../../02-components/feedback/toast.md)