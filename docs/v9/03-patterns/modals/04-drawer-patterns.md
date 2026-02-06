# Drawer Patterns - FluentUI v9

> **Topic**: Drawer/Panel Patterns
> **Components**: `Drawer`, `OverlayDrawer`, `InlineDrawer`, `DrawerHeader`, `DrawerBody`
> **Package**: `@fluentui/react-components`

## Overview

Drawers are sliding panels that emerge from screen edges. They're ideal for detailed views, settings panels, filters, or any content that supplements the main view without requiring full navigation.

## Basic Imports

```typescript
import {
  Drawer,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerHeaderNavigation,
  DrawerBody,
  DrawerFooter,
  OverlayDrawer,
  InlineDrawer,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { DismissRegular, ArrowLeftRegular } from '@fluentui/react-icons';
```

## Basic Drawer

```tsx
const useDrawerStyles = makeStyles({
  drawer: {
    width: '400px',
  },
});

function BasicDrawer() {
  const styles = useDrawerStyles();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <OverlayDrawer
        className={styles.drawer}
        position="end"
        open={open}
        onOpenChange={(_, data) => setOpen(data.open)}
      >
        <DrawerHeader>
          <DrawerHeaderTitle
            action={
              <Button
                appearance="subtle"
                icon={<DismissRegular />}
                onClick={() => setOpen(false)}
              />
            }
          >
            Drawer Title
          </DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>
          <p>Drawer content goes here.</p>
        </DrawerBody>
      </OverlayDrawer>
    </>
  );
}
```

## Drawer Positions

```tsx
type DrawerPosition = 'start' | 'end' | 'bottom';

function PositionedDrawer({ position }: { position: DrawerPosition }) {
  const [open, setOpen] = useState(false);

  const getSize = () => {
    if (position === 'bottom') return { width: '100%', height: '50vh' };
    return { width: '400px' };
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Open {position} drawer
      </Button>
      <OverlayDrawer
        position={position}
        open={open}
        onOpenChange={(_, data) => setOpen(data.open)}
        style={getSize()}
      >
        <DrawerHeader>
          <DrawerHeaderTitle>
            {position.charAt(0).toUpperCase() + position.slice(1)} Drawer
          </DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>Content</DrawerBody>
      </OverlayDrawer>
    </>
  );
}
```

## Detail Drawer

For viewing item details:

```tsx
const useDetailDrawerStyles = makeStyles({
  drawer: { width: '500px' },
  section: {
    marginBottom: tokens.spacingVerticalL,
  },
  label: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginBottom: tokens.spacingVerticalXS,
  },
  value: {
    fontSize: tokens.fontSizeBase300,
  },
});

interface DetailDrawerProps<T> {
  open: boolean;
  item: T | null;
  onClose: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

interface ItemType {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: string;
}

function DetailDrawer({ open, item, onClose, onEdit, onDelete }: DetailDrawerProps<ItemType>) {
  const styles = useDetailDrawerStyles();

  if (!item) return null;

  return (
    <OverlayDrawer
      className={styles.drawer}
      position="end"
      open={open}
      onOpenChange={(_, data) => !data.open && onClose()}
    >
      <DrawerHeader>
        <DrawerHeaderTitle
          action={
            <Button appearance="subtle" icon={<DismissRegular />} onClick={onClose} />
          }
        >
          Item Details
        </DrawerHeaderTitle>
      </DrawerHeader>
      <DrawerBody>
        <div className={styles.section}>
          <div className={styles.label}>Name</div>
          <div className={styles.value}>{item.name}</div>
        </div>
        <div className={styles.section}>
          <div className={styles.label}>Description</div>
          <div className={styles.value}>{item.description || 'No description'}</div>
        </div>
        <div className={styles.section}>
          <div className={styles.label}>Status</div>
          <div className={styles.value}>{item.status}</div>
        </div>
        <div className={styles.section}>
          <div className={styles.label}>Created</div>
          <div className={styles.value}>{new Date(item.createdAt).toLocaleDateString()}</div>
        </div>
      </DrawerBody>
      <DrawerFooter>
        {onEdit && <Button onClick={() => onEdit(item)}>Edit</Button>}
        {onDelete && (
          <Button appearance="subtle" onClick={() => onDelete(item)}>
            Delete
          </Button>
        )}
      </DrawerFooter>
    </OverlayDrawer>
  );
}
```

## Settings Drawer

```tsx
import { Field, Switch, Select, Dropdown, Option } from '@fluentui/react-components';

const useSettingsStyles = makeStyles({
  drawer: { width: '350px' },
  section: { marginBottom: tokens.spacingVerticalXL },
  sectionTitle: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalM,
  },
  settingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${tokens.spacingVerticalS} 0`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

function SettingsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const styles = useSettingsStyles();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: 'en',
    autoSave: true,
  });

  return (
    <OverlayDrawer
      className={styles.drawer}
      position="end"
      open={open}
      onOpenChange={(_, data) => !data.open && onClose()}
    >
      <DrawerHeader>
        <DrawerHeaderTitle
          action={<Button appearance="subtle" icon={<DismissRegular />} onClick={onClose} />}
        >
          Settings
        </DrawerHeaderTitle>
      </DrawerHeader>
      <DrawerBody>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Preferences</div>
          <div className={styles.settingRow}>
            <span>Notifications</span>
            <Switch
              checked={settings.notifications}
              onChange={(_, data) => setSettings((s) => ({ ...s, notifications: data.checked }))}
            />
          </div>
          <div className={styles.settingRow}>
            <span>Dark Mode</span>
            <Switch
              checked={settings.darkMode}
              onChange={(_, data) => setSettings((s) => ({ ...s, darkMode: data.checked }))}
            />
          </div>
          <div className={styles.settingRow}>
            <span>Auto Save</span>
            <Switch
              checked={settings.autoSave}
              onChange={(_, data) => setSettings((s) => ({ ...s, autoSave: data.checked }))}
            />
          </div>
        </div>
        <div className={styles.section}>
          <Field label="Language">
            <Dropdown
              value={settings.language}
              onOptionSelect={(_, data) =>
                setSettings((s) => ({ ...s, language: data.optionValue as string }))
              }
            >
              <Option value="en">English</Option>
              <Option value="es">Spanish</Option>
              <Option value="fr">French</Option>
            </Dropdown>
          </Field>
        </div>
      </DrawerBody>
      <DrawerFooter>
        <Button appearance="primary" onClick={onClose}>Done</Button>
      </DrawerFooter>
    </OverlayDrawer>
  );
}
```

## Inline Drawer

Pushes content instead of overlaying:

```tsx
const useInlineDrawerStyles = makeStyles({
  container: {
    display: 'flex',
    height: '100vh',
  },
  content: {
    flex: 1,
    padding: tokens.spacingHorizontalL,
    overflow: 'auto',
  },
  drawer: {
    width: '300px',
  },
});

function InlineDrawerExample() {
  const styles = useInlineDrawerStyles();
  const [open, setOpen] = useState(true);

  return (
    <div className={styles.container}>
      <InlineDrawer
        className={styles.drawer}
        position="start"
        open={open}
      >
        <DrawerHeader>
          <DrawerHeaderTitle>Navigation</DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>
          <nav>
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </nav>
        </DrawerBody>
      </InlineDrawer>
      <main className={styles.content}>
        <Button onClick={() => setOpen(!open)}>
          {open ? 'Hide' : 'Show'} Sidebar
        </Button>
        <h1>Main Content</h1>
      </main>
    </div>
  );
}
```

## useDrawer Hook

```typescript
interface UseDrawerOptions<T = undefined> {
  defaultOpen?: boolean;
  onOpen?: (data?: T) => void;
  onClose?: () => void;
}

interface UseDrawerReturn<T> {
  isOpen: boolean;
  data: T | null;
  open: (data?: T) => void;
  close: () => void;
  drawerProps: {
    open: boolean;
    onOpenChange: (event: unknown, data: { open: boolean }) => void;
  };
}

export function useDrawer<T = undefined>(options: UseDrawerOptions<T> = {}): UseDrawerReturn<T> {
  const { defaultOpen = false, onOpen, onClose } = options;
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [data, setData] = useState<T | null>(null);

  const open = useCallback((openData?: T) => {
    setData(openData ?? null);
    setIsOpen(true);
    onOpen?.(openData);
  }, [onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
    setTimeout(() => setData(null), 300);
  }, [onClose]);

  const drawerProps = useMemo(() => ({
    open: isOpen,
    onOpenChange: (_: unknown, d: { open: boolean }) => {
      if (!d.open) close();
    },
  }), [isOpen, close]);

  return { isOpen, data, open, close, drawerProps };
}

// Usage
function DrawerWithHook() {
  const drawer = useDrawer<{ id: number }>();

  return (
    <>
      <Button onClick={() => drawer.open({ id: 1 })}>View Details</Button>
      <OverlayDrawer {...drawer.drawerProps}>
        <DrawerBody>Item ID: {drawer.data?.id}</DrawerBody>
      </OverlayDrawer>
    </>
  );
}
```

## Best Practices

1. **Choose Right Position**: End for details, start for navigation
2. **Appropriate Width**: 300-500px typically, wider for forms
3. **Clear Close Action**: Always provide dismiss button
4. **Persist on Interaction**: Don't close on content clicks
5. **Loading States**: Show spinners when fetching data
6. **Mobile Consideration**: Full-width on small screens

## Related Documentation

- [01-dialog-patterns.md](01-dialog-patterns.md) - Modal dialogs
- [05-popover-patterns.md](05-popover-patterns.md) - Lightweight overlays