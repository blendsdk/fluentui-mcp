# Dialog

> **Package**: `@fluentui/react-dialog`
> **Import**: `import { Dialog, DialogSurface, DialogTitle, DialogContent, DialogBody, DialogActions, DialogTrigger } from '@fluentui/react-components'`
> **Category**: Feedback

## Overview

Dialog displays content that requires user interaction. It appears as a modal overlay, blocking interaction with the page until dismissed. Supports alert, confirm, and custom content patterns.

---

## Basic Usage

```typescript
import * as React from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  DialogTrigger,
  Button,
} from '@fluentui/react-components';

export const BasicDialog: React.FC = () => (
  <Dialog>
    <DialogTrigger>
      <Button>Open Dialog</Button>
    </DialogTrigger>
    <DialogSurface>
      <DialogBody>
        <DialogTitle>Dialog Title</DialogTitle>
        <DialogContent>
          This is the dialog content. Add your message or form here.
        </DialogContent>
        <DialogActions>
          <DialogTrigger>
            <Button appearance="secondary">Cancel</Button>
          </DialogTrigger>
          <Button appearance="primary">Confirm</Button>
        </DialogActions>
      </DialogBody>
    </DialogSurface>
  </Dialog>
);
```

---

## Component Structure

| Component | Purpose |
|-----------|---------|
| `Dialog` | Root component, manages state |
| `DialogTrigger` | Wraps element that opens/closes dialog |
| `DialogSurface` | The modal container |
| `DialogBody` | Layout container for title, content, actions |
| `DialogTitle` | Header with optional close button |
| `DialogContent` | Main content area |
| `DialogActions` | Footer with action buttons |

---

## Dialog Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state |
| `onOpenChange` | `(ev, data) => void` | - | Open state change handler |
| `modalType` | `'modal' \| 'non-modal' \| 'alert'` | `'modal'` | Modal behavior type |

## DialogSurface Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `backdrop` | `Slot<'div'>` | - | Backdrop element configuration |

---

## Controlled vs Uncontrolled

### Uncontrolled

```typescript
import * as React from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  DialogTrigger,
  Button,
} from '@fluentui/react-components';

export const UncontrolledDialog: React.FC = () => (
  <Dialog>
    <DialogTrigger>
      <Button>Open</Button>
    </DialogTrigger>
    <DialogSurface>
      <DialogBody>
        <DialogTitle>Uncontrolled Dialog</DialogTitle>
        <DialogContent>State managed internally.</DialogContent>
        <DialogActions>
          <DialogTrigger>
            <Button>Close</Button>
          </DialogTrigger>
        </DialogActions>
      </DialogBody>
    </DialogSurface>
  </Dialog>
);
```

### Controlled

```typescript
import * as React from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Button,
} from '@fluentui/react-components';
import type { DialogOpenChangeData, DialogOpenChangeEvent } from '@fluentui/react-components';

export const ControlledDialog: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  const handleOpenChange = React.useCallback(
    (_ev: DialogOpenChangeEvent, data: DialogOpenChangeData) => {
      setOpen(data.open);
    },
    []
  );

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Controlled Dialog</DialogTitle>
            <DialogContent>State managed by parent.</DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button appearance="primary" onClick={() => setOpen(false)}>
                Confirm
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
};
```

---

## Modal Types

### Modal (Default)

Standard modal with backdrop that blocks interaction:

```typescript
<Dialog modalType="modal">
  {/* Focus trapped, backdrop blocks interaction */}
</Dialog>
```

### Non-Modal

Dialog without backdrop, allows interaction with page:

```typescript
<Dialog modalType="non-modal">
  {/* No focus trap, page remains interactive */}
</Dialog>
```

### Alert

For important messages that require acknowledgment:

```typescript
<Dialog modalType="alert">
  {/* Screen readers announce as alert, requires action to dismiss */}
</Dialog>
```

---

## Alert Dialog Pattern

```typescript
import * as React from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  DialogTrigger,
  Button,
} from '@fluentui/react-components';

export const AlertDialog: React.FC = () => (
  <Dialog modalType="alert">
    <DialogTrigger>
      <Button appearance="primary" style={{ backgroundColor: '#d13438' }}>
        Delete Item
      </Button>
    </DialogTrigger>
    <DialogSurface>
      <DialogBody>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this item? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <DialogTrigger>
            <Button appearance="secondary">Cancel</Button>
          </DialogTrigger>
          <Button appearance="primary" style={{ backgroundColor: '#d13438' }}>
            Delete
          </Button>
        </DialogActions>
      </DialogBody>
    </DialogSurface>
  </Dialog>
);
```

---

## Form Dialog

```typescript
import * as React from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  DialogTrigger,
  Button,
  Field,
  Input,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
});

export const FormDialog: React.FC = () => {
  const styles = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add User</Button>
      <Dialog open={open} onOpenChange={(_, data) => setOpen(data.open)}>
        <DialogSurface>
          <form onSubmit={handleSubmit}>
            <DialogBody>
              <DialogTitle>Add New User</DialogTitle>
              <DialogContent className={styles.form}>
                <Field label="Name" required>
                  <Input />
                </Field>
                <Field label="Email" required>
                  <Input type="email" />
                </Field>
              </DialogContent>
              <DialogActions>
                <Button appearance="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button appearance="primary" type="submit">
                  Add User
                </Button>
              </DialogActions>
            </DialogBody>
          </form>
        </DialogSurface>
      </Dialog>
    </>
  );
};
```

---

## With Close Button

```typescript
import * as React from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogTrigger,
  Button,
} from '@fluentui/react-components';

export const DialogWithCloseButton: React.FC = () => (
  <Dialog>
    <DialogTrigger>
      <Button>Open Dialog</Button>
    </DialogTrigger>
    <DialogSurface>
      <DialogBody>
        <DialogTitle
          action={
            <DialogTrigger>
              <Button
                appearance="subtle"
                aria-label="Close"
                icon={<DismissRegular />}
              />
            </DialogTrigger>
          }
        >
          Dialog with Close Button
        </DialogTitle>
        <DialogContent>
          Click the X button to close this dialog.
        </DialogContent>
      </DialogBody>
    </DialogSurface>
  </Dialog>
);
```

---

## Scrolling Content

```typescript
import * as React from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  DialogTrigger,
  Button,
  makeStyles,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  content: {
    maxHeight: '300px',
    overflowY: 'auto',
  },
});

export const ScrollingDialog: React.FC = () => {
  const styles = useStyles();

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Open Scrolling Dialog</Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogContent className={styles.content}>
            {/* Long content here */}
            <p>Lorem ipsum dolor sit amet...</p>
            {/* More paragraphs */}
          </DialogContent>
          <DialogActions>
            <DialogTrigger>
              <Button appearance="secondary">Decline</Button>
            </DialogTrigger>
            <Button appearance="primary">Accept</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
```

---

## Accessibility

### Keyboard Support

| Key | Action |
|-----|--------|
| `Tab` | Move focus within dialog |
| `Escape` | Close the dialog |
| `Enter` | Activate focused button |

### ARIA Attributes

| Element | Attribute | Value |
|---------|-----------|-------|
| DialogSurface | `role` | `dialog` or `alertdialog` |
| DialogSurface | `aria-modal` | `true` |
| DialogSurface | `aria-labelledby` | References DialogTitle |
| DialogSurface | `aria-describedby` | References DialogContent |

### Best Practices

```typescript
// ✅ Always provide a title
<DialogTitle>Clear and descriptive title</DialogTitle>

// ✅ Use alert type for important confirmations
<Dialog modalType="alert">
  <DialogSurface>
    <DialogTitle>Delete Confirmation</DialogTitle>
  </DialogSurface>
</Dialog>

// ✅ Provide cancel option
<DialogActions>
  <DialogTrigger><Button>Cancel</Button></DialogTrigger>
  <Button appearance="primary">Confirm</Button>
</DialogActions>
```

---

## Best Practices

### ✅ Do's

```typescript
// ✅ Keep dialogs focused on single task
<Dialog>
  <DialogTitle>Confirm Delete</DialogTitle>
  <DialogContent>Are you sure?</DialogContent>
</Dialog>

// ✅ Use primary button for main action
<DialogActions>
  <Button>Cancel</Button>
  <Button appearance="primary">Save</Button>
</DialogActions>

// ✅ Use alert type for destructive actions
<Dialog modalType="alert">...</Dialog>
```

### ❌ Don'ts

```typescript
// ❌ Don't nest dialogs
<Dialog>
  <Dialog>...</Dialog>  // Bad
</Dialog>

// ❌ Don't use for simple messages (use MessageBar or Toast)
<Dialog>
  <DialogContent>Success!</DialogContent>
</Dialog>

// ❌ Don't overload with too much content
```

---

## See Also

- [Toast](toast.md) - Non-blocking notifications
- [MessageBar](messagebar.md) - Inline messages
- [Drawer](../overlays/drawer.md) - Side panel overlay
- [Component Index](../00-component-index.md)