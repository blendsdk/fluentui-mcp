# Server State

> **Group**: state

## Goal

Render server-backed data in a Fluent UI React v9 app with consistent, accessible handling of first load, background refresh, blocking and non-blocking errors, empty results, and mutations — using a small cancellable fetch layer plus Fluent components for every state.

## When to Use

Any screen whose content comes from an API: list and detail views, dashboards, tables, live/polled views, and forms that submit to a server and can return validation errors. Use it when you want one consistent, accessible treatment of loading/error/empty/success that (a) never blanks out data the user is already reading, (b) survives rapid navigation without race conditions, and (c) can sit on top of any data layer (fetch, TanStack Query, SWR, RTK Query).

## When Not to Use

Do not use it for purely client-side state (open/closed flags, wizard steps, form drafts) — use React state/context or the built-in state of components such as Accordion or TabList instead. Do not use it as a substitute for a real cache/normalization layer: if several screens share the same entities, put a query cache under this recipe rather than duplicating useServerResource calls. Do not use it for static or build-time data that never changes at runtime.

Fluent UI React v9 is a presentation layer. It ships every component you need to *show* remote data and none of the machinery to *fetch* it — there is no `useQuery`, no cache, and no retry policy. This recipe therefore has two halves:

1. **A four-line fetch layer** (`useServerResource`) that owns cancellation, ordering, and the loading/refresh distinction.
2. **A render layer** (`AsyncBoundary`) that maps that state onto Fluent components so every remote screen looks and behaves the same.

## The five states — and why they are not one boolean

| State | What the user sees | Condition |
| --- | --- | --- |
| First load | `Skeleton` shaped like the final content, or a labelled `Spinner` when the shape is unknown | `isInitialLoading && !data` |
| Refresh | Existing data stays on screen, a small `Spinner` sits inside the refresh control, region has `aria-busy` | `isRefreshing && data` |
| Blocking error | `MessageBar intent='error' politeness='assertive'` with a retry `Button` in `MessageBarActions` | `error && !data` |
| Stale error | `MessageBar intent='warning'` above the previously loaded data | `error && data` |
| Empty | `Text` heading + body, centred | `!error && data && isEmpty(data)` |
| Success | Your real content (`Table`, `Card`, `List`, …) | otherwise |

The most important distinction in the whole recipe is `isInitialLoading` versus `isRefreshing`. Collapsing them into a single `isLoading` is what makes a refresh blank the screen and feel like a page reload.

## 1. Model the resource once

Expose a single record, `ServerResource<T>`, with `data`, `error`, `isInitialLoading`, `isRefreshing`, `updatedAt`, and `refresh`. Because it is a plain object, it can be produced by your own hook or derived from a library's return value in one line of adapter code.

## 2. Make the fetch layer cancellable and ordered

Two bugs appear the moment users can navigate or click faster than the network responds:

- **Out-of-order responses.** Request A (slow) resolves after request B (fast) and overwrites fresher data. Fix it with a monotonic request id: only the newest request may write to state.
- **Work after unmount.** Fix it with an `AbortController` created per request, aborted in the effect cleanup and before every new request. Pass `controller.signal` to `fetch`.

Also check `response.ok` — `fetch` resolves on 4xx/5xx, so without this check an error payload is rendered as success.

## 3. Render with an `AsyncBoundary`

`AsyncBoundary` takes the resource plus a render-prop child and applies the precedence table above. Two design rules make it reusable:

- The `skeleton` prop is a `ReactNode` supplied by the caller, so the placeholder can match the real layout (a table skeleton for a table, a card skeleton for a card). Layout stability matters more than a pretty placeholder.
- Refresh failures never destroy the payload. If `data` exists and `error` appears afterwards, the boundary keeps the data and adds a warning bar.

## 4. Keep refresh controls outside the boundary

Put the Refresh `Button`, `updatedAt` stamp and any count `Badge` in the page header — not inside the success branch of the boundary. If the refresh control lives inside the region that un-mounts on reload, focus is lost and the button flickers. Show progress by putting a tiny `Spinner` in the button's `icon` slot and setting `disabled={isRefreshing}`.

## 5. When the shape is unknown, prefer a delayed spinner

`Spinner` accepts `delay` in milliseconds. Use `delay={300}` so requests that finish in 80 ms never flash a spinner, and reserve `Skeleton` for the common case where you know the layout.

## 6. Map any data library onto the same record

| Library concept | `ServerResource<T>` field |
| --- | --- |
| `isPending` / `isLoading` | `isInitialLoading` |
| `isFetching` / `isValidating` | `isRefreshing` |
| `data` | `data` |
| `error` | `error` |
| `refetch()` / `mutate()` | `refresh` |
| `dataUpdatedAt` | `updatedAt` |

Keeping the adapter at this boundary means your components never import a data library, and swapping libraries is a single-file change.

## 7. Polling and live data

Drive polling from `refresh` in an effect that (a) clears its interval on unmount, (b) skips ticks while `document.visibilityState !== 'visible'`, (c) refetches immediately when the tab becomes visible again, and (d) can be paused by the user. Because `refresh` keeps previous data, a background poll is visually silent — the only visible change is the timestamp.

## 8. Mutations are a separate resource

Do not fold a POST into the read resource. Keep a local `isSubmitting` flag, disable the submit `Button` (with a `Spinner` in its `icon` slot), and map server-side field errors onto `Field`'s `validationState='error'` + `validationMessage` so the markup a screen reader reads is identical to client-side validation. Anything that is not a field error goes into a form-level `MessageBar`; success is announced politely. After success, call `refresh()` on the affected resources — that is your cache invalidation.

## 9. Announce transitions

Wrap a status string in `AriaLiveAnnouncer`, keep errors `politeness='assertive'` and progress/success `politeness='polite'`, and mark the content region with `aria-busy={isRefreshing}`. Screen-reader users then hear *Loading*, *Loaded 12 users*, or *Loading users failed* exactly once per transition.

## Examples

### useServerResource + AsyncBoundary (the core of the recipe)

A cancellable, race-safe fetch hook with a stale-while-revalidate flag, plus the boundary component that renders skeleton, spinner, blocking error with retry, stale-data warning, empty state, and success — followed by a demo panel that wires them together.

```tsx
// ----------------------------------------------------------------
// useServerResource.ts
// ----------------------------------------------------------------
import * as React from 'react';

export interface ServerResource<T> {
  data: T | undefined;
  error: Error | undefined;
  /** True only while the first payload is in flight and nothing is cached yet. */
  isInitialLoading: boolean;
  /** True while re-fetching with data already on screen (stale-while-revalidate). */
  isRefreshing: boolean;
  /** Epoch milliseconds of the last successful payload. */
  updatedAt: number | undefined;
  /** Re-run the fetcher; existing data stays visible. Identity is stable. */
  refresh: () => void;
}

type InternalState<T> = Omit<ServerResource<T>, 'refresh'>;

export function useServerResource<T>(
  key: string,
  fetcher: (signal: AbortSignal) => Promise<T>,
): ServerResource<T> {
  const [state, setState] = React.useState<InternalState<T>>({
    data: undefined,
    error: undefined,
    isInitialLoading: true,
    isRefreshing: false,
    updatedAt: undefined,
  });

  // Keep the newest fetcher in a ref so an inline arrow does not re-trigger requests.
  const fetcherRef = React.useRef(fetcher);
  fetcherRef.current = fetcher;

  // Monotonic request id: only the newest response may write to state.
  const requestIdRef = React.useRef(0);
  const controllerRef = React.useRef<AbortController | null>(null);

  const run = React.useCallback(() => {
    const requestId = ++requestIdRef.current;
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    setState(previous => ({
      ...previous,
      error: undefined,
      isInitialLoading: previous.data === undefined,
      isRefreshing: previous.data !== undefined,
    }));

    fetcherRef.current(controller.signal).then(
      data => {
        if (requestId !== requestIdRef.current || controller.signal.aborted) {
          return; // superseded by a newer request, or cancelled
        }
        setState({
          data,
          error: undefined,
          isInitialLoading: false,
          isRefreshing: false,
          updatedAt: Date.now(),
        });
      },
      (cause: unknown) => {
        if (requestId !== requestIdRef.current || controller.signal.aborted) {
          return;
        }
        setState(previous => ({
          ...previous,
          error: cause instanceof Error ? cause : new Error(String(cause)),
          isInitialLoading: false,
          isRefreshing: false,
        }));
      },
    );
  }, []);

  React.useEffect(() => {
    run();
    // Abort on unmount and whenever the request identity changes.
    return () => controllerRef.current?.abort();
  }, [key, run]);

  return React.useMemo(() => ({ ...state, refresh: run }), [state, run]);
}

// ----------------------------------------------------------------
// AsyncBoundary.tsx
// ----------------------------------------------------------------
import {
  Button,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  MessageBarTitle,
  Skeleton,
  SkeletonItem,
  Spinner,
  Text,
} from '@fluentui/react-components';
import type { ServerResource } from './useServerResource';

export interface AsyncBoundaryProps<T> {
  resource: ServerResource<T>;
  /** First-load placeholder. Match the final layout so nothing shifts. */
  skeleton?: React.ReactNode;
  loadingLabel?: string;
  /** Return true when the payload loaded successfully but has nothing to show. */
  isEmpty?: (data: T) => boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  children: (data: T) => React.ReactNode;
}

export function AsyncBoundary<T>({
  resource,
  skeleton,
  loadingLabel = 'Loading…',
  isEmpty,
  emptyTitle = 'Nothing here yet',
  emptyMessage = 'Content will appear as soon as it is available.',
  children,
}: AsyncBoundaryProps<T>) {
  const { data, error, isInitialLoading, isRefreshing, refresh } = resource;

  // 1. First load: nothing cached yet.
  if (isInitialLoading && data === undefined) {
    return skeleton ? (
      <>{skeleton}</>
    ) : (
      <Spinner labelPosition='below' size='medium' delay={300}>
        {loadingLabel}
      </Spinner>
    );
  }

  // 2. Failure with nothing to fall back to.
  if (error && data === undefined) {
    return (
      <MessageBar intent='error' politeness='assertive'>
        <MessageBarBody>
          <MessageBarTitle>We could not load this content</MessageBarTitle>
          {error.message}
        </MessageBarBody>
        <MessageBarActions>
          <Button appearance='secondary' onClick={refresh}>
            Try again
          </Button>
        </MessageBarActions>
      </MessageBar>
    );
  }

  if (data === undefined) {
    return null;
  }

  // 3. Success, but empty.
  if (isEmpty?.(data)) {
    return (
      <div style={{ display: 'grid', gap: 4, justifyItems: 'center', padding: 32 }}>
        <Text size={400} weight='semibold' block>
          {emptyTitle}
        </Text>
        <Text size={200} block>
          {emptyMessage}
        </Text>
      </div>
    );
  }

  // 4. Success, optionally with a non-blocking warning over stale data.
  return (
    <>
      {error ? (
        <MessageBar intent='warning'>
          <MessageBarBody>
            <MessageBarTitle>Showing previously loaded data</MessageBarTitle>
            {`The latest refresh failed: ${error.message}`}
          </MessageBarBody>
          <MessageBarActions>
            <Button appearance='secondary' onClick={refresh} disabled={isRefreshing}>
              Retry
            </Button>
          </MessageBarActions>
        </MessageBar>
      ) : null}
      <div aria-busy={isRefreshing}>{children(data)}</div>
    </>
  );
}

// ----------------------------------------------------------------
// UsersPanel.tsx  — demo usage
// ----------------------------------------------------------------
import { Skeleton as SkeletonRoot, SkeletonItem as SkeletonBar } from '@fluentui/react-components';

interface User {
  id: string;
  name: string;
  email: string;
}

async function fetchUsers(signal: AbortSignal): Promise<User[]> {
  const response = await fetch('/api/users', { signal });
  if (!response.ok) {
    throw new Error(`GET /api/users failed with ${response.status}`);
  }
  return (await response.json()) as User[];
}

function UsersSkeleton() {
  return (
    <SkeletonRoot animation='wave'>
      <div style={{ display: 'grid', gap: 12 }}>
        {Array.from({ length: 5 }, (_, index) => (
          <SkeletonBar key={index} shape='rectangle' style={{ height: 20 }} />
        ))}
      </div>
    </SkeletonRoot>
  );
}

export function UsersPanel() {
  // The string key is the request identity; an inline fetcher is safe because
  // useServerResource keeps it in a ref instead of depending on its identity.
  const users = useServerResource<User[]>('users:list', fetchUsers);

  return (
    <AsyncBoundary
      resource={users}
      skeleton={<UsersSkeleton />}
      loadingLabel='Loading users'
      isEmpty={list => list.length === 0}
      emptyTitle='No users yet'
      emptyMessage='Invite a teammate to get started.'
    >
      {list => (
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {list.map(user => (
            <li key={user.id}>
              {user.name} — {user.email}
            </li>
          ))}
        </ul>
      )}
    </AsyncBoundary>
  );
}
```

### Users page: table, skeleton rows, refresh control, live announcements

A full server-backed page built on Example 1. The refresh control and last-updated stamp live in the header (outside the boundary) so they survive reloads; the table skeleton mirrors the real table; an AriaLiveAnnouncer reports each transition to screen readers.

```tsx
// UsersPage.tsx — depends on AsyncBoundary and useServerResource from Example 1.
import * as React from 'react';
import {
  AriaLiveAnnouncer,
  Badge,
  Button,
  Skeleton,
  SkeletonItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  Tooltip,
} from '@fluentui/react-components';
import { AsyncBoundary } from './AsyncBoundary';
import { useServerResource } from './useServerResource';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

const columns = ['Name', 'Email', 'Role'] as const;

async function fetchUsers(signal: AbortSignal): Promise<User[]> {
  const response = await fetch('/api/users', { signal });
  if (!response.ok) {
    throw new Error(`GET /api/users failed with ${response.status}`);
  }
  return (await response.json()) as User[];
}

/** Skeleton that mirrors the live table so the layout does not shift on load. */
function TableSkeleton() {
  return (
    <Skeleton animation='wave'>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(column => (
              <TableHeaderCell key={column}>{column}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }, (_, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map(column => (
                <TableCell key={column}>
                  <SkeletonItem shape='rectangle' style={{ height: 16 }} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Skeleton>
  );
}

export function UsersPage() {
  const users = useServerResource<User[]>('users:list', fetchUsers);
  const { data, error, isInitialLoading, isRefreshing, updatedAt, refresh } = users;

  const announcement = isInitialLoading
    ? 'Loading users'
    : error
      ? `Loading users failed. ${error.message}`
      : `Loaded ${data?.length ?? 0} users`;

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <AriaLiveAnnouncer>
        <span>{announcement}</span>
      </AriaLiveAnnouncer>

      <header style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Fluent typography inside a native heading keeps the outline semantical. */}
        <h2 style={{ margin: 0 }}>
          <Text size={500} weight='semibold'>
            Users
          </Text>
        </h2>
        {data ? (
          <Badge appearance='tint' color='brand'>
            {data.length}
          </Badge>
        ) : null}

        <span style={{ flex: 1 }} />

        {updatedAt ? (
          <Text size={200}>Updated {new Date(updatedAt).toLocaleTimeString()}</Text>
        ) : null}

        <Tooltip content='Fetch the latest data from the server' relationship='description'>
          <Button
            appearance='secondary'
            onClick={refresh}
            disabled={isRefreshing}
            icon={isRefreshing ? <Spinner size='extra-tiny' /> : undefined}
          >
            {isRefreshing ? 'Refreshing…' : 'Refresh'}
          </Button>
        </Tooltip>
      </header>

      <AsyncBoundary
        resource={users}
        skeleton={<TableSkeleton />}
        loadingLabel='Loading users'
        isEmpty={list => list.length === 0}
        emptyTitle='No users yet'
        emptyMessage='Users appear here as soon as they are provisioned.'
      >
        {list => (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map(column => (
                  <TableHeaderCell key={column}>{column}</TableHeaderCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <TableCellLayout>{user.name}</TableCellLayout>
                  </TableCell>
                  <TableCell>
                    <TableCellLayout truncate>{user.email}</TableCellLayout>
                  </TableCell>
                  <TableCell>
                    <Badge appearance='outline'>{user.role}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </AsyncBoundary>
    </div>
  );
}
```

### Mutation form with server-side field validation

A create form that separates the write resource from the read resource: pending state disables the submit Button and swaps in a Spinner, HTTP 422 responses are mapped onto Field validationState/validationMessage so the accessible markup matches client validation, and transport failures land in a politeness='assertive' MessageBar.

```tsx
// CreateUserForm.tsx
import * as React from 'react';
import {
  Button,
  Field,
  Input,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  MessageBarTitle,
  Spinner,
} from '@fluentui/react-components';

interface CreateUserInput {
  name: string;
  email: string;
}

type FieldErrors = Partial<Record<keyof CreateUserInput, string>>;

class ValidationError extends Error {
  readonly fieldErrors: FieldErrors;

  constructor(fieldErrors: FieldErrors) {
    super('The server rejected the submitted values.');
    this.name = 'ValidationError';
    this.fieldErrors = fieldErrors;
  }
}

async function createUser(input: CreateUserInput): Promise<{ id: string }> {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (response.status === 422) {
    const payload = (await response.json()) as { errors: FieldErrors };
    throw new ValidationError(payload.errors);
  }
  if (!response.ok) {
    throw new Error(`POST /api/users failed with ${response.status}`);
  }
  return (await response.json()) as { id: string };
}

export interface CreateUserFormProps {
  onCreated?: (id: string) => void;
}

export function CreateUserForm({ onCreated }: CreateUserFormProps) {
  const [values, setValues] = React.useState<CreateUserInput>({ name: '', email: '' });
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});
  const [formError, setFormError] = React.useState<Error | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [createdId, setCreatedId] = React.useState<string | undefined>(undefined);
  const isMountedRef = React.useRef(true);

  React.useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    [],
  );

  const handleChange =
    (field: keyof CreateUserInput) =>
    (_event: React.ChangeEvent<HTMLInputElement>, data: { value: string }) => {
      setValues(current => ({ ...current, [field]: data.value }));
      // Clear the server error as soon as the user edits the field.
      setFieldErrors(current => ({ ...current, [field]: undefined }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setFormError(undefined);
    setCreatedId(undefined);

    try {
      const created = await createUser(values);
      if (!isMountedRef.current) return;
      setValues({ name: '', email: '' });
      setFieldErrors({});
      setCreatedId(created.id);
      onCreated?.(created.id);
    } catch (cause) {
      if (!isMountedRef.current) return;
      if (cause instanceof ValidationError) {
        setFieldErrors(cause.fieldErrors);
      } else {
        setFormError(cause instanceof Error ? cause : new Error(String(cause)));
      }
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16, maxWidth: 480 }}>
      {formError ? (
        <MessageBar intent='error' politeness='assertive'>
          <MessageBarBody>
            <MessageBarTitle>Could not create the user</MessageBarTitle>
            {formError.message}
          </MessageBarBody>
          <MessageBarActions>
            <Button appearance='transparent' onClick={() => setFormError(undefined)}>
              Dismiss
            </Button>
          </MessageBarActions>
        </MessageBar>
      ) : null}

      {createdId ? (
        <MessageBar intent='success' politeness='polite'>
          <MessageBarBody>
            <MessageBarTitle>User created</MessageBarTitle>
            {`Server id: ${createdId}`}
          </MessageBarBody>
        </MessageBar>
      ) : null}

      <Field
        label='Name'
        required
        validationState={fieldErrors.name ? 'error' : 'none'}
        validationMessage={fieldErrors.name}
      >
        <Input
          value={values.name}
          onChange={handleChange('name')}
          disabled={isSubmitting}
        />
      </Field>

      <Field
        label='Email'
        required
        validationState={fieldErrors.email ? 'error' : 'none'}
        validationMessage={fieldErrors.email}
      >
        <Input
          type='email'
          value={values.email}
          onChange={handleChange('email')}
          disabled={isSubmitting}
        />
      </Field>

      <Button
        type='submit'
        appearance='primary'
        disabled={isSubmitting}
        icon={isSubmitting ? <Spinner size='extra-tiny' /> : undefined}
      >
        {isSubmitting ? 'Creating…' : 'Create user'}
      </Button>
    </form>
  );
}
```

### Polling resource with visibility handling and pause/resume

Drives useServerResource.refresh from an interval that stops while the tab is hidden, refetches on the visibilitychange event, and can be paused by the user. Shows that background polling is visually silent because previous data stays on screen.

```tsx
// LiveOrders.tsx — depends on AsyncBoundary and useServerResource from Example 1.
import * as React from 'react';
import { Badge, Button, Skeleton, SkeletonItem, Spinner, Text } from '@fluentui/react-components';
import { AsyncBoundary } from './AsyncBoundary';
import { useServerResource } from './useServerResource';

interface Order {
  id: string;
  status: 'open' | 'shipped';
  total: number;
}

async function fetchOrders(signal: AbortSignal): Promise<Order[]> {
  const response = await fetch('/api/orders', { signal });
  if (!response.ok) {
    throw new Error(`GET /api/orders failed with ${response.status}`);
  }
  return (await response.json()) as Order[];
}

function OrderSkeleton() {
  return (
    <Skeleton animation='wave'>
      <div style={{ display: 'grid', gap: 8 }}>
        {Array.from({ length: 4 }, (_, index) => (
          <SkeletonItem key={index} shape='rectangle' />
        ))}
      </div>
    </Skeleton>
  );
}

export function LiveOrders() {
  const orders = useServerResource<Order[]>('orders:live', fetchOrders);
  const [isPaused, setIsPaused] = React.useState(false);
  const { refresh } = orders;

  React.useEffect(() => {
    if (isPaused) {
      return;
    }

    const intervalId = window.setInterval(() => {
      // Never poll a hidden tab: it wastes the user's battery and data plan.
      if (document.visibilityState === 'visible') {
        refresh();
      }
    }, 15000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refresh();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPaused, refresh]);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h2 style={{ margin: 0 }}>
          <Text size={500} weight='semibold'>
            Live orders
          </Text>
        </h2>
        <Badge appearance='tint' color={isPaused ? 'informative' : 'success'}>
          {isPaused ? 'Paused' : 'Live · 15s'}
        </Badge>

        <span style={{ flex: 1 }} />

        <Button
          appearance='secondary'
          onClick={refresh}
          disabled={orders.isRefreshing}
          icon={orders.isRefreshing ? <Spinner size='extra-tiny' /> : undefined}
        >
          Refresh now
        </Button>
        <Button appearance='subtle' onClick={() => setIsPaused(previous => !previous)}>
          {isPaused ? 'Resume polling' : 'Pause polling'}
        </Button>
      </header>

      <AsyncBoundary
        resource={orders}
        skeleton={<OrderSkeleton />}
        loadingLabel='Loading orders'
        isEmpty={list => list.length === 0}
        emptyTitle='No open orders'
        emptyMessage='New orders appear here automatically.'
      >
        {list => (
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {list.map(order => (
              <li key={order.id}>
                {order.id} — {order.status} — ${order.total.toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </AsyncBoundary>
    </div>
  );
}
```

## Pitfalls

- Collapsing loading and refreshing into one boolean. If a re-fetch clears data, the whole view is replaced by a skeleton and the user loses their place. Track isInitialLoading (no data yet) and isRefreshing (data on screen) as separate fields, and only render a skeleton for the former.
- Ignoring out-of-order responses. Two fast navigations can leave a slow first request resolving last and overwriting the newer payload. Guard every state write with a monotonic request id and drop responses that are not the newest.
- Not aborting requests on unmount or key change. Create one AbortController per request, pass signal to fetch, and abort both in the effect cleanup and before starting the next request, otherwise you leak connections and write state after the component is gone.
- Forgetting that fetch resolves on HTTP errors. A 500 with a JSON error body will render as a successful payload unless you check response.ok and throw. Treat 4xx as permanent (do not silently retry) and 5xx as retryable.
- Flashing spinners on fast responses. Pass Spinner delay (for example 300 ms) so sub-300 ms requests never show a flash, and prefer Skeleton placeholders that match the final layout so nothing shifts when data arrives.
- Conflating empty with error or loading. A successful empty array must render an empty state, not an error bar and not an eternal spinner; give AsyncBoundary an explicit isEmpty predicate and an empty branch.
- Letting a failed refresh destroy good data. Keep the last successful payload, show a MessageBar intent='warning' above it, and disable the retry button while the retry is running so users cannot queue a retry storm.
- Putting the refresh control inside the region that reloads. If the button, the count badge, or the updated-at stamp live in the boundary's success branch, they unmount during every reload, losing focus and flickering. Keep them in the page header and drive them from the same resource.
- Using an unstable request key. Deriving a key from a new object or array on every render re-triggers the effect in a loop. Keys must be primitives such as 'users:list' or `users:${id}`.
- Polling without visibility or pause controls. An interval that keeps firing in hidden tabs burns battery and server capacity, and users on metered connections need a way to pause live updates.
- Folding mutations into the read resource. A POST should have its own isSubmitting state, its own error surface, and an explicit refresh of the affected resources after success; mixing them makes the loading region flicker and hides field-level validation.
- Doing client validation and server validation differently. Map server field errors into the same Field validationState/validationMessage path used by local rules so the UI and the announced markup stay identical regardless of where the rule ran.
- Announcing nothing. Without a live region and aria-busy, a screen-reader user has no indication that data arrived or that a refresh failed; the visual spinner is invisible to them.

## Accessibility

Announce every state transition exactly once. Wrap a short status string in AriaLiveAnnouncer (for example 'Loading users', 'Loaded 12 users', 'Loading users failed') and keep it in the DOM across renders so the text change is detected. Reserve politeness='assertive' for blocking errors on MessageBar and use politeness='polite' for success and progress so you never interrupt the user mid-sentence. Give loading regions aria-busy={isRefreshing} instead of unmounting them; the content stays in the accessibility tree while the refresh runs, which keeps virtual cursors and focus stable. Spinners and skeletons are decorative: a bare Spinner should be paired with visible text (or an explicit label) while the live region carries the meaning, and Skeleton markup must never be announced. Do not swap a focused MessageBar for a spinner on retry — that destroys focus; keep the bar mounted and disable its retry Button while the retry is in flight (as AsyncBoundary does with the stale-data warning). Tables rendered from server data must keep real TableHeaderCell elements so column headers are announced with each cell, and every error message should include the action that failed plus the underlying reason. Field-level server errors rendered through Field's validationState='error' and validationMessage produce the same aria-describedby wiring as client-side validation, so screen-reader users get the message whether the rule ran in the browser or on the server. Avoid auto-refreshing data the user is actively editing: a poll that replaces a form's server payload can silently discard typed input.

## Components used

- [AriaLiveAnnouncer](../../components/aria-live-announcer.md)
- [Badge](../../components/badge.md)
- [Button](../../components/button.md)
- [Field](../../components/field.md)
- [Input](../../components/input.md)
- [MessageBar](../../components/message-bar.md)
- [MessageBarActions](../../components/message-bar-actions.md)
- [MessageBarBody](../../components/message-bar-body.md)
- [MessageBarTitle](../../components/message-bar-title.md)
- [Skeleton](../../components/skeleton.md)
- [SkeletonItem](../../components/skeleton-item.md)
- [Spinner](../../components/spinner.md)
- [Table](../../components/table.md)
- [TableBody](../../components/table-body.md)
- [TableCell](../../components/table-cell.md)
- [TableCellLayout](../../components/table-cell-layout.md)
- [TableHeader](../../components/table-header.md)
- [TableHeaderCell](../../components/table-header-cell.md)
- [TableRow](../../components/table-row.md)
- [Text](../../components/text.md)
- [Tooltip](../../components/tooltip.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
