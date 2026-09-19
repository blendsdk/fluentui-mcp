# Form Validation

> **Group**: forms

## Goal

Build validated FluentUI React v9 forms where every control renders its own label, hint, error/warning/success message and ARIA wiring through Field, errors are derived from values (never duplicated in state), errors are revealed only after interaction or submit, cross-field and async rules are supported, and form-level failures are announced through a MessageBar summary.

## When to Use

Use this recipe whenever a form must tell the user what is wrong: required-field checks, format rules (email, length, pattern), cross-field rules such as password confirmation, server-owned uniqueness/availability checks, and success/failure feedback after submit. It is the default approach for any multi-control form built with Fluent v9 controls (Input, Textarea, Select, Checkbox, Radio, Switch, Spinbutton).

## When Not to Use

Do not use this pattern when there is no validation to perform (a single search box: use Search or Input with a clear button). Avoid hand-rolling validation markup with Label + custom error spans when a Field-compatible control exists, since you would lose the automatic aria-describedby/aria-labelledby wiring. For very large, schema-driven forms consider a form library (react-hook-form, Formik) and register Fluent controls through Field as described here rather than replacing the Fluent field layout; for field-level help content that is not validation, use the Field hint slot or an Infolabel instead of a validation message.

## What you get

A form in which each control renders its own label, hint, error icon and message, in which a user only sees a problem after interacting with a field or pressing submit, and in which the form as a whole announces how many fields still need attention.

## Why Field is the backbone

`Field` renders the label, an optional hint, and an optional validation message, and it connects all of them to the control it wraps through context. Supported controls receive the generated `aria-labelledby` and `aria-describedby` values automatically, and the label gets a required indicator when `required` is set. You never hand-write ids or `role="alert"` spans:

```tsx
<Field
  label="Email"
  required
  validationState={error ? "error" : "none"}
  validationMessage={error}
  hint="We only use this address for receipts."
>
  <Input value={value} onChange={(ev, data) => setValue(data.value)} />
</Field>
```

`validationState` accepts `"error" | "warning" | "success" | "none"` and drives both the icon and the message styling. `validationMessage` is a slot, so a plain string covers the common case and a custom element covers rich content; the `validationMessageIcon` slot lets you replace the built-in icon. Keep the two in step: a message with `validationState="none"` renders without error styling, and `validationState="error"` with no message renders an icon with nothing to explain it.

## The three rules that keep validated forms pleasant

1. **One source of truth.** Keep `values` in state and *derive* errors from them on every render (`const errors = validate(values)`). Storing errors in a second state variable is how forms end up showing a stale message next to a value the user already fixed.
2. **State and message come from the same value.** Compute `validationState` and `validationMessage` from the same `errors[name]` expression so they can never disagree.
3. **Reveal errors progressively.** Show an error only after the field has been touched (set in `onBlur`) or after the user pressed submit. Showing every required error on first paint makes an empty form look broken.

## Step by step

1. Type the form values and write one pure `validate(values)` function returning a partial map of messages, for example `{ email: "Enter an address like name@example.com." }`.
2. Create state: `values`, `touched`, `submitAttempted`, `isSubmitting`.
3. Derive `errors` and `errorCount` during render. Do not put them in state.
4. Resolve one `error` per field: `touched[name] || submitAttempted ? errors[name] : undefined`, then pass that single value to both `validationState` and `validationMessage`.
5. Mark fields touched in `onBlur`; set `submitAttempted` at the top of the submit handler, before checking `errorCount > 0`.
6. When submit fails, render a `MessageBar` summary with `politeness="assertive"` so assistive technology announces the failure, and move focus to the first invalid control.
7. On success, reset `values`, `touched` and `submitAttempted`, and render an `intent="success"` `MessageBar`.

## Patterns

### Synchronous per-field rules

See **Validated sign-up form**: required fields, a pattern rule for email, a length rule for bio, and a checkbox that must be checked. Every rule lives in one `validate` function and every message is rendered by a `Field`.

### Cross-field rules

Rules that compare two fields belong in the same `validate` function: `values.confirm !== values.next` produces `errors.confirm`. Because errors are derived on every render, editing `next` immediately re-validates `confirm` with no extra wiring. See **Change password form**.

### Async rules (uniqueness, availability)

Keep an explicit status machine (`idle | checking | available | taken | unknown`) and debounce the request, cancelling stale responses:

```tsx
React.useEffect(() => {
  const username = value.trim();
  if (username.length < 3) {
    setStatus("idle");
    return;
  }
  let cancelled = false;
  setStatus("checking");
  const timer = window.setTimeout(() => {
    checkAvailability(username)
      .then(available => { if (!cancelled) setStatus(available ? "available" : "taken"); })
      .catch(() => { if (!cancelled) setStatus("unknown"); });
  }, 300);
  return () => { cancelled = true; window.clearTimeout(timer); };
}, [value]);
```

Map the status onto `validationState`: `taken -> "error"`, `unknown -> "warning"`, `available -> "success"`, otherwise `"none"`. Report progress inside the control with the input's `contentAfter` slot (`<Spinner size="extra-tiny" />`) so the layout does not jump while the request is in flight. See **Async username availability field**.

### Reusable validated controls

Wrap `Field` plus a control once and let call sites pass only a message: `<ValidatedTextField label="Email" value={email} error={errors.email} onChange={...} onBlur={...} />`. The wrapper owns the `validationState` / `validationMessage` mapping, so the same visual and ARIA contract is repeated everywhere. The full component is in **Change password form**.

## Accessibility checklist

- Let `Field` wire `aria-labelledby` and `aria-describedby`; add your own only when composing something `Field` does not support.
- Put `noValidate` on the `<form>` so native browser bubbles do not compete with the Fluent messages and block your handler.
- Announce the summary: `MessageBar` with `politeness="assertive"` for errors, `politeness="polite"` for success.
- Never signal with colour alone: the message text and the built-in icon carry the meaning.
- Move focus to the first invalid field after a failed submit so keyboard users are not left hunting for the problem.
- Write specific, actionable messages; `Enter an address like name@example.com.` beats `Invalid input.`

## Pitfalls

See the structured list. The two that bite most often are rendering a message without a matching state (error text that looks like a hint) and keeping a second `errors` state variable that drifts away from `values`.

## Examples

### Validated sign-up form with per-field errors and an error summary

A complete form (Input, Select, Textarea, Checkbox) where a single validate function produces all messages, errors are revealed after onBlur or submit, an assertive MessageBar summarises failures, and the form resets on success.

```tsx
import * as React from "react";
import { Button, Checkbox, Field, Input, MessageBar, Select, Text, Textarea } from "@fluentui/react-components";

type FormValues = {
  fullName: string;
  email: string;
  plan: string;
  bio: string;
  acceptTerms: boolean;
};

type FieldName = keyof FormValues;
type FormErrors = Partial<Record<FieldName, string>>;

const initialValues: FormValues = {
  fullName: "",
  email: "",
  plan: "",
  bio: "",
  acceptTerms: false,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (values.fullName.trim().length === 0) {
    errors.fullName = "Enter your full name.";
  } else if (values.fullName.trim().length < 2) {
    errors.fullName = "Use at least 2 characters.";
  }

  if (values.email.trim().length === 0) {
    errors.email = "Enter your email address.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter an address like name@example.com.";
  }

  if (values.plan.length === 0) {
    errors.plan = "Choose a plan to continue.";
  }

  if (values.bio.length > 200) {
    errors.bio = `Shorten your bio by ${values.bio.length - 200} characters.`;
  }

  if (!values.acceptTerms) {
    errors.acceptTerms = "Accept the terms to create your account.";
  }

  return errors;
}

export const SignUpForm: React.FC = () => {
  const [values, setValues] = React.useState<FormValues>(initialValues);
  const [touched, setTouched] = React.useState<Partial<Record<FieldName, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Errors are derived from values on every render, so they can never drift out of sync.
  const errors = validate(values);
  const errorCount = Object.keys(errors).length;

  const visibleError = (name: FieldName): string | undefined =>
    touched[name] || submitAttempted ? errors[name] : undefined;

  const validationStateFor = (name: FieldName): "error" | "none" =>
    visibleError(name) ? "error" : "none";

  function setField<K extends FieldName>(name: K, value: FormValues[K]) {
    setValues(previous => {
      const next: FormValues = { ...previous };
      next[name] = value;
      return next;
    });
  }

  function markTouched(name: FieldName) {
    setTouched(previous => {
      const next = { ...previous };
      next[name] = true;
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitAttempted(true);

    if (errorCount > 0) {
      // Per-field messages and the summary are visible now; focus the first invalid control here.
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => window.setTimeout(resolve, 600)); // replace with your API call
      setValues(initialValues);
      setTouched({});
      setSubmitAttempted(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "grid", gap: 16, maxWidth: 480 }}>
      {submitAttempted && errorCount > 0 ? (
        <MessageBar intent="error" politeness="assertive">
          <Text weight="semibold">
            {errorCount === 1
              ? "1 field needs your attention."
              : `${errorCount} fields need your attention.`}
          </Text>
        </MessageBar>
      ) : null}

      <Field
        label="Full name"
        required
        validationState={validationStateFor("fullName")}
        validationMessage={visibleError("fullName")}
        hint="Use the name that should appear on your invoices."
      >
        <Input
          value={values.fullName}
          onChange={(ev, data) => setField("fullName", data.value)}
          onBlur={() => markTouched("fullName")}
          autoComplete="name"
        />
      </Field>

      <Field
        label="Email"
        required
        validationState={validationStateFor("email")}
        validationMessage={visibleError("email")}
      >
        <Input
          type="email"
          value={values.email}
          onChange={(ev, data) => setField("email", data.value)}
          onBlur={() => markTouched("email")}
          autoComplete="email"
        />
      </Field>

      <Field
        label="Plan"
        required
        validationState={validationStateFor("plan")}
        validationMessage={visibleError("plan")}
      >
        <Select
          value={values.plan}
          onChange={(ev, data) => setField("plan", data.value)}
          onBlur={() => markTouched("plan")}
        >
          <option value="" disabled>
            Choose a plan
          </option>
          <option value="starter">Starter</option>
          <option value="team">Team</option>
          <option value="enterprise">Enterprise</option>
        </Select>
      </Field>

      <Field
        label="Bio"
        validationState={validationStateFor("bio")}
        validationMessage={visibleError("bio")}
        hint={`${values.bio.length}/200 characters`}
      >
        <Textarea
          value={values.bio}
          resize="vertical"
          onChange={(ev, data) => setField("bio", data.value)}
          onBlur={() => markTouched("bio")}
        />
      </Field>

      <Field
        validationState={validationStateFor("acceptTerms")}
        validationMessage={visibleError("acceptTerms")}
      >
        <Checkbox
          checked={values.acceptTerms}
          label="I accept the terms of service"
          onChange={(ev, data) => setField("acceptTerms", data.checked === true)}
          onBlur={() => markTouched("acceptTerms")}
        />
      </Field>

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Button
          type="button"
          appearance="secondary"
          onClick={() => {
            setValues(initialValues);
            setTouched({});
            setSubmitAttempted(false);
          }}
        >
          Reset
        </Button>
        <Button type="submit" appearance="primary" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </div>
    </form>
  );
};
```

### Async username availability field

A single Field whose validation state is driven by an asynchronous, debounced, cancellable availability check, with a Spinner in the input's contentAfter slot and error/warning/success states for taken, unverified and available results.

```tsx
import * as React from "react";
import { Field, Input, Spinner } from "@fluentui/react-components";

type AvailabilityStatus = "idle" | "checking" | "available" | "taken" | "unknown";

const TAKEN_USERNAMES = new Set(["admin", "support", "fluent", "test"]);

function checkUsernameAvailable(username: string): Promise<boolean> {
  return new Promise(resolve => {
    window.setTimeout(() => resolve(!TAKEN_USERNAMES.has(username.toLowerCase())), 500);
  });
}

export const UsernameField: React.FC = () => {
  const [value, setValue] = React.useState("");
  const [status, setStatus] = React.useState<AvailabilityStatus>("idle");

  const username = value.trim();
  const isTooShort = username.length > 0 && username.length < 3;

  React.useEffect(() => {
    if (username.length < 3) {
      setStatus("idle");
      return;
    }

    let cancelled = false;
    setStatus("checking");

    const timer = window.setTimeout(() => {
      checkUsernameAvailable(username)
        .then(available => {
          if (!cancelled) {
            setStatus(available ? "available" : "taken");
          }
        })
        .catch(() => {
          if (!cancelled) {
            setStatus("unknown");
          }
        });
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [username]);

  const validationState: "error" | "warning" | "success" | "none" =
    isTooShort || status === "taken"
      ? "error"
      : status === "unknown"
        ? "warning"
        : status === "available"
          ? "success"
          : "none";

  const validationMessage = isTooShort
    ? "Use at least 3 characters."
    : status === "taken"
      ? "That username is already taken."
      : status === "unknown"
        ? "We could not check availability. Try again."
        : status === "available"
          ? "This username is available."
          : undefined;

  return (
    <Field
      label="Username"
      required
      validationState={validationState}
      validationMessage={validationMessage}
      hint="Letters, numbers and underscores only."
    >
      <Input
        value={value}
        autoComplete="username"
        onChange={(ev, data) => setValue(data.value.replace(/[^a-zA-Z0-9_]/g, ""))}
        contentAfter={status === "checking" ? <Spinner size="extra-tiny" /> : undefined}
      />
    </Field>
  );
};
```

### Change password form with cross-field validation and a reusable validated field

Shows a typed ValidatedTextField wrapper around Field + Input, cross-field validation (confirm must match the new password), rule ordering for password strength, a success MessageBar after submit, and errors revealed only after blur or submit.

```tsx
import * as React from "react";
import { Button, Field, Input, MessageBar, Text } from "@fluentui/react-components";

type SupportedInputType = "text" | "email" | "password" | "search" | "tel" | "url";

type ValidatedTextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  hint?: string;
  required?: boolean;
  type?: SupportedInputType;
  autoComplete?: string;
};

export const ValidatedTextField: React.FC<ValidatedTextFieldProps> = ({
  label,
  value,
  onChange,
  onBlur,
  error,
  hint,
  required,
  type = "text",
  autoComplete,
}) => (
  <Field
    label={label}
    required={required}
    hint={hint}
    validationState={error ? "error" : "none"}
    validationMessage={error}
  >
    <Input
      type={type}
      value={value}
      autoComplete={autoComplete}
      onChange={(ev, data) => onChange(data.value)}
      onBlur={onBlur}
    />
  </Field>
);

type PasswordValues = {
  current: string;
  next: string;
  confirm: string;
};

type PasswordField = keyof PasswordValues;
type PasswordErrors = Partial<Record<PasswordField, string>>;

function validatePasswords(values: PasswordValues): PasswordErrors {
  const errors: PasswordErrors = {};

  if (values.current.length === 0) {
    errors.current = "Enter your current password.";
  }

  if (values.next.length < 12) {
    errors.next = "Use at least 12 characters.";
  } else if (!/[0-9]/.test(values.next)) {
    errors.next = "Add at least one number.";
  } else if (!/[^A-Za-z0-9]/.test(values.next)) {
    errors.next = "Add at least one symbol.";
  }

  if (values.confirm.length === 0) {
    errors.confirm = "Re-enter the new password.";
  } else if (values.confirm !== values.next) {
    errors.confirm = "Passwords do not match.";
  }

  return errors;
}

export const ChangePasswordForm: React.FC = () => {
  const [values, setValues] = React.useState<PasswordValues>({
    current: "",
    next: "",
    confirm: "",
  });
  const [touched, setTouched] = React.useState<Partial<Record<PasswordField, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  // Cross-field rules are just part of the same derived validation pass.
  const errors = validatePasswords(values);
  const isValid = Object.keys(errors).length === 0;

  const visibleError = (name: PasswordField): string | undefined =>
    touched[name] || submitAttempted ? errors[name] : undefined;

  function setField<K extends PasswordField>(name: K, value: string) {
    setValues(previous => {
      const next: PasswordValues = { ...previous };
      next[name] = value;
      return next;
    });
    setSaved(false);
  }

  function markTouched(name: PasswordField) {
    setTouched(previous => {
      const next = { ...previous };
      next[name] = true;
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitAttempted(true);

    if (!isValid) {
      return;
    }

    await new Promise(resolve => window.setTimeout(resolve, 500)); // replace with your API call
    setSaved(true);
    setValues({ current: "", next: "", confirm: "" });
    setTouched({});
    setSubmitAttempted(false);
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <ValidatedTextField
        label="Current password"
        type="password"
        required
        autoComplete="current-password"
        value={values.current}
        onChange={value => setField("current", value)}
        onBlur={() => markTouched("current")}
        error={visibleError("current")}
      />

      <ValidatedTextField
        label="New password"
        type="password"
        required
        autoComplete="new-password"
        hint="At least 12 characters, with a number and a symbol."
        value={values.next}
        onChange={value => setField("next", value)}
        onBlur={() => markTouched("next")}
        error={visibleError("next")}
      />

      <ValidatedTextField
        label="Confirm new password"
        type="password"
        required
        autoComplete="new-password"
        value={values.confirm}
        onChange={value => setField("confirm", value)}
        onBlur={() => markTouched("confirm")}
        error={visibleError("confirm")}
      />

      {saved ? (
        <MessageBar intent="success" politeness="polite">
          <Text>Your password was updated.</Text>
        </MessageBar>
      ) : null}

      <div>
        <Button type="submit" appearance="primary">
          Change password
        </Button>
      </div>
    </form>
  );
};
```

## Pitfalls

- Rendering validationMessage and validationState from different sources: derive both from the same errors[name] value, otherwise error text appears styled like a hint or an error icon appears with nothing to explain it.
- Showing errors before the user interacts: track a touched map (set in onBlur) and a submitAttempted flag, and only surface errors when one of them is true - otherwise a fresh form looks broken and users are scolded for fields they have not reached yet.
- Storing errors in state next to values: derive errors with a pure validate(values) call on every render. A second errors state variable will eventually show a message for a value the user already corrected.
- Wrapping a group of controls (radio set, checkbox list) in a single Field: Field labels exactly one control, so use one Field per control for individual messages, or group them with your own label element and validate the group as a single field.
- Forgetting to cancel asynchronous checks: an older response can overwrite a newer one or mark a fixed value as taken. Use a cancelled flag plus window.clearTimeout in the effect cleanup, and re-check the value when the promise resolves.
- Omitting noValidate on the form: the browser's native bubbles appear next to Fluent messages and prevent your onSubmit handler from running, so users see two different validation languages.
- Validating on errors that never clear: recompute errors on every value change (as in the examples) so a message disappears as soon as the value becomes valid, instead of waiting for the next blur.
- Silent submit failures: without an assertive MessageBar summary and a focus move to the first invalid control, keyboard and screen reader users get no feedback about why nothing happened.

## Accessibility

Let Field own the accessibility wiring: it renders the label, hint and validation message and passes the corresponding aria-labelledby and aria-describedby values to the wrapped control through context, so the error text is read as the control's description without hand-written ids. Always put noValidate on the <form> so the browser's native validation bubbles do not appear alongside the Fluent messages and block the submit handler. Announce form-level results with MessageBar: politeness="assertive" for the error summary after a failed submit (so screen readers interrupt and read it), politeness="polite" for success confirmation. Do not rely on colour alone - the validation message text plus the built-in error icon carry the meaning. After a failed submit, move focus to the first invalid control; because Field wires attributes through context rather than exposing the generated ids, keep your own refs on the controls for that purpose. Mark required fields with Field's required prop so the label shows the indicator and the control gets required semantics. Keep messages specific about what to fix and where (which field, which rule) rather than generic.

## Components used

- [Button](../../components/button.md)
- [Checkbox](../../components/checkbox.md)
- [Field](../../components/field.md)
- [Input](../../components/input.md)
- [MessageBar](../../components/message-bar.md)
- [Select](../../components/select.md)
- [Spinner](../../components/spinner.md)
- [Text](../../components/text.md)
- [Textarea](../../components/textarea.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
