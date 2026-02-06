# Registration Form Pattern

> **File**: 03-patterns/forms/04b-registration-form.md
> **FluentUI Version**: 9.x

## Overview

Complete registration form implementation with FluentUI v9, including field validation, password strength indicator, terms acceptance, and async username availability checking.

## Basic Registration Form

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
    maxWidth: '450px',
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
  nameRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: tokens.spacingHorizontalM,
  },
  footer: {
    marginTop: tokens.spacingVerticalL,
    textAlign: 'center',
  },
});

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface RegistrationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
}

export const RegistrationForm = () => {
  const styles = useStyles();
  const [formData, setFormData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: RegistrationErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Registration successful:', formData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof RegistrationData) => (
    e: any,
    data: { value?: string; checked?: boolean }
  ) => {
    const value = field === 'acceptTerms' ? data.checked : data.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={styles.container}>
      <Text as="h1" size={700} weight="semibold" className={styles.title}>
        Create Account
      </Text>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.nameRow}>
          <Field
            label="First Name"
            required
            validationState={errors.firstName ? 'error' : 'none'}
            validationMessage={errors.firstName}
          >
            <Input
              value={formData.firstName}
              onChange={handleChange('firstName')}
              disabled={isLoading}
            />
          </Field>

          <Field
            label="Last Name"
            required
            validationState={errors.lastName ? 'error' : 'none'}
            validationMessage={errors.lastName}
          >
            <Input
              value={formData.lastName}
              onChange={handleChange('lastName')}
              disabled={isLoading}
            />
          </Field>
        </div>

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
          />
        </Field>

        <Field
          label="Password"
          required
          validationState={errors.password ? 'error' : 'none'}
          validationMessage={errors.password}
          hint="At least 8 characters"
        >
          <Input
            type="password"
            value={formData.password}
            onChange={handleChange('password')}
            disabled={isLoading}
          />
        </Field>

        <Field
          label="Confirm Password"
          required
          validationState={errors.confirmPassword ? 'error' : 'none'}
          validationMessage={errors.confirmPassword}
        >
          <Input
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            disabled={isLoading}
          />
        </Field>

        <Field
          validationState={errors.acceptTerms ? 'error' : 'none'}
          validationMessage={errors.acceptTerms}
        >
          <Checkbox
            checked={formData.acceptTerms}
            onChange={handleChange('acceptTerms')}
            label={
              <span>
                I accept the <Link href="/terms">Terms</Link> and{' '}
                <Link href="/privacy">Privacy Policy</Link>
              </span>
            }
            disabled={isLoading}
          />
        </Field>

        <Button
          type="submit"
          appearance="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <Text className={styles.footer}>
        Already have an account? <Link href="/login">Sign in</Link>
      </Text>
    </div>
  );
};
```

## Password Strength Indicator

```tsx
import { useState } from 'react';
import {
  Field,
  Input,
  ProgressBar,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  CheckmarkCircleFilled,
  DismissCircleFilled,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  strengthBar: {
    marginTop: tokens.spacingVerticalXS,
  },
  requirements: {
    marginTop: tokens.spacingVerticalS,
    fontSize: tokens.fontSizeBase200,
  },
  requirement: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
  },
  valid: {
    color: tokens.colorPaletteGreenForeground1,
  },
  invalid: {
    color: tokens.colorNeutralForeground4,
  },
});

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: PasswordRequirement[] = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'Contains uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'Contains lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'Contains number', test: (p) => /\d/.test(p) },
  { label: 'Contains special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export const PasswordWithStrength = () => {
  const styles = useStyles();
  const [password, setPassword] = useState('');

  const passedRequirements = requirements.filter(req => req.test(password)).length;
  const strength = password ? passedRequirements / requirements.length : 0;

  const getStrengthColor = () => {
    if (strength < 0.4) return tokens.colorPaletteRedBackground3;
    if (strength < 0.8) return tokens.colorPaletteYellowBackground3;
    return tokens.colorPaletteGreenBackground3;
  };

  const getStrengthLabel = () => {
    if (!password) return '';
    if (strength < 0.4) return 'Weak';
    if (strength < 0.8) return 'Medium';
    return 'Strong';
  };

  return (
    <div className={styles.container}>
      <Field label="Password" required>
        <Input
          type="password"
          value={password}
          onChange={(e, data) => setPassword(data.value)}
        />
      </Field>

      {password && (
        <>
          <div className={styles.strengthBar}>
            <ProgressBar
              value={strength}
              color={strength >= 0.8 ? 'success' : strength >= 0.4 ? 'warning' : 'error'}
            />
            <Text size={200}>{getStrengthLabel()}</Text>
          </div>

          <div className={styles.requirements}>
            {requirements.map((req, index) => {
              const passed = req.test(password);
              return (
                <div
                  key={index}
                  className={`${styles.requirement} ${passed ? styles.valid : styles.invalid}`}
                >
                  {passed ? (
                    <CheckmarkCircleFilled />
                  ) : (
                    <DismissCircleFilled />
                  )}
                  <span>{req.label}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
```

## Username Availability Check

```tsx
import { useState, useEffect, useRef } from 'react';
import {
  Field,
  Input,
  Spinner,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { CheckmarkCircleFilled, DismissCircleFilled } from '@fluentui/react-icons';

const useStyles = makeStyles({
  icon: {
    display: 'flex',
    alignItems: 'center',
  },
  available: {
    color: tokens.colorPaletteGreenForeground1,
  },
  unavailable: {
    color: tokens.colorPaletteRedForeground1,
  },
});

// Simulated API check
const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const takenUsernames = ['admin', 'user', 'test', 'john', 'jane'];
  return !takenUsernames.includes(username.toLowerCase());
};

export const UsernameField = () => {
  const styles = useStyles();
  const [username, setUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!username.trim()) {
      setIsAvailable(null);
      setError(null);
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      setIsAvailable(null);
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Only letters, numbers, and underscores allowed');
      setIsAvailable(null);
      return;
    }

    setIsChecking(true);
    setError(null);

    debounceRef.current = setTimeout(async () => {
      try {
        const available = await checkUsernameAvailability(username);
        setIsAvailable(available);
        if (!available) {
          setError('Username is already taken');
        }
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
    if (error) return 'error';
    if (isAvailable === true) return 'success';
    return 'none';
  };

  const getIcon = () => {
    if (isChecking) return <Spinner size="tiny" />;
    if (isAvailable === true) {
      return <CheckmarkCircleFilled className={styles.available} />;
    }
    if (isAvailable === false) {
      return <DismissCircleFilled className={styles.unavailable} />;
    }
    return null;
  };

  return (
    <Field
      label="Username"
      required
      validationState={getValidationState()}
      validationMessage={
        error || (isAvailable ? 'Username is available!' : undefined)
      }
    >
      <Input
        value={username}
        onChange={(e, data) => setUsername(data.value)}
        contentAfter={<div className={styles.icon}>{getIcon()}</div>}
        placeholder="Choose a username"
      />
    </Field>
  );
};
```

## Registration with Optional Fields

```tsx
import { useState } from 'react';
import {
  Field,
  Input,
  Select,
  Textarea,
  Checkbox,
  Button,
  Divider,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '500px',
  },
  section: {
    marginTop: tokens.spacingVerticalM,
  },
  sectionTitle: {
    marginBottom: tokens.spacingVerticalS,
  },
});

export const ExtendedRegistrationForm = () => {
  const styles = useStyles();
  const [showOptional, setShowOptional] = useState(false);

  return (
    <form className={styles.form}>
      {/* Required fields */}
      <Field label="Full Name" required>
        <Input placeholder="John Doe" />
      </Field>

      <Field label="Email" required>
        <Input type="email" placeholder="john@example.com" />
      </Field>

      <Field label="Password" required hint="At least 8 characters">
        <Input type="password" />
      </Field>

      <Field label="Confirm Password" required>
        <Input type="password" />
      </Field>

      {/* Optional fields toggle */}
      <Checkbox
        checked={showOptional}
        onChange={(e, data) => setShowOptional(data.checked ?? false)}
        label="Add additional information (optional)"
      />

      {/* Optional fields */}
      {showOptional && (
        <div className={styles.section}>
          <Divider />
          <Text weight="semibold" className={styles.sectionTitle}>
            Additional Information
          </Text>

          <Field label="Phone Number">
            <Input type="tel" placeholder="+1 (555) 000-0000" />
          </Field>

          <Field label="Company">
            <Input placeholder="Company name" />
          </Field>

          <Field label="Job Title">
            <Select>
              <option value="">Select...</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="manager">Manager</option>
              <option value="other">Other</option>
            </Select>
          </Field>

          <Field label="Bio">
            <Textarea placeholder="Tell us about yourself" rows={3} />
          </Field>
        </div>
      )}

      <Divider />

      <Field>
        <Checkbox label="I accept the Terms of Service" required />
      </Field>

      <Field>
        <Checkbox label="Subscribe to newsletter (optional)" />
      </Field>

      <Button type="submit" appearance="primary">
        Create Account
      </Button>
    </form>
  );
};
```

## Related Documentation

- [04a-login-form.md](04a-login-form.md) - Login form
- [04c-settings-form.md](04c-settings-form.md) - Settings form
- [02-validation.md](02-validation.md) - Form validation patterns