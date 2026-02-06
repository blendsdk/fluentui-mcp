# Tabs

> **Package**: `@fluentui/react-tabs`
> **Import**: `import { TabList, Tab } from '@fluentui/react-components'`
> **Category**: Navigation

## Overview

Tabs organize content into separate views where only one view is visible at a time. Users can switch between tabs to see different content without leaving the page.

---

## Basic Usage

```typescript
import * as React from 'react';
import { TabList, Tab } from '@fluentui/react-components';

export const BasicTabs: React.FC = () => (
  <TabList>
    <Tab value="tab1">First Tab</Tab>
    <Tab value="tab2">Second Tab</Tab>
    <Tab value="tab3">Third Tab</Tab>
  </TabList>
);
```

---

## Component Structure

| Component | Purpose |
|-----------|---------|
| `TabList` | Container for tabs, manages selection state |
| `Tab` | Individual tab button |

---

## TabList Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectedValue` | `TabValue` | - | Controlled selected tab |
| `defaultSelectedValue` | `TabValue` | - | Initial selected tab |
| `onTabSelect` | `(ev, data) => void` | - | Selection change handler |
| `appearance` | `'transparent' \| 'subtle'` | `'transparent'` | Visual style |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of tabs |
| `vertical` | `boolean` | `false` | Vertical orientation |
| `disabled` | `boolean` | `false` | Disable all tabs |
| `reserveSelectedTabSpace` | `boolean` | `true` | Reserve space for selection indicator |

## Tab Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `TabValue` | required | Unique value for the tab |
| `disabled` | `boolean` | `false` | Disabled state |
| `icon` | `Slot<'span'>` | - | Tab icon |
| `content` | `Slot<'span'>` | - | Tab content wrapper |

---

## Controlled vs Uncontrolled

### Uncontrolled

```typescript
import * as React from 'react';
import { TabList, Tab } from '@fluentui/react-components';

export const UncontrolledTabs: React.FC = () => (
  <TabList defaultSelectedValue="tab1">
    <Tab value="tab1">Overview</Tab>
    <Tab value="tab2">Settings</Tab>
    <Tab value="tab3">Activity</Tab>
  </TabList>
);
```

### Controlled

```typescript
import * as React from 'react';
import {
  TabList,
  Tab,
  makeStyles,
  tokens,
  Text,
} from '@fluentui/react-components';
import type { SelectTabData, SelectTabEvent, TabValue } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  panels: {
    padding: tokens.spacingHorizontalL,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
  },
});

export const ControlledTabs: React.FC = () => {
  const styles = useStyles();
  const [selectedValue, setSelectedValue] = React.useState<TabValue>('tab1');

  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value);
  };

  return (
    <div className={styles.container}>
      <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
        <Tab value="tab1">Overview</Tab>
        <Tab value="tab2">Settings</Tab>
        <Tab value="tab3">Activity</Tab>
      </TabList>

      <div className={styles.panels}>
        {selectedValue === 'tab1' && <Text>Overview content</Text>}
        {selectedValue === 'tab2' && <Text>Settings content</Text>}
        {selectedValue === 'tab3' && <Text>Activity content</Text>}
      </div>
    </div>
  );
};
```

---

## Appearance Variants

### Transparent (Default)

```typescript
import * as React from 'react';
import { TabList, Tab } from '@fluentui/react-components';

export const TransparentTabs: React.FC = () => (
  <TabList appearance="transparent">
    <Tab value="1">Tab One</Tab>
    <Tab value="2">Tab Two</Tab>
    <Tab value="3">Tab Three</Tab>
  </TabList>
);
```

### Subtle

```typescript
import * as React from 'react';
import { TabList, Tab } from '@fluentui/react-components';

export const SubtleTabs: React.FC = () => (
  <TabList appearance="subtle">
    <Tab value="1">Tab One</Tab>
    <Tab value="2">Tab Two</Tab>
    <Tab value="3">Tab Three</Tab>
  </TabList>
);
```

---

## Size Variants

```typescript
import * as React from 'react';
import { TabList, Tab, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
});

export const TabSizes: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <TabList size="small" defaultSelectedValue="1">
        <Tab value="1">Small</Tab>
        <Tab value="2">Tabs</Tab>
        <Tab value="3">Here</Tab>
      </TabList>

      <TabList size="medium" defaultSelectedValue="1">
        <Tab value="1">Medium</Tab>
        <Tab value="2">Tabs</Tab>
        <Tab value="3">Here</Tab>
      </TabList>

      <TabList size="large" defaultSelectedValue="1">
        <Tab value="1">Large</Tab>
        <Tab value="2">Tabs</Tab>
        <Tab value="3">Here</Tab>
      </TabList>
    </div>
  );
};
```

---

## Vertical Tabs

```typescript
import * as React from 'react';
import {
  TabList,
  Tab,
  makeStyles,
  tokens,
  Text,
} from '@fluentui/react-components';
import type { SelectTabData, SelectTabEvent, TabValue } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: tokens.spacingHorizontalL,
  },
  panel: {
    flex: 1,
    padding: tokens.spacingHorizontalL,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
  },
});

export const VerticalTabs: React.FC = () => {
  const styles = useStyles();
  const [selectedValue, setSelectedValue] = React.useState<TabValue>('overview');

  const onTabSelect = (_: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value);
  };

  return (
    <div className={styles.container}>
      <TabList vertical selectedValue={selectedValue} onTabSelect={onTabSelect}>
        <Tab value="overview">Overview</Tab>
        <Tab value="files">Files</Tab>
        <Tab value="settings">Settings</Tab>
        <Tab value="logs">Logs</Tab>
      </TabList>

      <div className={styles.panel}>
        {selectedValue === 'overview' && <Text>Overview panel content</Text>}
        {selectedValue === 'files' && <Text>Files panel content</Text>}
        {selectedValue === 'settings' && <Text>Settings panel content</Text>}
        {selectedValue === 'logs' && <Text>Logs panel content</Text>}
      </div>
    </div>
  );
};
```

---

## With Icons

```typescript
import * as React from 'react';
import { TabList, Tab, makeStyles, tokens } from '@fluentui/react-components';
import {
  HomeRegular,
  DocumentRegular,
  SettingsRegular,
  PersonRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
});

export const TabsWithIcons: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      {/* Icon before text */}
      <TabList defaultSelectedValue="home">
        <Tab icon={<HomeRegular />} value="home">Home</Tab>
        <Tab icon={<DocumentRegular />} value="docs">Documents</Tab>
        <Tab icon={<SettingsRegular />} value="settings">Settings</Tab>
        <Tab icon={<PersonRegular />} value="profile">Profile</Tab>
      </TabList>

      {/* Icon only */}
      <TabList defaultSelectedValue="home">
        <Tab icon={<HomeRegular />} value="home" aria-label="Home" />
        <Tab icon={<DocumentRegular />} value="docs" aria-label="Documents" />
        <Tab icon={<SettingsRegular />} value="settings" aria-label="Settings" />
        <Tab icon={<PersonRegular />} value="profile" aria-label="Profile" />
      </TabList>
    </div>
  );
};
```

---

## Disabled Tabs

```typescript
import * as React from 'react';
import { TabList, Tab, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
});

export const DisabledTabs: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      {/* Individual disabled tab */}
      <TabList defaultSelectedValue="1">
        <Tab value="1">Active Tab</Tab>
        <Tab value="2" disabled>Disabled Tab</Tab>
        <Tab value="3">Another Active Tab</Tab>
      </TabList>

      {/* All tabs disabled */}
      <TabList disabled defaultSelectedValue="1">
        <Tab value="1">Tab 1</Tab>
        <Tab value="2">Tab 2</Tab>
        <Tab value="3">Tab 3</Tab>
      </TabList>
    </div>
  );
};
```

---

## Common Use Cases

### Settings Page Tabs

```typescript
import * as React from 'react';
import {
  TabList,
  Tab,
  Card,
  CardHeader,
  Text,
  Input,
  Field,
  Switch,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import type { SelectTabData, SelectTabEvent, TabValue } from '@fluentui/react-components';
import {
  PersonRegular,
  ShieldRegular,
  BellRegular,
  PaintBrushRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    maxWidth: '600px',
  },
  tabs: {
    marginBottom: tokens.spacingVerticalL,
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
});

export const SettingsPageTabs: React.FC = () => {
  const styles = useStyles();
  const [selectedValue, setSelectedValue] = React.useState<TabValue>('profile');

  const onTabSelect = (_: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value);
  };

  return (
    <Card className={styles.container}>
      <CardHeader header={<Text weight="semibold" size={500}>Settings</Text>} />
      
      <TabList
        className={styles.tabs}
        selectedValue={selectedValue}
        onTabSelect={onTabSelect}
      >
        <Tab icon={<PersonRegular />} value="profile">Profile</Tab>
        <Tab icon={<ShieldRegular />} value="security">Security</Tab>
        <Tab icon={<BellRegular />} value="notifications">Notifications</Tab>
        <Tab icon={<PaintBrushRegular />} value="appearance">Appearance</Tab>
      </TabList>

      <div className={styles.panel}>
        {selectedValue === 'profile' && (
          <>
            <Field label="Display Name">
              <Input defaultValue="John Doe" />
            </Field>
            <Field label="Email">
              <Input defaultValue="john@example.com" type="email" />
            </Field>
          </>
        )}
        {selectedValue === 'security' && (
          <>
            <Switch label="Two-factor authentication" />
            <Switch label="Login notifications" defaultChecked />
          </>
        )}
        {selectedValue === 'notifications' && (
          <>
            <Switch label="Email notifications" defaultChecked />
            <Switch label="Push notifications" defaultChecked />
            <Switch label="Marketing emails" />
          </>
        )}
        {selectedValue === 'appearance' && (
          <>
            <Switch label="Dark mode" />
            <Switch label="Compact view" />
          </>
        )}
      </div>
    </Card>
  );
};
```

### Dashboard Tabs

```typescript
import * as React from 'react';
import {
  TabList,
  Tab,
  Text,
  Badge,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import type { SelectTabData, SelectTabEvent, TabValue } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  tabContent: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
  },
  panel: {
    padding: tokens.spacingHorizontalL,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    minHeight: '200px',
  },
});

export const DashboardTabs: React.FC = () => {
  const styles = useStyles();
  const [selectedValue, setSelectedValue] = React.useState<TabValue>('all');

  const onTabSelect = (_: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value);
  };

  return (
    <div className={styles.container}>
      <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
        <Tab value="all">
          <span className={styles.tabContent}>
            All Tasks
            <Badge appearance="filled">24</Badge>
          </span>
        </Tab>
        <Tab value="pending">
          <span className={styles.tabContent}>
            Pending
            <Badge appearance="filled" color="warning">8</Badge>
          </span>
        </Tab>
        <Tab value="completed">
          <span className={styles.tabContent}>
            Completed
            <Badge appearance="filled" color="success">16</Badge>
          </span>
        </Tab>
        <Tab value="overdue">
          <span className={styles.tabContent}>
            Overdue
            <Badge appearance="filled" color="danger">3</Badge>
          </span>
        </Tab>
      </TabList>

      <div className={styles.panel}>
        {selectedValue === 'all' && <Text>Showing all 24 tasks</Text>}
        {selectedValue === 'pending' && <Text>Showing 8 pending tasks</Text>}
        {selectedValue === 'completed' && <Text>Showing 16 completed tasks</Text>}
        {selectedValue === 'overdue' && <Text>Showing 3 overdue tasks</Text>}
      </div>
    </div>
  );
};
```

---

## Accessibility

### Keyboard Support

| Key | Action |
|-----|--------|
| `Tab` | Move focus to/from TabList |
| `Arrow Left/Right` | Move between tabs (horizontal) |
| `Arrow Up/Down` | Move between tabs (vertical) |
| `Home` | Move to first tab |
| `End` | Move to last tab |
| `Enter` / `Space` | Select focused tab |

### ARIA Attributes

| Element | Attribute | Value |
|---------|-----------|-------|
| TabList | `role` | `tablist` |
| Tab | `role` | `tab` |
| Tab | `aria-selected` | `true/false` |
| Tab | `aria-controls` | Panel ID |
| Panel | `role` | `tabpanel` |
| Panel | `aria-labelledby` | Tab ID |

### Proper Tab Panel Association

```typescript
import * as React from 'react';
import { TabList, Tab, makeStyles, tokens } from '@fluentui/react-components';
import type { SelectTabData, SelectTabEvent, TabValue } from '@fluentui/react-components';

const useStyles = makeStyles({
  panel: {
    padding: tokens.spacingHorizontalL,
  },
});

export const AccessibleTabs: React.FC = () => {
  const styles = useStyles();
  const [selectedValue, setSelectedValue] = React.useState<TabValue>('tab1');

  const onTabSelect = (_: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value);
  };

  return (
    <div>
      <TabList
        selectedValue={selectedValue}
        onTabSelect={onTabSelect}
        aria-label="Main navigation tabs"
      >
        <Tab id="tab1" value="tab1" aria-controls="panel1">First</Tab>
        <Tab id="tab2" value="tab2" aria-controls="panel2">Second</Tab>
        <Tab id="tab3" value="tab3" aria-controls="panel3">Third</Tab>
      </TabList>

      <div
        id="panel1"
        role="tabpanel"
        aria-labelledby="tab1"
        hidden={selectedValue !== 'tab1'}
        className={styles.panel}
      >
        First tab content
      </div>
      <div
        id="panel2"
        role="tabpanel"
        aria-labelledby="tab2"
        hidden={selectedValue !== 'tab2'}
        className={styles.panel}
      >
        Second tab content
      </div>
      <div
        id="panel3"
        role="tabpanel"
        aria-labelledby="tab3"
        hidden={selectedValue !== 'tab3'}
        className={styles.panel}
      >
        Third tab content
      </div>
    </div>
  );
};
```

---

## Styling Customization

```typescript
import * as React from 'react';
import {
  TabList,
  Tab,
  makeStyles,
  tokens,
  tabClassNames,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  customTabList: {
    borderBottom: `2px solid ${tokens.colorNeutralStroke2}`,
  },
  customTab: {
    [`& .${tabClassNames.content}`]: {
      fontWeight: tokens.fontWeightSemibold,
    },
    '&[aria-selected="true"]': {
      color: tokens.colorBrandForeground1,
    },
  },
});

export const CustomStyledTabs: React.FC = () => {
  const styles = useStyles();

  return (
    <TabList className={styles.customTabList} defaultSelectedValue="1">
      <Tab className={styles.customTab} value="1">Custom Tab 1</Tab>
      <Tab className={styles.customTab} value="2">Custom Tab 2</Tab>
      <Tab className={styles.customTab} value="3">Custom Tab 3</Tab>
    </TabList>
  );
};
```

---

## Best Practices

### ✅ Do's

```typescript
// ✅ Use controlled state for complex scenarios
const [selectedValue, setSelectedValue] = React.useState<TabValue>('tab1');

// ✅ Provide unique values for each tab
<Tab value="unique-id-1">Tab 1</Tab>

// ✅ Use icons with labels or aria-label
<Tab icon={<HomeRegular />} value="home">Home</Tab>
<Tab icon={<HomeRegular />} value="home" aria-label="Home" />

// ✅ Associate panels with tabs for accessibility
<Tab id="tab1" aria-controls="panel1" value="tab1">Tab</Tab>
<div id="panel1" role="tabpanel" aria-labelledby="tab1">Content</div>

// ✅ Use vertical tabs for many items
<TabList vertical>
  {/* Many tabs */}
</TabList>
```

### ❌ Don'ts

```typescript
// ❌ Don't use tabs for navigation between pages (use Nav or Breadcrumb)
<Tab onClick={() => navigate('/page')}>Navigate</Tab>

// ❌ Don't use duplicate values
<Tab value="1">Tab</Tab>
<Tab value="1">Another Tab</Tab> // Duplicate value!

// ❌ Don't use icon-only tabs without aria-label
<Tab icon={<HomeRegular />} value="home" /> // Missing aria-label
```

---

## See Also

- [Menu](menu.md) - Dropdown menu
- [Nav](nav.md) - Side navigation
- [Breadcrumb](breadcrumb.md) - Breadcrumb navigation
- [Component Index](../00-component-index.md) - All components