# Popover & Tooltip Patterns - FluentUI v9

> **Topic**: Popovers and Tooltips
> **Components**: `Popover`, `PopoverTrigger`, `PopoverSurface`, `Tooltip`
> **Package**: `@fluentui/react-components`

## Overview

Popovers and tooltips are non-blocking overlays that provide contextual information or actions. Tooltips appear on hover for brief hints, while popovers can contain interactive content.

## Basic Imports

```typescript
import {
  Popover,
  PopoverTrigger,
  PopoverSurface,
  Tooltip,
  Button,
  makeStyles,
  tokens,
  Text,
} from '@fluentui/react-components';
import { InfoRegular, MoreHorizontalRegular, QuestionCircleRegular } from '@fluentui/react-icons';
```

## Basic Tooltip

```tsx
function BasicTooltip() {
  return (
    <Tooltip content="This is helpful information" relationship="label">
      <Button icon={<InfoRegular />}>Hover me</Button>
    </Tooltip>
  );
}

// Tooltip relationships
function TooltipRelationships() {
  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      {/* Label - describes what the element is */}
      <Tooltip content="Save document" relationship="label">
        <Button icon={<SaveRegular />} />
      </Tooltip>

      {/* Description - provides additional info */}
      <Tooltip content="Click to save your changes" relationship="description">
        <Button>Save</Button>
      </Tooltip>

      {/* Inaccessible - for decorative purposes only */}
      <Tooltip content="Decorative info" relationship="inaccessible">
        <span>Hover</span>
      </Tooltip>
    </div>
  );
}
```

## Tooltip Positions

```tsx
type TooltipPosition = 'above' | 'below' | 'before' | 'after';

function TooltipPositions() {
  const positions: TooltipPosition[] = ['above', 'below', 'before', 'after'];

  return (
    <div style={{ display: 'flex', gap: '16px', padding: '50px' }}>
      {positions.map((position) => (
        <Tooltip key={position} content={`Tooltip ${position}`} positioning={position}>
          <Button>{position}</Button>
        </Tooltip>
      ))}
    </div>
  );
}
```

## Basic Popover

```tsx
function BasicPopover() {
  return (
    <Popover>
      <PopoverTrigger disableButtonEnhancement>
        <Button>Show Popover</Button>
      </PopoverTrigger>
      <PopoverSurface>
        <div style={{ padding: tokens.spacingHorizontalM }}>
          <Text weight="semibold" block>Popover Title</Text>
          <Text>This is popover content. It can contain any elements.</Text>
        </div>
      </PopoverSurface>
    </Popover>
  );
}
```

## Actions Popover

```tsx
const useActionsPopoverStyles = makeStyles({
  surface: {
    padding: tokens.spacingVerticalS,
    minWidth: '150px',
  },
  action: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    width: '100%',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    borderRadius: tokens.borderRadiusMedium,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
});

interface ActionItem {
  id: string;
  label: string;
  icon?: React.ReactElement;
  onClick: () => void;
  danger?: boolean;
}

function ActionsPopover({ actions }: { actions: ActionItem[] }) {
  const styles = useActionsPopoverStyles();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={(_, data) => setOpen(data.open)}>
      <PopoverTrigger disableButtonEnhancement>
        <Button icon={<MoreHorizontalRegular />} appearance="subtle" />
      </PopoverTrigger>
      <PopoverSurface className={styles.surface}>
        {actions.map((action) => (
          <button
            key={action.id}
            className={styles.action}
            onClick={() => {
              action.onClick();
              setOpen(false);
            }}
            style={action.danger ? { color: tokens.colorPaletteRedForeground1 } : undefined}
          >
            {action.icon}
            <span>{action.label}</span>
          </button>
        ))}
      </PopoverSurface>
    </Popover>
  );
}
```

## Help Popover

```tsx
const useHelpStyles = makeStyles({
  surface: {
    maxWidth: '300px',
    padding: tokens.spacingHorizontalM,
  },
  title: {
    marginBottom: tokens.spacingVerticalS,
  },
  link: {
    marginTop: tokens.spacingVerticalM,
    display: 'block',
  },
});

function HelpPopover({ title, content, learnMoreUrl }: {
  title: string;
  content: string;
  learnMoreUrl?: string;
}) {
  const styles = useHelpStyles();

  return (
    <Popover>
      <PopoverTrigger disableButtonEnhancement>
        <Button
          icon={<QuestionCircleRegular />}
          appearance="subtle"
          size="small"
          aria-label="Help"
        />
      </PopoverTrigger>
      <PopoverSurface className={styles.surface}>
        <Text weight="semibold" className={styles.title} block>
          {title}
        </Text>
        <Text>{content}</Text>
        {learnMoreUrl && (
          <a href={learnMoreUrl} className={styles.link} target="_blank" rel="noopener">
            Learn more →
          </a>
        )}
      </PopoverSurface>
    </Popover>
  );
}
```

## Controlled Popover

```tsx
function ControlledPopover() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Popover open={open} onOpenChange={(_, data) => setOpen(data.open)}>
        <PopoverTrigger disableButtonEnhancement>
          <Button>Toggle Popover</Button>
        </PopoverTrigger>
        <PopoverSurface>
          <div style={{ padding: tokens.spacingHorizontalM }}>
            <Text>Controlled popover content</Text>
            <Button onClick={() => setOpen(false)} style={{ marginTop: tokens.spacingVerticalS }}>
              Close
            </Button>
          </div>
        </PopoverSurface>
      </Popover>
      <Button onClick={() => setOpen(!open)} style={{ marginLeft: tokens.spacingHorizontalM }}>
        External Toggle
      </Button>
    </>
  );
}
```

## Confirmation Popover

Lightweight alternative to confirmation dialogs:

```tsx
const useConfirmPopoverStyles = makeStyles({
  surface: {
    padding: tokens.spacingHorizontalM,
    maxWidth: '250px',
  },
  message: {
    marginBottom: tokens.spacingVerticalM,
  },
  actions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    justifyContent: 'flex-end',
  },
});

function ConfirmPopover({
  message,
  onConfirm,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  children,
}: {
  message: string;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  children: React.ReactElement;
}) {
  const styles = useConfirmPopoverStyles();
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={(_, data) => setOpen(data.open)}>
      <PopoverTrigger disableButtonEnhancement>{children}</PopoverTrigger>
      <PopoverSurface className={styles.surface}>
        <Text className={styles.message} block>{message}</Text>
        <div className={styles.actions}>
          <Button size="small" onClick={() => setOpen(false)}>
            {cancelLabel}
          </Button>
          <Button size="small" appearance="primary" onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </PopoverSurface>
    </Popover>
  );
}

// Usage
<ConfirmPopover message="Remove this item?" onConfirm={() => removeItem()}>
  <Button icon={<DeleteRegular />} />
</ConfirmPopover>
```

## User Card Popover

```tsx
import { Avatar, Persona } from '@fluentui/react-components';

const useUserCardStyles = makeStyles({
  surface: {
    padding: tokens.spacingHorizontalL,
    minWidth: '280px',
  },
  header: {
    marginBottom: tokens.spacingVerticalM,
  },
  actions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalM,
  },
});

interface User {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

function UserCardPopover({ user }: { user: User }) {
  const styles = useUserCardStyles();

  return (
    <Popover>
      <PopoverTrigger disableButtonEnhancement>
        <Button appearance="subtle" style={{ padding: 0 }}>
          <Avatar name={user.name} image={user.avatar ? { src: user.avatar } : undefined} />
        </Button>
      </PopoverTrigger>
      <PopoverSurface className={styles.surface}>
        <div className={styles.header}>
          <Persona
            name={user.name}
            secondaryText={user.email}
            tertiaryText={user.role}
            avatar={{ image: user.avatar ? { src: user.avatar } : undefined }}
            size="large"
          />
        </div>
        <div className={styles.actions}>
          <Button size="small">View Profile</Button>
          <Button size="small">Send Message</Button>
        </div>
      </PopoverSurface>
    </Popover>
  );
}
```

## usePopover Hook

```typescript
interface UsePopoverOptions {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface UsePopoverReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  popoverProps: {
    open: boolean;
    onOpenChange: (event: unknown, data: { open: boolean }) => void;
  };
}

export function usePopover(options: UsePopoverOptions = {}): UsePopoverReturn {
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

  const popoverProps = useMemo(
    () => ({
      open: isOpen,
      onOpenChange: (_: unknown, data: { open: boolean }) => {
        setIsOpen(data.open);
        onOpenChange?.(data.open);
      },
    }),
    [isOpen, onOpenChange]
  );

  return { isOpen, open, close, toggle, popoverProps };
}
```

## Accessibility Checklist

- [x] Tooltips use correct `relationship` attribute
- [x] Interactive content uses Popover, not Tooltip
- [x] Tooltips are keyboard accessible (focus triggers)
- [x] Popover surfaces are focusable
- [x] Escape key closes popovers
- [x] Proper ARIA attributes are set

## Best Practices

1. **Tooltips for Hints**: Brief, non-essential information
2. **Popovers for Actions**: Interactive content that needs clicks
3. **Keep Content Brief**: Avoid long text in overlays
4. **Don't Block Content**: Position to avoid covering important elements
5. **Consistent Positioning**: Same positioning for similar elements
6. **Keyboard Access**: Ensure all triggers are keyboard accessible

## Related Documentation

- [01-dialog-patterns.md](01-dialog-patterns.md) - Modal dialogs
- [04-drawer-patterns.md](04-drawer-patterns.md) - Side panels
- [Menu Navigation](../navigation/04-menu-navigation.md) - Context menus