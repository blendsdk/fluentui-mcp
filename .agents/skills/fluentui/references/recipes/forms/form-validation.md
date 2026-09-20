# Form Validation

> **Group**: forms

## Goal

Collect user input in a Fluent UI React v9 form with accessible, Field-based validation: derived error messages, sensible blur/submit timing, form-level MessageBar summaries, focus management after a failed submit, plus cross-field and async (availability) rule support.

## When to Use

Use this recipe for any Fluent UI React v9 form that needs inline, accessible validation: sign-up, profile and settings forms, checkout steps, admin panels, or any screen where per-field messages must be associated with their control for assistive technology and where the form must summarize what is wrong before submitting. It is also the right starting point for cross-field rules (confirm password, date ranges) and asynchronous rules (username or coupon availability).

## When Not to Use

Skip the full recipe for a single isolated field with no rules - render Field plus the control directly. If you already use a schema or form-state library (react-hook-form, Formik, a validation schema), keep it for state and submission and use Field/MessageBar only as the presentation layer described here instead of building a second message system. Do not use Field's validationMessage for page-wide or server-wide failures; use MessageBar (or a Toast surface) for those, and keep field messages for field-scoped problems.

## What this recipe builds

A form whose validity lives in one place, whose messages appear at the right moment, and whose errors are wired to the controls for assistive technology. It uses `Field` as the validation shell, `Input` / `Textarea` / `Select` / `Checkbox` as controls, `MessageBar` for form-level feedback and `Button` to submit.

## Step 1 - Wrap every validated control in `Field`

`Field` is the only Fluent UI React v9 component that models validation. It renders the label, the hint, the validation message and the message icon, and injects the ARIA wiring into the control through context:

- `label` - renders the `<label>` element and gives the control its accessible name.
- `required` - renders the required indicator and marks the control as required. Native enforcement stays off because the `<form>` is `noValidate`.
- `hint` - always-visible help text (format rules, ranges, character counts). It becomes part of the control's `aria-describedby`.
- `validationState` - `'none' | 'error' | 'warning' | 'success'`. `'error'` sets `aria-invalid="true"` on the control and switches the message to the error style with an icon.
- `validationMessage` - the dynamic message. It renders nothing when `undefined` and is added to `aria-describedby`.
- `orientation` - `'vertical'` (default) or `'horizontal'` when the label should sit beside the control in dense layouts.
- `size` - `'small' | 'medium' | 'large'` for compact layouts.

The controls `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Dropdown`, `Combobox`, `Switch`, `Slider` and `SpinButton` read that context, so you never hand-write `htmlFor`, `id`, `aria-describedby` or `aria-invalid`.

## Step 2 - Model values, derive errors

Keep exactly one copy of the data. Errors are computed, never stored:

```tsx
type FormValues = { email: string; acceptTerms: boolean };
type FormErrors = Partial<Record<keyof FormValues, string>>;

const errors = React.useMemo(() => validate(values), [values]);
const isInvalid = Object.keys(errors).length > 0;
```

Because `errors` is derived, a field stops being invalid the moment its value becomes valid - there is no stale message to clear by hand.

## Step 3 - Decide when a message becomes visible

Store only two extra pieces of UI state: which fields the user has visited, and whether the form has been submitted.

```tsx
const [touched, setTouched] = React.useState<Partial<Record<keyof FormValues, boolean>>>({});
const [submitCount, setSubmitCount] = React.useState(0);
const submitAttempted = submitCount > 0;

const visibleError = (field: keyof FormValues) =>
  touched[field] || submitAttempted ? errors[field] : undefined;

const validationStateFor = (field: keyof FormValues) =>
  visibleError(field) ? 'error' : 'none';
```

Recommended timing:

- First render: no messages, `validationState="none"`.
- `onBlur` of a field: mark it touched so its rule is evaluated and shown.
- `onChange` after a failed submit: `submitAttempted` stays `true`, so errors clear live while the user fixes them.
- `Select`, `RadioGroup`, `Checkbox`: mark touched inside the change handler - a picked value is a committed answer.

## Step 4 - Render hint and message on the field

```tsx
<Field
  label="Work email"
  required
  hint="We only use this address for account notifications."
  validationState={validationStateFor('email')}
  validationMessage={visibleError('email')}
>
  <Input
    value={values.email}
    onChange={(_, data) => updateValue('email', data.value)}
    onBlur={markTouched('email')}
  />
</Field>
```

Change-event data shapes: `InputOnChangeData.value`, `TextareaOnChangeData.value` and `SelectOnChangeData.value` are strings, while `CheckboxOnChangeData.checked` is `boolean | 'mixed'`, so compare with `data.checked === true`.

Use `validationState="warning"` for soft advice (a background check that could not run, a recommended-but-optional rule) and `"success"` to confirm a rule that only passes after work (a strong password, an available username). Keep one message per field: put the single next action in `validationMessage` and persistent rules in `hint`.

## Step 5 - Summarize at the form level and move focus

Field-level messages only help if the user can reach them. After a failed submit, render a `MessageBar` summary and focus the first invalid control:

```tsx
const formRef = React.useRef<HTMLFormElement>(null);

React.useEffect(() => {
  if (submitCount === 0) return;
  formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
}, [submitCount]);
```

The lookup leans on the `aria-invalid` that `Field` puts on the control when `validationState` is `'error'`, so it always lands on the focusable element itself (the `<input>`, `<select>` or `<textarea>`). Custom focus logic per field is then unnecessary.

The submit handler stays tiny:

```tsx
const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setSubmitCount(count => count + 1);
  if (!isInvalid) setSaved(true);
};
```

Keep the submit `Button` enabled. A disabled button cannot explain what is wrong, and a user who cannot see the screen never learns why it does nothing. Only disable it for transient reasons such as an in-flight async check, and say so with a `Spinner`.

## Step 6 - Cross-field and asynchronous rules

- Cross-field: compute both sides from the same `values` object (password vs. confirmation, start vs. end date) and give each control its own `validationState` and `validationMessage`, so a mismatch can mark the second field while the first stays `success`.
- Async (username availability, coupon codes): keep a status string such as `'idle' | 'checking' | 'available' | 'taken' | 'unknown'`, debounce with `setTimeout` inside `useEffect`, and clean up with a `cancelled` flag so an out-of-order response cannot overwrite a newer one. Show progress in the `Input`'s `contentAfter` slot with `Spinner size="extra-tiny"`, then map the outcome onto `validationState`: `'taken'` becomes `error`, `'unknown'` becomes `warning` (submitting is still allowed and the server re-checks), `'available'` becomes `success`.
- Server-side errors: reuse the same `FormErrors` shape. Set the returned per-field errors into state and render them through the identical `validationMessage` props; put whole-form errors in the `MessageBar`.

## Step 7 - Pre-ship check list

- The `<form>` has `noValidate`, so browser bubbles never pre-empt your messages.
- Every control sits inside a `Field` with a real `label` (never a placeholder used as a label).
- Errors are derived from values with `useMemo`; the only extra state is `touched`, `submitAttempted` and async status.
- `validationState` and `validationMessage` are always set together.
- Focus moves to the first invalid control after a failed submit.
- Async validation cancels stale responses and never blocks submit on an unknown result.
- The submit button is enabled and the form explains itself through messages.

## Examples

### Profile form with derived validation, field messages and a form-level summary

A complete form using Field + Input + Select + Textarea + Checkbox, with errors derived from a single values object, messages revealed only after blur or submit, an error MessageBar summarizing the failure, a success MessageBar after saving, and focus moved to the first control that Field marked aria-invalid.

```tsx
import * as React from 'react';
import {
  Button,
  Checkbox,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Select,
  Textarea,
} from '@fluentui/react-components';

type FormValues = {
  fullName: string;
  email: string;
  role: string;
  bio: string;
  acceptTerms: boolean;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_VALUES: FormValues = {
  fullName: '',
  email: '',
  role: '',
  bio: '',
  acceptTerms: false,
};

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (values.fullName.trim().length === 0) {
    errors.fullName = 'Enter your full name.';
  }

  if (values.email.trim().length === 0) {
    errors.email = 'Enter your email address.';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Enter an email address in the format name@example.com.';
  }

  if (values.role.length === 0) {
    errors.role = 'Select the role that best fits your work.';
  }

  if (values.bio.length > 200) {
    errors.bio = 'Keep your bio to 200 characters or fewer.';
  }

  if (!values.acceptTerms) {
    errors.acceptTerms = 'You must accept the terms of service to create a profile.';
  }

  return errors;
}

export const ProfileForm: React.FC = () => {
  const formRef = React.useRef<HTMLFormElement>(null);

  const [values, setValues] = React.useState<FormValues>(INITIAL_VALUES);
  const [touched, setTouched] = React.useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [submitCount, setSubmitCount] = React.useState(0);
  const [saved, setSaved] = React.useState(false);

  const errors = React.useMemo(() => validate(values), [values]);
  const errorFields = Object.keys(errors) as (keyof FormValues)[];
  const isInvalid = errorFields.length > 0;
  const submitAttempted = submitCount > 0;

  // After a failed submit, focus the first control that Field marked aria-invalid.
  React.useEffect(() => {
    if (submitCount === 0) {
      return;
    }
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [submitCount]);

  const updateValue = <K extends keyof FormValues>(field: K, value: FormValues[K]) => {
    setValues(previous => ({ ...previous, [field]: value }));
    setSaved(false);
  };

  const markTouched = (field: keyof FormValues) => () => {
    setTouched(previous => ({ ...previous, [field]: true }));
  };

  /** Reveal a message only once the field was visited or the form was submitted. */
  const visibleError = (field: keyof FormValues): string | undefined =>
    touched[field] || submitAttempted ? errors[field] : undefined;

  const stateFor = (field: keyof FormValues): 'error' | 'none' => (visibleError(field) ? 'error' : 'none');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitCount(count => count + 1);

    if (!isInvalid) {
      setSaved(true);
    }
  };

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={handleSubmit}
      style={{ display: 'grid', gap: '16px', maxWidth: '480px' }}
    >
      {submitAttempted && isInvalid && (
        <MessageBar intent="error">
          <MessageBarBody>
            <MessageBarTitle>Your profile was not saved</MessageBarTitle>
            Fix the {errorFields.length} highlighted {errorFields.length === 1 ? 'field' : 'fields'} and submit again.
          </MessageBarBody>
        </MessageBar>
      )}

      {saved && (
        <MessageBar intent="success">
          <MessageBarBody>
            <MessageBarTitle>Profile saved</MessageBarTitle>
            We will send a confirmation to {values.email.trim()}.
          </MessageBarBody>
        </MessageBar>
      )}

      <Field
        label="Full name"
        required
        validationState={stateFor('fullName')}
        validationMessage={visibleError('fullName')}
      >
        <Input
          name="fullName"
          value={values.fullName}
          onChange={(_, data) => updateValue('fullName', data.value)}
          onBlur={markTouched('fullName')}
        />
      </Field>

      <Field
        label="Work email"
        required
        hint="We only use this address for account notifications."
        validationState={stateFor('email')}
        validationMessage={visibleError('email')}
      >
        <Input
          name="email"
          type="email"
          value={values.email}
          onChange={(_, data) => updateValue('email', data.value)}
          onBlur={markTouched('email')}
        />
      </Field>

      <Field label="Role" required validationState={stateFor('role')} validationMessage={visibleError('role')}>
        <Select
          name="role"
          value={values.role}
          onChange={(_, data) => {
            updateValue('role', data.value);
            setTouched(previous => ({ ...previous, role: true }));
          }}
        >
          <option value="">Select a role</option>
          <option value="designer">Designer</option>
          <option value="engineer">Engineer</option>
          <option value="researcher">Researcher</option>
        </Select>
      </Field>

      <Field
        label="Bio"
        hint={`${values.bio.length}/200 characters`}
        validationState={stateFor('bio')}
        validationMessage={visibleError('bio')}
      >
        <Textarea
          name="bio"
          resize="vertical"
          value={values.bio}
          onChange={(_, data) => updateValue('bio', data.value)}
          onBlur={markTouched('bio')}
        />
      </Field>

      {/* No label on this Field: the Checkbox label is the accessible name. */}
      <Field validationState={stateFor('acceptTerms')} validationMessage={visibleError('acceptTerms')}>
        <Checkbox
          label="I accept the terms of service"
          checked={values.acceptTerms}
          onChange={(_, data) => {
            updateValue('acceptTerms', data.checked === true);
            setTouched(previous => ({ ...previous, acceptTerms: true }));
          }}
        />
      </Field>

      <div>
        <Button appearance="primary" type="submit">
          Create profile
        </Button>
      </div>
    </form>
  );
};
```

### Debounced async validation for a username field

Field render-prop usage combined with a debounced availability check: a Spinner in the Input's contentAfter slot while checking, error state for a taken name, warning state when the service cannot be reached, success state for an available name, and a submit handler that only blocks on real errors.

```tsx
import * as React from 'react';
import {
  Button,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Spinner,
} from '@fluentui/react-components';

type AvailabilityStatus = 'idle' | 'checking' | 'available' | 'taken' | 'unknown';

type ValidationState = 'none' | 'error' | 'warning' | 'success';

const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/i;

const RESERVED_USERNAMES = new Set(['admin', 'root', 'support', 'help']);

function isUsernameAvailable(username: string): Promise<boolean> {
  return new Promise(resolve => {
    window.setTimeout(() => resolve(!RESERVED_USERNAMES.has(username.toLowerCase())), 600);
  });
}

export const UsernameForm: React.FC = () => {
  const [username, setUsername] = React.useState('');
  const [status, setStatus] = React.useState<AvailabilityStatus>('idle');
  const [touched, setTouched] = React.useState(false);
  const [submitAttempted, setSubmitAttempted] = React.useState(false);
  const [claimed, setClaimed] = React.useState<string | null>(null);

  const requiredError = username.length === 0 && submitAttempted ? 'Enter a username.' : undefined;
  const formatError =
    username.length === 0 || USERNAME_PATTERN.test(username)
      ? undefined
      : 'Use 3-20 characters: letters, numbers and underscores only.';

  // Debounced availability check. The cancelled flag drops out-of-order responses.
  React.useEffect(() => {
    if (formatError || username.length === 0) {
      setStatus('idle');
      return;
    }

    let cancelled = false;
    setStatus('checking');

    const timer = window.setTimeout(() => {
      isUsernameAvailable(username)
        .then(available => {
          if (!cancelled) {
            setStatus(available ? 'available' : 'taken');
          }
        })
        .catch(() => {
          if (!cancelled) {
            setStatus('unknown');
          }
        });
    }, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [username, formatError]);

  let validationState: ValidationState = 'none';
  let validationMessage: string | undefined;

  if (requiredError || formatError) {
    validationState = 'error';
    validationMessage = requiredError ?? formatError;
  } else if (status === 'taken') {
    validationState = 'error';
    validationMessage = 'That username is already taken. Try another one.';
  } else if (status === 'unknown') {
    validationState = 'warning';
    validationMessage = 'We could not check availability just now. We will verify again on submit.';
  } else if (status === 'available' && touched) {
    validationState = 'success';
    validationMessage = 'This username is available.';
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);

    if (
      username.length === 0 ||
      Boolean(formatError) ||
      status === 'taken' ||
      status === 'checking'
    ) {
      return;
    }

    // 'unknown' intentionally does not block: the server re-validates on submit.
    setClaimed(username);
  };

  return (
    <form noValidate onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px', maxWidth: '400px' }}>
      <Field
        label="Username"
        required
        hint="3-20 characters. Letters, numbers and underscores only."
        validationState={validationState}
        validationMessage={validationMessage}
      >
        {controlProps => (
          <Input
            {...controlProps}
            name="username"
            value={username}
            onChange={(_, data) => {
              setUsername(data.value);
              setTouched(false);
              setClaimed(null);
            }}
            onBlur={() => setTouched(true)}
            contentAfter={status === 'checking' ? <Spinner size="extra-tiny" /> : undefined}
          />
        )}
      </Field>

      <div>
        {/* Transient guard while the check is in flight; not a validation gate. */}
        <Button appearance="primary" type="submit" disabled={status === 'checking'}>
          Claim username
        </Button>
      </div>

      {claimed && (
        <MessageBar intent="success">
          <MessageBarBody>
            <MessageBarTitle>@{claimed} is yours</MessageBarTitle>
            We reserved it for the next 10 minutes.
          </MessageBarBody>
        </MessageBar>
      )}
    </form>
  );
};
```

### Cross-field validation with a live requirement checklist

Password and confirmation fields validated together: the requirement checklist is rendered inside Field's hint slot so it is part of the control's aria-describedby, the password flips from error to success once every rule passes, and the confirmation field only reports a mismatch against the current password value.

```tsx
import * as React from 'react';
import {
  Button,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Text,
} from '@fluentui/react-components';

type ValidationState = 'none' | 'error' | 'success';

type PasswordRule = {
  id: string;
  label: string;
  test: (value: string) => boolean;
};

const PASSWORD_RULES: PasswordRule[] = [
  { id: 'length', label: 'At least 12 characters', test: value => value.length >= 12 },
  {
    id: 'case',
    label: 'An uppercase and a lowercase letter',
    test: value => /[A-Z]/.test(value) && /[a-z]/.test(value),
  },
  { id: 'number', label: 'At least one number', test: value => /\d/.test(value) },
  { id: 'symbol', label: 'At least one symbol', test: value => /[^A-Za-z0-9]/.test(value) },
];

export const PasswordForm: React.FC = () => {
  const [password, setPassword] = React.useState('');
  const [confirmation, setConfirmation] = React.useState('');
  const [touched, setTouched] = React.useState({ password: false, confirmation: false });
  const [saved, setSaved] = React.useState(false);

  const failedRules = PASSWORD_RULES.filter(rule => !rule.test(password));
  const passwordError =
    password.length === 0
      ? undefined
      : failedRules.length > 0
      ? 'Your password does not meet every requirement listed below.'
      : undefined;

  const confirmationError =
    confirmation.length > 0 && confirmation !== password ? 'Both passwords must match.' : undefined;

  const markPasswordTouched = () => setTouched(previous => ({ ...previous, password: true }));
  const markConfirmationTouched = () => setTouched(previous => ({ ...previous, confirmation: true }));

  let passwordState: ValidationState = 'none';
  let passwordMessage: string | undefined;
  if (touched.password) {
    passwordState = passwordError ? 'error' : password.length > 0 ? 'success' : 'none';
    passwordMessage = passwordError ?? (password.length > 0 ? 'Password meets every requirement.' : undefined);
  }

  let confirmationState: ValidationState = 'none';
  if (confirmationError) {
    confirmationState = 'error';
  } else if (confirmation.length > 0 && password.length > 0 && confirmation === password) {
    confirmationState = 'success';
  }

  const confirmationMessage =
    confirmationError ?? (confirmationState === 'success' ? 'Passwords match.' : undefined);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ password: true, confirmation: true });

    if (password.length === 0 || failedRules.length > 0 || confirmation !== password) {
      return;
    }

    setSaved(true);
  };

  return (
    <form noValidate onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px', maxWidth: '420px' }}>
      {saved && (
        <MessageBar intent="success">
          <MessageBarBody>
            <MessageBarTitle>Password updated</MessageBarTitle>
            Use the new password the next time you sign in.
          </MessageBarBody>
        </MessageBar>
      )}

      <Field
        label="New password"
        required
        validationState={passwordState}
        validationMessage={passwordMessage}
        hint={
          <ul style={{ margin: 0, paddingInlineStart: '20px' }}>
            {PASSWORD_RULES.map(rule => {
              const met = rule.test(password);
              return (
                <li key={rule.id}>
                  <Text size={200} weight={met ? 'semibold' : 'regular'}>
                    {rule.label} - {met ? 'met' : 'not met'}
                  </Text>
                </li>
              );
            })}
          </ul>
        }
      >
        <Input
          name="new-password"
          type="password"
          value={password}
          onChange={(_, data) => {
            setPassword(data.value);
            setSaved(false);
          }}
          onBlur={markPasswordTouched}
        />
      </Field>

      <Field
        label="Confirm new password"
        required
        validationState={confirmationState}
        validationMessage={confirmationMessage}
      >
        <Input
          name="confirm-password"
          type="password"
          value={confirmation}
          onChange={(_, data) => {
            setConfirmation(data.value);
            setSaved(false);
          }}
          onBlur={markConfirmationTouched}
        />
      </Field>

      <div>
        <Button appearance="primary" type="submit">
          Update password
        </Button>
      </div>
    </form>
  );
};
```

## Pitfalls

- Leaving native browser validation on. Without noValidate on the <form>, the browser blocks submission and shows its own untranslated, non-themable bubbles before Field can render validationMessage. Add noValidate and own the validation yourself.
- Storing error strings in state instead of deriving them. A stored message survives after the value becomes valid, so the field stays red. Derive errors with useMemo from the values object and keep only touched / submitAttempted / async status in state.
- Showing errors before the user interacts. Rendering validationState="error" on first paint shouts at people before they type and marks fields they have not reached. Gate message visibility with touched or submitAttempted.
- Disabling the submit button to express invalidity. A disabled button cannot explain itself, and keyboard or screen reader users never learn what is missing. Keep it enabled, validate on submit, reveal messages, and move focus to the first invalid control; only disable it for transient reasons such as an in-flight async check.
- Setting validationState without validationMessage (or the reverse). An error outline with no explanation is unusable, and a message with validationState="none" is not styled or announced as an error. Always set the two props together, one message per field.
- Hand-writing id, aria-describedby or aria-invalid on a control inside Field. Field supplies those through context; passing your own values overrides them and drops the association with the hint and validation message. Use the Field render-prop child (control props) if you need a custom control.
- Skipping focus management. Field messages are rendered below the control, so on a long form an invalid field can be off screen. Query '[aria-invalid="true"]' inside the form after a failed submit and focus it.
- Racing async validation results. A slow response for an old value can overwrite the status of the value the user has already changed. Debounce with a timer, clear it in the effect cleanup, and ignore results flagged as cancelled; treat an unreachable service as validationState="warning" rather than blocking submit.

## Accessibility

Field does the ARIA work for you: it renders the label with the matching htmlFor/id, adds the hint and validation message to the control's aria-describedby, and sets aria-invalid="true" on the control when validationState is 'error'. Do not pass your own id or aria-describedby to a control inside a Field unless you carry the Field-provided values forward - overriding them silently disconnects the message (the Field render-prop child form hands you exactly those props). Never rely on colour alone to signal a problem: validationState also renders a status icon, and the message text should state the specific fix. Announce form-level failures through MessageBar, which is a live region - keep the copy short, use MessageBarTitle for the headline, and reserve politeness="assertive" for errors that must interrupt. After a failed submit, move focus to the first invalid control (query '[aria-invalid="true"]' inside the form) so screen reader users hear the associated message immediately, and consider the same for server-side errors. Always provide a visible label for every Field - placeholder text is not a label and disappears while typing - and keep user input intact on failure so nothing has to be retyped.

## Components used

- [Button](../../components/button.md)
- [Checkbox](../../components/checkbox.md)
- [Field](../../components/field.md)
- [Input](../../components/input.md)
- [MessageBar](../../components/message-bar.md)
- [MessageBarBody](../../components/message-bar-body.md)
- [MessageBarTitle](../../components/message-bar-title.md)
- [Select](../../components/select.md)
- [Spinner](../../components/spinner.md)
- [Text](../../components/text.md)
- [Textarea](../../components/textarea.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
