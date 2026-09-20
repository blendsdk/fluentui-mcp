# Form Dialog

> **Group**: modals

## Goal

Build an accessible modal form dialog with Fluent UI v9: a controlled Dialog whose body is a real <form> using Field + Input/Select/Textarea/Checkbox/RadioGroup, inline validation, async submit with a loading state, form-level server errors, and deterministic reset behaviour when the dialog closes.

## When to Use

Use this recipe when a task requires focused, blocking data entry that must be validated and persisted as a unit: create/edit dialogs launched from a toolbar, table row or empty state; short forms (roughly 1-10 fields) where the surrounding page should not change; and any flow where you need a single, explicit primary action plus a guaranteed cancel path. It is also the right pattern when the user must not lose context, e.g. renaming an item or inviting a teammate from a list.

## When Not to Use

Do not use a form dialog for long, multi-step wizards, complex forms with many sections, or forms users compare against page content - use a full page or an OverlayDrawer/InlineDrawer instead. Do not use it for a single trivial value (use a Popover or TeachingPopover with an Input and a Button) or for inline editing in tables and lists (edit in place with Field + Input). Avoid it for destructive confirmations that contain no input - a plain Dialog with two Buttons is enough, and for internal navigation panels use Drawer/NavDrawer.

A **form dialog** is a modal `Dialog` whose body is a real `<form>`: it collects data with `Field` + controls, validates on submit, shows errors inline, and only closes when the data was saved or the user cancelled.

## 1. Required component tree

```tsx
<Dialog open={open} onOpenChange={handleOpenChange}>
  <DialogTrigger>
    <Button appearance="primary">New project</Button>
  </DialogTrigger>
  <DialogSurface>
    <form onSubmit={handleSubmit} noValidate>
      <DialogBody>
        <DialogTitle>New project</DialogTitle>
        <DialogContent>{/* fields */}</DialogContent>
        <DialogActions>{/* Cancel + Submit */}</DialogActions>
      </DialogBody>
    </form>
  </DialogSurface>
</Dialog>
```

Responsibilities of each piece:

- **`Dialog`** - owns open state, renders no DOM itself, and funnels every user dismissal (Escape, backdrop click, close triggers) through `onOpenChange`. It also traps focus and restores focus to the trigger when it closes. `Dialog` accepts exactly two children: the trigger and the `DialogSurface`.
- **`DialogTrigger`** - clones its child (normally a `Button`), injecting the click handler and the `aria-haspopup="dialog"` / `aria-expanded` attributes. Use `action="close"` on triggers that should dismiss the dialog (Cancel).
- **`DialogSurface`** - the modal box and its backdrop; the only child of `Dialog` that renders visible DOM.
- **`DialogBody`** - the layout that pins `DialogTitle` and `DialogActions` while `DialogContent` scrolls. Use exactly one per surface.
- **`DialogTitle`** - rendered as an `<h2>` by default and automatically linked to the surface through `aria-labelledby`. Keep it the first child of `DialogBody`.
- **`DialogContent`** - the scrollable field region.
- **`DialogActions`** - the action row; keep the primary action last so the tab order is Cancel -> Submit.

The `<form>` wraps `DialogBody`, not just `DialogContent`, so the submit button in `DialogActions` belongs to the form and Enter submits from any field. If you must keep the buttons outside the form, give the form an `id` and set `form="my-form-id"` on the submit `Button`.

## 2. Make the dialog controlled

```tsx
const [open, setOpen] = React.useState(false);

<Dialog
  open={open}
  onOpenChange={(_event, data) => {
    if (data.open) {
      setOpen(true);
    } else if (!isSubmitting) {
      setOpen(false);
      resetForm();
    }
  }}
/>;
```

- `onOpenChange` fires for **user** dismissals only. Calling `setOpen(false)` yourself after a successful save does **not** fire it, so reset the form yourself in that path.
- Ignoring `data.open === false` while a request is in flight stops Escape/backdrop clicks from tearing down the modal mid-save.
- Uncontrolled usage (`defaultOpen` + trigger) also works, but controlled is strongly preferred for form dialogs because you need to close the dialog programmatically after the request succeeds.

## 3. Pick a reset strategy

1. **Reset explicitly** - keep `values`/`errors` in state and clear them in `onOpenChange` and after a successful submit. Best when inputs are `value`-controlled (example 1).
2. **Unmount the body** - pass `unmountOnClose` to `Dialog` and keep the form state in a child component rendered inside `DialogSurface`. The state disappears with the DOM, which is the cheapest correct answer for `defaultValue`/uncontrolled inputs (examples 2 and 3).

## 4. Wire every control through Field

`Field` renders the label, the hint and the validation message, and generates the ids that tie them together. Use the **render-function form of `children`** so the control receives `id`, `aria-labelledby`, `aria-describedby`, `aria-invalid` and `required`:

```tsx
<Field
  label="Owner email"
  required
  validationState={errors.email ? 'error' : 'none'}
  validationMessage={errors.email}
>
  {(fieldProps) => (
    <Input
      {...fieldProps}
      type="email"
      value={values.email}
      onChange={(_event, data) => updateField('email', data.value)}
    />
  )}
</Field>
```

- `validationState` defaults to `'none'`. Only switch to `'error'`/`'warning'` after a submit attempt (or on blur) so users are not scolded while typing, and clear the error for a field as soon as it is edited.
- The same pattern works with `Select`, `Textarea`, `Combobox`, `SpinButton`, `SearchBox`, `Slider` and other single-input controls.
- Composite controls render a container element, not an input (for example `RadioGroup` renders a `<div>`). Forward only the props that make sense - `id`, `aria-labelledby`, `aria-describedby` - as shown in example 2.
- `Field`'s `required` prop adds the visual asterisk and flows into the control props. Add `noValidate` to the `<form>` if you want Fluent validation messages only; omit it to also let the browser block submission on empty required controls (example 3).

## 5. Submit, validate, save, close

```tsx
const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
  event.preventDefault();
  const nextErrors = validate(values);
  setErrors(nextErrors);
  if (Object.keys(nextErrors).length > 0) {
    focusFirstInvalidField(nextErrors);
    return;
  }
  setIsSubmitting(true);
  try {
    await save(values);
    setOpen(false); // only close on success
  } finally {
    setIsSubmitting(false);
  }
};
```

- The primary action is a `Button type="submit"` inside `DialogActions`; because it lives inside the `<form>`, Enter from any text field submits too.
- Give every other button `type="button"` so it can never submit the form.
- While saving: disable the submit and cancel buttons, change the label ("Saving..."), and optionally add a `Spinner` as the button `icon`.
- On failure, keep the dialog open. Put the message in a `MessageBar intent="error"` at the top of `DialogContent`, or attach it to the offending `Field` via `validationState`/`validationMessage`.

## 6. Reading values without per-keystroke state

For short, write-once dialogs you can skip controlled state entirely and read a `FormData` snapshot in the submit handler (example 3). Give each control a `name` and a `defaultValue`, then close the dialog after the request resolves - with `unmountOnClose` the DOM (and therefore the values) is discarded automatically.

```tsx
const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget); // read BEFORE awaiting
  await createTask({ title: String(data.get('title') ?? '') });
  setOpen(false);
};
```

## 7. Focus and keyboard behaviour

- Fluent moves focus into the dialog on open and returns it to the trigger on close; do not fight it with autoFocus unless a specific field must be focused first.
- When validation fails, focus the **first invalid control** and scroll it into view (`element.focus()` is enough; `Field` already marks it with `aria-invalid`).
- Escape closes the dialog through `onOpenChange`; ignore that event while a save is in flight.
- `inertTrapFocus` uses the `inert` attribute for focus containment (supported in all current browsers); omit it if you must support older engines so the default trap implementation is used.

## Examples

### Create project dialog (controlled, validated, async submit)

A fully controlled form dialog with Field-level validation, error clearing on change, focus management for the first invalid field, an async submit with a Spinner, and a reset that runs whenever the dialog closes for any reason.

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
  DialogTrigger,
  Field,
  Input,
  Option,
  Select,
  Spinner,
  Textarea,
} from '@fluentui/react-components';

type FormValues = {
  name: string;
  email: string;
  plan: string;
  description: string;
  notify: boolean;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  name: '',
  email: '',
  plan: 'starter',
  description: '',
  notify: true,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Enter a project name.';
  }

  if (!values.email.trim()) {
    errors.email = 'Enter the email address of the project owner.';
  } else if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = 'Enter a valid email address, for example ada@example.com.';
  }

  if (values.description.length > 200) {
    errors.description = `Keep the description under 200 characters (currently ${values.description.length}).`;
  }

  return errors;
}

// Replace with a real request, e.g. `await api.projects.create(values)`.
async function createProject(values: FormValues): Promise<void> {
  void values;
  await new Promise((resolve) => setTimeout(resolve, 800));
}

export const CreateProjectDialog: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState<FormValues>(initialValues);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Focus targets used to jump to the first invalid field after a failed submit.
  const controls = React.useRef<Partial<Record<keyof FormValues, HTMLElement | null>>>({});

  const updateField = <K extends keyof FormValues>(field: K, value: FormValues[K]) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => {
      if (previous[field] === undefined) {
        return previous;
      }
      const next = { ...previous };
      delete next[field];
      return next;
    });
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    const firstInvalidField = (Object.keys(nextErrors) as (keyof FormValues)[])[0];
    if (firstInvalidField) {
      controls.current[firstInvalidField]?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      await createProject(values);
      setOpen(false);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(_event, data) => {
        if (data.open) {
          setOpen(true);
        } else if (!isSubmitting) {
          // Escape, backdrop click and the Cancel trigger all land here.
          setOpen(false);
          resetForm();
        }
      }}
      inertTrapFocus
    >
      <DialogTrigger>
        <Button appearance="primary">New project</Button>
      </DialogTrigger>

      <DialogSurface>
        <form onSubmit={handleSubmit} noValidate>
          <DialogBody>
            <DialogTitle>New project</DialogTitle>

            <DialogContent>
              <div style={{ display: 'grid', gap: '16px' }}>
                <Field
                  label="Project name"
                  required
                  validationState={errors.name ? 'error' : 'none'}
                  validationMessage={errors.name}
                >
                  {(fieldProps) => (
                    <Input
                      {...fieldProps}
                      ref={(element) => {
                        controls.current.name = element;
                      }}
                      value={values.name}
                      onChange={(_event, data) => updateField('name', data.value)}
                    />
                  )}
                </Field>

                <Field
                  label="Owner email"
                  required
                  validationState={errors.email ? 'error' : 'none'}
                  validationMessage={errors.email}
                >
                  {(fieldProps) => (
                    <Input
                      {...fieldProps}
                      ref={(element) => {
                        controls.current.email = element;
                      }}
                      type="email"
                      value={values.email}
                      onChange={(_event, data) => updateField('email', data.value)}
                    />
                  )}
                </Field>

                <Field label="Plan">
                  {(fieldProps) => (
                    <Select
                      {...fieldProps}
                      value={values.plan}
                      onChange={(_event, data) => updateField('plan', data.value)}
                    >
                      <Option value="starter">Starter</Option>
                      <Option value="team">Team</Option>
                      <Option value="enterprise">Enterprise</Option>
                    </Select>
                  )}
                </Field>

                <Field
                  label="Description"
                  hint="Optional - shown on the project overview."
                  validationState={errors.description ? 'error' : 'none'}
                  validationMessage={errors.description}
                >
                  {(fieldProps) => (
                    <Textarea
                      {...fieldProps}
                      ref={(element) => {
                        controls.current.description = element;
                      }}
                      resize="vertical"
                      value={values.description}
                      onChange={(_event, data) => updateField('description', data.value)}
                    />
                  )}
                </Field>

                <Checkbox
                  label="Email the team when the project is created"
                  checked={values.notify}
                  onChange={(_event, data) => updateField('notify', data.checked === true)}
                />
              </div>
            </DialogContent>

            <DialogActions>
              <DialogTrigger action="close">
                <Button appearance="secondary" type="button" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogTrigger>
              <Button
                appearance="primary"
                type="submit"
                disabled={isSubmitting}
                icon={isSubmitting ? <Spinner size="tiny" /> : undefined}
              >
                {isSubmitting ? 'Creating...' : 'Create project'}
              </Button>
            </DialogActions>
          </DialogBody>
        </form>
      </DialogSurface>
    </Dialog>
  );
};
```

### Edit profile dialog with server error (unmountOnClose reset)

A dialog whose form state lives inside a child component rendered in DialogSurface. Passing unmountOnClose throws that state away on every dismissal, and a MessageBar surfaces failures returned by the API.

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
  MessageBar,
  MessageBarBody,
  Radio,
  RadioGroup,
  Spinner,
} from '@fluentui/react-components';

type ProfileValues = {
  displayName: string;
  email: string;
  digest: string;
};

// Replace with a real request. This mock rejects the "taken" email address so
// the form-level error path can be exercised.
async function saveProfile(values: ProfileValues): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  if (values.email.trim().toLowerCase() === 'ada@example.com') {
    throw new Error('That email address is already in use.');
  }
}

type ProfileFormProps = {
  onSaved: (values: ProfileValues) => void;
  onCancel: () => void;
};

const ProfileForm: React.FC<ProfileFormProps> = ({ onSaved, onCancel }) => {
  // Because DialogSurface unmounts on close, this state is discarded for free
  // every time the dialog is dismissed.
  const [values, setValues] = React.useState<ProfileValues>({
    displayName: 'Ada Lovelace',
    email: 'ada@example.com',
    digest: 'daily',
  });
  const [serverError, setServerError] = React.useState<string>();
  const [isSaving, setIsSaving] = React.useState(false);

  const update = <K extends keyof ProfileValues>(field: K, value: ProfileValues[K]) =>
    setValues((previous) => ({ ...previous, [field]: value }));

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setServerError(undefined);
    try {
      await saveProfile(values);
      onSaved(values);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <DialogBody>
        <DialogTitle>Edit profile</DialogTitle>

        <DialogContent>
          {serverError && (
            <MessageBar intent="error" style={{ marginBottom: '16px' }}>
              <MessageBarBody>{serverError}</MessageBarBody>
            </MessageBar>
          )}

          <div style={{ display: 'grid', gap: '16px' }}>
            <Field label="Display name" required>
              {(fieldProps) => (
                <Input
                  {...fieldProps}
                  value={values.displayName}
                  onChange={(_event, data) => update('displayName', data.value)}
                />
              )}
            </Field>

            <Field label="Email" required>
              {(fieldProps) => (
                <Input
                  {...fieldProps}
                  type="email"
                  value={values.email}
                  onChange={(_event, data) => update('email', data.value)}
                />
              )}
            </Field>

            <Field label="Email digest" hint="How often we email you a summary of your activity.">
              {(fieldProps) => (
                // RadioGroup renders a div, so forward only the id/aria props
                // that Field provides instead of spreading everything.
                <RadioGroup
                  id={fieldProps.id}
                  aria-labelledby={fieldProps['aria-labelledby']}
                  aria-describedby={fieldProps['aria-describedby']}
                  value={values.digest}
                  onChange={(_event, data) => update('digest', data.value)}
                >
                  <Radio value="daily" label="Daily" />
                  <Radio value="weekly" label="Weekly" />
                  <Radio value="never" label="Never" />
                </RadioGroup>
              )}
            </Field>
          </div>
        </DialogContent>

        <DialogActions>
          <Button appearance="secondary" type="button" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            appearance="primary"
            type="submit"
            disabled={isSaving}
            icon={isSaving ? <Spinner size="tiny" /> : undefined}
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogActions>
      </DialogBody>
    </form>
  );
};

export const EditProfileDialog: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={(_event, data) => setOpen(data.open)} unmountOnClose>
      <DialogTrigger>
        <Button>Edit profile</Button>
      </DialogTrigger>
      <DialogSurface>
        <ProfileForm onSaved={() => setOpen(false)} onCancel={() => setOpen(false)} />
      </DialogSurface>
    </Dialog>
  );
};
```

### Quick task dialog (uncontrolled inputs + FormData)

The leanest variation: inputs stay uncontrolled via defaultValue, values are read once with FormData in the submit handler, native required validation blocks empty titles, and unmountOnClose clears the fields for the next open.

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
  Option,
  Select,
} from '@fluentui/react-components';

type NewTask = {
  title: string;
  due: string;
  priority: string;
};

// Replace with a real request.
async function createTask(task: NewTask): Promise<void> {
  void task;
  await new Promise((resolve) => setTimeout(resolve, 500));
}

export const NewTaskDialog: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    // Read the form once, before awaiting anything.
    const data = new FormData(event.currentTarget);
    const task: NewTask = {
      title: String(data.get('title') ?? ''),
      due: String(data.get('due') ?? ''),
      priority: String(data.get('priority') ?? 'normal'),
    };

    await createTask(task);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(_event, data) => setOpen(data.open)} unmountOnClose>
      <DialogTrigger>
        <Button appearance="primary">New task</Button>
      </DialogTrigger>

      <DialogSurface>
        {/* No noValidate here: the required prop passed through Field makes
            the browser block submission while the title is empty. */}
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <DialogTitle>New task</DialogTitle>

            <DialogContent>
              <div style={{ display: 'grid', gap: '16px' }}>
                <Field label="Title" required>
                  {(fieldProps) => (
                    <Input {...fieldProps} name="title" placeholder="e.g. Review the pull request" />
                  )}
                </Field>

                <Field label="Due date">
                  {(fieldProps) => <Input {...fieldProps} name="due" type="date" />}
                </Field>

                <Field label="Priority">
                  {(fieldProps) => (
                    <Select {...fieldProps} name="priority" defaultValue="normal">
                      <Option value="low">Low</Option>
                      <Option value="normal">Normal</Option>
                      <Option value="high">High</Option>
                    </Select>
                  )}
                </Field>
              </div>
            </DialogContent>

            <DialogActions>
              <DialogTrigger action="close">
                <Button appearance="secondary" type="button">
                  Cancel
                </Button>
              </DialogTrigger>
              <Button appearance="primary" type="submit">
                Create task
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

- Forgetting event.preventDefault() in the submit handler: the browser performs a real form submission (navigation/GET) and the dialog unmounts. Always prevent the default as the first line of the handler.
- Being sloppy with button types: the primary action must be type="submit" to submit the form, and every other button that lives inside the <form> (Cancel, Remove, secondary actions) should be type="button" so it can never trigger the form's submit behaviour.
- Putting the submit action on a DialogTrigger action="close": the trigger only closes the dialog, so validation and the save request never run. Use a close trigger for Cancel and a submit button for the primary action.
- Assuming onOpenChange fires when you close programmatically: after a successful save, calling setOpen(false) does not emit onOpenChange(false), so the form is never reset. Either reset explicitly in the success path, or move the form state into a child component inside DialogSurface and pass unmountOnClose to Dialog.
- Reading event.currentTarget (or the event object) after an await: React clears it once the handler yields. Capture new FormData(event.currentTarget) or the field values before awaiting the request.
- Rendering Field with plain children instead of the render function: the label gets no htmlFor, so clicking the label does not focus the control and screen readers do not announce the label, hint or error. Always use {(fieldProps) => <Input {...fieldProps} />} for single-input controls, and forward id/aria props manually for composite controls.
- Showing validation on every keystroke: errors flash while the user is still typing. Validate on submit (or on blur), then clear a field's error as soon as that field changes, and focus the first invalid control so keyboard users are taken straight to the problem.
- Spreading every Field control prop onto a container-based control such as RadioGroup: Field generates props for an input, and container props like required/size are not valid there. Spread only id, aria-labelledby and aria-describedby, or wrap the whole group in its own labelled region.
- Closing the dialog before the request settles, or allowing Escape/backdrop dismissal mid-save: the user loses the entered data and any error that comes back. Block the close (ignore onOpenChange(false) while submitting), disable both actions, and only call setOpen(false) after the promise resolves.

## Accessibility

Always render exactly one DialogTitle as the first child of DialogBody - Dialog wires it to the surface with aria-labelledby, and without it the modal is announced as an unlabelled dialog. Use the render-function form of Field's children for every single-input control so the label, hint and validation message are programmatically associated (id, aria-labelledby, aria-describedby, aria-invalid, required); for composite controls such as RadioGroup, forward id/aria-labelledby/aria-describedby explicitly, because Field cannot attach them itself. Use DialogActions for the action row so the tab order is predictable (secondary action first, primary action last) and focus returns to the trigger when the dialog closes. Escape must dismiss the dialog - ignore the onOpenChange(false) event only while a save is in flight, otherwise users can get stuck. On failed validation, move focus to the first invalid control and keep the error text visible; text (not just colour) is what conveys the failure, and validationState="error" plus validationMessage supplies that text. Announce asynchronous outcomes: a MessageBar with intent="error" inside DialogContent is exposed as a live region, and while saving the submit button is disabled and relabelled (add a Spinner as its icon for a visible progress cue). Never rely on placeholder text as a label, and keep the modal focus trap enabled (the default; inertTrapFocus opts into the inert-based trap on modern browsers).

## Components used

- [Button](../../components/button.md)
- [Checkbox](../../components/checkbox.md)
- [Dialog](../../components/dialog.md)
- [DialogActions](../../components/dialog-actions.md)
- [DialogBody](../../components/dialog-body.md)
- [DialogContent](../../components/dialog-content.md)
- [DialogSurface](../../components/dialog-surface.md)
- [DialogTitle](../../components/dialog-title.md)
- [DialogTrigger](../../components/dialog-trigger.md)
- [Field](../../components/field.md)
- [Input](../../components/input.md)
- [MessageBar](../../components/message-bar.md)
- [MessageBarBody](../../components/message-bar-body.md)
- [Option](../../components/option.md)
- [Radio](../../components/radio.md)
- [RadioGroup](../../components/radio-group.md)
- [Select](../../components/select.md)
- [Spinner](../../components/spinner.md)
- [Textarea](../../components/textarea.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
