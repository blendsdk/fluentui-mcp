# Dashboard Pattern: KPI Cards & Metrics

> **Module**: 04-enterprise
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-06-02

## Overview

KPI (Key Performance Indicator) cards are the primary visual elements in enterprise dashboards. They display summarized metrics with labels, values, trends, and optional sparklines. This guide shows how to build KPI card components using FluentUI v9 Card, Text, Badge, and design tokens.

---

## Basic KPI Card

```tsx
import * as React from 'react';
import {
  Card,
  CardHeader,
  Text,
  Badge,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  ArrowTrendingRegular,
  ArrowUpRegular,
  ArrowDownRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  card: {
    minWidth: '200px',
    padding: tokens.spacingVerticalM,
  },
  value: {
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightHero700,
  },
  label: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
  trendUp: {
    color: tokens.colorPaletteGreenForeground1,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    fontSize: tokens.fontSizeBase200,
  },
  trendDown: {
    color: tokens.colorPaletteRedForeground1,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    fontSize: tokens.fontSizeBase200,
  },
});

interface KpiCardProps {
  /** Display label (e.g. "Total Users") */
  label: string;
  /** Formatted value (e.g. "12,345" or "$1.2M") */
  value: string;
  /** Percentage change — positive = up, negative = down */
  trend?: number;
  /** Time range label (e.g. "vs last month") */
  trendLabel?: string;
}

export function KpiCard({ label, value, trend, trendLabel }: KpiCardProps) {
  const styles = useStyles();
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <Card className={styles.card}>
      <Text className={styles.label}>{label}</Text>
      <Text className={styles.value}>{value}</Text>

      {trend !== undefined && (
        <div className={isPositive ? styles.trendUp : styles.trendDown}>
          {isPositive ? <ArrowUpRegular fontSize={12} /> : <ArrowDownRegular fontSize={12} />}
          <Text size={200}>
            {isPositive ? '+' : ''}
            {trend}%
          </Text>
          {trendLabel && (
            <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
              {trendLabel}
            </Text>
          )}
        </div>
      )}
    </Card>
  );
}
```

---

## KPI Card Grid Layout

```tsx
import * as React from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';
import { KpiCard } from './KpiCard';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: tokens.spacingHorizontalL,
  },
});

interface KpiMetric {
  label: string;
  value: string;
  trend?: number;
  trendLabel?: string;
}

interface KpiGridProps {
  metrics: KpiMetric[];
}

/**
 * KpiGrid — Responsive grid of KPI cards.
 *
 * Uses CSS Grid auto-fill so cards automatically reflow
 * across breakpoints without media queries.
 */
export function KpiGrid({ metrics }: KpiGridProps) {
  const styles = useStyles();

  return (
    <div className={styles.grid}>
      {metrics.map((metric) => (
        <KpiCard key={metric.label} {...metric} />
      ))}
    </div>
  );
}

// Usage:
function DashboardHeader() {
  const metrics: KpiMetric[] = [
    { label: 'Total Users', value: '12,345', trend: 8.2, trendLabel: 'vs last month' },
    { label: 'Active Sessions', value: '1,892', trend: -2.1, trendLabel: 'vs yesterday' },
    { label: 'Revenue', value: '$284K', trend: 15.3, trendLabel: 'vs last quarter' },
    { label: 'Support Tickets', value: '47', trend: -12, trendLabel: 'vs last week' },
  ];

  return <KpiGrid metrics={metrics} />;
}
```

---

## KPI Card with Status Badge

```tsx
import * as React from 'react';
import {
  Card,
  Text,
  Badge,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    minWidth: '200px',
    padding: tokens.spacingVerticalM,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacingVerticalS,
  },
  value: {
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightHero700,
  },
  subtitle: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
});

type StatusColor = 'success' | 'warning' | 'danger' | 'informative';

interface StatusKpiCardProps {
  label: string;
  value: string;
  subtitle?: string;
  status: StatusColor;
  statusLabel: string;
}

/**
 * StatusKpiCard — KPI card with a colored status badge.
 *
 * Use for metrics that have a health status
 * (e.g. "Healthy", "Warning", "Critical").
 */
export function StatusKpiCard({
  label,
  value,
  subtitle,
  status,
  statusLabel,
}: StatusKpiCardProps) {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <Text className={styles.subtitle}>{label}</Text>
        <Badge appearance="filled" color={status}>
          {statusLabel}
        </Badge>
      </div>
      <Text className={styles.value}>{value}</Text>
      {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
    </Card>
  );
}

// Usage:
function SystemHealthCards() {
  return (
    <>
      <StatusKpiCard
        label="API Uptime"
        value="99.97%"
        subtitle="Last 30 days"
        status="success"
        statusLabel="Healthy"
      />
      <StatusKpiCard
        label="Error Rate"
        value="2.3%"
        subtitle="Last 24 hours"
        status="warning"
        statusLabel="Elevated"
      />
      <StatusKpiCard
        label="Disk Usage"
        value="89%"
        subtitle="Primary storage"
        status="danger"
        statusLabel="Critical"
      />
    </>
  );
}
```

---

## KPI Card with Icon

```tsx
import * as React from 'react';
import {
  Card,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  PeopleRegular,
  MoneyRegular,
  DocumentRegular,
  ClockRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  card: {
    minWidth: '200px',
    padding: tokens.spacingVerticalM,
  },
  iconRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalS,
  },
  iconCircle: {
    width: '40px',
    height: '40px',
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: tokens.colorBrandBackground2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.colorBrandForeground2,
  },
  value: {
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightSemibold,
  },
  label: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
});

interface IconKpiCardProps {
  label: string;
  value: string;
  icon: React.ReactElement;
}

export function IconKpiCard({ label, value, icon }: IconKpiCardProps) {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <div className={styles.iconRow}>
        <div className={styles.iconCircle}>{icon}</div>
        <Text className={styles.label}>{label}</Text>
      </div>
      <Text className={styles.value}>{value}</Text>
    </Card>
  );
}
```

---

## Loading State for KPI Cards

```tsx
import * as React from 'react';
import {
  Card,
  Skeleton,
  SkeletonItem,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    minWidth: '200px',
    padding: tokens.spacingVerticalM,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
});

/**
 * KpiCardSkeleton — Placeholder while KPI data is loading.
 * Uses Skeleton to match the shape of a real KpiCard.
 */
export function KpiCardSkeleton() {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <Skeleton>
        <SkeletonItem size={12} style={{ width: '60%' }} />
        <SkeletonItem size={32} style={{ width: '40%' }} />
        <SkeletonItem size={12} style={{ width: '50%' }} />
      </Skeleton>
    </Card>
  );
}

// Usage in KpiGrid with loading state:
function KpiGridWithLoading({
  metrics,
  isLoading,
}: {
  metrics: KpiMetric[];
  isLoading: boolean;
}) {
  const styles = useGridStyles();

  return (
    <div className={styles.grid}>
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => <KpiCardSkeleton key={i} />)
        : metrics.map((m) => <KpiCard key={m.label} {...m} />)}
    </div>
  );
}
```

---

## Best Practices

### ✅ Do

- **Use `auto-fill` grid** for KPI rows — cards reflow automatically across breakpoints
- **Use design tokens** for all colors — ensures correct light/dark theme rendering
- **Provide Skeleton placeholders** while data is loading
- **Keep card content minimal** — one value, one label, one optional trend

### ❌ Don't

- **Don't put multiple metrics in one card** — each card = one KPI
- **Don't hardcode colors** — use `tokens.colorPalette*` for trend indicators
- **Don't forget aria-labels** when using icon-only indicators
- **Don't over-animate** — subtle transitions are preferred in enterprise UIs

---

## Related Documentation

- [Dashboard Charts & Widgets](02b-dashboard-charts-widgets.md) — Charts integration and widget grids
- [Dashboard Real-Time](02c-dashboard-real-time.md) — Live updates and activity feeds
- [Layout Patterns](../03-patterns/layout/00-layout-index.md) — Page structure patterns
- [Card Component](../02-components/layout/card.md) — Card API reference
