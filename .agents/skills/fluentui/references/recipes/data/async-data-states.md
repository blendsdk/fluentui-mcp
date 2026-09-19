# Async Data States

> **Group**: data

## Goal

Build a Fluent UI React v9 data surface that explicitly renders every async state — initial loading, refreshing, empty, error, and success — with skeletons that mirror the final layout, an accessible status region, a retryable error MessageBar, and a distinct actionable empty state.

## When to Use

Use this recipe whenever a component depends on data fetched at runtime (REST/GraphQL calls, FileReader, IndexedDB, dynamic imports) and that data can be slow, fail, or come back empty. It is the right choice for lists, detail panes, dashboards, and search results that users will retry or refresh.

## When Not to Use

Do not use it for data that is already available synchronously at render time, or for purely local UI state (open/closed, selection) — those need no loading or error branches. For one-shot destructive confirmations use a Dialog instead; for transient background notifications that must not block the view, use the Toast pattern (Toast + a toaster/controller) instead of an inline MessageBar.

A data view is never one state. Decide up front how each of the five states renders, and the component writes itself:

| State | What the user sees | Fluent UI building blocks |
| --- | --- | --- |
| Initial loading | A placeholder that matches the final layout | `Skeleton` (+ `Spinner size="extra-tiny" delay={500}`) |
| Refreshing | Existing content, plus a quiet progress hint | `Spinner` beside the section title, or in `Input`'s `contentAfter` |
| Empty | "Nothing here yet" and the next useful action | `Text` + `Button` |
| Error | What failed, why, and how to retry | `MessageBar intent="error"` + `Button` |
| Success | The data itself | `Card`, `Avatar`, `Badge`, `Text`, `Divider` |

The recipe is: one state machine, one hook that owns the request, one render branch per state, and a container whose size does not jump between them.

## 1. Model the states as a discriminated union

Never keep `loading`, `data`, and `error` as three independent `useState` values — that permits impossible combinations (a spinner and an error at once, or "empty" and "success" at once). One union deletes the whole bug class and gives you narrowing for free:

```tsx
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T };
```

`status` is the discriminant, so `switch (state.status)` narrows `state.error` and `state.data` without casts. Note that **empty is not a status**: it is `status === 'success'` with `data.length === 0`. Treating empty as an error produces a retry button that can never succeed, which is one of the fastest ways to lose a user's trust.

## 2. One hook owns the request

Keep the request lifecycle in a single hook so every consumer gets the same guarantees:

1. **Cancel on change or unmount** with `new AbortController()` and `return () => controller.abort()`.
2. **Ignore stale responses.** After the promise settles, check `controller.signal.aborted` before calling `setState`. This is what prevents an older, slower request from overwriting newer results, and it prevents the "set state on unmounted component" warning.
3. **Expose a `reload`.** A monotonically increasing `nonce` in the effect dependencies re-runs the fetch without duplicating logic. Pass it straight to the retry `Button` in the error branch and to the "Refresh" `Button` in the header.
4. **Normalize errors** to an `Error` instance (`cause instanceof Error ? cause : new Error(String(cause))`) so the error branch never renders `[object Object]`.

The hook returns `{ state, reload }`. Everything else in this recipe is presentation.

## 3. Initial loading: skeleton first, spinner second

- Prefer `Skeleton` whose shapes mirror the real content — a `shape="circle"` block of the same diameter as the incoming `Avatar`, a `width="45%"` line where the name goes, a `width="70%"` line for the subtitle. The real content then *assembles* instead of jumping.
- Use `Spinner delay={300}`–`500` so a fast response never flashes a spinner. For a list, pair a tiny spinner with an invisible-until-delayed appearance and skeleton rows.
- Wrap the loading branch in `role="status"` with `aria-live="polite"` **and real text** ("Loading team members…"). A `Spinner` on its own has no accessible name and exposes nothing to screen readers.
- Mark the skeleton markup `aria-hidden="true"` so the decorative placeholder is not announced; the status text carries the message.

## 4. Refreshing: never unmount the content

For refresh and polling, keep the last successful data on screen (stale-while-revalidate) instead of falling back to the loading branch:

- Track `isInitialLoading` (true only until the first success) separately from `isFetching` (true while any request is in flight).
- While `isFetching && !isInitialLoading`, show a small `Spinner` (or an `Input` `contentAfter` spinner for searches) next to the title, and disable the Refresh `Button`.
- If the refresh fails while data exists, show a **warning** `MessageBar` that says the values are the last known ones, rather than replacing the content with a full-page error.

This also preserves focus and scroll position, which a full unmount destroys.

## 5. Empty: distinct, actionable, never a spinner

The empty branch is a success branch with zero rows. It should answer two questions: *why is this empty* and *what can I do next*. Render `Text` for the explanation, `Text size={200}` for the detail, and a single `Button` for the next action ("Invite a teammate", "Clear search", "Check again"). Make the copy context-sensitive — echo the search term ("No people match “priya”") so users understand the empty state is a filter result and not a broken page.

## 6. Error: MessageBar + retry

```tsx
<MessageBar intent="error" politeness="assertive">
  {/* title, message, retry Button */}
</MessageBar>
```

- `intent="error"` for failures the user is waiting on; use `intent="warning"` when stale data is still on screen.
- `politeness="assertive"` is reserved for an error directly caused by a user action (they just pressed Retry/Refresh). Background poll failures should use `politeness="polite"` so they do not interrupt.
- Always include the underlying `error.message`; "Something went wrong" without a reason is unactionable.
- The retry `Button` must call the hook's `reload`, which flips the state back to `loading` so the user sees the retry happen.

## 7. Retry and refresh semantics

- Disable the retry/refresh `Button` while `isFetching` so double clicks cannot queue duplicate requests.
- Keep the button mounted after the click (it becomes `disabled`) rather than unmounting it, otherwise keyboard focus is dropped to `<body>` and screen-reader users lose their place. If you must replace the branch, move focus deliberately to the status region.
- A retry should reuse the exact same request parameters — do not silently change filters or page.
- Give the container a stable `min-height` or keep one skeleton row visible so the page does not collapse between states.

## 8. Announcements, focus, and structure

- Loading: `role="status"` + `aria-live="polite"` + visible text.
- Errors: `MessageBar` with the right `politeness` (see above).
- Results: label the list (`aria-label` on the `<ul>`), and give each row a stable `key` that is the entity id, not the array index — indices shift when data is revalidated and cause wrong rows to be reused.
- Add `aria-busy="true"` on the container while a refresh is in flight.
- Never encode status with color alone: the `Badge` in the examples always carries a text label in addition to `color`.

## Checklist

- [ ] `AsyncState<T>` union exists; no independent `loading`/`error`/`data` booleans.
- [ ] `AbortController` cancels on unmount and on dependency change; `signal.aborted` is checked before `setState`.
- [ ] Loading branch renders skeleton shapes that match the real content, plus a text-based status message.
- [ ] Empty branch is separate from error and offers a next action.
- [ ] Error branch renders a MessageBar with the real message and a retry that calls `reload`.
- [ ] Refresh keeps existing content mounted; refresh failures are warnings, not full-page errors.
- [ ] Retry/refresh buttons are disabled while `isFetching`.

## Examples

### Full async state machine with skeleton, empty, error, and retry

A reusable useAsyncData hook (AbortController + stale-response guard + reload nonce) and a render function that switches on a discriminated union to produce skeleton loading, an actionable empty state, a retryable MessageBar error, and the success list.

```tsx
import * as React from 'react';
import { Button, Card, Divider, MessageBar, Skeleton, Spinner, Text } from '@fluentui/react-components';

/* ------------------------------------------------------------------ *
 * 1. One discriminated union covers every state the view can be in.
 * ------------------------------------------------------------------ */
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T };

/* ------------------------------------------------------------------ *
 * 2. A hook that owns the request: cancel, retry, drop stale answers.
 * ------------------------------------------------------------------ */
export function useAsyncData<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: React.DependencyList = [],
) {
  const [state, setState] = React.useState<AsyncState<T>>({ status: 'idle' });
  const [nonce, setNonce] = React.useState(0);

  const reload = React.useCallback(() => setNonce((n) => n + 1), []);

  React.useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });

    fetcher(controller.signal).then(
      (data) => {
        // A newer request (or an unmount) already happened: drop this response.
        if (!controller.signal.aborted) {
          setState({ status: 'success', data });
        }
      },
      (cause: unknown) => {
        if (!controller.signal.aborted) {
          setState({
            status: 'error',
            error: cause instanceof Error ? cause : new Error(String(cause)),
          });
        }
      },
    );

    return () => controller.abort();
    // `fetcher` is deliberately excluded: callers pass a fresh closure each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  return { state, reload };
}

/* ------------------------------------------------------------------ *
 * 3. A fake API so this file runs standalone. Swap it for `fetch`.
 * ------------------------------------------------------------------ */
type User = { id: string; name: string; role: string };

const USERS: User[] = [
  { id: 'u1', name: 'Priya Raman', role: 'Principal Engineer' },
  { id: 'u2', name: 'Diego Alvarez', role: 'Design Systems Engineer' },
  { id: 'u3', name: 'Mei Lin', role: 'Product Manager' },
];

function fetchUsers(signal: AbortSignal): Promise<User[]> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => resolve(USERS), 1200);
    signal.addEventListener('abort', () => {
      window.clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

/* ------------------------------------------------------------------ *
 * 4. Loading branch: skeleton shapes that match the final content.
 * ------------------------------------------------------------------ */
function LoadingRows(): React.ReactElement {
  return (
    <div role="status" aria-live="polite" style={{ display: 'grid', gap: 12 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <Spinner size="extra-tiny" delay={500} />
        <Text size={200}>Loading team members…</Text>
      </span>
      <div aria-hidden="true" style={{ display: 'grid', gap: 12 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ display: 'grid', gap: 6 }}>
            <Skeleton animation="wave" width="40%" size={16} />
            <Skeleton animation="wave" width="70%" size={12} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 5. One render branch per state — exhaustively narrowed by `status`.
 * ------------------------------------------------------------------ */
function renderState(state: AsyncState<User[]>, reload: () => void): React.ReactElement {
  switch (state.status) {
    case 'idle':
    case 'loading':
      return <LoadingRows />;

    case 'error':
      return (
        <MessageBar intent="error" politeness="assertive">
          <div style={{ display: 'grid', gap: 8, justifyItems: 'start' }}>
            <Text weight="semibold">We couldn’t load the team</Text>
            <Text size={200}>{state.error.message}</Text>
            <Button appearance="primary" onClick={reload}>
              Try again
            </Button>
          </div>
        </MessageBar>
      );

    case 'success':
      // Empty is a success with zero rows — never an error.
      if (state.data.length === 0) {
        return (
          <div style={{ display: 'grid', gap: 8, justifyItems: 'start' }}>
            <Text weight="semibold">No team members yet</Text>
            <Text size={200}>Invite someone to get started — they show up here.</Text>
            <Button appearance="primary">Invite a teammate</Button>
          </div>
        );
      }

      return (
        <ul
          aria-label="Team members"
          style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}
        >
          {state.data.map((user) => (
            <li key={user.id}>
              <Card appearance="outline" size="small">
                <Text block weight="semibold">
                  {user.name}
                </Text>
                <Text block size={200}>
                  {user.role}
                </Text>
              </Card>
            </li>
          ))}
        </ul>
      );
  }
}

/* ------------------------------------------------------------------ *
 * 6. The consumer: stable shell + swapped state region.
 * ------------------------------------------------------------------ */
export function AsyncDataStates(): React.ReactElement {
  const { state, reload } = useAsyncData((signal) => fetchUsers(signal), []);

  return (
    <Card style={{ maxWidth: 480, padding: 16, display: 'grid', gap: 12 }}>
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}
      >
        <Text size={500} weight="semibold">
          Team members
        </Text>
        <Button appearance="subtle" onClick={reload} disabled={state.status === 'loading'}>
          Refresh
        </Button>
      </div>

      <Divider />

      {renderState(state, reload)}
    </Card>
  );
}
```

### Debounced async search with empty, error, and loading states

A search field that debounces keystrokes, aborts superseded requests, and renders skeleton rows, an inline spinner in Input contentAfter, a term-aware empty state, and a retryable error MessageBar.

```tsx
import * as React from 'react';
import { Avatar, Badge, Button, Card, Field, Input, MessageBar, Skeleton, Spinner, Text } from '@fluentui/react-components';

type Person = { id: string; name: string; jobTitle: string; presence: 'active' | 'away' };

const DIRECTORY: Person[] = [
  { id: 'p1', name: 'Priya Raman', jobTitle: 'Principal Engineer', presence: 'active' },
  { id: 'p2', name: 'Diego Alvarez', jobTitle: 'Design Systems Engineer', presence: 'away' },
  { id: 'p3', name: 'Mei Lin', jobTitle: 'Product Manager', presence: 'active' },
  { id: 'p4', name: 'Sam Okafor', jobTitle: 'Support Engineer', presence: 'active' },
];

/** Stand-in for `fetch('/api/directory?q=…', { signal })`. */
function searchDirectory(query: string, signal: AbortSignal): Promise<Person[]> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      const q = query.trim().toLowerCase();
      resolve(
        q === ''
          ? DIRECTORY
          : DIRECTORY.filter(
              (p) =>
                p.name.toLowerCase().includes(q) || p.jobTitle.toLowerCase().includes(q),
            ),
      );
    }, 600);

    signal.addEventListener('abort', () => {
      window.clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

type SearchState =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; results: Person[] };

export function DirectorySearch(): React.ReactElement {
  const [query, setQuery] = React.useState('');
  const [state, setState] = React.useState<SearchState>({ status: 'loading' });
  const [attempt, setAttempt] = React.useState(0);

  React.useEffect(() => {
    const controller = new AbortController();

    // Debounce keystrokes, then fetch. The cleanup aborts the in-flight request,
    // so a slow response can never overwrite results for a newer query.
    const timer = window.setTimeout(() => {
      searchDirectory(query, controller.signal).then(
        (results) => {
          if (!controller.signal.aborted) {
            setState({ status: 'success', results });
          }
        },
        (cause: unknown) => {
          if (controller.signal.aborted) {
            return;
          }
          setState({
            status: 'error',
            error: cause instanceof Error ? cause : new Error(String(cause)),
          });
        },
      );
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, attempt]);

  const retry = () => {
    setState({ status: 'loading' });
    setAttempt((a) => a + 1);
  };

  return (
    <Card style={{ maxWidth: 480, padding: 16, display: 'grid', gap: 12 }}>
      <Field label="Search the directory" hint="Try a name or a job title">
        <Input
          value={query}
          placeholder="e.g. engineer"
          onChange={(_, data) => {
            // Flip to loading immediately so the previous results never look current.
            setState({ status: 'loading' });
            setQuery(data.value);
          }}
          contentAfter={state.status === 'loading' ? <Spinner size="extra-tiny" /> : undefined}
        />
      </Field>

      {state.status === 'loading' && (
        <div role="status" aria-live="polite" style={{ display: 'grid', gap: 12 }}>
          <Text size={200}>Searching…</Text>
          <div aria-hidden="true" style={{ display: 'grid', gap: 12 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Skeleton animation="wave" shape="circle" width={40} size={40} />
                <div style={{ display: 'grid', gap: 6, flex: 1 }}>
                  <Skeleton animation="wave" width="45%" size={16} />
                  <Skeleton animation="wave" width="70%" size={12} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {state.status === 'error' && (
        <MessageBar intent="error" politeness="assertive">
          <div style={{ display: 'grid', gap: 8, justifyItems: 'start' }}>
            <Text weight="semibold">We couldn’t search the directory</Text>
            <Text size={200}>{state.error.message}</Text>
            <Button appearance="primary" onClick={retry}>
              Try again
            </Button>
          </div>
        </MessageBar>
      )}

      {state.status === 'success' && state.results.length === 0 && (
        <div style={{ display: 'grid', gap: 6, justifyItems: 'start' }}>
          <Text weight="semibold">No people match “{query}”</Text>
          <Text size={200}>Try a broader term, or clear the search to see everyone.</Text>
          <Button
            appearance="secondary"
            onClick={() => {
              setState({ status: 'loading' });
              setQuery('');
            }}
          >
            Clear search
          </Button>
        </div>
      )}

      {state.status === 'success' && state.results.length > 0 && (
        <ul
          aria-label="Directory results"
          style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 4 }}
        >
          {state.results.map((person) => (
            <li key={person.id}>
              <Card
                appearance="outline"
                size="small"
                style={{ display: 'flex', alignItems: 'center', gap: 12 }}
              >
                <Avatar
                  name={person.name}
                  idForColor={person.id}
                  color="colorful"
                  size={40}
                />
                <div style={{ display: 'grid', flex: 1 }}>
                  <Text weight="semibold">{person.name}</Text>
                  <Text size={200}>{person.jobTitle}</Text>
                </div>
                <Badge
                  appearance="tint"
                  color={person.presence === 'active' ? 'success' : 'warning'}
                >
                  {person.presence === 'active' ? 'Active' : 'Away'}
                </Badge>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
```

### Stale-while-revalidate dashboard card with background refresh

A useResource hook that keeps the last successful data mounted, distinguishes isInitialLoading from isFetching, shows a small inline spinner while polling, and downgrades a failed refresh to a warning MessageBar instead of unmounting the content.

```tsx
import * as React from 'react';
import { Button, Card, Divider, MessageBar, Skeleton, Spinner, Text } from '@fluentui/react-components';

export interface ResourceState<T> {
  /** Last successful value — stays populated while a refresh is in flight. */
  data: T | undefined;
  /** Most recent failure — may coexist with `data` from an earlier success. */
  error: Error | undefined;
  /** True only until the first successful load. */
  isInitialLoading: boolean;
  /** True while any request is in flight. */
  isFetching: boolean;
  reload: () => void;
}

/**
 * Stale-while-revalidate: previous data is never thrown away on refresh,
 * and failures become warnings when we already have something to show.
 * `load` must be referentially stable (module scope or useCallback).
 */
export function useResource<T>(
  load: (signal: AbortSignal) => Promise<T>,
  options: { refreshIntervalMs?: number } = {},
): ResourceState<T> {
  const { refreshIntervalMs } = options;
  const [data, setData] = React.useState<T>();
  const [error, setError] = React.useState<Error>();
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const [isFetching, setIsFetching] = React.useState(true);
  const [nonce, setNonce] = React.useState(0);

  React.useEffect(() => {
    const controller = new AbortController();
    setIsFetching(true);

    load(controller.signal)
      .then((value) => {
        if (controller.signal.aborted) {
          return;
        }
        setData(value);
        setError(undefined);
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        setError(cause instanceof Error ? cause : new Error(String(cause)));
      })
      .finally(() => {
        if (controller.signal.aborted) {
          return;
        }
        setIsFetching(false);
        setIsInitialLoading(false);
      });

    return () => controller.abort();
  }, [load, nonce]);

  // Optional background polling; each tick just bumps the retry nonce.
  React.useEffect(() => {
    if (!refreshIntervalMs) {
      return;
    }
    const id = window.setInterval(() => setNonce((n) => n + 1), refreshIntervalMs);
    return () => window.clearInterval(id);
  }, [refreshIntervalMs]);

  const reload = React.useCallback(() => setNonce((n) => n + 1), []);

  return { data, error, isInitialLoading, isFetching, reload };
}

/* ------------------------------------------------------------------ */

type Metric = { id: string; label: string; value: string; delta: string };

const METRICS: Metric[] = [
  { id: 'm1', label: 'Requests / min', value: '12,480', delta: '+4.1%' },
  { id: 'm2', label: 'p95 latency', value: '184 ms', delta: '-12 ms' },
  { id: 'm3', label: 'Error rate', value: '0.03%', delta: '+0.01%' },
];

/** Module-scope loader keeps `useResource`'s effect dependency stable. */
function loadMetrics(signal: AbortSignal): Promise<Metric[]> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => resolve(METRICS), 900);
    signal.addEventListener('abort', () => {
      window.clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

export function ServiceHealthCard(): React.ReactElement {
  const { data, error, isInitialLoading, isFetching, reload } = useResource(loadMetrics, {
    refreshIntervalMs: 15000,
  });

  return (
    <Card style={{ maxWidth: 480, padding: 16, display: 'grid', gap: 12 }}>
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}
      >
        <Text size={500} weight="semibold">
          Service health
        </Text>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isFetching && !isInitialLoading ? (
            <span
              role="status"
              aria-live="polite"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <Spinner size="extra-tiny" />
              <Text size={200}>Refreshing…</Text>
            </span>
          ) : null}
          <Button appearance="subtle" onClick={reload} disabled={isFetching}>
            Refresh
          </Button>
        </div>
      </div>

      <Divider />

      {isInitialLoading ? (
        <div role="status" aria-live="polite" style={{ display: 'grid', gap: 12 }}>
          <Text size={200}>Loading health data…</Text>
          <div aria-hidden="true" style={{ display: 'grid', gap: 12 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ display: 'grid', gap: 6 }}>
                <Skeleton animation="wave" width="35%" size={12} />
                <Skeleton animation="wave" width="55%" size={24} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {error ? (
            <MessageBar intent="warning" politeness="polite">
              <div style={{ display: 'grid', gap: 8, justifyItems: 'start' }}>
                <Text weight="semibold">
                  {data ? 'Showing the last known values' : 'Health data is unavailable'}
                </Text>
                <Text size={200}>{error.message}</Text>
                <Button appearance="secondary" onClick={reload} disabled={isFetching}>
                  Retry
                </Button>
              </div>
            </MessageBar>
          ) : null}

          {data && data.length > 0 ? (
            <ul
              aria-label="Service metrics"
              style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}
            >
              {data.map((metric) => (
                <li
                  key={metric.id}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <Text size={200}>{metric.label}</Text>
                  <Text font="numeric" weight="semibold">
                    {metric.value}
                  </Text>
                  <Text size={200}>{metric.delta}</Text>
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ display: 'grid', gap: 6, justifyItems: 'start' }}>
              <Text weight="semibold">No metrics reported yet</Text>
              <Text size={200}>
                Metrics appear once the service has served at least one request.
              </Text>
              <Button appearance="primary" onClick={reload} disabled={isFetching}>
                Check again
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
```

## Pitfalls

- Storing loading/data/error as three independent useState values. This allows impossible combinations such as a spinner rendered next to an error, or an empty state that is also a success. Use a single discriminated union on a status field and switch on it.
- Not guarding against stale responses. Without an AbortController plus a `controller.signal.aborted` check before setState, a slow earlier request can resolve after a faster later one and overwrite fresh results (classic symptom: the list shows results for a query the user already deleted).
- Flashing spinners on fast responses. A spinner that appears for 40ms reads as a flicker. Pass Spinner's `delay` (300–500ms) and prefer Skeleton placeholders that match the final layout; also clear pending timeouts in the effect cleanup so a debounced fetch never runs after unmount.
- Unmounting content during refresh. Replacing the list with a loading branch on every refresh destroys scroll position and keyboard focus. Keep the last successful data mounted, track isFetching separately from isInitialLoading, and show a small inline spinner next to the section title.
- Treating empty as an error. Rendering a retry button for `success` with zero rows gives users an action that can never succeed. Render an empty branch with the reason and a forward action instead, and echo the search term to make it clear the emptiness is a filter result.
- Showing "Something went wrong" without the underlying message. Always normalize the thrown value to an Error and render `error.message` inside the MessageBar; an unactionable error costs a support ticket every time.
- Leaving Retry enabled while the retry is in flight. Double-clicking queues duplicate requests and can leave the UI showing an error after a successful retry. Disable the button (and the header Refresh button) while isFetching, and reset state to loading when the retry starts.

## Accessibility

Loading: wrap the loading branch in an element with role="status" and aria-live="polite" and always render real text ("Loading team members…") — Spinner renders no accessible name by itself, so a spinner with no adjacent label is invisible to screen readers. Mark decorative Skeleton markup aria-hidden="true" so placeholders are not announced. Errors: MessageBar with intent="error" announces its content; use politeness="assertive" only for failures the user directly triggered (Retry/Refresh) and politeness="polite" for background polling failures, otherwise repeated announcements interrupt. Put aria-busy="true" on the data container while a refresh is in flight so assistive tech knows the region is updating. Keep the retry/refresh Button mounted as disabled rather than unmounting it, so keyboard focus is not dropped to <body>; if a branch must be swapped, move focus deliberately to the status region. Do not convey status by color alone — every Badge in these examples also carries a text label. Use stable entity ids as React keys so revalidated data does not reuse rows and mismatch the accessibility tree. Empty states should pair a descriptive Text with a single actionable Button, and search empty states should echo the query so the state is understandable without sight of the input.

## Components used

- [Avatar](../../components/avatar.md)
- [Badge](../../components/badge.md)
- [Button](../../components/button.md)
- [Card](../../components/card.md)
- [Divider](../../components/divider.md)
- [Field](../../components/field.md)
- [Input](../../components/input.md)
- [MessageBar](../../components/message-bar.md)
- [Skeleton](../../components/skeleton.md)
- [Spinner](../../components/spinner.md)
- [Text](../../components/text.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
