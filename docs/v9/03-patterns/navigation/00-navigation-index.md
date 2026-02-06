# Navigation Patterns - FluentUI v9

> **Module**: Navigation Patterns
> **Path**: `03-patterns/navigation/`

## Overview

This module covers navigation patterns for FluentUI v9 applications. Good navigation is critical for user experience - it helps users understand where they are, where they can go, and how to get there efficiently.

## Files in This Module

| File | Topic | Description |
|------|-------|-------------|
| [01-breadcrumb-patterns.md](01-breadcrumb-patterns.md) | Breadcrumb Navigation | Hierarchical location indicators |
| [02-sidebar-navigation.md](02-sidebar-navigation.md) | Sidebar Navigation | Vertical nav panels and drawers |
| [03-tab-navigation.md](03-tab-navigation.md) | Tab Navigation | Tab-based content switching |
| [04-menu-navigation.md](04-menu-navigation.md) | Menu Navigation | Dropdown and context menus |
| [05-pagination-patterns.md](05-pagination-patterns.md) | Pagination | Page navigation and infinite scroll |
| [06-search-navigation.md](06-search-navigation.md) | Search Navigation | Search-driven navigation patterns |

## Core Navigation Components

FluentUI v9 provides these primary navigation components:

```typescript
import {
  // Breadcrumb
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
  
  // Navigation
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
  
  // Tabs
  TabList,
  Tab,
  
  // Menu
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuDivider,
  MenuGroup,
  MenuGroupHeader,
  MenuItemCheckbox,
  MenuItemRadio,
  
  // Link
  Link,
} from '@fluentui/react-components';
```

## Navigation Hierarchy Patterns

### Pattern 1: Top-Down Navigation

```
App Shell
├── Global Navigation (Header)
│   ├── Primary Navigation (Main sections)
│   └── User Menu (Profile, Settings)
├── Sidebar Navigation (Secondary)
│   ├── Section Categories
│   └── Sub-items
└── Content Area
    ├── Breadcrumbs (Location indicator)
    ├── Tab Navigation (Content sections)
    └── Contextual Navigation (Related links)
```

### Pattern 2: Hub-and-Spoke

```
Dashboard (Hub)
├── Feature A (Spoke)
│   ├── Detail View
│   └── Back to Dashboard
├── Feature B (Spoke)
│   ├── Detail View
│   └── Back to Dashboard
└── Feature C (Spoke)
    ├── Detail View
    └── Back to Dashboard
```

## Quick Reference: Navigation Decision Tree

```
What type of navigation do you need?

├── Showing current location?
│   └── Use Breadcrumb (01-breadcrumb-patterns.md)
│
├── Main app sections?
│   ├── Many sections? → Use Sidebar Nav (02-sidebar-navigation.md)
│   └── Few sections? → Use Tab Navigation (03-tab-navigation.md)
│
├── Contextual actions?
│   └── Use Menu Navigation (04-menu-navigation.md)
│
├── Long lists of items?
│   └── Use Pagination (05-pagination-patterns.md)
│
└── Finding specific items?
    └── Use Search Navigation (06-search-navigation.md)
```

## Navigation State Management

### useNavigationState Hook

```typescript
import { useState, useCallback, useMemo } from 'react';

interface NavigationState {
  currentPath: string[];
  selectedItem: string | null;
  expandedCategories: Set<string>;
  searchQuery: string;
}

interface NavigationActions {
  navigateTo: (path: string[]) => void;
  selectItem: (itemId: string) => void;
  toggleCategory: (categoryId: string) => void;
  setSearchQuery: (query: string) => void;
  goBack: () => void;
  goToRoot: () => void;
}

/**
 * Custom hook for managing navigation state
 * Provides centralized navigation control for complex apps
 */
export function useNavigationState(
  initialPath: string[] = []
): [NavigationState, NavigationActions] {
  const [currentPath, setCurrentPath] = useState<string[]>(initialPath);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = useState('');

  const navigateTo = useCallback((path: string[]) => {
    setCurrentPath(path);
    // Auto-select last item in path
    if (path.length > 0) {
      setSelectedItem(path[path.length - 1]);
    }
  }, []);

  const selectItem = useCallback((itemId: string) => {
    setSelectedItem(itemId);
  }, []);

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }, []);

  const goBack = useCallback(() => {
    setCurrentPath((prev) => prev.slice(0, -1));
  }, []);

  const goToRoot = useCallback(() => {
    setCurrentPath([]);
    setSelectedItem(null);
  }, []);

  const state: NavigationState = useMemo(
    () => ({
      currentPath,
      selectedItem,
      expandedCategories,
      searchQuery,
    }),
    [currentPath, selectedItem, expandedCategories, searchQuery]
  );

  const actions: NavigationActions = useMemo(
    () => ({
      navigateTo,
      selectItem,
      toggleCategory,
      setSearchQuery,
      goBack,
      goToRoot,
    }),
    [navigateTo, selectItem, toggleCategory, goBack, goToRoot]
  );

  return [state, actions];
}
```

### Navigation Context Provider

```typescript
import React, { createContext, useContext, ReactNode } from 'react';

interface NavigationContextValue {
  state: NavigationState;
  actions: NavigationActions;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

/**
 * Provider for app-wide navigation state
 */
export function NavigationProvider({ children }: { children: ReactNode }) {
  const [state, actions] = useNavigationState();

  return (
    <NavigationContext.Provider value={{ state, actions }}>
      {children}
    </NavigationContext.Provider>
  );
}

/**
 * Hook to access navigation context
 * @throws Error if used outside NavigationProvider
 */
export function useNavigation(): NavigationContextValue {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}
```

## Routing Integration

### With React Router

```typescript
import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

interface RouteNavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactElement;
  children?: RouteNavigationItem[];
}

/**
 * Hook to sync FluentUI navigation with React Router
 */
export function useRouterNavigation(items: RouteNavigationItem[]) {
  const navigate = useNavigate();
  const location = useLocation();

  // Find selected item based on current path
  const selectedValue = useMemo(() => {
    const findMatchingItem = (
      items: RouteNavigationItem[],
      path: string
    ): string | undefined => {
      for (const item of items) {
        if (item.path === path) return item.id;
        if (item.children) {
          const found = findMatchingItem(item.children, path);
          if (found) return found;
        }
      }
      return undefined;
    };
    return findMatchingItem(items, location.pathname);
  }, [items, location.pathname]);

  // Navigate when item selected
  const onNavSelect = useCallback(
    (itemId: string) => {
      const findPath = (
        items: RouteNavigationItem[],
        id: string
      ): string | undefined => {
        for (const item of items) {
          if (item.id === id) return item.path;
          if (item.children) {
            const found = findPath(item.children, id);
            if (found) return found;
          }
        }
        return undefined;
      };
      const path = findPath(items, itemId);
      if (path) navigate(path);
    },
    [items, navigate]
  );

  return { selectedValue, onNavSelect };
}

// Usage example
const navigationItems: RouteNavigationItem[] = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'products', label: 'Products', path: '/products' },
  { id: 'settings', label: 'Settings', path: '/settings' },
];

function AppNavigation() {
  const { selectedValue, onNavSelect } = useRouterNavigation(navigationItems);

  return (
    <Nav selectedValue={selectedValue} onNavItemSelect={(_, data) => onNavSelect(data.value)}>
      {navigationItems.map((item) => (
        <NavItem key={item.id} value={item.id}>
          {item.label}
        </NavItem>
      ))}
    </Nav>
  );
}
```

## Accessibility Guidelines

### Keyboard Navigation Requirements

| Key | Action |
|-----|--------|
| `Tab` | Move between navigation regions |
| `Arrow Up/Down` | Move between items in list |
| `Arrow Left/Right` | Expand/collapse categories, or move between tabs |
| `Enter/Space` | Select/activate item |
| `Escape` | Close menus, exit search |
| `Home/End` | Jump to first/last item |

### ARIA Landmarks

```tsx
function AccessibleNavigation() {
  return (
    <div>
      {/* Primary navigation */}
      <nav aria-label="Main navigation">
        <Nav>
          {/* Nav items */}
        </Nav>
      </nav>

      {/* Secondary navigation */}
      <nav aria-label="Settings navigation">
        <TabList>
          {/* Tab items */}
        </TabList>
      </nav>

      {/* Breadcrumb navigation */}
      <nav aria-label="Breadcrumb">
        <Breadcrumb>
          {/* Breadcrumb items */}
        </Breadcrumb>
      </nav>
    </div>
  );
}
```

### Focus Management

```typescript
import { useRef, useEffect } from 'react';

/**
 * Hook to manage focus when navigation changes
 */
export function useNavigationFocus(currentPath: string[]) {
  const contentRef = useRef<HTMLDivElement>(null);
  const previousPath = useRef<string[]>([]);

  useEffect(() => {
    // Focus content area when navigation changes
    if (
      JSON.stringify(currentPath) !== JSON.stringify(previousPath.current)
    ) {
      // Small delay to allow content to render
      setTimeout(() => {
        if (contentRef.current) {
          // Focus the heading or first focusable element
          const heading = contentRef.current.querySelector('h1, h2, [tabindex="-1"]');
          if (heading instanceof HTMLElement) {
            heading.focus();
          }
        }
      }, 100);
      previousPath.current = currentPath;
    }
  }, [currentPath]);

  return contentRef;
}
```

## Performance Tips

1. **Lazy Load Routes**: Don't load all page content upfront
2. **Memoize Navigation Items**: Prevent unnecessary re-renders
3. **Use Virtual Lists**: For long navigation lists
4. **Debounce Search**: Prevent excessive filtering
5. **Cache Navigation State**: Persist expand/collapse states

## Next Steps

- Start with [01-breadcrumb-patterns.md](01-breadcrumb-patterns.md) for location indication
- See [02-sidebar-navigation.md](02-sidebar-navigation.md) for main app navigation
- Check [03-tab-navigation.md](03-tab-navigation.md) for content sectioning