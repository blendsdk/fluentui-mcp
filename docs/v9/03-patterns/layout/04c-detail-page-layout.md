# Detail Page Layout Pattern

> **File**: 03-patterns/layout/04c-detail-page-layout.md
> **FluentUI Version**: 9.x

## Overview

Detail page layouts for displaying comprehensive information about a single entity (user profile, product detail, document viewer, etc.). These patterns include headers, tabbed content, sidebars, and related items.

## Basic Detail Layout

```tsx
import { makeStyles, tokens, Text, Button } from '@fluentui/react-components';
import { ArrowLeftRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: tokens.spacingVerticalL,
  },
  backButton: {
    marginBottom: tokens.spacingVerticalM,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    marginBottom: tokens.spacingVerticalXL,
    
    '@media (min-width: 768px)': {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
  },
  titleGroup: {
    flex: 1,
  },
  title: {
    marginBottom: tokens.spacingVerticalXS,
  },
  subtitle: {
    color: tokens.colorNeutralForeground3,
  },
  actions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    flexShrink: 0,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
});

interface DetailLayoutProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const DetailLayout = ({
  title,
  subtitle,
  onBack,
  actions,
  children,
}: DetailLayoutProps) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      {onBack && (
        <Button
          appearance="subtle"
          icon={<ArrowLeftRegular />}
          className={styles.backButton}
          onClick={onBack}
        >
          Back
        </Button>
      )}
      
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <Text as="h1" size={800} weight="semibold" className={styles.title}>
            {title}
          </Text>
          {subtitle && (
            <Text className={styles.subtitle} size={400}>
              {subtitle}
            </Text>
          )}
        </div>
        
        {actions && (
          <div className={styles.actions}>
            {actions}
          </div>
        )}
      </header>
      
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};
```

## Detail Page with Sidebar

```tsx
import { makeStyles, tokens, Card, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    
    '@media (min-width: 1024px)': {
      flexDirection: 'row',
    },
  },
  main: {
    flex: 1,
    minWidth: 0,
  },
  sidebar: {
    width: '100%',
    
    '@media (min-width: 1024px)': {
      width: '320px',
      flexShrink: 0,
    },
  },
  sidebarCard: {
    padding: tokens.spacingVerticalL,
    position: 'sticky',
    top: tokens.spacingVerticalL,
  },
});

interface DetailWithSidebarProps {
  main: React.ReactNode;
  sidebar: React.ReactNode;
}

export const DetailWithSidebar = ({ main, sidebar }: DetailWithSidebarProps) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {main}
      </main>
      <aside className={styles.sidebar}>
        <Card className={styles.sidebarCard}>
          {sidebar}
        </Card>
      </aside>
    </div>
  );
};
```

## Detail Header with Image

```tsx
import { makeStyles, tokens, Text, Avatar, Badge, Button } from '@fluentui/react-components';
import { EditRegular, ShareRegular, MoreHorizontalRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalL,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusLarge,
    marginBottom: tokens.spacingVerticalL,
    
    '@media (min-width: 640px)': {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
  image: {
    width: '120px',
    height: '120px',
    borderRadius: tokens.borderRadiusMedium,
    objectFit: 'cover',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
    marginBottom: tokens.spacingVerticalXS,
  },
  meta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalM,
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
  actions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    flexShrink: 0,
  },
});

interface DetailHeaderProps {
  image?: string;
  title: string;
  badges?: Array<{ label: string; color?: 'brand' | 'danger' | 'important' | 'informative' | 'severe' | 'subtle' | 'success' | 'warning' }>;
  meta?: Array<{ label: string; icon?: React.ReactNode }>;
  actions?: React.ReactNode;
}

export const DetailHeader = ({
  image,
  title,
  badges,
  meta,
  actions,
}: DetailHeaderProps) => {
  const styles = useStyles();

  return (
    <header className={styles.header}>
      {image ? (
        <img src={image} alt={title} className={styles.image} />
      ) : (
        <Avatar name={title} size={120} />
      )}
      
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <Text as="h1" size={700} weight="semibold">
            {title}
          </Text>
          {badges?.map((badge, index) => (
            <Badge key={index} appearance="filled" color={badge.color}>
              {badge.label}
            </Badge>
          ))}
        </div>
        
        {meta && (
          <div className={styles.meta}>
            {meta.map((item, index) => (
              <span key={index} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {item.icon}
                {item.label}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {actions && (
        <div className={styles.actions}>
          {actions}
        </div>
      )}
    </header>
  );
};
```

## Tabbed Detail Content

```tsx
import { useState } from 'react';
import { makeStyles, tokens, Tab, TabList, Card } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  tabList: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  content: {
    padding: tokens.spacingVerticalM,
  },
});

interface TabConfig {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface TabbedDetailProps {
  tabs: TabConfig[];
  defaultTab?: string;
}

export const TabbedDetail = ({ tabs, defaultTab }: TabbedDetailProps) => {
  const styles = useStyles();
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <div className={styles.container}>
      <TabList
        className={styles.tabList}
        selectedValue={activeTab}
        onTabSelect={(_, data) => setActiveTab(data.value as string)}
      >
        {tabs.map(tab => (
          <Tab key={tab.id} value={tab.id} icon={tab.icon}>
            {tab.label}
          </Tab>
        ))}
      </TabList>
      
      <div className={styles.content}>
        {currentTab?.content}
      </div>
    </div>
  );
};
```

## Info Section Component

```tsx
import { makeStyles, tokens, Text, Card } from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingVerticalL,
    marginBottom: tokens.spacingVerticalL,
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
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: tokens.spacingVerticalM,
    
    '@media (min-width: 640px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
  },
  label: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
  value: {
    fontWeight: tokens.fontWeightRegular,
  },
});

interface InfoField {
  label: string;
  value: React.ReactNode;
}

interface InfoSectionProps {
  title: string;
  fields: InfoField[];
  action?: React.ReactNode;
}

export const InfoSection = ({ title, fields, action }: InfoSectionProps) => {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <header className={styles.header}>
        <Text className={styles.title} size={500}>
          {title}
        </Text>
        {action}
      </header>
      
      <div className={styles.grid}>
        {fields.map((field, index) => (
          <div key={index} className={styles.field}>
            <Text className={styles.label}>{field.label}</Text>
            <Text className={styles.value}>{field.value}</Text>
          </div>
        ))}
      </div>
    </Card>
  );
};
```

## Related Items List

```tsx
import { makeStyles, tokens, Card, Text, Avatar, Button } from '@fluentui/react-components';
import { ChevronRightRegular } from '@fluentui/react-icons';

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
    gap: tokens.spacingVerticalXS,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingVerticalS,
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  itemContent: {
    flex: 1,
    minWidth: 0,
  },
  itemTitle: {
    fontWeight: tokens.fontWeightSemibold,
  },
  itemMeta: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
});

interface RelatedItem {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
}

interface RelatedItemsProps {
  title: string;
  items: RelatedItem[];
  onViewAll?: () => void;
  onItemClick?: (item: RelatedItem) => void;
}

export const RelatedItems = ({
  title,
  items,
  onViewAll,
  onItemClick,
}: RelatedItemsProps) => {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <header className={styles.header}>
        <Text weight="semibold" size={500}>{title}</Text>
        {onViewAll && (
          <Button appearance="subtle" size="small" onClick={onViewAll}>
            View all
          </Button>
        )}
      </header>
      
      <div className={styles.list}>
        {items.map(item => (
          <div
            key={item.id}
            className={styles.item}
            onClick={() => onItemClick?.(item)}
          >
            <Avatar name={item.title} image={{ src: item.image }} size={40} />
            <div className={styles.itemContent}>
              <Text className={styles.itemTitle}>{item.title}</Text>
              {item.subtitle && (
                <Text className={styles.itemMeta}>{item.subtitle}</Text>
              )}
            </div>
            <ChevronRightRegular />
          </div>
        ))}
      </div>
    </Card>
  );
};
```

## Complete Detail Page Example

```tsx
import {
  FluentProvider,
  webLightTheme,
  Button,
  Text,
} from '@fluentui/react-components';
import {
  EditRegular,
  ShareRegular,
  DeleteRegular,
  CalendarRegular,
  LocationRegular,
  PersonRegular,
} from '@fluentui/react-icons';

// Import components from above
// import { DetailLayout, DetailWithSidebar, DetailHeader, TabbedDetail, InfoSection, RelatedItems } from './components';

export const ProductDetailPage = () => {
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <>
          <InfoSection
            title="Product Information"
            fields={[
              { label: 'SKU', value: 'PRD-12345' },
              { label: 'Category', value: 'Electronics' },
              { label: 'Brand', value: 'TechCorp' },
              { label: 'Weight', value: '1.5 kg' },
            ]}
            action={<Button appearance="subtle" icon={<EditRegular />}>Edit</Button>}
          />
          
          <InfoSection
            title="Pricing"
            fields={[
              { label: 'Base Price', value: '$299.99' },
              { label: 'Sale Price', value: '$249.99' },
              { label: 'Cost', value: '$150.00' },
              { label: 'Margin', value: '40%' },
            ]}
          />
        </>
      ),
    },
    {
      id: 'inventory',
      label: 'Inventory',
      content: <Text>Inventory content...</Text>,
    },
    {
      id: 'reviews',
      label: 'Reviews',
      content: <Text>Reviews content...</Text>,
    },
  ];

  const sidebar = (
    <>
      <Text weight="semibold" size={400} block style={{ marginBottom: tokens.spacingVerticalM }}>
        Quick Stats
      </Text>
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text>Total Sales</Text>
          <Text weight="semibold">1,234</Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text>Revenue</Text>
          <Text weight="semibold">$45,678</Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text>Stock</Text>
          <Text weight="semibold">89 units</Text>
        </div>
      </div>
      
      <div style={{ marginTop: tokens.spacingVerticalL }}>
        <RelatedItems
          title="Related Products"
          items={[
            { id: '1', title: 'Product A', subtitle: '$199.99' },
            { id: '2', title: 'Product B', subtitle: '$299.99' },
          ]}
        />
      </div>
    </>
  );

  return (
    <FluentProvider theme={webLightTheme}>
      <DetailLayout
        title="Premium Wireless Headphones"
        subtitle="High-quality audio experience"
        onBack={() => history.back()}
        actions={
          <>
            <Button icon={<ShareRegular />}>Share</Button>
            <Button appearance="primary" icon={<EditRegular />}>Edit</Button>
          </>
        }
      >
        <DetailHeader
          image="https://via.placeholder.com/120"
          title="Premium Wireless Headphones"
          badges={[
            { label: 'Active', color: 'success' },
            { label: 'Featured', color: 'brand' },
          ]}
          meta={[
            { icon: <CalendarRegular />, label: 'Added Jan 15, 2024' },
            { icon: <PersonRegular />, label: 'By John Doe' },
          ]}
        />
        
        <DetailWithSidebar
          main={<TabbedDetail tabs={tabs} />}
          sidebar={sidebar}
        />
      </DetailLayout>
    </FluentProvider>
  );
};
```

## Best Practices

1. **Clear hierarchy** - Use visual hierarchy to guide attention
2. **Scannable content** - Organize info into logical sections
3. **Quick actions** - Put common actions in the header
4. **Back navigation** - Always provide a way to go back
5. **Responsive design** - Stack sidebar below content on mobile
6. **Loading states** - Show skeletons while data loads
7. **Empty states** - Handle missing data gracefully

## Related Documentation

- [04a-dashboard-layout.md](04a-dashboard-layout.md) - Dashboard layouts
- [04b-settings-layout.md](04b-settings-layout.md) - Settings layouts
- [Tabs Component](../../02-components/navigation/tabs.md)
- [Card Component](../../02-components/layout/card.md)