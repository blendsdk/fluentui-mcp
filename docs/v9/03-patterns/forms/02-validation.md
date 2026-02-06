# Form Validation Patterns

> **File**: 03-patterns/forms/02-validation.md
> **FluentUI Version**: 9.x

## Overview

This guide covers client-side form validation patterns with FluentUI v9, including real-time validation, custom validators, and proper error handling.

## Validation States

FluentUI v9 Field component supports four validation states:

```tsx
type ValidationState = 'error' | 'warning' | 'success' | 'none';
```

### Visual Examples

```tsx
import { Field, Input } from '@fluentui/react-components';

// Error state - validation failed
<Field
  label="Email"
  validationState="error"
  validationMessage="Please enter a valid email address"
>
  <Input type="email" value="invalid-email" />
</Field>

// Warning state - valid but with concerns
<Field
  label="Password"
  validationState="warning"
  validationMessage="Password is weak. Consider adding numbers and symbols."
>
  <Input type="password" value="password123" />
</Field>

// Success state - validation passed
<Field
  label="Username"
  validationState="success"
  validationMessage="Username is available"
>
  <Input value="john_doe" />
</Field>

// None/default state - no validation message
<Field label="Optional Field" validationState="none">
  <Input />
</Field>
```

## Validation Timing Strategies

### Validate on Blur

Show validation errors after user leaves the field - best for most cases:

```tsx
import { useState } from 'react';
import { Field, Input } from '@fluentui/react-components';

interface FieldState {
  value: string;
  touched: boolean;
  error: string | null;
}

const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const ValidateOnBlur = () => {
  const [field, setField] = useState<FieldState>({
    value: '',
    touched: false,
    error: null,
  });

  const handleChange = (e: any, data: { value: string }) => {
    setField(prev => ({
      ...prev,
      value: data.value,
      // Clear error when user starts typing
      error: prev.touched ? validateEmail(data.value) : null,
    }));
  };

  const handleBlur = () => {
    setField(prev => ({
      ...prev,
      touched: true,
      error: validateEmail(prev.value),
    }));
  };

  return (
    <Field
      label="Email"
      required
      validationState={field.touched && field.error ? 'error' : 'none'}
      validationMessage={field.touched ? field.error : undefined}
    >
      <Input
        type="email"
        value={field.value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </Field>
  );
};
```

### Validate on Change (Real-time)

Provide immediate feedback as user types:

```tsx
import { useState } from 'react';
import { Field, Input } from '@fluentui/react-components';

const validatePassword = (password: string) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*]/.test(password),
  };
  
  const passed = Object.values(checks).filter(Boolean).length;
  
  if (passed === 5) return { state: 'success' as const, message: 'Strong password!' };
  if (passed >= 3) return { state: 'warning' as const, message: 'Password could be stronger' };
  return { state: 'error' as const, message: 'Password is too weak' };
};

export const ValidateOnChange = () => {
  const [password, setPassword] = useState('');
  const validation = password ? validatePassword(password) : null;

  return (
    <Field
      label="Password"
      required
      validationState={validation?.state || 'none'}
      validationMessage={validation?.message}
    >
      <Input
        type="password"
        value={password}
        onChange={(e, data) => setPassword(data.value)}
      />
    </Field>
  );
};
```

### Validate on Submit

Wait until form submission to show all errors:

```tsx
import { useState, FormEvent } from 'react';
import { Field, Input, Button, makeStyles, tokens } from '@fluentui/react-components';

interface FormData {
  name: string;
  email: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

const validateForm = (data: FormData): FormErrors => {
  const errors: FormErrors = {};
  
  if (!data.name.trim()) {
    errors.name = 'Name is required';
  }
  
  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format';
  }
  
  return errors;
};

export const ValidateOnSubmit = () => {
  const styles = useStyles();
  const [formData, setFormData] = useState<FormData>({ name: '', email: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, submit
      console.log('Submitting:', formData);
    }
  };

  const handleChange = (field: keyof FormData) => (e: any, data: { value: string }) => {
    setFormData(prev => ({ ...prev, [field]: data.value }));
    // Clear error for this field when user types (after initial submit)
    if (submitted) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Field
        label="Name"
        required
        validationState={errors.name ? 'error' : 'none'}
        validationMessage={errors.name}
      >
        <Input
          value={formData.name}
          onChange={handleChange('name')}
        />
      </Field>
      
      <Field
        label="Email"
        required
        validationState={errors.email ? 'error' : 'none'}
        validationMessage={errors.email}
      >
        <Input
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
        />
      </Field>
      
      <Button type="submit" appearance="primary">
        Submit
      </Button>
    </form>
  );
};
```

## Common Validators

### Email Validator

```tsx
const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
};
```

### Password Strength Validator

```tsx
interface PasswordValidation {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  errors: string[];
}

const validatePassword = (password: string): PasswordValidation => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain an uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain a lowercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain a number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain a special character');
  }
  
  const strength = errors.length === 0 ? 'strong' :
                   errors.length <= 2 ? 'medium' : 'weak';
  
  return {
    isValid: errors.length === 0,
    strength,
    errors,
  };
};
```

### Required Field Validator

```tsx
const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || !value.trim()) {
    return `${fieldName} is required`;
  }
  return null;
};
```

### Length Validator

```tsx
interface LengthOptions {
  min?: number;
  max?: number;
  fieldName: string;
}

const validateLength = (value: string, options: LengthOptions): string | null => {
  const { min, max, fieldName } = options;
  
  if (min !== undefined && value.length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  
  if (max !== undefined && value.length > max) {
    return `${fieldName} must be no more than ${max} characters`;
  }
  
  return null;
};
```

### Phone Number Validator

```tsx
const validatePhone = (phone: string): string | null => {
  if (!phone) return null; // Optional field
  
  // Remove common formatting characters
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  
  // Check for valid phone format (basic US/international)
  if (!/^\+?\d{10,15}$/.test(cleaned)) {
    return 'Please enter a valid phone number';
  }
  
  return null;
};
```

### URL Validator

```tsx
const validateUrl = (url: string): string | null => {
  if (!url) return null; // Optional field
  
  try {
    new URL(url);
    return null;
  } catch {
    return 'Please enter a valid URL (e.g., https://example.com)';
  }
};
```

## Custom Validation Hook

Create a reusable validation hook:

```tsx
import { useState, useCallback } from 'react';

type Validator<T> = (value: T) => string | null;

interface UseFieldValidationOptions<T> {
  initialValue: T;
  validators: Validator<T>[];
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

interface FieldValidation<T> {
  value: T;
  error: string | null;
  touched: boolean;
  isValid: boolean;
  onChange: (value: T) => void;
  onBlur: () => void;
  validate: () => boolean;
  reset: () => void;
}

export function useFieldValidation<T>({
  initialValue,
  validators,
  validateOnChange = false,
  validateOnBlur = true,
}: UseFieldValidationOptions<T>): FieldValidation<T> {
  const [value, setValue] = useState<T>(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const runValidation = useCallback((val: T): string | null => {
    for (const validator of validators) {
      const result = validator(val);
      if (result) return result;
    }
    return null;
  }, [validators]);

  const onChange = useCallback((newValue: T) => {
    setValue(newValue);
    if (validateOnChange || touched) {
      setError(runValidation(newValue));
    }
  }, [validateOnChange, touched, runValidation]);

  const onBlur = useCallback(() => {
    setTouched(true);
    if (validateOnBlur) {
      setError(runValidation(value));
    }
  }, [validateOnBlur, value, runValidation]);

  const validate = useCallback((): boolean => {
    const validationError = runValidation(value);
    setError(validationError);
    setTouched(true);
    return validationError === null;
  }, [value, runValidation]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
    setTouched(false);
  }, [initialValue]);

  return {
    value,
    error,
    touched,
    isValid: error === null,
    onChange,
    onBlur,
    validate,
    reset,
  };
}

// Usage example
export const ValidationHookExample = () => {
  const email = useFieldValidation({
    initialValue: '',
    validators: [
      (val) => !val ? 'Email is required' : null,
      (val) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? 'Invalid email' : null,
    ],
  });

  return (
    <Field
      label="Email"
      required
      validationState={email.touched && email.error ? 'error' : 'none'}
      validationMessage={email.touched ? email.error : undefined}
    >
      <Input
        value={email.value}
        onChange={(e, data) => email.onChange(data.value)}
        onBlur={email.onBlur}
      />
    </Field>
  );
};
```

## Form-Level Validation

### Complete Form Validation

```tsx
import { useState } from 'react';
import { Field, Input, Button, makeStyles, tokens } from '@fluentui/react-components';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

// Validation rules
const validators: Record<keyof FormData, (value: string, data: FormData) => string | null> = {
  firstName: (value) => !value.trim() ? 'First name is required' : null,
  lastName: (value) => !value.trim() ? 'Last name is required' : null,
  email: (value) => {
    if (!value) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
    return null;
  },
  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    return null;
  },
  confirmPassword: (value, data) => {
    if (!value) return 'Please confirm your password';
    if (value !== data.password) return 'Passwords do not match';
    return null;
  },
};

export const FormLevelValidation = () => {
  const styles = useStyles();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: keyof FormData, value: string): string | null => {
    return validators[field](value, formData);
  };

  const validateAllFields = (): boolean => {
    const newErrors: FormErrors = {};
    
    (Object.keys(formData) as (keyof FormData)[]).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    
    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData) => (e: any, data: { value: string }) => {
    const newFormData = { ...formData, [field]: data.value };
    setFormData(newFormData);
    
    // Re-validate on change if field was touched
    if (touched[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: validators[field](data.value, newFormData) || undefined,
      }));
    }
  };

  const handleBlur = (field: keyof FormData) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(prev => ({
      ...prev,
      [field]: validateField(field, formData[field]) || undefined,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateAllFields()) {
      console.log('Form is valid, submitting:', formData);
    }
  };

  const getFieldProps = (field: keyof FormData) => ({
    validationState: (touched[field] && errors[field] ? 'error' : 'none') as 'error' | 'none',
    validationMessage: touched[field] ? errors[field] : undefined,
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Field label="First Name" required {...getFieldProps('firstName')}>
        <Input
          value={formData.firstName}
          onChange={handleChange('firstName')}
          onBlur={handleBlur('firstName')}
        />
      </Field>

      <Field label="Last Name" required {...getFieldProps('lastName')}>
        <Input
          value={formData.lastName}
          onChange={handleChange('lastName')}
          onBlur={handleBlur('lastName')}
        />
      </Field>

      <Field label="Email" required {...getFieldProps('email')}>
        <Input
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          onBlur={handleBlur('email')}
        />
      </Field>

      <Field label="Password" required {...getFieldProps('password')}>
        <Input
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          onBlur={handleBlur('password')}
        />
      </Field>

      <Field label="Confirm Password" required {...getFieldProps('confirmPassword')}>
        <Input
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          onBlur={handleBlur('confirmPassword')}
        />
      </Field>

      <Button type="submit" appearance="primary">
        Register
      </Button>
    </form>
  );
};
```

## Async Validation

### Username Availability Check

```tsx
import { useState, useEffect, useRef } from 'react';
import { Field, Input, Spinner } from '@fluentui/react-components';

// Simulated API call
const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  const takenUsernames = ['admin', 'user', 'test'];
  return !takenUsernames.includes(username.toLowerCase());
};

export const AsyncValidation = () => {
  const [username, setUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Clear previous timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Reset state if empty
    if (!username.trim()) {
      setIsAvailable(null);
      setError(null);
      setIsChecking(false);
      return;
    }

    // Basic validation first
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      setIsAvailable(null);
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      setIsAvailable(null);
      return;
    }

    // Debounce async check
    setIsChecking(true);
    setError(null);
    
    debounceRef.current = setTimeout(async () => {
      try {
        const available = await checkUsernameAvailability(username);
        setIsAvailable(available);
        setError(available ? null : 'Username is already taken');
      } catch {
        setError('Failed to check availability');
      } finally {
        setIsChecking(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [username]);

  const getValidationState = () => {
    if (isChecking) return 'none';
    if (error) return 'error';
    if (isAvailable) return 'success';
    return 'none';
  };

  const getMessage = () => {
    if (isChecking) return 'Checking availability...';
    if (error) return error;
    if (isAvailable) return 'Username is available!';
    return undefined;
  };

  return (
    <Field
      label="Username"
      required
      validationState={getValidationState()}
      validationMessage={getMessage()}
    >
      <Input
        value={username}
        onChange={(e, data) => setUsername(data.value)}
        contentAfter={isChecking ? <Spinner size="tiny" /> : undefined}
      />
    </Field>
  );
};
```

## Focus Management on Errors

### Focus First Error on Submit

```tsx
import { useRef, useState } from 'react';
import { Field, Input, Button, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
});

export const FocusOnError = () => {
  const styles = useStyles();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const refs = { name: nameRef, email: emailRef };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { name?: string; email?: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    
    setErrors(newErrors);
    
    // Focus first error field
    const errorFields = Object.keys(newErrors) as ('name' | 'email')[];
    if (errorFields.length > 0) {
      refs[errorFields[0]]?.current?.focus();
      return;
    }
    
    // Submit form
    console.log('Form submitted:', formData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Field
        label="Name"
        required
        validationState={errors.name ? 'error' : 'none'}
        validationMessage={errors.name}
      >
        <Input
          ref={nameRef}
          value={formData.name}
          onChange={(e, data) => setFormData(prev => ({ ...prev, name: data.value }))}
        />
      </Field>
      
      <Field
        label="Email"
        required
        validationState={errors.email ? 'error' : 'none'}
        validationMessage={errors.email}
      >
        <Input
          ref={emailRef}
          type="email"
          value={formData.email}
          onChange={(e, data) => setFormData(prev => ({ ...prev, email: data.value }))}
        />
      </Field>
      
      <Button type="submit" appearance="primary">
        Submit
      </Button>
    </form>
  );
};
```

## Related Documentation

- [01-basic-forms.md](01-basic-forms.md) - Basic form structure
- [03-form-libraries.md](03-form-libraries.md) - Integration with form libraries
- [06-submission.md](06-submission.md) - Form submission handling