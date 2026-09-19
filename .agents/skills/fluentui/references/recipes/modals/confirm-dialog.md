# Confirm Dialog

> **Group**: modals

## Goal

Build an accessible, reusable confirm dialog in Fluent UI React v9 that asks a single binary question, defaults focus to the safe (cancel) action, keeps itself open while async work runs, and supports extra friction (acknowledgement checkbox, type-to-confirm) for destructive actions.

## When to Use

Use it when the user must explicitly approve or acknowledge one high-consequence decision before it happens: deleting or archiving a resource, discarding unsaved changes, publishing/sending something, leaving a flow with unsaved data, or approving an irreversible bulk action. Also use it when you want an imperative `const ok = await confirm({...})` API backed by a real, accessible dialog instead of `window.confirm`.

## When Not to Use

Do not use it for multi-field or multi-step tasks (use a regular Dialog with DialogBody/Field/Input, or a Drawer); for non-blocking status or success messages (use MessageBar or Toast); for cheap, easily undone actions (just do it and offer Undo in a Toast instead of asking first); for inline form validation (use Field `validationState`); or for informational content that requires no decision (use a plain Dialog, Popover, or Tooltip). Avoid stacking a confirm dialog on top of another modal - close the first one or use an inline confirmation inside it.

# Confirm Dialog

A confirm dialog is a small, blocking decision point: one question, at most a couple of sentences of explanation, and two buttons - cancel and confirm. Everything in this recipe exists to make that decision **safe**: the least destructive action is focused first, in-flight work keeps the dialog open, and truly destructive confirmations require deliberate friction (an acknowledgement checkbox and/or a type-to-confirm field).

## Anatomy of the composition

`Dialog` is a compound component. Wire it up like this:

| Piece | Role in the recipe |
| --- | --- |
| `Dialog` | Owns `open`, `onOpenChange`, `modalType`, the focus trap, Escape/backdrop handling, and focus restoration. |
| `DialogSurface` > `DialogBody` | The visual surface plus the standard title/content/actions layout. |
| `DialogTitle` | The question itself. It also supplies the surface's accessible name. |
| `DialogContent` | Consequences, guardrails (`Checkbox`, `Field` + `Input`), and inline errors (`MessageBar`). |
| `DialogActions` | Exactly two `Button`s: `appearance="secondary"` to cancel, `appearance="primary"` to confirm. |

## 1. Control `open` - never mount the dialog conditionally

```tsx
const [open, setOpen] = React.useState(false);

<Button appearance="primary" onClick={() => setOpen(true)}>Delete file</Button>

<Dialog
  open={open}
  modalType="alert"
  inertTrapFocus
  onOpenChange={(_event, data) => {
    if (data.open) return;
    if (pending) return; // veto Escape / backdrop while an action is running
    setOpen(false);      // every close path funnels through here
  }}
>
```

* `modalType="alert"` puts `role="alertdialog"` on the surface - the right role for a confirmation that expects an immediate answer. Use the default `"modal"` for dialogs that contain a form, and `"non-modal"` only when the dialog must not block the page (`inertTrapFocus` is not supported for non-modal dialogs).
* `data.open === false` is emitted for Escape, backdrop clicks and trigger clicks; branch on `data.type` (`'escapeKeyDown'`, `'backdropClick'`) only if you need per-interaction behavior.
* Because `open` is controlled, simply *not* calling `setOpen` is how you veto a dismissal. That is the whole mechanism behind "don't close while saving".
* Do not render `{open && <Dialog ... />}` - unmounting the component skips the Fluent enter/exit motion, the surface's `unmountOnClose` semantics, and focus restoration to the element that opened the dialog.

## 2. Order and style the actions

* Render **cancel first, confirm last**. The first focusable element inside the surface receives focus, so cancel becomes the default and accidental Enter presses are non-destructive. Add `autoFocus` to the cancel button when you want to be explicit.
* Cancel is `appearance="secondary"`; confirm is `appearance="primary"`.
* For destructive confirmations keep the primary button but tint it with the theme token, e.g. `style={{ backgroundColor: 'var(--colorPaletteRedBackground3)' }}`. Don't invent new `appearance` values.
* Label the action, not the answer: "Delete workspace" / "Discard draft" beats "OK" / "Yes".
* Two buttons maximum. If you need a third, you probably need a form dialog instead.

## 3. Async work: stay open, go busy

* Keep the dialog open until the operation settles, then close it from your own state. Closing first and toasting the result hides progress and blocks retries.
* While `pending`: disable **both** buttons, render a `Spinner` in the confirm button, and set `preventDismiss` so Escape and backdrop clicks are ignored.
* Keep the confirm button's label unchanged while pending so its accessible name stays stable; the disabled state plus the spinner communicate the busy state.
* On failure keep the dialog open and show the error inline with `MessageBar` inside `DialogContent` so the user can retry or cancel.

## 4. Guardrails for destructive actions

Add friction proportional to the damage:

1. **Acknowledgement**: `<Checkbox>I understand that this action can't be undone</Checkbox>`.
2. **Type-to-confirm**: a `Field` labelled `Type "<resource name>" to confirm` wrapping an `Input`, comparing the typed value to the resource name and showing `validationState="error"` on mismatch.

Derive a single `canConfirm` boolean from the guardrails (plus `!pending`) and drive the confirm button's `disabled` prop from it, so the rules live in one place.

## 5. A promise-based `useConfirm()` API

For many call sites, an imperative API reads better than a mounted component per button:

```tsx
const confirm = useConfirm();
const ok = await confirm({
  title: 'Discard draft?',
  description: 'Your unsaved changes will be lost.',
  confirmLabel: 'Discard',
  intent: 'destructive',
});
if (ok) { /* proceed */ }
```

Implement it with a provider that renders **one** `Dialog` and resolves a stored promise. The critical rule: *every* exit path - confirm, cancel, Escape, backdrop - must settle the promise, otherwise the awaiting code hangs forever. Resolve with `false` for cancel/Escape/backdrop and `true` for confirm.

## 6. Reset state on reopen

Any state you hold inside the dialog (checkbox, typed name, error message, pending flag) must be re-armed each time it opens, or a stale acknowledgement lets the next deletion through. Reset in an effect keyed on `open` and the resource id, or let the surface unmount via the `unmountOnClose` prop of `Dialog`.

## 7. Composition notes

* Keep the state that drives `open` in the component that owns the action (the row, the settings page, the editor), and pass `open`/`onConfirm`/`onCancel` into the reusable `ConfirmDialog`.
* Dialog surfaces are portaled to the document body automatically, so it is safe to render them deep inside lists or cards - no extra `Portal` needed.
* Theme comes from the surrounding `Provider`; the surface, buttons and message bars pick up brand colors, RTL and high-contrast styles automatically. Avoid hard-coded pixel widths - `DialogSurface` already caps its width for readability.

## Examples

### Reusable controlled ConfirmDialog

A small, fully typed confirm dialog component with title/description, cancel-first focus order, pending state with a Spinner, an optional destructive button tint, and a demo of an async confirm that keeps the dialog open until publishing finishes.

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
  Spinner,
  Text,
} from '@fluentui/react-components';

/** Replace with your real API call. */
const publishArticle = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
};

export interface ConfirmDialogProps {
  /** Always drive this from state - never conditionally render <Dialog />. */
  open: boolean;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  intent?: 'default' | 'destructive';
  /** Disables both actions and shows a spinner inside the confirm button. */
  pending?: boolean;
  /** Ignore Escape / backdrop requests, e.g. while an async action is running. */
  preventDismiss?: boolean;
  /** Extra content (guardrails, fields, ...) between the text and the actions. */
  children?: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

const destructiveButtonStyle: React.CSSProperties = {
  backgroundColor: 'var(--colorPaletteRedBackground3)',
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  intent = 'default',
  pending = false,
  preventDismiss = false,
  children,
  onConfirm,
  onCancel,
}) => {
  const handleOpenChange: React.ComponentProps<typeof Dialog>['onOpenChange'] = (_event, data) => {
    if (data.open) {
      return;
    }
    if (preventDismiss || pending) {
      // `open` is controlled: not updating state keeps the dialog on screen.
      return;
    }
    onCancel();
  };

  return (
    <Dialog open={open} modalType="alert" inertTrapFocus onOpenChange={handleOpenChange}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            {description ? <Text block>{description}</Text> : null}
            {children}
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" autoFocus disabled={pending} onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button
              appearance="primary"
              disabled={pending}
              icon={pending ? <Spinner size="tiny" appearance="inverted" /> : undefined}
              style={intent === 'destructive' ? destructiveButtonStyle : undefined}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export const PublishArticleExample: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  const handleConfirm = async () => {
    setPending(true);
    try {
      await publishArticle();
      setOpen(false);
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <Button appearance="primary" onClick={() => setOpen(true)}>
        Publish article
      </Button>

      <ConfirmDialog
        open={open}
        title="Publish this article?"
        description="Publishing makes this article visible to everyone on the internet. You can still edit it afterwards."
        confirmLabel="Publish"
        pending={pending}
        preventDismiss
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};
```

### Destructive delete with type-to-confirm and inline errors

A high-friction confirmation: an acknowledgement Checkbox plus a Field/Input type-to-confirm guardrail, a destructively tinted primary button that stays disabled until both guardrails pass, an async delete that keeps the dialog open with a Spinner, and a MessageBar for API failures.

```tsx
import * as React from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  Spinner,
  Text,
} from '@fluentui/react-components';

export interface Workspace {
  id: string;
  name: string;
}

export interface DeleteWorkspaceDialogProps {
  /** The workspace to delete, or null when the dialog should be closed. */
  workspace: Workspace | null;
  /** Perform the deletion. Reject to keep the dialog open and show the error. */
  onDelete: (id: string) => Promise<void>;
  onDeleted: (workspace: Workspace) => void;
  onDismiss: () => void;
}

const destructiveButtonStyle: React.CSSProperties = {
  backgroundColor: 'var(--colorPaletteRedBackground3)',
};

export const DeleteWorkspaceDialog: React.FC<DeleteWorkspaceDialogProps> = ({
  workspace,
  onDelete,
  onDeleted,
  onDismiss,
}) => {
  const open = workspace !== null;
  const [acknowledged, setAcknowledged] = React.useState(false);
  const [typedName, setTypedName] = React.useState('');
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Re-arm the guardrails every time a (different) workspace is targeted.
  React.useEffect(() => {
    if (open) {
      setAcknowledged(false);
      setTypedName('');
      setPending(false);
      setError(null);
    }
  }, [open, workspace?.id]);

  const nameMatches = workspace !== null && typedName.trim() === workspace.name;
  const showMismatch = typedName.length > 0 && !nameMatches;
  const canDelete = acknowledged && nameMatches && !pending;

  const handleDelete = async () => {
    if (!workspace || !canDelete) {
      return;
    }
    setPending(true);
    setError(null);
    try {
      await onDelete(workspace.id);
      onDeleted(workspace);
      onDismiss();
    } catch (err) {
      // Keep the dialog open so the user can retry or cancel.
      setError(err instanceof Error ? err.message : 'The workspace could not be deleted.');
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog
      open={open}
      modalType="alert"
      inertTrapFocus
      onOpenChange={(_event, data) => {
        // Escape and backdrop clicks cancel, but never while the delete is in flight.
        if (!data.open && !pending) {
          onDismiss();
        }
      }}
    >
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Delete {workspace?.name}?</DialogTitle>
          <DialogContent>
            <Text block>
              This permanently deletes the workspace, its files and its members. This action cannot
              be undone.
            </Text>

            <Checkbox
              checked={acknowledged}
              onChange={(_event, data) => setAcknowledged(data.checked === true)}
            >
              I understand that this action cannot be undone
            </Checkbox>

            <Field
              label={`Type "${workspace?.name ?? ''}" to confirm`}
              required
              validationState={showMismatch ? 'error' : 'none'}
              validationMessage={showMismatch ? 'The name does not match.' : undefined}
            >
              <Input
                value={typedName}
                placeholder={workspace?.name}
                disabled={pending}
                onChange={(_event, data) => setTypedName(data.value)}
              />
            </Field>

            {error ? (
              <MessageBar intent="error">
                <MessageBarBody>{error}</MessageBarBody>
              </MessageBar>
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" autoFocus disabled={pending} onClick={onDismiss}>
              Cancel
            </Button>
            <Button
              appearance="primary"
              style={destructiveButtonStyle}
              disabled={!canDelete}
              icon={pending ? <Spinner size="tiny" appearance="inverted" /> : undefined}
              onClick={handleDelete}
            >
              Delete workspace
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

/** Host component: owns the selection state and the (fake) API call. */
export const WorkspaceDangerZoneExample: React.FC = () => {
  const workspace: Workspace = { id: 'ws-1', name: 'Contoso Reports' };
  const [target, setTarget] = React.useState<Workspace | null>(null);
  const [status, setStatus] = React.useState('Workspace still exists.');

  const deleteWorkspace = React.useCallback(async (_id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    // throw new Error('Network error - please try again.'); // simulate a failure
  }, []);

  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <Button appearance="primary" onClick={() => setTarget(workspace)}>
        Delete workspace
      </Button>
      <Text>{status}</Text>

      <DeleteWorkspaceDialog
        workspace={target}
        onDelete={deleteWorkspace}
        onDeleted={(deleted) => setStatus(`Deleted "${deleted.name}".`)}
        onDismiss={() => setTarget(null)}
      />
    </div>
  );
};
```

### Promise-based useConfirm() provider

A ConfirmProvider that renders one Dialog and a useConfirm() hook returning a promise. Shows how to settle the promise from confirm, cancel, Escape and backdrop so awaiting callers never hang, and how consumers read like `const ok = await confirm({...})`.

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
  Text,
} from '@fluentui/react-components';

export interface ConfirmOptions {
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  intent?: 'default' | 'destructive';
}

export type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = React.createContext<ConfirmFn | null>(null);

export const useConfirm = (): ConfirmFn => {
  const confirm = React.useContext(ConfirmContext);
  if (!confirm) {
    throw new Error('useConfirm() must be called inside <ConfirmProvider />.');
  }
  return confirm;
};

const destructiveButtonStyle: React.CSSProperties = {
  backgroundColor: 'var(--colorPaletteRedBackground3)',
};

export const ConfirmProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [options, setOptions] = React.useState<ConfirmOptions | null>(null);
  const resolverRef = React.useRef<((confirmed: boolean) => void) | null>(null);

  const confirm = React.useCallback<ConfirmFn>((nextOptions) => {
    // Only one confirmation can be pending at a time.
    resolverRef.current?.(false);
    setOptions(nextOptions);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const settle = React.useCallback((confirmed: boolean) => {
    resolverRef.current?.(confirmed);
    resolverRef.current = null;
    setOptions(null);
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog
        open={options !== null}
        modalType="alert"
        inertTrapFocus
        onOpenChange={(_event, data) => {
          // Escape and backdrop clicks must resolve the promise too, otherwise `await` hangs.
          if (!data.open) {
            settle(false);
          }
        }}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{options?.title}</DialogTitle>
            <DialogContent>
              {options?.description ? (
                typeof options.description === 'string' ? (
                  <Text block>{options.description}</Text>
                ) : (
                  options.description
                )
              ) : null}
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" autoFocus onClick={() => settle(false)}>
                {options?.cancelLabel ?? 'Cancel'}
              </Button>
              <Button
                appearance="primary"
                style={options?.intent === 'destructive' ? destructiveButtonStyle : undefined}
                onClick={() => settle(true)}
              >
                {options?.confirmLabel ?? 'OK'}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </ConfirmContext.Provider>
  );
};

/** Consumer: reads like a synchronous question. */
export const DraftEditor: React.FC = () => {
  const confirm = useConfirm();
  const [status, setStatus] = React.useState('Draft has unsaved changes.');

  const handleDiscard = async () => {
    const confirmed = await confirm({
      title: 'Discard draft?',
      description: 'Your unsaved changes will be lost. This cannot be undone.',
      confirmLabel: 'Discard',
      intent: 'destructive',
    });
    if (confirmed) {
      setStatus('Draft discarded.');
    }
  };

  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <Button onClick={handleDiscard}>Discard draft</Button>
      <Text>{status}</Text>
    </div>
  );
};

/** Mount one provider near the app root. */
export const App: React.FC = () => (
  <ConfirmProvider>
    <DraftEditor />
  </ConfirmProvider>
);
```

## Pitfalls

- Rendering the dialog conditionally (`{open && <Dialog />}`) instead of controlling `open`: this skips the surface's exit motion, its `unmountOnClose` behavior, and focus restoration to the invoking element. Always pass `open` and manage it with state.
- Auto-focusing the destructive button, or forgetting `autoFocus` on cancel: the first focusable element receives focus, so if you render confirm first (or auto-focus it) a stray Enter press destroys data. Render cancel first and mark it `autoFocus`.
- Not resetting guardrail state between openings: a stale `acknowledged` checkbox or previously typed name lets the next destructive action through with zero friction. Reset internal state in an effect keyed on `open` (and the resource id), or let the surface unmount via `unmountOnClose`.
- Treating `onOpenChange` as fire-and-forget: with a controlled dialog, ignoring the callback keeps the dialog open forever, so you must both handle every close path (`data.open === false` for Escape, backdrop and trigger) and update your own state. In a promise-based API, any unhandled path means the awaiting code never resolves.
- Closing the dialog before async work completes: you lose the ability to show progress or an error, and the user can submit twice. Keep the dialog open, set `pending`, disable both buttons, ignore Escape/backdrop while pending, and close only on success.
- Using generic or ambiguous action labels ("OK", "Yes") or swapping the button order: users skim dialogs. Label the action ("Delete workspace", "Discard draft") and keep cancel on the left, confirm on the right, consistently across the app.
- Reaching for `window.confirm`: it is unthemed, untranslatable, blocks the main thread, cannot show details or progress, and gives you no control over roles or focus. Build the same flow with `Dialog`, `DialogTitle`, `DialogContent` and `DialogActions`.
- Using `React.useId` for label wiring on React 17 (it was added in React 18) - pass your own stable id, or rely on the automatic title/description association that `DialogTitle` and `DialogContent` provide.

## Accessibility

Role and labelling: `modalType="alert"` renders the surface with `role="alertdialog"`, which is announced immediately when it opens; reserve it for genuine confirmations and use `modalType="modal"` for dialogs that merely contain a form. `DialogTitle` supplies the surface's accessible name automatically - phrase it as a specific question ("Delete Contoso Reports?") rather than "Are you sure?", and put the consequence in `DialogContent`. If you need explicit wiring, pass `aria-labelledby`/`aria-describedby` on `DialogSurface` with matching `id`s on the title and content.

Focus: Fluent moves focus into the surface on open and returns it to the element that opened the dialog on close (this is skipped if you render the dialog conditionally instead of controlling `open`). Default focus must land on the least destructive action - `autoFocus` on the cancel `Button` - and never on the destructive button. Keep the DOM order cancel-then-confirm so Tab order matches the visual order.

Keyboard: Escape requests a close and must map to "cancel"; in the promise-based API, resolve `false` for Escape and backdrop or the awaiting code hangs. Confirm/cancel are real `Button`s, so Enter and Space activate the focused one - never attach a global keydown handler that confirms.

Guardrails: the type-to-confirm `Input` is labelled by `Field` (label text is part of the accessible name) and reports mismatches through `validationState="error"` plus `validationMessage`, which assistive technology announces. The `Checkbox` label is read as part of the checkbox, so keep it self-describing ("I understand that this action cannot be undone").

Async states: keep the dialog open while pending, disable both actions, and leave the confirm button's text unchanged so its accessible name stays stable. Announce failures inside the dialog with `MessageBar` (`politeness="assertive"` for critical failures) rather than a transient toast the user may miss.

`inertTrapFocus` marks the rest of the page inert instead of only trapping Tab, which is friendlier for screen reader and pointer users; it is not supported together with `modalType="non-modal"`. Make sure custom destructive button colors keep sufficient contrast against the button text in both light and dark themes.

## Components used

- - [Dialog](../../components/dialog.md)
- - [Button](../../components/button.md)
- - [Text](../../components/text.md)
- - [Spinner](../../components/spinner.md)
- - [Checkbox](../../components/checkbox.md)
- - [Field](../../components/field.md)
- - [Input](../../components/input.md)
- - [MessageBar](../../components/message-bar.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
