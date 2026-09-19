# Login Form

> **Group**: forms

## Goal

A production-ready sign-in form built from Fluent UI React v9 primitives: labelled credential inputs (Field + Input), a remember-me and reveal-password checkbox, a single primary action that guards against double submission, in-flight progress via Spinner, and form-level server feedback via MessageBar, wrapped in structure components (Card, Text, Divider, Link).

## When to Use

Use this recipe for any credential sign-in surface: a dedicated /login page, a modal or drawer sign-in prompt, an SSO fallback form, or a re-authentication prompt after session expiry. It fits when you need controlled inputs, inline validation, a single primary call-to-action, and screen-reader friendly error reporting without pulling in a form library.

## When Not to Use

Do not use it for account creation or multi-step flows with many field types (use the broader Form recipe with Select, DatepickerCompat, Spinbutton, Textarea). Avoid it when authentication is fully delegated to an external redirect with no local fields (you only need a Button and maybe a Spinner). For a password reset screen, reuse the Field + Input + Button + MessageBar pattern but with one field and a success state instead of a session. If you genuinely need a modal sign-in, wrap this markup in a Dialog rather than reworking the fields.

# Login Form

A sign-in surface assembled from Fluent UI React v9 form primitives: `Field`, `Input`, `Checkbox` and `Button`, with `MessageBar` and `Spinner` for the round trip to your identity service, plus `Card`, `Text`, `Divider` and `Link` for structure.

## What the recipe produces

- Two credential inputs with persistent labels, required indicators and inline error text that is part of the accessibility tree.
- Validation that runs on submit first and only then reacts to typing, so nobody is scolded mid keystroke.
- One primary action that cannot be double submitted and that reports progress while it waits.
- Server feedback through `MessageBar` instead of a modal or toast that steals focus.
- The secondary paths a real sign-in screen needs: reveal password, stay signed in, forgot password, create account and alternate providers.

## Why these components

| Concern | Component | Notes |
| --- | --- | --- |
| Label, hint and error text | `Field` | Renders `label`, `hint` and `validationMessage` as one unit and connects them to the control passed as children. |
| Credential entry | `Input` | `type` switches between `email`, `password` and `text` for the reveal toggle with no styling change. |
| Boolean choices | `Checkbox` | Controlled with `checked` and `onChange(ev, data)`; read `data.checked`. |
| Primary action | `Button` | `appearance="primary"`, `size="large"`, `disabled` while a request is in flight. |
| Progress | `Spinner` | Rendered in the Button `icon` slot while submitting. |
| Result feedback | `MessageBar` | `intent="error"` with `politeness="assertive"` for failures, `intent="success"` with `politeness="polite"` for success. |
| Surface, heading text, separator, links | `Card`, `Text`, `Divider`, `Link` | Purely presentational plus navigation. |

## Step 1 - Model values and errors

Keep the field values in one object and the validation result in a second one. Both inputs stay controlled (`value` + `onChange`), which is what lets you clear an error the moment the user fixes it.

```tsx
type LoginValues = { email: string; password: string; rememberMe: boolean };
type FieldErrors = Partial<Record<'email' | 'password', string>>;

const [values, setValues] = React.useState<LoginValues>({ email: '', password: '', rememberMe: true });
const [errors, setErrors] = React.useState<FieldErrors>({});
const [submitted, setSubmitted] = React.useState(false);
```

`Input` does not require a controlled value, but a login form almost always wants one, because you need to validate, clear and sometimes prefill a previously used address.

## Step 2 - One Field per input

`Field` is the accessibility backbone. Render the control inside it and describe it with the `label`, `required`, `validationState` and `validationMessage` props:

```tsx
<Field
  label="Password"
  required
  validationState={errors.password ? 'error' : 'none'}
  validationMessage={errors.password}
>
  <Input
    type={showPassword ? 'text' : 'password'}
    appearance="outline"
    value={values.password}
    onChange={(ev, data) => update({ password: data.value })}
  />
</Field>
```

Rules of thumb:

- Always reset `validationState` to `'none'` when the message clears, otherwise the field keeps its error outline.
- Prefer the persistent `label` over a placeholder. A placeholder is not a label and disappears as soon as the user types.
- Use `hint` for static guidance (password rules, SSO instructions) and `validationMessage` for dynamic errors.
- Use `orientation="horizontal"` on `Field` for a compact, table-like sign-in card.

## Step 3 - Validate on submit, then live

Validate in a single function, call it from the submit handler, and gate live re-validation behind a `submitted` flag:

```tsx
const update = (patch: Partial<LoginValues>) => {
  const next = { ...values, ...patch };
  setValues(next);
  if (submitted) {
    setErrors(validate(next));
  }
};

const submit = () => {
  setSubmitted(true);
  const nextErrors = validate(values);
  setErrors(nextErrors);
  if (Object.keys(nextErrors).length > 0) {
    return;
  }
  // call your authentication service here
};
```

This gives you the friendly behaviour of both worlds: a pristine form shows no errors, and an error disappears as soon as the value becomes valid.

## Step 4 - Use a real form element so Enter submits

Wrap the fields in a plain `<form>` with `noValidate` (so the browser does not stack its own bubbles on top of your `validationMessage`) and handle `onSubmit`. Give the primary `Button` the same `submit` handler through `onClick` so pointer users get identical behaviour, and make sure the handler is idempotent:

```tsx
<form
  noValidate
  onSubmit={(event) => {
    event.preventDefault();
    submit();
  }}
  style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
>
  {/* fields */}
  <Button appearance="primary" size="large" onClick={submit}>
    Sign in
  </Button>
</form>
```

## Step 5 - Report the server result with MessageBar and Spinner

A failed sign-in is a form-level problem, not a field-level one: the server will not tell you which of the two credentials was wrong. Render a single `MessageBar` above the form:

```tsx
{errorMessage && (
  <MessageBar intent="error" politeness="assertive" style={{ marginBottom: 8 }}>
    {errorMessage}
  </MessageBar>
)}
```

While the request is in flight, disable the button, change its label and drop a `Spinner` into its `icon` slot:

```tsx
<Button
  appearance="primary"
  size="large"
  disabled={isSubmitting}
  icon={isSubmitting ? <Spinner size="extra-tiny" /> : undefined}
  onClick={() => { void submit(); }}
>
  {isSubmitting ? 'Signing in...' : 'Sign in'}
</Button>
```

Clear the error as soon as the user edits a field again, so a stale message never sits next to a field that has already been corrected.

## Step 6 - Secondary actions

- Reveal password: a `Checkbox` labelled `Show password` that flips the `Input` `type` between `password` and `text`. The label is required; an icon-only eye toggle needs an accessible name.
- Stay signed in: a second `Checkbox`. It is part of the submitted payload, so it belongs in `LoginValues`, not in throwaway UI state.
- Forgot password and create account: `Link` with `inline`, sized as body copy so it sits on the baseline of the surrounding text.
- Alternate providers: `Button appearance="outline"` actions, separated from the credential form with `<Divider>or</Divider>`.

## Accessibility and layout checklist

- One `Field` per control; never hand-roll a `Label` next to an `Input`.
- Mark required fields with `required` on `Field` so the label renders the required indicator.
- The error `MessageBar` uses `politeness="assertive"`; success and informational bars use `politeness="polite"`.
- Something must be announced when the request starts. Keeping focus on the button and changing its label to a progress string is enough.
- Never signal an error with colour alone. `validationState="error"` pairs with text in `validationMessage`.
- Use `Card` only as a surface. Do not attach `onSelectionChange`, or the card becomes an extra tab stop in the middle of the form.
- Keep the primary button next in the tab order after the last field; links and alternate providers follow it.

## Where to take it next

- Need a modal sign-in? Wrap the same markup in a `Dialog` rather than rewriting the fields.
- Multi-tenant products can add a `Select` for workspace selection, using the same `Field` wrapper.
- Full-page session restore can render a `Spinner` with `labelPosition="below"` while the token refresh completes.

## Examples

### Basic login form with inline validation

A complete controlled sign-in form: email and password Fields with inline validation that runs on submit and then live, a reveal-password checkbox, remember me, forgot-password and create-account links, and a single primary action inside a real form element.

```tsx
import * as React from 'react';
import {
  Button,
  Card,
  Checkbox,
  Field,
  Input,
  Link,
  Text,
} from '@fluentui/react-components';

type LoginValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type FieldErrors = Partial<Record<'email' | 'password', string>>;

const emptyValues: LoginValues = { email: '', password: '', rememberMe: true };

export const BasicLoginForm: React.FC = () => {
  const [values, setValues] = React.useState<LoginValues>(emptyValues);
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [submitted, setSubmitted] = React.useState(false);

  const validate = (next: LoginValues): FieldErrors => {
    const nextErrors: FieldErrors = {};
    const email = next.email.trim();

    if (email.length === 0) {
      nextErrors.email = 'Enter the email address you signed up with.';
    } else if (!email.includes('@')) {
      nextErrors.email = 'Enter an email address in the format name@example.com.';
    }

    if (next.password.length === 0) {
      nextErrors.password = 'Enter your password.';
    }

    return nextErrors;
  };

  const update = (patch: Partial<LoginValues>) => {
    const next = { ...values, ...patch };
    setValues(next);
    // Only re-validate while typing after the first submit attempt.
    if (submitted) {
      setErrors(validate(next));
    }
  };

  const submit = () => {
    setSubmitted(true);
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    // TODO: call your authentication service with `values`.
  };

  return (
    <Card appearance="filled-alternative" size="large" style={{ maxWidth: 420 }}>
      <Text size={600} weight="semibold" block>
        Sign in
      </Text>
      <Text size={200} block style={{ marginBottom: 8 }}>
        Use your work account to continue.
      </Text>

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        <Field
          label="Email"
          required
          validationState={errors.email ? 'error' : 'none'}
          validationMessage={errors.email}
        >
          <Input
            type="email"
            appearance="outline"
            value={values.email}
            onChange={(ev, data) => update({ email: data.value })}
          />
        </Field>

        <Field
          label="Password"
          required
          validationState={errors.password ? 'error' : 'none'}
          validationMessage={errors.password}
        >
          <Input
            type={showPassword ? 'text' : 'password'}
            appearance="outline"
            value={values.password}
            onChange={(ev, data) => update({ password: data.value })}
          />
        </Field>

        <Checkbox
          checked={showPassword}
          onChange={(ev, data) => setShowPassword(Boolean(data.checked))}
          label="Show password"
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <Checkbox
            checked={values.rememberMe}
            onChange={(ev, data) => update({ rememberMe: Boolean(data.checked) })}
            label="Keep me signed in"
          />
          <Link href="/forgot-password" inline>
            Forgot password?
          </Link>
        </div>

        <Button appearance="primary" size="large" onClick={submit}>
          Sign in
        </Button>

        <Text size={200} block align="center">
          New here?{' '}
          <Link href="/signup" inline>
            Create an account
          </Link>
        </Text>
      </form>
    </Card>
  );
};
```

### Async login form with spinner and MessageBar feedback

Adds the asynchronous round trip: a status machine (idle, submitting, succeeded, failed), a Spinner inside the primary Button's icon slot, an assertive error MessageBar for bad credentials, a polite success MessageBar, and clearing of stale server errors when the user edits a field.

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
  Spinner,
  Text,
} from '@fluentui/react-components';

type Status = 'idle' | 'submitting' | 'succeeded' | 'failed';

type SignInResponse = { ok: true } | { ok: false; message: string };

// Stand-in for your real authentication call.
const signIn = (email: string, password: string): Promise<SignInResponse> =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      const isKnownUser = email.trim().length > 0;
      if (isKnownUser && password === 'correct-horse-battery-staple') {
        resolve({ ok: true });
      } else {
        resolve({
          ok: false,
          message:
            'We could not sign you in with that email and password. Check your details and try again.',
        });
      }
    }, 1200);
  });

export const AsyncLoginForm: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(true);
  const [status, setStatus] = React.useState<Status>('idle');
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>();

  const isSubmitting = status === 'submitting';

  const clearFeedback = () => {
    setErrorMessage(undefined);
    if (status === 'failed') {
      setStatus('idle');
    }
  };

  const submit = async () => {
    if (isSubmitting) {
      return;
    }

    if (email.trim().length === 0 || password.length === 0) {
      setStatus('failed');
      setErrorMessage('Enter both your email address and your password to continue.');
      return;
    }

    setStatus('submitting');
    setErrorMessage(undefined);

    const result = await signIn(email, password);

    if (result.ok) {
      setStatus('succeeded');
    } else {
      setStatus('failed');
      setErrorMessage(result.message);
    }
  };

  return (
    <Card appearance="filled-alternative" size="large" style={{ maxWidth: 420 }}>
      <Text size={600} weight="semibold" block>
        Sign in
      </Text>
      <Text size={200} block style={{ marginBottom: 8 }}>
        Sign in with the email address your admin invited.
      </Text>

      {errorMessage && (
        <MessageBar intent="error" politeness="assertive" style={{ marginBottom: 8 }}>
          {errorMessage}
        </MessageBar>
      )}

      {status === 'succeeded' && (
        <MessageBar intent="success" politeness="polite" style={{ marginBottom: 8 }}>
          Signed in. Taking you to your dashboard...
        </MessageBar>
      )}

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        <Field label="Email" required>
          <Input
            type="email"
            appearance="outline"
            value={email}
            onChange={(ev, data) => {
              setEmail(data.value);
              clearFeedback();
            }}
          />
        </Field>

        <Field label="Password" required>
          <Input
            type="password"
            appearance="outline"
            value={password}
            onChange={(ev, data) => {
              setPassword(data.value);
              clearFeedback();
            }}
          />
        </Field>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <Checkbox
            checked={rememberMe}
            onChange={(ev, data) => setRememberMe(Boolean(data.checked))}
            label="Keep me signed in"
          />
          <Link href="/forgot-password" inline>
            Forgot password?
          </Link>
        </div>

        <Button
          appearance="primary"
          size="large"
          disabled={isSubmitting}
          icon={isSubmitting ? <Spinner size="extra-tiny" /> : undefined}
          onClick={() => {
            void submit();
          }}
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </Card>
  );
};
```

### Compact sign-in card with alternate providers

A denser layout using horizontal Fields with underline Inputs, a Divider separating the credential form from single sign-on and passkey buttons, and a pending-provider status line rendered with Text.

```tsx
import * as React from 'react';
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Field,
  Input,
  Link,
  Text,
} from '@fluentui/react-components';

type Provider = 'sso' | 'passkey';

export const CompactSignInCard: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [keepSignedIn, setKeepSignedIn] = React.useState(false);
  const [pendingProvider, setPendingProvider] = React.useState<Provider | undefined>();

  const submit = () => {
    if (email.trim().length === 0 || password.length === 0) {
      return;
    }
    setPendingProvider(undefined);
    // TODO: sign in with the email and password values above.
  };

  const signInWith = (provider: Provider) => {
    setPendingProvider(provider);
    // TODO: start the redirect or WebAuthn ceremony for `provider`.
  };

  return (
    <Card appearance="outline" size="medium" style={{ width: 480, maxWidth: '100%' }}>
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        <Text size={500} weight="semibold" block>
          Sign in to Contoso
        </Text>

        <Field orientation="horizontal" label="Email" required>
          <Input
            type="email"
            appearance="underline"
            value={email}
            onChange={(ev, data) => setEmail(data.value)}
          />
        </Field>

        <Field orientation="horizontal" label="Password" required>
          <Input
            type="password"
            appearance="underline"
            value={password}
            onChange={(ev, data) => setPassword(data.value)}
          />
        </Field>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <Checkbox
            checked={keepSignedIn}
            onChange={(ev, data) => setKeepSignedIn(Boolean(data.checked))}
            label="Keep me signed in"
          />
          <Link href="/forgot-password" inline>
            Forgot password?
          </Link>
        </div>

        <Button appearance="primary" onClick={submit}>
          Sign in
        </Button>

        <Divider>or</Divider>

        <div style={{ display: 'grid', gap: 8 }}>
          <Button appearance="outline" onClick={() => signInWith('sso')}>
            Continue with single sign-on
          </Button>
          <Button appearance="outline" onClick={() => signInWith('passkey')}>
            Sign in with a passkey
          </Button>
        </div>

        {pendingProvider && (
          <Text size={200} block>
            Starting the {pendingProvider === 'sso' ? 'single sign-on' : 'passkey'} flow...
          </Text>
        )}

        <Text size={200} block align="center">
          New to Contoso?{' '}
          <Link href="/signup" inline>
            Create an account
          </Link>
        </Text>
      </form>
    </Card>
  );
};
```

## Pitfalls

- Rendering a bare Input with a placeholder instead of wrapping it in Field. You lose the programmatic label, the required indicator and the aria-describedby link to the error text. Always use Field with a persistent label.
- Setting validationMessage without a matching validationState, or forgetting to reset validationState back to 'none'. A message with no 'error' state renders without the error styling, and a field that is never reset keeps a red outline after the user has fixed the value.
- Validating on every keystroke from the first render. Gate live validation behind a submitted flag so a pristine form shows no errors, then re-validate as the user types once they have attempted a submit.
- Reporting a wrong email or password as a field-level error. Most identity providers deliberately do not reveal which credential was wrong; surface it once as a form-level MessageBar with politeness="assertive" above the fields.
- Disabling the submit Button whenever a field is empty. Users cannot discover what is wrong from a dead button; keep it enabled, validate on submit, and only set disabled while a request is in flight.
- Leaving a server error on screen after the user edits a field. Clear the MessageBar text (and ideally the failed status) on the next onChange, otherwise a stale 'wrong password' banner sits next to a value that has already been corrected.
- Using uncontrolled inputs (defaultValue only) in a form you also need to reset, prefill or clear after a failed attempt. Switch to value plus onChange so the state object is the single source of truth.

## Accessibility

Field is the accessibility backbone: rendering the Input as its child makes Field emit a Label with a matching htmlFor plus aria-describedby wiring for hint and validationMessage, so the error text is announced when the control gets focus. Always mark required fields with required on Field so the required indicator is rendered, and never signal an error with colour alone - pair validationState="error" with text in validationMessage. Errors that come back from the server should live in a single MessageBar with politeness="assertive" so screen readers interrupt to read the failure, while success and informational messages use politeness="polite" so they wait their turn. During submission keep focus on the Button, disable it to prevent double submits, and change its label to a progress string ("Signing in...") so the state change is announced; the Spinner in the icon slot is decorative. All Checkbox controls (reveal password, keep me signed in) carry a visible label rather than an icon-only affordance. Put the username and current-password autocomplete hints on the underlying text inputs so password managers and browser autofill keep working, and never block paste into credential fields. Use a real form element with onSubmit so Enter submits, give the surface a heading via Text for landmark navigation, and keep the Card non-interactive (no onSelectionChange) so it does not become a stray tab stop between the last field and the submit button.

## Components used

- - [Button](../../components/button.md)
- - [Card](../../components/card.md)
- - [Checkbox](../../components/checkbox.md)
- - [Divider](../../components/divider.md)
- - [Field](../../components/field.md)
- - [Input](../../components/input.md)
- - [Link](../../components/link.md)
- - [MessageBar](../../components/message-bar.md)
- - [Spinner](../../components/spinner.md)
- - [Text](../../components/text.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
