# Multi-Step Form Patterns

> **File**: 03-patterns/forms/05-multi-step-forms.md
> **FluentUI Version**: 9.x

## Overview

Multi-step form (wizard) patterns for FluentUI v9, including step indicators, navigation, validation per step, and state management.

## Basic Multi-Step Form

```tsx
import { useState } from 'react';
import {
  Field,
  Input,
  Button,
  Text,
  ProgressBar,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { ArrowLeftRegular, ArrowRightRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: tokens.spacingVerticalL,
  },
  header: {
    marginBottom: tokens.spacingVerticalL,
  },
  progress: {
    marginBottom: tokens.spacingVerticalM,
  },
  stepContent: {
    marginBottom: tokens.spacingVerticalL,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: tokens.spacingVerticalL,
  },
});

interface FormData {
  // Step 1: Personal
  firstName: string;
  lastName: string;
  email: string;
  // Step 2: Address
  street: string;
  city: string;
  postalCode: string;
  // Step 3: Account
  username: string;
  password: string;
}

const initialData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  street: '',
  city: '',
  postalCode: '',
  username: '',
  password: '',
};

const TOTAL_STEPS = 3;

export const BasicWizardForm = () => {
  const styles = useStyles();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialData);

  const handleChange = (field: keyof FormData) => (
    e: any,
    data: { value: string }
  ) => {
    setFormData(prev => ({ ...prev, [field]: data.value }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Personal Information';
      case 2: return 'Address';
      case 3: return 'Account Setup';
      default: return '';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={styles.form}>
            <Field label="First Name" required>
              <Input
                value={formData.firstName}
                onChange={handleChange('firstName')}
              />
            </Field>
            <Field label="Last Name" required>
              <Input
                value={formData.lastName}
                onChange={handleChange('lastName')}
              />
            </Field>
            <Field label="Email" required>
              <Input
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
              />
            </Field>
          </div>
        );
      case 2:
        return (
          <div className={styles.form}>
            <Field label="Street Address" required>
              <Input
                value={formData.street}
                onChange={handleChange('street')}
              />
            </Field>
            <Field label="City" required>
              <Input
                value={formData.city}
                onChange={handleChange('city')}
              />
            </Field>
            <Field label="Postal Code" required>
              <Input
                value={formData.postalCode}
                onChange={handleChange('postalCode')}
              />
            </Field>
          </div>
        );
      case 3:
        return (
          <div className={styles.form}>
            <Field label="Username" required>
              <Input
                value={formData.username}
                onChange={handleChange('username')}
              />
            </Field>
            <Field label="Password" required>
              <Input
                type="password"
                value={formData.password}
                onChange={handleChange('password')}
              />
            </Field>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text as="h2" size={600} weight="semibold">
          {getStepTitle()}
        </Text>
        <Text size={200}>
          Step {currentStep} of {TOTAL_STEPS}
        </Text>
      </div>

      <div className={styles.progress}>
        <ProgressBar value={currentStep / TOTAL_STEPS} />
      </div>

      <div className={styles.stepContent}>
        {renderStepContent()}
      </div>

      <div className={styles.actions}>
        <Button
          appearance="secondary"
          icon={<ArrowLeftRegular />}
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          Back
        </Button>
        
        {currentStep < TOTAL_STEPS ? (
          <Button
            appearance="primary"
            icon={<ArrowRightRegular />}
            iconPosition="after"
            onClick={handleNext}
          >
            Next
          </Button>
        ) : (
          <Button appearance="primary" onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};
```

## Step Indicator Component

```tsx
import {
  Text,
  makeStyles,
  tokens,
  mergeClasses,
} from '@fluentui/react-components';
import { CheckmarkFilled } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: tokens.spacingVerticalL,
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  stepCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `2px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground1,
    marginBottom: tokens.spacingVerticalXS,
  },
  activeCircle: {
    borderColor: tokens.colorBrandBackground,
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  completedCircle: {
    borderColor: tokens.colorPaletteGreenBackground3,
    backgroundColor: tokens.colorPaletteGreenBackground3,
    color: 'white',
  },
  stepLabel: {
    textAlign: 'center',
  },
  activeLabel: {
    fontWeight: tokens.fontWeightSemibold,
  },
  connector: {
    position: 'absolute',
    top: '16px',
    left: '50%',
    width: '100%',
    height: '2px',
    backgroundColor: tokens.colorNeutralStroke1,
  },
  completedConnector: {
    backgroundColor: tokens.colorPaletteGreenBackground3,
  },
});

interface Step {
  id: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;

        return (
          <div key={step.id} className={styles.step}>
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={mergeClasses(
                  styles.connector,
                  isCompleted && styles.completedConnector
                )}
              />
            )}

            {/* Step circle */}
            <div
              className={mergeClasses(
                styles.stepCircle,
                isActive && styles.activeCircle,
                isCompleted && styles.completedCircle
              )}
            >
              {isCompleted ? (
                <CheckmarkFilled />
              ) : (
                <Text>{step.id}</Text>
              )}
            </div>

            {/* Step label */}
            <Text
              size={200}
              className={mergeClasses(
                styles.stepLabel,
                isActive && styles.activeLabel
              )}
            >
              {step.label}
            </Text>
          </div>
        );
      })}
    </div>
  );
};

// Usage
const steps = [
  { id: 1, label: 'Personal' },
  { id: 2, label: 'Address' },
  { id: 3, label: 'Account' },
  { id: 4, label: 'Review' },
];

<StepIndicator steps={steps} currentStep={2} />
```

## Wizard with Per-Step Validation

```tsx
import { useState } from 'react';
import {
  Field,
  Input,
  Button,
  Text,
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
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: tokens.spacingVerticalL,
  },
});

interface StepData {
  [key: string]: string;
}

interface StepErrors {
  [key: string]: string | undefined;
}

type ValidatorFn = (data: StepData) => StepErrors;

const step1Validator: ValidatorFn = (data) => {
  const errors: StepErrors = {};
  if (!data.firstName?.trim()) errors.firstName = 'First name is required';
  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format';
  }
  return errors;
};

const step2Validator: ValidatorFn = (data) => {
  const errors: StepErrors = {};
  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  return errors;
};

export const WizardWithValidation = () => {
  const styles = useStyles();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<StepData>({});
  const [errors, setErrors] = useState<StepErrors>({});

  const validators: { [step: number]: ValidatorFn } = {
    1: step1Validator,
    2: step2Validator,
  };

  const validateStep = (): boolean => {
    const validator = validators[step];
    if (!validator) return true;

    const stepErrors = validator(data);
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setErrors({});
      setStep(prev => prev + 1);
    }
  };

  const handleChange = (field: string) => (e: any, d: { value: string }) => {
    setData(prev => ({ ...prev, [field]: d.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div>
      <Text as="h2" size={600}>Step {step} of 2</Text>

      {step === 1 && (
        <div className={styles.form}>
          <Field
            label="First Name"
            required
            validationState={errors.firstName ? 'error' : 'none'}
            validationMessage={errors.firstName}
          >
            <Input value={data.firstName || ''} onChange={handleChange('firstName')} />
          </Field>
          <Field
            label="Email"
            required
            validationState={errors.email ? 'error' : 'none'}
            validationMessage={errors.email}
          >
            <Input type="email" value={data.email || ''} onChange={handleChange('email')} />
          </Field>
        </div>
      )}

      {step === 2 && (
        <div className={styles.form}>
          <Field
            label="Password"
            required
            validationState={errors.password ? 'error' : 'none'}
            validationMessage={errors.password}
          >
            <Input type="password" value={data.password || ''} onChange={handleChange('password')} />
          </Field>
          <Field
            label="Confirm Password"
            required
            validationState={errors.confirmPassword ? 'error' : 'none'}
            validationMessage={errors.confirmPassword}
          >
            <Input type="password" value={data.confirmPassword || ''} onChange={handleChange('confirmPassword')} />
          </Field>
        </div>
      )}

      <div className={styles.actions}>
        <Button
          appearance="secondary"
          onClick={() => setStep(prev => prev - 1)}
          disabled={step === 1}
        >
          Back
        </Button>
        {step < 2 ? (
          <Button appearance="primary" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button appearance="primary" onClick={() => console.log('Submit:', data)}>
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};
```

## Review Step with Edit Links

```tsx
import {
  Text,
  Button,
  Card,
  CardHeader,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { EditRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '500px',
  },
  section: {
    padding: tokens.spacingVerticalM,
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacingVerticalS,
  },
  field: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${tokens.spacingVerticalXS} 0`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  label: {
    color: tokens.colorNeutralForeground3,
  },
});

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  postalCode: string;
}

interface ReviewStepProps {
  data: FormData;
  onEditStep: (step: number) => void;
  onSubmit: () => void;
}

export const ReviewStep = ({ data, onEditStep, onSubmit }: ReviewStepProps) => {
  const styles = useStyles();

  const sections = [
    {
      title: 'Personal Information',
      step: 1,
      fields: [
        { label: 'First Name', value: data.firstName },
        { label: 'Last Name', value: data.lastName },
        { label: 'Email', value: data.email },
      ],
    },
    {
      title: 'Address',
      step: 2,
      fields: [
        { label: 'Street', value: data.street },
        { label: 'City', value: data.city },
        { label: 'Postal Code', value: data.postalCode },
      ],
    },
  ];

  return (
    <div className={styles.container}>
      <Text as="h2" size={600} weight="semibold">
        Review Your Information
      </Text>

      {sections.map(section => (
        <Card key={section.step} className={styles.section}>
          <div className={styles.sectionHeader}>
            <Text weight="semibold">{section.title}</Text>
            <Button
              appearance="subtle"
              icon={<EditRegular />}
              onClick={() => onEditStep(section.step)}
            >
              Edit
            </Button>
          </div>

          {section.fields.map(field => (
            <div key={field.label} className={styles.field}>
              <Text className={styles.label}>{field.label}</Text>
              <Text>{field.value || '—'}</Text>
            </div>
          ))}
        </Card>
      ))}

      <Button appearance="primary" onClick={onSubmit}>
        Confirm & Submit
      </Button>
    </div>
  );
};
```

## useWizard Hook

```tsx
import { useState, useCallback } from 'react';

interface UseWizardOptions<T> {
  initialData: T;
  totalSteps: number;
  validators?: { [step: number]: (data: T) => Record<string, string | undefined> };
  onComplete?: (data: T) => void;
}

interface UseWizardReturn<T> {
  currentStep: number;
  data: T;
  errors: Record<string, string | undefined>;
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number;
  setData: (field: keyof T, value: any) => void;
  goToStep: (step: number) => void;
  nextStep: () => boolean;
  prevStep: () => void;
  reset: () => void;
  submit: () => void;
}

export function useWizard<T extends Record<string, any>>({
  initialData,
  totalSteps,
  validators = {},
  onComplete,
}: UseWizardOptions<T>): UseWizardReturn<T> {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setDataState] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const setData = useCallback((field: keyof T, value: any) => {
    setDataState(prev => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const validateCurrentStep = useCallback((): boolean => {
    const validator = validators[currentStep];
    if (!validator) return true;

    const stepErrors = validator(data);
    const hasErrors = Object.values(stepErrors).some(Boolean);
    setErrors(stepErrors);
    return !hasErrors;
  }, [currentStep, data, validators]);

  const nextStep = useCallback((): boolean => {
    if (validateCurrentStep()) {
      setErrors({});
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      return true;
    }
    return false;
  }, [validateCurrentStep, totalSteps]);

  const prevStep = useCallback(() => {
    setErrors({});
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setErrors({});
      setCurrentStep(step);
    }
  }, [totalSteps]);

  const reset = useCallback(() => {
    setCurrentStep(1);
    setDataState(initialData);
    setErrors({});
  }, [initialData]);

  const submit = useCallback(() => {
    if (validateCurrentStep()) {
      onComplete?.(data);
    }
  }, [validateCurrentStep, data, onComplete]);

  return {
    currentStep,
    data,
    errors,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
    progress: currentStep / totalSteps,
    setData,
    goToStep,
    nextStep,
    prevStep,
    reset,
    submit,
  };
}

// Usage Example
export const WizardWithHook = () => {
  const wizard = useWizard({
    initialData: { name: '', email: '', password: '' },
    totalSteps: 3,
    validators: {
      1: (data) => ({
        name: !data.name ? 'Name is required' : undefined,
      }),
      2: (data) => ({
        email: !data.email ? 'Email is required' : undefined,
      }),
    },
    onComplete: (data) => console.log('Complete:', data),
  });

  return (
    <div>
      <ProgressBar value={wizard.progress} />
      
      {wizard.currentStep === 1 && (
        <Field
          label="Name"
          validationState={wizard.errors.name ? 'error' : 'none'}
          validationMessage={wizard.errors.name}
        >
          <Input
            value={wizard.data.name}
            onChange={(e, d) => wizard.setData('name', d.value)}
          />
        </Field>
      )}
      
      <Button onClick={wizard.prevStep} disabled={wizard.isFirstStep}>
        Back
      </Button>
      
      {wizard.isLastStep ? (
        <Button onClick={wizard.submit}>Submit</Button>
      ) : (
        <Button onClick={wizard.nextStep}>Next</Button>
      )}
    </div>
  );
};
```

## Related Documentation

- [01-basic-forms.md](01-basic-forms.md) - Basic form structure
- [02-validation.md](02-validation.md) - Form validation patterns
- [06-submission.md](06-submission.md) - Form submission handling