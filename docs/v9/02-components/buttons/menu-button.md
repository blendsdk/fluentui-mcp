# MenuButton

> **Package**: `@fluentui/react-button`
> **Import**: `import { MenuButton } from '@fluentui/react-components'`
> **Category**: Buttons

## Overview

MenuButton is a button designed to open a menu. It includes a built-in menu indicator icon and is typically used with the Menu component.

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
  MenuButton,
} from '@fluentui/react-components';

export const BasicMenuButton: React.FC = () => (
  <Menu>
    <MenuTrigger>
      <MenuButton>Actions</MenuButton>
    </MenuTrigger>
    <MenuPopover>
      <MenuList>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Duplicate</MenuItem>
        <MenuItem>Delete</MenuItem>
      </MenuList>
    </MenuPopover>
  </Menu>
);
```

---

## Props Reference

Inherits all [Button props](button.md) except `iconPosition`, plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `menuIcon` | `Slot<'span'>` | ChevronDown | Custom menu indicator icon |

### Slots

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<button>` | Root element |
| `icon` | `<span>` | Leading icon container |
| `menuIcon` | `<span>` | Menu indicator icon (chevron) |

---

## Appearance Variants

```typescript
import * as React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuButton,
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

export const MenuButtonAppearances: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Menu>
        <MenuTrigger>
          <MenuButton appearance="secondary">Secondary</MenuButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem>Option 1</MenuItem>
            <MenuItem>Option 2</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      <Menu>
        <MenuTrigger>
          <MenuButton appearance="primary">Primary</MenuButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem>Option 1</MenuItem>
            <MenuItem>Option 2</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      <Menu>
        <MenuTrigger>
          <MenuButton appearance="outline">Outline</MenuButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem>Option 1</MenuItem>
            <MenuItem>Option 2</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      <Menu>
        <MenuTrigger>
          <MenuButton appearance="subtle">Subtle</MenuButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem>Option 1</MenuItem>
            <MenuItem>Option 2</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      <Menu>
        <MenuTrigger>
          <MenuButton appearance="transparent">Transparent</MenuButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem>Option 1</MenuItem>
            <MenuItem>Option 2</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );
};
```

---

## With Leading Icon

```typescript
import * as React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuButton,
} from '@fluentui/react-components';
import { PersonRegular, SettingsRegular, SignOutRegular } from '@fluentui/react-icons';

export const MenuButtonWithIcon: React.FC = () => (
  <Menu>
    <MenuTrigger>
      <MenuButton icon={<PersonRegular />}>Account</MenuButton>
    </MenuTrigger>
    <MenuPopover>
      <MenuList>
        <MenuItem icon={<PersonRegular />}>Profile</MenuItem>
        <MenuItem icon={<SettingsRegular />}>Settings</MenuItem>
        <MenuItem icon={<SignOutRegular />}>Sign out</MenuItem>
      </MenuList>
    </MenuPopover>
  </Menu>
);
```

---

## Custom Menu Icon

```typescript
import * as React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuButton,
} from '@fluentui/react-components';
import { MoreHorizontalRegular, ChevronRightRegular } from '@fluentui/react-icons';

export const CustomMenuIcon: React.FC = () => (
  <Menu>
    <MenuTrigger>
      {/* Replace default chevron with custom icon */}
      <MenuButton menuIcon={<MoreHorizontalRegular />}>More</MenuButton>
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

---

## Size Variants

```typescript
import * as React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuButton,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
});

export const MenuButtonSizes: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Menu>
        <MenuTrigger>
          <MenuButton size="small">Small</MenuButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem>Option</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      <Menu>
        <MenuTrigger>
          <MenuButton size="medium">Medium</MenuButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem>Option</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      <Menu>
        <MenuTrigger>
          <MenuButton size="large">Large</MenuButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem>Option</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );
};
```

---

## Common Use Cases

### Actions Dropdown

```typescript
import * as React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuDivider,
  MenuButton,
} from '@fluentui/react-components';
import {
  EditRegular,
  CopyRegular,
  ShareRegular,
  DeleteRegular,
} from '@fluentui/react-icons';

export const ActionsDropdown: React.FC = () => (
  <Menu>
    <MenuTrigger>
      <MenuButton appearance="primary">Actions</MenuButton>
    </MenuTrigger>
    <MenuPopover>
      <MenuList>
        <MenuItem icon={<EditRegular />}>Edit</MenuItem>
        <MenuItem icon={<CopyRegular />}>Duplicate</MenuItem>
        <MenuItem icon={<ShareRegular />}>Share</MenuItem>
        <MenuDivider />
        <MenuItem icon={<DeleteRegular />}>Delete</MenuItem>
      </MenuList>
    </MenuPopover>
  </Menu>
);
```

### User Account Menu

```typescript
import * as React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuDivider,
  MenuButton,
  Avatar,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  PersonRegular,
  SettingsRegular,
  QuestionCircleRegular,
  SignOutRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  menuButton: {
    minWidth: 'auto',
    padding: tokens.spacingHorizontalS,
  },
});

export const UserAccountMenu: React.FC = () => {
  const styles = useStyles();

  return (
    <Menu>
      <MenuTrigger>
        <MenuButton
          appearance="subtle"
          icon={<Avatar name="John Doe" size={24} />}
          className={styles.menuButton}
        >
          John Doe
        </MenuButton>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem icon={<PersonRegular />}>Profile</MenuItem>
          <MenuItem icon={<SettingsRegular />}>Settings</MenuItem>
          <MenuItem icon={<QuestionCircleRegular />}>Help</MenuItem>
          <MenuDivider />
          <MenuItem icon={<SignOutRegular />}>Sign out</MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};
```

### Sort Options Menu

```typescript
import * as React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItemRadio,
  MenuButton,
} from '@fluentui/react-components';
import type { MenuProps } from '@fluentui/react-components';
import { ArrowSortRegular } from '@fluentui/react-icons';

export const SortOptionsMenu: React.FC = () => {
  const [checkedValues, setCheckedValues] = React.useState<Record<string, string[]>>({
    sort: ['date'],
  });

  const onChange: MenuProps['onCheckedValueChange'] = (_, { name, checkedItems }) => {
    setCheckedValues({ [name]: checkedItems });
  };

  return (
    <Menu checkedValues={checkedValues} onCheckedValueChange={onChange}>
      <MenuTrigger>
        <MenuButton icon={<ArrowSortRegular />}>Sort by</MenuButton>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItemRadio name="sort" value="name">Name</MenuItemRadio>
          <MenuItemRadio name="sort" value="date">Date modified</MenuItemRadio>
          <MenuItemRadio name="sort" value="size">Size</MenuItemRadio>
          <MenuItemRadio name="sort" value="type">Type</MenuItemRadio>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};
```

---

## Disabled State

```typescript
import * as React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuButton,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
  },
});

export const DisabledMenuButtons: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      {/* Disabled MenuButton */}
      <Menu>
        <MenuTrigger>
          <MenuButton disabled>Disabled</MenuButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem>Won't open</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      {/* Disabled focusable MenuButton */}
      <Menu>
        <MenuTrigger>
          <MenuButton disabledFocusable>Disabled Focusable</MenuButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem>Won't open</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );
};
```

---

## Accessibility

### Requirements

1. **Use with Menu component** - MenuButton should be wrapped with MenuTrigger
2. **ARIA attributes are automatic** - Menu handles aria-haspopup, aria-expanded
3. **Keyboard navigation** - Menu handles all keyboard interactions

### Keyboard Support

| Key | Action |
|-----|--------|
| `Enter` | Opens the menu |
| `Space` | Opens the menu |
| `ArrowDown` | Opens menu and moves to first item |
| `ArrowUp` | Opens menu and moves to last item |
| `Escape` | Closes the menu |

### ARIA Attributes

| Attribute | Value | Applied By |
|-----------|-------|------------|
| `aria-haspopup` | `menu` | MenuTrigger |
| `aria-expanded` | `true/false` | MenuTrigger |

---

## Styling Customization

### Custom Menu Icon Color

```typescript
import * as React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuButton,
  makeStyles,
  tokens,
  menuButtonClassNames,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  customMenuButton: {
    [`& .${menuButtonClassNames.menuIcon}`]: {
      color: tokens.colorBrandForeground1,
    },
  },
});

export const CustomStyledMenuButton: React.FC = () => {
  const styles = useStyles();

  return (
    <Menu>
      <MenuTrigger>
        <MenuButton className={styles.customMenuButton}>
          Custom Icon Color
        </MenuButton>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem>Option 1</MenuItem>
          <MenuItem>Option 2</MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};
```

---

## Best Practices

### ✅ Do's

```typescript
// ✅ Always use with Menu component
<Menu>
  <MenuTrigger>
    <MenuButton>Actions</MenuButton>
  </MenuTrigger>
  <MenuPopover>
    <MenuList>{/* items */}</MenuList>
  </MenuPopover>
</Menu>

// ✅ Use descriptive labels
<MenuButton>Export options</MenuButton>

// ✅ Use icons to enhance understanding
<MenuButton icon={<FilterRegular />}>Filters</MenuButton>
```

### ❌ Don'ts

```typescript
// ❌ Don't use MenuButton without Menu
<MenuButton>Orphan Button</MenuButton> // No menu will open

// ❌ Don't use vague labels
<MenuButton>Click here</MenuButton>

// ❌ Don't use for single actions (use regular Button)
<MenuButton>Save</MenuButton> // Use Button if no dropdown needed
```

---

## See Also

- [Button](button.md) - Standard action button
- [SplitButton](split-button.md) - Button with primary action and dropdown
- [Menu](../navigation/menu.md) - Menu component reference
- [Component Index](../00-component-index.md) - All components