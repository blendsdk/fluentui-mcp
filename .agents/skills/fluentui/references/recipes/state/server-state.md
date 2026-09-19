# Server State

> **Group**: state

## Goal

Compose Fluent UI React v9 components into a reusable pattern for rendering data that lives on a server: one hook that owns request lifecycle/cancellation/cache, and one boundary component that maps loading, refreshing, error-with-cache, error-without-cache, empty and success states onto Spinner, Skeleton, MessageBar, Badge, Button and Progress.

## When to Use

Use this recipe whenever a view renders data that is fetched from an API and can be slow, fail, be re-fetched, or be mutated by the user: lists and directories with search/filter, dashboards that poll, detail pages with refresh, and any screen that must show a retry affordance. Also use it when you want a single, consistent visual language for loading/error/empty across an application, or when you need optimistic updates with rollback.

## When Not to Use

Do not use it for purely local UI state (open/closed, hover, selected tab) - that is just React state, optionally styled with Fluent components. Do not use the Skeleton-first-load path for sub-100ms synchronous data. Do not hand-roll this if your app already standardizes on a data-fetching library: keep the AsyncStateBoundary mapping but feed it the library's data/error/isPending/isFetching values instead of useServerState. Finally, do not use MessageBar + retry as a substitute for a blocking Dialog when the failure means the user cannot continue at all (for example, a failed authentication step).

Fluent UI React v9 ships no data-fetching layer. What it ships is a set of *state presentation* components - `Skeleton`, `Spinner`, `MessageBar`, `Badge`, `Button`, `ProgressBar` - plus the layout components you render results with. A server-state recipe is the glue between the two: **one hook** that owns the request lifecycle and **one boundary component** that maps that lifecycle onto Fluent UI. Write the mapping once and every screen in the app renders loading, refreshing, error and empty states the same way.

## Model the states you actually have

Server state is not a boolean. Model it as a status union plus a cached payload so impossible combinations cannot occur:

| Situation | status | data | Fluent UI |
| --- | --- | --- | --- |
| First load | `loading` | `undefined` | `Skeleton` rows that reserve the final layout |
| Background revalidation | `refreshing` | previous payload | `Badge` in a `role="status"` region; rows stay on screen |
| Failure, nothing cached | `error` | `undefined` | `MessageBar intent="error"` + primary `Button` "Try again" |
| Failure, cache exists | `error` | previous payload | `MessageBar intent="warning"` above the stale rows + outline "Retry" |
| Success, zero rows | `success` | empty collection | `Text` empty state - never an error |
| Success | `success` | payload | `children(data)` |

Two rules make everything else predictable:

1. **Never clear `data` on a failed refetch.** Stale data beats an error page.
2. **`isInitialLoading` and `isFetching` are different booleans.** Only the first one shows skeletons; the second shows the subtle "refreshing" affordance.

## Step 1 - let one hook own the request

`useServerState(fetcher, deps)` takes a fetcher that receives an `AbortSignal` plus a dependency list, and returns `{ data, error, status, isFetching, isInitialLoading, reload, mutate }`.

Implementation decisions worth copying:

- The fetcher lives in a **ref**, not in the effect dependencies. That lets callers pass inline arrow functions without triggering a request on every render; `deps` alone decides when to fetch.
- Each effect run creates its own `AbortController` **and** its own `isCurrent` flag. The cleanup aborts the network call and makes that run's `.then` handlers no-ops - this is what prevents the classic out-of-order response bug.
- `status` only becomes `refreshing` if it was already `success`, which is what keeps the previous payload on screen.
- `mutate` patches the cached payload locally, which is the hook point for optimistic writes.
- `reload` is a stable callback (it bumps an attempt counter), so it is safe as an interval dependency or an `onClick` handler.

## Step 2 - map status to components in exactly one place

`AsyncStateBoundary` is a generic render-prop component. It receives the whole `ServerState` object and a `children(data)` function, so the typed payload flows to the caller with no casts. Keep this file free of business logic: it decides *how a state looks*, never *what to fetch*.

## Step 3 - queries are dependencies

Debounce text input, then hand the **debounced** value to `deps`:

```tsx
const [query, setQuery] = React.useState('');
const debouncedQuery = useDebouncedValue(query, 300);
const state = useServerState<User[]>(
  (signal) => fetchUsers(debouncedQuery, team, signal),
  [debouncedQuery, team],
);
```

Debouncing reduces traffic; cancellation makes the result **correct**. Without `abort()` a slow response for `a` can land after a fast response for `ab`, and the list silently shows results that do not match the input. Note that the `deps` array must keep a constant length across renders - React requires it, and so does this hook.

## Step 4 - mutations are optimistic, then reconciled or rolled back

1. Capture the previous value, then `mutate` the row locally so the UI responds instantly.
2. Await the server and **reconcile** with the record it returns (servers normalize data: ids, timestamps, computed fields).
3. On failure, roll back to the captured snapshot and report it with `MessageBar intent="error"`. Do not use a blocking `Dialog` for a failed toggle.

Track the ids with an in-flight mutation so the acting `Button` can show a `Spinner` in its `icon` slot and be disabled while its own write is pending.

## Step 5 - revalidation, polling and visibility

Because `reload` is stable, polling is a three-line effect: an interval that calls `reload`, paused while `document.visibilityState !== 'visible'`, plus an immediate `reload()` when the tab becomes visible again so data is fresh the moment the user looks at it. The same stable `reload` powers pull-to-refresh style buttons and "Retry" actions.

## Component cheat sheet

- `Skeleton` - first load only. Reserve the final layout so content does not jump.
- `Spinner` - short, inline, local progress. `size="extra-tiny"` reads well inside a `Button` `icon` slot.
- `Badge` - coarse status at a glance: Up to date / Refreshing, or a row's own status field.
- `MessageBar` - request-level failures and confirmations. `intent="error"` + `politeness="assertive"` when there is nothing to show; `intent="warning"` over stale data; `intent="success"` for a completed optimistic write.
- `Button` - retry, refresh, and the optimistic action itself. Disable it (`disabled`, or `disabledFocusable` to keep focus stable) while its own request is pending.
- `ProgressBar` - server-driven numeric values: job completion, quota used, SLO budget consumed.
- `Card`, `Text`, `Avatar`, `Badge` - presentation of the rows. They are not state components; they live inside `children(data)`.
- `Switch` - a convenient way to exercise failure paths in a demo or a dev story.

## Adapting to a data-fetching library

The boundary is deliberately decoupled from the fetching mechanism. If you already use a query library, keep `AsyncStateBoundary` and feed it an object shaped like `ServerState<T>` built from the library's data / error / pending / fetching values. Every screen keeps the identical Fluent UI treatment, and you can migrate the fetching layer without touching presentation.

## Examples

### useServerState + AsyncStateBoundary (loading, error, empty, stale)

The reusable core of the recipe: a hook that owns request lifecycle, cancellation and stale-while-revalidate, plus a generic boundary component that maps every server state onto Skeleton, Spinner, MessageBar, Badge and Button. The file ends with a runnable ProjectsPanel that fetches a mock API, shows skeleton rows on first load, a retryable error bar when nothing is cached, a warning bar over stale rows when a refetch fails, an empty state, and an inline spinner inside the Refresh button.

```tsx
// useServerState.tsx
// The reusable half of the recipe: one hook that owns the request lifecycle,
// plus a boundary component that maps server state onto Fluent UI components.
import * as React from 'react';
import { Badge, Button, Card, MessageBar, Skeleton, Spinner, Text } from '@fluentui/react-components';

const styles: Record<string, React.CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 720, padding: 16 },
  stack: { display: 'flex', flexDirection: 'column', gap: 12 },
  inline: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  between: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  skeletonRow: { display: 'flex', alignItems: 'center', gap: 12 },
  skeletonText: { display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 0 },
};

/* ------------------------------------------------------------------ */
/* 1. The hook                                                        */
/* ------------------------------------------------------------------ */

export type ServerStateStatus = 'idle' | 'loading' | 'refreshing' | 'success' | 'error';

export interface ServerState<T> {
  /** Last successful payload. Kept during re-fetches so the UI never flashes empty. */
  data: T | undefined;
  /** Error from the most recent attempt, if there was one. */
  error: Error | undefined;
  status: ServerStateStatus;
  /** Any request in flight, including background revalidation. */
  isFetching: boolean;
  /** Nothing to render yet: show skeletons, not a refresh indicator. */
  isInitialLoading: boolean;
  /** Re-run the fetcher with the current arguments. Stable identity. */
  reload: () => void;
  /** Optimistic local write into the cached payload. */
  mutate: (updater: (current: T | undefined) => T | undefined) => void;
}

export function useServerState<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: React.DependencyList = [],
): ServerState<T> {
  const [data, setData] = React.useState<T | undefined>(undefined);
  const [error, setError] = React.useState<Error | undefined>(undefined);
  const [status, setStatus] = React.useState<ServerStateStatus>('idle');
  const [attempt, setAttempt] = React.useState(0);

  // Keep the newest fetcher in a ref. Callers pass inline arrow functions, and a
  // new function identity must never be a reason to hit the network again.
  const fetcherRef = React.useRef(fetcher);
  React.useEffect(() => {
    fetcherRef.current = fetcher;
  });

  React.useEffect(() => {
    const controller = new AbortController();
    let isCurrent = true;

    // Stale-while-revalidate: only the first ever load is a hard 'loading'.
    setStatus((previous) =>
      previous === 'success' || previous === 'refreshing' ? 'refreshing' : 'loading',
    );
    setError(undefined);

    fetcherRef.current(controller.signal).then(
      (result) => {
        if (!isCurrent) {
          return; // a newer request already superseded this one
        }
        setData(result);
        setStatus('success');
      },
      (reason: unknown) => {
        if (!isCurrent || controller.signal.aborted) {
          return;
        }
        setError(reason instanceof Error ? reason : new Error(String(reason)));
        setStatus('error');
      },
    );

    return () => {
      isCurrent = false; // stop updating state from this response
      controller.abort(); // and cancel the request itself
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const isFetching = status === 'loading' || status === 'refreshing';

  return {
    data,
    error,
    status,
    isFetching,
    isInitialLoading: isFetching && data === undefined,
    reload: React.useCallback(() => setAttempt((value) => value + 1), []),
    mutate: React.useCallback(
      (updater: (current: T | undefined) => T | undefined) =>
        setData((current) => updater(current)),
      [],
    ),
  };
}

/* ------------------------------------------------------------------ */
/* 2. Loading placeholder that reserves the final layout              */
/* ------------------------------------------------------------------ */

export function LoadingRows({ count = 3 }: { count?: number }) {
  return (
    <div style={styles.stack} role="status" aria-label="Loading">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} style={styles.skeletonRow}>
          <Skeleton shape="circle" animation="wave" />
          <div style={styles.skeletonText}>
            <Skeleton animation="wave" width="40%" />
            <Skeleton animation="wave" width="70%" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. One place that maps status -> Fluent UI                         */
/* ------------------------------------------------------------------ */

export interface AsyncStateBoundaryProps<T> {
  state: ServerState<T>;
  children: (data: T) => React.ReactNode;
  /** Optional predicate: when it returns true the empty state is rendered. */
  isEmpty?: (data: T) => boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  /** Replaces the default skeleton list on first load. */
  loadingFallback?: React.ReactNode;
  errorTitle?: string;
}

export function AsyncStateBoundary<T>({
  state,
  children,
  isEmpty,
  emptyTitle = 'There is nothing here yet',
  emptyDescription,
  loadingFallback,
  errorTitle = "We couldn't load this data",
}: AsyncStateBoundaryProps<T>) {
  const { data, error, status, isFetching, isInitialLoading, reload } = state;

  // Failure with nothing cached: blocking error state with a way out.
  if (status === 'error' && data === undefined) {
    return (
      <MessageBar intent="error" politeness="assertive">
        <div style={styles.stack}>
          <Text weight="semibold">{errorTitle}</Text>
          <Text>{error?.message}</Text>
          <div>
            <Button appearance="primary" onClick={reload}>
              Try again
            </Button>
          </div>
        </div>
      </MessageBar>
    );
  }

  // First load: skeletons instead of a spinner, so nothing jumps when data arrives.
  if (isInitialLoading) {
    return <>{loadingFallback ?? <LoadingRows />}</>;
  }

  if (data === undefined) {
    return null;
  }

  return (
    <div style={styles.stack} aria-busy={isFetching}>
      {/* Failure with cached data: keep the rows, warn, offer a retry. */}
      {status === 'error' ? (
        <MessageBar intent="warning" politeness="polite">
          <div style={styles.inline}>
            <Text>Showing the last data we loaded. {error?.message}</Text>
            <Button size="small" appearance="outline" onClick={reload}>
              Retry
            </Button>
          </div>
        </MessageBar>
      ) : null}

      {/* Stable text inside a polite live region: nothing is announced when it does not change. */}
      <div style={styles.inline} role="status" aria-live="polite">
        <Badge appearance="tint" color={isFetching ? 'informative' : 'success'}>
          {isFetching ? 'Refreshing' : 'Up to date'}
        </Badge>
      </div>

      {isEmpty && isEmpty(data) ? (
        <div style={styles.stack}>
          <Text weight="semibold">{emptyTitle}</Text>
          {emptyDescription ? <Text size={200}>{emptyDescription}</Text> : null}
        </div>
      ) : (
        children(data)
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Usage                                                           */
/* ------------------------------------------------------------------ */

interface Project {
  id: string;
  name: string;
  owner: string;
  status: 'On track' | 'At risk' | 'Blocked';
}

const PROJECTS: Project[] = [
  { id: 'p1', name: 'Design tokens v3', owner: 'Ada Lovelace', status: 'On track' },
  { id: 'p2', name: 'Search relevance', owner: 'Grace Hopper', status: 'At risk' },
  { id: 'p3', name: 'Billing migration', owner: 'Alan Turing', status: 'Blocked' },
];

/** Stand-in for a real API call; the signal makes it cancellable, exactly like fetch(). */
function fetchProjects(signal: AbortSignal): Promise<Project[]> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve(PROJECTS), 1200);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('The request was aborted', 'AbortError'));
    });
  });
}

export function ProjectsPanel() {
  const projects = useServerState<Project[]>(fetchProjects, []);

  return (
    <div style={styles.page}>
      <div style={styles.between}>
        <Text size={500} weight="semibold">
          Projects
        </Text>
        <Button
          appearance="subtle"
          icon={projects.isFetching ? <Spinner size="extra-tiny" /> : undefined}
          disabled={projects.isFetching}
          onClick={projects.reload}
        >
          Refresh
        </Button>
      </div>

      <AsyncStateBoundary
        state={projects}
        isEmpty={(rows) => rows.length === 0}
        emptyTitle="No projects"
        emptyDescription="New projects show up here as soon as they are created."
      >
        {(rows) => (
          <div style={styles.stack}>
            {rows.map((row) => (
              <Card key={row.id} appearance="outline" size="small">
                <div style={styles.between}>
                  <Text weight="semibold">{row.name}</Text>
                  <Badge
                    appearance="tint"
                    color={
                      row.status === 'On track'
                        ? 'success'
                        : row.status === 'At risk'
                          ? 'warning'
                          : 'danger'
                    }
                  >
                    {row.status}
                  </Badge>
                </div>
                <Text size={200}>{row.owner}</Text>
              </Card>
            ))}
          </div>
        )}
      </AsyncStateBoundary>
    </div>
  );
}
```

### Debounced query + filter with optimistic follow toggle and rollback

A people directory that consumes the hook and boundary from Example 1. Typing debounces the query and feeds it into deps so the hook aborts superseded requests; the team Select is another dependency. Each row's Follow button performs an optimistic write: it flips locally, reconciles with the server response, and rolls back to the captured snapshot when the write fails (user u3 always fails so the rollback is observable). Results are announced through a MessageBar that auto-dismisses, and the pending row shows an extra-tiny Spinner inside the Button icon slot.

```tsx
// UserDirectory.tsx
// Example 2: debounced query + filter, request cancellation, optimistic writes.
// Imports the files created in Example 1 (useServerState.tsx).
import * as React from 'react';
import { Avatar, Badge, Button, Card, Input, MessageBar, Select, Spinner, Text } from '@fluentui/react-components';
import { AsyncStateBoundary, useServerState } from './useServerState';

const styles: Record<string, React.CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 720, padding: 16 },
  stack: { display: 'flex', flexDirection: 'column', gap: 12 },
  toolbar: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' },
  row: { display: 'flex', alignItems: 'center', gap: 12 },
  grow: { display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 },
};

/* --- domain --------------------------------------------------------- */

type Team = 'all' | 'Design' | 'Engineering' | 'Research';

interface User {
  id: string;
  name: string;
  email: string;
  team: Exclude<Team, 'all'>;
  following: boolean;
}

const TEAMS: Team[] = ['all', 'Design', 'Engineering', 'Research'];

const USERS: User[] = [
  { id: 'u1', name: 'Ada Lovelace', email: 'ada@contoso.com', team: 'Engineering', following: true },
  { id: 'u2', name: 'Grace Hopper', email: 'grace@contoso.com', team: 'Engineering', following: false },
  { id: 'u3', name: 'Yuki Tanaka', email: 'yuki@contoso.com', team: 'Design', following: false },
  { id: 'u4', name: 'Priya Raman', email: 'priya@contoso.com', team: 'Research', following: true },
  { id: 'u5', name: 'Marco Silva', email: 'marco@contoso.com', team: 'Design', following: false },
];

/* --- fake API ------------------------------------------------------- */

function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('The request was aborted', 'AbortError'));
    });
  });
}

function fetchUsers(query: string, team: Team, signal: AbortSignal): Promise<User[]> {
  return wait(700, signal).then(() => {
    const term = query.trim().toLowerCase();
    return USERS.filter(
      (user) =>
        (team === 'all' || user.team === team) &&
        (term.length === 0 ||
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)),
    ).map((user) => ({ ...user }));
  });
}

/** Writes for these ids are rejected on purpose so the rollback path is visible. */
const REJECTED_WRITE_IDS = new Set(['u3']);

function saveFollowing(userId: string, following: boolean, signal: AbortSignal): Promise<User> {
  return wait(500, signal).then(() => {
    if (REJECTED_WRITE_IDS.has(userId)) {
      throw new Error('The server rejected this change. Nothing was saved.');
    }
    const user = USERS.find((candidate) => candidate.id === userId);
    if (!user) {
      throw new Error('Unknown user ' + userId);
    }
    user.following = following;
    return { ...user };
  });
}

/* --- helpers -------------------------------------------------------- */

function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

type Notice = { intent: 'success' | 'error'; message: string } | undefined;

/* --- view ----------------------------------------------------------- */

export function UserDirectory() {
  const [query, setQuery] = React.useState('');
  const [team, setTeam] = React.useState<Team>('all');
  const [pendingIds, setPendingIds] = React.useState<string[]>([]);
  const [notice, setNotice] = React.useState<Notice>(undefined);

  const debouncedQuery = useDebouncedValue(query, 300);

  // deps is the query contract: a new debounced query or team re-runs the
  // fetcher, and the hook aborts the superseded request for us.
  const state = useServerState<User[]>(
    (signal) => fetchUsers(debouncedQuery, team, signal),
    [debouncedQuery, team],
  );
  const { mutate } = state;

  const mountedRef = React.useRef(true);
  const writeControllerRef = React.useRef<AbortController | null>(null);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (writeControllerRef.current) {
        writeControllerRef.current.abort();
      }
    };
  }, []);

  // Auto-dismiss the confirmation bar so notices do not pile up.
  React.useEffect(() => {
    if (!notice) {
      return;
    }
    const timer = setTimeout(() => setNotice(undefined), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const toggleFollowing = React.useCallback(
    async (user: User) => {
      const nextValue = !user.following;
      const previousValue = user.following;

      setNotice(undefined);
      setPendingIds((ids) => (ids.includes(user.id) ? ids : [...ids, user.id]));

      // 1. Optimistic write: the row flips before the request leaves.
      mutate((current) =>
        current?.map((row) => (row.id === user.id ? { ...row, following: nextValue } : row)),
      );

      if (!writeControllerRef.current) {
        writeControllerRef.current = new AbortController();
      }
      const signal = writeControllerRef.current.signal;

      try {
        const saved = await saveFollowing(user.id, nextValue, signal);

        // 2. Reconcile with the server's version of the row.
        mutate((current) =>
          current?.map((row) => (row.id === saved.id ? { ...row, ...saved } : row)),
        );

        if (mountedRef.current) {
          setNotice({ intent: 'success', message: 'Saved.' });
        }
      } catch (reason) {
        if (signal.aborted) {
          return;
        }
        // 3. Roll back to the snapshot captured before the write.
        mutate((current) =>
          current?.map((row) =>
            row.id === user.id ? { ...row, following: previousValue } : row,
          ),
        );
        if (mountedRef.current) {
          setNotice({
            intent: 'error',
            message: reason instanceof Error ? reason.message : 'The change could not be saved.',
          });
        }
      } finally {
        if (mountedRef.current) {
          setPendingIds((ids) => ids.filter((id) => id !== user.id));
        }
      }
    },
    [mutate],
  );

  return (
    <div style={styles.page}>
      <Text size={500} weight="semibold">
        People
      </Text>

      <div style={styles.toolbar}>
        <Input
          type="search"
          value={query}
          placeholder="Search by name or email"
          aria-label="Search people"
          contentBefore={<span aria-hidden="true">&#128269;</span>}
          onChange={(_event, data) => setQuery(data.value)}
        />
        <Select value={team} onChange={(_event, data) => setTeam(data.value as Team)}>
          {TEAMS.map((option) => (
            <option key={option} value={option}>
              {option === 'all' ? 'All teams' : option}
            </option>
          ))}
        </Select>
      </div>

      {notice ? (
        <MessageBar intent={notice.intent} politeness="polite">
          {notice.message}
        </MessageBar>
      ) : null}

      <AsyncStateBoundary
        state={state}
        isEmpty={(users) => users.length === 0}
        emptyTitle="No matches"
        emptyDescription="Nothing matched that search. Try another name or clear the team filter."
      >
        {(users) => (
          <div style={styles.stack}>
            {users.map((user) => (
              <Card key={user.id} appearance="outline" size="small">
                <div style={styles.row}>
                  <Avatar name={user.name} />
                  <div style={styles.grow}>
                    <Text weight="semibold">{user.name}</Text>
                    <Text size={200}>{user.email}</Text>
                  </div>
                  <Badge appearance="tint" color="informative">
                    {user.team}
                  </Badge>
                  <Button
                    appearance={user.following ? 'primary' : 'outline'}
                    icon={pendingIds.includes(user.id) ? <Spinner size="extra-tiny" /> : undefined}
                    onClick={() => {
                      void toggleFollowing(user);
                    }}
                  >
                    {user.following ? 'Following' : 'Follow'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </AsyncStateBoundary>
    </div>
  );
}
```

### Polling dashboard with stale-data fallback and inline refresh spinner

Background revalidation on top of the same hook: a usePolling effect calls the stable reload on an interval, pauses while the tab is hidden, and catches up immediately when it becomes visible again. Because the boundary distinguishes isInitialLoading from isFetching, the metric cards never flash back to skeletons - only the Badge changes. A Switch flips a flag in the fetcher to simulate a server outage, which exercises the warning-over-stale-data path, and Progress renders the server-driven values.

```tsx
// LiveMetrics.tsx
// Example 3: polling with visibility awareness plus a triggerable failure path.
// Imports the files created in Example 1 (useServerState.tsx).
import * as React from 'react';
import { Button, Card, ProgressBar, Skeleton, Spinner, Switch, Text } from '@fluentui/react-components';
import { AsyncStateBoundary, useServerState } from './useServerState';

const styles: Record<string, React.CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 720, padding: 16 },
  stack: { display: 'flex', flexDirection: 'column', gap: 12 },
  between: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 12,
  },
};

/* --- fake API ------------------------------------------------------- */

type MetricColor = 'brand' | 'success' | 'warning' | 'error';

interface Metric {
  id: string;
  label: string;
  value: number;
  max: number;
  color: MetricColor;
}

interface MetricsPayload {
  updatedAt: number;
  metrics: Metric[];
}

const METRIC_DEFINITIONS: Array<Omit<Metric, 'value'>> = [
  { id: 'cpu', label: 'CPU utilization', max: 100, color: 'brand' },
  { id: 'memory', label: 'Memory pressure', max: 100, color: 'warning' },
  { id: 'latency', label: 'Latency budget used', max: 100, color: 'error' },
  { id: 'slo', label: 'Requests within SLO', max: 100, color: 'success' },
];

function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('The request was aborted', 'AbortError'));
    });
  });
}

function fetchMetrics(signal: AbortSignal, simulateOutage: boolean): Promise<MetricsPayload> {
  return wait(600, signal).then(() => {
    if (simulateOutage) {
      throw new Error('The metrics service returned 500.');
    }
    return {
      updatedAt: Date.now(),
      metrics: METRIC_DEFINITIONS.map((metric) => ({
        ...metric,
        value: Math.round(metric.max * (0.3 + Math.random() * 0.6)),
      })),
    };
  });
}

/* --- polling -------------------------------------------------------- */

function usePolling(refetch: () => void, intervalMs: number) {
  React.useEffect(() => {
    let timerId: number | undefined;

    const stop = () => {
      if (timerId !== undefined) {
        window.clearInterval(timerId);
        timerId = undefined;
      }
    };

    const start = () => {
      stop();
      timerId = window.setInterval(() => {
        if (document.visibilityState === 'visible') {
          refetch();
        }
      }, intervalMs);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refetch(); // catch up immediately instead of waiting a full interval
        start();
      } else {
        stop(); // a hidden tab is not worth polling
      }
    };

    start();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refetch, intervalMs]);
}

/* --- view ----------------------------------------------------------- */

export function LiveMetrics() {
  const simulateOutageRef = React.useRef(false);

  const state = useServerState<MetricsPayload>(
    (signal) => fetchMetrics(signal, simulateOutageRef.current),
    [],
  );
  const { reload } = state;

  usePolling(reload, 10000);

  return (
    <div style={styles.page}>
      <div style={styles.between}>
        <Text size={500} weight="semibold">
          Service health
        </Text>
        <Button
          appearance="subtle"
          icon={state.isFetching ? <Spinner size="extra-tiny" /> : undefined}
          disabledFocusable={state.isFetching}
          onClick={reload}
        >
          Refresh now
        </Button>
      </div>

      <Switch
        onChange={(_event, data) => {
          simulateOutageRef.current = data.checked;
          reload();
        }}
      >
        Simulate a server outage
      </Switch>

      <AsyncStateBoundary
        state={state}
        loadingFallback={
          <div style={styles.grid}>
            {METRIC_DEFINITIONS.map((metric) => (
              <Skeleton key={metric.id} animation="wave" shape="rectangle" />
            ))}
          </div>
        }
      >
        {(payload) => (
          <div style={styles.stack}>
            <Text size={200}>
              Last updated {new Date(payload.updatedAt).toLocaleTimeString()} - polled every 10s
            </Text>
            <div style={styles.grid}>
              {payload.metrics.map((metric) => (
                <Card key={metric.id} appearance="outline" size="small">
                  <Text weight="semibold">{metric.label}</Text>
                  <Text size={600} weight="semibold">
                    {metric.value}%
                  </Text>
                  <ProgressBar
                    value={metric.value}
                    max={metric.max}
                    color={metric.color}
                    thickness="medium"
                    shape="rounded"
                  />
                </Card>
              ))}
            </div>
          </div>
        )}
      </AsyncStateBoundary>
    </div>
  );
}
```

## Pitfalls

- Not cancelling in-flight requests. If the effect cleanup does not call controller.abort() and flip an isCurrent flag, a slow response for an old query can resolve after a fast response for the new one and overwrite it - the list silently shows results that do not match the input. Both halves are needed: abort() cancels the network call, the flag prevents the .then from touching state.
- Putting the fetcher in the effect dependency array. Callers naturally write (signal) => fetchUsers(query, signal) inline, which changes identity on every render and would refetch forever. Keep the fetcher in a ref and invalidate only through the explicit deps array. Related: the deps array must keep a constant length across renders, or React throws.
- Clearing data on refetch or on error. If a refetch sets data back to undefined, the boundary falls back to skeletons and the screen flashes on every poll. Keep the previous payload (stale-while-revalidate) and branch on isInitialLoading (nothing to show yet) versus isFetching (refresh in place). Likewise, a failed refetch must not delete good cached data.
- Forgetting to debounce query inputs. A request per keystroke is wasteful, and it multiplies the number of superseded responses competing to write state. Debounce the value, treat the debounced value as the dependency, and keep cancellation as the correctness safety net behind the traffic optimization.
- Optimistic writes without rollback or reconciliation. Always capture the previous value before mutating, restore it in the catch branch, and re-apply the record the server returns on success (servers normalize ids, timestamps and computed fields). Skipping reconciliation leaves the UI permanently out of sync with the server after a partial update.
- Showing a blocking error UI for a failed background refresh. Turning a poll failure into a full error state throws away perfectly good data and disrupts the user. Reserve the intent="error" MessageBar with the primary Try again button for when nothing is cached; use intent="warning" above the stale rows plus an outline Retry otherwise.
- Editing state after unmount, or resolving writes after the component is gone. Malformed or late responses trigger setState on an unmounted tree; keep a mounted ref (set to true in the effect body so StrictMode's double-invoke works) and abort pending mutation requests in the same cleanup that aborts the query.
- Using a Spinner as the only first-load affordance. A centered spinner collapses the layout and then dumps a full page of content on screen; use Skeleton placeholders sized like the final rows so the page does not jump when data lands. Reserve Spinner for short, inline, local waits such as the icon slot of a refresh button.
- Letting MessageBar notifications pile up or auto-dismiss errors too eagerly. Success and warning confirmations should auto-dismiss (about 4 seconds is a good default) and be replaced rather than stacked; errors that require a decision must stay until resolved or explicitly dismissed.

## Accessibility

1) Announce state changes, not renders. Put the refreshing indicator in a container with role="status" (implicit aria-live="polite") whose text is stable - 'Refreshing' vs 'Up to date' - so assistive tech only announces a change when the value actually changes. 2) Use politeness appropriately on MessageBar: politeness="assertive" for a hard failure that replaces the content (the user must know the screen is empty), politeness="polite" for success confirmations and for the warning bar shown over stale data, which must not interrupt. 3) Never steal focus for a background update. Revalidation must not move focus; if a user-initiated action fails, keep focus on the control that triggered it and let the MessageBar announce the failure. 4) Mark the content region busy: aria-busy={isFetching} tells assistive tech that the region is being updated, without pushing new content into the announcement queue. 5) Skeletons are decorative. Wrap them in a status container with an accessible label (aria-label="Loading") so the waiting state is perceivable, and make sure the skeleton row count roughly matches the final row count to limit layout shift for low-vision users. 6) Keep the accessible name of an in-flight button stable. When you put a Spinner in Button's icon slot, the visible text label stays the same, so screen reader users still hear 'Follow' or 'Refresh now'; do not swap the label to 'Loading' and back. 7) Prefer disabledFocusable to disabled on controls that disable themselves while awaiting a request (the polling dashboard's Refresh now button does this): an aria-disabled button stays in the tab order, so keyboard users do not lose their place when the button disables under their focus. 8) Give inputs a programmatic name: the directory's search field carries both a placeholder and aria-label, and the team filter is a real select, so both are reachable and labelled in browse and forms mode.

## Components used

- [Avatar](../../components/avatar.md)
- [Badge](../../components/badge.md)
- [Button](../../components/button.md)
- [Card](../../components/card.md)
- [Input](../../components/input.md)
- [MessageBar](../../components/message-bar.md)
- [Progress](../../components/progress.md)
- [Select](../../components/select.md)
- [Skeleton](../../components/skeleton.md)
- [Spinner](../../components/spinner.md)
- [Switch](../../components/switch.md)
- [Text](../../components/text.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
