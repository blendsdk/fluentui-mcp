# Nav & NavDrawer

> **Package**: `@fluentui/react-nav`
> **Import**: `import { Nav, NavDrawer, NavItem, NavCategory, ... } from '@fluentui/react-components'`
> **Category**: Navigation

## Overview

The Nav package provides a comprehensive set of components for building side navigation experiences. It includes both standalone Nav components and NavDrawer components that combine navigation with Drawer functionality.

**Key Features:**
- Hierarchical navigation with categories and sub-items
- NavDrawer for sidebar navigation panels
- Support for inline and overlay modes
- Routing library integration (React Router, etc.)
- Full keyboard navigation and accessibility support

---

## Component Overview

### Core Navigation Components

| Component | Purpose |
|-----------|---------|
| `Nav` | Standalone navigation container |
| `NavItem` | Single navigation item (leaf node) |
| `NavCategory` | Container for expandable category |
| `NavCategoryItem` | Header/trigger for a category |
| `NavSubItem` | Item within a category |
| `NavSubItemGroup` | Container for sub-items within a category |
| `NavSectionHeader` | Section header for grouping |
| `NavDivider` | Visual separator |

### NavDrawer Components

| Component | Purpose |
|-----------|---------|
| `NavDrawer` | Navigation-aware drawer container |
| `NavDrawerHeader` | Header area (typically contains Hamburger) |
| `NavDrawerBody` | Main scrollable navigation content |
| `NavDrawerFooter` | Optional footer area |

### Utility Components

| Component | Purpose |
|-----------|---------|
| `Hamburger` | Menu toggle button |
| `AppItem` | Clickable app/brand item at top |
| `AppItemStatic` | Non-clickable app/brand item |
| `SplitNavItem` | Nav item with secondary action (e.g., pin/menu) |

---

## Basic Usage

### Simple Nav

```typescript
import * as React from 'react';
import {
  Nav,
  NavItem,
  NavCategory,
  NavCategoryItem,
  NavSubItem,
  NavSubItemGroup,
} from '@fluentui/react-components';
import { HomeRegular, DocumentRegular, SettingsRegular } from '@fluentui/react-icons';

export const BasicNav: React.FC = () => (
  <Nav defaultSelectedValue="home">
    <NavItem icon={<HomeRegular />} value="home">
      Home
    </NavItem>
    <NavCategory value="documents">
      <NavCategoryItem icon={<DocumentRegular />}>
        Documents
      </NavCategoryItem>
      <NavSubItemGroup>
        <NavSubItem value="recent">Recent</NavSubItem>
        <NavSubItem value="shared">Shared with me</NavSubItem>
      </NavSubItemGroup>
    </NavCategory>
    <NavItem icon={<SettingsRegular />} value="settings">
      Settings
    </NavItem>
  </Nav>
);
```

---

## NavDrawer Usage

NavDrawer combines a Drawer with Nav functionality, providing a complete sidebar navigation solution.

### Basic NavDrawer

```typescript
import * as React from 'react';
import {
  NavDrawer,
  NavDrawerHeader,
  NavDrawerBody,
  NavItem,
  NavCategory,
  NavCategoryItem,
  NavSubItem,
  NavSubItemGroup,
  NavSectionHeader,
  NavDivider,
  AppItem,
  Hamburger,
  Tooltip,
  makeStyles,
} from '@fluentui/react-components';
import {
  PersonCircle32Regular,
  Board20Regular,
  People20Regular,
  Settings20Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    height: '100vh',
  },
  content: {
    flex: 1,
    padding: '16px',
  },
});

export const BasicNavDrawer: React.FC = () => {
  const styles = useStyles();
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className={styles.root}>
      <NavDrawer
        open={isOpen}
        type="inline"
        defaultSelectedValue="dashboard"
      >
        <NavDrawerHeader>
          <Tooltip content="Toggle navigation" relationship="label">
            <Hamburger onClick={() => setIsOpen(!isOpen)} />
          </Tooltip>
        </NavDrawerHeader>

        <NavDrawerBody>
          <AppItem icon={<PersonCircle32Regular />}>
            My Application
          </AppItem>

          <NavItem icon={<Board20Regular />} value="dashboard">
            Dashboard
          </NavItem>

          <NavSectionHeader>Management</NavSectionHeader>

          <NavCategory value="users">
            <NavCategoryItem icon={<People20Regular />}>
              Users
            </NavCategoryItem>
            <NavSubItemGroup>
              <NavSubItem value="all-users">All Users</NavSubItem>
              <NavSubItem value="active-users">Active</NavSubItem>
            </NavSubItemGroup>
          </NavCategory>

          <NavDivider />

          <NavItem icon={<Settings20Regular />} value="settings">
            Settings
          </NavItem>
        </NavDrawerBody>
      </NavDrawer>

      <div className={styles.content}>
        <Hamburger onClick={() => setIsOpen(!isOpen)} />
        <p>Main content area</p>
      </div>
    </div>
  );
};
```

---

## Nav Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectedValue` | `NavItemValue` | - | Controlled selected item value |
| `defaultSelectedValue` | `NavItemValue` | - | Default selected item (uncontrolled) |
| `selectedCategoryValue` | `NavItemValue` | - | Controlled selected category |
| `defaultSelectedCategoryValue` | `NavItemValue` | - | Default selected category |
| `openCategories` | `NavItemValue[]` | - | Controlled open categories |
| `defaultOpenCategories` | `NavItemValue[]` | - | Default open categories |
| `multiple` | `boolean` | `true` | Allow multiple categories open |
| `density` | `'small' \| 'medium'` | `'medium'` | Vertical density of items |
| `onNavItemSelect` | `(ev, data) => void` | - | Selection change handler |
| `onNavCategoryItemToggle` | `(ev, data) => void` | - | Category toggle handler |

---

## NavDrawer Props

NavDrawer extends both Drawer and Nav props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Open state |
| `type` | `'inline' \| 'overlay'` | `'overlay'` | Drawer type |
| `position` | `'start' \| 'end'` | `'start'` | Drawer position |
| `size` | `'small' \| 'medium' \| 'large' \| 'full'` | `260px` | Drawer width |
| `tabbable` | `boolean` | `false` | Enable tab navigation (in addition to arrows) |
| `multiple` | `boolean` | `true` | Allow multiple categories open |
| `density` | `'small' \| 'medium'` | `'medium'` | Vertical density |

---

## NavDrawer Types

### Inline NavDrawer

Pushes content aside, stays visible in the layout:

```typescript
<NavDrawer open={isOpen} type="inline">
  {/* ... */}
</NavDrawer>
```

### Overlay NavDrawer

Overlays content with backdrop:

```typescript
import { useRestoreFocusTarget } from '@fluentui/react-components';

export const OverlayNavDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const restoreFocusTargetAttributes = useRestoreFocusTarget();

  return (
    <>
      <NavDrawer
        open={isOpen}
        type="overlay"
        onOpenChange={(_, { open }) => setIsOpen(open)}
      >
        <NavDrawerHeader>
          <Hamburger onClick={() => setIsOpen(false)} />
        </NavDrawerHeader>
        <NavDrawerBody>
          {/* Navigation items */}
        </NavDrawerBody>
      </NavDrawer>

      {/* Trigger button with focus restoration */}
      <Hamburger
        onClick={() => setIsOpen(true)}
        {...restoreFocusTargetAttributes}
        aria-expanded={isOpen}
      />
    </>
  );
};
```

---

## AppItem & AppItemStatic

Use AppItem for branding at the top of navigation:

```typescript
import { AppItem, AppItemStatic } from '@fluentui/react-components';
import { PersonCircle32Regular } from '@fluentui/react-icons';

// Clickable app item (e.g., link to home)
<AppItem
  icon={<PersonCircle32Regular />}
  as="a"
  href="/"
>
  My Application
</AppItem>

// Static (non-interactive) app item
<AppItemStatic icon={<PersonCircle32Regular />}>
  My Application
</AppItemStatic>
```

---

## SplitNavItem

SplitNavItem provides a nav item with a secondary action button:

```typescript
import * as React from 'react';
import {
  NavDrawer,
  NavDrawerBody,
  SplitNavItem,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from '@fluentui/react-components';
import { Pin20Regular, MoreHorizontal20Regular } from '@fluentui/react-icons';

export const SplitNavItemExample: React.FC = () => {
  const [isPinned, setIsPinned] = React.useState(false);

  return (
    <NavDrawer open type="inline">
      <NavDrawerBody>
        {/* SplitNavItem with toggle button (e.g., pin) */}
        <SplitNavItem
          navItem={{
            value: 'dashboard',
            icon: <Board20Regular />,
            children: 'Dashboard',
          }}
          toggleButton={{
            icon: <Pin20Regular />,
            checked: isPinned,
            onClick: () => setIsPinned(!isPinned),
          }}
          toggleButtonTooltip={{
            content: isPinned ? 'Unpin' : 'Pin',
            relationship: 'label',
          }}
        />

        {/* SplitNavItem with menu */}
        <Menu>
          <MenuTrigger>
            {(triggerProps) => (
              <SplitNavItem
                navItem={{
                  value: 'reports',
                  icon: <DocumentRegular />,
                  children: 'Reports',
                }}
                menuButton={triggerProps}
                menuButtonTooltip={{
                  content: 'More options',
                  relationship: 'label',
                }}
              />
            )}
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem>Open in new tab</MenuItem>
              <MenuItem>Share</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </NavDrawerBody>
    </NavDrawer>
  );
};
```

---

## Controlled Navigation

```typescript
import * as React from 'react';
import {
  Nav,
  NavItem,
  NavCategory,
  NavCategoryItem,
  NavSubItem,
  NavSubItemGroup,
} from '@fluentui/react-components';
import type { OnNavItemSelectData } from '@fluentui/react-components';

export const ControlledNav: React.FC = () => {
  const [selectedValue, setSelectedValue] = React.useState<string>('home');
  const [openCategories, setOpenCategories] = React.useState<string[]>(['reports']);

  const handleSelect = (_: unknown, data: OnNavItemSelectData) => {
    setSelectedValue(data.value);
  };

  const handleCategoryToggle = (_: unknown, data: OnNavItemSelectData) => {
    const { value } = data;
    setOpenCategories(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  return (
    <Nav
      selectedValue={selectedValue}
      openCategories={openCategories}
      onNavItemSelect={handleSelect}
      onNavCategoryItemToggle={handleCategoryToggle}
      multiple={false}
    >
      <NavItem value="home">Home</NavItem>
      <NavCategory value="reports">
        <NavCategoryItem>Reports</NavCategoryItem>
        <NavSubItemGroup>
          <NavSubItem value="sales">Sales</NavSubItem>
          <NavSubItem value="analytics">Analytics</NavSubItem>
        </NavSubItemGroup>
      </NavCategory>
    </Nav>
  );
};
```

---

## With React Router

```typescript
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  NavDrawer,
  NavDrawerHeader,
  NavDrawerBody,
  NavItem,
  NavCategory,
  NavCategoryItem,
  NavSubItem,
  NavSubItemGroup,
  Hamburger,
} from '@fluentui/react-components';
import type { OnNavItemSelectData } from '@fluentui/react-components';

export const RouterNavDrawer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(true);

  const handleSelect = (_: unknown, data: OnNavItemSelectData) => {
    navigate(data.value);
  };

  return (
    <NavDrawer
      open={isOpen}
      type="inline"
      selectedValue={location.pathname}
      onNavItemSelect={handleSelect}
    >
      <NavDrawerHeader>
        <Hamburger onClick={() => setIsOpen(!isOpen)} />
      </NavDrawerHeader>
      <NavDrawerBody>
        <NavItem value="/">Home</NavItem>
        <NavCategory value="users">
          <NavCategoryItem>Users</NavCategoryItem>
          <NavSubItemGroup>
            <NavSubItem value="/users/list">All Users</NavSubItem>
            <NavSubItem value="/users/active">Active</NavSubItem>
          </NavSubItemGroup>
        </NavCategory>
        <NavItem value="/settings">Settings</NavItem>
      </NavDrawerBody>
    </NavDrawer>
  );
};
```

---

## Density Variants

```typescript
// Small density - more compact vertical spacing
<NavDrawer density="small" open type="inline">
  {/* ... */}
</NavDrawer>

// Medium density (default) - standard spacing
<NavDrawer density="medium" open type="inline">
  {/* ... */}
</NavDrawer>
```

---

## Accessibility

### Keyboard Support

| Key | Action |
|-----|--------|
| `Tab` | Move focus to/from Nav |
| `Arrow Up/Down` | Navigate between items |
| `Arrow Right` | Expand category / Move to sub-items |
| `Arrow Left` | Collapse category / Move to parent |
| `Enter` / `Space` | Select item / Toggle category |
| `Home` | Move to first item |
| `End` | Move to last item |
| `Escape` | Close overlay NavDrawer |

### ARIA Attributes

| Element | Attribute | Purpose |
|---------|-----------|---------|
| NavDrawer | `role="navigation"` | Identifies as navigation landmark |
| NavItem | `aria-current` | Indicates current page/item |
| NavCategory | `aria-expanded` | Indicates expanded state |
| NavCategoryItem | `aria-controls` | References controlled content |
| Hamburger | `aria-expanded` | Indicates drawer state |

### Focus Management

```typescript
import { useRestoreFocusTarget } from '@fluentui/react-components';

// For overlay drawers, use useRestoreFocusTarget to restore focus when closed
const restoreFocusTargetAttributes = useRestoreFocusTarget();

<Hamburger
  onClick={() => setIsOpen(true)}
  {...restoreFocusTargetAttributes}
  aria-expanded={isOpen}
/>
```

---

## Best Practices

### ✅ Do's

```typescript
// ✅ Use icons for visual clarity
<NavItem icon={<HomeRegular />} value="home">Home</NavItem>

// ✅ Keep navigation hierarchy shallow (max 2-3 levels)
<NavCategory value="section">
  <NavCategoryItem>Section</NavCategoryItem>
  <NavSubItemGroup>
    <NavSubItem value="item">Item</NavSubItem>
  </NavSubItemGroup>
</NavCategory>

// ✅ Use NavSectionHeader for logical groupings
<NavSectionHeader>Administration</NavSectionHeader>

// ✅ Use AppItem for consistent branding
<AppItem icon={<Logo />}>My App</AppItem>

// ✅ Use inline drawer for persistent navigation
<NavDrawer type="inline" open={true}>

// ✅ Provide aria-expanded on toggle buttons
<Hamburger aria-expanded={isOpen} onClick={toggleNav} />
```

### ❌ Don'ts

```typescript
// ❌ Don't nest too many levels deep
// ❌ Don't use Nav for simple links (use Link or Breadcrumb)
// ❌ Don't mix Nav with other navigation patterns in same area
// ❌ Don't forget to handle focus restoration for overlay drawers
// ❌ Don't use overlay drawer for always-visible navigation
```

---

## See Also

- [Drawer](../overlays/drawer.md) - Base drawer component
- [Tabs](tabs.md) - Horizontal tab navigation
- [Breadcrumb](breadcrumb.md) - Location breadcrumbs
- [Menu](menu.md) - Dropdown menus
- [Component Index](../00-component-index.md) - All components