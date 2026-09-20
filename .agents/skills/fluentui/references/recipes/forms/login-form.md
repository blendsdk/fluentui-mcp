# Login Form

> **Group**: forms

## Goal

Build a complete, accessible Fluent UI v9 login form: labeled email/password inputs with inline validation, a remember-me checkbox, secondary links, a submit button with a pending state, form-level error reporting, an optional password-reveal control, and a dialog-based re-authentication variant.

## When to Use

Use this recipe when a user must prove identity with a credential (email/username + password, employee ID + PIN, etc.) before entering an app or before a sensitive action: sign-in pages, account-switch screens, session-expired re-authentication gates, and admin 'confirm your password' prompts. It fits both a bare page layout and a Card-based layout, and covers local validation plus server-side failure reporting.

## When Not to Use

Do not use it for (a) creating an account — that needs confirmation fields, password strength meters, and terms acceptance; (b) federated-only sign-in where the only affordance is a provider Button or Link and no credential is typed; (c) one-time-code / OTP entry, which is a single focused Input with numeric semantics and auto-advance; (d) search, filtering, or inline editing, which should use SearchBox, Dropdown, or DataGrid editing instead. If you need many arbitrary fields and layout composition, reach for a general form recipe built from Field + a layout primitive rather than this credential-specific flow.

A login form converts a credential — normally an email or username plus a password — into a session. In Fluent UI v9 the whole thing is composed from a small set of primitives: `Field` wraps each control and owns its label and validation message, `Input` is the credential control, `Checkbox` handles "remember me", `Button` is the single primary action, `MessageBar` reports failures that do not belong to one field, and `Spinner` communicates the pending round trip.

## Anatomy

```text
<form>
├─ h1 > Text                  heading ("Sign in")
├─ MessageBar                 optional form-level error (intent="error", politeness="assertive")
├─ Field[label=Email]         → Input[type=email, autoComplete=username]
├─ Field[label=Password]      → Input[type=password, autoComplete=current-password]
├─ Checkbox + Link            "Keep me signed in" · "Forgot password?"
└─ Button[type=submit]        primary action; disabled + Spinner while pending
```

Optional layers:

- `Card` when the form sits on a page next to marketing content or other panels.
- `Input` `contentAfter` slot for a show/hide password toggle.
- `Dialog` + `DialogSurface` + `DialogBody` + `DialogTitle` + `DialogContent` + `DialogActions` for a re-authentication prompt.

## State shape

Hold everything in one component (or one custom hook) so validation, submission, and error display stay in sync:

```ts
type LoginErrors = { email?: string; password?: string };

const [email, setEmail] = React.useState('');
const [password, setPassword] = React.useState('');
const [remember, setRemember] = React.useState(false);
const [errors, setErrors] = React.useState<LoginErrors>({});
const [formError, setFormError] = React.useState<string | null>(null);
const [submitting, setSubmitting] = React.useState(false);
```

Two error channels, deliberately separated:

1. **Field errors** — knowable locally (missing, malformed, too short). They render through `Field`'s `validationState` and `validationMessage` so the message is programmatically associated with the control.
2. **Form errors** — knowable only after the round trip (bad credentials, locked account, network failure, rate limit). They render through `MessageBar` above the fields.

## Labeling and validation with Field

Never use a placeholder as a label. `Field` renders a real `<label>` tied to the control by `htmlFor`, adds the required indicator from `required`, and links the validation message and hint to the control for you:

```tsx
<Field
  label="Email"
  required
  hint="Use the address you signed up with."
  validationState={errors.email ? 'error' : 'none'}
  validationMessage={errors.email}
>
  <Input type="email" name="email" autoComplete="username" value={email} onChange={(_, data) => setEmail(data.value)} />
</Field>
```

Rules of thumb:

- Set `noValidate` on the `<form>` when you use `Field` validation. Otherwise the browser's native bubbles and Fluent's inline messages both fire and contradict each other.
- `validationState="error"` gives you the icon and color; the `validationMessage` string is the announcement. Do not rely on color alone.
- Validate on submit. After a field has been marked invalid, re-validate that field on change so the error clears as soon as the user fixes it.

## Submission and pending state

```tsx
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const nextErrors = validate();
  setErrors(nextErrors);
  setFormError(null);
  if (Object.keys(nextErrors).length > 0) return; // focus the first invalid input here

  setSubmitting(true);
  try {
    await signIn({ email: email.trim(), password, remember });
  } catch {
    setFormError('That email and password combination did not work. Try again.');
  } finally {
    setSubmitting(false);
  }
};
```

- Guard against double submits with `submitting` and by disabling only the submit `Button` — leave the inputs enabled so focus, selection, and typed text survive.
- Swap the button label (`Signing in...`) and drop a `Spinner` into the `icon` slot instead of adding a separate page-level spinner.
- Keep the email value after a failure; ask the user to retype only the password.
- Translate service errors into a human sentence. Never surface raw error payloads.

## Revealing the password (optional)

`Input` exposes `contentBefore` and `contentAfter` slots, which is the canonical place for a reveal toggle:

```tsx
<Input
  type={reveal ? 'text' : 'password'}
  contentAfter={
    <Button type="button" appearance="transparent" size="small" onClick={() => setReveal((v) => !v)} aria-label={reveal ? 'Hide password' : 'Show password'}>
      {reveal ? 'Hide' : 'Show'}
    </Button>
  }
/>
```

The `type="button"` is mandatory: without it the toggle becomes a second submit button inside the form.

## Layout: bare form vs. card

- Bare form: a plain `<form>` with `display: grid; gap: 16px` keeps the tab order and spacing predictable, and works well as the only content on a page.
- `Card appearance="outline"` gives the form a surface when it shares a page with other content. Keep the `<form>` inside the `Card` rather than making the card itself the form element, so selection/focus behavior stays with the card and semantics stay with the form.

## Re-authentication dialog

For "confirm it's you" gates, reuse the same `Field` + `Input` pieces inside `Dialog`:

```tsx
<Dialog open={open} onOpenChange={(_, data) => { if (!data.open) onDismiss(); }}>
  <DialogSurface>
    <DialogBody>
      <DialogTitle>Confirm it's you</DialogTitle>
      <DialogContent>{/* form with one password Field */}</DialogContent>
      <DialogActions>{/* Cancel + Continue */}</DialogActions>
    </DialogBody>
  </DialogSurface>
</Dialog>
```

Put the `<form>` inside `DialogContent` and give the confirm `Button` in `DialogActions` a matching `form` id plus `type="submit"`, so Enter inside the password field still submits while the DOM keeps the expected dialog structure. Reset the password, error, and submitting state whenever the dialog closes.

## Theming and direction

All examples assume a `FluentProvider` ancestor; without it the components have no theme tokens. Wrap the app root (or the form's portal target) once and set `dir` there for RTL. No login-form component hard-codes a string — every label, hint, and message is authored by you, so localization is a matter of supplying translated text.

## Verification checklist

- Tab order: heading → email → password → remember → forgot password → submit.
- Enter inside either input submits the form.
- Every error is visible, associated with its control, and announced.
- Password manager fills both fields (verify `autoComplete` tokens and `name` attributes).
- Submitting twice quickly performs one request.
- Component works with a screen reader in browse mode and forms mode.

## Examples

### Validated login form with async submit

A self-contained controlled login form: Field-based labels, hint and inline validation, remember-me checkbox, forgot-password link, a primary submit Button that shows a Spinner while the request is in flight, and an assertive MessageBar for credential failures. Wrapped in FluentProvider so the snippet runs as-is.

```tsx
import * as React from 'react';
import {
  Button,
  Checkbox,
  Field,
  FluentProvider,
  Input,
  Link,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Spinner,
  Text,
} from '@fluentui/react-components';

type LoginErrors = {
  email?: string;
  password?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Replace with your real authentication call.
async function signIn(request: { email: string; password: string; remember: boolean }): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  if (request.password === 'wrong-password') {
    throw new Error('Invalid credentials');
  }
}

export const LoginForm: React.FC<{ onSignedIn?: (email: string) => void }> = ({ onSignedIn }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [remember, setRemember] = React.useState(false);
  const [errors, setErrors] = React.useState<LoginErrors>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const validate = (): LoginErrors => {
    const next: LoginErrors = {};

    if (!email.trim()) {
      next.email = 'Enter your email address.';
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      next.email = 'Enter a valid email address, for example name@example.com.';
    }

    if (!password) {
      next.password = 'Enter your password.';
    } else if (password.length < 8) {
      next.password = 'Passwords are at least 8 characters.';
    }

    return next;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    setFormError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      await signIn({ email: email.trim(), password, remember });
      onSignedIn?.(email.trim());
    } catch {
      setFormError('That email and password combination did not work. Check your details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'grid', gap: '16px', maxWidth: '360px' }}>
      <h1 style={{ margin: 0 }}>
        <Text size={600} weight="semibold">
          Sign in
        </Text>
      </h1>

      {formError ? (
        <MessageBar intent="error" politeness="assertive">
          <MessageBarBody>
            <MessageBarTitle>We could not sign you in</MessageBarTitle>
            {formError}
          </MessageBarBody>
        </MessageBar>
      ) : null}

      <Field
        label="Email"
        required
        hint="Use the address you signed up with."
        validationState={errors.email ? 'error' : 'none'}
        validationMessage={errors.email}
      >
        <Input
          type="email"
          name="email"
          autoComplete="username"
          placeholder="name@example.com"
          value={email}
          onChange={(_, data) => setEmail(data.value)}
        />
      </Field>

      <Field
        label="Password"
        required
        validationState={errors.password ? 'error' : 'none'}
        validationMessage={errors.password}
      >
        <Input
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(_, data) => setPassword(data.value)}
        />
      </Field>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <Checkbox
          label="Keep me signed in"
          checked={remember}
          onChange={(_, data) => setRemember(data.checked === true)}
        />
        <Link inline href="/forgot-password">
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        appearance="primary"
        disabled={submitting}
        icon={submitting ? <Spinner size="tiny" /> : undefined}
      >
        {submitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
};

export default function App() {
  return (
    <FluentProvider>
      <LoginForm onSignedIn={(email) => console.log(`Signed in as ${email}`)} />
    </FluentProvider>
  );
}
```

### Login card with password reveal and error banner

The same credential fields presented on a Card surface, with a show/hide password toggle placed in Input's contentAfter slot, a full-width primary action that spins while pending, a form-level MessageBar for credential failures, and a sign-up Link in the footer.

```tsx
import * as React from 'react';
import {
  Button,
  Card,
  Checkbox,
  Field,
  Input,
  Link,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Spinner,
  Text,
} from '@fluentui/react-components';

// Replace with your real authentication call.
async function signIn(request: { email: string; password: string; remember: boolean }): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  if (request.password === 'wrong-password') {
    throw new Error('Invalid credentials');
  }
}

export const LoginCard: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [remember, setRemember] = React.useState(true);
  const [revealPassword, setRevealPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await signIn({ email: email.trim(), password, remember });
    } catch {
      setError('Your email or password is incorrect.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card appearance="outline" size="large" style={{ maxWidth: '420px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'grid', gap: '16px' }}>
        <h1 style={{ margin: 0 }}>
          <Text size={600} weight="semibold">
            Sign in to Contoso
          </Text>
        </h1>

        {error ? (
          <MessageBar intent="error" politeness="assertive">
            <MessageBarBody>
              <MessageBarTitle>Sign-in failed</MessageBarTitle>
              {error}
            </MessageBarBody>
          </MessageBar>
        ) : null}

        <form onSubmit={handleSubmit} noValidate style={{ display: 'grid', gap: '16px' }}>
          <Field label="Email" required>
            <Input
              type="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(_, data) => {
                setEmail(data.value);
                if (error) {
                  setError(null);
                }
              }}
            />
          </Field>

          <Field label="Password" required>
            <Input
              type={revealPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(_, data) => {
                setPassword(data.value);
                if (error) {
                  setError(null);
                }
              }}
              contentAfter={
                <Button
                  type="button"
                  appearance="transparent"
                  size="small"
                  aria-label={revealPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setRevealPassword((revealed) => !revealed)}
                >
                  {revealPassword ? 'Hide' : 'Show'}
                </Button>
              }
            />
          </Field>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <Checkbox
              label="Remember me"
              checked={remember}
              onChange={(_, data) => setRemember(data.checked === true)}
            />
            <Link inline href="/forgot-password">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            appearance="primary"
            disabled={submitting}
            style={{ width: '100%' }}
            icon={submitting ? <Spinner size="tiny" /> : undefined}
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <Text size={200} align="center" block>
          New to Contoso?{' '}
          <Link inline href="/sign-up">
            Create an account
          </Link>
        </Text>
      </div>
    </Card>
  );
};
```

### Re-authentication dialog

A controlled Dialog that asks for the password again before revealing sensitive content. The form lives inside DialogContent and the confirm Button in DialogActions submits it through the form attribute, so Enter inside the input and the dialog structure both behave correctly. State is reset whenever the dialog closes.

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
  Field,
  Input,
  Spinner,
  Text,
} from '@fluentui/react-components';

type ReauthenticateDialogProps = {
  open: boolean;
  onDismiss: () => void;
  onVerified: () => void;
};

// Replace with your real verification call.
async function verifyPassword(password: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  if (password === 'wrong-password') {
    throw new Error('Invalid password');
  }
}

export const ReauthenticateDialog: React.FC<ReauthenticateDialogProps> = ({
  open,
  onDismiss,
  onVerified,
}) => {
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setPassword('');
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!password) {
      setError('Enter your password to continue.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await verifyPassword(password);
      onVerified();
    } catch {
      setError('That password is not correct.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(_, data) => {
        if (!data.open) {
          onDismiss();
        }
      }}
    >
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Confirm it&#39;s you</DialogTitle>
          <DialogContent>
            <Text block size={300} style={{ marginBottom: '12px' }}>
              For your security we need your password before showing this information.
            </Text>
            <form id="reauthenticate-form" onSubmit={handleSubmit} noValidate>
              <Field
                label="Password"
                required
                validationState={error ? 'error' : 'none'}
                validationMessage={error}
              >
                <Input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(_, data) => {
                    setPassword(data.value);
                    if (error) {
                      setError(null);
                    }
                  }}
                />
              </Field>
            </form>
          </DialogContent>
          <DialogActions>
            <Button type="button" appearance="secondary" onClick={onDismiss} disabled={submitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="reauthenticate-form"
              appearance="primary"
              disabled={submitting}
              icon={submitting ? <Spinner size="tiny" /> : undefined}
            >
              {submitting ? 'Verifying...' : 'Continue'}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
```

## Pitfalls

- Using a placeholder as the only label. Placeholders vanish as soon as typing starts and are not a reliable accessible name; always provide Field's `label` and use the placeholder only as an example value such as `name@example.com`.
- Letting native browser validation run alongside Field validation. Without `noValidate` on the `<form>`, the browser bubble and the Fluent validation message both appear and say different things; add `noValidate` and own validation with `validationState`/`validationMessage`.
- Forgetting `type="button"` on controls placed in Input's contentBefore/contentAfter. A show/hide-password Button defaults to `type="submit"` inside a form, so clicking it submits the credential.
- Disabling the inputs while the request is in flight. It drops focus, blocks password managers, and hides the typed values; disable only the submit Button, swap its label, and drop a Spinner into its `icon` slot while guarding against double submits in the handler.
- Driving `Input` or `Checkbox` with `checked`/`value` but no `onChange`. React logs a read-only warning and the control stops responding; always pair the controlled prop with an `onChange` that writes the new value back (`data.value` for Input, `data.checked === true` for Checkbox, which can also be `'mixed'`).
- Reporting the same failure twice, or clearing errors too eagerly. Showing 'Invalid credentials' in both a field message and a MessageBar produces duplicate screen reader announcements; conversely, clearing the whole error object on every keystroke can flash errors away while the user is still typing the other field. Scope error clearing to the field being edited.
- Omitting `autoComplete`/`name`. Without `autoComplete="username"` and `autoComplete="current-password"`, password managers cannot fill the form and users fall back to copy/paste.
- Surfacing raw server text or a generic 'Something went wrong' as the only feedback. Map service errors to a specific, human sentence in the MessageBar, and keep the typed email after a failure so only the password has to be retyped.
- Reusing a Dialog-based login for state between openings. If password/error/submitting state is not reset when the dialog closes, the previous error is re-announced the next time the dialog opens; reset in an effect keyed on `open`, or unmount the form when closed.

## Accessibility

Labels: every credential control is wrapped in Field with a persistent visible `label`. Placeholders are supplementary examples only — they disappear on input and are not announced as names. Field ties the label to the control via htmlFor and links hint/validation text through described-by relationships, so pass messages through `validationMessage`/`hint` instead of rendering sibling divs.

Errors and announcements: field errors use `validationState="error"` which supplies an icon as well as color — never signal failure with color alone. Form-level errors use MessageBar with `intent="error"` and `politeness="assertive"` so the text is announced the moment it appears, without stealing focus. Avoid writing the same sentence in both a field message and the MessageBar; duplicated live-region announcements are noisy for screen reader users.

Focus management: after a failed local validation, move focus to the first invalid Input so keyboard and screen reader users land on the problem (use a ref on the Input, or focus the control whose Field is in the error state). After a server failure rendered in a MessageBar, leave focus on the submit Button so the user can correct the password and re-submit with one keystroke.

Keyboard flow: Enter inside either credential input submits the form, which requires the primary action to be `<Button type="submit">` inside the `<form>`. Any Button rendered inside `Input`'s `contentBefore`/`contentAfter` — such as the password reveal toggle — must be `type="button"`, otherwise it becomes a second, unlabeled submit button.

Autofill and mobile: `autoComplete="username"` on the identifier and `autoComplete="current-password"` on the password let password managers and assistive technology identify the fields; keep `name` attributes on both inputs so non-React consumers (FormData, browsers, password managers) can read them.

Busy state: disabling only the submit Button and swapping its label plus an inline Spinner avoids the trap where disabling the inputs drops focus to the body and silently discards what the user typed.

Dialog variant: Dialog moves and traps focus, Escape closes it, and DialogTitle (rendered as a heading) provides the accessible name — always render DialogTitle first inside DialogBody and give the dismiss Button a text label rather than an icon-only button with no name. Reset the password, error, and pending state when the dialog closes so no stale error is announced on the next open.

Theming and direction: render the form inside a FluentProvider so tokens, dark mode, high-contrast, and RTL direction are inherited; all copy in this recipe is supplied as text/children, so localization requires no component changes.

## Components used

- [Button](../../components/button.md)
- [Card](../../components/card.md)
- [Checkbox](../../components/checkbox.md)
- [Dialog](../../components/dialog.md)
- [DialogActions](../../components/dialog-actions.md)
- [DialogBody](../../components/dialog-body.md)
- [DialogContent](../../components/dialog-content.md)
- [DialogSurface](../../components/dialog-surface.md)
- [DialogTitle](../../components/dialog-title.md)
- [Field](../../components/field.md)
- [FluentProvider](../../components/fluent-provider.md)
- [Input](../../components/input.md)
- [Link](../../components/link.md)
- [MessageBar](../../components/message-bar.md)
- [MessageBarBody](../../components/message-bar-body.md)
- [MessageBarTitle](../../components/message-bar-title.md)
- [Spinner](../../components/spinner.md)
- [Text](../../components/text.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
