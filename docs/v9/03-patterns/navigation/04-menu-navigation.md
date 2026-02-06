# Menu Navigation Patterns - FluentUI v9

> **Topic**: Menu Navigation
> **Components**: `Menu`, `MenuTrigger`, `MenuPopover`, `MenuList`, `MenuItem`, etc.
> **Package**: `@fluentui/react-components`

## Overview

Menus provide contextual actions and navigation options. They appear on demand (triggered by buttons, right-click, etc.) and are ideal for actions that don't need to be visible at all times.

## Basic Imports

```typescript
import {
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
  MenuItemLink,
  makeStyles,
  tokens,
  Button,
} from '@fluentui/react-components';
import {
  EditRegular,
  DeleteRegular,
  CopyRegular,
  CutRegular,
  ClipboardPasteRegular,
  ShareRegular,
  MoreHorizontalRegular,
  SettingsRegular,
  PersonRegular,
  SignOutRegular,
} from '@fluentui/react-icons';
```

## Basic Menu

```tsx
function BasicMenu() {
  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button>Open Menu</Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem icon={<EditRegular />}>Edit</MenuItem>
          <MenuItem icon={<CopyRegular />}>Copy</MenuItem>
          <MenuItem icon={<ClipboardPasteRegular />}>Paste</MenuItem>
          <MenuDivider />
          <MenuItem icon={<DeleteRegular />}>Delete</MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}
```

## Actions Menu (More Options)

```tsx
interface ActionItem {
  id: string;
  label: string;
  icon?: React.ReactElement;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

interface ActionsMenuProps {
  actions: ActionItem[];
  triggerLabel?: string;
}

function ActionsMenu({ actions, triggerLabel = "Actions" }: ActionsMenuProps) {
  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button
          icon={<MoreHorizontalRegular />}
          appearance="subtle"
          aria-label={triggerLabel}
        />
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {actions.map((action, index) => (
            <React.Fragment key={action.id}>
              <MenuItem
                icon={action.icon}
                onClick={action.onClick}
                disabled={action.disabled}
                style={action.danger ? { color: tokens.colorPaletteRedForeground1 } : undefined}
              >
                {action.label}
              </MenuItem>
              {/* Add divider before danger actions */}
              {action.danger && index < actions.length - 1 && <MenuDivider />}
            </React.Fragment>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}

// Usage
const rowActions: ActionItem[] = [
  { id: 'edit', label: 'Edit', icon: <EditRegular />, onClick: () => {} },
  { id: 'copy', label: 'Duplicate', icon: <CopyRegular />, onClick: () => {} },
  { id: 'share', label: 'Share', icon: <ShareRegular />, onClick: () => {} },
  { id: 'delete', label: 'Delete', icon: <DeleteRegular />, onClick: () => {}, danger: true },
];
```

## Context Menu (Right-Click)

```tsx
const useContextMenuStyles = makeStyles({
  area: {
    width: '100%',
    height: '200px',
    border: `2px dashed ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.colorNeutralForeground3,
  },
});

function ContextMenu() {
  const styles = useContextMenuStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  };

  return (
    <>
      <div className={styles.area} onContextMenu={handleContextMenu}>
        Right-click anywhere in this area
      </div>

      <Menu
        open={isOpen}
        onOpenChange={(_, data) => setIsOpen(data.open)}
        positioning={{
          position: 'below',
          align: 'start',
          target: {
            getBoundingClientRect: () => ({
              x: position.x,
              y: position.y,
              top: position.y,
              left: position.x,
              bottom: position.y,
              right: position.x,
              width: 0,
              height: 0,
              toJSON: () => ({}),
            }),
          },
        }}
      >
        <MenuPopover>
          <MenuList>
            <MenuItem icon={<CutRegular />}>Cut</MenuItem>
            <MenuItem icon={<CopyRegular />}>Copy</MenuItem>
            <MenuItem icon={<ClipboardPasteRegular />}>Paste</MenuItem>
            <MenuDivider />
            <MenuItem icon={<EditRegular />}>Edit</MenuItem>
            <MenuItem icon={<DeleteRegular />}>Delete</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
    </>
  );
}
```

## Nested/Submenu Navigation

```tsx
interface NestedMenuItem {
  id: string;
  label: string;
  icon?: React.ReactElement;
  children?: NestedMenuItem[];
  onClick?: () => void;
}

function NestedMenu() {
  const menuItems: NestedMenuItem[] = [
    { id: 'new', label: 'New', icon: <DocumentRegular /> },
    { id: 'open', label: 'Open', icon: <FolderRegular /> },
    {
      id: 'recent',
      label: 'Recent Files',
      icon: <HistoryRegular />,
      children: [
        { id: 'file1', label: 'Document1.docx' },
        { id: 'file2', label: 'Spreadsheet.xlsx' },
        { id: 'file3', label: 'Presentation.pptx' },
      ],
    },
    {
      id: 'export',
      label: 'Export As',
      icon: <ArrowExportRegular />,
      children: [
        { id: 'pdf', label: 'PDF' },
        { id: 'docx', label: 'Word Document' },
        { id: 'html', label: 'HTML' },
      ],
    },
  ];

  const renderMenuItem = (item: NestedMenuItem) => {
    if (item.children) {
      return (
        <Menu key={item.id}>
          <MenuTrigger disableButtonEnhancement>
            <MenuItem icon={item.icon}>{item.label}</MenuItem>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              {item.children.map((child) => renderMenuItem(child))}
            </MenuList>
          </MenuPopover>
        </Menu>
      );
    }

    return (
      <MenuItem key={item.id} icon={item.icon} onClick={item.onClick}>
        {item.label}
      </MenuItem>
    );
  };

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button>File Menu</Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {menuItems.map((item) => renderMenuItem(item))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}
```

## Menu with Selection (Checkbox/Radio)

```tsx
function SelectionMenu() {
  const [checkedItems, setCheckedItems] = useState<string[]>(['notifications']);
  const [selectedView, setSelectedView] = useState('list');

  const toggleChecked = (item: string) => {
    setCheckedItems((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button icon={<SettingsRegular />}>Settings</Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {/* Checkbox Items */}
          <MenuGroup>
            <MenuGroupHeader>Options</MenuGroupHeader>
            <MenuItemCheckbox
              name="settings"
              value="notifications"
              checked={checkedItems.includes('notifications')}
              onChange={() => toggleChecked('notifications')}
            >
              Enable Notifications
            </MenuItemCheckbox>
            <MenuItemCheckbox
              name="settings"
              value="darkMode"
              checked={checkedItems.includes('darkMode')}
              onChange={() => toggleChecked('darkMode')}
            >
              Dark Mode
            </MenuItemCheckbox>
            <MenuItemCheckbox
              name="settings"
              value="autoSave"
              checked={checkedItems.includes('autoSave')}
              onChange={() => toggleChecked('autoSave')}
            >
              Auto Save
            </MenuItemCheckbox>
          </MenuGroup>

          <MenuDivider />

          {/* Radio Items */}
          <MenuGroup>
            <MenuGroupHeader>View</MenuGroupHeader>
            <MenuItemRadio
              name="view"
              value="list"
              checked={selectedView === 'list'}
              onChange={() => setSelectedView('list')}
            >
              List View
            </MenuItemRadio>
            <MenuItemRadio
              name="view"
              value="grid"
              checked={selectedView === 'grid'}
              onChange={() => setSelectedView('grid')}
            >
              Grid View
            </MenuItemRadio>
            <MenuItemRadio
              name="view"
              value="compact"
              checked={selectedView === 'compact'}
              onChange={() => setSelectedView('compact')}
            >
              Compact View
            </MenuItemRadio>
          </MenuGroup>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}
```

## User Profile Menu

```tsx
import { Avatar, Persona, Divider } from '@fluentui/react-components';

const useProfileMenuStyles = makeStyles({
  header: {
    padding: tokens.spacingHorizontalM,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  menuItem: {
    minWidth: '200px',
  },
});

interface User {
  name: string;
  email: string;
  avatar?: string;
}

function UserProfileMenu({ user }: { user: User }) {
  const styles = useProfileMenuStyles();

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button
          appearance="subtle"
          icon={
            <Avatar
              name={user.name}
              image={user.avatar ? { src: user.avatar } : undefined}
              size={28}
            />
          }
        />
      </MenuTrigger>
      <MenuPopover>
        {/* User info header */}
        <div className={styles.header}>
          <Persona
            name={user.name}
            secondaryText={user.email}
            avatar={{ image: user.avatar ? { src: user.avatar } : undefined }}
          />
        </div>
        
        <MenuList>
          <MenuItem icon={<PersonRegular />} className={styles.menuItem}>
            My Profile
          </MenuItem>
          <MenuItem icon={<SettingsRegular />}>
            Account Settings
          </MenuItem>
          <MenuDivider />
          <MenuItem icon={<SignOutRegular />}>
            Sign Out
          </MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}
```

## Menu with Keyboard Shortcuts

```tsx
const useShortcutStyles = makeStyles({
  shortcut: {
    marginLeft: 'auto',
    paddingLeft: tokens.spacingHorizontalL,
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
});

interface MenuItemWithShortcut {
  id: string;
  label: string;
  icon?: React.ReactElement;
  shortcut?: string;
  onClick: () => void;
}

function MenuWithShortcuts() {
  const styles = useShortcutStyles();

  const items: MenuItemWithShortcut[] = [
    { id: 'new', label: 'New', icon: <DocumentRegular />, shortcut: '⌘N', onClick: () => {} },
    { id: 'open', label: 'Open', icon: <FolderRegular />, shortcut: '⌘O', onClick: () => {} },
    { id: 'save', label: 'Save', icon: <SaveRegular />, shortcut: '⌘S', onClick: () => {} },
    { id: 'saveAs', label: 'Save As...', shortcut: '⇧⌘S', onClick: () => {} },
  ];

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button>File</Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {items.map((item) => (
            <MenuItem key={item.id} icon={item.icon} onClick={item.onClick}>
              {item.label}
              {item.shortcut && (
                <span className={styles.shortcut}>{item.shortcut}</span>
              )}
            </MenuItem>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}
```

## Navigation Menu Bar

```tsx
const useMenuBarStyles = makeStyles({
  menuBar: {
    display: 'flex',
    gap: tokens.spacingHorizontalXS,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalM}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  menuButton: {
    fontWeight: tokens.fontWeightRegular,
  },
});

interface MenuBarItem {
  id: string;
  label: string;
  items: {
    id: string;
    label: string;
    icon?: React.ReactElement;
    shortcut?: string;
    divider?: boolean;
    onClick?: () => void;
  }[];
}

function NavigationMenuBar() {
  const styles = useMenuBarStyles();

  const menuItems: MenuBarItem[] = [
    {
      id: 'file',
      label: 'File',
      items: [
        { id: 'new', label: 'New', shortcut: '⌘N' },
        { id: 'open', label: 'Open', shortcut: '⌘O' },
        { id: 'save', label: 'Save', shortcut: '⌘S' },
        { id: 'divider1', label: '', divider: true },
        { id: 'exit', label: 'Exit' },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      items: [
        { id: 'undo', label: 'Undo', shortcut: '⌘Z' },
        { id: 'redo', label: 'Redo', shortcut: '⇧⌘Z' },
        { id: 'divider1', label: '', divider: true },
        { id: 'cut', label: 'Cut', shortcut: '⌘X' },
        { id: 'copy', label: 'Copy', shortcut: '⌘C' },
        { id: 'paste', label: 'Paste', shortcut: '⌘V' },
      ],
    },
    {
      id: 'view',
      label: 'View',
      items: [
        { id: 'zoom', label: 'Zoom In', shortcut: '⌘+' },
        { id: 'zoomOut', label: 'Zoom Out', shortcut: '⌘-' },
        { id: 'divider1', label: '', divider: true },
        { id: 'fullscreen', label: 'Full Screen', shortcut: 'F11' },
      ],
    },
    {
      id: 'help',
      label: 'Help',
      items: [
        { id: 'docs', label: 'Documentation' },
        { id: 'about', label: 'About' },
      ],
    },
  ];

  return (
    <div className={styles.menuBar}>
      {menuItems.map((menu) => (
        <Menu key={menu.id}>
          <MenuTrigger disableButtonEnhancement>
            <Button appearance="subtle" className={styles.menuButton}>
              {menu.label}
            </Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              {menu.items.map((item) =>
                item.divider ? (
                  <MenuDivider key={item.id} />
                ) : (
                  <MenuItem key={item.id} onClick={item.onClick}>
                    {item.label}
                    {item.shortcut && (
                      <span style={{ marginLeft: 'auto', opacity: 0.6 }}>
                        {item.shortcut}
                      </span>
                    )}
                  </MenuItem>
                )
              )}
            </MenuList>
          </MenuPopover>
        </Menu>
      ))}
    </div>
  );
}
```

## useMenu Hook

```typescript
import { useState, useCallback, useMemo } from 'react';

interface UseMenuOptions {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface UseMenuReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  menuProps: {
    open: boolean;
    onOpenChange: (event: unknown, data: { open: boolean }) => void;
  };
}

/**
 * Hook for managing menu state
 */
export function useMenu(options: UseMenuOptions = {}): UseMenuReturn {
  const { defaultOpen = false, onOpenChange } = options;
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => {
    setIsOpen(true);
    onOpenChange?.(true);
  }, [onOpenChange]);

  const close = useCallback(() => {
    setIsOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      onOpenChange?.(next);
      return next;
    });
  }, [onOpenChange]);

  const menuProps = useMemo(
    () => ({
      open: isOpen,
      onOpenChange: (_: unknown, data: { open: boolean }) => {
        setIsOpen(data.open);
        onOpenChange?.(data.open);
      },
    }),
    [isOpen, onOpenChange]
  );

  return {
    isOpen,
    open,
    close,
    toggle,
    menuProps,
  };
}

// Usage
function MenuWithHook() {
  const menu = useMenu({
    onOpenChange: (open) => console.log('Menu open:', open),
  });

  return (
    <Menu {...menu.menuProps}>
      <MenuTrigger disableButtonEnhancement>
        <Button>Menu</Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem onClick={menu.close}>Close Menu</MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}
```

## Menu with Search/Filter

```tsx
import { SearchBox } from '@fluentui/react-components';

const useFilterMenuStyles = makeStyles({
  searchContainer: {
    padding: tokens.spacingHorizontalM,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  emptyState: {
    padding: tokens.spacingHorizontalM,
    color: tokens.colorNeutralForeground3,
    textAlign: 'center',
  },
});

interface FilterableMenuItem {
  id: string;
  label: string;
  icon?: React.ReactElement;
}

function FilterableMenu({ items }: { items: FilterableMenuItem[] }) {
  const styles = useFilterMenuStyles();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    return items.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button>Select Item</Button>
      </MenuTrigger>
      <MenuPopover>
        <div className={styles.searchContainer}>
          <SearchBox
            placeholder="Search..."
            value={searchQuery}
            onChange={(_, data) => setSearchQuery(data.value)}
            size="small"
          />
        </div>
        <MenuList>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <MenuItem key={item.id} icon={item.icon}>
                {item.label}
              </MenuItem>
            ))
          ) : (
            <div className={styles.emptyState}>No items found</div>
          )}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}
```

## Accessibility Checklist

- [x] Menu uses proper ARIA roles (`menu`, `menuitem`, etc.)
- [x] Trigger button has `aria-haspopup="menu"` and `aria-expanded`
- [x] Arrow keys navigate menu items
- [x] Enter/Space activates menu items
- [x] Escape closes menu and returns focus to trigger
- [x] Tab moves focus out of menu
- [x] Disabled items are properly announced

## Best Practices

1. **Use Clear Labels**: Menu items should clearly indicate their action
2. **Group Related Items**: Use MenuGroup and MenuDivider for organization
3. **Show Shortcuts**: Display keyboard shortcuts when available
4. **Limit Depth**: Avoid deeply nested submenus (max 2 levels)
5. **Danger Actions**: Use visual indicators for destructive actions
6. **Context Appropriate**: Context menus should only show relevant actions
7. **Consistent Position**: Menus should appear in predictable locations

## Related Documentation

- [02-sidebar-navigation.md](02-sidebar-navigation.md) - Main app navigation
- [03-tab-navigation.md](03-tab-navigation.md) - Content sectioning
- [05-pagination-patterns.md](05-pagination-patterns.md) - Page navigation