# Form Dialog Patterns - FluentUI v9

> **Topic**: Form Dialogs
> **Components**: `Dialog`, `Field`, `Input`, `Button`, form elements
> **Package**: `@fluentui/react-components`

## Overview

Form dialogs collect user input in a focused modal context. They're ideal for creating/editing items, quick settings changes, or collecting small amounts of data without navigating away from the current page.

## Basic Imports

```typescript
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogActions,
  Button,
  Field,
  Input,
  Textarea,
  Select,
  Checkbox,
  makeStyles,
  tokens,
  Spinner,
} from '@fluentui/react-components';
import { DismissRegular } from '@fluentui/react-icons';
```

## Basic Form Dialog

```tsx
const useFormDialogStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
});

interface CreateItemDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => void;
  isLoading?: boolean;
}

function CreateItemDialog({ open, onClose, onSubmit, isLoading }: CreateItemDialogProps) {
  const styles = useFormDialogStyles();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description });
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setName('');
      setDescription('');
    }
  }, [open]);

  const isValid = name.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && !isLoading && onClose()}>
      <DialogSurface>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <DialogTitle
              action={
                <Button
                  appearance="subtle"
                  icon={<DismissRegular />}
                  onClick={onClose}
                  disabled={isLoading}
                />
              }
            >
              Create New Item
            </DialogTitle>
            <DialogContent className={styles.form}>
              <Field label="Name" required>
                <Input
                  value={name}
                  onChange={(_, data) => setName(data.value)}
                  disabled={isLoading}
                  autoFocus
                />
              </Field>
              <Field label="Description">
                <Textarea
                  value={description}
                  onChange={(_, data) => setDescription(data.value)}
                  disabled={isLoading}
                  rows={3}
                />
              </Field>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button appearance="primary" type="submit" disabled={!isValid || isLoading}>
                {isLoading ? <Spinner size="tiny" /> : 'Create'}
              </Button>
            </DialogActions>
          </DialogBody>
        </form>
      </DialogSurface>
    </Dialog>
  );
}
```

## Edit Form Dialog

Pre-populated form for editing existing data:

```tsx
interface EditItemDialogProps<T> {
  open: boolean;
  item: T | null;
  onClose: () => void;
  onSubmit: (data: T) => void;
  isLoading?: boolean;
}

interface Item {
  id: number;
  name: string;
  description: string;
  category: string;
}

function EditItemDialog({
  open,
  item,
  onClose,
  onSubmit,
  isLoading,
}: EditItemDialogProps<Item>) {
  const styles = useFormDialogStyles();
  const [formData, setFormData] = useState<Partial<Item>>({});

  // Initialize form when item changes
  useEffect(() => {
    if (item) {
      setFormData(item);
    }
  }, [item]);

  const handleChange = (field: keyof Item, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item && formData.name) {
      onSubmit({ ...item, ...formData } as Item);
    }
  };

  const hasChanges = item && (
    formData.name !== item.name ||
    formData.description !== item.description ||
    formData.category !== item.category
  );

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && !isLoading && onClose()}>
      <DialogSurface>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogContent className={styles.form}>
              <Field label="Name" required>
                <Input
                  value={formData.name || ''}
                  onChange={(_, data) => handleChange('name', data.value)}
                  disabled={isLoading}
                />
              </Field>
              <Field label="Description">
                <Textarea
                  value={formData.description || ''}
                  onChange={(_, data) => handleChange('description', data.value)}
                  disabled={isLoading}
                />
              </Field>
              <Field label="Category">
                <Select
                  value={formData.category || ''}
                  onChange={(_, data) => handleChange('category', data.value)}
                  disabled={isLoading}
                >
                  <option value="">Select category</option>
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                  <option value="other">Other</option>
                </Select>
              </Field>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                appearance="primary"
                type="submit"
                disabled={!hasChanges || isLoading}
              >
                {isLoading ? <Spinner size="tiny" /> : 'Save Changes'}
              </Button>
            </DialogActions>
          </DialogBody>
        </form>
      </DialogSurface>
    </Dialog>
  );
}
```

## Form Dialog with Validation

```tsx
import { MessageBar, MessageBarBody } from '@fluentui/react-components';

interface FormErrors {
  [key: string]: string | undefined;
}

function ValidatedFormDialog({ open, onClose, onSubmit }: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}) {
  const styles = useFormDialogStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsLoading(true);
    try {
      await onSubmit({ email, password });
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && !isLoading && onClose()}>
      <DialogSurface>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <DialogTitle>Create Account</DialogTitle>
            <DialogContent className={styles.form}>
              {submitError && (
                <MessageBar intent="error">
                  <MessageBarBody>{submitError}</MessageBarBody>
                </MessageBar>
              )}
              <Field
                label="Email"
                required
                validationState={errors.email ? 'error' : undefined}
                validationMessage={errors.email}
              >
                <Input
                  type="email"
                  value={email}
                  onChange={(_, data) => {
                    setEmail(data.value);
                    if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
                  }}
                  disabled={isLoading}
                />
              </Field>
              <Field
                label="Password"
                required
                validationState={errors.password ? 'error' : undefined}
                validationMessage={errors.password}
              >
                <Input
                  type="password"
                  value={password}
                  onChange={(_, data) => {
                    setPassword(data.value);
                    if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
                  }}
                  disabled={isLoading}
                />
              </Field>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button appearance="primary" type="submit" disabled={isLoading}>
                {isLoading ? <Spinner size="tiny" /> : 'Create'}
              </Button>
            </DialogActions>
          </DialogBody>
        </form>
      </DialogSurface>
    </Dialog>
  );
}
```

## Multi-Step Form Dialog

```tsx
const useMultiStepStyles = makeStyles({
  steps: {
    display: 'flex',
    justifyContent: 'center',
    gap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalL,
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    color: tokens.colorNeutralForeground3,
  },
  stepActive: {
    color: tokens.colorBrandForeground1,
  },
  stepComplete: {
    color: tokens.colorPaletteGreenForeground1,
  },
  stepNumber: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `2px solid currentColor`,
    fontSize: tokens.fontSizeBase200,
  },
});

function MultiStepFormDialog({ open, onClose, onSubmit }: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}) {
  const styles = useMultiStepStyles();
  const formStyles = useFormDialogStyles();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ name: '', email: '', company: '', role: '' });
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 3;

  const handleNext = () => setStep((s) => Math.min(s + 1, totalSteps));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Field label="Full Name" required>
              <Input
                value={data.name}
                onChange={(_, d) => setData((p) => ({ ...p, name: d.value }))}
              />
            </Field>
            <Field label="Email" required>
              <Input
                type="email"
                value={data.email}
                onChange={(_, d) => setData((p) => ({ ...p, email: d.value }))}
              />
            </Field>
          </>
        );
      case 2:
        return (
          <>
            <Field label="Company">
              <Input
                value={data.company}
                onChange={(_, d) => setData((p) => ({ ...p, company: d.value }))}
              />
            </Field>
            <Field label="Role">
              <Input
                value={data.role}
                onChange={(_, d) => setData((p) => ({ ...p, role: d.value }))}
              />
            </Field>
          </>
        );
      case 3:
        return (
          <div>
            <h4>Review your information:</h4>
            <p><strong>Name:</strong> {data.name}</p>
            <p><strong>Email:</strong> {data.email}</p>
            <p><strong>Company:</strong> {data.company || 'N/A'}</p>
            <p><strong>Role:</strong> {data.role || 'N/A'}</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(_, d) => !d.open && !isLoading && onClose()}>
      <DialogSurface style={{ maxWidth: '500px' }}>
        <DialogBody>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogContent className={formStyles.form}>
            {/* Step indicators */}
            <div className={styles.steps}>
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`${styles.step} ${
                    s === step ? styles.stepActive : s < step ? styles.stepComplete : ''
                  }`}
                >
                  <span className={styles.stepNumber}>{s}</span>
                  <span>{s === 1 ? 'Personal' : s === 2 ? 'Work' : 'Review'}</span>
                </div>
              ))}
            </div>
            {renderStep()}
          </DialogContent>
          <DialogActions>
            {step > 1 && (
              <Button appearance="secondary" onClick={handleBack} disabled={isLoading}>
                Back
              </Button>
            )}
            <Button appearance="secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            {step < totalSteps ? (
              <Button appearance="primary" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button appearance="primary" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? <Spinner size="tiny" /> : 'Submit'}
              </Button>
            )}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
```

## useFormDialog Hook

```typescript
interface UseFormDialogOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  validate?: (values: T) => FormErrors;
}

interface UseFormDialogReturn<T> {
  isOpen: boolean;
  open: (initialData?: Partial<T>) => void;
  close: () => void;
  values: T;
  errors: FormErrors;
  isLoading: boolean;
  submitError: string | null;
  handleChange: <K extends keyof T>(field: K, value: T[K]) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  dialogProps: { open: boolean; onOpenChange: (e: unknown, data: { open: boolean }) => void };
}

export function useFormDialog<T extends Record<string, any>>(
  options: UseFormDialogOptions<T>
): UseFormDialogReturn<T> {
  const { initialValues, onSubmit, validate } = options;
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const open = useCallback((initialData?: Partial<T>) => {
    setValues({ ...initialValues, ...initialData });
    setErrors({});
    setSubmitError(null);
    setIsOpen(true);
  }, [initialValues]);

  const close = useCallback(() => {
    if (!isLoading) setIsOpen(false);
  }, [isLoading]);

  const handleChange = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (validate) {
      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }

    setIsLoading(true);
    try {
      await onSubmit(values);
      setIsOpen(false);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit');
    } finally {
      setIsLoading(false);
    }
  }, [values, validate, onSubmit]);

  const dialogProps = useMemo(() => ({
    open: isOpen,
    onOpenChange: (_: unknown, data: { open: boolean }) => {
      if (!data.open) close();
    },
  }), [isOpen, close]);

  return {
    isOpen,
    open,
    close,
    values,
    errors,
    isLoading,
    submitError,
    handleChange,
    handleSubmit,
    dialogProps,
  };
}
```

## Accessibility Checklist

- [x] Form has proper labels for all inputs
- [x] Required fields are indicated
- [x] Error messages are associated with fields
- [x] Focus moves to first input on open
- [x] Submit with Enter key works
- [x] Loading state disables interactions

## Best Practices

1. **Keep Forms Short**: 3-5 fields max in dialogs
2. **Auto-Focus First Field**: Improve keyboard flow
3. **Validate on Submit**: Show errors after attempt
4. **Preserve Data on Error**: Don't clear on failure
5. **Prevent Accidental Close**: Warn about unsaved changes
6. **Disable During Submit**: Prevent double-submission
7. **Clear Form on Success**: Reset when dialog closes

## Related Documentation

- [01-dialog-patterns.md](01-dialog-patterns.md) - Basic dialogs
- [02-confirmation-dialogs.md](02-confirmation-dialogs.md) - Confirmations
- [Form Patterns](../forms/) - Comprehensive form patterns