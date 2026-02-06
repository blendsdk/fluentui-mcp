# Sidebar Navigation Patterns - FluentUI v9

> **Topic**: Sidebar Navigation
> **Components**: `Nav`, `NavCategory`, `NavItem`, `NavDrawer`, etc.
> **Package**: `@fluentui/react-components`

## Overview

Sidebar navigation is the primary navigation pattern for applications with multiple sections. FluentUI v9 provides the Nav component family and NavDrawer for flexible sidebar implementations.

## Basic Imports

```typescript
import {
  Nav,
  NavCategory,
  NavCategoryItem,
  NavItem,
  NavSubItem,
  NavSubItemGroup,
  NavDrawer,
  NavDrawerBody,
  NavDrawerHeader,
  NavDrawerHeaderNav,
  NavSectionHeader,
  NavDivider,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  HomeRegular,
  DocumentRegular,
  SettingsRegular,
  PersonRegular,
  FolderRegular,
  ChartMultipleRegular,
} from '@fluentui/react-icons';
```

## Basic Sidebar Navigation

```tsx
const useStyles = makeStyles({
  sidebar: {
    width: '280px',
    height: '100vh',
    borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  nav: {
    padding: tokens.spacingVerticalM,
  },
});

interface NavItemConfig {
  id: string;
  label: string;
  icon?: React.ReactElement;
  href?: string;
}

function BasicSidebar() {
  const styles = useStyles();
  const [selectedValue, setSelectedValue] = useState('home');

  const items: NavItemConfig[] = [
    { id: 'home', label: 'Home', icon: <HomeRegular /> },
    { id: 'documents', label: 'Documents', icon: <DocumentRegular /> },
    { id: 'reports', label: 'Reports', icon: <ChartMultipleRegular /> },
    { id: 'settings', label: 'Settings', icon: <SettingsRegular /> },
  ];

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav} aria-label="Main navigation">
        <Nav
          selectedValue={selectedValue}
          onNavItemSelect={(_, data) => setSelectedValue(data.value as string)}
        >
          {items.map((item) => (
            <NavItem key={item.id} value={item.id} icon={item.icon}>
              {item.label}
            </NavItem>
          ))}
        </Nav>
      </nav>
    </aside>
  );
}
```

## Hierarchical Navigation

```tsx
interface NavCategoryConfig {
  id: string;
  label: string;
  icon?: React.ReactElement;
  items: NavItemConfig[];
}

const useHierarchicalStyles = makeStyles({
  sidebar: {
    width: '280px',
    height: '100vh',
    borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
    overflowY: 'auto',
  },
});

function HierarchicalSidebar() {
  const styles = useHierarchicalStyles();
  const [selectedValue, setSelectedValue] = useState<string | undefined>();

  const categories: NavCategoryConfig[] = [
    {
      id: 'documents',
      label: 'Documents',
      icon: <FolderRegular />,
      items: [
        { id: 'recent', label: 'Recent' },
        { id: 'shared', label: 'Shared with me' },
        { id: 'favorites', label: 'Favorites' },
      ],
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <ChartMultipleRegular />,
      items: [
        { id: 'sales', label: 'Sales Reports' },
        { id: 'analytics', label: 'Analytics' },
        { id: 'exports', label: 'Exports' },
      ],
    },
  ];

  return (
    <aside className={styles.sidebar}>
      <Nav
        selectedValue={selectedValue}
        onNavItemSelect={(_, data) => setSelectedValue(data.value as string)}
      >
        {/* Top-level items */}
        <NavItem value="home" icon={<HomeRegular />}>
          Home
        </NavItem>

        {/* Categories with sub-items */}
        {categories.map((category) => (
          <NavCategory key={category.id} value={category.id}>
            <NavCategoryItem icon={category.icon}>
              {category.label}
            </NavCategoryItem>
            {category.items.map((item) => (
              <NavSubItem key={item.id} value={item.id}>
                {item.label}
              </NavSubItem>
            ))}
          </NavCategory>
        ))}

        {/* Bottom items */}
        <NavDivider />
        <NavItem value="settings" icon={<SettingsRegular />}>
          Settings
        </NavItem>
      </Nav>
    </aside>
  );
}
```

## NavDrawer - Collapsible Sidebar

```tsx
import { Hamburger } from '@fluentui/react-nav-preview';

const useDrawerStyles = makeStyles({
  root: {
    display: 'flex',
    height: '100vh',
  },
  content: {
    flex: 1,
    padding: tokens.spacingHorizontalL,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingVerticalM,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  logo: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase400,
  },
});

function CollapsibleSidebar() {
  const styles = useDrawerStyles();
  const [isOpen, setIsOpen] = useState(true);
  const [selectedValue, setSelectedValue] = useState('home');

  return (
    <div className={styles.root}>
      <NavDrawer
        open={isOpen}
        type="inline"
        size="medium"
      >
        <NavDrawerHeader>
          <NavDrawerHeaderNav>
            <Hamburger onClick={() => setIsOpen(!isOpen)} />
            <span className={styles.logo}>My App</span>
          </NavDrawerHeaderNav>
        </NavDrawerHeader>
        <NavDrawerBody>
          <Nav
            selectedValue={selectedValue}
            onNavItemSelect={(_, data) => setSelectedValue(data.value as string)}
          >
            <NavItem value="home" icon={<HomeRegular />}>
              Home
            </NavItem>
            <NavItem value="documents" icon={<DocumentRegular />}>
              Documents
            </NavItem>
            <NavItem value="reports" icon={<ChartMultipleRegular />}>
              Reports
            </NavItem>
            <NavDivider />
            <NavItem value="settings" icon={<SettingsRegular />}>
              Settings
            </NavItem>
          </Nav>
        </NavDrawerBody>
      </NavDrawer>

      <main className={styles.content}>
        {!isOpen && (
          <Hamburger onClick={() => setIsOpen(true)} />
        )}
        <h1>Content Area</h1>
      </main>
    </div>
  );
}
```

## Responsive Sidebar

```tsx
import { useMediaQuery } from './hooks/useMediaQuery';

const useResponsiveStyles = makeStyles({
  root: {
    display: 'flex',
    height: '100vh',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  mobileHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: tokens.spacingHorizontalM,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  content: {
    flex: 1,
    overflow: 'auto',
  },
});

function ResponsiveSidebar() {
  const styles = useResponsiveStyles();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isOpen, setIsOpen] = useState(!isMobile);
  const [selectedValue, setSelectedValue] = useState('home');

  // Close sidebar on mobile when navigation occurs
  const handleNavSelect = (_: unknown, data: { value: string }) => {
    setSelectedValue(data.value);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <div className={styles.root}>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)} />
      )}

      <NavDrawer
        open={isOpen}
        type={isMobile ? 'overlay' : 'inline'}
        size="medium"
        onOpenChange={(_, data) => setIsOpen(data.open)}
      >
        <NavDrawerBody>
          <Nav
            selectedValue={selectedValue}
            onNavItemSelect={handleNavSelect}
          >
            <NavItem value="home" icon={<HomeRegular />}>Home</NavItem>
            <NavItem value="documents" icon={<DocumentRegular />}>Documents</NavItem>
            <NavItem value="reports" icon={<ChartMultipleRegular />}>Reports</NavItem>
          </Nav>
        </NavDrawerBody>
      </NavDrawer>

      <div className={styles.content}>
        {/* Mobile header with menu button */}
        {isMobile && (
          <div className={styles.mobileHeader}>
            <Hamburger onClick={() => setIsOpen(true)} />
            <span>My App</span>
          </div>
        )}
        <main>
          <h1>Content</h1>
        </main>
      </div>
    </div>
  );
}

// useMediaQuery hook
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
```

## Sidebar with Sections

```tsx
const useSectionStyles = makeStyles({
  sidebar: {
    width: '280px',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  scrollArea: {
    flex: 1,
    overflowY: 'auto',
  },
  footer: {
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
    padding: tokens.spacingVerticalS,
  },
});

function SectionedSidebar() {
  const styles = useSectionStyles();
  const [selectedValue, setSelectedValue] = useState('home');

  return (
    <aside className={styles.sidebar}>
      <div className={styles.scrollArea}>
        <Nav
          selectedValue={selectedValue}
          onNavItemSelect={(_, data) => setSelectedValue(data.value as string)}
        >
          {/* Main Section */}
          <NavSectionHeader>Main</NavSectionHeader>
          <NavItem value="home" icon={<HomeRegular />}>Home</NavItem>
          <NavItem value="dashboard" icon={<ChartMultipleRegular />}>Dashboard</NavItem>

          {/* Content Section */}
          <NavSectionHeader>Content</NavSectionHeader>
          <NavItem value="documents" icon={<DocumentRegular />}>Documents</NavItem>
          <NavItem value="media" icon={<FolderRegular />}>Media</NavItem>

          {/* Team Section */}
          <NavSectionHeader>Team</NavSectionHeader>
          <NavItem value="members" icon={<PersonRegular />}>Members</NavItem>
          <NavItem value="groups" icon={<PersonRegular />}>Groups</NavItem>
        </Nav>
      </div>

      {/* Footer navigation */}
      <div className={styles.footer}>
        <Nav
          selectedValue={selectedValue}
          onNavItemSelect={(_, data) => setSelectedValue(data.value as string)}
        >
          <NavItem value="settings" icon={<SettingsRegular />}>Settings</NavItem>
        </Nav>
      </div>
    </aside>
  );
}
```

## Sidebar with Search

```tsx
import { SearchBox } from '@fluentui/react-components';

const useSearchSidebarStyles = makeStyles({
  sidebar: {
    width: '280px',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  searchContainer: {
    padding: tokens.spacingHorizontalM,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  navContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: tokens.spacingVerticalS,
  },
});

interface SearchableNavItem {
  id: string;
  label: string;
  icon?: React.ReactElement;
  keywords?: string[];
}

function SearchableSidebar() {
  const styles = useSearchSidebarStyles();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedValue, setSelectedValue] = useState('home');

  const allItems: SearchableNavItem[] = [
    { id: 'home', label: 'Home', icon: <HomeRegular />, keywords: ['start', 'main'] },
    { id: 'documents', label: 'Documents', icon: <DocumentRegular />, keywords: ['files', 'papers'] },
    { id: 'reports', label: 'Reports', icon: <ChartMultipleRegular />, keywords: ['analytics', 'data'] },
    { id: 'settings', label: 'Settings', icon: <SettingsRegular />, keywords: ['preferences', 'config'] },
    { id: 'profile', label: 'Profile', icon: <PersonRegular />, keywords: ['account', 'user'] },
  ];

  const filteredItems = useMemo(() => {
    if (!searchQuery) return allItems;

    const query = searchQuery.toLowerCase();
    return allItems.filter((item) => {
      const labelMatch = item.label.toLowerCase().includes(query);
      const keywordMatch = item.keywords?.some((k) => k.includes(query));
      return labelMatch || keywordMatch;
    });
  }, [allItems, searchQuery]);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.searchContainer}>
        <SearchBox
          placeholder="Search navigation..."
          value={searchQuery}
          onChange={(_, data) => setSearchQuery(data.value)}
        />
      </div>

      <div className={styles.navContainer}>
        <Nav
          selectedValue={selectedValue}
          onNavItemSelect={(_, data) => setSelectedValue(data.value as string)}
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <NavItem key={item.id} value={item.id} icon={item.icon}>
                {item.label}
              </NavItem>
            ))
          ) : (
            <div style={{ padding: tokens.spacingHorizontalM, color: tokens.colorNeutralForeground3 }}>
              No results found
            </div>
          )}
        </Nav>
      </div>
    </aside>
  );
}
```

## Sidebar with User Profile

```tsx
import { Avatar, Persona, Button, Divider } from '@fluentui/react-components';
import { SignOutRegular } from '@fluentui/react-icons';

const useProfileSidebarStyles = makeStyles({
  sidebar: {
    width: '280px',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  header: {
    padding: tokens.spacingHorizontalL,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  logo: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
  },
  navArea: {
    flex: 1,
    overflowY: 'auto',
    padding: tokens.spacingVerticalS,
  },
  userSection: {
    padding: tokens.spacingHorizontalM,
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalM,
  },
});

interface User {
  name: string;
  email: string;
  avatar?: string;
}

function ProfileSidebar({ user }: { user: User }) {
  const styles = useProfileSidebarStyles();
  const [selectedValue, setSelectedValue] = useState('home');

  return (
    <aside className={styles.sidebar}>
      {/* Logo/Header */}
      <div className={styles.header}>
        <span className={styles.logo}>My Application</span>
      </div>

      {/* Navigation */}
      <div className={styles.navArea}>
        <Nav
          selectedValue={selectedValue}
          onNavItemSelect={(_, data) => setSelectedValue(data.value as string)}
        >
          <NavItem value="home" icon={<HomeRegular />}>Home</NavItem>
          <NavItem value="documents" icon={<DocumentRegular />}>Documents</NavItem>
          <NavItem value="reports" icon={<ChartMultipleRegular />}>Reports</NavItem>
          <NavDivider />
          <NavItem value="settings" icon={<SettingsRegular />}>Settings</NavItem>
        </Nav>
      </div>

      {/* User Section */}
      <div className={styles.userSection}>
        <div className={styles.userInfo}>
          <Persona
            name={user.name}
            secondaryText={user.email}
            avatar={{ image: user.avatar ? { src: user.avatar } : undefined }}
            size="medium"
          />
          <Button
            icon={<SignOutRegular />}
            appearance="subtle"
            aria-label="Sign out"
            title="Sign out"
          />
        </div>
      </div>
    </aside>
  );
}
```

## useSidebar Hook

```typescript
import { useState, useCallback, useMemo } from 'react';

interface UseSidebarOptions {
  defaultOpen?: boolean;
  defaultSelectedValue?: string;
  onSelectionChange?: (value: string) => void;
}

interface UseSidebarReturn {
  isOpen: boolean;
  selectedValue: string | undefined;
  open: () => void;
  close: () => void;
  toggle: () => void;
  select: (value: string) => void;
  navProps: {
    selectedValue: string | undefined;
    onNavItemSelect: (event: unknown, data: { value: string }) => void;
  };
  drawerProps: {
    open: boolean;
    onOpenChange: (event: unknown, data: { open: boolean }) => void;
  };
}

/**
 * Hook for managing sidebar state
 */
export function useSidebar(options: UseSidebarOptions = {}): UseSidebarReturn {
  const {
    defaultOpen = true,
    defaultSelectedValue,
    onSelectionChange,
  } = options;

  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [selectedValue, setSelectedValue] = useState(defaultSelectedValue);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const select = useCallback(
    (value: string) => {
      setSelectedValue(value);
      onSelectionChange?.(value);
    },
    [onSelectionChange]
  );

  const navProps = useMemo(
    () => ({
      selectedValue,
      onNavItemSelect: (_: unknown, data: { value: string }) => {
        select(data.value);
      },
    }),
    [selectedValue, select]
  );

  const drawerProps = useMemo(
    () => ({
      open: isOpen,
      onOpenChange: (_: unknown, data: { open: boolean }) => {
        setIsOpen(data.open);
      },
    }),
    [isOpen]
  );

  return {
    isOpen,
    selectedValue,
    open,
    close,
    toggle,
    select,
    navProps,
    drawerProps,
  };
}

// Usage
function SidebarWithHook() {
  const sidebar = useSidebar({
    defaultOpen: true,
    defaultSelectedValue: 'home',
    onSelectionChange: (value) => console.log('Selected:', value),
  });

  return (
    <NavDrawer {...sidebar.drawerProps}>
      <NavDrawerBody>
        <Nav {...sidebar.navProps}>
          <NavItem value="home" icon={<HomeRegular />}>Home</NavItem>
          <NavItem value="settings" icon={<SettingsRegular />}>Settings</NavItem>
        </Nav>
      </NavDrawerBody>
    </NavDrawer>
  );
}
```

## Router Integration

```tsx
import { useNavigate, useLocation } from 'react-router-dom';

interface RouteNavItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactElement;
  children?: RouteNavItem[];
}

function RouterSidebar({ items }: { items: RouteNavItem[] }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Find selected value based on current path
  const selectedValue = useMemo(() => {
    const findSelected = (items: RouteNavItem[]): string | undefined => {
      for (const item of items) {
        if (item.path === location.pathname) return item.id;
        if (item.children) {
          const found = findSelected(item.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    return findSelected(items);
  }, [items, location.pathname]);

  const handleSelect = (_: unknown, data: { value: string }) => {
    const findPath = (items: RouteNavItem[], id: string): string | undefined => {
      for (const item of items) {
        if (item.id === id) return item.path;
        if (item.children) {
          const found = findPath(item.children, id);
          if (found) return found;
        }
      }
      return undefined;
    };

    const path = findPath(items, data.value);
    if (path) navigate(path);
  };

  const renderItems = (items: RouteNavItem[]) => {
    return items.map((item) => {
      if (item.children) {
        return (
          <NavCategory key={item.id} value={item.id}>
            <NavCategoryItem icon={item.icon}>{item.label}</NavCategoryItem>
            {item.children.map((child) => (
              <NavSubItem key={child.id} value={child.id}>
                {child.label}
              </NavSubItem>
            ))}
          </NavCategory>
        );
      }
      return (
        <NavItem key={item.id} value={item.id} icon={item.icon}>
          {item.label}
        </NavItem>
      );
    });
  };

  return (
    <Nav selectedValue={selectedValue} onNavItemSelect={handleSelect}>
      {renderItems(items)}
    </Nav>
  );
}
```

## Accessibility Checklist

- [x] Use proper `<nav>` element with `aria-label`
- [x] Ensure keyboard navigation works (Arrow keys, Enter, Space)
- [x] Mark current item with proper ARIA state
- [x] Provide skip link to bypass navigation
- [x] Ensure proper focus management when drawer opens/closes
- [x] Support screen readers with meaningful labels

## Best Practices

1. **Keep Navigation Consistent**: Same position and behavior across pages
2. **Limit Top-Level Items**: 5-7 items maximum for cognitive load
3. **Use Clear Labels**: Descriptive, action-oriented labels
4. **Show Active State**: Clear visual indication of current location
5. **Support Keyboard**: Full keyboard accessibility
6. **Mobile Consideration**: Drawer pattern for small screens
7. **Progressive Disclosure**: Use categories for complex navigation

## Related Documentation

- [01-breadcrumb-patterns.md](01-breadcrumb-patterns.md) - Location indication
- [03-tab-navigation.md](03-tab-navigation.md) - Content sectioning
- [04-menu-navigation.md](04-menu-navigation.md) - Contextual menus