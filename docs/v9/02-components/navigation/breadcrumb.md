# Breadcrumb

> **Package**: `@fluentui/react-breadcrumb`
> **Import**: `import { Breadcrumb, BreadcrumbItem, BreadcrumbButton, BreadcrumbDivider } from '@fluentui/react-components'`
> **Category**: Navigation

## Overview

Breadcrumb shows the user's current location within a hierarchical structure and allows navigation to parent levels. It's useful for deep navigation hierarchies.

---

## Basic Usage

```typescript
import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
} from '@fluentui/react-components';

export const BasicBreadcrumb: React.FC = () => (
  <Breadcrumb aria-label="Breadcrumb navigation">
    <BreadcrumbItem>
      <BreadcrumbButton>Home</BreadcrumbButton>
    </BreadcrumbItem>
    <BreadcrumbDivider />
    <BreadcrumbItem>
      <BreadcrumbButton>Products</BreadcrumbButton>
    </BreadcrumbItem>
    <BreadcrumbDivider />
    <BreadcrumbItem>
      <BreadcrumbButton current>Electronics</BreadcrumbButton>
    </BreadcrumbItem>
  </Breadcrumb>
);
```

---

## Component Structure

| Component | Purpose |
|-----------|---------|
| `Breadcrumb` | Root container for breadcrumb navigation |
| `BreadcrumbItem` | Wrapper for each breadcrumb item |
| `BreadcrumbButton` | Interactive breadcrumb link/button |
| `BreadcrumbDivider` | Visual separator between items |

---

## Breadcrumb Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the breadcrumb |
| `appearance` | `'transparent' \| 'subtle'` | `'transparent'` | Visual style |

## BreadcrumbButton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `current` | `boolean` | `false` | Marks as current/active item |
| `disabled` | `boolean` | `false` | Disabled state |
| `icon` | `Slot<'span'>` | - | Leading icon |
| `as` | `'a'` | - | Render as anchor element |
| `href` | `string` | - | Link URL (when `as="a"`) |

---

## Size Variants

```typescript
import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
});

export const BreadcrumbSizes: React.FC = () => {
  const styles = useStyles();

  const renderBreadcrumb = (size: 'small' | 'medium' | 'large') => (
    <Breadcrumb size={size} aria-label={`${size} breadcrumb`}>
      <BreadcrumbItem>
        <BreadcrumbButton>Home</BreadcrumbButton>
      </BreadcrumbItem>
      <BreadcrumbDivider />
      <BreadcrumbItem>
        <BreadcrumbButton>Category</BreadcrumbButton>
      </BreadcrumbItem>
      <BreadcrumbDivider />
      <BreadcrumbItem>
        <BreadcrumbButton current>Item</BreadcrumbButton>
      </BreadcrumbItem>
    </Breadcrumb>
  );

  return (
    <div className={styles.container}>
      {renderBreadcrumb('small')}
      {renderBreadcrumb('medium')}
      {renderBreadcrumb('large')}
    </div>
  );
};
```

---

## With Icons

```typescript
import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
} from '@fluentui/react-components';
import {
  HomeRegular,
  FolderRegular,
  DocumentRegular,
} from '@fluentui/react-icons';

export const BreadcrumbWithIcons: React.FC = () => (
  <Breadcrumb aria-label="File navigation">
    <BreadcrumbItem>
      <BreadcrumbButton icon={<HomeRegular />}>Home</BreadcrumbButton>
    </BreadcrumbItem>
    <BreadcrumbDivider />
    <BreadcrumbItem>
      <BreadcrumbButton icon={<FolderRegular />}>Documents</BreadcrumbButton>
    </BreadcrumbItem>
    <BreadcrumbDivider />
    <BreadcrumbItem>
      <BreadcrumbButton icon={<FolderRegular />}>Projects</BreadcrumbButton>
    </BreadcrumbItem>
    <BreadcrumbDivider />
    <BreadcrumbItem>
      <BreadcrumbButton icon={<DocumentRegular />} current>
        Report.docx
      </BreadcrumbButton>
    </BreadcrumbItem>
  </Breadcrumb>
);
```

---

## As Links

```typescript
import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
} from '@fluentui/react-components';

export const BreadcrumbAsLinks: React.FC = () => (
  <Breadcrumb aria-label="Site navigation">
    <BreadcrumbItem>
      <BreadcrumbButton as="a" href="/">
        Home
      </BreadcrumbButton>
    </BreadcrumbItem>
    <BreadcrumbDivider />
    <BreadcrumbItem>
      <BreadcrumbButton as="a" href="/products">
        Products
      </BreadcrumbButton>
    </BreadcrumbItem>
    <BreadcrumbDivider />
    <BreadcrumbItem>
      <BreadcrumbButton as="a" href="/products/electronics">
        Electronics
      </BreadcrumbButton>
    </BreadcrumbItem>
    <BreadcrumbDivider />
    <BreadcrumbItem>
      <BreadcrumbButton current aria-current="page">
        Laptops
      </BreadcrumbButton>
    </BreadcrumbItem>
  </Breadcrumb>
);
```

---

## With React Router

```typescript
import * as React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
} from '@fluentui/react-components';
import { HomeRegular } from '@fluentui/react-icons';

interface BreadcrumbRoute {
  path: string;
  label: string;
}

const routeLabels: Record<string, string> = {
  '': 'Home',
  products: 'Products',
  electronics: 'Electronics',
  laptops: 'Laptops',
};

export const RouterBreadcrumb: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const breadcrumbs: BreadcrumbRoute[] = [
    { path: '/', label: 'Home' },
    ...pathSegments.map((segment, index) => ({
      path: '/' + pathSegments.slice(0, index + 1).join('/'),
      label: routeLabels[segment] || segment,
    })),
  ];

  return (
    <Breadcrumb aria-label="Page navigation">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          {index > 0 && <BreadcrumbDivider />}
          <BreadcrumbItem>
            {index === breadcrumbs.length - 1 ? (
              <BreadcrumbButton current aria-current="page">
                {crumb.label}
              </BreadcrumbButton>
            ) : (
              <BreadcrumbButton
                as={RouterLink}
                to={crumb.path}
                icon={index === 0 ? <HomeRegular /> : undefined}
              >
                {crumb.label}
              </BreadcrumbButton>
            )}
          </BreadcrumbItem>
        </React.Fragment>
      ))}
    </Breadcrumb>
  );
};
```

---

## Custom Divider

```typescript
import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
} from '@fluentui/react-components';
import { ChevronRightRegular } from '@fluentui/react-icons';

export const CustomDividerBreadcrumb: React.FC = () => (
  <Breadcrumb aria-label="Navigation">
    <BreadcrumbItem>
      <BreadcrumbButton>Home</BreadcrumbButton>
    </BreadcrumbItem>
    <BreadcrumbDivider>
      <ChevronRightRegular />
    </BreadcrumbDivider>
    <BreadcrumbItem>
      <BreadcrumbButton>Section</BreadcrumbButton>
    </BreadcrumbItem>
    <BreadcrumbDivider>
      <ChevronRightRegular />
    </BreadcrumbDivider>
    <BreadcrumbItem>
      <BreadcrumbButton current>Page</BreadcrumbButton>
    </BreadcrumbItem>
  </Breadcrumb>
);
```

---

## Overflow Handling

For long breadcrumbs, use overflow menu pattern:

```typescript
import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from '@fluentui/react-components';
import { MoreHorizontalRegular } from '@fluentui/react-icons';

export const OverflowBreadcrumb: React.FC = () => {
  const allItems = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Electronics', path: '/products/electronics' },
    { label: 'Computers', path: '/products/electronics/computers' },
    { label: 'Laptops', path: '/products/electronics/computers/laptops' },
    { label: 'Gaming', path: '/products/electronics/computers/laptops/gaming' },
  ];

  // Show first, collapsed middle, and last 2 items
  const firstItem = allItems[0];
  const collapsedItems = allItems.slice(1, -2);
  const visibleItems = allItems.slice(-2);

  return (
    <Breadcrumb aria-label="Navigation">
      <BreadcrumbItem>
        <BreadcrumbButton>{firstItem.label}</BreadcrumbButton>
      </BreadcrumbItem>
      <BreadcrumbDivider />

      {collapsedItems.length > 0 && (
        <>
          <BreadcrumbItem>
            <Menu>
              <MenuTrigger>
                <BreadcrumbButton icon={<MoreHorizontalRegular />} aria-label="More items" />
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  {collapsedItems.map(item => (
                    <MenuItem key={item.path}>{item.label}</MenuItem>
                  ))}
                </MenuList>
              </MenuPopover>
            </Menu>
          </BreadcrumbItem>
          <BreadcrumbDivider />
        </>
      )}

      {visibleItems.map((item, index) => (
        <React.Fragment key={item.path}>
          <BreadcrumbItem>
            <BreadcrumbButton current={index === visibleItems.length - 1}>
              {item.label}
            </BreadcrumbButton>
          </BreadcrumbItem>
          {index < visibleItems.length - 1 && <BreadcrumbDivider />}
        </React.Fragment>
      ))}
    </Breadcrumb>
  );
};
```

---

## File System Breadcrumb

```typescript
import * as React from 'react';
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
  StorageRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    padding: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
  },
});

interface PathSegment {
  name: string;
  icon: React.ReactElement;
}

export const FileSystemBreadcrumb: React.FC = () => {
  const styles = useStyles();
  const [currentPath, setCurrentPath] = React.useState<PathSegment[]>([
    { name: 'Drive C:', icon: <StorageRegular /> },
    { name: 'Users', icon: <FolderRegular /> },
    { name: 'Documents', icon: <FolderRegular /> },
    { name: 'Projects', icon: <FolderRegular /> },
    { name: 'Report.pdf', icon: <DocumentRegular /> },
  ]);

  const handleNavigate = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1));
  };

  return (
    <div className={styles.container}>
      <Breadcrumb aria-label="File path">
        {currentPath.map((segment, index) => (
          <React.Fragment key={index}>
            {index > 0 && <BreadcrumbDivider />}
            <BreadcrumbItem>
              <BreadcrumbButton
                icon={segment.icon}
                current={index === currentPath.length - 1}
                onClick={() => handleNavigate(index)}
              >
                {segment.name}
              </BreadcrumbButton>
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </Breadcrumb>
    </div>
  );
};
```

---

## Accessibility

### Keyboard Support

| Key | Action |
|-----|--------|
| `Tab` | Move between breadcrumb items |
| `Enter` / `Space` | Activate breadcrumb link |

### ARIA Attributes

| Element | Attribute | Value |
|---------|-----------|-------|
| Breadcrumb | `role` | `navigation` |
| Breadcrumb | `aria-label` | Descriptive label |
| Current item | `aria-current` | `page` |

### Best Practices

```typescript
// ✅ Always provide aria-label on Breadcrumb
<Breadcrumb aria-label="Site navigation">

// ✅ Mark current item with aria-current
<BreadcrumbButton current aria-current="page">
  Current Page
</BreadcrumbButton>

// ✅ Use semantic links for actual navigation
<BreadcrumbButton as="a" href="/path">
  Link
</BreadcrumbButton>
```

---

## Styling Customization

```typescript
import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
  makeStyles,
  tokens,
  breadcrumbClassNames,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  customBreadcrumb: {
    backgroundColor: tokens.colorNeutralBackground3,
    padding: tokens.spacingHorizontalS,
    borderRadius: tokens.borderRadiusMedium,
  },
  customButton: {
    ':hover': {
      color: tokens.colorBrandForeground1,
    },
    '&[aria-current="page"]': {
      fontWeight: tokens.fontWeightBold,
    },
  },
});

export const CustomStyledBreadcrumb: React.FC = () => {
  const styles = useStyles();

  return (
    <Breadcrumb className={styles.customBreadcrumb} aria-label="Navigation">
      <BreadcrumbItem>
        <BreadcrumbButton className={styles.customButton}>Home</BreadcrumbButton>
      </BreadcrumbItem>
      <BreadcrumbDivider />
      <BreadcrumbItem>
        <BreadcrumbButton className={styles.customButton}>Section</BreadcrumbButton>
      </BreadcrumbItem>
      <BreadcrumbDivider />
      <BreadcrumbItem>
        <BreadcrumbButton className={styles.customButton} current aria-current="page">
          Current
        </BreadcrumbButton>
      </BreadcrumbItem>
    </Breadcrumb>
  );
};
```

---

## Best Practices

### ✅ Do's

```typescript
// ✅ Always provide aria-label
<Breadcrumb aria-label="Page navigation">

// ✅ Mark current page with current prop
<BreadcrumbButton current aria-current="page">Current</BreadcrumbButton>

// ✅ Use icons for clarity when helpful
<BreadcrumbButton icon={<HomeRegular />}>Home</BreadcrumbButton>

// ✅ Handle overflow for deep hierarchies
// Use overflow menu pattern for long breadcrumbs

// ✅ Make breadcrumb items clickable except current
<BreadcrumbButton as="a" href="/path">Link</BreadcrumbButton>
```

### ❌ Don'ts

```typescript
// ❌ Don't omit aria-label
<Breadcrumb> // Missing aria-label

// ❌ Don't make current item clickable
<BreadcrumbButton current onClick={handleClick}> // Redundant

// ❌ Don't use for linear step indicators (use Stepper)
<Breadcrumb> // Not for sequential steps

// ❌ Don't show too many items without overflow
// More than 5-6 items should use overflow pattern
```

---

## See Also

- [Nav](nav.md) - Side navigation
- [Tabs](tabs.md) - Tab navigation
- [Menu](menu.md) - Dropdown menu
- [Link](link.md) - Hyperlink component
- [Component Index](../00-component-index.md) - All components