# Form Dialog

> **Group**: modals

## Goal

Build a modal Form Dialog in Fluent UI v9: a controlled Dialog whose body is a real <form>, with Field-wired labels and validation, a pending/submitting state, an error banner for failed requests, and predictable reset behaviour every time the dialog closes.

## When to Use

Use a Form Dialog when a short, self-contained set of inputs (roughly 1-8 fields) must be completed or dismissed before the user returns to the page: create/rename an item, invite a user, edit a couple of properties. It is the right choice when the task is blocking, has a clear primary action and a cancel path, and needs the modal's built-in focus trap, Escape/backdrop dismissal and focus restoration.

## When Not to Use

Avoid it for long, multi-step or exploratory flows where users need to reference page content while typing (use a Drawer with type="overlay", or an inline form/panel), for heavy editing surfaces like tables or editors (use a full page), for passive inline edits (Edit/InlineEdit patterns on the page), and for destructive confirmations with no input at all (use a plain Dialog with DialogActions only). Also avoid it for anything that must survive a page refresh - dialogs are for short-lived tasks, not drafts.

A **Form Dialog** is a modal `Dialog` whose body is a real `<form>`. The user fills in a handful of fields and must either submit or dismiss before returning to the page behind the modal. Fluent UI v9 gives you every piece: `Dialog` + `DialogSurface` for the modal shell, `Field` for label/validation wiring, `Input` / `Select` / `Textarea` / `Checkbox` for the controls, and `Button` for the actions.

## Anatomy

```tsx
<Dialog open={open} onOpenChange={handleOpenChange}>
  <DialogTrigger disableButtonEnhancement>
    <Button appearance="primary">Open</Button>
  </DialogTrigger>
  <DialogSurface>
    <form onSubmit={handleSubmit} noValidate>
      <DialogBody>
        <DialogTitle>Add contact</DialogTitle>   {/* names the dialog */}
        <DialogContent>...</DialogContent>       {/* the fields */}
        <DialogActions>...</DialogActions>       {/* cancel + submit */}
      </DialogBody>
    </form>
  </DialogSurface>
</Dialog>
```

Wrapping `DialogBody` in the `<form>` is the important part: the primary `Button` with `type="submit"` lives *inside* the form, so Enter in any text field submits without a single key handler. Every other button in that form must declare `type="button"` so it cannot submit by accident.

## 1. Make the dialog controlled

Always own the `open` state. You need it for three things: resetting the fields on close, keeping the dialog open while a save is in flight, and asking before discarding edits.

```tsx
<Dialog
  open={open}
  onOpenChange={(_event, data) => {
    if (!data.open && pending) return;   // busy: ignore Escape and backdrop clicks
    setOpen(data.open);
    if (!data.open) resetForm();
  }}
/>
```

`onOpenChange` fires for the trigger button, the Escape key and backdrop clicks, so one handler covers every close path. If you wrap the Cancel button in `DialogTrigger` as well, Cancel flows through exactly the same guard - that is how example 3 asks before throwing away unsaved edits.

## 2. Wire labels and validation with `Field`

`Field` is the glue between a label and a Fluent control. It renders the `Label`, forwards `required`, and gives the child control an id plus `aria-describedby` / `aria-invalid` for the validation message and hint - so you never hand-write `htmlFor` / `id` for `Input`, `Select` or `Textarea`.

```tsx
<Field
  label="Email address"
  required
  validationState={emailError ? "error" : "none"}
  validationMessage={emailError}
>
  <Input type="email" value={email} onChange={onEmailChange} />
</Field>
```

Keep an `errors` object next to your values, validate on **submit** (not on every keystroke), and clear a field's error the moment the user edits it. Put `noValidate` on the form and do not lean on native HTML5 validation: the browser bubble is not announced by screen readers, cannot be styled, and paints above the dialog surface.

## 3. Reset state on close

`Dialog` unmounts its surface content on close by default (`unmountOnClose`), but state that lives in the component *rendering* the `Dialog` survives. Either clear it inside `onOpenChange` (examples 1 and 2), or move the fields into a child component inside `DialogContent` so unmounting throws the state away for free.

## 4. Submit asynchronously

- Keep a `pending` flag, disable both actions and show a small `Spinner` in `DialogActions`.
- Guard the handler with `if (pending) return;` so a double click cannot fire two requests.
- Ignore close requests while pending, otherwise Escape dismisses the dialog mid-request.
- On failure keep the dialog open, surface the message in a `MessageBar intent="error" politeness="assertive"` at the top of `DialogContent`, and re-enable the actions. Server errors are rarely field-specific, so a banner beats pushing them into a `Field`.
- On success, close and reset in one step so the next open starts clean.

## 5. Pick the right control

`Input` for one-line text, `Select` for a small fixed option set, `Textarea` for free-form notes, `Checkbox` / `Switch` for booleans. Wrap each control in its own `Field` and lay them out with a simple flex column (`gap: 12px` to `16px`) inside `DialogContent`.

## Verification checklist

- Tab order matches visual order; Enter in a field submits; Escape closes the dialog unless a request is pending or the form is dirty.
- Submitting empty/invalid data keeps the dialog open and shows a `Field` error next to each offending control.
- Closing and reopening shows empty (or freshly-loaded) fields.
- A failing request leaves the dialog open with an error banner, the actions re-enabled and the user's input intact.
- Every button inside the `<form>` has an explicit `type`.

## Examples

### Validated contact form in a modal dialog

A controlled Dialog containing a <form> with two Inputs inside Fields, validate-on-submit error handling, explicit button types, and a full state reset whenever the dialog closes.

```tsx
import * as React from "react";
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
} from "@fluentui/react-components";

interface ContactValues {
  name: string;
  email: string;
}

type ContactErrors = Partial<Record<keyof ContactValues, string>>;

const initialValues: ContactValues = { name: "", email: "" };

function validate(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  if (!values.name.trim()) {
    errors.name = "Enter a name.";
  }
  if (!values.email.trim()) {
    errors.email = "Enter an email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Use the format name@example.com.";
  }
  return errors;
}

export const ContactFormDialog: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState<ContactValues>(initialValues);
  const [errors, setErrors] = React.useState<ContactErrors>({});

  // Clear a field's error as soon as the user starts fixing it.
  const updateField = (field: keyof ContactValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    // Persist `values` here (fetch, context, redux ...).
    setOpen(false);
    setValues(initialValues);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(_event, data) => {
        setOpen(data.open);
        if (!data.open) {
          // The form state lives here, not in the dialog, so reset it explicitly.
          setValues(initialValues);
          setErrors({});
        }
      }}
    >
      <DialogTrigger disableButtonEnhancement>
        <Button appearance="primary">Add contact</Button>
      </DialogTrigger>
      <DialogSurface>
        <form onSubmit={handleSubmit} noValidate>
          <DialogBody>
            <DialogTitle>Add contact</DialogTitle>
            <DialogContent>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Field
                  label="Name"
                  required
                  validationState={errors.name ? "error" : "none"}
                  validationMessage={errors.name}
                >
                  <Input
                    value={values.name}
                    onChange={(_event, data) => updateField("name", data.value)}
                  />
                </Field>
                <Field
                  label="Email"
                  required
                  validationState={errors.email ? "error" : "none"}
                  validationMessage={errors.email}
                >
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={values.email}
                    onChange={(_event, data) => updateField("email", data.value)}
                  />
                </Field>
              </div>
            </DialogContent>
            <DialogActions>
              {/* type="button" keeps Cancel from submitting the form it sits in */}
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary" type="button">
                  Cancel
                </Button>
              </DialogTrigger>
              <Button appearance="primary" type="submit">
                Save
              </Button>
            </DialogActions>
          </DialogBody>
        </form>
      </DialogSurface>
    </Dialog>
  );
};
```

### Async invite form with pending state and error banner

A dialog that submits to an API: re-entrancy guard, Spinner in the actions row, close requests ignored while the request is in flight, request failures shown in an assertive MessageBar with the user's input preserved, plus Select, Textarea and Checkbox wrapped in Field.

```tsx
import * as React from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  MessageBar,
  Select,
  Spinner,
  Textarea,
} from "@fluentui/react-components";

type MemberRole = "viewer" | "editor" | "admin";

interface InviteDraft {
  email: string;
  role: MemberRole;
  message: string;
  notify: boolean;
}

const emptyDraft: InviteDraft = {
  email: "",
  role: "editor",
  message: "",
  notify: true,
};

/** Replace with your real API call. */
async function inviteUser(draft: InviteDraft): Promise<void> {
  await new Promise((resolve) => window.setTimeout(resolve, 1200));
  if (draft.email.endsWith("@blocked.example")) {
    throw new Error("Invites to that domain are blocked. Ask an admin to allow-list it first.");
  }
}

export const InviteUserDialog: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<InviteDraft>(emptyDraft);
  const [emailError, setEmailError] = React.useState<string>();
  const [submitError, setSubmitError] = React.useState<string>();
  const [pending, setPending] = React.useState(false);

  const update = <K extends keyof InviteDraft>(field: K, value: InviteDraft[K]) =>
    setDraft((prev) => ({ ...prev, [field]: value }));

  const reset = () => {
    setDraft(emptyDraft);
    setEmailError(undefined);
    setSubmitError(undefined);
    setPending(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) {
      return; // re-entrancy guard: ignore double submits
    }

    const email = draft.email.trim();
    if (!email) {
      setEmailError("Enter the email address of the person you want to invite.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Use the format name@example.com.");
      return;
    }

    setEmailError(undefined);
    setSubmitError(undefined);
    setPending(true);
    try {
      await inviteUser({ ...draft, email });
      reset();
      setOpen(false);
    } catch (error) {
      // Keep the dialog open so the user can retry without retyping anything.
      setSubmitError(error instanceof Error ? error.message : "The invite could not be sent.");
      setPending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(_event, data) => {
        if (!data.open && pending) {
          return; // never dismiss while the request is in flight
        }
        setOpen(data.open);
        if (!data.open) {
          reset();
        }
      }}
    >
      <DialogTrigger disableButtonEnhancement>
        <Button appearance="primary">Invite user</Button>
      </DialogTrigger>
      <DialogSurface>
        <form onSubmit={handleSubmit} noValidate>
          <DialogBody>
            <DialogTitle>Invite a user</DialogTitle>
            <DialogContent>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {submitError && (
                  <MessageBar intent="error" politeness="assertive">
                    {submitError}
                  </MessageBar>
                )}

                <Field
                  label="Email address"
                  required
                  validationState={emailError ? "error" : "none"}
                  validationMessage={emailError}
                >
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={draft.email}
                    onChange={(_event, data) => {
                      update("email", data.value);
                      if (emailError) {
                        setEmailError(undefined);
                      }
                    }}
                  />
                </Field>

                <Field label="Role" hint="Admins can manage members and billing.">
                  <Select
                    value={draft.role}
                    onChange={(_event, data) => update("role", data.value as MemberRole)}
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </Select>
                </Field>

                <Field label="Personal message">
                  <Textarea
                    resize="vertical"
                    rows={3}
                    value={draft.message}
                    onChange={(_event, data) => update("message", data.value)}
                  />
                </Field>

                <Checkbox
                  label="Send a welcome email with setup instructions"
                  checked={draft.notify}
                  onChange={(_event, data) => update("notify", data.checked === true)}
                />
              </div>
            </DialogContent>
            <DialogActions>
              {pending && <Spinner size="tiny" label="Sending..." labelPosition="after" />}
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary" type="button" disabled={pending}>
                  Cancel
                </Button>
              </DialogTrigger>
              <Button appearance="primary" type="submit" disabled={pending}>
                Send invite
              </Button>
            </DialogActions>
          </DialogBody>
        </form>
      </DialogSurface>
    </Dialog>
  );
};
```

### Rename dialog that confirms before discarding edits

Routes Escape, backdrop clicks and the Cancel button through a single onOpenChange guard: while saving the dialog refuses to close, and when the form is dirty it asks the user to keep editing or discard, instead of silently throwing the work away.

```tsx
import * as React from "react";
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
} from "@fluentui/react-components";

interface RenameDialogProps {
  currentName: string;
  onRename: (nextName: string) => Promise<void>;
}

export const RenameDialog: React.FC<RenameDialogProps> = ({ currentName, onRename }) => {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState(currentName);
  const [error, setError] = React.useState<string>();
  const [pending, setPending] = React.useState(false);
  const [confirmDiscard, setConfirmDiscard] = React.useState(false);

  const dirty = name.trim() !== currentName;

  const closeAndReset = () => {
    setOpen(false);
    setName(currentName);
    setError(undefined);
    setConfirmDiscard(false);
    setPending(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextName = name.trim();
    if (!nextName) {
      setError("Enter a name.");
      return;
    }
    if (nextName === currentName) {
      closeAndReset();
      return;
    }

    setPending(true);
    try {
      await onRename(nextName);
      closeAndReset();
    } catch {
      setError("The new name could not be saved. Try again.");
      setPending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(_event, data) => {
        if (data.open) {
          setOpen(true);
          return;
        }
        if (pending) {
          return; // never dismiss while saving
        }
        if (dirty) {
          setConfirmDiscard(true); // keep the dialog open and ask first
          return;
        }
        closeAndReset();
      }}
    >
      <DialogTrigger disableButtonEnhancement>
        <Button>Rename</Button>
      </DialogTrigger>
      <DialogSurface>
        <form onSubmit={handleSubmit} noValidate>
          <DialogBody>
            <DialogTitle>Rename item</DialogTitle>
            <DialogContent>
              <Field
                label="Name"
                required
                hint={`Current name: ${currentName}`}
                validationState={error ? "error" : "none"}
                validationMessage={error}
              >
                <Input
                  value={name}
                  onChange={(_event, data) => {
                    setName(data.value);
                    setError(undefined);
                  }}
                />
              </Field>

              {confirmDiscard && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    marginTop: "12px",
                  }}
                >
                  <span>You have unsaved changes. Close without saving?</span>
                  <span style={{ display: "flex", gap: "8px" }}>
                    <Button
                      appearance="secondary"
                      type="button"
                      size="small"
                      onClick={() => setConfirmDiscard(false)}
                    >
                      Keep editing
                    </Button>
                    <Button appearance="primary" type="button" size="small" onClick={closeAndReset}>
                      Discard
                    </Button>
                  </span>
                </div>
              )}
            </DialogContent>
            <DialogActions>
              {/* Cancel uses DialogTrigger, so it flows through the same guard as Escape. */}
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary" type="button" disabled={pending}>
                  Cancel
                </Button>
              </DialogTrigger>
              <Button appearance="primary" type="submit" disabled={pending}>
                Save
              </Button>
            </DialogActions>
          </DialogBody>
        </form>
      </DialogSurface>
    </Dialog>
  );
};
```

## Pitfalls

- Omitting explicit button types. Inside a <form>, a <button> without a type defaults to submit, and DialogTrigger clones your child, so a Cancel or secondary button can end up submitting the form. Put type="submit" on the primary action only and type="button" on everything else.
- Expecting the form to reset itself. State kept in the component that renders <Dialog> survives closing (the dialog only unmounts its own surface content), so stale values reappear on reopen. Reset in onOpenChange or move the fields into a child component inside DialogContent.
- Letting Escape or a backdrop click dismiss the dialog while an async submit is running - onOpenChange still fires. Ignore data.open === false while pending is true, and disable the Cancel button, otherwise users lose the result of an in-flight request.
- Relying on native HTML5 validation (required, type="email" tooltips) inside the dialog. The browser bubble is not announced by screen readers, is not styleable and renders above the surface. Set noValidate on the form and validate through Field's validationState / validationMessage.
- Putting DialogActions outside the <form>, so Enter inside a text field does nothing. Keep DialogContent and DialogActions inside the same form element so a real type="submit" button exists within it.
- Disabling the submit button until the form is valid. Users then cannot trigger validation and never learn what is missing. Keep it enabled, validate on submit, and disable only while a request is pending.
- Firing the request and closing immediately (fire-and-forget). Failures become silent and users believe the data was saved. Keep the dialog open until the promise resolves, then close and reset in the same tick.
- Rendering the dialog inside an existing <form> on the page. DialogSurface renders in place - it is not portaled by default - and nested forms are invalid HTML, which breaks the outer form. Render the dialog at page level or wrap the surface in a Portal.

## Accessibility

Modal semantics come for free: DialogSurface renders role="dialog" with aria-modal="true", DialogTitle is wired to the surface as its accessible name, focus is trapped inside the surface, Escape closes it, and focus returns to the element that opened the dialog (so do not unmount or re-create the trigger while the dialog is open). Always render a DialogTitle as the first child of DialogBody; if a visual title is impossible, give DialogSurface an aria-label instead. Field does the form wiring that is easy to get wrong: it associates the Label with the control (htmlFor/id), forwards required as aria-required, sets aria-invalid when validationState is "error", and links validationMessage and hint through aria-describedby - so errors are announced with the control, not just shown in red. Announce non-field failures with <MessageBar intent="error" politeness="assertive"> so screen readers read them immediately; use politeness="polite" for non-blocking hints. Keep the submit button's accessible name stable and descriptive ("Send invite", not "OK", never "..." while pending) and render the Spinner as additional information instead of replacing the label. When the primary action becomes disabled mid-interaction, prefer disabledFocusable over disabled on the submit button so keyboard focus is not dropped to the top of the page while the request runs. Do not add autoFocus to the first input - the modal already moves focus into the dialog and stealing it can prevent the dialog title from being announced. Keep DOM order identical to the visual order of the fields, and make sure the discard-confirmation row (example 3) is reachable by keyboard and, ideally, announced (rendering it as a MessageBar with politeness="assertive" works well) rather than being a purely visual warning.

## Components used

- [Dialog](../../components/dialog.md)
- [Button](../../components/button.md)
- [Field](../../components/field.md)
- [Input](../../components/input.md)
- [Select](../../components/select.md)
- [Textarea](../../components/textarea.md)
- [Checkbox](../../components/checkbox.md)
- [MessageBar](../../components/message-bar.md)
- [Spinner](../../components/spinner.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
