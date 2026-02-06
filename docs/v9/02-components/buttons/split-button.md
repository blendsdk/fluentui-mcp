# SplitButton

> **Package**: `@fluentui/react-button`
> **Import**: `import { SplitButton } from '@fluentui/react-components'`
> **Category**: Buttons

## Overview

SplitButton combines a primary action button with a dropdown menu for secondary actions. Use it when there's one primary action that users commonly take, with less common alternatives available in the dropdown.

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
  SplitButton,
} from '@fluentui/react-components';

export const BasicSplitButton: React.FC = () => (
  <Menu positioning="below-end">
    <MenuTrigger>
      {(triggerProps) => (
        <SplitButton
          menuButton={triggerProps}
          primaryActionButton={{ onClick: () => console.log('Save') }}
        >
          Save
        </SplitButton>
      )}
    </MenuTrigger>
    <MenuPopover>
      <MenuList>
        <MenuItem>Save as...</MenuItem>
        <MenuItem>Save a copy</MenuItem>
        <MenuItem>Export</MenuItem>
      </MenuList>
    </MenuPopover>
  </Menu>
);
```

---

## Props Reference

Inherits Button and MenuButton props, plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `menuButton` | `Slot<typeof MenuButton>` | - | Props for the menu button (dropdown trigger) |
| `primaryActionButton` | `Slot<typeof Button>` | - | Props for the primary action button |

### Slots

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<div>` | Root wrapper element |
| `primaryActionButton` | `Button` | Primary action button |
| `menuButton` | `MenuButton` | Dropdown trigger button |

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
  SplitButton,
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

export const SplitButtonAppearances: React.FC = () => {
  const styles = useStyles();

  const createSplitButton = (appearance: 'secondary' | 'primary' | 'outline' | 'subtle' | 'transparent') => (
    <Menu positioning="below-end">
      <MenuTrigger>
        {(triggerProps) => (
          <SplitButton
            appearance={appearance}
            menuButton={triggerProps}
          >
            {appearance.charAt(0).toUpperCase() + appearance.slice(1)}
          </SplitButton>
        )}
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem>Option 1</MenuItem>
          <MenuItem>Option 2</MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );

  return (
    <div className={styles.container}>
      {createSplitButton('secondary')}
      {createSplitButton('primary')}
      {createSplitButton('outline')}
      {createSplitButton('subtle')}
      {createSplitButton('transparent')}
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
  SplitButton,
} from '@fluentui/react-components';
import {
  SaveRegular,
  DocumentSaveRegular,
  DocumentCopyRegular,
  ArrowExportRegular,
} from '@fluentui/react-icons';

export const SplitButtonWithIcon: React.FC = () => (
  <Menu positioning="below-end">
    <MenuTrigger>
      {(triggerProps) => (
        <SplitButton
          appearance="primary"
          icon={<SaveRegular />}
          menuButton={triggerProps}
          primaryActionButton={{ onClick: () => console.log('Quick save') }}
        >
          Save
        </SplitButton>
      )}
    </MenuTrigger>
    <MenuPopover>
      <MenuList>
        <MenuItem icon={<DocumentSaveRegular />}>Save as...</MenuItem>
        <MenuItem icon={<DocumentCopyRegular />}>Save a copy</MenuItem>
        <MenuItem icon={<ArrowExportRegular />}>Export</MenuItem>
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
  SplitButton,
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

export const SplitButtonSizes: React.FC = () => {
  const styles = useStyles();

  const createSplitButton = (size: 'small' | 'medium' | 'large') => (
    <Menu positioning="below-end">
      <MenuTrigger>
        {(triggerProps) => (
          <SplitButton size={size} menuButton={triggerProps}>
            {size.charAt(0).toUpperCase() + size.slice(1)}
          </SplitButton>
        )}
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem>Option</MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );

  return (
    <div className={styles.container}>
      {createSplitButton('small')}
      {createSplitButton('medium')}
      {createSplitButton('large')}
    </div>
  );
};
```

---

## Common Use Cases

### Save Actions

```typescript
import * as React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuDivider,
  SplitButton,
} from '@fluentui/react-components';
import { SaveRegular } from '@fluentui/react-icons';

export const SaveSplitButton: React.FC = () => {
  const handleSave = React.useCallback(() => {
    console.log('Document saved');
  }, []);

  return (
    <Menu positioning="below-end">
      <MenuTrigger>
        {(triggerProps) => (
          <SplitButton
            appearance="primary"
            icon={<SaveRegular />}
            menuButton={triggerProps}
            primaryActionButton={{ onClick: handleSave }}
          >
            Save
          </SplitButton>
        )}
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem onClick={() => console.log('Save as')}>
            Save as...
          </MenuItem>
          <MenuItem onClick={() => console.log('Save a copy')}>
            Save a copy
          </MenuItem>
          <MenuDivider />
          <MenuItem onClick={() => console.log('Export PDF')}>
            Export as PDF
          </MenuItem>
          <MenuItem onClick={() => console.log('Export Word')}>
            Export as Word
          </MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};
```

### Send Email Actions

```typescript
import * as React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuDivider,
  SplitButton,
} from '@fluentui/react-components';
import {
  SendRegular,
  CalendarLtrRegular,
  DocumentRegular,
} from '@fluentui/react-icons';

export const SendEmailSplitButton: React.FC = () => {
  const handleSend = React.useCallback(() => {
    console.log('Email sent');
  }, []);

  return (
    <Menu positioning="below-end">
      <MenuTrigger>
        {(triggerProps) => (
          <SplitButton
            appearance="primary"
            icon={<SendRegular />}
            menuButton={triggerProps}
            primaryActionButton={{ onClick: handleSend }}
          >
            Send
          </SplitButton>
        )}
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem icon={<CalendarLtrRegular />}>
            Schedule send
          </MenuItem>
          <MenuItem icon={<DocumentRegular />}>
            Save as draft
          </MenuItem>
          <MenuDivider />
          <MenuItem>
            Send with tracking
          </MenuItem>
          <MenuItem>
            Send with high importance
          </MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};
```

### Create Actions

```typescript
import * as React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuDivider,
  SplitButton,
} from '@fluentui/react-components';
import {
  AddRegular,
  DocumentRegular,
  FolderRegular,
  TableRegular,
} from '@fluentui/react-icons';

export const CreateSplitButton: React.FC = () => {
  const handleCreate = React.useCallback(() => {
    console.log('Create blank document');
  }, []);

  return (
    <Menu positioning="below-end">
      <MenuTrigger>
        {(triggerProps) => (
          <SplitButton
            appearance="primary"
            icon={<AddRegular />}
            menuButton={triggerProps}
            primaryActionButton={{ onClick: handleCreate }}
          >
            New
          </SplitButton>
        )}
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem icon={<DocumentRegular />}>
            New document
          </MenuItem>
          <MenuItem icon={<TableRegular />}>
            New spreadsheet
          </MenuItem>
          <MenuItem icon={<FolderRegular />}>
            New folder
          </MenuItem>
          <MenuDivider />
          <MenuItem>
            From template...
          </MenuItem>
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
  SplitButton,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
  },
});

export const DisabledSplitButtons: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      {/* Fully disabled */}
      <Menu positioning="below-end">
        <MenuTrigger>
          {(triggerProps) => (
            <SplitButton disabled menuButton={triggerProps}>
              Disabled
            </SplitButton>
          )}
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem>Won't open</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      {/* Only primary disabled */}
      <Menu positioning="below-end">
        <MenuTrigger>
          {(triggerProps) => (
            <SplitButton
              menuButton={triggerProps}
              primaryActionButton={{ disabled: true }}
            >
              Primary Disabled
            </SplitButton>
          )}
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem>Menu still works</MenuItem>
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

1. **Use with Menu component** - SplitButton dropdown should use Menu for accessibility
2. **Primary action is keyboard accessible** - Enter/Space triggers primary action
3. **Dropdown is separately accessible** - Tab focuses dropdown separately

### Keyboard Support

| Key | Focus on Primary | Focus on Dropdown |
|-----|-----------------|-------------------|
| `Enter` | Triggers primary action | Opens menu |
| `Space` | Triggers primary action | Opens menu |
| `ArrowDown` | - | Opens menu, moves to first item |
| `Tab` | Moves to dropdown button | Moves to next element |

### ARIA Attributes

| Attribute | Element | Description |
|-----------|---------|-------------|
| `aria-haspopup` | menuButton | Indicates dropdown has menu |
| `aria-expanded` | menuButton | Menu open state |

---

## Styling Customization

### Custom Styled SplitButton

```typescript
import * as React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  SplitButton,
  makeStyles,
  tokens,
  splitButtonClassNames,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  customSplitButton: {
    // Style the primary button
    [`& .${splitButtonClassNames.primaryActionButton}`]: {
      backgroundColor: tokens.colorPaletteGreenBackground3,
      ':hover': {
        backgroundColor: tokens.colorPaletteGreenBackground3,
      },
    },
    // Style the menu button
    [`& .${splitButtonClassNames.menuButton}`]: {
      backgroundColor: tokens.colorPaletteGreenBackground3,
      ':hover': {
        backgroundColor: tokens.colorPaletteGreenBackground3,
      },
    },
  },
});

export const CustomStyledSplitButton: React.FC = () => {
  const styles = useStyles();

  return (
    <Menu positioning="below-end">
      <MenuTrigger>
        {(triggerProps) => (
          <SplitButton
            className={styles.customSplitButton}
            menuButton={triggerProps}
          >
            Custom Style
          </SplitButton>
        )}
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
// ✅ Use when there's a clear primary action
<SplitButton primaryActionButton={{ onClick: handleSave }}>
  Save
</SplitButton>
// With dropdown for: Save as, Export, etc.

// ✅ Use primary appearance for important actions
<SplitButton appearance="primary">
  Send
</SplitButton>

// ✅ Position menu appropriately
<Menu positioning="below-end">
  <MenuTrigger>
    {(triggerProps) => (
      <SplitButton menuButton={triggerProps}>Action</SplitButton>
    )}
  </MenuTrigger>
  {/* ... */}
</Menu>
```

### ❌ Don'ts

```typescript
// ❌ Don't use when all actions are equally important (use MenuButton)
<SplitButton>Options</SplitButton>
// If there's no "primary" action, use MenuButton instead

// ❌ Don't use without a Menu
<SplitButton>Click</SplitButton>
// SplitButton expects Menu for the dropdown

// ❌ Don't disable only the dropdown while primary is active
// This creates confusing UX where button appears functional but incomplete
```

---

## Comparison with Other Button Types

| Component | Use Case |
|-----------|----------|
| **Button** | Single action |
| **MenuButton** | Multiple equal options |
| **SplitButton** | Primary action + alternatives |

### When to Use SplitButton vs MenuButton

```typescript
// ✅ SplitButton: Clear primary action exists
// Example: "Save" is primary, "Save as" and "Export" are secondary
<SplitButton>Save</SplitButton>

// ✅ MenuButton: All options are equally important
// Example: Sort by name, date, size, type - no clear default
<MenuButton>Sort by</MenuButton>
```

---

## See Also

- [Button](button.md) - Standard action button
- [MenuButton](menu-button.md) - Button that opens a menu
- [Menu](../navigation/menu.md) - Menu component reference
- [Component Index](../00-component-index.md) - All components