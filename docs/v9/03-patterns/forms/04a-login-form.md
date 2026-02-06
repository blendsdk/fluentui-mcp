# Login Form Pattern

> **File**: 03-patterns/forms/04a-login-form.md
> **FluentUI Version**: 9.x

## Overview

Complete login form implementation with FluentUI v9, including email/password authentication, social logins, remember me functionality, and proper error handling.

## Basic Login Form

```tsx
import { useState } from 'react';
import {
  Field,
  Input,
  Button,
  Checkbox,
  Link,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: tokens.spacingVerticalXXL,
    maxWidth: '400px',
    margin: '0 auto',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    width: '100%',
  },
  title: {
    marginBottom: tokens.spacingVerticalL,
    textAlign: 'center',
  },
  rememberRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submitButton: {
    marginTop: tokens.spacingVerticalS,
  },
  footer: {
    marginTop: tokens.spacingVerticalL,
    textAlign: 'center',
  },
});

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export const LoginForm = () => {
  const styles = useStyles();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // On success, redirect or update app state
      console.log('Login successful:', formData);
    } catch (error) {
      setErrors({
        general: 'Invalid email or password. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof LoginFormData) => (
    e: any,
    data: { value?: string; checked?: boolean }
  ) => {
    const value = field === 'rememberMe' ? data.checked : data.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field as keyof LoginFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className={styles.container}>
      <Text as="h1" size={700} weight="semibold" className={styles.title}>
        Sign In
      </Text>

      <form className={styles.form} onSubmit={handleSubmit}>
        {errors.general && (
          <Field validationState="error" validationMessage={errors.general}>
            <div />
          </Field>
        )}

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
            disabled={isLoading}
            placeholder="you@example.com"
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
            value={formData.password}
            onChange={handleChange('password')}
            disabled={isLoading}
            placeholder="Enter your password"
          />
        </Field>

        <div className={styles.rememberRow}>
          <Checkbox
            checked={formData.rememberMe}
            onChange={handleChange('rememberMe')}
            label="Remember me"
            disabled={isLoading}
          />
          <Link href="/forgot-password">Forgot password?</Link>
        </div>

        <Button
          type="submit"
          appearance="primary"
          disabled={isLoading}
          className={styles.submitButton}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <Text className={styles.footer}>
        Don't have an account? <Link href="/register">Sign up</Link>
      </Text>
    </div>
  );
};
```

## Login with Social Providers

```tsx
import {
  Button,
  Divider,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  socialSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    width: '100%',
  },
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    margin: `${tokens.spacingVerticalL} 0`,
  },
  divider: {
    flexGrow: 1,
  },
  socialButton: {
    width: '100%',
  },
});

export const SocialLoginSection = () => {
  const styles = useStyles();

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // Redirect to OAuth provider
  };

  return (
    <>
      <div className={styles.dividerContainer}>
        <Divider className={styles.divider} />
        <span>or continue with</span>
        <Divider className={styles.divider} />
      </div>

      <div className={styles.socialSection}>
        <Button
          appearance="secondary"
          className={styles.socialButton}
          onClick={() => handleSocialLogin('Microsoft')}
        >
          Continue with Microsoft
        </Button>
        <Button
          appearance="secondary"
          className={styles.socialButton}
          onClick={() => handleSocialLogin('Google')}
        >
          Continue with Google
        </Button>
        <Button
          appearance="secondary"
          className={styles.socialButton}
          onClick={() => handleSocialLogin('GitHub')}
        >
          Continue with GitHub
        </Button>
      </div>
    </>
  );
};
```

## Password Visibility Toggle

```tsx
import { useState } from 'react';
import { Field, Input, Button } from '@fluentui/react-components';
import { EyeRegular, EyeOffRegular } from '@fluentui/react-icons';

export const PasswordInput = ({
  value,
  onChange,
  error,
  disabled,
}: {
  value: string;
  onChange: (e: any, data: { value: string }) => void;
  error?: string;
  disabled?: boolean;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Field
      label="Password"
      required
      validationState={error ? 'error' : 'none'}
      validationMessage={error}
    >
      <Input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        disabled={disabled}
        contentAfter={
          <Button
            appearance="transparent"
            icon={showPassword ? <EyeOffRegular /> : <EyeRegular />}
            onClick={() => setShowPassword(!showPassword)}
            size="small"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          />
        }
      />
    </Field>
  );
};
```

## Login with Loading State

```tsx
import { useState } from 'react';
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
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
});

export const LoginWithSpinner = () => {
  const styles = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Logged in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Field label="Email" required>
        <Input
          type="email"
          value={email}
          onChange={(e, data) => setEmail(data.value)}
          disabled={isLoading}
        />
      </Field>

      <Field label="Password" required>
        <Input
          type="password"
          value={password}
          onChange={(e, data) => setPassword(data.value)}
          disabled={isLoading}
        />
      </Field>

      <Button
        type="submit"
        appearance="primary"
        disabled={isLoading}
        icon={isLoading ? <Spinner size="tiny" /> : undefined}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
};
```

## Accessibility Considerations

1. **Focus Management**: First input should be focused on page load
2. **Error Announcements**: Use `aria-live` for error messages
3. **Password Field**: Include show/hide toggle with proper aria-label
4. **Form Labels**: All inputs must have associated labels
5. **Loading State**: Indicate loading state to screen readers

```tsx
// Focus first input on mount
import { useEffect, useRef } from 'react';

export const AccessibleLoginForm = () => {
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus email input when form mounts
    emailRef.current?.focus();
  }, []);

  return (
    <form>
      <Field label="Email" required>
        <Input ref={emailRef} type="email" />
      </Field>
      {/* ... rest of form */}
    </form>
  );
};
```

## Related Documentation

- [04b-registration-form.md](04b-registration-form.md) - Registration form
- [04c-settings-form.md](04c-settings-form.md) - Settings form
- [02-validation.md](02-validation.md) - Form validation patterns
- [06-submission.md](06-submission.md) - Form submission handling