# Modal Patterns - FluentUI v9

> **Module**: Modal Patterns
> **Path**: `03-patterns/modals/`

## Overview

This module covers modal and overlay patterns for FluentUI v9 applications. Modals interrupt the user's workflow to deliver important information or collect input, while overlays provide supplementary content without blocking the main interface.

## Files in This Module

| File | Topic | Description |
|------|-------|-------------|
| [01-dialog-patterns.md](01-dialog-patterns.md) | Basic Dialogs | Alert, info, and standard dialogs |
| [02-confirmation-dialogs.md](02-confirmation-dialogs.md) | Confirmation Dialogs | Confirm/cancel and destructive action patterns |
| [03-form-dialogs.md](03-form-dialogs.md) | Form Dialogs | Dialogs containing forms and validation |
| [04-drawer-patterns.md](04-drawer-patterns.md) | Drawers | Side panels for detailed views and settings |
| [05-popover-patterns.md](05-popover-patterns.md) | Popovers & Tooltips | Non-blocking contextual overlays |

## Core Modal Components

FluentUI v9 provides these primary modal components:

```typescript
import {
  // Dialog (primary modal)
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogActions,
  
  // Drawer (side panel)
  Drawer,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerHeaderNavigation,
  DrawerBody,
  DrawerFooter,
  OverlayDrawer,
  InlineDrawer,
  
  // Popover (contextual overlay)
  Popover,
  PopoverTrigger,
  PopoverSurface,
  
  // Tooltip (informational overlay)
  Tooltip,
  
  // Additional utilities
  Portal,
} from '@fluentui/react-components';
```

## Modal Type Selection Guide

```
What type of overlay do you need?

├── Requires user action to continue?
│   ├── Simple message → Alert Dialog (01-dialog-patterns.md)
│   ├── User confirmation → Confirmation Dialog (02-confirmation-dialogs.md)
│   └── Collect input → Form Dialog (03-form-dialogs.md)
│
├── Show detailed content/settings?
│   └── Use Drawer (04-drawer-patterns.md)
│
├── Contextual information?
│   ├── On hover → Tooltip (05-popover-patterns.md)
│   └── On click → Popover (05-popover-patterns.md)
│
└── Teaching/onboarding?
    └── Teaching Popover (05-popover-patterns.md)
```

## Modal Behavior Guidelines

### When to Use Modals

| Scenario | Recommended Pattern |
|----------|---------------------|
| Critical error | Alert Dialog |
| Confirm destructive action | Confirmation Dialog |
| Quick data entry (1-3 fields) | Form Dialog |
| Complex forms | Drawer or Full Page |
| Settings/preferences | Drawer |
| Detail view | Drawer |
| Contextual help | Tooltip or Popover |
| Quick actions | Popover with menu |

### When NOT to Use Modals

- **Don't** use for non-essential information
- **Don't** use for long content (use page instead)
- **Don't** stack multiple modals
- **Don't** use for frequent actions (interrupts flow)
- **Don't** use when context is needed from main page

## Modal State Management

### useModal Hook

```typescript
import { useState, useCallback, useMemo } from 'react';

interface UseModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  dialogProps: {
    open: boolean;
    onOpenChange: (event: unknown, data: { open: boolean }) => void;
  };
}

/**
 * Hook for managing modal/dialog state
 */
export function useModal(defaultOpen = false): UseModalReturn {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const dialogProps = useMemo(
    () => ({
      open: isOpen,
      onOpenChange: (_: unknown, data: { open: boolean }) => {
        setIsOpen(data.open);
      },
    }),
    [isOpen]
  );

  return { isOpen, open, close, toggle, dialogProps };
}

// Usage
function Example() {
  const modal = useModal();

  return (
    <>
      <Button onClick={modal.open}>Open Dialog</Button>
      <Dialog {...modal.dialogProps}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Title</DialogTitle>
            <DialogContent>Content</DialogContent>
            <DialogActions>
              <Button onClick={modal.close}>Close</Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
}
```

### Modal with Data

```typescript
interface UseModalWithDataReturn<T> extends UseModalReturn {
  data: T | null;
  openWith: (data: T) => void;
}

/**
 * Hook for modals that operate on specific data
 */
export function useModalWithData<T>(defaultOpen = false): UseModalWithDataReturn<T> {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [data, setData] = useState<T | null>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    // Optionally clear data on close
    setTimeout(() => setData(null), 300);
  }, []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const openWith = useCallback((newData: T) => {
    setData(newData);
    setIsOpen(true);
  }, []);

  const dialogProps = useMemo(
    () => ({
      open: isOpen,
      onOpenChange: (_: unknown, data: { open: boolean }) => {
        if (!data.open) close();
        else setIsOpen(data.open);
      },
    }),
    [isOpen, close]
  );

  return { isOpen, open, close, toggle, dialogProps, data, openWith };
}

// Usage with edit/delete modals
interface User { id: number; name: string; }

function UserList() {
  const editModal = useModalWithData<User>();
  const deleteModal = useModalWithData<User>();

  const users: User[] = [{ id: 1, name: 'John' }];

  return (
    <>
      {users.map((user) => (
        <div key={user.id}>
          {user.name}
          <Button onClick={() => editModal.openWith(user)}>Edit</Button>
          <Button onClick={() => deleteModal.openWith(user)}>Delete</Button>
        </div>
      ))}

      {/* Edit Modal */}
      <Dialog {...editModal.dialogProps}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Edit {editModal.data?.name}</DialogTitle>
            {/* Form content */}
          </DialogBody>
        </DialogSurface>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog {...deleteModal.dialogProps}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Delete {deleteModal.data?.name}?</DialogTitle>
            {/* Confirmation content */}
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
}
```

## Accessibility Requirements

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move focus between interactive elements |
| `Shift+Tab` | Move focus backwards |
| `Escape` | Close modal |
| `Enter` | Activate focused button |

### ARIA Requirements

```tsx
// Dialog must have:
// - role="dialog" (automatic)
// - aria-modal="true" (automatic)
// - aria-labelledby pointing to title
// - aria-describedby pointing to content (optional)

<Dialog>
  <DialogSurface aria-describedby="dialog-content">
    <DialogBody>
      <DialogTitle>Title</DialogTitle>
      <DialogContent id="dialog-content">
        Description text
      </DialogContent>
    </DialogBody>
  </DialogSurface>
</Dialog>
```

### Focus Management

1. **On Open**: Focus moves to first focusable element (or title)
2. **While Open**: Focus is trapped within modal
3. **On Close**: Focus returns to trigger element

```typescript
/**
 * Hook for managing focus return when modal closes
 */
export function useFocusReturn() {
  const triggerRef = useRef<HTMLElement | null>(null);

  const saveTrigger = useCallback(() => {
    triggerRef.current = document.activeElement as HTMLElement;
  }, []);

  const returnFocus = useCallback(() => {
    triggerRef.current?.focus();
  }, []);

  return { saveTrigger, returnFocus };
}
```

## Common Patterns

### Loading States in Modals

```tsx
function ModalWithLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const modal = useModal();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await saveData();
      modal.close();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog {...modal.dialogProps}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Save Changes</DialogTitle>
          <DialogContent>Your content here</DialogContent>
          <DialogActions>
            <Button onClick={modal.close} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              appearance="primary" 
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="tiny" /> : 'Save'}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
```

### Preventing Close

```tsx
function PreventCloseDialog() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const handleOpenChange = (_: unknown, data: { open: boolean }) => {
    if (!data.open && hasUnsavedChanges) {
      const confirmed = window.confirm('Discard unsaved changes?');
      if (!confirmed) return; // Prevent close
    }
    // Allow close
  };

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      {/* Dialog content */}
    </Dialog>
  );
}
```

## Best Practices

1. **Keep Content Focused**: One task per modal
2. **Provide Clear Actions**: Primary and secondary buttons
3. **Allow Escape**: Always let users close (except critical flows)
4. **Show Loading States**: Indicate when processing
5. **Handle Errors Gracefully**: Show errors in modal, don't just close
6. **Test Keyboard Navigation**: Ensure full keyboard accessibility
7. **Consider Mobile**: Drawers often work better on mobile

## Next Steps

- Start with [01-dialog-patterns.md](01-dialog-patterns.md) for basic dialog patterns
- See [02-confirmation-dialogs.md](02-confirmation-dialogs.md) for destructive action confirmations
- Check [03-form-dialogs.md](03-form-dialogs.md) for forms in dialogs