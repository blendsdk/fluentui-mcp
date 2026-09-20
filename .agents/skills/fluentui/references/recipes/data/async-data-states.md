# Async Data States

> **Group**: data

## Goal

Render every phase of an async request — first load, background refresh, failure, stale data, empty result, and success — with Fluent UI v9 components so the UI never jumps, never loses the user's context, and never mis-announces state to assistive technology.

## When to Use

Use this recipe for any surface whose content comes from a remote source: lists, feeds, detail panes, dashboards, tables, and infinite/`load more` views. It is the right choice whenever the UI must distinguish 'still loading', 'refreshing', 'failed', 'empty' and 'ready', or must keep previously loaded data visible while a new request is in flight.

## When Not to Use

Do not use it for synchronous, purely client-side state (if there is no request, there is nothing to load — just render). Do not use a full content skeleton for a fast mutation such as a save or delete; disable the triggering Button and/or update optimistically. Do not replace content with a spinner for a blocking decision that must prevent interaction — use a modal Dialog with a Spinner inside. For non-blocking failures that happen while the user is doing something else, prefer Toaster/Toast over a MessageBar that takes over the layout.

A single remote read produces more than two UI phases. Most applications implement *loading* and *success* well and then handle *error* with a raw exception and *empty* with a blank screen. This recipe models the phases explicitly and maps each one to a Fluent UI v9 component.

## The phase map

| Phase | Trigger | Component |
| --- | --- | --- |
| **First load** | no data yet, request in flight | `Skeleton` (content-shaped) or `Spinner` (inline) |
| **Refreshing** | data already on screen, new request in flight | inline `Spinner` + `aria-busy` on the region |
| **Determinate progress** | the server reports a percentage | `ProgressBar value={n}` |
| **Failure** | request rejected and there is nothing to show | `MessageBar intent="error"` with a retry `Button` in `MessageBarActions` |
| **Degraded / stale** | refresh failed but the last good payload still applies | `MessageBar intent="warning"` above the untouched content |
| **Empty** | request succeeded with zero items | `MessageBar intent="info"` or a `Card` empty state with a primary action |
| **Success** | request succeeded with data | your content, inside an `aria-busy={false}` region |

## 1. Model the phases as a discriminated union

Do not scatter `isLoading`, `isError`, `data` and `error` booleans — they allow impossible combinations (`isLoading && isError`). Use one union and let TypeScript prove which branch you are in:

```tsx
type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'refreshing'; data: T } // keep the last good result on screen
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T };
```

Note that **empty is not a status**. It is a property of a successful payload (`data.length === 0`), so it should be derived — usually with an `isEmpty` predicate. Mixing it into the union means you have to reset it correctly on every refresh.

Rendering then becomes a `switch` (or a sequence of early returns) with no nullable checks. Pair the union with a hook that owns an `AbortController` so a slow first response can never overwrite a fast second one.

## 2. First load: skeletons beat spinners

A skeleton reserves the same space the real content will occupy, so the page does not reflow when data lands. Mirror the real structure with `Card` + `CardHeader` and give every line its own `Skeleton`:

```tsx
<Card appearance="outline">
  <CardHeader
    image={<Skeleton animation="wave" shape="circle" size={32} />}
    header={<Skeleton animation="wave" width="180px" />}
    description={<Skeleton animation="wave" width="120px" />}
  />
  <Skeleton animation="wave" width="100%" />
  <Skeleton animation="wave" width="64%" />
</Card>
```

`Skeleton` accepts `animation` (`wave` or `pulse`), `appearance`, `width`, `size` and `shape`, which is enough to mock avatars (`shape="circle"`), badges (`shape="rectangle"`), and text lines. Wrap the group in a single `role="status"` element with an `aria-label` such as `Loading deployments` so the wait is announced once rather than per placeholder.

Use `Spinner` for inline or sub-second waits — never for a first page load of a large surface. `Spinner` takes its label from its children, so give it real text: `<Spinner size="small" labelPosition="after">Refreshing…</Spinner>`. Its `delay` prop lets you suppress the indicator entirely for fast responses, which removes the flicker that makes fast apps feel slow.

## 3. Refreshing: keep the data, mark the region busy

Replacing content with a skeleton on every refresh destroys scroll position, focus, text selection, and the user's reading context. Instead:

1. Keep rendering the previous `data` (that is why `refreshing` carries `data`).
2. Set `aria-busy` on the region that is re-fetching.
3. Show a small `Spinner` next to the refresh `Button` and disable that button while the request is in flight.

```tsx
{state.status === 'refreshing' && (
  <Spinner size="extra-tiny" labelPosition="after">Refreshing…</Spinner>
)}
```

When the refresh succeeds, update the count/summary text in the same commit so the change is perceivable without a visual flash.

## 4. Failure: one MessageBar with one obvious recovery

```tsx
<MessageBar intent="error" politeness="assertive">
  <MessageBarBody>
    <MessageBarTitle>Couldn't load projects</MessageBarTitle>
    {error.message}
  </MessageBarBody>
  <MessageBarActions>
    <Button appearance="primary" onClick={onRetry}>Try again</Button>
  </MessageBarActions>
</MessageBar>
```

Guidelines:

- `intent="error"` for the blocking case where the content is gone; `intent="warning"` when the user can keep working with stale content.
- `politeness="assertive"` interrupts the screen reader, so reserve it for failures that removed the content the user was interacting with. Polite announcements that arrive after the fact are usually ignored.
- `MessageBarActions` accepts a `containerAction` slot for a low-emphasis button (Dismiss, View details) that should sit apart from the primary recovery action.
- Move focus to the recovery button **only** when the error surface replaced the content the user was on. Never move focus for a background refresh failure.
- Write human copy: what failed, and what the user can do. Do not print a stack trace.

## 5. Empty: a success with zero results

Zero results is a successful request. Render it as information, plus a path forward:

```tsx
<MessageBar intent="info">
  <MessageBarBody>No deployments yet. Push to your default branch and they will show up here.</MessageBarBody>
</MessageBar>
```

For first-run experiences where you want to push a single action, use a `Card` with `CardHeader` (title + description) and a `Button appearance="primary"` such as *New project*. Do not use `intent="warning"` or `intent="error"` — nothing went wrong.

## 6. Stale data and partial failure

If a background refresh fails while the last payload is still useful, do **not** trade good data for an error card. Keep the data, keep the scroll position, and add a warning above it with a Retry affordance. Example 2 implements exactly this with a reducer: a `failure` action only becomes `status: 'error'` when there is no data to fall back on; otherwise it sets a `staleWarning` string and stays `ready`.

## 7. Compose it once: an async boundary

The `AsyncResourceView` in example 1 is a tiny generic boundary. Callers pass the union, a retry callback, and a render function for the success branch:

```tsx
<AsyncResourceView
  state={state}
  onRetry={reload}
  errorTitle="Couldn't load projects"
  isEmpty={(projects) => projects.length === 0}
  emptyFallback={<EmptyState title="No projects yet" description="Projects you create will appear here." />}
>
  {(projects) => <ProjectGrid projects={projects} />}
</AsyncResourceView>
```

Rules of thumb:

- One hook owns the request lifecycle (fetch, abort on unmount, abort superseded requests, expose `reload`).
- One boundary component owns the phase switch. Feature code only writes the success branch.
- Allow per-surface fallbacks (`loadingFallback`, `emptyFallback`) so a table can pass skeleton rows while a card passes a card skeleton.
- Never fire side effects (navigation, toasts, analytics) from the render switch — fire them from the data hook.

## Accessibility checklist

- `role="status"` (polite) for first-load skeletons and spinners; `aria-busy` on the region that re-fetches.
- `MessageBar` is already a live region — pick `politeness` there instead of adding your own `aria-live` wrapper, or the message will be announced twice.
- Give `ProgressBar` an accessible name when it is not described by adjacent text (for example `aria-label="Deploying identity service"`).
- Announce results, not just work: updating the `CardHeader` description to `24 services` after a refresh tells the user what changed.
- Focus discipline: move focus to the retry button for content-replacing errors; never move it for refreshes or warnings.
- Wrap the application in `FluentProvider` (with your theme) so skeletons, spinners, and message bars pick up the design tokens; all examples below assume that provider is already at the app root.

## Examples

### AsyncResourceView: a reusable boundary for loading, error, empty and success

A generic boundary component plus the data hook that feeds it. It models loading/error/success as a discriminated union, aborts superseded requests, renders a content-shaped Skeleton for the first load, a MessageBar with a focused retry button for failures, and a Card empty state for zero results. The usage section wires it to a real fetch call.

```tsx
// AsyncResourceView.tsx
// Renders inside your app's <FluentProvider> root.
import * as React from 'react';
import {
  Button,
  Card,
  CardHeader,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  MessageBarTitle,
  Skeleton,
  Text,
} from '@fluentui/react-components';

/* ------------------------------------------------------------------ *
 * 1. Model every outcome of the request as a discriminated union.
 *    "Empty" is deliberately NOT a status - it is derived from data.
 * ------------------------------------------------------------------ */

export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T };

/* ------------------------------------------------------------------ *
 * 2. One hook owns the request lifecycle: it aborts superseded and
 *    unmounted requests and exposes `reload` for the retry button.
 * ------------------------------------------------------------------ */

export function useAsyncData<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: React.DependencyList = [],
): { state: AsyncState<T>; reload: () => void } {
  const [reloadToken, setReloadToken] = React.useState(0);
  const [state, setState] = React.useState<AsyncState<T>>({ status: 'loading' });

  React.useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });

    fetcher(controller.signal).then(
      (data) => {
        // Ignore a response that has been superseded or unmounted.
        if (!controller.signal.aborted) {
          setState({ status: 'success', data });
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

    return () => controller.abort();
    // `fetcher` is intentionally not a dependency - callers pass `deps`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadToken, ...deps]);

  const reload = React.useCallback(() => setReloadToken((token) => token + 1), []);

  return { state, reload };
}

/* ------------------------------------------------------------------ *
 * 3. One fallback per phase. Content-shaped, so nothing jumps.
 * ------------------------------------------------------------------ */

export function ContentSkeleton({ label = 'Loading' }: { label?: string }) {
  return (
    <div role="status" aria-label={label}>
      <Card appearance="outline">
        <CardHeader
          image={<Skeleton animation="wave" shape="circle" size={32} />}
          header={<Skeleton animation="wave" width="180px" />}
          description={<Skeleton animation="wave" width="120px" />}
        />
        <div style={{ display: 'grid', rowGap: '8px' }}>
          <Skeleton animation="wave" width="100%" />
          <Skeleton animation="wave" width="88%" />
          <Skeleton animation="wave" width="64%" />
        </div>
      </Card>
    </div>
  );
}

/** Blocking failure: announced assertively, focus moves to the recovery action. */
export function ErrorState({
  title,
  error,
  onRetry,
}: {
  title: string;
  error: Error;
  onRetry: () => void;
}) {
  const retryRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    retryRef.current?.focus();
  }, []);

  return (
    <MessageBar intent="error" politeness="assertive">
      <MessageBarBody>
        <MessageBarTitle>{title}</MessageBarTitle>
        {error.message}
      </MessageBarBody>
      <MessageBarActions>
        <Button ref={retryRef} appearance="primary" onClick={onRetry}>
          Try again
        </Button>
      </MessageBarActions>
    </MessageBar>
  );
}

/** Empty is a successful outcome: explain it, do not alarm the user. */
export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card appearance="filled-alternative">
      <CardHeader
        header={<Text weight="semibold">{title}</Text>}
        description={<Text size={200}>{description}</Text>}
      />
    </Card>
  );
}

/* ------------------------------------------------------------------ *
 * 4. The boundary: a switch over the union, nothing more.
 * ------------------------------------------------------------------ */

export type AsyncResourceViewProps<T> = {
  state: AsyncState<T>;
  onRetry: () => void;
  errorTitle?: string;
  loadingFallback?: React.ReactNode;
  /** Return true when the successful payload represents "no results". */
  isEmpty?: (data: T) => boolean;
  emptyFallback?: React.ReactNode;
  children: (data: T) => React.ReactNode;
};

export function AsyncResourceView<T>({
  state,
  onRetry,
  errorTitle = 'Something went wrong',
  loadingFallback,
  isEmpty,
  emptyFallback,
  children,
}: AsyncResourceViewProps<T>) {
  if (state.status === 'loading') {
    return <>{loadingFallback ?? <ContentSkeleton />}</>;
  }

  if (state.status === 'error') {
    return <ErrorState title={errorTitle} error={state.error} onRetry={onRetry} />;
  }

  // TypeScript has narrowed `state` to the success branch here.
  if (isEmpty?.(state.data)) {
    return (
      <>
        {emptyFallback ?? (
          <EmptyState title="Nothing here yet" description="Create your first item to get started." />
        )}
      </>
    );
  }

  return <>{children(state.data)}</>;
}

/* ------------------------------------------------------------------ *
 * 5. Usage with a real request.
 * ------------------------------------------------------------------ */

type Project = { id: string; name: string; owner: string };

export function ProjectList() {
  const { state, reload } = useAsyncData<Project[]>(
    async (signal) => {
      const response = await fetch('/api/projects', { signal });
      if (!response.ok) {
        throw new Error(`The server responded with ${response.status}.`);
      }
      return (await response.json()) as Project[];
    },
    [], // re-fetch when these change, e.g. [teamId, page]
  );

  return (
    <AsyncResourceView
      state={state}
      onRetry={reload}
      errorTitle="Couldn't load projects"
      isEmpty={(projects) => projects.length === 0}
      emptyFallback={
        <EmptyState title="No projects yet" description="Projects you create will appear here." />
      }
    >
      {(projects) => (
        <ul style={{ margin: 0, paddingInlineStart: 20 }}>
          {projects.map((project) => (
            <li key={project.id}>
              {project.name} — {project.owner}
            </li>
          ))}
        </ul>
      )}
    </AsyncResourceView>
  );
}
```

### DeploymentsPanel: first load, refresh, stale warning, empty and error in one card

A self-contained panel backed by a simulated API. It uses a reducer so the last good payload survives a failed refresh (degrading to a warning MessageBar instead of an error screen), shows a determinate ProgressBar for running deployments, keeps an inline Spinner plus aria-busy during refresh, and only steals focus when an error replaces the content.

```tsx
// DeploymentsPanel.tsx
// Renders inside your app's <FluentProvider> root.
import * as React from 'react';
import {
  Badge,
  Button,
  Card,
  CardHeader,
  Divider,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  MessageBarTitle,
  ProgressBar,
  Skeleton,
  Spinner,
  Text,
} from '@fluentui/react-components';

/* ------------------------------------------------------------------ *
 * Simulated API. Replace `fetchDeployments` with your real call:
 * it fails ~25% of the time purely so you can exercise the error path.
 * ------------------------------------------------------------------ */

type DeploymentStatus = 'succeeded' | 'failed' | 'running';

type Deployment = {
  id: string;
  service: string;
  status: DeploymentStatus;
  /** 0-100. Only meaningful while the deployment is still running. */
  progress: number;
};

function fetchDeployments(signal: AbortSignal): Promise<Deployment[]> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      if (Math.random() < 0.25) {
        reject(new Error('The deployments service did not respond in time.'));
        return;
      }
      resolve([
        { id: 'checkout', service: 'checkout', status: 'succeeded', progress: 100 },
        { id: 'search', service: 'search', status: 'failed', progress: 100 },
        { id: 'identity', service: 'identity', status: 'running', progress: 62 },
      ]);
    }, 900);

    signal.addEventListener('abort', () => {
      window.clearTimeout(timer);
      reject(new Error('Request aborted'));
    });
  });
}

/* ------------------------------------------------------------------ *
 * State machine. `data` is kept across refreshes so the panel never
 * flashes back to a skeleton, and a failed refresh keeps the content.
 * ------------------------------------------------------------------ */

type State = {
  data: Deployment[] | null;
  status: 'loading' | 'refreshing' | 'ready' | 'error';
  error: Error | null;
  /** Set when a refresh failed but the previous payload is still usable. */
  staleWarning: string | null;
};

type Action =
  | { type: 'load' }
  | { type: 'success'; data: Deployment[] }
  | { type: 'failure'; error: Error };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'load':
      return state.data
        ? { ...state, status: 'refreshing', staleWarning: null }
        : { ...state, status: 'loading', error: null };
    case 'success':
      return { data: action.data, status: 'ready', error: null, staleWarning: null };
    case 'failure':
      // No data to fall back on -> hard error. Otherwise keep the data and warn.
      return state.data
        ? {
            ...state,
            status: 'ready',
            staleWarning: `${action.error.message} Showing the last results.`,
          }
        : { ...state, status: 'error', error: action.error };
  }
}

const STATUS_COLOR = {
  succeeded: 'success',
  failed: 'danger',
  running: 'informative',
} as const;

/* ------------------------------------------------------------------ */

export function DeploymentsPanel() {
  const [state, dispatch] = React.useReducer(reducer, {
    data: null,
    status: 'loading',
    error: null,
    staleWarning: null,
  });
  const [reloadToken, setReloadToken] = React.useState(0);
  const retryRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: 'load' });

    fetchDeployments(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted) {
          dispatch({ type: 'success', data });
        }
      },
      (cause: unknown) => {
        if (!controller.signal.aborted) {
          dispatch({
            type: 'failure',
            error: cause instanceof Error ? cause : new Error(String(cause)),
          });
        }
      },
    );

    return () => controller.abort();
  }, [reloadToken]);

  // Move focus only when the content was replaced by the error surface.
  React.useEffect(() => {
    if (state.status === 'error') {
      retryRef.current?.focus();
    }
  }, [state.status]);

  const reload = React.useCallback(() => setReloadToken((token) => token + 1), []);

  const deployments = state.data;
  const isBusy = state.status === 'loading' || state.status === 'refreshing';

  return (
    <Card appearance="outline" aria-busy={isBusy} style={{ maxWidth: 480 }}>
      <CardHeader
        header={
          <Text weight="semibold" size={400}>
            Deployments
          </Text>
        }
        description={
          deployments ? (
            <Text size={200}>{`${deployments.length} services`}</Text>
          ) : (
            <Skeleton animation="wave" width="72px" />
          )
        }
        action={
          <div style={{ display: 'flex', alignItems: 'center', columnGap: 8 }}>
            {state.status === 'refreshing' && (
              <Spinner size="extra-tiny" labelPosition="after">
                Refreshing…
              </Spinner>
            )}
            <Button appearance="subtle" disabled={isBusy} onClick={reload}>
              Refresh
            </Button>
          </div>
        }
      />

      {state.status === 'loading' && <DeploymentsSkeleton />}

      {state.status === 'error' && state.error && (
        <MessageBar intent="error" politeness="assertive">
          <MessageBarBody>
            <MessageBarTitle>Couldn't load deployments</MessageBarTitle>
            {state.error.message}
          </MessageBarBody>
          <MessageBarActions>
            <Button ref={retryRef} appearance="primary" onClick={reload}>
              Try again
            </Button>
          </MessageBarActions>
        </MessageBar>
      )}

      {state.staleWarning && (
        <MessageBar intent="warning">
          <MessageBarBody>{state.staleWarning}</MessageBarBody>
          <MessageBarActions>
            <Button appearance="primary" onClick={reload}>
              Retry
            </Button>
          </MessageBarActions>
        </MessageBar>
      )}

      {deployments && deployments.length === 0 && (
        <MessageBar intent="info">
          <MessageBarBody>
            No deployments yet. Push to your default branch and they will show up here.
          </MessageBarBody>
        </MessageBar>
      )}

      {deployments && deployments.length > 0 && (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {deployments.map((deployment) => (
            <li key={deployment.id} style={{ paddingBlockStart: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', columnGap: 8 }}>
                <Text weight="medium" style={{ flexGrow: 1 }}>
                  {deployment.service}
                </Text>
                <Badge appearance="tint" color={STATUS_COLOR[deployment.status]}>
                  {deployment.status}
                </Badge>
              </div>
              {deployment.status === 'running' && (
                <ProgressBar value={deployment.progress} max={100} thickness="medium" />
              )}
              <Divider appearance="subtle" style={{ marginBlockStart: 8 }} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function DeploymentsSkeleton() {
  return (
    <div role="status" aria-label="Loading deployments" style={{ display: 'grid', rowGap: 12 }}>
      {[0, 1, 2].map((row) => (
        <div key={row} style={{ display: 'flex', alignItems: 'center', columnGap: 8 }}>
          <Skeleton animation="wave" width="120px" />
          <Skeleton animation="wave" shape="rectangle" width="64px" />
        </div>
      ))}
    </div>
  );
}
```

### Load more: an inline footer instead of a full-surface swap

Pagination and infinite feeds should never replace the list with a skeleton. This example keeps the loaded items mounted and swaps only the footer control through idle -> loading (Spinner) -> error (MessageBar with retry) -> complete (disabled Button).

```tsx
// ActivityFeed.tsx
// Renders inside your app's <FluentProvider> root.
import * as React from 'react';
import {
  Button,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  Spinner,
  Text,
} from '@fluentui/react-components';

type ActivityItem = { id: string; summary: string };

type FooterState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'complete' };

/** Replace with your data layer - e.g. a cursor based `fetch`. */
async function loadNextPage(cursor: string): Promise<ActivityItem[]> {
  await new Promise((resolve) => window.setTimeout(resolve, 800));
  if (Math.random() < 0.3) {
    throw new Error('The activity service timed out.');
  }
  return [{ id: `${cursor}-1`, summary: 'Deployment finished for checkout' }];
}

export function ActivityFeed({
  initialItems,
  cursor,
}: {
  initialItems: ActivityItem[];
  cursor: string;
}) {
  const [items, setItems] = React.useState<ActivityItem[]>(initialItems);
  const [footer, setFooter] = React.useState<FooterState>({ status: 'idle' });

  const loadMore = async () => {
    setFooter({ status: 'loading' });
    try {
      const page = await loadNextPage(cursor);
      setItems((current) => [...current, ...page]);
      setFooter(page.length === 0 ? { status: 'complete' } : { status: 'idle' });
    } catch (cause: unknown) {
      setFooter({
        status: 'error',
        message: cause instanceof Error ? cause.message : String(cause),
      });
    }
  };

  return (
    <div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((item) => (
          <li key={item.id} style={{ padding: '8px 0' }}>
            <Text>{item.summary}</Text>
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', justifyContent: 'center', paddingBlockStart: 12 }}>
        {footer.status === 'loading' && (
          <Spinner size="small" labelPosition="after">
            Loading more…
          </Spinner>
        )}

        {footer.status === 'error' && (
          <MessageBar intent="error">
            <MessageBarBody>{footer.message}</MessageBarBody>
            <MessageBarActions>
              <Button appearance="primary" onClick={loadMore}>
                Retry
              </Button>
            </MessageBarActions>
          </MessageBar>
        )}

        {(footer.status === 'idle' || footer.status === 'complete') && (
          <Button
            appearance="subtle"
            disabled={footer.status === 'complete'}
            onClick={loadMore}
          >
            {footer.status === 'complete' ? 'All activity loaded' : 'Load more'}
          </Button>
        )}
      </div>
    </div>
  );
}
```

## Pitfalls

- Scattering `isLoading`/`isError`/`data` booleans instead of one discriminated union, which allows impossible states and keeps the old data rendered after a failure. Use a single union and handle it exhaustively.
- Treating 'empty' as a request status. Empty is derived from a successful payload (`data.length === 0`); folding it into the state machine means you must remember to clear it on every retry and every refetch.
- Replacing already-rendered content with a full skeleton or spinner on refresh. This destroys scroll position, focus, text selection, and reading context. Keep the last good data, set `aria-busy`, and show an inline `Spinner` next to the refresh Button.
- Throwing away good data because a background refresh failed. Keep the payload and downgrade to `MessageBar intent="warning"` with a Retry action; only show `intent="error"` when there is nothing left to display.
- Not aborting in-flight requests. A slow first request can resolve after a fast second one and overwrite fresh data with stale data; without an `AbortController` cleanup you also get 'state update on an unmounted component' noise. Always check `signal.aborted` before setting state.
- Double-announcing state changes by wrapping a MessageBar (already a live region) in your own `aria-live` container, or by rendering one `role="status"` per skeleton placeholder instead of one for the group.
- Stealing focus on every failure, including background refreshes and 'load more' errors. Only move focus when the error replaces the content the user was interacting with.
- Letting the loading indicator flash for fast responses. Give `Spinner` a delay, or gate the skeleton on a small timer, so a 120 ms response does not produce a visible flicker.
- Using an icon-only or unlabeled Spinner. Screen reader users get nothing from a bare spinner; always render a text label as its child (or hide it and rely on the surrounding `role="status"` label, never both).
- Forgetting the surrounding `FluentProvider`. Skeletons, spinners, and message bars resolve design tokens from the provider theme, so an unwrapped subtree renders without the expected colors and spacing.

## Accessibility

Announce phases exactly once. Wrap first-load placeholders in a single `role="status"` element with a meaningful `aria-label` ('Loading deployments') instead of one live region per skeleton. MessageBar is already a live region: use its `politeness` prop (`assertive` only for errors that remove content the user was on, otherwise `polite`) rather than adding another `aria-live` wrapper, which would double-announce. Put `aria-busy` on the region that is fetching so assistive tech knows the content will change without tearing the tree down. Manage focus deliberately: move focus to the retry Button when an error surface replaces the content (the examples do this via a ref plus an effect keyed on the status change), and never move focus for background refreshes, stale-data warnings, or `load more` failures. Keep the pagination button disabled while its request is in flight so it cannot be double-activated from the keyboard. Give ProgressBar an accessible name (`aria-label`) when no adjacent text describes it. Announce results as well as work — update the CardHeader description to '24 services' when a refresh succeeds so a screen reader user learns what changed, not just that something happened. Prefer `animation="pulse"` when you need a calmer skeleton for users sensitive to motion.

## Components used

- [Badge](../../components/badge.md)
- [Button](../../components/button.md)
- [Card](../../components/card.md)
- [CardHeader](../../components/card-header.md)
- [Divider](../../components/divider.md)
- [MessageBar](../../components/message-bar.md)
- [MessageBarActions](../../components/message-bar-actions.md)
- [MessageBarBody](../../components/message-bar-body.md)
- [MessageBarTitle](../../components/message-bar-title.md)
- [ProgressBar](../../components/progress-bar.md)
- [Skeleton](../../components/skeleton.md)
- [Spinner](../../components/spinner.md)
- [Text](../../components/text.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
