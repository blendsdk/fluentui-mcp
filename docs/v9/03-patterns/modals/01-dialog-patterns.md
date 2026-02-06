# Basic Dialog Patterns - FluentUI v9

> **Topic**: Basic Dialogs
> **Components**: `Dialog`, `DialogTrigger`, `DialogSurface`, `DialogTitle`, `DialogBody`, `DialogContent`, `DialogActions`
> **Package**: `@fluentui/react-components`

## Overview

Dialogs are modal windows that overlay the main content and require user interaction. They're used for alerts, confirmations, and focused tasks that require immediate attention.

## Basic Imports

```typescript
import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogActions,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { DismissRegular, InfoRegular, WarningRegular } from '@fluentui/react-icons';
```

## Basic Dialog

```tsx
function BasicDialog() {
  return (
    <Dialog>
      <DialogTrigger disableButtonEnhancement>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogContent>
            This is the dialog content. You can put any content here
            including text, forms, or other components.
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Close</Button>
            </DialogTrigger>
            <Button appearance="primary">Confirm</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
```

## Controlled Dialog

```tsx
function ControlledDialog() {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Controlled Dialog</Button>
      
      <Dialog open={open} onOpenChange={(_, data) => setOpen(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Controlled Dialog</DialogTitle>
            <DialogContent>
              This dialog's open state is managed externally.
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button appearance="primary" onClick={handleClose}>
                OK
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
}
```

## Alert Dialog

For important messages that require acknowledgment:

```tsx
const useAlertStyles = makeStyles({
  surface: {
    maxWidth: '400px',
  },
  icon: {
    fontSize: '48px',
    marginBottom: tokens.spacingVerticalM,
    display: 'block',
  },
  infoIcon: {
    color: tokens.colorBrandForeground1,
  },
  warningIcon: {
    color: tokens.colorPaletteYellowForeground1,
  },
  errorIcon: {
    color: tokens.colorPaletteRedForeground1,
  },
  successIcon: {
    color: tokens.colorPaletteGreenForeground1,
  },
  content: {
    textAlign: 'center',
  },
});

type AlertType = 'info' | 'warning' | 'error' | 'success';

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  type?: AlertType;
  title: string;
  message: string;
  actionLabel?: string;
}

function AlertDialog({
  open,
  onClose,
  type = 'info',
  title,
  message,
  actionLabel = 'OK',
}: AlertDialogProps) {
  const styles = useAlertStyles();

  const getIcon = () => {
    const iconClass = `${styles.icon} ${styles[`${type}Icon`]}`;
    switch (type) {
      case 'warning':
        return <WarningRegular className={iconClass} />;
      case 'error':
        return <ErrorCircleRegular className={iconClass} />;
      case 'success':
        return <CheckmarkCircleRegular className={iconClass} />;
      default:
        return <InfoRegular className={iconClass} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.surface}>
        <DialogBody>
          <DialogContent className={styles.content}>
            {getIcon()}
            <DialogTitle>{title}</DialogTitle>
            <p>{message}</p>
          </DialogContent>
          <DialogActions>
            <Button appearance="primary" onClick={onClose}>
              {actionLabel}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

// Usage
function AlertExample() {
  const [alertOpen, setAlertOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setAlertOpen(true)}>Show Alert</Button>
      <AlertDialog
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        type="info"
        title="Information"
        message="Your changes have been saved successfully."
      />
    </>
  );
}
```

## Dialog with Custom Close Button

```tsx
const useCloseButtonStyles = makeStyles({
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: tokens.spacingVerticalS,
    right: tokens.spacingHorizontalS,
  },
});

function DialogWithCloseButton() {
  const styles = useCloseButtonStyles();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Dialog open={open} onOpenChange={(_, data) => setOpen(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle
              action={
                <Button
                  appearance="subtle"
                  aria-label="close"
                  icon={<DismissRegular />}
                  onClick={() => setOpen(false)}
                />
              }
            >
              Dialog with Close Button
            </DialogTitle>
            <DialogContent>
              Content here. The X button provides an additional way to close.
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Done</Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
}
```

## Dialog Sizes

```tsx
const useDialogSizeStyles = makeStyles({
  small: {
    maxWidth: '300px',
  },
  medium: {
    maxWidth: '500px',
  },
  large: {
    maxWidth: '800px',
  },
  fullWidth: {
    maxWidth: '90vw',
    width: '90vw',
  },
});

type DialogSize = 'small' | 'medium' | 'large' | 'fullWidth';

interface SizedDialogProps {
  open: boolean;
  onClose: () => void;
  size?: DialogSize;
  title: string;
  children: React.ReactNode;
}

function SizedDialog({
  open,
  onClose,
  size = 'medium',
  title,
  children,
}: SizedDialogProps) {
  const styles = useDialogSizeStyles();

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles[size]}>
        <DialogBody>
          <DialogTitle
            action={
              <Button
                appearance="subtle"
                icon={<DismissRegular />}
                onClick={onClose}
              />
            }
          >
            {title}
          </DialogTitle>
          <DialogContent>{children}</DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Close</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
```

## Non-Modal Dialog

For dialogs that don't block interaction with the page:

```tsx
function NonModalDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Non-Modal</Button>
      <Dialog
        open={open}
        onOpenChange={(_, data) => setOpen(data.open)}
        modalType="non-modal"
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Non-Modal Dialog</DialogTitle>
            <DialogContent>
              This dialog doesn't block interaction with the page.
              You can still click elements outside the dialog.
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
}
```

## Alert Dialog (No Backdrop Click Close)

For critical dialogs that must be acknowledged:

```tsx
function CriticalDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Show Critical Alert</Button>
      <Dialog
        open={open}
        onOpenChange={(_, data) => {
          // Only allow programmatic close, not backdrop click
          if (data.type === 'backdropClick') return;
          setOpen(data.open);
        }}
        modalType="alert"
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Critical Action Required</DialogTitle>
            <DialogContent>
              This alert cannot be dismissed by clicking outside.
              You must acknowledge it by clicking the button.
            </DialogContent>
            <DialogActions>
              <Button appearance="primary" onClick={() => setOpen(false)}>
                I Understand
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
}
```

## Dialog with Scrollable Content

```tsx
const useScrollableStyles = makeStyles({
  surface: {
    maxHeight: '80vh',
  },
  content: {
    maxHeight: '400px',
    overflowY: 'auto',
  },
});

function ScrollableDialog() {
  const styles = useScrollableStyles();
  const [open, setOpen] = useState(false);

  const longContent = Array.from({ length: 20 }, (_, i) => (
    <p key={i}>
      Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </p>
  ));

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Scrollable Dialog</Button>
      <Dialog open={open} onOpenChange={(_, data) => setOpen(data.open)}>
        <DialogSurface className={styles.surface}>
          <DialogBody>
            <DialogTitle>Terms and Conditions</DialogTitle>
            <DialogContent className={styles.content}>
              {longContent}
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button appearance="primary" onClick={() => setOpen(false)}>
                Accept
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
}
```

## useDialog Hook

```typescript
import { useState, useCallback, useMemo } from 'react';

interface UseDialogOptions {
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

interface UseDialogReturn {
  open: boolean;
  setOpen: (open: boolean) => void;
  show: () => void;
  hide: () => void;
  dialogProps: {
    open: boolean;
    onOpenChange: (event: unknown, data: { open: boolean }) => void;
  };
  triggerProps: {
    onClick: () => void;
  };
}

export function useDialog(options: UseDialogOptions = {}): UseDialogReturn {
  const { defaultOpen = false, onOpen, onClose } = options;
  const [open, setOpenState] = useState(defaultOpen);

  const setOpen = useCallback(
    (value: boolean) => {
      setOpenState(value);
      if (value) onOpen?.();
      else onClose?.();
    },
    [onOpen, onClose]
  );

  const show = useCallback(() => setOpen(true), [setOpen]);
  const hide = useCallback(() => setOpen(false), [setOpen]);

  const dialogProps = useMemo(
    () => ({
      open,
      onOpenChange: (_: unknown, data: { open: boolean }) => setOpen(data.open),
    }),
    [open, setOpen]
  );

  const triggerProps = useMemo(
    () => ({
      onClick: show,
    }),
    [show]
  );

  return { open, setOpen, show, hide, dialogProps, triggerProps };
}

// Usage
function DialogWithHook() {
  const dialog = useDialog({
    onOpen: () => console.log('Dialog opened'),
    onClose: () => console.log('Dialog closed'),
  });

  return (
    <>
      <Button {...dialog.triggerProps}>Open</Button>
      <Dialog {...dialog.dialogProps}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Hook-based Dialog</DialogTitle>
            <DialogContent>Easy dialog management</DialogContent>
            <DialogActions>
              <Button onClick={dialog.hide}>Close</Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
}
```

## Accessibility Checklist

- [x] Dialog has proper `role="dialog"` (automatic)
- [x] `aria-modal="true"` is set (automatic)
- [x] Title is associated via `aria-labelledby` (automatic with DialogTitle)
- [x] Focus is trapped within dialog
- [x] Escape key closes dialog
- [x] Focus returns to trigger on close
- [x] Close button has accessible label

## Best Practices

1. **Clear Title**: Use descriptive, action-oriented titles
2. **Concise Content**: Keep dialog content focused and brief
3. **Clear Actions**: Primary action on the right, secondary on the left
4. **Escape Route**: Always provide a way to dismiss
5. **Prevent Scrolling**: Body should scroll, not overflow
6. **Don't Stack**: Avoid opening dialogs from dialogs

## Related Documentation

- [02-confirmation-dialogs.md](02-confirmation-dialogs.md) - Confirmation patterns
- [03-form-dialogs.md](03-form-dialogs.md) - Forms in dialogs