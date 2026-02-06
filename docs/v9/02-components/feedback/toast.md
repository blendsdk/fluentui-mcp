# Toast

> **Package**: `@fluentui/react-toast`
> **Import**: `import { Toaster, useToastController, Toast, ToastTitle, ToastBody, ToastFooter } from '@fluentui/react-components'`
> **Category**: Feedback

## Overview

Toast displays brief, temporary notifications that appear at a fixed position on screen. Use for non-critical information that doesn't require user action.

---

## Setup

Toast requires a `Toaster` component and the `useToastController` hook:

```typescript
import * as React from 'react';
import {
  FluentProvider,
  webLightTheme,
  Toaster,
  useId,
} from '@fluentui/react-components';

export const App: React.FC = () => {
  const toasterId = useId('toaster');
  
  return (
    <FluentProvider theme={webLightTheme}>
      <Toaster toasterId={toasterId} />
      <YourAppContent toasterId={toasterId} />
    </FluentProvider>
  );
};
```

---

## Basic Usage

```typescript
import * as React from 'react';
import {
  useToastController,
  Toast,
  ToastTitle,
  Button,
} from '@fluentui/react-components';

interface Props {
  toasterId: string;
}

export const ToastExample: React.FC<Props> = ({ toasterId }) => {
  const { dispatchToast } = useToastController(toasterId);

  const showToast = () => {
    dispatchToast(
      <Toast>
        <ToastTitle>Action completed</ToastTitle>
      </Toast>,
      { intent: 'success' }
    );
  };

  return <Button onClick={showToast}>Show Toast</Button>;
};
```

---

## Toast Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `intent` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Toast type |
| `position` | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end'` | `'bottom-end'` | Screen position |
| `timeout` | `number` | `3000` | Auto-dismiss time (ms) |
| `pauseOnHover` | `boolean` | `false` | Pause timeout on hover |
| `pauseOnWindowBlur` | `boolean` | `false` | Pause when window loses focus |

---

## Intent Variants

```typescript
const { dispatchToast } = useToastController(toasterId);

// Info
dispatchToast(<Toast><ToastTitle>Info message</ToastTitle></Toast>, { intent: 'info' });

// Success
dispatchToast(<Toast><ToastTitle>Success!</ToastTitle></Toast>, { intent: 'success' });

// Warning
dispatchToast(<Toast><ToastTitle>Warning</ToastTitle></Toast>, { intent: 'warning' });

// Error
dispatchToast(<Toast><ToastTitle>Error occurred</ToastTitle></Toast>, { intent: 'error' });
```

---

## With Body and Footer

```typescript
dispatchToast(
  <Toast>
    <ToastTitle action={<Link>Undo</Link>}>File uploaded</ToastTitle>
    <ToastBody subtitle="2 MB">document.pdf was uploaded successfully</ToastBody>
    <ToastFooter>
      <Link>View file</Link>
      <Link>Share</Link>
    </ToastFooter>
  </Toast>,
  { intent: 'success' }
);
```

---

## Dismissing Toasts

```typescript
const { dispatchToast, dismissToast, dismissAllToasts } = useToastController(toasterId);

// Dispatch with ID
const toastId = 'unique-toast-id';
dispatchToast(
  <Toast><ToastTitle>Dismissible</ToastTitle></Toast>,
  { toastId }
);

// Dismiss specific toast
dismissToast(toastId);

// Dismiss all toasts
dismissAllToasts();
```

---

## Accessibility

- Toasts use `role="status"` and `aria-live="polite"`
- Screen readers announce new toasts
- Don't use for critical actions requiring user response

---

## Best Practices

### ✅ Do's

```typescript
// Brief, informative messages
dispatchToast(<Toast><ToastTitle>Saved</ToastTitle></Toast>);

// Provide undo for reversible actions
<ToastTitle action={<Link>Undo</Link>}>Item deleted</ToastTitle>
```

### ❌ Don'ts

```typescript
// Don't use for critical errors (use Dialog)
// Don't show multiple toasts at once
// Don't require user action in toasts
```

---

## See Also

- [MessageBar](messagebar.md) - Inline messages
- [Dialog](dialog.md) - Modal messages
- [Component Index](../00-component-index.md)