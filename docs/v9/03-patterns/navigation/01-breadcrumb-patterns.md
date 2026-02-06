# Breadcrumb Navigation Patterns - FluentUI v9

> **Topic**: Breadcrumb Navigation
> **Component**: `Breadcrumb`, `BreadcrumbItem`, `BreadcrumbButton`, `BreadcrumbDivider`
> **Package**: `@fluentui/react-components`

## Overview

Breadcrumbs show the user's current location within a hierarchical structure and provide quick navigation back to parent levels. They are essential for deep navigation hierarchies.

## Basic Imports

```typescript
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  FolderRegular,
  DocumentRegular,
  HomeRegular,
} from '@fluentui/react-icons';
```

## Basic Breadcrumb

```tsx
interface BreadcrumbPath {
  id: string;
  label: string;
  href?: string;
}

function BasicBreadcrumb({ path }: { path: BreadcrumbPath[] }) {
  return (
    <Breadcrumb aria-label="Breadcrumb navigation">
      {path.map((item, index) => (
        <React.Fragment key={item.id}>
          <BreadcrumbItem>
            <BreadcrumbButton
              href={item.href}
              current={index === path.length - 1}
            >
              {item.label}
            </BreadcrumbButton>
          </BreadcrumbItem>
          {index < path.length - 1 && <BreadcrumbDivider />}
        </React.Fragment>
      ))}
    </Breadcrumb>
  );
}

// Usage
<BasicBreadcrumb
  path={[
    { id: 'home', label: 'Home', href: '/' },
    { id: 'products', label: 'Products', href: '/products' },
    { id: 'electronics', label: 'Electronics', href: '/products/electronics' },
    { id: 'phones', label: 'Phones' }, // Current - no href
  ]}
/>
```

## Breadcrumb with Icons

```tsx
const useStyles = makeStyles({
  icon: {
    marginRight: tokens.spacingHorizontalXS,
    fontSize: '16px',
  },
});

interface BreadcrumbWithIconPath {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactElement;
}

function BreadcrumbWithIcons({ path }: { path: BreadcrumbWithIconPath[] }) {
  const styles = useStyles();

  return (
    <Breadcrumb aria-label="Breadcrumb navigation">
      {path.map((item, index) => (
        <React.Fragment key={item.id}>
          <BreadcrumbItem>
            <BreadcrumbButton
              href={item.href}
              current={index === path.length - 1}
              icon={item.icon ? (
                <span className={styles.icon}>{item.icon}</span>
              ) : undefined}
            >
              {item.label}
            </BreadcrumbButton>
          </BreadcrumbItem>
          {index < path.length - 1 && <BreadcrumbDivider />}
        </React.Fragment>
      ))}
    </Breadcrumb>
  );
}

// Usage
<BreadcrumbWithIcons
  path={[
    { id: 'home', label: 'Home', href: '/', icon: <HomeRegular /> },
    { id: 'documents', label: 'Documents', href: '/docs', icon: <FolderRegular /> },
    { id: 'report', label: 'Report.pdf', icon: <DocumentRegular /> },
  ]}
/>
```

## Collapsible Breadcrumb

For long paths, collapse middle items into a menu:

```tsx
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from '@fluentui/react-components';
import { MoreHorizontalRegular } from '@fluentui/react-icons';

const useCollapsibleStyles = makeStyles({
  collapsedButton: {
    minWidth: 'auto',
    padding: tokens.spacingHorizontalXS,
  },
});

interface CollapsibleBreadcrumbProps {
  path: BreadcrumbPath[];
  maxVisible?: number;
  onNavigate?: (item: BreadcrumbPath) => void;
}

function CollapsibleBreadcrumb({
  path,
  maxVisible = 3,
  onNavigate,
}: CollapsibleBreadcrumbProps) {
  const styles = useCollapsibleStyles();

  // Always show first and last items
  // Collapse middle items if path is too long
  const shouldCollapse = path.length > maxVisible;
  const firstItem = path[0];
  const lastItem = path[path.length - 1];
  const collapsedItems = shouldCollapse ? path.slice(1, -1) : [];
  const visibleMiddle = shouldCollapse ? [] : path.slice(1, -1);

  const handleClick = (item: BreadcrumbPath) => {
    onNavigate?.(item);
  };

  return (
    <Breadcrumb aria-label="Breadcrumb navigation">
      {/* First item - always visible */}
      <BreadcrumbItem>
        <BreadcrumbButton
          onClick={() => handleClick(firstItem)}
          current={path.length === 1}
        >
          {firstItem.label}
        </BreadcrumbButton>
      </BreadcrumbItem>

      {path.length > 1 && <BreadcrumbDivider />}

      {/* Collapsed items menu */}
      {shouldCollapse && collapsedItems.length > 0 && (
        <>
          <BreadcrumbItem>
            <Menu>
              <MenuTrigger disableButtonEnhancement>
                <BreadcrumbButton
                  className={styles.collapsedButton}
                  aria-label={`${collapsedItems.length} collapsed items`}
                >
                  <MoreHorizontalRegular />
                </BreadcrumbButton>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  {collapsedItems.map((item) => (
                    <MenuItem key={item.id} onClick={() => handleClick(item)}>
                      {item.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </MenuPopover>
            </Menu>
          </BreadcrumbItem>
          <BreadcrumbDivider />
        </>
      )}

      {/* Visible middle items */}
      {visibleMiddle.map((item) => (
        <React.Fragment key={item.id}>
          <BreadcrumbItem>
            <BreadcrumbButton onClick={() => handleClick(item)}>
              {item.label}
            </BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
        </React.Fragment>
      ))}

      {/* Last item - always visible */}
      {path.length > 1 && (
        <BreadcrumbItem>
          <BreadcrumbButton current>{lastItem.label}</BreadcrumbButton>
        </BreadcrumbItem>
      )}
    </Breadcrumb>
  );
}
```

## Breadcrumb with Router Integration

```tsx
import { useNavigate, useLocation, matchPath } from 'react-router-dom';

interface RouteConfig {
  path: string;
  label: string;
  parent?: string;
}

const routeConfig: Record<string, RouteConfig> = {
  '/': { path: '/', label: 'Home' },
  '/products': { path: '/products', label: 'Products', parent: '/' },
  '/products/:category': {
    path: '/products/:category',
    label: 'Category',
    parent: '/products',
  },
  '/products/:category/:id': {
    path: '/products/:category/:id',
    label: 'Product',
    parent: '/products/:category',
  },
};

/**
 * Hook to generate breadcrumb path from current route
 */
function useRouteBreadcrumb(routes: Record<string, RouteConfig>) {
  const location = useLocation();

  return useMemo(() => {
    const path: BreadcrumbPath[] = [];
    let currentPath = location.pathname;

    // Find matching route and build path
    for (const [pattern, config] of Object.entries(routes)) {
      const match = matchPath(pattern, currentPath);
      if (match) {
        // Add current route
        path.unshift({
          id: currentPath,
          label: config.label,
          href: currentPath,
        });

        // Traverse to parent
        if (config.parent) {
          let parentPath = config.parent;
          // Replace dynamic segments with actual values
          if (match.params) {
            for (const [key, value] of Object.entries(match.params)) {
              parentPath = parentPath.replace(`:${key}`, value || '');
            }
          }
          currentPath = parentPath;
        } else {
          break;
        }
      }
    }

    return path;
  }, [location.pathname, routes]);
}

function RouterBreadcrumb() {
  const navigate = useNavigate();
  const breadcrumbPath = useRouteBreadcrumb(routeConfig);

  return (
    <Breadcrumb aria-label="Breadcrumb navigation">
      {breadcrumbPath.map((item, index) => (
        <React.Fragment key={item.id}>
          <BreadcrumbItem>
            <BreadcrumbButton
              onClick={() => navigate(item.href!)}
              current={index === breadcrumbPath.length - 1}
            >
              {item.label}
            </BreadcrumbButton>
          </BreadcrumbItem>
          {index < breadcrumbPath.length - 1 && <BreadcrumbDivider />}
        </React.Fragment>
      ))}
    </Breadcrumb>
  );
}
```

## File System Breadcrumb

```tsx
interface FileSystemPath {
  type: 'root' | 'folder' | 'file';
  name: string;
  path: string;
}

const useFileSystemStyles = makeStyles({
  breadcrumb: {
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
  },
  icon: {
    marginRight: tokens.spacingHorizontalXS,
    color: tokens.colorNeutralForeground2,
  },
});

function FileSystemBreadcrumb({
  path,
  onNavigate,
}: {
  path: FileSystemPath[];
  onNavigate: (path: string) => void;
}) {
  const styles = useFileSystemStyles();

  const getIcon = (type: FileSystemPath['type']) => {
    switch (type) {
      case 'root':
        return <HomeRegular className={styles.icon} />;
      case 'folder':
        return <FolderRegular className={styles.icon} />;
      case 'file':
        return <DocumentRegular className={styles.icon} />;
    }
  };

  return (
    <div className={styles.breadcrumb}>
      <Breadcrumb aria-label="File path">
        {path.map((item, index) => (
          <React.Fragment key={item.path}>
            <BreadcrumbItem>
              <BreadcrumbButton
                onClick={() => onNavigate(item.path)}
                current={index === path.length - 1}
                icon={getIcon(item.type)}
              >
                {item.name}
              </BreadcrumbButton>
            </BreadcrumbItem>
            {index < path.length - 1 && <BreadcrumbDivider />}
          </React.Fragment>
        ))}
      </Breadcrumb>
    </div>
  );
}

// Usage
<FileSystemBreadcrumb
  path={[
    { type: 'root', name: 'Home', path: '/' },
    { type: 'folder', name: 'Documents', path: '/documents' },
    { type: 'folder', name: 'Projects', path: '/documents/projects' },
    { type: 'file', name: 'Report.pdf', path: '/documents/projects/report.pdf' },
  ]}
  onNavigate={(path) => console.log('Navigate to:', path)}
/>
```

## Responsive Breadcrumb

```tsx
import { useIsOverflowItemVisible, Overflow, OverflowItem } from '@fluentui/react-components';

const useResponsiveStyles = makeStyles({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
});

function ResponsiveBreadcrumb({ path }: { path: BreadcrumbPath[] }) {
  const styles = useResponsiveStyles();

  return (
    <div className={styles.container}>
      <Overflow>
        <Breadcrumb aria-label="Breadcrumb navigation">
          {path.map((item, index) => (
            <React.Fragment key={item.id}>
              <OverflowItem id={item.id} priority={index === path.length - 1 ? 1000 : index}>
                <BreadcrumbItem>
                  <BreadcrumbButton
                    href={item.href}
                    current={index === path.length - 1}
                  >
                    {item.label}
                  </BreadcrumbButton>
                </BreadcrumbItem>
              </OverflowItem>
              {index < path.length - 1 && <BreadcrumbDivider />}
            </React.Fragment>
          ))}
        </Breadcrumb>
      </Overflow>
    </div>
  );
}
```

## Breadcrumb Size Variants

```tsx
type BreadcrumbSize = 'small' | 'medium' | 'large';

interface SizedBreadcrumbProps {
  path: BreadcrumbPath[];
  size?: BreadcrumbSize;
}

function SizedBreadcrumb({ path, size = 'medium' }: SizedBreadcrumbProps) {
  return (
    <Breadcrumb size={size} aria-label="Breadcrumb navigation">
      {path.map((item, index) => (
        <React.Fragment key={item.id}>
          <BreadcrumbItem>
            <BreadcrumbButton
              href={item.href}
              current={index === path.length - 1}
            >
              {item.label}
            </BreadcrumbButton>
          </BreadcrumbItem>
          {index < path.length - 1 && <BreadcrumbDivider />}
        </React.Fragment>
      ))}
    </Breadcrumb>
  );
}

// Sizes showcase
function BreadcrumbSizes() {
  const path = [
    { id: '1', label: 'Home', href: '/' },
    { id: '2', label: 'Section', href: '/section' },
    { id: '3', label: 'Page' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <SizedBreadcrumb path={path} size="small" />
      <SizedBreadcrumb path={path} size="medium" />
      <SizedBreadcrumb path={path} size="large" />
    </div>
  );
}
```

## Custom Divider

```tsx
import { ChevronRightRegular, SlashForwardRegular } from '@fluentui/react-icons';

type DividerStyle = 'slash' | 'chevron' | 'arrow' | 'dot';

interface CustomDividerBreadcrumbProps {
  path: BreadcrumbPath[];
  dividerStyle?: DividerStyle;
}

function CustomDividerBreadcrumb({
  path,
  dividerStyle = 'slash',
}: CustomDividerBreadcrumbProps) {
  const renderDivider = () => {
    switch (dividerStyle) {
      case 'chevron':
        return <BreadcrumbDivider><ChevronRightRegular /></BreadcrumbDivider>;
      case 'arrow':
        return <BreadcrumbDivider>→</BreadcrumbDivider>;
      case 'dot':
        return <BreadcrumbDivider>•</BreadcrumbDivider>;
      case 'slash':
      default:
        return <BreadcrumbDivider />;
    }
  };

  return (
    <Breadcrumb aria-label="Breadcrumb navigation">
      {path.map((item, index) => (
        <React.Fragment key={item.id}>
          <BreadcrumbItem>
            <BreadcrumbButton
              href={item.href}
              current={index === path.length - 1}
            >
              {item.label}
            </BreadcrumbButton>
          </BreadcrumbItem>
          {index < path.length - 1 && renderDivider()}
        </React.Fragment>
      ))}
    </Breadcrumb>
  );
}
```

## useBreadcrumb Hook

```typescript
import { useState, useCallback, useMemo } from 'react';

interface UseBreadcrumbOptions {
  maxVisible?: number;
  onNavigate?: (item: BreadcrumbPath) => void;
}

interface UseBreadcrumbReturn {
  path: BreadcrumbPath[];
  visiblePath: BreadcrumbPath[];
  collapsedItems: BreadcrumbPath[];
  isCollapsed: boolean;
  navigate: (item: BreadcrumbPath) => void;
  push: (item: BreadcrumbPath) => void;
  pop: () => BreadcrumbPath | undefined;
  reset: (newPath?: BreadcrumbPath[]) => void;
  goTo: (itemId: string) => void;
}

/**
 * Hook for managing breadcrumb state and navigation
 */
export function useBreadcrumb(
  initialPath: BreadcrumbPath[] = [],
  options: UseBreadcrumbOptions = {}
): UseBreadcrumbReturn {
  const { maxVisible = 4, onNavigate } = options;
  const [path, setPath] = useState<BreadcrumbPath[]>(initialPath);

  const isCollapsed = path.length > maxVisible;

  const { visiblePath, collapsedItems } = useMemo(() => {
    if (!isCollapsed) {
      return { visiblePath: path, collapsedItems: [] };
    }

    // Always show first and last items
    const first = path[0];
    const last = path[path.length - 1];
    const middle = path.slice(1, -1);

    return {
      visiblePath: [first, last],
      collapsedItems: middle,
    };
  }, [path, isCollapsed]);

  const navigate = useCallback(
    (item: BreadcrumbPath) => {
      const index = path.findIndex((p) => p.id === item.id);
      if (index !== -1) {
        // Trim path to the navigated item
        setPath(path.slice(0, index + 1));
        onNavigate?.(item);
      }
    },
    [path, onNavigate]
  );

  const push = useCallback((item: BreadcrumbPath) => {
    setPath((prev) => [...prev, item]);
  }, []);

  const pop = useCallback(() => {
    let removed: BreadcrumbPath | undefined;
    setPath((prev) => {
      if (prev.length > 1) {
        removed = prev[prev.length - 1];
        return prev.slice(0, -1);
      }
      return prev;
    });
    return removed;
  }, []);

  const reset = useCallback((newPath: BreadcrumbPath[] = []) => {
    setPath(newPath);
  }, []);

  const goTo = useCallback(
    (itemId: string) => {
      const item = path.find((p) => p.id === itemId);
      if (item) {
        navigate(item);
      }
    },
    [path, navigate]
  );

  return {
    path,
    visiblePath,
    collapsedItems,
    isCollapsed,
    navigate,
    push,
    pop,
    reset,
    goTo,
  };
}

// Usage
function BreadcrumbWithHook() {
  const {
    path,
    visiblePath,
    collapsedItems,
    isCollapsed,
    navigate,
    push,
  } = useBreadcrumb(
    [{ id: 'home', label: 'Home', href: '/' }],
    { maxVisible: 3 }
  );

  // Use visiblePath and collapsedItems to render the breadcrumb
  // ...
}
```

## Accessibility Checklist

- [x] Use `<Breadcrumb>` with `aria-label` for navigation identification
- [x] Mark current page with `current` prop (sets `aria-current="page"`)
- [x] Ensure all items are keyboard accessible
- [x] Provide clear visual indication of clickable items
- [x] Use meaningful labels (avoid "click here")
- [x] Maintain logical tab order

## Best Practices

1. **Keep it Simple**: Don't show more than 4-5 visible items
2. **Last Item is Current**: Never make the last breadcrumb item a link
3. **Consistent Placement**: Always place breadcrumbs in the same location
4. **Start with Home**: First item should typically be the home/root
5. **Use Short Labels**: Keep breadcrumb labels concise
6. **Match Page Titles**: Breadcrumb labels should match page titles
7. **Collapse Long Paths**: Use overflow menu for deep hierarchies

## Related Documentation

- [02-sidebar-navigation.md](02-sidebar-navigation.md) - Main app navigation
- [Tab Navigation](03-tab-navigation.md) - Content sectioning