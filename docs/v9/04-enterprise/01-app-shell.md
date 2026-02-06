# App Shell Pattern

> **Module**: 04-enterprise
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-06-02

## Overview

The app shell is the outer frame of an enterprise application — header, sidebar navigation, main content area, and optional footer. This pattern uses FluentUI v9 components to build a responsive, accessible shell that supports theming, routing, and responsive behavior.

---

## Architecture

```
┌─────────────────────────────────────────────┐
│  Header (branding, search, user menu)       │
├──────────┬──────────────────────────────────┤
│          │                                  │
│  Sidebar │       Main Content               │
│  (Nav)   │       (Router outlet)            │
│          │                                  │
│          │                                  │
├──────────┴──────────────────────────────────┤
│  Footer (optional)                          │
└─────────────────────────────────────────────┘
```

---

## Complete App Shell

```tsx
import * as React from 'react';
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  makeStyles,
  tokens,
  Divider,
} from '@fluentui/react-components';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
  },
  body: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: tokens.spacingVerticalL,
    backgroundColor: tokens.colorNeutralBackground2,
  },
});

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * AppShell — The outermost layout frame for enterprise applications.
 *
 * Provides: header, collapsible sidebar, scrollable content area.
 * Integrates with React Router for page rendering.
 */
export function AppShell({ children }: AppShellProps) {
  const styles = useStyles();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className={styles.root}>
      <AppHeader onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <Divider appearance="subtle" />
      <div className={styles.body}>
        <AppSidebar open={sidebarOpen} />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

## Header Component

```tsx
import * as React from 'react';
import {
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  SearchBox,
  Avatar,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { NavigationRegular, SettingsRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '48px',
    padding: `0 ${tokens.spacingHorizontalM}`,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  brand: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase400,
    color: tokens.colorBrandForeground1,
  },
  center: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    maxWidth: '480px',
    margin: '0 auto',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
});

interface AppHeaderProps {
  onToggleSidebar: () => void;
}

export function AppHeader({ onToggleSidebar }: AppHeaderProps) {
  const styles = useStyles();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <ToolbarButton
          icon={<NavigationRegular />}
          aria-label="Toggle navigation"
          onClick={onToggleSidebar}
        />
        <Text className={styles.brand}>Contoso</Text>
      </div>

      <div className={styles.center}>
        <SearchBox placeholder="Search..." size="small" style={{ width: '100%' }} />
      </div>

      <div className={styles.right}>
        <ToolbarButton icon={<SettingsRegular />} aria-label="Settings" />
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Avatar name="Jane Doe" color="brand" size={28} />
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
}
```

---

## Sidebar Navigation

```tsx
import * as React from 'react';
import {
  NavDrawer,
  NavDrawerBody,
  NavDrawerHeader,
  NavItem,
  NavCategory,
  NavCategoryItem,
  NavSubItem,
  NavSubItemGroup,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  HomeRegular,
  PeopleRegular,
  DocumentRegular,
  SettingsRegular,
  ChartMultipleRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  nav: {
    height: '100%',
  },
});

interface AppSidebarProps {
  open: boolean;
}

export function AppSidebar({ open }: AppSidebarProps) {
  const styles = useStyles();
  const [selectedValue, setSelectedValue] = React.useState('home');

  return (
    <NavDrawer
      open={open}
      type="inline"
      className={styles.nav}
      selectedValue={selectedValue}
      onNavItemSelect={(e, data) => setSelectedValue(data.value as string)}
    >
      <NavDrawerBody>
        <NavItem icon={<HomeRegular />} value="home">
          Home
        </NavItem>
        <NavItem icon={<ChartMultipleRegular />} value="dashboard">
          Dashboard
        </NavItem>

        <NavCategory value="users">
          <NavCategoryItem icon={<PeopleRegular />}>Users</NavCategoryItem>
          <NavSubItemGroup>
            <NavSubItem value="user-list">All Users</NavSubItem>
            <NavSubItem value="user-roles">Roles</NavSubItem>
            <NavSubItem value="user-groups">Groups</NavSubItem>
          </NavSubItemGroup>
        </NavCategory>

        <NavCategory value="content">
          <NavCategoryItem icon={<DocumentRegular />}>Content</NavCategoryItem>
          <NavSubItemGroup>
            <NavSubItem value="pages">Pages</NavSubItem>
            <NavSubItem value="media">Media</NavSubItem>
          </NavSubItemGroup>
        </NavCategory>

        <NavItem icon={<SettingsRegular />} value="settings">
          Settings
        </NavItem>
      </NavDrawerBody>
    </NavDrawer>
  );
}
```

---

## Router Integration

```tsx
import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { AppShell } from './AppShell';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/UsersPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/users/*" element={<UsersPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </FluentProvider>
  );
}
```

---

## Responsive Behavior

### Collapsing Sidebar on Mobile

```tsx
import * as React from 'react';
import { makeStyles } from '@fluentui/react-components';

const MOBILE_BREAKPOINT = 768;

/**
 * Hook that tracks whether the viewport is mobile-sized.
 */
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState(
    () => typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT,
  );

  React.useEffect(() => {
    const query = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, []);

  return isMobile;
}

// In AppShell:
function AppShell({ children }: AppShellProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);

  // Auto-close sidebar when switching to mobile
  React.useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);

  return (
    <div className={styles.root}>
      <AppHeader onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <div className={styles.body}>
        <AppSidebar
          open={sidebarOpen}
          type={isMobile ? 'overlay' : 'inline'}
          onOpenChange={(open) => setSidebarOpen(open)}
        />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
```

---

## Theme Switching

```tsx
import * as React from 'react';
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  Switch,
} from '@fluentui/react-components';

function ThemedAppShell({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <FluentProvider theme={darkMode ? webDarkTheme : webLightTheme}>
      <AppShell>
        {/* Theme toggle in header or settings */}
        <Switch
          checked={darkMode}
          onChange={(e, data) => setDarkMode(data.checked)}
          label="Dark mode"
        />
        {children}
      </AppShell>
    </FluentProvider>
  );
}
```

---

## Best Practices

### ✅ Do

- **Use `NavDrawer` with `type="inline"`** for desktop, `type="overlay"` for mobile
- **Keep header height fixed** (48px is the FluentUI standard)
- **Use `overflow: auto`** on the main content area, not the body
- **Set `height: 100vh`** on the root to prevent double scrollbars
- **Use design tokens** for all spacing, colors, and typography

### ❌ Don't

- **Don't nest `FluentProvider`** unless you need different themes in different regions
- **Don't put routing logic in the shell** — keep it in the content area
- **Don't hardcode sidebar width** — let `NavDrawer` manage it
- **Don't forget keyboard navigation** — sidebar items must be navigable with Tab/Arrow keys

---

## Related Documentation

- [Dashboard Patterns](02-dashboard.md) — Dashboard content layouts
- [Sidebar Navigation](../03-patterns/navigation/02-sidebar-navigation.md) — NavDrawer patterns
- [Layout Patterns](../03-patterns/layout/00-layout-index.md) — Page structure patterns
- [Responsive Design](../03-patterns/layout/02-responsive-design.md) — Media query patterns
