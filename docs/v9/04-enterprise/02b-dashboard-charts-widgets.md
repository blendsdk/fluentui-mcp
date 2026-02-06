# Dashboard Pattern: Charts & Widget Grids

> **Module**: 04-enterprise
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-06-02

## Overview

Enterprise dashboards combine KPI cards with chart visualizations and configurable widget grids. FluentUI v9 provides `@fluentui/react-charts` for native chart components, and Card-based widget containers for third-party chart libraries. This guide covers chart integration, widget card wrappers, and responsive dashboard grid layouts.

---

## FluentUI Charts Integration

FluentUI v9 provides built-in chart components via `@fluentui/react-charts`:

```bash
yarn add @fluentui/react-charts
```

### Line Chart in a Widget Card

```tsx
import * as React from 'react';
import {
  Card,
  CardHeader,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { LineChart } from '@fluentui/react-charts';

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingVerticalM,
    height: '100%',
  },
  chartContainer: {
    height: '250px',
    marginTop: tokens.spacingVerticalS,
  },
});

interface RevenueChartWidgetProps {
  data: Array<{ date: Date; value: number }>;
}

/**
 * RevenueChartWidget — Line chart inside a Card widget.
 *
 * Wraps @fluentui/react-charts LineChart in a Card
 * with a header and responsive height container.
 */
export function RevenueChartWidget({ data }: RevenueChartWidgetProps) {
  const styles = useStyles();

  const chartData = {
    chartTitle: 'Revenue Over Time',
    lineChartData: [
      {
        legend: 'Revenue',
        data: data.map((d) => ({ x: d.date, y: d.value })),
        color: tokens.colorBrandForeground1,
      },
    ],
  };

  return (
    <Card className={styles.card}>
      <CardHeader header={<Text weight="semibold">Revenue Trend</Text>} />
      <div className={styles.chartContainer}>
        <LineChart data={chartData} />
      </div>
    </Card>
  );
}
```

### Bar Chart Widget

```tsx
import * as React from 'react';
import {
  Card,
  CardHeader,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { VerticalBarChart } from '@fluentui/react-charts';

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingVerticalM,
    height: '100%',
  },
  chartContainer: {
    height: '250px',
    marginTop: tokens.spacingVerticalS,
  },
});

interface CategoryData {
  category: string;
  value: number;
  color?: string;
}

interface BarChartWidgetProps {
  title: string;
  data: CategoryData[];
}

export function BarChartWidget({ title, data }: BarChartWidgetProps) {
  const styles = useStyles();

  const chartData = data.map((d) => ({
    x: d.category,
    y: d.value,
    color: d.color ?? tokens.colorBrandForeground1,
  }));

  return (
    <Card className={styles.card}>
      <CardHeader header={<Text weight="semibold">{title}</Text>} />
      <div className={styles.chartContainer}>
        <VerticalBarChart data={chartData} />
      </div>
    </Card>
  );
}
```

---

## Third-Party Chart Integration

For charts not available in `@fluentui/react-charts`, wrap third-party libraries (Recharts, Chart.js, etc.) in a FluentUI Card widget.

### Recharts Example

```tsx
import * as React from 'react';
import {
  Card,
  CardHeader,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingVerticalM,
    height: '100%',
  },
  chartWrapper: {
    height: '280px',
    marginTop: tokens.spacingVerticalS,
  },
});

interface TrafficWidgetProps {
  data: Array<{ name: string; visitors: number; pageViews: number }>;
}

/**
 * TrafficWidget — Wraps a Recharts AreaChart inside a FluentUI Card.
 *
 * Uses ResponsiveContainer so the chart fills
 * whatever grid cell it's placed in.
 */
export function TrafficWidget({ data }: TrafficWidgetProps) {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <CardHeader header={<Text weight="semibold">Site Traffic</Text>} />
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="visitors" stroke="#0078d4" fill="#0078d433" />
            <Area type="monotone" dataKey="pageViews" stroke="#107c10" fill="#107c1033" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
```

---

## Generic Widget Card Wrapper

A reusable wrapper for any widget content:

```tsx
import * as React from 'react';
import {
  Card,
  CardHeader,
  Text,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { MoreHorizontalRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingVerticalM,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  body: {
    flex: 1,
    marginTop: tokens.spacingVerticalS,
  },
});

interface DashboardWidgetProps {
  /** Widget title displayed in the card header */
  title: string;
  /** Optional menu actions (e.g. "Refresh", "Remove", "Configure") */
  actions?: Array<{ label: string; onClick: () => void }>;
  children: React.ReactNode;
}

/**
 * DashboardWidget — Generic card container for any dashboard widget.
 *
 * Provides a consistent header with title and optional actions menu.
 * Children render in the body area.
 */
export function DashboardWidget({ title, actions, children }: DashboardWidgetProps) {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <CardHeader
        header={<Text weight="semibold">{title}</Text>}
        action={
          actions && actions.length > 0 ? (
            <Menu>
              <MenuTrigger disableButtonEnhancement>
                <Button
                  appearance="subtle"
                  icon={<MoreHorizontalRegular />}
                  aria-label={`${title} actions`}
                />
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  {actions.map((action) => (
                    <MenuItem key={action.label} onClick={action.onClick}>
                      {action.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </MenuPopover>
            </Menu>
          ) : undefined
        }
      />
      <div className={styles.body}>{children}</div>
    </Card>
  );
}

// Usage:
function MyDashboard() {
  return (
    <DashboardWidget
      title="Recent Orders"
      actions={[
        { label: 'Refresh', onClick: () => refetch() },
        { label: 'Export CSV', onClick: () => exportCsv() },
      ]}
    >
      <OrdersTable />
    </DashboardWidget>
  );
}
```

---

## Dashboard Grid Layout

### CSS Grid with Named Areas

```tsx
import * as React from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  /** 
   * Desktop: 3-column grid with named areas.
   * Top row: 3 KPI cards. Middle: chart spans 2, sidebar 1. Bottom: full-width table.
   */
  dashboard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'auto auto auto',
    gridTemplateAreas: `
      "kpi1   kpi2   kpi3"
      "chart  chart  sidebar"
      "table  table  table"
    `,
    gap: tokens.spacingHorizontalL,
    padding: tokens.spacingVerticalL,
  },
  kpi1: { gridArea: 'kpi1' },
  kpi2: { gridArea: 'kpi2' },
  kpi3: { gridArea: 'kpi3' },
  chart: { gridArea: 'chart' },
  sidebar: { gridArea: 'sidebar' },
  table: { gridArea: 'table' },

  /** Mobile: stack everything in a single column */
  '@media (max-width: 768px)': {
    dashboard: {
      gridTemplateColumns: '1fr',
      gridTemplateAreas: `
        "kpi1"
        "kpi2"
        "kpi3"
        "chart"
        "sidebar"
        "table"
      `,
    },
  },
});

export function DashboardLayout() {
  const styles = useStyles();

  return (
    <div className={styles.dashboard}>
      <div className={styles.kpi1}><KpiCard label="Users" value="12K" /></div>
      <div className={styles.kpi2}><KpiCard label="Revenue" value="$284K" /></div>
      <div className={styles.kpi3}><KpiCard label="Orders" value="1,234" /></div>
      <div className={styles.chart}><RevenueChartWidget data={revenueData} /></div>
      <div className={styles.sidebar}><ActivityFeed /></div>
      <div className={styles.table}><RecentOrdersTable /></div>
    </div>
  );
}
```

### Auto-Flow Widget Grid

For dashboards where widgets can be any size:

```tsx
import * as React from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: tokens.spacingHorizontalL,
    padding: tokens.spacingVerticalL,
  },
  /** Widget that spans 2 columns on wide screens */
  wide: {
    gridColumn: 'span 2',
    '@media (max-width: 768px)': {
      gridColumn: 'span 1',
    },
  },
});

export function WidgetGrid() {
  const styles = useStyles();

  return (
    <div className={styles.grid}>
      <DashboardWidget title="Quick Stats"><KpiGrid metrics={metrics} /></DashboardWidget>
      <div className={styles.wide}>
        <DashboardWidget title="Revenue Trend"><RevenueChartWidget data={data} /></DashboardWidget>
      </div>
      <DashboardWidget title="Top Products"><TopProductsList /></DashboardWidget>
      <DashboardWidget title="Recent Activity"><ActivityFeed /></DashboardWidget>
    </div>
  );
}
```

---

## Widget with Time Range Selector

```tsx
import * as React from 'react';
import {
  Card,
  CardHeader,
  Text,
  Select,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingVerticalM,
    height: '100%',
  },
});

type TimeRange = '7d' | '30d' | '90d' | '1y';

interface TimeRangeWidgetProps {
  title: string;
  children: (range: TimeRange) => React.ReactNode;
}

/**
 * TimeRangeWidget — Widget with a time range dropdown in the header.
 *
 * Passes the selected range to children via render prop
 * so the chart/content can re-fetch data for that period.
 */
export function TimeRangeWidget({ title, children }: TimeRangeWidgetProps) {
  const styles = useStyles();
  const [range, setRange] = React.useState<TimeRange>('30d');

  return (
    <Card className={styles.card}>
      <CardHeader
        header={<Text weight="semibold">{title}</Text>}
        action={
          <Select
            value={range}
            onChange={(e, data) => setRange(data.value as TimeRange)}
            size="small"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </Select>
        }
      />
      {children(range)}
    </Card>
  );
}

// Usage:
function RevenueDashboardWidget() {
  return (
    <TimeRangeWidget title="Revenue">
      {(range) => <RevenueChart timeRange={range} />}
    </TimeRangeWidget>
  );
}
```

---

## Best Practices

### ✅ Do

- **Wrap charts in Card** — gives consistent elevation, padding, and theming
- **Use `ResponsiveContainer`** (Recharts) or percentage sizing for chart responsiveness
- **Add actions menus** to widgets for refresh, export, and configure options
- **Use `gridTemplateAreas`** for complex layouts where widget positions matter
- **Keep widget height consistent** within grid rows using `height: '100%'`

### ❌ Don't

- **Don't use fixed pixel widths** for charts — they won't resize in the grid
- **Don't load all chart data at once** — lazy-load or paginate heavy datasets
- **Don't mix chart libraries arbitrarily** — pick one primary library for visual consistency
- **Don't skip loading states** — show Skeleton in widgets while data loads

---

## Related Documentation

- [KPI Cards & Metrics](02a-dashboard-kpi-cards.md) — KPI card components
- [Dashboard Real-Time](02c-dashboard-real-time.md) — Live updates and activity feeds
- [Card Component](../02-components/layout/card.md) — Card API reference
- [Grid Patterns](../03-patterns/layout/03-grid-patterns.md) — CSS Grid layout patterns
