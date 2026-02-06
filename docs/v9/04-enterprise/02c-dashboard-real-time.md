# Dashboard Pattern: Real-Time Updates & Activity Feeds

> **Module**: 04-enterprise
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-06-02

## Overview

Enterprise dashboards often need live-updating content: real-time KPI counters, notification feeds, activity logs, and auto-refreshing data tables. This guide covers polling, WebSocket integration, activity feed components, and notification toast patterns — all built with FluentUI v9 components.

---

## Auto-Refreshing Data Hook

```tsx
import * as React from 'react';

interface UsePollingOptions<T> {
  /** Async function that fetches fresh data */
  fetcher: () => Promise<T>;
  /** Polling interval in milliseconds (default: 30000) */
  interval?: number;
  /** Whether polling is active (default: true) */
  enabled?: boolean;
}

interface UsePollingResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | undefined;
  /** Force an immediate refresh */
  refresh: () => void;
}

/**
 * usePolling — Periodically fetches data at a given interval.
 *
 * Automatically cleans up the interval on unmount.
 * Set `enabled: false` to pause polling (e.g. when tab is hidden).
 */
export function usePolling<T>({
  fetcher,
  interval = 30_000,
  enabled = true,
}: UsePollingOptions<T>): UsePollingResult<T> {
  const [data, setData] = React.useState<T | undefined>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | undefined>();

  const fetchData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await fetcher();
      setData(result);
      setError(undefined);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [fetcher]);

  React.useEffect(() => {
    fetchData();

    if (!enabled) return;
    const id = setInterval(fetchData, interval);
    return () => clearInterval(id);
  }, [fetchData, interval, enabled]);

  return { data, isLoading, error, refresh: fetchData };
}
```

### Using the Polling Hook

```tsx
import * as React from 'react';
import { KpiGrid } from './KpiGrid';
import { usePolling } from './usePolling';

function LiveKpiDashboard() {
  const { data: metrics, isLoading } = usePolling({
    fetcher: () => fetch('/api/metrics').then((r) => r.json()),
    interval: 15_000, // refresh every 15 seconds
  });

  return <KpiGrid metrics={metrics ?? []} isLoading={isLoading} />;
}
```

---

## WebSocket Live Updates

### WebSocket Hook

```tsx
import * as React from 'react';

interface UseWebSocketOptions {
  url: string;
  /** Called for each incoming message */
  onMessage: (data: unknown) => void;
  /** Reconnect after disconnect (default: true) */
  reconnect?: boolean;
}

/**
 * useWebSocket — Manages a WebSocket connection with auto-reconnect.
 *
 * Parses incoming JSON messages and passes them to onMessage.
 * Cleans up the connection on unmount.
 */
export function useWebSocket({ url, onMessage, reconnect = true }: UseWebSocketOptions) {
  const wsRef = React.useRef<WebSocket | null>(null);

  React.useEffect(() => {
    function connect() {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch {
          // Non-JSON message — ignore
        }
      };

      ws.onclose = () => {
        if (reconnect) {
          // Reconnect after 3 seconds
          setTimeout(connect, 3000);
        }
      };
    }

    connect();
    return () => wsRef.current?.close();
  }, [url, onMessage, reconnect]);
}
```

### Live KPI Updates via WebSocket

```tsx
import * as React from 'react';
import { useWebSocket } from './useWebSocket';
import { KpiCard } from './KpiCard';

interface MetricUpdate {
  id: string;
  label: string;
  value: string;
  trend: number;
}

function LiveMetricsDashboard() {
  const [metrics, setMetrics] = React.useState<Map<string, MetricUpdate>>(new Map());

  useWebSocket({
    url: 'wss://api.example.com/metrics/live',
    onMessage: (data) => {
      const update = data as MetricUpdate;
      setMetrics((prev) => new Map(prev).set(update.id, update));
    },
  });

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {Array.from(metrics.values()).map((m) => (
        <KpiCard key={m.id} label={m.label} value={m.value} trend={m.trend} />
      ))}
    </div>
  );
}
```

---

## Activity Feed Component

```tsx
import * as React from 'react';
import {
  Card,
  CardHeader,
  Text,
  Avatar,
  Badge,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingVerticalM,
    height: '100%',
    overflow: 'hidden',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    maxHeight: '400px',
    overflowY: 'auto',
  },
  item: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalS,
    padding: `${tokens.spacingVerticalS} 0`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  itemContent: {
    flex: 1,
  },
  timestamp: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase100,
    whiteSpace: 'nowrap',
  },
});

interface ActivityItem {
  id: string;
  user: { name: string; avatar?: string };
  action: string;
  target: string;
  timestamp: string;
  type: 'create' | 'update' | 'delete' | 'comment';
}

interface ActivityFeedProps {
  items: ActivityItem[];
}

const typeBadgeColor: Record<ActivityItem['type'], 'informative' | 'success' | 'warning' | 'danger'> = {
  create: 'success',
  update: 'informative',
  delete: 'danger',
  comment: 'warning',
};

/**
 * ActivityFeed — Scrollable list of recent user actions.
 *
 * Displays avatar, action description, and timestamp
 * with a colored badge indicating the action type.
 */
export function ActivityFeed({ items }: ActivityFeedProps) {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <CardHeader header={<Text weight="semibold">Recent Activity</Text>} />
      <ul className={styles.list} role="list">
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            <Avatar name={item.user.name} image={{ src: item.user.avatar }} size={28} />
            <div className={styles.itemContent}>
              <Text size={200}>
                <Text weight="semibold" size={200}>{item.user.name}</Text>{' '}
                {item.action}{' '}
                <Text weight="semibold" size={200}>{item.target}</Text>
              </Text>
              <Badge size="small" color={typeBadgeColor[item.type]} appearance="outline">
                {item.type}
              </Badge>
            </div>
            <Text className={styles.timestamp}>{item.timestamp}</Text>
          </li>
        ))}
      </ul>
    </Card>
  );
}
```

---

## Live Activity Feed with WebSocket

```tsx
import * as React from 'react';
import { useWebSocket } from './useWebSocket';
import { ActivityFeed, ActivityItem } from './ActivityFeed';

/**
 * LiveActivityFeed — Prepends new items from WebSocket in real time.
 *
 * Keeps a maximum of 50 items to prevent memory growth.
 */
function LiveActivityFeed() {
  const [items, setItems] = React.useState<ActivityItem[]>([]);

  useWebSocket({
    url: 'wss://api.example.com/activity/live',
    onMessage: (data) => {
      const newItem = data as ActivityItem;
      setItems((prev) => [newItem, ...prev].slice(0, 50));
    },
  });

  return <ActivityFeed items={items} />;
}
```

---

## Toast Notifications for Real-Time Events

```tsx
import * as React from 'react';
import {
  Toaster,
  useToastController,
  Toast,
  ToastTitle,
  ToastBody,
  useId,
} from '@fluentui/react-components';
import { useWebSocket } from './useWebSocket';

interface ServerNotification {
  title: string;
  message: string;
  level: 'info' | 'warning' | 'error' | 'success';
}

/**
 * NotificationToaster — Shows toast notifications for real-time server events.
 *
 * Listens to a WebSocket and dispatches FluentUI Toasts
 * with the appropriate intent (info, warning, error, success).
 */
function NotificationToaster() {
  const toasterId = useId('notifications');
  const { dispatchToast } = useToastController(toasterId);

  useWebSocket({
    url: 'wss://api.example.com/notifications',
    onMessage: (data) => {
      const notification = data as ServerNotification;
      dispatchToast(
        <Toast>
          <ToastTitle>{notification.title}</ToastTitle>
          <ToastBody>{notification.message}</ToastBody>
        </Toast>,
        { intent: notification.level, timeout: 5000 },
      );
    },
  });

  return <Toaster toasterId={toasterId} position="top-end" />;
}
```

---

## Connection Status Indicator

```tsx
import * as React from 'react';
import {
  Badge,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  indicator: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
  },
});

type ConnectionState = 'connected' | 'reconnecting' | 'disconnected';

interface ConnectionStatusProps {
  state: ConnectionState;
}

const stateConfig: Record<ConnectionState, { color: 'success' | 'warning' | 'danger'; label: string }> = {
  connected: { color: 'success', label: 'Live' },
  reconnecting: { color: 'warning', label: 'Reconnecting...' },
  disconnected: { color: 'danger', label: 'Disconnected' },
};

/**
 * ConnectionStatus — Visual indicator showing real-time connection health.
 *
 * Place in dashboard header or footer to show
 * whether the live data feed is active.
 */
export function ConnectionStatus({ state }: ConnectionStatusProps) {
  const styles = useStyles();
  const config = stateConfig[state];

  return (
    <div className={styles.indicator}>
      <Badge size="tiny" color={config.color} />
      <Text size={100}>{config.label}</Text>
    </div>
  );
}
```

---

## Best Practices

### ✅ Do

- **Use polling for non-critical data** (15–60 second intervals) to reduce server load
- **Use WebSocket for truly real-time data** (live counters, chat, notifications)
- **Cap activity feed length** (e.g. 50 items) to prevent memory growth
- **Show connection status** so users know if live data is flowing
- **Pause polling when tab is hidden** using `document.visibilityState`

### ❌ Don't

- **Don't poll faster than 5 seconds** without a good reason — it wastes bandwidth
- **Don't update React state on every WebSocket frame** — batch updates if high-frequency
- **Don't forget reconnection logic** — WebSocket connections drop regularly
- **Don't show stale data without indication** — use timestamps or "Last updated" labels

---

## Related Documentation

- [KPI Cards & Metrics](02a-dashboard-kpi-cards.md) — KPI card components
- [Charts & Widgets](02b-dashboard-charts-widgets.md) — Chart integration
- [Toast Component](../02-components/feedback/toast.md) — Toast API reference
- [Data Fetching Patterns](../03-patterns/data/04-data-fetching.md) — React Query and SWR patterns
