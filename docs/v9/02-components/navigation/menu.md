# Menu

> **Package**: `@fluentui/react-menu`
> **Import**: `import { Menu, MenuTrigger, MenuPopover, MenuList, MenuItem } from '@fluentui/react-components'`
> **Category**: Navigation

## Overview

Menu displays a list of actions or options that users can choose from. It consists of a trigger element, a popover container, and menu items organized in a list.

---

## Basic Usage

```typescript
import * as React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Button,
} from '@fluentui/react-components';

export const BasicMenu: React.FC = () => (
  <Menu>
    <MenuTrigger>
      <Button>Open Menu</Button>
    </MenuTrigger>
    <MenuPopover>
      <MenuList>
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
      </MenuList>
    </MenuPopover>
  </Menu>
);
```

---

## Component Structure

Menu is composed of several components:

| Component | Purpose |
|-----------|---------|
| `Menu` | Root component, manages state and context |
| `MenuTrigger` | Wraps the element that opens the menu |
| `MenuPopover` | The floating container for menu content |
| `MenuList` | Container for menu items |
| `MenuItem` | Individual menu action |
| `MenuItemCheckbox` | Checkbox menu item |
| `MenuItemRadio` | Radio button menu item |
| `MenuDivider` | Visual separator |
| `MenuGroup` | Groups related items with optional header |
| `MenuGroupHeader` | Header for a menu group |
| `MenuSplitGroup` | Container for split menu items |

---

## Menu Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state |
| `onOpenChange` | `(ev, data) => void` | - | Open state change handler |
| `positioning` | `PositioningProps` | `'below'` | Popover positioning |
| `closeOnScroll` | `boolean` | `false` | Close menu on scroll |
| `openOnHover` | `boolean` | `false` | Open on mouse hover |
| `openOnContext` | `boolean` | `false` | Open on right-click |
| `hoverDelay` | `number` | `250` | Hover delay in ms |
| `checkedValues` | `Record<string, string[]>` | - | Controlled checked items |
| `defaultCheckedValues` | `Record<string, string[]>` | - | Default checked items |
| `onCheckedValueChange` | `(ev, data) => void` | - | Check change handler |

## MenuItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Disabled state |
| `icon` | `Slot<'span'>` | - | Leading icon |
| `secondaryContent` | `Slot<'span'>` | - | Secondary text (e.g., keyboard shortcut) |
| `hasSubmenu` | `boolean` | - | Indicates submenu presence |
| `persistOnClick` | `boolean` | `false` | Keep menu open on click |

---

## Controlled vs Uncontrolled

### Uncontrolled

```typescript
import * as React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Button,
} from '@fluentui/react-components';

export const UncontrolledMenu: React.FC = () => (
  <Menu defaultOpen={false}>
    <MenuTrigger>
      <Button>Actions</Button>
    </MenuTrigger>
    <MenuPopover>
      <MenuList>
        <MenuItem>Option 1</MenuItem>
        <MenuItem>Option 2</MenuItem>
      </MenuList>
    </MenuPopover>
  </Menu>
);
```

### Controlled

```typescript
import * as React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import type { MenuProps } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    alignItems: 'center',
  },
});

export const ControlledMenu: React.FC = () => {
  const styles = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpenChange: MenuProps['onOpenChange'] = (_, data) => {
    setOpen(data.open);
  };

  return (
    <div className={styles.container}>
      <Menu open={open} onOpenChange={handleOpenChange}>
        <MenuTrigger>
          <Button>Actions</Button>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem onClick={() => console.log('Edit')}>Edit</MenuItem>
            <MenuItem onClick={() => console.log('Delete')}>Delete</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
      <span>Menu is {open ? 'open' : 'closed'}</span>
    </div>
  );
};
```

---

## With Icons

```typescript
import * as React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
} from '@fluentui/react-components';
import {
  CutRegular,
  CopyRegular,
  ClipboardPasteRegular,
  DeleteRegular,
} from '@fluentui/react-icons';

export const MenuWithIcons: React.FC = () => (
  <Menu>
    <MenuTrigger>
      <Button>Edit</Button>
    </MenuTrigger>
    <MenuPopover>
      <MenuList>
        <MenuItem icon={<CutRegular />}>Cut</MenuItem>
        <MenuItem icon={<CopyRegular />}>Copy</MenuItem>
        <MenuItem icon={<ClipboardPasteRegular />}>Paste</MenuItem>
        <MenuDivider />
        <MenuItem icon={<DeleteRegular />}>Delete</MenuItem>
      </MenuList>
    </MenuPopover>
  </Menu>
);
```

---

## Keyboard Shortcuts

```typescript
import * as React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Button,
} from '@fluentui/react-components';
import {
  CutRegular,
  CopyRegular,
  ClipboardPasteRegular,
} from '@fluentui/react-icons';

export const MenuWithShortcuts: React.FC = () => (
  <Menu>
    <MenuTrigger>
      <Button>Edit</Button>
    </MenuTrigger>
    <MenuPopover>
      <MenuList>
        <MenuItem icon={<CutRegular />} secondaryContent="Ctrl+X">
          Cut
        </MenuItem>
        <MenuItem icon={<CopyRegular />} secondaryContent="Ctrl+C">
          Copy
        </MenuItem>
        <MenuItem icon={<ClipboardPasteRegular />} secondaryContent="Ctrl+V">
          Paste
        </MenuItem>
      </MenuList>
    </MenuPopover>
  </Menu>
);
```

---

## Menu Divider and Groups

```typescript
import * as React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuDivider,
  MenuGroup,
  MenuGroupHeader,
  Button,
} from '@fluentui/react-components';

export const GroupedMenu: React.FC = () => (
  <Menu>
    <MenuTrigger>
      <Button>Options</Button>
    </MenuTrigger>
    <MenuPopover>
      <MenuList>
        <MenuGroup>
          <MenuGroupHeader>File Operations</MenuGroupHeader>
          <MenuItem>New</MenuItem>
          <MenuItem>Open</MenuItem>
          <MenuItem>Save</MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup>
          <MenuGroupHeader>Edit Operations</MenuGroupHeader>
          <MenuItem>Undo</MenuItem>
          <MenuItem>Redo</MenuItem>
        </MenuGroup>
      </MenuList>
    </MenuPopover>
  </Menu>
);
```

---

## Checkbox Items

```typescript
import * as React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItemCheckbox,
  Button,
} from '@fluentui/react-components';
import type { MenuProps } from '@fluentui/react-components';

export const CheckboxMenu: React.FC = () => {
  const [checkedValues, setCheckedValues] = React.useState<Record<string, string[]>>({
    options: ['bold'],
  });

  const handleCheckedChange: MenuProps['onCheckedValueChange'] = (_, data) => {
    setCheckedValues({ [data.name]: data.checkedItems });
  };

  return (
    <Menu checkedValues={checkedValues} onCheckedValueChange={handleCheckedChange}>
      <MenuTrigger>
        <Button>Formatting</Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItemCheckbox name="options" value="bold">
            Bold
          </MenuItemCheckbox>
          <MenuItemCheckbox name="options" value="italic">
            Italic
          </MenuItemCheckbox>
          <MenuItemCheckbox name="options" value="underline">
            Underline
          </MenuItemCheckbox>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};
```

---

## Radio Items

```typescript
import * as React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItemRadio,
  Button,
} from '@fluentui/react-components';
import type { MenuProps } from '@fluentui/react-components';

export const RadioMenu: React.FC = () => {
  const [checkedValues, setCheckedValues] = React.useState<Record<string, string[]>>({
    alignment: ['left'],
  });

  const handleCheckedChange: MenuProps['onCheckedValueChange'] = (_, data) => {
    setCheckedValues({ [data.name]: data.checkedItems });
  };

  return (
    <Menu checkedValues={checkedValues} onCheckedValueChange={handleCheckedChange}>
      <MenuTrigger>
        <Button>Align</Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItemRadio name="alignment" value="left">
            Left
          </MenuItemRadio>
          <MenuItemRadio name="alignment" value="center">
            Center
          </MenuItemRadio>
          <MenuItemRadio name="alignment" value="right">
            Right
          </MenuItemRadio>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};
```

---

## Submenus

```typescript
import * as React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Button,
} from '@fluentui/react-components';

export const SubmenuExample: React.FC = () => (
  <Menu>
    <MenuTrigger>
      <Button>Actions</Button>
    </MenuTrigger>
    <MenuPopover>
      <MenuList>
        <MenuItem>New</MenuItem>
        <MenuItem>Open</MenuItem>
        
        {/* Submenu */}
        <Menu>
          <MenuTrigger>
            <MenuItem>Share</MenuItem>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem>Email</MenuItem>
              <MenuItem>Teams</MenuItem>
              <MenuItem>Copy Link</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
        
        <MenuItem>Download</MenuItem>
      </MenuList>
    </MenuPopover>
  </Menu>
);
```

---

## Context Menu

```typescript
import * as React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  target: {
    padding: tokens.spacingHorizontalXL,
    backgroundColor: tokens.colorNeutralBackground2,
    border: `1px dashed ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    textAlign: 'center',
  },
});

export const ContextMenu: React.FC = () => {
  const styles = useStyles();

  return (
    <Menu openOnContext>
      <MenuTrigger>
        <div className={styles.target}>
          Right-click here
        </div>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem>Cut</MenuItem>
          <MenuItem>Copy</MenuItem>
          <MenuItem>Paste</MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};
```

---

## Positioning

```typescript
import * as React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
  },
});

export const MenuPositioning: React.FC = () => {
  const styles = useStyles();

  const positions = ['above', 'below', 'before', 'after'] as const;

  return (
    <div className={styles.container}>
      {positions.map(position => (
        <Menu key={position} positioning={position}>
          <MenuTrigger>
            <Button>{position}</Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem>Option 1</MenuItem>
              <MenuItem>Option 2</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      ))}
    </div>
  );
};
```

---

## Disabled Items

```typescript
import * as React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Button,
} from '@fluentui/react-components';

export const DisabledItems: React.FC = () => (
  <Menu>
    <MenuTrigger>
      <Button>Actions</Button>
    </MenuTrigger>
    <MenuPopover>
      <MenuList>
        <MenuItem>Available Action</MenuItem>
        <MenuItem disabled>Disabled Action</MenuItem>
        <MenuItem>Another Available Action</MenuItem>
      </MenuList>
    </MenuPopover>
  </Menu>
);
```

---

## Accessibility

### Keyboard Support

| Key | Action |
|-----|--------|
| `Enter` / `Space` | Open menu / Select item |
| `Escape` | Close menu |
| `Arrow Down` | Move to next item |
| `Arrow Up` | Move to previous item |
| `Arrow Right` | Open submenu |
| `Arrow Left` | Close submenu |
| `Home` | Move to first item |
| `End` | Move to last item |
| `Tab` | Close menu, move focus |

### ARIA Attributes

| Element | Attribute | Value |
|---------|-----------|-------|
| MenuTrigger | `aria-haspopup` | `menu` |
| MenuTrigger | `aria-expanded` | `true/false` |
| MenuList | `role` | `menu` |
| MenuItem | `role` | `menuitem` |
| MenuItemCheckbox | `role` | `menuitemcheckbox` |
| MenuItemRadio | `role` | `menuitemradio` |

---

## Best Practices

### ✅ Do's

```typescript
// ✅ Use icons for common actions
<MenuItem icon={<CopyRegular />}>Copy</MenuItem>

// ✅ Show keyboard shortcuts
<MenuItem secondaryContent="Ctrl+S">Save</MenuItem>

// ✅ Group related items
<MenuGroup>
  <MenuGroupHeader>View</MenuGroupHeader>
  <MenuItem>Zoom In</MenuItem>
  <MenuItem>Zoom Out</MenuItem>
</MenuGroup>

// ✅ Use appropriate trigger
<MenuTrigger>
  <MenuButton>Options</MenuButton>
</MenuTrigger>
```

### ❌ Don'ts

```typescript
// ❌ Don't nest too many levels of submenus
// Maximum 2 levels recommended

// ❌ Don't use menu for navigation (use Nav or Tabs)
<MenuItem onClick={() => navigate('/page')}>Page</MenuItem>

// ❌ Don't overload with too many items
// Keep menus focused and organized
```

---

## See Also

- [MenuButton](../buttons/menu-button.md) - Button that opens a menu
- [SplitButton](../buttons/split-button.md) - Button with dropdown
- [Tabs](tabs.md) - Tab navigation
- [Component Index](../00-component-index.md) - All components