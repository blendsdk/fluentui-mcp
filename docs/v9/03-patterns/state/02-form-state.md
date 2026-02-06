# Form State Management

> **Module**: 03-patterns/state
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-06-02
> **Prerequisites**: [Controlled & Uncontrolled](01-controlled-uncontrolled.md)

## Overview

Managing state across multiple form fields requires more structure than individual controlled components. This guide covers patterns for multi-field forms — from simple `useState` objects to `useReducer` and custom hooks.

For form library integration (React Hook Form, Formik), see [Form Libraries](../forms/03-form-libraries.md).

---

## Pattern 1: State Object

The simplest approach for forms with a few fields — a single `useState` with an object:

```tsx
import * as React from 'react';
import {
  Input,
  Field,
  Select,
  Checkbox,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  receiveUpdates: boolean;
}

const initialFormData: ProfileFormData = {
  firstName: '',
  lastName: '',
  email: '',
  role: 'viewer',
  receiveUpdates: false,
};

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

function ProfileForm() {
  const styles = useStyles();
  const [formData, setFormData] = React.useState<ProfileFormData>(initialFormData);

  /** Generic updater: updates one field by key */
  const updateField = <K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted:', formData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Field label="First name" required>
        <Input
          value={formData.firstName}
          onChange={(e, data) => updateField('firstName', data.value)}
        />
      </Field>

      <Field label="Last name" required>
        <Input
          value={formData.lastName}
          onChange={(e, data) => updateField('lastName', data.value)}
        />
      </Field>

      <Field label="Email" required>
        <Input
          type="email"
          value={formData.email}
          onChange={(e, data) => updateField('email', data.value)}
        />
      </Field>

      <Field label="Role">
        <Select
          value={formData.role}
          onChange={(e, data) => updateField('role', data.value)}
        >
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </Select>
      </Field>

      <Checkbox
        checked={formData.receiveUpdates}
        onChange={(e, data) => updateField('receiveUpdates', data.checked as boolean)}
        label="Receive email updates"
      />

      <Button type="submit" appearance="primary">Save Profile</Button>
    </form>
  );
}
```

---

## Pattern 2: useReducer for Complex Forms

When forms have many fields, conditional logic, or validation state, `useReducer` provides clearer state transitions:

```tsx
import * as React from 'react';
import {
  Input,
  Field,
  Button,
  MessageBar,
  MessageBarBody,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

// ── Types ──────────────────────────────────────────────────────

interface FormState {
  values: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  errors: Record<string, string>;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

type FormAction =
  | { type: 'SET_FIELD'; field: string; value: string }
  | { type: 'SET_ERROR'; field: string; error: string }
  | { type: 'CLEAR_ERROR'; field: string }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; errors: Record<string, string> }
  | { type: 'RESET' };

// ── Reducer ────────────────────────────────────────────────────

const initialState: FormState = {
  values: { username: '', email: '', password: '', confirmPassword: '' },
  errors: {},
  isSubmitting: false,
  isSubmitted: false,
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
        // Clear field error when user starts typing
        errors: { ...state.errors, [action.field]: '' },
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error },
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: '' },
      };

    case 'SUBMIT_START':
      return { ...state, isSubmitting: true, errors: {} };

    case 'SUBMIT_SUCCESS':
      return { ...state, isSubmitting: false, isSubmitted: true };

    case 'SUBMIT_ERROR':
      return { ...state, isSubmitting: false, errors: action.errors };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

// ── Component ──────────────────────────────────────────────────

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

function RegistrationForm() {
  const styles = useStyles();
  const [state, dispatch] = React.useReducer(formReducer, initialState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SUBMIT_START' });

    // Validate
    const errors: Record<string, string> = {};
    if (!state.values.username) errors.username = 'Username is required';
    if (!state.values.email) errors.email = 'Email is required';
    if (state.values.password.length < 8) errors.password = 'Minimum 8 characters';
    if (state.values.password !== state.values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.values(errors).some(Boolean)) {
      dispatch({ type: 'SUBMIT_ERROR', errors });
      return;
    }

    dispatch({ type: 'SUBMIT_SUCCESS' });
  };

  if (state.isSubmitted) {
    return (
      <MessageBar intent="success">
        <MessageBarBody>Registration successful!</MessageBarBody>
      </MessageBar>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Field
        label="Username"
        required
        validationMessage={state.errors.username}
        validationState={state.errors.username ? 'error' : 'none'}
      >
        <Input
          value={state.values.username}
          onChange={(e, data) =>
            dispatch({ type: 'SET_FIELD', field: 'username', value: data.value })
          }
        />
      </Field>

      <Field
        label="Email"
        required
        validationMessage={state.errors.email}
        validationState={state.errors.email ? 'error' : 'none'}
      >
        <Input
          type="email"
          value={state.values.email}
          onChange={(e, data) =>
            dispatch({ type: 'SET_FIELD', field: 'email', value: data.value })
          }
        />
      </Field>

      <Field
        label="Password"
        required
        validationMessage={state.errors.password}
        validationState={state.errors.password ? 'error' : 'none'}
      >
        <Input
          type="password"
          value={state.values.password}
          onChange={(e, data) =>
            dispatch({ type: 'SET_FIELD', field: 'password', value: data.value })
          }
        />
      </Field>

      <Field
        label="Confirm password"
        required
        validationMessage={state.errors.confirmPassword}
        validationState={state.errors.confirmPassword ? 'error' : 'none'}
      >
        <Input
          type="password"
          value={state.values.confirmPassword}
          onChange={(e, data) =>
            dispatch({ type: 'SET_FIELD', field: 'confirmPassword', value: data.value })
          }
        />
      </Field>

      <Button
        type="submit"
        appearance="primary"
        disabled={state.isSubmitting}
      >
        {state.isSubmitting ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
}
```

---

## Pattern 3: Custom Form Hook

Extract form logic into a reusable hook:

```tsx
// hooks/useForm.ts
import * as React from 'react';

interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => void | Promise<void>;
}

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  /** Update a single field value */
  setField: <K extends keyof T>(field: K, value: T[K]) => void;
  /** Handle form submission */
  handleSubmit: (e: React.FormEvent) => void;
  /** Reset form to initial values */
  reset: () => void;
  /** Get Field validation props for a field */
  getFieldProps: (field: keyof T) => {
    validationMessage: string | undefined;
    validationState: 'error' | 'none';
  };
}

/**
 * Lightweight form state hook for FluentUI v9 forms.
 *
 * @example
 * ```tsx
 * const form = useForm({
 *   initialValues: { name: '', email: '' },
 *   validate: (v) => ({ name: v.name ? undefined : 'Required' }),
 *   onSubmit: (values) => api.createUser(values),
 * });
 *
 * <Field label="Name" {...form.getFieldProps('name')}>
 *   <Input value={form.values.name} onChange={(e, d) => form.setField('name', d.value)} />
 * </Field>
 * ```
 */
export function useForm<T extends Record<string, unknown>>(
  options: UseFormOptions<T>,
): UseFormReturn<T> {
  const { initialValues, validate, onSubmit } = options;

  const [values, setValues] = React.useState<T>(initialValues);
  const [errors, setErrors] = React.useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const setField = React.useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user types
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Run validation if provided
      if (validate) {
        const validationErrors = validate(values);
        const hasErrors = Object.values(validationErrors).some(Boolean);
        if (hasErrors) {
          setErrors(validationErrors);
          return;
        }
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit],
  );

  const reset = React.useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const getFieldProps = React.useCallback(
    (field: keyof T) => ({
      validationMessage: errors[field] || undefined,
      validationState: errors[field] ? ('error' as const) : ('none' as const),
    }),
    [errors],
  );

  return { values, errors, isSubmitting, setField, handleSubmit, reset, getFieldProps };
}
```

### Using the Custom Hook

```tsx
import { Input, Field, Button, makeStyles, tokens } from '@fluentui/react-components';
import { useForm } from '../hooks/useForm';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

function ContactForm() {
  const styles = useStyles();

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      message: '',
    },
    validate: (values) => ({
      name: values.name ? undefined : 'Name is required',
      email: values.email.includes('@') ? undefined : 'Invalid email',
      message: (values.message as string).length > 10 ? undefined : 'Minimum 10 characters',
    }),
    onSubmit: async (values) => {
      await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(values),
      });
    },
  });

  return (
    <form className={styles.form} onSubmit={form.handleSubmit}>
      <Field label="Name" required {...form.getFieldProps('name')}>
        <Input
          value={form.values.name as string}
          onChange={(e, data) => form.setField('name', data.value)}
        />
      </Field>

      <Field label="Email" required {...form.getFieldProps('email')}>
        <Input
          type="email"
          value={form.values.email as string}
          onChange={(e, data) => form.setField('email', data.value)}
        />
      </Field>

      <Field label="Message" required {...form.getFieldProps('message')}>
        <Input
          value={form.values.message as string}
          onChange={(e, data) => form.setField('message', data.value)}
        />
      </Field>

      <Button type="submit" appearance="primary" disabled={form.isSubmitting}>
        {form.isSubmitting ? 'Sending...' : 'Send'}
      </Button>
    </form>
  );
}
```

---

## Dirty Tracking & Reset

Track which fields have been modified to enable "discard changes" functionality:

```tsx
import * as React from 'react';

/**
 * Tracks whether form values have changed from their initial state.
 */
function useFormDirty<T extends Record<string, unknown>>(
  values: T,
  initialValues: T,
): { isDirty: boolean; dirtyFields: Set<keyof T> } {
  const dirtyFields = React.useMemo(() => {
    const dirty = new Set<keyof T>();
    for (const key of Object.keys(values) as Array<keyof T>) {
      if (values[key] !== initialValues[key]) {
        dirty.add(key);
      }
    }
    return dirty;
  }, [values, initialValues]);

  return {
    isDirty: dirtyFields.size > 0,
    dirtyFields,
  };
}

// Usage:
// const { isDirty } = useFormDirty(formData, initialFormData);
// <Button disabled={!isDirty}>Save</Button>
```

---

## Best Practices

### ✅ Do

- **Use a generic `updateField` helper** — Avoids one `onChange` handler per field
- **Clear field errors on change** — Give immediate feedback that the user is fixing the issue
- **Disable submit while submitting** — Prevent double submissions
- **Track dirty state** — Only enable save when changes exist

### ❌ Don't

- **Don't store derived state** — Compute validation results, don't store them separately
- **Don't use separate `useState` per field** — Leads to inconsistent updates in complex forms
- **Don't validate on every keystroke** — Use `onBlur` or submit-time validation for expensive checks

---

## Related Documentation

- [Controlled & Uncontrolled](01-controlled-uncontrolled.md) — Single-component state modes
- [Context Patterns](03-context-patterns.md) — Sharing state across components
- [Form Libraries](../forms/03-form-libraries.md) — React Hook Form and Formik integration
- [Validation Patterns](../forms/02-validation.md) — Client-side validation strategies
