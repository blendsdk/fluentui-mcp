# Confirm Dialog

> **Group**: modals

## Goal

Build an accessible, reusable confirm dialog with Fluent UI v9's Dialog family: a controlled modal that asks a single proceed/go-back question, with variants for routine confirmation, irreversible (alert) confirmation with typed confirmation, and async confirmation with pending and error states, while focus is trapped inside the modal and returned to the trigger on close.

## When to Use

Use this recipe whenever an action needs explicit acknowledgement before it runs: deleting or overwriting data, discarding unsaved changes, leaving a page with unsaved work, publishing to end users, or any server call the user should confirm. It also covers the three common strengths: a plain two-button confirmation, a destructive confirmation guarded by modalType='alert' and a typed confirmation input, and an async confirmation that stays open while the work is in flight.

## When Not to Use

Avoid a confirm dialog when the action is cheap and reversible - just do it and offer a Toast with an undo action instead. Do not use it for multi-field or multi-step input; use a Dialog composed with form controls or a Drawer for a full editing experience. Do not use it for non-blocking information or passive errors; use MessageBar or Toast. Do not use it to host content anchored to a trigger (help text, extra options); use Popover or Menu. And do not use window.confirm or a hand-rolled portal: you lose the dialog role, focus trap, focus restore, Escape handling and theming that Dialog already provides.

A confirm dialog interrupts a task with exactly one decision: **proceed** or **go back**. With Fluent UI v9 you compose it from the `Dialog` family rather than `window.confirm` or a hand-rolled overlay, so you inherit the dialog role, focus trap, focus restore, Escape/backdrop handling and theming.

## 1. Anatomy

`Dialog` is the behavior root; `DialogTrigger` and `DialogSurface` are its two children. Inside the surface, `DialogBody` lays out three regions:

| Element | Responsibility |
| --- | --- |
| `Dialog` | Open state, `modalType`, focus trap and restore, portal rendering. |
| `DialogTrigger` | The control that opens (or closes) the dialog. Wrap the initiating `Button`. |
| `DialogSurface` | Backdrop plus the element that carries `role="dialog"`. |
| `DialogTitle` | The question. Provides the dialog's accessible name. |
| `DialogContent` | Consequence text, typed-confirmation inputs and in-dialog error UI. |
| `DialogActions` | The buttons; `position` and `fluid` adapt the row for narrow screens. |

```tsx
<Dialog open={open} onOpenChange={handleOpenChange}>
  <DialogTrigger disableButtonEnhancement>
    <Button>Delete repository</Button>
  </DialogTrigger>
  <DialogSurface>
    <DialogBody>
      <DialogTitle>Delete this repository?</DialogTitle>
      <DialogContent>All branches and history will be removed.</DialogContent>
      <DialogActions>
        <Button appearance="secondary" onClick={close}>
          Cancel
        </Button>
        <Button appearance="primary" onClick={confirm}>
          Delete
        </Button>
      </DialogActions>
    </DialogBody>
  </DialogSurface>
</Dialog>
```

## 2. Own the open state

Pass `open` with `onOpenChange` (controlled). `onOpenChange` fires for **every** dismissal path - trigger click, Escape, backdrop click - so it is the single place to close the dialog and reset per-decision state (typed text, error message, touched flags).

Use the uncontrolled `defaultOpen` only for static demos; a real confirm dialog almost always needs to reset or to guard against dismissal.

## 3. Pick the confirmation strength

| Strength | When to use | What to add |
| --- | --- | --- |
| Two buttons, default `modalType="modal"` | Reversible, low-cost actions. Escape and backdrop click mean cancel. | `DialogTitle` plus one sentence of `DialogContent`. |
| `modalType="alert"` | Destructive or irreversible actions. Escape and backdrop click no longer dismiss. | Same layout, with an explicit verb on the confirm button. |
| Typed confirmation | Hard-to-reverse data loss (delete a project, drop a database). | `Field` + `Input` and a match check in the confirm handler. |
| Async confirmation | The decision triggers a server call. | `Spinner` in the confirm button, `disabledFocusable` on both buttons, `MessageBar` for failures. |

## 4. Wire the decision

**Synchronous action:** close the dialog first, then run the action. The trigger regains focus immediately and the action never competes with the exit animation.

**Async action:** keep the dialog open. Set a pending flag, make both buttons `disabledFocusable` (the button stays focusable, so focus is not dropped mid-flight), and close only after the promise resolves. On rejection, keep the dialog open and render the failure inside `DialogContent`, usually with `MessageBar intent="error"`. While the request is in flight, ignore close requests in `onOpenChange` so the user always sees the outcome.

## 5. Make the dialog reusable

Keep the decision in the parent (`onConfirm` prop) and the presentation in a small component that takes `title`, `body`, `confirmText` and `confirmAppearance`. The same `ConfirmDialog` then serves discard, publish and leave-page flows with only copy changes.

State that lives inside the dialog (typed confirmation, error text) is lost when the dialog unmounts on close: either reset it deliberately in your close handler, or pass `unmountOnClose={false}` when stateful children must survive.

## 6. Accessibility checklist

- `DialogSurface` renders `role="dialog"` (or `role="alertdialog"` with `modalType="alert"`) and `aria-modal="true"`; `DialogTitle` supplies the accessible name, so always render one.
- Focus moves into the dialog on open, is trapped while open, and returns to the trigger on close. Add `inertTrapFocus` so the rest of the page is `inert` and assistive technology cannot navigate out of the modal.
- Put the non-destructive action first in the DOM: the first focusable element receives initial focus.
- Label buttons with the verb ('Delete permanently', 'Discard draft'), never 'OK' or 'Yes'.
- Report failures with `MessageBar intent="error"` inside the dialog (use `politeness="assertive"` when the message must interrupt); a Toast can be hidden behind the modal.

## Examples

### Reusable ConfirmDialog with trigger, Cancel and Confirm

A controlled two-button confirm dialog component plus a usage example. The trigger opens it, Escape and backdrop click cancel, the confirm handler closes the dialog before running the action so focus returns to the trigger.

```tsx
import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
} from '@fluentui/react-components';

type ConfirmAppearance = 'primary' | 'secondary' | 'outline' | 'subtle' | 'transparent';

export interface ConfirmDialogProps {
  /** Label of the button that opens the dialog. */
  triggerText: string;
  /** The question, e.g. 'Discard this draft?'. Becomes the accessible name. */
  title: string;
  /** One or two sentences: what happens, and whether it can be undone. */
  body: React.ReactNode;
  /** A verb, not 'OK'. e.g. 'Discard', 'Delete', 'Publish'. */
  confirmText?: string;
  cancelText?: string;
  /** Visual weight of the confirm button. */
  confirmAppearance?: ConfirmAppearance;
  confirmDisabled?: boolean;
  onConfirm: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  triggerText,
  title,
  body,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmAppearance = 'primary',
  confirmDisabled = false,
  onConfirm,
}) => {
  const [open, setOpen] = React.useState(false);

  // Fires for trigger click, Escape and backdrop click.
  const handleOpenChange = React.useCallback((_event: unknown, data: { open: boolean }) => {
    setOpen(data.open);
  }, []);

  const handleConfirm = React.useCallback(() => {
    // Close first so focus returns to the trigger before the action runs.
    setOpen(false);
    onConfirm();
  }, [onConfirm]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} inertTrapFocus>
      <DialogTrigger disableButtonEnhancement>
        <Button>{triggerText}</Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>{body}</DialogContent>
          <DialogActions>
            {/* Cancel first: the first focusable element receives initial focus. */}
            <Button appearance="secondary" onClick={() => setOpen(false)}>
              {cancelText}
            </Button>
            <Button
              appearance={confirmAppearance}
              disabled={confirmDisabled}
              onClick={handleConfirm}
            >
              {confirmText}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

/** Usage: the decision itself lives in the calling component. */
export const DiscardDraftExample: React.FC = () => (
  <ConfirmDialog
    triggerText="Discard draft"
    title="Discard this draft?"
    body="Your unsaved changes will be lost. This can't be undone."
    confirmText="Discard"
    cancelText="Keep editing"
    onConfirm={() => {
      // e.g. clear the editor state and navigate away
    }}
  />
);
```

### Destructive confirmation with typed name (alert dialog)

An irreversible delete uses modalType='alert' so Escape and backdrop cannot dismiss it, requires the user to type the resource name into a Field + Input, and validates on submit with an inline Field error instead of silently closing.

```tsx
import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  Text,
} from '@fluentui/react-components';

export interface DeleteRepositoryDialogProps {
  repositoryName: string;
  onDelete: (repositoryName: string) => void;
}

export const DeleteRepositoryDialog: React.FC<DeleteRepositoryDialogProps> = ({
  repositoryName,
  onDelete,
}) => {
  const [open, setOpen] = React.useState(false);
  const [typedName, setTypedName] = React.useState('');
  const [touched, setTouched] = React.useState(false);

  const isMatch = typedName.trim() === repositoryName;
  const showError = touched && !isMatch;

  const close = React.useCallback(() => {
    setOpen(false);
    // Reset per-decision state so the dialog is reusable.
    setTypedName('');
    setTouched(false);
  }, []);

  const handleOpenChange = React.useCallback(
    (_event: unknown, data: { open: boolean }) => {
      if (data.open) {
        setOpen(true);
      } else {
        close();
      }
    },
    [close],
  );

  const handleDelete = React.useCallback(() => {
    if (!isMatch) {
      // Keep the dialog open and explain what is missing.
      setTouched(true);
      return;
    }
    close();
    onDelete(repositoryName);
  }, [close, isMatch, onDelete, repositoryName]);

  return (
    // alert: Escape and backdrop click do not dismiss, the user must decide.
    <Dialog open={open} onOpenChange={handleOpenChange} modalType="alert" inertTrapFocus>
      <DialogTrigger disableButtonEnhancement>
        <Button>Delete repository</Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Delete '{repositoryName}'?</DialogTitle>
          <DialogContent>
            <Text block>
              All branches, tags and history will be permanently removed. This action cannot be
              undone.
            </Text>
            <Field
              label={`Type '${repositoryName}' to confirm`}
              required
              validationState={showError ? 'error' : 'none'}
              validationMessage={showError ? 'The name you typed does not match.' : undefined}
            >
              <Input
                value={typedName}
                placeholder={repositoryName}
                onChange={(_ev, data) => {
                  setTypedName(data.value);
                  setTouched(true);
                }}
              />
            </Field>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={close}>
              Cancel
            </Button>
            <Button appearance="primary" onClick={handleDelete}>
              Delete permanently
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
```

### Async confirm with pending and error states

Publishing keeps the dialog open while the request is in flight: close requests are ignored, both buttons become disabledFocusable so focus is not lost, a Spinner replaces the button icon, and failures render in a MessageBar inside the dialog.

```tsx
import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Spinner,
} from '@fluentui/react-components';

type Status = 'idle' | 'pending' | 'error';

/** Replace with the real API call. */
const publishRelease = async (): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve();
      } else {
        reject(new Error('The release service is unavailable. Please try again.'));
      }
    }, 1200);
  });
};

export const PublishReleaseDialog: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState<Status>('idle');
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined);
  const isPending = status === 'pending';

  const reset = React.useCallback(() => {
    setStatus('idle');
    setErrorMessage(undefined);
  }, []);

  const handleOpenChange = React.useCallback(
    (_event: unknown, data: { open: boolean }) => {
      // Ignore close requests (Escape, backdrop) while the request is in flight
      // so the user always sees the outcome.
      if (!data.open && isPending) {
        return;
      }
      setOpen(data.open);
      if (!data.open) {
        reset();
      }
    },
    [isPending, reset],
  );

  const handleConfirm = React.useCallback(async () => {
    setStatus('pending');
    setErrorMessage(undefined);
    try {
      await publishRelease();
      setOpen(false);
      reset();
    } catch (error) {
      // Keep the dialog open so the failure is impossible to miss.
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong.');
    }
  }, [reset]);

  const closeAndReset = React.useCallback(() => {
    setOpen(false);
    reset();
  }, [reset]);

  return (
    // unmountOnClose={false} keeps the dialog subtree (and any stateful children) alive.
    <Dialog open={open} onOpenChange={handleOpenChange} unmountOnClose={false} inertTrapFocus>
      <DialogTrigger disableButtonEnhancement>
        <Button appearance="primary">Publish release</Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Publish version 2.4.0?</DialogTitle>
          <DialogContent>
            Publishing makes this version available to every customer immediately.{' '}
            {status === 'error' && (
              <MessageBar intent="error" politeness="assertive">
                <MessageBarBody>
                  <MessageBarTitle>Publish failed</MessageBarTitle>
                  {errorMessage}
                </MessageBarBody>
              </MessageBar>
            )}
          </DialogContent>
          <DialogActions>
            {/* disabledFocusable keeps the buttons focusable while unusable. */}
            <Button appearance="secondary" disabledFocusable={isPending} onClick={closeAndReset}>
              Cancel
            </Button>
            <Button
              appearance="primary"
              disabledFocusable={isPending}
              icon={isPending ? <Spinner size="tiny" /> : undefined}
              onClick={() => void handleConfirm()}
            >
              {isPending ? 'Publishing...' : 'Publish'}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
```

## Pitfalls

- Running the action before closing the dialog (or closing before an async action resolves). A synchronous action should close the dialog first so focus returns to the trigger before layout changes; an async action should keep the dialog open, disable the actions with disabledFocusable, and close only on success. Closing early hides failures and invites double submits.
- Using window.confirm, a Popover, or a hand-rolled Portal for confirmation. You lose role="dialog", aria-modal, the focus trap, focus restore, Escape handling, and Fluent theming. Compose Dialog + DialogTrigger + DialogSurface instead.
- Defaulting everything to modalType="alert". Blocking Escape and backdrop dismissal is correct for irreversible actions but frustrating for routine confirmations, where Escape and backdrop click should mean cancel (the default modalType="modal").
- Vague button labels such as 'OK', 'Yes' or 'Submit'. Name the action with its verb ('Delete permanently', 'Discard draft') so the consequence is clear from the button alone, especially for screen reader users navigating by control.
- Wrapping a Button in DialogTrigger without disableButtonEnhancement, which nests an extra interactive element and produces confusing focus and click behavior. Pass disableButtonEnhancement whenever the child is already a Button.
- Losing in-dialog state (typed confirmation, error text) on close. Dialog content unmounts by default when it closes - reset that state deliberately in onOpenChange, or pass unmountOnClose={false} when stateful children must survive.
- Validating a typed confirmation by merely disabling the primary button. The user gets a dead button with no explanation; keep the button enabled, validate in the confirm handler, and surface the mismatch through Field validationState/validationMessage while keeping the dialog open.

## Accessibility

DialogSurface renders role="dialog" (role="alertdialog" when modalType="alert") with aria-modal="true", and DialogTitle supplies the dialog's accessible name, so always render a DialogTitle with a real question. Focus is moved into the dialog when it opens, trapped while it is open, and returned to the trigger when it closes; add inertTrapFocus so the rest of the page becomes inert and screen readers cannot escape the modal. Because the first focusable element receives initial focus, place the cancel/least-destructive action first in the DOM and keep the destructive action last. Use modalType="alert" only for destructive or irreversible decisions: it removes Escape and backdrop dismissal so the user must make an explicit choice, which is expected for alerts but hostile for routine confirmations. Label buttons with the verb ('Delete permanently', 'Discard draft') rather than 'OK'/'Yes', so the consequence is unambiguous when a screen reader announces only the button text. For typed confirmation, Field wires the label, required state, and validation message to the Input (including aria-invalid) - do not reimplement it with a bare label. For async work, expose the pending state both visually (Spinner, changed label) and programmatically by using disabledFocusable on the actions, and announce failures with MessageBar intent="error" (politeness="assertive" if it must interrupt) inside the dialog, since a Toast may be obscured by the modal.

## Components used

- [Dialog](../../components/dialog.md)
- [DialogTrigger](../../components/dialog-trigger.md)
- [DialogSurface](../../components/dialog-surface.md)
- [DialogBody](../../components/dialog-body.md)
- [DialogTitle](../../components/dialog-title.md)
- [DialogContent](../../components/dialog-content.md)
- [DialogActions](../../components/dialog-actions.md)
- [Button](../../components/button.md)
- [Field](../../components/field.md)
- [Input](../../components/input.md)
- [Text](../../components/text.md)
- [MessageBar](../../components/message-bar.md)
- [MessageBarBody](../../components/message-bar-body.md)
- [MessageBarTitle](../../components/message-bar-title.md)
- [Spinner](../../components/spinner.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
