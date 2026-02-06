# Dashboard Layout Pattern

> **File**: 03-patterns/layout/04a-dashboard-layout.md
> **FluentUI Version**: 9.x

## Overview

Dashboard layouts for displaying metrics, charts, and summary data. This pattern is ideal for admin panels, analytics dashboards, and data monitoring applications.

## Basic Dashboard Layout

```tsx
import { makeStyles, tokens, Card, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  dashboard: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalL,
    backgroundColor: tokens.colorNeutralBackground2,
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: tokens.spacingVerticalM,
    
    '@media (min-width: 640px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    
    '@media (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
  },
  chartsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: tokens.spacingVerticalM,
    
    '@media (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
  fullWidth: {
    gridColumn: '1 / -1',
  },
});

interface DashboardLayoutProps {
  title: string;
  headerActions?: React.ReactNode;
  stats: React.ReactNode;
  charts: React.ReactNode;
  table?: React.ReactNode;
}

export const DashboardLayout = ({
  title,
  headerActions,
  stats,
  charts,
  table,
}: DashboardLayoutProps) => {
  const styles = useStyles();

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <Text as="h1" size={700} weight="semibold">
          {title}
        </Text>
        {headerActions}
      </header>
      
      <section className={styles.statsRow}>
        {stats}
      </section>
      
      <section className={styles.chartsRow}>
        {charts}
      </section>
      
      {table && (
        <section className={styles.fullWidth}>
          {table}
        </section>
      )}
    </div>
  );
};
```

## Stat Card Component

```tsx
import { makeStyles, tokens, Card, Text } from '@fluentui/react-components';
import { ArrowTrendingRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingVerticalL,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: tokens.spacingVerticalS,
  },
  label: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  value: {
    fontSize: tokens.fontSizeHero800,
    fontWeight: tokens.fontWeightBold,
    lineHeight: 1,
    marginBottom: tokens.spacingVerticalS,
  },
  trend: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    fontSize: tokens.fontSizeBase200,
  },
  trendPositive: {
    color: tokens.colorPaletteGreenForeground1,
  },
  trendNegative: {
    color: tokens.colorPaletteRedForeground1,
  },
  iconWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: tokens.borderRadiusMedium,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    label: string;
  };
  icon?: React.ReactNode;
  iconBackground?: string;
}

export const StatCard = ({
  label,
  value,
  trend,
  icon,
  iconBackground,
}: StatCardProps) => {
  const styles = useStyles();
  const isPositive = trend && trend.value >= 0;

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        {icon && (
          <div
            className={styles.iconWrapper}
            style={{ backgroundColor: iconBackground || tokens.colorBrandBackground2 }}
          >
            {icon}
          </div>
        )}
      </div>
      
      <Text className={styles.value}>{value}</Text>
      
      {trend && (
        <div className={`${styles.trend} ${isPositive ? styles.trendPositive : styles.trendNegative}`}>
          <ArrowTrendingRegular />
          <span>
            {isPositive ? '+' : ''}{trend.value}% {trend.label}
          </span>
        </div>
      )}
    </Card>
  );
};
```

## Chart Card Component

```tsx
import { makeStyles, tokens, Card, Text, Menu, MenuTrigger, MenuPopover, MenuList, MenuItem, Button } from '@fluentui/react-components';
import { MoreHorizontalRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingVerticalL,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '300px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacingVerticalM,
  },
  title: {
    fontWeight: tokens.fontWeightSemibold,
  },
  chartArea: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusMedium,
    minHeight: '200px',
  },
});

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const ChartCard = ({ title, children, actions }: ChartCardProps) => {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <Text className={styles.title} size={400}>
          {title}
        </Text>
        {actions || (
          <Menu>
            <MenuTrigger disableButtonEnhancement>
              <Button appearance="subtle" icon={<MoreHorizontalRegular />} />
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem>Export</MenuItem>
                <MenuItem>Refresh</MenuItem>
                <MenuItem>Settings</MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        )}
      </div>
      
      <div className={styles.chartArea}>
        {children}
      </div>
    </Card>
  );
};
```

## Activity Feed Component

```tsx
import { makeStyles, tokens, Card, Text, Avatar, Badge } from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingVerticalL,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacingVerticalM,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  item: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingVerticalS,
    borderRadius: tokens.borderRadiusMedium,
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  content: {
    flex: 1,
  },
  time: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
});

interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target?: string;
  time: string;
  type?: 'success' | 'warning' | 'error' | 'info';
}

interface ActivityFeedProps {
  title: string;
  activities: ActivityItem[];
  onViewAll?: () => void;
}

export const ActivityFeed = ({ title, activities, onViewAll }: ActivityFeedProps) => {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <Text weight="semibold" size={400}>{title}</Text>
        {onViewAll && (
          <Text
            as="a"
            onClick={onViewAll}
            style={{ cursor: 'pointer', color: tokens.colorBrandForeground1 }}
          >
            View all
          </Text>
        )}
      </div>
      
      <div className={styles.list}>
        {activities.map(activity => (
          <div key={activity.id} className={styles.item}>
            <Avatar name={activity.user.name} image={{ src: activity.user.avatar }} size={32} />
            <div className={styles.content}>
              <Text>
                <Text weight="semibold">{activity.user.name}</Text>
                {' '}{activity.action}
                {activity.target && (
                  <Text weight="semibold">{' '}{activity.target}</Text>
                )}
              </Text>
              <Text className={styles.time}>{activity.time}</Text>
            </div>
            {activity.type && (
              <Badge
                appearance="tint"
                color={
                  activity.type === 'success' ? 'success' :
                  activity.type === 'warning' ? 'warning' :
                  activity.type === 'error' ? 'danger' : 'informative'
                }
              />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
```

## Complete Dashboard Example

```tsx
import {
  FluentProvider,
  webLightTheme,
  Button,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from '@fluentui/react-components';
import {
  PeopleRegular,
  MoneyRegular,
  DocumentRegular,
  ArrowDownloadRegular,
} from '@fluentui/react-icons';

// Import components from above
// import { DashboardLayout, StatCard, ChartCard, ActivityFeed } from './components';

export const Dashboard = () => {
  const stats = (
    <>
      <StatCard
        label="Total Users"
        value="12,345"
        trend={{ value: 12, label: 'vs last month' }}
        icon={<PeopleRegular />}
      />
      <StatCard
        label="Revenue"
        value="$54,321"
        trend={{ value: 8.5, label: 'vs last month' }}
        icon={<MoneyRegular />}
      />
      <StatCard
        label="Documents"
        value="1,234"
        trend={{ value: -3, label: 'vs last month' }}
        icon={<DocumentRegular />}
      />
      <StatCard
        label="Downloads"
        value="5,678"
        trend={{ value: 24, label: 'vs last month' }}
        icon={<ArrowDownloadRegular />}
      />
    </>
  );

  const charts = (
    <>
      <ChartCard title="Revenue Over Time">
        {/* Your chart component here */}
        <Text>Chart placeholder</Text>
      </ChartCard>
      
      <ActivityFeed
        title="Recent Activity"
        activities={[
          {
            id: '1',
            user: { name: 'John Doe' },
            action: 'created document',
            target: 'Q4 Report',
            time: '5 minutes ago',
            type: 'success',
          },
          {
            id: '2',
            user: { name: 'Jane Smith' },
            action: 'updated settings',
            time: '1 hour ago',
          },
        ]}
      />
    </>
  );

  const tableData = (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Amount</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Project Alpha</TableCell>
          <TableCell>Active</TableCell>
          <TableCell>$12,000</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Project Beta</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell>$8,500</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

  return (
    <FluentProvider theme={webLightTheme}>
      <DashboardLayout
        title="Dashboard"
        headerActions={
          <Button appearance="primary">Export Report</Button>
        }
        stats={stats}
        charts={charts}
        table={tableData}
      />
    </FluentProvider>
  );
};
```

## Best Practices

1. **Use consistent spacing** - Apply FluentUI tokens for padding and gaps
2. **Mobile-first responsive** - Start with single column, expand on larger screens
3. **Card-based organization** - Group related metrics in cards
4. **Loading states** - Show skeletons while data loads
5. **Error states** - Handle API failures gracefully
6. **Real-time updates** - Consider WebSocket for live dashboards

## Related Documentation

- [03-grid-patterns.md](03-grid-patterns.md) - Grid layouts
- [04b-settings-layout.md](04b-settings-layout.md) - Settings layouts
- [Card Component](../../02-components/layout/card.md)