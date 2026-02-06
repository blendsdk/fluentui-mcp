# Form Patterns

> **Module**: 03-patterns/forms
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-04-02

## Overview

Form patterns documentation for building robust, accessible, and user-friendly forms with FluentUI v9. This module covers validation, submission handling, accessibility, and integration with popular form libraries.

## Documentation Index

| File | Description |
|------|-------------|
| [01-basic-forms.md](01-basic-forms.md) | Basic form structure using Field component |
| [02-validation.md](02-validation.md) | Client-side validation patterns |
| [03-form-libraries.md](03-form-libraries.md) | Integration with React Hook Form, Formik |
| [04a-login-form.md](04a-login-form.md) | Login form patterns with social auth |
| [04b-registration-form.md](04b-registration-form.md) | Registration with password strength |
| [04c-settings-form.md](04c-settings-form.md) | Profile and notification settings |
| [05-multi-step-forms.md](05-multi-step-forms.md) | Wizard/multi-step form patterns |
| [06-submission.md](06-submission.md) | Loading states, success/error handling |

## Quick Reference

### Essential Imports

```tsx
import {
  Field,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
  Slider,
  SpinButton,
  Combobox,
  Button,
} from '@fluentui/react-components';
```

### Basic Form Pattern

```tsx
import { Field, Input, Button, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const BasicForm = () => {
  const styles = useStyles();
  
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Field label="Email" required>
        <Input type="email" name="email" />
      </Field>
      <Field label="Password" required>
        <Input type="password" name="password" />
      </Field>
      <Button type="submit" appearance="primary">
        Submit
      </Button>
    </form>
  );
};
```

## Key Concepts

### Field Component

The `Field` component is the foundation of FluentUI v9 forms. It provides:

- **Label association**: Automatically connects labels to form controls
- **Validation states**: `validationState` prop for error/success/warning
- **Messages**: `validationMessage` and `hint` props for user guidance
- **Accessibility**: Proper ARIA attributes automatically applied

### Validation States

```tsx
// Valid state
<Field validationState="success" validationMessage="Email is valid">
  <Input value={email} />
</Field>

// Invalid state
<Field validationState="error" validationMessage="Email is required">
  <Input value={email} />
</Field>

// Warning state
<Field validationState="warning" validationMessage="Consider a stronger password">
  <Input value={password} type="password" />
</Field>
```

### Controlled vs Uncontrolled

FluentUI v9 supports both patterns:

```tsx
// Controlled - you manage state
const [value, setValue] = useState('');
<Input value={value} onChange={(e, data) => setValue(data.value)} />

// Uncontrolled - DOM manages state
<Input defaultValue="initial" />
```

## Best Practices

1. **Always use Field** - Wrap form controls in Field for proper labeling and validation
2. **Validate on blur** - Show validation errors after user leaves field
3. **Provide clear messages** - Use `validationMessage` with actionable guidance
4. **Handle loading states** - Disable form during submission
5. **Focus management** - Move focus to first error on validation failure
6. **Progressive disclosure** - Show only relevant fields based on context

## Related Documentation

- [Field Component](../../02-components/forms/field.md)
- [Input Component](../../02-components/forms/input.md)
- [Button Component](../../02-components/buttons/button.md)
- [Toast for notifications](../../02-components/feedback/toast.md)