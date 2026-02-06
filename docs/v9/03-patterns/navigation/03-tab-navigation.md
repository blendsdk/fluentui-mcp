# Tab Navigation Patterns - FluentUI v9

> **Topic**: Tab Navigation
> **Components**: `TabList`, `Tab`
> **Package**: `@fluentui/react-components`

## Overview

Tab navigation allows users to switch between different views or content sections within the same context. Tabs are ideal when you need to organize related content that doesn't need to be viewed simultaneously.

## Basic Imports

```typescript
import {
  TabList,
  Tab,
  makeStyles,
  tokens,
  SelectTabEvent,
  SelectTabData,
} from '@fluentui/react-components';
import {
  DocumentRegular,
  ImageRegular,
  VideoRegular,
  SettingsRegular,
} from '@fluentui/react-icons';
```

## Basic Tab Navigation

```tsx
const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  content: {
    padding: tokens.spacingHorizontalL,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    minHeight: '200px',
  },
});

function BasicTabs() {
  const styles = useStyles();
  const [selectedTab, setSelectedTab] = useState('overview');

  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setSelectedTab(data.value as string);
  };

  return (
    <div className={styles.container}>
      <TabList selectedValue={selectedTab} onTabSelect={onTabSelect}>
        <Tab value="overview">Overview</Tab>
        <Tab value="details">Details</Tab>
        <Tab value="history">History</Tab>
        <Tab value="settings">Settings</Tab>
      </TabList>

      <div className={styles.content}>
        {selectedTab === 'overview' && <OverviewContent />}
        {selectedTab === 'details' && <DetailsContent />}
        {selectedTab === 'history' && <HistoryContent />}
        {selectedTab === 'settings' && <SettingsContent />}
      </div>
    </div>
  );
}
```

## Tabs with Icons

```tsx
function TabsWithIcons() {
  const styles = useStyles();
  const [selectedTab, setSelectedTab] = useState('documents');

  return (
    <div className={styles.container}>
      <TabList
        selectedValue={selectedTab}
        onTabSelect={(_, data) => setSelectedTab(data.value as string)}
      >
        <Tab value="documents" icon={<DocumentRegular />}>
          Documents
        </Tab>
        <Tab value="images" icon={<ImageRegular />}>
          Images
        </Tab>
        <Tab value="videos" icon={<VideoRegular />}>
          Videos
        </Tab>
      </TabList>
    </div>
  );
}
```

## Tab Sizes and Appearances

```tsx
type TabSize = 'small' | 'medium' | 'large';
type TabAppearance = 'transparent' | 'subtle' | 'subtle-circular';

function TabVariants() {
  const [selectedTab, setSelectedTab] = useState('tab1');

  const tabs = [
    { value: 'tab1', label: 'Tab 1' },
    { value: 'tab2', label: 'Tab 2' },
    { value: 'tab3', label: 'Tab 3' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Sizes */}
      <section>
        <h3>Small</h3>
        <TabList
          size="small"
          selectedValue={selectedTab}
          onTabSelect={(_, data) => setSelectedTab(data.value as string)}
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} value={tab.value}>{tab.label}</Tab>
          ))}
        </TabList>
      </section>

      <section>
        <h3>Medium (default)</h3>
        <TabList
          size="medium"
          selectedValue={selectedTab}
          onTabSelect={(_, data) => setSelectedTab(data.value as string)}
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} value={tab.value}>{tab.label}</Tab>
          ))}
        </TabList>
      </section>

      <section>
        <h3>Large</h3>
        <TabList
          size="large"
          selectedValue={selectedTab}
          onTabSelect={(_, data) => setSelectedTab(data.value as string)}
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} value={tab.value}>{tab.label}</Tab>
          ))}
        </TabList>
      </section>

      {/* Appearances */}
      <section>
        <h3>Subtle</h3>
        <TabList
          appearance="subtle"
          selectedValue={selectedTab}
          onTabSelect={(_, data) => setSelectedTab(data.value as string)}
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} value={tab.value}>{tab.label}</Tab>
          ))}
        </TabList>
      </section>
    </div>
  );
}
```

## Vertical Tabs

```tsx
const useVerticalStyles = makeStyles({
  container: {
    display: 'flex',
    gap: tokens.spacingHorizontalL,
  },
  content: {
    flex: 1,
    padding: tokens.spacingHorizontalL,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
  },
});

function VerticalTabs() {
  const styles = useVerticalStyles();
  const [selectedTab, setSelectedTab] = useState('general');

  const tabs = [
    { value: 'general', label: 'General', icon: <SettingsRegular /> },
    { value: 'account', label: 'Account' },
    { value: 'privacy', label: 'Privacy' },
    { value: 'notifications', label: 'Notifications' },
  ];

  return (
    <div className={styles.container}>
      <TabList
        vertical
        selectedValue={selectedTab}
        onTabSelect={(_, data) => setSelectedTab(data.value as string)}
      >
        {tabs.map((tab) => (
          <Tab key={tab.value} value={tab.value} icon={tab.icon}>
            {tab.label}
          </Tab>
        ))}
      </TabList>

      <div className={styles.content}>
        {selectedTab === 'general' && <GeneralSettings />}
        {selectedTab === 'account' && <AccountSettings />}
        {selectedTab === 'privacy' && <PrivacySettings />}
        {selectedTab === 'notifications' && <NotificationSettings />}
      </div>
    </div>
  );
}
```

## Tabs with Badges/Counts

```tsx
import { Badge, CounterBadge } from '@fluentui/react-components';

const useBadgeStyles = makeStyles({
  tabContent: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
});

interface TabWithCount {
  value: string;
  label: string;
  count?: number;
  hasNew?: boolean;
}

function TabsWithBadges() {
  const styles = useBadgeStyles();
  const [selectedTab, setSelectedTab] = useState('inbox');

  const tabs: TabWithCount[] = [
    { value: 'inbox', label: 'Inbox', count: 12 },
    { value: 'sent', label: 'Sent', count: 0 },
    { value: 'drafts', label: 'Drafts', count: 3 },
    { value: 'updates', label: 'Updates', hasNew: true },
  ];

  return (
    <TabList
      selectedValue={selectedTab}
      onTabSelect={(_, data) => setSelectedTab(data.value as string)}
    >
      {tabs.map((tab) => (
        <Tab key={tab.value} value={tab.value}>
          <span className={styles.tabContent}>
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <CounterBadge count={tab.count} size="small" />
            )}
            {tab.hasNew && (
              <Badge size="tiny" color="danger" />
            )}
          </span>
        </Tab>
      ))}
    </TabList>
  );
}
```

## Disabled Tabs

```tsx
interface TabConfig {
  value: string;
  label: string;
  disabled?: boolean;
  disabledReason?: string;
}

function TabsWithDisabled() {
  const [selectedTab, setSelectedTab] = useState('active');

  const tabs: TabConfig[] = [
    { value: 'active', label: 'Active Items' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'archived', label: 'Archived', disabled: true, disabledReason: 'No archived items' },
    { value: 'deleted', label: 'Deleted', disabled: true },
  ];

  return (
    <TabList
      selectedValue={selectedTab}
      onTabSelect={(_, data) => setSelectedTab(data.value as string)}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.value}
          value={tab.value}
          disabled={tab.disabled}
          title={tab.disabled ? tab.disabledReason : undefined}
        >
          {tab.label}
        </Tab>
      ))}
    </TabList>
  );
}
```

## Tabs with Router Integration

```tsx
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

interface RouteTab {
  value: string;
  label: string;
  path: string;
  icon?: React.ReactElement;
}

function RouterTabs({ tabs }: { tabs: RouteTab[] }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Find selected tab based on current path
  const selectedTab = useMemo(() => {
    const matchingTab = tabs.find((tab) => location.pathname === tab.path);
    return matchingTab?.value || tabs[0]?.value;
  }, [tabs, location.pathname]);

  const handleTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    const tab = tabs.find((t) => t.value === data.value);
    if (tab) {
      navigate(tab.path);
    }
  };

  return (
    <div>
      <TabList selectedValue={selectedTab} onTabSelect={handleTabSelect}>
        {tabs.map((tab) => (
          <Tab key={tab.value} value={tab.value} icon={tab.icon}>
            {tab.label}
          </Tab>
        ))}
      </TabList>
      
      {/* Render child routes */}
      <Outlet />
    </div>
  );
}

// Usage in routes
const routeTabs: RouteTab[] = [
  { value: 'overview', label: 'Overview', path: '/product/overview' },
  { value: 'specs', label: 'Specifications', path: '/product/specs' },
  { value: 'reviews', label: 'Reviews', path: '/product/reviews' },
];
```

## Lazy Loading Tab Content

```tsx
import { Suspense, lazy } from 'react';
import { Spinner } from '@fluentui/react-components';

// Lazy load heavy components
const HeavyChart = lazy(() => import('./HeavyChart'));
const DataTable = lazy(() => import('./DataTable'));
const ReportViewer = lazy(() => import('./ReportViewer'));

const useLazyStyles = makeStyles({
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
  },
});

function LazyTabs() {
  const styles = useLazyStyles();
  const [selectedTab, setSelectedTab] = useState('chart');

  const renderContent = () => {
    const LoadingFallback = (
      <div className={styles.loading}>
        <Spinner label="Loading content..." />
      </div>
    );

    switch (selectedTab) {
      case 'chart':
        return (
          <Suspense fallback={LoadingFallback}>
            <HeavyChart />
          </Suspense>
        );
      case 'table':
        return (
          <Suspense fallback={LoadingFallback}>
            <DataTable />
          </Suspense>
        );
      case 'report':
        return (
          <Suspense fallback={LoadingFallback}>
            <ReportViewer />
          </Suspense>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <TabList
        selectedValue={selectedTab}
        onTabSelect={(_, data) => setSelectedTab(data.value as string)}
      >
        <Tab value="chart">Chart View</Tab>
        <Tab value="table">Table View</Tab>
        <Tab value="report">Report</Tab>
      </TabList>
      
      {renderContent()}
    </div>
  );
}
```

## Controlled vs Uncontrolled Tabs

```tsx
// Controlled - you manage the state
function ControlledTabs() {
  const [selectedTab, setSelectedTab] = useState('tab1');

  const handleTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    // You can add validation or side effects here
    if (data.value === 'tab3') {
      // Maybe show a confirmation
      const confirmed = window.confirm('Switch to Tab 3?');
      if (!confirmed) return;
    }
    setSelectedTab(data.value as string);
  };

  return (
    <TabList selectedValue={selectedTab} onTabSelect={handleTabSelect}>
      <Tab value="tab1">Tab 1</Tab>
      <Tab value="tab2">Tab 2</Tab>
      <Tab value="tab3">Tab 3 (Confirm)</Tab>
    </TabList>
  );
}

// Uncontrolled - internal state management
function UncontrolledTabs() {
  return (
    <TabList defaultSelectedValue="tab1">
      <Tab value="tab1">Tab 1</Tab>
      <Tab value="tab2">Tab 2</Tab>
      <Tab value="tab3">Tab 3</Tab>
    </TabList>
  );
}
```

## useTabs Hook

```typescript
import { useState, useCallback, useMemo } from 'react';
import { SelectTabEvent, SelectTabData } from '@fluentui/react-components';

interface TabConfig {
  value: string;
  label: string;
  disabled?: boolean;
}

interface UseTabsOptions {
  defaultValue?: string;
  onChange?: (value: string) => void;
}

interface UseTabsReturn {
  selectedValue: string;
  select: (value: string) => void;
  tabListProps: {
    selectedValue: string;
    onTabSelect: (event: SelectTabEvent, data: SelectTabData) => void;
  };
  isSelected: (value: string) => boolean;
  getTabProps: (tab: TabConfig) => {
    value: string;
    disabled?: boolean;
    'aria-selected': boolean;
  };
}

/**
 * Hook for managing tab state
 */
export function useTabs(
  tabs: TabConfig[],
  options: UseTabsOptions = {}
): UseTabsReturn {
  const { defaultValue, onChange } = options;
  const [selectedValue, setSelectedValue] = useState(
    defaultValue || tabs[0]?.value || ''
  );

  const select = useCallback(
    (value: string) => {
      const tab = tabs.find((t) => t.value === value);
      if (tab && !tab.disabled) {
        setSelectedValue(value);
        onChange?.(value);
      }
    },
    [tabs, onChange]
  );

  const tabListProps = useMemo(
    () => ({
      selectedValue,
      onTabSelect: (_: SelectTabEvent, data: SelectTabData) => {
        select(data.value as string);
      },
    }),
    [selectedValue, select]
  );

  const isSelected = useCallback(
    (value: string) => selectedValue === value,
    [selectedValue]
  );

  const getTabProps = useCallback(
    (tab: TabConfig) => ({
      value: tab.value,
      disabled: tab.disabled,
      'aria-selected': selectedValue === tab.value,
    }),
    [selectedValue]
  );

  return {
    selectedValue,
    select,
    tabListProps,
    isSelected,
    getTabProps,
  };
}

// Usage
function TabsWithHook() {
  const tabs: TabConfig[] = [
    { value: 'overview', label: 'Overview' },
    { value: 'details', label: 'Details' },
    { value: 'disabled', label: 'Disabled', disabled: true },
  ];

  const { selectedValue, tabListProps, isSelected } = useTabs(tabs, {
    defaultValue: 'overview',
    onChange: (value) => console.log('Tab changed:', value),
  });

  return (
    <div>
      <TabList {...tabListProps}>
        {tabs.map((tab) => (
          <Tab key={tab.value} value={tab.value} disabled={tab.disabled}>
            {tab.label}
          </Tab>
        ))}
      </TabList>

      {isSelected('overview') && <OverviewPanel />}
      {isSelected('details') && <DetailsPanel />}
    </div>
  );
}
```

## Animated Tab Indicator

```tsx
const useAnimatedStyles = makeStyles({
  tabList: {
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: '2px',
    backgroundColor: tokens.colorBrandForeground1,
    transition: 'left 0.2s ease, width 0.2s ease',
  },
});

function AnimatedTabs() {
  const styles = useAnimatedStyles();
  const [selectedTab, setSelectedTab] = useState('tab1');
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const selectedEl = tabRefs.current[selectedTab];
    if (selectedEl) {
      setIndicatorStyle({
        left: selectedEl.offsetLeft,
        width: selectedEl.offsetWidth,
      });
    }
  }, [selectedTab]);

  const tabs = [
    { value: 'tab1', label: 'First Tab' },
    { value: 'tab2', label: 'Second Tab' },
    { value: 'tab3', label: 'Third Tab' },
  ];

  return (
    <div className={styles.tabList}>
      <TabList
        selectedValue={selectedTab}
        onTabSelect={(_, data) => setSelectedTab(data.value as string)}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            ref={(el) => (tabRefs.current[tab.value] = el)}
          >
            {tab.label}
          </Tab>
        ))}
      </TabList>
      <div
        className={styles.indicator}
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
        }}
      />
    </div>
  );
}
```

## Tabs with Form State Preservation

```tsx
/**
 * Keeps form state when switching tabs
 * Important: Renders all panels but hides non-selected ones
 */
function TabsWithStatePreservation() {
  const styles = useStyles();
  const [selectedTab, setSelectedTab] = useState('personal');

  // Form states are preserved because components stay mounted
  return (
    <div className={styles.container}>
      <TabList
        selectedValue={selectedTab}
        onTabSelect={(_, data) => setSelectedTab(data.value as string)}
      >
        <Tab value="personal">Personal Info</Tab>
        <Tab value="contact">Contact Info</Tab>
        <Tab value="preferences">Preferences</Tab>
      </TabList>

      {/* Render all panels, hide non-selected */}
      <div style={{ display: selectedTab === 'personal' ? 'block' : 'none' }}>
        <PersonalInfoForm />
      </div>
      <div style={{ display: selectedTab === 'contact' ? 'block' : 'none' }}>
        <ContactInfoForm />
      </div>
      <div style={{ display: selectedTab === 'preferences' ? 'block' : 'none' }}>
        <PreferencesForm />
      </div>
    </div>
  );
}
```

## Accessibility Checklist

- [x] TabList uses proper `role="tablist"`
- [x] Each Tab uses `role="tab"`
- [x] Tab panels use `role="tabpanel"` and `aria-labelledby`
- [x] Arrow keys navigate between tabs
- [x] Enter/Space activates tabs
- [x] Focus is visible and clear
- [x] Selected tab is announced to screen readers

## Best Practices

1. **Meaningful Labels**: Use clear, descriptive tab labels
2. **Limit Tab Count**: 5-7 tabs maximum to avoid overwhelming users
3. **Consistent Order**: Keep tab order consistent across sessions
4. **Visual Feedback**: Clear indication of selected state
5. **Keyboard Support**: Full keyboard navigation
6. **Don't Use for Primary Navigation**: Use for content within a page
7. **Preserve State**: Consider keeping form state when switching tabs

## Related Documentation

- [01-breadcrumb-patterns.md](01-breadcrumb-patterns.md) - Location indication
- [02-sidebar-navigation.md](02-sidebar-navigation.md) - Main app navigation
- [04-menu-navigation.md](04-menu-navigation.md) - Contextual menus