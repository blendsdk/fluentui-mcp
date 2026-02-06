# Page Structure Patterns

> **File**: 03-patterns/layout/01-page-structure.md
> **FluentUI Version**: 9.x

## Overview

Page structure patterns for FluentUI v9, including app shell layouts, headers, sidebars, and content areas.

## Basic App Shell

```tsx
import { makeStyles, tokens, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  header: {
    height: '48px',
    backgroundColor: tokens.colorBrandBackground,
    display: 'flex',
    alignItems: 'center',
    padding: `0 ${tokens.spacingHorizontalL}`,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  body: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  sidebar: {
    width: '256px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
    overflowY: 'auto',
  },
  main: {
    flex: 1,
    padding: tokens.spacingVerticalL,
    overflowY: 'auto',
  },
});

interface AppShellProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

export const AppShell = ({ header, sidebar, children }: AppShellProps) => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        {header}
      </header>
      <div className={styles.body}>
        {sidebar && (
          <aside className={styles.sidebar}>
            {sidebar}
          </aside>
        )}
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
};
```

## Header Component

```tsx
import {
  makeStyles,
  tokens,
  Button,
  Avatar,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Text,
} from '@fluentui/react-components';
import { NavigationRegular, SearchRegular, SettingsRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  header: {
    height: '48px',
    backgroundColor: tokens.colorBrandBackground,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `0 ${tokens.spacingHorizontalL}`,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  logo: {
    color: tokens.colorNeutralForegroundOnBrand,
    fontWeight: tokens.fontWeightSemibold,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  iconButton: {
    color: tokens.colorNeutralForegroundOnBrand,
  },
});

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
  userName?: string;
}

export const Header = ({ title, onMenuClick, userName }: HeaderProps) => {
  const styles = useStyles();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Button
          appearance="transparent"
          icon={<NavigationRegular />}
          onClick={onMenuClick}
          className={styles.iconButton}
          aria-label="Toggle menu"
        />
        <Text className={styles.logo} size={400}>
          {title}
        </Text>
      </div>

      <div className={styles.right}>
        <Button
          appearance="transparent"
          icon={<SearchRegular />}
          className={styles.iconButton}
          aria-label="Search"
        />
        <Button
          appearance="transparent"
          icon={<SettingsRegular />}
          className={styles.iconButton}
          aria-label="Settings"
        />
        
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button appearance="transparent" className={styles.iconButton}>
              <Avatar name={userName} size={28} />
            </Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Sign out</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>
    </header>
  );
};
```

## Sidebar with Navigation

```tsx
import {
  makeStyles,
  tokens,
  Text,
  mergeClasses,
} from '@fluentui/react-components';
import {
  HomeRegular,
  DocumentRegular,
  PeopleRegular,
  SettingsRegular,
  HomeFilled,
  DocumentFilled,
  PeopleFilled,
  SettingsFilled,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  sidebar: {
    width: '256px',
    backgroundColor: tokens.colorNeutralBackground2,
    padding: tokens.spacingVerticalM,
    display: 'flex',
    flexDirection: 'column',
  },
  navList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    color: tokens.colorNeutralForeground1,
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  navItemActive: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
    color: tokens.colorBrandForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
  section: {
    marginTop: tokens.spacingVerticalL,
  },
  sectionTitle: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    padding: `0 ${tokens.spacingHorizontalM}`,
    marginBottom: tokens.spacingVerticalS,
    textTransform: 'uppercase',
  },
});

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  iconActive: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: <HomeRegular />, iconActive: <HomeFilled />, href: '/' },
  { id: 'docs', label: 'Documents', icon: <DocumentRegular />, iconActive: <DocumentFilled />, href: '/documents' },
  { id: 'people', label: 'People', icon: <PeopleRegular />, iconActive: <PeopleFilled />, href: '/people' },
  { id: 'settings', label: 'Settings', icon: <SettingsRegular />, iconActive: <SettingsFilled />, href: '/settings' },
];

interface SidebarProps {
  activeItem?: string;
  onNavigate?: (item: NavItem) => void;
}

export const Sidebar = ({ activeItem, onNavigate }: SidebarProps) => {
  const styles = useStyles();

  return (
    <nav className={styles.sidebar}>
      <ul className={styles.navList}>
        {navItems.map(item => {
          const isActive = item.id === activeItem;
          return (
            <li key={item.id}>
              <a
                href={item.href}
                className={mergeClasses(
                  styles.navItem,
                  isActive && styles.navItemActive
                )}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate?.(item);
                }}
              >
                {isActive ? item.iconActive : item.icon}
                <span>{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
```

## Collapsible Sidebar

```tsx
import { useState } from 'react';
import {
  makeStyles,
  tokens,
  Button,
  Tooltip,
  mergeClasses,
} from '@fluentui/react-components';
import {
  PanelLeftContractRegular,
  PanelLeftExpandRegular,
  HomeRegular,
  DocumentRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
    transition: 'width 200ms ease',
    overflow: 'hidden',
  },
  expanded: {
    width: '256px',
  },
  collapsed: {
    width: '48px',
  },
  toggle: {
    alignSelf: 'flex-end',
    margin: tokens.spacingVerticalS,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingVerticalS,
    margin: `0 ${tokens.spacingHorizontalS}`,
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  navItemCollapsed: {
    justifyContent: 'center',
    padding: tokens.spacingVerticalM,
  },
  label: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

export const CollapsibleSidebar = () => {
  const styles = useStyles();
  const [isExpanded, setIsExpanded] = useState(true);

  const navItems = [
    { icon: <HomeRegular />, label: 'Home' },
    { icon: <DocumentRegular />, label: 'Documents' },
  ];

  return (
    <aside className={mergeClasses(
      styles.sidebar,
      isExpanded ? styles.expanded : styles.collapsed
    )}>
      <Button
        appearance="subtle"
        icon={isExpanded ? <PanelLeftContractRegular /> : <PanelLeftExpandRegular />}
        onClick={() => setIsExpanded(!isExpanded)}
        className={styles.toggle}
        aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
      />

      {navItems.map((item, index) => (
        <Tooltip
          key={index}
          content={item.label}
          relationship="label"
          positioning="after"
          visible={!isExpanded ? undefined : false}
        >
          <div className={mergeClasses(
            styles.navItem,
            !isExpanded && styles.navItemCollapsed
          )}>
            {item.icon}
            {isExpanded && <span className={styles.label}>{item.label}</span>}
          </div>
        </Tooltip>
      ))}
    </aside>
  );
};
```

## Content Area with Page Header

```tsx
import {
  makeStyles,
  tokens,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
  Button,
} from '@fluentui/react-components';
import { AddRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  pageHeader: {
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalXL}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  breadcrumb: {
    marginBottom: tokens.spacingVerticalS,
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageContent: {
    flex: 1,
    padding: tokens.spacingVerticalL,
    overflowY: 'auto',
  },
});

interface PageProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const Page = ({ title, breadcrumbs, actions, children }: PageProps) => {
  const styles = useStyles();

  return (
    <div className={styles.content}>
      <div className={styles.pageHeader}>
        {breadcrumbs && (
          <Breadcrumb className={styles.breadcrumb}>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <BreadcrumbDivider />}
                <BreadcrumbItem>
                  <BreadcrumbButton href={crumb.href}>
                    {crumb.label}
                  </BreadcrumbButton>
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </Breadcrumb>
        )}
        
        <div className={styles.titleRow}>
          <Text as="h1" size={700} weight="semibold">
            {title}
          </Text>
          {actions}
        </div>
      </div>

      <div className={styles.pageContent}>
        {children}
      </div>
    </div>
  );
};

// Usage
export const DocumentsPage = () => (
  <Page
    title="Documents"
    breadcrumbs={[
      { label: 'Home', href: '/' },
      { label: 'Documents' },
    ]}
    actions={
      <Button appearance="primary" icon={<AddRegular />}>
        New Document
      </Button>
    }
  >
    <p>Page content goes here</p>
  </Page>
);
```

## Full App Shell Example

```tsx
import { useState } from 'react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';

// Import components from above
// import { Header, Sidebar, Page } from './components';

export const App = () => {
  const [activeNav, setActiveNav] = useState('home');

  return (
    <FluentProvider theme={webLightTheme}>
      <AppShell
        header={
          <Header
            title="My App"
            userName="John Doe"
          />
        }
        sidebar={
          <Sidebar
            activeItem={activeNav}
            onNavigate={(item) => setActiveNav(item.id)}
          />
        }
      >
        <Page
          title="Dashboard"
          breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Dashboard' }]}
        >
          {/* Page content */}
        </Page>
      </AppShell>
    </FluentProvider>
  );
};
```

## Related Documentation

- [02-responsive-design.md](02-responsive-design.md) - Responsive patterns
- [Nav Component](../../02-components/navigation/nav.md)
- [Drawer Component](../../02-components/overlays/drawer.md)