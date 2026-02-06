# Form Library Integration

> **File**: 03-patterns/forms/03-form-libraries.md
> **FluentUI Version**: 9.x

## Overview

This guide covers integrating FluentUI v9 with popular form libraries including React Hook Form and Formik. These libraries simplify form state management, validation, and submission handling.

## React Hook Form Integration

React Hook Form is a performant, flexible library with minimal re-renders.

### Installation

```bash
npm install react-hook-form
# or
yarn add react-hook-form
```

### Basic Integration

```tsx
import { useForm, Controller } from 'react-hook-form';
import {
  Field,
  Input,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

interface FormData {
  email: string;
  password: string;
}

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const ReactHookFormBasic = () => {
  const styles = useStyles();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={control}
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Invalid email format',
          },
        }}
        render={({ field, fieldState }) => (
          <Field
            label="Email"
            required
            validationState={fieldState.error ? 'error' : 'none'}
            validationMessage={fieldState.error?.message}
          >
            <Input
              {...field}
              type="email"
              onChange={(e, data) => field.onChange(data.value)}
            />
          </Field>
        )}
      />

      <Controller
        name="password"
        control={control}
        rules={{
          required: 'Password is required',
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters',
          },
        }}
        render={({ field, fieldState }) => (
          <Field
            label="Password"
            required
            validationState={fieldState.error ? 'error' : 'none'}
            validationMessage={fieldState.error?.message}
          >
            <Input
              {...field}
              type="password"
              onChange={(e, data) => field.onChange(data.value)}
            />
          </Field>
        )}
      />

      <Button type="submit" appearance="primary">
        Sign In
      </Button>
    </form>
  );
};
```

### Custom FluentUI Field Wrapper

Create a reusable wrapper component for cleaner code:

```tsx
import { Controller, Control, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import { Field, Input, FieldProps, InputProps } from '@fluentui/react-components';

interface FluentFieldProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues>;
  label: string;
  required?: boolean;
  type?: InputProps['type'];
  placeholder?: string;
  hint?: string;
}

export function FluentField<TFieldValues extends FieldValues>({
  name,
  control,
  rules,
  label,
  required,
  type = 'text',
  placeholder,
  hint,
}: FluentFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <Field
          label={label}
          required={required}
          hint={hint}
          validationState={fieldState.error ? 'error' : 'none'}
          validationMessage={fieldState.error?.message}
        >
          <Input
            {...field}
            type={type}
            placeholder={placeholder}
            onChange={(e, data) => field.onChange(data.value)}
          />
        </Field>
      )}
    />
  );
}

// Usage
export const FormWithWrapper = () => {
  const { control, handleSubmit } = useForm<FormData>();

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <FluentField
        name="email"
        control={control}
        label="Email"
        required
        type="email"
        rules={{ required: 'Email is required' }}
      />
      <FluentField
        name="password"
        control={control}
        label="Password"
        required
        type="password"
        rules={{ required: 'Password is required' }}
      />
      <Button type="submit" appearance="primary">
        Submit
      </Button>
    </form>
  );
};
```

### Select and Combobox Integration

```tsx
import { useForm, Controller } from 'react-hook-form';
import {
  Field,
  Select,
  Combobox,
  Option,
  Button,
} from '@fluentui/react-components';

interface FormData {
  country: string;
  language: string;
}

export const SelectComboboxForm = () => {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      country: '',
      language: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(console.log)}>
      {/* Native Select */}
      <Controller
        name="country"
        control={control}
        rules={{ required: 'Please select a country' }}
        render={({ field, fieldState }) => (
          <Field
            label="Country"
            required
            validationState={fieldState.error ? 'error' : 'none'}
            validationMessage={fieldState.error?.message}
          >
            <Select
              {...field}
              onChange={(e, data) => field.onChange(data.value)}
            >
              <option value="">Select a country</option>
              <option value="us">United States</option>
              <option value="uk">United Kingdom</option>
              <option value="ca">Canada</option>
            </Select>
          </Field>
        )}
      />

      {/* Combobox */}
      <Controller
        name="language"
        control={control}
        rules={{ required: 'Please select a language' }}
        render={({ field, fieldState }) => (
          <Field
            label="Language"
            required
            validationState={fieldState.error ? 'error' : 'none'}
            validationMessage={fieldState.error?.message}
          >
            <Combobox
              {...field}
              selectedOptions={field.value ? [field.value] : []}
              onOptionSelect={(e, data) => field.onChange(data.optionValue)}
              placeholder="Select or type"
            >
              <Option value="en">English</Option>
              <Option value="es">Spanish</Option>
              <Option value="fr">French</Option>
            </Combobox>
          </Field>
        )}
      />

      <Button type="submit" appearance="primary">
        Submit
      </Button>
    </form>
  );
};
```

### Checkbox and Switch Integration

```tsx
import { useForm, Controller } from 'react-hook-form';
import { Field, Checkbox, Switch, Button } from '@fluentui/react-components';

interface FormData {
  terms: boolean;
  marketing: boolean;
  notifications: boolean;
}

export const CheckboxSwitchForm = () => {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      terms: false,
      marketing: false,
      notifications: true,
    },
  });

  return (
    <form onSubmit={handleSubmit(console.log)}>
      {/* Checkbox */}
      <Controller
        name="terms"
        control={control}
        rules={{ required: 'You must accept the terms' }}
        render={({ field, fieldState }) => (
          <Field
            validationState={fieldState.error ? 'error' : 'none'}
            validationMessage={fieldState.error?.message}
          >
            <Checkbox
              checked={field.value}
              onChange={(e, data) => field.onChange(data.checked)}
              label="I accept the terms and conditions"
            />
          </Field>
        )}
      />

      {/* Switch */}
      <Controller
        name="notifications"
        control={control}
        render={({ field }) => (
          <Field>
            <Switch
              checked={field.value}
              onChange={(e, data) => field.onChange(data.checked)}
              label="Enable notifications"
            />
          </Field>
        )}
      />

      <Button type="submit" appearance="primary">
        Save
      </Button>
    </form>
  );
};
```

### Radio Group Integration

```tsx
import { useForm, Controller } from 'react-hook-form';
import { Field, Radio, RadioGroup, Button } from '@fluentui/react-components';

interface FormData {
  plan: string;
}

export const RadioGroupForm = () => {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      plan: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <Controller
        name="plan"
        control={control}
        rules={{ required: 'Please select a plan' }}
        render={({ field, fieldState }) => (
          <Field
            label="Select Plan"
            required
            validationState={fieldState.error ? 'error' : 'none'}
            validationMessage={fieldState.error?.message}
          >
            <RadioGroup
              value={field.value}
              onChange={(e, data) => field.onChange(data.value)}
            >
              <Radio value="free" label="Free - $0/month" />
              <Radio value="pro" label="Pro - $9.99/month" />
              <Radio value="enterprise" label="Enterprise - Contact us" />
            </RadioGroup>
          </Field>
        )}
      />

      <Button type="submit" appearance="primary">
        Continue
      </Button>
    </form>
  );
};
```

### React Hook Form with Zod Validation

```tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Field, Input, Button, makeStyles, tokens } from '@fluentui/react-components';

// Define schema with Zod
const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const ZodValidationForm = () => {
  const styles = useStyles();
  const {
    control,
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Valid data:', data);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <Field
            label="Email"
            required
            validationState={fieldState.error ? 'error' : 'none'}
            validationMessage={fieldState.error?.message}
          >
            <Input
              {...field}
              type="email"
              onChange={(e, data) => field.onChange(data.value)}
            />
          </Field>
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <Field
            label="Password"
            required
            validationState={fieldState.error ? 'error' : 'none'}
            validationMessage={fieldState.error?.message}
          >
            <Input
              {...field}
              type="password"
              onChange={(e, data) => field.onChange(data.value)}
            />
          </Field>
        )}
      />

      <Controller
        name="confirmPassword"
        control={control}
        render={({ field, fieldState }) => (
          <Field
            label="Confirm Password"
            required
            validationState={fieldState.error ? 'error' : 'none'}
            validationMessage={fieldState.error?.message}
          >
            <Input
              {...field}
              type="password"
              onChange={(e, data) => field.onChange(data.value)}
            />
          </Field>
        )}
      />

      <Button type="submit" appearance="primary">
        Register
      </Button>
    </form>
  );
};
```

## Formik Integration

Formik is a popular form library with built-in validation support.

### Installation

```bash
npm install formik yup
# or
yarn add formik yup
```

### Basic Formik Integration

```tsx
import { Formik, Form, Field as FormikField, useField } from 'formik';
import * as Yup from 'yup';
import {
  Field,
  Input,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

interface FormValues {
  email: string;
  password: string;
}

// Custom FluentUI Input component for Formik
interface FluentInputProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}

const FluentInput = ({ name, label, type = 'text', required }: FluentInputProps) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <Field
      label={label}
      required={required}
      validationState={hasError ? 'error' : 'none'}
      validationMessage={hasError ? meta.error : undefined}
    >
      <Input
        {...field}
        type={type}
        onChange={(e, data) => {
          // Manually trigger Formik's onChange
          const event = { target: { name, value: data.value } };
          field.onChange(event);
        }}
      />
    </Field>
  );
};

export const FormikBasic = () => {
  const styles = useStyles();

  const initialValues: FormValues = {
    email: '',
    password: '',
  };

  const handleSubmit = (values: FormValues) => {
    console.log('Form submitted:', values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={styles.form}>
          <FluentInput name="email" label="Email" type="email" required />
          <FluentInput name="password" label="Password" type="password" required />
          
          <Button type="submit" appearance="primary" disabled={isSubmitting}>
            Sign In
          </Button>
        </Form>
      )}
    </Formik>
  );
};
```

### Formik with Select and Checkbox

```tsx
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import {
  Field,
  Select,
  Checkbox,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

// FluentUI Select for Formik
const FluentSelect = ({ name, label, children, required }: any) => {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <Field
      label={label}
      required={required}
      validationState={hasError ? 'error' : 'none'}
      validationMessage={hasError ? meta.error : undefined}
    >
      <Select
        value={field.value}
        onChange={(e, data) => helpers.setValue(data.value)}
        onBlur={() => helpers.setTouched(true)}
      >
        {children}
      </Select>
    </Field>
  );
};

// FluentUI Checkbox for Formik
const FluentCheckbox = ({ name, label }: any) => {
  const [field, meta, helpers] = useField({ name, type: 'checkbox' });
  const hasError = meta.touched && meta.error;

  return (
    <Field
      validationState={hasError ? 'error' : 'none'}
      validationMessage={hasError ? meta.error : undefined}
    >
      <Checkbox
        checked={field.value}
        onChange={(e, data) => helpers.setValue(data.checked)}
        label={label}
      />
    </Field>
  );
};

const schema = Yup.object({
  country: Yup.string().required('Please select a country'),
  terms: Yup.boolean().oneOf([true], 'You must accept the terms'),
});

export const FormikSelectCheckbox = () => {
  const styles = useStyles();

  return (
    <Formik
      initialValues={{ country: '', terms: false }}
      validationSchema={schema}
      onSubmit={console.log}
    >
      <Form className={styles.form}>
        <FluentSelect name="country" label="Country" required>
          <option value="">Select a country</option>
          <option value="us">United States</option>
          <option value="uk">United Kingdom</option>
          <option value="ca">Canada</option>
        </FluentSelect>

        <FluentCheckbox
          name="terms"
          label="I accept the terms and conditions"
        />

        <Button type="submit" appearance="primary">
          Submit
        </Button>
      </Form>
    </Formik>
  );
};
```

### Formik with Async Submission

```tsx
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import {
  Field,
  Input,
  Button,
  Spinner,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
});

const FluentInput = ({ name, label, type = 'text', required, disabled }: any) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <Field
      label={label}
      required={required}
      validationState={hasError ? 'error' : 'none'}
      validationMessage={hasError ? meta.error : undefined}
    >
      <Input
        {...field}
        type={type}
        disabled={disabled}
        onChange={(e, data) => {
          const event = { target: { name, value: data.value } };
          field.onChange(event);
        }}
      />
    </Field>
  );
};

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(8, 'Min 8 characters').required('Required'),
});

// Simulated API call
const submitToAPI = async (values: { email: string; password: string }) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('Submitted:', values);
};

export const FormikAsyncSubmit = () => {
  const styles = useStyles();

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await submitToAPI(values);
          alert('Success!');
        } catch (error) {
          alert('Failed to submit');
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className={styles.form}>
          <FluentInput
            name="email"
            label="Email"
            type="email"
            required
            disabled={isSubmitting}
          />
          <FluentInput
            name="password"
            label="Password"
            type="password"
            required
            disabled={isSubmitting}
          />

          <Button
            type="submit"
            appearance="primary"
            disabled={isSubmitting}
            icon={isSubmitting ? <Spinner size="tiny" /> : undefined}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </Form>
      )}
    </Formik>
  );
};
```

## Comparison: When to Use Which Library

| Feature | React Hook Form | Formik |
|---------|----------------|--------|
| Bundle Size | ~9KB | ~15KB |
| Re-renders | Minimal (uncontrolled) | More (controlled) |
| TypeScript | Excellent | Good |
| Learning Curve | Moderate | Easy |
| Validation | Zod/Yup/custom | Yup/custom |
| Best For | Performance-critical | Simple forms |

### React Hook Form Advantages

- Minimal re-renders using uncontrolled components
- Smaller bundle size
- Better performance with large forms
- Easy integration with Zod for schema validation

### Formik Advantages

- Simpler mental model
- Built-in form state handling
- More intuitive for beginners
- Larger community and more examples

## Best Practices

1. **Create reusable field components** - Wrap FluentUI components once and reuse
2. **Use schema validation** - Zod or Yup provide type-safe validation
3. **Handle async validation** - Use debouncing for server-side checks
4. **Disable form during submission** - Prevent double submissions
5. **Show loading states** - Use Spinner in buttons during submission
6. **Focus first error** - Guide users to fields needing attention

## Related Documentation

- [01-basic-forms.md](01-basic-forms.md) - Basic form structure
- [02-validation.md](02-validation.md) - Client-side validation
- [06-submission.md](06-submission.md) - Form submission handling