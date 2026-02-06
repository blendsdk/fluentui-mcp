# Confirmation Dialog Patterns - FluentUI v9

> **Topic**: Confirmation Dialogs
> **Components**: `Dialog`, `DialogSurface`, `DialogTitle`, `DialogContent`, `DialogActions`
> **Package**: `@fluentui/react-components`

## Overview

Confirmation dialogs ask users to verify their intent before completing potentially destructive or irreversible actions. They protect against accidental data loss.

## Basic Imports

```typescript
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogActions,
  Button,
  makeStyles,
  tokens,
  Text,
  Spinner,
} from '@fluentui/react-components';
import { 
  DeleteRegular, 
  WarningRegular,
  ErrorCircleRegular,
} from '@fluentui/react-icons';
```

## Basic Confirmation Dialog

```tsx
interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onCancel()}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>{message}</DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button appearance="primary" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

// Usage
function ConfirmExample() {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    console.log('Confirmed!');
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Save Changes</Button>
      <ConfirmDialog
        open={open}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
        title="Save Changes?"
        message="Do you want to save your changes before leaving?"
        confirmLabel="Save"
        cancelLabel="Don't Save"
      />
    </>
  );
}
```

## Destructive Action Confirmation

For delete, remove, or other irreversible actions:

```tsx
const useDestructiveStyles = makeStyles({
  surface: {
    maxWidth: '450px',
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: tokens.spacingVerticalM,
  },
  icon: {
    fontSize: '48px',
    color: tokens.colorPaletteRedForeground1,
  },
  warningText: {
    color: tokens.colorPaletteRedForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
  itemName: {
    fontWeight: tokens.fontWeightSemibold,
    backgroundColor: tokens.colorNeutralBackground3,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    borderRadius: tokens.borderRadiusSmall,
  },
});

interface DeleteConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  itemName: string;
  itemType?: string;
  isLoading?: boolean;
}

function DeleteConfirmDialog({
  open,
  onConfirm,
  onCancel,
  itemName,
  itemType = 'item',
  isLoading = false,
}: DeleteConfirmDialogProps) {
  const styles = useDestructiveStyles();

  return (
    <Dialog 
      open={open} 
      onOpenChange={(_, data) => !data.open && !isLoading && onCancel()}
      modalType="alert"
    >
      <DialogSurface className={styles.surface}>
        <DialogBody>
          <div className={styles.iconContainer}>
            <DeleteRegular className={styles.icon} />
          </div>
          <DialogTitle>Delete {itemType}?</DialogTitle>
          <DialogContent>
            <Text>
              Are you sure you want to delete{' '}
              <span className={styles.itemName}>{itemName}</span>?
            </Text>
            <Text block className={styles.warningText}>
              This action cannot be undone.
            </Text>
          </DialogContent>
          <DialogActions>
            <Button 
              appearance="secondary" 
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              appearance="primary"
              onClick={onConfirm}
              disabled={isLoading}
              style={{ backgroundColor: tokens.colorPaletteRedBackground3 }}
            >
              {isLoading ? <Spinner size="tiny" /> : 'Delete'}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
```

## Bulk Delete Confirmation

For deleting multiple items:

```tsx
interface BulkDeleteDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  itemCount: number;
  itemType?: string;
  isLoading?: boolean;
}

function BulkDeleteDialog({
  open,
  onConfirm,
  onCancel,
  itemCount,
  itemType = 'items',
  isLoading = false,
}: BulkDeleteDialogProps) {
  const styles = useDestructiveStyles();

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && !isLoading && onCancel()}>
      <DialogSurface className={styles.surface}>
        <DialogBody>
          <div className={styles.iconContainer}>
            <WarningRegular className={styles.icon} />
          </div>
          <DialogTitle>Delete {itemCount} {itemType}?</DialogTitle>
          <DialogContent>
            <Text>
              You are about to delete <strong>{itemCount}</strong> {itemType}.
            </Text>
            <Text block className={styles.warningText}>
              This action cannot be undone and all associated data will be permanently removed.
            </Text>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              appearance="primary"
              onClick={onConfirm}
              disabled={isLoading}
              style={{ backgroundColor: tokens.colorPaletteRedBackground3 }}
            >
              {isLoading ? <Spinner size="tiny" /> : `Delete ${itemCount} ${itemType}`}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
```

## Confirmation with Input Verification

Require users to type a confirmation phrase:

```tsx
import { Input, Field } from '@fluentui/react-components';

const useInputConfirmStyles = makeStyles({
  surface: {
    maxWidth: '500px',
  },
  confirmInput: {
    marginTop: tokens.spacingVerticalM,
  },
  confirmText: {
    fontFamily: 'monospace',
    backgroundColor: tokens.colorNeutralBackground3,
    padding: `${tokens.spacingVerticalXXS} ${tokens.spacingHorizontalS}`,
    borderRadius: tokens.borderRadiusSmall,
  },
});

interface InputConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmPhrase: string;
  isLoading?: boolean;
}

function InputConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title,
  message,
  confirmPhrase,
  isLoading = false,
}: InputConfirmDialogProps) {
  const styles = useInputConfirmStyles();
  const [inputValue, setInputValue] = useState('');

  const isValid = inputValue === confirmPhrase;

  // Reset input when dialog closes
  useEffect(() => {
    if (!open) setInputValue('');
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && !isLoading && onCancel()}>
      <DialogSurface className={styles.surface}>
        <DialogBody>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <Text>{message}</Text>
            <Field
              className={styles.confirmInput}
              label={
                <>
                  Type <span className={styles.confirmText}>{confirmPhrase}</span> to confirm
                </>
              }
            >
              <Input
                value={inputValue}
                onChange={(_, data) => setInputValue(data.value)}
                placeholder={confirmPhrase}
                disabled={isLoading}
              />
            </Field>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              appearance="primary"
              onClick={onConfirm}
              disabled={!isValid || isLoading}
              style={{ backgroundColor: tokens.colorPaletteRedBackground3 }}
            >
              {isLoading ? <Spinner size="tiny" /> : 'Confirm'}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

// Usage - typically for very destructive actions
<InputConfirmDialog
  open={open}
  onConfirm={handleDelete}
  onCancel={() => setOpen(false)}
  title="Delete Repository"
  message="This will permanently delete the repository and all its data."
  confirmPhrase="delete my-repo"
/>
```

## Unsaved Changes Confirmation

Prevent accidental navigation away from unsaved work:

```tsx
interface UnsavedChangesDialogProps {
  open: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
  isSaving?: boolean;
}

function UnsavedChangesDialog({
  open,
  onSave,
  onDiscard,
  onCancel,
  isSaving = false,
}: UnsavedChangesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onCancel()}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Unsaved Changes</DialogTitle>
          <DialogContent>
            You have unsaved changes. Do you want to save them before leaving?
          </DialogContent>
          <DialogActions>
            <Button 
              appearance="secondary" 
              onClick={onDiscard}
              disabled={isSaving}
            >
              Don't Save
            </Button>
            <Button 
              appearance="secondary" 
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              appearance="primary" 
              onClick={onSave}
              disabled={isSaving}
            >
              {isSaving ? <Spinner size="tiny" /> : 'Save'}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

// Usage with navigation blocking
function useUnsavedChangesGuard(hasChanges: boolean) {
  const [showDialog, setShowDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);

  const handleNavigationAttempt = (navigate: () => void) => {
    if (hasChanges) {
      setPendingNavigation(() => navigate);
      setShowDialog(true);
    } else {
      navigate();
    }
  };

  const handleSave = async () => {
    await saveChanges();
    setShowDialog(false);
    pendingNavigation?.();
  };

  const handleDiscard = () => {
    setShowDialog(false);
    pendingNavigation?.();
  };

  const handleCancel = () => {
    setShowDialog(false);
    setPendingNavigation(null);
  };

  return {
    showDialog,
    handleNavigationAttempt,
    dialogProps: {
      open: showDialog,
      onSave: handleSave,
      onDiscard: handleDiscard,
      onCancel: handleCancel,
    },
  };
}
```

## useConfirm Hook

Reusable confirmation hook:

```typescript
import { useState, useCallback } from 'react';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

interface UseConfirmReturn {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  dialogProps: {
    open: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    cancelLabel: string;
    destructive: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  };
}

export function useConfirm(): UseConfirmReturn {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({
    title: '',
    message: '',
  });
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts);
    setOpen(true);
    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setOpen(false);
    resolver?.(true);
  }, [resolver]);

  const handleCancel = useCallback(() => {
    setOpen(false);
    resolver?.(false);
  }, [resolver]);

  return {
    confirm,
    dialogProps: {
      open,
      title: options.title,
      message: options.message,
      confirmLabel: options.confirmLabel || 'Confirm',
      cancelLabel: options.cancelLabel || 'Cancel',
      destructive: options.destructive || false,
      onConfirm: handleConfirm,
      onCancel: handleCancel,
    },
  };
}

// ConfirmDialogRenderer component
function ConfirmDialogRenderer({ dialogProps }: { dialogProps: UseConfirmReturn['dialogProps'] }) {
  const { open, title, message, confirmLabel, cancelLabel, destructive, onConfirm, onCancel } = dialogProps;

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onCancel()}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>{message}</DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button
              appearance="primary"
              onClick={onConfirm}
              style={destructive ? { backgroundColor: tokens.colorPaletteRedBackground3 } : undefined}
            >
              {confirmLabel}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

// Usage
function App() {
  const { confirm, dialogProps } = useConfirm();

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item?',
      confirmLabel: 'Delete',
      destructive: true,
    });

    if (confirmed) {
      await deleteItem();
    }
  };

  return (
    <>
      <Button onClick={handleDelete}>Delete</Button>
      <ConfirmDialogRenderer dialogProps={dialogProps} />
    </>
  );
}
```

## Accessibility Checklist

- [x] Use `modalType="alert"` for critical confirmations
- [x] Focus moves to cancel button (safest option) on open
- [x] Destructive actions have clear visual warning
- [x] Escape key closes dialog (except for critical alerts)
- [x] Clear, descriptive action button labels

## Best Practices

1. **Be Specific**: Tell users exactly what will happen
2. **Show Consequences**: Explain what data will be lost
3. **Use Red for Destructive**: Visual cue for dangerous actions
4. **Disable During Loading**: Prevent double-submission
5. **Default to Safe Option**: Focus cancel button for destructive actions
6. **Keep It Short**: Users tend to dismiss without reading long text
7. **Avoid Generic Text**: "Are you sure?" is not helpful

## Related Documentation

- [01-dialog-patterns.md](01-dialog-patterns.md) - Basic dialogs
- [03-form-dialogs.md](03-form-dialogs.md) - Forms in dialogs